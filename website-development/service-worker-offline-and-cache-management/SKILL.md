---
name: service-worker-offline-and-cache-management
description:
  Implement, configure, and debug Service Workers for offline fallback, resource caching
  strategies (Cache-First, Network-First, Stale-While-Revalidate), and safe background
  update lifecycles without user lock-in.
---

# Service Worker Offline and Cache Management

## Purpose

The Service Worker Offline and Cache Management skill provides a production-grade, framework-agnostic frontend protocol for implementing, debugging, and maintaining Service Workers. Service Workers act as fully programmable, client-side network proxies. They sit between the web browser and the network, intercepting outgoing HTTP requests to serve resources directly from local caches (even when offline), pre-caching critical assets during idle time, and orchestrating smooth version updates.

Implementing a service worker correctly reduces web application server load, guarantees absolute resilient offline fallbacks, improves speed indices, and eliminates white-screen crashes on intermittent or nonexistent mobile networks.

## Use Cases

- **Offline-First Web Applications:** Building web portals, dashboards, or documentation sites that remain fully readable and interactive without active internet connections.
- **Offline Fallback Pages:** Providing a polished, branded "Offline Fallback" HTML page instead of the browser's generic "No Internet Connection" dinosaur screen for standard multi-page websites.
- **Critical Asset Pre-caching:** Preloading critical visual and structural assets (CSS, JS bundles, web fonts, core logos) on initial launch to accelerate subsequent page navigation.
- **Dynamic Content Caching:** Caching API responses, media files, or user-requested resources dynamically as they are fetched, using advanced request-specific routing policies.
- **Aggressive Performance Optimization:** Minimizing main-thread blocking network requests by serving stable static layout pieces instantly from local cache memory.

## When NOT to Use

- **Non-HTTPS Environments:** Service Workers are fundamentally restricted to secure contexts (`https://`) to prevent man-in-the-middle request interception (except for `localhost` during development). Do not attempt to use them on standard HTTP production domains.
- **Highly Dynamic, High-Consistency Data:** Financial balances, inventory levels, real-time ticket availability, or stock tickers must never be served using stale cached states without rigorous, complex synchronization. Keep these routed strictly over live network connections.
- **Simple Static Sites with High Cache-Busting Churn:** Small sites where asset filenames change constantly without a deterministic build-hash naming system, as managing the pre-cache manifests manually becomes highly error-prone.
- **Websockets or Server-Sent Events (SSE):** These persistent, bidirectional streaming channels cannot be routed or intercepted by Service Worker fetch listeners.

## Inputs

1. **Static Pre-cache Manifest:** A clean array of relative URLs pointing to core assets (HTML shells, CSS, JS, branding graphics, fonts) that must be downloaded and stored during the Service Worker's installation phase.
2. **Offline Fallback URL:** A dedicated, lightweight, self-contained offline page (e.g., `/offline.html`) containing inline or pre-cached CSS and media to display when both network and dynamic caches fail.
3. **Cache Strategy Mapping:** Rules mapping request types (by URL regex, request header, or destination mime-type) to specific caching behaviors (e.g., dynamic images use Cache-First, APIs use Network-First).
4. **Cache Version Key:** A unique, incrementable string hash (e.g., `v1.0.1` or build timestamp) used to isolate cache spaces and safely trigger old cache evictions during upgrades.

## Outputs

1. **Service Worker Script (`sw.js`):** A portable, event-driven JavaScript file implementing `install` pre-caching, `activate` cache cleanup, and `fetch` interception with modular routing strategies.
2. **Client-Side Registration Controller (`sw-register.js`):** A robust script running on the main thread that registers the service worker, monitors update life cycles, and provides hook callbacks to prompt the user when a major update is waiting.
3. **Optimized HTTP Cache Configurations:** Server-side rules ensuring `sw.js` itself is never cached by the browser's HTTP cache, preventing permanent client-side software lock-in.

---

## Workflow

```text
               +-------------------------------------------+
               |         Page registers Service Worker      |
               +---------------------++--------------------+
                                     ||
                                     \/
               +-------------------------------------------+
               |                 INSTALL                   |
               |  Pre-caches critical files & fallbacks   |
               +---------------------++--------------------+
                                     ||
                                     \/
               +-------------------------------------------+
               |                 ACTIVATE                  |
               |  Cleans up old, stale cache versions      |
               +---------------------++--------------------+
                                     ||
                                     \/
               +-------------------------------------------+
               |               WAIT / IDLE                 |
               |  Waiting for new SW or intercepting fetch  |
               +---------------------+---------------------+
                                     |
                +--------------------+---------------------+
                |                                          |
                \/                                         \/
    [Intercepting fetch]                         [New SW Detected]
+-------------------------------+         +--------------------------------+
| Matches request to strategy:  |         | Prompts user: "Update Available"|
| - Cache-First / Cache-Only    |         | Passes 'skipWaiting' message   |
| - Network-First / Network-Only|         +--------------------------------+
| - Stale-While-Revalidate      |
+-------------------------------+
```

### 1. Register with Complete Lifecycle Awareness
The main thread must register the service worker only after the page fully loads. This prevents registration requests from competing with critical image or stylesheet parsing during the initial page load.

```javascript
// Inside main thread application script (e.g., sw-register.js)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Listen for updates to the service worker script
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new service worker is installed and waiting to take over!
              // Dispatch custom event to trigger user prompt UI
              window.dispatchEvent(new CustomEvent('swUpdateAvailable', { detail: registration }));
            }
          });
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });

  // Handle controller changes (e.g., when the active worker skips waiting and activates)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload(); // Reload page to bind immediately to the new Service Worker
  });
}
```

### 2. Implement the `install` Event (Pre-caching and Resilience)
The Service Worker installs once registered. This is where we declare critical assets to pre-cache.
- **Fail-Safe Pre-caching:** If any asset in the `cache.addAll()` array fails to download (e.g., returns a `404` or `500`), the entire installation aborts, and the service worker is discarded. Keep the pre-cache list minimal, clean, and tested.
- **Force Activation Control:** Use `self.skipWaiting()` *only* if you want immediate, seamless takeover without waiting for open tabs to close, but be aware this can cause version mismatches in active UI sessions (known as cache-splitting).

```javascript
// Inside sw.js
const CACHE_NAME = 'core-assets-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/styles.css',
  '/js/app.js',
  '/images/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching critical assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force the waiting service worker to become active
  );
});
```

### 3. Implement the `activate` Event (Cache Eviction and Claiming Clients)
Once active, the new Service Worker must clean up old cache schemas left over from previous version installs.
- **Asynchronous Cleanup:** Retrieve all cache keys and delete any that do not match the current `CACHE_NAME`.
- **Claiming Clients:** Execute `self.clients.claim()` so that the service worker immediately begins intercepting fetches for all active pages without requiring a manual page refresh.

```javascript
// Inside sw.js
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Immediately control all active browser tabs
  );
});
```

### 4. Implement the `fetch` Event (Request Interception and Routing)
The core of the Service Worker is request interception. Intercept only `GET` requests (POST, PUT, DELETE requests cannot be cached and must always hit the live network).

- **Route Segmentation:** Check the URL, request method, and context headers to route requests to the appropriate caching strategy.
- **Safe Fallbacks:** Ensure that if both the cache lookup and the live network fetch fail, the Service Worker intercepts HTML page navigation requests and falls back gracefully to the pre-cached `/offline.html` page.

```javascript
// Inside sw.js fetch listener
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy 1: Offline Fallback for Page Navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Strategy 2: Cache-First for static styling, scripts, and fonts
  if (
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.css') ||
     url.pathname.endsWith('.js') ||
     url.pathname.includes('/fonts/'))
  ) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  // Strategy 3: Stale-While-Revalidate for images and content pieces
  if (url.origin === self.location.origin && url.pathname.includes('/images/')) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
    return;
  }
});
```

---

## Decision Rules

Choosing the correct caching strategy is critical to avoiding serving stale, broken content. Use the decision tree below:

```text
                           Is the resource critical and dynamic?
                                      /              \
                                     YES              NO
                                    /                  \
              Does it need to work offline?             Is it a static asset (CSS, JS, Font)?
                       /          \                          /                    \
                     YES           NO                      YES                     NO
                     /              \                      /                        \
         [Network-First]       [Network-Only]        [Cache-First]         [Stale-While-Revalidate]
```

### Strategy Characteristics

| Strategy | Ideal Use Case | Pros | Cons | Offline Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Cache-Only** | Critical pre-cached assets (e.g., `/offline.html`) | Instant retrieval, zero network overhead | Never updates unless cache version key changes | Returns cached copy instantly; fails if not cached |
| **Network-Only** | Bank transactions, API submissions, POST forms | Guaranteed fresh data | Fails instantly when offline | Fails completely |
| **Cache-First** | Stable static files, hashed vendor bundles, web fonts | Maximum speed, bypasses networks entirely | Updates only on cache version key bump | Returns cached copy; fetches from network on miss |
| **Network-First** | User profiles, dynamic dashboard data, recent posts | Fresh data when online, safe fallback when offline | Network latency delays render when online | Serves cached copy only if network is offline/slow |
| **Stale-While-Revalidate** | Avatar images, product list summaries, static icons | Immediate display, background update keeps cache fresh | Screen displays older state first before updating | Serves cached copy instantly |

---

## Constraints

- **Scope Limits:** A Service Worker located at `/js/sw.js` can only control pages inside `/js/` or deeper. Always place `sw.js` at the **root** of your directory structure (e.g., `/sw.js`) to ensure it can intercept requests for the entire domain.
- **Cache Size Quotas:** Web browsers impose origin storage limits (often 10%–50% of free disk space). Implement active garbage collection in your service worker (e.g., capping dynamic image caches to 50 items) to avoid hitting quota blocks.
- **Opaque Responses:** Cross-origin resources (from CDNs, third-party APIs) fetched without CORS enabled return "opaque" responses (status code `0`). To the browser's security model, opaque responses carry a massive padded file size (often 7MB+ regardless of actual size). **Never cache opaque responses without extreme caution**, as they can quickly exceed the browser's storage quota.
- **No Global State Persistence:** Service Workers are aggressively terminated by the browser when idle to preserve device battery. Never store session state, active variables, or triggers inside global service worker variables. Persist critical data inside the **Cache Storage API** or **IndexedDB**.

---

## Non-Goals

- Setting up Web Push Notifications or configuring background messaging platforms.
- Configuring a full PWA App Manifest (`manifest.json`) or handling OS-specific mobile app installation icons.
- Integrating with build-tool specific wrapper plugins (e.g., Webpack Workbox, Vite PWA). This skill teaches pure, portable, platform-agnostic Vanilla JS.
- Managing database state synchronizations (handled via IndexedDB or sync events).

---

## Common Failure Patterns

- **Caching the Service Worker Script Itself:** If your web server serves `sw.js` with standard long-term browser cache headers (e.g., `Cache-Control: max-age=31536000`), the browser will refuse to check for updates on your server. You will be completely locked out from deploying updates to your users. **Always set `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` on the web server for `sw.js`.**
- **The Single Pre-Cache Typo Fail:** Placing a typo in your pre-cache array (e.g., `/css/styles-typo.css`). During installation, the browser receives a `404` for this resource, causing `cache.addAll()` to fail, which aborts the installation. The service worker will never activate, leaving your site completely vulnerable to offline failures.
- **Active Tab Cache Mismatch (Cache Splitting):** Calling `skipWaiting()` immediately without reloading active pages. Active tabs running older JavaScript versions may try to fetch old hashed assets that the new service worker just deleted from the cache, causing the UI to break.
- **Forgetting CORS on CDN Assets:** Trying to cache cross-origin stylesheets or fonts without the `crossorigin` attribute on the HTML link. This results in opaque responses, which are either rejected by the Service Worker or exhaust the client's cache storage quota instantly.

---

## Validation Criteria

### 1. DevTools Lifecycle Verification
- [ ] Open the web application. Open Chrome DevTools, and navigate to **Application -> Service Workers**.
- [ ] Confirm the Service Worker is registered cleanly, marked as **Active and running**, and its scope is set correctly to `/`.
- [ ] Check the console for any service worker registration warnings or errors.

### 2. Cache Inspection
- [ ] In DevTools, go to **Application -> Cache Storage**.
- [ ] Click on your cache key (e.g., `core-assets-cache-v1`).
- [ ] Verify that every URL declared in your `PRECACHE_ASSETS` array is populated inside the list with its correct size, status code (`200`), and content type.

### 3. Offline Mode Resilience
- [ ] In the DevTools **Network** or **Application -> Service Workers** tab, check the **Offline** checkbox to simulate network disconnects.
- [ ] Reload the page (`Ctrl + R` or `Cmd + R`).
- [ ] Confirm the page loads seamlessly from cache or serves the `/offline.html` page without displaying a "No Internet" browser error.

### 4. Update Lifecycle and Safe Takeover
- [ ] Modify the version key inside `sw.js` (e.g., change `core-assets-cache-v1` to `core-assets-cache-v2`).
- [ ] Reload the page. Confirm that the browser detects the new service worker, installs it in the background, and triggers your update prompt UI.
- [ ] Click "Update Now" to trigger `postMessage({ action: 'skipWaiting' })`. Verify that the page automatically reloads, and the old cache is immediately evicted.
