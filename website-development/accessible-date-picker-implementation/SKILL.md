---
name: accessible-date-picker-implementation
description:
  Implement and debug WCAG-compliant custom date pickers (calendar dialogs)
  that support precise keyboard grid navigation, focus trapping, proper WAI-ARIA
  semantics, and synchronous input validation.
---

# Accessible Date Picker Implementation

## Purpose

The Accessible Date Picker Implementation skill provides a technical protocol for building, auditing, and debugging custom calendar date pickers. Because native `<input type="date">` elements vary widely in visual appearance, browser support, and accessibility features, developers often implement custom date pickers. However, custom date pickers are notoriously difficult to make accessible and are frequently completely unusable for keyboard-only and screen-reader users.

This skill solves:
1. **Semantic Structure:** Designing a grid layout (`role="grid"`, `role="row"`, `role="gridcell"`) that screen readers can correctly interpret as a calendar.
2. **Focus Management and Trapping:** Trapping focus inside the calendar dialog when it is opened and restoring focus to the trigger button when it is dismissed.
3. **Advanced Keyboard Navigation:** Implementing standard keystrokes to let users navigate day-by-day, week-by-week, month-by-month, and year-by-year inside the calendar grid.
4. **Input Synchronization:** Maintaining real-time bidirectional synchronization between a standard, maskable text input (for manual entry) and the visual calendar overlay.
5. **Mobile Touch Target Optimization:** Adapting the grid to meet minimum sizing standards for touch interactions without sacrificing semantic grid behavior.

## Use Cases

- **Booking and Scheduling Engines:** Reservation systems, appointment booking flows, and hotel/flight date selectors.
- **Transactional Checkouts:** Specifying delivery dates, service startup times, or subscription intervals.
- **Profile and Registration Forms:** Entering dates of birth, start dates, or anniversaries.
- **Reporting Dashboards:** Selecting custom date ranges for analytical queries and reports.

## When NOT to Use

- **Simple Month/Year Expired Selectors:** For credit card expiration fields, standard native `<select>` dropdowns for month and year are far more usable, robust, and accessible.
- **Standard Native Pickers (No Branding Constraints):** If custom styling or custom date restrictions (e.g., blocking weekends or specific holidays) are not required, rely on the native browser `<input type="date">`. Native pickers on mobile operating systems (iOS/Android) offer outstanding OS-level zoom and accessibility integrations.
- **Vague Relative Dates:** If a form only requires general selections like "Today," "Tomorrow," "Next Week," or "Next Month," a standard `<select>` element or radio group is a much simpler and more accessible alternative.

## Inputs

1. **Host Input Element:** A standard `<input type="text">` representing the text entry field.
2. **Toggle Button:** The trigger (frequently a calendar icon button) that toggles the calendar dialog visibility.
3. **Configuration Options:**
   - `minDate` / `maxDate`: Earliest and latest selectable dates.
   - `disabledDays`: Array of dates or functions identifying disabled days (e.g., weekends, holidays).
   - `dateFormat`: The string template (e.g., `YYYY-MM-DD`, `MM/DD/YYYY`) for formatting and parsing.
4. **Localization Settings:** Array of day names (short/full) and month names for rendering and aria-labels.

## Outputs

1. **Semantic HTML Grid Structure:** A table or CSS-grid container marked with proper roles (`grid`, `row`, `columnheader`, `gridcell`, `button`) that maps days of the week and dates.
2. **Keyboard-Navigable Controller:** A reusable vanilla JavaScript controller class (`AccessibleDatePicker`) managing focus state, calendar matrix generation, and active selection.
3. **Focus Trap State Engine:** Utility logic to trap focus inside the calendar dialog (cycling between month navigation buttons and the calendar grid cells).
4. **Dynamic Screen Reader Announcer:** Event-driven updates to day-button `aria-labels` representing dates in fully spoken formats (e.g., "Monday, October 16, 2023").

---

## Workflow

### 1. Establish the Semantic ARIA Structure

The HTML structure must separate the text input field from the calendar overlay, while ensuring they are linked programmatically.

```html
<div class="date-picker-wrapper">
  <!-- Text Input for manual input and masking -->
  <label for="booking-date">Departure Date (MM/DD/YYYY)</label>
  <div class="input-group">
    <input
      type="text"
      id="booking-date"
      placeholder="MM/DD/YYYY"
      aria-describedby="date-picker-instructions"
    />
    <button
      type="button"
      class="calendar-toggle"
      aria-label="Choose departure date"
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      <svg aria-hidden="true" ...></svg>
    </button>
  </div>
  <span id="date-picker-instructions" class="visually-hidden">
    Use MM/DD/YYYY format. You can also open the calendar with the Choose date button and navigate it using arrow keys.
  </span>

  <!-- Calendar Dialog (Initially Hidden) -->
  <div
    id="calendar-dialog"
    class="calendar-dialog"
    role="dialog"
    aria-modal="true"
    aria-label="Calendar date selector"
    hidden
  >
    <!-- Live region for screen reader announcements on navigation -->
    <div class="visually-hidden" aria-live="polite" id="calendar-live-region"></div>

    <!-- Calendar Controls -->
    <div class="calendar-header">
      <button type="button" class="btn-prev-month" aria-label="Previous month">‹</button>
      <h2 id="calendar-month-year" aria-live="assertive" aria-atomic="true">October 2023</h2>
      <button type="button" class="btn-next-month" aria-label="Next month">›</button>
    </div>

    <!-- Calendar Grid -->
    <table class="calendar-grid" role="grid" aria-labelledby="calendar-month-year">
      <thead>
        <tr role="row">
          <th role="columnheader" aria-label="Sunday"><span aria-hidden="true">Su</span></th>
          <th role="columnheader" aria-label="Monday"><span aria-hidden="true">Mo</span></th>
          <th role="columnheader" aria-label="Tuesday"><span aria-hidden="true">Tu</span></th>
          <th role="columnheader" aria-label="Wednesday"><span aria-hidden="true">We</span></th>
          <th role="columnheader" aria-label="Thursday"><span aria-hidden="true">Th</span></th>
          <th role="columnheader" aria-label="Friday"><span aria-hidden="true">Fr</span></th>
          <th role="columnheader" aria-label="Saturday"><span aria-hidden="true">Sa</span></th>
        </tr>
      </thead>
      <tbody class="calendar-days">
        <!-- Rendered dynamically by Javascript -->
      </tbody>
    </table>
  </div>
</div>
```

### 2. Implement the Focus Trap & Roving Tabindex

To satisfy WCAG requirements:
- **Toggling Overlay:** When the calendar dialog is opened, set `aria-expanded="true"` on the toggle button, remove the `hidden` attribute from the dialog, and focus the currently selected date (or today's date if empty).
- **Roving Tabindex:** Only **one** day inside the calendar grid should be focusable (`tabindex="0"`) at any given time. All other day buttons must have `tabindex="-1"`. This allows screen reader and keyboard users to enter the grid via `Tab`, navigate around using arrow keys without tabbing through 31 separate cells, and leave the grid via `Tab`.
- **Keyboard Trap:** Listen for the `keydown` event on the dialog. Prevent focus from leaving the dialog container. Tabbing past the last interactive element (Next Month button or focused day) wraps focus back to the first interactive element (Previous Month button).
- **Dismissal:** Pressing `Escape` or selecting a date must immediately hide the dialog, set `aria-expanded="false"`, and restore focus to the toggle button.

### 3. Master the Keyboard Navigation Logic

Implement the complete WAI-ARIA Keyboard Interaction specifications inside your grid container's `keydown` listener.

```javascript
function handleGridKeyDown(event, currentDate) {
  let targetDate = new Date(currentDate);
  let handled = true;

  switch (event.key) {
    case 'ArrowLeft':
      targetDate.setDate(targetDate.getDate() - 1);
      break;
    case 'ArrowRight':
      targetDate.setDate(targetDate.getDate() + 1);
      break;
    case 'ArrowUp':
      targetDate.setDate(targetDate.getDate() - 7);
      break;
    case 'ArrowDown':
      targetDate.setDate(targetDate.getDate() + 7);
      break;
    case 'PageUp':
      if (event.shiftKey) {
        targetDate.setFullYear(targetDate.getFullYear() - 1); // Previous year
      } else {
        targetDate.setMonth(targetDate.getMonth() - 1); // Previous month
      }
      break;
    case 'PageDown':
      if (event.shiftKey) {
        targetDate.setFullYear(targetDate.getFullYear() + 1); // Next year
      } else {
        targetDate.setMonth(targetDate.getMonth() + 1); // Next month
      }
      break;
    case 'Home':
      // Move to first day of current week
      const startDay = targetDate.getDay();
      targetDate.setDate(targetDate.getDate() - startDay);
      break;
    case 'End':
      // Move to last day of current week
      const endDay = targetDate.getDay();
      targetDate.setDate(targetDate.getDate() + (6 - endDay));
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      selectDate(targetDate);
      return;
    case 'Escape':
      closeCalendarDialog();
      return;
    case 'Tab':
      // Let the standard focus trap cycle manage focus
      return;
    default:
      handled = false;
      break;
  }

  if (handled) {
    event.preventDefault();
    navigateToDate(targetDate); // Render new month matrix if needed, update tabindex, and focus the new date
  }
}
```

### 4. Spoken Context for Screen Readers

A bare number like "16" lacks sufficient descriptive context when read aloud by screen readers. Every selectable day button must be styled with dynamic labels.
- Set `aria-label` to the full formatted date name: `<button tabindex="-1" role="gridcell" aria-label="Monday, October 16, 2023">16</button>`.
- Set `aria-selected="true"` only on the button that matches the input's current active date.
- For disabled dates (out of range or holidays), set `aria-disabled="true"` or `disabled` and ensure the `aria-label` announces "Unavailable" or "Disabled" (e.g., "Saturday, October 14, 2023, Unavailable").

### 5. Input Synchronization and Robust Parsing

Manual typing must never go out of sync with the visual calendar.
- **On Input/Blur:** Listen for change and blur events on the `<input>`. Write a robust date parser that checks if the entered string matches the expected format (e.g., `MM/DD/YYYY`).
- **Validation:** If the entered date is invalid, set `aria-invalid="true"` on the input, show a clear visual error message, and do not update the calendar selection. If valid, parse the date and update the calendar's active date.
- **On Select:** When a day is clicked or activated via `Enter`/`Space` in the grid, update the input's value, trigger a `change` event, clear any validation errors, and close the dialog.

---

## Decision Rules

### Grid Navigation: Roving Tabindex vs. `aria-activedescendant`

| Strategy | When to Choose | Core Implementation Requirements |
| :--- | :--- | :--- |
| **Roving Tabindex (Recommended)** | Standard web interfaces, lightweight vanilla applications, or highly modular CSS. | - Set `tabindex="0"` on the currently focused date button.<br>- Set `tabindex="-1"` on all other day buttons.<br>- Programmatically trigger `.focus()` on the new date button upon arrow navigation. |
| **`aria-activedescendant`** | High-performance dynamic single-page applications, custom composite widgets, virtualized layouts. | - Keep physical browser focus locked inside the text input.<br>- Generate unique IDs for every visible day button.<br>- Update the input's `aria-activedescendant="day-id"` attribute during arrow key navigation.<br>- Style `.has-focus` visual classes on target cells. |

---

## Constraints

- **Accessibility Rules:**
  - Standard buttons (`<button type="button">`) must be used inside cells to trigger selection. Divs with clicks will be skipped by keyboards and speech command tools.
  - The calendar container must use `role="dialog"` or `role="grid"` combined with `aria-modal="true"`.
  - Contrasts for grid cells, active focus states, and calendar header navigation elements must meet a minimum ratio of 4.5:1.
- **Pointer Targets:** Grid cells must maintain a minimum bounding size of `44px x 44px` (or `40px` with generous margins) on mobile viewports to prevent click/tap collisions.
- **Form Submission:** Ensure toggle buttons inside forms have `type="button"` explicitly set. A button without a type defaults to `type="submit"`, causing the form to submit whenever a user tries to open the calendar!

## Non-Goals

- Implementing time-zone converters or UTC synchronization helpers.
- Creating complex multi-month side-by-side comparative grid engines.
- Build-time date calculation utilities (rely on lightweight wrappers or standard native `Date` functions).

---

## Common Failure Patterns

- **The Submit-Button Trap:** Forgetting to declare `type="button"` on the toggle or navigation buttons. Clicking them submits the active form and refreshes the page, ruining the user's booking flow.
- **The Tabbing Nightmare:** Setting `tabindex="0"` on every single day button. A keyboard user must press `Tab` up to 31 times just to bypass the calendar, which is a major accessibility violation.
- **Silent Grid Navigation:** Failing to update the `aria-live` status region or changing months without informing screen-reader users. The user is left arrowing blindly into what they assume is the original month.
- **No Manual Fallback:** Building a calendar that *only* permits point-and-click selection. Power users, automated autofill systems, and keyboard-reliant users with visual impairments are locked out.
- **Focus Black Holes:** Failing to restore programmatic focus to the calendar toggle button once the dialog is closed. Focus gets reset to the top of the viewport, forcing the user to tab all the way down the page again.

---

## Validation Criteria

- [ ] **Form Submission Audit:** Insert the date picker inside a `<form>` element. Click the previous/next month buttons and verify that the form is *not* submitted.
- [ ] **Focus Restoration Test:** Focus the toggle button and hit `Space`. The calendar opens, and focus is trapped inside. Select a date or press `Escape`. Confirm that the dialog closes and focus returns instantly to the toggle button.
- [ ] **Keyboard Grid Walk:** Open the calendar. Verify that:
  - `ArrowLeft`/`ArrowRight` changes days.
  - `ArrowUp`/`ArrowDown` jumps weeks.
  - `PageUp`/`PageDown` jumps months.
  - `Shift+PageUp`/`Shift+PageDown` jumps years.
  - `Home`/`End` focuses the first/last day of the week.
- [ ] **Tabindex Verification:** Inspect the HTML inside the calendar grid during navigation. Confirm that only the focused day button has `tabindex="0"`, while all others are correctly set to `tabindex="-1"`.
- [ ] **Screen Reader Reading Verification:** Run VoiceOver (macOS/iOS) or NVDA (Windows). Tab into the calendar and arrow through dates. Ensure the screen reader reads the full spoken format (e.g. "Wednesday, October 18, 2023") and announces selection states clearly.
