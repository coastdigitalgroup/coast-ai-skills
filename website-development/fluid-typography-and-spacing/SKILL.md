---
name: fluid-typography-and-spacing
description:
  Implement and debug fluid typography and spacing systems using CSS clamp(),
  viewport units, and mathematical formulas to create layouts that scale
  proportionally without excessive media queries.
---

# Fluid Typography and Spacing

## Purpose

The Fluid Typography and Spacing skill provides a technical framework for
creating "interpolation" between design breakpoints. Instead of "steppy"
layouts where font sizes and gaps jump abruptly at specific widths, this
approach uses CSS `clamp()` to scale values smoothly and proportionally to the
viewport or container size.

## Use Cases

- Creating a "Liquid" design system where typography feels balanced on every
  conceivable device width (e.g., between 375px and 1440px).
- Reducing the volume of media queries in a CSS architecture.
- Implementing "Container-Relative" typography that scales based on the parent
  element's width rather than the viewport.
- Synchronizing vertical rhythm (margins/padding) with font size scaling.

## When NOT to Use

- **Fixed-Size Components:** Small UI elements like icons, toggles, or
  consistent-width sidebars often require static sizing to maintain utility.
- **Legacy Browser Support:** If you must support browsers older than Chrome 79,
  Safari 13.1, or Firefox 75 (where `clamp()` was introduced), a fallback
  strategy is required.
- **Strict Grid-Based Layouts:** When an exact pixel alignment is required for
  brand or technical reasons that fluid math might subtly break.

## Inputs

1. **Minimum Value:** The size at the smallest breakpoint (e.g., 16px at 320px
   viewport).
2. **Maximum Value:** The size at the largest breakpoint (e.g., 24px at 1280px
   viewport).
3. **Viewport Range:** The "start" and "end" points for the scaling behavior.
4. **Unit Preference:** Whether to use `rem` (recommended for accessibility) or
   `px`.

## Outputs

1. **Fluid CSS Variables:** A set of tokens (e.g., `--text-lg`, `--space-md`)
   defined using `clamp()`.
2. **Mathematical Formula:** The "linear interpolation" logic that connects the
   min and max values.
3. **Accessible Implementation:** CSS that respects user font-size preferences
   while maintaining fluid scaling.

## Workflow

### 1. Identify the Scaling Range

Determine your design's "floor" and "ceiling." For example, a heading should
never be smaller than `2rem` on mobile or larger than `5rem` on desktop.

### 2. Calculate the Fluid Slope

Use the linear interpolation formula to find the "preferred" middle value for
`clamp()`. The formula is:
`preferred = (max_size - min_size) / (max_viewport - min_viewport) * 100vw + (min_size - (max_size - min_size) / (max_viewport - min_viewport) * min_viewport)`

### 3. Implement with `clamp()`

Apply the values to a CSS property:
`font-size: clamp([min-size], [fluid-slope] + [intercept], [max-size]);`

### 4. Use `rem` for Accessibility

Convert all pixel-based calculations to `rem` to ensure that if a user changes
their browser's default font size, the fluid scale respects that offset.

### 5. Apply to Spacing

Use the same logic for `padding`, `margin`, and `gap` to ensure that the "white
space" in the design grows proportionally with the text.

## Decision Rules

- **Viewport vs. Container:** Use `vw` units for page-level typography. Use
  `cqw` or `cqi` units (Container Query units) for components that might appear
  in different layouts (e.g., a card in a sidebar vs. a card in a main grid).
- **Scale Intensity:** For headings, use a steeper slope. For body text, use a
  shallower slope or fixed size to maintain readability.
- **Breakpoints:** Define fluid behavior between your primary mobile and
  desktop breakpoints. Below the minimum breakpoint, the value remains at the
  "min" value; above the maximum, it remains at the "max" value.

## Constraints

- **Accessibility (WCAG 1.4.4):** Fluid typography must allow users to zoom the
  page to at least 200% without loss of content. Using `rem` inside `clamp()`
  is critical here.
- **Readability:** Ensure that the fluid slope doesn't make body text too small
  (e.g., below 16px/1rem) on any device.
- **Browser Math:** Large formulas in CSS can occasionally lead to sub-pixel
  rounding issues. Keep your precision to 4 decimal places.

## Non-Goals

- General CSS layout (Grid/Flexbox).
- Color systems or dark mode implementation.
- Automated tools for generating CSS (though the math is provided).

## Common Failure Patterns

- **Using `px` only:** Using `clamp(16px, 2vw, 24px)` ignores user font-size
  preferences because `px` is an absolute unit. Always mix in `rem`.
- **Inverted Range:** Setting the `min` value higher than the `max` value, which
  breaks the `clamp()` logic.
- **Slope Too Aggressive:** Text that grows so fast it overflows its container
  on medium-sized screens (like tablets).
- **Ignoring Line Height:** Scaling font-size without adjusting `line-height`,
  leading to cramped or overly airy text.

## Validation Criteria

- [ ] **Viewport Resize Test:** Use DevTools to slowly drag the viewport width.
      Confirm that the text and spacing scale smoothly without "jumps."
- [ ] **Breakpoint Check:** Verify that the size stops shrinking at the
      specified `min` width and stops growing at the `max` width.
- [ ] **Accessibility (Zoom) Test:** Zoom to 200% in the browser. Ensure the
      text scales up appropriately and remains readable.
- [ ] **Unit Verification:** Confirm that `rem` units are used for the base and
      intercept parts of the `clamp()` function.
