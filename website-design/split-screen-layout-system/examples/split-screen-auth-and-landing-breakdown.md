# Split-Screen Layout System Examples

This document demonstrates two real-world applications of the **Split-Screen Layout System**:
1. **SaaS Authentication & Onboarding Portal (50/50 Balanced Split)**
2. **Product Feature Showcase (60/40 Sticky Media Split)**

---

## Example 1: SaaS Authentication & Onboarding Portal (50/50 Balanced Split)

### Problem Statement
An enterprise B2B SaaS platform needs a login and registration screen that presents security trust badges, client testimonials, and product screenshots alongside an interactive authentication form without crowding small screens or causing keyboard focus confusion.

### Spatial Composition & Ratios
- **Desktop (1024px+):** 50/50 balanced grid split using `grid-template-columns: 1fr 1fr`.
- **Min Height:** `min-height: 100dvh` (Dynamic Viewport Height).
- **Left Panel (Brand & Social Proof):** Dark theme (`#0f172a` slate background) with product preview graphics, testimonial quote, and customer logos.
- **Right Panel (Interactive Form):** Clean light theme (`#ffffff` background) containing the main registration form, social logins, and account recovery link.

### Layout Diagram (Desktop)

```text
+------------------------------------------+------------------------------------------+
|  LEFT PANEL (Dark Brand / Testimonial)   |  RIGHT PANEL (Light Interactive Form)    |
|  Background: #0f172a                     |  Background: #ffffff                     |
|                                          |                                          |
|  [Logo] CoastAi                          |  <h1> Create your account </h1>          |
|                                          |  <p> Start your 14-day free trial </p>   |
|  "CoastAi automated 80% of our workflow, |                                          |
|  saving 15 hours per engineer."          |  [ Continue with Google ]                |
|  -- Sarah Lin, CTO at Acme Corp          |  [ Continue with GitHub ]                |
|                                          |                                          |
|  [ Product Interface Mockup Graphic ]    |  -- OR --                                |
|                                          |                                          |
|  [ Trust Badges: SOC2 | ISO27001 ]       |  <label> Work Email </label>             |
|                                          |  [ input: email ]                        |
|                                          |                                          |
|                                          |  <label> Password </label>               |
|                                          |  [ input: password ]                     |
|                                          |                                          |
|                                          |  [ Button: Create Account ]              |
+------------------------------------------+------------------------------------------+
```

### DOM Structure & Source Sequence
To satisfy WCAG 2.1 SC 1.3.2 (Meaningful Sequence), the HTML source places the primary content (`<main>`) first in the DOM order, regardless of visual pane position.

```html
<div class="split-viewport">
  <!-- Interactive Form Panel (Primary Landmark: Main) -->
  <main class="split-panel panel-form">
    <div class="form-container">
      <header class="form-header">
        <h1>Create your account</h1>
        <p>Start your 14-day free trial. No credit card required.</p>
      </header>

      <form action="/signup" method="POST" class="signup-form">
        <button type="button" class="btn-social">Continue with Google</button>
        <button type="button" class="btn-social">Continue with GitHub</button>
        <div class="divider"><span>OR</span></div>

        <div class="field-group">
          <label for="email">Work Email</label>
          <input type="email" id="email" name="email" required autocomplete="email" />
        </div>

        <div class="field-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required autocomplete="new-password" />
        </div>

        <button type="submit" class="btn-primary">Create Account</button>
      </form>
    </div>
  </main>

  <!-- Brand Visual Panel (Secondary Landmark: Aside) -->
  <aside class="split-panel panel-visual" aria-label="Product Highlights">
    <div class="visual-content">
      <blockquote class="testimonial">
        <p>“CoastAi automated 80% of our workflow, saving 15 hours per engineer every week.”</p>
        <footer>— Sarah Lin, CTO at Acme Corp</footer>
      </blockquote>
      <div class="trust-footer">
        <span>SOC2 Type II Certified</span>
        <span>ISO 27001</span>
      </div>
    </div>
  </aside>
</div>
```

### Mobile Responsive Stacking Rules (< 992px)
1. **Grid Collapse:** Switches from `grid-template-columns: 1fr 1fr` to `grid-template-columns: 1fr`.
2. **Order Priority:** The primary form panel (`<main>`) displays at the top of the mobile screen so users can log in or register immediately without scrolling past marketing graphics.
3. **Visual Panel Adjustment:** The visual brand panel reduces height (`padding: var(--space-l); min-height: auto`) and stacks beneath the form as a supporting footer section.

---

## Example 2: Product Feature Showcase (60/40 Sticky Media Split)

### Problem Statement
A high-tech hardware/software landing page wants to showcase 4 distinct product features. Each feature has detailed explanatory text, feature sub-bullets, and a corresponding high-definition interactive SVG / video rendering that should stay pinned in view as the user reads through the feature cards.

### Spatial Composition & Ratios
- **Desktop (1024px+):** 60/40 split (`grid-template-columns: 60% 40%`).
- **Left Panel (Sticky Media Dock):** Occupies 60% width, height `100vh`, `position: sticky; top: 0`. Displays active feature media matching the current scroll section.
- **Right Panel (Scrolling Feature Cards):** Occupies 40% width, natural page height, contains 4 feature text blocks that scroll vertically.

### Layout Diagram (Desktop)

```text
+------------------------------------------+-----------------------------------+
|  LEFT PANEL: STICKY MEDIA DOCK (60%)     | RIGHT PANEL: SCROLLING CONTENT    |
|  position: sticky; top: 0; height: 100vh | (40%) natural page scroll         |
|                                          |                                   |
|  +------------------------------------+  |  [Feature 1 Card]                 |
|  |                                    |  |  <h2> Real-time Analytics </h2>   |
|  |  Active High-Def Media / 3D Model  |  |  <p> Process millions of events   |
|  |  (Changes as user scrolls)         |  |  per second with sub-ms latency. </p>|
|  |                                    |  |                                   |
|  +------------------------------------+  |  -------------------------------  |
|                                          |  [Feature 2 Card]                 |
|  [ Media Controls / Captions ]           |  <h2> Intelligent Routing </h2>   |
|                                          |  <p> Dynamically balance traffic  |
|                                          |  across regional edge hubs. </p>   |
|                                          |                                   |
|                                          |  -------------------------------  |
|                                          |  [Feature 3 Card]                 |
|                                          |  <h2> Zero-Trust Security </h2>   |
|                                          |  ...                              |
+------------------------------------------+-----------------------------------+
```

### Key CSS Implementation
```css
/* Container Layout */
.feature-split-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .feature-split-container {
    grid-template-columns: 60% 40%;
    align-items: start;
  }

  /* Sticky Media Panel */
  .sticky-media-panel {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Scrolling Content Panel */
  .scrolling-content-panel {
    padding-top: var(--space-2xl);
    padding-bottom: var(--space-2xl);
  }
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  .sticky-media-panel {
    position: relative;
    height: auto;
  }
}
```

### Accessibility & Motion Rules Applied
1. **`prefers-reduced-motion` Handling:** On systems with reduced motion enabled, `position: sticky` is disabled, allowing media to render statically alongside each feature card instead of pinning dynamically.
2. **Keyboard Traversal:** Keyboard users can press Tab to focus through interactive links and buttons inside each feature card sequentially without being trapped inside the sticky media container.
3. **Contrast Compliance:** All text on the right panel achieves a contrast ratio of `7.1:1` (black `#0f172a` text on white `#ffffff` background).
