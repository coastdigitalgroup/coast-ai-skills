# WAI-ARIA & Keyboard Traversal Patterns for Mega Menus

This reference document outlines the exact ARIA attributes, keyboard navigation semantics, and hover-intent mathematical heuristics required to build compliant, high-usability mega menus.

---

## 1. WAI-ARIA Attribute Specifications

When designing mega menus, engineers typically choose between two formal WAI-ARIA patterns:

### Pattern A: Disclosure Pattern (Recommended for Most Web Applications)

The Disclosure pattern treats each top-level mega menu trigger as an expandable button controlling a hidden region.

```html
<!-- TOP LEVEL TRIGGER BUTTON -->
<button
  type="button"
  id="mega-trigger-products"
  aria-expanded="false"
  aria-controls="mega-panel-products"
  aria-haspopup="true">
  Products
</button>

<!-- EXPANDABLE PANEL OVERLAY -->
<div
  id="mega-panel-products"
  role="region"
  aria-labelledby="mega-trigger-products"
  hidden>
  <!-- Interactive link items inside -->
  <a href="/compute">Compute Engine</a>
  <a href="/storage">Storage Clusters</a>
</div>
```

#### ARIA State Mapping Table

| Attribute | Target Element | Dynamic Values | State Meaning |
| :--- | :--- | :--- | :--- |
| `aria-expanded` | Trigger `<button>` | `"true"` \| `"false"` | Announces to screen readers whether the panel is currently open. |
| `aria-controls` | Trigger `<button>` | ID string (e.g., `"mega-panel-products"`) | Links trigger to the panel DOM element. |
| `aria-haspopup` | Trigger `<button>` | `"true"` or `"menu"` | Signals that activating the button exposes a popup container. |
| `role="region"` | Panel `<div>` | Fixed string | Identifies the expanded container as an accessible landmark region. |
| `aria-labelledby`| Panel `<div>` | ID string of trigger | Associates the panel name with its trigger label for assistive technologies. |

---

## 2. Keyboard Traversal Rules & Shortcuts

Mega menus must support intuitive keyboard traversal without locking focus or confusing screen reader users.

```
                  +-------------------------------+
                  | TOP TRIGGER: [ Products v ]   |
                  +-------------------------------+
                                |
                   (Press Enter / Space / Down Arrow)
                                |
                                v
     +---------------------------------------------------------+
     | FIRST PANEL LINK: [ Compute Engine ]                    |
     +---------------------------------------------------------+
                                |
                           (Press Tab)
                                |
                                v
     +---------------------------------------------------------+
     | SECOND PANEL LINK: [ Storage Clusters ]                 |
     +---------------------------------------------------------+
                                |
                          (Press Escape)
                                |
                                v
     +---------------------------------------------------------+
     | PANEL CLOSES -> FOCUS RESTORED TO [ Products v ] TRIGGER|
     +---------------------------------------------------------+
```

### Keybinding Reference Matrix

| Key Combo | Context | Action & Focus Destination |
| :--- | :--- | :--- |
| `Enter` / `Space` | Focus on closed trigger | Opens mega menu panel; places focus on the first link inside panel. |
| `Down Arrow` | Focus on closed trigger | Opens mega menu panel; places focus on the first link inside panel. |
| `Tab` | Focus inside panel | Moves focus to the next interactive link or button inside panel. |
| `Shift + Tab` | Focus inside panel | Moves focus to the previous interactive link; if on first link, moves back to trigger. |
| `Escape` | Focus anywhere in panel/trigger | Instantly closes panel; returns focus back to the parent trigger button. |

---

## 3. Hover Intent & Safe Triangle Mechanics

Standard CSS `:hover` triggers fail when users move the mouse pointer diagonally from the trigger button toward links on the right-hand side of the expanded panel. Without a safe path, the cursor crosses outside the trigger area and closes the panel prematurely ("diagonal dropout").

### Diagonal Pointer Safe Triangle Diagram

```
   TRIGGER BUTTON
   +--------------------+
   | Products & Sol. v  |  <-- Current Mouse Position (Top Left: P1)
   +--------------------+
         \            \
          \  ACTIVE    \  <-- Safe Motion Buffer (Triangle Region)
           \  HOVER     \
            \  PATH      \
             +-------------------------------------------------------+
             | MEGA PANEL OVERLAY                                     |
             | [ Col 1 Link ]    [ Col 2 Link ]    [ Col 3 Target ]  |
             +-------------------------------------------------------+
                                                   ^
                                                   Target Position (Bottom Right: P2/P3)
```

### Mathematical Triangulation Algorithm

When the mouse moves over the header, record the current pointer position `(x, y)` and calculate whether subsequent movements fall within a triangle formed by:
1. Current mouse position `P1 = (mouseX, mouseY)`
2. Top right corner of the mega panel `P2 = (panelLeft + panelWidth, panelTop)`
3. Bottom right corner of the mega panel `P3 = (panelLeft + panelWidth, panelTop + panelHeight)`

If the next mouse coordinate falls inside Triangle `(P1, P2, P3)`, delay closing the panel for `300ms` because the user is aiming toward a link within the active panel.

---

## 4. Touch & Viewport Heuristics

1. **Touch Device Detection:** On touch-primary devices (`@media (pointer: coarse)`), ignore hover events entirely and require explicit tap triggers.
2. **Viewport Collision Prevention:**
   - Always calculate `panelWidth = Math.min(1280, window.innerWidth - 32)`.
   - On viewports `< 1024px`, collapse multi-column 2D grids into a single-column slide-over drawer or vertical accordion.
3. **Internal Overflow Bounds:**
   - Set `max-height: calc(85vh - var(--header-height))` on `.mega-panel`.
   - Set `overflow-y: auto` to allow vertical scrolling within the panel on short displays (e.g., laptops in landscape mode with height `< 650px`).
