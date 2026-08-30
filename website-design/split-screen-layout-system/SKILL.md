---
name: split-screen-layout-system
description:
  Design and implement a responsive, dual-panel split-screen layout framework
  to balance visual narrative and interactive focus across viewports while maintaining
  contrast isolation, logical DOM reading order, and WCAG AA accessibility.
---

# Split-Screen Layout System

## Purpose

The Split-Screen Layout System provides a structured design and layout methodology for dividing a webpage viewport into two distinct visual zones—typically pairing a media/brand panel (visual narrative, graphics, ambient preview) with a functional panel (form fields, interactive configurators, pricing comparison, or core call-to-action).

This system solves the visual competition and layout imbalance that occurs when heavy marketing imagery or interactive forms are forced into traditional single-column or unconstrained multi-column grids. By enforcing strict proportional ratios, dynamic viewport height handling (`dvh`), independent panel scrolling, distinct contrast boundaries, and controlled mobile stacking order, it ensures an engaging visual experience without compromising usability, focus management, or WCAG AA compliance.

## Use Cases

- **Authentication & Onboarding Portals:** Pairing a high-impact brand illustration or customer testimonial video panel (50%) with a clean login/signup form panel (50%).
- **Interactive Product Configurators & Customizers:** Presenting a live 3D visualizer, canvas, or product render on one side (60%) while controls, color selectors, and add-to-cart actions remain pinned on the other (40%).
- **Side-by-Side Plan & Feature Comparisons:** Comparing two distinct user tiers (e.g., Free vs. Enterprise, or Self-Hosted vs. Cloud) with equal visual weight.
- **Lead Capture & High-Intent Landing Pages:** Displaying value propositions, social proof, and trust badges on the visual panel alongside an instant checkout or demo request form on the action panel.
- **Editorial & Portfolio Showcases:** Featuring high-resolution photography or case study previews alongside sticky narrative text and metadata.

## When NOT to Use

- **Multi-Step Complex Dashboards:** When content naturally splits into 3+ functional regions (e.g., navigation sidebar, primary workspace, and secondary inspector), use `dashboard-layout-system` or `master-detail-layout-system`.
- **Asymmetrical Content Grids:** When organizing 4–8 heterogeneous metric cards, illustrations, and small widgets, use `bento-grid-layout-system`.
- **Sequential Step-by-Step Wizards:** For linear processes where progress must be conveyed sequentially across discrete screen steps, use `step-progress-system` or `form-design-system`.
- **Long-Form Text Articles:** For continuous reading experiences where secondary images fit naturally within text flow, use `article-layout-system`.

## Inputs

1. **Panel Intent Classification:** Identification of Panel A (Visual/Narrative side) vs. Panel B (Action/Interactive side).
2. **Viewport Proportional Ratio:** Choice of spatial split ratio (50/50 equal weight, 60/40 visual priority, or 40/60 action priority).
3. **Scroll Mechanics & Containment:** Determination of whether panels scroll independently (`overflow-y: auto`), sync with window scroll, or stay fixed (`position: sticky`).
4. **Color & Contrast Palette:** Background fills, foreground text colors, and dark/light theme tokens for both panels to guarantee WCAG AA contrast isolation.
5. **Mobile Stacking Hierarchy:** Rules governing DOM order and visual display order when collapsing from dual-panel desktop to single-column mobile viewports.

## Outputs

1. **Split-Screen Geometry Blueprint:** Layout specifications defining desktop grid columns (`grid-template-columns`), height bounds (`min-height: 100dvh`), and gap boundaries.
2. **DOM Order & Visual Hierarchy Map:** HTML source tree structure specifying how keyboard focus and screen readers navigate between panels without visual-DOM disconnect.
3. **Contrast Isolation Spec:** Theme rules for panel backdrops (e.g., dark brand visual panel paired with light functional form panel) ensuring independent color scopes.
4. **Responsive Stacking Blueprint:** CSS media query definitions for collapsing to mobile (<768px) and tablet (<1024px) viewports with controlled panel order.

---

## Workflow

### 1. Define Panel Roles and Proportional Ratio
Identify the visual anchor and functional target for the split screen:
- **50 / 50 Split (Equal Balance):** Ideal for authentication pages (Login/Register), brand vs. product overview, or two-tier product comparisons where both panels carry equal importance.
- **60 / 40 Split (Visual Dominance):** Assign 60% width to the media/narrative panel and 40% to the interactive panel. Ideal for visual product configurators, portfolio image showcases, and interactive demos.
- **40 / 60 Split (Action Dominance):** Assign 40% width to supporting brand context/testimonials and 60% to multi-field forms, data tables, or detailed checkout flows.

### 2. Establish CSS Grid & Viewport Height Structure
Use CSS Grid on the container to enforce crisp spatial division:
- **Container Setup:** `display: grid; min-height: 100dvh; grid-template-columns: 1fr 1fr;` (for 50/50 split).
- **Dynamic Viewport Units:** Use `100dvh` (dynamic viewport height) instead of `100vh` to prevent mobile browser URL bars from causing layout overflow or unnecessary scrollbars.
- **Full Bleed vs. Margined Containment:** Determine if the split screen spans screen edge-to-edge (`width: 100%`) or sits inside a container frame with outer margins (`max-width: 1440px; margin: 0 auto;`).

### 3. Implement Independent Panel Scrolling & Containment
Prevent awkward dual-scrollbar bugs by defining clear scroll boundaries:
- **Fixed Action + Scrollable Visual:** Keep the functional panel locked (`position: sticky; top: 0; height: 100dvh;`) while long visual/narrative content scrolls alongside it.
- **Dual Independent Scroll:** Assign `height: 100dvh; overflow-y: auto;` to both panels independently if both contain long content. Apply `overscroll-behavior: contain;` to avoid unwanted window scrolling.
- **Single Page Viewport Containment:** For short forms (e.g., login screens), set `height: 100dvh; overflow: hidden;` on desktop and center content vertically within each panel using flexbox (`display: flex; flex-direction: column; justify-content: center;`).

### 4. Isolate Color Themes and Contrast Boundaries
Split-screen layouts often feature distinct color treatments per panel (e.g., a dark navy media panel paired with a crisp white form panel):
- **Contrast Scoping:** Set independent CSS custom properties or theme attributes (`data-theme="dark"` on Panel A, `data-theme="light"` on Panel B).
- **Text & Control Contrast:** Ensure text inside each panel meets WCAG AA (minimum 4.5:1 for standard text, 3:1 for large headlines and interactive boundaries).
- **Focus Rings:** Ensure keyboard focus rings adapt to each panel's background color (e.g., high-contrast white focus ring on dark panel; dark blue focus ring on light panel).

### 5. Configure Mobile Stacking & DOM Order
When viewports drop below `768px` (or `1024px` for high-density forms), collapse the 2-column grid into a single vertical column:
- **DOM-First Ordering:** Place the primary actionable content (e.g., the Login Form or Main Action) in the DOM in logical visual order.
- **Mobile Reordering Rules:** On mobile, decide whether Panel A (Visual) or Panel B (Action) appears first. If Panel A is purely decorative image/ambient background, hide or collapse it on mobile (`display: none` or reduced banner height) so users access the primary action without scrolling past a massive image.
- **CSS Grid Re-mapping:** On mobile, set `grid-template-columns: 1fr; min-height: auto;`.

---

## Decision Rules

### Selecting the Split Ratio

| Scenario | Recommended Desktop Ratio | Visual Panel Behavior | Action Panel Behavior |
| :--- | :--- | :--- | :--- |
| **SaaS Authentication / Signup** | `50% / 50%` | Centered illustration, testimonial quote, or feature loop. | Centered login/signup form, social auth buttons. |
| **Product Customizer / 3D Canvas** | `60% / 40%` | Sticky 3D render view or image viewer (`height: 100dvh`). | Scrollable controls, swatch selectors, price calculator. |
| **Lead Generation / Complex Form** | `40% / 60%` | Fixed brand overview, social proof badges, trust logos. | High-density multi-field form or quote request. |
| **Editorial Case Study Showcase** | `50% / 50%` or `60% / 40%` | Full-bleed hero image gallery with parallax or sticky pin. | Long-form reading section with independent scroll. |

### Mobile Stacking Order Guidelines

```text
[ Desktop Layout: 2 Columns ]
+------------------------+------------------------+
| Panel A (Visual 50%)   | Panel B (Action 50%)   |
| Decorative / Narrative | Primary Form / Action  |
+------------------------+------------------------+

[ Mobile Layout Option 1: Action-First (Recommended for Auth/Lead Gen) ]
+------------------------+
| Panel B (Action)       | <-- Action comes first so user doesn't have to scroll
+------------------------+
| Panel A (Visual)       | <-- Ambient testimonial/media stacked below or reduced
+------------------------+

[ Mobile Layout Option 2: Visual Header Banner (Recommended for Editorial) ]
+------------------------+
| Panel A (Visual)       | <-- Height capped to 200px-300px hero banner
+------------------------+
| Panel B (Action)       | <-- Main content follows naturally
+------------------------+
```

---

## Constraints

- **Viewport Height Bugs (`100vh` vs `100dvh`):** Mobile browsers (iOS Safari, Android Chrome) hide/show address bars dynamically. Hardcoded `100vh` causes content clipping under bottom navigation bars. Always use `min-height: 100dvh;` with a fallback `min-height: 100vh;`.
- **Keyboard Tab Order (WCAG 2.1 SC 1.3.2):** Tabbing with `Tab` and `Shift+Tab` must follow visual reading order top-to-bottom, left-to-right (or right-to-left in RTL). Do not use CSS `order` or absolute positioning to shuffle interactive elements across panel boundaries.
- **Text Zoom & Font Scaling (WCAG 2.1 SC 1.4.4):** Panels must accommodate up to 200% browser text zoom without text clipping or overlapping panel boundaries. Use flex/grid expansion and avoid fixed `height: 500px` on text containers.
- **Contrast Isolation (WCAG 2.1 SC 1.4.3):** Dark background panels must use light foreground text tokens; light background panels must use dark foreground text tokens. Controls that cross panel seams must maintain contrast against both backdrops.

---

## Common Failure Patterns

- **The Mobile Scroll Trap:** Forcing a `height: 100vh` fixed container on mobile screens, causing form inputs at the bottom of the active panel to be pushed offscreen beneath the keyboard or browser UI.
- **Double Scrollbars of Doom:** Setting `overflow-y: scroll` on both panels AND the window body, resulting in three simultaneous, competing scrollbars.
- **Unreachable Interactive Elements:** Placing primary interactive form controls on a panel that gets hidden completely on mobile (`display: none`).
- **Visual Disconnect across Breakpoints:** Abruptly shifting text colors or focus indicators when stacked on mobile because the background changes from dark to light without updating theme classes.
- **Tiny Viewport Squeezing:** Forcing a 50/50 split on narrow tablet viewports (e.g., 768px screens in portrait mode), making form inputs and media containers awkwardly narrow (<350px width).

---

## Validation Criteria

- [ ] **Viewport Height Compliance:** Desktop layout uses `100dvh` for full-height containment without vertical overflow or dynamic toolbar clipping on mobile browsers.
- [ ] **Responsive Stacking:** Layout transitions seamlessly from dual columns to a single column stack at `<768px` (or `<1024px` for complex forms).
- [ ] **DOM & Reading Order:** Source HTML order matches natural visual navigation order, ensuring screen readers and keyboard users move logically through the interface.
- [ ] **Independent Color & Contrast Scoping:** Each panel maintains at least 4.5:1 text contrast and 3:1 UI boundary contrast against its respective background fill.
- [ ] **200% Text Zoom Safety:** Text can be zoomed to 200% without overflowing panel boundaries or truncating interactive controls.
- [ ] **Scroll Locking Mitigation:** Independent panel scrolling includes `overscroll-behavior: contain` to eliminate parent page scroll bleeding.
