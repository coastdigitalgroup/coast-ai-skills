---
name: bottom-sheet-design-system
description:
  Design a mobile-first bottom sheet overlay system with configurable detents, drag affordances, safe area padding, responsive desktop modal/popover adaptation, and WCAG AA accessibility compliance.
---

# Bottom Sheet Design System

## Purpose

The Bottom Sheet Design System provides a standardized, mobile-first design framework for slide-up bottom sheets, action sheets, and modal bottom drawers on web interfaces and progressive web applications (PWAs). Modern mobile devices with large aspect ratios make top-positioned overlays and center modal popups difficult to reach with one hand. Bottom sheets anchor interactive tasks, context menus, filter controls, and detailed sub-views to the bottom of the screen within natural reach of the user's thumb.

Designing an effective bottom sheet system requires establishing detent snapping heights (peek/collapsed, partial/half-height, full-height), touch drag affordances (grab handles), background dimming (scrim/backdrop), body scroll lock mechanics, viewport safe-area insets (`env(safe-area-inset-bottom)`), and seamless responsive desktop transformation (converting bottom sheets into centered modals or popovers on wider viewports).

## Use Cases

- **Mobile Product Option Selectors:** Presenting size, color, quantity, and subscription cadence selectors on e-commerce product detail pages without navigating away from the PDP.
- **Mobile Filter & Sorting Controls:** Providing multi-facet filtering options for e-commerce catalog pages or SaaS search views with persistent bottom "Apply Filters" action bars.
- **Contextual Action Sheets:** Triggering 1-tap quick actions (Share, Bookmark, Add to List, Report) on social feeds, media cards, or data tables.
- **Location & Map Detail Cards:** Displaying expandable point-of-interest details or delivery tracking timelines that slide up over map views (peek detent to full-height expand).
- **Mobile Multi-Step Sub-Workflows:** Completing swift inline tasks such as checkout payment method selection, address picking, or quick feedback submission.

## When NOT to Use

- **Global Navigation Routing:** For primary application navigation across main sections, use `bottom-navigation-system` or `site-navigation-system`.
- **Destructive Confirmation Alerts:** For critical, irreversible actions (e.g., "Delete Account"), use a centered `overlay-and-dialog-system` modal dialog (`role="alertdialog"`) that demands explicit confirmation.
- **In-Page Collapsible Content:** For toggling expandable content inline within page flow, use `accordion-ui-system` or `tab-ui-system`.
- **Widescreen Desktop Layouts (>1024px):** Do not display full-width bottom sheets on desktop screens. Adapt the UI to centered modal dialogs (`overlay-and-dialog-system`), side drawers (`dashboard-layout-system`), or anchored popovers (`tooltip-and-hint-system`).

## Inputs

1. **Task Type & Depth:** Nature of the content (quick 1-tap action list vs. multi-field form vs. scrollable detail list).
2. **Detent Configuration:** Choice of snapping heights (Single Detent: 100% full height; Dual Detent: 50% half & 100% full; Triple Detent: 20% peek, 50% half, 90% full).
3. **Trigger Context:** Element or user action initiating the sheet (button tap, long press, swipe gesture, or deep link).
4. **Design Tokens:** Surface background colors, border radius, drag handle dimensions, elevation shadows, backdrop opacity, and typography scale.
5. **Desktop Adaptation Strategy:** Chosen layout transition for viewports ≥1024px (Convert to Centered Modal, Convert to Anchored Popover, or Convert to Slide-in Side Drawer).

## Outputs

1. **Bottom Sheet Anatomy Spec:** Layout blueprint defining the Drag Handle Bar, Header (Title + Close Button), Scrollable Body, Fixed Footer (CTA Bar), and Safe Area Inset padding.
2. **Detent Height & Gesture Token Matrix:** CSS variables and snapping threshold definitions (`--sheet-detent-peek`, `--sheet-detent-half`, `--sheet-detent-full`) with drag velocity dismissal rules.
3. **Backdrop & Elevation Spec:** Backdrop opacity tokens, backdrop blur filter settings, z-index hierarchy, and body scroll lock rules (`overflow: hidden` on body).
4. **Keyboard & Screen Reader ARIA Mapping:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap specification, and `Escape` key handler definitions.
5. **Responsive Desktop Adaptation Blueprint:** Media query breakpoints transforming mobile bottom sheets into centered modal dialogs or popovers for tablet and desktop.

---

## Workflow

### 1. Categorize Sheet Type and Detent Structure
Select the appropriate detent mode based on content volume and interaction frequency:
- **Non-Modal Action Sheet (Peek/Fit-Content):** Auto-sizes to fit short content (2–5 menu actions). Heights typically range between 180px and 320px. Dismisses upon action selection or backdrop tap.
- **Half-Height / Dual-Detent Sheet (50% & 90% Viewport):** Used for medium-density tasks like product variation picking or sorting. Opens at 50% height (`50vh`); dragging upward snaps to 90% height (`90vh`).
- **Full-Height / Expanding Sheet (90%–100% Viewport):** Used for complex mobile workflows like multi-facet filters or checkout steps. Provides a fixed header and footer with an internal scrollable body.

### 2. Define Visual Anatomy and Spatial Hierarchy
Construct the sheet using five distinct anatomical layers:
- **Backdrop (Scrim):** Fixed overlay covering the entire viewport (`background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); z-index: 1000;`).
- **Sheet Container:** Fixed panel anchored to bottom screen edge (`position: fixed; bottom: 0; left: 0; right: 0; border-radius: 16px 16px 0 0; background: var(--surface-bg); z-index: 1001;`).
- **Drag Handle Bar (Affordance):** Top-centered visual pill (`width: 36px; height: 5px; border-radius: 999px; background: var(--border-neutral); margin: 8px auto; cursor: grab;`).
- **Header Layer:** Contains sheet title (`h2`), optional subtitle, and explicit close button (`<button aria-label="Close sheet">✕</button>`).
- **Scrollable Body Layer:** Internal content container configured with `overflow-y: auto; -webkit-overflow-scrolling: touch;`.
- **Fixed Footer CTA Layer:** Bottom-anchored action bar with primary/secondary buttons and safe area inset padding (`padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px))`).

### 3. Establish Gestures, Snapping, and Dismissal Mechanics
Set up smooth touch interactions for physical gesture feedback:
- **Drag Affordance Interaction:** Dragging down on the drag handle or header moves the sheet down smoothly using `transform: translateY()`.
- **Snapping Thresholds:**
  - If dragged down past **30% of current height** or flicked downward with velocity > **0.5px/ms**, trigger full closure.
  - If dragged between 30% and 70% in dual-detent mode, snap to nearest detent (50% or 90%).
- **Scroll Locking Collision:** When dragging inside the scrollable body layer, only initiate sheet drag-to-dismiss if the body scroll position is at `scrollTop === 0` and the user swipes downward.
- **Body Scroll Lock:** When the modal bottom sheet is open, apply `overflow: hidden` to `document.body` to prevent background page scroll leaks.

### 4. Implement Viewport Safe Areas and Surface Contrast
Ensure full visual integration with mobile hardware display cutouts and light/dark modes:
- **Safe Area Inset Handling:** Always apply `padding-bottom: env(safe-area-inset-bottom, 16px)` to the sheet container or sticky footer so content/buttons are not covered by iOS Home indicators.
- **Maximum Height Cap:** Cap full-height sheets at `max-height: calc(100vh - 48px)` or `max-height: calc(100dvh - 48px)` to leave a visible 48px slice of the dimmed parent page context at the top.
- **Surface Elevation:** Use deep elevation shadow tokens (`box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15)`) to create separation from background page content.

### 5. Configure Accessibility and Keyboard Navigation
Ensure full compliance with WCAG 2.1 / 2.2 AA standards:
- **ARIA Roles:** Container must use `role="dialog"` or `role="region"` (for non-modal peeking sheets), `aria-modal="true"`, and `aria-labelledby="sheet-title-id"`.
- **Focus Management:**
  - Upon opening, programmatically shift focus to the first focusable element inside the sheet or the close button.
  - Implement a **focus trap** preventing `Tab` or `Shift+Tab` from escaping the sheet into the inert background.
  - Upon closing, restore focus to the trigger element that opened the sheet.
- **Keyboard Controls:** Pressing `Escape` must immediately close the sheet.
- **Screen Reader Announcements:** Dynamic content changes inside the sheet must use `aria-live="polite"` regions.

### 6. Design Responsive Desktop Adaptation
Bottom sheets look unpolished when stretched full-width across desktop monitors (≥1024px). Implement explicit responsive transformation rules:
- **Desktop Modal Mode (Default):** On viewports ≥1024px, transition the bottom sheet into a centered modal dialog (`width: 100%; max-width: 540px; border-radius: 16px; margin: auto; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);`).
- **Desktop Popover Mode (Context Menus):** For quick action sheets, transition the sheet into an anchored popover positioned adjacent to the trigger button.
- **Desktop Side Drawer Mode (Complex Forms/Filters):** For deep multi-facet filters or multi-step flows, transition into a right-aligned slide-in side drawer (`width: 400px; height: 100vh; top: 0; right: 0; border-radius: 16px 0 0 16px;`).

---

## Decision Rules

### Detent Selection Matrix

| Sheet Type | Detent Configuration | Content Volume | Ideal Use Case |
| :--- | :--- | :--- | :--- |
| **Action Sheet** | Fit-content (Single Detent) | 2–6 action links / items | Quick share, contextual menu, simple option switch. |
| **Selection Sheet** | Dual Detent (50vh initial, 90vh expanded) | 5–15 scrollable items | Product size/color picker, address selector, payment method. |
| **Interactive Drawer** | Triple Detent (120px peek, 50vh, 90vh) | Complex spatial/map data | Delivery tracking map cards, live transit stops, ride-share details. |
| **Full Flow Sheet** | Single Detent (90vh - 100vh fixed) | Multi-section form / filters | Catalog multi-filters, mobile checkout step, survey workflow. |

### Desktop Transformation Choice
- **Use Centered Modal:** When sheet contains structured forms, variation selectors, or checkout options.
- **Use Anchored Popover:** When sheet contains short contextual actions (Share, Edit, Delete).
- **Use Side Drawer:** When sheet contains filter controls or editing panels on dashboards and data tables.

---

## Constraints

- **Accessibility (WCAG 2.1 / 2.2 AA):**
  - Must provide explicit focus trapping when `aria-modal="true"` is active.
  - Touch targets for all internal items and close buttons must measure at least **44x44px** (WCAG 2.5.8 / 2.5.5).
  - Background content behind modal bottom sheets must be marked `inert` or hidden from assistive technology.
- **Touch & Gesture Sizing:**
  - Drag handle hit target must be enlarged with invisible padding (`min-height: 24px`, `min-width: 60px`) even if the visual handle is 36x5px.
- **Viewport Dynamic Units:**
  - Use `dvh` (dynamic viewport height) where supported (`height: 90dvh`), falling back to `vh` to accommodate dynamic mobile address bar expansions and collapses.

---

## Common Failure Patterns

- **The Missing Safe Area Padding:** Omitting `env(safe-area-inset-bottom)`, causing primary footer action buttons to overlap with iOS gesture bars.
- **Stretched Full-Width Desktop Sheets:** Allowing a mobile bottom sheet to expand to 1920px width on desktop monitors.
- **Scroll Hijacking Lockup:** Failing to separate content scrolling from sheet drag-to-dismiss gestures, causing the sheet to collapse when a user attempts to scroll down through text.
- **Missing Keyboard Escape Handler:** Omitting the `Escape` key event listener, trapping desktop keyboard users inside the modal sheet overlay.
- **Focus Leak to Background:** Leaving background page elements reachable via `Tab` key while a modal bottom sheet is open.

---

## Validation Criteria

- [ ] Sheet layout includes explicit visual drag affordance, header with title, scrollable body, and sticky footer.
- [ ] Safe area inset (`padding-bottom: env(safe-area-inset-bottom)`) is implemented on sticky footer and sheet container.
- [ ] Drag handle hit zone meets minimum 44px height for touch accessibility.
- [ ] Sheet uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and traps focus while active.
- [ ] Pressing `Escape` or tapping backdrop closes the modal sheet and restores focus to the trigger button.
- [ ] Background body scrolling is locked (`overflow: hidden`) when modal sheet is open.
- [ ] Viewports ≥1024px cleanly transform bottom sheet into a centered modal dialog, popover, or side drawer.
