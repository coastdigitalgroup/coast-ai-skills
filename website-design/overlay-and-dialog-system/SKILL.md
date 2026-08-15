---
name: overlay-and-dialog-system
description:
  Design a systematic framework for non-persistent UI layers (Modals, Drawers,
  and Popovers) that balances user focus, context, and interruption
  levels.
---

# Overlay and Dialog System

## Purpose

The Overlay and Dialog System skill provides a methodology for managing
temporary content layers that sit above the primary interface. It ensures that
interruptions are proportional to the user's task, context is preserved where
possible, and the interface remains accessible and responsive when using Modals,
Drawers, or Popovers.

## Use Cases

- Designing a confirmation flow for a destructive action (Modal).
- Creating a secondary workspace for editing complex details without losing page
  context (Drawer).
- Implementing contextual help or tooltips for specific UI elements (Popover).
- Designing a mobile-specific discovery layer for filters or search (Drawer).

## When NOT to Use

- **Primary Navigation:** Do not use overlays for the main site structure; use
  `site-navigation-system` instead.
- **Persistent Content:** If the information is critical for the user to see at
  all times, it should be part of the base page layout, not an overlay.
- **Complex Multi-page Flows:** If a task requires more than 2-3 steps, consider
  a dedicated page rather than a modal to prevent user disorientation.
- **Toast/Snackbar Notifications:** For passive, non-blocking status feedback
  (e.g., "Saved," "Copied to clipboard"), use `toast-and-snackbar-system`
  instead — it covers positioning, stacking, duration, and accessibility for
  that layer in depth.

## Inputs

1. **Content Volume:** How much information needs to be displayed?
2. **Interruption Level:** Does the user _must_ finish this task before
   continuing, or is it optional?
3. **Trigger Context:** Where is the user coming from, and what do they expect
   to happen?
4. **Platform/Viewport:** Is this for mobile, desktop, or a responsive hybrid?

## Outputs

1. **Pattern Selection:** A clear choice between Modal, Drawer, or Popover
   based on the interruption matrix.
2. **Anatomy Specification:** Defined regions (Header, Content, Footer/Actions)
   and their internal hierarchy.
3. **Behavioral Spec:** Rules for backdrop behavior, closing triggers, and
   responsive adaptation.
4. **Accessibility Requirements:** Focus management and ARIA role definitions.

## Workflow

### 1. Categorize by Interruption Level

Determine the required "gravity" of the overlay:

- **Level 1 (High): Modal.** Disables the background. Use for critical decisions
  or focused tasks.
- **Level 2 (Medium): Drawer.** Slides in from the edge. Use for complex
  sub-tasks that benefit from seeing the parent context.
- **Level 3 (Low): Popover.** Anchor to a specific element. Use for contextual
  settings or information.

For passive, non-blocking status feedback (Level 4), see
`toast-and-snackbar-system` — it is out of scope here.

### 2. Define the Internal Hierarchy (Anatomy)

Apply `visual-hierarchy-system` to the overlay:

- **Header:** Clear title and a consistent "Close" mechanism (X button).
- **Body:** The primary content area. If content is long, define scrolling
  behavior (fixed header/footer).
- **Footer:** Primary and secondary actions, aligned consistently (usually
  right-aligned for desktop, full-width for mobile).

### 3. Establish Elevation and Backdrop

- **Z-Index Strategy:** Ensure overlays sit in the correct stacking context.
  Prefer the native `<dialog>` element for Modals — it manages its own
  top-layer stacking, provides the `::backdrop` pseudo-element for the scrim,
  and handles `Escape`-to-close natively.
- **Backdrop (Scrim):** Use for Modals and Drawers to dim the background and
  focus attention. Define if clicking the backdrop closes the overlay. With
  `<dialog>`, style the scrim via `::backdrop` instead of a manually rendered
  overlay `<div>`.
- **Background Inertness:** When an overlay is open, the rest of the page must
  be non-interactive and hidden from assistive tech. `<dialog>.showModal()`
  does this automatically; for custom (non-`<dialog>`) overlays, apply the
  `inert` attribute to the background content rather than relying on
  `aria-hidden` alone.
- **Shadows:** Use depth to indicate the overlay's position above the base
  layer.

### 4. Design for Responsive Adaptation

Overlays must transform based on screen size:

- **Desktop Popover -> Mobile Drawer:** Small contextual menus often become
  bottom-aligned drawers on mobile for better thumb reach.
- **Desktop Modal -> Mobile Full-screen:** Large modals should occupy the full
  viewport on small screens to maximize space.
- **Drawer Behavior:** Ensure drawers don't exceed 90% of the viewport width on
  mobile.

### 5. Define Close & Exit Patterns

- Provide at least three ways to exit a non-critical overlay: "Close" button,
  `Escape` key, and clicking the backdrop.
- For critical (alert) modals, require an explicit action (e.g., "Cancel" or
  "Confirm").

## Decision Rules

- **The "Modal vs. Drawer" Rule:** If the user needs to refer to the background
  content while working, use a **Drawer**. If the task is a "stop-and-fix"
  moment, use a **Modal**.
- **The "Thumb" Rule:** On mobile, prioritize **Bottom Drawers** for actions to
  keep them within the natural reach of the thumb.
- **The "Two-Step" Rule:** If an overlay requires more than two internal "views"
  or steps, it likely belongs on its own page.
- **Backdrop Logic:** Only allow "Click outside to close" for non-destructive
  overlays. Never for forms where data might be lost.

## Constraints

- **Accessibility:** Must be navigable by keyboard. Modals must trap focus (the
  native `<dialog>` element does this by default when opened via
  `showModal()`). Background content must be made `inert` (or equivalent) so
  screen reader and keyboard focus cannot escape into it. Use `role="dialog"`
  or `role="alertdialog"` with `aria-modal="true"` and `aria-labelledby`
  pointing to the title when not using the native element.
- **Responsiveness:** Overlays must never cause horizontal scrolling. Content
  inside must be responsive.
- **Hierarchy:** The overlay's H1/Title must be the most prominent element
  within the container.

## Common Failure Patterns

- **Overlay Soup:** Stacking multiple modals on top of each other.
- **Context Loss:** Using a modal that covers the very information the user
  needs to complete the task.
- **The "Invisible Close":** Hiding the close button or making it too small for
  touch (min 44x44px).
- **Scrolling Conflicts:** Allowing the background page to scroll while an
  overlay is open (leads to disorientation).
- **Inconsistent Actions:** Swapping the position of "Cancel" and "Confirm"
  buttons across different overlays.

## Validation Criteria

- [ ] The chosen pattern (Modal/Drawer/Popover) matches the task's
      interruption level.
- [ ] Internal hierarchy is clear with a distinct Title and Primary Action.
- [ ] Responsive adaptation (e.g., Popover to Drawer) is defined for mobile.
- [ ] "Click outside to close" logic is appropriate for the data risk.
- [ ] Focus management and keyboard accessibility requirements are specified.
- [ ] Elevation (shadows/backdrops) distinguishes the layer from the base page.
- [ ] Background content is made `inert` (or the native `<dialog>` element is
      used) whenever a Modal or Drawer is open.
