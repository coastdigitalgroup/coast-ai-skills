---
name: accessible-bottom-sheet-implementation
description:
  Implement and audit highly responsive mobile bottom sheets with smooth touch gestures (pan/swipe), pointer capture, spring physics, proper ARIA roles, focus trapping, and background scroll locking.
---

# Accessible Bottom Sheet Implementation

## Purpose

The Accessible Bottom Sheet Implementation skill provides a robust technical framework and protocol for building and auditing mobile-first sliding panels (bottom sheets). Because standard dialog modals are often cumbersome on small screens, bottom sheets are widely used on mobile webs to present contextual content, forms, actions, or filters.

However, implementing a high-fidelity bottom sheet is notoriously difficult. Developers frequently fail to handle touch inertia, cause background scrolling leaks (especially on iOS Safari), introduce layout thrashing during dragging, or create keyboard trap/screen-reader black holes. This skill details the implementation of a gesture-dismissible, scroll-locked, and fully keyboard/screen-reader compliant bottom sheet.

---

## Use Cases

- **Mobile Filters & Sorts:** Slide-up panels on e-commerce Product Listing Pages (PLPs) to select filters.
- **Action Sheets:** Quick options triggered by a button (e.g., "Share", "Duplicate", "Delete", "Add to Playlist").
- **Product Detail Configurator:** Expanding a mobile buy-drawer to choose size, color, or quantity before adding to cart.
- **Contextual Input Forms:** Modal inputs like adding a comment, rating a product, or selecting a shipping address without leaving the primary viewport context.

---

## When NOT to Use

- **Desktop-Only Interfaces:** Bottom sheets are optimized for mobile touch targets. On desktop screens, displaying a wide bar sliding up from the bottom is visually awkward. Use a standard centered modal (see `accessible-modal-dialog`) or a localized popover instead.
- **Navigation Menus:** For primary header menus, use dedicated responsive mobile navigation structures (see `responsive-navigation-implementation`).
- **Heavy Document Editing:** Complex workflows with massive data inputs (like editing a rich-text document or managing full spreadsheets) should occur on dedicated pages, not inside a mobile drawer.

---

## Inputs

1. **Trigger Element:** The button or element that opens the bottom sheet.
2. **Sheet Content:** The interactive HTML markup inside the sheet, which may include form fields, scrollable text lists, or action buttons.
3. **Gesture Physics Configuration:** Drag thresholds for dismissal (e.g., swipe down past 50% height or exceed a velocity of 0.5px/ms).
4. **Desktop Presentation Strategy:** Whether to transform the sheet into a centered modal, a slide-out sidebar, or keep it as a narrow bottom sheet on wider screens.

---

## Outputs

1. **Semantic HTML Structure:** An ARIA-compliant DOM tree utilizing `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby` elements.
2. **Hardware-Accelerated CSS:** CSS utilizing GPU-bound transitions (`transform: translateY()`, `will-change: transform`) and preventing visual scrolling leaks (`touch-action: none` on drag bars).
3. **Vanilla JS Pointer Controller:** A JavaScript class or module implementing Pointer Events (`pointerdown`, `pointermove`, `pointerup`) to support touch, mouse, and stylus input seamlessly with active pointer capture.
4. **Accessible Focus and Scroll Management:** Integration with focus trapping (confining `Tab` navigation to the sheet) and active background scroll locking (preventing iOS background scroll leak).

---

## Workflow

### 1. Structure the HTML Semantically

A bottom sheet must behave as a modal dialog. Avoid generic `div` selectors without ARIA semantics.

```html
<button id="open-sheet-btn" aria-haspopup="dialog" aria-controls="bottom-sheet">
  Filter Products
</button>

<!-- Bottom Sheet Container (Overlay Backdrop) -->
<div id="bottom-sheet-overlay" class="sheet-overlay" aria-hidden="true">
  <!-- The Sheet Panel itself -->
  <div id="bottom-sheet"
       class="sheet-panel"
       role="dialog"
       aria-modal="true"
       aria-labelledby="sheet-title"
       aria-describedby="sheet-desc"
       tabindex="-1">

    <!-- Drag Handle Bar for Touch Gestures -->
    <div class="sheet-drag-handle" aria-hidden="true">
      <span class="sheet-drag-bar"></span>
    </div>

    <!-- Header Section -->
    <header class="sheet-header">
      <h2 id="sheet-title" class="sheet-title">Filter Options</h2>
      <p id="sheet-desc" class="sr-only">Use the controls below to filter the product listings.</p>
      <button type="button" class="sheet-close-btn" aria-label="Close sheet">&times;</button>
    </header>

    <!-- Scrollable Content Section -->
    <div class="sheet-content">
      <!-- Form elements, scrollable list, etc. -->
    </div>
  </div>
</div>
```

---

### 2. Design the Style System (CSS)

The sheet must slide in smoothly from the bottom, sit absolute at the base, and remain visually stable under dynamic viewport resizing (like the iOS Safari address bar collapsing/expanding).

- **Positioning:** Pin the sheet to the bottom using `position: fixed`. Use CSS Custom Properties (`--sheet-translate-y`) for gesture-driven sliding.
- **Hardware Acceleration:** Ensure CSS transitions operate solely on `transform` and `opacity` to avoid triggering layout/reflow rendering stages.
- **Touch-Action Optimization:** Disable default browser pan-scrolling gestures on the drag handle using `touch-action: none` to prevent conflicts with custom JavaScript dragging handlers.

```css
.sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.sheet-overlay.is-active {
  opacity: 1;
  pointer-events: auto;
}

.sheet-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 90vh;
  min-height: 200px;
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 1001;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.sheet-overlay.is-active .sheet-panel {
  transform: translateY(0%);
}

/* Drag Handle Styling */
.sheet-drag-handle {
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  /* Crucial: Prevent browser swipe-to-scroll conflicts */
  touch-action: none;
}

.sheet-drag-bar {
  width: 40px;
  height: 4px;
  background-color: #cbd5e1;
  border-radius: 2px;
}

/* Scrollable Container */
.sheet-content {
  flex-grow: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}
```

---

### 3. Implement Pointer Gestures for Drag-to-Dismiss

To make the sheet feel natural and responsive, track touch, mouse, and stylus interactions via **Pointer Events**. Pointer events unify these inputs into a single interface.

#### Dynamic Drag Mechanics:
- Listen to `pointerdown` on the drag handle or header. Record the initial Y pointer position.
- Call `element.setPointerCapture(pointerId)` on the drag handle so touch movements are captured even if the user slides their finger slightly outside the handle.
- Listen to `pointermove`. Calculate the vertical difference (`deltaY = currentY - startY`).
- If `deltaY > 0` (dragging downwards), dynamically update the panel's transition styling to match the gesture: `transform: translateY(${deltaY}px)`. Keep transition speed to `0s` during drag for real-time responsiveness.
- Listen to `pointerup`. Release pointer capture. If `deltaY` exceeds the dismissal threshold (e.g., dragging more than 30% of the sheet height or dragging with high velocity), trigger the close sequence. Otherwise, spring back to `translateY(0%)` using CSS easing.

---

### 4. Manage Accessible Focus (Focus Trapping)

When the sheet opens, it behaves as a modal dialog:
- **Save Focus:** Store the element that had focus before opening (`activeElement = document.activeElement`).
- **Transfer Focus:** Programmatically move focus to the bottom sheet container or the first interactive child.
- **Trap Focus:** Listen to keydowns for the `Tab` key. Intercept when tabbing out of the last focusable item and wrap focus back to the first. Similarly, wrap focus from first to last on `Shift + Tab`.
- **Restore Focus:** When closed, programmatically return focus back to the original trigger button (`activeElement.focus()`).

---

### 5. Control Body Scrolling and iOS Overlays

When a bottom sheet is active, users scrolling the sheet itself must not leak scrolls to the background page.
- On **Desktop/Android**, add `overflow: hidden` and `scrollbar-gutter: stable` to the `body` tag.
- On **iOS Safari**, intercept touchmove events or use the `position: fixed` body lock approach to completely prevent underlying document scrolling (see `body-scroll-lock-implementation`).
- Style the scrollable content inside the sheet with `overscroll-behavior: contain` to prevent the scroll boundary from chaining up to the parent page.

---

## Decision Rules

### Responsive Presentation Rules (Mobile vs. Desktop)

| Viewport Width | Visual Design Choice | Transition Behavior | Accessibility Consideration |
| :--- | :--- | :--- | :--- |
| **Mobile (< 768px)** | **Bottom Sheet Drawer** sliding from base. | Transform: `translateY()` | Trapped focus, swipe-to-dismiss active, large tap targets (44px+). |
| **Tablet (768px - 1024px)** | **Centered Modal Dialog** or **Sidebar Drawer**. | Transform: `translateY()` or `translateX()` | Convert drag-dismiss handle into a clean visible button; disable vertical panning. |
| **Desktop (> 1024px)** | **Centered Modal** or **Sidebar Drawer** or **Dropdown Popover**. | Transform: `scale()` or `opacity` fade | Standard focus trapping, click backdrop to close, remove drag bar entirely. |

---

## Constraints

- **Dynamic Visual Viewport:** Mobile keyboards (virtual keyboards) resize the viewport when inputting text inside a bottom sheet. Always size the panel using `max-height: 90dvh` (Dynamic Viewport Height) or listen to `window.visualViewport` changes to prevent input fields from being hidden behind the keyboard.
- **Touch Targets:** The drag handle must have an invisible, clickable touch padding making its overall interactive height at least **44px** to conform to WCAG mobile tap targets.
- **Pointer Events Fallbacks:** Use modern Pointer Events (`pointerdown`, `pointermove`, etc.) rather than split mouse/touch listener trees. Ensure the CSS property `-webkit-tap-highlight-color: transparent` is declared to prevent blue click flashes on iOS Safari during drags.
- **Performance:** Avoid tracking and changing layout properties (`height`, `top`, `bottom`, `margin-top`) inside drag loops. Always animate using GPU-accelerated CSS `transform: translateY()` properties.

---

## Non-Goals

- Creating a complete UI styling framework (e.g., custom form inputs or checkbox styles inside the sheet).
- Handling server-side data submissions, state validation, or loading states.
- Re-architecting state engines inside SPAs (React, Vue, Svelte) — the principles apply to vanilla DOM but easily port to any framework lifecycle.

---

## Common Failure Patterns

- **The iOS Scroll Leak:** Standard `overflow: hidden` is placed on the body, but iOS touch drags on the sheet backdrop still scroll the background website behind it.
- **Layout Thrashing inside Drag Loop:** Modifying the `.style.height` of the drawer dynamically in the `pointermove` handler. This forces the browser to recalculate layouts 60 times a second, creating massive visual lag/jank. Always use `transform: translateY()`.
- **Keyboard Trap / Screen Reader Isolation:** Failing to trap keyboard focus, allowing keyboard-only users to "tab through" hidden background links underneath the active sheet overlay.
- **Virtual Keyboard Collision:** When clicking an input inside a bottom sheet, the mobile keyboard pops up and covers the input field completely because the sheet was sized using static `vh` instead of dynamic `dvh` or lacks a dynamic Visual Viewport height handler.
- **Missing Pointer Capture:** Forgetting to run `setPointerCapture` on the drag element. If a touch swipe is fast or deviates horizontally, the browser loses track of the pointer and the sheet gets "stuck" mid-drag.
- **Double Scroll Contention:** Having the drag handle inside the scrollable content container, causing the browser to fight between dragging the sheet down and scrolling the container's contents.

---

## Validation Criteria

- [ ] **Pointer Drag Test:** On a mobile touch screen (or Chrome Device Emulator), press and drag the drag handle down. Confirm the sheet tracks your finger in real time with absolute fluid responsiveness.
- [ ] **Dismissal Threshold Check:** Drag the sheet down past 40% height and release. Confirm that it closes completely and fires any registered closing callbacks. Drag it down only 10% and release. Confirm that it springs back to full height gracefully.
- [ ] **Keyboard Interaction & Focus Trap Test:** Tab to the trigger and hit `Space`/`Enter` to open.
  - Verify that focus moves immediately inside the sheet (e.g., to the close button or first input).
  - Press `Tab` repeatedly. Confirm that focus never leaves the sheet boundaries.
  - Press `Escape`. Confirm that the sheet closes immediately and focus is restored precisely to the original trigger button.
- [ ] **Screen Reader Walkthrough:** Turn on a screen reader (e.g., VoiceOver, TalkBack). Ensure that background elements are not focusable (are hidden via `aria-hidden="true"` or dynamic DOM isolation) and that the sheet container announces itself as a "Dialog" or "Modal window".
- [ ] **iOS Safari Scroll Test:** Open the sheet on an actual iOS device. Swipe the backdrop or drag-handle. Verify that the underlying body text is completely stationary and does not bounce at scroll limits.
- [ ] **Virtual Keyboard Audit:** Tap a text input inside the bottom sheet on mobile. Confirm that the sheet moves up or scales cleanly so the active input remains clearly visible above the virtual keyboard.
