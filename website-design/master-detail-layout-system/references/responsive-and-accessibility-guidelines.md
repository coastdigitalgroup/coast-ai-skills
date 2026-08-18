# Responsive & Accessibility Reference Guide: Master-Detail Layout System

This reference guide provides implementation-aware specifications for the **Master-Detail Layout System**, detailing viewport breakpoint behavior, split-pane width ratios, keyboard shortcut routing, ARIA APG accessibility patterns, and focus management strategies in compliance with WCAG 2.1 AA.

---

## 1. Viewport Breakpoints & Spatial Grid Strategy

The Master-Detail layout adapts dynamically across viewport widths to optimize readability, scanning speed, and touch interaction targets.

| Viewport Category | Width Range | Layout Architecture | Master Pane Width | Detail Pane Width | Interaction & Gesture Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Extra Wide Desktop** | $\ge 1440\text{px}$ | 2-Pane or 3-Pane (with Nav Rail) | Fixed `380px` | Fluid `flex: 1` ($\ge 800\text{px}$) | Concurrent dual viewports; pointer hover & key navigation. |
| **Standard Desktop** | $1024\text{px} - 1439\text{px}$ | Dual-Pane Split Grid | Fixed `320px` - `360px` | Fluid `flex: 1` ($\ge 640\text{px}$) | Concurrent dual viewports; sticky headers locked. |
| **Tablet Viewport** | $768\text{px} - 1023\text{px}$ | Narrow Split OR Collapsible Master | Fixed `280px` (or Collapsible) | Fluid `flex: 1` ($\ge 480\text{px}$) | Touch swipe scrolling; narrow card metadata formatting. |
| **Mobile Screen** | $< 768\text{px}$ | Single-Pane Back-Stack View | $100\%$ (State A) | $100\%$ (State B) | Single-pane view; top-left `← Back` button navigation. |

---

## 2. Accessibility & ARIA Role Mapping

To ensure screen readers and assistive technologies accurately perceive pane boundaries and record selection changes, structure the HTML DOM using the following ARIA attributes:

```text
+---------------------------------------------------------------------------------------------------+
| CONTAINER: <main class="master-detail-container" data-mobile-view="master|detail">               |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   | MASTER PANE: <section role="region" aria-label="Ticket Index List">                       |   |
|   |   <ul role="listbox" aria-label="Tickets">                                                |   |
|   |     <li role="option" aria-selected="true" tabindex="0">Active Ticket</li>                |   |
|   |     <li role="option" aria-selected="false" tabindex="-1">Inactive Ticket</li>             |   |
|   |   </ul>                                                                                   |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   | DETAIL PANE: <section role="region" aria-label="Ticket Detail Workspace">                 |   |
|   |   <button id="btn-mobile-back" aria-label="Back to ticket list">← Back</button>            |   |
|   |   <h1 id="detail-ticket-heading">Ticket Title</h1>                                        |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   | STATUS ANNOUNCER: <div class="sr-only" role="status" aria-live="polite"></div>            |   |
|   +-------------------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------------------+
```

### Key ARIA Attributes

1. **`role="region"` with `aria-label`:** Wraps both the Master list and Detail workspace containers to allow screen-reader users to jump directly between panes using landmark shortcuts (`N` or `Shift+L` in NVDA/JAWS).
2. **`role="listbox"` & `role="option"`:** Identifies the Master list as a single-selection widget.
3. **`aria-selected="true|false"`:** Communicates the currently active record to assistive technologies.
4. **`aria-live="polite"`:** Announces background asynchronous record loading without interrupting screen reader speech synthesis.

---

## 3. Keyboard Navigation & Focus Management Rules

### Master List Roving `tabindex`
- Only the currently selected master record item carries `tabindex="0"`. All other master list items carry `tabindex="-1"`.
- Pressing `Tab` from outside the list moves focus directly to the active master record item.

### Keyboard Navigation Shortcut Matrix

| Key Combo | Action Scope | Behavior & Focus Route |
| :--- | :--- | :--- |
| **`Down Arrow`** | Master List | Moves focus to the next item in the list and marks it as active (`aria-selected="true"`). |
| **`Up Arrow`** | Master List | Moves focus to the previous item in the list and marks it as active. |
| **`Home` / `End`** | Master List | Jumps focus directly to the first or last item in the collection. |
| **`Enter` / `Space`** | Selected Master Item | Selects the record and shifts focus into the Detail Pane header (`h1` or primary action button). |
| **`Escape`** | Detail Pane (Mobile) | Closes the detail view on mobile, returning viewport to Master view and restoring item focus. |
| **`Alt + Left Arrow`**| Global Workspace | Standard back shortcut triggering the mobile `← Back` action. |

---

## 4. Touch Target & WCAG 2.1 AA Compliance Checklist

- [ ] **Target Size (SC 2.5.8):** All clickable master list item rows, filter buttons, and detail header actions provide a minimum touch target area of **44x44px** on touchscreens.
- [ ] **Focus Visible (SC 2.4.7):** Active focused list items feature a high-contrast focus ring (`outline: 2px solid var(--color-focus-ring)`) meeting a minimum 3:1 contrast ratio against the card surface.
- [ ] **Color Contrast (SC 1.4.3):** Text snippet previews, timestamps, and status badges meet the minimum contrast ratio of **4.5:1** for normal body text and **3:1** for large headings/badges.
- [ ] **Independent Scroll Containers:** Master and Detail panes use `overflow-y: auto` with locked outer wrapper height (`height: 100vh`), eliminating global page scrollbars.
