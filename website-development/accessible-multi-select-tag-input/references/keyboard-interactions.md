# Keyboards and ARIA Specs for Tag Inputs

Building an accessible multi-select tag (chip) input requires adhering to precise WAI-ARIA and WCAG guidelines. This reference document explains the keyboard behaviors, ARIA roles, and screen reader announcements required to achieve compliance.

---

## 1. The Keyboard Roving Focus Pattern

In a standard, inaccessible tag input, a keyboard user pressing `Tab` is forced to focus every single tag close button sequentially. If a user has 20 tags selected, they must press `Tab` 20 times just to navigate past the input field. This is a severe WCAG keyboard violation.

To solve this, we use the **Roving Focus Pattern**:
- Only **one** interactive component within the widget is ever in the standard tab order (`tabindex="0"`). By default, this is the text entry `<input>`.
- All closed tag buttons are excluded from the default tab order using `tabindex="-1"`.
- When focus is on the empty `<input>`, pressing the `ArrowLeft` key programmatically transfers focus to the last tag.
- When focus shifts to a tag, its container is temporarily assigned `tabindex="0"`, while the `<input>` retains focus internally or receives `tabindex="-1"`. We then call `.focus()` on that active tag.
- The arrow keys then let the user traverse the tags. When they arrow past the rightmost tag, focus is programmatically returned to the `<input>`.

### Keyboard Key Event Mapping

| Key Event | Context | Action / Behavior |
| :--- | :--- | :--- |
| **Tab** | Anywhere | Focus exits the tag-input widget completely and moves to the next focusable page element. Temporary roving states are cleared. |
| **Shift + Tab** | Input | Focus exits the tag-input widget and moves to the previous focusable page element. |
| **ArrowLeft** | Text Input | If cursor is at start of input (index 0), programmatically focus on the **last tag chip** in the list. |
| **ArrowLeft** | Focused Tag | Move focus to the **previous tag chip** in the list (if index > 0). |
| **ArrowRight** | Focused Tag | Move focus to the **next tag chip** in the list. If currently on the last tag chip, return focus to the **text input**. |
| **Backspace** | Text Input | If input is empty, programmatically focus on the **last tag chip** to prepare for deletion (protects from accidental immediate deletion). |
| **Backspace / Delete** | Focused Tag | Deletes the currently focused tag. Programmatically shifts focus to the **next logical tag chip** (or the previous tag chip if the deleted tag was the last in the list, or the text input if no tags remain). |
| **Escape** | Focused Tag | Programmatically returns focus back to the **text input** and resets all focused tag classes. |
| **Enter** | Text Input | If text has been typed, inserts the text as a new tag chip and clears the input. Does not trigger form submit. |

---

## 2. ARIA Roles & Linkages

To ensure assistive technologies (like screen readers) correctly interpret the relationship of the tag chips and input field, we establish key ARIA attributes.

```
+-------------------------------------------------------------+
| Widget Container (aria-describedby="instructions-id")       |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Tag List (role="list", aria-label="Selected Items")   |  |
|  |                                                       |  |
|  |  +-------------------------------------------------+  |  |
|  |  | Chip Item (role="listitem", id="chip-1")        |  |  |
|  |  | "JavaScript"                                    |  |  |
|  |  | [Remove Button] (aria-describedby="chip-1")     |  |  |
|  |  +-------------------------------------------------+  |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Text Input (aria-labelledby="label-id")               |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

### Roles Breakdown

1. **`role="list"` on the list container:** Tells screen readers that the selected chips form a group. This provides count statistics (e.g. *"Selected items, list, 3 items"*).
2. **`role="listitem"` on each chip:** Maps individual items inside the parent list structure.
3. **`aria-describedby` on the close button:** Connects the close button to the text of the chip. (e.g., `<button aria-describedby="chip-react">` ensures that the screen reader announces "Remove, React, button" instead of just "Remove, button").
4. **`aria-live="polite"` on the status container:** Ensures that additions and deletions are immediately announced out loud, without disrupting the user's active screen-reader reading focus.

---

## 3. Screen Reader Announcement Requirements

Because the visual layout re-renders instantly on additions or deletions, screen readers do not always capture changes. We must explicitly trigger speech notifications using a polite live region.

### Golden Rules for Announcements

- **Be Clear and Concise:** Avoid overly verbose sentences. Say `"Added tag: Python"` rather than `"You have successfully added the tag named Python to your list of selected skills."`
- **Include Remaining Count:** On removal, let the user know what was removed and how many items remain. E.g., `"Removed tag: Java. 2 tags remaining."`
- **Flush the Live Region:** Some screen readers (especially VoiceOver in Safari) will not announce the exact same string twice in a row. Before injecting a message, set the `.textContent = ''` of the live region, and use a short `setTimeout` (approx. 50ms) to write the new text. This forces the screen reader to detect the change and speak it clearly.
