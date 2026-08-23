# CSS Scroll Snap Module Level 1 & Browser Quirks Guide

This reference document outlines the technical specification details, browser rendering quirks, iOS Safari momentum scrolling behaviors, and performance best practices for CSS Scroll Snap Module Level 1.

---

## 1. CSS Scroll Snap Module Level 1 Key Properties

### Container Properties

| Property | Values | Description |
| :--- | :--- | :--- |
| `scroll-snap-type` | `none \| [ x \| y \| block \| inline \| both ] [ mandatory \| proximity ]` | Defines whether scroll snapping is enabled on the scroll container, along which axes, and its strictness. |
| `scroll-padding` | `<length-percentage>{1,4}` | Defines the optimal viewing region of the scroll container, offsetting snap targets away from edges (useful for sticky headers). |
| `scroll-padding-inline` | `<length-percentage>{1,2}` | Logical property setting inline (horizontal in LTR) scroll padding offsets. |
| `scroll-padding-block` | `<length-percentage>{1,2}` | Logical property setting block (vertical) scroll padding offsets. |

### Snap Item Properties

| Property | Values | Description |
| :--- | :--- | :--- |
| `scroll-snap-align` | `[ none \| start \| end \| center ]{1,2}` | Specifies how the child element aligns relative to the container's scroll snap area along block/inline axes. |
| `scroll-snap-stop` | `normal \| always` | Controls whether fast flick or scroll gestures can pass over multiple snap points (`normal`) or must catch on the next snap point (`always`). |
| `scroll-margin` | `<length-percentage>{1,4}` | Outset margin added to the element's snap box when calculating snap alignment. |

---

## 2. Browser Behaviors & Gotchas

### Sticky Header Overlaps & `scroll-padding`

**Problem:** When a page has a fixed navigation bar (`position: fixed` or `sticky`), scrolling or focusing on a snapped slide aligns the top edge of the slide to `y = 0`, placing content directly underneath the header.

**Solution:** Apply `scroll-padding-top` to the scroll container corresponding to the height of the sticky element:

```css
:root {
  --header-height: 72px;
}

.scroll-snap-vertical-container {
  scroll-snap-type: y mandatory;
  scroll-padding-top: var(--header-height);
}
```

---

### iOS Safari Momentum Scrolling & Rubber-Banding

**Problem:** On iOS Safari, touch scrolling in custom scroll containers can feel sluggish or lock up completely if WebKit touch momentum is disabled or if parent page body scrolling interferes.

**Solution:** Always include `-webkit-overflow-scrolling: touch` and isolate overscroll behavior:

```css
.scroll-snap-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}
```

---

### Fast Flick Skipping (`scroll-snap-stop: always`)

**Problem:** When users perform a fast swipe flick gesture on touch screens, browsers by default (`scroll-snap-stop: normal`) may jump over 3 to 4 items in a row. For step-by-step product walkthroughs or tutorial cards, this causes users to skip mandatory steps.

**Solution:** Declare `scroll-snap-stop: always` on all child snap items:

```css
.scroll-snap-item {
  scroll-snap-align: start;
  scroll-snap-stop: always; /* Forces gesture to capture on next adjacent item */
}
```

---

### `scroll-snap-type: mandatory` vs `proximity` Trapping

- **`mandatory`:** The scroll container *must* be resting on a snap point whenever scrolling stops. If the user releases a scroll gesture midway, the browser programmatically animates the viewport to the nearest snap point.
- **`proximity`:** The scroll container *may* rest on a snap point if scrolling stops close enough to one, but allows free scrolling if the user stops midway between snap points.

**Rule of Thumb:** Use `mandatory` for full-screen slides and modal step cards. Use `proximity` for long catalog lists and news feeds where partial item visibility is acceptable.

---

### Layout Thrashing Avoidance with `IntersectionObserver`

Listening synchronously to the `scroll` event and reading `element.getBoundingClientRect()` or `element.offsetLeft` forces browser layout recalculation on every scroll frame (60fps to 120fps), leading to dropped frames and choppy scrolling.

**Recommended Pattern:**

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Asynchronous, off-main-thread detection of active snapped item
      setActiveDot(entry.target.id);
    }
  });
}, {
  root: scrollContainer,
  threshold: 0.6
});
```
