---
name: bottom-sheet-design-system
description:
  Design mobile-first bottom sheets, action sheets, and modal bottom drawers with configurable
  detent snap points, drag handles, safe area paddings, responsive desktop modal/popover adaptation,
  and WCAG AA accessibility compliance.
---

# Bottom Sheet Design System

## Purpose

The Bottom Sheet Design System provides a mobile-first spatial framework for designing slide-up bottom sheets, action sheets, and multi-detent drawer overlays on mobile web interfaces and progressive web applications (PWAs). Modern mobile devices with large aspect ratios place top-anchored modals out of easy reach for single-handed thumb interaction. Bottom sheets anchor content, contextual actions, filters, and forms to the bottom of the viewport within natural thumb reach.

Designing an effective bottom sheet system requires balancing detent snap points (peek, half, expanded), swipe gesture affordances (drag handle indicators), vertical scroll containment, screen reader focus management, safe-area inset handling (`env(safe-area-inset-bottom)`), and seamless desktop adaptation rules (transitioning into centered modals, side drawers, or popovers on wider viewports). This skill establishes design patterns and spatial specifications in strict compliance with WCAG AA accessibility guidelines.

## Use Cases

- **E-Commerce Mobile Filtering & Sorting:** Sliding up multi-facet category filters (price ranges, size selectors, brand checkboxes) without forcing users onto a separate page.
- **Mobile Action Sheets & Share Menus:** Presenting contextual actions (e.g., Share Product, Save to List, Download Spec Sheet, Report Item) directly triggered by a primary UI element.
- **Form Pickers & Options Drawers:** Selecting complex options such as shipping address selection, payment method selection, date/time scheduling, or product variant customization.
- **Mobile Shopping Cart & Checkout Summaries:** Revealing expandable order subtotals, promo code inputs, and delivery speed choices in a multi-detent sheet above a sticky CTA bar.
- **Interactive Map & Location Details:** Displaying store detail panels or search results on top of a map view (peeking detent showing basic card, expanding detent revealing full details).

## When NOT to Use

- **Global Navigation Menus:** For top-level app structure or site-wide navigation links, use `bottom-navigation-system`, `site-navigation-system`, or `sidebar-navigation-system`.
- **Destructive Confirmation Prompts:** For critical alert dialogs requiring immediate user acknowledgement (e.g., "Delete Account?"), use `overlay-and-dialog-system` (standard modal dialog with background lock).
- **Simple Inline Selections:** For standard native-like select menus with 3–7 static text options, use `custom-select-and-combobox-system`.
- **Transient Notifications:** For non-modal, auto-dismissing system feedback or status alerts, use `toast-and-snackbar-system` or `banner-and-alert-system`.

## Inputs

1. **Content Type & Structure:** Form controls, action buttons, list options, or map/detail information cards.
2. **Interaction Mode:** Non-modal (scrollable backdrop active) vs. Modal (scrim overlay blocking lower page interaction).
3. **Detent Configuration:** Fixed height (content-driven), single snap point (e.g., 50vh), or multi-detent (peek 15vh / half 50vh / full 90vh).
4. **Design Tokens:** Color palettes, backdrop surface tokens, elevation shadows, typography styles, drag handle sizing, border radius tokens, and safe area variables.
5. **Responsive Desktop Fallback Strategy:** Preference for converting the sheet on desktop (Centered Modal, Right Side Drawer, or Anchored Popover).

## Outputs

1. **Bottom Sheet Layout Spec & Anatomy:** Spatial blueprint defining header title, sticky action footer, drag handle indicator, content scroll viewport, and corner radii.
2. **Detent State & Height Definition:** Height rules and CSS/JS state definitions for Peek (collapsed), Half-expanded (initial focus), and Fully-expanded detents.
3. **Backdrop & Scrim Specifications:** Visual contrast definitions for modal backdrop opacity, backdrop blur (`backdrop-filter`), and dismissal tap zones.
4. **Touch & Safe-Area Inset Guidelines:** Rules for handling iOS Home Indicator padding (`env(safe-area-inset-bottom)`) and mobile visual viewport shifts during keyboard display.
5. **Responsive Desktop Adaptation Blueprint:** Media query breakpoints and transform rules converting bottom sheets into desktop dialogs or side sheets at screen widths ≥768px or ≥1024px.

---

## Workflow

### 1. Classify Sheet Type and Detent Strategy
Determine the appropriate sheet structure based on user task length and complexity:

- **Non-Modal Peek Sheet (Multi-Detent):**
  - Used when underlying page content (e.g., interactive map, live route, or media canvas) must remain visible and interactive.
  - *Detent Snap Points:* Peek (10–15% viewport height), Half (45–50% viewport height), Full (85–90% viewport height).
- **Modal Action Sheet (Content-Fit Detent):**
  - Used for short lists of contextual actions (3–6 buttons).
  - *Detent Snap Points:* Content-fit auto height (`max-height: 80vh`), snapped to natural content bounds with an semi-transparent dim backdrop overlay.
- **Modal Form / Filter Drawer (Expanding Detent):**
  - Used for complex forms, filter groups, or multi-step picker tasks.
  - *Detent Snap Points:* Opens directly at 60–70% viewport height, expandable to 92% max viewport height.

### 2. Define Spatial Layout and Anatomy Tokens
Build the bottom sheet container anchored to the bottom edge of the screen:

- **Container Positioning:** Use `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;`.
- **Top Corner Radius:** Apply generous top corner radii to signal a mobile drawer surface (`border-radius: 20px 20px 0 0` or `1.25rem 1.25rem 0 0`).
- **Drag Handle Indicator (Affordance):**
  - Center a visible drag pill bar at the top of the sheet header.
  - Dimensions: Width 36px–48px, Height 4px–5px, Border Radius 999px.
  - Color: Subtle neutral line (`var(--border-strong, #9CA3AF)`) centered with 8px–12px vertical margin.
- **Sheet Header Bar:**
  - Contains drag handle, sheet title (18px/1.125rem bold), subtitle (optional), and an explicit close button (`<button aria-label="Close sheet">`).
  - Height: 48px to 56px, fixed position within the sheet container.
- **Scrollable Body Region:**
  - Wraps variable content with `overflow-y: auto; overscroll-behavior: contain;`.
  - Max height: `calc(90vh - header_height - footer_height - safe_area_inset)`.
- **Sticky Footer Action Bar:**
  - Pins primary call-to-actions (e.g., "Apply 4 Filters", "Confirm & Pay") at the bottom of the sheet container above safe area paddings.
  - Padding: `16px 16px calc(16px + env(safe-area-inset-bottom, 0px)) 16px`.

### 3. Establish Scrim, Backdrop, and Elevation Tokens
Separate the sheet from the underlying page content using surface elevation and scrims:

- **Modal Backdrop Scrim:**
  - Background: `rgba(0, 0, 0, 0.5)` with `backdrop-filter: blur(4px)`.
  - Transition: Fade-in opacity (150ms–200ms ease-out).
  - Dismissal: Tapping backdrop triggers sheet closure (except during active form input with unsaved changes).
- **Surface Elevation:**
  - Apply deep elevation shadow: `box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1);`.
  - Dark Mode Surface: Use elevated surface color (`var(--surface-elevated, #1F2937)`) with high-contrast subtle top border (`border-top: 1px solid rgba(255, 255, 255, 0.1)`).

### 4. Manage Safe Areas and Visual Viewport Offsets
Prevent sheet truncation caused by device hardware and software soft keyboards:

- **Safe Area Inset Handling:**
  ```css
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background-color: var(--sheet-surface);
    border-radius: 20px 20px 0 0;
  }
  ```
- **Virtual Keyboard Management:**
  - When text inputs inside the bottom sheet focus on mobile devices, the visual viewport shrinks due to the soft keyboard.
  - Set `max-height: 100%` relative to `window.visualViewport.height` or anchor active input into scroll view to prevent buttons from hiding behind the keyboard.

### 5. Implement Responsive Desktop Adaptation
Bottom sheets spanning full 1920px screen widths on desktop look awkward and create stretched touch targets. Adapt sheet layouts based on viewport width:

- **Mobile Viewport (<768px):** Render fixed full-width bottom sheet with slide-up animation from `transform: translateY(100%)` to `transform: translateY(0)`.
- **Tablet & Desktop Viewport (≥768px):** Convert bottom sheet into one of three desktop patterns:
  1. **Centered Modal Dialog:** Center the panel in screen (`position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; max-width: 560px; border-radius: 16px;`).
  2. **Right Side Drawer:** Slide out from right edge (`position: fixed; top: 0; right: 0; bottom: 0; width: 420px; border-radius: 0;`). Best for complex multi-section filter forms.
  3. **Anchored Popover / Flyout:** Position panel relative to the trigger element (`width: 360px; border-radius: 12px;`). Best for short action menus or color/date pickers.

---

## Decision Rules

### Choice of Bottom Sheet Layout Pattern

| Pattern | Detent Height | Trigger / Content Type | Desktop Adaptation |
| :--- | :--- | :--- | :--- |
| **Action Sheet** | Auto height (`max-height: 50vh`). | 3–6 stacked option buttons or share links. | Anchored Popover or Centered Small Modal. |
| **Filter Drawer** | Medium to High (`60vh` expand to `90vh`). | Multi-accordion form filters, search facets. | Right Side Drawer (420px) or Centered Modal (640px). |
| **Content Picker** | Fixed height (`70vh`). | Shipping address selection, payment cards, specs. | Centered Modal Dialog (560px). |
| **Map / Multi-Detent Sheet** | 3 Snap Points (`15vh` / `50vh` / `90vh`). | Store details, active navigation route, item feed. | Persistent Side Rail or Split-Screen Panel. |

---

## Constraints

- **Accessibility (WCAG 2.1 / 2.2 AA Compliance):**
  - **SC 2.1.1 Keyboard Accessibility:** Sheet must open and close seamlessly via keyboard. `Escape` key must close active modal sheets.
  - **SC 2.4.3 Focus Order & Focus Trapping:** When a modal sheet opens, keyboard focus (`Tab`) must automatically move into the sheet container and be trapped within it until closed. On closure, focus must return to the trigger element.
  - **SC 4.1.2 Name, Role, Value:** Sheet wrapper must use `role="dialog"` or `role="region"`, `aria-modal="true"` (for modal sheets), `aria-labelledby="sheet-title-id"`, and `aria-describedby="sheet-desc-id"`.
  - **SC 2.5.8 Target Size (Minimum):** Drag handle touch target area and header close button must provide at least 48x48px accessible touch bounds.
- **Scroll Containment:** Scrolling within the sheet body must not trigger underlying body page scroll (`overscroll-behavior: contain;`). Body element behind modal sheet should receive `overflow: hidden;`.
- **Motion Reduction:** Respect user system preferences (`@media (prefers-reduced-motion: reduce)`). Replace continuous slide animations with instantaneous opacity fades.

---

## Common Failure Patterns

- **The Missing Keyboard Trap:** Allowing keyboard focus (`Tab` key) to cycle behind the open modal bottom sheet into hidden background links.
- **Gesture Collisions:** Dragging downwards inside a scrollable sheet body causes the sheet to close accidentally when the user merely intended to scroll up to view top content.
- **Keyboard Cover-Up:** Soft native mobile keyboards popping up over input fields inside bottom sheets, completely hiding submit buttons without updating scroll bounds.
- **Omitted Desktop Transformation:** Displaying an 1800px-wide bottom sheet across ultra-wide desktop monitors with massive blank margins and stretched button bars.
- **Missing Explicit Close Button:** Relying solely on downward swipe gestures or drag handles to close sheets, stranding screen reader users or users using mouse controllers without touch capability.

---

## Validation Criteria

- [ ] Sheet layout includes drag handle indicator, clear title header, and explicit close button.
- [ ] Header close button and primary action buttons meet WCAG 48x48px touch target requirements.
- [ ] Safe area bottom padding (`env(safe-area-inset-bottom)`) is applied to sheet footers to prevent iOS indicator overlap.
- [ ] Modal bottom sheets trap focus within the sheet while open and return focus to the trigger on close.
- [ ] Pressing `Escape` key dismisses open modal bottom sheet.
- [ ] Sheet wrapper includes appropriate ARIA semantics (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
- [ ] On tablet/desktop viewports (≥768px), sheet cleanly transforms into a centered modal, side drawer, or popover.
- [ ] Reduced motion prefers media query disables sliding animations in favor of simple fades.
