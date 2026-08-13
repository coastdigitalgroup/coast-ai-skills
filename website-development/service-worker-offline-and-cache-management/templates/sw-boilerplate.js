/**
 * Service Worker Boilerplate (Vanilla JS)
 * A clean, modular, production-ready Service Worker file.
 * Customize the configuration block below for your specific project.
 */

// === CONFIGURATION BLOCK ===
const CACHE_VERSION = 'v1';
const CACHE_PREFIX = 'site-cache';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

// Assets to precache immediately on Service Worker installation (App Shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico'
];

// Offline fallback document route
const OFFLINE_FALLBACK_URL = '/offline.html';

// Match patterns for Network-Only routes (e.g. dynamic endpoints, payment routes)
const NETWORK_ONLY_PATHS = [
  '/api/v1/checkout',
  '/api/v1/auth',
  '/admin'
];
// ============================

/**
 * Installation Event
 * Opens Cache Storage, logs precache assets, and forces immediate wait bypass.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW Boilerplate] Pre-caching failed on install:', error);
      })
  );
});

/**
 * Activation Event
 * Purges obsolete Cache Storage buckets on current domain.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that match prefix but are not the current version
            if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW Boilerplate] Activation failed:', error);
      })
  );
});

/**
 * Helper to determine if a request path should bypass caching entirely
 */
function isNetworkOnly(urlPath) {
  return NETWORK_ONLY_PATHS.some((path) => urlPath.startsWith(path));
}

/**
 * Fetch Event Interception
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 2. Network-Only routes (strictly bypass cache)
  if (isNetworkOnly(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // 3. Navigation (HTML document) Requests: Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              return caches.match(OFFLINE_FALLBACK_URL);
            });
        })
    );
    return;
  }

  // 4. Static Assets: Stale-While-Revalidate
  const isStatic = (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  );

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
            }
            return networkResponse;
          })
          .catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

/**
 * Message Listener
 * Triggered by Client-side updates requesting skipWaiting.
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
