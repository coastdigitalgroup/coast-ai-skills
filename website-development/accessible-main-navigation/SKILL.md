---
name: accessible-main-navigation
description:
  Implement and debug responsive, accessible website navigation that manages
  focus, handles mobile states, and provides clear landmarks for assistive
  technologies.
---

# Accessible Main Navigation

## Purpose

The Accessible Main Navigation skill provides a technical framework for building
website headers and menus that are usable by all users. It ensures that
navigation is semantically correct, keyboard-accessible, and provides a robust
experience across various screen sizes (e.g., handling "hamburger" menus
correctly).

## Use Cases

- Implementing a site-wide header with responsive behavior (mobile toggle).
- Adding "Skip to Main Content" links to improve keyboard navigation.
- Auditing existing navigation systems for accessibility failures (e.g., focus
  traps or missing labels).
- Implementing dropdown or mega-menus that require keyboard interaction logic.

## When NOT to Use

- **In-Page Pagination:** For simple "Next/Previous" buttons within an article,
  use simpler patterns.
- **Sidebars in Web Apps:** For complex, persistent application sidebars with
  internal state (like a file explorer), use a specialized sidebar or tree-view
  pattern.
- **Single Page Navigation:** Simple anchor-link-only lists (like a table of
  contents) may not require the full responsive toggle logic.

## Inputs

1. **Information Architecture (IA):** The hierarchy of pages and links.
2. **Responsive Breakpoints:** The screen widths where the navigation switches
   from desktop to mobile view.
3. **Branding Requirements:** Placement of logos and interactive elements
   (search, account).

## Outputs

1. **Semantic HTML Structure:** Use of `<nav>`, `<ul>`, and `<header>`
   landmarks.
2. **ARIA-Enhanced States:** Proper use of `aria-expanded`, `aria-controls`, and
   `aria-current`.
3. **Mobile Toggle Logic:** Scripts that manage visibility and focus for the
   mobile menu.
4. **Skip Link:** A functional, visually-hidden-until-focused "Skip to Content"
   link.

## Workflow

### 1. Establish the Landmark Structure

- Wrap the main navigation in a `<nav>` element.
- Provide an `aria-label` to the `<nav>` if there are multiple navigation
  landmarks on the page (e.g., `aria-label="Main Navigation"` vs
  `aria-label="Footer Navigation"`).
- Use a `<ul>` for the list of links to provide a count to screen reader users.

### 2. Implement the "Skip Link"

- Place a link as the very first focusable element in the `<body>`.
- Point the link to the `id` of the main content area (e.g.,
  `<a href="#main">Skip to main content</a>`).
- Style it to be visually hidden by default but visible when it receives focus.

### 3. Build the Responsive Toggle (Mobile Menu)

- **The Button:** Use a `<button>` element for the toggle, not a link or a
  `div`.
- **Linking:** Connect the button to the menu container using
  `aria-controls="[menu-id]"`.
- **State:** Use `aria-expanded="false/true"` on the button to communicate the
  menu's state.
- **Hiding:** When closed, ensure the mobile menu is hidden from both visual and
  assistive technology (using `display: none` or `visibility: hidden`, or the
  `hidden` attribute).

### 4. Manage Focus and Interactivity

- **Escape Key:** Ensure the mobile menu closes when the `Escape` key is
  pressed.
- **Focus Trapping:** For "overlay" mobile menus, trap focus within the menu
  while it's open to prevent users from tabbing into the background content.
- **Active State:** Use `aria-current="page"` on the link that matches the
  current URL.

### 5. Handle Dropdowns (if applicable)

- Use buttons to toggle sub-menus.
- Do not rely on "hover" alone for dropdowns; they must be triggerable via
  click/tap and keyboard.

## Decision Rules

- **Overlay vs. Slide-down:** Use an overlay (and focus trap) if the mobile menu
  covers the entire screen. Use a simple slide-down if the user can still
  interact with the page behind it.
- **Icon-only Buttons:** If the toggle button only contains an icon, provide a
  descriptive label via `aria-label="Toggle Menu"`.
- **Screen Reader Only Text:** Use "SR-only" classes to provide context that is
  visually hidden but necessary for screen readers.

## Constraints

- **No Keyboard Traps:** The user must always be able to navigate into and out
  of the navigation.
- **Visual Focus:** Every link and button must have a clear, high-contrast focus
  indicator.
- **Semantic Integrity:** Do not use `role="menu"` and `role="menuitem"` for
  standard website navigation; these are for application-like menus. Standard
  `<nav>`, `<ul>`, and `<a>` are preferred for SEO and standard web behavior.

## Non-Goals

- Design or aesthetic styling of the header.
- Implementation of site-wide search functionality.
- Handling of authentication state (login/logout) beyond the UI container.

## Common Failure Patterns

- **The "Invisible" Mobile Menu:** Forgetting to hide the mobile links from the
  tab order when the menu is visually hidden.
- **Missing Current State:** Failing to tell screen reader users which page they
  are currently on.
- **Broken Skip Links:** Pointing the skip link to an ID that doesn't exist or
  is inside a container that isn't focusable.
- **Link-based Toggles:** Using `<a href="#">` for the mobile toggle, which can
  cause page jumps and incorrect semantic announcements.

## Validation Steps

- [ ] **Tab Order Test:** Verify that tabbing through the header follows a
      logical path.
- [ ] **Mobile Menu Visibility Test:** Ensure that when the mobile menu is
      closed, its links are not reachable via `Tab`.
- [ ] **Skip Link Test:** Focus the page, press `Tab` once, and verify the "Skip
      to Content" link appears and works.
- [ ] **Aria-Expanded Test:** Verify that the `aria-expanded` attribute on the
      toggle button changes when the menu opens/closes.
- [ ] **Screen Reader Landmark Test:** Open a screen reader and ensure the
      navigation landmark is correctly identified.
