# Split-Screen Layout & Accessibility Technical Reference

This reference document provides technical specifications, responsive rules, spatial formulas, and accessibility requirements for implementing split-screen layouts.

---

## 1. Viewport Height (`vh` vs `dvh`) & Overflow Mechanics

Mobile browsers (iOS Safari, Android Chrome) dynamically shrink and expand the viewport when the address bar auto-hides during scrolling. Using standard `height: 100vh` causes content at the bottom of a panel to get obscured by browser navigation bars.

### CSS Height Rule Hierarchy

```css
.split-layout {
  /* Step 1: Baseline fallback for legacy browsers */
  min-height: 100vh;

  /* Step 2: Modern Dynamic Viewport Height standard */
  min-height: 100dvh;
}
```

### Scroll Locking & Overscroll Behavior
When one panel contains long scrollable content while the other panel remains fixed, set `overscroll-behavior: contain` to prevent parent document scroll bleeding:

```css
.panel-scrollable {
  height: 100dvh;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
```

---

## 2. Spatial Composition & Split Ratio Formulas

| Split Ratio | CSS Grid Definition | Use Case | Visual Weight Allocation |
| :--- | :--- | :--- | :--- |
| **50 / 50 Equal Split** | `grid-template-columns: 1fr 1fr;` | Authentication, Sign Up, Brand vs Action balance | 50% Narrative / 50% Action |
| **60 / 40 Visual Focus** | `grid-template-columns: 60% 40%;` | 3D Product Canvas, Image Gallery Showcase | 60% Visual Anchor / 40% Control Rail |
| **40 / 60 Action Focus** | `grid-template-columns: 40% 60%;` | Detailed Multi-step Form, Lead Gen Pricing | 40% Trust Badges / 60% Form Fields |

---

## 3. Responsive Stacking & Mobile Order Rules

On viewports narrower than `1024px`, 2-column split screens must collapse gracefully into a 1-column stack.

### Rule A: Action-First Mobile Stacking (Form / Conversion Focus)
For login, signup, or lead generation screens, the action panel must stack on top so mobile users don't have to scroll past marketing imagery.

```css
@media (max-width: 1023px) {
  .split-layout {
    display: flex;
    flex-direction: column-reverse; /* Action panel B stacks above Visual panel A */
  }
}
```

### Rule B: Visual-First Mobile Stacking (Editorial / Customizer Focus)
For product customizers or photo showcases, cap the height of the visual panel to act as a hero banner above the controls.

```css
@media (max-width: 1023px) {
  .split-layout {
    display: flex;
    flex-direction: column;
  }

  .panel-visual {
    height: 35vh;
    min-height: 240px;
  }
}
```

---

## 4. Accessibility & Contrast (WCAG AA Checklist)

### WCAG 2.1 SC 1.4.3 Contrast Minimums
- **Panel A (Dark Backdrop):** Foreground text `#FFFFFF` on `#0B132B` achieves **17.9:1** contrast (Exceeds 4.5:1 AA and 7:1 AAA).
- **Panel B (Light Backdrop):** Foreground text `#0F172A` on `#FFFFFF` achieves **16.1:1** contrast.
- **Focus Rings:** Ensure high-contrast focus rings match the active panel backdrop:
  - Dark Panel focus ring: `#60A5FA` (Light Blue) or `#FFFFFF`.
  - Light Panel focus ring: `#2563EB` (Dark Blue) or `#000000`.

### WCAG 2.1 SC 1.3.2 Meaningful Sequence
Keyboard tab order (`Tab` / `Shift+Tab`) must move logically through DOM nodes. Never use CSS `order` or negative margins to pull interactive form controls from Panel B into Panel A visual space in a way that breaks reading order.

### WCAG 2.1 SC 1.4.4 Resize Text (200% Zoom)
Panels must use `min-height` rather than hardcoded fixed `height` so that text enlarged to 200% via browser settings expands container heights without clipping text.
