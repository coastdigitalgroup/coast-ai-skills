---
name: responsive-navigation-implementation
description:
  Implement and debug accessible, responsive navigation systems that transition
  seamlessly between mobile and desktop views while maintaining focus management
  and semantic integrity.
---

# Responsive Navigation Implementation

## Purpose

The Responsive Navigation Implementation skill provides a technical framework
for building navigation systems that work across all device sizes. It focuses on
the transition from mobile-first "drawer" or "hamburger" menus to desktop
horizontal layouts, ensuring accessibility (ARIA, focus management), performance
(preventing layout shifts), and robust interaction behavior.

## Use Cases

- Building a global website header that collapses into a menu on mobile.
- Auditing and fixing navigation accessibility (e.g., keyboard-inaccessible
  menus).
- Implementing "Skip to Content" links for keyboard and screen reader users.
- Managing focus trapping and background scrolling when a mobile menu is active.
- Refactoring legacy navigation systems for better performance and smaller CLS
  (Cumulative Layout Shift).

## When NOT to Use

- **Single-Page Mini-sites:** If the "navigation" is just 2-3 links that never
  need to collapse, the full responsive drawer pattern may be overkill.
- **Internal App Toolbars:** Complex application sidebars or toolbars often
  require specific state management frameworks (React/Vue/etc.) and may follow
  different UX patterns than a standard website navigation.
- **In-Page Jump Links:** Navigating within a single content block (like a Table
  of Contents) doesn't usually require the responsive drawer implementation.

## Inputs

1. **Sitemap/Link List:** The primary hierarchy of pages to be included.
2. **Breakpoints:** The viewport widths where the navigation layout changes
   (e.g., 768px).
3. **Design Intent:** Should the mobile menu slide from the side, fade in, or
   expand from the top?
4. **Current Page Context:** Logic to identify the active link for
   `aria-current`.

## Outputs

1. **Semantic HTML Structure:** Using `<nav>`, `<ul>`, and `<button>` for
   toggles.
2. **Accessible Interaction Logic:** JavaScript to handle `aria-expanded` states
   and focus management.
3. **Responsive CSS:** Media queries that handle the layout transition without
   "flashing" unstyled content.
4. **Skip Link Implementation:** A functional "Skip to main content" link.

## Workflow

### 1. Establish Semantic Foundation

- Wrap navigation in a `<nav>` element with an appropriate `aria-label` (e.g.,
  "Main Navigation").
- Use a `<ul>` for the list of links to provide "list" context to screen
  readers.
- Identify the active page link and mark it with `aria-current="page"`.

### 2. Implement the Skip Link

- Place a link as the very first focusable element in the `<body>`.
- Visually hide it by default, but make it visible on focus.
- Point it to the `#main-content` or `<main>` element.

### 3. Create the Mobile Toggle (Hamburger)

- Use a `<button>` (not a link) for the menu toggle.
- Add `aria-expanded="false"` (initially).
- Link the button to the menu container using `aria-controls="menu-id"`.
- Provide a clear label via `aria-label="Open Menu"` or hidden text.

### 4. Build the Responsive Layout (CSS)

- **Mobile-First:** Style the "drawer" or "collapsed" state by default.
- **Transition:** Use CSS transitions for the opening/closing animation.
- **Desktop Overlay:** Use media queries to reset the menu to a horizontal
  layout (e.g., `flex-direction: row`, `position: static`).
- **Hide the Toggle:** Hide the hamburger button at the desktop breakpoint using
  `display: none`.

### 5. Manage Menu State (JavaScript)

- Toggle `aria-expanded="true/false"` on the button when clicked.
- **Focus Trap:** When the mobile menu is open, ensure `Tab` only moves between
  menu items and the close button.
- **Esc Key:** Close the menu when the `Escape` key is pressed.
- **Body Scroll:** Optionally prevent the background page from scrolling when
  the menu is active (`overflow: hidden` on `body`).

### 6. Handle Resize Events

- Ensure the menu doesn't stay in a "broken" state if a user resizes from mobile
  to desktop while the menu is open (e.g., remove `overflow: hidden` from body).

## Decision Rules

- **Button vs. Link:** Use a `<button>` for the hamburger menu because it
  triggers a UI change, not a navigation to a new URL.
- **CSS vs. JS for Display:** Use CSS media queries to show/hide the desktop
  nav. Use JS only for toggling the _state_ of the mobile menu.
- **Focus Restoration:** When closing the mobile menu, always return focus to
  the hamburger button.
- **Hidden Menu Visibility:** Use `visibility: hidden` or `display: none` for
  the closed mobile menu so it is not in the tab order when hidden.

## Constraints

- **No Keyboard Traps:** Users must always be able to exit the menu using `Esc`
  or the close button.
- **Visible Focus:** Every link and the toggle button must have a clear visual
  focus indicator.
- **Click Target Size:** Ensure the hamburger button and all nav links meet the
  44x44px minimum touch target size.

## Non-Goals

- Building complex multi-level "Mega Menus" (though the principles here are the
  foundation for them).
- Handling server-side rendering (SSR) of the navigation.
- Styling the visual aesthetics (branding, colors) beyond accessibility
  requirements.

## Common Failure Patterns

- **The "Inaccessible Hamburger":** Using a `<div>` or `<a>` for the menu toggle
  without proper ARIA attributes.
- **Focus Leak:** Tabbing past the mobile menu into the background content while
  the menu is open.
- **Lack of "Skip Link":** Forcing keyboard users to tab through 20+ navigation
  links on every page load.
- **CLS on Load:** Navigation "jumping" as the JS or CSS loads (usually caused
  by hiding elements with JS instead of CSS).
- **Z-Index Issues:** Mobile menu appearing behind other page content.

## Validation Steps

- [ ] **Keyboard Test:** Can I open/close the menu and navigate all links using
      only `Tab`, `Enter`, and `Esc`?
- [ ] **Screen Reader Test:** Is the toggle's state (`expanded/collapsed`)
      announced? Is the "current" page identified?
- [ ] **Resize Test:** Open the mobile menu, then expand the window to desktop.
      Does the UI recover gracefully?
- [ ] **Skip Link Test:** Does the first `Tab` keypress reveal the skip link?
      Does it correctly move focus to the content?
- [ ] **Interaction Test:** Verify focus returns to the toggle button after
      closing the mobile menu.
- [ ] **Touch Test:** Verify the toggle and links are easily tappable on a
      mobile device/simulator.
