# Card Component Specification Template

Use this template to document the design and technical requirements for a
specific card component in your project.

## Component Name: [e.g., Product Preview Card]

### 1. Purpose & Context

- **Goal:** [e.g., Convert users from browse to product detail page]
- **Placement:** [e.g., Search results, Related products grid]

### 2. Anatomy & Elements

| Element      | Required? | Source / Type                            |
| :----------- | :-------- | :--------------------------------------- |
| **Media**    | Yes       | Image (Product Photo) - 1:1 Aspect Ratio |
| **Badge**    | No        | Text (e.g., "Sale", "New")               |
| **Headline** | Yes       | H3 (Product Name)                        |
| **Subhead**  | No        | Text (Brand or Category)                 |
| **Price**    | Yes       | Text (Current + Original Price)          |
| **Action**   | Yes       | Button (Add to Cart)                     |

### 3. Spacing Specs (using Fluid Tokens)

- **Container Padding:** `[--space-m]`
- **Media-to-Content Gap:** `[--space-s]`
- **Content-to-Action Gap:** `[--space-m]`
- **Text Internal Leading:** `[--space-3xs]`

### 4. Interactive States

- **Hover:** [e.g., Image zoom 1.05x, border-color change to primary]
- **Focus:** [e.g., 2px solid blue offset ring around the whole card]
- **Active:** [e.g., Card scales to 0.98x]

### 5. Responsive Behavior

- **Desktop (1200px+):** [e.g., 4 cards per row]
- **Tablet (768px):** [e.g., 2 cards per row]
- **Mobile (below 480px):** [e.g., 1 card per row, switch to horizontal layout]

### 6. Accessibility Considerations

- **Heading Level:** [e.g., H3]
- **Alt Text:** [e.g., Product name + key visual features]
- **Click Pattern:** [e.g., Headline is the primary link; button is a secondary
  action]

### 7. Constraints & Edge Cases

- **Long Titles:** [e.g., Truncate after 2 lines]
- **Missing Images:** [e.g., Use placeholder background with brand logo]
- **Currency:** [e.g., Ensure symbol and decimals are clearly legible]
