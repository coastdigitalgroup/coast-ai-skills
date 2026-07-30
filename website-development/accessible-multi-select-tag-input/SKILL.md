---
name: accessible-multi-select-tag-input
description:
  Implement and audit accessible, keyboard-navigable multi-select tag (chip/token)
  inputs with roving tabindex, custom backspace deletion, and real-time ARIA live announcements.
---

# Accessible Multi-Select Tag Input

## Purpose

The Accessible Multi-Select Tag Input skill provides a robust frontend protocol for implementing, styling, and auditing multi-select tag (chip or token) fields.

Custom tagging inputs (e.g., email "To" fields, content taxonomy tagging, multi-select search filters) are notoriously difficult to make fully accessible. Common issues include keyboard traps, inability to traverse selected tags with keyboard commands, lack of semantic styling, and failure to announce tag addition, navigation, and deletion to screen readers. This skill details how to manage the interaction between an input field and a list of tags using semantic structures, a roving tabindex focus system, and real-time visual and auditory status updates.

---

## Use Cases

- **Taxonomy / Tagging Interfaces:** Selecting multiple categories, keywords, or labels for blog posts, products, or support tickets.
- **Recipient Composition Fields:** Multi-recipient selection in email, messaging, or invoicing applications.
- **Advanced Filtering Controls:** Defining multiple filter criteria (e.g., specific locations, price ranges, or languages) in sidebars or search panels.
- **Multi-Select Comboboxes:** Enhancing standard select menus to display chosen options as dismissible visual tokens.

---

## When NOT to Use

- **Single-Select Lists:** If the user can only select one option at a time, a standard dropdown or single-select combobox is the correct approach (see `accessible-combobox-implementation`).
- **Simple Checkbox Groups:** When there are fewer than 5 selectable items, displaying standard `<input type="checkbox">` elements is simpler, more accessible natively, and reduces interaction friction.
- **Static Token Displays:** If tags are read-only (i.e., they are purely visual labels displaying a post's categories and cannot be removed or interacted with), do not add interactive button roles or complex keyboard patterns. Use static semantic text lists instead.

---

## Inputs

1. **Tag Container Element (`<ul>` or `<div>`):** The DOM wrapper holding the list of already-selected tags.
2. **Text Input Element (`<input type="text">`):** The primary keyboard input field where users type tags or trigger search suggestions.
3. **Pre-defined Data List (Optional):** Preloaded list of suggestions when integrated with a combobox listbox dropdown.
4. **ARIA Live Announcement Region (`<div aria-live="polite">`):** A hidden container dedicated to reading status updates to assistive technologies.

---

## Outputs

1. **Semantic HTML Structure:** A tag list marked with `role="list"` and individual tags with `role="listitem"`, coupled with an input field linked to its parent label.
2. **Interactive Roving Tabindex Model:** JavaScript handlers coordinating tag focus, ensuring only the currently active item has `tabindex="0"` (or `-1` when focus returns to the text input) to prevent keyboard trap regressions.
3. **Complex Keyboard Event Interceptor:** Touch/keyboard listeners resolving key sequences (`Backspace`, `Delete`, `ArrowLeft`, `ArrowRight`, `Escape`) to smoothly transfer focus between tags and the text field.
4. **Polite Screen Reader Announcements:** Dynamic text injection into a dedicated `aria-live` region, confirming tag actions (e.g., "Added tag: CSS", "Removed tag: CSS, 2 tags remaining").

---

## Workflow

### 1. Establish the Semantic Layout
The tag input must consist of two logical zones: the list of currently selected tags and the text input to add more. These should reside in a single visual panel, but remain structurally clean:

- **Tag List Container:** Wrap selected chips in an unordered list (`<ul>`) with `role="list"` and an explicit, descriptive `aria-label` (e.g., `aria-label="Selected tags"`).
- **Individual Chips:** Render each chip as a list item (`<li>`) with `role="listitem"`.
- **Remove Button:** Inside each chip, provide a visible button (`<button>`) with `type="button"`. Use a descriptive, screen-reader friendly `aria-label` that includes the tag name (e.g., `aria-label="Remove JavaScript tag"`), rather than a generic label or icon character like `aria-label="Delete"`.
- **Primary Input:** The `<input type="text">` must have an associated `<label>` (either visible or connected via `aria-labelledby`/`aria-label`).

```html
<div class="tag-input-wrapper">
  <!-- Visually hidden label or visible parent label -->
  <label id="tag-input-label" for="tag-text-input">Add technologies:</label>

  <div class="tag-input-container">
    <!-- Selected Tags List -->
    <ul id="selected-tags-list" role="list" aria-label="Selected tags">
      <li role="listitem" class="tag-chip" data-value="javascript" tabindex="-1">
        <span class="tag-label">JavaScript</span>
        <button type="button" class="tag-remove-btn" aria-label="Remove JavaScript tag" tabindex="-1">&times;</button>
      </li>
      <!-- Additional tags go here -->
    </ul>

    <!-- Text Entry Field -->
    <input
      type="text"
      id="tag-text-input"
      class="tag-input-field"
      autocomplete="off"
      aria-describedby="selected-tags-list"
    />
  </div>

  <!-- Accessible Announcements -->
  <div id="tag-announcement" class="sr-only" aria-live="polite"></div>
</div>
```

### 2. Implement Roving Tabindex Focus Management
To prevent keyboard users from having to tab through dozens of tags to reach the input field, implement a **Roving Tabindex** model:

- **Initial State (Input Focused):** The text input is focused. All selected chips inside the tag list must have `tabindex="-1"` (including their remove buttons). The user can type freely.
- **Transitioning to the Tags:**
  - If the input is completely empty and the user presses `Backspace` or `ArrowLeft`, transfer programmatic focus to the **last chip** in the list.
  - Set that last chip's `tabindex="0"` and call its `.focus()` method. Keep all other chips at `tabindex="-1"`.
- **Traversing Tags:**
  - When a chip has focus, `ArrowLeft` and `ArrowRight` navigate through the tags sequentially.
  - As focus moves to a new chip, set the previously focused chip to `tabindex="-1"`, set the new chip to `tabindex="0"`, and call `.focus()`.
- **Returning to Input:**
  - If focus is on the last chip and the user presses `ArrowRight` or `Escape`, reset all chips to `tabindex="-1"`, and return programmatic focus to the `<input>` element.

### 3. Handle Keyboard Event Sequences
Bind an event listener for `keydown` on the tag input wrapper to capture specific keystrokes:

- **Backspace (On Input):** If the input is empty, focus the last selected tag.
- **Backspace / Delete (On Focused Tag):**
  - Identify the index of the active tag.
  - Delete the tag.
  - Determine the next focus target:
    - If there is a tag *after* the deleted tag, focus that tag.
    - If there is no tag after, but there is a tag *before* the deleted tag, focus the previous tag.
    - If no tags remain, return focus to the text input.
  - Ensure the target's `tabindex` is updated to `0` before calling `.focus()`.
- **Arrow Keys (On Focused Tag):**
  - `ArrowLeft`: Move focus to the previous tag. If the first tag is focused, do nothing (or loop, but stopping at the edge is standard).
  - `ArrowRight`: Move focus to the next tag. If the last tag is focused, return focus to the text input.
- **Escape (On Focused Tag):**
  - Return focus immediately to the text input.

### 4. Inject Dynamic ARIA Live Announcements
Screen reader users cannot see tags visually appearing or disappearing. Use a visually hidden `aria-live="polite"` region to announce updates:

- **On Tag Addition:** Append an announcement: `"Added tag: JavaScript"`.
- **On Tag Removal:** Append an announcement: `"Removed tag: CSS. 2 tags remaining."`.
- **Avoid Over-announcing:** Do not update the live region on simple tag navigation, as the browser's focus announcement on the list/button already tells the user what they are highlighting.

---

## Decision Rules

### Option A: Fully Managed Roving-Tabindex Chips (Recommended)
Focus is placed directly on the chip wrapper `<li>`.
- **Pros:** Perfect semantics; keyboard users can read the entire tag list quickly; respects natural screen reader list reading modes.
- **Cons:** Requires explicit management of `tabindex` across both list items and the inner remove buttons (e.g., setting both the `<li>` and the `<button>` to `tabindex="-1"` so the screen reader doesn't double-tab).
- **When to Use:** Standard web applications seeking full WCAG 2.1 AA compliance.

### Option B: Input-focused Multi-Select Combobox
Focus remains in the input field while tags are displayed visually, with selection managed entirely via screen-reader announcements and inline combobox properties.
- **Pros:** Keeps the cursor in the typing area; less complex event listeners.
- **Cons:** Keyboard-only users cannot easily inspect individual tags to delete them except by backspacing sequentially; difficult to review selections out of order.
- **When to Use:** Complex typing autocompletes with dozens of tags where backspace-only deletion is preferred.

---

## Constraints

- **Passive Tab-Trap Prevention:** Never allow a user to get stuck in a loop inside the tag list. Tabbing out of the component (`Tab` key) must move focus cleanly to the next focusable element on the page, and `Shift + Tab` must move focus to the previous element.
- **Mobile Touch Targets:** The "Remove" button (`&times;` or trash icon) must meet minimum touch target standards. Ensure the clickable target size is at least **44x44px** (using transparent padding if necessary) to enable easy tap target accessibility on mobile viewports.
- **Color Contrast:** The tag background color and text label must have a minimum contrast ratio of **4.5:1** for standard text, and focus indicators must be highly visible (see `focus-indicator-design-system`).

---

## Non-Goals

- Implementing remote autocomplete API integration or database searching.
- Styling specialized dropdown dropdown animations.
- Creating a tag-creation interface with validation on email syntax or numeric ranges.

---

## Common Failure Patterns

- **The "Invisible Button" Trap:** Rendering the close button with a plain `x` char but without an `aria-label`, causing the screen reader to announce only "Button, x" or "Times" without naming the associated tag.
- **Double Tab-Stops:** Leaving the remove button as naturally focusable (`tabindex="0"`) inside a focused tag list, forcing keyboard-only users to press `Tab` twice per tag (once for the chip, once for the remove button).
- **The "Lost Focus" Void:** Deleting a tag and letting focus vanish. If a user deletes a tag, and the developer fails to explicitly focus the next tag or the input, focus drops back to the document root (`<body>`), disorienting the user.
- **Missing Announcement Region:** Adding/removing tags purely visually. Blind users have no context that their enter keypress successfully created a chip.
- **Broken Backspace Trap:** Automatically deleting tags when backspacing inside a text input containing active text, resulting in unintended deletions when the user meant to edit their query.

---

## Validation Steps

### 1. Keyboard Navigation Check
- [ ] Type a value into the input and press `Enter` to submit. Verify the tag is created and focus remains in the input.
- [ ] Clear the input completely. Press `Backspace` once. Verify focus is programmatically moved to the last tag.
- [ ] Press `ArrowLeft` several times. Verify focus moves sequentially backward through the tags.
- [ ] Press `ArrowRight` several times. Verify focus moves forward. When reaching the end, verify focus returns directly to the text input.
- [ ] Highlight a tag using arrow keys and press `Backspace` or `Delete`. Verify the tag is removed, and focus instantly shifts to the next logical tag or the input field.

### 2. Screen Reader Verification
- [ ] Run a screen reader (e.g., VoiceOver or NVDA) and focus the input.
- [ ] Type and add a tag. Verify the screen reader announces `"Added tag: [Name]"`.
- [ ] Press `Backspace` to enter the tag list. Navigate between tags and verify the screen reader announces the tag label and position (e.g., `"JavaScript, Selected tags, list, 1 of 3"`).
- [ ] Delete a tag and verify the announcement says `"Removed tag: [Name]. [N] tags remaining."`

### 3. Touch Layout Verification
- [ ] Check the visual display on smaller viewports. Ensure tags wrap smoothly onto multiple lines without causing layout breaks or pushing adjacent text containers off-screen.
- [ ] Verify the tap target of the tag close button is easy to hit with a finger on a mobile touchscreen.
