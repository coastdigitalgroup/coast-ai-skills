---
name: event-listener-lifecycle-management
description:
  Manage DOM event listener lifecycles, memory leak prevention, event delegation,
  AbortController teardown, and passive event handlers in frontend applications.
---

# Event Listener Lifecycle Management

## Purpose

The Event Listener Lifecycle Management skill provides a production-grade
framework for attaching, delegating, optimizing, and tearing down DOM event
listeners in frontend applications. Unmanaged event listeners are a leading cause
of browser memory leaks, detached DOM retainers, duplicate event execution, and
main-thread scroll jank. This skill establishes deterministic patterns using
`AbortController` signals, event delegation via `Element.closest()`, passive
listeners, and `WeakMap` scoping to guarantee leak-free, high-performance DOM
interactions.

## Use Cases

- **Dynamic UI Components & SPAs:** Cleaning up global or document-level event
  listeners (`keydown`, `resize`, `scroll`, `pointermove`) when routes change,
  modals close, or components unmount.
- **High-Density Lists & Data Grids:** Replacing hundreds of individual element
  click/hover handlers with a single delegated event listener on a parent
  container.
- **Scroll & Touch Interactions:** Eliminating scroll lag on document/window
  scroll or touch drag handlers using `{ passive: true }`.
- **Transient Interaction States:** Attaching temporary `pointermove` or `pointerup`
  drag listeners that self-terminate upon drag completion without manual
  `removeEventListener` bookkeeping.
- **Component Re-rendering / Hydration:** Preventing duplicate listener
  accumulation when DOM nodes are re-created or dynamically updated.

## When NOT to Use

- **Framework-Managed Declarative Events:** When working entirely within React,
  Vue, or Svelte synthetic event systems (e.g. `<button onClick={...}>`), unless
  you are attaching manual listeners to `window`, `document`, or third-party DOM
  nodes outside the framework tree.
- **Static Page Links:** Standard semantic HTML anchor tags (`<a href="...">`) or
  form submits that require no JavaScript event interception or state management.
- **One-Off `once: true` Listeners:** Simple single-use clicks where `{ once: true }`
  is sufficient and no component teardown logic is needed.

## Inputs

1. **Target Elements:** The DOM node (`Window`, `Document`, `HTMLElement`) receiving
   the listener.
2. **Event Type:** The DOM event name (`click`, `keydown`, `scroll`, `pointerdown`,
   `custom-event`).
3. **Lifecycle Owner / Scope:** The component, controller instance, or route view
   that controls the listener's lifetime.
4. **Performance Characteristics:** Sensitivity to scroll/touch responsiveness
   (determining `passive` and `capture` flags).

## Outputs

1. **Declarative AbortSignal Binding:** Listeners bound with `AbortSignal` for
   atomic, single-call teardown.
2. **Delegated Parent Handler:** A single, memory-efficient container listener
   using `Element.closest()` and `matches()`.
3. **Passive Scroll/Touch Handlers:** Non-blocking event listeners configured with
   `{ passive: true }`.
4. **Lifecycle Cleanup Registry:** A clean controller instance or disposal hook
   integrating with SPA view destruction.

## Workflow

### 1. Initialize an AbortController for Component Scope

Bind all event listeners associated with a component or interaction scope to a
single `AbortController`. When the scope closes or unmounts, invoke `abort()` once
to tear down every listener instantly.

```javascript
class UIComponent {
  constructor(element) {
    this.element = element;
    this.controller = new AbortController();
    this.initEvents();
  }

  initEvents() {
    const { signal } = this.controller;

    // Window / document-level events attached cleanly with scope signal
    window.addEventListener('resize', () => this.handleResize(), { signal });
    document.addEventListener('keydown', (e) => this.handleKeydown(e), { signal });
  }

  destroy() {
    // Single call removes ALL listeners bound with this.controller.signal
    this.controller.abort();
  }
}
```

### 2. Implement Event Delegation for Dynamic Elements

Instead of attaching individual click or change listeners to items inside a dynamic
list or grid, attach a single listener to the static parent container and match the
event target using `Element.closest()`.

```javascript
const listContainer = document.querySelector('.item-list');
const controller = new AbortController();

listContainer.addEventListener('click', (event) => {
  // Trace target up to the desired selector boundary
  const itemButton = event.target.closest('button[data-action]');
  if (!itemButton || !listContainer.contains(itemButton)) return;

  const action = itemButton.dataset.action;
  const itemId = itemButton.closest('[data-id]')?.dataset.id;

  handleAction(action, itemId);
}, { signal: controller.signal });
```

### 3. Configure Passive Listeners for Touch & Scroll

For `scroll`, `wheel`, `touchstart`, and `touchmove` listeners that do not invoke
`event.preventDefault()`, explicitly declare `{ passive: true }`. This enables the
browser's compositor thread to scroll immediately without waiting for main-thread
JavaScript execution.

```javascript
window.addEventListener('scroll', () => {
  updateScrollProgress();
}, { passive: true, signal: controller.signal });
```

### 4. Manage Temporary Pointer Drag Lifecycles

For drag interactions (`pointerdown` -> `pointermove` -> `pointerup`), instantiate
a dedicated sub-controller on `pointerdown`. Automatically abort the sub-controller
when `pointerup` or `pointercancel` fires.

```javascript
element.addEventListener('pointerdown', (startEvent) => {
  const dragController = new AbortController();
  const { signal } = dragController.signal;

  const onPointerMove = (moveEvent) => {
    // Process drag movement...
  };

  const onPointerUp = () => {
    // Terminate drag listeners cleanly
    dragController.abort();
  };

  window.addEventListener('pointermove', onPointerMove, { signal, passive: true });
  window.addEventListener('pointerup', onPointerUp, { signal });
  window.addEventListener('pointercancel', onPointerUp, { signal });
}, { signal: mainController.signal });
```

### 5. Prevent Closure Retainers with WeakMap

When associating metadata or private state with DOM elements, avoid storing raw DOM
node references in global objects or long-lived arrays. Use `WeakMap` or `WeakSet` so
that removed DOM nodes can be garbage collected automatically.

```javascript
// Good: Node references in WeakMap do not prevent GC
const componentState = new WeakMap();

function bindItemState(element, state) {
  componentState.set(element, state);
}
```

## Decision Rules

- **`AbortController` vs. Manual `removeEventListener`:**
  - **Use `AbortController`:** For any component with multiple listeners, global
    window/document bindings, transient drag operations, or SPA views. It eliminates
    reference management for inline functions and bound methods.
  - **Use `removeEventListener`:** Only when dealing with legacy browser constraints
    where `AbortController` signal in `addEventListener` is unsupported and polyfills
    are prohibited.
- **Event Delegation vs. Direct Listeners:**
  - **Use Delegation:** Whenever rendering lists, tables, dynamic menus, or elements
    added/removed at runtime. Rule of thumb: >5 repeating elements warrants delegation.
  - **Use Direct Listeners:** For unique, top-level structural elements (e.g. a modal
    trigger button or global search input).
- **`passive: true` vs Default:**
  - **Use `passive: true`:** For all `scroll`, `wheel`, `touchstart`, `touchmove`
    listeners where `event.preventDefault()` is NOT called.
  - **Omit `passive`:** Only when `event.preventDefault()` MUST be called (e.g. custom
    swipe gestures overriding native page scroll or drag-and-drop file drop zones).

## Constraints

- **Signal Invariance:** An `AbortSignal` can only transition from unmanaged to aborted
  once. Re-initializing a destroyed component requires instantiating a new
  `AbortController`.
- **Delegation Scope Boundary:** When using `Element.closest()`, always ensure the
  matched element resides within the container (`container.contains(target)`) to prevent
  event bleeding outside the component boundary.
- **Composed Path in Shadow DOM:** If using Web Components / Shadow DOM, use
  `event.composedPath()[0]` instead of `event.target` when matching targets across
  shadow roots.
- **Performance:** Avoid attaching high-frequency non-passive listeners (`scroll`,
  `mousemove`, `pointermove`) on global `window` without debouncing, throttling, or
  rAF dispatching (see `interaction-performance-optimization`).

## Non-Goals

- Replacing framework state managers or state-machine routers.
- Polyfilling native browser DOM event mechanisms for obsolete engines.
- Handling server-side event streams (Server-Sent Events or WebSockets).

## Common Failure Patterns

- **The Detached DOM Retainer:** Attaching a `window` event listener with a callback
  holding a closure reference to a deleted DOM node, preventing GC and leaking the entire
  sub-tree.
- **Duplicate Handler Stack:** Re-calling `addEventListener` inside a render or update
  loop without tearing down the previous listener, resulting in exponential handler
  invocations.
- **Inline Function Un-removability:** Attempting to call `removeEventListener('click', () => {...})`
  with a new anonymous function expression, which silently fails because function references
  differ.
- **Scroll Jank via Non-Passive Handlers:** Attaching a `touchmove` or `wheel` listener
  without `{ passive: true }`, forcing browser thread synchronization and causing dropped
  frames during page scrolling.
- **Leaked Temporary Drag Listeners:** Registering `mousemove` or `pointermove` on `window`
  during `mousedown` without cleaning them up on `mouseup` or when drag leaves window boundaries.

## Validation Steps

- [ ] **Console Event Listener Audit:** Inspect the target element in browser DevTools
      using `getEventListeners(element)` or the Elements panel "Event Listeners" tab to
      confirm no duplicate handlers accumulate after re-rendering or interaction cycles.
- [ ] **Teardown Verification:** Trigger component unmount / route transition, then check
      `getEventListeners(window)` and `getEventListeners(document)` to verify all global
      scope listeners are completely removed.
- [ ] **Memory Heap Snapshot Test:** Record a Heap Snapshot in Chrome DevTools, interact
      with and destroy the component, force Garbage Collection (trash can icon), and search
      for "Detached HTMLButtonElement" or "Detached HTMLDivElement" to ensure zero retained
      nodes.
- [ ] **Passive Listener Violation Check:** Open DevTools Console with "Verbose" logging
      enabled and verify no warnings like `[Violation] Added non-passive event listener to
      a scroll-blocking 'touchstart' event` appear during scroll interactions.
- [ ] **Delegation Efficiency Test:** Verify that dynamically added items (inserted via
      `appendChild` or `innerHTML`) respond correctly to events without needing additional
      listener registration calls.
