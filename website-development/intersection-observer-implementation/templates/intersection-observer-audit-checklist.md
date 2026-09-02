# IntersectionObserver Audit Checklist

Use this checklist during code reviews, frontend optimization audits, and performance diagnostics to ensure correct `IntersectionObserver` usage, memory management, and layout stability.

## 1. Architectural & Pooling Checks
- [ ] **Observer Pooling**: Are identical `root`, `rootMargin`, and `threshold` configurations reused across elements rather than calling `new IntersectionObserver()` in a loop?
- [ ] **Zero Redundant Observers**: Verify total active `IntersectionObserver` instances stay under 5–10 per page session (inspectable via `IntersectionObserverManager` telemetry or heap snapshots).
- [ ] **Decoupled Handlers**: Are visibility callbacks kept lightweight without inline expensive layout recalculations (`getBoundingClientRect()`, `offsetWidth`)?

## 2. Configuration & Parameter Validation
- [ ] **Valid Units in `rootMargin`**: Ensure `rootMargin` strings explicitly contain units (`px` or `%`, e.g., `'200px 0px 100px 0px'`). Unitless values like `'200 0'` fail silently or throw syntax errors.
- [ ] **Pre-fetch Buffer Bounds**: Verify lazy loading or infinite scrolling uses appropriate pre-fetching margins (e.g., `200px` to `500px`) so content loads before entering visual range.
- [ ] **Custom Scroll Container Identification**: If target elements reside within a scrollable `div` (`overflow: auto` or `overflow: scroll`), is `root: containerElement` explicitly provided?
- [ ] **Threshold Granularity**: Ensure `threshold` matches the specific requirement (`0.0` for early detection, `0.5` for 50% visibility, `1.0` for full exposure, or array for progressive updates).

## 3. Callback Guarding & Lifecycle
- [ ] **Initial Execution Guard**: Does the callback explicitly verify `if (!entry.isIntersecting) return;` to avoid false triggers on page mount?
- [ ] **One-Shot Teardown (`observeOnce`)**: For lazy loaded media or entrance animations, is `.unobserve(target)` called immediately upon first intersection?
- [ ] **Memory Teardown on Component Unmount**: Are DOM elements unobserved (`.unobserve()`) or instances disconnected (`.disconnect()`) when SPA views change or nodes are removed from the DOM?

## 4. Layout & Visual Stability
- [ ] **Aspect Ratio Places**: Do deferred images/embeds have explicit CSS aspect ratios or dimensional placeholders to prevent Cumulative Layout Shift (CLS) when content renders?
- [ ] **Non-Zero Target Dimensions**: Ensure target elements are not hidden using `display: none` at the time of observation (use `opacity`, `visibility`, or dimensions > 0).
- [ ] **Paint & Layout Isolation**: Verify threshold state toggles add/remove CSS classes rather than triggering direct synchronous layout thrashing.
