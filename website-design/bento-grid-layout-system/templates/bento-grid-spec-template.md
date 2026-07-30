# Bento Grid Specification & Audit Blueprint Template

Use this blueprint template to design, spec, and audit asymmetrical Bento Grid layouts in your web design projects. It ensures that visual hierarchy, proportional geometry, and accessibility-compliant keyboard/screen reader behavior are fully accounted for before code implementation begins.

---

## 1. Grid Metadata & Overall Constraints

| Property | Project Value / Token | Guidelines |
| :--- | :--- | :--- |
| **Grid Section Name** | [e.g., Features Section, Portfolio Grid] | Unique descriptor of the layout context. |
| **Desktop Columns (1200px+)** | [e.g., 4 columns (1fr each)] | Prefer 4 columns for modular factors. |
| **Grid Row Track Heights** | [e.g., 200px or auto-rows minmax] | Establish vertical track sizing strategy. |
| **Grid Gap (Gutter)** | [e.g., clamp(16px, 2vw, 24px)] | Fluid token to keep cells cohesive. |
| **Outer Margins** | [e.g., var(--space-l)] | Consistent horizontal page edge buffers. |
| **Outer Border Radius** | [e.g., 20px] | Enforce concentric outer border curves. |

---

## 2. Content Inventory & Layout Coordinates

List the cells of your Bento Grid. Ensure you have **one clear visual anchor (Hero)** to act as the primary visual entry point.

| Cell ID | Content Name & Description | Visual Asset Type | Col Span (Desktop) | Row Span (Desktop) | Area Coordinates (`col-start/span, row-start/span`) |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **C1** | *[Core Hero - e.g., Pipeline]* | *[e.g., Interactive mock]* | *[e.g., span 2]* | *[e.g., span 2]* | `grid-column: span 2; grid-row: span 2;` |
| **C2** | *[Supporting 1]* | *[e.g., Static Illustration]* | *[e.g., span 2]* | *[e.g., span 1]* | `grid-column: span 2; grid-row: span 1;` |
| **C3** | *[Supporting 2]* | *[e.g., Value Slider]* | *[e.g., span 1]* | *[e.g., span 1]* | `grid-column: span 1; grid-row: span 1;` |
| **C4** | *[Accent 1]* | *[e.g., Micro Graph]* | *[e.g., span 1]* | *[e.g., span 1]* | `grid-column: span 1; grid-row: span 1;` |
| **C5** | *[Accent 2]* | *[e.g., Integration Logos]*| *[e.g., span 1]* | *[e.g., span 1]* | `grid-column: span 1; grid-row: span 1;` |
| **C6** | *[Supporting 3]* | *[e.g., Quote block]* | *[e.g., span 2]* | *[e.g., span 1]* | `grid-column: span 2; grid-row: span 1;` |

---

## 3. Internal Cell Anatomy Specifications

Use this table to specify how contents align internally within the individual cells to prevent layout drifts.

```text
  +--------------------------------------------+
  | (Inner Padding) [--space-m]                 |
  |                                            |
  |   [Header Block]                           |
  |   <h3>Title Text</h3>                      |
  |   <p>Description line...</p>               |
  |                                            |
  |   [Content/Visual Block]                   |
  |   - Bleed: [None / Bottom / Right]         |
  |   - Align: [Flex-end / Center]             |
  |                                            |
  +--------------------------------------------+
```

| Cell ID | Heading Level | Typography Sizes | Internal Align Mode | Media Aspect Ratio | Bleed Strategy |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **C1** | `<h3>` | `font-size: clamp(1.5rem, 4vw, 2rem)` | Flex-column; space-between | `3:2` | Bleed off bottom-right. |
| **C2** | `<h3>` | `font-size: var(--step-2)` | Flex-row; center-align | `1:1` | Fully contained. |
| **C3** | `<h4>` | `font-size: var(--step-1)` | Flex-column; center | `N/A` | Contained widget. |
| **C4** | `<h4>` | `font-size: var(--step-1)` | Flex-column; space-between | `4:1` | Wave bleeds bottom-edge. |
| **C5** | `<h4>` | `font-size: var(--step-1)` | Flex-column; center | `N/A` | Contained badge list. |
| **C6** | `N/A` | `font-size: var(--step-1)` | Flex-column; center | `N/A` | Centered text quotation. |

---

## 4. Accessibility & DOM Flow Map

Verify that the DOM ordering matches logical reading order, avoiding accessibility gaps (WCAG 2.1 SC 1.3.2 / 2.1.1).

1.  **Tab Sequence Flow Chart:**
    *   Verify: Focusable elements must follow left-to-right, top-to-bottom sequence inside HTML.
    *   Map the tab flow index across cells:
        *   `Focus Target 1` (in Card __): `[Name of Interactive Element / Link]`
        *   `Focus Target 2` (in Card __): `[Name of Interactive Element / Link]`
        *   `Focus Target 3` (in Card __): `[Name of Interactive Element / Link]`
2.  **Focus Traps & Obstruction Prevention:**
    *   Ensure focus indicators (`outline`) have a contrast ratio of at least `3:1` against card surfaces.
    *   Ensure cards with focusable elements have `overflow: hidden` but let outlines bleed out cleanly, or use `outline-offset` to avoid clipping.

---

## 5. Responsive Stacking & Reflow Strategy

Map out how the asymmetrical spans change at tablet and mobile breakpoints.

| Cell ID | Desktop (1200px+) Spans | Tablet (768px-1199px) Spans | Mobile (< 767px) Spans | Stacking Order (1 to N) |
| :---: | :--- | :--- | :--- | :---: |
| **C1** | `span 2 cols, 2 rows` | `span 2 cols, 2 rows` | `span 1 col, auto height` | **1** |
| **C2** | `span 2 cols, 1 row`  | `span 2 cols, 1 row`  | `span 1 col, auto height` | **2** |
| **C3** | `span 1 col, 1 row`   | `span 1 col, 1 row`   | `span 1 col, auto height` | **3** |
| **C4** | `span 1 col, 1 row`   | `span 1 col, 1 row`   | `span 1 col, auto height` | **4** |
| **C5** | `span 1 col, 1 row`   | `span 1 col, 1 row`   | `span 1 col, auto height` | **5** |
| **C6** | `span 2 cols, 1 row`  | `span 2 cols, 1 row`  | `span 1 col, auto height` | **6** |

---

## 6. Bento Quality Assurance Audit Checklist

Run these final checks before signing off on the design:

- [ ] **Visual Anchor Present:** One card (Hero) occupies at least 35% of the bento grid area and has maximum visual weight.
- [ ] **Proportional Spacing:** Internal card padding is identical (`--space-m` or similar fluid token) across all standard cards.
- [ ] **Concentric Radii:** Card border-radius matches concentric rounding rules (`outer-radius = inner-radius + gap`).
- [ ] **DOM Match:** Tab key navigation order matches natural reading order. There are no arbitrary layout coordinate jumps.
- [ ] **Touch Target Size:** Interactive range slider thumbs, buttons, and close links are at least 24x24px (44x44px preferred).
- [ ] **Color Contrast:** All card headers and descriptions have a contrast of 4.5:1 against the background of their card.
- [ ] **Overflow Safety:** Long text in cards does not overlap visual assets. Descriptors use dynamic clamps or truncation where needed.
- [ ] **No Hardcoded Mobile Widths:** Absolutely no cards have hardcoded width pixels on mobile screens. All cells stack cleanly.
