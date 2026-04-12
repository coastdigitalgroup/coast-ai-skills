# Landing Page Grid Breakdown Example

This example demonstrates how a typical SaaS landing page layout maps to a responsive 12-column grid across three major breakpoints.

## 1. Desktop (1200px+)
**Grid Config:** 12 Columns | 24px Gutter | Auto Margins (Centered Container)

| Component | Column Span | Offset | Description |
| :--- | :---: | :---: | :--- |
| **Navbar Logo** | 2 | 0 | Brand identity on the far left. |
| **Navbar Links** | 6 | 1 | Navigation centered in the grid. |
| **Navbar CTA** | 2 | 1 | Primary action button on the far right. |
| **Hero Title** | 8 | 2 | Bold, centered headline. |
| **Hero Subtitle** | 6 | 3 | Explainer text, narrower for readability. |
| **Hero Image** | 10 | 1 | High-impact visual. |
| **Feature Cards** | 4 each | 0 | Three columns of features in a row. |
| **Footer Links** | 3 each | 0 | Four columns of links in the footer. |

---

## 2. Tablet (768px - 1199px)
**Grid Config:** 8 Columns | 24px Gutter | 32px Margins

| Component | Column Span | Offset | Description |
| :--- | :---: | :---: | :--- |
| **Navbar Logo** | 2 | 0 | Remains on the left. |
| **Navbar CTA** | 2 | 4 | Mobile-style menu toggle or primary CTA. |
| **Hero Title** | 8 | 0 | Spans full width for impact. |
| **Hero Image** | 8 | 0 | Spans full width. |
| **Feature Cards** | 4 each | 0 | Two rows of two feature cards. |

---

## 3. Mobile (0 - 767px)
**Grid Config:** 4 Columns | 16px Gutter | 16px Margins

| Component | Column Span | Offset | Description |
| :--- | :---: | :---: | :--- |
| **Navbar Logo** | 2 | 0 | Simplified brand icon. |
| **Hero Title** | 4 | 0 | Full width, reduced font size. |
| **Hero Image** | 4 | 0 | Full width, stacked below title. |
| **Feature Cards** | 4 | 0 | All cards stack vertically, 1 per row. |

---

## Visual Summary of Stacking Behavior
The most common transition is **3-column -> 2-column -> 1-column**.
- On Desktop: `[Card 1: 4 cols] [Card 2: 4 cols] [Card 3: 4 cols]` (Total 12)
- On Tablet: `[Card 1: 4 cols] [Card 2: 4 cols]` (Row 1) | `[Card 3: 4 cols] [Empty: 4 cols]` (Row 2)
- On Mobile: `[Card 1: 4 cols]` (Row 1) | `[Card 2: 4 cols]` (Row 2) | `[Card 3: 4 cols]` (Row 3)
