---
name: mega-menu-navigation-system
description:
  Design and implement a systematic, accessible, and responsive layout framework
  for organizing high-density, multi-column 2D navigation panels, hover intent
  buffers, featured promotional cards, and keyboard/screen-reader accessibility.
---

# Mega Menu Navigation System

## Purpose

The Mega Menu Navigation System skill provides a standardized framework for designing and structuring large-scale, two-dimensional dropdown panels (mega menus) used in enterprise SaaS, e-commerce, media hubs, and high-density content platforms.

Standard single-column dropdown menus fail when an application or website needs to expose deep information architecture, multi-category hierarchies, visual callouts, resource columns, or direct links without forcing users through multiple page reloads. A mega menu brings deep site architecture to the surface in a single, well-structured, accessible overlay, balancing high visual scannability with responsive adaptation and strict keyboard/screen reader compliance.

## Use Cases

- **Enterprise SaaS Products & Platforms:** Displaying multi-product suites, solutions by industry, developer platforms, and featured case studies within a "Products" or "Solutions" main navigation trigger.
- **E-Commerce & Digital Marketplaces:** Organizing deep product taxonomy (e.g., Department > Category > Subcategory) alongside promotional hero banners, sale badges, or seasonal collections.
- **Large Content Portals & Resource Hubs:** Categorizing documentation, guides, API references, community forums, and latest blog posts under a "Resources" header.
- **Global Enterprise Sites:** Consolidating multi-region, multi-brand, or multi-business unit navigation links into structured, categorized panels.

## When NOT to Use

- **Flat or Low-Density Sites (< 7 Primary Nav Items with Simple Hierarchy):** Use standard single-level dropdown menus or the `site-navigation-system`. Mega menus add unnecessary layout complexity when content density is low.
- **Utility-First Application Workspaces:** Web applications focused on task execution (e.g., document editors, code IDEs, data analysis dashboards) where vertical `sidebar-navigation-system` or compact `command-palette-system` interfaces are far more efficient.
- **Simple Linear Funnels:** Marketing micro-sites or landing pages designed for a single conversion action where extensive global navigation causes friction or drop-off.

## Inputs

1. **Information Architecture (IA) Taxonomy:** Multi-level tree structure of navigation categories, subcategories, and individual destination links.
2. **Promotional & Visual Highlights:** Secondary content items to feature within panels (e.g., featured blog posts, new product callouts, customer stories, promo cards).
3. **Viewport Breakpoints:** Responsive target thresholds (Desktop ≥ 1024px grid layout vs. Mobile < 1024px accordion/drill-down drawer).
4. **Brand Design System Tokens:** Spacing scales, color tokens, typography hierarchy, border-radius tokens, and elevation shadows.
5. **Accessibility Requirements:** Target WCAG level (AA/AAA), screen reader announce behaviors, focus indicator design, and hover/focus intent timings.

## Outputs

1. **Mega Panel Layout Specification:** Grid composition defining multi-column link groups, section headers, promotional hero slots, and utility baselines.
2. **Interaction & Intent Spec:** Timing parameters for hover open/close delays (e.g., 150ms open, 300ms close), pointer safe-path geometry (hover-intent triangle), and click/touch toggle behaviors.
3. **Keyboard & ARIA Architecture:** Full accessibility mapping (`role="menubar"`, `role="menu"`, `role="menuitem"`, or disclosure `aria-expanded` / `aria-controls` patterns, focus management, and Arrow/Esc key handling).
4. **Responsive Mobile Strategy Spec:** Structural transformation mapping the 2D desktop panel into a 1D mobile drawer with nested accordion or slide-over drill-down panels.

## Workflow

### 1. Analyze & Audit Content Density

Classify all destination links into structured visual tiers:

- **Primary Category Header:** Bold, non-clickable or direct category landing page link (e.g., "Platform Capabilities").
- **Secondary Link Items:** Scannable link items with optional concise description text (e.g., "Analytics — Real-time insights and custom dashboards").
- **Visual Badges & Status Indicators:** Contextual tags like "New", "Beta", or "Popular" adjacent to link labels.
- **Promotional / Featured Cards:** Rich media slots featuring images/illustrations, call-to-action buttons, or customer quotes.

### 2. Define the Desktop Grid Architecture

Structure the expanded panel using CSS Grid with clear proportional allocations:

```
+-----------------------------------------------------------------------------------+
|  PRIMARY TRIGGER: "Products & Solutions" [aria-expanded="true"]                    |
+-----------------------------------------------------------------------------------+
|  MEGA PANEL (Positioned absolute, full-width container or aligned container)      |
|                                                                                   |
|  +------------------+  +------------------+  +------------------+  +---------------+  |
|  | Column 1 (25%)    |  | Column 2 (25%)    |  | Column 3 (25%)    |  | Column 4 (25%)|  |
|  | Group Header A   |  | Group Header B   |  | Group Header C   |  | FEATURED CARD |  |
|  | - Link Item 1    |  | - Link Item 4    |  | - Link Item 7    |  | [ Image ]     |  |
|  | - Link Item 2    |  | - Link Item 5    |  | - Link Item 8    |  | Title         |  |
|  | - Link Item 3    |  | - Link Item 6    |  | - Link Item 9    |  | CTA Link ->   |  |
|  +------------------+  +------------------+  +------------------+  +---------------+  |
|                                                                                   |
|  +-------------------------------------------------------------------------------+  |
|  | PANEL FOOTER UTILITY STRIP (100% width): "Need custom Enterprise plans? Contact"|  |
|  +-------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

- **Proportional Column Allocations:**
  - **3-Column Layout:** 3 equal link columns (33% / 33% / 33%) OR 2 link columns + 1 wide promo card (28% / 28% / 44%).
  - **4-Column Layout:** 3 link columns + 1 promo card (22% / 22% / 22% / 34%) OR 4 link columns (25% each).
  - **5-Column / Asymmetric Layout:** 4 link columns + 1 promo card in a wide grid container (`max-width: 1280px`).
- **Vertical Alignment & Rhythm:**
  - Section headers must align on a single baseline across all columns.
  - Link item spacing should use consistent vertical padding (`8px` to `12px` touch-safe target height).

### 3. Establish Interaction & Hover-Intent Timing

Prevent accidental triggering and abrupt closing:

- **Open Delay (Hover Intent):** Require pointer hovering over trigger for `150ms` before expanding panel.
- **Close Delay (Buffer):** Maintain panel visibility for `250ms–300ms` when mouse exits the panel boundaries to prevent accidental dismissals.
- **Safe Path Geometry (Aim Triangle):** Implement a dynamic cursor trajectory buffer between the trigger and the expanded panel so moving diagonally toward the right column does not close the panel.
- **Click/Touch Override:** Pointer devices with touch capability or explicit click interactions immediately open/close the panel without delay.

### 4. Implement Keyboard Navigation & ARIA Disclosure Pattern

Follow the WAI-ARIA Disclosure or Navigation Menu pattern:

- **Top-Level Navigation Triggers:**
  - Render as `<button aria-expanded="false" aria-controls="mega-panel-products"> Products </button>`.
  - Pressing `Space` or `Enter` toggles `aria-expanded="true|false"`.
  - Pressing `Escape` closes the currently open mega panel and returns keyboard focus to the trigger button.
- **Focus Traversal & Scannability:**
  - Tab key moves focus linearly through all interactive links inside the open panel.
  - Ensure high-contrast focus rings (`:focus-visible`) with a minimum 2px solid outline and offset.
  - Non-interactive headers must use standard semantic typography (`<h3>` or `<p class="nav-section-title">`) with appropriate ARIA structure.

### 5. Adapt for Mobile Viewports (< 1024px)

Transform the 2D mega menu grid into an intuitive mobile drawer:

- **Pattern A: Multi-Level Accordions:** Top-level nav items expand vertically into collapsible accordion sections. Subcategory groups expand into nested accordions.
- **Pattern B: Slide-Over Drill-Down Panels:** Tapping a top-level item slides the entire drawer left to reveal a dedicated sub-panel with a visible "← Back to Main Menu" button.
- **Touch Target Compliance:** All link items and accordion headers must meet WCAG 2.2 SC 2.5.8 (minimum 24x24px, recommended 44x44px target size).

## Decision Rules

| Criterion | Single Dropdown | Standard 3-Column Mega Menu | Rich 4-Column Mega Menu with Promo |
| :--- | :--- | :--- | :--- |
| **Total Nav Links per Group** | 1 to 8 links | 9 to 20 links | 15 to 35+ links |
| **Hierarchy Depth** | 1 Sub-level | 2 Sub-levels | 2–3 Sub-levels + Promos |
| **Visual Content Included** | Icons + Text | Category Headers + Links | Badges, Descriptions, Promo Cards |
| **Max Panel Width** | `240px` – `320px` | `640px` – `800px` | `1024px` – `1280px` (or full bleed) |
| **Mobile Adaptation** | Flat vertical stack | Single-level accordion | Slide-over drill-down panel |

### Trigger Mechanics Selection Matrix

- **Default Web Recommendation (Hybrid Hover/Click):**
  - **Hover:** Opens panel after `150ms` hover delay + `300ms` exit delay buffer.
  - **Click on Trigger:** Toggles panel state immediately and navigates to parent landing page if applicable.
- **Keyboard Users:**
  - Trigger responds to `Enter`, `Space`, `Down Arrow` to open, `Escape` to close.

## Constraints

- **Accessibility (WCAG 2.1/2.2 AA):**
  - Text-to-background contrast ratio must meet at least **4.5:1** for regular link text and **3:1** for large section headers or bold text.
  - Focus rings must be visible against both panel background and global body color.
  - Panel container must have `id` matching `aria-controls` on the trigger button.
- **Viewport Bounds & Max Height:**
  - Max panel height should not exceed `80vh`.
  - If content overflows vertical viewport, the panel link container must support internal custom scrolling (`overflow-y: auto`) without cutting off focus outlines.
- **Layout Shift Prevention:**
  - Mega menu panel must be positioned using overlay mechanics (`position: absolute` or Popover API) to avoid shifting the main page content below the header.

## Common Failure Patterns

1. **The "Diagonal Pointer Dropout" (Missing Hover-Intent Buffer):** Users move the mouse diagonally from the top trigger button toward a link on the far right column, crossing outside the active trigger area and causing the panel to prematurely collapse.
2. **Horizontal Screen Overflow:** The mega menu panel extends beyond the right boundary of the viewport on medium screens (1024px–1280px), causing horizontal scrollbars or off-screen unclickable links.
3. **Keyboard Focus Trap or Focus Obscuration:** Keyboard users tab into the panel, but closing the panel leaves focus dangling or obscured behind non-interactive overlays.
4. **Mobile Layout Squishing:** Attempting to render multi-column CSS grid layouts on mobile screens instead of collapsing into vertical accordions or slide-over panels.
5. **Cognitive Overload (Unstructured Link Walls):** Grouping 30+ links without visual typography hierarchy, category headers, or icon anchors, making scannability impossible.

## Validation Criteria

- [ ] Frontmatter `name` matches directory name `mega-menu-navigation-system`.
- [ ] Top-level trigger buttons utilize proper ARIA disclosure attributes (`aria-expanded`, `aria-controls`, `aria-haspopup="true"`).
- [ ] Panel opens with `150ms` intent delay on hover and remains open for `250ms–300ms` buffer on pointer exit.
- [ ] Pressing `Escape` key closes open panel and returns focus to the active trigger button.
- [ ] Desktop panel uses clear multi-column CSS Grid layout (`3–4` columns) with distinct category headers and optional promo callout slots.
- [ ] Mobile viewports (< 1024px) gracefully transform panel into a touch-friendly accordion or drill-down slide panel.
- [ ] Minimum touch target sizes meet WCAG 2.2 requirements (≥ 24x24px, recommended 44x44px).
- [ ] All interactive text meets WCAG AA 4.5:1 color contrast ratio.
- [ ] Internal scrolling (`overflow-y: auto`) handles tall panels on short viewports (< 700px height).
