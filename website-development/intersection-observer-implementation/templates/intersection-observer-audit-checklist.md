# IntersectionObserver Implementation Audit Checklist

Use this checklist during code reviews, performance audits, and refactoring to verify that `IntersectionObserver` implementations are performant, resilient, memory-safe, and accessible.

## 1. Options & Syntax Integrity

- [ ] **Valid `rootMargin` Units:** Are all non-zero `rootMargin` values specified with explicit length or percentage units (e.g., `'200px 0px'`, `'-10% 0px'`)? *(Omitting units like `'200'` causes silent failure or throws DOMException).*
- [ ] **Four-Value Margin Formatting:** Is `rootMargin` formatted cleanly using CSS margin shorthand rules (e.g. `'100px'` or `'100px 0px 200px 0px'`)?
- [ ] **Threshold Range Boundary:** Are all `threshold` values numbers strictly between `0.0` and `1.0` inclusive?
- [ ] **Sub-Pixel Precision Guard:** If checking for 100% visibility, does code avoid strict equality like `entry.intersectionRatio === 1` and instead test `entry.isIntersecting` or `entry.intersectionRatio >= 0.99`?

## 2. Ancestry & Container Scope

- [ ] **Custom Root Ancestry:** If a custom `root` element is supplied, is the observed `target` guaranteed to be a DOM descendant of that root element?
- [ ] **Container Scroll CSS:** Does the custom `root` element have an explicit height and CSS scroll overflow specified (`overflow: auto`, `overflow: scroll`, or `overflow-y: auto`)?
- [ ] **Hidden Ancestor Protection:** Is the callback designed to handle scenarios where parent containers have `display: none` (which forces `isIntersecting = false`)?

## 3. Performance & Memory Management

- [ ] **Observer Instance Pooling:** Are multiple elements with identical options sharing a pooled observer instance (or using `IntersectionObserverManager`) rather than instantiating `new IntersectionObserver()` inside a `map()` loop?
- [ ] **Single-Use Unobservation:** For lazyloading images or one-shot entrance animations, does the callback immediately invoke `unobserve(target)` upon first intersection?
- [ ] **Framework Lifecycle Teardown:** In Single Page Applications (React, Vue, Svelte), is unobservation bound to component unmount via `AbortSignal` or explicit cleanup handlers to prevent detached DOM memory leaks?
- [ ] **Main-Thread Mutation Safety:** Does the callback avoid heavy synchronous DOM mutations or layout-reading operations (`offsetWidth`, `getBoundingClientRect`) inside the intersection callback without wrapping them in `requestAnimationFrame()`?

## 4. Accessibility & Progressive Enhancement

- [ ] **Native Fallback:** Is there fallback handling (`'IntersectionObserver' in window`) for environments where the API is unavailable?
- [ ] **No Content Blocking:** If JavaScript is disabled or fails, is critical text content and media accessible (e.g. using `<noscript>` tags for images)?
- [ ] **Reduced Motion Support:** For scroll-reveal entrance animations triggered by intersection, are animations disabled or simplified when `prefers-reduced-motion: reduce` is active?

## 5. Telemetry & Edge Cases

- [ ] **Initial Callback Execution:** Does the handler account for the fact that `IntersectionObserver` fires an initial entry notification immediately upon target registration?
- [ ] **Zero-Height Target Handling:** Are zero-height sentinel elements (used in infinite scroll feeds) evaluated using `entry.isIntersecting` rather than `entry.intersectionRatio > 0`?
- [ ] **Fast Scroll Skipping:** Does pre-fetching use an adequate positive `rootMargin` buffer (e.g. `200px` to `400px`) so assets load smoothly even when users scroll rapidly?
