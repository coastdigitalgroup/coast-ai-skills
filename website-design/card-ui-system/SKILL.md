---
name: card-ui-system
description:
  Design and implement modular content containers (cards) that balance visual
  hierarchy, information density, and accessibility. Trigger this skill when
  organizing repetitive content types like products, blog posts, or feature
  highlights.
---

# Card UI System

## Purpose

The Card UI System provides a structured framework for creating modular content
containers. Cards serve as entry points to more detailed information, balancing
brief snippets of content with clear calls to action. This system ensures that
cards remain legible, accessible, and visually consistent across varying
viewport sizes and content lengths.

## Use Cases

- Creating product grids for e-commerce listings.
- Designing blog post or news article previews.
- Highlighting service features or "USPs" (Unique Selling Points).
- Building dashboard widgets for data visualization summaries.
- Organizing user profiles or directory listings.

## When NOT to Use

- **Tabular Data:** Use a
  [Responsive Data Table](../../website-development/responsive-data-tables/SKILL.md)
  when users need to compare specific attributes across many rows.
- **Pure Text Content:** Use standard typographic hierarchy for long-form
  articles without modular grouping.
- **Complex Interactions:** Avoid overcomplicating cards with too many nested
  actions (e.g., editing, deleting, and moving all inside one card).

## Inputs

1.  **Content Elements:** A list of items to be included (e.g., Image, Title,
    Category, Price, Rating, Description, CTA).
2.  **Context of Use:** Where will the cards live? (Grid, Carousel, Sidebar).
3.  **Priority of Information:** Which element is the "Anchor," the "Context,"
    and the "Target"?
4.  **Action Type:** Is the whole card clickable, or are there specific targets?

## Outputs

1.  **Card Component Specification:** Defined hierarchy and spacing for internal
    elements.
2.  **Responsive Behavior Rules:** How the card adapts from a vertical stack
    (mobile) to a horizontal or grid layout (desktop).
3.  **Accessibility Protocol:** Guidance on focus states, heading levels, and
    ARIA attributes for card-specific patterns.

## Workflow

### 1. Apply the "Three-Point Rule"

Identify the three critical entry points for every card:

- **Point 1: The Anchor (Visual):** Usually an image or icon that provides
  immediate recognition.
- **Point 2: The Context (Primary Content):** The title and essential metadata
  (e.g., Price or Date).
- **Point 3: The Target (Primary Action):** The button or link that leads the
  user to the next step.

### 2. Establish Internal Hierarchy

Use [Visual Hierarchy System](../visual-hierarchy-system/SKILL.md) principles to
rank elements:

- **Size & Weight:** The Title should be the most prominent text element.
- **Proximity:** Group related metadata (e.g., Author and Date) closer together
  than the Title and the CTA.
- **Consistency:** Use a fixed aspect ratio for images to prevent "jagged" grids
  where cards have different heights.

### 3. Define the Clickable Area Pattern

Choose one of three standard patterns:

- **Specific Action Targets:** Only the Button or Link is clickable. Best for
  cards with multiple distinct actions.
- **Stretched Link:** The primary link's clickable area is expanded to cover the
  entire card using CSS. Best for discovery-focused cards.
- **Full-Card Link:** The entire card is wrapped in an `<a>` tag. **Warning:**
  Only use for very simple cards without other interactive elements.

### 4. Handle Variable Content

Design for "the real world" where content lengths vary:

- **Line Clamping:** Truncate long descriptions to a fixed number of lines
  (e.g., 3 lines) to maintain grid alignment.
- **Alignment:** Use Flexbox (`margin-top: auto`) on the CTA to ensure buttons
  align at the bottom of cards in a row, regardless of text length.

### 5. Add Interactive States

Define how the card responds to user input using the
[Interactive State System](../interactive-state-system/SKILL.md):

- **Hover:** Subtle elevation (shadow) or scale changes.
- **Focus:** Clear, high-contrast borders around the clickable target.
- **Active:** A slight "press" effect or color shift.

## Decision Rules

- **Aspect Ratio over Original Size:** Always enforce a consistent aspect ratio
  for card imagery (e.g., 16:9 or 1:1) to maintain layout stability.
- **The "One Heading" Rule:** Each card should contain exactly one heading
  (usually H3 or H4) that accurately describes the card's destination.
- **Avoid "Read More":** Use descriptive link text (e.g., "View Product
  Details") instead of generic "Read More" for better accessibility and SEO.
- **Alignment Consistency:** If one card in a row has a button, all cards in
  that row should have a button in the same position.

## Constraints

- **Accessibility:**
  - Cards must follow a logical focus order (Image -> Title -> Metadata -> CTA).
  - Images must have descriptive `alt` text unless purely decorative.
  - Interactive elements inside a card must be large enough for touch (44x44px).
- **Responsiveness:**
  - Cards should never have a fixed width; use `min-width` or percentage-based
  - widths within a grid.
- **Hierarchy:** The card's title must be more visually prominent than its
  supporting metadata.

## Common Failure Patterns

- **The "Wall of Text":** Including too much body copy, making cards hard to
  scan.
- **Jagged Grids:** Cards having different heights because images weren't
  standardized or buttons weren't bottom-aligned.
- **Nested Interactivity:** Putting links inside a card that is already a link,
  which breaks screen reader behavior.
- **Lack of Focus Indication:** Forgetting to style the focus state for keyboard
  users.

## Validation Criteria

- [ ] Every card follows the Three-Point Rule (Anchor, Context, Target).
- [ ] Images use a consistent aspect ratio across the set.
- [ ] CTAs are aligned consistently (e.g., all bottom-aligned).
- [ ] Text is truncated or clamped to prevent excessive card height.
- [ ] Interactive states (hover/focus) are clearly defined.
- [ ] Heading levels are semantically correct and consistent.
- [ ] The card remains functional and readable on mobile viewports.
