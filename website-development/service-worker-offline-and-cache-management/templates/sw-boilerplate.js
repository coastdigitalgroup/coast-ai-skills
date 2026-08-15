/**
 * Custom Service Worker Template (sw-boilerplate.js)
 * Clean, production-ready, and highly extensible caching proxy shell.
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = 'dynamic-runtime-cache';
const OFFLINE_FALLBACK_URL = '/offline.html';

// 1. Array of core static URLs to pre-cache on install
const CORE_PRECACHE_URLS = [
  '/',
  '/index.html',
  OFFLINE_FALLBACK_URL,
  '/css/main.css',
  '/js/main.js'
];

/**
 * Installation Event: Pre-caches critical web assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Warm-loading static pre-caches...');
        // Failure of any URL in this array will abort installation
        return cache.addAll(CORE_PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // Forces activation immediately
  );
});

/**
 * Activation Event: Performs clean static cache evictions
 */
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, DYNAMIC_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheKeys) => {
        return Promise.all(
          cacheKeys.map((key) => {
            if (!allowedCaches.includes(key)) {
              console.log('[SW] Evicting legacy cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Claims active client control instantly
  );
});

/**
 * Intercept Fetch Requests: Determines routing strategies
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy A: HTML navigation requests -> Network-First (with offline.html fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event.request, DYNAMIC_CACHE, OFFLINE_FALLBACK_URL));
    return;
  }

  // Strategy B: Hashed scripts, stylesheets, and local web fonts -> Cache-First
  const isCacheFirstAsset = (
    url.pathname.match(/\.(css|js|woff2|woff|ttf|png|svg|jpg|jpeg|webp)$/) &&
    url.origin === self.location.origin
  );

  if (isCacheFirstAsset) {
    event.respondWith(cacheFirstStrategy(event.request, DYNAMIC_CACHE));
    return;
  }

  // Strategy C: Standard/API data requests -> Stale-While-Revalidate
  const isStaleWhileRevalidateAsset = (
    url.origin === self.location.origin &&
    (url.pathname.includes('/api/v') || url.pathname.includes('/content/'))
  );

  if (isStaleWhileRevalidateAsset) {
    event.respondWith(staleWhileRevalidateStrategy(event.request, DYNAMIC_CACHE));
    return;
  }
});

/**
 * Strategy: Network-First
 * Fetches from network first. If offline, serves from cache. If not in cache, falls back to offline page.
 */
function networkFirstStrategy(request, cacheName, fallbackUrl) {
  return fetch(request)
    .then((response) => {
      // Keep dynamic cache updated with successful basic responses
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    })
    .catch(() => {
      // Retrieve from cache or use the offline fallback
      return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (fallbackUrl) return caches.match(fallbackUrl);
      });
    });
}

/**
 * Strategy: Cache-First
 * Serves from cache immediately. On cache miss, fetches from network and updates cache.
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request)
    .then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    });
}

/**
 * Strategy: Stale-While-Revalidate
 * Serves cached content immediately, while triggering a background fetch to update the cache.
 */
function staleWhileRevalidateStrategy(request, cacheName) {
  return caches.match(request)
    .then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(cacheName).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Suppress errors during offline network checks
        });

      return cachedResponse || fetchPromise;
    });
}

/**
 * Message Event: Listens for skipsWaiting signals
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING received. Taking control...');
    self.skipWaiting();
  }
});
