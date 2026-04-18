# Navigation Accessibility Checklist

Ensuring navigation is accessible is critical for WCAG compliance and general
usability. Use this checklist during the design and audit phases.

## 1. Landmarks & Semantics

- [ ] **Main Navigation:** Wrapped in `<nav>` with
      `aria-label="Main navigation"`.
- [ ] **Footer Navigation:** Wrapped in `<footer>` or a `<nav>` with
      `aria-label="Footer"`.
- [ ] **Breadcrumbs:** Wrapped in `<nav>` with `aria-label="Breadcrumb"`.
- [ ] **Current Page:** The link to the current page uses `aria-current="page"`.

## 2. Keyboard Interaction

- [ ] **Skip Link:** A "Skip to Main Content" link is the first focusable
      element.
- [ ] **Tab Order:** Navigation items follow a logical visual order.
- [ ] **Focus Visibility:** Focus indicators are highly visible (min 3:1
      contrast).
- [ ] **Menu Toggles:** Toggles (like hamburger menus) are `<button>` elements,
      not `<a>` or `<div>`.
- [ ] **Esc Key:** Dropdowns and mobile drawers close when the `Esc` key is
      pressed.
- [ ] **Focus Trapping:** When the mobile drawer is open, focus cannot leave the
      drawer until it is closed.

## 3. Visual & Cognitive Accessibility

- [ ] **Contrast:** Nav text has at least 4.5:1 contrast against the background.
- [ ] **Touch Targets:** Interactive elements are at least 44x44px on mobile.
- [ ] **Icon Labels:** All icon-only buttons (Search, Menu) have `aria-label` or
      `title`.
- [ ] **No Hover-Only Content:** Critical information is not hidden behind a
      hover state without a click/tap alternative.

## 4. Screen Reader Support

- [ ] **Aria-Expanded:** Toggles use `aria-expanded="true/false"` to announce
      state.
- [ ] **Aria-Controls:** Toggles use `aria-controls="ID"` to link to the element
      they open.
- [ ] **Hidden Content:** Hidden menus use `display: none` or
      `visibility:     hidden` (not just `opacity: 0`) so they aren't focusable
      when closed.

## 5. Wayfinding

- [ ] **Consistent Navigation:** Global nav appears in the same place and order
      on every page.
- [ ] **Hierarchical Clarity:** Sub-navigation is visually distinct from primary
      navigation.
- [ ] **Search Accessibility:** The search input has a proper `<label>` or
      `aria-label`.
