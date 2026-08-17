# Responsive & Accessibility Reference Guidelines: Master-Detail Layout System

This reference document establishes technical standards, layout proportion math, responsive breakpoint rules, keyboard shortcuts, and ARIA accessibility mappings for implementing master-detail (split-pane) layouts across desktop and mobile devices.

---

## 1. Spatial Layout & Proportion Guidelines

### Pane Ratio Specifications

| Viewport Profile | Width Range | Master Pane Width | Detail Pane Width | Layout Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Wide Desktop** | `>= 1440px` | `380px` (or `25%` max) | `flex: 1` (`1060px+`) | Multi-pane side-by-side with wide detail canvas for multi-column dashboards. |
| **Standard Desktop** | `1024px - 1439px` | `340px` (or `30% - 35%`) | `flex: 1` (`680px+`) | Balanced split layout; ideal for email, CRM, and customer ticket portals. |
| **Tablet Landscape** | `768px - 1023px` | `280px - 300px` | `flex: 1` (`488px+`) | Compact list view with collapsible or narrow master cards. |
| **Mobile / Portrait** | `< 768px` | `100%` width | `100%` width | Single active pane mode with smooth sliding back-stack transitions. |

### Layout CSS Rules

```css
/* Container Lock Rule */
.master-detail-wrapper {
  display: flex;
  width: 100%;
  height: 100%; /* Height inherited from viewport-locked shell */
  overflow: hidden;
  position: relative;
}

/* Master Pane Constraints */
.master-pane {
  flex: 0 0 360px;
  min-width: 280px;
  max-width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-subtle);
  background: var(--surface-card);
}

.master-pane-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Detail Pane Constraints */
.detail-pane {
  flex: 1;
  min-width: 0; /* Prevents flex items from overflowing parent container */
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-background);
}

.detail-pane-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
```

---

## 2. Accessibility & ARIA Technical Standards

### WCAG 2.1 AA Mappings

- **SC 2.1.1 Keyboard (Level A):** Every list item in the master pane and action control in the detail pane must be accessible without a pointing device.
- **SC 2.4.7 Focus Visible (Level AA):** Focused list items and buttons must present an unclipped focus indicator with a minimum 3:1 contrast ratio against adjacent surfaces.
- **SC 4.1.2 Name, Role, Value (Level A):** The selected master list item must be announced with `aria-selected="true"`.
- **SC 4.1.3 Status Messages (Level AA):** Dynamically loaded detail views must emit status messages to an `aria-live="polite"` region.

### ARIA Pattern Structures

#### Pattern A: Listbox / Option (Recommended for Single-Select Master Lists)

```html
<ul role="listbox" aria-label="Inbox Email Threads">
  <li role="option" aria-selected="true" tabindex="0">
    <!-- Active Record -->
  </li>
  <li role="option" aria-selected="false" tabindex="-1">
    <!-- Inactive Record -->
  </li>
</ul>
```

#### Pattern B: Navigation / Region (Recommended for Independent Sub-Pages)

```html
<nav aria-label="Customer Accounts Index">
  <ul role="list">
    <li>
      <a href="/accounts/101" aria-current="page">ACME Corp</a>
    </li>
    <li>
      <a href="/accounts/102">Stark Industries</a>
    </li>
  </ul>
</nav>

<main role="main" aria-label="Account Workspace Details">
  <!-- Detail Pane Content -->
</main>
```

---

## 3. Keyboard Shortcut Matrix

| Key Combo | Action Scope | Behavior |
| :--- | :--- | :--- |
| `Down Arrow` | Master List | Move selection to the next item in the master list and load its detail view. |
| `Up Arrow` | Master List | Move selection to the previous item in the master list and load its detail view. |
| `Home` / `End` | Master List | Jump directly to the first or last item in the master list. |
| `Enter` / `Space` | Master List | Confirm item selection (or shift focus into detail pane workspace). |
| `Alt` + `F6` / `F6` | Global Layout | Cycle focus sequentially between Master Toolbar, Master List, Detail Header, and Detail Body. |
| `Escape` | Mobile View | Return from Detail View (`data-mobile-view="detail"`) to Master List View (`data-mobile-view="master"`). |

---

## 4. Screen Reader Live Region Announcements

To ensure screen reader users are immediately informed when choosing items in the master list, implement a persistent invisible live region:

```html
<div id="srLiveRegion" class="sr-only" aria-live="polite" aria-atomic="true"></div>
```

### Announcement Script Pattern

```javascript
function announceDetailChange(title, statusSummary) {
  const srRegion = document.getElementById('srLiveRegion');
  if (srRegion) {
    srRegion.textContent = `Loaded record details for ${title}. Status: ${statusSummary}.`;
  }
}
```
