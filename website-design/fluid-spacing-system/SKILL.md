---
name: fluid-spacing-system
description:
  Design and implement a fluid spacing scale using CSS clamp() to ensure
  consistent white space and vertical rhythm across all devices. Trigger this
  skill when asked to define spacing systems, margins, paddings, or layout gaps.
---

# Fluid Spacing System

## Purpose

The Fluid Spacing System skill provides a methodology for creating a responsive
scale of white space (margins, paddings, gaps) that adapts smoothly to the
user's viewport. By using the CSS `clamp()` function, spacing scales linearly
between defined minimum and maximum values, maintaining visual harmony and
consistent proportions without the need for excessive media queries.

## Use Cases

- Establishing a foundational spacing scale for a new design system.
- Modernizing a website to improve visual consistency across mobile, tablet, and
  desktop.
- Designing high-quality layouts where white space needs to breathe on large
  screens but stay compact on small ones.
- Replacing fixed pixel-based spacing with a more flexible, implementation-aware
  system.

## When NOT to Use

- **Simple, Non-Responsive Pages:** If the layout is extremely basic or has no
  responsive requirements.
- **Strictly Fixed Layouts:** When the design specifications mandate exact,
  non-negotiable pixel values at every resolution.
- **Legacy Browser Support:** If the target audience primarily uses browsers
  that do not support CSS `clamp()` (e.g., Internet Explorer).

## Inputs

To generate a fluid spacing system, you need:

1. **Viewport Range:**
   - `min-width`: The screen width where scaling starts (e.g., 320px).
   - `max-width`: The screen width where scaling stops (e.g., 1280px).
2. **Base Spacing Unit:**
   - `min-size`: The base unit (e.g., 16px) at `min-width`.
   - `max-size`: The base unit (e.g., 20px) at `max-width`.
3. **Scale Ratio:**
   - A multiplier to determine the steps in the scale (e.g., 1.25 for a Major
     Third scale, or a linear 2x/3x/4x progression).

## Outputs

1. **Fluid Spacing Scale:** A set of CSS variables defining values from "tiny"
   to "huge" using `clamp()`.
2. **Semantic Mapping:** Guidelines on how to apply these tokens (e.g.,
   `--space-m` for component padding, `--space-xl` for section margins).
3. **Usage Documentation:** Rules for combining units to maintain vertical
   rhythm and horizontal alignment.

## Workflow

### 1. Define the Scale Parameters

Set the boundaries for your fluid system based on the project's target devices.
_Example:_ 320px (Mobile) to 1440px (Desktop), with a base unit scaling from
16px to 24px.

### 2. Choose a Spacing Ratio

Decide how the spacing steps should grow.

- **Linear/Multiplicative:** Steps are multiples of the base unit (e.g., 0.5x,
  1x, 1.5x, 2x, 4x, 8x). Best for predictable alignment.
- **Geometric Scale:** Each step is the previous step multiplied by a ratio
  (e.g., 1.25). Best for high-contrast, artistic layouts.

### 3. Calculate Scale Steps

Create a range of sizes. A typical scale includes:

- **3XS to XS:** For tiny details, tight lists, and internal button padding.
- **S to M:** For standard component spacing and gutters.
- **L to 3XL:** For section margins, hero spacing, and major layout gaps.

### 4. Generate CSS `clamp()` Formulas

Convert pixel values into fluid formulas.
`clamp(min_rem, intercept_rem + slope_vw, max_rem)`

_Slope calculation:_ `(max_px - min_px) / (max_viewport - min_viewport) * 100`

### 5. Assign Semantic Roles

Map the abstract scale to functional roles to ensure consistency across the
team.

- `space-component`: `--space-s`
- `space-layout-gutter`: `--space-m`
- `space-section`: `--space-xl`

## Decision Rules

- **The 8pt Grid Principle:** Whenever possible, ensure your min/max values are
  multiples of 4 or 8 to align with standard UI patterns.
- **Proximity Principle:** Elements that are related should have less space
  between them than elements that are unrelated.
- **Mobile Compression:** Keep smaller spacing units (3XS-S) relatively stable;
  only larger units (L-3XL) should scale aggressively to prevent mobile layouts
  from feeling "exploded."
- **Accessibility:** Ensure that even at the smallest scale, interactive
  elements maintain a large enough hit area (minimum 44x44px including padding).

## Constraints

- **Responsiveness:** Spacing should never cause horizontal overflow.
- **Consistency:** Once a scale is defined, do not use "one-off" pixel values.
- **Hierarchy:** Larger spacing should always be used to separate larger blocks
  of content (e.g., sections), while smaller spacing is for internal component
  details.

## Non-Goals

- Creating a layout grid (use the `responsive-grid-system` skill for that).
- Defining typography sizes (use the `fluid-typography-system` skill).
- Managing z-index or layering.

## Common Failure Patterns

- **Scaling Everything Equally:** Scaling small paddings (like 4px) too much can
  make components look distorted on desktop.
- **Ignoring Layout Gutters:** Having fluid component spacing but fixed grid
  gutters, leading to alignment "drift."
- **Overwhelming Scale:** Having 20+ different spacing steps makes the system
  hard to use and maintain. Aim for 7-9 steps.
- **No Logical Steps:** Using arbitrary numbers instead of a consistent scale or
  ratio.

## Validation Criteria

- [ ] Spacing scales smoothly when the viewport is resized.
- [ ] Vertical rhythm is maintained across all major breakpoints.
- [ ] No "one-off" pixel values are used in the implementation; all spacing uses
      the defined variables.
- [ ] The system uses `rem` units for the minimum and maximum bounds of the
      `clamp()` function.
- [ ] Proximity and hierarchy are reinforced by the spacing choices.
