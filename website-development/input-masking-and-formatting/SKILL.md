---
name: input-masking-and-formatting
description:
  Implement and debug real-time input masking for structured data (phone,
  credit card, dates) while ensuring cursor stability and accessibility.
---

# Input Masking and Formatting

## Purpose

The Input Masking and Formatting skill provides a technical protocol for
transforming user input into structured formats in real-time. It solves the
problem of "jumpy" cursors, inaccessible formatted values, and the friction
caused by manual separator entry (like typing dashes in a phone number).

## Use Cases

- **Financial Inputs:** Formatting credit card numbers (4-4-4-4) or currency.
- **Contact Details:** Auto-formatting phone numbers based on locale patterns.
- **Date/Time Entry:** Enforcing `MM/DD/YYYY` or `HH:MM` patterns.
- **Identity Codes:** Formatting SSNs, tax IDs, or license keys.

## When NOT to Use

- **Free-text Inputs:** Comments, names, or addresses where patterns are
  unpredictable.
- **Standard Search Bars:** Where strict formatting might prevent valid searches.
- **Native Browser Pickers:** If a native `<input type="date">` or `<input type="color">`
  meets the requirements, use it instead of a masked text input.

## Inputs

1. **Target Pattern:** The structure of the mask (e.g., `(###) ###-####`).
2. **Input Element:** The HTML `<input>` or `<textarea>` to be masked.
3. **Validation Logic:** Regex or rules for allowed characters (e.g., digits only).
4. **Input Mode:** The appropriate `inputmode` (e.g., `numeric`, `tel`).

## Outputs

1. **Formatted UI:** Real-time character insertion (separators) as the user types.
2. **Normalized Data:** A "raw" value stripped of mask characters for submission.
3. **Stable Cursor:** Logic that prevents the cursor from jumping to the end of
   the line during mid-string edits.
4. **Accessible State:** ARIA attributes that communicate the required format
   to assistive technology.

## Workflow

### 1. Set the Technical Foundation

- Use `type="text"` or `type="tel"`. Avoid `type="number"` as it does not
  support the Selection API (`selectionStart`) in many browsers, which is
  required for cursor stability.
- Apply `inputmode` to trigger the correct mobile keyboard.
- Provide a `placeholder` that demonstrates the expected format.

### 2. Capture and Filter Input

- Listen for the `input` event (better than `keydown` for handling paste/mobile).
- Strip all non-essential characters from the value to get the "raw" data.
- Apply the mask pattern to the raw data.

### 3. Manage Cursor Position (Crucial)

- Before updating the input value, record the current `selectionStart`.
- After updating, calculate the new cursor position based on how many separators
  were added or removed *before* the cursor.
- Use `setSelectionRange()` to restore the cursor to the correct logical spot.

### 4. Handle Deletions

- Ensure that deleting a separator character (like a `/` in a date) also deletes
  the preceding data character, or correctly skips over it without "getting stuck."

### 5. Coordinate with ARIA

- Use `aria-placeholder` to maintain the format hint even when the input has data.
- Use `aria-describedby` to link the input to an instruction string (e.g.,
  "Format: MM/DD/YYYY").
- Avoid using `type="password"` for masked fields unless they are sensitive, as
  masking itself is a visual aid.

## Decision Rules

- **Native vs. Custom:** Always check if a native type (like `type="tel"`) is
  sufficient. Use custom masking only when a specific, rigid visual format is
  required for UX. Note that `type="number"` should be avoided for masked
  fields.
- **Library vs. Vanilla:** For complex, dynamic masks (International Phone), use
  a proven library (like `IMask` or `Cleave.js`). For simple fixed masks
  (Credit Card), a vanilla JS utility is more performant.
- **Client vs. Server Formatting:** Always normalize data (remove mask) before
  sending it to the server. The server should store the raw data, not the mask.

## Constraints

- **Cursor Stability:** The cursor must never jump to the end of the input when
  a user edits the middle of a formatted string.
- **Accessibility:** Screen readers must announce the value clearly. Avoid
  changing the `value` so frequently that it triggers redundant announcements.
- **Paste Support:** Users must be able to paste a formatted or unformatted
  string, and the mask should apply correctly.

## Non-Goals

- Implementing server-side data validation or sanitization.
- Handling complex internationalization for every possible phone format.
- Styling the input's visual appearance (CSS).

## Common Failure Patterns

- **The "Jump" Bug:** Updating `input.value` without restoring selection,
  causing the cursor to snap to the end.
- **Infinite Loops:** An `input` listener that modifies the value, which
  triggers another `input` event (use a guard or check if the value actually
  changed).
- **Over-Restricted Input:** Preventing users from typing valid characters
  because the mask is too rigid (e.g., rejecting "+" in a phone field).
- **Broken Backspace:** Making it impossible to delete separators, forcing
  the user to select-all and start over.

## Validation Criteria

- [ ] **Cursor Edit Test:** Click in the middle of a formatted value (e.g.,
      between digits 4 and 5 of a credit card) and type/delete. Does the cursor
      stay in the correct relative position?
- [ ] **Paste Test:** Paste `1234567890` into a phone field. Does it format to
      `(123) 456-7890`?
- [ ] **Mobile Keyboard Test:** Does the correct keyboard (numeric/tel) appear?
- [ ] **Screen Reader Test:** Does the screen reader announce the value sensibly
      without getting stuck on separators?
- [ ] **Clear Test:** Can the user select all text and delete it in one go?
