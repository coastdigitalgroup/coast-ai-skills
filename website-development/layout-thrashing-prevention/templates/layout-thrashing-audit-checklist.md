# Layout Thrashing Audit Checklist

Use this diagnostic checklist to audit, identify, and eliminate forced synchronous layouts (layout thrashing) in web application interactions.

---

## 1. DevTools Performance Profiling

- [ ] **Record Performance Profile:**
  - Open Chrome DevTools > **Performance** tab.
  - Enable **Screenshots** and CPU throttling (e.g., 4x or 6x CPU slowdown to amplify layout bottlenecks).
  - Record the interactive scenario (scrolling, expanding cards, dragging, resizing).
- [ ] **Identify Warning Markers:**
  - Look for red warning triangles on task blocks in the **Main** thread track.
  - Search for **"Forced reflow is a likely performance bottleneck"** or **"Recalculate Style"** entries inside event handlers.
- [ ] **Verify Frame Rate Consistency:**
  - Check the **FPS** track for sharp dips (valleys dropping below 30 FPS).
  - Open Rendering tab (`Cmd+Shift+P` > **Show Rendering**) and enable **FPS meter** during interaction testing.

---

## 2. Code Pattern Inspection

- [ ] **Interleaved Loop Audit:**
  - Audit loops (`forEach`, `for`, `map`) containing DOM references.
  - Ensure no layout-triggering properties (`offsetHeight`, `clientWidth`, `getBoundingClientRect()`, `scrollTop`) are read AFTER style mutations (`element.style.*`, `classList.add()`, `appendChild()`) in the same loop iteration.
- [ ] **Class List Mutation Checks:**
  - Verify that adding/removing CSS classes is done in batch write passes.
  - Check that code does not read computed styles (`getComputedStyle()`) immediately after a class toggle.
- [ ] **High-Frequency Event Listener Audit:**
  - Check `scroll`, `resize`, `pointermove`, and `touchmove` handlers.
  - Confirm high-frequency handlers use `{ passive: true }` when scroll blocking is not required.
  - Confirm handlers use `requestAnimationFrame` flag debouncing or `IntersectionObserver` instead of raw layout queries.

---

## 3. Architecture & Refactoring Verification

- [ ] **Two-Pass Decoupling:**
  - All DOM geometric measurements across the component tree are completed in Phase 1 (Reads).
  - All DOM style and structure mutations are deferred to Phase 2 (Writes).
- [ ] **Layout Caching:**
  - Static bounds (container dimensions, offset top/left) are cached on window resize or initial render rather than queried on every frame.
- [ ] **Compositor Animation Isolation:**
  - Visual movements/animations use CSS `transform` and `opacity` instead of `width`, `height`, `top`, or `left`.
  - Animating elements utilize `will-change: transform` or WAAPI where appropriate without over-allocating GPU layers.

---

## 4. Post-Fix Verification Rules

- [ ] **Single Layout per Frame:**
  - Confirm DevTools trace shows at most **one** Layout / Recalculate Style event per animation frame (16.6ms at 60Hz).
- [ ] **Frame Execution Budget:**
  - Confirm main thread script execution + layout calculation completes within **< 10ms** per frame.
