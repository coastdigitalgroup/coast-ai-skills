# SaaS Product Feature Overview Bento Grid Example

This example demonstrates how to apply the **Bento Grid Layout System** to a SaaS product feature landing page section. The goal is to showcase 6 distinct capabilities of a modern "AI-Driven Developer Analytics Platform" (called DevMetrics) in a highly structured, scannable, and visually engaging section.

## Design Problem

DevMetrics needs to display several diverse pieces of information in a single, high-impact section above the pricing table. The content includes:
1. **Core Feature:** Real-Time Deployment Pipeline Tracking (Visual interface + description).
2. **Key Metric:** Total deployment cycle time reduction (Data visualization/stat).
3. **Secondary Feature:** Integrations (Icons and logo grid).
4. **Social Proof:** A single prominent quote from a Lead DevOps engineer.
5. **Interactive Widget:** An interactive cost/savings slider preview.
6. **Accent Feature:** An API uptime latency graph representation.

Using six uniform card boxes would create visual monotony and waste valuable spatial real estate. Using an asymmetrical bento grid provides a clear focal point and organizes different content formats (charts, quote, sliders, text) into a harmonious block.

---

## The Desktop Layout Grid Blueprint (1200px+)

The desktop layout is built on a **4-column by 2-row master grid**.
Each row has an explicit track height of `240px` (or `grid-auto-rows: minmax(240px, auto)` to handle long text).
Grid gap is set to `20px` (`gap: var(--space-m)`).

```text
+-----------------------------------------------------------------------------------------------------+
|                                 DevMetrics Core Capabilities                                        |
|                                                                                                     |
|  +-------------------------------------------------+  +------------------------------------------+  |
|  | [1] Core Feature (Hero Cell)                     |  | [2] Key Metric                           |  |
|  |                                                 |  |                                          |  |
|  | Column: Span 2 | Row: Span 2                    |  | Column: Span 2 | Row: Span 1             |  |
|  | Contents: Pipeline Visual + Detailed Text       |  | Contents: Large Metric "32%" + Subtext   |  |
|  | Area: Columns 1 to 2 | Rows 1 to 2               |  | Area: Columns 3 to 4 | Row 1             |  |
|  +-------------------------------------------------+  +------------------------------------------+  |
|  |                                                 |  | [3] Cost Slider (Interactive Widget)     |  |
|  |                                                 |  |                                          |  |
|  |                                                 |  | Column: Span 1 | Row: Span 1             |  |
|  |                                                 |  | Contents: Slide Range Input + Math Text  |  |
|  |                                                 |  | Area: Column 3 | Row 2                   |  |
|  +-------------------------------------------------+  +------------------------------------------+  |
|  | [4] Uptime Accent                               |  | [5] Integrations Logo Grid               |  |
|  |                                                 |  |                                          |  |
|  | Column: Span 1 | Row: Span 1                    |  | Column: Span 1 | Row: Span 1             |  |
|  | Contents: "99.99%" + mini latency wave graph    |  | Contents: 6 logo badges + description    |  |
|  | Area: Column 1 | Row 3                          |  | Area: Column 2 | Row 3                   |  |
|  +-------------------------------------------------+  +------------------------------------------+  |
|  | [6] Testimonial (Social Proof)                                                                |  |
|  |                                                                                                  |  |
|  | Column: Span 2 | Row: Span 1                                                                     |  |
|  | Contents: qualitative quote + avatar                                                             |  |
|  | Area: Columns 3 to 4 | Row 3                                                                     |  |
|  +--------------------------------------------------------------------------------------------------+
```

---

## Detailed Card Breakdown & Anatomy Specifications

### Card 1: Core Feature (The Grid Anchor / Hero Cell)
*   **Dimensions:** Spans **2 columns x 2 rows** (`grid-column: span 2; grid-row: span 2;`).
*   **Visual Dominance:** Core focal point of the section.
*   **Anatomy:**
    *   **Text Block (Top):** Heading `<h3>Real-Time Deployment Pipeline Tracking</h3>` (font size: `clamp(1.5rem, 3vw, 1.875rem)`), Paragraph description of natural-language pipeline filters.
    *   **Bleed Graphic (Bottom):** High-fidelity SVG mock of an active deployment progress bar with interactive stage indicator pills (Success, In-Progress, Pending).
    *   **Card Alignment:** Flexbox vertical column with `justify-content: space-between`.
    *   **Visual Style:** Subtle dark brand background gradient, high contrast white text. Graphic bleeds off the bottom and right edges of the card, masked by `overflow: hidden`.

### Card 2: Key Metric
*   **Dimensions:** Spans **2 columns x 1 row** (`grid-column: span 2; grid-row: span 1;`).
*   **Anatomy:**
    *   **Layout:** 50/50 split. Left side displays a giant numeric metric (`font-size: var(--space-3xl)` / `4.5rem`) styled in brand green: **"32%"**. Right side contains a supporting paragraph: **"Reduction in cycle time from commit to production."**
    *   **Visual Style:** Clean card surface with subtle light-gray background to pop against the main dark page background.

### Card 3: Cost/Savings Slider (Interactive Widget)
*   **Dimensions:** Spans **1 column x 1 row** (`grid-column: span 1; grid-row: span 1;`).
*   **Anatomy:**
    *   **Header:** `<h4>Savings Calculator</h4>`.
    *   **Content:** A styled range slider widget that lets prospective buyers estimate annual developer hours saved.
    *   **Interaction:** Tabbing focus targets the slider input. On-screen calculation text updates instantly.
    *   **Touch target:** Drag thumb is a large 24x24px circle with a `10px` invisible touch buffer (meeting WCAG 2.2 2.5.8).

### Card 4: Uptime Accent
*   **Dimensions:** Spans **1 column x 1 row** (`grid-column: span 1; grid-row: span 1;`).
*   **Anatomy:**
    *   **Heading:** `<h4>Platform Latency</h4>`.
    *   **Contents:** Giant text "99.99%" centered. Below, a low-density SVG wave graph colored in healthy cyan representing smooth latency.
    *   **Visual Style:** Clean, high-contrast, minimalist accent.

### Card 5: Integrations Grid
*   **Dimensions:** Spans **1 column x 1 row** (`grid-column: span 1; grid-row: span 1;`).
*   **Anatomy:**
    *   **Heading:** `<h4>Your Stack Connected</h4>`.
    *   **Contents:** A 3x2 grid of tech integration logos (GitHub, GitLab, Slack, AWS, JIRA, Datadog) displayed in circular badges with muted gray backgrounds. Below the badges is a brief link "View all 40+ integrations".
    *   **Link touch target:** Link is styled as an inline block with a target height of 44px on touch viewports.

### Card 6: Testimonial (Social Proof)
*   **Dimensions:** Spans **2 columns x 1 row** (`grid-column: span 2; grid-row: span 1;`).
*   **Anatomy:**
    *   **Quote Body:** `"Implementing DevMetrics transformed our shipping frequency overnight. We went from nervous bi-weekly releases to automated daily deploys with total confidence."`
    *   **Citation:** `— Sarah Jenkins, Lead DevOps Engineer @ SaaSify`.
    *   **Avatar:** Circular image (`40px` diameter) aligned inline with the citation text.

---

## Accessibility & Keyboard Navigation Mapping

Because the bento cells are placed in an asymmetrical layout, we must ensure that keyboard tab-focus and screen-readers read the content in a **logical reading sequence**, matching the semantic importance, not the visual random coordinates.

The physical HTML DOM is structured sequentially as follows:

```html
<section class="bento-feature-section" aria-labelledby="section-heading">
  <!-- 1. Section Header -->
  <header class="section-header">
    <h2 id="section-heading">DevMetrics Core Capabilities</h2>
  </header>

  <!-- 2. Bento Container -->
  <div class="bento-grid-container">

    <!-- Card 1: Core Feature (Hero - Tab index 1st inside grid) -->
    <article class="bento-card card-hero" aria-labelledby="card-hero-title">
      <h3 id="card-hero-title">Real-Time Deployment Pipeline Tracking</h3>
      <p>Streamline workflows with natural-language filters...</p>
      <div class="pipeline-graphic" aria-hidden="true">...</div>
      <a href="/pipeline" class="bento-card-link">Explore pipelines</a>
    </article>

    <!-- Card 2: Key Metric (Tab index 2nd inside grid) -->
    <article class="bento-card card-metric" aria-labelledby="card-metric-title">
      <div class="metric-val" id="card-metric-title">32%</div>
      <p class="metric-desc">Reduction in cycle time from commit to production.</p>
    </article>

    <!-- Card 3: Interactive Slider (Tab index 3rd inside grid) -->
    <article class="bento-card card-slider" aria-labelledby="card-slider-title">
      <h3 id="card-slider-title">Savings Calculator</h3>
      <label for="hours-slider">Estimate annual developer hours saved</label>
      <input type="range" id="hours-slider" min="10" max="1000" value="150" />
      <output for="hours-slider">Calculated Savings: $14,500/year</output>
    </article>

    <!-- Card 4: Uptime Accent (Tab index 4th inside grid) -->
    <article class="bento-card card-uptime" aria-labelledby="card-uptime-title">
      <h3 id="card-uptime-title">Platform Latency</h3>
      <div class="uptime-val">99.99%</div>
      <div class="uptime-graph" aria-hidden="true">...</div>
    </article>

    <!-- Card 5: Integrations (Tab index 5th inside grid) -->
    <article class="bento-card card-integrations" aria-labelledby="card-integrations-title">
      <h3 id="card-integrations-title">Your Stack Connected</h3>
      <div class="logo-grid" aria-hidden="true">...</div>
      <a href="/integrations" class="bento-card-link">View all 40+ integrations</a>
    </article>

    <!-- Card 6: Testimonial (Tab index 6th inside grid) -->
    <article class="bento-card card-testimonial" aria-labelledby="card-testimonial-title">
      <h3 id="card-testimonial-title" class="sr-only">What customers say</h3>
      <blockquote>
        <p>"Implementing DevMetrics transformed our shipping frequency overnight..."</p>
        <footer>
          <img src="sarah.jpg" alt="" aria-hidden="true" />
          <cite>— Sarah Jenkins, Lead DevOps Engineer @ SaaSify</cite>
        </footer>
      </blockquote>
    </article>

  </div>
</section>
```

### Tab Sequence Walkthrough:
1.  **Skip to content link:** Fires before entering the main section.
2.  **Card 1 Link (`Explore pipelines`):** Focuses naturally inside the first card (Core Hero).
3.  **Card 3 Slider (`#hours-slider`):** Focuses the range input within the third card (Savings Calculator).
4.  **Card 5 Link (`View all 40+ integrations`):** Focuses the link within the fifth card (Integrations Grid).
5.  This ensures focus flows smoothly in reading order (Card 1 -> Card 2 -> Card 3 -> Card 4 -> Card 5 -> Card 6) without jumping backward in space.

---

## Responsive Breakpoint Adaptation Plan

To prevent the complex grid from shrinking cards into illegible vertical lines, the layout morphs across standard breakpoints.

### Desktop Breakpoint (1200px+)
*   **Columns:** 4 columns, equal fractions (`1fr`).
*   **Rows:** 3 horizontal tracks, height `240px`.
*   **Behavior:** Complex asymmetrical layouts are enabled. Explicit aspect ratios (e.g., 2:2, 2:1, 1:1) are maintained.

```css
.bento-grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(240px, auto);
  gap: var(--space-m);
}
.card-hero { grid-column: span 2; grid-row: span 2; }
.card-metric { grid-column: span 2; grid-row: span 1; }
.card-slider { grid-column: span 1; grid-row: span 1; }
.card-uptime { grid-column: span 1; grid-row: span 1; }
.card-integrations { grid-column: span 1; grid-row: span 1; }
.card-testimonial { grid-column: span 2; grid-row: span 1; }
```

### Tablet Breakpoint (768px - 1199px)
*   **Columns:** Grid shifts to **2 columns** (`repeat(2, 1fr)`).
*   **Rows:** Dynamic heights.
*   **Spans Map Adjustment:**
    *   **Card 1 (Hero):** Stays at `grid-column: span 2; grid-row: span 2;` (occupies full width of the tablet viewport, drawing focus immediately).
    *   **Card 2 (Metric):** Stays at `grid-column: span 2;` (full width row).
    *   **Card 3 (Slider):** Scales to `grid-column: span 1;` (half-width card).
    *   **Card 4 (Uptime):** Scales to `grid-column: span 1;` (half-width card, sits next to Slider).
    *   **Card 5 (Integrations):** Scales to `grid-column: span 1;` (half-width card).
    *   **Card 6 (Testimonial):** Scales to `grid-column: span 2;` (full-width row, sits at the bottom).

```css
@media (max-width: 1199px) {
  .bento-grid-container {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
  }
  .card-hero { grid-column: span 2; grid-row: span 2; }
  .card-metric { grid-column: span 2; }
  .card-slider { grid-column: span 1; }
  .card-uptime { grid-column: span 1; }
  .card-integrations { grid-column: span 1; }
  .card-testimonial { grid-column: span 2; }
}
```

### Mobile Breakpoint (below 768px)
*   **Columns:** Collapses completely to **1 column** (`grid-template-columns: 1fr`).
*   **Rows:** Remove custom row spans (`grid-row: auto`) and custom height parameters to let each card's internal contents define its natural height.
*   **Order of Stacking:** Cards stack vertically in physical DOM sequence (1, 2, 3, 4, 5, 6).

```css
@media (max-width: 767px) {
  .bento-grid-container {
    grid-template-columns: 1fr;
    gap: var(--space-s);
  }
  .bento-card {
    grid-column: span 1 !important;
    grid-row: auto !important;
  }
}
```
