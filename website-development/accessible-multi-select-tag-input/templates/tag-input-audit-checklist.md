# Accessible Multi-Select Tag Input Audit Checklist

Use this checklist to audit custom multi-select tag (chip) inputs for accessibility (WCAG 2.1/2.2 AA) and overall UX resilience.

## 1. Keyboard Navigation & Interaction

- [ ] **Tab Navigation Constraint:** Pressing `Tab` focuses the text input, but does **not** force the user to tab through every single selected tag chip.
- [ ] **Roving Focus Trigger:** When the input field is empty, pressing `Left Arrow` safely moves focus to the last selected tag chip.
- [ ] **Arrow Traversal:** Pressing `Left Arrow` and `Right Arrow` navigates through the tag chips sequentially.
- [ ] **Input Re-entry:** Pressing `Right Arrow` on the very last tag chip in the list returns keyboard focus smoothly to the text input.
- [ ] **Keyboard Deletion:** Pressing `Backspace` or `Delete` while a tag chip has roving focus immediately deletes that tag and moves focus to the next logical tag (or back to the input if the list is empty).
- [ ] **Escape Action:** Pressing `Escape` while a tag is focused returns keyboard focus to the text input and clears the roving active state.
- [ ] **Accidental Backspace Protection:** Pressing `Backspace` inside the empty text input does **not** instantly delete the last tag without visual confirmation. Instead, the first Backspace highlights/focuses the last chip, and the second deletes it.

## 2. Screen Reader Compatibility

- [ ] **Semantic List Structure:** The selected tags are wrapped in a list element (`<ul>` or `role="list"`) and each chip is structured as a list item (`<li>` or `role="listitem"`).
- [ ] **Implicit Association:** The tag list has a clear, accessible label (e.g. `aria-label="Selected skills"` or via `aria-labelledby`).
- [ ] **Accessible Close Controls:** Each tag's remove button has an explicit `aria-label` (e.g. `aria-label="Remove JavaScript"`) rather than reading out the visual multiplication symbol (`&times;` / "times" / "multiplication").
- [ ] **Context Association:** The remove buttons reference their parent chip text via `aria-describedby` or have self-contained accessible labels so screen readers can correctly associate the action with the tag name.
- [ ] **Dynamic Live Region Updates:** Adding a tag triggers a polite announcement (e.g. *"Added tag: WebGL"*).
- [ ] **Deletion Live Region Announcements:** Removing a tag triggers an announcement specifying the tag removed and remaining count (e.g. *"Removed tag: CSS. 3 tags remaining"*).
- [ ] **Labeling and Context:** The text input is correctly labeled by the main form label (e.g., using `for`/`id` or `aria-labelledby`).

## 3. Visual & Style Design

- [ ] **Interactive Visual Container:** Clicking anywhere inside the visual field container (such as the outer border or blank padding space) transfers focus into the text input.
- [ ] **Focus Ring Indicator:** Visual focus ring on the input wrapper matches the style of standard active input borders (e.g. `outline` or custom `box-shadow`).
- [ ] **Active Chip Highlight:** The currently focused chip (via Arrow keys) has a distinct high-contrast border and background color shift.
- [ ] **Focus Contrast Ratio:** The focused chip's active border has a contrast ratio of at least **3:1** against the page background.
- [ ] **Windows High Contrast Mode Support:** When Forced Colors Mode is active, focused chips remain visually distinct through solid outlines or border-thickness adjustments.
- [ ] **Text Overflow Wrapping:** If many tags are added, they wrap naturally onto multiple lines (using CSS Flexbox/Grid) instead of clipping, overflowing the card body, or breaking layout alignments.

## 4. Touch & Pointer Devices

- [ ] **Touch Target Sizing:** Remove buttons or the clickable chips themselves have a minimum interactive size of **24x24px** (WCAG 2.2 inline target exception) or **44x44px** (WCAG 2.1) to avoid accidental mis-taps on small phone screens.
- [ ] **Cursor Affordance:** Hovering over chips or close buttons triggers a distinct pointer cursor (`cursor: pointer`), and text input fields trigger an I-beam cursor (`cursor: text`).

## 5. State & Form Integration

- [ ] **Hidden Field Syncing:** Added or removed tags are synchronized with a hidden field or hidden `<select multiple>` element so that native HTML form submissions serialize the values correctly.
- [ ] **Keyboard Submission:** Adding a tag by hitting `Enter` inside the input does **not** prematurely submit the parent `<form>`. The input keydown intercept handles tag generation and stops event propagation.
