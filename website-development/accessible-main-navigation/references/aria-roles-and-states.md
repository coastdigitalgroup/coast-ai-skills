# ARIA Roles and States for Navigation

Using the correct ARIA (Accessible Rich Internet Applications) attributes allows
screen readers and other assistive technologies to understand the structure and
state of your navigation.

## Essential Attributes

### `aria-expanded` (State)

- **Used on:** The toggle button for a mobile menu or a dropdown.
- **Values:** `"true"` when the menu is visible, `"false"` when it is hidden.
- **Why:** Informs the user if activating the button will reveal or hide
  content.

### `aria-controls` (Relationship)

- **Used on:** The toggle button.
- **Value:** The `id` of the menu element it controls.
- **Why:** Creates a programmatic link between the trigger and the content,
  allowing some screen readers to jump directly to the menu.

### `aria-current` (State)

- **Used on:** The `<a>` link that points to the current page.
- **Value:** `"page"`.
- **Why:** Tells the user "You are here," which is otherwise only communicated
  visually (e.g., through a bold font or underline).

### `aria-label` / `aria-labelledby` (Identity)

- **Used on:** The `<nav>` element.
- **Value:** A short string (e.g., `"Main"`, `"Secondary"`, `"Footer"`).
- **Why:** If a page has multiple `<nav>` landmarks, this allows users to
  distinguish between them in a landmark list.

### `aria-hidden` (Visibility)

- **Used on:** Decorative icons or hidden menu containers.
- **Values:** `"true"`.
- **Why:** Removes elements from the accessibility tree so screen readers ignore
  them. Note: If a menu is hidden with `display: none`, `aria-hidden` is not
  strictly necessary but can be used as a defensive measure.

## Landmark Roles

Website navigation should use semantic HTML5 elements which have implicit ARIA
roles:

- `<header>` -> `role="banner"`
- `<nav>` -> `role="navigation"`
- `<main>` -> `role="main"`
- `<footer>` -> `role="contentinfo"`

**Pro-tip:** Do not use `role="menu"` for a list of navigation links.
`role="menu"` is intended for application-style menus (like a file menu in a
text editor) and changes how the keyboard behaves in a way that is often
confusing for standard website visitors. Stick to `<nav><ul><li><a>`.
