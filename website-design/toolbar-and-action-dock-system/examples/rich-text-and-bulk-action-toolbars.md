# Real-World Layout Breakdowns: Toolbar and Action Dock System

This document breaks down two real-world application layouts using the **Toolbar and Action Dock System**:
1. **Rich Text & Article Editor Toolbar** (Sticky Header Application)
2. **Data Table Bulk Action Dock** (Floating Bottom Bar Application)

---

## Breakdown 1: Rich Text & Article Editor Toolbar

### Problem Context
A CMS content management application features a rich text editor where content creators format long-form articles. Creators need rapid access to text formatting (Headings, Bold, Italic), block formatting (Lists, Blockquotes, Code Blocks), media insertion (Image, Link), and document history (Undo, Redo).

### Spatial & Visual Layout Blueprint

```text
+-------------------------------------------------------------------------------------------------------------------------+
| ROLE="TOOLBAR" ARIA-LABEL="Text Formatting Tools"                                                                       |
| [48px Container Height | Sticky Top Pin | Glassmorphism Background | Border-Bottom 1px Solid]                            |
|                                                                                                                         |
| +---------------------+  |  +---------------------------+  |  +--------------------+  |  +-----------------------------+ |
| | CLUSTER 1: STYLES   |  |  | CLUSTER 2: INLINE FORMATS |  |  | CLUSTER 3: INSERT  |  |  | CLUSTER 4: HISTORY & UTILS | |
| | [Heading Select v]  |  |  | [B]  [I]  [U]  [S]  [</>] |  |  | [Link] [Img] [Quote] |  |  | [<- Undo] [Redo ->]  [...]    | |
| +---------------------+  |  +---------------------------+  |  +--------------------+  |  +-----------------------------+ |
|                          |                                 |                         |                                |
|                        DIVIDER                           DIVIDER                   DIVIDER                            |
+-------------------------------------------------------------------------------------------------------------------------+
| ARTICLE CONTENT CANVAS (Scrollable Body Text...)                                                                        |
|                                                                                                                         |
+-------------------------------------------------------------------------------------------------------------------------+
```

### Key Design Attributes Applied

1. **Sticky Top Docking:**
   - Container pinned via `position: sticky; top: 0; z-index: 100;`.
   - Subtle background backdrop blur (`backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.85);`) allows users to perceive document scrolling behind the toolbar without losing legibility.

2. **Optical Grouping & Dividers:**
   - Divided into 4 distinct functional clusters.
   - Cluster separation uses explicit `<div role="separator" aria-orientation="vertical" class="toolbar-divider"></div>` elements with 16px height and 8px horizontal padding.

3. **State Indication & Accessibility:**
   - Bold (`[B]`) and Italic (`[I]`) buttons use `aria-pressed="true"` when the user's cursor rests inside bolded or italicized text.
   - When `aria-pressed="true"`, CSS applies a high-contrast brand tint background (`var(--brand-surface-active)`), a dark icon color (`var(--brand-primary)`), and a subtle 1px inner border.

4. **Keyboard Roving Tabindex:**
   - Entering the toolbar via `Tab` lands on `[Heading Select v]` (`tabindex="0"`).
   - Pressing `ArrowRight` moves focus to `[B]`, then `[I]`, then `[U]`.
   - Pressing `Tab` from inside the toolbar immediately exits focus to the editable article body canvas.

5. **Responsive Collapse Rules:**
   - **Desktop (>1024px):** All 4 clusters fully visible inline.
   - **Tablet (768px - 1023px):** Cluster 3 (`Insert`) and Cluster 4 (`History`) collapse into an `[...]` Overflow menu.
   - **Mobile (<767px):** Toolbar switches to a compact horizontal scrolling bar or bottom-pinned editor bar with P1 tools (`[B]`, `[I]`, `[Link]`, `[...]`).

---

## Breakdown 2: Data Table Bulk Action Dock

### Problem Context
An enterprise SaaS administration portal displays a high-density table of 500+ customer accounts. When an admin checks one or more row checkboxes, a floating action dock animates into view from the bottom viewport edge, enabling bulk operations (Export, Assign Tag, Change Status, Delete Selected).

### Spatial & Visual Layout Blueprint

```text
+-------------------------------------------------------------------------------------------------------------------------+
| DATA TABLE VIEW                                                                                                         |
| [x] Select All (3 items selected)                                                                                        |
| [x] Account #1092 - Acme Corp - Active                                                                                  |
| [x] Account #1093 - Stark Industries - Pending                                                                          |
| [x] Account #1094 - Wayne Enterprises - Active                                                                          |
| [ ] Account #1095 - Cyberdyne Systems - Inactive                                                                        |
+-------------------------------------------------------------------------------------------------------------------------+
                                 |
                                 v
   +---------------------------------------------------------------------------------------+
   | FLOATING DOCK [position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%)]  |
   | [Shadow Depth level 4 | Border-Radius: 9999px (Pill) | Dark Background Contrast]   |
   |                                                                                       |
   |  (3 items selected)  |  [Assign Tag v]  [Export CSV]  |  [Danger: Delete]  (X) Close  |
   |  +----------------+  |  +--------------------------+  |  +---------------+  +-------+ |
   |  | STATUS COUNTER |  |  | PRIMARY BULK ACTIONS     |  |  | DESTRUCTIVE   |  | CLEAR | |
   |  +----------------+  |  +--------------------------+  |  +---------------+  +-------+ |
   +---------------------------------------------------------------------------------------+
```

### Key Design Attributes Applied

1. **Elevation & Floating Anchor:**
   - Positioned using `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 150;`.
   - Utilizes `elevation-and-depth-system` Level 4 shadow (`box-shadow: 0 12px 32px rgba(0,0,0,0.2)`) and a pill contour (`border-radius: 9999px`) to elevate clearly above table data rows.

2. **Contrast & Context Alignment:**
   - Dark mode contrast surface (`var(--surface-dark-slate)`) ensures instant visual differentiation from the white/light table background.
   - Leftmost element displays live status count ("3 items selected") so the user maintains complete clarity on the selection scope.

3. **Danger Action Isolation:**
   - Primary bulk actions (`Assign Tag`, `Export CSV`) use neutral low-contrast pills.
   - The destructive action (`Delete`) uses a distinct red outline badge with clear spacing separation to prevent accidental bulk deletions.

4. **Mobile Adaptability:**
   - On viewports < 600px, the dock transforms from a floating pill into a full-width bottom sheet (`width: 100%; bottom: 0; border-radius: 16px 16px 0 0;`).
   - Uses `padding-bottom: calc(12px + env(safe-area-inset-bottom))` to clear mobile gesture bars.
