/**
 * Production-Grade Service Worker Example
 * This script handles pre-caching, dynamic caching, multiple strategy routing,
 * and secure worker takeover via postMessage signaling.
 */

const PRECACHE_VERSION = 'v1';
const PRECACHE_NAME = `precache-${PRECACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = 'dynamic-runtime-cache';

// Assets to cache immediately on worker installation
const PRECACHE_URLS = [
  './offline-pwa-app-example.html',
  './offline.html' // Standard offline fallback template
];

// 1. Installation Phase: Pre-cache core shells
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Warm-starting cache:', PRECACHE_NAME);
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] All critical assets cached successfully.');
      })
  );
});

// 2. Activation Phase: Clean old obsolete caches
self.addEventListener('activate', (event) => {
  const activeCaches = [PRECACHE_NAME, DYNAMIC_CACHE_NAME];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!activeCaches.includes(cacheName)) {
              console.log('[Service Worker] Evicting legacy cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated and claiming clients.');
        return self.clients.claim();
      })
  );
});

// 3. Fetch Phase: Intercept client HTTP network requests
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Strategy A: Page navigation requests -> Network-First (Offline HTML fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Put page in dynamic cache if successful
          return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If offline, check dynamic cache first, fallback to pre-cached offline.html
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('./offline.html');
            });
        })
    );
    return;
  }

  // Strategy B: Static assets (scripts, styles, fonts) -> Cache-First with Network fetch fallback
  const isStaticAsset = (
    requestUrl.pathname.endsWith('.css') ||
    requestUrl.pathname.endsWith('.js') ||
    requestUrl.pathname.includes('/fonts/')
  );

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
    );
    return;
  }

  // Strategy C: Other resources (images, API) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Silence network fetch failure logs when offline
          });

        return cachedResponse || networkFetch;
      })
  );
});

// 4. Message Interface: Listen for skipWaiting notifications from UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    console.log('[Service Worker] skipWaiting commanded. Forcing takeover...');
    self.skipWaiting();
  }
});
