# ARIA, Roving Tabindex, and Keyboard References: Toolbar and Action Dock System

This reference guide provides technical specifications for ARIA attributes, keyboard focus management, touch targets, and responsive overflow strategies for application toolbars and action docks.

---

## 1. ARIA Specification Matrix

| ARIA Attribute | Target Element | Description & Expected Value |
| :--- | :--- | :--- |
| `role="toolbar"` | Outer container `<div>` | Identifies the container as a group of controls for editing or formatting. |
| `aria-label` | Outer container `<div>` | Provides an accessible name for the toolbar (e.g., `aria-label="Text Formatting Tools"`). Required if no visible heading exists. |
| `aria-orientation` | Outer container `<div>` | Specifies layout direction (`horizontal` [default] or `vertical`). |
| `role="group"` | Cluster `<div>` | Groups logically related tool buttons (e.g., `<div role="group" aria-label="Text Alignments">`). |
| `role="separator"` | Divider `<div>` or `<hr>` | Represents a visual separator between control clusters. Set `aria-orientation="vertical"`. |
| `aria-pressed` | Toggle `<button>` | Set to `"true"` when state is active (e.g., Bold is on), `"false"` when inactive. |
| `aria-checked` | Radio `<button>` | Used inside `role="radiogroup"` for mutually exclusive choices (e.g., Left / Center / Right alignment). |
| `aria-haspopup` | Dropdown trigger | Indicates the button opens a popup menu or picker (`"true"` or `"menu"`). |
| `aria-expanded` | Dropdown trigger | Reflects open (`"true"`) or closed (`"false"`) state of popup menus/overflow. |
| `aria-disabled` | Disabled `<button>` | Set to `"true"` for tools that are temporarily unavailable (e.g., Undo when history is empty). |

---

## 2. Roving Tabindex Keyboard Navigation Protocol

The **Roving Tabindex** pattern ensures that a toolbar with many controls acts as a single tab stop in the page reading sequence, dramatically improving keyboard navigation speed.

```text
PAGE TAB NAVIGATION SEQUENCE:
[Previous Form Field] --Tab--> [Active Toolbar Button (tabindex="0")] --Tab--> [Next Page Element]
                                             |
                                    Arrow Keys Navigation
                                             |
                                 +-----------+-----------+
                                 |                       |
                            ArrowRight /            ArrowLeft /
                            ArrowDown               ArrowUp
                                 |                       |
                                 v                       v
                         [Next Button]           [Previous Button]
```

### Event Handling Implementation Rules

1. **Initial State:** Exactly ONE tool button in the toolbar must have `tabindex="0"` (typically the first tool or the last focused tool). All other buttons must have `tabindex="-1"`.
2. **`ArrowRight` / `ArrowDown`:**
   - Move focus to the next enabled button in DOM order.
   - Wrap around to the first button if focus is on the last button.
   - Set `tabindex="0"` on the newly focused button and `tabindex="-1"` on the previous button.
   - Call `element.focus()`.
3. **`ArrowLeft` / `ArrowUp`:**
   - Move focus to the previous enabled button in DOM order.
   - Wrap around to the last button if focus is on the first button.
   - Set `tabindex="0"` on the newly focused button and `tabindex="-1"` on the previous button.
   - Call `element.focus()`.
4. **`Home` / `End`:**
   - `Home` moves focus directly to the first enabled button in the toolbar.
   - `End` moves focus directly to the last enabled button in the toolbar.

---

## 3. Touch Target and Optical Spacing Metrics

| Density Tier | Container Height | Tool Height | Icon Size | Gap / Padding | Min Touch Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Compact (SaaS/Code)** | 40px | 32px | 16px | 4px gap / 6px pad | 32x32px (Desktop only) |
| **Default (Standard)** | 48px - 56px | 36px - 40px | 20px | 6px gap / 8px pad | 36x36px (Visual) / 44x44px (Hit target) |
| **Spacious / Mobile** | 56px - 64px | 44px - 48px | 24px | 8px gap / 12px pad | 44x44px (Strict WCAG 2.2 preferred) |

### Expanding Touch Hits without Visual Bloat
Use transparent pseudo-elements to expand touch targets to 44x44px on touch devices without increasing visual button dimensions:
```css
.tool-btn {
  position: relative;
  min-width: 36px;
  height: 36px;
}

@media (pointer: coarse) {
  .tool-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
  }
}
```

---

## 4. Responsive Overflow and Priority Breakdown Strategies

Toolbars must handle narrow viewports without breaking into messy multi-line wraps or overflowing the container boundaries.

### Priority Tiering Model

- **P1 (Core Priority):** Essential tools used continually (e.g., Bold, Italic, Link, Undo). Must remain visible on all screen sizes.
- **P2 (Secondary Priority):** Supporting options (e.g., Alignments, Lists, Blockquote). Collapse first when viewport width drops below ~768px.
- **P3 (Utility Priority):** Advanced utilities (e.g., Code block, Strikethrough, Clear Formatting). Collapse first when viewport width drops below ~1024px.

### Responsive Overflow Menu Pattern
When container width is reduced:
1. Move P2 and P3 buttons from the visible toolbar into an Overflow Dropdown menu container.
2. Render an **"More Tools"** button (`aria-haspopup="true"`, `aria-expanded="false"`, icon `...`) as the last item in the toolbar.
3. Ensure the overflow dropdown menu accepts keyboard navigation via `ArrowDown` / `ArrowUp` and closes on `Escape`.
