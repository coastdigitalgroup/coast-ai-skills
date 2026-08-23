# Event Listener Lifecycle & Memory Audit Checklist

Use this diagnostic audit checklist when building, reviewing, or debugging frontend UI components, dynamic lists, and client-side page transitions to eliminate DOM memory leaks, duplicate handler execution, and scroll jank.

---

## 1. Listener Scoping & Teardown Audit

- [ ] **Global Window/Document Teardown:** Every `window` or `document` event listener (`keydown`, `resize`, `scroll`, `pointermove`, `online`, `message`) attached by a component is bound to an `AbortSignal` or explicitly removed on teardown.
- [ ] **Single Teardown Call:** Component teardown or unmount methods call `controller.abort()` once to clear all associated listeners cleanly.
- [ ] **No Inline Anonymous Function `removeEventListener` Failures:** Code does not attempt `removeEventListener('type', () => {})` with an anonymous function reference that can never match.
- [ ] **Re-render Duplicate Prevention:** Fast re-rendering or re-hydration cycles do not accumulate stacked listeners on the same element.

---

## 2. Event Delegation & DOM Performance

- [ ] **High-Density Delegation:** Containers rendering dynamic lists, tables, or grid cards (>5 items) use a single delegated listener on the parent container instead of individual listeners per row/button.
- [ ] **Boundary Verification:** Delegated handlers using `Element.closest()` verify `container.contains(matchedTarget)` to prevent event bleeding.
- [ ] **Fragment Batching:** Dynamic DOM nodes are appended in batches using `DocumentFragment` or `template` tags rather than triggering layout recalcs in a loop with individual listener bindings.

---

## 3. Passive Scroll & Touch Optimization

- [ ] **Compositor Non-Blocking:** All `scroll`, `wheel`, `touchstart`, and `touchmove` listeners that do not invoke `event.preventDefault()` explicitly declare `{ passive: true }`.
- [ ] **Console Violation Audit:** Chrome DevTools console (with Verbose logging) is free of `[Violation] Added non-passive event listener to a scroll-blocking event` warnings.
- [ ] **High-Frequency Throttling/Debouncing:** Pointer move, mouse move, and resize handlers utilize `requestAnimationFrame`, debouncing, or throttling to avoid saturating the main thread.

---

## 4. Memory Heap & GC Leak Diagnostics

- [ ] **DevTools Heap Snapshot Verification:**
  1. Open Chrome DevTools > Memory tab > Select "Heap snapshot".
  2. Take Snapshot 1 (Baseline).
  3. Mount, interact with, and unmount the target component 5 times.
  4. Force Garbage Collection (click the trash can icon).
  5. Take Snapshot 2.
  6. Filter Snapshot 2 by "Detached" elements.
- [ ] **Zero Detached Retainers:** Snapshot contains 0 `Detached HTMLButtonElement`, `Detached HTMLDivElement`, or `Detached HTMLTableRowElement` references linked back to listener closures.
- [ ] **WeakMap Usage:** Metadata associated with DOM elements uses `WeakMap` or `WeakSet` rather than global array/object maps that hold hard references to deleted DOM nodes.

---

## 5. DevTools Inspection Commands

Run these snippets in the browser DevTools console to inspect listener accumulation:

```javascript
// 1. Inspect all listeners bound to window
console.table(getEventListeners(window));

// 2. Inspect listeners on document keydown
console.table(getEventListeners(document).keydown);

// 3. Inspect listeners on a specific component root element
const root = document.querySelector('#component-root');
console.log(getEventListeners(root));
```
