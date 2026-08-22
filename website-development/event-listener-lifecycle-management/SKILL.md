---
name: event-listener-lifecycle-management
description:
  Attach, delegate, optimize, and tear down DOM event listeners using AbortController signals, event delegation via Element.closest(), passive listeners, and WeakMap scoping to eliminate memory leaks, detached DOM retainers, duplicate listener execution, and main-thread scroll jank.
---

# Event Listener Lifecycle Management

## Purpose

The Event Listener Lifecycle Management skill provides a production-grade framework for managing DOM event listener registration, delegation, optimization, and destruction across modern web frontend architectures.

Unbound or improperly managed event listeners are the leading cause of memory leaks, detached DOM tree retainers, duplicate event handler invocations in Single-Page Applications (SPAs), and scroll jank on touch/wheel devices. This skill establishes declarative teardown patterns using `AbortController` signals, memory-efficient event delegation using `Element.closest()`, thread-conscious scroll optimization using `{ passive: true }`, and garbage-collection-friendly component lifecycle bindings.

---

## Use Cases

- **SPA Component Mount/Unmount Cycles:** Safely cleaning up global event listeners (`window.addEventListener('resize')`, `document.addEventListener('keydown')`) when components or views unmount.
- **Dynamic List & Table Item Handling:** Avoiding the performance penalty and memory footprint of attaching individual event listeners to thousands of dynamic DOM elements (e.g., data grids, feeds, comment threads).
- **Smooth Touch and Scroll Performance:** Eliminating main-thread compositor blocking on `touchmove`, `touchstart`, and `wheel` events in custom scroll containers or sticky widgets.
- **Short-Lived Drag, Drop, or Gesture Tracking:** Managing temporary document-level listeners during active drag/pointer gestures and tearing them down reliably when `pointerup` or `pointercancel` triggers.
- **Third-Party Component & Micro-Frontend Teardowns:** Ensuring clean destruction of widgets injected into host pages without leaving lingering event listeners behind.

---

## When NOT to Use

- **Static Pure HTML Pages Without Component Lifecycles:** For simple, server-rendered multi-page websites where the browser natively clears all event listeners and DOM memory during full page reloads.
- **Framework-Native Event Bindings:** When working purely within React's SyntheticEvent system (`onClick={...}`) or Vue/Svelte directives (`v-on:click` / `@click`), where the framework runtime manages event delegation and cleanup internally. Use this skill when bridging framework code to raw DOM elements (`window`, `document`, body portals, or third-party canvas/SVG nodes).
- **Asynchronous Data Fetch Cancellation:** While `AbortController` is used for event listener cleanup, fetching network requests and handling API race conditions should follow `fetch-race-condition-management`.

---

## Inputs

1. **Target Event Elements:** DOM nodes, `window`, or `document` requiring event interception.
2. **Event Types & Options:** Specified events (e.g., `'click'`, `'keydown'`, `'scroll'`, `'pointermove'`) along with options (`capture`, `passive`, `once`).
3. **Handler Callback / Action Strategy:** Event handler logic or delegated selector mappings.
4. **Lifecycle Boundary Signal:** An `AbortController` or `AbortSignal` tied to the parent container, component instance, or teardown trigger.

---

## Outputs

1. **Signal-Backed Listener Registrations:** Event listeners bound with `{ signal: controller.signal }` allowing 1-line batch cleanup.
2. **Delegated Container Handler:** A single parent listener replacing multiple item-level listeners using selector matching (`Element.closest()`).
3. **Passive Scroll/Touch Listeners:** High-performance scroll listeners configured with `{ passive: true }` to avoid main-thread rendering delays.
4. **Teardown Controller Class / Cleanup Function:** Reusable teardown mechanism ensuring zero detached DOM retainers upon unmount.

---

## Workflow

### 1. Establish an AbortController for Teardown Batches

Instead of storing individual function references for `removeEventListener`, instantiate a single `AbortController` per component or module lifetime. Pass its `signal` in the `addEventListener` options object.

```javascript
// Component initialization
class SearchWidget {
  constructor(containerElement) {
    this.container = containerElement;
    // Single lifecycle controller for all component event listeners
    this.lifecycleController = new AbortController();
    const { signal } = this.lifecycleController;

    // Attach multiple listeners using the same signal
    window.addEventListener('resize', this.handleResize.bind(this), { signal });
    document.addEventListener('keydown', this.handleKeydown.bind(this), { signal });
    this.container.addEventListener('scroll', this.handleScroll.bind(this), {
      signal,
      passive: true
    });
  }

  // Single teardown call removes ALL attached listeners automatically
  destroy() {
    this.lifecycleController.abort();
    this.container = null; // Clear DOM reference to allow immediate GC
  }
}
```

---

### 2. Implement Event Delegation for Dynamic Collections

To handle user interactions on dynamic items (e.g., list rows, buttons, cards), attach a single listener to the closest static parent container and inspect `event.target` using `Element.closest()`.

```javascript
// BAD: Attaching listeners to every list item (High memory, breaks on dynamic innerHTML)
function bindItemsBad(container) {
  const buttons = container.querySelectorAll('.delete-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => handleDelete(e.target.dataset.id));
  });
}

// GOOD: Single delegated listener on parent using Element.closest()
function bindItemsDelegated(containerElement, signal) {
  containerElement.addEventListener('click', (event) => {
    // Traverse up to find the closest button matching the selector
    const deleteBtn = event.target.closest('.delete-btn');

    // Ignore clicks that did not originate inside a matching element
    if (!deleteBtn || !containerElement.contains(deleteBtn)) return;

    const itemId = deleteBtn.dataset.id;
    handleDelete(itemId);
  }, { signal });
}
```

---

### 3. Configure Passive Listeners for Touch and Scroll

By default, the browser rendering engine waits for `touchstart`, `touchmove`, and `wheel` handlers to complete before executing page scrolling in case `event.preventDefault()` is called. Explicitly set `{ passive: true }` whenever `preventDefault()` is not required.

```javascript
function initScrollTracker(scrollContainer, signal) {
  scrollContainer.addEventListener('scroll', (event) => {
    // Perform non-blocking UI update (e.g., updating progress bar)
    updateScrollProgress(event.target.scrollTop);
  }, {
    signal,
    passive: true // Informs browser engine that preventDefault() will never be called
  });
}
```

---

### 4. Manage Transient (Drag & Drop) Event Lifecycles

For multi-stage interactions like drag-and-drop or pointer tracking, spawn a sub-`AbortController` when the gesture starts, and abort it as soon as the gesture finishes.

```javascript
function enableDraggable(dragHandle) {
  const mainController = new AbortController();

  dragHandle.addEventListener('pointerdown', (startEvent) => {
    startEvent.preventDefault();

    // Create transient controller for document-level drag tracking
    const dragController = new AbortController();
    const { signal } = dragController;

    const onPointerMove = (moveEvent) => {
      updatePosition(moveEvent.clientX, moveEvent.clientY);
    };

    const stopDrag = () => {
      // Abort transient drag listeners immediately when pointer releases
      dragController.abort();
    };

    // Attach temporary tracking listeners to document
    document.addEventListener('pointermove', onPointerMove, { signal });
    document.addEventListener('pointerup', stopDrag, { signal });
    document.addEventListener('pointercancel', stopDrag, { signal });
  }, { signal: mainController.signal });

  return () => mainController.abort(); // Return master cleanup function
}
```

---

### 5. Prevent Retained Detached DOM Nodes with WeakMap Scoping

When storing component data or state associated with DOM nodes, use `WeakMap` instead of attaching heavy properties or closures directly to DOM elements. This guarantees that when the DOM node is removed from the document, it and its associated metadata can be garbage-collected immediately.

```javascript
// Private WeakMap registry mapping DOM nodes to component instances
const componentRegistry = new WeakMap();

export function attachComponent(element, controllerInstance) {
  componentRegistry.set(element, controllerInstance);
}

export function getComponent(element) {
  return componentRegistry.get(element);
}
```

---

## Decision Rules

### Event Binding Approach Selection

| Requirement | Recommended Approach | Key Advantage |
| :--- | :--- | :--- |
| Component unmount or route change cleanup | `addEventListener(type, handler, { signal })` | Clean 1-line batch cancellation via `controller.abort()`. |
| Dynamic list, grid, or feed item events | Delegated container listener with `event.target.closest(selector)` | Constant $O(1)$ memory footprint regardless of list length. |
| High-frequency touch, wheel, or scroll tracking | `{ passive: true, signal }` | Offloads scroll composition from main thread, eliminating jank. |
| One-off event trigger (e.g., transition end) | `{ once: true, signal }` | Automatically removes listener after first invocation. |
| Pointer tracking / Drag-and-Drop operations | Transient nested `AbortController` aborted on `pointerup` | Prevents lingering document-level mousemove/pointermove listeners. |

---

## Constraints

- **`AbortSignal` Browser Support:** Supported in all modern browsers (Chrome 88+, Firefox 86+, Safari 15+). For legacy environments, `removeEventListener` with exact function references must be used.
- **Event Bubbling Dependency:** Event delegation REQUIRES events that bubble (e.g., `click`, `keydown`, `input`). Non-bubbling events (e.g., `focus`, `blur`, `mouseenter`, `mouseleave`) must use event capturing (`{ capture: true }`) or `focusin`/`focusout` / `pointerenter` substitutes when delegating.
- **`preventDefault()` in Passive Listeners:** Never call `event.preventDefault()` inside a passive listener. Modern browsers will ignore the call and issue a console warning.
- **Bound Function Identity:** Calling `.bind(this)` directly inside `addEventListener(type, fn.bind(this))` creates a new function reference every time. Without `AbortController`, you CANNOT remove this listener using `removeEventListener` because the references do not match.

---

## Non-Goals

- Replacing framework state management stores (Redux, Zustand, Pinia).
- Custom polyfilling of synthetic touch gestures (e.g., pinch-zoom or multi-finger gestures).
- Managing WebSocket or Server-Sent Events network connection lifecycles.

---

## Common Failure Patterns

- **The "Ghost Listener" Duplicate Execution:** Re-attaching `window.addEventListener('resize', ...)` on every component render without cleaning up previous bindings, causing the handler to fire $N$ times per resize frame.
- **Detached DOM Tree Retention:** An event handler closure referencing a DOM node (`const el = document.getElementById(...)`) attached to `window`. When `el` is removed from the DOM, `window` retains the closure, which retains `el`, preventing garbage collection of the entire subtree.
- **In-line `.bind()` Cleanup Failure:** Attempting `element.removeEventListener('click', this.onClick.bind(this))` which fails silently because `bind()` returns a new function instance.
- **Over-Delegation on High-Frequency Events:** Placing a delegated `pointermove` or `mousemove` listener on `document` or `body` without throttling or checking performance impact.
- **Forgetting Non-Bubbling Event Differences:** Attempting to delegate `focus` or `mouseenter` on a parent element without setting `{ capture: true }` or using `focusin`.

---

## Validation Steps

- [ ] **Teardown Verification:** Trigger component unmount/destroy, then inspect active event listeners in Chrome DevTools (**Elements > Event Listeners** panel or `getEventListeners(window)`) to confirm zero lingering listeners.
- [ ] **Memory Snapshot Audit:** Perform a Heap Snapshot in Chrome DevTools (**Memory** tab), take Snapshot 1, unmount/destroy the component, force Garbage Collection (trash icon), take Snapshot 2. Search for "Detached HTMLDivElement" to confirm zero retained nodes.
- [ ] **Passive Listener Audit:** Verify in Lighthouse or Chrome DevTools Performance panel that no `[Violation] Added non-passive event listener` warnings are emitted for scroll/touch events.
- [ ] **Delegation Scale Test:** Render a list with 1,000+ items and verify via `getEventListeners(container)` that only 1 event listener is attached to the parent container.
- [ ] **Transient Drag Teardown Test:** Initiate a drag operation, release the mouse outside the browser viewport, and verify that all `pointermove` and `pointerup` listeners on `document` are completely removed.
