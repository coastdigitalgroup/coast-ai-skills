# Responsive Navigation ARIA & Interaction Guide

This reference outlines the technical requirements for accessible and performant
navigation systems.

## 1. ARIA Attributes for Navigation

| Attribute             | Element         | Purpose                                                                              |
| :-------------------- | :-------------- | :----------------------------------------------------------------------------------- |
| `aria-label`          | `<nav>`         | Disambiguates multiple navigation blocks (e.g., "Primary", "Footer", "Social").      |
| `aria-expanded`       | `<button>`      | Communicates whether the mobile menu is currently open (`true`) or closed (`false`). |
| `aria-controls`       | `<button>`      | Programmatically links the toggle button to the menu container it manages.           |
| `aria-current="page"` | `<a>`           | Identifies the link that represents the current page in the navigation list.         |
| `aria-hidden`         | `<div>` / `nav` | Hides the mobile menu from assistive technology when it is visually off-screen.      |

## 2. Focus Management Rules

1.  **Opening the Menu:** When the mobile menu opens, focus should ideally move
    to the first menu item or a "Close" button.
2.  **Focus Trapping:** While the mobile menu is active as a modal drawer, the
    user should not be able to "tab out" into the background page content. Focus
    must cycle within the menu.
3.  **Closing the Menu:** When the menu is closed, focus **must** return to the
    toggle button that opened it.
4.  **Escape Key:** Pressing the `Escape` key should close the mobile menu
    immediately.

## 3. The "Skip to Content" Link

A "Skip to Content" link is a critical accessibility feature for keyboard and
screen reader users.

- **Placement:** Must be the very first focusable element in the DOM.
- **Behavior:** Should be visually hidden until it receives focus.
- **Target:** Must point to a valid ID (usually `#main` or `#content`) that
  encompasses the main page content.

## 4. Performance & Layout Stability (CLS)

- **Avoid JS-dependent Hiding:** Use CSS media queries (e.g.,
  `@media (min-width: 768px) { .nav-toggle { display: none; } }`) to ensure the
  desktop menu is visible immediately, even if JavaScript hasn't loaded.
- **Reserved Space:** If the header has a fixed height, ensure the page content
  has a top margin or padding to prevent layout shifts when the header becomes
  `sticky` or `fixed`.

## 5. Mobile Interaction Patterns

- **Touch Targets:** Navigation links and toggle buttons must be at least
  44x44px to accommodate touch input.
- **Scroll Locking:** When a full-screen mobile menu is open, it is best
  practice to set `overflow: hidden` on the `<body>` to prevent the user from
  scrolling the background content accidentally.
