---
name: accessible-color-system
description:
  Design and implement a systematic color palette that ensures WCAG 2.1
  accessibility compliance. Trigger this skill when asked to define brand
  colors, create UI themes, or establish a visual system for a website.
---

# Accessible Color System

## Purpose

The Accessible Color System skill provides a methodology for creating color
palettes that are visually cohesive and functionally accessible. It moves beyond
aesthetic color choice to a structured system of scales, contrast-safe pairings,
and semantic application, ensuring that content is perceivable by all users,
including those with visual impairments.

## Use Cases

- Establishing a new brand's digital color presence.
- Auditing and fixing an existing website's accessibility issues related to
  color.
- Designing Dark/Light mode themes.
- Defining semantic colors for feedback (success, error, warning).

## When NOT to Use

- **Art-Driven Experiences:** Where color is used purely for expression and does
  not carry functional information (though accessibility is still encouraged).
- **Hard-Coded Legacy Apps:** Where the technical debt makes implementing a
  system of variables impossible (focus on point-fixes instead).
- **Purely Decorative Elements:** Elements like background patterns that do not
  contain text or interactive components (WCAG 1.4.3 doesn't apply here).

## Inputs

To generate an accessible color system, you need:

1. **Primary Brand Color:** The core color that identifies the brand (e.g.,
   #0055FF).
2. **Neutral Base:** A starting point for grays/blacks (e.g., #1A1A1A or a
   tinted neutral).
3. **Accessibility Target:** WCAG Level AA (standard) or AAA (enhanced).
4. **Context of Use:** Is this for a high-density dashboard, a marketing landing
   page, or a utility-first application?

## Outputs

1. **Color Scales:** Tonal palettes for Primary, Secondary, Neutral, and
   Semantic colors (usually 10-step scales).
2. **Contrast Matrix:** A map of which foreground colors are safe to use on
   which background colors.
3. **Semantic Mapping:** Defined roles for colors (e.g.,
   `--color-action-primary`, `--color-surface-muted`).
4. **CSS Custom Properties:** A production-ready block of CSS variables.

## Workflow

### 1. Generate Tonal Scales

Expand the base colors into scales (e.g., 50 to 900). Use a tool or formula that
maintains consistent lightness steps. _Tip: Ensure your Primary 500 or 600 is
the "brand" version._

### 2. Define Neutrals

Create a neutral scale. Consider "tinting" the neutrals with a small amount of
the primary color (e.g., 2-5%) to create a more cohesive look.

### 3. Establish Semantic Roles

Assign colors to functional roles:

- **Action:** Primary color for buttons, links, and active states.
- **Surface:** Backgrounds, cards, and dividers (Neutrals).
- **Content:** Text and icons (High-contrast Neutrals).
- **Status:** Success (Green), Warning (Yellow/Orange), Error (Red), Info
  (Blue).

### 4. Perform Contrast Validation

Test pairings using WCAG 2.1 formulas:

- **Normal Text:** 4.5:1 for AA, 7:1 for AAA.
- **Large Text (>18pt):** 3:1 for AA, 4.5:1 for AAA.
- **UI Components/Icons:** 3:1 for AA.

### 5. Create Pairing Rules

Document which text colors can go on which backgrounds. _Example: White text
(#FFFFFF) is only safe on Primary 600 or higher._

## Decision Rules

- **Legibility First:** Function (readability) always overrides aesthetics. If a
  brand color is too light for text, use a darker variant for the text while
  keeping the brand color for decorative elements.
- **Avoid Color Alone:** Never rely on color as the only way to convey
  information (e.g., include an icon or text label with an error message).
- **Consistent Lightness:** Keep lightness values similar across different hues
  at the same scale level (e.g., Red 500 and Blue 500 should have similar
  perceived brightness).

## Constraints

- **Responsiveness:** Colors must maintain contrast on mobile screens where
  glare or low-quality displays might reduce visibility.
- **Accessibility:** Must meet at least WCAG 2.1 AA standards for all functional
  elements.
- **Hierarchy:** Use color saturation and contrast to guide the eye; more
  important elements (CTAs) should have higher visual weight.

## Common Failure Patterns

- **Insufficient Contrast:** Using light gray text on a white background or
  white text on a light brand color.
- **Vibrating Colors:** Pairing high-saturation colors (like red and green) that
  cause visual strain.
- **Too Many Colors:** Creating a "rainbow" effect that dilutes brand identity
  and confuses hierarchy.
- **Semantic Misuse:** Using "Error Red" for a decorative element, leading to
  user anxiety.

## Validation Criteria

- [ ] Every functional text element has a contrast ratio of at least 4.5:1
      against its background.
- [ ] UI components (borders, icons) have at least 3:1 contrast.
- [ ] The system includes a clear scale for primary and neutral colors.
- [ ] Information is never conveyed through color alone.
- [ ] The system is documented using CSS custom properties for portability.
