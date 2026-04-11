# Typographic Scales & Accessibility Reference

## Common Typographic Ratios
Selecting a ratio determines the "energy" of your design.

| Name | Ratio | Best Use Case |
| :--- | :--- | :--- |
| **Minor Second** | 1.067 | Product dashboards, data-heavy apps. |
| **Major Second** | 1.125 | Clean, modern interfaces with subtle hierarchy. |
| **Minor Third** | 1.200 | Blogs, news sites, standard documentation. |
| **Major Third** | 1.250 | Marketing sites, SaaS landing pages (standard). |
| **Perfect Fourth** | 1.333 | Portfolio sites, creative agencies. |
| **Augmented Fourth**| 1.414 | High-impact headlines, editorial design. |
| **Golden Ratio** | 1.618 | Extremely high contrast, bold artistic statements. |

## Accessibility Considerations

### 1. Minimum Font Size (WCAG)
While WCAG doesn't strictly mandate a minimum body font size, the industry standard for readability is **16px (1rem)**. In a fluid system, ensure your `min-size` for body text does not drop below this value.

### 2. User Scaling (WCAG 1.4.4)
Users must be able to resize text up to 200% without loss of content or functionality.
- **Rule:** Use `rem` or `em` units for all font-size definitions.
- **Rule:** Avoid using `vw` or `vh` alone (e.g., `font-size: 5vw;`). This prevents the text from growing when the user uses the browser's zoom feature. `clamp()` solves this by allowing a mix of units.

### 3. Line Height (Leading)
As text size increases, the relative line height often needs to decrease slightly for headings.
- **Body:** 1.5 to 1.6
- **Headings:** 1.1 to 1.3

### 4. Line Length (Measure)
For optimal readability, aim for **45 to 75 characters per line**.
- **Constraint:** Use `max-width` on text containers (e.g., `max-width: 65ch;`) to prevent lines from becoming too long on large viewports as the font scales.

## The Math of Fluid Typography
The preferred value in `clamp(min, preferred, max)` is calculated using linear interpolation:

1. **Calculate Slope:** `(max_size - min_size) / (max_viewport - min_viewport)`
2. **Calculate Y-Intercept:** `min_size - (slope * min_viewport)`
3. **Preferred Value:** `(y_intercept)rem + (slope * 100)vw`

*Note: Ensure all values are converted to the same unit (rem or px) before calculating.*
