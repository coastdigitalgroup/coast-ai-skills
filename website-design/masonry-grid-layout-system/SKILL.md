---
name: masonry-grid-layout-system
description:
  Design and implement a systematic, multi-column masonry grid layout framework
  to pack variable-height content cards tightly without vertical gaps while maintaining
  strict visual hierarchy, logical reading and focus order, and WCAG AA accessibility.
---

# Masonry Grid Layout System

## Purpose

The Masonry Grid Layout System solves the design and implementation challenge of displaying variable-height content cards (such as visual art, user-generated image feeds, mixed-media article snippets, and pinboards) in a dense multi-column layout without awkward vertical gaps or uneven whitespace. Standard uniform grids force all cards in a row to match the height of the tallest item, leaving large empty gaps under shorter cards. Pure CSS multi-column layouts split items column-by-column, disrupting chronological DOM ordering and causing keyboard focus and screen readers to jump top-to-bottom down one column before jumping back up to the top of the next.

This skill provides a comprehensive architectural framework for multi-column masonry grids. It covers spatial arrangement, aspect-ratio reservation to prevent layout shifts (CLS), dynamic column distribution calculations, progressive enhancement for native CSS Grid Masonry (`grid-template-rows: masonry`), visual-to-DOM reading order synchronization, and full WCAG AA accessibility compliance.

## Use Cases

- **Image & Creative Portfolio Galleries:** Presenting photography, design showcases, or architectural renders with varying aspect ratios (portrait, landscape, square) in a seamless visual grid.
- **User-Generated Content (UGC) & Social Feeds:** Displaying mixed media posts containing dynamic text lengths, image attachments, badge overlays, and engagement stats.
- **E-Commerce Discovery & Visual Pinboards:** Presenting curated product discovery feeds where items contain dynamic image aspect ratios, promotional tags, and varying description lengths.
- **Editorial & Blog Snippet Feeds:** Grouping articles with variable excerpt lengths, featured graphics, author avatars, and category tags into a visually engaging layout.

## When NOT to Use

- **Structured Comparison Tables or Uniform Product Cards:** If content items have uniform heights or require horizontal alignment across rows (e.g., comparing product features or pricing tiers), use `comparison-matrix-system`, `card-ui-system`, or `responsive-grid-system`.
- **Asymmetrical Modular Bento Boxes:** For curated, fixed-cell feature showcases where specific items span 2x2 or 2x1 grid tracks based on explicit feature hierarchy, use `bento-grid-layout-system`.
- **Dense Data & Alphanumeric Tables:** If users need to scan across tabular rows or compare alphanumeric data points, use `data-table-ui-system`.
- **Single-Column Sequential Timelines:** For linear chronological event flows, use `timeline-activity-system`.

## Inputs

1. **Content Items & Dynamic Height Factors:** Inventory of items to render, including dynamic media aspect ratios (e.g., 4:3, 16:9, 1:1, 9:16) and variable text content lengths.
2. **Column & Gap Specifications:** Target column counts across breakpoints (e.g., 4 columns on desktop, 3 on laptop, 2 on tablet, 1 on mobile) and fluid gutter tokens (from `fluid-spacing-system`).
3. **DOM Ordering Strategy:** Reading order requirements (row-first left-to-right vs. column-first distribution) for screen-reader and keyboard focus accessibility.
4. **Design Tokens:** Border radius, shadow elevation (`elevation-and-depth-system`), typography scales (`fluid-typography-system`), card background colors, and focus indicators (`focus-indicator-design-system`).

## Outputs

1. **Masonry Layout Architecture:** CSS and JavaScript layout specs (CSS Multi-column, Flexbox/Grid column distribution, or native CSS Grid Masonry with progressive fallbacks).
2. **Cumulative Layout Shift (CLS) Prevention Spec:** Aspect-ratio containment and image placeholder specifications (`aspect-ratio` CSS or inline HTML width/height dimensions).
3. **Accessibility & Focus Order Blueprint:** Logical HTML DOM structure ensuring keyboard tabbing (`Tab` / `Shift+Tab`) matches visual reading order across columns.
4. **Responsive Breakpoint Matrix:** Column recalculation rules for mobile, tablet, desktop, and ultra-wide viewports.

---

## Workflow

### 1. Establish Layout Strategy & Technical Architecture
Select the appropriate layout engine based on browser compatibility and accessibility requirements:
- **Strategy A: CSS Multi-Column (`column-count` / `column-gap`)**
  - *Pros:* Native CSS, lightweight, no JavaScript required.
  - *Cons:* Arranges items vertically (top-to-bottom per column). DOM source order flows down Column 1, then Column 2. Acceptable for visual-only photo grids with no interactive tabbing elements.
- **Strategy B: Dynamic Row-First Column Distribution (Flexbox / Grid + JS Calculation)**
  - *Pros:* Arranges items left-to-right across columns. Maintains natural reading order in DOM (Item 1 = Col 1 Row 1, Item 2 = Col 2 Row 1).
  - *Implementation:* Calculate shortest column height dynamically and append/position the next item into the shortest column using CSS grid/flex transforms or column wrappers.
- **Strategy C: Progressive Native CSS Grid Masonry (`grid-template-rows: masonry` / `display: masonry`)**
  - *Pros:* Native browser spec performance with automatic item positioning.
  - *Fallback:* Use `@supports (grid-template-rows: masonry)` to serve native masonry where supported, falling back to Strategy B or Strategy A.

### 2. Prevent Layout Shift (CLS Mitigation)
Dynamic masonry layouts collapse or thrash during page load if image dimensions are unknown before downloading:
- **Aspect Ratio Reservation:** Always declare explicit aspect ratios on image containers using CSS `aspect-ratio: var(--item-aspect-ratio)` or inline HTML attributes (`width` and `height`).
- **Placeholder Skeletons:** Render subtle background placeholders (`background-color: var(--surface-subtle)`) with loading skeletons while high-resolution media loads.
- **Image Load Listeners:** If using JavaScript column height calculations, calculate item heights based on explicit aspect ratio math rather than waiting for image `onload` events to prevent layout recalculation delays.

### 3. Build Card Anatomy & Spatial Composition
Structure individual masonry cards with unified internal rhythm:
- **Card Container:** Wrap cards in a structural container (`break-inside: avoid; margin-bottom: var(--gutter); display: flex; flex-direction: column; border-radius: 12px; overflow: hidden;`).
- **Media Wrapper:** Place media at the top with `width: 100%; object-fit: cover;`.
- **Card Body Content:** Pad internal text content consistently (`padding: 16px; display: flex; flex-direction: column; gap: 8px;`).
- **Interactive Triggers:** Place action buttons, like tags, avatars, or links, inside the card body, ensuring interactive elements have clear focus boundaries.

### 4. Optimize Responsive Breakpoints & Column Spacing
Ensure column counts scale smoothly across screen dimensions:
- **Mobile (< 600px):** 1 column (`grid-template-columns: 1fr`). Multi-column layout collapses to a standard vertical stack.
- **Tablet (600px - 899px):** 2 columns (`column-count: 2` or 2-column flex/grid). Gap: `16px`.
- **Desktop (900px - 1199px):** 3 columns (`column-count: 3`). Gap: `20px` to `24px`.
- **Large Desktop (1200px+):** 4 columns (`column-count: 4`). Gap: `24px` to `32px`.
- **Ultra-Wide (1600px+):** 5-6 columns with maximum container constraint (`max-width: 1800px; margin: 0 auto;`).

### 5. Enforce Keyboard & Screen Reader Accessibility
Irregular multi-column positions must maintain accessible navigation:
- **Focus Order Verification:** Ensure keyboard `Tab` navigation moves left-to-right, top-to-bottom across columns rather than jumping down a single column.
- **Unclipped Focus Rings:** Set overflow properties on column wrappers so that `:focus-visible` rings on interactive cards (`outline: 3px solid var(--focus-ring); outline-offset: 2px;`) are not clipped by `overflow: hidden` on parent containers.
- **Semantic HTML Structure:** Use `<main>`, `<section>`, and `<article>` for masonry cards. Ensure each card contains a descriptive heading (`<h2>` or `<h3>`).

---

## Decision Rules

### Layout Method Selection

| Use Case & Requirements | Recommended Layout Method | Trade-off / Implementation Note |
| :--- | :--- | :--- |
| **Pure Image Gallery (No interactive text/links inside cards)** | **CSS Multi-Column Layout** (`column-count: X; column-gap: Y;`) | Simple CSS-only solution. Vertical DOM flow is acceptable since images are non-interactive or open in lightboxes. |
| **Interactive Feed (Links, Buttons, Dynamic Text, Avatars)** | **JS-Assisted Row-First Column Distribution** | Guarantees left-to-right DOM tab order matching visual scanning order. |
| **Modern Browser Progressive Enhancement** | **Native CSS Grid Masonry + Fallback** | Use `@supports (grid-template-rows: masonry)` for native performance, falling back to JS distribution. |
| **Fixed Card Aspect Ratios** | **Standard CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(...)))`** | Do not use masonry if aspect ratios are uniform; standard CSS grid handles uniform cards cleaner. |

### Column Count & Gutter Matrix

| Viewport Width | Column Count | Gutter / Gap Size | Card Padding |
| :--- | :--- | :--- | :--- |
| `< 600px` | 1 Column | 16px | 16px |
| `600px - 899px` | 2 Columns | 16px - 20px | 16px |
| `900px - 1199px` | 3 Columns | 20px - 24px | 20px |
| `1200px - 1599px` | 4 Columns | 24px | 20px |
| `1600px+` | 5-6 Columns | 24px - 32px | 24px |

---

## Constraints

- **Accessibility (WCAG 2.2 AA):**
  - **SC 1.3.2 Meaningful Sequence:** The visual presentation order must match the logical reading and DOM order for assistive technology users.
  - **SC 2.4.7 Focus Visible:** Interactive items in masonry cards must provide high-contrast, unclipped focus indicators.
  - **SC 2.5.8 Target Size (Minimum):** All interactive buttons, badges, and link cards inside masonry blocks must provide minimum target sizes of `24x24px` (desktop) and `44x44px` (touch).
  - **SC 1.4.3 Contrast (Minimum):** All text over card backgrounds must maintain at least a **4.5:1** contrast ratio.
- **Layout Shift Prevention:** Aspect ratio or height attributes must be defined for all media elements to avoid Cumulative Layout Shift (CLS) during loading.
- **Overflow Containment:** Parent containers must handle focus rings without clipping or forcing horizontal scrollbars (`overflow-x: hidden`).

---

## Common Failure Patterns

- **Vertical Focus Jumping (CSS Multi-Column Tab Trap):** Using standard CSS multi-column layouts for interactive cards, causing keyboard focus to jump straight down column 1 to the bottom of the page before jumping to the top of column 2.
- **Cumulative Layout Shift (CLS) Surge:** Loading images into masonry cards without defining aspect ratios or height placeholders, causing cards to collapse and continuously reflow during image load.
- **Unequal Column Heights (Bottom Jagged Edge):** Naively appending items sequentially to columns (Col 1, Col 2, Col 3) regardless of card height, leaving one column significantly longer than others.
- **Clipped Focus Ring Indicators:** Applying `overflow: hidden` on column containers or card items, cutting off `:focus-visible` outline rings for keyboard users.
- **Mobile Squeezing:** Forcing 2 or 3 columns on small mobile screens, causing text inside cards to break into illegible single-word wraps.

---

## Validation Criteria

- [ ] Multi-column layout packs variable-height cards tightly without awkward vertical gaps under shorter cards.
- [ ] Media elements declare explicit aspect ratios (`aspect-ratio: W / H`) or height dimensions to prevent Cumulative Layout Shift (CLS).
- [ ] Keyboard navigation (`Tab` key) moves logically left-to-right, top-to-bottom across masonry columns, matching visual reading sequence.
- [ ] Interactive cards display unclipped, high-contrast `:focus-visible` rings meeting WCAG 2.2 AA standards.
- [ ] Layout scales gracefully down to 1 column on mobile viewports (< 600px) with no horizontal scroll.
- [ ] Text inside masonry cards satisfies WCAG AA minimum 4.5:1 contrast against card background surfaces.
- [ ] Shortest-column positioning math is applied when placing cards, preventing extreme height discrepancies at the bottom of the grid.
