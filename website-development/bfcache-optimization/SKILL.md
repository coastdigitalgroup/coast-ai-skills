---
name: bfcache-optimization
description:
  Optimize websites for the Back/Forward Cache (bfcache) to enable instant
  navigations by managing lifecycle events and eliminating eligibility blockers.
---

# Bfcache Optimization

## Purpose

The Bfcache Optimization skill provides a technical protocol for ensuring that
web pages are eligible for the browser's Back/Forward Cache. This feature
allows for instant navigations when a user moves back or forward in their
history by keeping a complete snapshot of the page (including the JS heap) in
memory.

## Use Cases

- Improving user-perceived performance for multi-page navigations.
- Reducing Core Web Vitals (specifically LCP and INP) for returning visits.
- Modernizing legacy codebases that rely on the `unload` event.
- Handling real-time UI state (e.g., shopping carts, notifications) that must
  stay fresh even when restored from cache.

## When NOT to Use

- **Highly Sensitive Data:** Pages displaying extremely sensitive information
  (e.g., bank balances that change every second) may require `Cache-Control:
  no-store` to ensure the data is never cached, even in memory.
- **Short-Lived Authentication:** If a page's entire purpose is a one-time
  security check that must never be re-entered.

## Inputs

1. **Eligibility Audit:** Reports from Chrome DevTools "Back/forward cache"
   panel identifying why a page is not being cached.
2. **Event Inventory:** Identification of `unload` or `beforeunload` listeners.
3. **Caching Headers:** Current `Cache-Control` configuration.
4. **Restoration Logic:** Identification of UI elements that need to be
   updated when a user returns to the page.

## Outputs

1. **Bfcache-Eligible Codebase:** Removal of blockers like `unload` listeners.
2. **Lifecycle Management Logic:** Implementation of `pageshow` and `pagehide`
   handlers.
3. **State Synchronization:** Scripts that update stale UI components upon
   restoration using `event.persisted`.
4. **Optimized Headers:** `Cache-Control` settings that allow bfcache while
   maintaining security.

## Workflow

### 1. Audit Eligibility
- Open Chrome DevTools, go to **Application** > **Back/forward cache**.
- Click **Test back/forward cache**.
- Address any listed "Not restored" reasons (e.g., "Page used unload listener").

### 2. Replace `unload` Listeners
- **The Problem:** The `unload` event is a primary blocker for bfcache because
  it was historically used to perform cleanup that would be broken if the page
  remained in memory.
- **The Fix:** Move logic from `unload` to `pagehide` or `visibilitychange`.
- Use `pagehide` for cleanup that should happen when the user navigates away.
- Use `visibilitychange` for saving user data or state.

### 3. Handle Restoration with `pageshow`
- When a page is restored from bfcache, the standard `DOMContentLoaded` or
  `load` events do **not** fire.
- Use the `pageshow` event to detect restoration:
  ```javascript
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      // Page was restored from bfcache
      refreshStaleData();
    }
  });
  ```

### 4. Manage Active Connections
- **WebSockets/SSE:** Close active connections in `pagehide` and re-establish
  them in `pageshow` (if `event.persisted` is true).
- **Timers:** Pause intervals or timeouts in `pagehide` to prevent background
  processing, and resume in `pageshow`.

### 5. Configure Headers
- Avoid `Cache-Control: no-store` unless absolutely necessary for security,
  as it prevents bfcache.
- Prefer `Cache-Control: no-cache` or `max-age=0, must-revalidate` which allow
  the browser to cache the page in the bfcache while still requiring it to
  re-validate with the server for fresh navigations.

## Decision Rules

- **`pagehide` vs. `unload`:** Always use `pagehide`. It fires in all scenarios
  where `unload` does but does not block bfcache.
- **`visibilitychange` vs. `pagehide`:** Use `visibilitychange` to save data
  periodically or when the tab is hidden (e.g., user switches tabs). Use
  `pagehide` for the final "leaving the page" cleanup.
- **Handling Stale Content:** If the page content changes frequently, use the
  `pageshow` event to fetch only the deltas rather than reloading the entire
  page.

## Constraints

- **Single Announcer:** Ensure that `pageshow` logic doesn't trigger duplicate
  analytics pings or multiple UI refreshes.
- **Browser Behavior:** Be aware that different browsers (Safari/Firefox vs.
  Chrome) have slightly different heuristics for bfcache eligibility, but
  removing `unload` is the universal first step.

## Non-Goals

- Implementing a custom client-side caching layer (e.g., IndexedDB or
  localStorage).
- General HTTP caching strategy for static assets (CSS, JS, Images).
- Managing Service Worker caches (though they interact with bfcache).

## Common Failure Patterns

- **Sticking with `unload`:** Continuing to use `window.onunload`, which is the
  #1 cause of bfcache exclusion.
- **Stale UI after Restore:** A user clicks "Back" and sees a shopping cart
  with 0 items even though they just added 3 on the previous page.
- **Broken Analytics:** Not tracking "Back/Forward" navigations because the
  analytics script only runs on the initial `load` event.
- **Zombie Connections:** Leaving WebSockets open, causing the server to keep
  connections alive for pages that are "frozen" in the user's cache.

## Validation Criteria

- [ ] **DevTools Audit:** Verify "Back/forward cache" panel shows "Successfully
      restored from back/forward cache."
- [ ] **Event Execution Check:** Confirm that `pageshow` fires and its
      `persisted` property is `true` when using the Back button.
- [ ] **State Restoration Test:** Verify that any dynamic UI (counters, cart
      totals, timestamps) is updated correctly upon return.
- [ ] **Connection Audit:** Verify that network connections (WebSockets) are
      cleanly closed when navigating away and reopened when returning.
- [ ] **Header Inspection:** Ensure `Cache-Control` is not set to `no-store`.
