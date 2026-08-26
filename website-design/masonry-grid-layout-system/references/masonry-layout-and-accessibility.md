# Masonry Layout Architecture and Accessibility Reference

This reference guide provides technical formulas, performance considerations, fallback strategies, and accessibility rules for implementing masonry grid layouts in web applications.

---

## 1. Column Calculation Formulas & Layout Math

When implementing JavaScript-based row-first masonry distribution (to preserve DOM reading order), items are appended to whichever column currently has the smallest total height.

### Shortest-Column Placement Algorithm
```javascript
/**
 * Calculates item placement in a row-first masonry layout.
 * @param {Array<HTMLElement>} items - Array of masonry card elements
 * @param {number} columnCount - Number of active columns based on viewport
 * @param {number} gap - Gap size in pixels
 */
function distributeMasonryItems(items, columnCount, gap) {
  const columnHeights = new Array(columnCount).fill(0);

  items.forEach(item => {
    // Find index of column with minimum current height
    const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

    // Calculate Y offset and X offset for CSS absolute positioning or flex column placement
    const offsetX = minColumnIndex * (item.offsetWidth + gap);
    const offsetY = columnHeights[minColumnIndex];

    // Position item
    item.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;

    // Update column height tracker (card height + gap)
    columnHeights[minColumnIndex] += item.offsetHeight + gap;
  });
}
```

---

## 2. Technical Strategy Comparison Matrix

| Layout Approach | CSS API | Keyboard DOM Focus Order | Performance Impact | Browser Support |
| :--- | :--- | :--- | :--- | :--- |
| **CSS Multi-Column** | `column-count: 3; column-gap: 24px;` | Vertical top-to-bottom per column (Mismatched for interactive items) | Ultra Fast (Native CSS layout engine) | All modern browsers (100%) |
| **Native CSS Grid Masonry** | `grid-template-rows: masonry;` | Horizontal row-first left-to-right | Ultra Fast (Native browser C++ layout engine) | Firefox (behind flag), Safari TP |
| **Shortest-Column Flex Stack** | JavaScript container distribution into `N` `.column` wrappers | Left-to-right (Row-first source DOM order) | Fast (Triggers recalculation on resize) | All modern browsers (100%) |
| **Absolute Positioning JS** | `position: absolute; transform: translate3d()` | Left-to-right across DOM | Moderate (Requires ResizeObserver batching) | All modern browsers (100%) |

---

## 3. Keyboard Navigation & Screen Reader Guidelines

### WCAG 2.2 AA Compliance Requirements

1. **SC 1.3.2 Meaningful Sequence (Level A):**
   - Content sequence parsed by screen readers or navigated via `Tab` must make logical sense.
   - For interactive masonry grids (containing links, buttons, or form controls), visual reading order must match DOM order.
   - **Rule:** Do not use `column-count` CSS layouts if cards contain interactive elements unless tab order is managed or reordered.

2. **SC 2.4.7 Focus Visible (Level AA):**
   - Focused cards or interactive buttons inside cards must display high-contrast focus rings (`outline: 3px solid var(--focus-color); outline-offset: 2px;`).
   - **Rule:** Never apply `overflow: hidden` on column containers without padding, as it clips focus rings.

3. **SC 2.5.8 Target Size (Minimum) (Level AA):**
   - Interactive triggers (Save, Like, Expand, Category Badges) must have minimum touch target boundaries of `24x24px` on desktop and `44x44px` on touch viewports.

---

## 4. Cumulative Layout Shift (CLS) Mitigation Protocol

To achieve a CLS score of **< 0.1**, dynamic image containers inside masonry cards must declare their aspect ratio prior to asset loading:

```css
/* Inline HTML or CSS aspect-ratio rule */
.masonry-card-media {
  width: 100%;
  aspect-ratio: attr(width) / attr(height);
  background-color: var(--surface-placeholder, #1e293b);
}
```

If images are dynamically loaded via API (e.g., Unsplash or UGC feeds), store the image width and height in data attributes and set CSS custom properties dynamically:

```javascript
cardMediaElement.style.setProperty('--item-aspect-ratio', `${img.width} / ${img.height}`);
```
