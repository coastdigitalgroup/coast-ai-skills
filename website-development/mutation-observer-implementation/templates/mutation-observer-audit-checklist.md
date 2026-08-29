# MutationObserver Implementation Audit Checklist

Use this checklist when implementing, reviewing, or debugging DOM `MutationObserver` code in frontend applications.

---

## 1. Scope & Configuration Audit

- [ ] **Precise Config Options:** `childList`, `attributes`, and `characterData` are explicitly declared. Unused flags are set to `false` or omitted.
- [ ] **Attribute Filter Specified:** If `attributes: true` is enabled, an `attributeFilter: ['attr1', 'attr2']` array is provided to restrict observation to relevant state attributes.
- [ ] **Subtree Scope Verification:** `subtree: true` is used *only* when observing unpredictable nested trees (e.g. injected third-party widgets). It is omitted for known single-level element lists.
- [ ] **Old Value Capture:** `attributeOldValue` or `characterDataOldValue` is set only if previous state values are required for diffing.

---

## 2. Recursion Guard & Safety Audit

- [ ] **Loop Guard Present:** Callbacks that modify DOM elements include a boolean flag guard (`isMutating`) or execute via `executeGuarded()`.
- [ ] **Record Flushing:** `observer.takeRecords()` is invoked after internal DOM modifications to purge self-generated mutation records.
- [ ] **Node Type Filtering:** Code checks `node.nodeType === Node.ELEMENT_NODE` before accessing element methods (e.g., `querySelector`, `hasAttribute`).

---

## 3. Lifecycle & Memory Leak Audit

- [ ] **Teardown on Unmount:** Observers are explicitly disconnected via `observer.disconnect()` or `unobserve()` when components unmount.
- [ ] **AbortSignal Integration:** `AbortSignal` listeners are bound to automatically disconnect observers when component lifecycles end.
- [ ] **WeakMap Handler Storage:** Shared observer instances store node callbacks in `WeakMap` objects to avoid preventing garbage collection of detached DOM elements.

---

## 4. Accessibility & UI Performance Audit

- [ ] **ARIA Live Region Coordination:** Dynamic node additions intended for screen reader announcements update `aria-live` containers appropriately without spamming speech channels.
- [ ] **Batch Processing:** Rapid batch insertions are iterated efficiently within single microtask runs without triggering synchronous browser layout thrashing.
- [ ] **Zero Console Warnings:** Console is free of recursive stack overflow errors or unhandled DOM exception warnings.
