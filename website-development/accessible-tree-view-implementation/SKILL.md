---
name: accessible-tree-view-implementation
description:
  Implement and debug accessible, keyboard-navigable tree views (hierarchical
  structures) using semantic markup and WAI-ARIA authoring practices.
---

# Accessible Tree View Implementation

## Purpose

The Accessible Tree View Implementation skill provides a technical protocol for
building and debugging hierarchical, interactive navigation structures (trees)
that are fully accessible to screen reader and keyboard-only users. While
standard disclosures (accordions) or simple lists are easy to implement, a true
hierarchical parent-child tree requires specialized ARIA roles, state properties,
and comprehensive keyboard management (including directional arrow navigation,
level-specific expansion, and type-ahead searching) to avoid creating keyboard
traps or leaving assistive technology users in the dark.

## Use Cases

- **File and Folder Browsers:** Navigating nested folders, workspaces, or repos
  (e.g., in a cloud storage dashboard or online IDE).
- **Nested Category Trees:** Navigating multi-level product taxonomies or large
  e-commerce category structures.
- **Hierarchical Site Navigation:** Sidebars of complex document portals, wikis,
  and admin templates that cannot be flattened.
- **Organization Charts & System Topologies:** Visualizing and navigating complex
  parent-child graphs sequentially.

## When NOT to Use

- **Flat Navigation:** If items have only a single level of nesting, a simple flat
  nested list (`<ul>` containing a child `<ul>` or an accordion list) is much simpler
  and requires significantly less keyboard override.
- **Site-Wide Desktop Header Menus:** Desktop flyout navigation panels should follow
  the Disclosure or Menu/Menubar pattern (e.g., `accessible-main-navigation`)
  rather than a Tree View, as search engine crawlers and screen reader users expect
  link-oriented tab navigation in headers.
- **Multi-select Filtering:** If users are merely filtering a search result with
  nested checkboxes, a group of nested checkboxes using standard fieldsets is
  visually and programmatically more robust than a custom tree.

## Inputs

1. **Hierarchical Data Structure:** A nested list of nodes (e.g., files, directories,
   or folders) with unique identifiers, labels, types (parent/folder vs. leaf/file),
   and current expanded states.
2. **Interactive Action:** What occurs when an item is activated (e.g., loads a
   document, navigates to a URL, or toggles selection).
3. **Visual Requirements:** Design specifications for node status icons (expanded/collapsed),
   indentation levels, hover states, and focus rings.

## Outputs

1. **Semantic ARIA Structure:** Hierarchical HTML markup utilizing `role="tree"`,
   `role="treeitem"`, and nested `role="group"` containers.
2. **Keyboard Management Logic:** Scripts mapping directional arrows (`Up`, `Down`,
   `Left`, `Right`), `Enter`, `Space`, `Home`, `End`, and optionally `*` (asterisk)
   to focus shifting and state changes.
3. **ARIA State Management:** Proper real-time synchronization of `aria-expanded="true|false"`,
   `aria-selected="true|false"`, `aria-level`, `aria-setsize`, and `aria-posinset`.
4. **Visual & Layout Styling:** Robust CSS for hierarchical indent offsets (using CSS
   variables based on depth), focus-visible outlines, and smooth icon indicators.

## Workflow

### 1. Establish the WAI-ARIA Structural Hierarchy

- **Root container:** Mark the top-level container as `role="tree"`. Ensure it has
  an accessible label via `aria-label` or `aria-labelledby`.
- **Branches/Nodes:** Every tree item (whether it contains children or is a leaf)
  must have `role="treeitem"`.
- **Parent/Collapsible Nodes:** Any treeitem that contains other treeitems is a
  "parent" node. It must include:
  - `aria-expanded="false"` (initially closed) or `"true"` (initially open).
  - A nested container holding its children marked with `role="group"`.
- **Child lists:** Wrap the sub-nodes in a container with `role="group"` which is
  placed inside or immediately following the parent `role="treeitem"`.
  - *Recommendation:* Place the `group` as a direct child inside the parent
    `treeitem`, but make sure the interactive label element is the one visually
    representing that item, or structure the `treeitem` as the interactive container
    itself using a roving tabindex.

### 2. Implement Roving Tabindex for Focus Management

To prevent keyboard users from having to tab through every single node in a massive
tree:
- Set `tabindex="0"` on the *first* visible treeitem (or the currently selected/active treeitem).
- Set `tabindex="-1"` on all other treeitems in the tree.
- When navigating, dynamically update the active node's `tabindex` to `0`, focus it
  programmatically via `.focus()`, and set all other nodes' `tabindex` back to `-1`.

### 3. Handle Keyboard Event Listeners

Attach a single keydown listener on the `role="tree"` root container (using event delegation
to target individual `role="treeitem"` elements):

- **ArrowDown:** Moves focus to the next visible tree item.
  - Check if the current node is expanded and has children; if so, move to its first child.
  - If not, move to its next sibling.
  - If no next sibling, traverse up to the parent and move to the parent's next sibling.
- **ArrowUp:** Moves focus to the previous visible tree item.
  - Move to the previous sibling. If that sibling is expanded, move to its deepest visible last child.
  - If no previous sibling, move to the parent node.
- **ArrowRight:**
  - If the node is closed (`aria-expanded="false"`), open it (`aria-expanded="true"`).
  - If the node is already open, move focus to its first child node.
  - If the node is a leaf (non-parent), do nothing.
- **ArrowLeft:**
  - If the node is open (`aria-expanded="true"`), close it (`aria-expanded="false"`).
  - If the node is closed or is a leaf, move focus to its parent node.
- **Enter or Space:**
  - Activates the default action of the item (e.g., selecting it or opening a file).
  - If a folder/parent, toggles the expanded state.
- **Home:** Moves focus to the first treeitem in the tree.
- **End:** Moves focus to the last visible treeitem in the tree.
- **Asterisk (`*`):** Optional but high-impact. Expands the focused node and all sibling
  nodes at the same level.

### 4. Maintain ARIA Attributes in Real-Time

- When expanding a parent node, toggle `aria-expanded="true"` and remove `display: none`
  or `visibility: hidden` from the associated `role="group"`.
- For single-selection trees, when an item is activated/selected:
  - Remove `aria-selected="true"` from the previously selected node.
  - Apply `aria-selected="true"` to the newly selected node.
- For deep trees where the browser might struggle to compute hierarchical indices:
  - Provide `aria-level` (1-indexed depth of the node).
  - Provide `aria-setsize` (number of sibling nodes at the current level).
  - Provide `aria-posinset` (1-indexed position of the node within its sibling list).
  - *Note:* Most modern screen readers compute these automatically if clean nested `<ul>`
    and `<li>` elements are mapped to the tree roles, but explicitly supplying them is
    essential if you use flat virtual lists (like windowed trees).

### 5. Style for Focus and Hierarchy

- Never rely on default focus rings that can be clipped by `overflow: hidden` on parent
  containers. Apply a distinct, custom `outline` or `:focus-visible` ring.
- Indent nested nodes using padding or left-margin. Use a custom CSS variable (e.g.,
  `style="--tree-depth: 2;"`) to multiply indent offsets cleanly:
  ```css
  .tree-item {
    padding-left: calc(var(--tree-depth, 0) * 1.5rem);
  }
  ```
- Toggle visual disclosure triangles or folder icons synchronously with `aria-expanded`.
  Always hide decorative icons from screen readers using `aria-hidden="true"`.

## Decision Rules

### Custom ARIA Tree vs. Standard Disclosures (Accordions)
- Choose a **Custom ARIA Tree** when:
  - The hierarchy is deep (3+ levels) and represents a logical folder structure or nested taxonomy.
  - Keyboard users must be able to move vertically and horizontally without Tab-bloat (pressing tab dozens of times).
  - Directional Arrow navigation is highly intuitive for the dataset.
- Choose **Disclosures / Accordions** when:
  - The hierarchy is shallow (1-2 levels max).
  - Each panel contains rich interactive blocks (complex forms, paragraphs, buttons) rather than simple text links or single-item nodes.
  - The items are separate independent content blocks.

### Flat Node List vs. Nested DOM Structure
- Choose **Nested DOM Structure** (`<ul>` / `<li>` wrapper structure) when:
  - The dataset size is moderate (<1000 visible nodes). This is much easier to manage because the browser automatically computes `aria-setsize` and `aria-posinset` from nested lists, and toggling visibility of a `role="group"` hides all nested descendants automatically.
- Choose **Flat Node List** (virtualized/windowed trees) when:
  - The dataset has thousands of nodes. In this case, use a flat DOM layout and calculate `aria-level`, `aria-setsize`, and `aria-posinset` dynamically on every render to ensure screen readers understand the deep hierarchy despite the lack of physical DOM nesting.

## Constraints

- **Single Tab Stop:** The entire Tree View widget must represent a single tab stop. Pressing `Tab` must move the user completely out of the tree, not to the next node.
- **Assistive Text Support:** Interactive nodes must have visible labels. Decorative icons must not interfere with text parsing.
- **Visual Focus:** Every focused treeitem must have a strong visual indicator that satisfies WCAG 2.1 Contrast requirements (minimum 3:1 ratio).
- **Responsive Sizing:** Tree items must be touch-target compliant (at least 44x44px or 24x24px with surrounding padding) and support text wrapping gracefully without breaking alignment.

## Non-Goals

- Implementing drag-and-drop tree reordering (though tree roles support this, the complex pointer/touch interaction is beyond standard focus trees).
- Backend node loading, databases, or API sync.
- Complex multi-select checkbox trees (these are better handled as specialized form widgets).

## Common Failure Patterns

- **Tab Key Navigation:** Allowing the user to tab through every node in the tree. This is extremely slow and frustrating for keyboard-only users.
- **ActiveDescendant without IDs:** Using `aria-activedescendant` without assigning unique `id` attributes to every single node, breaking screen reader target tracing.
- **Silent State Changes:** Opening or closing folders without updating `aria-expanded`, leaving screen readers unaware that new options are now available or hidden.
- **Visually Hidden but Interactive Descendants:** Using `opacity: 0` or simple scale transitions to hide closed sub-trees instead of `display: none` or `visibility: hidden`. Screen readers and keyboards will still find and focus the hidden elements, causing highly erratic behavior.
- **No Folder Status Announcement:** Relying entirely on visual folder icons to show nested status. Visually impaired users won't know if a node is a folder/parent or a file/leaf unless `aria-expanded` or nested state is correctly declared.

## Validation Steps

- [ ] **Roving Tabindex Verification:** Pressing `Tab` should focus the last-focused tree item. Pressing `Tab` again should leave the entire Tree widget instantly.
- [ ] **Directional Arrow Navigation Test:**
  - Can you use `ArrowDown` and `ArrowUp` to navigate every visible item?
  - Does `ArrowRight` open closed folders and step into the first child when open?
  - Does `ArrowLeft` close open folders or jump up to the parent folder when closed?
- [ ] **Home / End Interaction:** Pressing `Home` goes straight to the root item; pressing `End` goes straight to the last visible item.
- [ ] **Visual Focus Consistency:** There is a robust, highly visible outline or background highlight on the currently focused treeitem.
- [ ] **Screen Reader Verification:** Running a screen reader (e.g., VoiceOver, NVDA) announces the item name, role ("treeitem"), expansion state ("expanded"/"collapsed"), and level ("level 1", "level 2").
- [ ] **Structure Check:** In inspect tools, every `role="group"` is nested under a `role="treeitem"`, and the top wrapper is `role="tree"`.
