---
name: roving-tabindex-implementation
description:
  Manage keyboard focus within composite UI widgets using the roving tabindex pattern,
  directional arrow key spatial navigation (1D/2D), RTL alignment, Home/End key support, and dynamic DOM mutation sync.
---

# Roving Tabindex Implementation

## Purpose

The Roving Tabindex Implementation skill provides a production-grade framework for managing keyboard focus inside composite web UI widgets (such as toolbars, tab lists, menus, radio groups, grids, and action button sets). According to the WAI-ARIA Authoring Practices Guide (APG), composite widgets should constitute a single stop in the page's natural `Tab` key navigation sequence. Once focus enters the composite container, directional arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`), `Home`, and `End` must move focus cleanly between focusable sub-items.

This skill establishes deterministic, zero-dependency visual focus management by maintaining `tabindex="0"` on exactly one active item within the composite container while keeping all inactive peer items at `tabindex="-1"`. It prevents keyboard navigation traps, eliminates tabbing fatigue across dense component lists, synchronizes aria selection state, supports Right-to-Left (RTL) reading directions, handles dynamic DOM additions/removals, and ensures leak-free lifecycle cleanup using `AbortController`.

## Use Cases

- **Interactive Toolbars & Rich Text Editors:** Managing keyboard focus across a horizontal bar of formatting buttons (bold, italic, alignment, lists) so pressing `Tab` jumps past the entire toolbar to the editor canvas while `ArrowRight`/`ArrowLeft` step between formatting toggles.
- **Tabbed Interface Controls (`role="tablist"`):** Enabling arrow-key navigation between tab controls (`role="tab"`), allowing users to switch active panels seamlessly with horizontal arrow keys.
- **Radio Button Groups (`role="radiogroup"`):** Implementing accessible custom radio controls where arrow keys move focus and selection simultaneously across radio options.
- **2D Card Grids & Data Tables (`role="grid"`):** Navigating multi-row/multi-column interactive elements (e.g. image galleries, date pickers, kanban cards) using all four directional arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`).
- **Custom Dropdown Menus & Menu Bars (`role="menu"` / `role="menubar"`):** Providing desktop-grade vertical keyboard navigation through menu items (`role="menuitem"`).

## When NOT to Use

- **Standard Document Flow Content:** Sequential page links, body paragraphs, forms, or standalone buttons that are meant to be reached via natural sequential `Tab` key navigation.
- **Modal Dialog Traps:** Restricting focus inside an open dialog or modal container. Use `focus-trap-implementation` instead, as modals retain normal `Tab` navigation inside their container boundaries.
- **Single Interactive Form Fields:** Standard text inputs, standard HTML `<select>` elements, textareas, or checkboxes that handle native internal keyboard interactions.
- **`aria-activedescendant` Virtual Focus Widgets:** Large virtualized lists or trees where DOM nodes are not individually focusable and visual focus is indicated via CSS while single container element retains actual DOM focus (use `virtual-list-implementation` or `aria-activedescendant` patterns).

## Inputs

1. **Container Element (`HTMLElement`):** The composite parent container (`role="toolbar"`, `role="tablist"`, `role="radiogroup"`, `role="grid"`, `role="menu"`).
2. **Item Selector (`string`):** CSS selector string matching focusable target items within the container (e.g. `[role="tab"]`, `.toolbar-btn`, `[role="radio"]`).
3. **Navigation Axis / Orientation (`'horizontal' | 'vertical' | 'both'`):** Directional navigation mode. `'both'` enables 2D grid matrix navigation.
4. **Configuration Options:**
   - `wrap` (`boolean`, default: `true`): Whether arrow navigation wraps from end to start and vice versa.
   - `autoSelect` (`boolean`, default: `false`): Whether moving focus automatically triggers selection/activation (e.g. automatic tab switching).
   - `dir` (`'ltr' | 'rtl' | 'auto'`, default: `'auto'`): Explicit text direction override for arrow key flipping.
   - `signal` (`AbortSignal`, optional): Lifecycle signal for automatic event listener teardown.

## Outputs

1. **Single Tab Stop Composite Widget:** A container where exactly one active child has `tabindex="0"` and all other items have `tabindex="-1"`.
2. **Spatial Keyboard Event Listener:** Delegated listener handling `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, and `End` key execution.
3. **Focus State & Attribute Synchronization:** Automatic DOM updates setting `tabindex`, `aria-selected` / `aria-checked`, and triggering `.focus()` on the newly activated item.
4. **Dynamic DOM Sync:** Automatic re-evaluation of focus targets when child DOM nodes are appended, removed, or hidden.

## Workflow

### 1. Initialize HTML Structure & Composite Roles

Ensure the parent container has a clear composite role (`role="toolbar"`, `role="tablist"`, etc.) and child items are semantically defined. Initially, set `tabindex="0"` on the default/active item and `tabindex="-1"` on all peer items.

```html
<div role="toolbar" aria-label="Text Formatting" class="toolbar">
  <button type="button" class="toolbar-item" tabindex="0" aria-pressed="false">Bold</button>
  <button type="button" class="toolbar-item" tabindex="-1" aria-pressed="false">Italic</button>
  <button type="button" class="toolbar-item" tabindex="-1" aria-pressed="false">Underline</button>
  <button type="button" class="toolbar-item" tabindex="-1" aria-pressed="false">Strikethrough</button>
</div>
```

### 2. Implement Roving Tabindex Logic

Manage focus updates by setting `tabindex="-1"` on the currently focused element, updating the index pointer, setting `tabindex="0"` on the target element, and calling `.focus()`.

```javascript
function setActiveItem(items, nextIndex, focus = true) {
  items.forEach((item, index) => {
    if (index === nextIndex) {
      item.setAttribute('tabindex', '0');
      if (focus) item.focus();
    } else {
      item.setAttribute('tabindex', '-1');
    }
  });
}
```

### 3. Handle Keyboard Spatial Navigation (1D & 2D)

Listen for keydown events on the container. Prevent default browser scrolling behavior for arrow keys and compute the next target index based on orientation, text direction, and wrap rules.

```javascript
function handleKeyDown(event, container, items, options) {
  const { orientation = 'horizontal', wrap = true, dir = 'ltr' } = options;
  const isRTL = dir === 'rtl' || getComputedStyle(container).direction === 'rtl';
  const target = event.target.closest(options.itemSelector);

  if (!target || !items.includes(target)) return;

  const currentIndex = items.indexOf(target);
  let nextIndex = currentIndex;

  const prevKey = orientation === 'vertical' ? 'ArrowUp' : (isRTL ? 'ArrowRight' : 'ArrowLeft');
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : (isRTL ? 'ArrowLeft' : 'ArrowRight');

  switch (event.key) {
    case prevKey:
      event.preventDefault();
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = wrap ? items.length - 1 : 0;
      break;
    case nextKey:
      event.preventDefault();
      nextIndex = currentIndex + 1;
      if (nextIndex >= items.length) nextIndex = wrap ? 0 : items.length - 1;
      break;
    case 'Home':
      event.preventDefault();
      nextIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      nextIndex = items.length - 1;
      break;
    default:
      return;
  }

  if (nextIndex !== currentIndex) {
    setActiveItem(items, nextIndex, true);
  }
}
```

### 4. Support 2D Spatial Grid Matrix Navigation

For composite widgets arranged in two dimensions (e.g. `role="grid"` or multi-column icon sets), compute target row and column coordinates.

```javascript
function get2DNextIndex(currentIndex, columns, total, key, wrap) {
  const currentRow = Math.floor(currentIndex / columns);
  const currentCol = currentIndex % columns;
  const totalRows = Math.ceil(total / columns);

  let targetRow = currentRow;
  let targetCol = currentCol;

  switch (key) {
    case 'ArrowLeft':
      targetCol--;
      if (targetCol < 0) {
        if (wrap) {
          targetCol = columns - 1;
          targetRow = targetRow > 0 ? targetRow - 1 : totalRows - 1;
        } else {
          targetCol = 0;
        }
      }
      break;
    case 'ArrowRight':
      targetCol++;
      if (targetCol >= columns) {
        if (wrap) {
          targetCol = 0;
          targetRow = targetRow < totalRows - 1 ? targetRow + 1 : 0;
        } else {
          targetCol = columns - 1;
        }
      }
      break;
    case 'ArrowUp':
      targetRow--;
      if (targetRow < 0) targetRow = wrap ? totalRows - 1 : 0;
      break;
    case 'ArrowDown':
      targetRow++;
      if (targetRow >= totalRows) targetRow = wrap ? 0 : totalRows - 1;
      break;
  }

  let computedIndex = targetRow * columns + targetCol;
  if (computedIndex >= total) {
    computedIndex = total - 1;
  }
  return computedIndex;
}
```

### 5. Sync Selection and Dynamic DOM Mutations

When items are dynamically inserted or removed (or hidden via `display: none` / `hidden` attribute), automatically re-scan visible focusable targets. If the currently active `tabindex="0"` item is removed, transfer focusability to the nearest adjacent sibling.

```javascript
class RovingTabindex {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { itemSelector: '[role="tab"]', ...options };
    this.controller = new AbortController();
    this.init();
  }

  getItems() {
    return Array.from(this.container.querySelectorAll(this.options.itemSelector))
      .filter(el => !el.disabled && el.offsetParent !== null && el.getAttribute('aria-hidden') !== 'true');
  }

  sync() {
    const items = this.getItems();
    if (items.length === 0) return;

    const currentFocusable = items.find(el => el.getAttribute('tabindex') === '0');
    if (!currentFocusable) {
      setActiveItem(items, 0, false);
    }
  }

  destroy() {
    this.controller.abort();
  }
}
```

## Decision Rules

- **Roving Tabindex vs. `aria-activedescendant`:**
  - **Use Roving Tabindex:** For real DOM elements that can natively accept browser focus (`<button>`, `<a href>`, `[tabindex]`). Best for toolbars, tablists, button groups, standard radio groups, and menu bars.
  - **Use `aria-activedescendant`:** For virtualized lists, huge data grids (1000+ items), or complex combobox dropdowns where keeping actual DOM focus on an `<input>` while managing visual focus on non-focusable child nodes is required.
- **Orientation Rules:**
  - **Horizontal (`ArrowLeft` / `ArrowRight`):** Use for `role="tablist"` (horizontal), `role="toolbar"` (horizontal), and horizontal radio groups.
  - **Vertical (`ArrowUp` / `ArrowDown`):** Use for `role="menu"`, vertical `role="tablist"`, or vertical radio groups.
  - **2D Both (`ArrowLeft` / `ArrowRight` / `ArrowUp` / `ArrowDown`):** Use for `role="grid"`, color pickers, or thumbnail galleries.
- **RTL Support Rule:**
  - Always invert `ArrowLeft` and `ArrowRight` key behavior when `getComputedStyle(container).direction === 'rtl'`. Pressing `ArrowLeft` in RTL should move to the *next* visual item (right to left).

## Constraints

- **Single Tab Stop Guarantee:** Never allow more than one element inside the composite container to have `tabindex="0"`. All inactive peer elements must have `tabindex="-1"`.
- **Disabled Items Rule:** Disabled items (`disabled` or `aria-disabled="true"`) must be handled according to APG specs:
  - If disabled items are focusable (`aria-disabled="true"`), arrow keys can focus them, but action triggers are blocked.
  - If disabled items are natively disabled (`disabled`), arrow navigation must skip over them to the next enabled sibling.
- **Prevent Default Browsing Action:** Always call `event.preventDefault()` on handled directional arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`) to prevent default page scrolling or carets moving in text fields.
- **Focus Ring Visibility:** Never remove focus outlines using `outline: none` without providing a high-contrast `:focus-visible` indicator (see `focus-visible-styling-system`).

## Non-Goals

- Managing focus trapping inside modal dialog overlays (use `focus-trap-implementation`).
- Virtualizing thousands of off-screen DOM nodes (use `virtual-list-implementation`).
- Replacing native single-select dropdown `<select>` element behaviors.

## Common Failure Patterns

- **Multiple `tabindex="0"` Elements:** Leaving all toolbar or tab buttons with `tabindex="0"`, forcing keyboard users to press `Tab` 15 times to exit a toolbar.
- **Ignored RTL Text Direction:** Binding `ArrowLeft` strictly to `currentIndex - 1` regardless of `dir="rtl"`, causing focus to move visually backwards for Right-to-Left language users.
- **Focusing Hidden or Disabled Elements:** Moving `tabindex="0"` and calling `.focus()` on an element styled with `display: none` or `visibility: hidden`, causing focus to drop to `document.body`.
- **Missing `Home` and `End` Keys:** Implementing arrow keys but omitting `Home` (jump to first item) and `End` (jump to last item), violating WAI-ARIA APG standards.
- **Page Scroll Jank on Arrow Keys:** Forgetting `event.preventDefault()` on `ArrowDown` or `ArrowUp`, causing the entire browser window to scroll while moving focus inside a menu or tablist.
- **Stale DOM References After Dynamic Updates:** Not updating the items array when new tabs or toolbar buttons are dynamically added via AJAX or client-side rendering.

## Validation Steps

- [ ] **Tab Stop Audit:** Press `Tab` from an element before the composite container. Confirm focus lands directly on the active item. Press `Tab` again and verify focus exits the container immediately to the next page element.
- [ ] **Arrow Navigation Audit:** Press directional arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) inside the widget and verify focus moves smoothly between siblings without scrolling the viewport.
- [ ] **Home / End Key Verification:** Press `Home` and confirm focus jumps to the first enabled item. Press `End` and confirm focus jumps to the last enabled item.
- [ ] **RTL Verification:** Set `dir="rtl"` on the container or parent element. Confirm that `ArrowLeft` moves visually left-to-right (to the next physical element in RTL layout).
- [ ] **Dynamic Mutation Sync:** Programmatically insert or remove an item in the container. Verify arrow key navigation recalculates indices without throwing errors or skipping items.
- [ ] **Clean Teardown:** Call `destroy()` or trigger `AbortSignal.abort()`. Inspect event listeners in browser DevTools to confirm zero dangling `keydown` listeners remain.
