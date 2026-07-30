# Keyboard Interactions & ARIA Guide for Multi-Select Tag Inputs

Designing a multi-select tag input with accessible keyboard behavior is one of the most challenging frontend interactions. This guide maps out the precise key mappings, focus lifecycles, and screen reader verbalizations necessary for a WCAG 2.1 AA compliant implementation.

---

## 1. Key Interactions Mapping

The tag input wrapper must intercept and dispatch key behaviors based on the active focus context (whether the user is focusing the typing text field or a tag chip).

| Key | Focus Context | Expected Action |
| :--- | :--- | :--- |
| **Enter** | Text Input | Triggers tag addition. If input has text, creates the tag chip, appends it, clears the input, and announces the addition. If input is empty, does nothing (or submits form if designed that way). |
| **Backspace** | Text Input (Empty) | Shifts programmatic focus to the **last tag chip** in the list. |
| **ArrowLeft** | Text Input (Empty, cursor at index 0) | Shifts programmatic focus to the **last tag chip** in the list. |
| **ArrowLeft** | Tag Chip (Focused) | Moves focus to the previous tag chip. If the first chip is focused, focus remains there (does not wrap, to provide clear boundary limits). |
| **ArrowRight** | Tag Chip (Focused) | Moves focus to the next tag chip. If the last tag chip is focused, focus returns cleanly to the **text input**. |
| **Backspace / Delete** | Tag Chip (Focused) | Deletes the currently focused tag chip. Programmatically focuses the next tag chip (or previous chip if the deleted chip was the last one, or the text input if no chips remain). |
| **Escape** | Tag Chip (Focused) | Immediately returns focus to the text input, clearing the roving tag focus state. |
| **Home** | Tag Chip (Focused) | Instantly moves focus to the **first tag chip** in the list. |
| **End** | Tag Chip (Focused) | Instantly moves focus to the **last tag chip** in the list. |
| **Tab** | Anywhere | Standard sequential tab focus. Focus leaves the component and enters the next focusable element on the page. (The component must **never** trap the `Tab` key). |
| **Shift + Tab** | Anywhere | Focus leaves the component and moves to the previous focusable element on the page. |

---

## 2. Focus Lifecycle and Roving Tabindex

A **Roving Tabindex** is required to keep the list of selected tags as a single focus stop in the document outline, preventing keyboard users from suffering excessive tab-key fatigue.

### Phase A: Input-Only Focus (Default)
When a user tab-navigates into the tag input container:
1. The text input receives focus (`tabindex="0"`).
2. All tag chips inside the list have `tabindex="-1"`.
3. Close buttons inside the chips also have `tabindex="-1"`.
4. The user can press `Tab` once to leave the component.

```
[ Tag A (tabindex=-1) ]  [ Tag B (tabindex=-1) ]  [ Input (Focused, tabindex=0) ]
```

### Phase B: Tag Traversal (Arrow Mode)
When the user presses `Backspace` or `ArrowLeft` inside an empty input:
1. The last chip receives programmatic focus.
2. The last chip's tabindex changes to `0` and `.focus()` is called.
3. The text input remains focusable, but visual focus is now inside the list.
4. As the user moves between chips using `ArrowLeft`/`ArrowRight`, the currently focused chip gets `tabindex="0"`, while the previously focused chip resets to `tabindex="-1"`.

```
[ Tag A (tabindex=-1) ]  [ Tag B (Focused, tabindex=0) ]  [ Input (tabindex=0) ]
```

### Phase C: Focus Restoration on Deletion
When a focused chip is deleted:
1. The DOM node is removed.
2. Focus must **instantly** be re-routed. Letting the browser fallback default to `document.body` is a critical accessibility failure.
3. If there are remaining tags, set the target tag's `tabindex="0"` and call `.focus()`.
4. If no tags remain, call `.focus()` on the text input.

---

## 3. Screen Reader Announcements

Because screen readers do not automatically verbalize dynamic DOM mutations, developers must utilize an ARIA Live polite region to announce modifications.

### Verbal Templates

* **Addition Announcement:**
  - *Trigger:* Successful tag submission.
  - *Announcement:* `"Added tag: [TagName]"`
  - *Example:* `"Added tag: JavaScript"`

* **Deletion Announcement:**
  - *Trigger:* Removal of a tag via keypress or close button click.
  - *Announcement:* `"Removed tag: [TagName]. [RemainingCount] tags remaining."`
  - *Example:* `"Removed tag: TypeScript. 2 tags remaining."`

* **Duplicate Warning:**
  - *Trigger:* User attempts to submit an already existing tag.
  - *Announcement:* `"Tag [TagName] has already been added."`
  - *Example:* `"Tag React has already been added."`

---

## 4. Key Implementation Pitfalls

* **The Double-Tab Issue:** If the remove button inside a chip has `tabindex="0"` (or no tabindex attribute at all), keyboard users will have to tab *twice* per chip (once for the chip, once for the button). Always set the close button's tabindex explicitly to `-1`. Because the button is inside the focused listitem, a screen reader user can still activate it or read it, but sequential keyboard-only navigators are protected.
* **Typing Interruptions:** Do not intercept backspace events if the text input is *not* empty. If a user has typed "React" and presses Backspace, they expect to delete the letter "t", not focus the previous tag. Always verify `input.value === ""` before transferring focus.
* **Layout Shifts:** When tags wrap, the container can grow. Ensure that any parent layout is designed to flex or accommodate height expansion gracefully without breaking layout grids or hiding text.
