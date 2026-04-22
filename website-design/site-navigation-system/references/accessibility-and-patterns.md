# Reference: Accessibility & Navigation Patterns

## Accessibility Requirements (WCAG 2.1)

To ensure navigation is usable by everyone, follow these technical requirements:

### 1. Semantic Structure

- Wrap the main navigation in a `<nav>` element.
- Use `aria-label="Main Navigation"` or `aria-labelledby` if there are multiple
  `<nav>` blocks (e.g., Header and Footer).
- Use an unordered list (`<ul>`) for the items to provide context to screen
  readers ("List, 5 items").

### 2. Keyboard & Focus

- **Logical Tab Order:** Links must be reachable via the `Tab` key in the order
  they appear visually.
- **Visible Focus:** Never remove the default focus outline without providing a
  clear, high-contrast alternative.
- **Skip Links:** For sites with complex headers, provide a "Skip to Content"
  link as the very first focusable element on the page.

### 3. State Management

- **aria-expanded:** For dropdowns or mobile drawers, set to `false` when closed
  and `true` when open.
- **aria-current="page":** Apply this attribute to the link that represents the
  page the user is currently on.
- **aria-haspopup="menu":** Use on buttons that trigger a dropdown.

---

## Pattern Selection Matrix

| Pattern         | Best For...                           | Cons                                     |
| :-------------- | :------------------------------------ | :--------------------------------------- |
| **Simple Bar**  | 3-6 items, flat hierarchy.            | Scales poorly to mobile.                 |
| **Mega Menu**   | 20+ items, multi-category.            | Overwhelming if not organized.           |
| **Hamburger**   | Mobile viewports, secondary nav.      | Lower discoverability (hidden).          |
| **Tab Bar**     | 3-5 high-frequency mobile tasks.      | No room for text labels if >5.           |
| **Priority+**   | Adapting desktop to tablet.           | Can feel inconsistent as window resizes. |
| **Breadcrumbs** | Deep hierarchical sites (E-commerce). | Not a replacement for primary nav.       |

---

## Wayfinding Checklist

- [ ] **Where am I?** The "Active" state and Breadcrumbs answer this.
- [ ] **Where can I go?** Clear labels and logical grouping answer this.
- [ ] **How do I get back?** The Logo (linking to Home) and "Back to Top" answer
      this.
- [ ] **Can I search?** A utility search bar is essential for large content
      sites.
