# Bottom Sheet Implementation Audit Checklist

Use this checklist to audit any dynamic mobile bottom sheet or slide-up panel implementation to ensure complete accessibility compliance, high-fidelity gesture physics, visual stability, and responsive performance.

---

## 1. Accessibility & ARIA Semantics (WCAG AA Compliance)

- [ ] **Modal Roles:** Does the sheet container panel explicitly carry `role="dialog"` or `role="alertdialog"`?
- [ ] **Modal Attribute:** Does the sheet panel include `aria-modal="true"` to signal that content underneath is inert?
- [ ] **Accurate Labeling:** Does the sheet point to a visible heading element via `aria-labelledby="[heading-id]"`?
- [ ] **Clear Description:** If the purpose is descriptive, is there a subtext or screen-reader-only block linked via `aria-describedby="[desc-id]"`?
- [ ] **Aria-Hidden Background:** When the sheet is open, is the rest of the application/document (all siblings of the overlay backdrop) set to `aria-hidden="true"` to prevent assistive tools from navigating background content?
- [ ] **Inert Attribute (Alternative):** Is the `inert` attribute applied to the background page structure during activation?
- [ ] **Triggers Mapping:** Do trigger buttons specify `aria-haspopup="dialog"` and `aria-controls="[sheet-panel-id]"`?

---

## 2. Keyboard Navigation & Focus Management

- [ ] **Pre-Activation Focus Capture:** Does the controller record the currently focused element (`document.activeElement`) immediately before opening the sheet?
- [ ] **Initial Focus Transfer:** Upon successful expansion, is focus moved cleanly onto the dialog panel (using `tabindex="-1"` and `.focus()`) or onto the first focusable element inside the panel?
- [ ] **Strict Focus Trapping:** Is there an active keyboard listener trapping the `Tab` key? Tabbing past the last interactive child must wrap focus to the first, and `Shift+Tab` on the first must wrap focus back to the last.
- [ ] **Escape Key Dismissal:** Does pressing the physical `Escape` key close the bottom sheet instantly from any focus target?
- [ ] **Post-Deactivation Focus Restoration:** Upon close, is focus returned programmatically to the exact trigger button that opened the sheet?

---

## 3. Gestures & Touch Physics

- [ ] **Touch Action Suppression:** Does the CSS declare `touch-action: none` specifically on the drag handle and non-scrollable header blocks to prevent standard browser interactions (like mobile page refresh or swipe navigation)?
- [ ] **Pointer Events Unification:** Does the javascript track dragging using pointer events (`pointerdown`, `pointermove`, `pointerup`) instead of deprecated touch/mouse event splits?
- [ ] **Pointer Capture Activation:** Does the dragging start handler invoke `setPointerCapture()` on the target element to maintain gesture tracking even if the user slides their finger off the handle?
- [ ] **Directional Filtering:** Is dragging confined strictly to the downward direction (`deltaY > 0`) for dismissals? If the user drags up, is there a heavy visual dampening resistance (e.g., 10-15% scale) to prevent pulling the sheet out of the viewport?
- [ ] **Inertia/Dismissal Snap Points:** Does releasing the drag above a sensible threshold (e.g., >35% of the panel height) trigger the complete close animation?
- [ ] **Cancel/Spring Restorations:** Does releasing the drag *below* the threshold trigger a graceful spring animation resetting the position back to `translateY(0%)`?

---

## 4. Scroll Control & Layout Stability

- [ ] **iOS Safari Scroll Lock:** When the sheet is active, is body background scrolling completely locked? (Note: setting `overflow: hidden` on the body tag fails on iOS Safari. Use selective touch event prevention or `position: fixed` body overrides).
- [ ] **Horizontal Layout Stability:** When the scroll lock class is toggled on desktop browsers, does it prevent layout shifts (horizontal content jumping) by declaring `scrollbar-gutter: stable` or matching the padding offset of the scrollbar width?
- [ ] **Inner Containment Scroll:** Does the main sheet body support inner content scrolling (`overflow-y: auto`) for long documents?
- [ ] **Overscroll Behavior:** Is `overscroll-behavior: contain` declared on the scrollable inner container to prevent the scroll boundary from chaining up to the parent page?
- [ ] **Drag/Scroll Isolation:** Is the drag handle separate from the scrollable text viewport to prevent scroll contention conflicts?

---

## 5. Viewport Adaptation & Performance

- [ ] **Dynamic Viewport Height:** Is the panel sized using modern CSS viewport units like `max-height: 90dvh` or `max-height: 90svh` to handle iOS Safari floating address bars?
- [ ] **Virtual Keyboard Interception:** When an input element inside the sheet is focused on mobile, does the sheet reposition itself or scale cleanly so the input stays visible above the virtual keyboard?
- [ ] **Compositor-Only Animation:** Does the dragging and sliding animation rely exclusively on GPU-accelerated CSS properties (`transform: translateY()` and `opacity`) rather than layout-triggering properties (`height`, `top`, `bottom`, `margin`)?
- [ ] **will-change Optimization:** Does the sliding container use `will-change: transform` to promote it to its own GPU layer during active transitions?
- [ ] **Responsive Refactoring (Tablet/Desktop):** Does the CSS include media queries that refactor the bottom sheet on wider viewports (e.g. tablet/desktop width > 768px) into a centered dialog or sidebar, disabling touch dragging?

---

## 6. Visual Fidelity & Environments

- [ ] **Interactive Targets Size:** Does the drag handle and close button carry an interactive click target of at least **44x44px** (WCAG 2.1) or **24x24px** with padding (WCAG 2.2)?
- [ ] **Click Accent Suppression:** Is `-webkit-tap-highlight-color: transparent` declared on dragging targets to prevent ugly gray or blue flash artifacts on iOS?
- [ ] **High Contrast Theme Support:** Does the stylesheet utilize system colors (`ButtonText`, `SelectedText`) or border style fallbacks inside `@media (forced-colors: active)` blocks to keep states clear for low-vision users?
