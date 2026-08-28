# Split-Screen Layouts: Spatial Proportions, Contrast & Accessibility Reference

This reference document provides technical guidance, spatial ratio formulas, contrast standards, and WCAG AA accessibility compliance rules for implementing split-screen layouts.

---

## 1. Spatial Proportions & Grid Blueprint

Split-screen layouts depend on proportional relationships between panels to establish visual hierarchy.

### Standard Proportion Matrix

| Ratio Config | Primary Panel Width | Secondary Panel Width | Primary Purpose | CSS Grid Definition |
| :--- | :--- | :--- | :--- | :--- |
| **50 / 50** | 50% | 50% | Dual choice gateways, equal-density plan comparison. | `grid-template-columns: 1fr 1fr;` |
| **40 / 60** | 40% | 60% | Auth pages (Form 40% / Branding Artwork 60%). | `grid-template-columns: 40% 60%;` |
| **60 / 40** | 60% | 40% | Hero feature showcase (Headline/CTA 60% / Preview 40%). | `grid-template-columns: 60% 40%;` |
| **33 / 67** | 33.3% | 66.7% | High-density tool workspaces (Tool Bar 33% / Canvas 67%). | `grid-template-columns: 1fr 2fr;` |

---

## 2. Contrast & Theme Bridging Standards

Split-screen layouts frequently pair contrasting light and dark surface themes across the panel boundary (e.g., `#FFFFFF` Form Panel adjacent to `#0F172A` Visual Media Panel).

### Contrast Ratios (WCAG AA & AAA Standards)

- **Light Surface Text (`#111827` on `#FFFFFF`):** Contrast ratio of **16.5:1** (Exceeds WCAG AAA 7:1 floor).
- **Dark Surface Text (`#F8FAFC` on `#0F172A`):** Contrast ratio of **15.8:1** (Exceeds WCAG AAA 7:1 floor).
- **Muted Label Text (`#475569` on `#FFFFFF`):** Contrast ratio of **7.1:1** (Passes WCAG AA for body text).
- **Secondary Caption Text (`#94A3B8` on `#0F172A`):** Contrast ratio of **4.8:1** (Passes WCAG AA 4.5:1 minimum).

### Focus Visible Ring Adaptations
Keyboard focus indicators must remain high contrast on both panels:
- **Light Panel Focus Ring:** `outline: 3px solid #2563EB; outline-offset: 2px;` (Blue focus indicator against white surface).
- **Dark Panel Focus Ring:** `outline: 3px solid #60A5FA; outline-offset: 2px;` (Light blue focus indicator against dark slate surface).

---

## 3. DOM Source Order vs. Visual Placement

A major failure pattern in split-screen layouts is placing decorative media before functional headings and interactive controls in the HTML source code.

```text
INCORRECT DOM SOURCE ORDER (Visual First):
<div class="split-wrapper">
  <div class="media-panel">
    <!-- Screen reader reads decorative graphic first -->
    <img src="artwork.png" alt="Decoration">
  </div>
  <div class="form-panel">
    <h1>Sign In</h1> <!-- Announced second -->
  </div>
</div>

CORRECT DOM SOURCE ORDER (Semantic Priority First):
<div class="split-wrapper">
  <main class="form-panel">
    <h1>Sign In</h1> <!-- Announced immediately -->
    <form>...</form>
  </main>
  <aside class="media-panel">
    <img src="artwork.png" alt=""> <!-- Announced second or skipped if aria-hidden -->
  </aside>
</div>
```

---

## 4. Mobile Viewport Height Handling (`100dvh`)

Using fixed `height: 100vh` on mobile web viewports causes severe layout bugs because mobile browser chrome (address bar, bottom navigation) dynamically resizes the visible viewport.

### Safe Viewport Height CSS Strategy

```css
.split-screen-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;

  /* Fallback for legacy browsers */
  min-height: 100vh;

  /* Modern dynamic viewport height handling */
  min-height: 100dvh;
}

/* Reset height on mobile screens to allow content expansion */
@media (max-width: 767px) {
  .split-screen-wrapper {
    min-height: auto;
  }
}
```

---

## 5. WCAG AA Accessibility Audit Checklist

- [ ] **SC 1.3.1 Info and Relationships:** Semantic structural tags (`<main>`, `<aside>`, `<header>`) clearly designate panel roles.
- [ ] **SC 1.3.2 Meaningful Sequence:** Reading sequence in screen readers matches the logical flow of the interface regardless of desktop CSS layout order.
- [ ] **SC 1.4.3 Contrast (Minimum):** All text elements across both split panels pass 4.5:1 contrast against their respective panel fills.
- [ ] **SC 1.4.10 Reflow:** Page reflows into a single column on 320px width viewports without horizontal scrolling.
- [ ] **SC 2.4.7 Focus Visible:** Interactive elements inside both light and dark panels render clear, unclipped focus indicators.
