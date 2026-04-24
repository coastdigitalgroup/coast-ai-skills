---
name: card-ui-system
description:
  Design modular content containers that balance information density, visual
  hierarchy, and accessible interaction patterns.
---

# Card UI System

## Purpose

The Card UI System provides a framework for designing and implementing modular
content containers (cards) that serve as entry points to more detailed
information. It ensures that cards are scannable, maintain a consistent visual
hierarchy, and provide clear, accessible interaction paths across different
devices and screen sizes.

## Use Cases

- Designing product listings for e-commerce sites.
- Creating article or blog post previews.
- Developing dashboard widgets for data visualization.
- Organizing search results or directory listings.
- Implementing feature highlights or service offerings.

## When NOT to Use

- **Tabular Data:** Use a Data Table when users need to compare specific values
  across many rows of similar data.
- **Continuous Reading:** Use standard text blocks for long-form content where
  containment would disrupt the reading flow.
- **Primary Page Navigation:** Use a Navigation System for global site
  structure; cards are for content discovery, not structural wayfinding.

## Inputs

1.  **Content Requirements:** A list of elements needed in the card (e.g.,
    image, title, price, rating, category, description, CTA).
2.  **Context of Use:** Where will the cards appear? (e.g., a 3-column grid, a
    horizontal slider, a vertical list).
3.  **Action Priority:** What is the primary user goal? (e.g., view details, add
    to cart, save for later).
4.  **Visual Assets:** Available imagery types (aspect ratios, quality) and
    brand styles.

## Outputs

1.  **Card Anatomy Map:** A breakdown of internal elements and their
    hierarchical order.
2.  **Interaction Strategy:** Definition of how the card handles clicks, hovers,
    and focus states.
3.  **Responsive Layout Rules:** Specifications for how the card adapts or
    stacks on smaller viewports.
4.  **Accessibility Spec:** ARIA roles, label strategies, and keyboard
    interaction patterns.

## Workflow

### 1. Define the Card Anatomy (The Three-Point Rule)

Establish a clear hierarchy by identifying three critical entry points:

- **The Anchor (Visual/Imagery):** Attracts the user's attention first. Usually
  a product image, featured photo, or icon.
- **The Context (Key Content):** Provides the necessary information to
  understand the card (e.g., Title, Price, Category).
- **The Target (Primary Action):** The final destination or action the user is
  expected to take (e.g., "Learn More" link or "Buy" button).

### 2. Determine the Clickable Area Pattern

Choose a pattern based on the card's complexity:

- **Specific Action Targets (Recommended):** Use individual buttons or links for
  each action. Best for cards with multiple interactive elements (e.g., "Add to
  Cart" vs. "View Details").
- **Stretched Link (Title-Driven):** The main link (usually the title) is
  expanded to cover the entire card area using CSS (e.g., `::after` on the
  link). Best for simple discovery cards.
- **Full-Card Link:** The entire container is wrapped in an `<a>` tag. **Use
  with caution:** Only for very simple cards with no nested interactive
  elements.

### 3. Establish Internal Alignment

Use consistent alignment to improve scannability:

- **Top-Down Flow:** Content flows naturally from the top (Anchor) to bottom
  (Target).
- **Action Alignment:** In a grid of variable-height cards, use Flexbox
  (`margin-top: auto`) to push primary actions to the bottom of the card,
  ensuring they align horizontally across the row.

### 4. Design Interactive States

Define visual feedback for every state (see `interactive-state-system`):

- **Hover:** Subtle shadow increase or border color change.
- **Focus:** Highly visible focus ring around the interactive element.
- **Active/Pressed:** Visual "push" effect or color shift.

### 5. Plan Responsive Adaptation

- **Grid to Stack:** Transition from horizontal grids on desktop to single
  columns on mobile.
- **Density Adjustment:** Reduce secondary metadata (e.g., short description) on
  mobile to keep cards compact.

## Decision Rules

- **Aspect Ratio Consistency:** Use a fixed aspect ratio for images (e.g., 16:9,
  4:3, or 1:1) to prevent layout jumping and maintain grid harmony.
- **The "Squint Test" for Cards:** Squint at the card; the Title or Image should
  be the most prominent, followed by the CTA.
- **No Orphaned Actions:** Every card must have at least one clear destination
  or action.
- **Information Density:** Limit metadata to the top 3-4 most critical items to
  avoid cognitive overload.

## Constraints

- **Accessibility:**
  - Ensure contrast ratios meet WCAG AA standards.
  - Do not nest interactive elements (e.g., a button inside a link) if using the
    Full-Card Link pattern.
  - Interactive cards must have a visible focus state.
- **Performance:** Avoid heavy shadows or complex filters on every card in a
  large grid, as this can impact scroll performance.
- **Layout:** Cards must handle variable content lengths (e.g., 1-line vs.
  3-line titles) without breaking the grid layout.

## Common Failure Patterns

- **The "Click Hole":** Wrapping a card in a link but forgetting to provide a
  text-based link that screen readers can identify.
- **Misaligned Buttons:** Buttons appearing at different heights across a row of
  cards, making the grid look disorganized.
- **Hidden Focus:** Losing the focus indicator because it's clipped by
  `overflow: hidden` on the card container.
- **Information Bloat:** Trying to put an entire product description or
  technical spec inside a small card preview.

## Validation Criteria

- [ ] Card anatomy follows the Three-Point Rule (Anchor, Context, Target).
- [ ] Primary actions are aligned across cards in a grid.
- [ ] Clickable area strategy is clear and accessible (no nested interactives).
- [ ] Images use consistent aspect ratios.
- [ ] Hover and focus states are clearly defined and visible.
- [ ] Card layout handles variable content length gracefully.
- [ ] Accessibility: Interactive elements have sufficient contrast and clear
      labels.
