---
name: intersection-observer-implementation
description:
  Observe element scroll visibility, viewport entry/exit boundaries, and target intersection ratios using IntersectionObserver, singleton observer pooling, rootMargin pre-fetching, threshold configuration, and memory leak prevention.
---

# IntersectionObserver Implementation

## Purpose

The IntersectionObserver Implementation skill provides a production-grade framework for detecting, measuring, and acting on the spatial intersection of DOM elements relative to a top-level viewport or ancestor scroll container. Replacing costly synchronous `scroll` and `resize` event listeners (which call `getBoundingClientRect()` on the main thread and trigger severe layout thrashing), `IntersectionObserver` delivers asynchronous, compositor-driven visibility tracking. This skill establishes resilient architectural patterns for configuring `root`, `rootMargin`, and `threshold` options, building high-throughput singleton observer pools, managing dynamic target lifecycles with `WeakMap` and `AbortSignal`, avoiding sub-pixel threshold misses, and handling fallback behaviors gracefully.

## Use Cases

- **Viewport Entry & Exit Detection:** Triggering animations, tracking ad impressions, or playing/pausing media elements (e.g., video/audio) as elements enter or leave the visible scroll view.
- **Pre-Fetching & Lazy Resource Loading:** Preloading heavy media assets (images, webp/avif, videos, scripts, iframe embeds) before they enter the user's viewport by configuring expanded `rootMargin` buffers.
- **Scroll Position Tracking & Active State Synchronization:** Updating active table-of-contents navigation links, sticky header title overlays, or slide pagination indicators based on section intersection ratios.
- **Infinite Scrolling & Sentinel Pagination:** Fetching subsequent pages of data when a sentinel element at the bottom of a scrollable feed intersects with the viewport bottom margin.
- **Impression Analytics & Visibility Dwell Time:** Measuring precisely how long an element remains visible at target threshold percentages (e.g., 50% visible for >1 second) for privacy-compliant telemetry and analytics.

## When NOT to Use

- **Element Box Dimension Changes:** When measuring internal layout size changes (width/height) of an element independently of viewport scrolling. Use `ResizeObserver` instead (`resize-observer-implementation`).
- **Pure CSS Layout Transitions:** Simple hover state transitions, static layout styling, or fixed position styling that can be achieved purely with CSS `@media` or `@container` queries.
- **DOM Node Addition / Removal:** Observing structural changes in the DOM tree, node insertions, or attribute modifications. Use `MutationObserver` instead.
- **Native Image Lazy Loading:** Standard content images (`<img loading="lazy">`) where native browser lazy loading is sufficient and does not require custom pre-fetch callbacks or animated reveal transitions.

## Inputs

1. **Target Elements:** One or more DOM nodes (`HTMLElement`, `SVGElement`) whose visibility or intersection state must be tracked.
2. **Scroll Root Target (`root`):** The ancestor `Element` or `Document` used as the bounding viewport box (defaults to browser viewport if `null`).
3. **Viewport Buffer Margins (`rootMargin`):** Spatial offset string formatted like CSS margins (`"200px 0px 400px 0px"`) to expand or contract the intersection root bounding box.
4. **Ratio Thresholds (`threshold`):** A single number or array of numbers between `0.0` and `1.0` indicating at what intersection percentages callbacks should execute.
5. **Intersection Callback:** A function receiving `(entries, observer)` invoked when a target element crosses any specified threshold boundary.
6. **Lifecycle Abort Signal:** An optional `AbortSignal` for automated observer unregistering on component teardown.

## Outputs

1. **Compositor-Scheduled Visibility Callbacks:** Execution of visibility handlers outside the synchronous layout phase, preventing main-thread scroll jank.
2. **Normalized `IntersectionObserverEntry` Datasets:** Direct access to `isIntersecting`, `intersectionRatio`, `boundingClientRect`, `rootBounds`, and `intersectionRect`.
3. **Singleton Observer Registry:** A shared, memory-optimized observer pool grouping targets by identical `{ root, rootMargin, threshold }` key signatures.
4. **Deterministic Teardown & Clean Lifecycle:** Zero-leak target unobservation and observer instance cleanup tied to component unmounting or DOM removal.

## Workflow

### 1. Select and Validate the Intersection Root

Determine whether observation is relative to the top-level window viewport or a custom scrollable container.

- **Window Viewport (Default):** Set `root: null`. Ensure the target is a descendant of the document.
- **Custom Container:** Pass an `HTMLElement` reference. **Crucial:** The root element MUST be an ancestor of the target element, and MUST have CSS scroll overflow (`overflow: auto`, `overflow: scroll`, or `overflow-y: auto`).

```javascript
// Validating custom root ancestry
function isValidRoot(target, root) {
  if (!root) return true; // Null defaults to top-level viewport
  return root.contains(target);
}
```

### 2. Configure `rootMargin` and `threshold` Options

Set thresholds and margins matching the exact design intent:

- **Pre-loading (Lazy Media):** Use positive pixel margins (`"300px 0px"`) with a zero threshold (`threshold: 0`). This triggers callbacks *before* the element physically touches the visible screen.
- **Impression Tracking:** Use percentage thresholds (`threshold: [0, 0.5, 1.0]`) with zero margins (`"0px"`).
- **Scrollspy / Section Tracking:** Use negative top/bottom margins (e.g., `"-20% 0px -70% 0px"`) to restrict active detection to a focused horizontal band in the middle of the screen.

```javascript
const lazyLoadOptions = {
  root: null,
  rootMargin: '200px 0px 400px 0px', // Top Right Bottom Left
  threshold: 0
};
```

### 3. Implement a Shared Singleton Observer Pool

Instantiating multiple `IntersectionObserver` instances with identical options creates unnecessary internal browser overhead. Group observer targets by options signature using a Singleton Manager pattern.

```javascript
class SharedIntersectionObserverPool {
  constructor() {
    this.pool = new Map(); // key -> { observer, targets: WeakMap }
  }

  getOptionKey(options = {}) {
    const rootId = options.root ? (options.root.id || (options.root.__id = Math.random().toString(36).substring(2))) : 'viewport';
    const margin = options.rootMargin || '0px';
    const threshold = Array.isArray(options.threshold)
      ? options.threshold.join(',')
      : (options.threshold ?? 0);
    return `${rootId}|${margin}|${threshold}`;
  }

  observe(target, callback, options = {}) {
    if (!target) return () => {};

    const key = this.getOptionKey(options);
    let entry = this.pool.get(key);

    if (!entry) {
      const callbacks = new WeakMap();
      const observer = new IntersectionObserver((entries, obs) => {
        for (const item of entries) {
          const cb = callbacks.get(item.target);
          if (cb) {
            cb(item, obs);
          }
        }
      }, {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold ?? 0
      });

      entry = { observer, callbacks, count: 0 };
      this.pool.set(key, entry);
    }

    entry.callbacks.set(target, callback);
    entry.observer.observe(target);
    entry.count++;

    const unobserve = () => {
      if (entry.callbacks.has(target)) {
        entry.callbacks.delete(target);
        entry.observer.unobserve(target);
        entry.count--;

        if (entry.count === 0) {
          entry.observer.disconnect();
          this.pool.delete(key);
        }
      }
    };

    if (options.signal) {
      options.signal.addEventListener('abort', unobserve, { once: true });
    }

    return unobserve;
  }
}

export const intersectionPool = new SharedIntersectionObserverPool();
```

### 4. Process Intersection Entries Defensively

Inside the observer callback, check `entry.isIntersecting` rather than testing `entry.intersectionRatio > 0`. Due to browser floating-point rounding, an element positioned on a pixel edge may report `intersectionRatio = 0` while `isIntersecting = true` (or vice versa).

```javascript
intersectionPool.observe(
  imageElement,
  (entry, observer) => {
    // Rely on isIntersecting for reliable boolean visibility check
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      // Unobserve target after single-use trigger (lazy loading)
      observer.unobserve(img);
    }
  },
  { rootMargin: '300px 0px', threshold: 0 }
);
```

### 5. Provide Graceful Fallbacks for Legacy Environments

While `IntersectionObserver` is supported in all modern browsers (97%+ global support), fallback logic ensures content accessibility in constrained webview environments or old browsers.

```javascript
function observeWithFallback(target, callback, options = {}) {
  if ('IntersectionObserver' in window) {
    return intersectionPool.observe(target, callback, options);
  }

  // Graceful fallback: trigger callback immediately on next frame
  const timer = setTimeout(() => {
    const fakeEntry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1.0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: performance.now()
    };
    callback(fakeEntry, null);
  }, 16);

  return () => clearTimeout(timer);
}
```

## Decision Rules

- **Root Selection:**
  - **`root: null`:** Always select when observing elements relative to the primary document window scrollbar.
  - **`root: containerElement`:** Select ONLY when observing target elements contained inside an inner overflow container (`overflow-y: scroll` or `auto`).
- **Margin Syntax:**
  - **Pixel Units (`px`):** Always use fixed pixels for preloading buffers (e.g. `200px 0px 400px 0px`) to guarantee pre-fetching happens fixed distances ahead of user scroll regardless of viewport height.
  - **Percentage Units (`%`):** Use percentages (e.g. `-30% 0px -50% 0px`) when creating relative viewport scroll zones (e.g. scrollspy reading triggers).
  - **Unit Requirement:** Never omit units for non-zero `rootMargin` values. Writing `rootMargin: '200'` will fail silently or throw a `DOMException`. Write `rootMargin: '200px'`.
- **Threshold Arrays:**
  - **`threshold: 0`:** Default for lazy loading, entrance detection, and infinite scroll triggers.
  - **`threshold: 0.5`:** Use for media auto-play/pause or 50% visibility telemetry rules.
  - **`threshold: [0, 0.25, 0.5, 0.75, 1.0]`:** Use when tracking smooth progressive animation progress or dynamic opacity transitions based on exact intersection ratio.

## Constraints

- **Ancestor Containment Rule:** An element set as `root` MUST be an ancestor of all observed `target` elements. If the target is not in the DOM hierarchy of the root element, zero intersections will be recorded.
- **Scroll Container CSS:** If a custom `root` element lacks `overflow: scroll`, `overflow: auto`, or `position: relative/absolute/fixed` clip bounds, intersection calculations will fall back unexpectedly or evaluate against document bounds.
- **Sub-Pixel Threshold Precision:** Never rely on exact floats like `entry.intersectionRatio === 1.0` to detect 100% visibility. Modern display DPI scaling often yields maximum ratios of `0.998` or `0.999`. Use `entry.intersectionRatio >= 0.99` or check `entry.isIntersecting`.
- **Display `none` Behavior:** When an observed element or any of its parent containers receives CSS `display: none`, `isIntersecting` immediately transitions to `false` and `intersectionRatio` becomes `0`.
- **Initial Notification Execution:** `IntersectionObserver` ALWAYS executes its callback asynchronously once immediately after `observe(target)` is called, reporting the target's current initial intersection state. Handlers must account for this initial call.

## Non-Goals

- Replacing `ResizeObserver` for measuring DOM element bounding box pixel dimension changes.
- Handling scroll smooth-scrolling animation physics (e.g. programmatic `window.scrollTo` smooth easing).
- Observing element attribute mutations or DOM child insertion/removal (`MutationObserver`).

## Common Failure Patterns

- **Syntax Error in `rootMargin`:** Writing `rootMargin: '100px'` without specifying all four margins or omitting units (e.g. `'100'`). `rootMargin` requires valid CSS margin format with explicit units (`'100px 0px 100px 0px'` or `'100px'`).
- **Target Not Descendant of Custom Root:** Registering a target with `{ root: myDiv }` when `myDiv` is not an ancestor of `target`. The observer will never trigger `isIntersecting = true`.
- **Memory Leaks in Single Page Applications:** Calling `observer.observe(target)` inside React `useEffect`, Vue `onMounted`, or Svelte `onMount` without returning an unobserve cleanup function. The DOM elements remain referenced in memory.
- **Creating One Observer per Target:** Instantiating `new IntersectionObserver()` inside a loop for 500 list items instead of using a single pooled instance. This creates severe memory footprint overhead and background thread starvation.
- **Using `intersectionRatio > 0` Instead of `isIntersecting`:** Writing `if (entry.intersectionRatio > 0)` which breaks on zero-height elements or sub-pixel edge boundaries where `intersectionRatio` evaluates to `0` even when intersecting.

## Validation Steps

- [ ] **Console Inspection:** Open Browser DevTools Console during fast scrolling and verify zero `DOMException` or `TypeError` logs occur due to malformed `rootMargin` strings.
- [ ] **Memory & Teardown Audit:** Dynamically add and remove observed target elements in the application. Inspect Memory Heap Snapshots to confirm detached DOM nodes are properly garbage collected.
- [ ] **Network Pre-Fetch Audit:** Inspect the DevTools Network panel while scrolling down a page. Confirm lazy assets (images/scripts) begin downloading before entering the visible viewport when using positive `rootMargin`.
- [ ] **Custom Root Verification:** If using a custom scroll container `root`, verify that scrolling *inside* that container triggers intersection entries while window scrolling does not trigger false positives.
- [ ] **High-DPI / Zoom Resilience:** Zoom browser scale to 125% and 150%. Verify threshold callbacks still trigger reliably without hanging at sub-pixel values (e.g., `0.999`).
