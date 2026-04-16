# Accessibility & Interaction States Checklist

This reference summarizes the key WCAG 2.1 requirements and best practices for
interactive states.

## 1. Focus Indicators (Success Criterion 2.4.7)

- **Visibility:** Any keyboard-operable user interface has a mode of operation
  where the keyboard focus indicator is visible.
- **Contrast (WCAG 2.1 - 1.4.11):** The focus indicator must have a contrast
  ratio of at least 3:1 against the background and the component's non-focused
  state.
- **Style:** While browser defaults are acceptable, custom focus rings are
  preferred for brand consistency. Never use `outline: 0` or `outline: none`
  without an alternative.

## 2. Touch Target Size (Success Criterion 2.5.5)

- **Minimum Area:** Interactive elements must have a target size of at least
  44x44 CSS pixels.
- **Exceptions:** If the link is within a block of text (sentence) or if the
  target is available through another link on the same page.

## 3. Use of Color (Success Criterion 1.4.1)

- **Rule:** Color is not used as the only visual means of conveying information,
  indicating an action, prompting a response, or distinguishing a visual
  element.
- **States:** Error or Success states MUST include a secondary indicator (icon,
  border weight change, or text label).

## 4. Pointer Gestures & Cancellation (Success Criterion 2.5.1 / 2.5.2)

- **Cancellation:** For any function that can be operated using a single
  pointer, the completion of the function is on the "up-event" (e.g.,
  `pointerup`, `click`).
- **Undo:** Users should be able to move their pointer away from the element
  before releasing to cancel the action.

## 5. Non-Text Contrast (Success Criterion 1.4.11)

- **UI Components:** Visual information required to identify user interface
  components and states (except for inactive components) has a contrast ratio of
  at least 3:1 against adjacent colors.

## 6. Feedback Delay

- **Response Time:** Users perceive actions as immediate if the feedback occurs
  within 100ms.
- **Skeleton Screens:** For states that take longer than 500ms (Loading), use a
  skeleton screen or a progress indicator to maintain user trust.
