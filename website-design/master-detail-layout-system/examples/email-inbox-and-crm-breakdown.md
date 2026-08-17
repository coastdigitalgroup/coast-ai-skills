# Master-Detail Layout System Breakdown: Email Inbox & CRM Deal Pipeline

This breakdown demonstrates the practical application of the **Master-Detail Layout System** across two realistic enterprise SaaS interface patterns: a high-density **Email & Customer Communication Inbox** and a **CRM Deal Account Manager**.

---

## Example 1: Customer Communication & Support Inbox

### Scenario
A customer support agent uses a web application to triage incoming tickets, respond to customer emails, and review customer metadata. The agent needs to scan subject lines quickly, read active threads, inspect user account profiles, and perform quick actions (e.g., Reply, Reassign, Mark Resolved) without leaving the current view.

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL HEADER / APP NAVIGATION SHELL (height: 56px)                                                    │
├──────────────────────────────────────┬─────────────────────────────────────────────────────────────────┤
│ MASTER PANE: TICKET INBOX (width: 360px)│ DETAIL PANE: ACTIVE TICKET THREAD & USER WORKSPACE (flex: 1)    │
│ (overflow-y: auto)                   │ (overflow-y: auto)                                              │
│                                      │                                                                 │
│ ┌──────────────────────────────────┐ │ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search tickets... [Ctrl+K]    │ │ │ [← Back] Ticket #TK-8492  [In Progress]  [Assign] [Resolve] │ │
│ │ [ Filter: Unassigned ▼ ]          │ │ ├─────────────────────────────────────────────────────────────┤ │
│ ├──────────────────────────────────┤ │ │ SUBJECT: Unable to reset password via OAuth login           │ │
│ │ ★ Sarah Connor • 2m ago          │ │ │ CUSTOMER: Sarah Connor (sarah@cyberdyne.io)                   │ │
│ │ OAuth Login Error                │ │ ├─────────────────────────────────────────────────────────────┤ │
│ │ "Unable to reset password..."    │ │ │ THREAD HISTORY                                              │ │
│ │ [Status: Urgent] [Bug]           │ │ │ ┌─────────────────────────────────────────┐                 │ │
│ ├──────────────────────────────────┤ │ │ │ Sarah Connor • 10:42 AM                   │                 │ │
│ │ ▶ Alex Mercer • 15m ago (ACTIVE) │ │ │ │ Hi team, when I click "Reset Password",  │                 │ │
│ │ Billing Invoice Discrepancy      │ │ │ │ I get a 403 Forbidden error...            │                 │ │
│ │ "My monthly invoice shows..."    │ │ │ └─────────────────────────────────────────┘                 │ │
│ │ [Status: Normal] [Billing]       │ │ │ ┌─────────────────────────────────────────┐                 │ │
│ ├──────────────────────────────────┤ │ │ │ Agent Response Field                      │                 │ │
│ │   Elena Rostova • 1h ago         │ │ │ │ [ Reply Textarea ]                        │                 │ │
│ │ API Key Quota Limit              │ │ │ │ [ Send Reply ]                            │                 │ │
│ │ "Can we upgrade our tier..."     │ │ │ └─────────────────────────────────────────┘                 │ │
│ │ [Status: Normal] [API]           │ │ └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┴─────────────────────────────────────────────────────────────────┘
```

---

### Key Spatial & Interaction Architecture Features

#### 1. Pane Proportion & Scroll Isolation
- **Fixed Parent Canvas:** The parent container is locked to `height: calc(100vh - 56px); display: flex; overflow: hidden;`.
- **Master Pane Sizing:** Formatted at `flex: 0 0 360px; border-right: 1px solid var(--border-subtle);`.
- **Detail Pane Expansion:** Formatted at `flex: 1; min-width: 0; background: var(--surface-background);`.
- **Scroll Isolation:**
  - `.master-pane-list` has `overflow-y: auto; height: 100%;`. Scrolling through 500 tickets in the inbox does NOT move the detail pane thread.
  - `.detail-pane-body` has `overflow-y: auto; height: 100%;`. Scrolling through a long email thread or viewing logs does NOT shift the ticket list.

#### 2. Selected State Visual Hierarchy
- **Active Record Highlight:** The selected ticket (Alex Mercer) displays:
  - `background: var(--surface-selected);` (subtle brand tinted background, e.g., `#f0f7ff`).
  - `border-left: 4px solid var(--brand-primary);` (high-contrast indigo accent bar on the left edge).
  - Semantically marked with `role="option" aria-selected="true"`.
- **Unselected Master Items:** Display transparent or standard background, `role="option" aria-selected="false"`.

#### 3. Responsive Mobile Adaptation (<768px Viewport)
On desktop (>768px), both panes are displayed side-by-side. On mobile screens:
- The container sets `data-mobile-view="master"` by default, rendering the ticket list full width (`100%`). The detail pane is translated off-screen (`transform: translateX(100%)`).
- Tapping Alex Mercer's ticket updates container attribute to `data-mobile-view="detail"`.
- CSS smoothly animates the detail pane into full view (`transform: translateX(0)`).
- The detail header displays a prominent `< Back to Tickets` button on mobile (`display: flex; gap: 6px; align-items: center;`).
- Tapping `< Back to Tickets` restores `data-mobile-view="master"` and returns keyboard focus to Alex Mercer's item in the list (`item.focus()`).

---

## Example 2: CRM Sales Pipeline & Deal Account Manager

### Scenario
A sales manager uses a CRM interface to review high-value corporate deals, view recent activity logs, update deal stage probabilities, and send client proposals.

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CRM BOARD / ACCOUNT SHELL                                                                              │
├──────────────────────────────────────┬─────────────────────────────────────────────────────────────────┤
│ MASTER PANE: DEALS LIST (320px)      │ DETAIL PANE: DEAL ACCOUNT WORKSPACE (flex: 1)                    │
│                                      │                                                                 │
│ ┌──────────────────────────────────┐ │ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Filter deals...               │ │ │ [← Back] ACME Corp Enterprise Renewal                       │ │
│ │ Total ARR: $1,420,000            │ │ │ Value: $450,000/yr • Stage: [ Negotiation ▼ ]              │ │
│ ├──────────────────────────────────┤ │ ├─────────────────────────────────────────────────────────────┤ │
│ │ ACME Corp Enterprise Renewal     │ │ │ TAB NAVIGATION: [ Summary ] [ Activity ] [ Contacts ]       │ │
│ │ $450,000/yr • Negotiation        │ │ ├─────────────────────────────────────────────────────────────┤ │
│ │ Updated 10m ago                  │ │ │ DEAL METRICS                                                │ │
│ ├──────────────────────────────────┤ │ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │ │
│ │ Stark Industries Expansion       │ │ │ │ Close Date   │ │ Probability  │ │ Decision   │           │ │
│ │ $280,000/yr • Proposal Sent      │ │ │ │ Oct 31, 2025 │ │ 85%          │ │ Board Approved│           │ │
│ ├──────────────────────────────────┤ │ │ └──────────────┘ └──────────────┘ └──────────────┘           │ │
│ │ Wayne Enterprises Renewal        │ │ │                                                             │ │
│ │ $150,000/yr • Closed Won         │ │ │ CONTACT PERSONA                                             │ │
│ └──────────────────────────────────┘ │ │ Bruce Wayne (CTO) - bwayne@wayne-ent.com                    │ │
└──────────────────────────────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## Accessibility & ARIA Implementation Matrix

| Element / Region | ARIA Role & Attributes | Keyboard Interaction | Focus Management |
| :--- | :--- | :--- | :--- |
| **Master List Container** | `role="listbox"` or `role="list"` | `Tab` into list context. | Roving tabindex or focus ring on selected item. |
| **Master Item** | `role="option" aria-selected="true/false"` | `Up` / `Down` Arrow keys cycle through deals; `Enter` or `Space` selects item. | Retains focus while active or shifts focus to detail pane. |
| **Detail Pane Region** | `role="region" aria-label="Deal Details"` | `Tab` moves focus to detail header actions. | Target for `aria-live="polite"` update announcements. |
| **Mobile Back Button** | `role="button" aria-label="Back to deal list"` | `Enter` / `Space` triggers back transition. | Programmatically shifts focus back to last active master item. |

---

## CSS Implementation Snippet for Master-Detail Shell

```css
/* Container Layout */
.master-detail-shell {
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
  overflow: hidden;
  background-color: var(--surface-bg, #f8fafc);
}

/* Master Pane */
.master-pane {
  flex: 0 0 360px;
  max-width: 420px;
  min-width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-subtle, #e2e8f0);
  background-color: var(--surface-card, #ffffff);
}

.master-pane-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Master List Item */
.master-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle, #f1f5f9);
  cursor: pointer;
  transition: background-color 0.15s ease;
  position: relative;
}

.master-item:hover {
  background-color: var(--surface-hover, #f8fafc);
}

.master-item[aria-selected="true"] {
  background-color: var(--surface-selected, #eff6ff);
  border-left: 4px solid var(--brand-primary, #2563eb);
}

/* Detail Pane */
.detail-pane {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-bg, #f8fafc);
}

.detail-pane-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Mobile Responsiveness (<768px) */
@media (max-width: 767px) {
  .master-detail-shell {
    position: relative;
  }

  .master-pane, .detail-pane {
    position: absolute;
    inset: 0;
    width: 100%;
    max-width: 100%;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .master-detail-shell[data-mobile-view="master"] .master-pane {
    transform: translateX(0);
    z-index: 2;
  }

  .master-detail-shell[data-mobile-view="master"] .detail-pane {
    transform: translateX(100%);
    z-index: 1;
  }

  .master-detail-shell[data-mobile-view="detail"] .master-pane {
    transform: translateX(-100%);
    z-index: 1;
  }

  .master-detail-shell[data-mobile-view="detail"] .detail-pane {
    transform: translateX(0);
    z-index: 2;
  }
}
```
