# Real-World Kanban Board Layout Breakdown

This breakdown illustrates a production-grade Software Engineering Sprint Board designed with the **Kanban Board UI System**.

---

## 1. Spatial Structure & Container Layout

The interface is embedded within a viewport-locked application shell (`dashboard-layout-system`). The main board canvas occupies `100dvh` minus top navigation, ensuring independent column scrolling and horizontal overflow.

```text
+---------------------------------------------------------------------------------------------------+
| GLOBAL APPLICATION TOPBAR (Navigation, Workspace Title, Filter Controls, Search)                   |
+---------------------------------------------------------------------------------------------------+
| BOARD HEADER (Sprint 42 | Filters: [My Tasks v] [Priority v] | View: [Kanban v] | [ + Add Task ] )    |
+---------------------------------------------------------------------------------------------------+
| HORIZONTAL SCROLL CANVAS (flex-direction: row, overflow-x: auto, overflow-y: hidden)              |
|                                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
|  | BACKLOG (8)        |  | IN PROGRESS (3/4)  |  | CODE REVIEW (5/4)! |  | DONE (12)          |   |
|  | [ + Quick Add ]    |  | [ + Quick Add ]    |  | [ WIP EXCEEDED ]   |  | [ + Quick Add ]    |   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
|  | SCROLLABLE COLUMN  |  | SCROLLABLE COLUMN  |  | SCROLLABLE COLUMN  |  | SCROLLABLE COLUMN  |   |
|  | (overflow-y: auto) |  | (overflow-y: auto) |  | (overflow-y: auto) |  | (overflow-y: auto) |   |
|  |                    |  |                    |  |                    |  |                    |   |
|  | +----------------+ |  | +----------------+ |  | +----------------+ |  | +----------------+ |   |
|  | | CARD PROJ-1048 | |  | | CARD PROJ-1042 | |  | | CARD PROJ-1035 | |  | | CARD PROJ-1012 | |   |
|  | | [High] [Design]| |  | | [Urgent][API]  | |  | | [Medium][FE]   | |  | | [Low] [Docs]   | |   |
|  | | Add Dark Theme | |  | | Auth Timeout   | |  | | Nav Drawer Refactor| | Fix Typo in Readme|   |
|  | | 2/4 Subtasks   | |  | | 3/3 Subtasks   | |  | | 1/2 Subtasks   | |  | | Complete ✓    |   |
|  | | [Due Oct 28]   | |  | | [OVERDUE Oct20]| |  | | [Due Oct 25]   | |  | | [Completed]    |   |
|  | | (Avatar)       | |  | | (Avatar Stack) | |  | | (Avatar)       | |  | | (Avatar)       | |   |
|  | +----------------+ |  | +----------------+ |  | +----------------+ |  | +----------------+ |   |
|  |                    |  |                    |  |                    |  |                    |   |
|  | +----------------+ |  | +----------------+ |  | +----------------+ |  | +----------------+ |   |
|  | | CARD PROJ-1051 | |  | | CARD PROJ-1045 | |  | | CARD PROJ-1038 | |  | | CARD PROJ-1018 | |   |
|  | +----------------+ |  | +----------------+ |  | +----------------+ |  | +----------------+ |   |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Column Header Anatomy & WIP Limit Signaling

Each column header is locked to the top of its column flex stack and provides real-time WIP feedback.

### Column 2: "IN PROGRESS" (Normal State)
- **Status Accent:** Blue 10x10px rounded status indicator (`#0284C7`).
- **Title:** `IN PROGRESS` (`font-weight: 600; font-size: 0.875rem`).
- **WIP Limit Badge:** `3/4` rendered in neutral badge (`background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0`).
- **Action Menu Trigger:** 32x32px menu icon button (`aria-label="Column settings for In Progress"`).

### Column 3: "CODE REVIEW" (WIP Limit Exceeded State)
- **Status Accent:** Purple 10x10px status indicator (`#9333EA`).
- **Title:** `CODE REVIEW` (`font-weight: 600; font-size: 0.875rem`).
- **WIP Limit Badge:** `5/4` rendered in high-visibility danger alert badge (`background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5`).
- **Header Highlight:** Column shell highlights top border in red (`border-top: 3px solid #DC2626`).
- **Accessible Tooltip / Warning Icon:** Alert icon with tooltip: *"Work-in-Progress limit exceeded (5 cards / max 4). Resolve or reassign code reviews before adding new tasks."*

---

## 3. Card Micro-Layout & Scannability Hierarchy

Task cards use a structured 3-row layout designed for rapid visual parsing:

```text
+-------------------------------------------------------------+
| [HIGH PRIORITY]  PROJ-1042           [:: Drag Handle] [ ... ]|  <- Top Meta Row
|-------------------------------------------------------------|
| Fix Authentication Token Expiration Timeout on Mobile Safari|  <- Title Row (Bold)
| User sessions prematurely terminate when app is backgrounded|  <- Summary Row (Muted)
|-------------------------------------------------------------|
| [✓ 3/3 Subtasks]   [⚠️ Overdue: Oct 20]     (Avatar Stack)  |  <- Bottom Meta Row
+-------------------------------------------------------------+
```

1. **Top Row (Pills & Drag Handle):**
   - High-contrast priority tag: `HIGH PRIORITY` (`background: #FEF3C7; color: #92400E; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px`).
   - Task Key: `PROJ-1042` (`font-family: monospace; color: #64748B; font-size: 0.75rem`).
   - Drag Handle Button: 24x24px grip button with `aria-label="Reorder or move card PROJ-1042"`.
2. **Middle Region (Content):**
   - Title: `font-size: 0.875rem; font-weight: 600; color: #0F172A; line-height: 1.3`.
   - Summary: `font-size: 0.8125rem; color: #64748B; line-clamp: 2`.
3. **Bottom Meta Row (Status & Assignees):**
   - Subtasks: Badge showing checklist status (`3/3 ✓` with green fill).
   - Due Date: Highlighted in red badge for overdue (`⚠️ Oct 20` with `background: #FEE2E2; color: #991B1B`).
   - Assignee Avatars: Stacked 28x28px avatar bubbles (`user-avatar-system`) with 2px white borders and accessible `alt="Assigned to Alex Morgan"`.

---

## 4. Interaction States

| Interaction State | Visual & CSS Styling | ARIA & Focus Behavior |
| :--- | :--- | :--- |
| **Default** | `background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);` | `role="listitem"`, `tabindex="0"` |
| **Hover** | `border-color: #94A3B8; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transform: translateY(-1px);` | Hover cursor: `grab` |
| **Focus Visible** | `outline: 2px solid #2563EB; outline-offset: 2px;` | Keyboard focus ring meeting 3:1 contrast |
| **Grabbed (Keyboard Move Mode)** | `outline: 3px solid #2563EB; background: #EFF6FF; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.2);` | `aria-grabbed="true"`, `aria-live` announces: *"Card PROJ-1042 grabbed in In Progress."* |
| **Pointer Dragging** | `opacity: 0.6; transform: scale(1.03) rotate(1.5deg); cursor: grabbing; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);` | Placeholder slot (`.kanban-drop-placeholder`) renders in target list |

---

## 5. Responsive Mobile Pivot (<768px)

On mobile viewports, the multi-column canvas transitions into a **Segmented Tab View**:

```text
+---------------------------------------------------+
| MOBILE TOPBAR (Sprint 42 Kanban)                  |
+---------------------------------------------------+
| SEGMENTED STATUS TABS (Horizontal Scrollable)     |
| [ To Do (8) ] [ IN PROGRESS (3) * ] [ Review (5) ]|  <- Active Tab
+---------------------------------------------------+
| SINGLE ACTIVE COLUMN VIEW (100% Viewport Width)   |
| Column: IN PROGRESS (3 cards)                     |
|                                                   |
| +-----------------------------------------------+ |
| | CARD PROJ-1042                                | |
| | [HIGH] Auth Timeout                           | |
| | [ Move To... v ] <- Action Sheet Trigger      | |
| +-----------------------------------------------+ |
|                                                   |
| +-----------------------------------------------+ |
| | CARD PROJ-1045                                | |
| | [MED] Nav Drawer Refactor                     | |
| | [ Move To... v ]                              | |
| +-----------------------------------------------+ |
+---------------------------------------------------+
```

- **Touch Interaction:** Replaces pointer dragging on mobile screens with a dedicated `[ Move To... ]` button on each card. Tapping opens a bottom action sheet listing target columns (`To Do`, `Code Review`, `Done`) for effortless single-tap stage relocation.
