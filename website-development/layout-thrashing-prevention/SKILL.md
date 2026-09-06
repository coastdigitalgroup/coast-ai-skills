---
name: layout-thrashing-prevention
description: Eliminate forced synchronous layouts and frame drops by decoupling geometric DOM queries from style mutations using fast batching, layout caching, and frame-aligned scheduling.
---

# Layout Thrashing Prevention

## Purpose

The Layout Thrashing Prevention skill provides a technical protocol, architectural pattern, and diagnostic checklist for eliminating forced synchronous reflows (layout thrashing) in frontend web applications.

Layout thrashing occurs when JavaScript repeatedly interleaves reading geometric properties from the DOM (e.g., `offsetHeight`, `getBoundingClientRect()`, `scrollTop`) with modifying DOM styles or structure (e.g., `style.width`, `classList.add()`, `appendChild()`). This forces the browser rendering engine to stop script execution, flush pending dirty layout trees, and recalculate geometry synchronously within the same frame loop—leading to severe frame rate degradation (10-15 FPS), input lag, and poor Interaction to Next Paint (INP) performance.

This skill provides the techniques required to decouple read and write operations, queue frame-aligned mutations, cache layout state, and ensure buttery-smooth 60fps/120fps interactions.

---

## Use Cases

- **Dynamic Card / Grid Height Alignment:** Equalizing the height of multiple variable-content cards or table rows after render without looping reads and writes per element.
- **High-Frequency Scroll & Resize Handlers:** Calculating scroll positions, sticky header visual transitions, or parallax offsets during active user scrolling or window resizing.
- **Drag-and-Drop & Touch Interactions:** Computing element coordinates, reordering targets, or proximity metrics during `pointermove` or `touchmove` events.
- **Animated List Modifications & FLIP Animations:** Measuring element positions before and after DOM shifts (First, Last, Invert, Play) without triggering multiple reflow passes.
- **Infinite Feed & Masonry Layout Adjustments:** Dynamically appending items to feeds and measuring offsets while maintaining scroll anchor positions.

---

## When NOT to Use

- **CSS-Only Layout Solutions:** Scenarios where layout positioning can be handled declaratively using Modern CSS (Flexbox, CSS Grid, Container Queries, `subgrid`, CSS Anchor Positioning, `position: sticky`). Always prefer native CSS over JS-based geometry calculations.
- **Non-Geometric DOM Updates:** Toggling classes or attributes that do not rely on reading physical DOM dimensions (e.g., toggling `aria-expanded` or switching light/dark theme classes).
- **Static Content Pages:** Pages without interactive script-driven DOM manipulation or animation.
- **Web Animation API (WAAPI) & CSS Transitions:** Declarative or engine-driven property animations on `transform` and `opacity`, which run on the compositor thread and bypass the layout pipeline entirely.

---

## Inputs

1. **DevTools Performance Trace:** A recorded trace in Chrome/Edge/Firefox DevTools showing repeated "Recalculate Style" and "Layout" events flagged with warning markers during script execution.
2. **Target DOM Subtree & Interaction Code:** The event handlers, loop structures, or observer callbacks performing interleaved DOM reads (`element.clientHeight`, `window.getComputedStyle()`) and writes (`element.style.height = ...`).
3. **Execution Context:** The trigger frequency (e.g., single click event vs. high-frequency `requestAnimationFrame` loop, `scroll` event, or `ResizeObserver` callback).

---

## Outputs

1. **Refactored Batch-Read-Write Code:** Clean separation of layout queries (Phase 1: Read Batch) from DOM style mutations (Phase 2: Write Batch).
2. **Read/Write Queue Architecture:** Integration of a lightweight frame-aligned scheduler (or `requestAnimationFrame` queue) to defer writes until the next paint preparation phase.
3. **Cached Layout State Management:** A state cache for static or low-frequency geometric measurements to eliminate unnecessary DOM queries during high-frequency interaction frames.

---

## Workflow

### 1. Identify Interleaved Reads and Writes in Code or Profiler
Detect forced synchronous layout in DevTools or through code auditing. Look for the classic thrashing pattern:

```javascript
// BAD: Interleaved Read and Write in a loop -> Layout Thrashing!
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  // READ (forces layout recalculation if styles are dirty)
  const height = card.offsetHeight;
  // WRITE (dirties the layout tree)
  card.style.height = `${height + 20}px`;
});
```

### 2. Separate into Two Distinct Phases: Batch Reads, Then Batch Writes
Rearrange the code structure so that **ALL** geometric reads across all elements are executed first, stored in memory, and **THEN** all style writes are applied together.

```javascript
// GOOD: Phase 1 (Reads), Phase 2 (Writes)
const cards = document.querySelectorAll('.card');

// Phase 1: Read all dimensions into memory
const heights = Array.from(cards, card => card.offsetHeight);

// Phase 2: Apply all mutations together
cards.forEach((card, index) => {
  card.style.height = `${heights[index] + 20}px`;
});
```

### 3. Defer Writes Using `requestAnimationFrame` (rAF Batching)
When DOM writes must be scheduled during high-frequency events (`scroll`, `pointermove`, `resize`), queue the write phase to run on the next frame paint using `requestAnimationFrame`.

```javascript
let pendingWrite = false;
let latestScrollY = 0;

window.addEventListener('scroll', () => {
  // Read current state immediately from event or property
  latestScrollY = window.scrollY;

  if (!pendingWrite) {
    pendingWrite = true;
    requestAnimationFrame(() => {
      // Perform write pass in frame preparation
      header.classList.toggle('scrolled', latestScrollY > 100);
      pendingWrite = false;
    });
  }
}, { passive: true });
```

### 4. Cache Layout Measurements on Resize or Mutation
If an element's size only changes when the window resizes, measure and store its geometry once during resize (or using `ResizeObserver`) rather than querying the DOM on every interaction frame.

```javascript
class ElementTracker {
  constructor(element) {
    this.element = element;
    this.cachedBounds = null;
    this.updateCache();
  }

  updateCache() {
    // Read and store bounds once
    this.cachedBounds = this.element.getBoundingClientRect();
  }

  get bounds() {
    // Return cached geometry during high-frequency checks
    return this.cachedBounds || this.element.getBoundingClientRect();
  }
}
```

---

## Decision Rules

### Architectural Approach Selection Matrix

| Scenario / Context | Recommended Strategy | Primary Mechanism |
| :--- | :--- | :--- |
| **Multi-element height/width equalization** | Two-pass batching (Read array then Write loop) | In-memory synchronous arrays |
| **High-frequency event listeners (`scroll`, `mousemove`)** | Passive event listener + rAF debouncing | `requestAnimationFrame` flag |
| **Complex component trees with cross-component reads/writes** | Centralized Read/Write Task Queue | Lightweight DOM Batcher Utility |
| **Drag-and-drop / FLIP position tracking** | Cache coordinates on drag start; compute via CSS transform | `transform: translate3d()` |
| **Component dimension responsiveness** | Container Queries or `ResizeObserver` with rAF write batching | `ResizeObserver` + microtask/rAF batch |

---

## Constraints

- **Frame Budget Target:** To maintain 60fps, total JavaScript execution (including layout calculations) must complete within **< 10ms** per frame (to allow 6.6ms for browser style, layout, paint, and composite). For 120fps displays, the budget is **< 4.5ms**.
- **`getComputedStyle` Performance:** `window.getComputedStyle(element)` flushes the entire document layout tree if any styles are dirty. Never call `getComputedStyle()` inside high-frequency loops or scroll handlers.
- **Passive Event Listeners:** Always attach `scroll` and `touchmove` listeners with `{ passive: true }` so the compositor thread can scroll immediately without waiting for main-thread event listener execution.
- **CSS Property Isolation:** Prefer changing `transform` and `opacity` over layout-triggering properties (`width`, `height`, `top`, `left`, `margin`). `transform` changes run on the compositor thread and do not trigger reflows.

---

## Non-Goals

- Replacing native CSS layout engines (CSS Grid, Flexbox, Container Queries).
- Server-Side Rendering (SSR) or initial HTML parse optimization.
- Network asset loading or resource prefetching.

---

## Common Failure Patterns

- **The Interleaved Loop:** Reading layout properties inside a loop that also updates element styles, triggering N reflows for N elements instead of 1 reflow.
- **Reading Geometry After Adding/Removing Classes:** Adding a CSS class (`element.classList.add('active')`) and immediately reading `element.offsetHeight` on the same line to trigger an animation. This forces a synchronous reflow.
- **Unbatched `ResizeObserver` Callbacks:** Performing direct DOM writes inside a `ResizeObserver` callback, which can trigger additional resize events and cause "ResizeObserver loop limit exceeded" errors.
- **Over-Querying Scroll Offsets:** Calling `element.getBoundingClientRect()` inside an active `scroll` event handler without `requestAnimationFrame` debouncing or `IntersectionObserver`.

---

## Validation Steps

### 1. DevTools Performance Panel Verification
- [ ] Record a 5-second trace while triggering the interactive flow (scrolling, dragging, height equalization).
- [ ] Inspect the **Main Thread** timeline for red warning flags on "Recalculate Style" or "Layout".
- [ ] Confirm that "Layout" occurs at most **once** per animation frame rather than multiple times inside a single event handler execution.

### 2. Rendering Frame Rate Check
- [ ] Open DevTools Command Menu (`Cmd+Shift+P` / `Ctrl+Shift+P`) and enable **Show Rendering (FPS meter)**.
- [ ] Confirm frame rate remains stable at 60 FPS (or 120 FPS on high refresh displays) during continuous user interaction.

### 3. Automated Code Audit
- [ ] Verify that no layout-triggering getters (`offsetHeight`, `offsetWidth`, `getBoundingClientRect`, `getComputedStyle`) are called after style mutations (`style.x`, `classList.add`, DOM append) within the same execution frame.
