# Service Worker and Cache Audit Checklist

This checklist is used to audit, debug, and optimize Service Worker and client-side caching implementations on frontend websites. Use it during development, code review, or troubleshooting phases to verify performance and lifecycle compliance.

---

## 1. Registration & Scope Security
- [ ] **HTTPS Verification:** Is the Service Worker registered *only* in secure contexts (HTTPS), or `localhost`/`127.0.0.1` during testing?
- [ ] **Physical Directory Location:** Is `sw.js` physically located at the root directory of the website (e.g., `/sw.js`) rather than inside a subdirectory like `/js/sw.js`?
  - *Why:* Placement inside subdirectories restricts its control scope to only that folder's paths.
- [ ] **Post-load Registration:** Is the registration code executing *after* the window `load` event fires?
  - *Why:* Avoids resource contention with initial page parsing and paint tasks.
- [ ] **Explicit Scope Definitions:** If a custom scope is declared, does it match the physical directory constraints of the application?

---

## 2. Server-Side HTTP Headers
- [ ] **SW No-Cache Policy:** Does the web server serve `sw.js` with headers that explicitly forbid HTTP caching?
  - *Verify:* Run `curl -I https://yourdomain.com/sw.js` and verify headers include:
    - `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
  - *Why:* If the browser caches the service worker script file, updates can be permanently blocked on the user's browser.
- [ ] **Pre-cached Assets Cache-Control:** Do pre-cached assets have a healthy cache validity time on the HTTP server, or are they hashed?

---

## 3. Installation & Pre-Caching
- [ ] **Fail-Safe Checklist:** Are all URLs declared in the `PRECACHE_ASSETS` list absolutely valid and active?
  - *Verify:* Try accessing every URL in the list. A single `404` or `500` will cause the entire installation to abort.
- [ ] **Offline Fallback Registration:** Is a robust, lightweight offline fallback page (e.g., `/offline.html`) explicitly included in the pre-cache list?
- [ ] **Pre-cache Footprint Size:** Is the pre-cache list kept to a minimal footprint (under ~5MB total)?
  - *Why:* Oversized pre-caches waste client mobile bandwidth and raise install abortion rates.

---

## 4. Activation & Cache Eviction
- [ ] **Legacy Eviction Safety:** Does the `activate` listener dynamically query cache keys and delete all legacy caches that do not match the current `CACHE_NAME` version?
- [ ] **Client Claiming:** Does the `activate` event call `self.clients.claim()`?
  - *Why:* Ensures the Service Worker takes immediate, synchronous control of all open browser tabs as soon as it goes active.
- [ ] **Stateless Execution:** Are there *zero* critical session variables or active counters stored inside the service worker's global scope?
  - *Why:* Service workers are aggressively terminated by the operating system when idle; all state must reside in Cache Storage or IndexedDB.

---

## 5. Fetch Interception & Strategy Routing
- [ ] **GET Method Check:** Does the `fetch` listener filter out non-GET requests (such as POST, PUT, DELETE) from the cache flow?
- [ ] **CORS and Opaque Responses:** Are third-party cross-origin assets (e.g., fonts, CDNs) requested with CORS enabled, or does your service worker explicitly reject caching them if they are opaque?
  - *Why:* Caching opaque responses (status `0`) triggers internal padding, which can rapidly exhaust browser cache storage quotas.
- [ ] **Dynamic Cache Threshold Limits:** Is there an active size limit validator running on the dynamic runtime cache?
  - *Why:* Prevents the dynamic cache from growing unbounded and triggering browser disk cleanup evictions.
- [ ] **Proper Offline Fallback Trigger:** Does the navigation routing fetch catch block correctly return the pre-cached `/offline.html` page when both the live network and caches fail?

---

## 6. Update Lifecycle & User Takeover
- [ ] **Background Update Verification:** Does the client-side script listen for `updatefound` on the service worker registration?
- [ ] **Active Waiting Notification:** Does a UI notification banner or toast appear when a new worker is installed and in the `waiting` state?
- [ ] **No Auto-Skip version splitting:** Does the service worker avoid calling `skipWaiting()` *without* prompting a client-side reload?
  - *Why:* Immediate takeover without refreshing can break currently active sessions trying to pull older, now-deleted hashed JS files.
- [ ] **Controller Change Coordination:** Is there a listener on `controllerchange` that triggers `window.location.reload()` once the new service worker takes over control?
