# E-Commerce and SaaS Bottom Sheet Layout Breakdowns

This document provides complete spatial composition, anatomical breakdowns, gesture interaction rules, and responsive adaptation mechanics for two high-value production use cases:
1. **E-Commerce Variant Selector Bottom Sheet (PDP Quick Buy)**
2. **SaaS Catalog Multi-Filter Bottom Sheet (Discovery View)**

---

## 1. E-Commerce Variant Selector Bottom Sheet

### Context
On mobile E-Commerce Product Detail Pages (PDPs), users tapping "Add to Bag" or "Select Options" need to select Size, Color, and Purchase Frequency (One-time vs. Subscribe & Save) without losing page context or navigating away from the image gallery.

### Anatomical & Spatial Breakdown

```text
+-------------------------------------------------------------+
|                     DIMMED BACKDROP (50%)                   |
|                      (Tap outside to close)                 |
+-------------------------------------------------------------+
|  [====================== DRAG HANDLE ====================]  | 36x5px Pill
|  Product Options                         [ X Close ]        | Header (24px padding)
|  ---------------------------------------------------------  | 1px Border Neutral
|                                                             |
|  [ Image ]  Pro Wireless Headphones                         | Thumb Product Summary
|             $199.00  (In Stock)                             |
|                                                             |
|  COLOR: Matte Black                                         | Section Title
|  ( (Black) )  [ Silver ]  [ Navy ]                          | Option Chips (48px height)
|                                                             |
|  SIZE: Medium                                               | Section Title
|  [ Small ]   ( (Medium) )   [ Large ]                       | Touch Buttons (48px height)
|                                                             |
|  PURCHASE TYPE:                                             | Option Radio Group
|  (•) One-time purchase ($199.00)                            |
|  ( ) Subscribe & Save 15% ($169.15)                         |
|                                                             |
|  ---------------------------------------------------------  |
|  [                     ADD TO BAG - $199                    ] | Sticky CTA Button
|  ==================== SAFE AREA INSET ===================== | env(safe-area-inset-bottom)
+-------------------------------------------------------------+
```

### Spatial Grid & Token Mapping

- **Container Positioning:** `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1001;`
- **Border Radius:** `border-radius: 20px 20px 0 0;`
- **Max Height:** `max-height: calc(90dvh - 24px);`
- **Padding:**
  - Header: `16px 20px`
  - Body (Scrollable): `16px 20px`
  - Sticky Footer: `16px 20px calc(16px + env(safe-area-inset-bottom, 0px))`
- **Color Tokens:**
  - Surface: `var(--color-bg-surface, #FFFFFF)`
  - Drag Handle: `var(--color-neutral-300, #D1D5DB)`
  - Border: `var(--color-border-subtle, #E5E7EB)`
  - Primary Button: `var(--color-brand-primary, #111827)` (Dark background, white text)

### Gesture & Detent Rules

1. **Initial Snap Height:** Auto-expands to fit content (Dual Detent at 50vh, expanding to 90vh if user expands options).
2. **Swipe Down to Dismiss:** Dragging down anywhere on the header or handle past 80px dismisses the sheet and returns focus to the PDP "Select Options" button.
3. **Scroll Lock Integration:** The option list scrolls internally if content exceeds 50vh; sheet drag-to-dismiss is only triggered when internal `scrollTop === 0`.

---

## 2. SaaS Catalog Multi-Filter Bottom Sheet

### Context
In SaaS web applications (e.g., job boards, analytics logs, real estate listings), users on mobile devices require complex multi-facet filtering (Category, Price Range, Status, Date Range). Center modals fail on mobile screens due to vertical clipping; a bottom sheet with a sticky footer action bar solves the mobile usability bottleneck.

### Anatomical & Spatial Breakdown

```text
+-------------------------------------------------------------+
|                     DIMMED BACKDROP (60%)                   |
+-------------------------------------------------------------+
|  [====================== DRAG HANDLE ====================]  | 36x5px Pill
|  Filter Listings (142 Results)           [ Reset All ]      | Header Bar
|  ---------------------------------------------------------  |
|                                                             |
|  CATEGORY                                                   |
|  [x] Frontend Development    [x] Full Stack                 | Checkbox Pill Group
|  [ ] UI/UX Design            [ ] Product Management         |
|                                                             |
|  EXPERIENCE LEVEL                                           |
|  ( ) Entry Level   (•) Mid-Senior   ( ) Lead / Executive    | Radio Selector
|                                                             |
|  SALARY RANGE ($/yr)                                        |
|  $80,000 -----------------------o----------- $220,000       | Dual Range Slider
|                                                             |
|  REMOTE PREFERENCE                                          |
|  [  Remote Only  |  Hybrid  |  On-Site  ]                   | Segmented Control
|                                                             |
|  ---------------------------------------------------------  |
|  [               SHOW 142 MATCHING RESULTS                ] | Sticky Primary CTA
|  ==================== SAFE AREA INSET ===================== | env(safe-area-inset-bottom)
+-------------------------------------------------------------+
```

### Desktop Responsive Adaptation Strategy

When the screen width reaches `1024px`, the bottom sheet layout automatically adapts:

```text
Mobile Viewport (<1024px)               Desktop Viewport (≥1024px)
+-------------------------+             +---------------------------------------------------+
|     Dimmed Backdrop     |             | Main Workspace Header                             |
+-------------------------+             +-------------------+-------------------------------+
| Sheet Title    [X Close]|             | Filters (Sidebar) | Data Table / Content Grid     |
| - Filter Category 1     |    =====>   | - Category 1      |                               |
| - Filter Category 2     | Transition  | - Category 2      | Item 1   | $120,000 | Active |
| [ Apply Filters (142) ] | to Sidebar  | - Price Range     | Item 2   | $145,000 | Active |
+-------------------------+ or Modal    | [ Apply ]         | Item 3   | $160,000 | Pending|
                                        +-------------------+-------------------------------+
```

1. **Mobile (<1024px):** Slide-up bottom sheet with `fixed` position at bottom, `100%` width, draggable detents, and sticky footer.
2. **Desktop (≥1024px):** Converts seamlessly into either:
   - **Option A (Filter Sidebar):** Static vertical column (`width: 320px;`) alongside the search results grid.
   - **Option B (Centered Modal Dialog):** `<dialog>` modal centered on screen (`max-width: 560px; border-radius: 16px;`).

---

## 3. Accessibility & Focus State Wireframe

```text
[Tab Key Flow through Sheet]

 Trigger Button (PDP / List Page)
       │
       ▼  (opens sheet, traps focus inside)
  ┌─────────────────────────────────────────────────────────────┐
  │ [1. Close Button "✕"] ◄──────────────────────────────┐       │
  │                                                      │       │
  │ [2. Option Input: Size Small]                        │       │
  │ [3. Option Input: Size Medium]                       │       │
  │ [4. Option Input: Size Large]                        │       │
  │                                                      │       │
  │ [5. Primary Action: Add to Bag] ────(Tab Key Loop)───┘       │
  └─────────────────────────────────────────────────────────────┘
       │
       ▼  (Press Escape or Tap Close)
 Restores Focus back to Trigger Button
```

### Key Keyboard Shortcuts & Screen Reader Announcements
- **Opening Announcement:** Screen reader announces: *"Product Options, dialog modal, select size and color."*
- **`Escape` Key:** Immediately closes sheet and shifts focus back to trigger button.
- **`Tab` / `Shift+Tab`:** Rotates strictly between Close Button [1] and Primary Action [5].
- **Dynamic Counter Update:** When filters are adjusted inside the sheet, live updates (e.g. *"142 results found"*) are announced via `aria-live="polite"`.
