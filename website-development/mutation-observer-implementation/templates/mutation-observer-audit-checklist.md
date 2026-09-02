# MutationObserver Implementation Audit Checklist

Use this checklist to audit existing or new `MutationObserver` implementations in your codebase for performance, memory leaks, infinite recursion risks, and correct element filtering.

---

## 1. Scope & Configuration Audit

- [ ] **Specific Target Element:** Is the observer attached to the deepest relevant target container (`.feed-list`, `#widget-container`) rather than `document.body` or `document.documentElement`?
- [ ] **Minimal `subtree` Usage:** Is `subtree: false` unless observing unpredictable deep descendant mutations is strictly required?
- [ ] **Attribute Filter Specification:** If `attributes: true` is set, is an explicit `attributeFilter: ['class', 'data-state', ...]` array provided to ignore irrelevant attribute shifts (e.g. `aria-*`, inline `style`)?
- [ ] **Old Value Memory Awareness:** Are `attributeOldValue: true` or `characterDataOldValue: true` used only when previous values are explicitly needed, avoiding unnecessary string retention?

---

## 2. Recursion & Loop Prevention

- [ ] **Execution Guard Flag:** Is an `isProcessing` / re-entrancy guard flag set before running callback code that mutates observed target attributes or child nodes?
- [ ] **Silent Mutation Pausing:** Does code that performs intentional DOM edits on observed nodes pause the observer via `takeRecords()` + `disconnect()`, execute the mutation, and then resume observation?
- [ ] **No Unchecked `setAttribute` Calls:** Are `setAttribute` or `classList` modifications inside the observer guarded by conditionals (e.g. `if (element.getAttribute('data-init') !== 'true')`) to prevent infinite mutation cycles?

---

## 3. Node Type & Array Filtering

- [ ] **Element Node Verification:** Are `addedNodes` and `removedNodes` filtered via `node.nodeType === Node.ELEMENT_NODE` before accessing element properties (`querySelector`, `classList`, `dataset`)?
- [ ] **Selector Matching:** Are added/removed elements validated with `node.matches(selector)` or `node.querySelector(selector)` before triggering component initialization logic?
- [ ] **Multi-Segment Array Handling:** Is `mutationsList` processed using array loops (`for...of` or `forEach`) without assuming a single record is returned per microtask?

---

## 4. Performance & Batching

- [ ] **No Layout Thrashing in Microtasks:** Are layout dimension reads (`offsetWidth`, `getBoundingClientRect()`) separated from DOM style writes?
- [ ] **`requestAnimationFrame` Scheduling:** If the callback performs heavy layout reads and writes, are those writes deferred to `requestAnimationFrame()`?
- [ ] **Frame Batching for Mass Mutations:** Is `MutationObserverManager` used with `batchWithRaf: true` if hundreds of DOM nodes are inserted simultaneously (e.g., streaming table updates)?
- [ ] **Microtask Execution Time:** Does the callback execute within < 5ms to avoid blocking the main thread and degrading Interaction to Next Paint (INP)?

---

## 5. Lifecycle & Memory Leaks

- [ ] **Component Unmount Teardown:** Is `observer.disconnect()` or `unobserve(target)` explicitly invoked when single-page components (React, Vue, Svelte) or custom elements unmount?
- [ ] **`AbortSignal` Integration:** Is `AbortSignal` tied to component lifecycle controllers to automatically disconnect observers when signals abort?
- [ ] **No Detached Element Retainers:** Are closures inside the mutation callback avoiding long-lived references to detached target DOM elements? Use `WeakMap` or `WeakSet` for tracking node metadata.
- [ ] **DevTools Memory Check:** In Chrome DevTools Memory tab, perform a Heap Snapshot after mounting and unmounting observed components to confirm zero detached DOM nodes or `MutationObserver` instances persist.
