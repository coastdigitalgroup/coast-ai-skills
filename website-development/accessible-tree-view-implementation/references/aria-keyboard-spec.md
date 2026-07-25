# WAI-ARIA 1.2 Tree View Specification Reference

The ARIA Tree View widget represents a hierarchical list of items where folder items (parent nodes) can be expanded or collapsed to show/hide child items (child nodes). This pattern is commonly used for file systems, category trees, and sidebar navigation guides.

---

## 1. Core Semantic Structure

The Tree View is built on three essential ARIA roles, which must align with strict parent-child nesting rules in the DOM tree.

| Role | Target Element | Description | Requirements |
| :--- | :--- | :--- | :--- |
| **`role="tree"`** | Root `<ul>` or container | Identifies the component as an interactive tree view. | Must have a label (using `aria-label` or `aria-labelledby`). Represents exactly **one** tab stop on the page. |
| **`role="treeitem"`** | `<li>` or node element | Represents an individual interactive item in the hierarchy. | Must be nested within a `role="tree"` or a nested `role="group"`. |
| **`role="group"`** | Sibling `<ul>` or child wrapper | Holds nested child nodes belonging to a parent branch. | Must be nested directly within (or immediately follow) the parent `role="treeitem"`. |

---

## 2. Dynamic Accessibility Attributes

| Attribute | State/Type | Applies To | Value | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`aria-expanded`** | Boolean | Parent `treeitem` | `"true"` or `"false"` | Announces to screen readers whether the folder node's child `group` is currently visible or hidden. |
| **`aria-selected`** | Boolean | Any `treeitem` | `"true"` or `"false"` | Tracks active focus selection of nodes. On single-selection trees, exactly one node should be `"true"` at a time. |
| **`aria-level`** | Integer | Any `treeitem` | `1`, `2`, `3`, etc. | Defines the hierarchical depth of the node (1-indexed). Highly recommended for flat layouts. |
| **`aria-setsize`** | Integer | Any `treeitem` | Number of siblings | Declares the total number of items in the current hierarchical group (level). |
| **`aria-posinset`** | Integer | Any `treeitem` | `1`, `2`, `3`, etc. | Declares the item's 1-indexed position in the current group level. |

---

## 3. Keyboard Navigation Requirements

Because the entire tree represents a **single tab stop**, keyboard users rely heavily on standard arrow navigation to move between nodes without getting bogged down in individual page tab index items.

| Key | Context | Standard Action |
| :--- | :--- | :--- |
| **`ArrowDown`** | Any focused node | Moves focus to the next visible tree item (including child nodes, parent siblings, or ancestral sibling nodes). |
| **`ArrowUp`** | Any focused node | Moves focus to the previous visible tree item. |
| **`ArrowRight`** | Collapsed branch | Opens the branch and sets `aria-expanded="true"`. |
| | Expanded branch | Moves focus to the first child node inside that branch's group. |
| | Leaf/File node | No action. |
| **`ArrowLeft`** | Expanded branch | Collapses the branch and sets `aria-expanded="false"`. |
| | Collapsed branch | Moves focus to the parent branch node. |
| | Leaf/File node | Moves focus to the parent branch node. |
| **`Enter` / `Space`** | Any focused node | Activates/Selects the item. If it is a folder, toggles the expanded state. |
| **`Home`** | Any focused node | Jumps focus directly to the very first node of the tree (root level). |
| **`End`** | Any focused node | Jumps focus directly to the last visible child/leaf node of the tree. |
| **`*` (Asterisk)** | Parent node | Expands the focused node and all of its sibling folders at the same hierarchical depth. |
| **Type-ahead** | Any focused node | Typing one or more characters moves focus to the next visible node whose label starts with those characters. |

---

## 4. Focus Management Models

There are two primary models for managing focus within custom ARIA trees:

### Option A: Roving Tabindex (Highly Recommended)
In this model, only one `role="treeitem"` is focusable (`tabindex="0"`) at any given time.
1. The currently active/focused item has `tabindex="0"`.
2. All other items have `tabindex="-1"`.
3. When the user navigates using the arrow keys, JavaScript changes the old item's `tabindex` to `-1`, changes the new item's `tabindex` to `0`, and calls `.focus()` on the new item.
* **Why use it:** Extremely simple to implement, handles focus outlines natively, and operates reliably across all modern browser engines and screen reader combinations.

### Option B: Active Descendant
In this model, physical focus remains strictly on the parent `role="tree"` container (`tabindex="0"`).
1. The container has the attribute `aria-activedescendant="node-id"`.
2. As the user navigates, JavaScript updates `aria-activedescendant` to reference the `id` of the newly highlighted node.
3. CSS styles use selector rules like `.tree-container[aria-activedescendant="node-id"] #node-id` to paint artificial focus rings.
* **Why use it:** Avoids having to update multiple `tabindex` attributes in large-scale virtualized trees. However, it requires perfect `id` tracking and custom styling tricks for focus-ring emulation.

---

## 5. Screen Reader Compatibility Gotchas

* **Virtual vs. Application Mode (NVDA & JAWS):**
  Windows-based screen readers (like NVDA or JAWS) use specialized keystroke modes (Virtual PC cursor / Browse mode) to read static content. When entering a `role="tree"`, they must automatically switch to **Forms/Application mode** so that arrow keys are intercepted by the tree's JS rather than reading page lines. Ensure your containers are marked with correct roles; otherwise, users will get stuck and arrowing will skip nodes.
* **VoiceOver on macOS:**
  VoiceOver uses native system controls for navigating trees (e.g., `VO + Shift + DownArrow` to enter and interact). When building custom JS trees, VoiceOver handles roving tabindex perfectly, but will verbally announce both the nesting level and relative node count (e.g., "Level 2, 1 of 4"). Let the screen reader compute this natively by using proper nested structure; do not override `aria-level` manually unless you are dealing with flat DOM configurations.
