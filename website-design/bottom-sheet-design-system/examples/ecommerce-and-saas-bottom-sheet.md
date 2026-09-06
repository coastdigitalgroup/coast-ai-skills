# E-Commerce & SaaS Bottom Sheet Layout Examples

This document provides complete spatial design breakdowns and ASCII structural diagrams for two real-world bottom sheet patterns:
1. **E-Commerce Faceted Filter & Sort Drawer** (Expanding multi-detent sheet with sticky action footer).
2. **SaaS Contextual Action & Share Sheet** (Compact content-fit action sheet with keyboard and screen reader accessibility).

---

## Example 1: E-Commerce Faceted Filter & Sort Drawer

### Problem Scenario
A mobile e-commerce clothing catalog with 450+ items requires multi-facet filtering (Category, Size, Price Range, In-Stock Toggle, Rating) without navigating away from the Product Listing Page (PLP). Users on mobile devices need single-handed thumb access to adjust filters and instantly see updated product count results.

### Visual ASCII Anatomy

```text
+-------------------------------------------------------------+
| Mobile Viewport (390px x 844px)                            |
| [ Background PLP Grid - Dimmed & Blurred backdrop scrim ]   |
|                                                             |
| +---------------------------------------------------------+ |
| |                    [=== Drag Handle ===]                | | <-- 48px Touch Grab Target
| |                                                         | |
| | Filter Products                              [X Close]  | | <-- Header Bar (56px)
| +---------------------------------------------------------+ |
| | SCROLLABLE SHEET BODY (overscroll-behavior: contain)    | |
| |                                                         | |
| | Sort By                                                 | |
| | (•) Featured   ( ) Price: Low to High   ( ) Newest      | | <-- Radio Group
| |                                                         | |
| | Category                                                | |
| | [x] Outerwear (142)  [ ] Shirts (88)  [x] Denim (64)   | | <-- Custom Checkboxes
| |                                                         | |
| | Size                                                    | |
| | +-----+  +-----+  +-----+  +-----+  +-----+             | |
| | | XS  |  |  S  |  | [M] |  | [L] |  | XL  |             | | <-- 48x48px Touch Pills
| | +-----+  +-----+  +-----+  +-----+  +-----+             | |
| |                                                         | |
| | Price Range                                             | |
| | $25 -------------------o=======o------------------ $250 | | <-- Range Slider
| | $50 - $150                                              | |
| |                                                         | |
| | Options                                                 | |
| | [x] On Sale Only       [ ] Express Shipping Eligible    | |
| |                                                         | |
| +---------------------------------------------------------+ |
| | STICKY FOOTER ACTION BAR                                | |
| | +-----------------------+ +---------------------------+ | |
| | | Clear All (120px)     | | Apply (284 Products)      | | | <-- Dual Primary CTA
| | +-----------------------+ +---------------------------+ | |
| |                                                         | |
| | [==== iOS Home Indicator Safe Area Padding: 34px ====]  | | <-- env(safe-area-inset-bottom)
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+
```

### Spatial & Design Token Specifications

- **Sheet Elevation & Surface:**
  - Background: `var(--surface-elevated, #FFFFFF)` (Light) / `var(--surface-elevated-dark, #1F2937)` (Dark).
  - Top Radius: `20px 20px 0 0`.
  - Elevation Shadow: `0 -10px 30px rgba(0, 0, 0, 0.15)`.
- **Drag Handle:**
  - Width: `40px`, Height: `4px`, Border Radius: `999px`.
  - Color: `var(--neutral-400, #9CA3AF)`.
  - Touch Zone: `padding: 12px 0` creating a full 48px touch grab height.
- **Detent Snap Point:**
  - Initial snap height: `75vh` (75% viewport height).
  - Expandable gesture snap height: `92vh`.
- **Sticky Footer Bar:**
  - Position: Sticky bottom inside sheet container.
  - Background: `var(--surface-elevated)` with top border `1px solid var(--border-subtle, #E5E7EB)`.
  - Padding: `16px 16px calc(16px + env(safe-area-inset-bottom, 0px)) 16px`.
  - Primary CTA: Height `48px`, Font `16px / 600 weight`, Full width or split 30/70 with "Clear All".

---

## Example 2: SaaS Contextual Action Sheet

### Problem Scenario
A SaaS collaborative document workspace app requires a mobile context menu triggered when tapping a document item's `⋮` options icon. The sheet presents high-frequency quick actions (Share Link, Duplicate, Rename, Download PDF, Move to Trash).

### Visual ASCII Anatomy

```text
+-------------------------------------------------------------+
| Mobile Viewport (390px x 844px)                            |
|                                                             |
| +---------------------------------------------------------+ |
| |                    [=== Drag Handle ===]                | |
| |                                                         | |
| | Q3 Financial Report.pdf                                 | | <-- Item Title
| | Updated 2 hours ago by Sarah Jenkins                    | | <-- Meta Subtitle
| +---------------------------------------------------------+ |
| | ACTION BUTTON LIST (role="menu" or stacked buttons)     | |
| |                                                         | |
| |  [🔗]  Share Document Link                       >     | | <-- 52px Touch Target
| |  -----------------------------------------------------  | |
| |  [📋]  Make a Copy / Duplicate                   >     | |
| |  -----------------------------------------------------  | |
| |  [✏️]  Rename File                               >     | |
| |  -----------------------------------------------------  | |
| |  [📥]  Export as PDF                             >     | |
| |  -----------------------------------------------------  | |
| |  [🗑️]  Move to Trash (Destructive)                >     | | <-- Danger State Red
| |                                                         | |
| | +-----------------------------------------------------+ | |
| | | Cancel                                              | | | <-- Full-Width Cancel Button
| | +-----------------------------------------------------+ | |
| |                                                         | |
| | [==== iOS Home Indicator Safe Area Padding: 34px ====]  | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+
```

### Accessibility & Interaction Design Features

1. **Focus Management:**
   - Opening trigger stores element ref in JS: `const triggerEl = document.activeElement;`.
   - On sheet opening, focus automatically shifts to the first active action button (`[🔗] Share Document Link`).
   - Tapping `Escape` key or clicking `Cancel` immediately closes the sheet and returns focus to `triggerEl`.
2. **Touch Targets:**
   - Every stacked action item provides a `min-height: 52px` and full-width touch area.
   - Active state feedback: Brief background highlight (`var(--surface-hover, #F3F4F6)`) on press.
3. **Contrast Ratios:**
   - Action label text: `4.5:1` contrast ratio (`#111827` on `#FFFFFF`).
   - Destructive item label (`Move to Trash`): High-contrast danger red (`#DC2626`).

---

## Desktop Adaptation Breakdown

When the screen width expands to `≥768px` (Tablets) or `≥1024px` (Desktop Widescreens), the mobile bottom sheet automatically adapts:

```text
DESKTOP ADAPTATION (Viewport >= 768px)

Option A: Centered Modal Dialog (Best for Pickers & Short Forms)
+-------------------------------------------------------------+
| Desktop Screen (1440px x 900px)                             |
| +---------------------------------------------------------+ |
| | [ Dimmed Backdrop Overlay ]                             | |
| |                                                         | |
| |       +-----------------------------------------+       | |
| |       | Q3 Financial Report.pdf        [X]      |       | |
| |       +-----------------------------------------+       | |
| |       | [🔗] Share Document Link                |       | |
| |       | [📋] Make a Copy / Duplicate            |       | |
| |       | [✏️] Rename File                        |       | |
| |       | [📥] Export as PDF                      |       | |
| |       | [🗑️] Move to Trash                      |       | |
| |       +-----------------------------------------+       | |
| |       Max Width: 480px, Centered in Viewport            | |
| |                                                         | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+

Option B: Right Side Drawer (Best for Heavy Filter Forms)
+-------------------------------------------------------------+
| Desktop Screen (1440px x 900px)                             |
| +-----------------------------------------------+---------+ |
| | PLP Product Grid Content                      | FILTER  | |
| | (Spans 1020px)                                | DRAWER  | |
| |                                               | (420px) | |
| |                                               |         | |
| |                                               | Fixed   | |
| |                                               | Right   | |
| +-----------------------------------------------+---------+ |
+-------------------------------------------------------------+
```
