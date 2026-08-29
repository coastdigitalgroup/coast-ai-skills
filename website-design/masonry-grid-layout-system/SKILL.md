---
name: masonry-grid-layout-system
description:
  Design a systematic, multi-column masonry grid layout framework to pack variable-height
  content cards tightly without vertical gaps while maintaining strict visual hierarchy,
  logical reading and focus order, and WCAG AA accessibility.
---

# Masonry Grid Layout System

## Purpose

The Masonry Grid Layout System provides a systematic design framework for arranging variable-height content elements (such as portfolio items, user-generated image feeds, customer testimonials, product showcases, and pinboards) into multi-column vertical stacks without awkward white space gaps. Standard CSS Grid and Flexbox layouts enforce uniform row heights or line wraps, which creates large empty spaces when elements have varying aspect ratios or text lengths.

Designing an effective masonry layout requires solving critical layout challenges: balancing column distributions, preventing layout shifts (CLS) when dynamic media loads, choosing between CSS multi-column layouts, JavaScript positioning algorithms, and CSS Grid row-spanning techniques, and guaranteeing that the visual layout matches the DOM reading sequence and keyboard tab order (WCAG 2.1 SC 1.3.2 and SC 2.1.1). This skill bridges visual composition, responsive layout engineering, and accessibility compliance.

## Use Cases

- **Creative & Design Portfolios:** Presenting a diverse mix of landscape imagery, portrait graphics, video previews, and case study excerpts without rigid cropping or uneven rows.
- **User-Generated Content (UGC) & Social Feeds:** Displaying community photo uploads, dynamic media posts, and social proof with varying text lengths and image aspect ratios.
- **E-Commerce Product Inspiration Boards:** Organizing product pinboards, lookbooks, and lifestyle media where items feature distinct visual orientations.
- **Customer Review & Testimonial Walls:** Packing short quotes, detailed feedback blocks, rating cards, and user badges into a dense, visually engaging grid.
- **Digital Asset Management (DAM) & Media Galleries:** Rendering multi-format media libraries (vector icons, photography, documents, UI components) in high-density browse views.

## When NOT to Use

- **Uniform Aspect Ratio Grids:** If all media items share identical aspect ratios (e.g., 1:1 square product catalogs or 16:9 video thumbnail grids), use `responsive-grid-system` or `card-ui-system`.
- **Asymmetrical Structured Dashboards:** For fixed feature spotlights or hero blocks requiring explicit 2x2 or 2x1 grid spans, use `bento-grid-layout-system`.
- **Strict Row/Column Tabular Data:** If users need to compare values side-by-side across matching row alignment, use `data-table-ui-system` or `comparison-matrix-system`.
- **Sequential Step-by-Step Narratives:** For content requiring strict linear horizontal reading order (e.g., "Step 1, Step 2, Step 3"), use `step-progress-system` or `timeline-activity-system`.

## Inputs

1. **Content Inventory & Card Type Taxonomy:** List of card types (image-only, image + title + description, text quote, interactive card) and their height variability range.
2. **Media Aspect Ratio Range:** Expected aspect ratios (e.g., 16:9 landscape to 9:16 portrait) and metadata availability (whether width/height dimensions are known prior to rendering).
3. **Responsive Breakpoint Matrix:** Target column count per device tier (e.g., 1 column on mobile, 2 on tablet, 3 on desktop, 4 on wide desktop).
4. **Spacing & Rhythm Tokens:** Fluid gutter width, container padding, card internal padding, and border radius tokens (from `fluid-spacing-system` and `elevation-and-depth-system`).
5. **Interactive Element Hierarchy:** Identification of focusable elements within cards (e.g., primary link, save/like button, expand modal trigger).

## Outputs

1. **Masonry Layout Architecture Spec:** Technical layout specification selecting the optimal rendering strategy (CSS Multi-Column with DOM ordering, JS Column Packing, or CSS Grid Row Spanning) based on layout requirements.
2. **Column & Gutter Coordinate Map:** Responsive breakpoint rules defining track counts, column gaps, and max container widths.
3. **Card Anatomy & CLS Mitigation Blueprint:** Card structure rules enforcing explicit aspect-ratio containment boxes or placeholder skeletons to eliminate layout shifts during media loading.
4. **Keyboard & DOM Sequence Map:** Structural DOM ordering diagram ensuring keyboard `Tab` flow moves predictably (left-to-right top-to-bottom across columns) rather than trapping focus vertically inside isolated columns.
5. **Responsive & Fallback Plan:** Media query specs and progressive enhancement fallbacks for legacy browsers or disabled JavaScript environments.

---

## Workflow

### 1. Evaluate and Select the Masonry Rendering Engine
Choose the implementation mechanism based on layout complexity, interactivity, and browser support:

- **Strategy A: CSS Multi-Column (`column-count`)**
  - *Mechanism:* Uses native CSS `column-count: 3; column-gap: 1.5rem;` and `break-inside: avoid;`.
  - *Pros:* Zero JavaScript required, lightweight, immediate browser rendering.
  - *Cons:* Arranges items vertically top-to-bottom inside column 1, then column 2. This breaks logical horizontal reading order and creates severe keyboard `Tab` sequence issues unless items are pre-sorted into column buckets in the DOM.
- **Strategy B: JavaScript Column-Packing Manager (Recommended for Interactive Feeds)**
  - *Mechanism:* Client-side script distributes elements into N column containers (or calculates absolute/grid positioning) by placing each new item into the shortest current column.
  - *Pros:* Perfect left-to-right visual order matching DOM focus sequence; handles dynamic height changes gracefully; prevents vertical tab sequence jumps.
  - *Cons:* Requires light runtime calculation on layout or window resize.
- **Strategy C: CSS Grid with Dynamic Row-Spanning**
  - *Mechanism:* Uses a fine-grained grid (`grid-auto-rows: 10px; gap: 16px;`) where JavaScript calculates `grid-row-end: span Math.ceil(height / 10)` for each item.
  - *Pros:* Native CSS Grid layout model; items remain in single DOM container.
  - *Cons:* Requires JavaScript measurement after images load or explicit height metadata.

### 2. Define Responsive Column Tracks and Fluid Gutters
Establish column scaling rules across standard viewports to maintain proportional density:
- **Mobile (< 640px):** Single column (`1fr`). Eliminates tight horizontal squeezing; cards flow in natural vertical order.
- **Tablet (640px – 1023px):** 2 columns (`repeat(2, 1fr)`). Gutter gap: `16px` (`var(--space-m)`).
- **Desktop (1024px – 1439px):** 3 columns (`repeat(3, 1fr)`). Gutter gap: `24px` (`var(--space-l)`).
- **Wide Desktop (≥ 1440px):** 4 columns (`repeat(4, 1fr)`). Maximum container width bounded to `1600px` with centered margins (`margin-inline: auto`).

### 3. Design Card Anatomy and Mitigate Layout Shifts (CLS)
Prevent cumulative layout shifts when images or external media load asynchronously:
- **Aspect Ratio Reservation:** If media dimensions are known (e.g., width 800px, height 1200px), apply CSS aspect ratio container (`aspect-ratio: 800 / 1200; width: 100%; background-color: var(--surface-muted);`).
- **Skeleton Placeholders:** Render lightweight skeleton gradient surfaces in un-rendered card containers during fetching (from `skeleton-state-system`).
- **Card Containment:** Set `overflow: hidden; border-radius: var(--radius-l); background: var(--surface-card); border: 1px solid var(--border-subtle);` to ensure clean visual separation between packed cards.
- **Typography & Content Area:** Enforce explicit line-clamp limits for text descriptions (`display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;`) to prevent unexpected card height explosions.

### 4. Reconcile Visual Order with DOM Focus Sequence (WCAG AA)
Enforce strict keyboard navigation parity:
- **Left-to-Right DOM Ordering:** When using JS Column-Packing or CSS Grid, insert items in left-to-right chronological order so that pressing `Tab` navigates row-wise across the screen rather than plunging straight down a single vertical column.
- **Multi-Column DOM Pre-Sorting:** If using CSS `column-count`, use JavaScript to re-bucket or order items into column containers (`Column 1`, `Column 2`, `Column 3`) such that `Tab` focus order visits Item 1 (Col 1 Top) -> Item 2 (Col 2 Top) -> Item 3 (Col 3 Top) -> Item 4 (Col 1 Middle).
- **Interactive Focus Rings:** Ensure all interactive cards or inner triggers (Like button, Share link, Tag pills) render an unclipped focus indicator (`outline: 3px solid var(--focus-ring); outline-offset: 2px; z-index: 2;`).

### 5. Implement Progressive Enhancement and Dynamic Infinite Loading
Ensure robustness under network delay or client script failure:
- **Fallback State:** In pure HTML/CSS without JavaScript, render a single-column layout or CSS `column-count` fallback so content remains fully accessible.
- **Resize Observer Integration:** Use `ResizeObserver` to monitor card dimension changes (e.g., when a user expands a card or dynamic text loads) and trigger a debounced re-pack calculation.
- **Infinite Scroll Append Ergonomics:** When appending new cards on scroll, calculate their target columns without re-layouting existing cards to prevent visual jarring or focus reset.

---

## Decision Rules

### Choosing the Masonry Strategy

| Criterion | CSS Multi-Column (`column-count`) | JS Column-Packing (Multi-Track Flex) | CSS Grid Dynamic Row Span |
| :--- | :--- | :--- | :--- |
| **Primary Dependency** | Pure CSS (Zero JS) | Lightweight JS (<2KB) | JS + CSS Grid |
| **Visual Reading Order** | Top-to-Bottom by Column | Left-to-Right, Top-to-Bottom | Left-to-Right, Top-to-Bottom |
| **Keyboard `Tab` Sequence** | Vertical column trap (unless DOM pre-sorted) | Logical row-wise order | Logical row-wise order |
| **Dynamic Height Resizing** | Automatic by CSS | Requires ResizeObserver callback | Requires ResizeObserver callback |
| **Best Used For** | Text-heavy column flows, static read-only blogs | Interactive feeds, UGC galleries, portfolios | High-density grids with known aspect ratios |

### Image Aspect Ratio Handling

- **Known Aspect Ratio (Pre-calculated):** Enforce `aspect-ratio: W / H` on the media wrapper element.
- **Unknown Aspect Ratio (Async Fetch):** Set a minimum container height (`min-height: 200px`) with a skeleton shimmer animation. Once the image `onload` event fires, calculate aspect ratio and transition image opacity (`opacity: 0` to `opacity: 1` over `200ms`).

---

## Constraints

- **Keyboard Focus Parity (WCAG 2.1 SC 1.3.2 Meaningful Sequence):** Visual order must match DOM order. Tabbing through interactive masonry cards must move in logical left-to-right, top-to-bottom spatial sequence.
- **Target Touch Area (WCAG 2.2 SC 2.5.8):** All clickable card overlays, close controls, share icons, and filter tags within masonry cards must provide a minimum touch target size of 24x24px, preferring 44x44px for mobile devices.
- **Focus Indicator Visibility (WCAG 2.2 SC 2.4.13):** Cards or buttons with `:focus-visible` must keep focus rings fully visible and un-clipped by parent column containers (`overflow: hidden` on parent must not clip focus outline).
- **Cumulative Layout Shift (CLS < 0.1):** Aspect ratios or skeleton placeholders must reserve spatial bounds before images load to prevent layout shifts during scroll or dynamic feed appending.
- **Contrast Ratios (WCAG AA):** Overlay text on media cards must maintain at least 4.5:1 contrast against the background image using permanent dark gradients or solid color backdrops.

---

## Common Failure Patterns

- **The Vertical Tab Trap:** Using pure CSS `column-count` without DOM re-ordering, causing keyboard focus to jump 2000px down column 1 before jumping back to the top of column 2.
- **Layout Shift Jitter (CLS Spike):** Rendering images without pre-defined aspect ratios or height placeholders, causing masonry cards to jump and recalculate positions repeatedly as images load.
- **Focus Indicator Clipping:** Applying `overflow: hidden` directly to column wrappers, which slices off 3px focus rings on card edges during keyboard navigation.
- **Unbounded Text Overflows:** Allowing dynamic user comments inside masonry cards without line-clamp constraints, resulting in 1500px tall cards that destroy column balance.
- **Jank on Window Resize:** Binding non-debounced layout re-calculations directly to the window `resize` event, causing main-thread stutter during viewport resizing.

---

## Validation Criteria

- [ ] Masonry grid packs variable-height cards tightly without vertical layout gaps.
- [ ] Keyboard navigation (`Tab` / `Shift+Tab`) follows a logical left-to-right spatial sequence across columns.
- [ ] Media cards reserve space using aspect-ratio or skeleton placeholders, achieving zero layout shift (CLS < 0.1) on load.
- [ ] Column counts adapt smoothly across mobile (1 col), tablet (2 col), desktop (3 col), and wide desktop (4 col) viewports.
- [ ] Focus indicators (`:focus-visible`) remain fully visible and unclipped on all focusable card elements.
- [ ] Text descriptions within cards implement explicit line clamps or max-height limits to preserve visual balance.
- [ ] Overlay text on media cards meets WCAG AA 4.5:1 minimum contrast ratio against background media.
