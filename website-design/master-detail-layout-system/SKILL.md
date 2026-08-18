---
name: master-detail-layout-system
description:
  Design and implement a systematic, highly accessible, and responsive master-detail
  (split-pane / list-detail) layout framework for navigating collections while maintaining
  deep record context, independent scroll regions, and mobile back-stack transitions.
---

# Master-Detail Layout System

## Purpose

The Master-Detail Layout System (also known as Split-Pane or List-Detail UI) provides a standardized visual layout and interaction framework for browsing a primary list of items (the "Master" pane) while displaying comprehensive attributes, contextual actions, and deeply nested history for the currently selected record in an adjacent, synchronized workspace (the "Detail" pane).

Master-detail patterns are foundational to high-efficiency web productivity applications, such as email clients, customer support helpdesks, CRM deal viewers, code review platforms, audit logs, and cloud resource consoles.

Designing an effective Master-Detail interface requires establishing precise spatial proportions, independent vertical containment (preventing global page scrolling), clear visual selection states, seamless multi-pane synchronization, and fluid mobile viewport transitions from side-by-side split view to single-pane back-stack navigation, all while strictly adhering to WCAG 2.1 AA accessibility guidelines for focus management and keyboard navigation.

## Use Cases

- **Help Desk & Customer Support Portals:** Browsing a list of open tickets in the master pane while reading full thread conversations, customer history, and internal notes in the detail pane.
- **Enterprise CRM & Sales Pipelines:** Scanning contacts or accounts in a master pane while inspecting deal stage history, upcoming activities, and contact details in the detail pane.
- **Webmail & Messaging Applications:** Reviewing an inbox feed in the left master column while reading, replying to, or archiving the active message in the right detail pane.
- **DevOps & Cloud Inspector Dashboards:** Filtering server instances, log streams, or deployment pipelines in the master pane while inspecting real-time metrics, error traces, and YAML configurations in the detail pane.
- **HR & Applicant Tracking Systems (ATS):** Navigating candidate applications while reviewing resumes, interviewer ratings, and scheduling tools side-by-side.

## When NOT to Use

- **Tabular Data Workspaces Requiring Multi-Row Comparisons:** If users need to compare dozens of records simultaneously across multiple structured attributes, use `data-table-ui-system`.
- **Workflow Pipeline Boards:** For status-column workflows where cards are moved horizontally across discrete pipeline stages, use `kanban-board-ui-system`.
- **Hierarchical Document Trees:** For deeply nested, tree-structured document navigation (e.g., file system directory trees), use `tree-view-navigation-system`.
- **Linear Step-by-Step Wizards:** For sequential multi-step forms where each view builds on the previous, use `step-progress-system` or `multi-step-form-implementation`.
- **Simple Standalone Landing Pages:** For marketing landing pages or simple linear article feeds where content flows vertically in a single column, use `article-layout-system` or `section-composition-system`.

## Inputs

1. **Information Architecture & Item Schema:** Attributes to render in the Master item card (e.g., Status Badge, Title/Subject, Primary Metadata, Timestamp) versus the Detail workspace (Full Record Body, Activity History, Related Records, Contextual Action Bars).
2. **Viewport Shell Context:** Layout bounds provided by the outer application shell (`dashboard-layout-system` or `sidebar-navigation-system`).
3. **Pane Width Proportion Preferences:** Column sizing requirements (e.g., Fixed Master Width `360px` + Fluid Detail `flex: 1`, or Percentage Split `35% / 65%`).
4. **Design Tokens:** Surface elevations, neutral borders, focus ring indicators, and typography scales (`accessible-color-system`, `elevation-and-depth-system`, `fluid-spacing-system`).

## Outputs

1. **Split-Pane Layout Specification:** CSS Grid / Flexbox spatial definitions for fixed vs. fluid pane proportions, independent vertical scroll containers (`overflow-y: auto`), and visual dividers.
2. **Master Item Selection & Active State Blueprint:** Visual specifications for unread, hovered, focused, selected (`aria-selected="true"`), and multi-select checkbox states within the list.
3. **Detail Workspace Hierarchy & Header Anatomy:** Spatial layout for the detail view action bar (sticky header, back button, status controls, primary/secondary action triggers) and content tabs/sections.
4. **Responsive Viewport Adaptation Model:** Step-by-step layout transition rules switching from dual-pane split view on desktop/laptop to single-pane back-stack navigation with animated panel slides on tablet/mobile screens.
5. **Accessible Keyboard & ARIA Interaction Model:** Focus trapping, roving `tabindex` or APG Listbox focus routing, ARIA landmarks (`role="region"`, `aria-controls`), and screen reader status notifications via `aria-live="polite"`.

---

## Workflow

### 1. Establish the Dual-Pane Canvas Container
Construct the outer master-detail wrapper within the application shell (`dashboard-layout-system`):
- **Container Viewport Locking:** Set the outer wrapper to `display: flex; height: 100vh; max-height: 100vh; overflow: hidden;` (or fit inside the parent dashboard content area) to lock the overall layout height and eliminate browser-level window scrolling.
- **Split Ratio Column Grid:** Define the split-pane proportion using CSS Grid or Flexbox:
  - *Fixed Master Pattern (Recommended for Inboxes/CRMs):* `grid-template-columns: minmax(300px, 380px) 1fr;` (Master pane stays at a comfortable scanning width between 300px and 380px; Detail pane consumes all remaining horizontal space).
  - *Proportional Split Pattern:* `grid-template-columns: 35% 65%;` or `40% 60%` for dense inspection tools.
- **Visual Pane Separator:** Insert a 1px solid border (`border-right: 1px solid var(--border-subtle)`) or an accessible resizable split bar (`accessible-split-pane-implementation`) between the panes.

### 2. Design the Master List Pane Structure
The Master pane serves as the fast-scanning index for the record collection:
- **Sticky Header Region:** Position a fixed search and filter control bar at the top of the Master pane (`flex-shrink: 0; padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); background: var(--surface-card)`). Include a quick search field (`search-interface-system`), filter chips, and bulk action triggers.
- **Independent Scrollable Item List:** Wrap the list items in a container with `flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch;` (`role="list"` or `role="listbox"`).
- **Master Item Card Anatomy:**
  1. **Top Row:** Primary Identifier / Author (`font-weight: 600; font-size: 0.875rem; color: var(--text-primary)`), Status Pill/Badge, and Timestamp (`font-size: 0.75rem; color: var(--text-muted)`).
  2. **Middle Row:** Item Subject or Title (`font-weight: 500; font-size: 0.875rem; color: var(--text-primary); text-truncate: 1 line`).
  3. **Bottom Row:** Snippet or Preview Text (`font-size: 0.8125rem; color: var(--text-secondary); line-clamp: 2`), Tags/Category, and Assignee Avatar (`user-avatar-system`).
- **State Styling Rules:**
  - *Unread / Unprocessed State:* Bold title text with a subtle visual cue (e.g., 8x8px primary accent dot on the left).
  - *Hover State:* Background highlight (`background: var(--surface-hover); cursor: pointer`).
  - *Active / Selected State:* Distinct active surface background (`background: var(--surface-active-subtle)`), a 3px solid primary accent indicator strip on the left border (`border-left: 3px solid var(--brand-primary)`), and `aria-selected="true"`.
  - *Focus Visible State:* Highly visible focus outline (`outline: 2px solid var(--focus-ring); outline-offset: -2px`).

### 3. Build the Detail Workspace Pane Structure
The Detail pane renders the active record's full context and workspace:
- **Empty State Display:** When no record is selected in the master pane, display an accessible empty state (`empty-state-system`) in the detail pane with a subtle icon, clear headline ("No record selected"), and helpful hint ("Select an item from the list to view details").
- **Sticky Detail Action Bar:** Render a persistent top header bar inside the detail pane (`position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-bottom: 1px solid var(--border-subtle); background: var(--surface-card)`):
  - *Mobile Back Trigger:* Include a hidden-on-desktop "Back to List" button (`<button class="mobile-back-btn">← Back</button>`).
  - *Record Identification:* Record ID / Title summary (`font-weight: 600; font-size: 1rem`).
  - *Action Controls:* Primary action buttons (e.g., "Reply", "Edit", "Assign", "Delete") styled using `button-and-action-system`.
- **Independent Content Scroll Region:** Wrap the main detail content body in a scroll container (`flex: 1; overflow-y: auto; padding: 24px`).
- **Detail Content Layout:**
  - *Header Section:* H1 Record Title, Status Badge, Metadata Grid (Created Date, Author, Priority, Assignee).
  - *Primary Body Area:* Full description, HTML thread message, or configuration code block.
  - *Tabbed Sub-Sections:* Use tabs (`tab-ui-system`) for separating "Activity History", "Attachments", "Audit Logs", and "Related Records".

### 4. Implement Mobile & Tablet Responsive Back-Stack Navigation
On screens narrower than `768px` (or `1024px` for dense apps), displaying side-by-side panes results in unreadable, squeezed text and cramped buttons. Transform the layout into a single-pane back-stack model:
- **Mobile Single-Pane View:** Render only one pane at a time in full viewport width (`width: 100%`).
- **Navigation State Machine:**
  - *State A (Master Active):* The Master list pane occupies 100% width. The Detail pane is visually hidden (`display: none` or translated offscreen with `transform: translateX(100%)`).
  - *State B (Detail Active):* When the user taps a master item, switch viewports. The Detail pane takes 100% width, and the Master pane is hidden.
- **Mobile Back Button:** In State B, the Detail pane displays a prominent top-left "Back to List" button. Tapping it resets the state machine back to State A and returns keyboard focus to the previously selected master list item.
- **Viewport Animation:** Use smooth sliding view transitions (`view-transitions-implementation` or horizontal CSS transforms `transform 0.25s ease-in-out`) to reinforce directional wayfinding (slide left into detail, slide right back to master list).

### 5. Ensure Accessible Focus & Screen Reader Interaction
- **ARIA Landmark & Region Roles:** Assign `role="region" aria-label="Item List"` to the Master pane container and `role="region" aria-label="Item Detail Workspace"` to the Detail pane container.
- **Listbox / Selection Markup:** If the master list behaves as a single-selection widget, apply `role="listbox" aria-label="..."` to the list and `role="option" aria-selected="true|false"` to list items. Alternatively, use standard `<nav>` with `aria-current="page"` or `aria-current="true"`.
- **Focus Management on Record Selection:** When a user selects a master item using a keyboard or pointer:
  - Keep keyboard focus inside the master list if the user is rapidly scanning with Arrow keys (`Up` / `Down`).
  - Update the Detail pane DOM asynchronously and announce record loading via an `aria-live="polite"` status region: *"Loaded ticket #1042: Payment processing error"*.
  - When the user presses `Enter` or `Tab` from a selected list item, seamlessly move focus to the Detail pane's primary action or header H1 (`tabindex="-1"`).
- **Mobile Viewport Focus Trap & Restoration:** When switching to Detail view on mobile, automatically move focus to the Mobile Back Button or Detail Header. When returning to Master view, restore focus to the master item that was previously active.

---

## Decision Rules

### Pane Layout & Split Strategy

| Viewport Width | Recommended Layout Pattern | Master Pane Width | Detail Pane Width |
| :--- | :--- | :--- | :--- |
| **Wide Desktop (>1280px)** | **Dual-Pane Split View (or 3-Pane with Sidebar)** | Fixed `360px` - `400px` | Fluid `flex: 1` (`min-width: 600px`) |
| **Standard Desktop (1024px - 1279px)** | **Dual-Pane Split View** | Fixed `320px` - `350px` | Fluid `flex: 1` (`min-width: 480px`) |
| **Tablet (768px - 1023px)** | **Narrow Dual-Pane OR Single-Pane Stack** | Fixed `280px` - `300px` (or Collapsible) | Fluid `flex: 1` |
| **Mobile (<768px)** | **Single-Pane Back-Stack View** | `100%` (State A) | `100%` (State B) |

### Master List Selection vs Focus Model
- **Auto-Select on Focus (Rapid Scanning):** Pressing `Up` or `Down` arrow keys immediately changes the active selection and updates the Detail pane in real time. Recommended for email reading, log auditing, and high-volume ticket screening.
- **Explicit Select on Action (Press Enter / Click):** Navigating through master items with arrow keys moves a visual focus ring without updating the Detail pane. The Detail pane updates only when the user explicitly presses `Enter`, `Space`, or clicks. Recommended when loading detail records involves heavy network API requests or form state edits.

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 2.1.1 Keyboard:** Users must be able to scroll master items, select records, navigate into the detail workspace, trigger actions, and return to the master list using keyboard controls alone.
  - **SC 2.4.7 Focus Visible:** Active and focused master items must feature an unclipped focus ring meeting a minimum 3:1 contrast ratio against the background.
  - **SC 4.1.2 Name, Role, Value:** Master items must explicitly communicate their active/selected state to assistive technology via `aria-selected="true"` or `aria-current="true"`.
  - **SC 2.5.8 Target Size:** Tap targets on master list items and detail action buttons must provide a minimum target area of **24x24px** (44x44px preferred on mobile touch displays).
- **Layout Containment & CLS:** The master and detail panes must both specify `overflow-y: auto` with locked container height (`100%` / `100vh`) to prevent whole-page layout shifts or double scrollbars.
- **State Synchronization:** Master item list state (read/unread status, assigned tags, star/flag status) must immediately mirror edits made inside the Detail pane workspace without requiring page reloads.

---

## Common Failure Patterns

- **The Double Scrollbar Trap:** Failing to lock the height of the outer master-detail container, causing both the individual pane content and the browser page window to scroll vertically.
- **Cramped Mobile Split View:** Attempting to compress side-by-side master and detail panes onto a 375px mobile screen, forcing master list titles and detail text into unreadable 2-word vertical columns.
- **Unannounced Detail Updates:** Asynchronously replacing detail pane content when a master item is clicked without notifying screen reader users via `aria-live` or focus updates, leaving visually impaired users unaware that the view changed.
- **Lost Focus Position on Mobile Back:** Switching to the detail view on mobile and then returning to the master list without restoring focus to the previously active master item, resetting focus back to the top of the page.
- **Missing Selection Cues:** Relying solely on subtle color changes (e.g., light gray vs slightly lighter gray) to indicate the active master item, violating WCAG AA color contrast guidelines.

---

## Validation Criteria

- [ ] Outer container is viewport-locked (`height: 100vh` / `height: 100%`) with independent vertical scrollbars on master and detail panes.
- [ ] Master item cards feature high-contrast selection indicators (`aria-selected="true"`, active background, accent border strip).
- [ ] Detail pane displays a clear sticky action bar and an accessible empty state when no master record is selected.
- [ ] Responsive design transitions seamlessly from dual-pane split view on desktop to single-pane back-stack view on mobile (<768px).
- [ ] Mobile view includes a functional "Back to List" button that returns users to the master list and restores focus accurately.
- [ ] Keyboard navigation allows smooth scrolling and selection in the master list (`Up`/`Down` arrows) and focus routing into the detail pane (`Tab` / `Enter`).
- [ ] Detail pane loading and state updates are announced via an `aria-live="polite"` status region for assistive technologies.
- [ ] Touch target sizes for master list items and detail action buttons meet or exceed 24x24px (44x44px on mobile).
