# Reference: WCAG 2.1/2.2 and CSS Focus Indicator Styling

This technical reference provides deep-dive specifications for WCAG compliance, CSS math for geometric curvature alignment, and cross-browser focus rendering strategies.

---

## 1. WCAG Compliance Success Criteria (SC)

Focus indicators are governed by several key criteria across WCAG 2.1 and 2.2 levels.

### SC 2.4.7 Focus Visible (Level AA)
- **Requirement:** Any keyboard-operable user interface must have a mode of operation where the keyboard focus indicator is visible.
- **Implementation Note:** Simply omitting focus styling or declaring `outline: none` without replacement is an immediate failure of this Level AA requirement.

### SC 1.4.11 Non-Text Contrast (Level AA)
- **Requirement:** The visual representation of user interface components and graphical objects must have a contrast ratio of at least **3:1** against adjacent colors.
- **Implementation Note:** This includes focus outlines. When an element is in focus, the focus ring color must maintain a minimum 3:1 contrast against the background container.

### SC 2.4.11 Focus Not Obscured (Level AA - WCAG 2.2)
- **Requirement:** When an item has keyboard focus, the item must not be entirely obscured (covered) by author-created content (such as sticky headers, sticky footers, or overlaying chat widgets).
- **Implementation Note:** Use CSS `scroll-margin-top` or `scroll-margin-bottom` on anchor scroll targets to guarantee the focused item remains in view.

### SC 2.4.13 Focus Appearance - Minimum (Level AAA - WCAG 2.2)
- **Requirement:** The focus indicator must meet three key checks:
  1. **Minimum Area:** The area of the focus indicator must be at least equal to a **2px solid perimeter line** around the control.
  2. **Contrast:** Minimum of **3:1** contrast between the focused and unfocused states.
  3. **No Coverage:** The indicator must not be completely hidden by other content.

---

## 2. The Curved Outline Radius Math

When designing an outer offset focus indicator for a rounded element, a common visual error is reusing the exact same border-radius for the outer ring. This causes the outline to look squashed and non-concentric at the corners.

To design mathematically concentric rounded outlines, use the **Focus Radius Formula**:

$$\text{Outline Radius} = \text{Element Radius} + \text{Outline Offset} + \frac{\text{Outline Width}}{2}$$

### Practical Example

If you have a rounded card/button:
- `border-radius` of the Button: `8px`
- `outline-offset`: `3px`
- `outline-width`: `2px`

$$\text{Concentric Outline Radius} = 8px + 3px + 1px = 12px$$

### CSS Implementation Strategies

Standard native CSS outlines now natively respect parent border-radius in modern evergreen browsers (Chrome 94+, Safari 16.4+, Firefox 99+). However, to guarantee cross-browser safety, designers and developers often resort to pseudo-elements or box-shadow techniques:

```css
/* concentric curve rendering using standard outline */
.concentric-button {
  border-radius: 8px;
}
.concentric-button:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 3px;
  /* Modern browsers automatically draw outline corners with (8px + 3px) radius! */
}

/* Pseudo-element fallback for legacy systems */
.legacy-concentric-button {
  position: relative;
  border-radius: 8px;
}
.legacy-concentric-button::after {
  content: '';
  position: absolute;
  top: -5px; /* - (offset + outline width) */
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid var(--focus-ring-color);
  border-radius: 13px; /* 8px + 5px */
  opacity: 0;
  pointer-events: none;
}
.legacy-concentric-button:focus-visible::after {
  opacity: 1;
}
```

---

## 3. Dealing with Overflow Hidden (`overflow: hidden`)

A notorious failure pattern occurs when an outer focus outline is specified on an element contained inside a slider, card deck, or container grid with `overflow: hidden`. The browser slices the focus ring on the container's boundaries.

### Remedies

1. **Increase Container Padding:** Add padding equal to or greater than the focus outline + offset, and use matching negative margins to keep the element visually aligned while creating a rendering "safe zone" for the outline.
   ```css
   .carousel-container {
     overflow: hidden;
     padding: 6px; /* safe zone */
     margin: -6px;
   }
   ```
2. **Apply Inset Focus Styles:** Use an inset outline via `box-shadow` instead of an external ring:
   ```css
   .clipped-element:focus-visible {
     outline: none;
     box-shadow: inset 0 0 0 3px var(--focus-ring-color);
   }
   ```

---

## 4. Forced Colors (High Contrast Mode) Spec

Operating systems (such as Windows) provide a "Forced Colors" accessibility preference where standard colors are stripped, and a custom user-defined palette is imposed to maximize legibility.

### Discarded Properties in Forced Colors Mode
- `box-shadow` (completely removed)
- `background-image` / custom linear-gradients
- Custom text/border colors

### Preserved Properties in Forced Colors Mode
- Native `outline`
- Native `border`

Therefore, if you design focus rings solely using `box-shadow`, your focus indicator becomes **completely invisible** in High Contrast Mode.

### CSS Safeguard Template

Always pair custom box-shadow focus rings with a transparent native outline. The transparent outline is invisible in standard mode but gets replaced by a thick, highly visible system-defined color (like `ButtonText` or `Highlight`) in High Contrast Mode:

```css
.forced-colors-safe-button:focus-visible {
  outline: 2px solid transparent; /* Invisible normally, visible in High Contrast Mode */
  outline-offset: 2px;
  box-shadow: inset 0 0 0 3px #0d52ff; /* Used for standard visual styles */
}
```
