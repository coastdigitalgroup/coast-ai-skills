---
name: focus-trap-implementation
description:
  Build, debug, and maintain a robust, performant, and accessible keyboard focus trap
  utility in vanilla JavaScript to safely manage focus transitions within custom interactive overlays.
---

# Focus Trap Implementation

## Purpose

The Focus Trap Implementation skill provides a technical protocol and reusable pattern for building a robust, accessible keyboard focus trap. Any interactive overlay (custom modals, side drawers, sliding menus, cookies consent dialogs, onboarding tours) must confine keyboard focus traversal to the active container. Without focus trapping, keyboard navigators (using `Tab` or `Shift+Tab`) will bleed focus back into hidden page contents underneath, rendering the application unusable, confusing, and non-compliant with Web Content Accessibility Guidelines (WCAG) 2.1 Criterion 2.1.2 (No Keyboard Trap).

## Use Cases

- **Custom Overlays:** When design system restrictions, animations, or legacy constraints prevent the use of the native `<dialog>` element, and a custom overlay or drawer is built.
- **Mobile Side Drawers & Menus:** Confining focus to a hamburger slide-out menu or sidebar navigation when active.
- **Step-by-Step Wizards/Tours:** Confining focus to onboarding bubble highlights or guided wizard dialogs.
- **Cookie Consent & Paywalls:** Preventing users from clicking/tabbing back into main page components until an active banner choice is made.

## When NOT to Use

- **Native `<dialog>` Support is Viable:** If you are using the native HTML5 `<dialog>` element and calling `.showModal()`, the browser handles backdrop isolation and focus trapping automatically. Prefer native elements over custom focus-trap code.
- **Non-Modal Overlays:** Tooltips, popovers, or standard dropdown selections that do not require full modal flow should never trap focus; they should let the user tab out into adjacent page elements freely.
- **Empty Containers:** Never activate a focus trap on a container that has zero interactive elements (or only plain text), as this locks keyboard focus permanently, making it impossible to exit or interact.

## Inputs

1. **Target Container Node:** The HTML DOM container enclosing the overlay.
2. **Trigger/Origin Element:** The active DOM element that was focused prior to the focus trap being enabled (to return focus back to).
3. **Behavioral Flags:** Configurations for closing on `Escape` keypress, clicking outside the container to dismiss, or auto-focusing the first element.

## Outputs

1. **Robust CSS Focusable Selector:** A comprehensive CSS selector identifying all natively focusable and keyboard-navigable elements.
2. **FocusTrap Javascript Class/Utility:** A highly optimized, event-driven JavaScript class with active `.activate()` and `.deactivate()` methods.
3. **Clean Keyboard Listeners:** Performant keyboard listeners on the trap container managing `Tab`, `Shift+Tab`, and `Escape` keypresses with complete visual-focus safety.

---

## Workflow

### 1. Identify Focusable Elements

To prevent focus from escaping, we must first locate all focusable elements within the container. Use a modern, comprehensive CSS selector that respects standard interactive tags:

```js
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex^="-"]):not([disabled])',
  '[contenteditable]'
].join(',');
```

### 2. Verify Visibility and Usability

Not all matching elements are actually keyboard navigable. Filter the selected elements to ensure they are visible on-screen and not hidden in parent containers:

- Elements with `display: none` or `visibility: hidden` must be excluded.
- Elements with dimensions of zero height or width (such as hidden utility buttons) should be excluded unless they are positioned off-screen intentionally for accessibility.
- Elements inside parents with `aria-hidden="true"` or `inert` are ineligible.

### 3. Implement the Navigation Loop (The Trap Engine)

Intercept the `keydown` event on the active container. Check if the pressed key is `Tab` (KeyCode 9).

- **Determine First and Last Elements:** Query focusable elements dynamically (to support lazy-loaded content or dynamic UI forms inside the trap) or cache them upon activation.
- **Shift + Tab (Backwards Navigation):** If the currently focused element is the **first** element in the container, intercept the default action and programmatically focus the **last** element.
- **Tab (Forwards Navigation):** If the currently focused element is the **last** element in the container, intercept the default action and programmatically focus the **first** element.
- **Single Element Trap:** If the container contains only one focusable element, intercept both Tab and Shift+Tab and force focus to remain on that single element.

### 4. Manage Transition Focus States

- **Activation:** Before activating, record the current document active element (`document.activeElement`) as the trigger origin. Immediately move focus into the container (either the first focusable element or a container with `tabindex="-1"`).
- **Deactivation:** Upon closing or deactivating, programmatically return focus to the recorded trigger origin element. This ensures the user's focus returns to their starting point on the parent page.

### 5. Prevent Background Interaction

- Add `aria-hidden="true"` or the `inert` attribute to all background sibling containers of the overlay container while active. This prevents assistive technologies from scrolling or reading out background contents.

---

## Decision Rules

### Approach A: Native `<dialog>` Element (Recommended First)
- *Use when:* Target browsers support native `<dialog>`, and design constraints do not require a heavily modified custom tag setup.
- *How:* Call `.showModal()`. The browser automatically handles focus trapping, background blocking, and focus restoration natively.

### Approach B: Custom JavaScript Focus Trap Utility (Fallback / Custom Layouts)
- *Use when:* Building complex animations (such as sliding panels) where native dialog styling is restrictive, when integrating with non-dialog drawers/menus, or supporting legacy browsers.
- *How:* Use a structured JavaScript Class (like the one in `templates/focus-trap-utility.js`) that captures `keydown` events.

---

## Constraints

- **Dynamic DOM Changes:** If elements inside the trap are disabled, enabled, added, or removed dynamically (such as asynchronous content loaders or validation messages), the list of focusable elements must be recalculated on the fly.
- **No Infinite Loops:** Ensure event listeners do not bubble recursively or cause memory leaks. Always unbind event listeners when the trap is deactivated.
- **Z-Index and Stacking Contexts:** Ensure the overlay is placed at the bottom of the DOM (usually direct child of `<body>`) to avoid parent container Clipping or `z-index` wars.

---

## Non-Goals

- Creating custom CSS animations, themes, or layouts for modals or drawers.
- Integrating directly with third-party CSS or JS frameworks (React, Vue, Angular, Svelte) - this skill teaches portable Vanilla JS patterns.
- Managing server-side rendering (SSR) of markup.

---

## Common Failure Patterns

- **The Static Element Trap:** Caching the list of focusable elements once at startup and failing when child elements are dynamically created or enabled/disabled later.
- **Focus Leaks on Off-Screen Elements:** Letting focus travel to interactive elements inside off-screen containers (e.g., drawer slides out, but the elements inside remain focusable while closed).
- **Loss of Trigger Focus:** Failing to store `document.activeElement` before opening. On close, focus drops back to the top `<body>` element, forcing keyboard-only users to re-tab from the top.
- **The Empty Tab Trap:** Activating a focus trap on a simple informational modal with zero interactive buttons, leaving the user with no keyboard method to escape or dismiss.
- **Ignoring Browser-Extension/Addon Focus:** Focus traps that do not properly handle elements injected into the modal container by extensions (like password managers).

---

## Validation Criteria

- [ ] **Tab Order Test:** Tab forwards and backwards repeatedly within the active overlay. Confirm focus wraps seamlessly from the last element to the first, and first element to the last, without ever leaking to the parent page.
- [ ] **Escape Key Test:** Press `Escape` inside the container. Confirm the overlay closes and immediately returns focus to the button/link that triggered it.
- [ ] **Background Isolation Check:** Inspect the parent document in the browser DevTools while the overlay is open. Confirm sibling page containers have `aria-hidden="true"` or `inert` applied.
- [ ] **Dynamic Elements Test:** If a section of the overlay is conditionally rendered (e.g., dynamic error state buttons), open/enable that section and confirm the new elements are correctly included in the Tab focus ring.
- [ ] **Clean Lifecycle Check:** Deactivate the overlay and inspect memory/listeners. Verify all keydown event listeners bound to the document/container are fully garbage-collected.
