---
name: fluid-typography-system
description:
  Design and implement a typographic scale that scales smoothly across viewports
  using CSS clamp(). Trigger this skill when asked to create responsive
  typography, design systems, or fluid layouts.
---

# Fluid Typography System

## Purpose

The Fluid Typography System skill enables the creation of a typographic scale that adapts smoothly to the user's viewport size. Instead of jumping between fixed sizes at specific breakpoints, typography scales linearly between defined minimum and maximum values using the CSS `clamp()` function. This improves visual harmony, readability, and reduces the maintenance overhead of managing numerous media queries.

## Use Cases

- Building a responsive design system from scratch.
- Modernizing an existing website's typography for better cross-device consistency.
- Creating layouts where text needs to perfectly fill available space across all screen sizes.
- Simplifying CSS by replacing multiple `@media` rules with a single set of fluid variables.

## When NOT to Use

- **Legacy Browser Support:** If the project must support browsers that do not understand `clamp()` (e.g., Internet Explorer).
- **Fixed-Width Designs:** When the layout is strictly fixed and does not attempt to be responsive.
- **Extreme Precision:** If specific brand guidelines mandate exact pixel sizes at every possible resolution that do not align with a linear scale.

## Inputs

To generate a fluid typography system, you need:
1. **Viewport Range:**
   - `min-width`: The screen width where scaling starts (e.g., 320px).
   - `max-width`: The screen width where scaling stops (e.g., 1200px).
2. **Base Font Size:**
   - `min-size`: The body font size at `min-width` (e.g., 16px).
   - `max-size`: The body font size at `max-width` (e.g., 20px).
3. **Scale Ratio:**
   - A multiplier to determine the size of headings (e.g., 1.250 for "Major Third", 1.333 for "Perfect Fourth").

## Outputs

1. **CSS Custom Properties:** A block of CSS variables defining the fluid scale.
2. **Typography Utility Classes:** (Optional) CSS classes for easy application of the scale.
3. **Hierarchy Documentation:** A clear mapping of sizes from Body to H1.

## Workflow

### 1. Define the Scale Parameters

Determine the minimum and maximum viewports and the base sizes.
*Example:* 320px to 1280px, 16px to 18px base.

### 2. Choose a Typographic Scale

Select a ratio that fits the brand's voice.
- **1.067 (Minor Second):** Subtle differences, good for dense data.
- **1.200 (Minor Third):** Standard, balanced.
- **1.414 (Augmented Fourth):** High contrast, bold headings.

### 3. Calculate Hierarchy Levels

Multiply the base size by the ratio for each level (H6 to H1).
*Formula:* `Size_level = Base * (Ratio ^ Level)`

### 4. Generate Fluid Formulas

Convert the calculated min/max pixel values into a `clamp()` function.
`clamp(min, preferred, max)`

The preferred value calculation:
`slope = (max_size - min_size) / (max_viewport - min_viewport)`
`y_intercept = min_size - slope * min_viewport`
`preferred = (y_intercept) + (slope * 100vw)`

### 5. Implementation

Apply the generated CSS variables to the design.

## Decision Rules

- **Accessibility First:** The `min-size` for body text should rarely be below `1rem` (16px).
- **User Preference:** Always use `rem` units for the final output so user browser font-size settings are respected.
- **Scale Intensity:** Use smaller ratios for mobile-heavy sites to prevent headings from becoming overly large on small screens.

## Constraints

- **Responsiveness:** Typography must remain within the bounds of its container without causing overflow.
- **Readability:** Line length (measure) should ideally stay between 45-75 characters. Adjust container widths accordingly as text scales.
- **Hierarchy:** H1 must always be visually distinct and larger than H2, which must be larger than H3, etc.

## Common Failure Patterns

- **Incorrect Math:** Resulting in text that shrinks when the screen gets larger.
- **Unit Mismatch:** Mixing `px` and `rem` in ways that break browser zooming.
- **Over-scaling:** Headings becoming so large on 4K monitors that they dominate the entire viewport.
- **Accessibility:** Forgetting to test how the fluid scale behaves when a user zooms in (WCAG 1.4.4).

## Validation Criteria

- [ ] Typography scales smoothly when resizing the browser window.
- [ ] No "jumps" or sudden size changes are visible.
- [ ] All text is legible at 320px width.
- [ ] Headings maintain a clear hierarchy relative to body text.
- [ ] The system uses `rem` units for the base and `clamp()` for the fluid behavior.
