# Accessibility Reference: Keyboard Navigation and ARIA Specifications

Implementing a tree view is one of the most complex challenges in web accessibility. Screen readers and keyboard-only users rely on strict semantic hierarchies and active state notifications to build a mental map of collapsible content directories. This reference details the standard **WAI-ARIA specifications** and **Keyboard Interaction Rules** required to satisfy WCAG AA compliance.

---

## 1. Complete ARIA Landmark and Role Matrix

To programmatic define tree structures, use the following roles, properties, and states:

| Context Element | HTML Tag | ARIA Role / Attribute | Purpose |
| :--- | :--- | :--- | :--- |
| **Tree Container** | `<ul>` | `role="tree"` | Tells the browser and screen reader that this is a hierarchical tree navigation grid rather than a flat static list. |
| **Sub-Group List** | `<ul>` | `role="group"` | Identifies the container wrapping child nodes under a specific parent folder node. |
| **Direct Parent Node** | `<li>` | `role="none"` | Removes the default screen reader list item announcement, allowing the inner container's `treeitem` role to be parsed correctly. |
| **Interactive Row** | `<div>` or `<a>` | `role="treeitem"` | Defines the focusable interactive element. This receives keyboard focus, hover states, and click triggers. |
| **Branch State** | Node element | `aria-expanded="true"` / `"false"` | Tells assistive technology whether the folder node is currently open or closed. **Omit this attribute completely on leaf nodes.** |
| **Active Node** | Selected link | `aria-current="page"` | Identifies the leaf node that matches the current browser page. |
| **Roving Focus** | Node element | `tabindex="0"` / `"-1"` | Dictates keyboard tab focus. Only the single active/focused element is `tabindex="0"`; all sibling nodes are `tabindex="-1"`. |

---

## 2. Keyboard Navigation Action Mapping

When a user focus lands inside a tree container (`role="tree"`), they should navigate using Arrow keys. Standard Tab key navigation should escape the entire tree container rather than looping through every single nested list item.

```text
               [Tab] into Tree (lands on tabindex="0")
                           |
                           v
        +------------------+------------------+
        |                                     |
  Vertical Keys                         Horizontal Keys
  - [Up Arrow]: Prev Node               - [Right Arrow]: Expand Branch / Focus First Child
  - [Down Arrow]: Next Node             - [Left Arrow]: Collapse Branch / Focus Parent Node
  - [Home]: First Node
  - [End]: Last Visible Node
                           |
                           v
              [Escape] or [Tab] out of Tree
```

### Reference Keypress Table

| Key | Context State | Action Execution |
| :--- | :--- | :--- |
| **Up Arrow** | Any focused node | Moves focus to the previous visible tree node. Sibling or cousin group expansion states are respected (does not enter closed parent groups). |
| **Down Arrow** | Any focused node | Moves focus to the next visible tree node. |
| **Right Arrow** | Collapsed parent node (`aria-expanded="false"`) | Expands the parent node. Its sub-group opens, and `aria-expanded` shifts to `"true"`. |
| **Right Arrow** | Expanded parent node (`aria-expanded="true"`) | Moves focus to the first child node inside the newly expanded subgroup. |
| **Right Arrow** | Leaf node | Does nothing. |
| **Left Arrow** | Expanded parent node (`aria-expanded="true"`) | Collapses the parent node. Its sub-group closes, and `aria-expanded` shifts to `"false"`. |
| **Left Arrow** | Child node or Leaf node | Moves focus to its parent branch item. This provides an incredibly fast "go back up" wayfinding experience. |
| **Enter / Space** | Any focused node | Triggers the node's primary action (links navigate to the page; checkbox states toggle; action buttons execute). |
| **Home** | Any focused node | Instantly jumps focus to the first root-level node in the tree. |
| **End** | Any focused node | Instantly jumps focus to the last visible node in the tree. |
| **Asterisk (*)** | Focused parent node | Expands the current parent node and all sibling nodes at the same visual level. |

---

## 3. Screen Reader Speech Adaptations

When navigating an accessible tree view, screen readers provide detailed verbal context to the user:

- **Folder Toggle Announcement:**
  - *Current State:* "Core Concepts, collapsed, folder, 1 of 4"
  - *Action (User presses Enter or Right Arrow):* "Expanded. Core Concepts group, 3 items."
- **Nesting Level Information:**
  - As a user moves deeper, screen readers announce the exact nesting level (derived from the DOM tree structure or the `aria-level` attribute):
  - *Example Speech:* "SidebarTree.js, level 3, document, 1 of 2."
- **Dynamic Updates via Live Regions:**
  - If the tree's content is updated dynamically (e.g., folder sorting, lazy-loading files from an API), announce the status politely using an invisible aria-live element:
  - `<div class="sr-only" aria-live="polite">Loading directory folders...</div>`
  - `<div class="sr-only" aria-live="polite">Directory loaded. 12 files found.</div>`
