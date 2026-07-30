# Accessible Multi-Select Tag Input Audit Checklist

This audit checklist guides developers and QA testers through checking the accessibility, keyboard navigation, and structural design of custom multi-select tag input fields to ensure compliance with WCAG 2.1 AA and WAI-ARIA standards.

---

## 1. Visual & Semantic Structure

- [ ] **Descriptive Outer Labeling:** The compound container has a clearly defined visible label (or `aria-label`/`aria-labelledby`) that is correctly linked to the text input.
- [ ] **Unordered List Wrapper:** Selected chips are wrapped in a `<ul>` or `<ol>` element with `role="list"` and an `aria-label="Selected tags"`.
- [ ] **Individual List Items:** Each chip element is styled as a list item (`<li>`) with `role="listitem"`.
- [ ] **No Default Focus Stops:** When the user tabs to the input field, the individual chips and their internal close buttons are **not** focusable (they must have `tabindex="-1"` initially).
- [ ] **Close Button Labelling:** Close buttons inside chips do not use vague characters like `x` or icon fonts alone. They must contain a clear, explicit, assistive-tech friendly label (e.g., `aria-label="Remove JavaScript tag"`).
- [ ] **Contrast Verification:** The text color inside chips, the close button icon, and any focused borders meet the WCAG contrast requirement of at least **4.5:1** against their background colors.
- [ ] **Focus Indicators:** Active focused chips have a highly visible custom outline or background transition that is easily distinguished visually (and supports Windows High Contrast Mode).

---

## 2. Keyboard Interactions

- [ ] **Single Tab-Stop Roving Focus:** Keyboard users can press `Tab` to skip past the entire group of selected tags straight to the text input field. They are not forced to tab through every single chip.
- [ ] **Input-to-Chip Backward Transition:** Clearing the input and pressing `Backspace` or `ArrowLeft` programmatically focuses the very last chip in the list.
- [ ] **Chip-to-Input Forward Transition:** Pressing `ArrowRight` on the last chip in the list returns focus cleanly to the text input field.
- [ ] **Sequential Arrow Navigation:** Pressing `ArrowLeft` and `ArrowRight` allows sequence traversal of all chips.
- [ ] **Instant Escape Recovery:** Pressing `Escape` while focusing any chip immediately clears the active chip focus state and returns focus back to the text entry field.
- [ ] **Roving Tabindex updates:** While moving arrow keys, verify the focused chip's tabindex changes to `0`, while all other chips return to `tabindex="-1"`.
- [ ] **Home & End Support:** Pressing `Home` jumps focus to the first chip in the list; pressing `End` jumps focus to the last chip.
- [ ] **Robust Focus Preservation on Deletion:** When a focused chip is deleted (via `Backspace` or `Delete` keys):
  - If there is an element *after* it, focus shifts to that next element.
  - If it was the last element, focus shifts to the *previous* element.
  - If all tags are deleted, focus returns cleanly to the text input field.
  - Focus must **never** get lost or drop back to the document body.

---

## 3. Screen Reader & Assistive Technology

- [ ] **Live Announcement Region:** A dedicated `<div aria-live="polite" class="sr-only">` is present in the DOM.
- [ ] **Dynamic Addition Announcement:** Adding a tag results in an instant screen reader announcement, e.g., `"Added tag: TypeScript"`.
- [ ] **Dynamic Deletion Announcement:** Deleting a tag triggers a clear notification of the deleted item and remaining counts, e.g., `"Removed tag: TypeScript. 2 tags remaining."`
- [ ] **Semantic Node Announcements:** When focusing an individual chip, the screen reader announces its relative position in the list, e.g., `"TypeScript, list item, 2 of 3"`.
- [ ] **Avoid Announcement Flood:** Ensure that navigating between chips using arrow keys does *not* flood the live region with redundant verbal additions/removals.

---

## 4. Touch & Responsive Engineering

- [ ] **Touch Target Size:** The close buttons inside chips have an active target size of at least **44x44px** (visual padding or transparent hitzones) to ensure precise finger tapping on mobile devices.
- [ ] **Layout Wrapping Resilience:** Chips wrap smoothly onto multiple rows inside the container. They do not overflow horizontally or cause visual clipping in small viewports.
- [ ] **Adaptive Container Height:** As chips wrap and populate additional lines, the input container grows vertically to prevent content from overlaying or colliding with adjacent layout sections.
- [ ] **Pointer Focus Syncing:** Clicking or tapping directly on a chip places the roving focus on that chip, correctly synchronizing the internal index state.
