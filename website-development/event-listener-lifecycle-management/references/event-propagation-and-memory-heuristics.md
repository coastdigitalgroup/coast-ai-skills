# DOM Event Propagation & Memory Lifecycle Heuristics

This reference document details the browser mechanisms behind DOM event propagation, memory management, `AbortSignal` composition, and compositor thread performance in modern web browsers.

---

## 1. DOM Event Propagation Phases

DOM events traverse the document tree in three distinct phases defined by the DOM Event Specification:

```
                  DOCUMENT
                     │
         [1. Capture Phase] ↓  ↑ [3. Bubble Phase]
                     │
                CONTAINER
                     │
           [2. Target Phase]
```

1. **Capture Phase (`capture: true`):** The event trickles down from `Window` through parent elements to the target node's immediate parent. Listeners with `{ capture: true }` fire during this phase.
2. **Target Phase:** The event arrives at the target element specified by `event.target`.
3. **Bubble Phase (`capture: false`, default):** The event bubbles back up from the target element through parent ancestors up to `Window`.

### Shadow DOM & `composedPath()`

When events originate inside a Shadow Root (Web Components), `event.target` is retargeted to the host element when inspected outside the shadow boundary. To access the exact original element during event delegation across shadow boundaries, use `event.composedPath()`:

```javascript
// Shadow DOM delegation helper
const originalTarget = event.composedPath()[0];
const button = originalTarget.closest('button[data-action]');
```

---

## 2. AbortSignal Mechanics & Signal Merging

Passing `{ signal }` to `addEventListener` binds the listener lifecycle directly to the `AbortSignal`. When `abort()` is invoked on the controller:
1. The browser removes the event listener internal reference immediately.
2. The listener function becomes eligible for Garbage Collection if no other strong references exist.
3. Subsequent dispatches of the event will no longer invoke the callback.

### Merging Multiple AbortSignals (`AbortSignal.any`)

In scenarios where a listener should terminate if *either* a component unmounts OR a specific user action occurs (e.g., closing a modal or pressing Escape), merge signals using `AbortSignal.any()`:

```javascript
const componentController = new AbortController();
const userCloseController = new AbortController();

// Listener cancels if component unmounts OR user closes modal
const mergedSignal = AbortSignal.any([
  componentController.signal,
  userCloseController.signal
]);

window.addEventListener('keydown', handleKey, { signal: mergedSignal });
```

---

## 3. Detached DOM Tree Memory Retention Mechanics

A memory leak occurs when a DOM element is removed from the active DOM document tree using `element.remove()` or `innerHTML = ''`, but remains held in memory by an active reference.

### How Event Listeners Cause Detached DOM Leaks

```javascript
// LEAK SCENARIO:
function setupLeak() {
  const bigButton = document.createElement('button');
  bigButton.textContent = 'Heavy Node';
  document.body.appendChild(bigButton);

  const largeDataArray = new Array(1000000).fill('data');

  window.addEventListener('resize', function onResize() {
    // Closure retains `bigButton` and `largeDataArray`
    console.log(bigButton.textContent);
  });

  // Later: Element removed from DOM
  bigButton.remove();
}
```

In the example above, even though `bigButton` was removed from `document.body`, the `window` resize listener holds the `onResize` closure in memory. The closure retains `bigButton`, which in turn retains its entire parent/child DOM subtree and `largeDataArray`.

### Fix with WeakMap & AbortSignal

1. **AbortSignal:** Removing the `window` resize listener releases the `onResize` closure.
2. **WeakMap:** Storing element metadata in `WeakMap` ensures that when the element is removed from the DOM and all listener closures are cleared, GC reclaims the element immediately.

---

## 4. Passive Listener Performance & Compositor Threading

Modern browsers render smooth 60fps / 120fps scrolling on a dedicated **compositor thread**.

- **Non-Passive Listener (`passive: false`):** When a user touch/wheel gesture occurs, the compositor thread must stop and wait for the main thread JavaScript engine to run the event callback to check if `event.preventDefault()` was called. This causes noticeable scroll stutter (jank).
- **Passive Listener (`passive: true`):** Tells the browser compositor thread that the handler will **never** call `event.preventDefault()`. The compositor scrolls the page instantly without waiting for JavaScript execution.

### Passive Default Behavior
In modern browsers, `touchstart` and `touchmove` on `window`, `document`, and `document.body` default to `passive: true`. However, custom scroll containers or `wheel` listeners inside components still require explicit `{ passive: true }`.

---

## 5. Browser Compatibility Reference

| Feature | Chrome / Edge | Safari | Firefox | Mobile Browsers |
|---------|---------------|--------|---------|-----------------|
| `addEventListener` `{ signal }` | 90+ | 15+ | 86+ | Full support |
| `AbortSignal.any()` | 116+ | 17.4+ | 115+ | iOS 17.4+, Android 116+ |
| `Element.closest()` | 41+ | 9+ | 35+ | Full support |
| `{ passive: true }` | 51+ | 10+ | 49+ | Full support |
| `WeakMap` | 36+ | 8+ | 38+ | Full support |
