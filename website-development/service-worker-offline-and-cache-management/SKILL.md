---
name: service-worker-offline-and-cache-management
description:
  Design, implement, and debug robust Service Workers for offline fallback pages, precaching shell assets, implementing granular caching strategies, and managing update lifecycles without user lock-in.
---

# Service Worker Offline and Cache Management

## Purpose

The Service Worker Offline and Cache Management skill provides a production-grade frontend protocol for implementing background network interception and asset persistence. It solves:
1. **Network Resilience & Offline Fallbacks:** Providing a graceful, branded fallback experience when a user loses internet connectivity, rather than showing the browser's generic "No Internet / Downasaur" screen.
2. **The "Zombie Service Worker" (Lock-In):** Ensuring the website updates instantly when new code is deployed, avoiding the notorious trap where users are locked into cached, outdated files indefinitely because the old service worker is waiting and refuses to let go.
3. **Optimized Resource Caching:** Implementing granular caching strategies (such as Stale-While-Revalidate for icons/fonts, and Network-First for dynamic templates) to minimize load times while protecting data integrity.
4. **Bandwidth Efficiency:** Pre-caching critical "app shell" files (index.html, core CSS/JS) and lazily caching static assets only as they are requested.

---

## Use Cases

- **Offline-Capable Web Apps:** Ensuring dashboards, e-commerce stores, SaaS apps, or portals remain readable and partially functional without a connection.
- **Performance Booster (Instant Page Load):** Loading cached structural shell elements instantly, bypassing cellular latency entirely for repeated visits.
- **Low-Bandwidth Optimization:** Minimizing repeated server hits on high-volume websites or mobile web applications.
- **Custom Branded Fallbacks:** Directing failed document fetches to a dedicated `/offline.html` page that allows users to re-try connections, play custom offline games, or view stored data.

---

## When NOT to Use

- **Static Marketing Landing Pages (No Re-visits expected):** For single-visit ad landing pages where caching overhead is useless and adds registration latency.
- **Highly Volatile Real-Time Sites:** Stock tickers, live auction dashboards, or auction bids, where displaying cached data even for a few seconds could cause critical business damage. (Instead, rely entirely on WebSockets or live server polling).
- **Backend-Heavy Traditional Portals (Session Dependent):** Where page transitions heavily rely on server-side session validations, complex stateful redirects, or server-rendered POST requests.
- **Dev-Only/Internal Testing Sandboxes:** Unless explicitly testing service worker logic, as caching can interfere with hot-reloading and development builds.

---

## Inputs

1. **App Shell Inventory:** List of critical, non-volatile assets required to load the basic layout (e.g., `favicon.ico`, `main.css`, `bundle.js`, `offline.html`).
2. **Caching Strategy Mapping:** Categorization of routes and asset types (HTML, CSS/JS, Fonts, Images, APIs) into appropriate caching buckets.
3. **Active Cache Identifiers:** Semantic version string (e.g., `v1.0.2` or `site-cache-v1`) to manage cache groups and automate invalidation.
4. **Registration Scope:** The path prefix under which the Service Worker is allowed to intercept network requests (defaults to the location of the service worker script, usually root `/`).

---

## Outputs

1. **Registration & Lifecycle Controller:** Client-side JavaScript registering the service worker, listening for waiting updates, and presenting a reload dialog to the user.
2. **Granular Service Worker Script:** An active background worker file handling the `install`, `activate`, and `fetch` events, managing multiple isolated Cache Storage buckets.
3. **Branded Offline Fallback Document:** An independent, styling-contained HTML page (`offline.html`) shown when network document fetches fail and are not in cache.
4. **Update Notification UI:** An accessible, focus-controlled notification alert prompting users to activate newly deployed site updates.

---

## Workflow

```text
[ Deploy New Code ] ---> [ Browser detects SW byte difference ] ---> [ Install Event (Pre-cache new assets) ]
                                                                                   |
                                                                                   v
[ User clicks "Reload" ] <--- [ Prompt: "Update Available" ] <--- [ Waiting State (New SW active but inactive) ]
          |
          v
[ Trigger skipWaiting() ] ---> [ Activate Event (Purge old cache) ] ---> [ Take control (Clients claim) ]
```

### 1. Structure the App Shell & Offline Fallback
Before writing any Service Worker code, create a completely self-contained `/offline.html` page.
- **Self-contained Styling:** Inline all essential CSS and images (or use inline SVGs) inside `offline.html` to guarantee that this file is readable even if other stylesheet fetches fail.
- **Clear Actionability:** Provide a prominent "Try Again" button that triggers `window.location.reload()`, letting users refresh their view once they regain internet access.

### 2. Implement the Service Worker Script (`sw.js`)
Create a file named `sw.js` at the root of the project. It operates on a separate background thread and implements three core event handlers:

#### A. The `install` Event (Pre-caching)
Pre-cache the critical assets needed for the core app shell to work offline.

```javascript
const CACHE_NAME = 'app-shell-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/styles.css',
  '/js/main.js',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()) // Force immediate transition out of waiting state once requested
  );
});
```

#### B. The `activate` Event (Cache Invalidation & Cleanup)
When a new Service Worker takes control, delete any old, obsolete cache storage buckets to prevent taking up excessive disk quota on the client's device.

```javascript
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            // Delete old, deprecated caches
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Immediately take control of all open client tabs
  );
});
```

#### C. The `fetch` Event (Network Interception & Routing Strategies)
Intercept all outgoing network requests. Route requests through caching strategies based on their content type:

- **HTML / Documents (Network-First with Offline Fallback):** Always attempt to fetch the freshest page from the network first. If the network fails, check the cache. If the cache is empty, serve the pre-cached `/offline.html` page.
- **CSS / JS / Fonts / Static Images (Stale-While-Revalidate):** Serve the cached version instantly for blazing-fast load speed, while fetching the asset from the network in the background to update the cache for the next visit.
- **APIs / Critical Data (Network-Only):** Always bypass the cache to ensure data is never stale.

```javascript
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only intercept same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 2. Handle HTML document requests: Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Network failed, look in cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              // Both network and cache failed, return the offline fallback shell
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // 3. Handle static assets: Stale-While-Revalidate
  const isStaticAsset = (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  );

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        }).catch(() => null); // Silent network fail for background fetch

        return cachedResponse || fetchPromise;
      })
    );
  }
});
```

### 3. Handle Client-Side Registration and Updates
To prevent user lock-in, the client script must register the worker, listen for updates, and notify the user when an update is ready.

```javascript
// main.js - Client script
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // Track updates to the Service Worker
        if (registration.waiting) {
          showUpdateNotification(registration.waiting);
          return;
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification(newWorker);
            }
          });
        });
      })
      .catch((error) => console.error('Service Worker registration failed:', error));

    // Listen for controlling service worker change and reload the page
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
```

### 4. Build the Accessible Update Notification UI
When a new Service Worker is in the `waiting` state, display a visual notification bar alerting the user of newly deployed content.
- **Focus Management:** On display, move focus to the "Update & Reload" button inside the banner.
- **ARIA role:** Use `role="alert"` or `role="status"` to announce the notification to screen readers.
- **Trigger skipWaiting:** Clicking "Update & Reload" must post a message to the waiting Service Worker:

```javascript
function showUpdateNotification(worker) {
  const banner = document.getElementById('update-banner');
  const updateBtn = document.getElementById('update-btn');

  banner.classList.add('is-visible');
  updateBtn.focus(); // Trap focus to make updating highly accessible

  updateBtn.addEventListener('click', () => {
    // Post SKIP_WAITING to the waiting worker
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
}
```

In `sw.js`, add a message event listener to respond to this command:
```javascript
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

---

## Decision Rules

### Caching Strategy Selection Matrix

Choose the strategy based on the characteristics and criticality of the resources:

| Strategy | Performance | Freshness | Primary Use Cases | Offline Support |
| :--- | :--- | :--- | :--- | :--- |
| **Network-First** | Low (awaits network) | High | HTML files, user dashboard indices, checkout routes | Yes (falls back to cache or offline page) |
| **Cache-First** | High (instant cache) | Low | Custom web fonts, heavy static images, vector logos | Yes (direct from cache) |
| **Stale-While-Revalidate** | High (instant cache) | Medium (fresh next load) | CSS sheets, non-breaking JS bundles, icon packs | Yes (direct from cache) |
| **Network-Only** | Low | High | API POST/PUT transactions, secure payments, analytics | No |

### How to choose Scope
- **Root Scope (`/`):** Default and strongly recommended. The Service Worker script must be physically located at the root directory of your project (e.g., `https://example.com/sw.js`) to allow it to intercept requests across the entire domain.
- **Subfolder Scope (e.g., `/app/`):** Use only if your site is hosted under a subdirectory or shared domain and you must avoid intercepting assets on the main landing site.

---

## Constraints

- **HTTPS Requirement:** Service Workers are extremely powerful network proxies. Browsers strictly require **HTTPS** (or `localhost` for development) to register them. Under HTTP, registration will fail silently or throw a security exception.
- **Storage Limits (Quotas):** Browser Cache Storage shares a global origin quota (often 50% of free disk space). However, individual browsers can aggressively purge caches if the device runs extremely low on disk space. Always write cache lookup code containing fallback handlers.
- **No Synchronous API Access:** Service Workers run on a separate thread where synchronous APIs (like standard `localStorage` or synchronous XMLHttpRequests) are completely banned. Use `IndexedDB` or the Cache Storage API instead.
- **Cache Size Cap:** Ensure your static assets are optimized (see `svg-optimization-implementation` and `client-side-image-compression`) before pre-caching. Do not cache video files or highly heavy binary blobs in standard Cache Storage.

---

## Non-Goals

- Implementing push notifications using the Push API and Web Push servers.
- Handling background synchronization tasks using the Background Sync API.
- Creating native-wrapped mobile applications (such as Cordova, Capacitor, or Electron).
- Integrating automated workbox-build configs inside complex webpack/bundler pipelines (the focus is on core vanilla JS mechanics and understanding the caching architecture).

---

## Common Failure Patterns

- **The Zombie Service Worker (Eternal Wait):** Deploying code changes but forgetting to trigger `skipWaiting()`. Old users continue to load the cached old stylesheets and JS, resulting in broken UIs or stale content.
- **HTML Cache Lock-In:** Caching `index.html` with a **Cache-First** or aggressive **Stale-While-Revalidate** strategy *without* registering an update notifier. Because the page is loaded from cache and the background update doesn't trigger a page refresh, the user will literally never receive code updates unless they clear their browser storage manually.
- **Double Fetch / Out-of-Order Cache Pollution:** Fetching an asset from the network, but calling `cache.put(request, response)` without cloning the response first. Since responses can only be read once, the main page fetch will error out as "body already consumed".
- **Infinite Loop Redirects:** Forgetting to exclude the Service Worker registration script itself (`sw.js`) from caching, or caching redirect headers that trap routing.
- **HTTPS Sandbox Errors:** Trying to register a worker in an iframe or on an insecure testing network domain, throwing uncaught security errors.

---

## Validation Steps

### 1. Verification of Safe Registration
- [ ] Open the site in Chrome or Safari. Open DevTools and navigate to the **Application** (or **Storage**) tab.
- [ ] Select **Service Workers**. Verify that your Service Worker is listed, marked as "Active and running", and its scope matches your root or expected directory.

### 2. Offline Simulation Verification
- [ ] Toggle **Offline** mode in your browser DevTools (Network panel or Service Worker panel).
- [ ] Reload the main page. Confirm that the core structure, assets, and text load instantly without internet access.
- [ ] Click a link to a non-cached route (or navigate to `/random-page`). Confirm that the customized, styled `/offline.html` fallback page displays correctly.
- [ ] Re-enable network connectivity, and verify that clicking the "Try Again" or "Reload" action restores standard page navigation.

### 3. Update Lifecycle Verification
- [ ] Deploy a tiny change to your stylesheet or page (or increase `CACHE_NAME` to `app-shell-v2` in `sw.js`).
- [ ] Open the site in a tab. Observe that the browser downloads the new `sw.js`, installs it, and the custom **Update Available** banner appears.
- [ ] Verify that keyboard focus immediately moves to the "Update" action when the banner displays.
- [ ] Click "Update". Confirm that the page automatically refreshes and loads the new cached content.

### 4. Cache Cleanup & Quota Verification
- [ ] Inspect the **Cache Storage** section in DevTools.
- [ ] Verify that there is only one active cache bucket corresponding to the latest `CACHE_NAME` version, and that old caches (e.g. `app-shell-v1`) were deleted automatically upon activation of the new worker.
