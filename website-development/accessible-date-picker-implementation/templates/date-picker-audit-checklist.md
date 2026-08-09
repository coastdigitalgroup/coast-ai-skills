# Accessible Date Picker WCAG Audit Checklist

This checklist provides a structured protocol to audit custom date pickers (calendar dialogs) for WCAG 2.1/2.2 Level AA compliance.

## 1. Keyboard Navigation & Focus Control

- [ ] **Trigger Focus:** When the calendar dialog is closed, focus is returned cleanly to the toggle button (preventing focus reset to top of page).
- [ ] **Dialog Trap:** When open, focus is trapped inside the calendar dialog container. Pressing `Tab` cycles focus between navigation buttons and the grid, and does not spill out to background links.
- [ ] **Escape Dismissal:** Pressing `Escape` at any point inside the dialog dismisses it and restores focus to the toggle button.
- [ ] **Roving Tabindex:** Only the active focused date has `tabindex="0"`. All other dates are `tabindex="-1"`.
- [ ] **Arrow Navigation:** Users can navigate the grid cells using Arrow Keys:
  - [ ] `ArrowLeft` / `ArrowRight` (change day by 1)
  - [ ] `ArrowUp` / `ArrowDown` (change day by 7)
- [ ] **Grid Step Shortcuts:**
  - [ ] `PageUp` / `PageDown` (change month)
  - [ ] `Shift + PageUp` / `Shift + PageDown` (change year)
  - [ ] `Home` / `End` (move focus to start/end of current week row)
- [ ] **Selection Activation:** Pressing `Enter` or `Space` selects the focused date, synchronizes the text input, and closes the dialog.

## 2. Screen Reader Semantics & ARIA States

- [ ] **Expanded State:** The toggle button has `aria-haspopup="dialog"` and correctly toggles `aria-expanded="true/false"` when open/closed.
- [ ] **Dialog Role:** The calendar overlay container has `role="dialog"` (or `role="grid"` wrapper) and `aria-modal="true"`.
- [ ] **Descriptive Labeling:** The dialog has `aria-label` or `aria-labelledby` referencing the current Month/Year header element.
- [ ] **Spoken Full Dates:** Date buttons inside cells contain a rich semantic `aria-label` that includes full day names, month names, and years (e.g., `<button aria-label="Monday, October 16, 2023">16</button>`) instead of bare numeric values.
- [ ] **Selected State:** Selected dates explicitly declare `aria-selected="true"`.
- [ ] **Disabled State:** Disabled/out-of-bound dates are explicitly marked with `disabled` or `aria-disabled="true"`, and include "Unavailable" or "Disabled" in their `aria-label`.
- [ ] **Live Announcements:** Screen readers are notified via an `aria-live` or `aria-atomic` region when months are swapped.

## 3. Visual & Styling Standards

- [ ] **Focus Indicators:** The active focused date, navigation buttons, and text input have a high-contrast focus indicator (minimum 3:1 contrast ratio against the surrounding background).
- [ ] **Color Independence:** Selection and today's date indicators are not communicated by color alone (e.g. today has a distinctive border, selection has high-contrast background fill).
- [ ] **Contrast Compliance:** All text elements (month titles, week initials, date numbers) meet a minimum WCAG contrast ratio of 4.5:1.
- [ ] **Touch Target Size:** Date buttons have a minimum physical size of `40px` to `44px` on mobile viewports to prevent click/tap collisions.
- [ ] **No Auto-Submit:** Buttons representing month navigation and toggle indicators have explicit `type="button"` attributes to prevent unwanted form submission behavior.

## 4. Manual Text Entry & Parsing

- [ ] **Form Labeling:** The text input is correctly associated with a `<label>` via matching `id` and `for` attributes.
- [ ] **Masking Support:** Explicit date entry instructions (e.g. `MM/DD/YYYY`) are linked to the input via `aria-describedby`.
- [ ] **Validation Semantics:** Entering an invalid date dynamically triggers `aria-invalid="true"` on the text input.
- [ ] **Bidirectional Sync:** Modifying the input value manually updates the calendar dialog's active selection when next opened.
