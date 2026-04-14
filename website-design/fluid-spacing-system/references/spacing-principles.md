# Reference: Spacing Principles & Theory

Effective website design relies as much on the space _between_ elements as it
does on the elements themselves. This guide covers the core principles of using
white space and choosing a scale.

## 1. The Proximity Principle (Gestalt)

The law of proximity states that objects near each other tend to be grouped
together.

- **Application:** Use smaller fluid tokens (3XS-S) for items within a component
  (e.g., an icon and its label). Use larger tokens (L-3XL) to separate unrelated
  sections of a page.

## 2. Vertical Rhythm

Vertical rhythm is the consistent spacing of elements as the user scrolls down
the page.

- **Application:** Use multiples of a base unit to keep the eye moving at a
  predictable pace. If your base is `--space-s`, then most larger gaps should
  ideally be `--space-l` (2x) or `--space-2xl` (4x).

## 3. The 8pt Grid

Most modern digital displays are built on an 8-pixel grid.

- **Why 8?** 8 is divisible by 2 and 4, making it highly flexible for scaling
  without creating half-pixel artifacts.
- **Application:** Try to set your `min` and `max` pixel values in `clamp()` to
  multiples of 8 (e.g., 16, 24, 32, 40, 48, 64, 80, 96).

## 4. Common Spacing Scales

### The Linear Scale (Multiples)

The most common system. Spacing grows by a fixed multiple of the base unit.

- _Steps:_ 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- _Feel:_ Highly structured, predictable, easy for developers to memorize.

### The Geometric Scale (Major Third / Golden Ratio)

Each step is the previous step multiplied by a ratio like 1.25 or 1.618.

- _Steps (1.25):_ 16, 20, 25, 31, 39, 49, 61.
- _Feel:_ More organic and artistic. Headings and sections feel "faster" or
  "slower" in their progression.

## 5. Accessibility and Tap Targets

Spacing isn't just visual; it's functional.

- **WCAG Success Criterion 2.5.5:** Recommendation for target sizes to be at
  least 44x44 CSS pixels.
- **Application:** Ensure that buttons or links with small text use enough
  internal padding (`--space-s` or `--space-m`) to meet the minimum hit area
  requirement.

## 6. Horizontal Spacing (Gutters vs. Margins)

- **Margins:** The space at the edge of the viewport. Usually stays consistent
  at each breakpoint.
- **Gutters:** The space between columns in a grid. This should be fluid to
  prevent a "loose" layout on widescreen monitors.
