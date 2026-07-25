# Browser Timers, Input Tracking Performance, and Page Visibility

This reference document details the technical behaviors, browser constraints, and optimization strategies required to build high-performance, resilient, and accurate client-side inactivity systems.

---

## 1. Browser Timer Throttling in Background Tabs

To maximize system battery life, minimize power consumption, and optimize CPU allocations, modern browsers implement aggressive scheduling constraints on background tabs (tabs that are hidden, minimized, or not actively focused).

### The Problem: Sequential Interval Degradation
If you use a simple sequential counter inside a `setInterval` or `setTimeout` loop, your countdown timer will fail when the tab is backgrounded:

```javascript
// DO NOT DO THIS
let secondsRemaining = 600;
setInterval(() => {
  secondsRemaining--; // Fails in background tabs!
  if (secondsRemaining <= 0) logout();
}, 1000);
```

- **Chrome / Chromium (Blink):** Active intervals in background tabs are clamped to a minimum of **1,000ms (1 second)**. If intensive page discarding or memory-saver modes are active, intervals may be throttled to **once per minute** or fully suspended.
- **Safari (WebKit):** Implements aggressive power-saving protocols. Background JS execution is clamped and intervals are heavily throttled or paused within seconds of tab visibility loss.
- **Firefox (Gecko):** Limits execution of timer tasks in background tabs to once per second, similar to Chromium.

If a user backgrounds a tab with 10 minutes left and returns 1 hour later, a sequential timer might have only executed 2 minutes' worth of decrements. The client UI will display "8 minutes remaining," while the backend session has been dead for 50 minutes.

### The Solution: Epoch Timestamp Delta Check
To bypass browser-level throttling, you must treat the timer as a **stateless, absolute timestamp check**:

1. When a user is active, compute and record a future absolute epoch timestamp:
   `expirationTime = Date.now() + idleThreshold`
2. Run a standard, non-blocking heartbeat check (e.g., every 500ms or 1,000ms).
3. On each tick, compute the remaining duration dynamically:
   `const remaining = expirationTime - Date.now();`

Even if the browser throttles the heartbeat execution to once per minute in the background, the absolute time comparison remains perfectly accurate. Upon return, the very first tick will instantly identify that `remaining <= 0` and enforce an immediate checkout.

---

## 2. Throttling Global Interaction Event Listeners

Capturing user interactions requires binding listeners to global events on `window` or `document`. If implemented carelessly, these listeners can destroy scrolling performance, cause input lag, and trigger rendering penalties.

### High-Frequency Interaction Events
Events like `mousemove`, `pointermove`, `scroll`, `touchmove`, and `wheel` fire continuously at the device's refresh rate (often 60Hz, 120Hz, or higher).
- Binding heavy JS calculations, DOM evaluations, or layout reads inside unthrottled handlers causes **Main Thread Contention**.
- The browser struggles to finish the handler before the next frame is requested, leading to visual stutter and bad **Interaction to Next Paint (INP)**.

### Performance Checklist for Input Listeners

1. **Passive Listeners (`{ passive: true }`):**
   When observing events like `scroll`, `touchstart`, or `wheel`, the browser normally has to wait for your JavaScript handler to complete to see if you call `event.preventDefault()` (which stops natural scrolling/pinching).
   By adding `{ passive: true }`, you programmatically guarantee you will never call `preventDefault()`. This allows the compositor thread to scroll the page immediately, eliminating lag.

   ```javascript
   window.addEventListener('scroll', handleActivity, { passive: true });
   ```

2. **Temporal Throttling Guard:**
   To reset the idle timer, you do not need to process every pixel of mouse movement. You only need to know *if* activity has occurred.
   A fast mathematical throttle prevents unnecessary executions:

   ```javascript
   let lastResetTime = 0;
   const THROTTLE_DELAY = 1000; // 1 second

   function handleActivity() {
     const now = Date.now();
     if (now - lastResetTime >= THROTTLE_DELAY) {
       lastResetTime = now;
       resetTimers(); // Execute heavy operations only once per second
     }
   }
   ```

---

## 3. Cross-Tab State Synchronization

A common UX bug is the "Tab Logout Loop": a user is actively writing an article in Tab A, but Tab B (which has been sitting idle) triggers a warning modal and automatically logs the user out, erasing the active draft in Tab A.

Synchronizing session life across all same-origin tabs resolves this.

### The BroadcastChannel API (Primary)
The `BroadcastChannel` API allows same-origin browser contexts (tabs, iframes, service workers) to easily broadcast messages to each other. It is lightweight, does not write to the physical disk, and avoids performance bottlenecks.

```javascript
// Setup sync channel
const channel = new BroadcastChannel('session_idle_channel');

// Broadcast activity
channel.postMessage({ type: 'activity_reset', timestamp: Date.now() });

// Receive activity
channel.onmessage = (event) => {
  if (event.data.type === 'activity_reset') {
    updateLocalTimer(event.data.timestamp);
  }
};
```

### LocalStorage Storage Event (Fallback)
For legacy browsers or locked down containerized webviews where `BroadcastChannel` is not supported, the `storage` event provides a great fallback.
Writing a value to `localStorage` triggers a `storage` event in **all other open tabs** of the same origin (it does not trigger in the tab that made the change).

```javascript
// Broadcast activity
localStorage.setItem('session_idle_sync', Date.now().toString());

// Receive activity in other tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'session_idle_sync') {
    const timestamp = parseInt(event.newValue, 10);
    updateLocalTimer(timestamp);
  }
});
```

*Note on performance:* Because `localStorage` is synchronous and writes to the system's disk, using it as a secondary fallback with a robust activity throttle (e.g. 1–2 seconds) is crucial to avoid system performance penalties.

---

## 4. Accessibility & The Timing Adjustable Directive (WCAG 2.2.1)

If your website contains a session timeout that can close or wipe data, WCAG Success Criterion **2.2.1 Timing Adjustable** (Level A) mandates that users must be able to turn off, adjust, or extend the time limit.

### Mandatory WCAG Requirements

1. **At Least 20 Seconds Extension Window:**
   The user must be warned at least 20 seconds before the session terminates, and be given an easy, accessible action (such as pressing `Space` or `Enter`) to extend the duration by at least ten times the default limit.
2. **Keyboard Focus Trap:**
   When the warning dialog pops up, it is an **alertdialog** (blocking modal). Focus must be programmatically pulled to the dialog's primary action button ("Extend Session"). Focus must be trapped inside using standard keyboard keydown routing, preventing the user from tabbing back onto the underlying inactive page.
3. **Focus Restoration:**
   If the user extends their session, the modal must close and focus must return exactly to the element that was focused *before* the modal appeared. This prevents screen reader users from losing their position on the page.
4. **No Visual-Only Countdown Warnings:**
   A visual ticking down clock is useless to blind or low-vision users. You must announce remaining times at logical intervals using a visually-hidden, screen-reader-only element decorated with `aria-live="assertive"`.
   *Announcement Interval Strategy:*
   - Announce once immediately when the modal opens (e.g. "Session will log out in 60 seconds").
   - Announce at 30 seconds.
   - Announce at 15 seconds.
   - Announce once every second for the final 5 seconds.
