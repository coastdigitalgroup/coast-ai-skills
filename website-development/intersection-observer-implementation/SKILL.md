---
name: intersection-observer-implementation
description:
  Architect, implement, and optimize element visibility detection using IntersectionObserver with singleton observer pooling, threshold math, rootMargin pre-fetching, dynamic container support, and memory leak prevention.
---

# Intersection Observer Implementation

## Purpose

The Intersection Observer Implementation skill provides a production-grade framework for detecting, measuring, and acting on element scroll visibility, viewport boundaries, and target intersection ratios using the browser's native `IntersectionObserver` API.

It solves critical performance degradation and functional bugs caused by legacy scroll event listeners (`window.addEventListener('scroll')`, `getBoundingClientRect()`), unoptimized multi-observer instantiation, missed initial firing callbacks, incorrect `rootMargin` pre-fetching bounds, and memory leaks from uncleaned observers on detached DOM nodes.

---

## Use Cases

- **Viewport Telemetry & Impression Tracking:** Recording accurate ad impressions, article reading progress, or product tile visibility metrics when an element stays in view for a minimum dwell time.
- **Lazy Media & Subtree Loading:** Deferring high-cost image loading, iframe embeds, video playback initialization, or heavy DOM component rendering until elements near the viewport threshold.
- **Scroll-Aware Navigation & Header Docks:** Highlighting table-of-contents headings, updating active navigation indicators, or changing header docked states as page sections cross viewport thresholds.
- **Infinite Scrolling & Paginated Feeds:** Triggering automated data fetching when a bottom "sentinel" element comes within a pre-fetched distance (`rootMargin`) of the viewport edge.
- **Animate-on-Scroll & Visual Effects:** Triggering entrance animations, sticky dock transitions, or audio auto-pause/resume based on explicit intersection thresholds.

---

## When NOT to Use

- **High-Frequency Continuous Layout Calculations:** Animating smooth, frame-by-frame 60fps/120fps transforms tied directly to scroll distance pixel values. Use CSS Scroll-Driven Animations or Web Animations API with `requestAnimationFrame` instead.
- **Container Box Sizing & Element Resizing:** Detecting element dimension changes or border-box resizes independent of viewport scroll. Use `ResizeObserver` instead.
- **DOM Structure & Attribute Mutations:** Monitoring element attribute changes or DOM tree insertion/deletion. Use `MutationObserver` instead.
- **Native Image/Iframe Lazy Loading:** Basic image or iframe lazy loading where standard browser native loading suffices (`<img loading="lazy">`). Use `IntersectionObserver` only when custom fallback logic, placeholder crossfading, or analytics telemetry is required.

---

## Inputs

1. **Target DOM Elements:** HTMLElement or NodeList instances to monitor for viewport or scroll container intersection.
2. **Observer Configuration Options (`IntersectionObserverInit`):**
   - `root`: Root element ancestor or null (defaults to top-level document viewport).
   - `rootMargin`: Margin string around the root (e.g., `'200px 0px 200px 0px'` for pre-fetching).
   - `threshold`: Single number or array of thresholds (e.g., `0.0`, `0.5`, `1.0` or `Array.from({ length: 101 }, (_, i) => i / 100)`).
3. **Visibility Callbacks:** Callback functions receiving `IntersectionObserverEntry` objects and the observer instance itself.
4. **Lifecycle Hooks:** Component mount, dynamic item update, and unmount cleanup signals (e.g., `AbortSignal` or explicit `.unobserve()` / `.disconnect()`).

---

## Outputs

1. **Singleton Observer Manager / Pool:** Centralized JavaScript controller that reuses `IntersectionObserver` instances based on identical configuration options, preventing memory bloat.
2. **Intersection State Handlers:** Clean, decoupled callback invocations providing `isIntersecting`, `intersectionRatio`, `boundingClientRect`, and `target` context.
3. **Automated Lifecycle & Cleanup Handlers:** Automatic unobservation on entry trigger (one-shot observers) or teardown when target nodes are removed from the DOM.

---

## Workflow

### 1. Configure the Observer Parameters Correctly
Select `root`, `rootMargin`, and `threshold` based on the operational goal:

- **Pre-fetching / Lazy Loading:** Use `rootMargin: '300px 0px 300px 0px'` with `threshold: 0` so assets load before scrolling into visible range.
- **Impression Tracking / Dwell Time:** Use `threshold: 0.5` (50% visible) or `threshold: 1.0` (100% visible) with `rootMargin: '0px'`.
- **Active Navigation / Header Docks:** Use a multi-threshold array (e.g., `[0, 0.25, 0.5, 0.75, 1.0]`) or negative top `rootMargin` to account for sticky headers (e.g., `rootMargin: '-80px 0px -50% 0px'`).

```javascript
// Example: Pre-fetching configuration for infinite scroll sentinel
const sentinelConfig = {
  root: null, // Default: Browser viewport
  rootMargin: '0px 0px 400px 0px', // Trigger 400px before reaching bottom
  threshold: 0.0
};
```

### 2. Implement Observer Pooling / Singleton Architecture
Instantiating a new `IntersectionObserver` instance for every single card or list item in a high-density page (e.g., 1,000 items) creates massive object allocation overhead. Group observers by their configuration key.

```javascript
class IntersectionPool {
  static observers = new Map();

  static getObserver(options, callback) {
    const key = JSON.stringify({
      root: options.root ? options.root.id || 'custom-root' : 'viewport',
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0
    });

    if (!this.observers.has(key)) {
      const targets = new Map();
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          const targetCb = targets.get(entry.target);
          if (targetCb) targetCb(entry, obs);
        });
      }, options);

      this.observers.set(key, { observer, targets, refCount: 0 });
    }

    const instance = this.observers.get(key);

    return {
      observe(element, cb) {
        if (!instance.targets.has(element)) {
          instance.targets.set(element, cb);
          instance.observer.observe(element);
          instance.refCount++;
        }
      },
      unobserve(element) {
        if (instance.targets.has(element)) {
          instance.targets.delete(element);
          instance.observer.unobserve(element);
          instance.refCount--;
        }
      }
    };
  }
}
```

### 3. Handle the Initial Execution Firing Behavior
`IntersectionObserver` **always fires an initial entry callback** immediately upon invoking `.observe(target)`, regardless of whether the target is intersecting or not.

- Always check `entry.isIntersecting` inside the callback before performing enter actions.
- Do not assume `isIntersecting === true` on the first callback invocation.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // Crucial check: Guard against non-intersecting initial callbacks
    if (!entry.isIntersecting) {
      // Element is outside viewport
      entry.target.classList.remove('is-visible');
      return;
    }

    // Element entered viewport
    entry.target.classList.add('is-visible');
  });
});
```

### 4. Teardown and Memory Management
Prevent memory leaks when elements are removed from the DOM or when SPA views transition:

- Unobserve single-shot targets immediately after execution: `observer.unobserve(entry.target)`.
- Use `MutationObserver` or framework teardown hooks (e.g., `disconnectedCallback`, cleanup functions) to call `.unobserve()` or `.disconnect()`.

---

## Decision Rules

### Observer Configuration Matrix

| Task / Goal | Root Option | RootMargin Option | Threshold Option | Unobserve Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Lazy Loading Images / Embeds** | `null` (viewport) | `'200px 0px 200px 0px'` | `0.0` | **Immediate**: Unobserve right after trigger. |
| **Infinite Scroll Sentinel** | `null` or scroll container | `'0px 0px 400px 0px'` | `0.0` | **Persistent**: Stay observed until end-of-feed. |
| **Ad / Analytics Dwell Impression** | `null` (viewport) | `'0px'` | `0.5` or `1.0` | **Timer-based**: Trigger analytics after 1s continuous intersection. |
| **Animate-On-Scroll (Re-usable)** | `null` (viewport) | `'0px 0px -50px 0px'` | `0.15` | **Configurable**: Unobserve if trigger-once; stay observed if toggling. |
| **Sticky Section Navigation Sync** | `null` (viewport) | `'-80px 0px -60% 0px'` | `[0, 0.5, 1.0]` | **Persistent**: Continuously update active link state. |

---

## Constraints

- **Cross-Origin Iframe Clipping:** When observing elements inside cross-origin iframes, `root` must be set to `null` (viewport). Custom container `root` options will be ignored or cause security exceptions.
- **Percent Units in rootMargin:** `rootMargin` MUST be declared using px or % values (e.g., `'10px 0%'`). Pure numbers or unitless values (`'10 20'`) are invalid syntax and will fail silently or throw a `TypeError`.
- **Overflow Hidden Containers:** If target elements reside within an ancestor with `overflow: hidden` or `overflow: auto`, setting `root: null` still clips intersection detection at the scrolling ancestor boundary. If observing inside a scroll container, explicitly pass `root: scrollContainerElement`.
- **Zero-Height / Zero-Width Target Behavior:** Elements with `display: none` or dimensions of `0px x 0px` will register `isIntersecting: false`. If toggling visibility, use CSS opacity, visibility, or absolute positioning rather than `display: none`.

---

## Non-Goals

- Polyfilling `IntersectionObserver` for legacy browsers without W3C standard API support (e.g., IE11).
- Handling element border-box pixel resize measurements (use `ResizeObserver`).
- Handling direct user input scroll wheel / touch pan event manipulation.

---

## Common Failure Patterns

- **Creating One Observer Per Target:** Instantiating `new IntersectionObserver()` inside a `.forEach()` loop over hundreds of elements. This causes noticeable main-thread jank and excessive memory footprint.
- **Ignoring the Initial Callback:** Assuming `entry.isIntersecting` is `true` as soon as the observer callback fires. On page load, `IntersectionObserver` fires for all targets regardless of intersection state.
- **Invalid `rootMargin` Syntax:** Writing `rootMargin: '200'` or `rootMargin: '20px 10px'` (missing unit or incomplete 4-value/1-value shorthand). Browser parsing fails and falls back to `'0px'`.
- **Memory Leaks in SPAs:** Dynamically removing DOM nodes without calling `observer.unobserve(node)` or `observer.disconnect()`. Retained references prevent garbage collection of detached DOM elements.
- **Scroll Container Misconfiguration:** Observing items inside a custom scrollable `div` (`overflow-y: scroll`) without passing `root: containerElement`. The observer defaults to the main window viewport, leading to early/late false triggers.

---

## Validation Steps

### 1. Automated Unit & Lifecycle Testing
- [ ] Confirm `IntersectionObserver` instance creation reuses identical configurations via pooling.
- [ ] Verify `observer.unobserve(target)` is invoked for single-shot actions (lazy loading).
- [ ] Verify `observer.disconnect()` is called on component unmount or page destruction.

### 2. Manual Visual & Browser DevTools Audit
- [ ] **DevTools Rendering / Layer Inspection:** Open Chrome DevTools > Rendering > Paint Flashing. Confirm scroll intersections do not cause unnecessary full-page repaints.
- [ ] **Initial State Verification:** Reload page with targets out of view. Confirm no false `isIntersecting === true` logic runs on page initialization.
- [ ] **Custom Scroll Container Test:** Scroll inside modal dialogs or overflow containers and verify intersection triggers strictly within container bounds.
- [ ] **Memory Leak Audit:** Take a Heap Snapshot in Memory DevTools, trigger route navigations, force Garbage Collection, and confirm no detached target elements or observer closures are retained.
