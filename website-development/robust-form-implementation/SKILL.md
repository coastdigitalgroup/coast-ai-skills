---
name: robust-form-implementation
description:
  Implement and debug accessible, performant, and resilient web forms using
  native APIs and ARIA best practices.
---

# Robust Form Implementation

## Purpose

The Robust Form Implementation skill provides a technical framework for building
web forms that are accessible to all users, leverage native browser capabilities
for validation, and handle complex interaction states (loading, error, success)
reliably.

## Use Cases

- Building a new contact or registration form from scratch.
- Auditing and fixing accessibility issues in existing forms (e.g., missing
  labels, silent validation errors).
- Implementing client-side validation that stays in sync with server-side
  requirements.
- Managing "double-submit" prevention and asynchronous submission states.

## When NOT to Use

- **Simple Search Inputs:** A single search field usually doesn't require the
  full robust form pattern.
- **Internal Dashboard Filters:** While accessibility is still important, the
  high-stakes state management of a submission form may be overkill for simple
  UI filters.

## Inputs

1. **Functional Requirements:** What data needs to be collected?
2. **Validation Rules:** Which fields are required? What are the format
   constraints (regex, min/max)?
3. **Submission Context:** Is it a standard POST or an asynchronous (AJAX/Fetch)
   submission?
4. **Error Mapping:** How does the server return errors (JSON structure)?

## Outputs

1. **Semantic HTML Structure:** Forms using `<label>`, `<fieldset>`, and
   appropriate input types.
2. **ARIA-Enhanced Accessibility:** Correct use of `aria-describedby` for
   instructions/errors and `aria-invalid` for state.
3. **Native Validation Logic:** Implementation using the Constraint Validation
   API (`checkValidity()`, `setCustomValidity()`).
4. **State Management:** Logic for handling `disabled` states during submission
   and displaying success/failure feedback.

## Workflow

### 1. Structure for Accessibility

- **Labeling:** Every input must have a `<label>` associated via the `for`
  attribute.
- **Grouping:** Use `<fieldset>` and `<legend>` for related groups (e.g., radio
  button sets, address sections).
- **Instructions:** Link helper text to inputs using `aria-describedby`.

### 2. Implement Constraint Validation

- Use semantic input types (`type="email"`, `type="number"`) and attributes
  (`required`, `pattern`, `minlength`).
- Prevent the default browser validation bubbles if a custom UI is required
  using the `novalidate` attribute on the `<form>`.
- Use the `invalid` event to trigger custom error displays.

### 3. Handle Error Communication

- **Linking:** Errors must be programmatically linked to their inputs using
  `aria-describedby`.
- **State:** Toggle `aria-invalid="true"` on fields with errors.
- **Summary:** For long forms, provide an error summary at the top of the form
  that receives focus upon a failed submission.

### 4. Manage Submission State

- **Disable Submits:** Disable the submit button immediately upon click to
  prevent double-submissions.
- **Visual Feedback:** Provide a loading indicator (e.g., a spinner or
  "Sending...") and ensure it's announced to screen readers using
  `aria-live="polite"`.
- **Success/Failure:** Replace or supplement the form with clear feedback after
  the request completes.

## Decision Rules

- **Native vs. Custom Validation:** Always start with native attributes. Only
  add JS for complex cross-field validation or custom UI requirements.
- **Real-time vs. On-Submit:** Validate "on blur" or "on input" after the first
  submission attempt to reduce noise while providing timely feedback.
- **Focus Management:** If the server returns a list of errors, move focus to
  the error summary or the first invalid field.

## Constraints

- **No Label-less Inputs:** Placeholders are not substitutes for labels.
- **Keyboard Navigation:** The form must be entirely navigable and submittable
  via keyboard.
- **No "Silent" Errors:** Errors must be announced or made focusable; never rely
  on color alone.

## Non-Goals

- Styling the form (CSS is implementation-specific).
- Handling backend database logic or specific API authentication.
- Building complex multi-step "wizard" flows (though the principles here apply
  to each step).

## Common Failure Patterns

- **Disconnected Labels:** Using `id` on the label instead of `for`.
- **Missing `aria-describedby`:** Error messages are visible but not read by
  screen readers when the user focuses the input.
- **Tab Order Issues:** Custom form elements (like stylized checkboxes) missing
  from the tab sequence.
- **Double Submits:** Failing to disable the submit button during a slow network
  request.
- **Resetting Focus to Top:** Losing the user's place after an AJAX submission
  error.

## Validation Steps

- [ ] **Accessibility Audit:** Run an automated tool (e.g., Axe) and verify
      `aria-describedby` links.
- [ ] **Keyboard Test:** Ensure `Tab` and `Enter` work as expected throughout
      the flow.
- [ ] **Screen Reader Test:** Verify that error messages are announced when an
      invalid field receives focus.
- [ ] **Network Throttling Test:** Simulate a slow connection to ensure the
      "Loading" state and double-submit prevention work.
- [ ] **Constraint API Check:** Verify that `form.checkValidity()` correctly
      identifies all error states.
