# Roving Tabindex Audit Checklist

Use this checklist to audit composite UI widgets (toolbars, tab lists, action groups, menus, card grids) to ensure compliance with WAI-ARIA authoring practices and WCAG 2.2 focus management requirements.

## 1. Document Flow & Tab Stops

- [ ] **Single Tab Stop Verification:** Pressing <kbd>Tab</kbd> into the composite widget moves focus to exactly **one** active child item (`tabindex="0"`).
- [ ] **Bypass Behavior:** Pressing <kbd>Tab</kbd> again immediately moves focus completely *out* of the widget to the next focusable page element, skipping all inactive sibling items (`tabindex="-1"`).
- [ ] **Shift+Tab Behavior:** Pressing <kbd>Shift</kbd> + <kbd>Tab</kbd> from outside the widget returns focus directly to the last active item holding `tabindex="0"`.

## 2. Keyboard Directional Traversal

- [ ] **1D Horizontal Orientation:** In horizontal widgets (e.g. toolbars, horizontal tablists), pressing <kbd>→</kbd> moves focus to the next item, and <kbd>←</kbd> moves focus to the previous item.
- [ ] **1D Vertical Orientation:** In vertical widgets (e.g. menus, vertical tablists), pressing <kbd>↓</kbd> moves focus to the next item, and <kbd>↑</kbd> moves focus to the previous item.
- [ ] **2D Grid Matrix Orientation:** In 2D grid widgets (e.g. action cards, photo galleries), all four arrow keys (<kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>←</kbd>, <kbd>→</kbd>) navigate spatially across rows and columns.
- [ ] **Home & End Keys:** Pressing <kbd>Home</kbd> jumps focus instantly to the first enabled item; pressing <kbd>End</kbd> jumps to the last enabled item.
- [ ] **Boundary Wrapping:** If `wrap: true`, pressing <kbd>→</kbd> on the final item wraps focus back to the first item, and vice versa.

## 3. Right-to-Left (RTL) Layout Compatibility

- [ ] **RTL Key Inversion:** When container or document layout direction is set to `dir="rtl"`, pressing <kbd>←</kbd> moves focus logically to the next item (visually to the left), and <kbd>→</kbd> moves focus to the previous item.
- [ ] **RTL Grid Spatial Consistency:** Grid horizontal movement aligns correctly with visual RTL column placement.

## 4. State Management & DOM Mutations

- [ ] **Pointer Sync:** Clicking or tapping any inactive item in the widget updates its attribute to `tabindex="0"` and sets all siblings to `tabindex="-1"`.
- [ ] **Disabled Element Skipping:** Arrow key traversal automatically skips items marked with `disabled` or `aria-disabled="true"`.
- [ ] **Dynamic Removal Fallback:** When the active item holding `tabindex="0"` is dynamically removed from the DOM, `tabindex="0"` is automatically assigned to an adjacent remaining item so the widget remains focusable.
- [ ] **Clean Lifecycle Teardown:** Unmounting or destroying the widget disconnects event listeners and `MutationObserver` instances without memory leaks.

## 5. Visual Focus & Accessibility Standards

- [ ] **Visible Focus Ring:** Focused items render a high-contrast focus ring complying with WCAG 2.2 SC 2.4.13 (Focus Appearance).
- [ ] **ARIA Roles & Attributes:** The container possesses appropriate ARIA roles (`role="toolbar"`, `role="tablist"`, `role="menu"`, or `role="grid"`), and children carry matching item roles (`role="tab"`, `role="menuitem"`, `role="gridcell"`).
