---
name: bottom-sheet-design-system
description:
  Design and structure mobile-first slide-up bottom sheets, action sheets, and
  modal bottom drawers with configurable detents, drag affordances, safe area
  handling, desktop modal adaptation, and WCAG AA accessibility.
---

# Bottom Sheet Design System

## Purpose

The Bottom Sheet Design System provides a comprehensive framework for designing, structuring, and adapting mobile-first bottom sheets (slide-up sheets, action sheets, and modal bottom drawers). Mobile touch interfaces require ergonomics centered on natural thumb reach zones (the lower half of screen viewports). Standard desktop center-aligned modals or top-aligned drop-down menus force awkward hand re-gripping and obscure active content on narrow mobile screens.

This system solves mobile contextual task density by establishing structured height detents (peek, expanded half-screen, and full-screen), visual drag affordances, soft keyboard avoidances, safe-area inset spacing, smooth gesture response, and seamless desktop adaptation (transforming into centered dialogs or anchored popovers).

## Use Cases

- **Mobile Action Sheets & Context Menus:** Offering secondary operations (Share, Duplicate, Delete, Export) anchored near the user's thumb without navigating away from the active screen.
- **E-Commerce Product Option Selectors:** Allowing users to choose product size, color variants, or add-ons directly from category cards or cart drawers.
- **Complex Mobile Filtering & Sorting:** Providing multi-facet filter controls, sorting toggles, and range sliders in an expandable bottom surface.
- **Location & Checkout Summaries:** Presenting address confirmation, payment method picking, order total breakdowns, or delivery window choices.
- **Media & Audio Controls:** Displaying queue lists, playback speed selectors, and track detail options in audio and video web apps.

## When NOT to Use

- **Primary Page-to-Page Navigation:** Do not use bottom sheets as main site navigation menus; use `bottom-navigation-system` or `site-navigation-system` instead.
- **Inline Desktop-First Workflows:** If designing specifically for widescreen desktop viewports without mobile constraints, standard popovers (`popover-api-implementation`) or modal dialogs (`overlay-and-dialog-system`) are more direct.
- **Simple Single-Choice Confirmations:** For simple binary actions ("Are you sure you want to delete this file? [Cancel] [Delete]"), use a standard alert dialog or `overlay-and-dialog-system`.
- **Transient Status Announcements:** For passive, non-interactive status notifications ("Link copied to clipboard"), use `toast-and-snackbar-system`.

## Inputs

1. **Content Inventory & Complexity:** Alphanumeric lists, form inputs, action menus, or multi-step checkout tasks.
2. **Viewport Context & Breakpoints:** Viewport dimensions (specifically mobile vs. tablet/desktop thresholds at 768px).
3. **Ergonomic & Task Hierarchy:** Required sheet states (peek state vs. half-expanded vs. full-screen takeover).
4. **Platform Insets & Safe Areas:** Devices with home indicator bars, dynamic islands, or visual viewport adjustments for software keyboards.
5. **Brand Design Tokens:** Surface backgrounds, elevation depth shadows, border radii, handle bar dimensions, and typography scales.

## Outputs

1. **Detent Height Specification Map:** Exact vertical threshold definitions (`peek: 120px`, `half: 50vh`, `full: 90vh - env(safe-area-inset-top)`).
2. **Anatomy & Elevation Blueprint:** Surface layout defining handle bar zone, fixed header, scrollable body, sticky footer action dock, and backdrop scrim depth.
3. **Responsive Adaptation Rules:** Media query guidelines for converting slide-up bottom sheets into centered modal dialogs or popovers on desktop viewports (≥768px).
4. **Accessibility & Keyboard Map:** Focus trap definitions, `aria-modal`, `role="dialog"`, keyboard shortcuts (`Escape`, `Arrow` keys), and live region announcements.

---

## Workflow

### 1. Classify Bottom Sheet Variant and Interruption Level

Select the structural model based on user intent and task urgency:

- **Non-Modal Bottom Sheet (Persistent/Peek Sheet):** Remains visible alongside main content with no background backdrop scrim. Users can interact with both the parent page and the bottom sheet. Ideal for audio players, map route summaries, or live chat input bars.
- **Modal Bottom Sheet (Standard Drawer):** Displays above background content with an opaque backdrop scrim (30–50% opacity). Blocks interaction with the underlying page until dismissed or completed. Ideal for variant selection, filters, and form entries.
- **Action Sheet:** Brief, single-column list of contextual actions or options (3–6 items) plus an explicit "Cancel" button. Appears anchored to the bottom edge with high visual contrast. Ideal for quick tap-and-dismiss tasks.

### 2. Define Detent Height Architecture

Configure sheet snap points using viewport height CSS custom properties (`vh` or `dvh`):

```css
:root {
  --sheet-detent-peek: 120px;
  --sheet-detent-half: 50dvh;
  --sheet-detent-full: calc(100dvh - var(--safe-area-inset-top, 16px));
}
```

- **Peek State (10% - 20% dvh / ~120px):** Exposes minimal summary information (e.g., "3 items selected • $45.00") and a pull handle affordance.
- **Half-Expanded State (40% - 60% dvh / ~50dvh):** Default open state for standard lists, filters, or action items. Leaves top half of screen visible for context.
- **Full-Expanded State (85% - 95% dvh):** Triggered when content exceeds half height or when scrolling internal lists. Must respect `--safe-area-inset-top` to avoid overlapping system status bars.

### 3. Establish Physical Layout Anatomy and Hierarchy

Structure the sheet layer into four explicit spatial zones:

1. **Header & Drag Zone:**
   - **Handle Bar Affordance:** Center-aligned pill (`width: 36px` to `48px`, `height: 4px` to `5px`, `border-radius: 999px`, low-contrast neutral gray fill).
   - **Sheet Title:** Left-aligned or centered `<h2>` heading (18px - 20px semi-bold).
   - **Dismiss Action:** Explicit top-right "Close" icon button (`44x44px` minimum tap target) for touch and keyboard screen reader users.
2. **Scrollable Content Body:**
   - `overflow-y: auto; overscroll-behavior-y: contain;` to prevent touch scroll bleeding into the main document body.
   - Internal horizontal padding (`16px` to `24px`).
3. **Sticky Action Dock (Footer):**
   - Fixed at the sheet bottom using `position: sticky; bottom: 0;`.
   - Incorporates `padding-bottom: env(safe-area-inset-bottom, 16px)` to avoid overlapping home indicator bars on gesture-nav devices.
   - Houses primary CTAs ("Apply Filters", "Add to Cart", "Confirm Selection").
4. **Backdrop Scrim:**
   - Translucent overlay (`background-color: rgba(0, 0, 0, 0.4)` or CSS `backdrop-filter: blur(4px)`).
   - Tap-outside handler closes non-destructive sheets.

### 4. Implement Safe-Area and Soft Keyboard Mechanics

Mobile soft keyboards shrink the visual viewport dramatically when inputs inside bottom sheets receive focus:

- **Visual Viewport Syncing:** Bind sheet height or position to `window.visualViewport.height` or use CSS `dvh` units so inputs remain focused above the soft keyboard.
- **Safe Area Insets:** Always incorporate `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` into padding calculations.

### 5. Define Responsive Desktop Adaptation Rules

Bottom sheets designed for mobile (320px - 767px) look stretched and awkward on desktop viewports (768px+). Apply media queries to transform bottom sheets on larger viewports:

- **Desktop Pattern Option A: Centered Modal Dialog (`min-width: 768px`)**
  - Convert bottom slide-up surface into a center-aligned floating modal (`max-width: 560px`, `border-radius: 16px`, `margin: auto`).
  - Hide the drag handle bar (`display: none`).
- **Desktop Pattern Option B: Anchored Popover / Dropdown (`min-width: 768px`)**
  - For action sheets or filter controls, anchor the overlay to the trigger button using CSS anchor positioning or popover positioning.

---

## Decision Rules

### Sheet Height and Detent Selection

| Scenario / Task Type | Recommended Default State | Detent Configuration |
| :--- | :--- | :--- |
| **Action Sheet (3–5 menu buttons)** | Auto Content Height | Fixed (`max-content` + safe area) |
| **Filter & Facet Selector** | Half-Expanded (50dvh) | Dual Detent (50dvh $\leftrightarrow$ 90dvh) |
| **Product Option Picker (Size/Color)** | Auto / Compact (40dvh) | Single Detent (Content height) |
| **Full Form Entry / Multi-Step Checkout** | Full-Expanded (90dvh) | Fixed Full Detent (90dvh) |
| **Persistent Audio/Map Widget** | Peek State (120px) | Triple Detent (120px $\leftrightarrow$ 50dvh $\leftrightarrow$ 95dvh) |

### Backdrop Interaction Rules

- **Tap Backdrop to Dismiss:** Enable for non-destructive selections, menus, and filter previews.
- **Block Backdrop Dismissal:** Require explicit "Cancel" or "Close" button taps if user has uncommitted form data or destructive choices.

---

## Constraints

- **Accessibility (WCAG 2.2 AA Compliance):**
  - **Role & Modal Semantics:** Sheet container must feature `role="dialog"` (or `role="alertdialog"`) and `aria-modal="true"`.
  - **Labeling:** Must be linked to a visible title via `aria-labelledby="sheet-title-id"`.
  - **Focus Management:** Upon expansion, shift focus to the sheet container or first focusable control. Trap focus within the sheet while open. Return focus to the trigger element on dismissal.
  - **Keyboard Esc Key:** Hitting `Escape` must dismiss the bottom sheet immediately.
  - **Touch Target Floor:** All buttons, close icons, and list items must maintain a minimum target size of `44x44px` with `8px` separation.
- **Scroll & Overscroll Containment:**
  - Body background scrolling must be locked (`overflow: hidden` on `<body>` or `touch-action: none` on backdrop).
  - Internal content container must specify `overscroll-behavior-y: contain`.

---

## Common Failure Patterns

- **Unreachable Input Fields Behind Soft Keyboards:** Failing to handle `visualViewport` dynamic height shifts, causing software keyboards to cover inputs at the bottom of the sheet.
- **Missing Safe Area Insets:** Forgetting `env(safe-area-inset-bottom)` on sticky footer action docks, placing primary CTA buttons directly over home gesture bars.
- **Scroll-Lock Conflict (Nested Scrolling):** Dragging down on scrollable list content inside the sheet accidentally triggers content scroll AND sheet dismiss gestures simultaneously.
- **Stretching Unmodified Across Widescreen Monitors:** Displaying a 100% width bottom sheet on a 27-inch desktop display, creating stretched buttons and poor visual composition.
- **Inaccessible Drag-Only Sheets:** Relying solely on drag gesture touch listeners without offering explicit "Close" buttons or keyboard `Escape` support.

---

## Validation Criteria

- [ ] **Structural Anatomy:** Bottom sheet features handle bar, header with title and close button, scrollable body, sticky action dock, and safe area insets.
- [ ] **Detent Heights Configured:** Snap heights use `dvh` or explicit pixel calculations matching content density.
- [ ] **Desktop Responsive Adaptation:** On viewports $\ge 768px$, sheet smoothly transitions into a centered dialog modal or anchored popover.
- [ ] **Keyboard & Focus Safety:** Focus is trapped when open, `Escape` key closes the sheet, and focus restores to trigger on exit.
- [ ] **Safe Area & Viewport Handling:** Sticky footer padding includes `env(safe-area-inset-bottom)` and inputs remain visible above soft keyboards.
- [ ] **WCAG AA Conformance:** Touch targets $\ge 44x44px$, text contrast $\ge 4.5:1$, and ARIA roles (`role="dialog"`, `aria-modal="true"`) are present.
