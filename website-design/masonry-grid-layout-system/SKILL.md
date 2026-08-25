---
name: masonry-grid-layout-system
description:
  Design and implement a systematic, multi-column masonry grid layout framework
  to pack variable-height content cards tightly without vertical gaps while maintaining
  strict visual hierarchy, logical reading and focus order, and WCAG AA accessibility.
---

# Masonry Grid Layout System

## Purpose

The Masonry Grid Layout System provides a standardized, responsive design framework for displaying non-uniform, variable-height content cards (such as photography portfolios, user-generated content feeds, mixed media cards, or editorial visual discovery boards). Standard CSS Grid layouts force row height alignment, creating awkward vertical whitespace gaps when items have varying aspect ratios or text lengths.

Designing an effective masonry grid requires solving the spatial challenge of packing items dynamically into parallel vertical columns, preventing Cumulative Layout Shift (CLS) as media assets load, ensuring graceful mobile column degradation, and—critically—preventing the visual layout from breaking the logical DOM reading order and keyboard focus navigation sequence (WCAG 2.1 SC 1.3.2 and SC 2.1.1).

## Use Cases

- **Photography & Visual Media Portfolios:** Displaying galleries of images with varying native aspect ratios (portrait, landscape, square, panorama) in a tight, gapless grid.
- **Social & UGC Activity Feeds:** Organizing mixed social cards containing short text updates, full-length articles, embedded images, and video teasers.
- **E-Commerce UGC & Review Walls:** Presenting customer review photos, tagged Instagram posts, and product highlight snippets in a dynamic discovery showcase.
- **Editorial Discovery & Pinboards:** Building moodboards, bookmark managers, and inspiration feeds where cards contain diverse content elements with variable vertical footprints.

## When NOT to Use

- **Uniform Aspect Ratio Grids:** If all items share identical aspect ratios (e.g., standard 16:9 video cards or 1:1 product catalogs), use `responsive-grid-system` or `card-ui-system`.
- **Structured 2D Asymmetrical Highlights:** For curated hero sections with explicit 2D rectangular spanning rules (e.g., a 2x2 main feature alongside 1x1 stat blocks), use `bento-grid-layout-system`.
- **Strict Tabular or Aligned Data:** When users need to compare values across horizontal rows (e.g., pricing tables or financial metrics), use `data-table-ui-system` or `comparison-matrix-system`.
- **Sequential Storytelling & Articles:** For linear narratives where reading order must strictly follow a single vertical flow, use `article-layout-system` or `section-composition-system`.

## Inputs

1. **Content Inventory & Aspect Ratios:** Types of media and text content (images, videos, text snippets, action cards) and their aspect ratio spectrum (from 3:4 portrait to 16:9 landscape).
2. **Column Architecture Requirements:** Target column counts across screen sizes (e.g., 4 columns on widescreen desktop, 3 on desktop, 2 on tablet, 1 on mobile).
3. **Interactivity & Focus Requirements:** Interactive elements inside cards (buttons, lightboxes, inline toggles, links) that require keyboard accessibility.
4. **Spatial & Theme Tokens:** Fluid column gutters and row gaps (`gap: clamp(12px, 2vw, 24px)`), card background fills, border-radii, and focus ring tokens (from `fluid-spacing-system` and `focus-indicator-design-system`).

## Outputs

1. **Masonry Layout Architecture Specification:** Strategic choice and technical blueprint between pure CSS Multi-Column flow, CSS Grid row-spanning (`grid-auto-rows`), and JavaScript shortest-column packing.
2. **Responsive Column Scaling Matrix:** Breakpoint definition for smooth column count transitions and gap scaling.
3. **DOM Reading Order & Keyboard Focus Map:** Architecture ensuring keyboard navigation (`Tab` / `Shift+Tab`) follows natural visual reading order without chaotic column jumping.
4. **Layout Stability & Aspect-Ratio Preservation Rules:** CSS architecture preventing Cumulative Layout Shift (CLS) during image and media loading.

---

## Workflow

### 1. Select the Architectural Strategy
Choose the appropriate layout technique based on interactivity and reading order requirements:

- **Option A: Pure CSS Multi-Column Layout (`column-count`)**
  - *Best for:* Static galleries, image-heavy feeds, or non-interactive cards where flow order can run vertically down column 1, then column 2, etc.
  - *Implementation:* `column-count: 4; column-gap: var(--space-m);`. Set `break-inside: avoid; margin-bottom: var(--space-m);` on child cards.
  - *Trade-off:* Vertical source ordering (top-to-bottom within columns) can confuse keyboard users if cards contain interactive controls.
- **Option B: CSS Grid with Row Spans (`grid-auto-rows` & `grid-row: span X`)**
  - *Best for:* Semi-static grids where card height steps can be quantized into fixed row track units (e.g., `10px` base tracks).
  - *Implementation:* `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); grid-auto-rows: 10px; gap: 16px;`. JavaScript calculates content height and applies `grid-row: span Math.ceil(height / trackHeight)`.
  - *Trade-off:* Native horizontal DOM order is preserved, but requires minor JS height calculations or container queries.
- **Option C: JavaScript Shortest-Column Container Distribution**
  - *Best for:* Highly interactive mixed-media feeds where left-to-right reading order is paramount and cards contain links, buttons, and form controls.
  - *Implementation:* Create $N$ flex column containers (`display: flex; flex-direction: column; gap: var(--space-m);`). Append incoming cards to the column currently with the shortest total rendered height.
  - *Trade-off:* Requires client-side DOM container management, but guarantees perfect left-to-right DOM focus flow and zero visual vertical gaps.

### 2. Define Spatial Rhythm and Column Gutters
Establish consistent spacing tokens across all columns and card inner padding:
- **Column Gutters:** Use fluid gap spacing (e.g., `gap: clamp(16px, 2.5vw, 28px)`). Ensure vertical gaps between stacked cards equal horizontal column gaps to maintain uniform spatial density.
- **Card Padding & Inner Alignment:** Standardize internal card padding using fluid tokens (`padding: var(--space-m)`). For media-only cards (e.g., lightbox triggers), allow images to bleed edge-to-edge (`padding: 0; overflow: hidden;`).
- **Corner Radius Synchronization:** Apply consistent border-radius to outer card containers (e.g., `12px` to `16px`). Ensure inner elements (e.g., top images) inherit concentric corner radii (`border-top-left-radius: calc(var(--card-radius) - 1px)`).

### 3. Prevent Layout Shift (CLS) and Image Distortions
Masonry grids are highly susceptible to Cumulative Layout Shift during image loading:
- **Aspect Ratio Boxes:** Explicitly declare `aspect-ratio` on image containers (`aspect-ratio: 4 / 5; object-fit: cover; width: 100%; display: block;`) or calculate inline padding ratios before media resolves.
- **Skeleton Placeholders:** Render styled skeleton background pulses (`background: var(--surface-subtle); animation: pulse 1.5s infinite;`) matching the expected card aspect ratio while remote assets load.
- **Image Load Listeners:** If using JS height calculations, bind `ResizeObserver` or image `load` event listeners to recalculate column height allocations once images finish rendering.

### 4. Reconcile DOM Reading Order and Focus Management
Ensure compliance with WCAG 1.3.2 (Meaningful Sequence) and 2.1.1 (Keyboard):
- **Avoid Visual-DOM Disconnects:** If using CSS Columns where visual layout flows vertically down columns, ensure keyboard focus indicators remain distinct and logical. If cards contain interactive controls, prefer JavaScript Shortest-Column distribution or CSS Grid row-spanning to maintain a natural left-to-right, top-to-bottom tabbing sequence (`Tab` key order).
- **Focus Indicator Visibility:** Standardize high-contrast, unclipped focus indicators (`outline: 3px solid var(--focus-ring-color); outline-offset: 3px;`). Avoid `overflow: hidden` on cards without adding sufficient focus indicator padding inside the clip bounds.
- **Keyboard Shortcuts for Lightboxes / Modals:** If clicking a masonry card opens a modal overlay or lightbox, trap keyboard focus within the overlay (`focus-trap`) and return focus to the originating card trigger upon dismissal (`Escape` key).

### 5. Implement Responsive Column Scaling
Design breakpoints to gracefully scale column counts without breaking content balance:

- **Widescreen Desktop (≥ 1440px):** 4 Columns (`column-count: 4` or 4 flex column tracks).
- **Standard Desktop (1024px – 1439px):** 3 Columns (`column-count: 3` or 3 flex column tracks).
- **Tablet / Small Screen (640px – 1023px):** 2 Columns (`column-count: 2` or 2 flex column tracks).
- **Mobile (< 640px):** 1 Column (`column-count: 1` or single vertical stack). All items stack naturally with standard vertical spacing.

---

## Decision Rules

### Architectural Selection Matrix

| Content & Interaction Type | Recommended Architectural Strategy | Justification |
| :--- | :--- | :--- |
| **Pure Image Gallery (Lightbox Triggers)** | **CSS Multi-Column (`column-count`)** | Zero JS footprint, native browser multi-column performance, clean vertical image masonry. |
| **Interactive Cards (Buttons, Inputs, Links)** | **JS Shortest-Column Flex Distribution** | Preserves strict left-to-right DOM tab order, preventing screen reader and keyboard focus jumping. |
| **Dynamic Loading Feed (Infinite Scroll)** | **CSS Grid Row-Spanning or JS Column Distribution** | Allows appending new cards smoothly to the shortest column without reflowing the entire page layout. |
| **Text-Heavy Editorial Pinboard** | **CSS Grid Row-Spanning (`grid-auto-rows: 10px`)** | Maintains horizontal reading order while accommodating variable text lengths precisely. |

---

## Constraints

- **Accessibility (WCAG 2.1 AA Compliance):**
  - **SC 1.3.2 Meaningful Sequence:** The visual arrangement of interactive cards must align logically with the keyboard tab navigation order (`tabindex="0"` focus flow).
  - **SC 1.4.3 Contrast (Minimum):** Text rendered over card surfaces or image overlays must satisfy a minimum **4.5:1** contrast ratio. Dark scrim overlays (`background: linear-gradient(to top, rgba(0,0,0,0.8), transparent)`) must be used for text placed directly on images.
  - **SC 2.1.1 Keyboard:** All interactive card elements (like buttons, bookmark triggers, external links) must be fully operable via `Space` and `Enter` keys.
  - **SC 2.4.7 Focus Visible:** Interactive cards and triggers must display a distinct focus ring that is not clipped by parent card `overflow: hidden` properties.
  - **SC 2.5.8 Target Size:** All touch targets inside masonry cards must maintain a minimum interactive area of **24x24px** (minimum **44x44px** on touch/mobile viewports).
- **Layout Shift Performance:** Images inside masonry cards must have explicitly defined intrinsic aspect ratios or dimension reservations to guarantee CLS remains below **0.1**.

---

## Common Failure Patterns

- **The Keyboard Tab Jumble:** Using CSS `column-count` for interactive cards, causing the keyboard `Tab` key to move vertically down the entire first column (from item 1 to item 10) before jumping back up to the top of column 2.
- **Cumulative Layout Shift (CLS) Chaos:** Inserting images without aspect ratio styling or loading skeletons, causing the masonry columns to reflow and jump repeatedly as each image loads.
- **Clipped Focus Rings:** Setting `overflow: hidden` on masonry cards to enforce rounded image corners, which cuts off the standard outline focus ring of interactive inner elements.
- **Unconstrained Column Heights on Mobile:** Failing to collapse masonry grids down to a single column on mobile devices, resulting in ultra-narrow, squished multi-column cards with unreadable text wrap.
- **Uneven Column Tallies:** Appending new items in dynamic feeds sequentially across columns (1, 2, 3, 1, 2, 3) rather than checking column heights, creating massive vertical blank spaces at the bottom of shorter columns.

---

## Validation Criteria

- [ ] **Architecture Alignment:** Selected strategy (CSS Columns vs. CSS Grid Row-Span vs. JS Shortest-Column) matches card interactivity requirements.
- [ ] **Zero Unintended Vertical Gaps:** Cards pack tightly without horizontal row-alignment white space gaps.
- [ ] **Keyboard Tab Navigation:** Interactive cards follow a logical visual tabbing sequence (left-to-right, top-to-bottom).
- [ ] **Layout Shift Prevention:** Aspect ratios or skeleton containers prevent CLS (<0.1) as remote media loads.
- [ ] **Responsive Breakpoint Adaptation:** Grid scales smoothly from 4 columns on widescreen down to 1 single vertical column on mobile (<640px).
- [ ] **WCAG AA Compliance:** All text meets ≥4.5:1 contrast, touch targets meet ≥24x24px (≥44x44px on mobile), and focus rings are unclipped and clearly visible.
