---
name: toolbar-and-action-dock-system
description:
  Design high-density application toolbars, formatting action bars, floating bulk-selection docks,
  and canvas tool rails for complex web interfaces, managing control grouping, optical density,
  active/pressed toggle states, keyboard roving tabindex accessibility, responsive overflow menus,
  and floating action dock transitions.
---

# Toolbar and Action Dock System

## Purpose

The Toolbar and Action Dock System provides a systematic design and spatial architecture framework for application toolbars, formatting action bars, floating bulk-selection action docks, and tool rails in modern web applications. Complex productivity tools, rich document editors, data management tables, and canvas applications present dozens of actionable controls within limited screen real estate. Without a structured toolbar system, controls become visually cluttered, create keyboard accessibility "tab storms" (requiring dozens of Tab key presses to bypass), fail to communicate toggle states (`aria-pressed`), and break on narrow viewports or mobile displays.

This skill establishes clear spatial hierarchy, optical grouping rules, active/pressed/selected state feedback, keyboard focus navigation (roving `tabindex` with arrow key controls), responsive overflow menu behavior, and floating contextual action dock positioning in strict compliance with WCAG 2.1/2.2 AA accessibility standards.

## Use Cases

- **Rich Text & Content Editor Toolbars:** Structuring formatting controls (Text style, Bold, Italic, Link, Alignment, Lists, Attachments) above or below content editing areas.
- **Data Table Bulk Action Docks:** Displaying a floating, contextual bottom action dock (e.g., "3 items selected — [ Export ] [ Move ] [ Delete ]") when users select items via checkboxes in data tables or asset grids.
- **Design & Canvas Tool Rails:** Positioning vertical or horizontal floating tool palettes (Select, Pan, Draw, Shapes, Zoom, Layers) for interactive canvas applications, node editors, or image processors.
- **Media & Asset Management Action Bars:** Organizing batch operations (Filter, Sort, View Switcher, Tag, Download, Archive) at the top of media libraries or file management systems.
- **Code & Query Console Action Bars:** Anchoring run/execute, format, copy, clear, and settings controls above interactive code blocks, SQL editors, or API terminals.

## When NOT to Use

- **Primary Site Navigation Bar:** For top-level site branding, global search, and page-level destination links, use `site-navigation-system` or `mega-menu-navigation-system`.
- **Mobile Primary Destination Tabs:** For persistent mobile app navigation tabs anchored at the bottom of the phone viewport, use `bottom-navigation-system`.
- **In-Form Single CTA Bars:** For persistent form submit or checkout action bars pinned to the bottom of mobile pages, use `sticky-and-floating-ui-system` or `form-design-system`.
- **Standalone Form Input Controls:** For selecting options within form fields or filtering single dropdowns, use `custom-select-and-combobox-system` or `segmented-control-system`.

## Inputs

1. **Action Taxonomy & Categories:** Comprehensive inventory of all commands, tools, and actions needed, grouped by functional hierarchy (e.g., File, History, Text Style, Block Level, Alignment, Actions).
2. **Control Types & Interaction Modes:** Specification of control behaviors:
   - *Momentary Action Button:* Single trigger (e.g., Undo, Export, Delete).
   - *Toggle Switch/Button:* On/Off state (e.g., Bold, High Contrast Mode, Snap to Grid).
   - *Single-Select Choice Group:* Mutually exclusive options (e.g., Left / Center / Right Alignment).
   - *Dropdown / Popover Menu Trigger:* Action opening a secondary panel (e.g., Heading level picker, Color swatch).
3. **Selection Context Hooks:** State triggers that show/hide or enable/disable toolbar groups (e.g., `selectedItemCount > 0` triggers bulk action dock).
4. **Viewport & Breakpoint Targets:** Breakpoints (e.g., 640px, 1024px) for shifting from full inline toolbar to compact or overflow popover modes.
5. **Design Tokens:** Color palettes, elevation/shadow tokens, typography scales, icon sets, and spacing variables (from `accessible-color-system`, `elevation-and-depth-system`, and `iconography-system`).

## Outputs

1. **Toolbar Anatomy & Spatial Grid Spec:** Blueprint defining heights, horizontal padding, item gaps, optical divider rules, and grouping boundaries for horizontal bars and vertical tool rails.
2. **Interactive State Token Map:** Visual definitions and color contrast specifications for Idle/Default, Hover, Active/Pressed, Focus-Visible, Disabled, and Selection states across light and dark themes.
3. **Keyboard Navigation & ARIA Semantics Spec:** Detailed mapping for `role="toolbar"`, `aria-label`, roving `tabindex="0"` / `tabindex="-1"`, `aria-pressed`, `aria-expanded`, and Arrow key focus management.
4. **Responsive Overflow Architecture:** Rules for collapsible overflow triggers (`aria-haspopup="menu"` / `<popover>`), prioritization ranks, and wrapping strategies for compact screens.
5. **Floating Action Dock Motion & Layout Spec:** Spatial positioning, fixed/sticky layering (`z-index`), safe-area inset handling, and entry/exit animation specs for contextual bulk selection docks.

---

## Workflow

### 1. Structure the Action Taxonomy and Visual Grouping
Organize toolbar actions into logical, visually distinct functional groups:
- **Group Sizing:** Limit each logical group to 2–5 related controls (e.g., [Bold, Italic, Underline] in one group, [Left, Center, Right align] in another).
- **Optical Separators:** Separate distinct groups using subtle vertical divider lines (`width: 1px; height: 16px; background: var(--border-subtle); margin: 0 4px;`) or distinct structural gaps (`gap: 12px` between groups vs `gap: 2px` within a group).
- **Hierarchy Order:** Place highest-frequency, core controls on the far left (or top for vertical rails), contextual tools in the middle, and view/settings/more options on the far right.

### 2. Define Spatial Anatomy and Touch Targets
Establish consistent sizing according to the interface density context:
- **Desktop High-Density Mode (Desktop App / Editor):**
  - Toolbar Container Height: `36px` to `40px`.
  - Button Size: `28x28px` or `32x32px` square buttons.
  - Icon Size: `16x16px` or `18x18px`.
  - Inner Padding: `4px` top/bottom, `8px` left/right container padding.
  - Button Radius: `4px` or `6px`.
- **Standard / Touch-Friendly Mode (Responsive Web / Tablet):**
  - Toolbar Container Height: `48px` to `56px`.
  - Button Sizing: Minimum `44x44px` or `48x48px` clickable target area (`min-width: 44px; min-height: 44px;`).
  - Icon Size: `20x20px` or `24x24px`.
  - Inner Gap: `4px` to `8px`.
- **Floating Bulk Action Dock:**
  - Dock Height: `52px` to `60px`.
  - Elevation: Floating with high elevation shadow (`box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);`).
  - Border Radius: `999px` (Pill shape) or `12px` rounded card.
  - Positioning: Centered at bottom of viewport (`position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 1000;`). Include `env(safe-area-inset-bottom)`.

### 3. Establish Interactive States and Contrast
Ensure every toolbar control clearly communicates its state:
- **Idle / Unpressed:** Ghost style background (`background: transparent; color: var(--text-secondary);`).
- **Hover / Pointer Over:** Subtle surface tint (`background: var(--surface-hover, rgba(0,0,0,0.05)); color: var(--text-primary);`).
- **Active / Pressed Toggle State (e.g., Bold ON):** High-contrast filled background or distinct brand border (`background: var(--brand-subtle, #EFF6FF); color: var(--brand-primary, #1D4ED8); font-weight: 600;`). Accompanied by `aria-pressed="true"`.
- **Disabled State:** Reduced opacity (`opacity: 0.4; cursor: not-allowed;`).
- **Focus-Visible State:** Prominent focus outline (`outline: 2px solid var(--focus-ring, #2563EB); outline-offset: 1px;`).

### 4. Implement ARIA Semantics and Keyboard Roving Focus
A toolbar containing 15 buttons must NOT require 15 `Tab` presses to navigate past.
- **Container Semantics:** Add `role="toolbar"` and `aria-label="Document formatting tools"` (or `aria-labelledby`) to the toolbar root container.
- **Roving Tabindex Pattern:**
  - Set `tabindex="0"` on the *currently focused or first active button* in the toolbar.
  - Set `tabindex="-1"` on *all other buttons* in the toolbar.
  - Implement JavaScript arrow key listeners:
    - **Horizontal Toolbar:** `ArrowRight` / `ArrowLeft` moves focus to the next/previous toolbar button and updates `tabindex="0"`.
    - **Vertical Tool Rail:** `ArrowDown` / `ArrowUp` moves focus up/down.
    - **Home / End Keys:** Move focus directly to the first / last button in the toolbar.
  - Entering the toolbar with `Tab` lands on the single `tabindex="0"` item. Pressing `Tab` again immediately leaves the toolbar container.

### 5. Handle Responsive Overflow and Collapsing
When the screen width shrinks, toolbars must gracefully manage overflowing items without breaking layout:
- **Prioritization Weighting:** Rank items from Priority 1 (Never hide: Undo/Redo, Primary action) to Priority 4 (Hide first: Advanced options, secondary toggles).
- **Overflow Menu Trigger:** Group lower-priority items that overflow into a single "More tools" (`...`) button with `aria-haspopup="menu"` or `aria-expanded="false"`.
- **Responsive Stacking / Docking:**
  - On desktop, render horizontal toolbar aligned with editor content.
  - On mobile web (<640px), wrap rich text toolbars into a sticky dock above the mobile soft keyboard (`position: sticky; bottom: 0;`).

---

## Decision Rules

### Choice of Toolbar Architecture

| Pattern | Layout & Position | Primary Use Case | Key Interaction |
| :--- | :--- | :--- | :--- |
| **Inline Header Toolbar** | Horizontal bar anchored above document/content area. | Rich text editors, code editors, file managers. | Direct action execution for current document or active cursor selection. |
| **Floating Bulk Action Dock** | Centered bottom floating pill/card (`position: fixed`). Appears dynamically on item selection. | Data tables, batch card selection, media galleries. | Bulk batch operations (Delete 5 items, Tag, Export) on selected rows. |
| **Vertical Tool Rail** | Pinned or floating vertical strip on left/right edge. | Design canvas, CAD tools, image creation, node graphs. | Tool switching (Select mode vs Draw mode vs Zoom mode). |
| **Contextual Floating Popup Bar** | Appears directly above highlighted text selection (`position: absolute`). | Medium-style inline text selection editing. | Instant micro-formatting for selected text range. |

### Label Visibility Matrix
- **Icon-Only Buttons:** Use for universally understood standard actions (Bold [B], Italic [I], Link [🔗], Undo [↩], Redo [↪], Trash [🗑]). *Requirement:* Must include visible tooltip on hover and screen-reader `aria-label`.
- **Icon + Text Label Buttons:** Use for domain-specific or critical destructive actions (e.g., "[▶ Run Query]", "[⚡ Publish]", "[ Batch Export ]").
- **Text-Only Dropdown Triggers:** Use for variable value selectors (e.g., "Normal Text ▾", "100% ▾", "Font Family ▾").

---

## Constraints

- **Accessibility (WCAG 2.1 / 2.2 AA Compliance):**
  - **SC 2.1.1 Keyboard Accessibility:** Entire toolbar must be navigable via Keyboard (`Tab` to enter, `Arrow` keys to navigate within, `Space`/`Enter` to trigger actions).
  - **SC 2.4.7 Focus Visible:** Focused toolbar buttons must present an unclipped focus ring with at least 3:1 contrast against surrounding backgrounds.
  - **SC 4.1.2 Name, Role, Value:** All icon buttons must have explicit `aria-label`s. Toggle state buttons must reflect state via `aria-pressed="true|false"`. Dropdown triggers must use `aria-expanded="true|false"`.
  - **SC 2.5.8 Target Size (Minimum):** Pointer target size must measure at least **24x24px** (with surrounding spacing meeting 44x44px total target area) on desktop, and **44x44px / 48x48px** on touch devices.
- **Contrast Ratios:** Idle icons and text must meet 4.5:1 contrast against the toolbar container background. Pressed/Active buttons must maintain 4.5:1 contrast.
- **Layering & Z-Index:** Floating bulk action docks must use controlled stacking (`z-index: 1000`) below top modal overlays (`z-index: 2000`) but above scrolling table content.

---

## Common Failure Patterns

- **The Keyboard Tab Storm:** Forgetting `role="toolbar"` and roving `tabindex`, forcing keyboard users to press `Tab` 25 times to bypass a rich text formatting toolbar.
- **Missing Toggle Feedback (`aria-pressed`):** Styling a "Bold" button visually blue when active, but failing to set `aria-pressed="true"`, leaving screen reader users blind to active formatting states.
- **Ambiguous Mystery Icons:** Using obscure custom SVG icons without text labels, tooltips, or `aria-label` attributes, making tools impossible to identify.
- **Clipped Overflow:** Allowing toolbar buttons to wrap onto hidden lines or get clipped behind `overflow: hidden` containers on mobile screens without providing an overflow menu or scroll snap.
- **Floating Dock Occlusion:** Positioning a floating bulk action dock at the bottom of the screen without handling `env(safe-area-inset-bottom)` or obscuring the table's bottom pagination controls.

---

## Validation Criteria

- [ ] Toolbar uses `role="toolbar"` with a descriptive `aria-label` or `aria-labelledby`.
- [ ] Roving `tabindex` is implemented so only ONE item in the toolbar is in the tab order (`tabindex="0"`), while others are `tabindex="-1"`.
- [ ] Arrow keys (`Left`/`Right` or `Up`/`Down`) smoothly transfer focus between toolbar controls.
- [ ] Toggle buttons reflect active state using `aria-pressed="true|false"`.
- [ ] Dropdown and popover triggers reflect open state using `aria-expanded="true|false"`.
- [ ] All icon-only buttons include explicit `aria-label` text and hover tooltips.
- [ ] Button targets meet minimum size requirements (44x44px touch / 24x24px desktop with spacing).
- [ ] Active, hover, and focus states maintain WCAG AA minimum contrast ratios (4.5:1 text/icon, 3:1 focus ring).
- [ ] Floating bulk action docks incorporate `env(safe-area-inset-bottom)` and proper fixed elevation styling.
