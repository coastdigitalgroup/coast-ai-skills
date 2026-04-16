# Form Accessibility and Validation Reference

## Essential ARIA Attributes for Forms

| Attribute          | Purpose                                                                        | Usage Example                                                |
| :----------------- | :----------------------------------------------------------------------------- | :----------------------------------------------------------- |
| `aria-describedby` | Links an input to its helper text or error message.                            | `aria-describedby="email-hint email-error"`                  |
| `aria-invalid`     | Indicates if the current value fails validation.                               | `aria-invalid="true"`                                        |
| `aria-required`    | Informs assistive tech that a field is mandatory (supplemental to `required`). | `aria-required="true"`                                       |
| `aria-live`        | Announces dynamic content changes (errors/status).                             | `aria-live="polite"` (status), `assertive` (critical errors) |
| `role="alert"`     | Specifically for the error summary to trigger immediate announcement.          | `<div role="alert">...</div>`                                |

## Native HTML5 Input Types & Attributes

Using the correct `type` ensures mobile devices show the appropriate keyboard
and enables basic browser-level validation.

- `type="email"`: Ensures `@` is present.
- `type="tel"`: Triggers numeric keypad on mobile.
- `type="url"`: Validates URL structure.
- `type="number"`: Restricts input to digits (supports `min`, `max`, `step`).
- `required`: Field must not be empty.
- `pattern`: Validates against a Regex (e.g., `pattern="[0-9]{5}"` for ZIP).
- `minlength` / `maxlength`: Controls string length.

## Constraint Validation API (JavaScript)

Key properties and methods for technical implementation:

- `element.checkValidity()`: Returns `true` if the element satisfies all
  constraints.
- `element.validationMessage`: The localized message the browser would show.
- `element.validity`: A `ValidityState` object containing specific failure
  reasons (e.g., `valueMissing`, `typeMismatch`, `patternMismatch`).
- `element.setCustomValidity(message)`: Sets a custom error message. If the
  message is not an empty string, the element is considered invalid.
- `form.reportValidity()`: Triggers the browser's default validation UI
  (bubbles).

## Best Practices for Validation Flow

1.  **Initial State:** No errors visible, `aria-invalid="false"`.
2.  **Submit Action:**
    - Call `form.checkValidity()`.
    - If invalid, prevent submission, toggle `aria-invalid`, show error
      messages, and move focus to the Error Summary.
3.  **Correction State:**
    - Use `blur` or `input` events to clear `aria-invalid` once the user fixes
      the field.
    - Avoid "aggressive" validation (showing errors as the user types their
      first character).
4.  **Asynchronous State:**
    - Disable the submit button immediately.
    - Update a `role="status"` area with "Processing..." or similar.
    - On server error, map JSON errors back to `aria-describedby` containers and
      move focus to the first error.
