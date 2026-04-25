# Keyboard Interactions for Tabs

Standard tabbed interfaces follow a specific keyboard pattern to ensure
efficiency for power users and accessibility for those who cannot use a mouse.

| Key             | Action                                                                                                                                                                                   |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tab**         | When focus enters the `tablist`, it lands on the **active** tab. Pressing `Tab` again moves focus **out** of the `tablist` and into the next focusable element (usually the `tabpanel`). |
| **Left Arrow**  | Moves focus to the previous tab. If on the first tab, focus moves to the last tab.                                                                                                       |
| **Right Arrow** | Moves focus to the next tab. If on the last tab, focus moves to the first tab.                                                                                                           |
| **Up Arrow**    | (Vertical only) Moves focus to the previous tab.                                                                                                                                         |
| **Down Arrow**  | (Vertical only) Moves focus to the next tab.                                                                                                                                             |
| **Space**       | Activates the focused tab (if not already activated).                                                                                                                                    |
| **Enter**       | Activates the focused tab (if not already activated).                                                                                                                                    |
| **Home**        | Moves focus to the first tab.                                                                                                                                                            |
| **End**         | Moves focus to the last tab.                                                                                                                                                             |

## Activation Strategies

### Automatic Activation (Follow Focus)

- **Behavior:** The panel content updates immediately as the user arrows through
  the tabs.
- **Use Case:** Best for fast-loading content (local DOM).
- **Pros:** Fewer keypresses for the user.

### Manual Activation

- **Behavior:** Focus moves to the tab, but the panel content does not update
  until the user presses `Space` or `Enter`.
- **Use Case:** Best for slow-loading content (API calls) or if switching tabs
  triggers a significant UI change that could be disorienting if done repeatedly
  while "passing through" tabs.
- **Pros:** Prevents accidental triggers of expensive operations.
