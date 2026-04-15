---
name: dark-mode-implementation
description:
  Implement a robust, performant, and accessible dark mode system that respects
  system preferences, supports manual toggling, and prevents the Flash of
  Unstyled Theme (FOUT).
---

# Dark Mode Implementation

## Purpose

The Dark Mode Implementation skill provides a protocol for building a theme
switching system that is seamless for the user and maintainable for the
developer. It focuses on using CSS custom properties for theme management and
blocking scripts to prevent visual "flicker" on page load.

## Use Cases

- Adding a "Dark Mode" toggle to an existing website.
- Implementing "System Default" theme detection.
- Building a multi-theme system (e.g., Light, Dark, High Contrast).
- Fixing the "flash" of light mode that occurs before a dark theme is applied on
  page load.

## When NOT to Use

- **Static Themed Sites:** If a site is intended to have only one theme, this
  system is unnecessary overhead.
- **Media-Only Dark Mode:** If you only want to support `prefers-color-scheme`
  without a manual toggle, a simpler CSS-only approach is preferred.
- **Legacy Browser Support:** If you must support browsers that do not support
  CSS Custom Properties (IE11), this modern approach will not work.

## Inputs

1. **Color Palette:** A set of semantic color pairs (e.g., Background Light vs.
   Background Dark).
2. **Persistence Strategy:** Where to store the user's preference
   (`localStorage`, `Cookie`, or `Database`).
3. **Toggle UI:** The design of the theme switcher component.

## Outputs

1. **Theme Variable Architecture:** A CSS file defining custom properties for
   both modes.
2. **Critical Initialization Script:** A small, blocking JS snippet for the
   document `<head>` to prevent flickering.
3. **Theme Switcher Logic:** JavaScript to handle the toggle interaction and
   persistence.
4. **Metadata:** Correct use of the `color-scheme` meta tag and CSS property.

## Workflow

### 1. Define the Variable Architecture

Create a set of CSS custom properties that represent semantic roles rather than
fixed colors.

- **Bad:** `--white: #fff;`
- **Good:** `--bg-primary: #fff;` (which becomes `#121212` in dark mode)

### 2. Implement System Preference Detection

Use the `prefers-color-scheme` media query in CSS to provide a default
experience without requiring JavaScript.

### 3. Build the "Anti-Flicker" Initialization

To avoid the Flash of Unstyled Theme (FOUT), you must place a script in the
`<head>` of your HTML _before_ the body content is rendered. This script checks
for a saved preference or system setting and applies the correct class or
attribute to the `<html>` element immediately.

### 4. Implement Manual Toggle

Provide a UI element that allows users to override the system setting. Save this
preference to `localStorage`.

### 5. Coordinate with `color-scheme`

Apply the CSS `color-scheme` property to the `:root` or `html` element. This
tells the browser (and OS) which theme the page is using, affecting scrollbars,
form controls, and system UIs.

## Decision Rules

- **Attribute over Class:** Use a data attribute (e.g., `data-theme="dark"`) on
  the `<html>` element rather than a class. This is more semantic and less
  likely to conflict with utility classes.
- **Blocking is Necessary:** The initialization script MUST be blocking (not
  `async` or `defer`) and located in the `<head>` to prevent the light-mode
  flash.
- **Semantic First:** Always define variables based on their _purpose_ in the
  UI, not their color.

## Constraints

- **Accessibility:** Ensure that both light and dark themes meet WCAG contrast
  standards.
- **Performance:** Keep the initialization script extremely lightweight (< 1KB)
  as it blocks rendering.
- **Image Handling:** Consider how images (especially diagrams or logos) appear
  in dark mode. Use `filter: brightness(.8) contrast(1.2)` or the `<picture>`
  element to swap assets.

## Non-Goals

- Creating the actual color palettes (this is a design task).
- Implementing complex theme-switching animations.
- Backend synchronization of theme preferences.

## Common Failure Patterns

- **The "Flash of Light Mode":** Loading the theme script with `defer` or
  putting it at the bottom of the `<body>`.
- **Hard-coded Colors:** Missing an element because it uses a hex code instead
  of a variable.
- **Ignoring System Changes:** Not listening for changes to the system
  preference while the user is on the page.
- **Inaccessible Contrast:** Creating a "dark" theme that is just gray-on-gray
  with poor legibility.

## Validation Steps

- [ ] **Flicker Test:** Open the page in Dark Mode (manual or system) and
      refresh. Verify there is no "flash" of white.
- [ ] **System Sync Test:** Change your OS theme while the browser is open.
      Verify the website follows the change (if no manual override is set).
- [ ] **Persistence Test:** Set the theme to Dark, close the tab, and reopen it.
      Verify it remains in Dark mode.
- [ ] **Contrast Audit:** Run an accessibility tool (like Lighthouse or Axe) on
      both themes.
- [ ] **Form Control Check:** Verify that scrollbars and checkboxes look correct
      (requires `color-scheme` property).
