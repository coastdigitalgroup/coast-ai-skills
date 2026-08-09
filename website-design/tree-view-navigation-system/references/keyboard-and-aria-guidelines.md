# Reference: Keyboard & ARIA Guidelines for Tree Navigation

This reference guide details the structural keyboard interactions and WAI-ARIA mapping rules required to transition a visual Tree View Navigation Design into a fully accessible interactive component in compliance with WCAG AA.

---

## 1. Keyboard Navigation Keymaps

To comply with **WCAG 2.1 Success Criterion 2.1.1 (Keyboard Navigation)**, the tree view widget must support comprehensive keyboard navigation using standard arrow and utility keys. Below is the precise interaction map:

| Keyboard Input | Context / Node State | Action / Expected Behavior |
| :--- | :--- | :--- |
| **Tab** | Focused outside tree | Moves focus onto the active/selected treeitem row in the tree (the single node that has `tabindex="0"`). |
| **Tab** | Focused inside tree | Immediately exits the tree widget and moves focus to the next interactive page element outside the tree. |
| **ArrowDown** | On any visible node | Moves keyboard focus to the next visible node immediately below, traversing down into expanded group directories. |
| **ArrowUp** | On any visible node | Moves keyboard focus to the previous visible node immediately above, traversing up out of group directories. |
| **ArrowRight** | On collapsed parent node | Expands the parent directory, rotating the visual chevron down and updating `aria-expanded` to `"true"`. |
| **ArrowRight** | On expanded parent node | Shifts keyboard focus down to the first nested child node inside the expanded directory group. |
| **ArrowRight** | On leaf (terminal) node | Does nothing. |
| **ArrowLeft** | On expanded parent node | Collapses the parent directory, rotating the visual chevron right and updating `aria-expanded` to `"false"`. |
| **ArrowLeft** | On collapsed parent node / leaf | Shifts keyboard focus up to the parent directory node containing this item. |
| **Enter or Space** | On parent node | Toggles the expansion state of the parent node. |
| **Enter or Space** | On leaf node | Activates the link (triggers page navigation or asynchronous main content panel load). |
| **Home** | On any node | Instantly shifts keyboard focus to the very first node at the root of the tree. |
| **End** | On any node | Instantly shifts keyboard focus to the last visible node at the bottom of the tree. |
| **Asterisk (`*`)** | On any parent node | Expands the focused parent node and all of its sibling directories at the exact same depth. |

---

## 2. Focus Management Pattern (Roving Tabindex)

To prevent a "keyboard tab trap" where a keyboard user must tab through dozens of navigation links in the sidebar before reaching the main content:

1. **Single Tab Stop:** The entire tree view must present only **one tab stop** to the browser page.
2. **Initial Entry:** When the user tabs into the tree, focus must land on the active/selected node, or the first root node if nothing is selected.
3. **Roving Tabindex:**
   - The focused node has `tabindex="0"`.
   - All other visible and hidden nodes have `tabindex="-1"`.
   - As the user presses arrow keys, the browser's focus is moved programmatically using the JavaScript `.focus()` method.
   - Synchronously, the previous node's tabindex is set to `-1` and the newly focused node's tabindex is set to `0`.

---

## 3. ARIA State & Attribute Mapping Spec

To ensure compatibility with screen readers (NVDA, VoiceOver, JAWS), the markup must maintain real-time synchronization of state attributes:

- **`role="tree"`**: Placed on the outermost container element.
- **`role="treeitem"`**: Placed on the interactive row elements (or target list item nodes).
- **`role="group"`**: Placed on the list elements (`<ul>`) wrapping child sub-directories nested under a parent directory.
- **`aria-expanded="true/false"`**:
  - Must be updated in real-time when a directory is toggled open or closed.
  - Must **never** be placed on leaf (terminal) nodes.
- **`aria-selected="true"`**: Placed on the currently active page/item in the tree view (or `aria-current="page"`).
- **`aria-level="[integer]"`**: Represents the nesting level (1-indexed depth). This helps screen readers announce depth information (e.g., "Level 2") to visually impaired users.
- **`aria-setsize="[integer]"`**: Indicates the total number of items in the current child group at the current nesting level.
- **`aria-posinset="[integer]"`**: Indicates the 1-indexed position of this item within its current sibling list group.
- **`aria-hidden="true"`**: Applied to decorative chevrons, icons, and guidelines to avoid screen reader clutter.

---

## 4. Visual Focus Outline Guidelines

To meet **WCAG 2.2 Success Criterion 2.4.11 (Focus Not Obscured)** and **Success Criterion 1.4.11 (Non-Text Contrast)**:

1. **Minimum Contrast:** The focus ring/border outline must feature a contrast ratio of at least **`3:1`** against the surrounding row and background color.
2. **No Clipping:** Ensure parent containers with `overflow: hidden` do not clip the visual focus ring. Use `box-shadow: ... inset` or explicit focus borders with inset margins to guarantee the indicator is 100% visible.
3. **Synchronized Active and Focus States:** The focus ring and active selected highlight must not cancel each other out. If a node is both selected and focused, both indicators (the left-border bar and the focus ring) must remain visible.
