# Toolbar & Action Dock Accessibility & Keyboard Reference

## ARIA Semantics and Keyboard Navigation Protocol

### 1. ARIA Toolbar Attributes

| Attribute | Applied To | Value / Type | Purpose |
| :--- | :--- | :--- | :--- |
| `role="toolbar"` | Container `<div>` / `<section>` | Standard ARIA role | Identifies a group of interactive controls arranged in a horizontal bar or vertical rail. |
| `aria-label` | Toolbar Container | String (e.g., `"Formatting tools"`) | Required when no visible text heading exists to describe the toolbar's purpose. |
| `aria-labelledby` | Toolbar Container | Element ID reference | Connects the toolbar to a visible header element (e.g., `id="editor-heading"`). |
| `aria-orientation` | Toolbar Container | `"horizontal"` (default) or `"vertical"` | Informs assistive technology of spatial layout; dictates primary arrow key orientation. |
| `aria-pressed` | Toggle `<button>` | `"true"` \| `"false"` | Communicates active/toggle state (e.g., Bold ON vs Bold OFF) to screen readers. |
| `aria-expanded` | Popover / Dropdown Trigger | `"true"` \| `"false"` | Indicates whether a secondary options panel or color picker menu is currently open. |
| `aria-haspopup` | Dropdown Trigger | `"menu"` \| `"dialog"` \| `"true"` | Alerts screen readers that activating the control opens a popup interface. |

---

## Roving Tabindex Implementation Pattern

To avoid creating a keyboard navigation "tab storm" where keyboard users are forced to press `Tab` through 20+ toolbar items to reach content, implement the **Roving `tabindex` Pattern**.

### Core Roving Focus Logic Rules
1. **Single Tab Stop:** At any given time, exactly **one** enabled button inside `role="toolbar"` has `tabindex="0"`. All other buttons have `tabindex="-1"`.
2. **Tab Key Behavior:** Pressing `Tab` moves focus into the toolbar onto the single `tabindex="0"` item. Pressing `Tab` again immediately moves focus out of the toolbar container onto the next focusable page element.
3. **Arrow Key Navigation:**
   - In horizontal toolbars: `ArrowRight` advances focus to the next button; `ArrowLeft` moves to the previous button. Focus wraps around from last to first (and first to last).
   - In vertical tool rails: `ArrowDown` advances focus down; `ArrowUp` moves focus up.
   - `Home` key jumps focus directly to the first enabled button.
   - `End` key jumps focus directly to the last enabled button.
4. **State Persistence:** When focus leaves the toolbar, keep `tabindex="0"` assigned to the last focused button so returning via `Tab` restores previous focus position.

### JavaScript Roving Focus Algorithm

```javascript
class ToolbarRovingFocus {
  constructor(toolbarElement) {
    this.toolbar = toolbarElement;
    this.isVertical = this.toolbar.getAttribute('aria-orientation') === 'vertical';
    this.init();
  }

  getButtons() {
    return Array.from(
      this.toolbar.querySelectorAll('button:not(:disabled), [role="button"]:not([aria-disabled="true"])')
    );
  }

  init() {
    const buttons = this.getButtons();
    if (buttons.length === 0) return;

    // Ensure only the first button is in initial tab order
    buttons.forEach((btn, idx) => {
      btn.setAttribute('tabindex', idx === 0 ? '0' : '-1');
    });

    this.toolbar.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.toolbar.addEventListener('click', (e) => this.handleClick(e));
  }

  handleKeyDown(e) {
    const buttons = this.getButtons();
    const currentBtn = document.activeElement;
    const currentIndex = buttons.indexOf(currentBtn);

    if (currentIndex === -1) return;

    let nextIndex = null;
    const nextKey = this.isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = this.isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case prevKey:
        e.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = buttons.length - 1;
        break;
    }

    if (nextIndex !== null) {
      this.setFocus(buttons, currentIndex, nextIndex);
    }
  }

  handleClick(e) {
    const targetBtn = e.target.closest('button, [role="button"]');
    const buttons = this.getButtons();
    if (!targetBtn || !buttons.includes(targetBtn)) return;

    const currentIndex = buttons.findIndex(b => b.getAttribute('tabindex') === '0');
    const newIndex = buttons.indexOf(targetBtn);
    if (currentIndex !== -1 && newIndex !== -1) {
      this.setFocus(buttons, currentIndex, newIndex);
    }
  }

  setFocus(buttons, oldIndex, newIndex) {
    if (oldIndex >= 0 && oldIndex < buttons.length) {
      buttons[oldIndex].setAttribute('tabindex', '-1');
    }
    buttons[newIndex].setAttribute('tabindex', '0');
    buttons[newIndex].focus();
  }
}
```

---

## Target Sizing & High Contrast Rules

### Target Sizing Standards
- **Desktop Layout Density:** Minimum `28x28px` visible button box, with at least `4px` padding gap ensuring effective touch/click hit area of `36x36px` minimum.
- **Mobile & Touch Viewports:** Minimum `44x44px` or `48x48px` touch target box (`min-width: 44px; min-height: 44px;`).

### Windows High Contrast Mode (Forced Colors)
In `forced-colors: active` mode, custom background tints and subtle shadows disappear. Ensure buttons remain distinguishable using standard system color keywords:

```css
@media (forced-colors: active) {
  .tb-btn {
    border: 1px solid transparent;
  }

  .tb-btn:hover {
    border-color: Highlight;
  }

  .tb-btn[aria-pressed="true"] {
    background-color: Highlight;
    color: HighlightText;
    border-color: Highlight;
  }

  .tb-btn:focus-visible {
    outline: 2px solid CanvasText;
  }
}
```
