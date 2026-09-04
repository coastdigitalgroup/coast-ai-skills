# Toolbar and Action Dock System: Layout & Composition Examples

This document provides realistic layout breakdowns and design specifications for three common toolbar architecture patterns:
1. **Rich Text & Editor Formatting Toolbar** (Horizontal, grouped, responsive overflow)
2. **Floating Bulk Action Dock** (Contextual bottom dock for data tables & multi-select lists)
3. **Canvas & Workspace Vertical Tool Rail** (Floating tool palette for design tools & node graphs)

---

## Pattern 1: Rich Text & Editor Formatting Toolbar

### Scenario
An enterprise CMS document editor requires a sticky header toolbar containing text styling, block type selection, list formatting, alignment, media embedding, and history controls.

### Visual & Spatial Diagram

```text
+---------------------------------------------------------------------------------------------------+
| [Undo][Redo] | [Paragraph ▾] | [ B ][ I ][ U ][ S ] | [Align ▾] | [• List][1. List] | [🔗][🖼️] | [...] |
+---------------------------------------------------------------------------------------------------+
| Group 1      | Group 2       | Group 3              | Group 4   | Group 5           | Group 6  | Overflow|
| History      | Typography    | Inline Formatting    | Alignment | Lists             | Media    | More    |
```

### Layout Specifications

- **Container Positioning:** Pinned to top of editor canvas (`position: sticky; top: 0; z-index: 100;`).
- **Container Height:** `42px` (Desktop) / `48px` (Mobile touch mode).
- **Background & Border:** Surface background (`#FFFFFF` light / `#1E293B` dark) with `1px solid var(--border-subtle)` bottom border.
- **Group Separation:** Vertical line dividers (`width: 1px; height: 18px; background: var(--border-subtle); margin: 0 6px;`).
- **Button Sizing:** `30x30px` square target areas with `4px` border radius and `16x16px` SVG icons.
- **Gap within Group:** `2px` horizontal spacing between controls.

### ARIA & Interactive State Anatomy

```html
<div role="toolbar" aria-label="Text formatting controls" class="editor-toolbar">
  <!-- Group 1: History -->
  <div class="toolbar-group">
    <button type="button" tabindex="0" aria-label="Undo (Ctrl+Z)" class="tb-btn" title="Undo">
      <svg class="icon"><!-- Undo SVG --></svg>
    </button>
    <button type="button" tabindex="-1" aria-label="Redo (Ctrl+Y)" class="tb-btn" title="Redo" disabled>
      <svg class="icon"><!-- Redo SVG --></svg>
    </button>
  </div>

  <span class="toolbar-divider" aria-hidden="true"></span>

  <!-- Group 2: Inline Formatting -->
  <div class="toolbar-group">
    <button type="button" tabindex="-1" aria-label="Bold" aria-pressed="true" class="tb-btn is-active" title="Bold (Ctrl+B)">
      <svg class="icon"><!-- Bold SVG --></svg>
    </button>
    <button type="button" tabindex="-1" aria-label="Italic" aria-pressed="false" class="tb-btn" title="Italic (Ctrl+I)">
      <svg class="icon"><!-- Italic SVG --></svg>
    </button>
  </div>
</div>
```

---

## Pattern 2: Floating Bulk Action Dock

### Scenario
An e-commerce order management data table allows users to select multiple rows via checkboxes. When 1 or more items are selected, a floating bottom action dock slides up over the bottom viewport area, presenting contextual batch operations.

### Visual & Spatial Diagram

```text
Desktop Viewport (1440px wide)
+---------------------------------------------------------------------------------------------------+
|  [x] Order #1001   Customer: Jane Doe     Status: Pending     Total: $120.00                      |
|  [x] Order #1002   Customer: John Smith   Status: Pending     Total: $85.50                       |
|  [ ] Order #1003   Customer: Alice Wong   Status: Shipped     Total: $210.00                      |
|                                                                                                   |
|                      +------------------------------------------------------+                     |
|                      |  [ 2 selected ]  |  [ Export CSV ] [ Print Labels ]  |                     |
|                      |  [ Mark Paid ]   |  [ 🗑️ Delete (2) ]     [ ✕ ]     |                     |
|                      +------------------------------------------------------+                     |
+---------------------------------------------------------------------------------------------------+
                                ^ Floating Centered Pill Dock (Fixed Bottom)
```

### Layout Specifications

- **Container Positioning:** `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 1000;`.
- **Safe Area Inset:** `bottom: calc(24px + env(safe-area-inset-bottom, 0px));`.
- **Dimensions:** Height `56px`, Border Radius `999px` (Pill shape), Padding `6px 12px 6px 16px`.
- **Elevation & Shadow:** `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);`.
- **Background Surface:** High contrast dark surface in light mode (`#0F172A` with white text) or elevated surface in dark mode (`#1E293B` with border `#334155`).
- **Transition Animation:** `transform: translate(-50%, 0) scale(1); opacity: 1; transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease;`.
  - Hidden state: `transform: translate(-50%, 32px) scale(0.95); opacity: 0; pointer-events: none;`.

### Structural Anatomy

```html
<aside aria-label="Bulk actions" class="bulk-action-dock" role="region">
  <div role="toolbar" aria-label="Actions for selected items" class="bulk-toolbar">
    <!-- Counter Badge -->
    <div class="selection-count">
      <span class="count-badge">2</span>
      <span class="count-label">selected</span>
    </div>

    <span class="dock-divider" aria-hidden="true"></span>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button type="button" tabindex="0" class="dock-btn dock-btn-secondary">
        <svg class="icon"><!-- Export SVG --></svg>
        <span>Export</span>
      </button>
      <button type="button" tabindex="-1" class="dock-btn dock-btn-secondary">
        <svg class="icon"><!-- Print SVG --></svg>
        <span>Print Labels</span>
      </button>
      <button type="button" tabindex="-1" class="dock-btn dock-btn-danger">
        <svg class="icon"><!-- Trash SVG --></svg>
        <span>Delete</span>
      </button>
    </div>

    <span class="dock-divider" aria-hidden="true"></span>

    <!-- Dismiss Button -->
    <button type="button" tabindex="-1" aria-label="Deselect all items" class="dock-dismiss-btn" title="Clear selection">
      <svg class="icon"><!-- Close X SVG --></svg>
    </button>
  </div>
</aside>
```

---

## Pattern 3: Canvas & Workspace Vertical Tool Rail

### Scenario
An interactive vector illustration web tool or node graph app uses a vertical floating tool rail pinned to the left edge of the interactive workspace viewport.

### Visual & Spatial Diagram

```text
+------+--------------------------------------------------------------------------------------------+
| [ Pointer ]  <-- Active Tool (aria-pressed="true")                                                 |
| [ Hand    ]                                                                                       |
| [ Rectangle]                                                                                       |
| [ Circle   ]                                                                                       |
| [ Pen     ]                                                                                       |
| [ Text    ]                                                                                       |
| ----------                                                                                        |
| [ Zoom In ]                                                                                       |
| [ Zoom Out]                                                                                       |
+------+--------------------------------------------------------------------------------------------+
  ^ Vertical Rail (Left: 16px, Top: 80px)
```

### Layout Specifications

- **Container Positioning:** `position: absolute; top: 80px; left: 16px; z-index: 50;`.
- **Orientation:** Vertical flexbox layout (`flex-direction: column; align-items: center;`).
- **Width:** `44px`, Padding `6px`, Gap `4px`.
- **Border Radius:** `12px` rounded rectangle.
- **Roving Focus Orientation:** Uses `ArrowUp` and `ArrowDown` keys for roving `tabindex` focus movement.

---

## Responsive & Density Adaptation Rules

| Breakpoint | Layout Mode | Container Height / Target | Spacing & Overflow Strategy |
| :--- | :--- | :--- | :--- |
| **Desktop (≥1024px)** | Expanded Inline Toolbar | 36px–40px / 32px targets | Full group visibility; secondary actions expanded; divider line separation. |
| **Tablet (768px - 1023px)** | Compact Inline Toolbar | 44px / 38px targets | Non-essential groups (e.g., Alignment options) collapse into dropdown triggers. |
| **Mobile (<768px)** | Bottom Dock / Sticky Bar | 48px–56px / 44px+ touch targets | Toolbar pins to bottom viewport above software keyboard; single `[...]` popover holds secondary actions. |
