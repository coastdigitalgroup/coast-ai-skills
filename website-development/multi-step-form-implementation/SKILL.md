---
name: multi-step-form-implementation
description:
  Implement and debug accessible multi-step forms (wizards) that manage state,
  handle per-step validation, and maintain focus context between transitions.
---

# Multi-Step Form Implementation

## Purpose

The Multi-Step Form Implementation skill provides a technical framework for
orchestrating complex data-entry sequences. It solves the challenge of managing
user progress, preserving state across steps, and ensuring that screen reader
and keyboard users are correctly oriented during transitions between form
segments.

## Use Cases

- **Registration & Onboarding:** Breaking down long user sign-up processes into
  logical "Account," "Profile," and "Preferences" steps.
- **E-commerce Checkouts:** Guiding users through "Shipping," "Payment," and
  "Review."
- **Surveys & Assessments:** Implementing long questionnaires that require
  intermediate validation and progress tracking.
- **Complex Application Flows:** Configuring nested entities or multi-part
  service requests.

## When NOT to Use

- **Simple Forms:** If a form has fewer than 5–7 fields, keep it on a single
  page to reduce interaction friction.
- **Non-Linear Configuration:** If users need to jump between unrelated sections
  independently, use `accessible-tabs-implementation` or an accordion-based
  layout instead.
- **Stateless Redirects:** If every "step" is a separate URL that reloads the
  entire page from the server, standard page navigation principles apply.

## Inputs

1. **Step Schema:** A defined list of steps, their field dependencies, and
   validation requirements.
2. **State Management Plan:** How data is stored (Local State, SessionStorage,
   or Backend) before final submission.
3. **Progress Logic:** Is the sequence strictly linear, or can steps be skipped
   based on previous answers?

## Outputs

1. **Orchestration Logic:** JavaScript to handle step visibility, "Next/Back"
   navigation, and state preservation.
2. **Accessible Transitions:** Focus management scripts and ARIA live region
   announcements for step changes.
3. **Per-Step Validation:** Logic that prevents progression until the current
   view's constraints are met.
4. **Progress UI Integration:** Connection to a `step-progress-system` for
   visual feedback.

## Workflow

### 1. Structure the Markup

- Use a single `<form>` element wrapping all steps OR individual forms per step
  if using a modular component architecture.
- Group each step's fields inside a container (e.g., `<section>` or
  `<div>`) with `role="group"` or `role="region"`.
- Assign a unique ID and a descriptive heading to each step container.

### 2. Manage State & Visibility

- Use CSS to hide inactive steps (e.g., `display: none` or the `hidden`
  attribute).
- Maintain a "Current Step" index in JavaScript.
- Ensure that "Back" navigation preserves previously entered data.

### 3. Implement Per-Step Validation

- Intercept the "Next" action.
- Use the Constraint Validation API (`checkValidity()`) on only the fields
  within the *current* step.
- Display error messages and prevent progression if the step is invalid.

### 4. Handle Focus Management (Critical)

- When moving to a **Next** step: Move focus to the first focusable element
  (usually the first input or the step heading).
- When moving to a **Previous** step: Move focus to the "Next" button of that
  step or the first input.
- Use `aria-live="polite"` to announce "Step X of Y: [Step Name]" when the
  view changes.

### 5. Final Submission

- On the final step, change the "Next" button to a "Submit" button.
- Perform a final global validation check before sending data to the server.

## Decision Rules

- **Client-Side vs. Server-Side Storage:** Use **Client-Side** (JS State/Storage)
  for fast, app-like transitions. Use **Server-Side** (Drafts) for extremely
  long flows where users might return days later.
- **Validation Timing:** Validate the current step *only* when the user tries to
  proceed. Do not block the "Back" button with validation errors.
- **Summary Step:** Always include a "Review" step before final submission for
  flows with more than 3 steps.

## Constraints

- **Accessibility:** Users must be notified of step changes. Use `aria-current="step"`
  on the progress indicator.
- **Data Persistence:** Ensure the browser "Back" button behavior is handled
  (either via the History API or by prompting the user) to avoid accidental
  data loss.
- **Keyboard Path:** The tab order must remain logical. Hidden steps must be
  removed from the tab order (`display: none` or `tabindex="-1"`).

## Non-Goals

- Implementing the visual progress bar (see `step-progress-system`).
- Handling backend API persistence or database schemas.
- General form styling (theming).

## Common Failure Patterns

- **Focus Loss:** Moving to the next step but leaving focus on the (now hidden)
  "Next" button, causing the screen reader to lose context.
- **Silent Validation:** Failing a step's validation but not moving focus to the
  first error, leaving the user stuck on the current page without knowing why.
- **Inaccessible Progress:** A visual progress bar that isn't announced or
  updated for screen reader users.
- **Data Erasure:** Clicking "Back" and finding all previously entered data
  cleared.

## Validation Criteria

- [ ] **Step Transition Test:** Verify focus moves to the new step's heading or
      first input upon clicking "Next."
- [ ] **Validation Test:** Attempt to click "Next" with empty required fields;
      verify progression is blocked and errors are visible.
- [ ] **Back Navigation Test:** Go to Step 2, enter data, go back to Step 1,
      then return to Step 2. Verify data is preserved.
- [ ] **Screen Reader Announcement:** Verify that "Step [X] of [Y]" or the step
      title is announced when the "Next" button is clicked.
- [ ] **Final Submission Check:** Verify that all data from all steps is
      correctly gathered into the final payload.
