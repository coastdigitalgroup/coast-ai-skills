---
name: high-contrast-forced-colors-implementation
description:
  Build and remediate web components for Windows High Contrast Mode and CSS forced-colors mode using system color keywords, explicit borders, and forced-color-adjust rules.
---

# High Contrast & Forced Colors Implementation

## Purpose

The High Contrast & Forced Colors Implementation skill provides a technical protocol, CSS architecture, and auditing workflow for ensuring websites and web applications remain usable, distinct, and fully accessible in Forced Colors Mode (such as Windows High Contrast Mode / Contrast Themes).

When users activate a high-contrast system theme, browsers enter Forced Colors Mode (`@media (forced-colors: active)`). In this mode, the browser overrides user-defined CSS properties—such as `color`, `background-color`, `border-color`, `box-shadow`, `text-decoration-color`, `outline-color`, and SVG `fill`/`stroke`—with a restricted palette of user-chosen CSS system colors (`Canvas`, `CanvasText`, `ButtonText`, `Highlight`, `LinkText`, etc.).

Without explicit forced-colors CSS patterns, common modern UI designs collapse:
- **Custom controls** (checkboxes, radios, toggles, custom selects) that rely on `box-shadow` or background color fills become completely invisible or indistinguishable in checked vs. unchecked states.
- **Focus rings** built solely with `box-shadow` disappear entirely, breaking WCAG 2.1 Focus Visible (2.4.7).
- **Icon buttons and SVG indicators** that inherit `currentColor` or rely on background images lose visual meaning or become transparent ghosts.
- **Selection states, tabs, and active navigation items** that rely on background color changes lose all visual distinction.

This skill equips developers to build UI components that gracefully adapt to forced-colors mode, preserve vital state cues, and leverage CSS system color keywords without compromising normal color themes.

---

## Use Cases

- **Custom Form Controls:** Remediation of custom checkboxes, radio buttons, switches, ranges, and custom selects where checked/active/disabled visual indicators vanish in high-contrast mode.
- **Focus Indicator Remediation:** Ensuring interactive element focus styles remain high-contrast and visible when custom `box-shadow` or `outline: none` removes browser defaults.
- **Icon Buttons and Inline SVGs:** Ensuring standalone SVG icons, social share controls, status icons, and toolbar buttons retain fill/stroke visibility against high-contrast system canvases.
- **Active and Selected States:** Adapting tabs, accordions, segmented controls, table row selections, and navigation item highlights that rely on background colors.
- **Status Badges, Chips, and Alerts:** Maintaining visual separation and text/icon contrast for warning, success, error, and informational banners when custom background colors are overridden.
- **Complex Visual Components:** Charts, diagrams, step indicators, split pane dividers, and timeline markers that lose visual borders or lines.

---

## When NOT to Use

- **Standard Dark Mode / Light Mode Styling:** For general OS dark/light theme switching based on color preference, use `@media (prefers-color-scheme: dark)` (see `dark-mode-implementation`). Forced colors is a system accessibility override, not a visual preference scheme.
- **Color Contrast Ratio Calculation in Normal Schemes:** For establishing brand color palettes or calculating standard WCAG text contrast ratios (1.4.3 / 1.4.11) under standard rendering, use `accessible-color-system`.
- **Pure Native HTML Elements:** Standard native `<button>`, `<input type="checkbox">`, `<select>`, `<a href="...">` elements without custom CSS resets or background image overrides generally inherit system high-contrast colors automatically from the user agent stylesheet.

---

## Inputs

1. **Component HTML & CSS Source:** DOM markup and existing styles for interactive components, form controls, tabs, icons, badges, or layouts.
2. **Interactive States Inventory:** List of visual states (default, hover, focus-visible, active, selected, checked, disabled, error, read-only) that must remain distinct.
3. **Auditing Environment:** Browser DevTools with Forced Colors Emulation enabled (e.g., Chrome DevTools -> Rendering -> Emulate CSS media feature `forced-colors: active` or Edge/Firefox High Contrast mode, or Windows Contrast Themes).

---

## Outputs

1. **Forced-Colors CSS Enhancements:** Targeted `@media (forced-colors: active)` media query blocks and utility styling added to component CSS files.
2. **Transparent Border Fallbacks:** Dual-purpose CSS borders (`1px solid transparent` in default mode, automatically taking system text/border color in forced-colors mode) that preserve layout geometry without visual noise in standard rendering.
3. **System Color Keyword Mappings:** Standardized usage of CSS System Colors (`Canvas`, `CanvasText`, `ButtonText`, `Highlight`, `HighlightText`, `LinkText`, `GrayText`, `Mark`, `MarkText`, `Field`, `FieldText`) for custom controls and selection states.
4. **Controlled `forced-color-adjust` Overrides:** Surgical use of `forced-color-adjust: none` for visual graphics or color previews (e.g., color pickers, swatches) where system color forcing destroys essential semantic color data.
5. **High-Contrast Audit Report:** Verification log confirming all component states, focus rings, borders, and interactive indicators pass visual inspection under Forced Colors Mode.

---

## Workflow

### Step 1: Audit Component in Forced Colors Emulation

1. Open the website or component in Chrome, Edge, or Firefox.
2. Open DevTools:
   - **Chrome/Edge:** `Command+Shift+P` (Mac) or `Control+Shift+P` (Windows) -> Type "Emulate CSS forced-colors: active" or go to **Rendering** tab -> **Emulate CSS media feature forced-colors** -> Select `forced-colors: active`.
   - **Windows Native:** Turn on **Contrast Themes** in Windows Settings (`Alt + Left Shift + Print Screen` or Settings -> Accessibility -> Contrast themes).
3. Test every component state: default, hover, focus, active, selected/checked, disabled, error.
4. Record invisible elements, missing focus rings, lost borders, and ambiguous selection states.

### Step 2: Identify Overridden Properties and Structural Breaks

Understand what the browser overrides when `forced-colors: active` is enabled:
- **Overridden to System Palette:** `color`, `background-color`, `border-color`, `outline-color`, `text-decoration-color`, `box-shadow` (forced to `none`), `text-shadow` (forced to `none`), SVG `fill` and `stroke`.
- **Preserved Properties:** `border-width`, `border-style`, `outline-width`, `outline-style`, `opacity`, `transform`, `display`, `visibility`, `content`.

Common structural breaks:
- Components using `box-shadow` for borders or focus rings become borderless and ringless because `box-shadow` is forced to `none`.
- Custom checkboxes using a background color fill or CSS `background-image` checkmark icon lose their checkmark and fill.
- Tabs using `background-color: #0066cc` for the active tab look identical to inactive tabs because all tab backgrounds turn into `Canvas` or `ButtonFace`.

### Step 3: Implement Dual-Purpose Transparent Borders

For elements that rely on background colors or box shadows for container boundary definition in standard CSS, add `border: 1px solid transparent` or `outline: 1px solid transparent` in default CSS:

```css
/* Default CSS: Transparent border is invisible in normal mode */
.card,
.custom-select,
.tooltip-content,
.badge {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent; /* In forced-colors, transparent border resolves to system CanvasText / ButtonText */
}
```

### Step 4: Add `@media (forced-colors: active)` Remediation Block

Use explicit system colors and media queries to fix custom controls, focus rings, selected items, and SVG icons.

```css
@media (forced-colors: active) {
  /* Fix 1: Ensure active/selected tabs stand out using Highlight system color */
  .tab-item[aria-selected="true"] {
    background-color: Highlight;
    color: HighlightText;
    border-bottom: 2px solid HighlightText;
  }

  /* Fix 2: Restore visible focus indicator using system Highlight / CanvasText */
  .custom-button:focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }

  /* Fix 3: Disabled state using system GrayText color */
  .custom-button:disabled,
  .custom-input:disabled {
    color: GrayText;
    border-color: GrayText;
  }

  /* Fix 4: SVG icons inheriting current system color */
  .icon-svg {
    fill: CanvasText;
  }

  /* Fix 5: Custom checkbox indicator */
  .custom-checkbox[aria-checked="true"]::after {
    background-color: Highlight;
    border: 1px solid HighlightText;
  }
}
```

### Step 5: Handle Semantic Color Data with `forced-color-adjust`

When building controls where the actual color is essential semantic information (such as color picker swatches, theme selectors, syntax highlighters, or status heatmaps), opt out of automatic color forcing using `forced-color-adjust: none`:

```css
.color-picker-swatch {
  /* Opt out of browser color overrides ONLY for the swatch preview box */
  forced-color-adjust: none;
  background-color: var(--swatch-color);
  /* CRITICAL: Must provide a visible system border so the swatch remains visible on Canvas */
  border: 2px solid CanvasText;
}

@media (forced-colors: active) {
  .color-picker-swatch:focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}
```

---

## Decision Rules

### 1. Transparent Border vs. Explicit `@media (forced-colors: active)`

- **Use Transparent Borders (`border: 1px solid transparent`)** in default CSS for containers, cards, dropdown menus, modals, and tooltips where the element has a background/shadow in normal mode but needs a boundary outline in forced-colors mode without layout shifting.
- **Use `@media (forced-colors: active)` Media Query** when changing element colors to system keywords (`Highlight`, `HighlightText`, `CanvasText`), adjusting active/selected state styling, styling disabled states with `GrayText`, or managing SVG fills.

### 2. Choosing the Right System Color Keyword

| Desired Role / Element | Recommended CSS System Color | Notes / Complement |
| :--- | :--- | :--- |
| **Page / Container Background** | `Canvas` | Default background of documents. |
| **Main Body Text** | `CanvasText` | Pair with `Canvas` for readable content. |
| **Button Text / Controls** | `ButtonText` | Text on interactive buttons and inputs. |
| **Button Background** | `ButtonFace` | Background of native push buttons. |
| **Hyperlinks** | `LinkText` | System link color (often blue or purple). |
| **Selected / Active Item Fill** | `Highlight` | Background for selected tabs, options, text. |
| **Text on Selected Item** | `HighlightText` | Text color paired with `Highlight`. |
| **Disabled Controls / Text** | `GrayText` | Muted color for unclickable items. |
| **Highlighted Search Text** | `Mark` / `MarkText` | Text background (`Mark`) and text (`MarkText`). |
| **Form Field Fill / Text** | `Field` / `FieldText` | Background (`Field`) and text (`FieldText`) of inputs. |

### 3. When to Use `forced-color-adjust: none`

- **Use `forced-color-adjust: none` ONLY when:**
  1. The component displays a color sample (color swatch, palette picker, status heatmaps, syntax highlighting where color conveys code meaning).
  2. You explicitly set both `background-color` and `color` to ensure a minimum contrast ratio of 4.5:1 against `Canvas`.
  3. You provide a visible `border: 2px solid CanvasText` or `Highlight` so the element remains discernible against high-contrast system backgrounds.
- **DO NOT use `forced-color-adjust: none`** on entire components, buttons, dialogs, or typography to bypass system contrast themes. Bypassing forced colors on general UI harms low-vision users who rely on high-contrast system themes.

---

## Constraints

- **Shadows are Stripped:** CSS `box-shadow`, `text-shadow`, and `filter: drop-shadow()` are forced to `none` by browsers in forced-colors mode. Never rely exclusively on shadows for elevation, borders, focus rings, or component boundaries.
- **Background Images are Hidden:** Background images (`background-image: url(...)`) are typically suppressed unless they contain `gradient()` values or are specifically preserved. Rely on SVGs, inline text, or borders for icons and status markers.
- **Color Contrast Assurance with `Highlight`:** When assigning `background-color: Highlight`, always explicitly set `color: HighlightText`. Never mix custom RGB colors with system color keywords (e.g., `background-color: Highlight; color: #ffffff`), as the user's `Highlight` theme color may be yellow or white, causing invisible white-on-white text.
- **Border Box Layout Shift:** Adding a `1px` border inside `@media (forced-colors: active)` can cause layout jumps if `box-sizing: border-box` is not set or if layout space was not reserved. Always use `border: 1px solid transparent` in default styles or use `outline`.

---

## Non-Goals

- **Replacing Standard Dark/Light Mode Themes:** This skill does not cover design systems for custom website dark themes (`prefers-color-scheme`).
- **Overriding User High-Contrast Preferences:** This skill does not provide methods for forcing brand colors onto users who have forced-colors mode enabled.
- **JavaScript System Color Detection:** System colors should be handled purely through CSS media queries and keywords, not JS window checks.

---

## Common Failure Patterns

- **Invisible Focus Indicators:** Restyling focus rings with `box-shadow: 0 0 0 3px #0066cc; outline: none;`. In forced-colors mode, `box-shadow` is removed and `outline: none` silences the focus ring completely.
  - *Fix:* Use `outline: 2px solid transparent` or `outline: 2px solid Highlight` for focus rings. Transparent outlines become visible system outlines in forced-colors mode.
- **Border-less Cards and Modals:** Designing floating cards or dialog windows with `#ffffff` background and `box-shadow` but `border: none`. In high-contrast mode, the modal background merges invisibly into the page background (`Canvas`).
  - *Fix:* Declare `border: 1px solid transparent` on cards, dropdown menus, and modals in base CSS.
- **Vanishing Checked Checkbox / Toggle:** Custom checkboxes built with a colored fill and CSS pseudo-element checkmark using background images. In high-contrast mode, checked and unchecked boxes look identical.
  - *Fix:* Use `@media (forced-colors: active)` to apply `background-color: Highlight` and `border: 2px solid HighlightText` when checked, or use an inline SVG with `fill: HighlightText`.
- **Mixing System Keywords with Fixed Colors:** Setting `background-color: Highlight` but leaving `color: #ffffff`. If the user's system high contrast theme uses a bright cyan `Highlight` background, white text becomes completely unreadable.
  - *Fix:* Always pair system colors in matching pairs (`Highlight` + `HighlightText`, `Canvas` + `CanvasText`, `Field` + `FieldText`).
- **Uncontrolled `forced-color-adjust: none`:** Placing `forced-color-adjust: none` on a container or entire form to protect brand styles, forcing dark blue text onto a user's black high-contrast background.
  - *Fix:* Limit `forced-color-adjust: none` strictly to color preview swatches.

---

## Validation Steps

- [ ] **DevTools Forced-Colors Emulation:** Enable `forced-colors: active` in browser DevTools. Verify that all components, containers, modals, and tooltips have clear, visible boundaries against the background.
- [ ] **Focus State Inspection:** Keyboard tab through all interactive elements (`Tab` and `Shift+Tab`). Confirm every button, link, input, tab, and custom control displays a distinct high-contrast focus ring.
- [ ] **Interactive State Verification:**
  - Check custom checkboxes, radios, and toggle switches in both checked and unchecked states. Confirm state is unmistakably distinguishable.
  - Activate tabs, accordions, and menu items. Confirm active/selected items stand out clearly using `Highlight` or distinct borders.
  - Inspect disabled inputs and buttons. Confirm they display muted system text (`GrayText`) and are visually distinct from active controls.
- [ ] **SVG & Icon Audit:** Inspect all functional SVG icons (close buttons, search icons, status symbols). Confirm fills and strokes adapt to `CanvasText`, `ButtonText`, or `HighlightText`.
- [ ] **Color Swatch Check:** Verify color swatches or palette pickers with `forced-color-adjust: none` remain visible with explicit system borders (`border: 2px solid CanvasText`).
- [ ] **Multiple System Themes Test:** Test under both Dark High Contrast (e.g., Windows "Desert" or "Night sky") and Light High Contrast (e.g., Windows "Dawn") themes to ensure text/background contrast remains high across different system palettes.
