# ResizeObserver Audit & Debugging Checklist

Use this checklist to audit, optimize, and debug `ResizeObserver` implementations across frontend codebases. It covers performance, browser compatibility, error prevention, and memory leak mitigation.

## 1. Loop Error & Layout Thrashing Prevention

- [ ] **No Synchronous Observed Element Mutations:** Verify that the callback does *not* directly modify inline styles (`element.style.width`, `element.style.height`, `element.style.padding`, `element.style.margin`) of the target element being observed without guard logic.
- [ ] **Frame Batching (`requestAnimationFrame`):** Confirm that all DOM mutations inside `ResizeObserver` callbacks are wrapped in `requestAnimationFrame()` to decouple layout reads from writes.
- [ ] **Conditional Threshold Guards:** Verify that class toggles or layout updates check explicit dimension changes (`if (newWidth !== oldWidth)`) before applying changes to prevent redundant re-renders.

## 2. Specification & Box Model Correctness

- [ ] **Array Access for Box Sizes:** Ensure code reads `entry.borderBoxSize[0].inlineSize` or `entry.contentBoxSize[0].inlineSize` as arrays, rather than accessing deprecated scalar properties (`entry.contentBoxSize.inlineSize`).
- [ ] **Legacy `contentRect` Fallbacks:** Confirm that fallback logic exists for legacy browser engines that only supply `entry.contentRect`.
- [ ] **Box Model Option Matching:** Confirm that `'border-box'` is requested when measuring component boundaries, and `'device-pixel-content-box'` is requested for `<canvas>` elements.
- [ ] **Logical Dimension Awareness:** Ensure the code accounts for `inlineSize` (width in horizontal layout) and `blockSize` (height in horizontal layout) according to CSS `writing-mode`.

## 3. High-DPI Canvas & Graphic Precision

- [ ] **Device Pixel Backing Store:** For `<canvas>` elements, verify that the canvas backing store resolution (`canvas.width`, `canvas.height`) matches `devicePixelContentBoxSize` or `contentRect.width * window.devicePixelRatio`.
- [ ] **Sub-pixel Scale Prevention:** Confirm that canvas rendering contexts apply DPR scaling (`ctx.scale(dpr, dpr)`) when using CSS logical coordinates for drawing operations.
- [ ] **Zero Dimension Guard:** Ensure canvas drawing loops skip execution or guard against `width === 0` or `height === 0` (e.g. when canvas container is hidden with `display: none`).

## 4. Performance & Memory Management

- [ ] **Singleton / Shared Observer Architecture:** Verify that the application uses a shared observer instance or centralized manager instead of instantiating separate `new ResizeObserver()` objects per component instance in large lists.
- [ ] **Unmount Teardown (`unobserve` / `disconnect`):** In Single Page Applications (React `useEffect` cleanup, Vue `onUnmounted`, Svelte `onDestroy`), confirm that `observer.unobserve(element)` or `controller.abort()` is called when components unmount.
- [ ] **WeakMap Target Storage:** Confirm that element-to-callback mappings use `WeakMap` to prevent retaining detached DOM nodes in memory.
- [ ] **Display `none` Handling:** Verify that the callback handles elements transitioning to `display: none` (`0x0` dimensions) without throwing math errors (e.g. dividing by zero in aspect ratio calculations).

## 5. Verification Commands & Tools

- [ ] **Console Audit:** Open DevTools Console and verify zero `ResizeObserver loop completed with undelivered notifications` or `ResizeObserver loop limit exceeded` warnings appear during interactive window/element resizing.
- [ ] **Performance Profile:** Record a trace in Chrome DevTools Performance panel while resizing observed elements. Verify that no forced synchronous layout or "Recalculate Style" thrashing occurs in observer frames.
- [ ] **Memory Heap Snapshot:** Take a DevTools Heap Snapshot, trigger component mount/unmount cycles 10 times, force garbage collection, and confirm zero detached DOM nodes remain retained by observer instances.
