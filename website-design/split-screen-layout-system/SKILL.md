---
name: split-screen-layout-system
description:
  Design a standardized, responsive, and accessible design framework for structuring dual-panel web pages (50/50, 60/40, or visual/interactive splits), managing spatial composition, visual weight balance, background contrast transitions, responsive mobile stacking flow, DOM order priority, and WCAG AA accessibility compliance.
---

# Split-Screen Layout System

## Purpose

The Split-Screen Layout System establishes a systematic design framework for dual-panel web layouts that pair two distinct, complementary content experiences within a single viewport. Common in authentication flows, high-conversion landing pages, product configurators, and interactive checkout steps, split-screen designs allow websites to present an interactive element (e.g., a form, login widget, or custom control panel) alongside high-impact visual narrative assets (e.g., customer social proof, product demonstrations, brand imagery, or summary data).

Without a structured design system, dual-panel layouts suffer from severe UX and technical pitfalls: broken mobile stacking orders where primary forms are pushed below non-essential images, vertical scrollbar jitter caused by static `100vh` CSS units on mobile web browsers, accessibility traps where screen reader DOM order diverges from visual layout, and jarring background contrast jumps across panel seams. This skill provides a complete, implementation-ready protocol for designing balanced, responsive, and fully accessible split-screen layouts.

## Use Cases

- **Authentication & Account Creation Pages:** Pairing a primary login or sign-up form on one side with brand visual storytelling, testimonial cards, or product previews on the other.
- **Product Detail & Customizer Interfaces:** Combining a fixed interactive configuration control panel (selectors, add-to-cart, pricing) with a sticky or scrollable product visual showcase gallery.
- **E-Commerce Checkout & Order Review:** Displaying a multi-step checkout form alongside a sticky, collapsible order summary panel displaying line items and totals.
- **SaaS Hero & High-Intent Landing Pages:** Structuring hero sections with high-priority conversion copy and value propositions on one side, paired with an interactive product demo or live app preview on the other.
- **Comparison & Assessment Tools:** Presenting interactive input controls or diagnostic surveys on one panel, while real-time calculated recommendations update live on the adjacent panel.

## When NOT to Use

- **Multi-Pane Application Dashboards:** For complex web apps requiring 3+ collapsible sidebars, data tables, or multi-panel app workspaces, use `dashboard-layout-system`.
- **Master-Detail Data Views:** For email clients or list-and-item inspection interfaces, use `master-detail-layout-system`.
- **Asymmetrical Content Feature Grids:** For multi-cell grids displaying diverse marketing highlights in varying card sizes, use `bento-grid-layout-system`.
- **Single-Column Narrative Articles:** For long-form reading, documentation, or blog articles, use `article-layout-system`.

## Inputs

1. **Primary & Secondary Panel Content Architecture:** Definition of the interactive panel (form, controls, primary action) versus the supporting/visual panel (imagery, social proof, summary, demo).
2. **Split Ratio Strategy:** Desired proportion split based on content density: 50/50 (Balanced dual priority), 60/40 (Primary focus with supporting sidebar), or 40/60 (High-impact visual dominance).
3. **Scroll & Height Behavior Mode:** Choice between Unified Page Scroll, Independent Panel Scroll, or Viewport-Locked (No Scroll) modes.
4. **Brand Palette & Theme Contrast:** Color tokens for each panel, including surface fills, text tokens, and panel border/divider contrast levels.
5. **DOM Reading Order Priority:** Accessibility determination specifying which panel screen reader users must encounter first in the document tree.

## Outputs

1. **Dual-Panel Spatial Composition Grid Spec:** Detailed layout blueprint defining column split ratios, padding, gap specifications, and boundary dividers across breakpoints.
2. **Responsive Mobile Stacking Protocol:** Media query specifications governing how panels stack vertically on smaller screens (<768px), including visual panel suppression or sticky header conversion rules.
3. **Viewport Height & Scroll Management Rules:** CSS layout rules using dynamic viewport units (`100dvh`) and scroll container configurations to prevent mobile address bar jumping and double scrollbars.
4. **Accessibility & Landmark Tree Mapping:** Semantic HTML structure (`<main>`, `<section>`, `<aside>`), heading hierarchy (`<h1>` to `<h2>`), and focus navigation flow across split boundaries.
5. **Panel Seam Contrast & Theme Transition System:** Design rules governing high-contrast background transitions, border dividers, and dark/light theme splits.

---

## Workflow

### 1. Define Spatial Split Ratios and Visual Weight
Determine the proportional balance between the primary interactive panel and the supporting visual panel based on task intent:
- **50/50 Split (Balanced Dual Priority):**
  - Equal width distribution (`grid-template-columns: 1fr 1fr` or `50% 50%`).
  - Best for: Auth pages (Form vs Brand Testimonial), 2-option comparison screens.
- **60/40 Split (Primary Content Dominance):**
  - Primary panel occupies 60% width; supporting panel occupies 40% (`grid-template-columns: 3fr 2fr` or `60% 40%`).
  - Best for: Product customizers, complex forms with sticky order summaries.
- **40/60 Split (Visual Showcase Focus):**
  - Primary interactive control panel occupies 40% width; high-impact visual showcase occupies 60% (`grid-template-columns: 2fr 3fr` or `40% 60%`).
  - Best for: Portfolio showcases, immersive SaaS landing page hero sections.

### 2. Establish DOM Reading Order and Accessibility Hierarchy
Ensure screen readers and keyboard users navigate content in a logical task-oriented order, regardless of visual positioning:
- **DOM-First Rule:** Always place the primary actionable content panel (e.g., login form or primary value proposition) FIRST in the HTML DOM tree.
- **Visual Order Alignment:** If visual design dictates placing the primary form on the right panel on desktop screens:
  - Keep the form first in the HTML structure.
  - Use CSS Grid area placement or Flexbox order (`order: 2` for visual panel) on desktop media queries to position it visually on the right without altering DOM order.
- **Landmark Region Mapping:**
  - Wrap the primary content panel in `<main>` or `<section aria-labelledby="...">`.
  - Wrap the supporting visual/testimonial panel in `<aside>` or `<section>`.
- **Heading Hierarchy:** Maintain strict top-down heading structure. The main page title (`<h1>`) must reside in the primary panel; supporting panels must use subheadings (`<h2>`).

### 3. Configure Viewport Height and Scroll Architecture
Select and configure the appropriate height and scroll model based on screen size and content volume:
- **Unified Page Scroll Mode (Default & Universal):**
  - Both panels flow naturally as part of the overall page scroll.
  - Panel heights adapt to content. If one panel is longer, both stretch to equal height using CSS Grid/Flexbox stretch.
  - Ideal for pages with long forms or multiple scrolling content sections.
- **Viewport-Locked Split Mode (Desktop Standard for Auth/Hero):**
  - Layout is locked to full viewport height on desktop (`min-height: 100dvh; height: 100dvh; overflow: hidden;`).
  - Form panel scrolls independently internally (`overflow-y: auto`) if form height exceeds viewport height.
  - Visual panel remains fixed (`position: relative; overflow: hidden;`).
  - **Dynamic Viewport Units:** ALWAYS use `100dvh` (Dynamic Viewport Height) or `min-height: 100vh` with fallback to avoid mobile browser address bar layout jumps.

### 4. Design Responsive Stacking and Mobile Adaptation
A 2-column split layout cannot fit comfortably on mobile viewports (<768px). Define explicit mobile transition behavior:
- **Vertical Stacking Flow (<768px):**
  - Convert `grid-template-columns` from dual columns to single column (`100%`).
  - Primary panel appears FIRST vertically.
  - Visual/supporting panel stacks BELOW primary panel.
- **Visual Panel Suppression or Condensation:**
  - Heavy background images or redundant decorative graphics on the visual side should be hidden or condensed on mobile (`display: none` or reduced height) to save vertical scroll depth and data bandwidth.
  - Testimonial quotes or key social proof items can be repositioned into a compact badge above or below the primary form.

### 5. Establish Seam Contrast, Theme Transitions, and Border Dividers
Manage visual separation between the two panels to maintain visual hierarchy and brand consistency:
- **Contrast Seams:**
  - **Dark / Light Split:** Primary panel uses Light theme surface (`var(--surface-primary, #FFFFFF)`), visual panel uses Dark theme surface (`var(--surface-dark, #0F172A)`).
  - Ensure seam edge contrast is distinct. If surface colors are similar (e.g., both light gray/white), insert a explicit 1px subtle divider border (`border-right: 1px solid var(--border-subtle, #E2E8F0)`).
- **Text Contrast Verification:**
  - Verify all text elements on both panels independently pass WCAG AA contrast (4.5:1 for body text, 3:1 for large text) against their respective panel background colors.

---

## Decision Rules

### Choice of Split-Screen Ratio Matrix

| Ratio Split | Primary Panel Width | Secondary Panel Width | Primary Recommended Use Case |
| :--- | :--- | :--- | :--- |
| **50 / 50** | 50% | 50% | Authentication screens, sign-up forms, balanced 2-option comparisons. |
| **60 / 40** | 60% | 40% | Complex forms, multi-step checkout with sticky order summary sidebar. |
| **40 / 60** | 40% | 60% | Immersive landing pages, SaaS hero with interactive app preview/demo. |

### Choice of Scroll Architecture

| Scroll Mode | CSS Implementation | Behavior | Ideal Use Case |
| :--- | :--- | :--- | :--- |
| **Unified Page Scroll** | `display: grid; min-height: 100dvh;` | Page scrolls as a single unified document; panels stretch to equal height. | Long forms, mobile screens, content-heavy marketing pages. |
| **Viewport-Locked Split** | `height: 100dvh; overflow: hidden;` (Primary: `overflow-y: auto`) | Fullscreen presentation; interactive side scrolls internally if needed. | Desktop auth screens, quick single-step forms, app entry screens. |
| **Sticky Sidebar Split** | `align-items: start;` (Sidebar: `position: sticky; top: 0;`) | One panel scrolls naturally while adjacent panel stays fixed in view. | Product detail gallery + sticky buy box, long article + sticky TOC/CTA. |

---

## Constraints

- **Accessibility (WCAG 2.1 / 2.2 AA Compliance):**
  - **SC 1.3.2 Meaningful Sequence:** DOM tree structure must ensure primary actionable controls are exposed to assistive technology before optional background media or visual panel cards.
  - **SC 1.4.3 Visual Contrast:** Text in both light and dark panels must meet 4.5:1 minimum contrast.
  - **SC 2.4.7 Focus Visible:** Focused inputs and buttons across both panels must maintain unclipped, high-contrast focus rings (3:1 minimum against background).
  - **SC 2.1.1 Keyboard Accessibility:** Tabbing order must flow logically top-to-bottom through the primary panel before entering secondary interactive elements in the visual panel.
- **Viewport Height Bugs:** Never use static `height: 100vh` without `min-height` or dynamic `100dvh` fallbacks, as mobile browser address bar hide/show behavior causes layout distortion and vertical clipping.
- **Responsive Stacking Floor:** On screens under 768px, split-screen layouts MUST stack into a single column. Never force side-by-side columns on mobile devices.

---

## Common Failure Patterns

- **The Mobile Hidden Form Trap:** Placing decorative background imagery first in DOM order or CSS flex order, causing mobile users to scroll through screens of brand images before reaching the login inputs.
- **Static 100vh Mobile Scroll Truncation:** Locking layout to `100vh` on mobile, causing the submit button at the bottom of a form to be permanently clipped under the browser address bar.
- **Disoriented Focus Navigation:** Placing visual layout elements on the left visually while structuring them second in DOM order without proper focus order management, leading to confusing keyboard navigation jumps.
- **Jarring Seam Contrast Clash:** Placing two panels with low-contrast background fills side-by-side without a defining divider line or clear background contrast difference, making panels bleed together into an unstructured mess.
- **Double Scrollbar Syndrome:** Nested independent scrolling containers on both panels creating double vertical scrollbars on desktop browsers, causing user confusion and unintended scroll traps.

---

## Validation Criteria

- [ ] Split ratio (50/50, 60/40, or 40/60) matches content intent and remains balanced on desktop viewports (≥768px).
- [ ] On mobile viewports (<768px), layout transitions to a clean single-column vertical stack with primary actionable content listed first.
- [ ] Primary interactive panel is ordered first in HTML DOM tree, ensuring logical screen reader reading sequence and tab order.
- [ ] Uses dynamic viewport units (`100dvh` or `min-height: 100dvh`) to prevent mobile address bar clipping.
- [ ] All text, buttons, and form inputs in both panels meet WCAG AA contrast standards (4.5:1 for text, 3:1 for UI controls).
- [ ] Keyboard navigation (`Tab` / `Shift+Tab`) flows seamlessly without focus traps or unexpected focus jumps across panels.
- [ ] Decorative images in supporting panels use `alt=""` or `aria-hidden="true"` so screen readers bypass redundant visual graphics.
