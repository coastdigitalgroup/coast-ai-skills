---
name: toolbar-and-action-dock-system
description:
  Design and implement a systematic framework for application toolbars, formatting
  action bars, bulk selection floating docks, and canvas control rails, managing control
  grouping, optical density, keyboard roving tabindex accessibility, and responsive overflow.
---

# Toolbar and Action Dock System

## Purpose

The Toolbar and Action Dock System provides a methodology for organizing high-density, multi-functional tool collections into accessible, structured action bars and floating docks. Modern web applications—such as rich-text editors, data tables with bulk management, creative canvas tools, code/document previewers, and CMS dashboards—require specialized action containers that group tools logically without overwhelming the user.

Without a systematic toolbar architecture, interfaces suffer from icon clutter, ambiguous tool states, broken keyboard focus sequences, unaligned tool padding, and destructive layout reflows when viewports shrink. This system establishes precise guidelines for optical alignment, semantic grouping with dividers, active toggle feedback (`aria-pressed`), roving tabindex keyboard navigation (`role="toolbar"`), responsive overflow menus, and floating dock placement.

## Use Cases

- **Rich Text & Content Editor Toolbars:** Structuring text formatting controls (Bold, Italic, Alignment, Heading levels, Link Insertion) in web applications and CMS platforms.
- **Data Table Bulk Action Docks:** Displaying multi-item action strips (Export, Assign, Tag, Delete) that animate into view when items are selected in admin panels or inbox interfaces.
- **Canvas & Spatial Control Rails:** Designing pinned or floating tool palettes (Select, Pan, Shapes, Zoom levels, History undo/redo) for interactive drawing, diagramming, or design tools.
- **Document & Media Viewport Toolbars:** Organizing page navigation, zoom controls, download/print triggers, and viewing mode toggles above PDF, code, or image viewers.
- **Dashboard Workspace Action Bars:** Grouping view-switching pills, date range pickers, refresh triggers, and export actions across enterprise data views.

## When NOT to Use

- **Global Site Navigation:** For primary top-level site navigation headers or main menus, use `site-navigation-system` or `mega-menu-navigation-system`.
- **Standalone Form Submissions:** For standard vertical forms with a single primary submit/cancel action group, use `form-design-system` and `button-and-action-system`.
- **Mobile Primary Navigation:** For mobile app bottom tab bar navigation, use `bottom-navigation-system`.
- **Single Persistent CTAs:** For mobile persistent purchase docks or sticky landing page CTAs, use `sticky-and-floating-ui-system`.

## Inputs

1. **Tool Inventory & Functional Taxonomy:** List of all tools, categorized by action type:
   - *State Toggles* (Bold, Italic, Pin)
   - *Direct Triggers* (Undo, Redo, Copy, Delete)
   - *Single-Select Choice Groups* (Left / Center / Right alignment)
   - *Value Controls & Dropdowns* (Font size, Zoom level, Color picker)
2. **Context & Placement:** Location of the toolbar (Sticky top bar, Inline content header, Floating bottom dock, Vertical spatial rail).
3. **Density Tier:** Spatial density level required (`Compact` 32px tool height, `Default` 40px tool height, `Spacious` 48px tool height).
4. **Active State Indicators:** Current state matrix (e.g., active selection count for bulk docks, active text inline styles for text editors).

## Outputs

1. **Toolbar Spatial Blueprint:** Detailed layout spec using CSS Flexbox/Grid, including tool heights, internal padding, gap spacing, and vertical grouping dividers.
2. **Accessibility & ARIA Spec:** Semantic structure utilizing `role="toolbar"`, `aria-label`, `aria-pressed`, `aria-expanded`, and a roving `tabindex` focus loop.
3. **Responsive Collapse & Overflow Plan:** Priority ordering matrix detailing which tools remain visible vs. collapse into an "More Tools" (`...`) overflow menu on smaller viewports.
4. **Floating Action Dock Mechanics:** Animation, elevation, and backdrop specifications for floating selection docks.

---

## Workflow

### 1. Categorize and Group Controls Logically

Never render a loose sequence of 15 identical icon buttons. Group tools into semantic "clusters" based on functional domain:
- **Primary Tool Cluster:** Core actions used 80% of the time (e.g., Text Style, Selection Tool).
- **Secondary Tool Cluster:** Supporting utilities (e.g., Alignment, Lists, Formatting).
- **Global / Utility Cluster:** View settings, Undo/Redo, Clear, or Fullscreen toggles.
- **Visual Separation:** Separate adjacent tool clusters with explicit vertical dividers (`<div role="separator" aria-orientation="vertical">`) styled with high-contrast subtle border colors and 12px-16px vertical inset padding.

### 2. Standardize Tool Heights and Touch Targets

Apply strict spatial alignment so mixed control types (icon buttons, segmented toggles, dropdown triggers, numeric inputs) align seamlessly along a single optical axis:
- **Default Toolbar Height:** Container height `48px` to `56px`. Tool height `36px` to `40px` with `4px` to `8px` container padding.
- **Compact Toolbar Height:** Container height `40px`. Tool height `32px` for dense SaaS desktop environments.
- **Touch Target Footprint:** On touch devices or mobile viewports, enforce a minimum `44x44px` interactive touch target for every tool trigger, either via visual size or invisible CSS hit area expansion (`::after` pseudo-element padding).

### 3. Establish Explicit Active and Toggle Visual States

Toolbars rely heavily on stateful toggles (`aria-pressed="true|false"`). Users must instantly recognize which tools are active without reading labels:
- **Default State:** Transparent background, high-contrast muted icon color (`var(--text-secondary)`).
- **Hover State:** Low-contrast neutral fill background (`var(--surface-hover)`), sharp cursor feedback.
- **Active / Pressed State:** Distinct high-contrast background fill (`var(--surface-selected)` or brand tint), bold icon color, and a subtle inset or border stroke.
- **Disabled State:** 40% opacity, `cursor: not-allowed`, `aria-disabled="true"`, and omitted from roving tabindex focus navigation.

### 4. Implement Roving Tabindex Keyboard Navigation

A toolbar with 20 buttons must **not** require 20 `Tab` key presses to traverse. Implement the WAI-ARIA Toolbar Design Pattern:
- **Container Level:** Set `role="toolbar"` and a descriptive `aria-label` (e.g., `aria-label="Text Formatting Tools"`).
- **Roving Focus (`tabindex` Management):**
  - Set `tabindex="0"` on the currently active or last-focused tool button.
  - Set `tabindex="-1"` on all other buttons within the toolbar.
  - Listen for `ArrowRight` / `ArrowDown` to move focus to the next enabled tool and set its `tabindex="0"`.
  - Listen for `ArrowLeft` / `ArrowUp` to move focus to the previous enabled tool.
  - Support `Home` (jump to first tool) and `End` (jump to last tool).
  - Pressing `Tab` from outside the toolbar lands on the active tool (`tabindex="0"`). Pressing `Tab` again moves focus out of the toolbar entirely to the next page element.

### 5. Design Responsive Overflow and Dropdown Collapsing

Toolbars must adapt gracefully to viewport constraint without wrapping into ugly multi-line breaks:
- **Priority Priority List:** Assign a priority rating (P1 = Always Visible, P2 = Collapse First on Medium Screens, P3 = Collapse First on Mobile) to every tool group.
- **Overflow Menu Button:** When container width falls below the total width of P1+P2+P3 tools, automatically gather P2/P3 tools into an Overflow Dropdown button (`aria-expanded="false"`, icon `...` or `More Tools`).
- **Floating Dock Adaptation:** For bulk selection docks that float near the bottom edge on desktop, expand them to fill 100% viewport width with `padding-bottom: env(safe-area-inset-bottom)` on mobile devices.

---

## Decision Rules

### Tool Type & ARIA Mapping Matrix

| Control Type | Visual Pattern | ARIA Markup & Attributes | Keyboard Interaction |
| :--- | :--- | :--- | :--- |
| **State Toggle** | Icon button with fill state | `button`, `aria-pressed="true\|false"` | `Space` / `Enter` toggles state |
| **Direct Trigger** | Icon button or text button | `button` | `Space` / `Enter` fires action |
| **Exclusive Choice** | Segmented pill group | `div[role="radiogroup"]`, `button[role="radio"][aria-checked="true\|false"]` | Arrow keys switch radio selection |
| **Tool Menu Trigger** | Icon + chevron down | `button`, `aria-haspopup="true"`, `aria-expanded="false"` | `Space` / `Enter` / `DownArrow` opens menu |
| **Numeric Value** | Stepper input or combo box | `input[type="number"]` or `div[role="combobox"]` | `UpArrow` / `DownArrow` changes value |

### Dock Placement Rules

- **Sticky Top Bar:** Use for rich text editors, code block toolbars, and primary document management where tools apply to content flowing below.
- **Floating Bottom Dock:** Use for bulk table selection actions or active multi-item management. Float `24px` above the bottom viewport edge on desktop, anchored to bottom with safe-area insets on mobile.
- **Side Vertical Rail:** Use for creative design tools, canvas editors, or spatial mapping applications where horizontal viewport width must be preserved for the canvas.

---

## Constraints

- **Accessibility (WCAG 2.2 AA Minimum):**
  - **SC 2.1.1 Keyboard:** Entire toolbar must be navigable via `Tab` (enter/exit) and `Arrow` keys (internal traversal).
  - **SC 2.4.11 Focus Not Obscured:** Focus indicators on toolbar buttons must have a minimum 2px offset or high-contrast ring (`:focus-visible`) that is never clipped by `overflow: hidden` on the parent container.
  - **SC 2.5.8 Target Size:** Minimum 24x24px target size, 44x44px preferred on mobile/touch viewports.
  - **SC 4.1.2 Name, Role, Value:** All icon-only toolbar buttons must feature a screen-reader accessible name via `aria-label` or visible tooltip linked via `aria-labelledby`.
- **Layout Integrity:**
  - Toolbars must never wrap onto multiple lines in sticky headers unless explicitly designed as a multi-tier editor toolbar. Use `flex-wrap: nowrap` with responsive overflow collection instead.
  - Floating docks must specify `z-index` within established stacking tiers (e.g., `z-index: 150`) to avoid clashing with modals (`z-index: 1000`) or tooltips (`z-index: 2000`).

---

## Common Failure Patterns

- **The Tab Key Trap (15-Tab Nightmare):** Leaving all 20 buttons in default tab order (`tabindex="0"`), forcing screen reader and keyboard users to press `Tab` 20 times just to bypass the toolbar.
- **The Unlabeled Icon Cloud:** Using esoteric icons (e.g., abstract geometric shapes) with no `aria-label` and no hover tooltip, leaving users guessing what actions perform.
- **Ambiguous Active States:** Styling active toggles with slightly darker gray fills that are indistinguishable from hover states, failing visual clarity and contrast standards.
- **The Mobile Wrap Reflow:** Allowing a 600px wide toolbar to break into 4 jagged lines on mobile screens, pushing page content down and causing massive layout shifts.
- **Clipping Tooltips and Dropdowns:** Setting `overflow: hidden` on the main toolbar container, which truncates active tool dropdown menus or tooltips at the toolbar boundary.

---

## Validation Criteria

- [ ] **Semantic Structure:** Container uses `role="toolbar"` with a clear `aria-label`.
- [ ] **Roving Tabindex Verified:** Pressing `Tab` enters the toolbar on one active tool button. `ArrowLeft` and `ArrowRight` cycle through tools. `Tab` exits the toolbar immediately.
- [ ] **Stateful Attributes:** All toggle tools use `aria-pressed="true|false"` and update visually with distinct active styles.
- [ ] **Accessible Icon Names:** 100% of icon-only buttons include descriptive `aria-label` strings (e.g., `aria-label="Format text as bold"`).
- [ ] **Separation & Grouping:** Related tools are grouped into clusters separated by explicit dividers (`role="separator"`).
- [ ] **Responsive Overflow:** On narrow viewports, lower-priority tools collapse into an overflow dropdown menu without wrapping or triggering horizontal scrollbars.
- [ ] **Target Size Compliant:** All interactive buttons meet the WCAG 2.2 24x24px floor, with 44x44px target areas on touch devices.
