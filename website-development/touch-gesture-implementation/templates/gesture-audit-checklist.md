# Touch Gesture Audit & Verification Checklist

Use this checklist to audit custom touch, pointer, and multi-touch gesture implementations across desktop and mobile devices.

---

## 1. CSS & Layout Mechanics

- [ ] **Declarative `touch-action` Configured:** Does the target element specify an appropriate CSS `touch-action` (`pan-y`, `pan-x`, `manipulation`, or `none`) matching the target gesture axis?
- [ ] **Text Selection Suppressed:** Is `user-select: none` (`-webkit-user-select: none`) applied to gesture targets to prevent unintended text highlight during drag?
- [ ] **Hardware Acceleration Active:** Are active drag transformations powered by GPU-accelerated CSS transforms (`transform: translate3d()` or `translateX()`) rather than layout-triggering properties (`top`, `left`, `margin`)?
- [ ] **`will-change` Isolation:** Is `will-change: transform` applied during active dragging and cleanly removed or managed to prevent memory bloat?

---

## 2. Pointer Capture & Lifecycle Integrity

- [ ] **Pointer Capture Invoked:** Is `element.setPointerCapture(e.pointerId)` invoked inside `pointerdown`?
- [ ] **Safe Capture Release:** Is `element.hasPointerCapture(e.pointerId)` checked before invoking `releasePointerCapture()` to prevent `DOMException` errors?
- [ ] **`pointercancel` Handled:** Is a dedicated listener attached for `pointercancel` that cleanly restores element position when system alerts, palm rejection, or app-switchers interrupt the gesture?
- [ ] **Memory Teardown via AbortSignal:** Are all event listeners bound with an `AbortSignal` or cleanly removed on component unmount to eliminate detached DOM retainers?

---

## 3. Axis Locking & Scroll Coexistence

- [ ] **Directional Intent Check:** Does the gesture controller verify whether initial movement is horizontal vs vertical before locking axis control?
- [ ] **Page Scroll Surrender:** If a user initiates a vertical page scroll on a horizontal swipeable card (`touch-action: pan-y`), does the JS cleanly release pointer capture and allow the browser to handle vertical scrolling?
- [ ] **No Diagonal Shaking:** Does axis locking prevent erratic diagonal element shaking when users drag with slight angle drift?

---

## 4. Velocity Flick & Thresholds

- [ ] **Instantaneous Velocity Tracking:** Is velocity calculated in units of `px/ms` using timestamped pointer coordinate deltas?
- [ ] **Flick Detection:** Does a rapid flick (<50px travel, speed >0.4 px/ms) complete the gesture action as expected?
- [ ] **Threshold Snap-Back:** If the user drags slowly below both distance (>100px) and velocity (>0.4 px/ms) thresholds, does the element smoothly animate back to its origin?

---

## 5. Multi-Touch Tracking (Pinch / Scale)

- [ ] **`pointerId` Map Storage:** Are active pointers tracked in a `Map<pointerId, PointerData>` rather than single global `x`/`y` variables?
- [ ] **Euclidean Distance Math:** Is multi-touch pinch scaling computed using `Math.hypot(x2 - x1, y2 - y1)`?
- [ ] **Scale Bounds Clamped:** Is the zoom scale clamped between reasonable min/max limits (e.g. 0.5x to 4.0x) to avoid inversion or extreme blowing up?
- [ ] **Focal Midpoint Tracking:** Is pinch zooming centered around the computed midpoint between the two active pointers?

---

## 6. Accessibility & Keyboard Fallbacks

- [ ] **Tab Focusable:** Is the swipeable or zoomable component keyboard focusable via `tabindex="0"` or native interactive element?
- [ ] **Keyboard Equivalence:** Are keyboard triggers (e.g. `ArrowLeft`/`ArrowRight`, `+`/`-`) bound to execute identical UI actions?
- [ ] **ARIA Roles & States:** Are appropriate ARIA attributes (`role="region"`, `aria-label`, `aria-valuenow` for sliders) present and updated dynamically?
- [ ] **Reduced Motion Respect:** Does the component inspect `prefers-reduced-motion: reduce` and disable spring animations when active?

---

## Audit Sign-off Matrix

| Test Scenario | Status | Verified Device / Engine | Notes / Defects |
| :--- | :--- | :--- | :--- |
| **Mobile Safari Vertical Scroll** | [ ] Pass | iOS Safari | |
| **Android Chrome Flick Swipe** | [ ] Pass | Chrome Mobile | |
| **Pointer Off-Screen Capture** | [ ] Pass | Desktop Chrome/Firefox | |
| **Keyboard Navigation** | [ ] Pass | Chrome + NVDA/VoiceOver | |
