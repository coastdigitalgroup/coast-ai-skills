# ARIA and Keyboard Guidelines for Navigation

## ARIA Roles and Attributes

### Landmarks

- **`<header>` / `role="banner"`**: Identifies the site-wide header.
- **`<nav>`**: Identifies a navigation block. If multiple `<nav>` elements
  exist, use `aria-label` to distinguish them (e.g., `aria-label="Main"`,
  `aria-label="Footer"`).
- **`<main>`**: Identifies the primary content area (the target for skip links).

### Interactive States

- **`aria-expanded="true/false"`**: Applied to buttons that toggle menus or
  submenus. Informs screen readers whether the content is currently visible.
- **`aria-controls="ID"`**: Links the toggle button to the element it controls.
- **`aria-haspopup="true"`**: Indicates that the button triggers a popup menu or
  submenu.
- **`aria-hidden="true"`**: Used for purely decorative icons (like hamburger
  bars) so screen readers skip them.
- **`aria-current="page"`**: Applied to the link that represents the current
  page in the navigation list.

---

## Keyboard Interaction Patterns

### Skip Links

- **Purpose**: Allows keyboard users to bypass repetitive navigation links.
- **Trigger**: Usually the first `Tab` press on a page.
- **Target**: Must move focus to the `#main-content` container.
- **Behavior**: The target container should have `tabindex="-1"` to be
  programmatically focusable without being in the natural tab order.

### Navigation Links

- **`Tab`**: Move focus to the next navigation item.
- **`Shift + Tab`**: Move focus to the previous navigation item.
- **`Enter` / `Space`**: Activate the focused link or button.

### Mobile Menus and Submenus

- **`Escape`**: Should immediately close the open menu and return focus to the
  toggle button.
- **Focus Trapping**: For full-screen mobile overlays, focus should ideally be
  trapped within the menu while it is open.
- **DOM Order**: Ensure the menu container follows the toggle button in the DOM
  order so that the next `Tab` press naturally moves into the menu.

---

## Performance and Browser Heuristics

- **CSS Focus Indicators**: Never use `outline: none` without a high-visibility
  replacement. Modern browsers support `:focus-visible` to only show indicators
  for keyboard users.
- **Layout Shift (CLS)**: Reserve space for the header to prevent content
  jumping when styles or scripts load.
- **Passive Listeners**: Use `{ passive: true }` for scroll-related listeners if
  the navigation changes state based on scroll position.
