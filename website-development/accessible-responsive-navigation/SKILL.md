---
name: accessible-responsive-navigation
description:
  Implement and debug responsive navigation systems that are fully accessible,
  ensuring seamless experiences across devices and assistive technologies.
---

# Accessible Responsive Navigation

## Purpose

The Accessible Responsive Navigation skill provides a technical framework for building navigation systems (headers, menus, dropdowns) that are responsive across all screen sizes and fully compliant with WCAG accessibility standards. It focuses on semantic structure, keyboard operability, and ARIA state management.

## Use Cases

- Building a site header with a "hamburger" menu for mobile devices.
- Implementing multi-level dropdown menus that are navigable via keyboard.
- Fixing navigation accessibility issues where mobile menus are hidden from screen readers or keyboard users.
- Ensuring focus is correctly managed when opening/closing mobile overlays.

## When NOT to Use

- **Simple Single-Page "Jump" Links:** If the navigation is just a few links that don't require responsive toggling or complex hierarchy, a full implementation pattern might be overkill.
- **In-Content Pagination:** For simple "Next/Previous" links within an article, use standard link patterns.
- **App Sidebars (Complex Dashboards):** While the principles apply, complex sidebars often require specialized layout logic (e.g., persistent states) beyond standard website navigation.

## Inputs

1. **Information Architecture (IA):** The hierarchy of links (top-level vs. nested items).
2. **Breakpoints:** The viewport widths where the navigation layout shifts (e.g., mobile to desktop).
3. **Design Requirements:** Specific interaction patterns (e.g., click vs. hover for dropdowns—though click is preferred for accessibility).

## Outputs

1. **Semantic HTML:** Use of `<nav>`, `<ul>`, and `<button>` for toggles.
2. **Responsive CSS:** Layout logic (Flexbox/Grid) and visibility controls for different breakpoints.
3. **Interaction Script:** JavaScript to manage ARIA states (`aria-expanded`) and focus management.
4. **Accessibility Metadata:** Proper labeling and relationship attributes.

## Workflow

### 1. Structure for Semantics

- Wrap the entire navigation in a `<nav>` element with an appropriate `aria-label` (e.g., `aria-label="Main Navigation"`).
- Use a `<ul>` for the list of links to provide screen reader users with context about the number of items.
- Use `<button>` for toggles (mobile menu, dropdowns), never `<a>` tags without a `href`.

### 2. Implement Responsive Toggles

- For mobile, use a `<button>` to toggle the menu visibility.
- Use `aria-expanded="false/true"` on the toggle button to communicate the state.
- Use `aria-controls="menu-id"` to link the button to the menu it controls.

### 3. Manage Visibility and Focus

- Use `display: none` or the `hidden` attribute to hide the mobile menu when closed. This ensures it is removed from the tab order and screen reader tree.
- **Focus Trap (Optional but recommended for overlays):** When a mobile menu covers the entire screen, prevent focus from leaving the menu until it is closed.
- **Focus Restoration:** When the mobile menu is closed, return focus to the toggle button.

### 4. Handle Dropdowns (if applicable)

- Trigger dropdowns on `click` for better mobile and keyboard support.
- Use `aria-haspopup="true"` on the trigger.
- Ensure the dropdown can be closed with the `Esc` key.

### 5. Keyboard Navigation

- Ensure all interactive elements are reachable via `Tab`.
- Implement expected keyboard behaviors: `Enter`/`Space` to toggle, `Esc` to close.

## Decision Rules

- **Click vs. Hover:** Prefer click-triggered dropdowns. If hover is required, it *must* also support click/focus and have a slight delay to prevent accidental closing.
- **ARIA Labels:** Only use `aria-label` on `<nav>` if there is more than one navigation landmark on the page (e.g., Main vs. Footer).
- **Hidden Content:** Never use `opacity: 0` or `visibility: hidden` alone to hide menus; they must be removed from the tab order using `display: none`.

## Constraints

- **No Keyboard Traps:** Users must always be able to navigate out of the menu.
- **Contrast:** Navigation links must meet WCAG AA contrast ratios.
- **Touch Target Size:** Mobile toggle buttons and links must be at least 44x44px.

## Non-Goals

- Styling the visual theme (colors, fonts).
- Implementing search functionality within the nav (covered by `robust-form-implementation`).
- Creating mega-menus with complex grids (though the accessibility principles still apply).

## Common Failure Patterns

- **Using `<a>` as a Button:** Links that don't go anywhere (`href="#"`) but trigger JS actions.
- **Missing State Communication:** Forgetting to update `aria-expanded` when the menu opens/closes.
- **Invisible Focus:** Not providing a clear visual focus indicator for keyboard users.
- **Inaccessible Mobile Menu:** Hiding the menu visually but leaving its links reachable via `Tab`.
- **Losing Focus:** Forgetting to return focus to the toggle button after closing a mobile menu.

## Validation Steps

- [ ] **Keyboard Test:** Can I navigate the entire menu using only the keyboard (`Tab`, `Enter`, `Esc`)?
- [ ] **Screen Reader Test:** Does the screen reader announce the menu state (expanded/collapsed) and the number of items?
- [ ] **Responsiveness Test:** Does the navigation transition correctly between mobile and desktop views?
- [ ] **Focus Management Check:** Does focus return to the toggle button after closing the mobile menu?
- [ ] **No Overflow:** Ensure the mobile menu doesn't cause horizontal scrolling on small screens.
