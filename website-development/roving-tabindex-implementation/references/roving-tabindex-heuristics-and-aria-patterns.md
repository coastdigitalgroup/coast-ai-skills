# Roving Tabindex Heuristics & ARIA Patterns

## Technical Principles

The roving tabindex pattern is an essential keyboard accessibility technique for **composite UI widgets**. The core principle is restricting keyboard `Tab` stops so that an entire multi-element widget consumes only a single `Tab` key interaction in the natural page document flow.

### Roving Tabindex vs. `aria-activedescendant`

| Feature / Criteria | Roving Tabindex | `aria-activedescendant` |
| :--- | :--- | :--- |
| **Physical Focus Target** | Shifts `.focus()` between actual child DOM elements (`tabindex="0"` vs `"-1"`). | Remains locked on parent container or `<input>` element. |
| **DOM Node Requirements** | Child elements must be distinct interactive focusable DOM nodes. | Children can be lightweight non-focusable elements (`<div>`, `<li>`). |
| **Screen Reader Announcement** | Native browser focus handling announces each focused DOM element. | Relies on `aria-activedescendant="item-id"` attribute updates. |
| **Virtual Scrolling / Large DOMs**| Requires DOM nodes to exist to receive physical focus. | Ideal for virtualized lists where DOM nodes are continuously recycled. |
| **Primary Use Cases** | Toolbars, Tab Lists, Action Buttons, Menus, Data Grids, Closable Tags. | Autocomplete Comboboxes, Virtualized Dropdowns, Search Command Bars. |

## WAI-ARIA Authoring Practice Specifications

### 1. Toolbar Pattern (`role="toolbar"`)

- **Structure:** Root container has `role="toolbar"` and an explicit `aria-label` or `aria-labelledby`.
- **Keyboard Model:**
  - `Tab`: Focus enters the toolbar landing on the active button (`tabindex="0"`). Pressing `Tab` again exits the toolbar.
  - `ArrowLeft` / `ArrowRight`: Roves focus between enabled toolbar buttons.
  - `Home` / `End`: Moves focus to first / last toolbar button.

### 2. Tab List Pattern (`role="tablist"`)

- **Structure:** Root container has `role="tablist"`. Children have `role="tab"` and link to panels via `aria-controls="panel-id"`.
- **Keyboard Model:**
  - `ArrowLeft` / `ArrowRight` (horizontal tablist) or `ArrowUp` / `ArrowDown` (vertical tablist): Roves focus across tabs.
  - `Selection Follows Focus` (`activateOnFocus: true`): Moving focus automatically activates the corresponding tab panel.
  - `Manual Selection` (`activateOnFocus: false`): Focus moves with arrow keys; pressing `Enter` or `Space` activates the tab panel.

### 3. Grid Pattern (`role="grid"`)

- **Structure:** Root container has `role="grid"`. Rows have `role="row"`, cells have `role="gridcell"`.
- **Keyboard Model:**
  - 2D Spatial Arrow Keys: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` move focus vertically and horizontally across cells.
  - `Home` / `End`: Moves focus to first / last cell in the current row (or grid boundary).

## RTL (Right-to-Left) Reading Direction Heuristics

When operating in an RTL document or container context (`dir="rtl"`):
- Horizontal visual layout is mirrored: the first item is on the far right, and subsequent items move toward the left.
- `ArrowLeft` key MUST move focus to the **next** logical item in the array (moving visually left).
- `ArrowRight` key MUST move focus to the **previous** logical item in the array (moving visually right).
- Always rely on `getComputedStyle(element).direction` rather than static document assumptions.

## CSS Focus Visible Guidelines

To ensure compliance with WCAG 2.2 SC 2.4.13 (Focus Appearance):
1. **Never suppress outlines with `outline: none` without providing an explicit replacement.**
2. Use the `:focus-visible` pseudo-class so that pointer clicks do not trigger harsh focus outlines, but keyboard arrow navigation renders clear outlines.

```css
/* Recommended focus ring style */
.composite-item:focus-visible {
  outline: 2px solid #0284c7;
  outline-offset: 2px;
}
```
