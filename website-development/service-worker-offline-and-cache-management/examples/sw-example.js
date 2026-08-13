/**
 * sw-example.js
 * Example Service Worker demonstrating Pre-caching, Stale-While-Revalidate,
 * Network-First Document Routing, and skipWaiting Messaging.
 */

const CACHE_NAME = 'demo-pwa-cache-v1';

// Assets that must be fetched and cached immediately upon Service Worker installation
const PRECACHE_ASSETS = [
  '/',
  '/offline-pwa-app-example.html',
  '/favicon.ico'
];

// Fallback HTML page to display when offline and requesting a non-cached route
const OFFLINE_FALLBACK_URL = '/offline-pwa-app-example.html'; // In this example we fall back to the main page or shell

// 1. Install Event: Populate Cache Storage with critical App Shell
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event triggered.');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core app shell...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Pre-caching completed.');
        // Bypass the standard "waiting" status and proceed directly to active state if possible
        return self.skipWaiting();
      })
  );
});

// 2. Activate Event: Perform cache maintenance, purge obsolete versions
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event triggered.');

  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log(`[Service Worker] Deleting outdated cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming control of all open pages...');
      // Claim control of all active clients immediately without requiring a browser refresh
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Intercept out-going network requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip tracking non-GET requests (e.g. POST form submits, API edits)
  if (request.method !== 'GET') return;

  // Skip tracking external third-party requests (e.g. CDN downloads, Google Analytics)
  if (url.origin !== self.location.origin) return;

  // Strategy A: Network-First with Offline Fallback for Document Navigate requests (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If response is clean, dynamically update cache
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[Service Worker] Network request failed. Checking Cache...');
          // Check cache for this specific route
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              console.log('[Service Worker] Cache miss. Redirecting to offline fallback document...');
              // Return pre-cached fallback HTML
              return caches.match(OFFLINE_FALLBACK_URL);
            });
        })
    );
    return;
  }

  // Strategy B: Stale-While-Revalidate for local Static Assets (Stylesheets, JS Bundles, Fonts, Images)
  const isStaticAsset = (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  );

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Trigger background fetch to update cache for next visit
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
            }
            return networkResponse;
          })
          .catch(() => {
            // Background network fail is handled silently since cachedResponse exists
            return null;
          });

        // Serve cached variant instantly if available, otherwise wait for background fetch
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy C: Network-Only for dynamic data requests (e.g. JSON APIs)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return a customized JSON offline fallback structure
        return new Response(
          JSON.stringify({
            error: 'NetworkUnavailable',
            message: 'You are currently offline. This action cannot be completed.',
            offline: true
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
  }
});

// 4. Message Event: Listens for direct SKIP_WAITING signal from Client UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] SKIP_WAITING signal received. Overriding active lifecycle.');
    self.skipWaiting();
  }
});
