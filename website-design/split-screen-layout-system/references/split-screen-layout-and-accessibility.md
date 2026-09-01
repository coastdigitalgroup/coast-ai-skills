# Split-Screen Layout & Accessibility Reference Guide

Quick reference rules, mathematical spatial ratios, contrast guidelines, and ARIA patterns for split-screen website designs.

---

## 1. Proportional Ratio & Width Grid Reference

| Target Split Ratio | Left Panel Width (`Desktop`) | Right Panel Width (`Desktop`) | CSS Grid Specification | Ideal Content Type Pairings |
| :--- | :--- | :--- | :--- | :--- |
| **50 / 50 Equal Split** | `50%` | `50%` | `grid-template-columns: 1fr 1fr;` | Auth pages, binary pricing tiers, symmetrical landing page heroes. |
| **60 / 40 Action Heavy** | `60%` | `40%` | `grid-template-columns: 6fr 4fr;` | Complex multi-step checkout forms, interactive quote calculators + summary. |
| **40 / 60 Media Heavy** | `40%` | `60%` | `grid-template-columns: 4fr 6fr;` | Minimal copy hero + interactive code sandbox / 3D product visualizer. |
| **33 / 67 Sidebar Split** | `33%` | `67%` | `grid-template-columns: 1fr 2fr;` | Fixed navigation/filter drawer + scrolling product / card grid feed. |

---

## 2. Dynamic Viewport & Height Heuristics

### Height Property Guidelines

```text
Full Viewport App / Auth Page:
  DO:     min-height: 100dvh;
  DON'T:  height: 100vh; /* Causes vertical overflow/clipping on mobile Safari/Chrome */

Sticky Media + Long Scrolling Text Page:
  Desktop Media Panel CSS:
    position: sticky;
    top: 0;
    height: 100dvh;
    overflow: hidden;
```

### Mobile Breakpoint Rules

- **Default Stacking Point:** Collapse to `1 column` (`grid-template-columns: 1fr`) at `768px` or `1024px` depending on content density.
- **Form Priority Rule:** When stacking on mobile, place conversion elements (e.g., email sign-up, payment form) visually above secondary decorative media unless narrative context is strictly required prior to input.
- **Touch Target Floor:** All interactive controls (buttons, input fields, links) must maintain a minimum height/width of `44px` on touch viewports (`< 768px`).

---

## 3. WCAG AA Contrast & Surface Theme Matrix

When split panels use contrasting color themes (e.g., Dark Left Panel paired with Light Right Panel), strict contrast rules must be enforced across panel boundaries:

| Surface Pair | Left Background | Left Text Token | Right Background | Right Text Token | Min Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dark / Light Split** | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | `#FFFFFF` (Pure White) | `#0F172A` (Slate 900) | `15.8:1` (Left) / `19.2:1` (Right) |
| **Light / Dark Split** | `#FAFAFA` (Zinc 50) | `#18181B` (Zinc 900) | `#18181B` (Zinc 900) | `#F4F4F5` (Zinc 100) | `17.4:1` (Left) / `14.2:1` (Right) |
| **Brand Blue / Light** | `#1E40AF` (Blue 800) | `#FFFFFF` (Pure White) | `#F0F9FF` (Sky 50) | `#0C4A6E` (Sky 900) | `8.6:1` (Left) / `13.1:1` (Right) |

### Focus Indicator Isolation Strategy

Focus rings must remain clearly visible regardless of which panel receives keyboard focus:

```css
/* High Contrast Dual Outline for Light Panels */
.split-panel--light :focus-visible {
  outline: 3px solid #2563EB; /* High-contrast blue */
  outline-offset: 2px;
}

/* High Contrast Dual Outline for Dark Panels */
.split-panel--dark :focus-visible {
  outline: 3px solid #60A5FA; /* Bright sky blue */
  outline-offset: 2px;
}
```

---

## 4. DOM Order & Screen Reader Accessibility Checklist

- [ ] **Semantic Landmarking:** Wrap the overall container in a `<main>` tag, and use distinct `<section>` tags with `aria-labelledby` attributes for both left and right panels.
- [ ] **Heading Outline Hierarchy:** Enforce a logical heading structure (`<h1>` in primary hero panel, `<h2>` in supporting panel). Never skip heading levels across split panels.
- [ ] **Linear Tab Order:** Ensure keyboard focus moves sequentially down the DOM without `tabindex` values greater than `0`.
- [ ] **Scroll Trap Prevention:** Do not apply `overflow: hidden` to the main document `<body>` while allowing inner split panels to scroll, as this breaks keyboard page navigation for screen readers.
