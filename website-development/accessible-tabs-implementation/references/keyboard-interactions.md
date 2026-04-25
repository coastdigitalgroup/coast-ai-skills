# Tab Keyboard Interactions

Standardized keyboard patterns allow users to navigate tabbed interfaces
predictably without using a mouse.

## Standard Pattern (Horizontal)

| Key           | Action                                                                                                                                          |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`         | Moves focus to the **selected** tab. Pressing `Tab` again moves focus into the **active** tab panel (or the first focusable element inside it). |
| `Right Arrow` | Moves focus to the next tab in the `tablist`. If focus is on the last tab, it wraps to the first tab.                                           |
| `Left Arrow`  | Moves focus to the previous tab in the `tablist`. If focus is on the first tab, it wraps to the last tab.                                       |
| `Home`        | Moves focus to the first tab in the `tablist`.                                                                                                  |
| `End`         | Moves focus to the last tab in the `tablist`.                                                                                                   |

## Activation Modes

### 1. Automatic Activation (Default)

In this mode, moving focus to a tab using the arrow keys automatically
selects/activates that tab and displays its associated panel.

- **Best for:** Small panels with fast-loading content.
- **Implementation:** Arrow keys update `aria-selected`, `tabindex`, and panel
  visibility immediately.

### 2. Manual Activation

In this mode, moving focus with arrow keys does **not** activate the tab. The
user must explicitly press `Enter` or `Space` to activate it.

- **Best for:** Panels that load content via AJAX, have heavy media, or if the
  tablist is very long.
- **Implementation:** `Enter` or `Space` triggers the activation logic. Arrow
  keys only update focus.

## Vertical Orientation

If `aria-orientation="vertical"` is set:

- Use `Down Arrow` instead of `Right Arrow`.
- Use `Up Arrow` instead of `Left Arrow`.
