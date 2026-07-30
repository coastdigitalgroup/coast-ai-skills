---
name: bento-grid-layout-system
description:
  Design and implement a systematic, asymmetrical bento-grid layout framework
  to organize diverse content types cohesively while maintaining strict visual
  hierarchy, logical focus order, and responsive flexibility.
---

# Bento Grid Layout System

## Purpose

The Bento Grid Layout System provides a methodology for organizing disparate content (such as key performance metrics, visual illustrations, interactive widgets, quotes, and product feature teasers) into a unified, modular grid. Inspired by traditional Japanese bento boxes, it establishes an asymmetrical balance across varying cell heights and widths. This system solves the design problem of visual fragmentation on dashboards, landing pages, and portfolios by enforcing strict proportional rules, consistent internal padding, and structured typography scales. It transforms what could easily become a chaotic layout into a polished, scannable, and accessible visual hierarchy.

## Use Cases

- **SaaS Feature Showcases:** Presenting a diverse mix of product capabilities, performance statistics, system integrations, and interactive UI previews on a single landing page section.
- **Data & Metric Dashboards:** Grouping key performance indicators (KPIs), charts, and operational summaries in high-density visual blocks.
- **Portfolios and Case Studies:** Showcasing creative works, project images, client quotes, and design workflows in a dynamic, non-linear presentation.
- **E-commerce Collections:** Highlighting featured products, limited-time collections, promotional banners, and social proof in a high-impact, editorial layout.

## When NOT to Use

- **Uniform Content Lists:** If the page comprises identical repeating elements (e.g., standard blog post listings or product grids), use `card-ui-system` or `responsive-grid-system`.
- **Purely Hierarchical Storytelling:** For layouts that depend on a linear, sequential narrative (e.g., "Step 1, Step 2, Step 3"), use `step-progress-system` or `section-composition-system`.
- **Complex High-Volume Tabular Data:** If users need to compare exact technical values or read rows of alphanumeric data, use `data-table-ui-system`.
- **Content-Driven Articles:** For editorial pages where the core focus is uninterrupted, flowing text, use `article-layout-system`.

## Inputs

1. **Content Inventory & Priority:** A list of items to place in the bento grid, classified by hierarchy (1 Core Hero, 2-3 Supporting, 2-4 Accents).
2. **Visual Asset Taxonomy:** The type of asset in each cell (static image, animated illustration, interactive slider, plain text, numeric metric).
3. **Target Columns & Breakpoints:** Desktop column system (typically a 4-column master grid), tablet adaptation (typically 2 columns), and mobile stacking rules.
4. **Fluid Spacing Scale:** Fluid margin and padding tokens for gutters and internal cell layouts (from `fluid-spacing-system`).
5. **Brand Design Tokens:** Typography scale, border radii, border styles, background fill scales, and elevation tokens (from `elevation-and-depth-system` and `fluid-typography-system`).

## Outputs

1. **Bento Grid Geometry Map:** A proportional coordinate blueprint specifying column spans (`grid-column: span X`) and row spans (`grid-row: span Y`) for each cell.
2. **Internal Card Anatomy Specs:** Rules for structural spacing, content nesting, and alignment within different cell aspect ratios.
3. **DOM Ordering & Accessibility Map:** A logical tab sequence showing how the HTML source structure maintains accessibility across irregular visual positions.
4. **Responsive Stacking Plan:** Precise transition specifications showing how the asymmetrical grid simplifies down to tablet and mobile screens.

---

## Workflow

### 1. Establish the Grid Geometry and Columns
Start by defining the underlying coordinate grid.
- **Master Grid Structure:** Standardize on a **4-column CSS grid** for desktop layouts (1200px+). This provides excellent mathematical factors for cell widths (1/4, 2/4, 3/4, or 4/4 widths).
- **Asymmetric Track Heights:** Set the height of rows explicitly or use `grid-auto-rows: minmax(180px, auto)` to establish a square or horizontal rectangular proportional base (aspect ratio 1:1 or 2:1 per unit).
- **Fluid Gutters:** Use a fluid spacing token for the grid gap (e.g., `gap: clamp(16px, 2vw, 24px)`) to keep cells visually separated but tightly bound.

### 2. Map and Allocate Content by Visual Hierarchy
Do not scatter items randomly. Classify each cell into one of three structural tiers:
- **The Core Hero Cell (Spans 2x2 or 3x2 tracks):** Takes up approximately 40–50% of the grid area. Hosts the most important visual asset, video, or metric. It dictates the visual entry point of the entire section.
- **Supporting Cells (Span 2x1 or 1x2 tracks):** Highlight intermediate features or key statistics. They are taller or wider than basic blocks to accommodate structured text alongside a graphic.
- **Accent Cells (Span 1x1 tracks):** Reserved for small visual elements, simple single-value metrics, icons, or badges. They round out the grid to maintain rectangular containment.

### 3. Design the Inner Anatomy of a Bento Cell
Apply strict internal spacing constraints to keep cells cohesive:
- **Unified Padding:** Apply consistent internal padding across all cells, typically a fluid padding token (e.g., `padding: var(--space-m)`). Exception: Accent cells (1x1) can use slightly tighter padding (`--space-s`).
- **Inner Alignment Modes:** Use flexbox (`display: flex; flex-direction: column; justify-content: space-between`) inside cells to vertically align text blocks to the top and visual accents (metrics, graphics) to the bottom.
- **Background and Borders:** Standardize on a uniform border-radius (e.g., `border-radius: 16px` to `24px`) across all cells. Use a subtle background fill (e.g., a neutral tint, translucent glassmorphism backdrop, or low-contrast card surface) to establish distinct card boundaries.

### 4. Organize DOM Ordering for Keyboard and Screen Reader Accessibility
Irregular grid layouts can cause a mismatch between visual reading order and physical DOM order.
- **Natural Reading Flow:** Sequence the elements in the HTML document in a logical left-to-right, top-to-bottom order as they would read.
- **Avoid Order Modification:** Never use `order` in CSS or position cells arbitrarily in a way that skips focusable elements. If cell 1 sits top-left and cell 2 sits top-right, they must appear in that sequence in the DOM, even if CSS Grid layout spans them differently.
- **Semantic Headings:** Give each content-heavy cell a clear, descriptive heading tag (typically `<h3>` or `<h4>`), matching the outline of the parent section’s `<h2>`.

### 5. Define Responsive Stacking and Breakpoints
Ensure the grid gracefully handles viewport scaling:
- **Desktop (1200px+):** 4-column layout. Asymmetrical column and row spans.
- **Tablet (768px - 1199px):** Shift to a **2-column grid**. Re-map spans so cells that were 1x1 span 1 column, and 2x1 cells span both columns (2 columns full-width).
- **Mobile (below 767px):** Collapse the grid entirely into a **1-column vertical stack** (`grid-template-columns: 1fr`). Remove explicit row heights (`grid-auto-rows: auto`) and let elements flow naturally, with height determined by internal padding and content size.

---

## Decision Rules

### When to span Columns vs. Rows

| Item Content Type | Span Decision Rule | Recommended Desktop Geometry |
| :--- | :--- | :--- |
| **High-Impact Metric / Main Feature** | Span both columns and rows to create a focal center. | `grid-column: span 2; grid-row: span 2;` |
| **Wide Visuals / Timelines / Charts** | Span columns horizontally; keep height at 1 row to draw eyes horizontally. | `grid-column: span 2; grid-row: span 1;` |
| **Long Text List / Tall Images** | Span rows vertically; keep width to 1 column to draw eyes down. | `grid-column: span 1; grid-row: span 2;` |
| **Single Metrics / Badges / Icons** | Do not span. Keep as standard square block. | `grid-column: span 1; grid-row: span 1;` |

### Typography Scaling in Bento Cells
- **Adaptive Sizing:** Do not use the same typography size for all cards. Keep the typography scale proportional to the card size.
- **Hero Card:** Use `font-size: clamp(1.5rem, 4cqi, 2.25rem)` (using container query units `cqi` if supported) for headlines.
- **Accent Card (1x1):** Limit headline to `font-size: clamp(1rem, 2.5cqi, 1.25rem)` and keep descriptions brief (max 2 lines) or omit descriptions entirely in favor of an icon + metric.

### Content Containment vs. Bleeding
- **Contained Layout:** Place content entirely inside card padding with a minimum of `16px` breathing room between text and borders. Best for text-heavy, informational cards.
- **Bleed Layout:** Let visual elements (product screenshots, detailed 3D mockups, complex charts) bleed out to the bottom and/or right edges of the card, masking overflow (`overflow: hidden` on the cell). The text remains padded and readable at the top. Use this for the Core Hero and supporting visual cards.

---

## Constraints

- **Focus Visibility (WCAG 2.2 SC 2.4.11 / 2.4.13):** If any cell is focusable (e.g., acts as a large link card), it must have an explicit, high-contrast `:focus-visible` outline. Focus indicators must never be clipped by the parent grid's container or card boundaries.
- **Touch Targets (WCAG 2.2 SC 2.5.8):** All interactive elements within bento cells (buttons, expand toggles, sliders) must have a minimum target size of `24x24px` with sufficient surrounding spacing, preferring `44x44px` for mobile triggers.
- **Reading Order Alignment (WCAG 2.1 SC 1.3.2):** The sequence of content as parsed by screen readers must match the semantic meaning and visual sequence of the bento grid. The top-left cell must always appear before bottom-right cells in the source DOM.
- **Contrast Ratios (WCAG AA):** All text within bento cards must meet a minimum contrast of `4.5:1` against the card's background. Avoid using low-contrast subtle grays for descriptions inside tinted cards.

---

## Common Failure Patterns

- **The "Visual Junk Drawer" Effect:** Shoving arbitrary elements into a bento grid just because they fit. Every cell must serve a cohesive storytelling purpose for the parent page.
- **DOM-Visual Disconnect:** Laying out cards visually in one order while leaving them in a completely different sequence in the HTML. Screen reader and keyboard tab navigation jump chaotically around the grid.
- **The Mobile Layout Explosion:** Keeping hardcoded column spans on mobile screens, which forces the cards to shrink, causing text to overflow and become completely unreadable.
- **Excessive Border Radii Clashing:** Using a massive border-radius on cards while keeping tiny, sharp margins, or nesting inner elements with border-radii that don't match the outer card's concentric corner curve.
- **Lack of a Focal Anchor:** Creating a grid where all cells are the exact same size (e.g., all 1x1 or all 2x1), which eliminates the entry point of the layout and causes scanning fatigue.

---

## Validation Criteria

- [ ] **Unified Geometry:** The grid uses an underlying, consistent coordinate framework (ideally a 4-column layout on desktop) with uniform gutters.
- [ ] **Clear Hierarchy:** A single "Hero" block is visually dominant and establishes a clear layout entry point.
- [ ] **Natural Tab Order:** Tabbing through the grid elements moves predictably left-to-right, top-to-bottom, matching the visual layout.
- [ ] **Mobile Stackability:** The layout shifts cleanly to a single-column stack on mobile viewports (< 768px) with no horizontal overflow.
- [ ] **Internal Spacing Consistency:** Cell padding is identical across all similar cards, with uniform vertical alignment of elements.
- [ ] **Contrast AA Compliance:** Contrast ratios for all text blocks and status indicators inside every card meet at least the 4.5:1 WCAG AA standard.
- [ ] **Interactive Safety:** Tap targets for all widgets inside bento cards meet the WCAG 2.2 24x24px floor.
