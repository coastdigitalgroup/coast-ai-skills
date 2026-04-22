---
name: accessible-main-navigation
description:
  Implement and debug accessible, responsive main navigation systems, including
  skip links, semantic landmarks, and keyboard-friendly mobile menus.
---

# Accessible Main Navigation

## Purpose

The Accessible Main Navigation skill provides a protocol for building and
auditing primary site navigation that is usable by all users, including those
using screen readers, keyboard-only navigation, and various screen sizes. It
focuses on semantic structure, skip-link implementation, and accessible mobile
menu interactions.

## Use Cases

- Implementing a responsive header with a mobile "hamburger" menu.
- Adding a "Skip to Main Content" link to improve keyboard navigation
  efficiency.
- Auditing existing navigation for WCAG compliance (e.g., focus management,
  landmark usage).
- Implementing dropdown menus that work for both mouse and keyboard users.

## When NOT to Use

- **In-Page Navigation:** Use localized anchor links for table of contents or
  long-form page sections.
- **App Sidebars:** For complex application shells (e.g., dashboards), different
  focus management patterns for persistent sidebars may apply.
- **Footer Links:** While similar, footers usually don't require the same level
  of complex interaction (toggles, focus trapping) as main headers.

## Inputs

1. **Information Architecture (IA):** The list of primary and secondary
   navigation links.
2. **Responsive Design Specs:** Breakpoints for switching from desktop to mobile
   views.
3. **Target Environment:** Framework-specific constraints or vanilla
   HTML/CSS/JS.

## Outputs

1. **Semantic HTML:** Structure using `<header>`, `<nav>`, and `<ul>` elements.
2. **Skip-Link:** A "Skip to Content" link that is visually hidden until
   focused.
3. **Mobile Toggle Logic:** Accessible script to manage the mobile menu state
   (`aria-expanded`).
4. **CSS Implementation:** Styles for layout, visibility, and focus indicators.

## Workflow

### 1. Implement Skip Link

- Place a link as the first focusable element in the `<body>`.
- Target the main content container's ID (e.g., `#main-content`).
- Style it to be off-screen or invisible until it receives focus.

### 2. Establish Semantic Landmarks

- Wrap the main navigation in a `<header>` element.
- Use the `<nav>` element with an `aria-label="Main"` to distinguish it from
  other navigation blocks.
- List items within a `<ul>` for proper screen reader announcement of the item
  count.

### 3. Build the Mobile Toggle (for Responsive Nav)

- Use a `<button>` (not a link) for the mobile menu toggle.
- Apply `aria-expanded="false"` by default and `aria-controls` pointing to the
  menu's ID.
- Toggle `aria-expanded` and the menu's visibility with JavaScript.

### 4. Manage Focus for Mobile Menus

- When the mobile menu is open, ensure the tab order is managed.
- For "overlay" menus, consider trapping focus or ensuring the menu is
  immediately after the toggle in the DOM.
- Ensure the menu can be closed with the `Escape` key.

### 5. Ensure Desktop Interaction

- If using dropdowns, ensure they open on `Hover` (for mouse) AND `Focus` or
  `Click` (for keyboard).
- Use `aria-haspopup="true"` and `aria-expanded` for submenus.

### 6. Visual Polish & Accessibility

- Provide high-contrast focus indicators for all links and buttons.
- Ensure color contrast for text and icons meets WCAG AA (4.5:1).

## Decision Rules

- **Button vs. Link:** Use a `<button>` if the action changes the state of the
  page (like opening a menu). Use a link (`<a>`) if it navigates to a new URL.
- **Skip Link Placement:** It must be the _absolute first_ focusable element. If
  it's not, keyboard users have to tab through other elements to reach the
  "skip" utility.
- **Aria-Labeling:** If you have multiple `<nav>` elements (e.g., Header,
  Sidebar, Footer), each should have a unique `aria-label`.

## Constraints

- **JavaScript Dependency:** While the menu should ideally work without JS (via
  `checkbox` hack or CSS), accessible state management (`aria-expanded`)
  requires JS.
- **No Hover-Only menus:** Any menu item that appears on hover must also be
  accessible via keyboard focus.

## Non-Goals

- Designing the site's Information Architecture (IA).
- Implementing search functionality within the header (though search should also
  be accessible).
- Handling mega-menu content layouts (grid systems).

## Common Failure Patterns

- **Missing Skip Link:** Forcing keyboard users to tab through 20+ navigation
  links on every page load.
- **Invisible Focus:** Using `outline: none` without providing a robust custom
  focus style.
- **Incorrect Toggle Semantics:** Using a `<div>` or `<a>` with `href="#"` as a
  menu toggle instead of a `<button>`.
- **Focus Leaks:** Allowing the user to tab into the background content while an
  overlay mobile menu is open.
- **Non-Standard Keyboard Support:** Forgetting to handle the `Escape` key for
  closing submenus or mobile overlays.

## Validation Steps

- [ ] **Keyboard Navigation Test:** Can you reach all links using only the `Tab`
      key?
- [ ] **Skip Link Test:** Does the "Skip to Content" link appear on the first
      `Tab` press and move focus to the main container?
- [ ] **Screen Reader Test:** Does the mobile toggle announce "Expanded" and
      "Collapsed" correctly?
- [ ] **Mobile Resize Test:** Does the menu switch between desktop and mobile
      views without losing the current interaction state?
- [ ] **Escape Key Test:** Does pressing `Escape` close the mobile menu or
      active dropdown?
