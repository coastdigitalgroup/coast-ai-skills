# WAI-ARIA and Keyboard Guidelines for Custom Date Pickers

Implementing a custom date picker requires strict adherence to WAI-ARIA guidelines and keyboard behavior. Below is a breakdown of the design patterns, roles, and interactions required for WCAG 2.1 AA compliance.

## 1. WAI-ARIA Role Mapping

To make the calendar understandable for screen readers, the layout must follow the standard **dialog** and **grid** pattern rather than random visual elements.

| DOM Element | Recommended WAI-ARIA Attributes | Description / Purpose |
| :--- | :--- | :--- |
| **Input wrapper** | `class="date-picker-wrapper"` | Groups the manual entry input and the trigger button. |
| **Text input** | `role="textbox"`, `aria-describedby="[instructions-id]"`, `aria-invalid="true/false"` | Allows manual typing, autocomplete validation, and links descriptive help text. |
| **Toggle button** | `type="button"`, `aria-haspopup="dialog"`, `aria-expanded="true/false"`, `aria-label="..."` | Triggers the visibility of the calendar. `aria-expanded` must be synced on open/close. |
| **Overlay Dialog** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="[month-title-id]"` | Wraps the entire calendar overlay. Traps tab focus inside. |
| **Month Title** | `id="[month-title-id]"`, `aria-live="assertive"`, `aria-atomic="true"` | Heading specifying current month and year. Announces immediately when months are swapped. |
| **Grid Table** | `role="grid"`, `aria-readonly="true"`, `aria-labelledby="[month-title-id]"` | Defines the tabular structure of the calendar. |
| **Header Row** | `role="row"` | Wrap row of weekdays. |
| **Header Cell** | `role="columnheader"`, `aria-label="Full Day Name"` | Individual weekday header (e.g. `aria-label="Monday"` with visual inner text `"Mo"`). |
| **Grid Row** | `role="row"` | Represents a week of dates. |
| **Grid Cell** | `role="gridcell"`, `aria-selected="true/false"` | Cell element wrapping a day button. |
| **Day Trigger** | `type="button"`, `tabindex="0" or "-1"`, `aria-label="Monday, October 16, 2023"` | The actual day selection trigger. Uses roving `tabindex` to keep keyboard traversal simple. |

## 2. Keyboard Interaction Specs

The user must be able to operate the date picker entirely with the keyboard. Implement the following physical button mappings:

### Roving Tabindex Principle
Only **one** day cell (the current focused or selected date) should have `tabindex="0"`. All other date buttons in the grid must have `tabindex="-1"`. When the user tabs into the calendar, focus goes directly to the `tabindex="0"` day. Arrow keys are then used to change focus, programmatically updating which day is `tabindex="0"` and calling `.focus()` on it. This avoids bloating the tab order with 30+ separate items.

### Grid Keystroke Specifications
When keyboard focus is locked inside a day cell button (`.day-btn`), the grid keydown event listener should map these exact behaviors:

- **`ArrowLeft`:** Moves focus to the previous day. If the boundary is crossed, swaps the view to the previous month and focuses its last day.
- **`ArrowRight`:** Moves focus to the next day. If the boundary is crossed, swaps the view to the next month and focuses its first day.
- **`ArrowUp`:** Moves focus to the same day of the previous week (subtracted by 7 days).
- **`ArrowDown`:** Moves focus to the same day of the next week (added by 7 days).
- **`PageUp`:** Moves focus to the same day of the previous month.
- **`PageDown`:** Moves focus to the same day of the next month.
- **`Shift + PageUp`:** Moves focus to the same day of the previous year.
- **`Shift + PageDown`:** Moves focus to the same day of the next year.
- **`Home`:** Moves focus to the first day of the current week (Sunday).
- **`End`:** Moves focus to the last day of the current week (Saturday).
- **`Enter` or `Space`:** Selects the focused date, writes its formatted string to the input, and closes the dialog.
- **`Escape`:** Dismisses the dialog immediately, discards any changes, and restores programmatic focus to the toggle button.

## 3. Mobile Touch Targets & Usability

Custom calendar grids must remain highly responsive and usable on touchscreen devices.

- **Pointer Size:** Grid cells and day buttons must have an interactive boundary of at least `40px` to `44px` on mobile screens. Shrinking targets too far makes them extremely difficult to tap, leading to user frustration.
- **Scroll Hijacking:** Opening the calendar must never lock standard page scrolling unless `aria-modal="true"` behavior is strictly enforced.
- **Logical Margins:** Ensure navigation arrows and close buttons have generous margins (minimum `8px`) to prevent visual or interactive overlap.
