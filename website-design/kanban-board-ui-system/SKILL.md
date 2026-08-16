---
name: kanban-board-ui-system
description:
  Design a systematic, highly accessible, and responsive visual layout framework for
  Kanban boards and workflow status columns, establishing spatial composition,
  horizontal column containment, card anatomy, Work-In-Progress (WIP) limit signaling,
  and keyboard/screen-reader drag-and-drop accessibility.
---

# Kanban Board UI System

## Purpose

The Kanban Board UI System provides a standardized, high-density, and accessible layout framework for managing workflow status columns, card-based task items, and process pipelines. Kanban boards are core interaction canvases in modern SaaS applications, project management tools, candidate tracking systems (ATS), and sales CRM pipelines.

Designing an effective Kanban interface requires balancing high visual density, independent column scrolling, clear spatial hierarchy, real-time Work-In-Progress (WIP) limit feedback, and fluid responsiveness across viewports. Furthermore, traditional pointer-only drag-and-drop implementations frequently create severe accessibility barriers. This skill bridges design and technical execution, establishing spatial rules for column containment, task card anatomy, touch targets, and keyboard/screen-reader reordering workflows in compliance with WCAG AA standards.

## Use Cases

- **Project & Task Management Systems:** Structuring sprint boards, backlog columns (e.g., Backlog, In Progress, Code Review, Done), and issue tracking boards.
- **Applicant Tracking Systems (ATS):** Visualizing candidate recruitment stages (e.g., Applied, Screening, Interview, Offer, Hired).
- **Sales & CRM Deal Pipelines:** Managing sales lead stages with aggregated deal values and stage probabilities per column.
- **Content Editorial Calendars:** Tracking article and media production workflows from ideation through drafting, review, and publication.
- **Order Fulfillment Workspaces:** Monitoring multi-step order processing in logistics or kitchen display interfaces.

## When NOT to Use

- **Data Grids & Tabular Financial Lists:** For dense, multi-column row data requiring sorting, filtering, and bulk cell editing, use `data-table-ui-system`.
- **Hierarchical Documentation or File Trees:** For deeply nested file structures and document outlines, use `tree-view-navigation-system`.
- **Viewport-Locked SaaS Shell Layouts:** For the overarching application shell (navigation bars, topbars, collapsible panels), use `dashboard-layout-system`.
- **Single-Column Activity Feeds:** For chronological stream feeds or simple vertical task lists, use `timeline-activity-system` or `card-ui-system`.

## Inputs

1. **Workflow Stages & Column Taxonomy:** The ordered list of workflow statuses (e.g., To Do, In Progress, Review, Done) and their column metadata (WIP limits, status accent colors, deal totals).
2. **Card Data Density Matrix:** Attributes to display per task card (e.g., Task ID, Title, Priority Tag, Due Date, Assignee Avatars, Subtask Progress, Attachment Counts).
3. **Viewport & Shell Context:** Layout bounds provided by the parent application shell (from `dashboard-layout-system`).
4. **Design Tokens:** Color palettes, elevation surfaces, spacing scales, and typography tokens (from `accessible-color-system`, `elevation-and-depth-system`, and `fluid-spacing-system`).

## Outputs

1. **Horizontal Column Canvas Specification:** Spatial layout definitions for viewport-locked horizontal scrolling containers, fixed column widths, and gutter gaps.
2. **Column Header & WIP Limit Anatomy:** Visual designs for column headers, badge counters, WIP limit warning thresholds (normal, approaching, exceeded), and quick-add action triggers.
3. **Task Card Component Specifications:** Structured layout blueprints for standard, compact, and expanded task cards, including drag handle targets, metadata grids, and hover/focus/grabbed interaction states.
4. **Accessible Keyboard & Drag-and-Drop Model:** ARIA role mappings (`role="region"`, `role="list"`, `role="listitem"`), focus management routes, keyboard reorder shortcuts, and `aria-live` announcement patterns.
5. **Responsive Mobile Pivot Strategy:** Layout adaptation guidelines switching multi-column horizontal layouts to segmented tabbed views or stacked accordion panels on small screens.

---

## Workflow

### 1. Establish the Horizontal Column Canvas Structure
Structure the main board workspace within a viewport-locked shell (`dashboard-layout-system`):
- **Container Sizing:** Set the board wrapper to `display: flex; flex-direction: row; height: 100%; overflow-x: auto; overflow-y: hidden;` to allow horizontal scrolling across columns while keeping the board header fixed.
- **Column Dimensions:** Define fixed or flex-shrink column widths (`min-width: 280px; max-width: 340px; width: 300px;`). Avoid letting columns shrink below `280px` to prevent text truncation and squeezed tap targets.
- **Gutters & Padding:** Set a consistent column gap (e.g., `gap: var(--space-m, 16px)`) and horizontal padding (e.g., `padding: 16px 24px`).
- **Column Container Shell:** Style each column as an independent flex container (`display: flex; flex-direction: column; max-height: 100%; background: var(--surface-neutral-subtle); border-radius: 8px; border: 1px solid var(--border-subtle);`).

### 2. Design the Column Header and WIP Signaling
Each column header acts as a sticky control bar at the top of the column stack:
- **Sticky Column Header:** Position the header at the top of the column flex stack (`flex-shrink: 0; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;`).
- **Header Elements:**
  1. **Status Accent Indicator:** A 10x10px colored pill or left border corresponding to the stage (e.g., Blue = In Progress, Purple = Review, Green = Done).
  2. **Column Title:** Truncated text (`font-weight: 600; font-size: 0.9375rem; color: var(--text-primary)`).
  3. **Card Counter & WIP Limit Badge:** Display the item count alongside the WIP limit (e.g., "3/5").
  4. **Column Actions Menu:** A 32x32px icon button (`...`) providing access to column settings, sorting, or collapse options.
- **WIP Limit Visual States:**
  - *Normal (Under Limit):* Subtle neutral badge background (`background: var(--surface-neutral-muted); color: var(--text-secondary)`).
  - *Warning (At Limit):* Amber badge background (`background: var(--surface-warning-subtle); color: var(--text-warning-bold)`).
  - *Exceeded (Over Limit):* Solid red badge or highlighted header border (`background: var(--surface-danger-subtle); border-color: var(--border-danger); color: var(--text-danger)`), with an accessible warning icon and tooltip explaining the workflow bottleneck.

### 3. Construct the Independent Column Scroll Region
Prevent the entire board or page from scrolling vertically when inspecting a long list of cards in a single column:
- **Card List Container:** Apply `flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 12px 12px 12px; display: flex; flex-direction: column; gap: 8px;` to the list container (`role="list"`).
- **Inertia & Smooth Scrolling:** Enable `-webkit-overflow-scrolling: touch;` and custom scrollbars (subtle 6px scrollbars) so individual columns scroll smoothly without triggering global page movement.
- **Empty State Container:** If a column contains 0 cards, display a dashed drop-zone outline (`border: 2px dashed var(--border-muted); border-radius: 6px; padding: 24px; text-align: center;`) with a subtle label ("No tasks in this stage") and a quick "Add Card" button.

### 4. Build the Task Card Component Hierarchy
Design task cards with a clear visual scanning order using `visual-hierarchy-system`:
- **Card Base Structure:** Render each card as a distinct list item (`role="listitem"` / `article`) with `background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px; box-shadow: var(--shadow-sm); transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: grab;`.
- **Card Region Breakdown:**
  1. **Top Row (Tags & Actions):** Priority badge (e.g., "High", "Urgent" in high-contrast pills) and task reference ID (e.g., "PROJ-1042"). Include a 24x24px drag handle button (`aria-label="Reorder card PROJ-1042"`).
  2. **Middle Region (Title & Description):** Main task title (`font-weight: 600; font-size: 0.875rem; line-clamp: 2; margin-bottom: 8px;`). Optional 1-line muted text summary.
  3. **Bottom Meta Row (Progress & Assignees):** Left side shows due date indicator (highlighted red if overdue) and subtask checklist progress (e.g., "3/5 ✓"). Right side displays stacked assignee avatars (`user-avatar-system`).
- **Card Interaction States:**
  - *Hover:* Slight elevation shadow increase (`box-shadow: var(--shadow-md); border-color: var(--border-hover)`).
  - *Focus:* Highly visible 2px offset focus ring (`outline: 2px solid var(--focus-ring); outline-offset: 2px`).
  - *Dragging / Grabbed State:* `opacity: 0.6; transform: scale(1.02) rotate(1deg); cursor: grabbing; box-shadow: var(--shadow-xl); z-index: 1000;`.
  - *Drop Target Cue:* When hovering a card over a column drop zone, display an animated insertion placeholder gap (`height: 60px; border: 2px dashed var(--brand-primary); border-radius: 6px; background: var(--brand-subtle);`).

### 5. Implement Accessible Keyboard & Screen Reader Drag-and-Drop
Standard drag-and-drop frameworks (HTML5 Drag and Drop API) are frequently inaccessible to keyboard-only and screen-reader users. Implement an explicit alternative keyboard navigation mode:
- **Keyboard Reorder Trigger:** Allow users to focus the drag handle or card and press `Space` or `Enter` to enter "Move Mode".
- **Focus & Announcement on Selection:** When Move Mode is activated, set `aria-grabbed="true"` (or `aria-pressed="true"` on the movement trigger), display a visual "Grabbed" halo around the card, and announce via an invisible `aria-live="polite"` region: *"Card PROJ-1042 grabbed. Currently in column 'In Progress', position 2 of 5. Use Arrow keys or Alt+Arrow keys to move, Space to drop, Escape to cancel."*
- **Moving Across & Within Columns:**
  - *Up / Down Arrow Keys:* Reorder the card within the current column list.
  - *Left / Right Arrow Keys:* Move the card to the adjacent left or right column, appending it to that column's list.
- **Drop & Cancel Confirmation:**
  - *Space / Enter:* Confirm placement. Update DOM position, release grab state, set focus to the dropped card, and announce: *"Card PROJ-1042 dropped into column 'Review', position 1 of 3."*
  - *Escape:* Cancel movement. Return card to original position and announce: *"Move canceled. Card returned to 'In Progress', position 2."*

### 6. Mobile Viewport Adaptation
Multi-column horizontal scrolling on small mobile screens (<768px) leads to severe horizontal swipe fatigue and awkward card dropping. Implement a responsive transformation strategy:
- **Segmented Column Tabs (Recommended Mobile Pattern):** On screens under 768px, hide the horizontal scroll canvas. Render a sticky segmented tab control at the top of the board (`segmented-control-system`), displaying column titles with item count badges (e.g., `[ To Do (4) ] [ In Progress (3) ] [ Done (8) ]`).
- **Single-Column Active View:** Display only the active column list in full width (`width: 100%`).
- **Contextual "Move To" Modal/Action Sheet:** When a card is tapped on mobile, provide an explicit "Move to..." button in the card menu. Tapping it opens a bottom sheet (`accessible-bottom-sheet-implementation`) listing target columns for 1-tap relocation, eliminating touch drag gestures completely on mobile screens.

---

## Decision Rules

### Mobile Column Layout Strategy

| Viewport Width | Recommended UI Pattern | Interaction Mechanics |
| :--- | :--- | :--- |
| **Desktop (>1024px)** | **Multi-Column Horizontal Grid Canvas** | Concurrent visible columns, pointer drag-and-drop + keyboard Move Mode. |
| **Tablet (768px - 1023px)** | **Compact Column Board (Horizontal Scroll)** | Narrower columns (260px), smooth touch horizontal swipe snapping. |
| **Mobile (<768px)** | **Segmented Column Tabs + Single Active Column** | Top status tabs, single-column full-width cards, "Move To" bottom sheet. |

### Column Width Strategy
- **Fixed Column Width (`300px`):** Best for standard boards with 3-6 columns. Columns maintain predictable widths, and additional columns spill cleanly into horizontal overflow.
- **Fluid Flex Columns (`flex: 1; min-width: 280px`):** Best for boards with exactly 3 columns (e.g., To Do, In Progress, Done) on wide screens, allowing columns to fill the full viewport width evenly without unused right-hand whitespace.

### WIP Limit Exceeded Handling
- **Soft WIP Limit (Warning Only):** Highlight column header in amber/red with an over-limit badge, but allow users to move cards into the column. Recommended for creative and agile team workflows where temporary bottlenecks occur.
- **Hard WIP Limit (Blocking):** Prevent dropping cards into the column when the limit is reached, displaying a modal or inline alert: *"WIP limit reached (5/5). Resolve existing tasks before adding more."* Disable keyboard movement into that column. Recommended for strictly regulated operational workflows.

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 2.1.1 Keyboard:** Every card function (edit, reorder, delete, move) must be reachable and operable using only a keyboard.
  - **SC 2.4.7 Focus Visible:** Focused cards and drag handles must feature an unclipped focus ring with a minimum 3:1 contrast ratio against the background.
  - **SC 4.1.3 Status Messages:** Card move actions, WIP warnings, and filter results must be announced via an `aria-live="polite"` region.
  - **SC 2.5.8 Target Size:** Drag handles, card menu triggers (`...`), and quick-add buttons must provide a minimum tap target of **24x24px** (44x44px preferred on touch devices).
- **Layout Containment & CLS:** Column list containers must specify `overflow-y: auto` with fixed headers to prevent layout collapse or page-level jumping when dynamic card updates occur.
- **Performance:** Render card lists efficiently. For boards containing more than 200 total cards, implement virtual list scrolling (`virtual-list-implementation`) per column to maintain 60fps rendering during drag operations.

---

## Common Failure Patterns

- **The Pointer-Only Trap:** Relying exclusively on HTML5 drag-and-drop without providing keyboard shortcuts or a "Move To" button menu, completely blocking keyboard and screen-reader users from moving tasks.
- **Double Scrollbar Disorientation:** Allowing both the inner column list and the global browser window to scroll vertically, causing nested scrollbars and rubber-banding conflicts.
- **Squeezed Mobile Columns:** Forcing 5 columns to squish onto a 375px mobile screen without horizontal scrolling or tabbed navigation, turning cards into unreadable 60px vertical strips.
- **Unannounced Drag Operations:** Moving a card using drag-and-drop without updating screen-reader live regions, leaving blind users unaware that the board state or task status changed.
- **Unconstrained Column Heights:** Allowing columns to grow indefinitely down the page, causing column headers to scroll out of view so users lose track of stage titles.

---

## Validation Criteria

- [ ] Board workspace is horizontally scrollable with sticky, non-scrolling column headers.
- [ ] Columns feature independent vertical scroll containers (`overflow-y: auto`) that do not trigger main page scrolling.
- [ ] Task cards have clear visual hierarchy including priority tags, task IDs, titles, due dates, and assignee avatars.
- [ ] WIP limit states are visually signaled with accessible color contrast and counter badges (e.g., "3/5").
- [ ] Full keyboard navigation is supported: cards and drag handles are focusable, with `Space`/`Enter` triggering keyboard Move Mode.
- [ ] Keyboard reordering with Arrow keys updates card position and announces movements via `aria-live="polite"`.
- [ ] Responsive design switches to segmented column tabs or stacked views on viewports under 768px.
- [ ] Touch target sizes on drag handles, action triggers, and mobile tabs meet or exceed 24x24px (44x44px on mobile).
