# Pointer Capture and WAI-ARIA Splitter Specifications

This reference document details the technical standards, browser events, and accessibility guidelines required to implement stable, responsive, and keyboard-accessible multi-pane splitters.

---

## 1. WAI-ARIA Design Patterns

To remain compliant under WCAG standards, resizable boundaries must use the focusable `separator` role. This informs assistive technologies (like screen readers) that the element divides content and supports dimensional modification.

### Attributes
- **`role="separator"`**: Designates the element as an interactive dividing control.
- **`tabindex="0"`**: Places the splitter into the sequential tab document focus order.
- **`aria-orientation`**: Set to `"vertical"` or `"horizontal"`.
  - *Vertical separator:* Separates columns (the splitter line itself is vertical and moves horizontally left/right).
  - *Horizontal separator:* Separates rows (the splitter line itself is horizontal and moves vertically up/down).
- **`aria-valuenow`**: Tells assistive tools the current numerical width or height of the controlled pane (usually as a percentage from `0` to `100`).
- **`aria-valuemin`**: Represents the minimum safe percentage/pixel value to prevent content overlap.
- **`aria-valuemax`**: Represents the maximum safe percentage/pixel value to prevent content from expanding beyond boundaries.
- **`aria-controls`**: An ID reference pointing to the primary resizable panel element.

### Standard Keyboard Interactions
When a user focuses the splitter, it must respond to the following keystrokes:

| Key | Orientation | Result |
| :--- | :--- | :--- |
| **`ArrowLeft`** / **`ArrowUp`** | Vertical / Horizontal | Decrements the value of `aria-valuenow` (moves separator left or up). |
| **`ArrowRight`** / **`ArrowDown`** | Vertical / Horizontal | Increments the value of `aria-valuenow` (moves separator right or down). |
| **`Home`** | Both | Instantly resizes panel to its minimum limit (`aria-valuemin`). |
| **`End`** | Both | Instantly resizes panel to its maximum limit (`aria-valuemax`). |
| **`Enter`** (Optional) | Both | Collapses the primary pane or restores it to its previous size. |

---

## 2. Pointer Capture & Preventing Drag Failures

Historically, developers implemented dragging by listening to `mousemove` events on the window or the splitter element itself. This is highly fragile. If a user swipes or moves the mouse faster than the browser can repaint the layout, the cursor slips outside the boundary of the splitter, breaking the drag interaction.

### The Modern Solution: Pointer Capture
The Pointer Events API provides the **`setPointerCapture()`** and **`releasePointerCapture()`** methods. This redirects all subsequent pointer events (movement, clicks, and release) directly to the captured element, even if the cursor wanders far outside the physical bounds of the viewport.

```javascript
// Inside pointerdown handler
this.splitter.setPointerCapture(e.pointerId);

// Inside pointerup handler
this.splitter.releasePointerCapture(e.pointerId);
```

#### Advantages:
1. **Single Event Stream:** Handles Mouse, Touch, and Stylus inputs under a single set of handlers (`pointerdown`, `pointermove`, `pointerup`).
2. **Anti-Slippage:** The browser guarantees the splitter continues to receive move coordinates even when the mouse drifts.
3. **No Window Polling:** Eliminates the need to bind heavy global listeners on `window` or `document`.

---

## 3. The Iframe Interception Gotcha

When building compound previewers (such as markdown or code playgrounds), the secondary pane usually contains an `<iframe>` rendering active code or external previews.

### The Problem
During a drag gesture, as soon as the mouse coordinates cross the border of the iframe, the cursor enters a different document context. The main page parent completely stops receiving pointer events. The drag handle freezes or "gets stuck."

### The Solution: Overlay Pointer Masks
To resolve this, position a transparent mask element (`pointer-events: none`) over all iframe and pane containers. Activate this mask exclusively during active drag operations.

```html
<div class="preview-pane">
  <!-- The Transparent Safeguard Overlay -->
  <div class="resize-iframe-mask"></div>
  <iframe src="preview.html"></iframe>
</div>
```

```css
.resize-iframe-mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}

/* Activate only while layout is being dragged */
.is-dragging-layout .resize-iframe-mask {
  display: block;
}
```

---

## 4. Performance & Reflow Optimization

Flipping panel positions repeatedly causes heavy layout calculations (reflow/layout-thrashing). To maintain 60FPS dragging speeds, follow these guidelines:

1. **Avoid direct DOM manipulation of multiple panels:** Instead of modifying the inline styles (`width`, `height`) of all adjacent panels simultaneously, modify a single CSS Custom Property on the parent container (e.g. `--sidebar-width`).
2. **Utilize `requestAnimationFrame`:** Throttle the calculation inside `pointermove`. Avoid resizing on every single mouse coordinate emission.
3. **Opt for Flexbox/Grid flex-basis:** Allow the secondary panels to utilize `flex: 1` or grid fraction spaces to expand fluidly, eliminating manual math on other columns.
