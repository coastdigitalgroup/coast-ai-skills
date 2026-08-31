---
name: split-screen-layout-system
description:
  Design and implement a systematic dual-panel split-screen layout framework for
  structuring asymmetric visual and interactive content, managing scroll behaviors,
  responsive mobile stacking, and WCAG AA accessibility.
---

# Split-Screen Layout System

## Purpose

The Split-Screen Layout System provides a structured design and implementation framework for dividing a viewport or major section into two distinct visual panes. It solves the design problem of presenting two primary content elements simultaneously—such as marketing storytelling alongside an interactive form, product preview media alongside detailed configuration controls, or high-impact imagery alongside structured text—without creating visual chaos or navigational confusion. By enforcing proportion guidelines, background contrast rules, scroll mechanics (independent, fixed, or synchronized), DOM-to-visual reading order alignment, and dynamic viewport handling (`min-height: 100dvh`), this system transforms dual-pane layouts into scannable, responsive, and fully accessible experiences.

## Use Cases

- **Authentication & Onboarding Portals:** Pairing rich brand imagery, social proof, or product feature teasers on one pane with login, registration, or multi-step onboarding forms on the other.
- **Product & Feature Showcases:** Displaying sticky high-resolution product renderings or interactive 3D models on one side while feature descriptions and pricing tiers scroll independently on the other.
- **Lead Capture & Demo Request Pages:** Placing a value proposition and customer logos on a dark visual pane next to a lead capture form on a light, high-contrast action pane.
- **Comparison & Dual-Tone Landing Sections:** Contrasting two distinct offerings (e.g., "For Creators" vs. "For Enterprises" or "Before" vs. "After") across dual high-contrast colored panels.
- **Checkout & Order Summary Views:** Separating customer detail forms on one pane from a persistent, scrolling order review card on the opposite pane.

## When NOT to Use

- **High-Density Data Grids:** When displaying multi-variable tabular data or complex dashboards, use `dashboard-layout-system` or `data-table-ui-system`.
- **Linear Reading Flow:** For standard articles, blog posts, or sequential narrative documentation, use `article-layout-system` or `section-composition-system`.
- **Modular Asymmetric Galleries:** When grouping 4+ distinct content types (metrics, badges, mini-charts, graphics), use `bento-grid-layout-system`.
- **Simple Center-Stacked Hero Sections:** For standard centered headlines and CTA stacks, use `hero-design-system`.

## Inputs

1. **Content Inventory & Panel Roles:** Identification of the Visual/Narrative Pane (imagery, video, marketing copy) and the Interactive/Primary Pane (form, controls, primary text).
2. **Proportion Strategy:** Spatial ratio selection based on content volume (50/50 balanced split, 60/40 dominant visual split, or 70/30 main content + contextual sidebar split).
3. **Scroll Mechanics Model:** Definition of scroll interactions (Full-Viewport Fixed Split, Sticky Docked Media Panel + Scrolling Content, or Dual Synchronized Scroll).
4. **Color & Theme Tokens:** Dual-panel color pairings (e.g., dark brand background for visual pane, clean light background for form pane) from `accessible-color-system`.
5. **Fluid Typography & Spacing Tokens:** Fluid margin, padding, and font-scale tokens from `fluid-spacing-system` and `fluid-typography-system`.

## Outputs

1. **Split-Screen Spatial Blueprint:** Proportional grid specification defining column widths, flex distributions, and gap tokens across breakpoints.
2. **Scrolling & Pinning Behavior Matrix:** Interaction specification for panel scroll limits, fixed vs. sticky positioning, and overflow containment.
3. **Responsive Stacking & DOM Order Blueprint:** Structural HTML sequence ensuring visual reading hierarchy matches keyboard focus order and screen reader semantics across desktop and mobile.
4. **Dual-Theme Accessibility Specification:** Contrast verification matrix and focus indicator rules ensuring both panels meet WCAG AA standards.

---

## Workflow

### 1. Define Panel Roles and Spatial Proportions
Establish the spatial distribution based on content density and primary user goal:
- **Balanced Split (50/50):** Equal visual weight for both panels. Ideal for login/signup portals, dual-offering landing pages, and head-to-head feature comparisons.
- **Media-Dominant Split (60/40 or 65/35):** The visual pane occupies 60% of the screen width to highlight immersive media, product demos, or illustrations, while the interactive pane occupies 40%.
- **Content-Dominant Split (40/60 or 30/70):** The visual/contextual panel acts as a slim sidebar, leaving 60–70% of the screen width for dense forms, checkout details, or multi-tab configurations.

### 2. Choose the Scrolling and Viewport Model
Select the appropriate scrolling mechanic based on content height and interaction flow:
- **Model A: Fixed Dual-Pane Viewport (100dvh).** Both panes are contained within `100dvh` (dynamic viewport height). Neither panel scrolls globally; individual panels handle internal overflow (`overflow-y: auto`) if needed. Best for authentication screens and single-screen forms.
- **Model B: Sticky Media Dock + Scrolling Content.** The visual pane remains fixed (`position: sticky; top: 0; height: 100vh`) while the adjacent content pane scrolls naturally with page scroll. Best for product feature breakdowns and long-form marketing pages.
- **Model C: Full Page Natural Split.** Both panels expand to content height and scroll together as a unified two-column block. Best for short section-level splits within a larger page layout.

### 3. Establish DOM Structure and Accessibility Order
Ensure that visual layout placement does not conflict with logical document flow:
- **Logical Source Sequence:** Place the primary content pane (e.g., the `<h1>` headline or primary form) first in the HTML DOM structure, even if CSS grid or flexbox displays it on the right side visually on desktop.
- **Landmark Regions:** Enclose the interactive/primary panel in `<main>` or `<section aria-labelledby="...">` and the supportive visual panel in `<aside>` or a presentation container (`aria-hidden="true"` if purely decorative).
- **Heading Hierarchy:** Ensure the main panel contains the primary heading (`<h1>` for full-page splits or `<h2>` for section splits). Supportive text in the visual panel must use lower-level headings or descriptive paragraphs.

### 4. Implement Responsive Mobile Stacking
Transform the dual-panel landscape view into a coherent single-column mobile stack:
- **Breakpoint Pivot:** Collapse the split layout into a single column at viewports below `992px` or `768px` using `grid-template-columns: 1fr` or `flex-direction: column`.
- **Mobile Panel Priority:**
  - *For Auth/Forms:* Stack the primary form panel on top (or immediately after a brief brand header) so users can interact without excessive scrolling.
  - *For Product Showcases:* Stack the visual media panel on top to establish visual context before the descriptive text.
- **Media Adaptation on Mobile:** On mobile, reduce fixed `100vh` sticky panels to compact fluid height blocks (e.g., `aspect-ratio: 16 / 9` or `max-height: 280px`) to prevent visual panels from hogging mobile screen height.

### 5. Apply Dual-Tone Color and Focus Systems
Ensure legibility and focus visibility across different panel background tones:
- **Background Contrast Rules:** When using contrasting panel colors (e.g., dark navy visual pane and white form pane), calculate WCAG AA contrast independently for each panel.
- **Focus Rings Across Boundaries:** Ensure interactive elements inside both panels have high-contrast focus rings. Use outline colors that contrast with their specific panel background (e.g., bright cyan or white focus ring on dark panel; dark indigo focus ring on light panel).

---

## Decision Rules

### Spatial Ratio Matrix

| Layout Intent | Visual Pane Width | Content/Form Pane Width | Recommended Use Case |
| :--- | :--- | :--- | :--- |
| **Balanced Dual Focus** | `50%` (`1fr`) | `50%` (`1fr`) | Sign-up / Sign-in portals, A/B choice pages, dual personas |
| **Immersive Media Showcase** | `60%` - `65%` | `35%` - `40%` | Interactive 3D product previews, video tours, design portfolios |
| **Dense Form / Checkout** | `30%` - `35%` | `65%` - `70%` | Multi-step checkout, complex onboarding, settings wizards |
| **Sticky Section Feature** | `50%` | `50%` | Long-page scrolling feature list with sticky illustration dock |

### Scrolling Model Selection

- **Use Model A (Fixed 100dvh):** When content on both panels fits within standard laptop screen height without page-level scrollbars (e.g., SaaS auth screen).
- **Use Model B (Sticky Media + Scrolling Text):** When the content panel is long (multiple screen heights) but the visual media should stay pinned in view as a reference.
- **Use Model C (Natural Full Page Scroll):** When both panels contain similar lengths of text or cards, and neither panel needs fixed positioning.

### Dynamic Viewport Rules
- **Always use `min-height: 100dvh` instead of `height: 100vh`** for full-screen split layouts to prevent bottom content clipping caused by dynamic browser chrome (mobile address bars) on iOS Safari and Android Chrome.

---

## Constraints

- **Accessibility (WCAG 2.2 AA):**
  - Text contrast must achieve at least `4.5:1` for body copy and `3:1` for large text across both panels.
  - Keyboard tab navigation order must follow logical reading order: top-to-bottom, left-to-right (or right-to-left in RTL languages).
  - Decorative background imagery in visual panels must use `aria-hidden="true"` or empty `alt=""` attributes.
- **Responsiveness & Touch Safety:**
  - All form controls and interactive triggers in both panels must maintain a touch target size of at least `44x44px` (or `24x24px` with `44x44px` target area per WCAG 2.2 SC 2.5.8).
  - Mobile viewports (< 768px) must never require horizontal scrolling (`overflow-x: hidden` at container level).
- **Motion & Scroll Control:**
  - Sticky media panels must respect `prefers-reduced-motion: reduce` by disabling sticky pinning or scroll-triggered animations if requested by user system settings.

---

## Common Failure Patterns

- **The "100vh Safari Cutoff":** Using `height: 100vh` on full-page splits, causing mobile address bars to obscure bottom form submit buttons or legal disclaimers.
- **Focus Disconnect / DOM Mismatch:** Ordering the visual column first in HTML DOM when it appears on the right visually, causing keyboard focus to jump unexpectedly across the screen.
- **Mobile Height Lock:** Keeping a fixed height or sticky position on the visual pane when stacked vertically on mobile, forcing users to scroll through a full screen of image before reaching the form.
- **Unreachable Overflow Content:** Setting `overflow: hidden` on a fixed 50/50 split container without handling internal panel overflow (`overflow-y: auto`), causing form fields or text to be permanently cut off on low-resolution displays (e.g., 1366x768 laptops).
- **Focus Indicator Disappearance:** Applying a single light-colored focus outline across the whole page, rendering focus invisible on the light-toned panel.

---

## Validation Criteria

- [ ] **Viewport Height Safety:** The layout uses `min-height: 100dvh` and allows content to overflow gracefully on smaller viewports.
- [ ] **DOM & Focus Alignment:** Tabbing through interactive elements moves sequentially without erratic jumps between left and right panels.
- [ ] **Mobile Stacking Integrity:** The layout transitions to a single-column stack below `768px` / `992px`, with the interactive form or primary content prioritized appropriately.
- [ ] **Independent Panel Accessibility:** Both panels meet WCAG AA contrast standards (`4.5:1` for text) on their respective background fills.
- [ ] **Sticky Dock Stability:** If using sticky media docking (Model B), media stays pinned correctly during content scroll without overlapping footer elements.
- [ ] **Touch Target Size:** All input fields, buttons, and toggles satisfy minimum target size requirements (min `44x44px` on touch devices).
