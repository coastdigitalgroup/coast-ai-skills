# MutationObserver Audit Checklist

Use this checklist when implementing, reviewing, or debugging `MutationObserver` code in frontend web applications.

## 1. Scope & Configuration Audit

- [ ] **Granular Options (`MutationObserverInit`):** Are option flags (`childList`, `subtree`, `attributes`, `characterData`) explicitly scoped to the minimum necessary level?
- [ ] **Attribute Filtering:** If `attributes: true` is enabled, is an explicit `attributeFilter: ['attr1', 'attr2']` provided to prevent redundant triggers on unrelated class/style edits?
- [ ] **Subtree Scope Justification:** If `subtree: true` is enabled, is it strictly required (e.g. dynamic multi-level injections)? Has performance impact on large DOM subtrees been profiled?

## 2. Recursion & Infinite Loop Safety

- [ ] **Recursion Guard Implementation:** Does the mutation callback write to observed elements (attributes, class names, or child elements)? If so, is a recursion guard flag (`isMutating`) or `observer.disconnect()` / `observer.observe()` boundary used?
- [ ] **Attribute Value Change Check:** Before setting an attribute inside a callback, does the code check if the value is actually changing (`element.getAttribute('key') !== newValue`)?
- [ ] **Duplicate Auto-Enhancement Prevention:** Are dynamically added elements tagged with a marker attribute (e.g., `data-enhanced="true"`) to prevent re-processing?

## 3. Node Processing & Search Correctness

- [ ] **Node Type Filtering:** Are `addedNodes` and `removedNodes` filtered for `Node.ELEMENT_NODE` before accessing element methods or properties?
- [ ] **Nested Subtree Element Matching:** Does the code search nested subtrees within added elements using `node.querySelectorAll(targetSelector)` in addition to checking `node.matches(targetSelector)`?
- [ ] **Removed Node Cleanup:** Does the callback handle `removedNodes` to clean up associated instances, tooltips, or event listeners tied to deleted DOM elements?

## 4. Performance & Batching

- [ ] **Layout Read/Write Separation:** If mutation handlers perform DOM style updates or read visual measurements (`getBoundingClientRect()`, `offsetWidth`), are layout mutations batched via `requestAnimationFrame()`?
- [ ] **Microtask Budget:** Does `MutationObserver` processing execute within 5ms per frame during bulk DOM updates?
- [ ] **Singleton vs Multiple Observers:** Is a shared manager or singleton observer used when observing multiple target nodes across components?

## 5. Lifecycle Teardown & Memory Leak Prevention

- [ ] **Disconnect on Component Unmount:** Is `observer.disconnect()` invoked when SPA components, routes, or overlays unmount?
- [ ] **`takeRecords()` Flushing:** Are pending microtask mutations flushed via `observer.takeRecords()` before tearing down the observer instance?
- [ ] **WeakMap Target Storage:** Are target element bindings stored in `WeakMap` or `WeakSet` to avoid retaining references to deleted DOM nodes?
- [ ] **AbortSignal Integration:** Is teardown connected to component `AbortSignal` signals where applicable?
