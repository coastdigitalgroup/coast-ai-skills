---
name: virtual-list-implementation
description:
  Implement and debug high-performance list virtualization (windowing) that
  safely manages DOM node count, handles variable item heights, and preserves
  full keyboard focus and screen reader accessibility.
---

# Virtual List & DOM Virtualization Implementation

## Purpose

The Virtual List & DOM Virtualization skill provides a technical protocol for implementing, debugging, and maintaining virtualized lists and grids (also known as windowing). When displaying large datasets (thousands of items), standard rendering practices bloat the Document Object Model (DOM), leading to severe memory consumption, slow layout/paint cycles, and laggy, unresponsive scrolling (especially on low-end devices).

This skill teaches how to keep DOM node counts constant by rendering only the visible items (plus a small buffer) inside a viewport, shifting them dynamically via CSS positioning, while preserving accessibility, keyboard navigation, and seamless scroll experiences.

---

## Use Cases

- **Large E-Commerce Catalogs:** Rendering search results or product listing pages with thousands of products without infinite DOM growth.
- **Data Grids & Tables:** Visualizing massive tables with high row counts and interactive columns.
- **Activity Streams & Logs:** Handling real-time system, chat, or social media feeds with infinite scroll overlays.
- **In-Memory Filtering & Search:** Instantaneous client-side filtering on datasets with 5,000+ items where rendering all matched results would freeze the browser.

---

## When NOT to Use

- **Small Lists (< 150 items):** The overhead of coordinate calculations and scroll-event listener attachment exceeds the performance benefits of rendering 100 extra flat DOM nodes.
- **Varying Layout Elements:** If the list contains complex, completely unpatterned layouts with massive, unpredictable DOM branches (e.g., standard blog articles, long-form nested documentation trees), virtualization is too complex and may cause rendering flickering. Use traditional pagination or lazy loading instead.
- **Native Document Search Reliance:** Native browser "Find on Page" (Ctrl+F) will fail to discover unrendered virtualized items. If a user needs to search the entire document's text natively, virtualization is inappropriate. Use custom, virtual-aware local search overlays instead.
- **Print Pages:** Virtualized elements cannot print cleanly because off-screen items don't exist in the DOM. Turn off virtualization or swap to a flat layout during `@media print`.

---

## Inputs

1. **Host Viewport Container:** A block-level DOM element with fixed height and `overflow-y: auto` (or a window-level scroll boundary).
2. **Item Count & Data Source:** The total number of items in the dataset and a data retrieval function (index-based callback or array).
3. **Item Size Configuration:**
   - *Fixed-height:* A constant pixel value (e.g., `50px`).
   - *Dynamic-height:* A height calculator/cache or a minimum estimated height used for rendering, combined with a way to measure elements after they mount.
4. **Buffer Size:** The number of extra rows to render above and below the visible viewport to prevent visible flickering during rapid scroll movements (typically 3 to 5 items).

---

## Outputs

1. **Semantic HTML Structure:**
   - A scrollable viewport wrapper (`role="feed"`, `role="list"`, or `role="grid"`).
   - A virtual spacer element (runway) that sets the total scrollable height to simulate the entire list size, preventing the browser scrollbar from collapsing.
   - An active item container containing only the visible subset of items styled with `position: absolute` or `transform: translateY()`.
2. **Dynamic Render Cycle:** An event-driven rendering loop (bound to `scroll` and `resize` events) optimized with `requestAnimationFrame` or `passive` listeners.
3. **Accessibility Attributes:** Precise injection of `aria-rowcount`/`aria-colcount`, `aria-rowindex`, `aria-setsize`, and `aria-posinset` attributes.
4. **Layout-Safe Position Logic:** CSS properties and inline transforms that safely place items at their correct visual positions without causing layout thrashing.

---

## Workflow

### 1. Establish the Structural DOM Anatomy

```
+----------------------------------------+  <- 1. Viewport Container (Overflow: Auto / Scrollable)
| [Off-Screen Buffer Top] (Invisible)    |
|========================================|
| +------------------------------------+ |  <- 2. Spacer (Runway) height = Total Items * Item Height
| | [Visible Item 1] (y = 150px)       | |
| | [Visible Item 2] (y = 200px)       | |  <- 3. Visually Positioned Items
| | [Visible Item 3] (y = 250px)       | |
| +------------------------------------+ |
|========================================|
| [Off-Screen Buffer Bottom] (Invisible) |
+----------------------------------------+
```

Implement three distinct nested elements:
- **Viewport:** The scrollable outer frame. Needs `overflow-y: auto`, `position: relative`, and `-webkit-overflow-scrolling: touch`.
- **Spacer (Runway):** An empty, non-interactive element inside the viewport. Its sole role is to enforce the full simulated height of all items (e.g., `10,000 items * 50px = 500,000px`) so the browser's scrollbar behaves naturally.
- **Content Container:** Holds the active items. Often set to `position: absolute; top: 0; left: 0; width: 100%;`.

### 2. Formulate the Math (Fixed Height Protocol)

For a viewport with `scrollTop`, viewport height `H`, fixed item height `h`, and total item count `N`, compute the following indices on scroll:

1. **First Visible Index (`firstVisible`):**
   $$\text{firstVisible} = \max(0, \lfloor \text{scrollTop} / h \rfloor)$$
2. **Last Visible Index (`lastVisible`):**
   $$\text{lastVisible} = \min(N - 1, \lfloor (\text{scrollTop} + H) / h \rfloor)$$
3. **Buffered Range (`start` to `end`):**
   $$\text{start} = \max(0, \text{firstVisible} - \text{buffer})$$
   $$\text{end} = \min(N - 1, \text{lastVisible} + \text{buffer})$$
4. **Offset Translation (`offsetY`):**
   Apply `transform: translateY(start * h)` to the Content Container or position each item absolutely at `top: index * h`. This offsets the elements back into the visible region.

### 3. Implement Dynamic Height Virtualization (The Cache Loop)

When heights are not fixed:
1. **Initialize an Estimation Map:** Maintain an array or map containing estimated heights for every item index.
2. **Calculate Approximate Offset Map:** Maintain a cumulative sum array of offsets: `offset[i] = offset[i-1] + height[i-1]`.
3. **Locate Range via Binary Search:** Because offsets are monotonically increasing, search the offset array to find the first index where `offset[index] + height[index] > scrollTop`. This is `firstVisible`.
4. **Render & Measure (The Reflow Correction):**
   - Render the calculated slice of items.
   - Immediately after mounting (using a `ResizeObserver` or in a post-render layout hook), measure the *actual* DOM height of each rendered item: `const rectHeight = element.getBoundingClientRect().height;`.
   - If the actual height differs from the estimated height:
     1. Update the height cache: `height[index] = rectHeight`.
     2. Recalculate the cumulative offsets from that index forward.
     3. Adjust the Spacer's height to prevent scrollbar jumping.
     4. Adjust the scrollbar's `scrollTop` dynamically if items above the current visible viewport changed size (Scroll Anchoring).

### 4. Manage Keyboard Focus and Screen Reader Navigation

Virtualization deletes off-screen elements, which breaks standard keyboard `Tab` sequences and confuses screen readers. Implement these remediation strategies:

- **Coordinate Accessible Roles:**
  - Mark the Viewport Container with `role="list"`, `aria-label="Virtualized list"`.
  - Mark each virtual item with `role="listitem"`.
- **Set Positional Metadata:** Screen readers announce position relative to total size. Inject `aria-setsize="N"` on every item and `aria-posinset="index + 1"`.
- **Trap Focus Safely:**
  - If a keyboard-focused item is about to scroll out of view and be unmounted, intercept the scroll/unmount hook and programmatically move focus to a sibling item or back to the viewport wrapper.
  - Support `ArrowUp` and `ArrowDown` keys to move focus programmatically by changing the selected index and scrolling the target item into view: `item.scrollIntoView({ block: 'nearest' })`.

### 5. Attach Performance-Safe Event Listeners

- Register scroll handlers as passive to avoid blocking the main thread during compositing:
  ```javascript
  viewport.addEventListener('scroll', handleScroll, { passive: true });
  ```
- Wrap render updates inside a `requestAnimationFrame` call to coordinate writes with the browser paint cycle, preventing layout thrashing:
  ```javascript
  let tick = false;
  function handleScroll() {
    if (!tick) {
      requestAnimationFrame(() => {
        updateDOM();
        tick = false;
      });
      tick = true;
    }
  }
  ```

---

## Decision Rules

### Fixed Height vs. Dynamic Height Virtualization
```
                Are all item heights identical and known?
                             /            \
                           YES             NO
                           /                \
             [Fixed-Height Model]       Do we know the heights before render?
             - Fast O(1) index lookups.        /                    \
             - No ResizeObservers needed.    YES                     NO
             - Simple translate calculation. /                        \
                            [Pre-calculated Height Model]    [Dynamic Height Model]
                            - Binary Search O(log N).        - ResizeObserver tracking.
                            - Uses height map arrays.        - Post-render recalculations.
                                                             - Scroll anchoring adjustment.
```

### Scrolling Wrapper Selection
- **Window Scrolling:** Use when the list represents the primary content of the page. This keeps native mobile navigation bars responsive but requires observing global scroll and computing offsets relative to the window.
- **Div Scrolling (Element Overflow):** Use for sub-components, sidebars, or dashboards. It is significantly simpler to implement because offsets align directly with `element.scrollTop`.

---

## Constraints

- **Hardware Acceleration:** Ensure virtual items are elevated to their own compositor layers using `will-change: transform` to bypass repaint cycles.
- **Windows Forced Colors:** Ensure absolute elements or custom visual focuses do not lose outline markers under Windows High Contrast Mode by using `outline: 2px solid CanvasText` or standard systemic colors.
- **Memory Cap:** Avoid caching DOM elements. Recycle DOM nodes or completely recreate them. Keeping more than 50 elements active at once in a list defeats the performance objective.
- **Touch Inertia:** iOS Safari requires `-webkit-overflow-scrolling: touch` to allow natural scroll momentum in local overflow-div elements.

---

## Non-Goals

- Writing customized database queries or REST endpoints supporting infinite pagination (covered by `infinite-scroll-implementation`).
- Implementing complex drag-and-drop mechanics on virtual lists.
- Designing high-fidelity styling for list items (e.g., custom card layouts, product grid stylings).

---

## Common Failure Patterns

- **Scrollbar Jumping (Layout Shift):** If dynamic heights are measured but cumulative scroll offsets are calculated incorrectly, the scrollbar will violently jitter or shift as the user scrolls, leading to severe Cumulative Layout Shift (CLS).
- **Blank Spaces on Fast Scrolling:** Setting the buffer size too small or missing the scroll throttle window, causing the user to scroll past rendered items into empty runway space.
- **Silent Accessibility Blindness:** Forgetting `aria-setsize` and `aria-posinset`. Screen readers will announce every visible element as "1 of 5" instead of "4512 of 10000", leaving visually impaired users disoriented.
- **Keyboard Tab-Sequence Breaking:** When a user tabs into the virtual list and uses arrow keys, but the container deletes the focused node from the DOM, causing focus to drop back to the page root (`body`). This resets the user's focus completely.
- **Layout Thrashing via Scroll Handler:** Invoking `.getBoundingClientRect()` or editing style properties synchronously inside the scroll event without batching, triggering synchronous layout reflow on every scroll tick.

---

## Validation Criteria

### 1. Performance Profiling
- Open Chrome DevTools and activate the **Performance** panel.
- Record a session while scrolling rapidly through the list.
- **Pass Criteria:** FPS remains constant at 60fps; no long-running yellow scripting tasks (Scripting tasks should remain under 16ms); heap memory allocations do not climb linearly with scroll distance.

### 2. DOM Node Stability check
- Open the DevTools **Elements** panel.
- Inspect the active items container. Scroll through the virtual list (e.g., from item 1 to item 1,000).
- **Pass Criteria:** The total number of list-item DOM elements remains constant (e.g., always exactly 15 elements, with only their text content and style transforms updating).

### 3. Keyboard & Screen Reader Accessibility Audit
- Turn on a screen reader (e.g., VoiceOver, NVDA).
- Focus on the first element inside the list and navigate using keyboard arrows (`ArrowDown`).
- **Pass Criteria:** Screen reader announces the correct list index (e.g., "Item 500, 500 of 10,000").
- **Pass Criteria:** Tabbing into and out of the list preserves standard sequential tab order. Focus is never lost to the document root when elements are recycled.

### 4. Layout Shift (CLS) Verification
- In Chrome DevTools, open the **Rendering** tab and check **Layout Shift Regions**.
- Scroll slowly and quickly through the virtualized list.
- **Pass Criteria:** No blue layout shift flashes appear on the scrollbar or parent container. The scroll indicator moves smoothly.
