# Split-Screen Layout & Accessibility Technical Reference

This reference guide provides spatial ratios, contrast guidelines, DOM ordering heuristics, and WCAG AA accessibility rules for building dual-panel split-screen layouts.

---

## 1. Grid Ratios & Spatial Intent Matrix

Selecting the proper split ratio depends on the visual hierarchy and primary action goals of the page:

| Split Ratio | Visual Weight Distribution | Primary Use Case | CSS Grid Implementation |
| :--- | :--- | :--- | :--- |
| **50 / 50 Balanced** | Equal prominence for narrative and visual art. | Gateway Auth screens, Login/Sign-up, Product comparison. | `grid-template-columns: 1fr 1fr;` |
| **60 / 40 Feature Focus** | 60% assigned to interactive preview canvas; 40% to copy. | Interactive product heroes, SaaS dashboard demos. | `grid-template-columns: 3fr 2fr;` or `1.2fr 0.8fr;` |
| **40 / 60 Form Focus** | 40% assigned to brand art; 60% to multi-field inputs. | Complex registration forms, checkout split screens. | `grid-template-columns: 2fr 3fr;` or `0.8fr 1.2fr;` |

---

## 2. DOM Reading Order vs. Visual Stacking Rules

CSS Grid allows visual positioning (`order` or grid-column assignment) to diverge from raw DOM tree order. To ensure keyboard navigation and screen readers operate logically, follow these heuristics:

```text
[ Desktop View (50/50 Split) ]
+----------------------------+----------------------------+
| Pane B (DOM Order #1)      | Pane A (DOM Order #2)      |
| Interactive Form (<main>)  | Brand Art (<aside>)        |
| Visual Position: LEFT      | Visual Position: RIGHT     |
+----------------------------+----------------------------+

[ Mobile View (<768px Stacked) ]
+----------------------------+
| Pane B (DOM Order #1)      |
| Interactive Form (<main>)  | <- First on Mobile Screen
+----------------------------+
| Pane A (DOM Order #2)      |
| Brand Art (<aside>)        | <- Second on Mobile Screen
+----------------------------+
```

### Order Rules
1. **Auth & Form Pages:** Place `<main>` (the interactive form pane) **first** in the DOM tree. Mobile viewports will naturally display the form at the top of the single-column stack, allowing instant access to input fields.
2. **Hero & Landing Pages:** Place `<main>` (the value prop headline and primary CTA) **first** in the DOM tree, followed by `<aside>` or `<section>` (the visual mockup).
3. **Never Use Unconstrained `order` Overrides:** Avoid using CSS `order: 2` to move focusable inputs visual order without matching DOM structure, as this creates a broken keyboard navigation flow (WCAG SC 1.3.2 Meaningful Sequence).

---

## 3. WCAG 2.1 AA Accessibility & Contrast Checklist

### SC 1.4.3 Contrast (Minimum)
- **Normal Text (<18pt or <14pt bold):** Minimum **4.5:1** contrast against panel background.
- **Large Text (≥18pt or ≥14pt bold):** Minimum **3.0:1** contrast against panel background.
- **Asymmetric Background Theme Rules:**
  - Dark Panel (`#0F172A`): Primary text `#F8FAFC` (15.8:1 ratio), Secondary text `#94A3B8` (7.2:1 ratio).
  - Light Panel (`#FFFFFF`): Primary text `#0F172A` (19.1:1 ratio), Secondary text `#475569` (8.9:1 ratio).

### SC 2.4.7 Focus Visible
- Focus indicators on all form fields and action triggers must be clearly visible against both light and dark pane background surfaces:
  - `outline: 2px solid #2563EB; outline-offset: 2px;`

### SC 2.5.8 Target Size (Minimum)
- All interactive triggers (buttons, inputs, links) must satisfy a minimum target size of **24x24px** (desktop) and **44x44px** (mobile touch viewports).

### Landmark Structure
```html
<!-- Form Pane Landmark -->
<main class="split-pane-form" aria-label="Account Login">
  <h1>Sign In</h1>
  ...
</main>

<!-- Visual Pane Landmark -->
<aside class="split-pane-visual" aria-label="Customer Success Highlights">
  ...
</aside>
```
