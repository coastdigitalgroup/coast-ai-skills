---
name: split-screen-layout-system
description:
  Design and structure dual-panel split-screen layouts (50/50, 60/40, or visual/interactive splits)
  managing spatial composition, visual weight balance, media scaling, background contrast transitions,
  responsive stacking flow, and WCAG AA keyboard focus and screen-reader accessibility.
---

# Split-Screen Layout System

## Purpose

The Split-Screen Layout System provides a standardized, responsive, and accessible design framework for structuring dual-panel web pages. Split-screen designs divide the viewport into two distinct horizontal or vertical zones—typically pairing a visual or media pane (brand illustration, video, interactive product canvas, or testimonial spotlight) with an interactive or content pane (authentication form, onboarding step, value proposition narrative, or feature configurator).

Designing an effective split-screen interface requires balancing spatial proportions, ensuring equal or deliberate visual hierarchy between the two panels, maintaining independent panel scrolling without double scrollbar bugs, managing high-contrast transitions across asymmetric background color themes, and implementing responsive mobile stacking that preserves logical reading order and focus management under WCAG 2.1 AA.

## Use Cases

- **Authentication & Gateway Interfaces (Login / Sign-up):** Pairing an interactive sign-in or registration form on one pane with high-impact brand artwork, customer testimonials, or product feature highlights on the adjacent pane.
- **Product Landing Page Heroes:** Presenting a high-converting headline narrative and primary CTA on the left pane while showcasing an interactive 3D model, application UI preview, or video demo on the right pane.
- **Onboarding & Multi-Step Wizard Flows:** Combining persistent step guidance, progress indicators, or preview visualizations on one side with active form input fields on the other.
- **Comparison & Dual-Feature Showcases:** Displaying two contrasting products, plan tiers, or "Before vs. After" transformations side-by-side with independent visual hierarchy.
- **Event & Webinar Registration Pages:** Structuring speaker bios and schedule agendas alongside a fixed registration form.

## When NOT to Use

- **Multi-Record Application Dashboards:** For productivity software requiring continuous list navigation beside an active record workspace (e.g., email inbox, CRM helpdesk), use `master-detail-layout-system`.
- **Complex Multi-Column App Layouts:** For SaaS dashboards requiring persistent vertical sidebar navigation, top command bars, and widget grids, use `dashboard-layout-system` or `sidebar-navigation-system`.
- **High-Density Data Grids:** For structured tabular data across multiple rows and columns, use `data-table-ui-system` or `responsive-grid-system`.
- **Single-Column Editorial Articles:** For long-form text documents or blog posts intended for unimpeded vertical reading, use `article-layout-system` or `section-composition-system`.

## Inputs

1. **Split Ratio & Spatial Intent:** Preferred proportion (50/50 balanced split, 60/40 hero-focused split, or 40/60 form-focused split).
2. **Pane Role Assignment:** Defining the purpose of Pane A (Visual/Media/Brand panel) and Pane B (Interactive/Form/Content panel).
3. **Surface & Theme Pairing Tokens:** Surface colors and themes (e.g., Dark brand artwork pane paired with Light form pane, or dual light surfaces) from `accessible-color-system` and `dark-theme-design-system`.
4. **Media & Content Density Assets:** Visual assets (images, SVGs, video canvas, product mockups) and form/content schemas to be embedded.

## Outputs

1. **Dual-Pane Canvas Specification:** CSS Grid layout definitions for desktop split ratios, container height containment (`100vh` / `100%`), and smooth panel boundaries.
2. **Media Containment & Background Contrast Rules:** CSS rules for image scaling (`object-fit: cover`), background gradients, visual weight distribution, and legibility overlays.
3. **Responsive Stacking & Mobile Flow Model:** Responsive breakpoint rules converting horizontal side-by-side panels into vertical stacked rows while preserving DOM reading order and priority content visibility.
4. **Accessible ARIA & Keyboard Focus Blueprint:** ARIA landmark region definitions (`role="region"` or semantic `<main>` / `<aside>`), heading hierarchy rules, and WCAG AA focus indicator management.

---

## Workflow

### 1. Establish Viewport Container & Pane Geometry
Construct the outer split-screen wrapper and set layout bounds to avoid unwanted browser scrollbars:
- **Viewport Height Containment:** For full-screen experiences (such as Auth pages or landing heroes), set the main container to `display: grid; min-height: 100vh; width: 100%; overflow: hidden;`.
- **Desktop Column Ratios:**
  - *50/50 Balanced Split:* `grid-template-columns: 1fr 1fr;` (Ideal for equal weight value props or auth pages).
  - *60/40 Feature Split:* `grid-template-columns: 3fr 2fr;` (Gives prominent space to interactive product previews).
  - *40/60 Form-Focused Split:* `grid-template-columns: 2fr 3fr;` (Prioritizes multi-field form completion while keeping brand context).
- **Independent Pane Containment:** Ensure individual panes handle overflow gracefully (`overflow-y: auto; height: 100%;`) to prevent one long pane from stretching the entire viewport or causing double scrollbars.

### 2. Formulate the Visual & Media Pane (Pane A)
The visual pane creates immediate brand engagement and emotional resonance:
- **Background Layering & Contrast:** If Pane A uses dark brand colors or photography, ensure internal typography meets WCAG AA contrast (≥4.5:1).
- **Media Scaling & Framing:** Wrap artwork or product mockups in container elements with strict sizing controls (`width: 100%; height: 100%; object-fit: cover;` or `object-fit: contain;`).
- **Decorative vs. Informative Visuals:**
  - If the imagery is purely decorative, apply `alt=""` and `aria-hidden="true"`.
  - If the image contains text or product screenshots, provide descriptive `alt` text or paired caption typography.

### 3. Formulate the Interactive & Content Pane (Pane B)
The interactive pane drives user actions (form input, conversion clicks, reading):
- **Content Alignment & Padding:** Center content vertically within Pane B using `display: flex; flex-direction: column; justify-content: center; align-items: center; padding: clamp(2rem, 5vw, 4rem);`.
- **Form Width Locking:** Constrain form elements to a max-width readable measure (`max-width: 440px; width: 100%;`) so input fields do not stretch uncomfortably wide on ultra-wide screens.
- **Touch Target & Input Hierarchy:** Standardize primary buttons, form inputs, and links using `button-and-action-system` and `form-design-system` with tap targets of at least **44x44px** on touch viewports.

### 4. Configure Responsive Mobile Stacking & Priority Flow
On mobile viewports (typically `< 768px` or `< 1024px`), side-by-side panes become cramped and unreadable:
- **Breakpoint Stacking Transition:** Switch `grid-template-columns` to a single column layout (`grid-template-columns: 1fr; min-height: auto; overflow: visible;`).
- **DOM Order vs. Visual Stacking Priority:**
  - *Auth & Form Pages:* The interactive form (Pane B) is the primary user goal. Place Pane B first in the DOM so mobile users see the input fields immediately without scrolling past lengthy marketing artwork. Use CSS `order` or natural DOM placement.
  - *Hero & Showcase Pages:* Place the narrative headline (Pane B) first, followed by the product visual (Pane A).
- **Media Height Reduction:** On mobile stacked views, reduce the visual pane height (`max-height: 280px` or `aspect-ratio: 16/9`) so it does not dominate the entire mobile screen.

### 5. Implement Keyboard Focus & ARIA Landmarks
- **Semantic Structure & Landmarks:**
  - Wrap the primary content/form pane in `<main>` or `role="main"`.
  - Wrap the visual/brand presentation pane in `<aside aria-label="Product Showcase">` or `<section aria-label="Brand Highlights">`.
- **Reading & Focus Order:** Ensure DOM tab order flows naturally from left-to-right (or top-to-bottom on mobile) matching the visual layout without confusing tabindex jumps (`tabindex="0"` or natural focus).
- **Focus Rings across Theme Boundaries:** Ensure focus rings maintain 3:1 contrast against both dark visual panes and light form panes (`outline: 2px solid var(--focus-ring); outline-offset: 2px;`).

---

## Decision Rules

### Layout Split Ratios & Use Case Mapping

| Page Type | Desktop Split Ratio | Mobile Stack Order | Recommended Pane Roles |
| :--- | :--- | :--- | :--- |
| **Login / Sign-Up Auth** | **50 / 50 Split** | Form Top, Media Bottom | Pane A: Brand Art / Testimonial; Pane B: Login Form (`<main>`) |
| **Product Hero Section** | **60 / 40 Split** | Copy Top, Media Bottom | Pane A: Copy & CTA (`<main>`); Pane B: Interactive App Canvas |
| **Onboarding Wizard** | **40 / 60 Split** | Steps Top, Inputs Bottom | Pane A: Step Checklist / Preview; Pane B: Active Form Fields |
| **Dual Comparison** | **50 / 50 Split** | Option A Top, Option B Bottom | Pane A: Tier A / Before; Pane B: Tier B / After |

### Asymmetric Background Contrast Guidelines
- **Dark Visual Pane + Light Form Pane:** Set independent CSS custom properties for each pane (`--pane-bg`, `--pane-text`, `--pane-border`). Never inherit text colors across the split boundary.
- **Split Divider Line:** On dual light or dual dark splits, insert a subtle 1px border (`border-right: 1px solid var(--border-subtle)`) to establish visual separation between panes.

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 1.4.3 Contrast (Minimum):** Text on both panes must meet at least **4.5:1** contrast ratio against its respective background.
  - **SC 1.3.2 Meaningful Sequence:** The visual tab order and screen reader reading order must match the logical priority of the page (Interactive Form first on Auth; Value Prop headline first on Heroes).
  - **SC 2.4.7 Focus Visible:** Focused input fields and buttons must feature unclipped focus indicators with ≥3:1 contrast against pane surface colors.
  - **SC 2.5.8 Target Size:** All interactive triggers must satisfy minimum tap targets (24x24px minimum, 44x44px recommended for touch).
- **Layout Shift & Overflow Prevention:** Full-screen desktop split layouts must use `overflow: hidden` on the main wrapper and `overflow-y: auto` inside individual scrollable panes to eliminate window-level layout thrashing and double scrollbars.
- **Typography Line Length:** Text measures in both panes must remain between **45 and 75 characters per line** (`ch` units) to maintain comfortable readability.

---

## Common Failure Patterns

- **Double Scrollbar Trap:** Leaving `height: 100vh` on child elements without locked container overflow, causing both the browser window and the child pane to display independent vertical scrollbars.
- **Mobile Primary Content Occlusion:** Placing a giant visual art panel ahead of the login form in mobile DOM order, forcing mobile users to scroll through 600px of marketing imagery to reach the username field.
- **Unchecked Text Overload over Art:** Rendering text directly over detailed background photos without dark gradient overlays (`rgba(0,0,0,0.6)`), rendering text unreadable and failing WCAG AA contrast.
- **Unbounded Form Input Stretching:** Allowing form fields on a 50/50 split desktop view to stretch across 800px width, creating awkward touch targets and visual distortion.
- **Unequal Visual Weight:** Making one panel overwhelmingly dark and saturated while the adjacent panel is plain white with tiny text, causing visual imbalance and high eye strain.

---

## Validation Criteria

- [ ] Viewport containment manages desktop split ratio (`50/50` or `60/40`) cleanly without window double scrollbars.
- [ ] Responsive mobile breakpoint (`<768px`) stacks panels into a single column with appropriate height constraints on media elements.
- [ ] DOM reading order prioritizes the primary task (e.g., Auth form first on mobile login screens).
- [ ] Text contrast on both dark and light split panes satisfies WCAG AA (≥4.5:1 ratio).
- [ ] Interactive inputs and buttons feature bounded widths (`max-width: 440px`) and touch targets ≥44x44px.
- [ ] Semantic ARIA landmarks (`<main>`, `<aside>`, `role="region"`) properly differentiate the two panes.
