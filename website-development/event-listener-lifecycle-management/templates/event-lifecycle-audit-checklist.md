# Event Listener Lifecycle Audit Checklist

Use this checklist to audit web applications and frontend component libraries for event listener memory leaks, detached DOM node retainers, scroll performance degradation, and uncleaned global listeners.

---

## 1. Lifecycle Teardown & AbortController Checks

- [ ] **Global Listener Teardown:** Are all `window`, `document`, and `body` event listeners (`resize`, `keydown`, `scroll`, `popstate`) removed when the associated component unmounts or view changes?
- [ ] **Signal-Based Teardown:** Are component-level event listeners registered using `{ signal: controller.signal }` rather than tracking individual function references?
- [ ] **Function Reference Integrity:** Are inline `.bind(this)` or anonymous arrow functions inside `addEventListener` avoided unless an `AbortSignal` or `AbortController` is used for cleanup?
- [ ] **One-Off Listener Self-Removal:** Do transient listeners (e.g., waiting for CSS `transitionend` or `animationend`) use `{ once: true }`?
- [ ] **Third-Party Component Destruction:** Do third-party library wrappers (e.g., maps, rich text editors, chart libraries) invoke their native `.destroy()` / `.cleanup()` method on component unmount?

---

## 2. Event Delegation & Scalability Checks

- [ ] **Dynamic Item Delegation:** Are event listeners for repeating list elements, data tables, or card feeds attached to a single static parent container using `event.target.closest(selector)` instead of individual items?
- [ ] **Non-Bubbling Event Handling:** For delegated non-bubbling events (`focus`, `blur`, `mouseenter`, `mouseleave`), is capturing enabled (`{ capture: true }`) or are bubbling alternatives used (`focusin`, `focusout`, `pointerenter`)?
- [ ] **Container Bounds Validation:** Does the delegated click handler verify `containerElement.contains(matchedTarget)` to prevent executing logic when clicks originate outside the parent bounds?
- [ ] **Over-Delegation Guard:** Are high-frequency events (`mousemove`, `pointermove`, `scroll`) scoped to specific interactive containers rather than globally delegated on `document` or `body`?

---

## 3. Scroll & Rendering Performance (Main Thread Jank)

- [ ] **Passive Listener Flag:** Are high-frequency touch and scroll events (`touchstart`, `touchmove`, `wheel`) configured with `{ passive: true }` unless `event.preventDefault()` is strictly required?
- [ ] **Console Violation Audit:** Is the Chrome DevTools console free of `[Violation] Added non-passive event listener to a scroll-blocking event` warnings?
- [ ] **Layout Thrashing Prevention:** Are event handlers measuring layout (`offsetWidth`, `getBoundingClientRect()`) performing all DOM reads before applying DOM writes, or using `requestAnimationFrame` / `ResizeObserver`?
- [ ] **Debounce / Throttle Checks:** Are continuous input listeners (e.g., search typeaheads, window resize calculations) debounced or throttled appropriately?

---

## 4. Memory Leak & Garbage Collection Audit

- [ ] **Chrome DevTools Heap Snapshot Check:**
  1. Open Chrome DevTools > **Memory** panel > Select **Heap Snapshot**.
  2. Take Snapshot 1 (Baseline).
  3. Perform UI interaction (open modal, navigate routes, render list 10 times).
  4. Close modal / unmount view / clear list.
  5. Click the **Collect Garbage** (trash icon) button.
  6. Take Snapshot 2.
  7. Filter Snapshot 2 by **Summary > Class Filter: "Detached"**.
  8. Confirm there are **0 detached DOM nodes** retained by event listener closures.
- [ ] **WeakMap Storage:** Is metadata associated with DOM elements stored in a `WeakMap` rather than attaching heavy JavaScript objects directly to DOM element properties?
- [ ] **Transient Drag Teardown:** When a drag or swipe gesture ends (`pointerup`, `pointercancel`), are document-level tracking listeners immediately aborted?

---

## 5. Automated Verification Commands

Run these DevTools console commands during testing:

```javascript
// 1. Inspect window event listeners in Chrome DevTools
getEventListeners(window);

// 2. Inspect document event listeners
getEventListeners(document);

// 3. Monitor event listener counts across route transitions
console.log('Active Window Resize Listeners:', getEventListeners(window).resize?.length || 0);
```
