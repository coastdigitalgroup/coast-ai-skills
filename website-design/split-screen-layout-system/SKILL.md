---
name: split-screen-layout-system
description:
  Design and structure responsive, accessible dual-panel split-screen layouts for hero sections, authentication flows, product feature showcases, and interactive tools, establishing spatial balance, responsive stacking order, independent panel scrolling, contrast boundaries, and WCAG AA accessibility.
---

# Split-Screen Layout System

## Purpose

The Split-Screen Layout System provides a standardized, responsive design framework for dual-panel web layouts. As websites present increasingly complex content—such as pairing interactive forms with branding visual art, combining code editors with live visual previews, or contrasting value propositions with interactive product demos—traditional single-column vertical flows often dilute user focus or create excessive vertical scrolling.

A split-screen layout divides the viewport into two primary visual regions (50/50, 60/40, or dynamic ratio split), allowing two distinct content items to maintain equal visual prominence or complementary hero-support relationships. This system solves the design challenges of managing spatial composition, visual weight balance, background contrast transitions, responsive mobile stacking flow, DOM order priority, and WCAG AA accessibility across variable screen widths.

## Use Cases

- **Authentication & Onboarding Pages:** Pairing sign-in/registration forms on one side with brand testimonials, feature highlights, or animated product visualizers on the other.
- **SaaS & Product Landing Page Heros:** Combining high-impact headline/CTA messaging on the left with interactive UI previews or live video demonstrations on the right.
- **Interactive Tools & Comparison Workspaces:** Side-by-side comparison of plans, visual before-and-after showcases, or live configurator panels (e.g., code editor + output preview).
- **Portfolio & Case Study Highlights:** Juxtaposing high-resolution project visual assets with structured client brief context, metrics, and deliverable summaries.
- **Store Locator & Map Interfaces:** Panning an interactive map pane alongside a scrollable location result list pane.

## When NOT to Use

- **Multi-Widget Data Dashboards:** When displaying 3 or more dense data widgets, charts, or navigation structures simultaneously, use `dashboard-layout-system` or `bento-grid-layout-system`.
- **Primary Page Navigation:** For primary sidebar navigation or multi-level application routing, use `sidebar-navigation-system` or `master-detail-layout-system`.
- **Sequential Long-Form Text:** For articles, documentation, or blog posts where continuous linear reading is essential, use `article-layout-system`.
- **Uniform Grid Items:** For repeating visual elements like photo galleries or product catalog listings, use `responsive-grid-system` or `card-ui-system`.

## Inputs

1. **Content Pair Taxonomy:** Identification of the two complementary content blocks (e.g., Primary Form + Secondary Visual, Headline/CTA + Product Interactive Demo).
2. **Visual Hierarchy Priority:** Determination of primary focal point (Equal 50/50 split vs. Dominant 60/40 split).
3. **Viewport & Scroll Architecture:** Decision on whether panels scroll together as a single page or scroll independently (sticky visual panel + scrolling text panel).
4. **Theme & Contrast Pairing:** Color tokens and theme assignments for each side (e.g., Light Mode active form panel paired with Dark Mode brand media panel).
5. **Responsive Stacking Preference:** Rule for mobile viewport (<768px) visual stacking order (e.g., Text/Form content stacked first vs. Visual media stacked first).

## Outputs

1. **Split-Screen Layout Architecture Blueprint:** CSS Grid/Flexbox spatial specifications for desktop, tablet, and mobile breakpoints.
2. **DOM Source & Screen Reader Sequence Spec:** Semantic HTML layout structure matching visual reading flow and assistive technology focus order.
3. **Panel Contrast & Boundary Guidelines:** Surface fill tokens, border separators, and background contrast rules ensuring WCAG AA compliance across split boundaries.
4. **Independent Scroll & Sticky Dock Rules:** Overflow and positioning specs for scroll-bound visual showcases.

---

## Workflow

### 1. Define Visual Ratio and Panel Roles
Determine the spatial proportion based on content density and visual hierarchy:
- **Symmetric 50/50 Split:** Ideal when both panels hold equal weight, such as dual choice landing pages (e.g., Enterprise vs. Developer) or equal-density comparison cards.
- **Asymmetric 60/40 Split:** Standard for Hero and Auth pages. The 60% panel hosts the primary visual element or interactive demo; the 40% panel hosts headline text, form controls, and CTAs.
- **Sticky Visual / Scrolling Detail Split (50/50 or 40/60):** As the user scrolls through sequential feature cards on one panel, the adjacent visual panel remains fixed (`position: sticky; top: 0`) and dynamically updates its graphic state.

### 2. Establish Source DOM Order and Mobile Stacking
Logical DOM order is critical for screen reader users and keyboard navigation. Visual layout on desktop must not compromise mobile reading logic:
- **Rule of Functional Priority:** Place the primary conversion element (the headline/CTA or sign-in form) first in the HTML source DOM, regardless of whether CSS moves it to the left or right side on desktop.
- **Desktop CSS Positioning:** Use CSS Grid (`grid-template-columns: 1fr 1fr` or `grid-template-columns: 60% 40%`) or Flexbox order properties to position the panels visually without mutating DOM tree order.
- **Mobile Breakdown (<768px):** On mobile viewports, split screens collapse into a single vertical column (`grid-template-columns: 1fr`). Ensure the HTML source places the primary action at the top, or use explicit order handling so users see headlines and actions before secondary decorative graphics.

### 3. Surface Contrast and Spatial Separation
To prevent the split layout from feeling disjointed or visually cluttered:
- **Contrast Boundaries:** Apply distinct background fills or explicit border separators between panels (e.g., Panel A: `#FFFFFF` / Panel B: `#0F172A`). Ensure high contrast across panel borders.
- **Gutters & Internal Padding:** Apply consistent fluid internal padding (`padding: clamp(1.5rem, 4vw, 4rem)`) to both panels so text and media do not collide with viewport edges or the panel divider line.
- **Media Containment:** Visual assets (images, videos, 3D canvases) inside a split panel must use `object-fit: cover` or container boundaries to prevent layout overflow or aspect ratio distortion.

### 4. Configure Scroll Behavior (Full Viewport vs. Independent Panels)
Determine how content scrolling behaves across viewports:
- **Full Viewport Scroll (Standard):** Both panels flow with the page scroll. Page height is determined by the taller panel. On desktop, set `min-height: 100vh` (or `100dvh` for mobile browsers) for full-bleed hero sections.
- **Independent Scrollable Panels:** Fixed height viewport (`height: 100vh; overflow: hidden`). Panel A (e.g., form or list) has `overflow-y: auto`, while Panel B (map, visual background, or video) remains static or has independent scrolling.
- **Accessibility Safeguard:** When using independent scroll panes, ensure both panels are focusable or reachable via keyboard navigation and scroll bars remain visible (`scrollbar-width: thin`).

### 5. Adapt for Responsive Breakpoints
Define precise layout transitions across viewport ranges:
- **Desktop Wide (≥1200px):** Full dual-panel split (50/50 or 60/40) with maximum layout container caps (`max-width: 1440px; margin: 0 auto;`) or full-width edge-to-edge bleed.
- **Tablet (768px – 1199px):** Maintain dual-panel split with reduced horizontal padding, or transition to a stacked layout if panel widths drop below `360px`.
- **Mobile (<768px):** Single-column vertical stack (`grid-template-columns: 1fr; min-height: auto;`). Panel height resets from `100vh` to `auto` to allow natural content expansion without clipping text.

---

## Decision Rules

### Selecting Split Ratios

| Layout Intent | Primary Panel (Left / Top) | Secondary Panel (Right / Bottom) | Ratio (Desktop) | Mobile Stacking Order |
| :--- | :--- | :--- | :--- | :--- |
| **Auth / Sign-In** | Form Controls & Social Logins (40%) | Brand Artwork & Testimonials (60%) | `40% / 60%` | Form Top, Brand Bottom |
| **Hero Feature Showcase** | Headline, Value Prop, CTA (45%) | Interactive Product Preview (55%) | `45% / 55%` | Headline Top, Preview Bottom |
| **Sticky Feature Walkthrough** | Sequential Feature Cards (50%) | Sticky Media Preview Pane (50%) | `50% / 50%` | Card + Media interleaved or Stacked |
| **Dual Path Gateway** | User Persona A (e.g., Employers) | User Persona B (e.g., Job Seekers) | `50% / 50%` | Persona A Top, Persona B Bottom |

### Panel Media Fitting Rules
- **Containment Mode (`contain`):** Use when full visibility of a diagram, chart, or UI mockup is required without cropping. Center media inside panel padding.
- **Full Bleed Mode (`cover`):** Use for lifestyle photography, abstract background art, or atmospheric video. Set `width: 100%; height: 100%; object-fit: cover;` with overflow hidden on the host panel.

---

## Constraints

- **Accessibility (WCAG 2.1 / 2.2 AA):**
  - **SC 1.3.2 Meaningful Sequence:** The visual layout order matching screen reader linear reading order must be logical. Forms and primary headings must precede decorative background visuals in the DOM.
  - **SC 1.4.3 Contrast (Minimum):** All text elements within both light and dark split panels must maintain at least a 4.5:1 contrast ratio against their respective panel background fills.
  - **SC 1.4.10 Reflow (320px):** Layout must reflow cleanly into a single vertical column on mobile screens down to 320px width without horizontal scrollbars or clipped interactive buttons.
  - **SC 2.1.1 Keyboard Accessibility:** In split layouts with independent scroll panes, both panes must be keyboard scrollable using arrow/page keys when focused.
- **Viewport Height Stability:** Never rely on fixed `height: 100vh` on mobile viewports due to dynamic browser address bars. Use `min-height: 100dvh` or fallback to `min-height: 100vh; @supports (min-height: 100dvh) { min-height: 100dvh; }`.

---

## Common Failure Patterns

- **The Mobile Scroll Trap:** Keeping `height: 100vh` and `overflow: hidden` on mobile, causing long sign-in forms to truncate and hide submit buttons off-screen.
- **DOM Reading Mismatch:** Using CSS order to move visual media above text in desktop split layouts, which causes screen readers to announce decorative images before primary headings.
- **Unbalanced Visual Weight:** Placing a dark-heavy, high-contrast visual panel next to a washed-out, plain white panel without a clear separating line or harmonious theme bridge.
- **Clipped Touch Targets:** Reducing panel padding on tablet screens until input fields and buttons touch the central panel divider boundary.
- **Unreachable Independent Scrollbars:** Hiding native scrollbars on scrollable text panes without providing visual cues, leaving users unaware that additional content exists below the panel fold.

---

## Validation Criteria

- [ ] Dual-panel layout cleanly transitions from side-by-side desktop grid to single-column mobile stack at <768px.
- [ ] HTML DOM source places functional primary content (headings, forms, CTAs) before secondary visual panels.
- [ ] Text inside both panels meets or exceeds WCAG AA 4.5:1 contrast requirements against panel background colors.
- [ ] Mobile viewports use dynamic viewport height units (`min-height: 100dvh`) to prevent address bar clipping.
- [ ] All interactive elements (inputs, links, buttons) retain full keyboard focus visibility across both panel backgrounds.
- [ ] Images/videos inside panels use proper object containment and aspect-ratio protection to prevent distortion.
