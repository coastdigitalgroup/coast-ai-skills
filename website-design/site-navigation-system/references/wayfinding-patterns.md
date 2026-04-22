# Wayfinding & Navigation Patterns

This reference documents common navigation patterns, semantic requirements, and
user orientation strategies.

## Common Navigation Patterns

### 1. The Mega-Menu

- **Best For:** Large content sets (Retail, Enterprise SaaS).
- **Structure:** Multi-column layout appearing on hover/click.
- **Benefit:** Shows many options at once, reducing clicks.
- **Constraint:** Can be overwhelming; requires careful grouping and hierarchy.

### 2. Priority+ (The "More" Menu)

- **Best For:** Sites with many top-level links that can't fit on one line.
- **Behavior:** Displays as many links as space allows, then groups the rest
  under a "More" dropdown.
- **Benefit:** Maximizes use of screen real estate.

### 3. Vertical/Sidebar Navigation

- **Best For:** Documentation, Dashboard Apps, Settings.
- **Behavior:** A persistent column on the left (or right).
- **Benefit:** Scalable for long lists of items. Good for deep hierarchies.

### 4. Breadcrumbs

- **Best For:** E-commerce, Deep content hierarchies (3+ levels).
- **Behavior:** `Home > Category > Sub-category`.
- **Benefit:** Provides a "way back" and improves SEO by defining the page
  structure.

---

## Technical & Accessibility Requirements

### Semantic Structure

Always use standard HTML elements to ensure screen readers can identify the
navigation.

```html
<nav aria-label="Main Navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li>
      <button aria-expanded="false" aria-haspopup="true">Products</button>
      <ul class="dropdown">
        <li><a href="/p1">Product 1</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

### Keyboard Interactions

| Key             | Action                                                   |
| :-------------- | :------------------------------------------------------- |
| **Tab**         | Move to the next focusable item.                         |
| **Shift + Tab** | Move to the previous focusable item.                     |
| **Space/Enter** | Activate a link or toggle a dropdown.                    |
| **Escape**      | Close an open dropdown or mobile menu.                   |
| **Arrow Keys**  | (Optional) Navigate between items in a menu-bar pattern. |

### ARIA Attributes

- `aria-label`: Used on `<nav>` to distinguish multiple navigation areas (e.g.,
  "Primary", "Footer").
- `aria-current="page"`: Placed on the link that matches the current URL.
- `aria-expanded`: Set to `true`/`false` on buttons that toggle dropdowns or
  mobile menus.
- `aria-hidden`: Used to hide decorative icons or closed mobile menus from
  screen readers.

---

## Orientation Strategies

### The "You Are Here" Principle

Never leave a user guessing where they are.

1. **Highlighting:** The current link must be visually distinct (different
   color, underline, or background).
2. **Page Titles:** The `<h1>` of the page should match the navigation label
   exactly.
3. **Breadcrumbs:** Use breadcrumbs for any page that is not a top-level primary
   page.

### The "3-Click Rule" (Guideline)

While not a hard rule, aim to make any piece of content reachable within 3
clicks from the home page. This forces a flatter, more efficient information
architecture.
