# Split-Screen Layout & Accessibility Reference

This reference document provides technical layout rules, dynamic viewport behavior, contrast matrix guidelines, and WCAG AA accessibility standards for implementing dual-panel split-screen systems.

---

## 1. Spatial Split Ratio Matrix

When designing a split-screen layout, choose a column ratio based on content density, visual weight, and user task priority:

| Split Ratio | CSS Grid Specification | Primary Panel Focus | Supporting Panel Role | Recommended Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **50 / 50 (Symmetrical)** | `grid-template-columns: 1fr 1fr;` | Equals visual priority | Equals visual priority | Sign In / Sign Up screens, 2-option decision portals, login with testimonial. |
| **60 / 40 (Primary Heavy)** | `grid-template-columns: 3fr 2fr;` | Primary task (60%) | Sticky summary/meta (40%) | Checkout forms with sticky order summary, complex multi-step input flows. |
| **40 / 60 (Visual Heavy)** | `grid-template-columns: 2fr 3fr;` | Compact controls (40%) | Immersive preview (60%) | Product configurator, SaaS hero section with app preview, portfolio gallery. |

---

## 2. Dynamic Viewport Height Units (`100dvh`)

A common bug on mobile Safari and Chrome occurs when developers set `height: 100vh` on full-screen split layouts. Mobile browser address bars collapse and expand dynamically during scroll, causing static `100vh` containers to overflow the viewport and hide bottom submit buttons.

### Implementation Protocol:
```css
.split-screen-container {
  /* Fallback for older browsers */
  min-height: 100vh;

  /* Dynamic Viewport Height: automatically adjusts when address bar expands/collapses */
  min-height: 100dvh;
}

@media (min-width: 1024px) {
  .split-screen-container {
    /* Desktop: lock to viewport height */
    height: 100dvh;
    overflow: hidden;
  }
}
```

---

## 3. DOM Order Priority vs Visual Order

To satisfy WCAG 2.1 Success Criterion 1.3.2 (Meaningful Sequence) and 2.4.3 (Focus Order), the primary actionable panel MUST always be ordered first in HTML markup:

```html
<!-- CORRECT: Primary interactive content is 1st in DOM -->
<div class="split-screen-container">
  <main class="split-panel--primary">
    <!-- Form controls -->
  </main>

  <aside class="split-panel--secondary">
    <!-- Supporting brand visuals or social proof -->
  </aside>
</div>
```

If visual design requires placing the form panel visually on the **right** side of the screen on desktop:
```css
@media (min-width: 1024px) {
  .split-screen-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* Visually swap panel positions without breaking HTML DOM order */
  .split-panel--primary {
    grid-column: 2;
  }

  .split-panel--secondary {
    grid-column: 1;
  }
}
```

---

## 4. Contrast Seam Matrix & WCAG AA Compliance

Split-screen layouts often place a light-themed panel directly adjacent to a dark-themed panel. Ensure text and UI control boundaries comply with WCAG AA requirements:

| Element Type | Light Panel Requirement | Dark Panel Requirement | Min Contrast Ratio |
| :--- | :--- | :--- | :--- |
| **Body Text** | `#0F172A` on `#FFFFFF` | `#F8FAFC` on `#0F172A` | 4.5:1 (Achieves 15:1+) |
| **Subtle Muted Text** | `#475569` on `#FFFFFF` | `#94a3b8` on `#0F172A` | 4.5:1 |
| **Form Input Focus Ring** | 3px `#2563EB` ring | 3px `#38BDF8` ring | 3:1 minimum |
| **Panel Boundary Divider** | `#E2E8F0` solid border | `#334155` solid border | 3:1 against background |
