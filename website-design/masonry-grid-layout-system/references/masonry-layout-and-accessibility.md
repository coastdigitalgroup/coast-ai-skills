# Masonry Layout Architecture & Accessibility Guidelines

This reference document outlines technical implementation strategies, DOM focus ordering algorithms, performance optimizations, and WCAG AA accessibility standards for masonry grid layouts.

---

## Technical Comparison of Masonry Architecture Patterns

| Architectural Pattern | Implementation Method | Browser Overhead | Reading / Focus Order | Best Fit Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **CSS Multi-Column** | `column-count: N;` + `break-inside: avoid;` | Extremely low (Pure CSS) | Vertical down columns ($Col_1 \rightarrow Col_2$) | Non-interactive photo galleries, lightboxes. |
| **JS Shortest-Column Flex** | Dynamic Flex tracks ($N$ column `<div>`s) + JS height loop | Minimal (Calculated on append & resize) | Horizontal left-to-right ($Item_1 \rightarrow Item_2$) | Interactive feeds, social activity walls, card forms. |
| **CSS Grid Row-Spanning** | `grid-auto-rows: 10px;` + `grid-row: span X;` | Moderate (Requires element height queries) | Horizontal natural DOM order | Mixed editorial feeds, blog pinboards. |
| **Absolute Position Masonry** | `position: absolute; left: Xpx; top: Ypx;` | High (Full layout calculation in JS) | Dictated by raw DOM list order | Legacy Masonry.js implementations (avoid if possible). |

---

## DOM Focus Order Reconciliation (WCAG 1.3.2)

### The Core Problem
When multi-column visual layouts run vertically down columns (as in CSS `column-count`), the visual sequence conflicts with keyboard tab navigation (`Tab` key). A user pressing `Tab` expects focus to move predictably from top-left to top-right across adjacent cards. With CSS columns, focus jumps all the way to the bottom of the first column before returning to the top of column 2.

```text
CSS Multi-Column Tab Sequence (Problematic for Interactive Cards):
[ Column 1 ]       [ Column 2 ]       [ Column 3 ]
Card 01 [Tab 1]    Card 05 [Tab 5]    Card 09 [Tab 9]
Card 02 [Tab 2]    Card 06 [Tab 6]    Card 10 [Tab 10]
Card 03 [Tab 3]    Card 07 [Tab 7]
Card 04 [Tab 4]    Card 08 [Tab 8]
```

### The Solution: Shortest-Column Distribution Algorithm
By creating $N$ flex column tracks and distributing cards into the shortest column track dynamically, the DOM order matches the visual left-to-right distribution.

```text
JS Shortest-Column Tab Sequence (Accessible & Predictable):
[ Column 1 ]       [ Column 2 ]       [ Column 3 ]
Card 01 [Tab 1]    Card 02 [Tab 2]    Card 03 [Tab 3]
Card 04 [Tab 4]    Card 05 [Tab 5]    Card 06 [Tab 6]
Card 07 [Tab 7]    Card 08 [Tab 8]    Card 09 [Tab 9]
```

---

## Performance & Cumulative Layout Shift (CLS) Mitigation

1. **Aspect Ratio Preservation:**
   To prevent Cumulative Layout Shift (CLS < 0.1) while images fetch over slow network connections, wrap media in explicit aspect-ratio boxes:
   ```css
   .card-media-wrap {
     width: 100%;
     aspect-ratio: var(--item-aspect-ratio, 16 / 9);
     background-color: var(--surface-subtle);
   }
   ```
2. **ResizeObserver Batching:**
   When using JavaScript height-packing, attach a `ResizeObserver` to monitor card content height shifts (e.g., dynamic text expansion or embedded video loading):
   ```javascript
   const resizeObserver = new ResizeObserver(entries => {
     window.requestAnimationFrame(() => {
       masonryInstance.rebalance();
     });
   });
   ```

---

## Accessibility Checklist (WCAG 2.1 / 2.2 AA)

- [ ] **SC 1.3.2 Meaningful Sequence (Level A):** Tab navigation sequence follows a logical visual reading order without chaotic jumps across columns.
- [ ] **SC 1.4.3 Contrast (Minimum) (Level AA):** All card body text maintains $\ge 4.5:1$ contrast against the card background fill. Text rendered on top of images utilizes a dark gradient overlay scrim (`rgba(0, 0, 0, 0.8)` gradient).
- [ ] **SC 2.1.1 Keyboard (Level A):** Every interactive button, link, or input trigger inside masonry cards is reachable and operable via standard `Tab`, `Space`, and `Enter` keys.
- [ ] **SC 2.4.7 Focus Visible (Level AA):** Focused elements display high-contrast focus rings (`outline: 3px solid var(--brand-focus)`). Inner triggers inside cards with `overflow: hidden` utilize `outline-offset: -2px` to prevent focus ring clipping.
- [ ] **SC 2.5.8 Target Size (Minimum) (Level AA - WCAG 2.2):** Interactive buttons within cards provide a minimum touch target area of $24 \times 24\text{px}$ (preferring $44 \times 44\text{px}$ for mobile viewports).
