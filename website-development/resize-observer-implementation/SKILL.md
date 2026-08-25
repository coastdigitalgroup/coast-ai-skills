---
name: resize-observer-implementation
description:
  Observe, measure, and respond to element box-model dimension changes using
  ResizeObserver, requestAnimationFrame batching, devicePixelContentBoxSize, and loop error prevention.
---

# ResizeObserver Implementation

## Purpose

The ResizeObserver Implementation skill provides a production-grade framework for detecting, measuring, and responding to DOM element box-model dimension changes in real time. Unlike global `window.onresize` event handlers—which only fire when the top-level viewport changes size—`ResizeObserver` monitors individual element bounding boxes. This skill establishes resilient architectural patterns for element sizing, handling box-model options (`contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`), preventing `ResizeObserver loop completed with undelivered notifications` browser warnings, batching layout reads with `requestAnimationFrame`, building a singleton observer manager for mass DOM target trees, and managing clean lifecycle teardowns with `AbortSignal` and `WeakMap`.

## Use Cases

- **Responsive Data Visualizations & HTML5 Canvas:** Dynamically updating chart aspect ratios, SVG viewBox values, or canvas backing store pixel dimensions when container cards resize without triggering full page layout re-evaluation.
- **Component Container Monitoring:** Re-calculating component micro-layouts, custom data table auto-column widths, dynamic dropdown position offsets, or split-pane boundaries when drawers, accordions, or sidebars expand/collapse.
- **High-DPI Canvas Sharpness:** Using `devicePixelContentBoxSize` to match canvas drawing buffer resolution to physical screen device pixels, eliminating blurry text and anti-aliasing artifacts on high-DPI displays.
- **Decoupled Web Components & Component Libraries:** Monitoring element dimensions internally within isolated component boundaries without depending on global window resize listeners or parent framework layout hooks.
- **Text & UI Container Overflow Tracking:** Triggering dynamic layout changes (e.g. toggling compact button groups, expanding sub-nav bars, or recalculating truncated badges) when container boundaries expand or shrink.

## When NOT to Use

- **Pure CSS Layout Adaptations:** When responsive changes can be handled declaratively using CSS `@media` queries, `@container` queries, Flexbox `flex-wrap`, or CSS Grid `minmax()`. Always prefer pure CSS before introducing JavaScript layout observers.
- **Viewport Scroll or Visibility Detection:** When detecting whether an element has entered or exited the user's visible viewport. Use `IntersectionObserver` instead (or `lazy-loading-implementation` / `scroll-reveal-implementation`).
- **Static Content Without Dimensional Changes:** Fixed-width or non-interactive page elements that never change size after initial document load and hydration.
- **Global Window-Only Spatial Changes:** Interactions that depend solely on full window viewport dimensions (e.g. mobile navigation overlay toggles), where standard `window.matchMedia()` or `@media` rules are sufficient.

## Inputs

1. **Target Elements:** One or more DOM elements (`HTMLElement`, `SVGElement`, `HTMLCanvasElement`) whose size changes must be monitored.
2. **Box Model Target (`box`):** The spec box model layer to observe:
   - `'content-box'` (default): Inner content area excluding padding, borders, and margins.
   - `'border-box'`: Total visible box size including padding and borders (excluding margins).
   - `'device-pixel-content-box'`: Content area measured in physical device pixels (for crisp canvas rendering).
3. **Resize Callback Function:** The handler function that processes array entries (`ResizeObserverEntry[]`) containing updated dimensions.
4. **Lifecycle Control / AbortSignal:** An optional `AbortSignal` or unmount handle to tear down observations when components unmount.

## Outputs

1. **Frame-Batched Size Callbacks:** Execution of dimension update handlers synchronized with `requestAnimationFrame` to eliminate layout thrashing and loop-limit warnings.
2. **Normalized Box Measurements:** Reliable extraction of `inlineSize` and `blockSize` across modern array-based `ResizeObserverEntry` properties with legacy `contentRect` fallbacks.
3. **Singleton Observer Registry:** A memory-efficient, shared `ResizeObserver` instance managing observations across multiple component targets.
4. **Clean Lifecycle Disconnects:** Zero-leak unobservation or observer detachment tied to DOM node removal.

## Workflow

### 1. Configure the Box Model Observation Strategy

Determine which box model layer matches the element's operational requirements:
- Use `'border-box'` for layout containers, cards, and UI components where border and padding affect total space.
- Use `'content-box'` when measuring available inner room for child elements or text flow.
- Use `'device-pixel-content-box'` strictly for `<canvas>` elements to prevent sub-pixel scaling blur.

```javascript
const observerOptions = {
  box: 'border-box' // 'content-box' | 'border-box' | 'device-pixel-content-box'
};
```

### 2. Extract Dimensions Safely Across Browser Engines

Modern browser engines return `contentBoxSize`, `borderBoxSize`, and `devicePixelContentBoxSize` as frozen arrays of `ResizeObserverSize` objects (to support multi-segment fragmented layout boxes). Fall back to `contentRect` for older browser engines.

```javascript
function getElementDimensions(entry, boxType = 'border-box') {
  // 1. Modern spec: arrays of ResizeObserverSize
  if (boxType === 'border-box' && entry.borderBoxSize?.length) {
    return {
      width: entry.borderBoxSize[0].inlineSize,
      height: entry.borderBoxSize[0].blockSize
    };
  }

  if (boxType === 'device-pixel-content-box' && entry.devicePixelContentBoxSize?.length) {
    return {
      width: entry.devicePixelContentBoxSize[0].inlineSize,
      height: entry.devicePixelContentBoxSize[0].blockSize
    };
  }

  if (entry.contentBoxSize?.length) {
    return {
      width: entry.contentBoxSize[0].inlineSize,
      height: entry.contentBoxSize[0].blockSize
    };
  }

  // 2. Legacy fallback: contentRect (always content-box dimensions)
  return {
    width: entry.contentRect.width,
    height: entry.contentRect.height
  };
}
```

### 3. Batch Callback Execution with `requestAnimationFrame`

To avoid triggering `ResizeObserver loop completed with undelivered notifications` errors, **never mutate the observed element's style or dimensions synchronously inside the observer callback**. Always schedule DOM mutations in a `requestAnimationFrame()` frame boundary.

```javascript
let rafId = null;
const pendingEntries = new Map();

const observer = new ResizeObserver((entries) => {
  // Store latest entries for each target
  for (const entry of entries) {
    pendingEntries.set(entry.target, entry);
  }

  // Schedule batch processing on next animation frame
  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      rafId = null;
      for (const [target, entry] of pendingEntries) {
        const { width, height } = getElementDimensions(entry, 'border-box');
        // Perform reads/writes or state updates safely here
        onElementResize(target, width, height);
      }
      pendingEntries.clear();
    });
  }
});
```

### 4. Implement a Singleton Observer Manager

Instantiating dozens of separate `ResizeObserver` objects in an application creates unnecessary memory overhead. Consolidate observation into a single shared manager instance using `WeakMap` to associate targets with their respective callback handlers.

```javascript
class SharedResizeObserver {
  constructor() {
    this.callbacks = new WeakMap();
    this.pendingEntries = new Map();
    this.rafId = null;

    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.pendingEntries.set(entry.target, entry);
      }

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.rafId = null;
          for (const [target, entry] of this.pendingEntries) {
            const config = this.callbacks.get(target);
            if (config) {
              const dims = getElementDimensions(entry, config.box);
              config.callback(dims, entry);
            }
          }
          this.pendingEntries.clear();
        });
      }
    });
  }

  observe(target, callback, options = { box: 'border-box', signal: null }) {
    if (!target) return;

    this.callbacks.set(target, { callback, box: options.box });
    this.observer.observe(target, { box: options.box });

    if (options.signal) {
      options.signal.addEventListener('abort', () => this.unobserve(target), { once: true });
    }
  }

  unobserve(target) {
    if (!target) return;
    this.callbacks.delete(target);
    this.pendingEntries.delete(target);
    this.observer.unobserve(target);
  }
}

export const resizeManager = new SharedResizeObserver();
```

### 5. Render Crisp Canvas Graphics via Device Pixel Scaling

When rendering graphics on `<canvas>`, match the internal canvas pixel buffer directly to physical device pixels using `'device-pixel-content-box'`. Fall back to `window.devicePixelRatio` if the box option is unsupported.

```javascript
function observeCanvasSharpness(canvasElement, renderFn, signal) {
  resizeManager.observe(canvasElement, ({ width, height }, entry) => {
    let dprWidth, dprHeight;

    if (entry.devicePixelContentBoxSize?.length) {
      // Direct physical device pixel count
      dprWidth = entry.devicePixelContentBoxSize[0].inlineSize;
      dprHeight = entry.devicePixelContentBoxSize[0].blockSize;
    } else {
      // Fallback calculation using window.devicePixelRatio
      const dpr = window.devicePixelRatio || 1;
      const rect = entry.contentRect;
      dprWidth = Math.round(rect.width * dpr);
      dprHeight = Math.round(rect.height * dpr);
    }

    // Only update backing store size if dimensions changed
    if (canvasElement.width !== dprWidth || canvasElement.height !== dprHeight) {
      canvasElement.width = dprWidth;
      canvasElement.height = dprHeight;
      renderFn(canvasElement.getContext('2d'), dprWidth, dprHeight);
    }
  }, { box: 'device-pixel-content-box', signal });
}
```

## Decision Rules

- **Box Option Selection:**
  - **`border-box`:** Default choice for general UI component monitoring, split panes, cards, tables, and widget containers.
  - **`content-box`:** Select when measuring text layout area, scrollable content boundaries, or internal paddings.
  - **`device-pixel-content-box`:** Select exclusively for `<canvas>` or WebGL rendering buffers to achieve 1:1 hardware pixel mapping.
- **Singleton vs. Isolated Instance:**
  - **Singleton Manager (`SharedResizeObserver`):** Use for general application UIs, lists, component libraries, and dashboards observing multiple elements. Reduces garbage collection pressure and browser thread setup overhead.
  - **Isolated Observer Instance:** Use only when encapsulated within a zero-dependency standalone library or custom element where global state sharing is prohibited.
- **Handling Size Thresholds:**
  - If triggering visual layout changes (e.g. switching from 3 columns to 1 column), check integer thresholds (`width < 480`) inside the rAF callback rather than re-styling the observed container directly.

## Constraints

- **Non-Looping Mutation Rule:** Modifying the `width`, `height`, `padding`, or `margin` of the *observed element itself* inside the callback without conditional guards will cause infinite resize notifications and trigger the browser error `ResizeObserver loop completed with undelivered notifications`.
- **`ResizeObserverSize` Array Spec:** Modern browsers supply `contentBoxSize` and `borderBoxSize` as Arrays of `ResizeObserverSize` (spec update for multi-column CSS fragmentation). Always access `[0].inlineSize` and `[0].blockSize` rather than deprecated scalar properties like `entry.contentBoxSize.inlineSize`.
- **Inline vs. Physical Sizes:** `inlineSize` and `blockSize` represent logical dimensions dependent on CSS `writing-mode`. In horizontal layout modes (default), `inlineSize` = width and `blockSize` = height.
- **Display `none` Behavior:** When an observed element's CSS `display` is changed to `'none'`, `ResizeObserver` fires a single notification with dimensions set to `0, 0`. Handlers must handle zero dimensions gracefully without dividing by zero.

## Non-Goals

- Replacing CSS Container Queries (`@container`) for purely declarative styling changes.
- Tracking scroll positions or element intersection within scroll viewports.
- Managing window orientation or device screen rotation events (use `window.matchMedia('(orientation: portrait)')`).

## Common Failure Patterns

- **The Infinite Resize Loop Error:** Changing inline styles on the observed element in response to resize events without wrapping mutations in `requestAnimationFrame()` or adding dimension checks, causing `ResizeObserver loop limit exceeded`.
- **Blurry Canvas Graphics:** Setting `<canvas>` width/height attributes equal to CSS logical pixels (`rect.width`) instead of device pixels (`rect.width * devicePixelRatio` or `devicePixelContentBoxSize`), resulting in fuzzy graphics on Retina/High-DPI displays.
- **Memory Leaks from Abandoned Observers:** Calling `observer.observe(element)` in Single Page Applications (React, Vue, Svelte) without invoking `observer.unobserve(element)` or `observer.disconnect()` when components unmount.
- **Reading Deprecated Scalar Properties:** Accessing `entry.contentBoxSize.inlineSize` instead of `entry.contentBoxSize[0].inlineSize`, causing `undefined` evaluation on modern Chrome, Firefox, and Safari engines.
- **Ignoring `display: none` Transitions:** Crashes or `NaN` calculations when an observed element is hidden (`display: none`), causing `width` and `height` to drop to `0`.

## Validation Steps

- [ ] **Loop Error Inspection:** Open browser DevTools Console during rapid window resizing or component expansion and confirm zero `ResizeObserver loop completed with undelivered notifications` or `ResizeObserver loop limit exceeded` warnings appear.
- [ ] **Frame-Batch Verification:** Record a Performance profile in Chrome DevTools during layout resizing. Confirm that `ResizeObserver` callbacks do not trigger layout thrashing (interleaved recalculate style / layout tasks in the same frame).
- [ ] **Teardown Verification:** Unmount or remove observed elements from the DOM and inspect `resizeManager.callbacks` or call `getEventListeners` in DevTools to confirm no stale references persist.
- [ ] **HiDPI Sharpness Verification:** Test `<canvas>` rendering on a display with `devicePixelRatio > 1` (e.g. 2x Retina). Verify that canvas lines and text render crisp without sub-pixel blur.
- [ ] **Display Hidden Resilience:** Toggle CSS `display: none` on the observed element and confirm the callback handles `0x0` dimensions without throwing runtime exceptions.
