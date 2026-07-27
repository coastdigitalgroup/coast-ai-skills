# CSS Line Clamping and Rendering Heuristics

This reference document explains the technical details of CSS multi-line clamping (`-webkit-line-clamp`), how different DOM properties behave when content is clamped, and how the browser's accessibility tree processes visually truncated text.

---

## 1. The Legacy WebKit Line Clamp Engine

The standard modern way to perform multi-line text truncation in CSS is to use a set of properties originally prefixed for WebKit but now fully standardized and supported in all evergreen browsers.

```css
.clamped-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Capped to 3 lines */
  overflow: hidden;
}
```

### How the Browser Renders Clamped Boxes
1. **Layout Isolation:** When `-webkit-line-clamp: N` is specified alongside `display: -webkit-box` and `overflow: hidden`, the browser's layout engine calculates the cumulative height of the first `N` lines of inline boxes.
2. **Ellipsis Insertion:** The rendering engine finds the trailing word of the last allowed line. It crops any remaining inline characters in that block and appends a native visual ellipsis (`…`).
3. **Bounding Box Restriction:** Any content belonging to lines `N+1` and beyond is placed in an overflow state, which is hidden from view because `overflow: hidden` is applied.

---

## 2. Browser Measurement Metrics: ScrollHeight vs. ClientHeight

When a CSS box is clamped, standard DOM height properties behave in specific ways:

| Property | Behavior when Clamped | Behavior when Un-clamped |
| :--- | :--- | :--- |
| **`clientHeight`** | Represents the **clamped height** (the visual boundary of the allowed lines, plus padding). | Represents the **natural rendering height** of the entire text blocks. |
| **`offsetHeight`** | Similar to `clientHeight`, but includes any horizontal scrollbars and borders. | Represents the complete visual boundary. |
| **`scrollHeight`** | Represents the **total scrollable height** (the height of all lines of text if `overflow` were set to `scroll` or `visible`). | Equal to `clientHeight` (since no overflow exists). |

### Programmatic Overflow Detection Rule
To determine if text is currently clamped visually, we calculate:

$$\text{hasOverflow} = \text{scrollHeight} > \text{clientHeight}$$

- **If True:** The text is actively clamped, and some lines are hidden. The toggle button must be shown.
- **If False:** The text fits completely within the allowed line clamp. The toggle button must be hidden.

---

## 3. High-Performance Resize Auditing

In modern web portals, cards are responsive and flex in width based on screen size. As container width increases, text might require fewer lines, causing the overflow to disappear. Conversely, narrowing the screen causes text to wrap and overflow.

### The Performance Pitfall
Historically, developers listened to the `window.onresize` event and ran layout checks. However:
- `onresize` fires constantly (dozens of times per second) during dragging.
- Reading `scrollHeight` and `clientHeight` inside `onresize` forces a **synchronous layout reflow (layout thrashing)** because the browser must calculate pixel geometries immediately.
- This results in high Input Delay and poor INP (Interaction to Next Paint) scores.

### The Modern, Resilient Solution: `ResizeObserver`
The `ResizeObserver` API specifically observes changes to an element's bounding box without the overhead of listening to the global window resize.

To ensure absolute fluid rendering:
1. **Never mutate observed elements directly:** Modifying the dimensions, margin, padding, or fonts of the *observed* content container inside the observer callback causes a recursive layout cycle. The browser detects this and aborts, printing the warning: `ResizeObserver loop completed with undelivered notifications`.
2. **Decouple with `requestAnimationFrame`:** Wrap your measurement logic in `requestAnimationFrame`. This instructs the browser to run the check just before the next paint, aligning DOM reads and minimizing jank.

---

## 4. Accessibility & The Screen Reader Tree

One of the greatest benefits of CSS-based line clamping is its native accessibility support.

### CSS Truncation vs. JS String Slicing
- **JS String Slicing (`text.substring(0, 150) + '...'`):** This physically removes the text from the DOM. A screen reader user navigating the card will *only* hear the sliced portion. They can never read the rest of the text unless they click the button to trigger a DOM rewrite.
- **CSS Line Clamping (`-webkit-line-clamp`):** The full text remains entirely intact in the DOM. Modern screen readers (VoiceOver, NVDA, JAWS) read the **entire** un-truncated text block, completely ignoring the visual ellipsis. The visual ellipsis only exists for sighted users.

### Interactive ARIA Guidelines
To ensure screen reader users understand the expansion interaction:
- The trigger button must have `aria-expanded="false"` by default, and transition to `aria-expanded="true"` on click.
- The trigger button must use `aria-controls` referencing the unique ID of the content container being toggled.
- Avoid dynamic visual-only text inside the content (like modifying the visible paragraph text to say "Expanded:" or "Collapsed:"), as screen readers will read this out in a confusing manner.
