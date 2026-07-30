# Bento Grid Ratios & Accessibility Reference Guide

This reference guide outlines the mathematical proportions, geometric calculations, and accessibility guidelines essential for designing clean, high-performance Bento Grid layouts.

---

## 1. Grid Geometry & Mathematical Ratios

To maintain a consistent aesthetic, Bento Grid tracks should follow strict proportional rules. By grounding the layout in a **base square unit**, cells remain structurally predictable across all visual sizes.

### Proportional Unit Grid
Let `U` be the base track size (e.g., `180px` or `200px`). The layout dimensions of any card can be derived from simple integer multipliers:

| Card Type | Grid Span Formula | Resulting Ratio | Perfect Use Cases |
| :--- | :--- | :---: | :--- |
| **Square (1x1)** | `1U` x `1U` | `1:1` | Single high-level KPI, brand icon, category button. |
| **Wide Rectangle (2x1)** | `2U` x `1U` | `2:1` | Short timeline, user testimonial, horizontal integration grid. |
| **Tall Rectangle (1x2)** | `1U` x `2U` | `1:2` | Vertically stacked list of steps, narrow device mockups. |
| **Large Square (2x2)** | `2U` x `2U` | `1:1` | Hero element, major interactive canvas, complex trend chart. |
| **Cinema Banner (3x2)** | `3U` x `2U` | `3:2` | Ultra high-impact showcase of complex SaaS dashboard. |

---

## 2. The Concentric Border Radius Rule

One of the most common visual defects in custom grid designs is "radius mismatching." When cards with border-radii sit inside a container that also has a border-radius, or when elements are nested inside a card, the corner curves will clash if they are set to the exact same value.

To achieve perfect visual concentricity (corners that curve smoothly together), follow this geometric formula:

$$\text{Outer Radius} = \text{Inner Radius} + \text{Gap Size}$$

Or, for nesting cards inside a container:

$$\text{Container Radius} = \text{Card Radius} + \text{Grid Gap}$$

### Visual Example:
- **Card Border Radius (Inner):** `16px`
- **Grid Gap (Gap):** `12px`
- **Container Border Radius (Outer):** `16px + 12px = 28px`

### CSS Token Blueprint:
```css
:root {
  --grid-gap: 16px;
  --card-radius: 12px;
  /* Mathematically aligned concentric outer container radius */
  --container-radius: calc(var(--card-radius) + var(--grid-gap)); /* 28px */
}

.bento-outer-wrapper {
  padding: var(--grid-gap);
  border-radius: var(--container-radius);
  background: var(--surface-bg-muted);
}

.bento-card {
  border-radius: var(--card-radius);
  background: var(--surface-bg-card);
}
```

---

## 3. DOM Ordering & Focus Navigation Specs

### The "Z-Pattern" Parsing Principle
Screen readers and keyboard navigation (Tab key) parse the HTML document sequentially as a 1D stream, while the visual layout is a complex 2D canvas. If cards are positioned out of order to satisfy a visual layout trick, users with assistive devices will experience severe confusion as their focus jumps chaotically around the page.

To comply with **WCAG 2.1 AA (SC 1.3.2 Meaningful Sequence / SC 2.1.1 Keyboard)**, design bento grids using the **Left-to-Right, Top-to-Bottom (Z-Pattern) DOM order**:

```text
Visual Layout Flow (Z-Pattern):
[Card 1: Span 2x2] ---> [Card 2: Span 2x1]
[Card 1 (continued)] -> [Card 3: Span 1x1] -> [Card 4: Span 1x1]
[Card 5: Span 1x1] ---> [Card 6: Span 3x1]

Physical DOM Order (Match this EXACTLY):
1. <article class="card-1"> (Hero Card)
2. <article class="card-2"> (Supporting Wide)
3. <article class="card-3"> (Accent 1)
4. <article class="card-4"> (Accent 2)
5. <article class="card-5"> (Accent 3)
6. <article class="card-6"> (Supporting Wide)
```

### The CSS Grid Placement Fix
Use CSS Grid coordinates (`grid-column` and `grid-row`) to place cards visually, instead of reordering them in the HTML. Keep the DOM sequential:

```css
/* Cards are declared in HTML in order 1, 2, 3, 4, 5, 6 */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "card1 card1 card2 card2"
    "card1 card1 card3 card4"
    "card5 card6 card6 card6";
}

.card-1 { grid-area: card1; }
.card-2 { grid-area: card2; }
.card-3 { grid-area: card3; }
.card-4 { grid-area: card4; }
.card-5 { grid-area: card5; }
.card-6 { grid-area: card6; }
```

---

## 4. Typography Scale & Density Matrix

Because bento cells vary dramatically in size, text styles must scale dynamically to fit their containers without overflow or awkward line wraps.

| Card Size | Max Headline Length | Max Body Length | Head Size (Desktop) | Description Size (Desktop) |
| :---: | :--- | :--- | :--- | :--- |
| **Square (1x1)** | 15 characters | Omit or 1 line | `1.125rem` (18px) | `0.875rem` (14px) |
| **Wide (2x1)** | 35 characters | 2-3 lines | `1.5rem` (24px) | `1rem` (16px) |
| **Tall (1x2)** | 20 characters | 4 lines | `1.25rem` (20px) | `0.875rem` (14px) |
| **Large (2x2)** | 50 characters | Unlimited | `2rem` (32px) | `1.125rem` (18px) |

---

## 5. CSS Grid Implementation Reference Cheat Sheet

Here is a quick-copy responsive CSS blueprint using CSS Grid and container queries to structure a clean, portable bento container.

```css
/* Base Container setup */
.bento-section-wrapper {
  container-type: inline-size;
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: clamp(16px, 2cqi, 24px); /* Fluid gap based on container width */
}

/* Card Styling base */
.bento-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(16px, 3cqi, 28px);
  border-radius: 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
}

/* Default Column Spans (Desktop) */
.card-hero {
  grid-column: span 2;
  grid-row: span 2;
}
.card-wide {
  grid-column: span 2;
  grid-row: span 1;
}
.card-square {
  grid-column: span 1;
  grid-row: span 1;
}

/* Tablet Layout (2-column mapping) */
@container (max-width: 900px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
  }
  .card-hero {
    grid-column: span 2;
    grid-row: auto;
  }
  .card-wide {
    grid-column: span 2;
  }
  .card-square {
    grid-column: span 1;
  }
}

/* Mobile Layout (Full stack) */
@container (max-width: 600px) {
  .bento-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .bento-card {
    grid-column: span 1 !important;
    grid-row: auto !important;
    padding: 16px;
  }
}
```
