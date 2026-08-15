# System Colors & CSS Properties Technical Reference

A technical reference for CSS System Colors, overridden CSS properties, `forced-color-adjust`, SVG icon handling, and browser DevTools emulation under CSS Forced Colors Mode (`@media (forced-colors: active)`).

---

## 1. CSS System Color Keywords

In Forced Colors Mode, the browser maps system colors to standard CSS color keywords according to the user's OS contrast theme settings:

| System Color Keyword | Description | Typical Use Case | Matching Text Color |
| :--- | :--- | :--- | :--- |
| `Canvas` | The background color of document canvases and application windows. | Page backgrounds, card fills, container panels. | `CanvasText` |
| `CanvasText` | The default color of text on documents and canvases. | Body text, card borders, icons. | `Canvas` |
| `ButtonFace` | The background color of push buttons and interactive controls. | Button backgrounds, control boxes. | `ButtonText` |
| `ButtonText` | The text color for push buttons and interactive controls. | Button labels, control outlines. | `ButtonFace` |
| `Highlight` | The background color for selected items, active tabs, and highlighted text. | Active tabs, checked checkboxes, selected list items. | `HighlightText` |
| `HighlightText` | The text color for selected items paired with `Highlight`. | Active tab text, selected option text. | `Highlight` |
| `LinkText` | The color of hyperlinked text. | Anchor text links, interactive breadcrumbs. | `Canvas` |
| `GrayText` | The color for disabled elements, inactive controls, and muted text. | Disabled buttons, disabled form inputs. | `Canvas` |
| `Field` | The background color of form fields (text inputs, selects). | Input boxes, textareas. | `FieldText` |
| `FieldText` | The text color inside form fields. | Input text, select options text. | `Field` |
| `Mark` | The background color for text highlighted with the `<mark>` element. | Search result text background. | `MarkText` |
| `MarkText` | The text color for highlighted text paired with `Mark`. | Search result text label. | `Mark` |

---

## 2. Browser CSS Overrides in Forced Colors Mode

When `@media (forced-colors: active)` is triggered by the browser, the User Agent Stylesheet applies forced constraints to specific CSS properties:

### Properties Overridden to System Colors
- `color` -> Forced to `CanvasText`, `ButtonText`, `LinkText`, `GrayText`, etc.
- `background-color` -> Forced to `Canvas`, `ButtonFace`, `Field`, etc.
- `border-color` -> Forced to `CanvasText`, `ButtonText`, `GrayText`.
- `outline-color` -> Forced to match active focus outline or `Highlight`.
- `text-decoration-color` -> Forced to match text color or `LinkText`.
- SVG `fill` and `stroke` -> Forced to match system text/border color.

### Properties Forced to `none`
- `box-shadow` -> Forced to `none` (stripped completely).
- `text-shadow` -> Forced to `none` (stripped completely).
- `filter` / `backdrop-filter` -> Stripped or forced to `none` for color-modifying filters.

### Properties Preserved
- `border-width` & `border-style`
- `outline-width` & `outline-style` & `outline-offset`
- `opacity`
- `transform` & `translate` & `scale`
- Layout properties (`display`, `flex`, `grid`, `position`, `width`, `height`, `padding`, `margin`)

---

## 3. The `forced-color-adjust` CSS Property

The `forced-color-adjust` property allows developers to selectively opt out an element from browser color forcing.

### Syntax
```css
.color-swatch {
  forced-color-adjust: none;
}
```

### Values
- `auto` (Default): The browser automatically forces system colors onto the element.
- `none`: The browser leaves the element's `color`, `background-color`, and `border-color` untouched.

### Rules of Engagement for `forced-color-adjust: none`
1. **Never use on general UI containers or typography.** Applying `none` to large sections forces custom dark/light colors onto low-vision users who explicitly requested high-contrast system colors.
2. **Use strictly for color preview elements:**
   - Color picker swatches
   - Theme color selectors
   - Syntax highlighting where color code meaning is essential
   - Status heatmaps or maps with categorical color keys
3. **Always pair with a system border:** Elements with `forced-color-adjust: none` MUST include `border: 2px solid CanvasText` so they remain visible if their background happens to match the user's `Canvas` system background color.

---

## 4. SVG Icons & Graphics Guidelines

In Forced Colors Mode, SVG icons can become invisible if they rely on custom hardcoded hex fills or complex multi-color CSS gradients.

### Recommendations
1. **Use `fill: currentColor` or `stroke: currentColor`:** Inline SVGs using `currentColor` automatically inherit the system text color (`CanvasText`, `ButtonText`, `HighlightText`).
2. **Explicit High-Contrast Fills in Media Query:**
   ```css
   @media (forced-colors: active) {
     .action-icon {
       fill: CanvasText;
     }

     button:hover .action-icon {
       fill: Highlight;
     }

     button:disabled .action-icon {
       fill: GrayText;
     }
   }
   ```
3. **Avoid CSS Background Image Icons:** `background-image: url("icon.svg")` is often suppressed or uncolored in forced-colors mode. Convert icon buttons to inline SVGs or `<img src="...">` with appropriate `alt` text.

---

## 5. DevTools Emulation Workflow

### Chrome / Edge
1. Press `F12` to open DevTools.
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac) to open the Command Menu.
3. Type `Emulate CSS forced-colors: active` and press `Enter`.
4. To disable, open Command Menu and type `Emulate CSS forced-colors: default`.

### Firefox
1. Open `about:config` in the address bar.
2. Search for `browser.display.document_color_use`.
3. Set value to `2` (Force system colors) or `1` (Always use custom page colors).
