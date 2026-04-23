---
name: card-ui-system
description:
  Design and implement modular content containers that maintain hierarchy,
  structural integrity, and action alignment across variable content and
  responsive viewports.
---

# Card UI System

## Purpose

The Card UI System provides a methodology for designing modular containers that
group related information and actions. Cards are the fundamental building blocks
of discovery-heavy interfaces, allowing users to scan and compare multiple
distinct items (products, articles, profiles) within a unified grid or list.
This system ensures that cards remain legible, accessible, and visually balanced
regardless of content variance.

## Use Cases

- Designing product grids for e-commerce listing pages (PLPs).
- Creating article or blog post previews for content hubs.
- Organizing dashboard widgets or feature highlights.
- Implementing "Related Content" sections at the bottom of pages.

## When NOT to Use

- **Dense Data Tables:** When users need to compare specific attributes across
  hundreds of rows; use `responsive-data-tables` instead.
- **Single Narrative Content:** When the content follows a strict linear story
  without the need for modular grouping.
- **Minimalist Action-Only UI:** Like a single-field search bar or a simple
  login form where a card wrapper would add unnecessary visual noise.

## Inputs

1.  **Content Requirements:** What elements must the card contain (Image, Title,
    Description, Price, Metadata, CTA)?
2.  **Interaction Intent:** Is the entire card clickable, or are there specific
    action targets?
3.  **Context:** Where will the card live? (3-column grid, sidebar, horizontal
    scroller?)
4.  **Content Variance:** What is the minimum and maximum amount of text
    expected for titles and descriptions?

## Outputs

1.  **Card Blueprint:** A structural definition of the card's internal layout
    and layers.
2.  **Responsive Behavior:** Rules for how the card adapts (e.g., switching from
    vertical to horizontal on mobile).
3.  **Interaction Spec:** Defined states (Hover, Focus, Active) and clickable
    area definitions.

## Workflow

### 1. Apply the "Three-Point Rule"

Every card should have three clear points of hierarchy to ensure scan-ability:

1.  **The Anchor (Visual):** A high-quality image or icon that provides
    immediate recognition.
2.  **The Context (Content):** The title and core metadata (e.g., Price, Date,
    Category).
3.  **The Target (Action):** A clear primary action (e.g., "Add to Cart", "Read
    More").

### 2. Define the Internal Grid

Determine how content is distributed within the card:

- **Top-Down (Standard):** Image at the top, content in the middle, action at
  the bottom.
- **Side-by-Side (Horizontal):** Image on the left, content and action on the
  right (best for mobile lists or sidebars).
- **Overlay:** Content sits on top of the image (requires high-contrast
  treatments for legibility).

### 3. Handle Content Variance

Design for the "worst-case" content scenario:

- **Truncation vs. Wrapping:** Decide if long titles should truncate with
  ellipses or wrap to multiple lines.
- **Alignment:** Use Flexbox `margin-top: auto` on the action container to
  ensure buttons align perfectly across cards of different heights in a grid.

### 4. Establish Interaction Patterns

Define how the card responds to user input:

- **Whole-Card Click:** If the entire card is a link, ensure the `<a>` tag wraps
  the content correctly (or uses the "stretched link" pattern).
- **Hover Effects:** Use subtle transformations (e.g., slight lift, border color
  change) to indicate interactivity.

### 5. Verify Accessibility

- **Heading Levels:** Ensure card titles use appropriate heading levels (usually
  H3 or H4) to maintain the page's document outline.
- **Touch Targets:** Any interactive element within the card must be at least
  44x44px.
- **Alt Text:** Every anchor image must have descriptive alt text or be marked
  as decorative.

## Decision Rules

- **The Aspect Ratio Rule:** Use consistent aspect ratios for images (e.g., 4:3,
  16:9, or 1:1) to prevent "jumping" layouts in a grid.
- **Proximity Score:** The gap between the Title and Description should be
  smaller than the gap between the Description and the CTA.
- **The "No Orphan" Rule:** If a card is part of a grid, the grid must handle
  remaining space gracefully (e.g.,
  `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`).
- **Primary vs. Secondary Actions:** Only one action should be visually dominant
  (Primary CTA). Other actions (e.g., "Save to Wishlist") should be icons or
  low-contrast links.

## Constraints

- **Responsiveness:** Cards must never exceed the viewport width. In grids, they
  should stack vertically or switch to a horizontal layout on small screens.
- **Accessibility:** Must support keyboard navigation (Tab through interactive
  elements) and maintain a minimum contrast ratio of 4.5:1 for text.
- **Performance:** Avoid excessively large images; use `srcset` to serve
  appropriately sized assets for the card container.

## Common Failure Patterns

- **The "Staggered Button" Problem:** Buttons sitting at different heights
  because of varying title lengths, making the grid look messy.
- **Low Information Density:** Making cards too large with too little content,
  forcing unnecessary scrolling.
- **Information Overload:** Trying to fit too many details into a single card,
  breaking the Three-Point Rule and confusing the user.
- **Inaccessible Hit Areas:** Small buttons or links that are difficult to tap
  on mobile devices.

## Validation Criteria

- [ ] The "Three-Point Rule" is clearly visible (Anchor, Context, Target).
- [ ] Primary actions (buttons) are aligned across the bottom of the grid row.
- [ ] Image aspect ratios are consistent across all cards in the system.
- [ ] Interactive states (Hover/Focus) are defined and accessible.
- [ ] Heading levels follow a logical hierarchy within the page.
- [ ] Touch targets meet the 44x44px minimum.
