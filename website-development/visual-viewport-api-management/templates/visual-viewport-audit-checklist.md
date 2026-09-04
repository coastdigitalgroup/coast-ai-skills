# Visual Viewport API Audit Checklist

Use this checklist to audit mobile web applications for software keyboard bugs, layout detachment, obscured input fields, and pinch-zoom positioning issues.

---

## 1. Viewport Meta Configuration

- [ ] **Viewport Meta Tag Included:** `<meta name="viewport">` tag is defined in `<head>`.
- [ ] **Hardware Inset Coverage:** `viewport-fit=cover` is declared to handle notches and rounded screen corners.
- [ ] **Interactive Widget Strategy:** `interactive-widget` property is configured (e.g., `interactive-widget=resizes-visual` or `interactive-widget=resizes-content`).
- [ ] **Input Font Sizing:** Form `<input>` and `<textarea>` elements use `font-size: 16px` (or equivalent) to prevent iOS Safari auto-zoom on focus.

---

## 2. API & Controller Architecture

- [ ] **Feature Detection:** JS code checks `'visualViewport' in window` before binding listeners.
- [ ] **Dual Event Listeners:** Event listeners are attached to *both* `resize` and `scroll` events on `window.visualViewport`.
- [ ] **Orientation Handling:** Listener attached to `orientationchange` on `window` to recalculate metrics when screen flips.
- [ ] **iOS Offset Calculation:** Keyboard height calculation incorporates `vv.offsetTop` (`window.innerHeight - vv.height - vv.offsetTop`).
- [ ] **Frame Batching:** Viewport state updates are throttled using `requestAnimationFrame()`.
- [ ] **Lifecycle Teardown:** `disconnect()` method cleanly removes event listeners on component unmount.

---

## 3. CSS Positioning & Animation Performance

- [ ] **High-Performance Transforms:** Fixed bottom bars use `transform: translateY(...)` rather than layout-triggering properties (`height`, `bottom`, `margin-bottom`).
- [ ] **Compositor Promotion:** Transformed elements use `will-change: transform`.
- [ ] **Transition Easing:** Soft-keyboard docking transition uses a lightweight duration (`100ms - 150ms`) to sync with mobile keyboard animation curves.
- [ ] **Cumulative Safe Areas:** Bottom padding combines hardware safe areas with keyboard offsets (`padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px))`).
- [ ] **Scale Inversion:** Fixed elements retain constant visual sizing during pinch-zoom using inverse scaling (`scale(calc(1 / var(--vv-scale)))`).

---

## 4. Cross-Platform Device Verification

- [ ] **iOS Safari Soft-Keyboard Test:** Tap an input at the bottom of the screen. Confirm docked toolbars sit directly above the keyboard top edge.
- [ ] **iOS Safari Scroll Bleed Check:** Focus an input and attempt to drag non-scrollable areas. Confirm layout viewport does not detach or scroll off-screen.
- [ ] **Android Chrome Test:** Open and close virtual keyboard. Verify layout updates smoothly without flash or double-resize.
- [ ] **Keyboard Dismiss Verification:** Tap outside or tap the keyboard dismiss key. Confirm docked elements return to screen bottom without whitespace gaps.
- [ ] **Landscape Mode Test:** Rotate device to landscape and bring up soft keyboard. Confirm active input remains in visual viewport frame.
