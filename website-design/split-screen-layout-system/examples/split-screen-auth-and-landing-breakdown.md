# Split-Screen Layout System: Real-World Design & Architecture Breakdowns

This document presents two comprehensive, real-world structural breakdowns of the **Split-Screen Layout System** applied to common web design challenges:
1. **Asymmetric Authentication & Onboarding Page (40/60 Split)**
2. **Sticky Feature Showcase Landing Page (50/50 Split)**

---

## Example 1: Asymmetric Authentication Page (40/60 Split)

### Design Problem
SaaS platforms need to balance a quick, friction-free login/registration form with high-impact brand proof, security certifications, and social proof. Placing branding elements above or below the form on single-column pages creates excessive scrolling or distracts from the input fields.

### Solution & Spatial Composition
A **40/60 asymmetric split-screen layout** on desktop viewports (≥1024px):
- **Left Panel (40% width):** Functional workspace containing brand logo, page heading, form fields (email, password, SSO buttons), and footers. Clean, light background fill (`#FFFFFF`) with maximum text legibility.
- **Right Panel (60% width):** Brand visual showcase containing a dark atmospheric background (`#0F172A`), vibrant product screenshot preview, dynamic customer quote testimonial, and floating trust badges.

```text
+----------------------------------------+---------------------------------------------------+
|  40% FORM PANEL (Light Fill: #FFFFFF)  |  60% BRAND SHOWCASE (Dark Fill: #0F172A)          |
|                                        |                                                   |
|  [Logo]                                |  +---------------------------------------------+  |
|                                        |  |                                             |  |
|  # Welcome Back                        |  |       [Product Dashboard Graphic]           |  |
|  Sign in to manage your workspace.     |  |                                             |  |
|                                        |  +---------------------------------------------+  |
|  [ Continue with Google ]              |                                                   |
|  ---------------- OR ----------------- |  "This platform transformed how our engineering  |
|  Email Address                         |   team ships software in record time."            |
|  [ email@company.com ]                 |  -- Sarah Chen, CTO at TechScale              |
|  Password                              |                                                   |
|  [ ************ ]                      |  [Badge: SOC2 Type II]  [Badge: 99.99% Uptime] |
|  [ Sign In Button ]                    |                                                   |
+----------------------------------------+---------------------------------------------------+
```

### Mobile Responsive Stacking Strategy (<768px)
On mobile devices, side-by-side split screens compress input controls to unreadable widths. The layout transforms into a single vertical column:
1. **Top Container (Primary Action):** Form panel takes 100% viewport width. Padding reduces from `4rem` to `1.5rem`.
2. **Bottom Container (Secondary Brand Context):** Brand showcase panel collapses below the form or hides optional decorative graphics on ultra-compact screens (<480px) to prevent unnecessary vertical scrolling before login completion.

### Accessibility & DOM Order Mechanics
- **HTML DOM Source Order:** The functional form panel is placed **first** in the HTML source code. Screen readers immediately announce the `<h1>Sign in</h1>` heading and form controls without having to read decorative brand testimonials first.
- **Contrast Ratios:** Left panel uses `#111827` text on `#FFFFFF` (16.5:1 contrast). Right panel uses `#F9FAFB` text on `#0F172A` (15.8:1 contrast).
- **Focus Management:** Tab sequence flows logically through SSO buttons, text inputs, password toggle, and submit button before reaching secondary links.

---

## Example 2: Sticky Feature Showcase Landing Page (50/50 Split)

### Design Problem
Product feature sections often suffer from layout fatigue when presenting long lists of features. Users lose visual context when scrolling through extensive text lists while graphic previews scroll off-screen.

### Solution & Spatial Composition
A **50/50 dual-panel split layout** with an independent **sticky visual preview pane**:
- **Left Panel (50% width):** A continuous scrolling column featuring 3 sequential feature breakdown cards. Each card includes a badge, section heading, descriptive text, and bullet points.
- **Right Panel (50% width):** A fixed, viewport-docked visual showcase (`position: sticky; top: 0; height: 100vh`). As the left panel scrolls, the right panel maintains its pinned visual position, updating interactive UI mockups corresponding to the active feature card in view.

```text
+---------------------------------------------------+---------------------------------------------------+
|  LEFT PANEL: SCROLLABLE FEATURE CARDS (50%)       |  RIGHT PANEL: STICKY VISUAL SHOWCASE (50%)        |
|                                                   |  (position: sticky; top: 0; height: 100vh)        |
|  [CARD 1 - Active]                                |                                                   |
|  ## Real-Time Collaboration                       |  +---------------------------------------------+  |
|  Edit code simultaneously with live multiplayer   |  |                                             |  |
|  cursors and built-in voice channels.             |  |                                             |  |
|                                                   |  |   [LIVE MULTIPLAYER UI INTERACTIVE DEMO]    |  |
|  [CARD 2 - Upcoming]                              |  |                                             |  |
|  ## Automated Testing Pipeline                    |  |                                             |  |
|  Run unit and visual regression tests on every    |  +---------------------------------------------+  |
|  pull request automatically.                      |                                                   |
|                                                   |  Status: Dynamic active card visual binding       |
|  [CARD 3 - Upcoming]                              |                                                   |
|  ## One-Click Edge Deployment                     |                                                   |
+---------------------------------------------------+---------------------------------------------------+
```

### Mobile Layout Adaptation
On mobile viewports (<768px):
- `position: sticky` is disabled (`position: static`).
- The layout transforms into interleaved card-and-media blocks:
  - Feature 1 Headline & Text -> Feature 1 Visual Media
  - Feature 2 Headline & Text -> Feature 2 Visual Media
  - Feature 3 Headline & Text -> Feature 3 Visual Media
- This preserves the direct visual correlation without creating an isolated sticky box that covers half the phone screen.

### Accessibility & Technical Implementation
- **Scroll Behavior:** Uses native CSS Grid container. No scroll hijacking or wheel event locking.
- **Reduced Motion Support:** Respects `prefers-reduced-motion`. On reduced-motion preferences, visual transitions between feature cards use immediate opacity swaps rather than animated sliding panels.
- **WCAG AA Compliance:** Target touch areas for interactive tab buttons meet minimum 44x44px boundaries.
