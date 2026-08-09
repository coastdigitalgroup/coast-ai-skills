---
name: tree-view-navigation-system
description:
  Design structured, highly legible, and accessible hierarchical tree navigation systems
  for deep information architectures, establishing standards for spatial composition,
  visual cues, and complete keyboard/ARIA specification.
---

# Tree View Navigation System

## Purpose

The Tree View Navigation System skill provides a systematic design and spatial framework for representing deep, multi-level hierarchical information architectures (such as documentation directories, file managers, nesting taxonomies, and administrative portals).

It solves the core design problem of **spatial and visual fragmentation** that occurs when users are forced to navigate deep hierarchies. Left unmanaged, deep lists suffer from "indentation drift" (where deeply nested items run out of horizontal space) and "cognitive blinding" (where users cannot visually distinguish parent branches from leaf nodes, or lose track of their current location within the tree).

This system enforces strict spatial nesting scales, explicit visual states (default, hover, active, focus, expanded, collapsed), predictable icon and chevron alignment rules, and comprehensive keyboard-to-design specification mapping. This ensures that even the most complex hierarchical layout remains clean, scannable, and fully compliant with WCAG AA accessibility standards before a single line of production code is written.

---

## Use Cases

- **Technical Documentation & Wiki Portals:** Structuring multi-level article lists (e.g., Guide -> Category -> Chapter -> Article) into a persistent left-hand sidebar.
- **Cloud Storage & File Management Interfaces:** Laying out nested folders, workspaces, projects, and leaf-level files within a desktop dashboard.
- **Multi-layered Product Catalogs & Taxonomies:** Designing high-density category pickers for extensive e-commerce admin systems or inventory management panels.
- **System Topologies & Organization Charts:** Presenting deep organizational hierarchies, nested networks, or dependency chains in a structured, navigable sidebar list.

---

## When NOT to Use

- **Flat or Shallow Hierarchies (1–2 Levels):** If the sitemap contains only one or two levels of depth, a custom tree view is unnecessary. Use `accordion-ui-system` or standard flat vertical lists with section headers instead.
- **Global Header Navigation:** Global website menus (desktop headers) must avoid tree view structures. They should follow standard disclosure panels or mega-menus (see `site-navigation-system`) to match search engine crawlability and standard desktop expectations.
- **Multi-select Search Filters:** If the goal is simply to filter search results via nested categories with checkboxes, use nested standard fieldsets with checkboxes, rather than custom navigational tree items.
- **Flow-based or Process-driven Layouts:** If content is structured as a sequential series of linear steps, use `step-progress-system` or `timeline-activity-system`.

---

## Inputs

1. **Information Architecture (IA) Sitemap:** A comprehensive sitemap showing all nodes, the maximum depth of nesting, and expected item counts per level.
2. **Node Classification Metadata:** Classification of each item as a **Branch** (a node that can contain child nodes) or a **Leaf** (a terminal node representing a page, file, or asset).
3. **Primary Trigger Actions:** What happens when each item is clicked/activated (e.g., direct navigation to a new URL, asynchronous content injection, or in-place toggle).
4. **Design System Spacing & Typography Tokens:** Core design tokens including typography sizes, fluid margins/paddings, corner radii, borders, and brand color swatches (with specified contrast levels).

---

## Outputs

1. **Visual Indentation Scale & Spacing Spec:** Exact spatial rules defining padding multipliers (`--tree-depth` and `--indent-width`) to handle deep hierarchies without layout degradation.
2. **State & Anatomy Blueprint:** Clear visual definitions of the default, hover, focus, selected, and active states for both Branch (expanded/collapsed) and Leaf nodes.
3. **Visual Cue and Iconography Guidelines:** Standardized icon and chevron placement rules to establish immediate recognition and safe click zones.
4. **Responsive Migration Blueprint:** Specific rules for adapting wide sidebar trees into mobile drawers or collapsible bottom sheets without losing spatial context.
5. **A11y & Keyboard Annotation Sheet:** Design annotations detailing logical focus sequences, ARIA mapping requirements, and keyboard shortcuts for developer implementation.

---

## Workflow

### 1. Structure the Node Anatomy and Tier Classification
Before designing visual elements, classify nodes into strict functional types to prevent design drift:
- **The Core Wrapper:** The parent boundary containing the tree. It must be isolated and visually separated from other sidebar blocks or main body content.
- **Branch Node (Parent):** A structural hub that can be toggled to show or hide child nodes. Its visual design must communicate that it is interactive and expandable.
- **Leaf Node (Child):** A terminal node representing a final destination. Its design should imply finality and prompt a direct action.
- **Visual Container Groups:** Sub-lists of nodes nested under a branch. These must be encapsulated within a distinct visual group that can be shown/hidden as a single entity.

```text
[Tree Container (role="tree")]
  ├── [Branch Node (role="treeitem", aria-expanded="true")]
  │     ├── Chevron Indicator (Visual expand/collapse trigger)
  │     ├── Category Icon (Optional, e.g., Folder icon)
  │     └── Label Text (e.g., "Getting Started")
  └── [Group Container (role="group")]
        ├── [Leaf Node (role="treeitem")]
        │     ├── Indent Offset Gap
        │     ├── Item Icon (Optional, e.g., Document icon)
        │     └── Label Text (e.g., "Introduction")
        └── [Leaf Node (role="treeitem", aria-selected="true")]
              ├── Indent Offset Gap
              ├── Item Icon (Optional, e.g., Document icon)
              └── Label Text (e.g., "Quickstart Guide")
```

### 2. Define the Spatial Nesting Scale (Preventing Indent Collapse)
To prevent deeply nested nodes from collapsing horizontally, apply a strict proportional indentation system:
- **Baseline Indent Unit (`--indent-width`):** Standardize on an indent of **`12px` to `16px`** per level. This provides enough visual offset to signify hierarchy without swallowing horizontal space too quickly.
- **The Indentation Multiplier:** Calculate the left padding of each item using a CSS variable based on its depth in the tree:
  ```css
  .tree-item {
    padding-left: calc(var(--indent-width, 16px) * var(--tree-depth, 0));
  }
  ```
- **Depth Limiting Rule:** Cap the design hierarchy at **4 levels** of nesting. If content requires more than 4 levels, split the sitemap into separate sub-sections or utilize high-level category tabs to reset the tree depth.
- **Safe Vertical Spacing:** Standardize on item line-height and padding that ensures a comfortable vertical tap/click target. The vertical padding should provide at least an **`8px` to `12px`** padding top and bottom (ensuring a minimum row height of `32px` to `40px` for dense layouts).

### 3. Establish the Visual Cue System (Iconography and Chevrons)
Visual cues are essential to tell users where they are and what nodes can do:
- **Directional Chevrons:** Every Branch node must feature a clear disclosure triangle or chevron. Use consistent orientation:
  - **Collapsed (Closed):** Chevron pointing right (`▶` or `chevron_right`).
  - **Expanded (Open):** Chevron pointing down (`▼` or `expand_more`).
  - **Positioning:** Place the chevron on the **extreme left** of the node label, before any category icon, to establish a consistent vertical scanning line.
- **Node-Type Icons (Supporting Cues):**
  - Use distinct icons to differentiate branches from leaves (e.g., folder icons for branches, file/document icons for leaves).
  - All icons must be highly standardized—never mix custom illustration styles.
  - If icons are not functional, hide them from assistive technology with `aria-hidden="true"`.
- **Connecting Guidelines (Optional High-Density Cue):** For high-density structural files (e.g., file explorers), design thin, subtle dotted vertical lines (1px width, 10% opacity border) connecting parent nodes to child elements. This visually anchors nested lists to their branches.

### 4. Design States and Focus Indicators (Contrast & Interaction)
A tree view is highly interactive; each state must be visually distinct and pass strict contrast tests:
- **Default State:** Clean, readable typography. Text-to-background contrast must meet WCAG AA (at least **4.5:1**).
- **Hover State:** Apply a subtle background fill highlight (e.g., a neutral tint, `5%` opacity overlay) across the full horizontal bar. Ensure the hover highlight is strictly confined so it does not spill into adjacent nodes.
- **Focus State (`:focus-visible`):**
  - **Mandatory Custom Outline:** Never rely on native browser outlines which are often clipped. Style a distinct, high-contrast focus indicator (e.g., a `2px` solid primary-colored border) offset by `2px` inside or outside the treeitem bar.
  - The focus ring must meet at least a **3:1 contrast ratio** against both the node background and the active highlight background.
- **Active / Selected State (Current View):**
  - Highlight the currently active node (the page the user is currently on) with a stronger visual cue: a solid background tint or a left-aligned vertical border accent (e.g., `3px` solid brand-color).
  - Ensure the active text color maintains its `4.5:1` contrast ratio against this active background highlight.
  - Set `aria-current="page"` on the active leaf link, and `aria-selected="true"` on the focusable node.

### 5. Formulate Responsive Adaptation Rules
Deep sidebars do not fit on narrow viewports; design a graceful mobile adaptation flow:
- **The Sidebar-to-Drawer Transition (Below 1024px):**
  - Hide the persistent desktop left-hand sidebar.
  - Replace it with a global header hamburger button that, when activated, triggers a full-width or **90% width sliding bottom sheet/side drawer** (see `overlay-and-dialog-system`).
- **Touch-Target Optimization:**
  - On viewports below `768px`, automatically scale the interactive areas of all treeitems.
  - **The 44px Minimum:** Increase the height of each item row to a minimum of **`44px`** to accommodate natural touch targets (WCAG 2.2 SC 2.5.8), and expand the padding around chevrons to prevent accidental link clicks when expanding folders.
- **Auto-Scroll to Active Node:** When the mobile drawer is opened, programmatically scroll the active node into the middle of the viewport if the tree is long, ensuring immediate orientation.

### 6. Annotate for Developer Handoff
Design files must include precise annotations so developers know how to build the accessible DOM:
- **Roving Tabindex Annotation:** Specify that the entire tree operates as a **single Tab stop**.
  - The active/focused node has `tabindex="0"`. All other nodes have `tabindex="-1"`.
  - Pressing `Tab` exits the tree entirely.
- **Keyboard Navigation Mapping:** Document standard keyboard behavior (Arrow keys, Home, End, Enter, Space) clearly in design handoff specifications (see references for details).
- **ARIA Role Annotations:** Annotate your design blocks with explicit ARIA roles: `role="tree"` on the main container, `role="treeitem"` on all interactive rows, `role="group"` on child lists, and `aria-expanded="true/false"` on branches.

---

## Decision Rules

### Structuring Nodes: Branch vs. Leaf

| Content Scenario | Recommended Node Type | Chevron / Folder Icon | Activation Action |
| :--- | :--- | :--- | :--- |
| **Contains children & has a dedicated overview page** | Hybrid Branch Node | Include Chevron + Folder Icon. | Clicking Chevron toggles expansion. Clicking label navigates to the overview page. |
| **Contains children but has NO overview page** | Structural Branch Node | Include Chevron + Folder Icon. | Clicking anywhere on the row toggles expansion. Does not navigate. |
| **Has children but behaves as a separate entity** | Flat Branch Node | Include Chevron + Document Icon. | Treat as standard branch, but highlight selection when active. |
| **No children (terminal page/document)** | Leaf Node | No Chevron. Include Document Icon. | Clicking row navigates directly to page. |

### Indentation Strategies: Visual Density tradeoffs

- **The Indented List Pattern:** Standard progressive padding left. Best for editorial documentation and knowledge hubs. It is highly scannable and familiar to users.
- **The Guide-Line Pattern:** Standard indentation + thin vertical connecting lines (`1px border-left` on the `.tree-group`). Best for high-density file managers, developer workspaces, and multi-level database structures. It helps track relationships across dozens of nested nodes.
- **The Accordion-Nested Pattern:** Zero or minimal indentation offset but distinct row backgrounds per level. Best for mobile drawer hierarchies where horizontal screen space is extremely limited.

---

## Constraints

- **Single Tab Stop (WCAG 2.1 SC 2.1.1):** Design annotations must specify that the tree acts as a single widget. Tabbing must not trap the user inside a long list of nested nodes.
- **Contrast Ratios (WCAG 2.1 SC 1.4.3):** All state variations (Hover, Selected, Focused, Default) must maintain a minimum contrast of `4.5:1` for body text and `3:1` for visual focus rings.
- **Touch Targets (WCAG 2.2 SC 2.5.8):** On mobile and touch devices, interactive elements must meet the minimum target size of `24x24px` with sufficient space, though primary triggers should be styled to `44x44px` for natural thumb reach.
- **No Visual-DOM Mismatch (WCAG 2.1 SC 1.3.2):** Ensure the logical DOM structure parses left-to-right and top-to-bottom exactly as it is represented visually. Never use CSS properties like `order` or absolute positioning to rearrange nodes out of their hierarchical sequence.

---

## Common Failure Patterns

- **The "Tab Key Nightmare":** Allowing keyboard users to tab through every node in the sidebar. In a sitemap with 50 pages, a keyboard user must press `Tab` 50 times to skip past the sidebar. *Fix: Use roving tabindex.*
- **Horizontal Text Crushing:** Allowing deep nested nodes to compress text into tiny vertical strips on mobile screens or small desktop windows. *Fix: Cap depth at 4 levels, use separate root sections, or convert to accordion-nested patterns on mobile.*
- **Invisible Focus Indicators:** Omiting custom outlines on active tree items, leaving keyboard navigators completely blind to which node is currently selected. *Fix: Style a prominent, high-contrast, non-clipped `:focus-visible` outline.*
- **Accidental Click Zones:** Placing small, tight links right next to chevron toggles. Users frequently miss the chevron and trigger an accidental page reload instead of expanding the folder. *Fix: Increase chevron touch target to `44x44px` and add visual separation.*
- **Scrolling Sync Deletion:** Having a sticky main header that overlaps or clips the tree view when focused. *Fix: Implement correct scroll margins (`scroll-margin-top`) so focused treeitems are always scrolled into view safely.*

---

## Validation Criteria

- [ ] **Proportional Indentation:** Visual indentations use a standardized spacing multiplier based on `--tree-depth` (e.g., `12px` to `16px` steps) with a hard depth cap of 4 levels.
- [ ] **State Clarity:** Nodes have distinct, high-contrast styling for Hover, Focus, Selected, and Active states.
- [ ] **Contrast AA Compliance:** Text and icons in all states maintain a contrast ratio of at least `4.5:1` against their immediate backgrounds.
- [ ] **Chevron Synchronicity:** Chevrons rotate predictably (pointing right for collapsed, down for expanded) matching the ARIA `aria-expanded` state.
- [ ] **Handoff Specifications:** Core accessibility requirements (Roving tabindex, Keyboard controls, ARIA landmark roles) are annotated on design outputs.
- [ ] **Mobile Stacking Adaptability:** Sidebar transitions cleanly into a mobile-friendly, touch-target optimized drawer menu below `1024px` with minimum touch targets of `44px` for primary triggers.
- [ ] **Reading Order Integrity:** The source DOM sequence aligns exactly with the visual hierarchical flow (left-to-right, top-to-bottom).
