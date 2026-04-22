# Navigation Accessibility Guide

This guide covers the technical requirements and best practices for ensuring website navigation is accessible to all users, including those using screen readers, keyboard-only navigation, and other assistive technologies.

## Core ARIA Attributes

| Attribute | Element | Purpose |
| :--- | :--- | :--- |
| `aria-label` | `<nav>` | Identifies the navigation landmark (e.g., "Main", "Breadcrumb", "Footer"). |
| `aria-expanded` | `<button>` | Communicates whether a menu or dropdown is currently open (`true`) or closed (`false`). |
| `aria-controls` | `<button>` | Programmatically links a toggle button to the ID of the element it controls. |
| `aria-haspopup` | `<button>` | Indicates that the button triggers a popup element (like a menu or dialog). Use `aria-haspopup="true"` or `aria-haspopup="menu"`. |
| `aria-hidden` | Icon/Graphic | Hides decorative icons (like the hamburger symbol) from screen readers. |

## Keyboard Interactions

Consistent keyboard support is critical. Users should be able to:

- **Tab**: Move through all interactive links and buttons in a logical order.
- **Enter / Space**: Activate links and toggle buttons (open/close menus).
- **Escape**: Close an open mobile menu or dropdown and return focus to the triggering button.
- **Arrow Keys (Optional but Best Practice)**: In complex menus, arrow keys can be used to navigate between items (requires additional JS).

## Focus Management

1. **Focus Restoration**: When a user closes a menu using a keyboard (e.g., pressing `Esc`), the focus must return to the button that opened it.
2. **Visible Focus**: Never remove the default focus outline (`outline: none`) without providing a clear, high-contrast alternative.
3. **Focus Trapping**: In full-screen mobile overlays, focus should be "trapped" within the menu so that `Tab` doesn't move focus to the background content while the menu is open.

## Semantic Checklist

- [ ] Use the `<nav>` element for major navigation blocks.
- [ ] Use `<ul>` and `<li>` for lists of navigation links.
- [ ] Use `<button>` for any action that does not change the URL (e.g., toggling a menu).
- [ ] Use `<a>` only for actual links to other pages or sections.
- [ ] Include a "Skip to Content" link as the very first focusable element on the page.

## CSS Visibility

- Use `display: none;` or the `hidden` attribute to hide menus.
- **Avoid** using `opacity: 0;` or `visibility: hidden;` alone, as the elements will still be in the tab order and reachable by screen readers.
- If using animations, ensure the `display` or `hidden` state is updated *after* the animation finishes (or use `visibility` in combination with a delay).

## References

- [W3C WAI-ARIA Authoring Practices: Navigation Landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)
- [W3C WAI-ARIA Authoring Practices: Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) (Commonly used for dropdowns)
- [MDN: Using the aria-expanded attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
