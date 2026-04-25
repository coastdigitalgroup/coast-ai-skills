---
name: card-ui-system
description:
  Design and implement a systematic framework for modular content containers
  that maintain hierarchy, structural integrity, and action alignment across
  variable content and responsive viewports.
---

# Card UI System

## Purpose

The Card UI System provides a methodology for designing and structuring
cards—the modular building blocks used to group related information and actions.
Cards are the fundamental building blocks of discovery-heavy interfaces, allowing
users to scan and compare multiple distinct items (products, articles, profiles)
within a unified grid or list. A systematic approach to cards ensures that
content is scannable, visually cohesive, and adapts gracefully across different
layout contexts (grids, carousels, stacks) while maintaining accessibility and
clear intent.

## Use Cases

- Designing product grids for e-commerce listing pages (PLPs).
- Creating article or blog post previews for content hubs.
- Creating "Features" or "Services" sections on a landing page.
- Organizing dashboard widgets, feature highlights, or data summaries.
- Implementing "Related Content" sections at the bottom of pages.
- Defining a "Result" component for search or filter views.

## When NOT to Use

- **Dense Data Tables:** When users need to compare specific attributes across
  many rows of granular data simultaneously; use `responsive-data-tables`
  instead (though cards can be a responsive fallback).
- **Single Narrative Content / Simple Text Flows:** When the content follows a
  strict linear story or standard paragraphs where a card wrapper would add
  unnecessary visual noise or interfere with reading rhythm.
- **Minimalist Action-Only UI:** Like a single-field search bar or a simple
  login form where a card wrapper would add unnecessary visual noise.

## Inputs

1. **Content Anatomy:** A list of required elements (e.g., Image, Title,
   Category, Price, Description, CTA).
2. **Interaction Intent:** Is the entire card clickable, or are there specific
   action targets?
3. **Parent Context:** Where will the card live? (e.g., 3-column grid,
   sidebar, horizontal scroller?)
4. **Content Variance:** What is the minimum and maximum amount of text
   expected for titles and descriptions?
5. **Existing Systems:** Fluid spacing, typography scales, and color palettes
   from the parent design system.

## Outputs

1. **Card Anatomy Spec:** Defined regions (Header, Media, Body, Footer) and
   their internal spacing.
2. **Card Blueprint:** A structural definition of the card's internal layout
   and layers.
3. **Responsive Variants:** Rules for how the card adapts (e.g., switching from
   vertical to horizontal on mobile).
4. **Interaction Spec:** Defined states (Hover, Focus, Active) and clickable
   area definitions.
5. **Accessibility Map:** Guidance on heading hierarchy and keyboard interaction
   patterns.

## Workflow

### 1. Apply the "Three-Point Rule" and Define Anatomy

Every card should have three clear points of hierarchy to ensure scan-ability:

1. **The Anchor (Visual):** A high-quality image or icon that provides
   immediate recognition. Define the aspect ratio for images (e.g., 16:9, 1:1).
2. **The Context (Content):** The title and core metadata (e.g., Price, Date,
   Category).
3. **The Target (Action):** A clear primary action (e.g., "Add to Cart",
   "Read More").

Map out the full internal hierarchy: **Header** (meta-info like tags/dates),
**Media Area**, **Content/Body** (title + description), and **Footer/Actions**
(CTAs, price, social proof).

### 2. Establish Internal Spacing and the Internal Grid

Apply the `fluid-spacing-system` to the card's interior:

- **Padding:** The space between the card edge and its content (usually
  `--space-m`).
- **Stacking Gaps:** The vertical space between internal elements (usually
  `--space-xs` or `--space-s`).

Determine how content is distributed within the card:

- **Top-Down (Standard):** Image at the top, content in the middle, action at
  the bottom.
- **Side-by-Side (Horizontal):** Image on the left, content and action on the
  right (best for mobile lists or sidebars).
- **Overlay:** Content sits on top of the image (requires high-contrast
  treatments for legibility).

### 3. Design Visual Hierarchy and Handle Content Variance

Apply `visual-hierarchy-system` levers to distinguish content:

- **Weight:** Make the Title bold and larger than the description.
- **Contrast:** Use a muted color for meta-text (e.g., "Published on Oct 24").
- **Elevation:** Use borders or subtle box-shadows to separate the card from the
  background.

Design for the "worst-case" content scenario:

- **Truncation vs. Wrapping:** Decide if long titles should truncate with
  ellipses or wrap to multiple lines.
- **Alignment:** Use Flexbox `margin-top: auto` on the action container to
  ensure buttons align perfectly across cards of different heights in a grid.

### 4. Establish Interaction Patterns

Choose a functional pattern for interaction:

- **The Big Box:** The entire card is a link (requires careful accessibility
  handling for screen readers).
- **The Nested Action:** Only specific buttons or the title are clickable.
- **The Hybrid:** The card surface has a hover effect, but specific actions
  perform different tasks (e.g., "Add to Cart" vs. "View Details").

Use subtle transformations on hover (e.g., slight lift, border color change) to
indicate interactivity.

### 5. Define Responsive Adaptations and Verify Accessibility

Plan how the card survives different viewports:

- **Vertical to Horizontal:** For mobile, a card might switch from an
  image-on-top layout to an image-on-the-left layout to save vertical space.
- **Truncation:** Decide if long titles or descriptions should be truncated with
  ellipses after N lines.

Verify accessibility before sign-off:

- **Heading Levels:** Ensure card titles use appropriate heading levels (usually
  H3 or H4) to maintain the page's document outline.
- **Touch Targets:** Any interactive element within the card must be at least
  44x44px.
- **Alt Text:** Every anchor image must have descriptive alt text or be marked
  as decorative.
- **Keyboard Navigation:** Every interactive element inside a card must be
  reachable via `Tab` and have a clear focus indicator.

## Decision Rules

- **The "Three-Point" Rule:** A card should rarely have more than 3 distinct
  priorities (e.g., 1. Image, 2. Title, 3. Price). Too much detail makes it a
  "mini-page," not a card.
- **The Aspect Ratio Rule:** Use consistent aspect ratios for images (e.g., 4:3,
  16:9, or 1:1) to prevent "jumping" layouts in a grid.
- **Proximity Score:** The gap between the Title and Description should be
  smaller than the gap between the Description and the CTA.
- **The "No Orphan" Rule:** If a card is part of a grid, the grid must handle
  remaining space gracefully (e.g.,
  `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`).
- **Equal Heights:** In a grid, cards in the same row should ideally be the same
  height (using Flexbox `align-items: stretch`).
- **Primary vs. Secondary Actions:** Only one action should be visually dominant
  (Primary CTA). Other actions (e.g., "Save to Wishlist") should be icons or
  low-contrast links.
- **Interactive Affordance:** If a card is clickable, it must have a visible
  hover state.

## Constraints

- **Responsiveness:** Cards must never exceed the viewport width or have a fixed
  width; they should span columns in a `responsive-grid-system` and stack
  vertically or switch to a horizontal layout on small screens.
- **Accessibility:** Must support keyboard navigation (Tab through interactive
  elements) and maintain a minimum contrast ratio of 4.5:1 for text. If the
  whole card is clickable, use the "stretched link" pattern to avoid redundant
  links for screen readers.
- **Performance:** Avoid excessively large images; use `srcset` to serve
  appropriately sized assets for the card container.

## Common Failure Patterns

- **The "Staircase / Staggered Button" Effect:** Buttons sitting at different
  heights because of varying title lengths, making the grid look messy.
- **Over-Decoration:** Using too many borders, shadows, and gradients, making
  the content hard to read.
- **Low Information Density:** Making cards too large with too little content,
  forcing unnecessary scrolling.
- **Information Overload:** Trying to fit too many details into a single card,
  breaking the Three-Point Rule and confusing the user.
- **Inaccessible / Invisible Click-Targets:** Small buttons or links that are
  difficult to tap on mobile devices, or making a card look clickable with only
  a tiny icon as the actual trigger.
- **Lack of Padding:** Cramming text right against the card's edge or image.

## Validation Criteria

- [ ] The "Three-Point Rule" is clearly visible (Anchor, Context, Target).
- [ ] Internal spacing (padding/gaps) uses tokens from the fluid spacing system.
- [ ] Typography follows the site's established scale and hierarchy.
- [ ] Primary actions (buttons) are aligned across the bottom of the grid row.
- [ ] Image aspect ratios are consistent across all cards in the system.
- [ ] Interactive states (Hover/Focus) are defined and accessible.
- [ ] Cards in a grid align correctly and handle varying content lengths
      gracefully.
- [ ] Heading levels follow a logical hierarchy within the page.
- [ ] Touch targets meet the 44x44px minimum.
- [ ] Accessibility: The card's heading level follows the page's logical
      structure.
