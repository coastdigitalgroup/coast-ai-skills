# Service Worker & Offline Audit Checklist

This audit checklist is designed to help engineers review, test, and stabilize Service Worker implementations. Use this template prior to production deployments to prevent user update lock-ins or performance bottlenecks.

## 1. Compliance & Security Audit
- [ ] **HTTPS Enforced:** Is the Service Worker registration disabled or bypassed on standard HTTP connections, while active on HTTPS and `localhost`?
- [ ] **Physical File Placement:** Is `sw.js` physically located at the absolute root of the public directory (e.g., `/sw.js` instead of `/js/sw.js`) to ensure a full root routing scope?
- [ ] **Scope Limitation:** If a subdirectory scope is specified, is it strictly documented and restricted?
- [ ] **Sensitive API Bypass:** Are all authentication, session validation, dynamic checkout, and credit card API routes explicitly exempted from caching via a `Network-Only` bypass?

## 2. Pre-Caching & Performance Audit
- [ ] **App Shell Optimization:** Is the `PRECACHE_ASSETS` list limited only to critical, non-volatile files needed to render the basic layout (e.g., CSS core, layout JS, favicon, offline fallback page)?
- [ ] **Image & Asset compression:** Are all pre-cached images, SVGs, and fonts compressed to their absolute limits to reduce the initial install bandwidth footprint?
- [ ] **Asset Weight Check:** Is the total cumulative size of all pre-cached assets below **2MB** to preserve cellular data for mobile-first users?
- [ ] **Registration Timing:** Is the Service Worker registration deferred until after the main `window.load` event to prevent CPU/network competition during first-contentful-paint (FCP)?

## 3. Caching Strategy Verification
- [ ] **HTML/Documents:** Are all standard page navigation requests using a `Network-First` or `Stale-While-Revalidate` strategy (never a pure `Cache-First` strategy without update triggers)?
- [ ] **Static Assets:** Do CSS sheets, JS bundles, fonts, and images utilize `Stale-While-Revalidate` or `Cache-First` for instant delivery?
- [ ] **Offline Fallback Routing:** Does the Service Worker intercept failed document navigations and cleanly fall back to serving `/offline.html` if the page is not in the cache?
- [ ] **No Double Consuming:** When cloning network responses before placing them in the Cache Storage API via `cache.put()`, is `.clone()` called correctly to prevent stream consumption errors?

## 4. Lifecycle & User Update Audit
- [ ] **SKIP_WAITING Message Binding:** Does the Service Worker listen to a direct `'message'` event with a command string (e.g., `{ type: 'SKIP_WAITING' }`) to call `self.skipWaiting()`?
- [ ] **Update Detection Setup:** Does the client-side JavaScript listen for the `updatefound` event and track transitions into the `waiting` state?
- [ ] **User-Facing Alert:** When a new worker is waiting, is a visible banner or notification triggered immediately?
- [ ] **Accessible Focus Trap:** On banner display, does keyboard focus instantly move to the "Reload/Update" button, and is focus trapped cleanly inside the alert bar?
- [ ] **No Auto-Refresh Loops:** Does the `controllerchange` listener on the client side use a guard flag (e.g., `isRefreshing`) to prevent infinite reload loops?
- [ ] **Cache Purging on Activate:** Does the `activate` event cleanly loop through all existing browser Cache Storage buckets, identify deprecated caches, and delete them on startup?

## 5. Physical Simulation Checks
- [ ] **Offline Page Load Test:** With network connection toggled completely to **Offline** in DevTools, does refreshing the page load the app layout shell instantly?
- [ ] **Offline Fallback Navigation:** Clicking a link to an un-cached page while offline cleanly displays the custom-styled `/offline.html` page.
- [ ] **Live Update Reload Test:** Incrementing the cache version name (e.g., `v1` to `v2`) triggers the update available banner on the next page reload. Clicking "Update & Reload" updates the site instantly and refreshes the tab.
- [ ] **Console Error Log Audit:** Inspecting the console under both Online and Offline modes reveals **zero** uncaught network errors, stream consumer issues, or register failures.
