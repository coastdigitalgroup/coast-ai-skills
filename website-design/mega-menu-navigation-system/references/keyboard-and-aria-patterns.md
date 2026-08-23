# Mega Menu Keyboard, ARIA, and Interaction Reference

This reference guide provides technical accessibility patterns, ARIA mapping rules, hover-intent algorithms, and responsive breakpoint guidelines for implementing mega menus.

---

## 1. ARIA Attributes Specification

| ARIA Attribute | Target Element | Expected Values | Description / Functional Purpose |
| :--- | :--- | :--- | :--- |
| `aria-expanded` | Trigger `<button>` | `"true"` \| `"false"` | Communicates to assistive technology whether the mega menu panel is open or closed. Must update synchronously on hover/click/key toggle. |
| `aria-controls` | Trigger `<button>` | Matching ID string (e.g. `"mega-panel-1"`) | Points directly to the ID of the collapsible mega menu panel container element. |
| `aria-haspopup` | Trigger `<button>` | `"true"` or `"menu"` / `"dialog"` / `"grid"` | Informs screen readers that activating this control opens an overlay panel. `"true"` or `"menu"` is standard for navigation lists. |
| `aria-labelledby` | Mega Menu Panel / Column List | Matching ID string | Associates the dropdown panel or column list container with its parent trigger button or heading tag for landmark context. |
| `role="menubar"` | Primary `<nav> <ul>` | Static role | Identifies the top-level list as a horizontal menu bar. |
| `role="menuitem"` | Trigger `<button>` / Header Link `<a>` | Static role | Identifies items belonging to the parent `menubar`. |
| `role="region"` | Mega Panel `<div>` | Static role | Wraps the multi-column panel as a landmark region when containing rich content (promo cards, search, links). |

---

## 2. Keyboard Navigation Flow & Event Mapping

Mega menus must support logical keyboard traversal for users who do not use a mouse or touch screen.

```text
               +----------------------------------+
               |  Header Trigger Button           |
               |  [Platform & Products v]         |
               +----------------------------------+
                 /            |                 \
                /             |                  \
    Tab / Arrow Down       Escape               Shift + Tab
              /               |                    \
             v                v                     v
   +-------------------+  Close Panel,      Move Focus to
   | First Mega Link   |  Return Focus to   Previous Header
   | (Col 1, Row 1)    |  Trigger Button    Item/Logo
   +-------------------+
             |
         Tab / Down
             |
             v
   +-------------------+
   | Next Mega Link    |
   | (Sequential Tab)  |
   +-------------------+
             |
         Tab / Down
             |
             v
   +-------------------+
   | Promo Card CTA    |
   +-------------------+
             |
            Tab
             |
             v
   +-------------------+
   | Next Header Item  |  (Panel closes or stays open depending on strategy)
   +-------------------+
```

### Keyboard Shortcuts Reference Table

| Key Trigger | Context / State | Action / Behavior |
| :--- | :--- | :--- |
| `Enter` / `Space` | Trigger Button focused, Panel closed | Opens the mega menu panel (`aria-expanded="true"`) and sets focus to the first interactive link inside. |
| `Down Arrow` | Trigger Button focused | Opens panel and moves focus to the first link inside Column 1. |
| `Tab` | Inside Open Mega Panel | Moves focus sequentially through all links in Column 1, Column 2, Column 3, and Column 4 Promo CTA. |
| `Shift + Tab` | On First Link inside Open Mega Panel | Moves focus back to the parent Header Trigger Button. |
| `Escape` (`Esc`) | Focus anywhere inside Open Mega Panel or Trigger | Instantly closes the open panel (`aria-expanded="false"`) and returns focus to parent Header Trigger Button. |
| `Left / Right Arrow` | Focus on Top-level Header Items | Moves focus to the previous or next top-level item in the primary navigation bar. |

---

## 3. Hover Intent & Cursor Vector Mathematics

To prevent accidental menu toggling when users move their mouse diagonally across navigation items toward a link in an expanded mega menu panel, implement dynamic geometry buffers or intent thresholds.

### A. Timing Thresholds
- **Intent-In Delay (`T_in`):** `150ms - 200ms`. When the pointer enters a trigger, delay opening the panel until `150ms` elapses. If the pointer leaves before `150ms`, cancel the timer.
- **Intent-Out Grace Period (`T_out`):** `200ms - 300ms`. When the pointer exits the panel boundary, wait `200ms` before setting `aria-expanded="false"`.

### B. Dynamic Aiming Triangle (Polygon Geometry)
When the mega panel expands, calculate a temporary dynamic polygon defined by 3 vertex coordinates:

1. **Vertex A ($P_{cursor}$):** The current $(X, Y)$ coordinate of the mouse cursor over the trigger.
2. **Vertex B ($P_{top\_right}$):** The top-right corner $(X_{panel\_max}, Y_{panel\_top})$ of the mega menu panel.
3. **Vertex C ($P_{bottom\_right}$):** The bottom-right corner $(X_{panel\_max}, Y_{panel\_bottom})$ of the mega menu panel.

$$\text{Aiming Triangle} = \Delta(P_{cursor}, P_{top\_right}, P_{bottom\_right})$$

- **Vector Test:** On every `mousemove` event, check if the current pointer position $(X, Y)$ falls inside the defined triangle $\Delta ABC$.
- **Condition:** If the cursor is inside $\Delta ABC$, ignore `mouseenter` events triggered on adjacent navigation items, keeping the active mega panel open.

---

## 4. Responsive Transition & Breakpoint Rules

| Viewport Width | Navigation Mode | Layout Adaptation Mechanics |
| :--- | :--- | :--- |
| **Desktop (`>= 1024px`)** | Full 2D Mega Menu Panel | Absolute positioning below header (`top: 100%`), 3–4 columns grid, hover intent + click toggle enabled. |
| **Tablet (`768px - 1023px`)** | Compact 2D Grid / Slide Drawer | Shrinks to 2 columns for links + 1 full-width bottom promo banner. Hover triggers disabled; click/tap required. |
| **Mobile (`< 768px`)** | Multi-level Sliding Drawer or Accordion | Mega panel unmounts from horizontal header and mounts inside a vertical off-canvas drawer (`100vw`). Categories collapse into nested accordions or slide-in sub-panels. |

---

## 5. Focus Indicator & High Contrast Rules

- **Focus Ring Offset:** High-contrast outline (`2px solid var(--color-primary)` with `outline-offset: 2px`) on all focusable elements inside the mega menu panel.
- **Windows High Contrast Mode (Forced Colors):**
  - Explicit borders must be defined on panel containers (`border: 1px solid CanvasText;`).
  - Active hover/focus backgrounds must use system color keywords (`Highlight` background with `HighlightText` text color) under `@media (forced-colors: active)`.
