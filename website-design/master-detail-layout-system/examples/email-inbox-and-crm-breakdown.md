# Master-Detail Layout System Example: Customer Support Helpdesk Workspace

This example demonstrates the **Master-Detail Layout System** applied to an enterprise B2B SaaS Customer Support Helpdesk workspace. It details how the dual-pane layout, independent scroll regions, active selection cues, and mobile back-stack transitions function across viewports to streamline high-density ticket triaging.

---

## 1. Visual Composition & Spatial Blueprint

### Desktop Layout (Dual-Pane Split View: 1440px Viewport)

```text
+-----------------------------------------------------------------------------------------------------------------------------------------+
| GLOBAL TOP HEADER (App Shell Navigation, Search Bar, User Profile Avatar)                                                               |
+-----------------------------------------------------------------------------------------------------------------------------------------+
| MASTER PANE (List Column: 360px Fixed Width)         | DETAIL PANE (Workspace Column: Flex 1 Fluid Width)                              |
|                                                      |                                                                                 |
| +--------------------------------------------------+ | +-----------------------------------------------------------------------------+ |
| | Search & Filter Bar                              | | | STICKY DETAIL ACTION BAR                                                    | |
| | [ Search tickets...         ] [ Filter v ] [ + ] | | | [← Back] Ticket #TK-8492: Payment Gateway 500 Error  [ Assign v ] [ Close ] | |
| +--------------------------------------------------+ | +-----------------------------------------------------------------------------+ |
| | UNREAD / ACTIVE LIST CONTAINER (overflow-y: auto)| | | TICKET DETAIL WORKSPACE CONTAINER (overflow-y: auto)                      | |
| |                                                  | | |                                                                             | |
| | +----------------------------------------------+ | | | TICKET HEADER                                                               | |
| | | || TK-8492  * UNREAD       10:42 AM          | | | | H1: Payment Gateway Returning 500 Errors During Checkout Checkout          | |
| | | || Acquired Inc. (Priority: High)            | | | | Reporter: Sarah Connor (Acquired Inc) | Status: Open | Priority: High       | |
| | | || Payment Gateway Returning 500 Errors...   | | | +-----------------------------------------------------------------------------+ |
| | | || "Customers reporting checkout failures..."| | | | TABBED WORKSPACE PANELS                                                     | |
| | | +----------------------------------------------+ | | | [ Conversation (3) ] [ Customer Context ] [ Audit Logs ] [ Escalation ]     | |
| | | (Selected Item: active background + left strip) | | +-----------------------------------------------------------------------------+ |
| |                                                  | | | MESSAGING & ACTIVITY THREAD                                                 | |
| | +----------------------------------------------+ | | |                                                                             | |
| | |    TK-8490                 09:15 AM          | | | | [ Avatar ] Sarah Connor (Customer) - 10:42 AM                           | |
| | |    Global Tech Solutions (Priority: Medium)  | | | | "Our checkout API calls are failing with 500 internal server error..."  | |
| | |    SAML SSO Configuration Query              | | | |                                                                             | |
| | |    "Where can we input the metadata XML..."  | | | | [ Avatar ] Alex Rivera (Support Lead) - 10:50 AM                          | |
| | +----------------------------------------------+ | | | "Investigating payment provider gateway logs now..."                      | |
| |                                                  | | |                                                                             | |
| | +----------------------------------------------+ | | +-----------------------------------------------------------------------------+ |
| | |    TK-8488                 Yesterday         | | | REPLY EDITOR DOCK                                                           | |
| | |    Apex Financial (Priority: Low)            | | | | [ Rich Text Editor Area...                                            ] | |
| | |    Invoice Export Formatting Issue           | | | | [ Send Reply ] [ Internal Note ]                                          | |
| | +----------------------------------------------+ | | +-----------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Component Anatomy Breakdown

### A. Master Pane List Item (`role="option"` / `role="listitem"`)
Every list item in the master pane is structured for rapid visual scanning:

```text
+------------------------------------------------------------------+
| [3px Strip]  TK-8492      [ Pill: High ]             10:42 AM    |
|              Acquired Inc. (Customer Account)                    |
|              Payment Gateway Returning 500 Errors...             |
|              "Customers reporting checkout failures..."          |
|              [ Tag: Payments ] [ Tag: API ]      [ Avatar ]      |
+------------------------------------------------------------------+
```

- **Visual Selection Indicator:** The selected card features `background: var(--surface-active-subtle)` (soft tint), a 3px left border strip in `var(--brand-primary)` (`#0284c7`), and `aria-selected="true"`.
- **Primary Line:** Ticket ID (`TK-8492`) and high-contrast priority badge (`High` in amber/red).
- **Secondary Line:** Organization/Author name (`Acquired Inc.`).
- **Subject Line:** Bold 1-line subject title with truncation (`text-overflow: ellipsis`).
- **Preview Snippet:** 2-line clamped summary of the latest message snippet.
- **Footer Meta:** Categorization tags and assigned agent thumbnail.

### B. Detail Workspace Action Header
The sticky header inside the detail pane controls high-frequency ticket management:

```text
+---------------------------------------------------------------------------------------------------+
| [← Back (Mobile Only)]  Ticket #TK-8492  [ Badge: Open ]   |   [ Assign Agent v ] [ Close Ticket ] |
+---------------------------------------------------------------------------------------------------+
```

- **Mobile Back Button:** Visually hidden on desktop (`display: none`), visible on viewports `< 768px`.
- **Record Breadcrumb & Status:** Direct reference ID and live status indicator (`Open`, `Pending`, `Resolved`).
- **Contextual Action Group:** Primary buttons (`Assign`, `Close Ticket`) and secondary dropdown trigger (`...`).

---

## 3. Responsive Adaptation Matrix

### Split View (Desktop / Laptop: $\ge 768\text{px}$)
- Master Pane and Detail Pane are rendered side-by-side in a 2-column CSS Grid (`grid-template-columns: 360px 1fr`).
- Master Pane maintains a fixed 360px scanning width.
- Detail Pane scales dynamically to fill all available horizontal space.
- Selecting an item in the master pane immediately updates the adjacent detail workspace without page reloads or viewport shifts.

### Single-Pane Back-Stack View (Mobile: $< 768\text{px}$)
- The layout transforms into a single-pane back-stack view where only one pane is visible at a time (`width: 100%`).
- **State 1 (Master List View):**
  - Master Pane is visible (`width: 100%`).
  - Detail Pane is visually hidden (`display: none` or offscreen).
  - Tapping a ticket card navigates to State 2 and sets focus to the Detail view header.
- **State 2 (Detail Ticket View):**
  - Detail Pane is visible (`width: 100%`).
  - Master Pane is hidden.
  - Detail Sticky Action Bar displays the prominent `← Back` button in the top-left corner.
  - Tapping `← Back` returns the user to State 1 and restores keyboard focus to the previously selected ticket card in the master list.

---

## 4. Accessibility Specs (WCAG 2.1 AA)

| Requirement | Implementation Pattern |
| :--- | :--- |
| **Landmark Regions** | Master container has `role="region" aria-label="Ticket List"`. Detail container has `role="region" aria-label="Ticket Workspace"`. |
| **Selection State** | Master list wrapper uses `role="listbox" aria-label="Tickets"`. Master cards use `role="option" aria-selected="true|false"`. |
| **Keyboard Navigation** | `Up` / `Down` Arrow keys move focus between ticket items in the master list. Pressing `Enter` or `Tab` shifts focus directly to the Detail pane action bar. |
| **Screen Reader Announcement** | Selecting a new master ticket updates an `aria-live="polite"` status element: *"Loaded ticket TK-8492: Payment Gateway Returning 500 Errors"*. |
| **Focus Restoration** | When returning from Detail view to Master list view on mobile, focus is restored to the exact ticket button that was previously active. |
| **Touch Targets** | All master card item rows and detail header buttons provide minimum touch target areas of **44x44px** on mobile touchscreens. |
