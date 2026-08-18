# Browser Rendering Pipelines & Content Visibility Technical Notes

This reference provides deep technical context on browser rendering engine behavior, CSS layout containment specifications, accessibility tree integration, and cross-browser execution details.

---

## 1. The Browser Rendering Pipeline Overview

To understand why `content-visibility: auto` produces massive performance gains, consider the standard browser rendering pipeline:

```text
[ JavaScript / DOM Mutation ]
             │
             ▼
   [ Recalculate Style ]  <── Matches CSS rules to DOM nodes
             │
             ▼
         [ Layout ]       <── Computes exact geometric positions & bounding boxes
             │
             ▼
          [ Paint ]       <── Rasterizes pixels into display layers
             │
             ▼
        [ Composite ]     <── Draws layers onto GPU screen buffers
```

### The Off-Screen DOM Problem
In standard CSS rendering (`content-visibility: visible`), the browser must compute **Recalculate Style** and **Layout** for every single node in the document tree—even nodes positioned thousands of pixels below the current viewport.

For a document with 3,000 DOM nodes, adding or removing a class on `<body>` (such as toggling dark mode) forces the engine to re-evaluate styles across all 3,000 nodes, blocking the Rendering Thread and causing high Interaction to Next Paint (INP) latency.

---

## 2. CSS Containment Specifications (`contain` and `content-visibility`)

The W3C CSS Containment Module introduces primitive boundary isolations that allow developers to limit the scope of browser rendering work.

### Individual Containment Primitives (`contain`)

- `contain: layout` — Guarantees that internal layout changes inside the element do not affect descendants or ancestors outside the element boundary.
- `contain: paint` — Guarantees that internal children do not paint outside the element's bounding box. Off-screen elements with `contain: paint` skip pixel rasterization.
- `contain: style` — Prevents counters and quotes from bleeding into the parent scope.
- `contain: size` — The element's size is calculated **without** looking at its children. Requires explicit `width`/`height` or `contain-intrinsic-size`.

### `content-visibility: auto` Mechanics

When `content-visibility: auto` is declared:
1. The browser checks whether the element is currently relevant to the user (i.e. inside or near the viewport, focused, selected, or targeted by in-page search).
2. If the element is **off-screen and non-relevant**:
   - The browser automatically applies `contain: layout paint style size` to the element.
   - Children inside the element are skipped during **Style Recalculation**, **Layout**, and **Paint**.
3. As the element scrolls **near the viewport**:
   - The browser removes containment locks and asynchronously schedules layout/paint before the element becomes visible to the user.

---

## 3. The Role of `contain-intrinsic-size`

Because `content-visibility: auto` turns on `contain: size` while an element is off-screen, the element would collapse to `0px × 0px` height if no placeholder size was provided. This collapse causes severe layout shifts and scrollbar thumb jumping.

`contain-intrinsic-size` solves this by supplying an explicit placeholder dimension when size containment is active.

### Syntax Variations

```css
/* Fixed fallback height */
contain-intrinsic-size: 300px;

/* Fixed width and height (width height) */
contain-intrinsic-size: 100% 400px;

/* Dynamic cached height (auto keyword) */
contain-intrinsic-size: auto 350px;
```

#### How `auto <length>` Works:
1. On initial page load, before the element has ever been rendered, the browser uses the fallback estimate (e.g. `350px`).
2. When the user scrolls the element into view, the browser measures its true rendered height (e.g. `382px`).
3. When the user scrolls past and the element leaves the viewport again, the browser caches `382px` as the intrinsic size, eliminating future scrollbar adjustments!

---

## 4. Accessibility & Find-In-Page Integration

A critical architectural distinction between `content-visibility: auto` and `display: none`:

| Metric / Behavior | `display: none` | `visibility: hidden` | `content-visibility: auto` |
| :--- | :--- | :--- | :--- |
| **Render Skipped?** | Yes | Partial (Layout calculated) | Yes (when off-screen) |
| **DOM Tree Present?** | Yes | Yes | Yes |
| **Accessibility Tree?** | **Excluded** | **Excluded** | **Included** |
| **Find-In-Page (`Ctrl+F`)?** | No | No | **Yes (Triggers Render)** |
| **Focusable Children?** | No | No | **Yes (Triggers Render)** |

When a user triggers `Ctrl+F` or keyboard tabs to an interactive element inside a `content-visibility: auto` block, the browser intercepts the event, temporarily removes rendering containment, renders the element, and scrolls it into view seamlessly.

---

## 5. Cross-Browser Engine Support Matrix

| Browser Engine | `content-visibility` | `contain-intrinsic-size` | `contain-intrinsic-size: auto` |
| :--- | :--- | :--- | :--- |
| **Chromium** (Chrome, Edge, Opera, Brave) | Supported (v85+) | Supported (v85+) | Supported (v98+) |
| **WebKit** (Safari macOS / iOS) | Supported (v18.0+) | Supported (v18.0+) | Supported (v18.0+) |
| **Gecko** (Firefox) | Supported (v125+) | Supported (v125+) | Supported (v125+) |

### Fallback Philosophy
Because `content-visibility` is purely a progressive performance enhancement, non-supporting browsers ignore the property and render layout using standard DOM positioning. Wrapping rules in `@supports (content-visibility: auto)` prevents unexpected property parsing issues in older browser builds.
