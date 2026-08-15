---
name: accessible-multi-select-tag-input
description:
  Implement and debug accessible multi-select tag inputs (chip inputs) with Arrow-key keyboard navigation, screen reader notifications, and focus management.
---

# Accessible Multi-Select Tag Input

## Purpose

The Accessible Multi-Select Tag Input (also known as a chip or token input) provides a technical protocol for building, auditing, and debugging interactive fields where users can enter, select, and delete multiple values (tags/tokens/chips) within a single composite field wrapper.

Most custom multi-select tag inputs are highly inaccessible. Common issues include:
1. **Focus Oblivion:** Keyboard users cannot focus on the selected tags to review or delete them without using a mouse.
2. **Screen Reader Silence:** Screen readers do not announce when tags are added or removed, or fail to communicate the connection between the input field and its selected tags.
3. **Broken Input Mechanics:** Pressing `Backspace` inside the input can unexpectedly delete tags without prior warning or visual focus tracking.

This skill ensures that custom tag inputs provide semantic HTML, robust keyboard focus management (roving tabindex/arrow-key navigation), clear screen reader announcements via ARIA live regions, and strict layout stability.

## Use Cases

- **Form Fields with Multi-Select Value Pools:** Adding tags to blog posts, assigning categories to products, selecting skills on a profile, or choosing multiple email recipients (e.g., "To:" field in email clients).
- **Advanced Filtering Controls:** Picking multiple filter criteria from a list (e.g., filtering real estate listings by "Garage", "Pool", "Balcony").
- **Auditing Legacy Custom Inputs:** Correcting div-based or library-based tag inputs that lack keyboard support or screen reader announcements.

## When NOT to Use

- **Single Select / Standard Dropdown:** If users can only select a single value, use a standard native `<select>` element or an `accessible-combobox-implementation` (single-select pattern).
- **Simple Checkbox Groups:** If the list of options is short, static, and does not require type-ahead or inline token representation, use a list of standard checkbox inputs (`<input type="checkbox">`). This is more robust and has zero JavaScript overhead.
- **Hierarchical Selections:** If selection involves structured trees (e.g., folder hierarchies), use an `accessible-tree-view-implementation` combined with a selection list.

## Inputs

1. **Tag Data Source:** An array of existing tags (initially selected) and optionally a database of available options for autocomplete/typeahead.
2. **Interactive Elements:**
   - A wrapper container element that acts visually as the fake input field.
   - A text `<input>` element for typing new tags or filtering suggestions.
   - A `<button>` element for each selected tag to act as its "remove" control.
   - An `aria-live` status container to stream screen reader alerts.
3. **Visual Specifications:** Target dimensions, border active states, focus styles, and token styles.

## Outputs

1. **Semantic HTML Structure:** A wrapping container with correct relationships, an inline list (`<ul>`/`<li>`) of selected tags, and a linked text input.
2. **Focus Management Logic:** JavaScript handlers controlling arrow-key navigation between the input field and the selected tag list items.
3. **ARIA live region Alerts:** Programmatic text string updates injected into an `aria-live="polite"` element upon addition or removal.
4. **Clean Keyboard Backspace Rules:** A safe, standard flow for deleting elements using the keyboard without disorienting the user.

---

## Workflow

### 1. Establish the Semantic Markup

To ensure screen readers can navigate and read the selected tags correctly, they should be grouped into a semantic list (`role="list"` or `<ul>`) immediately preceding or inside the input container. The entire widget should be correctly labeled.

```html
<div class="tag-input-widget" id="widget-skills">
  <!-- Screen reader descriptive text -->
  <span id="skills-label" class="tag-input-label">Select Skills</span>
  <span id="skills-instructions" class="visually-hidden">
    Use backspace to delete the last tag, or use Left and Right arrow keys to navigate and delete individual tags.
  </span>

  <!-- Visual wrapping container that mimics a form input -->
  <div class="tag-input-container"
       onclick="document.getElementById('tag-text-input').focus()">

    <!-- List of selected tags -->
    <ul class="tag-list"
        role="list"
        aria-label="Selected skills"
        id="tag-list-skills">
      <!-- Standard tag item structure -->
      <li class="tag-chip" role="listitem" id="tag-item-js" data-value="javascript">
        <span class="tag-text">JavaScript</span>
        <button type="button"
                class="tag-remove-button"
                aria-describedby="tag-item-js"
                aria-label="Remove JavaScript"
                tabindex="-1">
          &times;
        </button>
      </li>
      <li class="tag-chip" role="listitem" id="tag-item-css" data-value="css">
        <span class="tag-text">CSS</span>
        <button type="button"
                class="tag-remove-button"
                aria-describedby="tag-item-css"
                aria-label="Remove CSS"
                tabindex="-1">
          &times;
        </button>
      </li>
    </ul>

    <!-- Standard text input for typing new tags -->
    <input type="text"
           id="tag-text-input"
           class="tag-input-field"
           aria-labelledby="skills-label"
           aria-describedby="skills-instructions"
           autocomplete="off"
           autocorrect="off"
           spellcheck="false">
  </div>

  <!-- ARIA Live region for announcements (Crucial!) -->
  <div class="visually-hidden"
       id="tag-input-live-region"
       role="status"
       aria-live="polite">
  </div>
</div>
```

---

### 2. Style the Layout (CSS)

The CSS must wrap the tags and the input box gracefully, making them look like a single, cohesive input block. Crucially, the inner input field must stretch and size itself naturally.

```css
.tag-input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #94a3b8;
  border-radius: 6px;
  background-color: #ffffff;
  cursor: text;
  min-height: 44px;
  box-sizing: border-box;
}

/* Focused input state matches natural browser inputs */
.tag-input-container:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 14px;
  color: #1e293b;
  gap: 4px;
}

/* Visual cue when a tag is selected/focused via keyboard arrow keys */
.tag-chip.is-focused {
  background-color: #dbeafe;
  border-color: #2563eb;
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.tag-remove-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-remove-button:hover,
.tag-remove-button:focus {
  color: #ef4444;
  outline: none;
}

.tag-input-field {
  flex: 1 1 120px;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 14px;
  min-width: 80px;
  background: transparent;
}

/* Visually hidden but readable by screen readers */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
```

---

### 3. Handle Keyboard and Focus Logic (JavaScript)

To avoid breaking keyboard tab-navigation (which would require tabbing through *every* selected tag), use a **roving focus / Arrow Key** navigation model.
- By default, all tag "remove" buttons have `tabindex="-1"`. The only focusable element via standard `Tab` is the `<input>`.
- When the input is empty and the user presses the `Left Arrow` key, visual focus moves to the last tag in the list.
- Users can navigate between tags using `Left Arrow` and `Right Arrow`.
- When a tag is focused:
  - Pressing `Backspace` or `Delete` deletes that tag. Focus automatically shifts to the next logical tag (or back to the input if the last tag is deleted).
  - Pressing `Right Arrow` on the rightmost tag returns focus to the `<input>`.
  - Pressing `Escape` or clicking anywhere else returns focus to the `<input>`.

Here is the exact focus transition matrix:

```
[ Input (Empty) ]  -- Press Left Arrow -->  [ Focus Last Tag Chip ]
[ Focused Tag Chip ] -- Press Left Arrow -->  [ Focus Previous Tag Chip ]
[ Focused Tag Chip ] -- Press Right Arrow --> [ Focus Next Tag Chip / Input ]
[ Focused Tag Chip ] -- Press Backspace -->   [ Delete Tag & Focus Next Tag ]
```

---

### 4. Implement Screen Reader Live Announcements

Assistive technologies must be notified of addition and deletion actions. Do not rely on screen readers reading the DOM re-render. Instead, inject polite announcements into your active `aria-live` region.

- **Addition Announcement:** `"Added tag: TypeScript"`
- **Removal Announcement:** `"Removed tag: CSS"`
- **Count/Status Updates (Optional but recommended):** `"3 tags remaining."`

```javascript
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('tag-input-live-region');
  if (liveRegion) {
    liveRegion.textContent = ''; // Clear first to force re-reading in older browsers
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 50);
  }
}
```

---

## Decision Rules

### Roving Focus vs. Inline Delete

| Feature / Scenario | Backspace-to-Delete Directly from Input | Roving Focus arrow-key review |
| :--- | :--- | :--- |
| **UX Safety** | Low. Easy to accidentally double-tap Backspace and delete wanted tags. | High. Users must explicitly focus and confirm the tag highlight. |
| **Accessibility Conformance** | Poor. Screen reader users often do not know they have deleted a tag until they re-read. | Excellent. The visually focused tag can be announced explicitly. |
| **Complexity** | Simple (single event listener inside the input). | Moderate (requires list indexing, tag states, and roving focus pointers). |
| **Recommendation** | **Do not use exclusively.** Instead, require the first Backspace press on an empty input to *focus* the last tag chip (making it active), and the *second* Backspace press to delete it. | **Primary choice.** Implementing Arrow Key navigation provides maximum WCAG compliance. |

---

## Constraints

- **Touch Targets:** Tag "remove" buttons must have a clickable container that meets WCAG target standards (aim for at least `24px` inline, or let tapping the chip itself toggle removal when screen-reader navigation is not active).
- **DOM Desync:** When tags are added or removed, ensure the visual chips match a hidden input's native state or a standard form serialization structure (such as a hidden `<select multiple>` element) to guarantee non-JS and standard form submissions work correctly.
- **Visual Contrast:** The active/focused state of a chip (`.is-focused`) must have a distinct border color with a contrast ratio of at least **3:1** against the background to remain visible to low-vision and color-blind keyboard users.

## Non-Goals

- Implementing the database autocomplete backend API or server-side fuzzy matching.
- Rendering complex nested category structures within individual chips (keep tokens flat).
- Custom drag-and-drop sorting of tag chips (keep items ordered by entry sequence for simplicity).

---

## Common Failure Patterns

- **The "Mystery Click" Trap:** Clicking the wrapper container does not focus the text input. Users are forced to click exactly on the tiny `<input>` line, creating a frustrating experience.
- **The "Unannounced Delete":** Users delete a tag using Backspace, but the screen reader does not announce the deletion. The user believes their keyboard is not responding and continues typing.
- **The "Focus Loop Loss":** When a user focuses a tag chip and deletes it, focus is completely lost and jumps back to the top of the `<body>` instead of gracefully shifting to the next tag or returning to the input.
- **Direct Input Manipulation:** Mutating `.innerHTML` of the entire list container on every keydown. This destroys existing visual focus states and resets active input IME compositions (such as Japanese or Pinyin inputs).
- **Missing Accessible Names:** The close button is styled with `&times;` (`×`), but has no `aria-label="Remove JavaScript"`. A screen reader will read *"times, button"* or *"multiplication, button"*, leaving the user completely confused.

---

## Validation Criteria

- [ ] **Click-to-Focus Check:** Click on any whitespace inside the fake outer border. Confirm that focus immediately shifts to the inner text `<input>`.
- [ ] **Roving Keyboard Focus Test:**
  1. Add several tags.
  2. Clear the input.
  3. Press `Left Arrow`. Verify that visual focus shifts to the last tag chip and highlights it.
  4. Press `Left Arrow` again. Verify that focus moves to the previous tag chip.
  5. Press `Right Arrow` until focus returns to the input field.
- [ ] **Keyboard Deletion Test:**
  1. Focus on a tag chip using arrow keys.
  2. Press `Backspace` or `Delete`.
  3. Confirm the tag is deleted and focus is correctly placed on the next tag (or previous tag if deleting the last item) or back in the `<input>`. Focus must *never* jump to the `<body>`.
- [ ] **Screen Reader Live Region Verification:** Use a screen reader (VoiceOver, NVDA, or JAWS). Clear the input and type a tag, then press Enter. Confirm that the screen reader announces `"Added tag: [Name]"`. Focus a tag and delete it, confirming it announces `"Removed tag: [Name]"`.
- [ ] **No Tag Focus Leakage:** Press `Tab` to navigate through the form. Ensure you do not have to tab through every selected tag. You should only tab to the composite input wrapper/field once.
- [ ] **Contrast Check:** Verify that the `.is-focused` chip state has a clear contrast ratio of at least 3:1 against the surrounding background.
