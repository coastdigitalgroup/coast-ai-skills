# Product Card Breakdown

This example demonstrates the application of the **Card UI System** to a
standard e-commerce product card, focusing on hierarchy, alignment, and
interaction.

## Visual Anatomy

1.  **The Anchor (Visual):**
    - A high-quality 1:1 (square) aspect ratio product image.
    - Provides immediate recognition and visual appeal.
2.  **The Context (Metadata):**
    - **Category:** Small, uppercase text (e.g., "HEADPHONES") to provide
      context.
    - **Title:** Bold H3 headline. Uses a 2-line maximum clamp to prevent layout
      shifts.
    - **Price:** Prominent, high-contrast text positioned near the title.
    - **Rating:** Visual star rating with a numeric count (e.g., ★★★★☆ 124).
3.  **The Target (Action):**
    - **Primary CTA:** "Add to Cart" button. Uses a primary brand color.
    - **Secondary CTA:** "View Details" link. Uses a subtle text-only style.

## Hierarchy Breakdown (Squint Test)

- **Level 1 (Most Prominent):** Product Image.
- **Level 2:** Product Title and Price.
- **Level 3:** Add to Cart Button.
- **Level 4:** Rating and Category metadata.

## Alignment Logic

The card uses a vertical flex layout (`flex-direction: column`).

- The image is at the top.
- The content block (Title, Price, Rating) follows.
- The **Action Footer** (Buttons) uses `margin-top: auto` to ensure that even if
  one card has a 1-line title and another has a 2-line title, the "Add to Cart"
  buttons always align perfectly at the bottom of the grid row.

## Interaction Specification

- **Card Hover:** The card container lifts slightly (subtle `box-shadow` and
  `translateY(-4px)`).
- **Image Hover:** The product image scales slightly (`scale(1.05)`) within its
  container.
- **Button Focus:** A 2px solid offset ring appears around the "Add to Cart"
  button when focused via keyboard.
- **Whole Card Click:** This card uses the **Specific Action Targets** pattern.
  The image and title link to the PDP (Product Detail Page), while the "Add to
  Cart" button performs a specific asynchronous action.

## Mobile Adaptation

- **Desktop:** 4-column grid (25% width per card).
- **Tablet:** 2-column grid (50% width per card).
- **Mobile:** 1-column stack. The image aspect ratio remains 1:1, but the font
  size for the title is slightly reduced to fit the smaller viewport.
