# WAAPI Animation Implementation Audit Checklist

Use this audit checklist to review and verify Web Animations API (WAAPI) implementations across frontend projects.

---

## 1. Performance & Compositor Verification

- [ ] **Compositor Property Restriction:** Are keyframe properties limited strictly to hardware-accelerated properties (`transform`, `opacity`, `filter`, `backdrop-filter`)?
- [ ] **No Layout Reflow Triggering:** Are non-composited geometry properties (e.g., `width`, `height`, `left`, `top`, `margin`, `padding`, `flex`) excluded from animated keyframes?
- [ ] **Paint Flashing Check:** With Chrome DevTools **Rendering > Paint Flashing** enabled, do animated elements avoid triggering green paint flashing boxes during active playback?
- [ ] **Layer Promotion (`will-change`):** Is `will-change: transform` or `opacity` applied only during motion and removed afterwards to avoid GPU layer memory explosion?

---

## 2. Memory & Style Cascade Management

- [ ] **`commitStyles()` & `cancel()` Cleanups:** If `fill: 'forwards'` or persistent state changes are used, does the animation lifecycle await `animation.finished`, invoke `animation.commitStyles()`, and call `animation.cancel()`?
- [ ] **DevTools Animations Inspector Audit:** In Chrome DevTools **Animations** panel, verify that completed or discarded animations do not accumulate endlessly in the stack.
- [ ] **SPA Navigation / Component Unmount Cleanup:** Are active animations tracked and explicitly cancelled (`animation.cancel()`) when components or SPA views unmount?

---

## 3. FLIP (First, Last, Invert, Play) Layout Transitions

- [ ] **Synchronous DOM Reading/Writing:** Are `getBoundingClientRect()` reads performed before any DOM mutation (First), followed immediately by the DOM mutation (Last), to avoid layout thrashing?
- [ ] **Delta Thresholding:** Are animations skipped for elements where positional change (`dx === 0 && dy === 0`) is sub-pixel or zero?
- [ ] **Scale Distortion Countermeasures:** If FLIP involves scale changes (`dw`, `dh`), are inner text nodes or images counter-scaled or masked to avoid visual stretching?

---

## 4. Accessibility & User Preferences

- [ ] **`prefers-reduced-motion` Enforcement:** Does the implementation inspect `window.matchMedia('(prefers-reduced-motion: reduce)')` and disable or collapse animation duration to `0` for users with motion sensitivity?
- [ ] **Focus Management During Transitions:** If interactive buttons or inputs are moved via FLIP, does keyboard focus (`document.activeElement`) remain stable and visible?
- [ ] **Non-Distracting Motion:** Are playback durations kept short (200ms–500ms) for UI feedback and user interactions?

---

## 5. Timeline Control & Asynchronous Lifecycle

- [ ] **Native Promise Usage:** Are sequence chains and completion handlers managed via `await animation.finished` or `animation.ready` instead of nested legacy event listeners?
- [ ] **Cancellation & Rejection Handling:** Are `animation.finished` promises wrapped in `.catch()` or `try/catch` blocks to gracefully catch `AbortError` or explicit `cancel()` calls?
- [ ] **Playback Rate Verification:** When dynamically adjusting `animation.playbackRate` or reversing (`animation.reverse()`), does the motion update seamlessly without visual teleporting?
