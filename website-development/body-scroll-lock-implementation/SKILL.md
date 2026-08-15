---
name: body-scroll-lock-implementation
description:
  Implement and debug background body scroll locking when modals, overlays, or
  navigation drawers are open, specifically resolving iOS Safari overscroll issues and
  preventing visual layout shifts.
---

# Body Scroll Lock Implementation

## Purpose

The Body Scroll Lock Implementation skill provides a bulletproof frontend protocol for locking background page scrolling when a modal, overlay, or slide-out menu is active.

While setting `overflow: hidden` on the `<body>` works perfectly on desktop and Android browsers, **iOS Safari completely ignores it**. On iOS, users can still swipe and scroll the background page through the overlay. This skill solves the "scroll leak" problem and "elastic bounce" leak, ensuring that only scrollable panels inside the active overlay are scrollable, and that background scroll positions are perfectly preserved and restored.

---

## Use Cases

- **Modal Dialogs:** Standard pop-ups and lightboxes where the main document should not scroll.
- **Off-Canvas Navigation Drawers:** Mobile sidebar menus where dragging anywhere outside the menu should not bounce the background.
- **Full-Screen Overlays:** Full-screen search overlays, age gates, cookie consent modals, or mega-menus.
- **Bottom Drawers:** Mobile sheet overlays where content can either scroll or be dragged down to close.

---

## When NOT to Use

- **Inline Tooltips and Popovers:** Small context menus or helper popups that do not impede background interactions (see `accessible-tooltip-implementation` or `popover-api-implementation`).
- **Non-blocking Headers/Sidebars:** Sidebars that remain visible alongside scrollable main content without overlaying it.
- **Standard In-Page Accordions/Tabs:** Where the user is navigating within the standard document flow.

---

## Inputs

1. **Active Overlay Element:** The container of the modal/drawer currently visible.
2. **Scrollable Target Elements:** Specific nested sub-containers inside the overlay that *should* be allowed to scroll (e.g., a long modal body or a list of menu options).
3. **Current Viewport Context:** The current scroll position (`window.pageYOffset` or `window.scrollY`) before locking.
4. **Touch Event Coordinates:** Tracked touch starts (`clientY`) to determine scroll directions inside exempt containers.

---

## Outputs

1. **Active Scroll Lock Utility:** Framework-agnostic JS methods to lock and unlock background scroll.
2. **Event Listeners:** Registered touch listeners (`touchmove`, `touchstart`) configured with `{ passive: false }` to intercept scrolling gesture events.
3. **Responsive Stylesheet Integration:** CSS class toggles (`.is-scroll-locked`) that handle desktop and iOS locking states while preventing horizontal layout shifts (see `scrollbar-layout-shift-prevention`).
4. **Scroll Position Cleanup:** Automatic restoration of scroll positions and complete garbage collection of event listeners upon overlay close.

---

## Workflow

### 1. Detect Device & Touch Capabilities
First, identify if the device is running iOS (iPhone/iPad/iPod) or relies heavily on touch gestures.
- While simple desktop browsers only need CSS (`overflow: hidden`), iOS requires JavaScript event manipulation on `touchmove` or dynamic body position locking.

### 2. Implement the Desktop & Android Baseline (CSS-Only)
Apply CSS properties to the `<html>` and `<body>` elements when the overlay opens.
- Use a class like `.is-scroll-locked` to toggle `overflow: hidden`.
- Apply `scrollbar-gutter: stable` to prevent the page from shifting horizontally when the desktop scrollbar disappears.

### 3. Implement iOS Touch Interception (The Touchmove Protocol)
To bypass iOS Safari's native scroll behavior:
- Intercept the `touchmove` event on the document level.
- By default, call `event.preventDefault()` on all touch movements to prevent scrolling.
- Explicitly register the event listener with `{ passive: false }` so the browser permits calls to `preventDefault()`.

### 4. Configure Scrollable Exemptions inside the Overlay
If a panel inside the modal needs to scroll (e.g., a long terms-of-service block):
- Identify the scrollable element.
- Listen to `touchstart` to record the initial Y position.
- Listen to `touchmove` inside this container:
  - Calculate scroll direction (up vs. down).
  - If the container is at the **very top** and the user is scrolling **up** (trying to pull down), block the scroll by calling `preventDefault()` to prevent the background body from bouncing.
  - If the container is at the **very bottom** and the user is scrolling **down** (trying to pull up), block the scroll.
  - Otherwise, let the scroll pass natively (do not block touchmove).

### 5. Fallback: Position-Fixed Body Locking
For highly complex layouts or when touch interception is bypassed by auxiliary controls:
- Capture the exact scroll offset: `const scrollY = window.scrollY;`.
- Apply styles to `body`: `position: fixed; top: -${scrollY}px; width: 100%;`.
- When unlocking, remove the inline styles and restore the viewport: `window.scrollTo(0, scrollY);`.
- Note: This approach changes the document's layout temporarily, so make sure headers and absolute elements stay visually stable during transitions.

### 6. Perform Complete Teardown and Cleanup
When the overlay closes, ensure all registered touch event listeners are detached to avoid memory leaks or permanently locking the website's viewport.

---

## Decision Rules

| Target OS / Browser | Primary Choice | Secondary / Fallback | Rationale |
| :--- | :--- | :--- | :--- |
| **Desktop / Android** | **CSS Baseline** (`overflow: hidden` on body) | None | Lightweight, native, requires no scripting or event overhead. |
| **iOS Safari (Simple / No inner scroll)** | **Touchmove Prevention** on entire overlay | **Position-Fixed Lock** | Simple overlay has no scrollable children; cancelling touchmove prevents background leak perfectly. |
| **iOS Safari (With inner scrollable elements)** | **Coordinate-based Touchmove Exemption** | **Position-Fixed Lock** | Selective touch interception allows fine-grained container scrolling without scrollbar shifting or background jumping. |
| **Dynamic Viewports (React / Vue SPAs)** | **Position-Fixed Lock** | **Touchmove Exemption** | Hard-locking the body position via inline styles avoids complex listener tracking when components re-render or unmount. |

---

## Constraints

- **Passive Event Listeners:** Since Chrome 56 and iOS 11.3, touch listeners default to `{ passive: true }`. Calling `preventDefault()` inside a passive listener will fail and throw a console error. You **must** specify `{ passive: false }` explicitly during listener attachment.
- **Zoom/Pinch Gestures:** Ensure that multi-touch zoom gestures (two-finger pinches) are not broken unless absolutely necessary for the visual state.
- **Scrollbar Shifting:** When locking the screen, the disappearing scrollbar will cause text to shift. Always pair scroll locking with scrollbar layout-shift prevention (e.g., matching padding or `scrollbar-gutter: stable`).
- **Screen Readers:** Locking visual scrolling does not prevent screen readers from reading background text or moving their Virtual Cursor. Ensure the background elements have `aria-hidden="true"` and the modal has `aria-modal="true"`.

---

## Non-Goals

- Replacing native browser scrolling with third-party inertial scroll libraries (e.g., custom scroll containers).
- Implementing CSS transitions/animations for modal entries/exits.
- Setting up focus traps (see `accessible-modal-dialog`).

---

## Common Failure Patterns

- **The "iOS Scroll Slip":** Applying `overflow: hidden` to the body and assuming iOS is locked. Users swipe the modal backdrop, and the main page underneath scrolls.
- **The "Scroll Jump to Top":** Using the `position: fixed` hack but forgetting to set the negative `top` style or forgetting to `scrollTo` the original position, instantly snapping the user back to the top of the homepage on close.
- **The "Trapped Scroll":** Preventing touchmove on the entire modal container, making it impossible to scroll even the inner form or text area that was supposed to scroll.
- **The "Stuck Scroll" Leak:** Forgetting to run the unlock function when a component unmounts or routes change, permanently locking the user's ability to scroll the entire website.
- **The "Passive Error":** Logging `Ignored attempt to cancel a touchmove event` because the listener was registered as passive.

---

## Validation Criteria

### 1. Desktop & Android Audit
- [ ] Open the overlay. Verify the system scrollbar disappears but page content does not shift horizontally.
- [ ] Try scrolling using the mouse wheel, trackpad, page-up/down keys, and spacebar. Verify the background remains fully static.

### 2. iOS Safari Physical Check
- [ ] Open the overlay on iOS Safari (or Xcode iOS Simulator).
- [ ] Tap the non-scrollable part of the modal (e.g., backdrop/header) and swipe down aggressively. Verify the background document does not bounce.
- [ ] Drag your finger quickly up and down inside the scrollable inner container. Verify it scrolls smoothly with elastic inertia, but locks cleanly without leaking scroll to the background when boundaries are reached.

### 3. Dynamic Router / State Verification
- [ ] Navigate to another page while the modal is open (using back button or SPA routing). Verify that the scrollbar is unlocked and the user is not trapped.
- [ ] Inspect the console for `Ignored attempt to cancel a touchmove event with cancelable=false` or similar passive listener warnings. Ensure zero errors are thrown.
