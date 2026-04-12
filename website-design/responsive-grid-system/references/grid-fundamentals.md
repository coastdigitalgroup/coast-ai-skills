# Grid Fundamentals & Best Practices

Understanding the underlying math and conventions of responsive grids is essential for creating clean, professional layouts.

## 1. Common Breakpoints
While there is no "perfect" set of breakpoints, these industry-standard ranges cover the vast majority of devices:

| Screen Size | Device Category | Recommended Column Count |
| :--- | :--- | :---: |
| **0 - 599px** | Mobile Portrait | 4 Columns |
| **600 - 899px** | Mobile Landscape / Small Tablets | 4 - 8 Columns |
| **900 - 1199px** | Large Tablets / Small Laptops | 8 - 12 Columns |
| **1200 - 1599px** | Desktop / Large Laptops | 12 Columns |
| **1600px+** | Wide Desktop | 12 Columns (Centered Container) |

---

## 2. Gutter Strategies
Gutters (the space between columns) define the "breathability" of your design.

- **Fixed Gutters:** Gutters stay the same size (e.g., 24px) even as the viewport changes. This is the most common approach and ensures consistent alignment for text and buttons.
- **Fluid Gutters:** Gutters scale as a percentage of the viewport (e.g., 2vw). Use this for highly expressive, immersive editorial sites.
- **Progressive Gutters:** Increasing the gutter size at larger breakpoints (e.g., 16px on mobile, 24px on tablet, 32px on desktop).

---

## 3. The "12-Column" Logic
Why 12? Because 12 is the smallest number divisible by 1, 2, 3, 4, and 6. This allows you to easily create:
- **Halves:** 6 columns + 6 columns
- **Thirds:** 4 columns + 4 columns + 4 columns
- **Quarters:** 3 columns + 3 columns + 3 columns + 3 columns
- **Golden Ratio (approx):** 8 columns + 4 columns

---

## 4. Alignment & The "Invisible Grid"
When designing with a grid, ensure that:
1.  **Edges align:** The left edge of a text block should align exactly with the left edge of a column.
2.  **No "Dead Space":** Content should span entire columns. Don't end a button halfway through a column unless it's a specific stylistic choice.
3.  **Vertical Rhythm:** While this skill focuses on the horizontal grid, try to use a baseline grid (multiples of 4px or 8px) for vertical spacing to create a cohesive look.

## 5. Accessibility Considerations
- **Logical Source Order:** Ensure that the HTML order of elements matches the visual grid order (top-to-bottom, left-to-right) so screen readers can navigate correctly.
- **Zooming:** Test your grid at 200% browser zoom. The grid should stack gracefully rather than overlapping or breaking.
- **Container Max-Width:** Limit the max-width of your content container (usually 1200px - 1440px). On ultra-wide monitors, lines of text spanning the whole screen become difficult to read.
