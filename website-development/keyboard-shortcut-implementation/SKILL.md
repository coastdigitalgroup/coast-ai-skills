---
name: keyboard-shortcut-implementation
description:
  Implement and manage global or context-specific keyboard shortcuts to improve
  navigation and efficiency while maintaining accessibility and avoiding
  browser conflicts.
---

# Keyboard Shortcut Implementation

## Purpose

The Keyboard Shortcut Implementation skill provides a technical framework for
adding keyboard shortcuts to web applications. It ensures that shortcuts are
discoverable, accessible, cross-platform, and do not conflict with browser or
assistive technology defaults.

## Use Cases

- Implementing a global "Command Palette" or "Quick Search" (e.g., `Cmd+K` or `Ctrl+K`).
- Adding productivity shortcuts for common actions like "Save" (`Cmd+S`), "New"
  (`Cmd+N`), or "Delete".
- Improving navigation between application sections (e.g., `G` then `H` for "Go to Home").
- Providing a "Shortcut Help" overlay (e.g., triggered by `?`).
- Mapping single-key shortcuts for media players (e.g., `Space` for play/pause, `M` for mute).

## When NOT to Use

- **Standard Navigation:** Don't use shortcuts as a replacement for clear,
  navigable links and buttons.
- **Overriding Universal Browser Shortcuts:** Never override shortcuts like
  `Cmd+T` (New Tab), `Cmd+W` (Close Tab), or `Cmd+L` (Address Bar).
- **Simple Public Websites:** Shortcuts add complexity that may not be
  appreciated on a simple marketing page or blog.
- **Conflict-Prone Combinations:** Avoid combinations that are likely used by
  screen readers (e.g., many `Alt` or `Cmd` combinations in specific browsers).

## Inputs

1. **Shortcut Inventory:** A list of actions and their desired key combinations.
2. **Context Map:** Which shortcuts are global vs. which only work in specific
   views or components.
3. **Target Platforms:** Windows, macOS, and Linux requirements.

## Outputs

1. **Global/Scoped Keyboard Listener:** A centralized mechanism to catch and
   route keyboard events.
2. **Normalization Logic:** Code to handle Mac (`Meta`) vs. Windows/Linux
   (`Control`) modifier keys.
3. **Accessibility Metadata:** Implementation of `aria-keyshortcuts` on
   triggering elements.
4. **Shortcut Discovery UI:** A help modal or tooltip system that shows users
   available shortcuts.

## Workflow

### 1. Define the Shortcut Map

- Group shortcuts by priority: Global (always available) vs. Local (only in
  specific components).
- Choose combinations that follow user expectations (e.g., `S` for Save, `/` for
  Search).

### 2. Implement the Keyboard Listener

- Use `keydown` instead of `keypress` (deprecated) or `keyup` (too late for
  preventing defaults).
- Attach a single listener to `window` or a high-level container to leverage
  event delegation.

### 3. Handle Context Awareness

- **Important:** Check if the user is currently typing in an input field
  (`input`, `textarea`, `select`, or `contenteditable`). Generally,
  single-key shortcuts should be disabled when focus is in an input.
- Use `event.target.closest('input, textarea, select, [contenteditable="true"]')`
   to bail out early.

### 4. Normalize Modifier Keys

- Use a utility to check for "Platform Command Key":
  ```javascript
  const isMod = (e) => (navigator.platform.includes('Mac') ? e.metaKey : e.ctrlKey);
  ```
- Use `event.key` for the primary key value (e.g., `"k"`, `"Enter"`, `"Escape"`).

### 5. Prevent Browser Defaults

- For shortcuts that overlap with browser features (like `Cmd+S`), use
  `event.preventDefault()` to stop the browser's default action.

### 6. Implement Accessibility

- **`aria-keyshortcuts`:** Add this attribute to the button or element that
  performs the action, listing the shortcut (e.g., `aria-keyshortcuts="Control+S"`).
- **Discovery:** Ensure all shortcuts are listed in a help menu or indicated in
  tooltips. Use the `?` key as a standard trigger for this menu.

## Decision Rules

- **Modifier or Single Key?**
  - Use **Modifier + Key** for actions that could be triggered accidentally
    (Save, Delete).
  - Use **Single Key** for navigation or playback (Media controls, Tab
    switching) ONLY when not in an input context.
- **Global vs. Scoped:**
  - Global listeners are easier for app-wide shortcuts.
  - Scoped listeners (attached to a component) are better for complex
    widgets like data grids or text editors.

## Constraints

- **Accessibility:** Users must be able to turn off or remap shortcuts if they
  use assistive technology that relies on those keys.
- **Cross-Browser:** `event.code` is more reliable for physical key position,
  but `event.key` is better for the character produced. Usually, `event.key` is
  preferred for shortcuts.
- **Focus:** The element must be in a state where it can receive the event
  (usually `window` or `document`).

## Non-Goals

- Implementing a full-blown text editor with complex key-binding layers.
- Handling international keyboard layouts (e.g., AZERTY vs QWERTY) in a granular
  way (though `event.key` helps).
- Managing game controller inputs.

## Common Failure Patterns

- **Input Hijacking:** Triggering a shortcut while a user is trying to type
  into a form field.
- **Missing Mac Support:** Using `ctrlKey` exclusively and forgetting that Mac
  users expect `metaKey`.
- **Conflict with Screen Readers:** Using combinations like `Alt + F` which
  might be used to navigate menus in a screen reader.
- **Lack of Discovery:** Implementing dozens of shortcuts but never telling the
  user they exist.
- **No "Esc" to Cancel:** Forgetting that `Escape` should almost always close
  active overlays or cancel "pending" shortcut sequences.

## Validation Criteria

- [ ] **Input Field Test:** Verify shortcuts don't trigger while typing in
      an `<input>` or `<textarea>`.
- [ ] **Cross-Platform Test:** Test on both macOS (Cmd) and Windows/Linux (Ctrl)
      if possible.
- [ ] **Prevent Default Test:** Ensure shortcuts like `Cmd+S` don't trigger the
      browser's "Save Page" dialog.
- [ ] **Discovery Test:** Ensure the help menu is accessible and lists all
      current shortcuts.
- [ ] **Aria-Keyshortcuts Check:** Verify that elements have the correct
      `aria-keyshortcuts` attribute.
