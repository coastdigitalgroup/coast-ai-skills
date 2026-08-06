---
name: tree-view-navigation-system
description: Design and implement a systematic framework for hierarchical tree navigations, managing nesting indentation, state indicators, and complex keyboard access rules.
---

# Tree View Navigation System

## Purpose

The Tree View Navigation System provides a systematic design methodology for organizing, styling, and presenting hierarchical content of arbitrary depth. Standard flat navigation elements (site menus, breadcrumbs) or single-level accordion elements fail when representing complex deep hierarchies. This system establishes a structured layout rhythm, indentation calculations, visual affordances, and keyboard-navigation guidelines for hierarchical structures such as file explorers, documentation sidebars, categorized filters, and organizational trees. It ensures that deep structures remain highly scannable, visually elegant, and completely accessible across all viewports and input devices.

## Use Cases

- **Documentation & Learning Hubs:** Organising modules, chapters, and sub-chapters into a multi-level index (e.g., Stripe, GitBook, or Tailwind docs).
- **Workspace & File Browsers:** Managing digital assets, templates, code repositories, or documents within nested folders and files.
- **Categorized Taxonomy Selectors:** Browsing hierarchical product classifications in e-commerce (e.g., Apparel -> Men's -> Outerwear -> Jackets).
- **SaaS Account/Organization Trees:** Visualizing and navigating complex multi-departmental structures, permission groups, or deep settings layers.
- **Administrative Navigation Panels:** Grouping high-density dashboard modules into nested, collapsible categories.

## When NOT to Use

- **Flat/Single-Tier Menus:** If navigation contains 10 or fewer items without nesting, use `site-navigation-system` or `sidebar-navigation-system` instead.
- **Strict Linear/Sequential Steps:** For checkout flows or multi-step setups where progression is chronological, use `step-progress-system`.
- **Primary Page Header Navigation:** Do not cram multi-level tree views into global desktop top headers; they are designed for vertical columns (sidebars or drawers).
- **Sparsely Populated Cards:** If content is primarily exploratory or media-rich (e.g., portfolio grids), use `card-ui-system` or `bento-grid-layout-system`.

## Inputs

1. **Hierarchical Taxonomy Model:** A map of parent-child nodes representing the full depth of the content hierarchy.
2. **Node Anatomy Requirements:** The content types required per node (e.g., title, folder/file icons, badge counts, interactive controls like checkboxes, primary actions).
3. **Container Context:** The horizontal space allocated to the tree container (e.g., static 280px sidebar, flexible panel, or full-width overlay drawer).
4. **Interaction Mode:** Deciding if nodes act as page-load links, inline action triggers, or purely folder-toggle states.

## Outputs

1. **Node Anatomy Specification:** Precise design tokens for indentation scale, chevrons, folder/leaf status icons, badges, labels, and secondary actions.
2. **Nesting & Indentation Scale Map:** Calculations defining the indentation increment per level of depth and its visual rhythm.
3. **State Transition Matrix:** Guidelines for hover, focus, active, selected, expanding, and collapsing states.
4. **Keyboard Navigation & ARIA Mapping:** A complete focus-management checklist matching WCAG AA and WAI-ARIA tree standards.

---

## Workflow

### 1. Map Hierarchical Depth and Node Anatomy

Every node in the tree falls into one of two structural categories:
- **Branch Node (Folder/Parent):** Contains a chevron/toggle indicator, an icon (usually a folder or category icon), a text label, optional helper metadata (like item counts), and a hidden child container.
- **Leaf Node (Item/Child):** Contains a spacing placeholder (matching the chevron width), a document/file/action icon, and a text label.

Design a consistent anatomical layout for nodes in a flex row:

```text
+--------------------------------------------------------------------------+
| [Chevron]  [Node Icon]  [Label Text]             [Badge]  [Action Icon]  |
+--------------------------------------------------------------------------+
  ^          ^            ^                        ^        ^
  |          |            |                        |        |
  Toggle     Semantic     Title/Link               Counts   Secondary
  Trigger    Indicator    (Main Trigger)                    Action
```

### 2. Establish Spatial Indentation Rhythm

To prevent visual nesting confusion, use a precise, mathematical indent-scale. Avoid hardcoding margins or paddings per nested level. Instead, define an indentation token and multiply it using CSS variables and `calc()` based on depth.

- **Base Node Padding:** Set horizontal block padding for touch target height (`--tree-item-padding-y: 8px`, `--tree-item-padding-x: 12px`).
- **Indentation Width (`--tree-indent`):** Set the horizontal offset per level. The standard optimal indent is **16px** (1rem).
- **Depth Variable (`--tree-depth`):** Apply a CSS custom property inline on child containers (e.g., style="--tree-depth: 1").
- **Indentation Calculation:**
  ```css
  .tree-item {
    /* The indentation padding is calculated dynamically by depth */
    padding-left: calc(var(--tree-depth, 0) * var(--tree-indent, 16px) + var(--tree-item-padding-x, 12px));
  }
  ```

### 3. Design Clear Visual Affordances

Users must immediately distinguish between folders (expandable) and leaves (clickable actions or links):

- **The Chevron Indicator:** Placed on the far-left of all branch items.
  - **Closed State:** Chevron points right (or down-right in some RTL contexts).
  - **Opened State:** Chevron rotates 90 degrees clockwise (points down).
  - **Leaf Node Space:** For leaf nodes, keep a blank spacing block exactly equal to the chevron's width (typically 16px to 20px) to ensure file icons and labels align perfectly with sister branches.
- **Node Icons:** Use semantic folder icons for branch nodes and document/leaf icons for leaves.
- **Lines of Rhythm (Optional):** In dense developer-focused tree views, render a subtle vertical tracking line (border-left: 1px solid var(--border-color)) aligned with each level's indentation to visually anchor deep child lists back to their parent nodes.

### 4. Create the Active, Selected, and Focus State System

A tree view contains a single active track and a roving cursor. Clearly separate these states:

- **Hover State:** A subtle background tint (e.g., 5% primary color or gray) spanning the entire width of the tree item.
- **Focus State:** When navigating via keyboard, the focused node must show a prominent focus ring (e.g., 2px solid var(--primary-color) with offset). The focus ring must wrap the individual item line, never the entire tree container or nested elements.
- **Selected State (Current Page/Item):** The active node in a documentation tree or file viewer. Highlight this with a stronger background tint (e.g., 10% primary tint) and a left border accent (e.g., 3px solid var(--primary-color)). Mark the active item with `aria-current="page"` (if a link) or `aria-selected="true"`.
- **Active Path Highlight:** If the selected item is deeply nested, highlight its ancestor parent nodes with a subtle weight or primary-tinted icon, helping the user understand their coordinates in the system.

### 5. Define Responsiveness and Text Overflows

Tree views are highly susceptible to breaking in narrow sidebars or mobile viewports:

- **Text Truncation:** Never allow long node names to wrap into multiple rows if it ruins scannability. Apply `text-overflow: ellipsis`, `overflow: hidden`, and `white-space: nowrap` to node label containers.
- **Mobile Drawer Transition:** On mobile screens, collapse the tree sidebar into a slide-out overlay drawer triggered by a persistent floating panel action button.
- **Horizontal Overflow Control:** Do not enable general horizontal scrolling on the entire sidebar; instead, provide a toggle button to "collapse all directories" or slightly shrink the indentation width (`--tree-indent: 12px`) for smaller screens.

---

## Decision Rules

### The "Branch-Action" Rule
- **Navigation Mode (Docs):** Clicking any part of the branch line (label or chevron) toggles the folder. If the branch itself is a webpage, clicking the chevron toggles expansion, while clicking the label navigates to the page.
- **Workspace Mode (Files):** Clicking the label highlights the folder, and clicking the chevron toggles open/close. For touch targets on mobile, the expand/collapse chevron area must be at least **32px x 32px** to prevent misclicks.

### The "Indentation Limit" Rule
- Do not design structures exceeding **5 levels of depth**.
- If content naturally requires deeper hierarchies:
  - Consolidate levels using flat group categorizations.
  - Reset the tree's root by loading a sub-tree context with a "Back to parent" breadcrumb at the top of the sidebar.

### The "Folder Persistence" Rule
- When a user refreshes or navigates:
  - The tree must read the URL and automatically expand all parent folders leading to the currently active page.
  - All other sibling folders must remain collapsed to keep the sidebar's scroll position stable and reduce visual clutter.

---

## Constraints

### Accessibility (WCAG AA & WAI-ARIA)

To satisfy accessibility criteria, the tree view MUST comply with the following structural rules:

- **Roles & Hierarchy:**
  - The master container must carry `role="tree"`.
  - Every individual item (link, toggle, or action line) must carry `role="treeitem"`.
  - Parent nodes must carry `aria-expanded="true"` (when open) or `aria-expanded="false"` (when collapsed).
  - The list container wrapping child nodes must carry `role="group"` and have an `aria-labelledby` or `aria-label` pointing to its parent `role="treeitem"`.
- **Keyboard Navigation (Roving tabindex or aria-activedescendant):**
  - **Up Arrow:** Moves focus to the previous visible tree item.
  - **Down Arrow:** Moves focus to the next visible tree item.
  - **Right Arrow:**
    - On a collapsed branch: Expands the branch.
    - On an expanded branch: Moves focus to its first child item.
    - On a leaf node: Does nothing.
  - **Left Arrow:**
    - On an expanded branch: Collapses the branch.
    - On a child node/leaf: Moves focus to its parent branch item.
  - **Enter/Space:** Triggers the link navigation or activates the item selection.
  - **Home:** Moves focus to the first node in the tree.
  - **End:** Moves focus to the last visible node in the tree.
  - **Character Keys (Optional):** Typing letters moves focus to the next node starting with that letter.
  - **Asterisk (*):** Expands the current parent node and all sibling nodes at the same level.
- **Focus Visibility:** Focused elements must display a high-contrast focus ring with a minimum contrast ratio of 3:1 against the surrounding background.

### Responsiveness and Scale
- Ensure chevrons and icons are styled with flex-shrink: 0, preventing them from shrinking to unreadable sizes when node labels are long.
- Keep touch targets accessible: all buttons, links, and triggers must occupy a minimum area of **24px x 24px** (WCAG 2.2 SC 2.5.8), with **44px x 44px** target sizing preferred for high-frequency mobile sidebar interactions.

---

## Common Failure Patterns

- **The Indentation Death-Spiral:** Hardcoding deep paddings so that by level 5, the node's label squashes into a single vertical column of characters on mobile screens.
- **The Screen Reader Abyss:** Failing to use `aria-expanded` and correct ARIA roles. Assistive technologies see a plain static list and do not announce whether clicking a folder actually opened content.
- **Mouse-Only Collapsible Chevrons:** Setting the toggle trigger strictly on a microscopic 10px chevron icon that is impossible to hit on touchscreens or with a trackpad.
- **Disappearing Scroll Coordinates:** Deeply nested active items that load off-screen within a tall sidebar because the sidebar failed to execute `scrollIntoView()` on page load.
- **Inconsistent Alignment:** Aligning leaf icons further left than chevrons of parent branches, making the nesting levels look uneven and hard to scan.

---

## Validation Criteria

- [ ] **Dynamic Indentation:** Spacing is controlled using CSS custom properties (e.g., `--tree-depth` and `--tree-indent`), ensuring clean mathematical alignment at all depths.
- [ ] **Affordance Distinction:** Branch nodes (folders) feature distinct toggles (chevrons) and folder icons; leaf nodes (documents/actions) omit chevrons and align their icons perfectly.
- [ ] **State Clarity:** Hover, active, keyboard focus (`:focus-visible`), and selected/current states are visually distinct and styled without layout shifts.
- [ ] **ARIA Compliance:** Major containers use `role="tree"`, items use `role="treeitem"`, and collapsible container lists use `role="group"` with `aria-expanded` reflecting the toggle state.
- [ ] **Keyboard Pathing:** Keyboard-only users can traverse up, down, left (to collapse/jump up), and right (to expand/jump down) through the entire tree structure.
- [ ] **Flexible Overflows:** Long labels use text ellipsis and flex-shrink protection on icons, ensuring the sidebar never triggers general horizontal layout breaks.
- [ ] **Responsive Fallback:** On mobile viewports, the tree transitions to a toggleable, full-depth overlay drawer or simplifies to prevent layout distortion.
