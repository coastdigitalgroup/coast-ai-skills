---
name: master-detail-layout-system
description:
  Design a systematic, highly accessible, and responsive master-detail (split-pane / list-detail) layout
  framework for navigating collections while maintaining deep record context, independent scroll regions,
  and mobile back-stack transitions.
---

# Master-Detail Layout System

## Purpose

The Master-Detail Layout System provides a standardized spatial, responsive, and interaction framework for split-view user interfaces (also known as list-detail or two-pane layouts). Master-detail layouts allow users to efficiently scan, search, and navigate a primary collection of records (master pane) while simultaneously inspecting, editing, or performing contextual actions on a selected item (detail pane) within the same viewport.

Designing an effective master-detail pattern requires balancing spatial layout proportions, scroll region isolation, smooth responsive transitions from desktop multi-pane views to mobile stacked views, keyboard focus routing, and ARIA accessibility roles for screen reader navigation in compliance with WCAG AA standards.

## Use Cases

- **Email & Messaging Applications:** Browsing an inbox list (master pane) while reading, replying to, or managing an active email thread or message conversation (detail pane).
- **Customer Relationship Management (CRM) & Sales Pipelines:** Filtering contacts or deals in a sidebar master list while viewing complete interaction histories, notes, and activity timelines in the main detail canvas.
- **Admin Dashboards & Resource Browsers:** Managing cloud infrastructure (e.g., servers, database instances, audit logs) where selecting a resource immediately exposes metadata, telemetry metrics, and configuration controls.
- **E-Commerce Order Management & Support Portals:** Reviewing customer support tickets, orders, or return requests with rapid item switching.
- **Content Management Systems (CMS):** Selecting pages, media assets, or document drafts from a navigational index while editing content in a primary workspace.

## When NOT to Use

- **Hierarchical Document Trees:** For deeply nested tree structures or multi-level file directories, use `tree-view-navigation-system`.
- **Horizontal Workflow Pipelines:** For status columns and card movement across stages (e.g., To Do, In Progress, Done), use `kanban-board-ui-system`.
- **Dense Data Grids & Batch Editing:** For high-density multi-column spreadsheets requiring inline cell editing, column sorting, and multi-row bulk select, use `data-table-ui-system`.
- **Top-Level SaaS Application Shells:** For the primary application header, sidebar navigation, and collapsible navigation panels, use `dashboard-layout-system` or `sidebar-navigation-system`.

## Inputs

1. **Record Collection Taxonomy:** Metadata required for master list items (e.g., primary title, status pill, timestamp, snippet preview, avatar/icon, active state trigger).
2. **Detail Content Complexity:** Types of content hosted in the detail pane (e.g., header actions, tabbed navigation sub-views, metadata forms, activity feeds, persistent sticky footer actions).
3. **Viewport & Container Shell Bounds:** Dimensions supplied by the parent application shell (from `dashboard-layout-system`).
4. **Design System Tokens:** Colors, typography scales, elevation layers, and spacing definitions (from `accessible-color-system`, `fluid-spacing-system`, and `elevation-and-depth-system`).

## Outputs

1. **Split-Pane Layout Architecture:** Responsive grid or flexbox layout specs defining pane ratios, boundary borders, minimum width constraints, and container height rules.
2. **Scroll Region Containment Specification:** CSS containment rules (`overflow-y: auto`, `height: 100%`) ensuring independent pane scrolling without global browser scrollbars.
3. **Mobile Viewport Back-Stack Strategy:** Stacked view transformation logic converting split panes into a full-screen list view and detail view with interactive back-button navigation (`< Back to List`) on screens <768px.
4. **Keyboard & Accessibility Blueprint:** Focus routing models, ARIA role mappings (`role="region"`, `role="listbox"` / `role="option"`, or `role="navigation"` / `role="main"`), and `aria-live` region updates for screen reader feedback.

---

## Workflow

### 1. Establish the Layout Canvas & Proportion Rules
Structure the layout within a fixed-height parent shell:
- **Container Heights:** Set the outer layout wrapper to fill available viewport height (`height: 100%` or `height: calc(100vh - var(--header-height)); overflow: hidden; display: flex;`).
- **Pane Proportions:**
  - *Standard Split (35% / 65%):* Master pane set to `width: 320px` to `400px` (or `flex: 0 0 35%`; `min-width: 300px; max-width: 450px`), detail pane set to `flex: 1` (`min-width: 0`).
  - *Compact List / Wide Detail (30% / 70%):* Ideal for complex detail views (e.g., CRM records, document editors).
  - *Equal Split (50% / 50%):* Used when master list items require higher card density or comparison workflows.
- **Divider & Boundary Styling:** Separate master and detail panes with a explicit 1px high-contrast subtle border (`border-right: 1px solid var(--border-subtle)`).

### 2. Implement Independent Scroll Isolation
Prevent page-level scrollbar jitter or layout shifting by isolating scroll contexts for both panes:
- **Master Pane Scroll Region:** Apply `overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch;` to the list wrapper.
- **Detail Pane Scroll Region:** Apply `overflow-y: auto; height: 100%;` to the detail canvas.
- **Fixed Pane Headers & Footers:** Position sticky search/filter toolbars at the top of the master pane (`position: sticky; top: 0; z-index: 10; background: var(--surface-background);`) and sticky action bars at the top/bottom of the detail pane.

### 3. Build the Master Pane List Item Anatomy
Design master list items for maximum scannability and visual feedback:
- **List Item Structure:** Render items using semantic markup (`role="list"` and `role="listitem"`, or a select listbox pattern).
- **Item Regions:**
  1. **Top Row:** Primary title / sender name (`font-weight: 600; font-size: 0.875rem`), timestamp / status tag on right.
  2. **Middle Row:** Subject line or primary attribute (`color: var(--text-primary); text-truncate`).
  3. **Bottom Row:** 1-2 line body snippet or secondary metadata chips (`color: var(--text-secondary); line-clamp: 2`).
- **Interactive Visual States:**
  - *Default:* Neutral background (`background: transparent`).
  - *Hover:* Light highlight background (`background: var(--surface-hover)`).
  - *Active / Selected State:* Distinct active surface background (`background: var(--surface-selected)`), high-contrast left border accent bar (`border-left: 4px solid var(--brand-primary)`), and semantically marked with `aria-selected="true"` or `aria-current="true"`.
  - *Unread / Unprocessed Indicator:* Bold typography with a colored dot indicator.

### 4. Build the Detail Pane Canvas Hierarchy
Structure the detail view to highlight item content and actionable tasks:
- **Detail Header Toolbar:** Position at top of detail pane (`display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--border-subtle)`). Contains title summary, category tag, primary action buttons (Edit, Delete, Reply, Share), and secondary dropdown menu.
- **Mobile Back Trigger:** Include a `<button class="back-to-list-btn">` in the detail header that is visually hidden on desktop viewports (`display: none` above 768px) and visible on mobile viewports.
- **Detail Content Workspace:** Scrollable main area hosting tabs (`tab-ui-system`), attribute grids (`property-and-attribute-system`), content summaries, and activity feeds (`timeline-activity-system`).
- **Empty / Unselected State:** When no item in the master list is selected, display an empty state placeholder (`empty-state-system`) in the detail pane featuring an illustrative icon, heading ("No item selected"), and helpful text ("Select a record from the list to view details").

### 5. Implement Mobile Viewport Stack & Navigation
On small screens (<768px), dual-pane layouts become constrained and unusable. Transform the split layout into a single-pane stacked view:
- **Stacked Container Model:** Use CSS media queries or CSS container queries (`container-type: inline-size`):
  ```css
  @media (max-width: 767px) {
    .master-detail-container {
      position: relative;
      overflow: hidden;
    }
    .master-pane, .detail-pane {
      width: 100%;
      position: absolute;
      inset: 0;
      transition: transform 0.25s ease-in-out;
    }
    .master-detail-container[data-mobile-view="master"] .master-pane {
      transform: translateX(0);
    }
    .master-detail-container[data-mobile-view="master"] .detail-pane {
      transform: translateX(100%);
    }
    .master-detail-container[data-mobile-view="detail"] .master-pane {
      transform: translateX(-100%);
    }
    .master-detail-container[data-mobile-view="detail"] .detail-pane {
      transform: translateX(0);
    }
  }
  ```
- **Mobile Back Button Behavior:** Tapping a record in the master list toggles `data-mobile-view="detail"` and shifts focus to the detail pane header. Tapping `< Back to List` in the detail header sets `data-mobile-view="master"` and returns focus to the previously selected list item in the master pane.

### 6. Keyboard & Screen Reader Accessibility Implementation
Ensure full keyboard navigation and screen reader clarity:
- **Keyboard Navigation Model:**
  - `Tab` / `Shift+Tab`: Move focus between interactive controls (search input, list items, action buttons).
  - `Up` / `Down` Arrow keys: When list items are modeled as a listbox or composite list, Arrow keys move selection sequentially through list items.
  - `Enter` / `Space`: Activate item selection and load detail pane content.
- **Focus Management on Selection Change:** When a user selects a master item via keyboard, optionally shift focus directly to the detail header (`id="detail-title"` with `tabindex="-1"`) or announce the load via an invisible `aria-live="polite"` region.
- **Screen Reader Announcements:** Render a live region update when selection changes: *"Loaded details for Order #1042, Status: Shipped"*.

---

## Decision Rules

### Layout Proportion Matrix

| Detail Complexity | Master Pane Ratio | Detail Pane Ratio | Best Use Case |
| :--- | :--- | :--- | :--- |
| **Compact Records** | 35% (`320px - 380px`) | 65% (`flex: 1`) | Email inboxes, notification feeds, simple contact lists. |
| **High-Density Master Cards** | 45% (`400px - 500px`) | 55% (`flex: 1`) | Order management with line items, code review PR lists. |
| **Rich Workspace Detail** | 25% (`280px - 320px`) | 75% (`flex: 1`) | Document CMS editing, complex CRM account views, analytics logs. |

### Mobile Breakpoint Adaptation Strategy
- **Width >= 768px:** Dual-pane split layout displayed side-by-side. Both master and detail panes visible simultaneously.
- **Width < 768px:** Single-pane view with stateful transition (`data-mobile-view="master"` vs `data-mobile-view="detail"`). Smooth slide-over transition recommended.

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 2.1.1 Keyboard Accessibility:** All list items and detail action controls must be reachable and operable using keyboard controls alone.
  - **SC 2.4.7 Focus Visible:** Focused list items and buttons must present an unclipped focus ring with a minimum 3:1 contrast ratio against the pane background.
  - **SC 4.1.2 Name, Role, Value:** Master list items must explicitly state their active/selected state using `aria-selected="true"` or `aria-current="true"`.
  - **SC 1.4.10 Reflow:** The layout must adapt gracefully without horizontal scrollbars or overlapped text down to 320px screen width.
- **Layout Containment & CLS:** Panes must enforce strict height containment (`height: 100%`) with `overflow-y: auto` to eliminate cumulative layout shift during item switching.

---

## Common Failure Patterns

- **Page-Level Scroll Jitter:** Failing to lock parent shell height, causing both the window scrollbar and inner pane scrollbars to appear simultaneously.
- **Mobile Split View Squeezing:** Attempting to preserve two side-by-side columns on mobile screens (<768px), squeezing the detail pane into an unreadable 150px column.
- **Lost Keyboard Focus on Mobile Transition:** Switching from detail view back to master view on mobile without re-focusing the previously active master item, forcing keyboard/screen-reader users to restart navigation from the top of the page.
- **Missing Selected State Cue:** Relying solely on subtle light gray background shading for active item selection without a bold border accent or `aria-selected` attribute, making selection invisible in high-contrast environments.
- **Unannounced Detail Updates:** Replacing detail pane content dynamically without screen reader feedback, leaving visually impaired users unaware that the detail view updated.

---

## Validation Criteria

- [ ] Master and detail panes exist side-by-side on desktop viewports (>=768px) with isolated independent scrollbars (`overflow-y: auto`).
- [ ] Active master item features high-contrast visual cues (accent border, background highlight) and proper ARIA selection attributes (`aria-selected="true"` or `aria-current="true"`).
- [ ] Detail pane displays a clear unselected empty state when no record is selected.
- [ ] On viewports <768px, layout automatically transforms into a single-pane view with smooth back-stack navigation (`< Back to List`).
- [ ] Mobile back button returns focus to the previously active master item in the list.
- [ ] Keyboard navigation (`Tab`, `Up`/`Down` Arrow keys, `Enter`/`Space`) allows full selection and interaction without pointer requirement.
- [ ] Detail content updates trigger `aria-live="polite"` status announcements for screen reader users.
