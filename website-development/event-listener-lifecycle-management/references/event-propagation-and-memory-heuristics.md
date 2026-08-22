# Event Propagation and Memory Heuristics

This reference guide details the internal mechanics of DOM event propagation, browser memory allocation, `AbortController` signal execution, passive event listener thread optimization, and Chrome DevTools heap profiling heuristics.

---

## 1. DOM Event Propagation Architecture

When an event occurs on a DOM element, the browser executes a 3-phase propagation sequence defined by the DOM Event Specification:

```text
               WINDOW
                 |  ▲
  1. Capture     |  |  3. Bubble
     Phase       v  |     Phase
              DOCUMENT
                 |  ▲
                 v  |
               ELEMENT
                 |  ▲
                 v  |
            TARGET ELEMENT (2. Target Phase)
```

### Propagation Phases

1. **Capturing Phase (`CAPTURING_PHASE` = 1):** The event propagates downwards from `window` through child elements until it reaches the target's parent. Registered listeners with `{ capture: true }` fire during this phase.
2. **Target Phase (`AT_TARGET` = 2):** The event reaches the target element (`event.target`). Listeners registered directly on the target fire in the order they were attached.
3. **Bubbling Phase (`BUBBLING_PHASE` = 3):** The event bubbles back upwards from the target's parent up to `window`. Standard listeners (`{ capture: false }`) fire during this phase.

### Event Delegation Mechanics

Event delegation relies on the Bubbling Phase. By attaching a single event listener to an ancestor node, the ancestor intercepts all events originating from descendant nodes.

```javascript
// Determining matching element during bubbling
container.addEventListener('click', (event) => {
  // event.target = Deepest clicked element (e.g., <span> inside <button>)
  // event.currentTarget = Container element receiving the event

  // Element.closest() traverses parent hierarchy to find matching ancestor
  const button = event.target.closest('button.action-btn');
  if (button && container.contains(button)) {
    // Process action
  }
});
```

#### Bubbling Behavior Matrix

| Event Name | Bubbles? | Delegatable via Default (`capture: false`)? | Delegatable via Capture (`capture: true`)? |
| :--- | :--- | :--- | :--- |
| `click`, `dblclick`, `input`, `keydown` | **Yes** | **Yes** | **Yes** |
| `focusin`, `focusout` | **Yes** | **Yes** | **Yes** |
| `focus`, `blur` | **No** | **No** | **Yes** |
| `mouseenter`, `mouseleave` | **No** | **No** | **No** (Use `pointerenter` or `mouseover`) |
| `scroll`, `load`, `unload` | **No** (On elements) | **No** | **Yes** |

---

## 2. Memory Heuristics & Detached DOM Nodes

### How Event Listeners Retain Memory

In V8 (Chrome/Node) and JavaScriptCore (Safari), a function closure retains references to all variables in its lexical scope. When an event listener is attached to `window` or `document`, the browser holds a strong reference to that listener until it is explicitly removed or aborted.

```javascript
// MEMORY LEAK HEURISTIC
function setupWidget() {
  const heavyData = new Array(1_000_000).fill('data');
  const widgetElement = document.createElement('div');

  // Leak: window retains handler -> handler retains scope -> scope retains heavyData AND widgetElement
  window.addEventListener('resize', () => {
    console.log(widgetElement.id, heavyData.length);
  });
}
```

Even if `widgetElement` is removed from the DOM tree (`widgetElement.remove()`), it becomes a **Detached HTMLDivElement**. Because `window` holds the event listener closure, Garbage Collection CANNOT reclaim `widgetElement` or `heavyData`.

### AbortController Lifecycle Signal Execution

Modern browsers accept an `AbortSignal` inside `addEventListener` options:

```javascript
const controller = new AbortController();
window.addEventListener('resize', handler, { signal: controller.signal });

// Executing controller.abort() performs:
// 1. Removes the listener registration from window's internal EventListenerMap.
// 2. Unlinks the callback closure from the event target.
// 3. Allows V8 Garbage Collector to reclaim closure scope and bound variables in the next GC cycle.
controller.abort();
```

---

## 3. Passive Event Listener Thread Optimization

### Main-Thread Scroll Blocking

When a user touches the screen or uses a scroll wheel, the browser compositor thread must decide whether to scroll the page immediately or wait for JavaScript to execute.

- **Non-Passive Listener (Default for custom targets):** Browser pauses scrolling and waits for JS event loop execution to check if `event.preventDefault()` was called. Result: Frame drop and input lag (scroll jank).
- **Passive Listener (`{ passive: true }`):** Informs the compositor thread that JavaScript will NEVER cancel the scroll event via `preventDefault()`. Scrolling occurs smoothly on the compositor thread without waiting for the main thread.

```javascript
// Compositor thread proceeds immediately without blocking on JS
window.addEventListener('touchmove', handleTouch, { passive: true });
```

---

## 4. Chrome DevTools Heap Snapshot Profiling

To prove event listener cleanup and zero detached DOM retention using Chrome DevTools:

1. **Record Baseline Snapshot:** Open **DevTools > Memory > Heap Snapshot > Take Snapshot**.
2. **Execute Action & Teardown:** Mount component, trigger interactions, unmount component / call `controller.abort()`.
3. **Collect Garbage:** Click the **Trash Can** icon in DevTools Memory panel to force garbage collection.
4. **Take Comparison Snapshot:** Take Snapshot 2.
5. **Analyze Detached Elements:**
   - Select **Snapshot 2**.
   - Change perspective from **Summary** to **Comparison** or filter class names by typing `Detached`.
   - If any `Detached HTMLDivElement` or `Detached DOM Tree` appears, inspect the **Retainers** tree at the bottom.
   - Look for `system / Context` or `event listener` references pinpointing the leaking handler closure.
