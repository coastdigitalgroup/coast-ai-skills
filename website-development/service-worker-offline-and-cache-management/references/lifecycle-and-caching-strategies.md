# Service Worker Lifecycle and Caching Strategies

Understanding the underlying browser mechanics is critical to building a stable, high-performance Service Worker implementation. This reference covers worker states, visual life cycle transitions, caching strategies, and storage quotas.

---

## 1. The Service Worker Lifecycle

Unlike standard client-side scripts, a Service Worker has a lifecycle that is completely decoupled from the active web page. This guarantees that background operations can run even when no tabs are open.

```text
 [Registration] ---> [Installing] ---> [Installed / Waiting]
                           |                   |
                           v                   v
                    [Install Failed]     [Activating] ---> [Active] ---> [Idle / Terminated]
```

### Lifecycle Phases

1. **Registration:**
   - Initiated by the main thread calling `navigator.serviceWorker.register()`.
   - The browser fetches the service worker script, parses it, and schedules installation.

2. **Installing (`install` event):**
   - The worker has loaded, and the browser executes its `install` listener.
   - This phase is used to warm-start caches and download critical static assets.
   - If any download fails during `event.waitUntil()`, the install fails, and the worker is discarded.

3. **Installed / Waiting:**
   - The service worker has completed its installation successfully but is waiting for other active tabs using the *old* service worker to close.
   - This prevents version fragmentation ("cache splitting") where different tabs run different script versions.

4. **Activating (`activate` event):**
   - Triggered when all tabs using the old worker are closed, or when `skipWaiting()` was commanded.
   - This phase is used for cleaning up legacy cache keys, database schemas, and preparing the environment for the new version.

5. **Active:**
   - The Service Worker is now in full control of all client pages within its scope.
   - It intercepts fetch events, listens to messages, and manages state.

6. **Idle / Terminated:**
   - To save battery and system memory, the browser will terminate the service worker thread if it remains idle with no active requests for a short period (typically 30 seconds).
   - The worker is instantly spun up again when a new network request, push event, or message is dispatched.

---

## 2. HTTP Cache vs. Service Worker Cache Storage

It is critical to distinguish between the two layers of client-side caching:

```text
                  +-------------------------+
                  |      Browser View       |
                  +------------+------------+
                               |
                               \/
                  +-------------------------+
                  |  Service Worker Cache   | <--- Programmatic control (Cache Storage API)
                  +------------+------------+
                               | (Cache Miss)
                               \/
                  +-------------------------+
                  |   Browser HTTP Cache    | <--- Server HTTP Headers (Cache-Control)
                  +------------+------------+
                               | (Cache Miss)
                               \/
                  +-------------------------+
                  |    External Network     |
                  +-------------------------+
```

| Feature | Browser HTTP Cache | Service Worker Cache Storage |
| :--- | :--- | :--- |
| **Control Mechanism** | Managed via declarative server headers (`Cache-Control`, `ETag`). | Managed programmatically via JavaScript (Cache Storage API). |
| **Custom Routing** | No. Caches strictly by exact matching URL. | Yes. Fully custom regex, header, or MIME-type matching rules. |
| **Offline Support** | Fragmented. Limited and unpredictable fallback behavior. | Absolute. Can return any custom fallback page or mocked response. |
| **Cache Mutation** | Impractical. Browser evicts files autonomously. | Precise. Code can add, update, delete, and iterate through cache entries. |

---

## 3. Caching Strategy Algorithms

### Cache-First (Static Assets)
```javascript
function cacheFirst(request) {
  return caches.match(request).then((cachedResponse) => {
    return cachedResponse || fetch(request).then((networkResponse) => {
      return caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
```
*Algorithm Flow:*
1. Query the Cache Storage for a match.
2. If found, return the cached response instantly (0ms latency).
3. If not found, fetch the resource over the network.
4. Clone the network response, write it to the cache for future queries, and return it.

### Network-First (Dynamic Data & Pages)
```javascript
function networkFirst(request) {
  return fetch(request)
    .then((networkResponse) => {
      return caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    })
    .catch(() => {
      return caches.match(request);
    });
}
```
*Algorithm Flow:*
1. Request the resource from the network.
2. If the request succeeds, clone the response, write it to the cache, and return it.
3. If the network request fails (offline or timeout), look up the resource in the Cache Storage and return it.

### Stale-While-Revalidate (Dynamic Non-Critical Assets)
```javascript
function staleWhileRevalidate(request) {
  return caches.match(request).then((cachedResponse) => {
    const fetchPromise = fetch(request).then((networkResponse) => {
      return caches.open(DYNAMIC_CACHE).then((cache) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    });
    return cachedResponse || fetchPromise;
  });
}
```
*Algorithm Flow:*
1. Query the Cache Storage for a match.
2. If found, return the cached response immediately to keep the UI snappy.
3. In the background, trigger a network request to fetch the latest version.
4. When the background fetch completes, overwrite the cached entry with the fresh response.
5. If not found in the cache initially, wait for the network request to complete and return that.

---

## 4. Storage Limits & Eviction Policies

- **Quotas:** Browsers calculate quotas dynamically based on available device storage. An origin is typically allowed to consume up to 50% of the free volume.
- **Eviction:** When a device runs extremely low on storage space, the browser will wipe entire origins (including all caches and IndexedDB spaces) starting with the least recently used (LRU) origin.
- **Persistent Storage:** Applications can request persistent storage using `navigator.storage.persist()`. When granted, the browser will protect the origin's cache from automated evictions.
