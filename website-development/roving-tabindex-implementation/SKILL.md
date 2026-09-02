---
name: roving-tabindex-implementation
description:
  Manage composite widget keyboard focus using the roving tabindex pattern,
  enabling single tab stop accessibility, arrow key spatial navigation (1D/2D),
  RTL alignment, Home/End handling, and dynamic DOM sync.
---

# Roving Tabindex Implementation

## Purpose

The Roving Tabindex Implementation skill provides a production-grade framework for managing keyboard focus within composite UI widgets (such as toolbars, tab lists, menus, button groups, action cards, and data grids). In standard Web Content Accessibility Guidelines (WCAG) keyboard interaction models, composite controls must present a **single Tab stop** to the document flow. Navigating *between* sub-elements inside the composite widget is handled using directional arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`), `Home`, and `End`.

This skill establishes resilient architectural patterns for dynamic `tabindex="0"` swapping (setting `tabindex="0"` on the active element and `tabindex="-1"` on all inactive siblings), managing focus state transitions, supporting Right-to-Left (RTL) reading directions, handling 2D grid matrix navigation, coordinating focus during dynamic DOM additions/deletions, and preventing memory leaks with `AbortController` and `MutationObserver`.

## Use Cases

- **Action Toolbars & Rich Text Formatting Bars:** Organizing collections of formatting buttons (`bold`, `italic`, `align-left`, `insert-link`) where tabbing through 20 individual buttons disrupts page navigation.
- **Tabbed Interfaces & Segmented Controls:** Navigating horizontal or vertical tab bars (`role="tablist"`) where pressing `Tab` moves focus directly into the tab panel, and `ArrowLeft`/`ArrowRight` switches active tabs.
- **Custom Context Menus, Dropdown Menus & Command Palettes:** Navigating dropdown menu items (`role="menu"` / `role="menuitem"`) or search results with vertical arrow key focus management.
- **Interactive Card Grids & Media Galleries:** Navigating 2D multi-row, multi-column item grids (`role="grid"` or composite interactive cards) using 4-way arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`).
- **Dynamic Tag/Chip Lists with Action Triggers:** Navigating closable tag chips where arrow keys move visual focus between tags, `Backspace`/`Delete` removes items, and focus automatically roves to neighboring chips.

## When NOT to Use

- **Standard Document Flow & Form Fields:** Navigating sequential form controls (`<input>`, `<select>`, `<textarea>`, standalone submit `<button>`). Standard form elements must remain individually focusable via `Tab`.
- **`aria-activedescendant` Managed Widgets:** Widgets where DOM elements cannot or should not receive physical browser focus (e.g. dynamic combobox suggestions or virtualized dropdowns where physical focus stays strictly on an `<input>`).
- **Independent Page Links & Navigation Headers:** Top-level primary site links (`<nav>`) where each link represents a distinct navigation destination rather than sub-controls of a single composite UI tool.
- **Single Component Controls:** Isolated buttons, checkboxes, or toggles that are not grouped into a parent composite widget structure.

## Inputs

1. **Container Element (`container`):** The DOM root (`HTMLElement`) housing the composite widget (e.g. `[role="toolbar"]`, `[role="tablist"]`, `[role="menu"]`, `[role="grid"]`).
2. **Item Selector (`itemSelector`):** CSS selector string targeting interactive items within the container (e.g. `button`, `[role="tab"]`, `[role="menuitem"]`, `.grid-cell`).
3. **Orientation (`orientation`):** `'horizontal'`, `'vertical'`, or `'grid'` (2D spatial matrix).
4. **Configuration Options:**
   - `wrap`: Boolean (`true` by default) indicating whether arrow navigation wraps around boundaries.
   - `rtl`: Boolean (`false` by default, or auto-detected via `getComputedStyle(container).direction === 'rtl'`) to invert horizontal arrow key behavior.
   - `activateOnFocus`: Boolean (`false` by default) whether focusing an item automatically triggers its primary selection action (common in tablists).
   - `signal`: `AbortSignal` for clean event listener teardown.

## Outputs

1. **Single Tab Stop Composite Widget:** A widget container where exactly one active child has `tabindex="0"` and all other items have `tabindex="-1"`.
2. **Directional Keyboard Focus Traversal:** Immediate, frame-synchronized focus movement responding to `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, and `End` keys.
3. **RTL-Compliant Spatial Mapping:** Correct reversed mapping of `ArrowLeft` and `ArrowRight` in Right-to-Left layout contexts.
4. **DOM Mutation Resilience:** Automatic recalculation of roving active indexes when items are added, removed, disabled, or hidden.

## Workflow

### 1. Establish the Single Tab Stop State

Initialize the container by scanning for target items. Ensure the first enabled item (or a designated default/stored active item) has `tabindex="0"`, while all other items are set to `tabindex="-1"`.

```javascript
function initializeRovingTabindex(container, itemSelector, defaultIndex = 0) {
  const items = Array.from(container.querySelectorAll(itemSelector))
    .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true');

  if (items.length === 0) return;

  items.forEach((item, index) => {
    if (index === defaultIndex) {
      item.setAttribute('tabindex', '0');
    } else {
      item.setAttribute('tabindex', '-1');
    }
  });
}
```

### 2. Implement Directional Key Event Interception

Listen for `keydown` events on the container element. Intercept directional keys, prevent default browser scrolling/tabbing behavior, compute the next target index, and invoke focus updates.

```javascript
function handleKeyDown(event, options) {
  const { items, currentIndex, orientation, wrap, isRtl } = options;
  const key = event.key;
  let nextIndex = currentIndex;

  const prevHorizKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
  const nextHorizKey = isRtl ? 'ArrowLeft' : 'ArrowRight';

  switch (key) {
    case prevHorizKey:
      if (orientation === 'horizontal' || orientation === 'grid') {
        event.preventDefault();
        nextIndex = getPreviousIndex(currentIndex, items.length, wrap);
      }
      break;
    case nextHorizKey:
      if (orientation === 'horizontal' || orientation === 'grid') {
        event.preventDefault();
        nextIndex = getNextIndex(currentIndex, items.length, wrap);
      }
      break;
    case 'ArrowUp':
      if (orientation === 'vertical') {
        event.preventDefault();
        nextIndex = getPreviousIndex(currentIndex, items.length, wrap);
      } else if (orientation === 'grid') {
        event.preventDefault();
        nextIndex = getGridUpIndex(currentIndex, options.columns, items.length, wrap);
      }
      break;
    case 'ArrowDown':
      if (orientation === 'vertical') {
        event.preventDefault();
        nextIndex = getNextIndex(currentIndex, items.length, wrap);
      } else if (orientation === 'grid') {
        event.preventDefault();
        nextIndex = getGridDownIndex(currentIndex, options.columns, items.length, wrap);
      }
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
      return; // Allow unhandled keys to propagate
  }

  updateRovingFocus(items, currentIndex, nextIndex);
}
```

### 3. Swap Tabindex Attributes and Shift Focus

To execute focus movement:
1. Update previous active element `tabindex` to `"-1"`.
2. Update target active element `tabindex` to `"0"`.
3. Call `.focus()` on the target active element.

```javascript
function updateRovingFocus(items, prevIndex, nextIndex) {
  if (prevIndex === nextIndex || !items[nextIndex]) return;

  const currentItem = items[prevIndex];
  const nextItem = items[nextIndex];

  if (currentItem) {
    currentItem.setAttribute('tabindex', '-1');
  }

  nextItem.setAttribute('tabindex', '0');
  nextItem.focus();
}
```

### 4. Sync Focus Swaps on Pointer Interaction

When a user clicks or taps an item inside the composite widget, update the roving state so that `tabindex="0"` follows the clicked item. If the user tabs away and tabs back, focus returns to the last interacted item.

```javascript
container.addEventListener('focusin', (event) => {
  const targetItem = event.target.closest(itemSelector);
  if (!targetItem || !container.contains(targetItem)) return;

  const items = Array.from(container.querySelectorAll(itemSelector));
  const newIndex = items.indexOf(targetItem);

  if (newIndex !== -1 && newIndex !== currentIndex) {
    items[currentIndex]?.setAttribute('tabindex', '-1');
    targetItem.setAttribute('tabindex', '0');
    currentIndex = newIndex;
  }
});
```

### 5. Handle Dynamic DOM Mutations with MutationObserver

When items are dynamically appended, removed, disabled, or filtered:
1. Re-query valid focusable items.
2. If the active item (`tabindex="0"`) was deleted, reassign `tabindex="0"` to the nearest available sibling or index 0.

```javascript
const observer = new MutationObserver(() => {
  syncRovingItems();
});

observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'hidden'] });
```

## Decision Rules

- **Roving Tabindex vs. `aria-activedescendant`:**
  - **Use Roving Tabindex:** For composite controls where sub-elements are real DOM nodes (`<button>`, `<a>`, `[role="tab"]`, `[role="menuitem"]`) that can natively receive browser focus ring highlights. Best for toolbars, tablists, button groups, context menus, and simple grids.
  - **Use `aria-activedescendant`:** When managing virtualized lists (where DOM elements are recycled/unmounted during scroll) or text input comboboxes where physical browser focus must stay inside the `<input>` element so the user can continue typing.
- **`activateOnFocus` Selection Behavior:**
  - **Automatic Activation (`activateOnFocus: true`):** Use for tabs (`role="tab"`) when tab panels load synchronously and lightweight rendering causes no layout thrashing.
  - **Manual Activation (`activateOnFocus: false`):** Use for toolbars, menus, and heavy tab panels (e.g. dynamic async data views) where arrow keys only move focus, and `Enter` or `Space` executes/selects the focused item.
- **RTL Handling:**
  - Always check `getComputedStyle(container).direction === 'rtl'` or `container.closest('[dir="rtl"]')`. In RTL mode, `ArrowLeft` moves to the next logical item (right to left in visual reading order), and `ArrowRight` moves to the previous item.

## Constraints

- **Single Tab Stop Guard:** At any given moment, exactly **one** item in the composite widget must have `tabindex="0"`. If multiple items have `tabindex="0"`, pressing `Tab` will force the user to visit every item, breaking WCAG composite widget rules.
- **Focusability Requirements:** Items in the roving list must be interactive elements or have `role` attributes assigned (`button`, `a[href]`, `[role="tab"]`, `[role="menuitem"]`, `[role="gridcell"]`).
- **Disabled Items Skipping:** Arrow key traversal must skip disabled elements (`[disabled]` or `[aria-disabled="true"]`) without stopping focus on them.
- **Visible Focus Indicator:** Roving focus relies on CSS focus indicators (`:focus-visible`). Never remove focus outlines without supplying custom high-contrast `:focus-visible` styles complying with WCAG 2.2 SC 2.4.13.

## Non-Goals

- Replacing native browser tab navigation outside of composite widgets.
- Managing focus trap boundaries for modal dialogs (use `focus-trap-implementation` instead).
- Handling client-side router page transition focus shifts (use `focus-management-client-side-navigation`).

## Common Failure Patterns

- **The Tab Stop Explosion:** Forgetting to set `tabindex="-1"` on all non-active child buttons, forcing keyboard users to press `Tab` dozens of times to exit a toolbar or tablist.
- **Stale Active Index on Element Deletion:** Deleting the item that currently holds `tabindex="0"` without reassigning `tabindex="0"` to a remaining sibling, leaving the entire widget with zero focusable items (`tabindex="-1"` on all children).
- **Ignoring RTL Direction:** Hardcoding `ArrowLeft` to decrement index and `ArrowRight` to increment index in Right-to-Left languages, causing arrow movement to behave opposite to visual reading direction.
- **Missing `Home` / `End` Support:** Implementing left/right arrow keys but omitting `Home` (jump to first item) and `End` (jump to last item), violating WAI-ARIA Authoring Practices for composite widgets.
- **Focus Lost During Screen Re-render:** Re-rendering composite widget DOM nodes on state change without restoring `tabindex="0"` and focus state on the previously active item index.

## Validation Steps

- [ ] **Single Tab Stop Audit:** Press `Tab` into the composite widget. Verify focus lands on the active item (`tabindex="0"`). Press `Tab` again and confirm focus moves *out* of the widget to the next page element, skipping all inactive items (`tabindex="-1"`).
- [ ] **Arrow Traversal Test:** Focus an item in the widget and press `ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown` (based on orientation). Verify focus moves smoothly between items without scrolling the browser page.
- [ ] **Boundary & Wrap Test:** Navigate to the first item and press `ArrowLeft`/`ArrowUp` (with `wrap: true`). Verify focus wraps around to the last item. Test `Home` and `End` keys to confirm immediate jump to start and end.
- [ ] **Disabled Item Bypass:** Mark an intermediate item as `disabled` or `aria-disabled="true"`. Navigate across it with arrow keys and verify focus skips directly to the next enabled item.
- [ ] **Dynamic Mutation Recovery:** Dynamically delete the focused item from the DOM via JavaScript. Confirm that `tabindex="0"` and active focus automatically fall back to an adjacent valid item.
- [ ] **RTL Direction Test:** Apply `dir="rtl"` to the container. Verify that `ArrowLeft` moves focus to the visually next item (to the left) and `ArrowRight` moves to the visually previous item (to the right).
