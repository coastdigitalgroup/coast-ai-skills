# Reference: WCAG 2.1 / 2.2 Focus State Compliance

This reference guide summarizes the exact specifications, contrast formulas, and layout requirements defined by the World Wide Web Consortium (W3C) in the Web Content Accessibility Guidelines (WCAG) 2.1 and 2.2 regarding keyboard focus appearance.

---

## 1. WCAG 2.1 SC 1.4.11: Non-Text Contrast (Level AA)

This success criterion requires that the visual representation of UI components and their states have sufficient contrast against adjacent colors.

- **The Rule:** The visual focus indicator itself must have a contrast ratio of at least **3:1** against the background it sits on.
- **Adjacent Backgrounds:** If a button sits on a white background (`#FFFFFF`), the focus indicator must have a 3:1 contrast ratio against `#FFFFFF`. If the button sits on a dark gray sidebar (`#1F2937`), the focus indicator must have a 3:1 contrast ratio against `#1F2937`.
- **Component Border/Edge Contrast:** The focus indicator must also be easily distinguishable from the component's unfocused state (3:1 contrast ratio).

---

## 2. WCAG 2.2 SC 2.4.11: Focus Not Obscured (Level AA / AAA)

This criterion ensures that when keyboard users tab through a page, the focused element is not completely hidden by sticky, fixed, or overlapping UI components.

- **Level AA (Minimum):** The focused element must not be **entirely** obscured by other content. At least a portion of the element must remain visible.
- **Level AAA (Enhanced):** **No part** of the focused element may be obscured by other content. The entire component and its focus ring must be fully visible.
- **Design Remediation:** Configure scroll spacing properties to push focused elements into the active, unobstructed viewport area during tabbing:
  ```css
  /* Applies margin spacing specifically during keyboard scrolling */
  * {
    scroll-margin-top: 100px; /* Adjust based on sticky header height */
    scroll-margin-bottom: 40px; /* Adjust based on sticky footer height */
  }
  ```

---

## 3. WCAG 2.2 SC 2.4.12: Focus Appearance (Level AAA)

This success criterion defines exact mathematical requirements for the minimum area and relative contrast of the focus indicator, preventing subtle or ultra-thin focus rings.

### The Contrast Formula
The focus indicator must meet at least one of the following:
1. Have a contrast ratio of at least **3:1** between the focused and unfocused states of the component.
2. Have a contrast ratio of at least **3:1** against adjacent colors.

### The Area Calculation
The focus indicator must have an area that is at least as large as:
- A **2 CSS pixel thick outline** around the outer perimeter of the interactive component.

#### Perimeter Equation
$$\text{Minimum Area} = (2 \times \text{Perimeter}) \text{ CSS pixels}^2$$

*Example: For a standard button of size $120\text{px} \times 40\text{px}$:*
- Perimeter $= 2 \times (120 + 40) = 320\text{px}$.
- Minimum Focus Indicator Area $= 2\text{px} \times 320\text{px} = 640\text{px}^2$.
- A standard `2px` outline with `2px` offset fully satisfies this area requirement.

---

## 4. WCAG 2.2 SC 2.5.8: Target Size Minimum (Level AA)

While not strictly about focus styling, target size is critically linked to keyboard and pointer interactions, ensuring that focusable areas are large enough to be easily triggered.

- **The Rule:** Focusable, interactive targets must have a target size of at least **24x24 CSS pixels**, or have sufficient spacing around them.
- **Exceptions:** Inline text links inside a sentence, standard browser native controls (not styled by the site), and elements in a toolbar where space is functionally restricted.
- **Design Goal:** Maintain a default of **44x44 CSS pixels** (WCAG Level AAA recommendation) for primary buttons, navigation triggers, and mobile snackbars.

---

## 5. CSS Styling Best Practices

### A. The Power of `:focus-visible`
The `:focus-visible` pseudo-class is supported in all modern browsers. It only applies focus rings when keyboard or assistive technology input is detected, suppressing the focus ring when a user clicks with a mouse or taps with a finger.

```css
/* BAD: Shows focus ring on mouse click */
button:focus {
  outline: 3px solid var(--focus-color);
}

/* GOOD: Shows focus ring ONLY on keyboard tab */
button:focus-visible {
  outline: 3px solid var(--focus-color);
  outline-offset: 2px;
}
```

### B. High Contrast / Forced Colors Mode
Under Windows High Contrast Mode, the browser forces a strict, restricted palette. Standard CSS gradients, shadows, and custom background colors are completely ignored. To keep custom focus elements visible:

1. Always use standard CSS properties (`outline`, `border`) where possible, as the browser automatically remaps their colors to high-contrast tokens.
2. Use the system color tokens in forced colors media queries:
   - `CanvasText`: Default text color.
   - `Canvas`: Default background color.
   - `Highlight`: User's selected highlight color (usually blue).
   - `HighlightText`: Selected text foreground color.
   - `ButtonText`: Standard button text.

```css
@media (forced-colors: active) {
  .custom-control:focus-visible {
    /* Use 'Highlight' to match the system theme color */
    outline: 2px solid Highlight;
  }
}
```
