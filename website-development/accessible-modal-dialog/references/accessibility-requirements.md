# Accessibility Requirements for Modals

To meet WCAG 2.1 AA standards, a modal dialog must satisfy several technical requirements.

## ARIA Roles and Attributes

| Attribute | Required | Purpose |
| :--- | :--- | :--- |
| `role="dialog"` | Yes | Identifies the element as a dialog. (Included in native `<dialog>`) |
| `role="alertdialog"` | Selective | Use for urgent confirmation modals that interrupt the workflow. |
| `aria-labelledby` | Yes | Points to the ID of the title heading. Essential for screen reader context. |
| `aria-describedby` | Optional | Points to the ID of the descriptive text if the title isn't enough. |
| `aria-modal="true"` | Yes | Tells assistive tech that content outside this element is inert. (Included in native `<dialog>`) |

## Keyboard Interactions

| Key | Expected Action |
| :--- | :--- |
| `Tab` | Moves focus to the next focusable element inside the modal. Must wrap to the start. |
| `Shift + Tab` | Moves focus to the previous focusable element inside the modal. Must wrap to the end. |
| `Escape` | Closes the modal and returns focus to the trigger. |
| `Enter` / `Space` | Activates the focused button inside the modal. |

## Focus Management Rules

1. **Trigger Preservation:** The element that opens the modal must remain in the DOM so focus can return to it.
2. **Initial Placement:** Focus should move to the most logical element (the first input, the first button, or the container itself).
3. **No Focus Leakage:** Users must not be able to "Tab out" of the modal into the navigation or footer of the background page.
4. **Restoration:** Once closed, the user should be exactly where they were before opening the modal.

## Visual Considerations

- **Backdrop Dimming:** A visual overlay helps low-vision users and users with cognitive disabilities focus on the active task.
- **Focus Indicators:** High-contrast focus rings are mandatory for elements within the modal.
- **Content Contrast:** All text inside the modal must meet minimum contrast ratios (4.5:1 for normal text).

## Helpful Resources
- [W3C WAI-ARIA Authoring Practices: Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN Web Docs: The Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
