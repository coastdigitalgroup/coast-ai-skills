---
name: card-ui-system
description:
  Design and implement a systematic framework for content cards to ensure
  consistency, hierarchy, and responsiveness across a website.
---

# Card UI System

## Purpose

The Card UI System skill provides a methodology for designing and structuring
"cards"—the modular building blocks used to group related information and
actions. A systematic approach to cards ensures that content is scannable,
visually cohesive, and adapts gracefully across different layout contexts (e.g.,
grids, carousels, stacks) while maintaining accessibility and clear intent.

## Use Cases

- Designing product listings for e-commerce.
- Creating "Features" or "Services" sections on a landing page.
- Organizing blog posts or news feeds.
- Building dashboard widgets or data summaries.
- Defining a "Result" component for search or filter views.

## When NOT to Use

- **Full-Width Section Content:** If the information is a primary narrative
  element that spans the whole screen width, a card container may create
  unnecessary visual "walls."
- **Data-Heavy Tables:** When users need to compare many rows of granular data
  simultaneously, a table is more efficient (though cards can be a responsive
  fallback).
- **Simple Text Flows:** For standard paragraphs or articles, cards can
  interfere with reading rhythm.

## Inputs

1.  **Content Anatomy:** A list of required elements (e.g., Image, Title,
    Category, Price, Description, CTA).
2.  **Parent Context:** Where will the card live? (e.g., 3-column grid, sidebar,
    horizontal list).
3.  **Interactive Requirements:** Is the whole card clickable, or just specific
    buttons?
4.  **Existing Systems:** Fluid spacing, typography scales, and color palettes
    from the parent design system.

## Outputs

1.  **Card Anatomy Spec:** Defined regions (Header, Media, Body, Footer) and
    their internal spacing.
2.  **Responsive Variants:** Definitions for how the card layout changes (e.g.,
    switching from vertical to horizontal on mobile).
3.  **Interaction Spec:** Hover, focus, and active states for the card container
    and nested elements.
4.  **Accessibility Map:** Guidance on heading hierarchy and keyboard
    interaction patterns.

## Workflow

### 1. Define the Anatomy

Map out the internal hierarchy of the card:

- **Media Area:** Aspect ratio for images or icons (e.g., 16:9, 1:1).
- **Header:** Meta-information like tags, categories, or dates.
- **Content/Body:** Title (Primary) and Description (Secondary).
- **Footer/Actions:** CTAs, price, or social proof (e.g., star ratings).

### 2. Establish Internal Spacing

Apply the `fluid-spacing-system` to the card’s interior:

- **Padding:** The space between the card edge and its content (usually
  `--space-m`).
- **Stacking Gaps:** The vertical space between internal elements (usually
  `--space-xs` or `--space-s`).
- **Alignment:** Consistent alignment (usually left-aligned for readability,
  centered for minimal marketing cards).

### 3. Design Visual Hierarchy

Apply `visual-hierarchy-system` levers to distinguish content:

- **Weight:** Make the Title bold and larger than the description.
- **Contrast:** Use a muted color for meta-text (e.g., "Published on Oct 24").
- **Elevation:** Use borders or subtle box-shadows to separate the card from the
  background.

### 4. Determine Clickability Pattern

Choose a functional pattern for interaction:

- **The Big Box:** The entire card is a link (requires careful accessibility
  handling).
- **The Nested Action:** Only specific buttons or the title are clickable.
- **The Hybrid:** The card surface has a hover effect, but specific actions
  perform different tasks (e.g., "Add to Cart" vs. "View Details").

### 5. Define Responsive Adaptations

Plan how the card survives different viewports:

- **Vertical to Horizontal:** For mobile, a card might switch from an
  image-on-top layout to an image-on-the-left layout to save vertical space.
- **Truncation:** Decide if long titles or descriptions should be truncated with
  ellipses after N lines.

## Decision Rules

- **The "Three-Point" Rule:** A card should rarely have more than 3 distinct
  priorities (e.g., 1. Image, 2. Title, 3. Price). Too much detail makes it a
  "mini-page," not a card.
- **Consistent Aspect Ratios:** All cards in a single row must use the same
  media aspect ratio to prevent a "jagged" visual line.
- **Equal Heights:** In a grid, cards in the same row should ideally be the same
  height (using Flexbox `align-items: stretch`).
- **Interactive Affordance:** If a card is clickable, it must have a visible
  hover state (e.g., slight lift, border color change).

## Constraints

- **Accessibility:** If the whole card is clickable, ensure it doesn't create a
  "redundant link" problem for screen readers. Use the "Redundant Clickable
  Area" pattern where the primary link is stretched to cover the card.
- **Responsiveness:** Cards must never have a fixed width; they should span
  columns in a `responsive-grid-system`.
- **Keyboard Navigation:** Every interactive element inside a card must be
  reachable via `Tab` and have a clear focus indicator.

## Common Failure Patterns

- **The "Staircase" Effect:** Cards in a row having different amounts of text,
  resulting in buttons that don't align horizontally.
- **Over-Decoration:** Using too many borders, shadows, and gradients, making
  the content hard to read.
- **Invisible Click-Targets:** Making a card look clickable but only having a
  tiny 10px icon that actually triggers the action.
- **Lack of Padding:** Cramming text right against the card's edge or image.

## Validation Criteria

- [ ] Internal spacing (padding/gaps) uses tokens from the fluid spacing system.
- [ ] Typography follows the site's established scale and hierarchy.
- [ ] Hover and Focus states are defined and accessible.
- [ ] Cards in a grid align correctly and handle varying content lengths
      gracefully.
- [ ] Image aspect ratios are consistent across related card sets.
- [ ] Accessibility: The card's heading level follows the page's logical
      structure.
