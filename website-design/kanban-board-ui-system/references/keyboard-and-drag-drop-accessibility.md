# Keyboard & Drag-and-Drop Accessibility Guidelines

This reference guide details WCAG 2.1 AA compliant interaction specifications for Kanban board components, establishing standards for screen reader semantics, keyboard movement shortcuts, live region announcements, and touch device interactions.

---

## 1. WAI-ARIA Landmark & Role Mappings

To enable efficient assistive technology navigation, a Kanban board must be structured into logical regions using HTML5 landmarks and WAI-ARIA roles:

| Component / Layer | HTML5 / ARIA Markup | Required ARIA Attributes | Purpose & Screen Reader Behavior |
| :--- | :--- | :--- | :--- |
| **Main Board Workspace** | `<main>` / `role="region"` | `aria-label="Project Task Board"` | Defines top-level landmark for board navigation. |
| **Column Container** | `<section>` / `role="region"` | `aria-labelledby="[header-id]"` | Groups cards into named status stages (e.g., "In Progress"). |
| **Card List Container** | `<ul>` / `role="list"` | `aria-labelledby="[header-id]"` | Identifies the column list as a structured collection of items. |
| **Task Card Item** | `<li>` / `role="listitem"` | `tabindex="0"`, `aria-grabbed="true/false"` | Represents an individual task card focusable via keyboard. |
| **Drag Handle Button** | `<button>` | `aria-label="Reorder card [Key]"`, `aria-pressed="true/false"` | Dedicated keyboard activation trigger for entering "Move Mode". |
| **Live Announcer** | `<div>` | `id="kanban-announcer"`, `aria-live="polite"`, `aria-atomic="true"`, `class="sr-only"` | Hidden region used to announce card grab, movement, drop, and cancellation events. |

---

## 2. Keyboard Navigation & "Move Mode" Model

Standard drag-and-drop actions rely heavily on pointer devices. To satisfy **WCAG SC 2.1.1 (Keyboard)**, the Kanban UI System specifies an explicit 2-step keyboard reordering workflow.

```text
[ Task Card Focused ]
        │
        ├─► [ Space / Enter ] ──► Enter "Move Mode"
        │                            │
        │                            ├──► [ Up / Down Arrow ]   ──► Move Card Within Current Column
        │                            ├──► [ Left / Right Arrow ] ──► Move Card To Adjacent Column
        │                            │
        │                            ├──► [ Space / Enter ]     ──► Confirm & Drop Card
        │                            └──► [ Escape ]            ──► Cancel & Restore Original Position
```

### Keyboard Interaction Specs

1. **Card Focus Navigation:**
   - `Tab`: Navigates sequentially through task cards, column menu triggers, and interactive elements across columns.
   - `Shift + Tab`: Navigates backward.
2. **Activating "Move Mode":**
   - Pressing `Space` or `Enter` on a focused task card or its drag handle button initiates Move Mode.
   - **DOM State Update:** Set `aria-grabbed="true"` on the card. Add visual halo (`outline: 3px solid #2563eb`).
   - **Live Announcement:** Screen reader announces:
     > *"Card PROJ-1042 grabbed. Currently in column 'In Progress', position 2 of 4. Use Arrow keys to move, Space to drop, Escape to cancel."*
3. **Reordering & Moving Card:**
   - `Up Arrow` / `Down Arrow`: Swaps position of the grabbed card with the adjacent card above or below in the same column list.
   - `Left Arrow` / `Right Arrow`: Moves card to the adjacent left or right column, placing it at the bottom of the target column list.
   - **Live Announcement per Move:**
     > *"Card PROJ-1042 moved to column 'Code Review', position 1 of 3."*
4. **Dropping / Confirming Move:**
   - Pressing `Space` or `Enter` drops the card into its current position.
   - **DOM State Update:** Set `aria-grabbed="false"`. Remove grab styling. Keep keyboard focus on the dropped card.
   - **Live Announcement:**
     > *"Card PROJ-1042 dropped into column 'Code Review', position 1 of 3."*
5. **Canceling Move:**
   - Pressing `Escape` cancels the operation and returns the card to its original column and index.
   - **Live Announcement:**
     > *"Move canceled. Card returned to 'In Progress', position 2 of 4."*

---

## 3. Screen Reader Announcement Protocols

All dynamic board updates must trigger clear, concise screen-reader announcements via a polite `aria-live` region (`#kanban-announcer`):

- **Grab Event:** `"Task [Title/ID] grabbed in stage [Column Name], position [X] of [Total]."`
- **Intra-Column Move:** `"Moved up/down to position [X] of [Total] in [Column Name]."`
- **Inter-Column Move:** `"Moved to stage [Target Column Name], position [X] of [Total]."`
- **WIP Threshold Warning:** `"Warning: [Target Column Name] has reached its Work-in-Progress limit of [Limit] cards."`
- **Drop Event:** `"Task [Title/ID] successfully moved to [Target Column Name]."`
- **Cancel Event:** `"Movement canceled. Task returned to [Original Column Name]."`

---

## 4. Mobile Touch & Pointer Interaction Standards

On touch devices (iOS Safari, Android Chrome), pointer drag-and-drop often conflicts with native page scrolling gestures:

1. **Touch Target Size (WCAG SC 2.5.8):**
   - Drag handles, column menu triggers (`...`), and mobile tab buttons must meet a minimum footprint of **24x24px**, with **44x44px** preferred on mobile screens.
2. **Touch-Action CSS:**
   - Apply `touch-action: pan-y;` on column containers to allow smooth vertical scrolling without accidental card drag triggering.
3. **Mobile Modal "Move To..." Alternative:**
   - On viewports `<768px`, replace drag-and-drop gestures with a single-tap menu button on each card (`[ Move To... v ]`).
   - Tapping opens an accessible bottom sheet (`accessible-bottom-sheet-implementation`) displaying available workflow stages. Selecting a stage immediately moves the card, announces the change, and closes the sheet.
