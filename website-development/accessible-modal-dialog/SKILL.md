---
name: accessible-modal-dialog
description: Implement and debug accessible modal dialogs that manage focus, handle keyboard interactions, and communicate state to assistive technologies.
---

# Accessible Modal Dialog

## Purpose
The Accessible Modal Dialog skill ensures that UI overlays (modals) are usable by all users, including those relying on screen readers and keyboard-only navigation. It focuses on correct semantic structure, focus management, and expected keyboard behavior.

## Use Cases
- Implementing a new modal for user confirmation, login forms, or detailed information.
- Auditing and fixing accessibility issues in existing custom modal implementations.
- Transitioning from legacy `div`-based modals to the native `<dialog>` element.
- Implementing "alert" dialogs that require immediate user attention.

## When NOT to Use
- **Non-modal Overlays:** Do not use this skill for tooltips, dropdown menus, or "popovers" that do not interrupt the main workflow or require focus trapping.
- **Persistent Sidebars:** If the content is meant to be navigated alongside the main content, it is not a modal dialog.
- **Complex Page Navigation:** If the content is large enough to be its own page, consider routing instead of a modal.

## Inputs
1. **Modal Content:** The HTML structure of the content to be displayed.
2. **Trigger Element:** The button or action that opens the modal.
3. **Implementation Type:** Choice between native `<dialog>` or custom ARIA-based implementation.
4. **Context:** Is it a standard dialog or an `alertdialog` (requires immediate attention)?

## Outputs
1. **Semantic HTML:** A structure using `<dialog>` or appropriate `role="dialog"` attributes.
2. **Focus Management Logic:** Scripts to trap focus within the modal and restore it upon closing.
3. **Keyboard Handlers:** Logic for `Escape` key and tab order management.
4. **Accessibility Metadata:** Proper labeling (`aria-labelledby`, `aria-describedby`).

## Workflow

### 1. Choose Implementation Method
- **Preferred:** Use the native `<dialog>` element for built-in accessibility features (like `showModal()` and backdrop support).
- **Fallback:** If custom styling requirements or legacy constraints exist, use a `role="dialog"` implementation with manual focus trapping.

### 2. Establish Semantic Structure
- Assign an `id` to the modal title.
- Link the title to the modal using `aria-labelledby`.
- If there is descriptive text, link it using `aria-describedby`.
- Ensure the modal has a clear "Close" button.

### 3. Implement Focus Management
- **Opening:** When the modal opens, move focus to the first focusable element inside (or the modal container itself if appropriate).
- **Trapping:** Ensure `Tab` and `Shift + Tab` cycle focus only within the modal.
- **Restoring:** When the modal closes, return focus to the trigger element that opened it.

### 4. Handle Interactions
- Implement `Escape` key listener to close the modal.
- Implement click-outside-to-close behavior (if appropriate for the UX).
- Ensure the background content is hidden from assistive technology while the modal is open (`aria-hidden="true"` or `inert` on the main content wrapper).

### 5. Styling
- Ensure the modal is visually distinct (backdrop/overlay).
- Provide clear visual focus indicators for all elements inside the modal.

## Decision Rules
- **Alert vs. Dialog:** Use `role="alertdialog"` only when the user *must* respond before continuing (e.g., "Discard changes?"). Use `role="dialog"` for standard informational or functional overlays.
- **Initial Focus:** If the modal contains a long form, focus the first input. If it's a short confirmation, focus the "Cancel" or "Close" button to prevent accidental submission.
- **Native vs. Polyfill:** If using `<dialog>`, determine if a polyfill is needed based on the project's browser support matrix.

## Constraints
- **Single Active Modal:** Avoid "nesting" or stacking multiple modals. If a new modal must open, close the previous one or ensure the hierarchy is managed strictly.
- **Keyboard Only:** The entire modal experience must be functional without a mouse.
- **Contrast:** Ensure the backdrop contrast is sufficient to make the modal stand out.

## Non-Goals
- Styling the specific look and feel (beyond accessibility requirements).
- Handling complex state management (Redux/Zustand) for the modal's open/close state.
- Implementing non-modal "drawers" that don't trap focus.

## Common Failure Patterns
- **Focus Leak:** Tabbing out of the modal into the background page content.
- **Focus Loss:** Closing the modal and the focus disappearing (dropping to the `body` instead of the trigger).
- **Missing Labels:** Screen reader users hearing "Dialog" without knowing what the dialog is for.
- **No Escape:** Forgetting to close the modal when the `Escape` key is pressed.
- **Inertia Issues:** Background content remaining scrollable or clickable while the modal is open.

## Validation Steps
- [ ] **Screen Reader Test:** Verify the title and description are announced when the modal opens.
- [ ] **Keyboard Trap Test:** Press `Tab` repeatedly to ensure focus never leaves the modal.
- [ ] **Escape Key Test:** Verify the modal closes when `Esc` is pressed.
- [ ] **Focus Restoration Test:** Verify focus returns to the opening button after closure.
- [ ] **Aria-Hidden Test:** Verify the main content is invisible to screen readers while the modal is active.
- [ ] **Native Check:** If using `<dialog>`, confirm it is invoked with `showModal()` and not just `show()`.
