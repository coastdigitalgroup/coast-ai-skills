# Implementation Notes: Dark Mode

## The `color-scheme` Property

The CSS property `color-scheme` (and the corresponding meta tag) is critical for
a high-quality dark mode implementation.

- It informs the browser about which color scheme the document supports.
- It automatically adjusts the default colors of form controls (inputs, buttons,
  checkboxes), scrollbars, and system-provided UI elements.
- Usage: `html { color-scheme: light dark; }` or dynamic application via JS:
  `document.documentElement.style.colorScheme = 'dark'`.

## Flash of Unstyled Theme (FOUC)

FOUC occurs when the browser renders the page using the default theme (usually
light) before the JavaScript that applies the dark theme has finished executing.

- **Solution:** Place a small, blocking script in the `<head>` _before_ any CSS
  links or body content.
- This script must not use `defer` or `async`.
- It should only perform the minimum logic needed to set the theme attribute on
  the `<html>` tag.

## Contrast and Accessibility

- **WCAG Compliance:** Background/Foreground pairings must be checked for both
  themes.
- **Avoid Pure Black:** While `#000000` is efficient for OLED screens, it can
  cause "smearing" and high eye strain for some users. Dark grays like `#121212`
  are often preferred for main backgrounds.
- **Saturation:** High-saturation colors that look good in light mode can
  "vibrate" and be hard to read in dark mode. Consider using desaturated
  versions of your brand colors for the dark theme.

## Media and Assets

- **Images:** Logos and diagrams designed for light mode may disappear on dark
  backgrounds.
- **Strategy 1 (CSS Filters):** Use `filter: brightness(.8) contrast(1.2)` to
  make photos less blinding in dark rooms.
- **Strategy 2 (Picture Element):** Use the `<picture>` element with
  `media="(prefers-color-scheme: dark)"` to swap assets entirely.
- **Strategy 3 (Opacity):** Reducing the opacity of images (e.g.,
  `opacity: 0.8`) is a simple way to soften them for dark mode.

## Listening for System Changes

Always ensure your JS listens for the `change` event on the
`prefers-color-scheme` media query. This ensures the website updates instantly
if the user changes their OS theme while browsing.

```javascript
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (!manualOverrideActive) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
```
