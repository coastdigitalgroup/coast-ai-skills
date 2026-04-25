# Card Structure Template

Use this template to define the structural rules for cards within a design
system. It focuses on maintaining consistency across grids and varying content
lengths.

## 1. The Flexbox Vertical Stack (Grid View)

To ensure that actions (buttons) always align at the bottom of the card
regardless of the content height, use the following Flexbox strategy.

### Structural Spec

- **Container:** `display: flex; flex-direction: column; height: 100%;`
- **Body Content:** `flex-grow: 1;` (optional, if you want content to stretch)
- **Action Container:** `margin-top: auto;` (Crucial for bottom-alignment)

### Visual Representation

```text
┌───────────────────────────┐
│ [ Image / Visual Anchor ] │
├───────────────────────────┤
│ [ Category / Metadata ]   │
│                           │
│ [ Title (2 lines max) ]   │
│                           │
│ [ Description/Excerpt ]   │
│                           │
│ (Remaining Space)         │ <-- margin-top: auto starts here
├───────────────────────────┤
│ [ Primary CTA Button ]    │
└───────────────────────────┘
```

## 2. Horizontal Layout (List/Mobile View)

When space is narrow (sidebar) or on mobile devices, use a horizontal layout to
maintain legibility.

### Structural Spec

- **Container:** `display: flex; flex-direction: row; gap: 16px;`
- **Image:** `flex: 0 0 120px; height: 120px; object-fit: cover;`
- **Content Wrap:** `flex: 1; display: flex; flex-direction: column;`

## 3. Card Configuration Matrix

Use this table to define the "rules of the road" for different card types.

| Feature             | Standard Card  | Feature Card      | Promo Card       |
| :------------------ | :------------- | :---------------- | :--------------- |
| **Image Ratio**     | 1:1 (Square)   | 16:9 (Widescreen) | No Image         |
| **Title Level**     | H3             | H2                | H3               |
| **Padding**         | 16px (Fluid)   | 24px (Fluid)      | 32px (Fixed)     |
| **Max Title Lines** | 2 Lines        | 3 Lines           | No Limit         |
| **Primary Action**  | Button (Solid) | Button (Outline)  | Text Link + Icon |

## 4. Design-to-Implementation Checklist

- [ ] **Fluid Spacing:** Use `clamp()` or a spacing system for internal padding.
- [ ] **Empty States:** Define how the card looks if an image is missing (e.g.,
      placeholder background).
- [ ] **Loading State:** Define a "Skeleton" version of the card for async
      content.
- [ ] **Corner Radius:** Ensure consistency (e.g., `8px` for cards, `4px` for
      buttons inside cards).
- [ ] **Border/Shadow:** Use one or the other as the primary container boundary;
      rarely both.
