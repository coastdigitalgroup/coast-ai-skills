# Card UI Heuristics & References

This document provides foundational rules and standards for designing
high-performance Card UI components.

## The Three-Point Rule

Every effective card must satisfy three distinct user needs in order:

1.  **The Anchor (Recognition):** Does this look like what I'm looking for?
    (Visual/Image)
2.  **The Context (Validation):** Is this the specific item I want?
    (Title/Metadata)
3.  **The Target (Action):** How do I get more information? (CTA/Link)

_Heuristic:_ If you remove any one of these points, the card's conversion rate
or usability significantly drops.

## Interaction Patterns: Clickable Areas

Choosing the right pattern prevents user frustration and accessibility errors.

### 1. Specific Target (Lowest Risk)

- **Description:** Only the explicit link/button is interactive.
- **Best For:** Cards with multiple actions (e.g., "Add to Wishlist" and "Buy
  Now").
- **Pros:** Clear intent; no accidental clicks.
- **Cons:** Higher interaction cost (smaller target).

### 2. Stretched Link (Highest Usability)

- **Description:** One primary link is expanded to cover the whole card using
  CSS (`::after`).
- **Best For:** Discovery grids (Blogs, Product lists).
- **Pros:** Large touch target; keeps HTML semantic.
- **Cons:** Harder to include secondary links (like tags).

### 3. Full-Card Link (Simple Cards Only)

- **Description:** The entire card is wrapped in `<a>`.
- **Best For:** Very simple cards with only an image and a title.
- **Pros:** Easiest to implement.
- **Cons:** Screen readers read the _entire_ card content as the link text.
  Breaks if you add a button inside.

## Spacing & Typography Standards

- **Internal Padding:** 1rem (16px) minimum for mobile; 1.5rem (24px) to 2rem
  (32px) for desktop.
- **Line Height:** Use `1.2` for titles and `1.5` for body text to ensure
  readability at small sizes.
- **Visual Weight:** The Title should be at least 2 font-sizes larger than the
  metadata (e.g., Title: 20px, Metadata: 14px).

## Aspect Ratio Reference

Standardizing imagery prevents layout shift and visual clutter.

- **1:1 (Square):** Best for products and user avatars.
- **4:3:** Standard for many photography-led cards.
- **16:9:** Ideal for video previews and blog featured images.
- **2:3 (Portrait):** Best for book covers or movie posters.

## Accessibility (WCAG 2.1)

- **Color Contrast:** Text and icons must have a 4.5:1 contrast ratio against
  the card background.
- **Focus Indicator:** Never remove the default focus outline without providing
  a custom, high-contrast alternative.
- **Heading Order:** Cards should not skip heading levels (e.g., don't use H4 if
  the section heading is H2).
