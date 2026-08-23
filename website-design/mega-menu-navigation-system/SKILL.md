---
name: mega-menu-navigation-system
description:
  Design and implement high-density, multi-column 2D navigation dropdown panels
  (mega menus) for complex e-commerce, enterprise SaaS, and content portals
  with proper spatial composition, keyboard accessibility, and hover intent
  management.
---

# Mega Menu Navigation System

## Purpose

The Mega Menu Navigation System provides a systematic visual, structural, and interaction framework for high-density, multi-column 2D dropdown panels. When websites grow beyond simple 1D linear navigation lists, a mega menu exposes structured levels of content, categorized product hierarchies, feature showcases, callouts, and featured promotional cards within a single expandable view.

Operating as a critical architectural gateway for enterprise platforms, large-scale e-commerce stores, and content hubs, a mega menu resolves key navigation friction points: hidden deep links, erratic hover dropouts (the "mouse diagonal movement trap"), inaccessible keyboard traversal, chaotic multi-column layouts, and poor responsive adaptation on touch viewports.

## Use Cases

- **Enterprise SaaS & B2B Platforms:** Organizing complex product ecosystems (e.g., Products, Solutions by Industry, Platform Features, Resources, Customer Stories) into distinct thematic columns with promotional cards.
- **Large-Scale E-commerce Catalogs:** Displaying multi-level product taxonomies (e.g., Category -> Subcategory -> Featured Collections & Top Brands) with rich visual thumbnails and badge highlights.
- **University & Knowledge Portals:** Grouping administrative departments, academic faculties, student portals, and research directories in high-density categorized panels.
- **Publisher & Media Hubs:** Navigating across multiple editorial verticals, featured video series, trending tags, and newsletter subscription triggers.

## When NOT to Use

- **Small to Medium Sites (< 10 total pages):** For flat or shallow information architectures, use `site-navigation-system` or `breadcrumb-wayfinding-system`.
- **In-App Tool Navigation:** For dynamic SaaS application toolbars or workspace tools, use `sidebar-navigation-system` or `command-palette-system`.
- **Sequential Multi-Step Workflows:** For linear task progression (e.g., multi-step checkout or onboarding wizard), use `step-progress-system` or `onboarding-tour-system`.
- **Linear Reading In-Page Navigation:** For jumping to sections within an active article or document, use `table-of-contents-system`.

## Inputs

1. **Information Architecture (IA):** Categorized tree structure (Parent Trigger -> Column Groupings -> Child Links -> Description/Badge Metadata).
2. **Design Tokens:** Global typography scale, spacing tokens (`gap`, `padding`), background fills, border radii, shadow elevations, and accent color palette.
3. **Promotional Asset Content:** Image aspect ratios, titles, subtext, and CTA button labels for featured cards inside the panel.
4. **Interaction Specifications:** Hover intent timing thresholds (delay-in, delay-out, cursor path buffer geometry) and focus management strategy.
5. **Breakpoint Boundaries:** Viewport thresholds defining when desktop 2D panels transition to mobile multi-level drilldown drawers or accordions.

## Outputs

1. **Mega Menu Panel Geometry & Spatial Grid:** A 2D column layout spec (e.g., 3-column link matrix + 1-column featured promo card) with strict padding and gutter boundaries.
2. **Trigger-Panel Interaction System:** Hover intent buffer specs, focus management routing, keyboard control mapping, and escape behavior.
3. **Accessible Markup Architecture:** HTML structural template with full ARIA semantics (`aria-expanded`, `aria-controls`, `aria-haspopup`, `role="navigation"`).
4. **Responsive Mobile Adaptation Strategy:** Conversion specification for translating desktop mega panels into touch-optimized drilldown panels or nested accordions.

---

## Workflow

### 1. Structure the Spatial Grid (2D Column Composition)
A mega menu panel must balance information density with high visual scannability. Design the dropdown panel as a structured grid container aligned directly to the primary navigation bar or full viewport width:
- **Container Geometry:** Position the panel absolutely relative to the primary navigation header or header container (`top: 100%`). Use full-width (`width: 100%` within max container bounds e.g., `1200px` or full viewport overlay) with generous internal padding (e.g., `padding: 24px 32px` or `var(--space-l)`).
- **Column Allocation Modes:**
  - *Standard 4-Column Layout (3 Links + 1 Promo):* 3 columns dedicated to link groupings (each 22–25% width) + 1 column reserved for a featured promotional card or quick CTA block (25–30% width).
  - *Categorized 3-Column Matrix:* 3 equal columns for high-density category lists with category headings, sub-links, and descriptions.
  - *Master-Detail Split Panel:* Left sidebar column (20–25% width) containing vertical category tabs, driving content in a dynamic right display panel (75–80% width).
- **Gutter and Spacing Scale:** Maintain a strict fluid gap between columns (`gap: 24px` to `32px`) to ensure distinct visual separation without fragmentation.

### 2. Design Content Anatomy within Columns
Each column represents a distinct semantic grouping. Organize elements hierarchy-first:
- **Column Header / Section Title:** Use clear visual distinction for group headings (e.g., uppercase/bold, `font-size: 0.875rem`, `letter-spacing: 0.05em`, muted brand color).
- **Link Item Row Anatomy:**
  - *Title:* Primary label, high-contrast text (`4.5:1` minimum).
  - *Icon / Badge (Optional):* Leading 20x20px icon or trailing inline badge (e.g., "New", "Beta", "Popular").
  - *Description (Optional):* Muted supporting text (1–2 lines, `font-size: 0.8125rem`, color with `4.5:1` contrast) explaining the destination.
- **Featured Promotional Card Anatomy:**
  - Highlighting high-value conversion targets (e.g., new feature release, ebook, demo request).
  - Structured with visual thumbnail (`aspect-ratio: 16/9`), bold headline, concise copy, and styled button/link CTA. Card background should use a subtle tint or surface contrast (`background: var(--surface-subtle)`).

### 3. Implement Hover Intent & Cursor Traversal Protection
The "mouse diagonal movement trap" occurs when a user moves their mouse diagonally from a menu trigger toward a link in the mega panel, accidentally passing over adjacent triggers and prematurely closing the menu.
- **Hover Intent Buffers:**
  - *Delay Thresholds:* Apply a minimum hover delay (`150ms–200ms`) before opening a menu, preventing flickering when cursors quickly sweep across the nav bar.
  - *Exit Grace Period:* Maintain panel open state for `200ms–300ms` after cursor leaves the trigger/panel boundary.
- **Safe Hover Geometry (Aiming Triangle):**
  - Implement a dynamic directional buffer polygon (aiming triangle) originating from the active trigger position to the top and bottom corners of the open mega menu panel.
  - As long as the mouse pointer moves within this triangular boundary, ignore hover state transitions over sibling navigation triggers.

### 4. Build Accessible Keyboard Navigation & ARIA Logic
A mega menu must be 100% operable via keyboard and fully intelligible to assistive technology:
- **Trigger SEMANTICS:**
  - Use HTML `<button>` elements for triggers that open panels, NOT plain `<a>` tags or `<div>`s.
  - Set `aria-expanded="true|false"` dynamically based on panel state.
  - Set `aria-controls="mega-panel-[id]"` pointing to the corresponding panel container ID.
  - Set `aria-haspopup="true"` (or `aria-haspopup="dialog"` / `aria-haspopup="menu"` depending on internal roles).
- **Keyboard Traversal Patterns:**
  - `Tab`: Focuses next trigger in the header bar when menu is closed. When menu is open, moves focus into the open mega menu panel sequentially across links.
  - `Escape`: Instantly closes any open mega menu panel and returns focus to the parent trigger button.
  - `Arrow Keys (Left/Right)`: Navigates between top-level primary header triggers.
  - `Arrow Keys (Down/Up)`: Navigates top-to-bottom through links within the open mega panel column.

### 5. Define Responsive Mobile Adaptation Strategy
Desktop multi-column mega panels cannot fit horizontally on mobile screens (< 768px/1024px).
- **Mobile Drilldown Drawer Pattern (Recommended):**
  - Translate the desktop header into a sliding mobile drawer (`100vw` or `320px–400px` fixed slide-out).
  - Use a multi-level sliding panel stack: tapping a primary trigger slides the drawer to Level 2 (Category links) with a prominent "← Back" top button.
- **Accordion Stacking Alternative:**
  - Primary triggers collapse vertically into accordion headers. Tapping a trigger expands the column links inline beneath it.
  - Ensure touch targets meet at least **44x44px** for all mobile category triggers and links.

---

## Decision Rules

### Selection of Mega Menu Layout Patterns

| Architecture Type | Recommended Layout Pattern | Decision Criteria |
| :--- | :--- | :--- |
| **Enterprise SaaS (Products, Solutions, Resources)** | **3-Column Links + 1-Column Featured Card** | High need to feature top conversion assets (e.g. Case Studies, Demos) alongside product lists. |
| **Deep E-commerce (100+ Categories)** | **Master-Detail Split Panel (Tabbed Categories)** | Requires browsing dozens of subcategories without overloading vertical viewport height. |
| **Content Hub / Publisher** | **Categorized 3-Column Matrix + Bottom Banner** | Focuses on multi-vertical article categories with trending tag badges and newsletter bar. |
| **Utility-Heavy Platform (Dev Tools, API docs)** | **High-Density 4-Column Text Links with Badges** | Prioritizes direct link access and speed over visual promotional media. |

### Hover vs. Click Trigger Mechanics

| Trigger Behavior | Use Case Application | Design & Accessibility Rationale |
| :--- | :--- | :--- |
| **Hover with Intent Buffer + Click Support** | Desktop Web Portals, Enterprise SaaS | Provides fast, low-friction scanning for mouse users while keeping click/tap functionality for hybrid devices. |
| **Strict Click-To-Open Only** | Complex Dashboards, High-Density Web Apps | Eliminates accidental opening during rapid cursor movements; ideal for applications where viewport precision is critical. |
| **Touch Tap Toggle** | Mobile & Tablet Viewports | Mouse hover events do not exist on touch viewports; tap must explicitly toggle open state or drill down. |

---

## Constraints

- **Accessibility (WCAG 2.2 AA Minimum):**
  - **SC 2.4.7 Focus Visible:** Visible, unclipped high-contrast focus rings (`2px` solid accent with offset) around all triggers, sub-links, and promotional CTA buttons.
  - **SC 2.4.11 Focus Not Obscured:** Mega menu panels must never obscure the active focus indicator of the trigger button when navigating backward.
  - **SC 2.5.8 Target Size:** All touch targets within mobile drawers and desktop links must be a minimum of **24x24px** (desktop) and **44x44px** (mobile).
  - **SC 1.4.3 Contrast:** Link titles must maintain at least `4.5:1` contrast against panel backgrounds; secondary descriptive copy must also meet `4.5:1`.
- **Viewport Bounds Containment:** Mega menu panels must never create horizontal scrolling on the page (`overflow-x: hidden` on viewport bounds) or bleed past edge boundaries.
- **Dynamic Z-Index Stacking:** Mega menus must use a clear z-index layer scale (e.g., `z-index: 1000`) above hero elements, sticky headers, and page content, but below modal dialogs and toasts.

---

## Common Failure Patterns

- **The Mouse Trap (No Hover Intent):** Closing the mega panel the instant the cursor leaves a strict straight line, frustrating users trying to move diagonally to links.
- **The Keyboard Black Hole:** Opening a mega panel visually on hover, but failing to allow keyboard `Tab` focus to enter the panel, making deep links inaccessible to screen reader and keyboard users.
- **The Non-Semantic Anchor Trigger:** Using `<a href="/products">` as a mega menu toggle without ARIA attributes, causing screen readers to announce it as a simple link rather than an expandable menu button.
- **The Viewport Bleed:** hardcoding fixed pixel widths (e.g. `1200px`) on the mega panel on medium desktop screens (e.g., `1024px`), causing horizontal scrollbars.
- **Mobile Desktop-Panel Squeezing:** Shrinking desktop 4-column mega panels onto mobile screens, forcing unreadable text and microscopic tap targets.

---

## Validation Criteria

- [ ] **Structured 2D Spatial Grid:** Mega menu panel uses a clear multi-column layout with explicit padding, column gaps, and optional promotional card container.
- [ ] **Accessible Button Triggers:** Top-level triggers utilize `<button>` elements with `aria-expanded`, `aria-controls`, and `aria-haspopup` attributes.
- [ ] **Keyboard Navigable:** Full keyboard support enabling sequential `Tab` traversal into the panel, `Escape` key close, and returning focus to parent triggers.
- [ ] **Hover Intent & Safe Buffer:** Implemented hover delay (`150ms–200ms`) and exit grace period (`200ms–300ms`) or safe cursor geometry buffer.
- [ ] **Mobile Stacking/Drilldown:** Converts cleanly to a mobile-optimized drawer with drilldown panels or vertical accordions on screens < 768px.
- [ ] **Contrast AA Compliance:** All text (link titles, category headings, supporting descriptions) meets at least `4.5:1` contrast against the panel background.
- [ ] **Unobscured Focus Rings:** Every focusable link and button inside the mega menu has an active, visible, high-contrast focus indicator.
