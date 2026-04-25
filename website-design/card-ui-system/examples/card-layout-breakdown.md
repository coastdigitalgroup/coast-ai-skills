# Card Layout Breakdown: E-commerce Product Card

This example demonstrates how to apply the **Card UI System** and the
**Three-Point Rule** to a standard e-commerce product card.

## 1. The Three-Point Rule in Action

| Hierarchy Point              | Element              | Design Treatment                                                                            |
| :--------------------------- | :------------------- | :------------------------------------------------------------------------------------------ |
| **1. The Anchor (Visual)**   | Product Image        | 1:1 Aspect Ratio, high-quality, centered. Acts as the primary "hook" for the user.          |
| **2. The Context (Content)** | Title & Price        | Bold title (H3), clear price display with high contrast. Provides the "why" and "how much." |
| **3. The Target (Action)**   | "Add to Cart" Button | Primary brand color, full-width button. The singular goal of the card.                      |

## 2. Structural Layering

The card is built using a vertical Flexbox stack to ensure consistent alignment.

```text
[ Card Container (Border, Border-Radius, Shadow) ]
  ├── [ 1. Anchor Layer ]
  │     └── Image (object-fit: cover; aspect-ratio: 1/1)
  ├── [ 2. Context Layer ]
  │     ├── Category Label (All Caps, Small, Muted)
  │     ├── Product Title (H3, 2-line max height)
  │     └── Price (Bold, Primary Color)
  └── [ 3. Target Layer (margin-top: auto) ]
        └── Primary Button ("Add to Cart")
```

## 3. Key Design Decisions

### Handling Variable Content

- **Title Wrapping:** The title is constrained to a maximum of 2 lines. If it
  exceeds this, it is truncated with an ellipsis. This prevents cards from
  having wildly different heights.
- **Action Alignment:** By using `margin-top: auto` on the **Target Layer**, the
  "Add to Cart" button will always sit at the very bottom of the card, even if
  one card has a 1-line title and another has a 2-line title.

### Interactive States

- **Card Hover:** The container lifts slightly (`transform: translateY(-4px)`)
  and the shadow deepens to provide tactile feedback.
- **Button Focus:** A high-contrast focus ring appears around the "Add to Cart"
  button when navigated via keyboard.

### Accessibility Highlights

- **Heading Outline:** The product name is marked as an `<h3>`, ensuring a
  logical document structure when 12 products are listed on a page.
- **Touch Target:** The "Add to Cart" button is 48px tall, exceeding the 44px
  minimum requirement for mobile usability.
- **Alt Text:** "Front view of ergonomic office chair in charcoal grey."

## 4. Responsive Transition

- **Desktop (3+ Columns):** Vertical layout as described above.
- **Mobile (1 Column):** Switches to a **Horizontal Layout** to save vertical
  space. The image moves to the left (30% width), and the content/action move to
  the right (70% width).
