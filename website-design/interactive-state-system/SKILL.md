---
name: interactive-state-system
description:
  Design and document the visual behavior of UI elements during user interaction
  (hover, focus, active, disabled, etc.) to ensure usability and accessibility.
---

# Interactive State System

## Purpose

The Interactive State System skill provides a framework for defining how UI
components respond to user input. It ensures that every interactive element
(buttons, links, inputs, cards) has clear, consistent, and accessible visual
feedback across all interaction modes (mouse, keyboard, touch). This system
removes ambiguity for developers and guarantees a high-quality, responsive feel
for the end user.

## Use Cases

- Defining component behavior for a design system or UI library.
- Auditing an existing site for "dead" or non-responsive interactions.
- Ensuring WCAG 2.1 compliance for focus indicators and interactive affordances.
- Standardizing feedback patterns (e.g., all destructive actions behave the same
  way).

## When NOT to Use

- **Static Content:** Purely informational elements that have no click, tap, or
  keyboard interaction.
- **Experimental Motion Design:** Where the goal is complex, non-standard
  animation rather than functional state feedback.
- **Standard Browser Defaults:** If the project strictly relies on unstyled,
  native browser elements (though this is rare for professional website
  designs).

## Inputs

1. **Component Inventory:** A list of all interactive elements in the design.
2. **Brand Color System:** Existing primary, secondary, and semantic color
   scales.
3. **Accessibility Target:** (e.g., WCAG Level AA) which dictates contrast
   ratios for states.

## Outputs

1. **State Matrix:** A comprehensive map showing Default, Hover, Focus, Active,
   and Disabled states for every component.
2. **Interaction Guidelines:** Rules for transitions, timing (ms), and easing
   functions.
3. **Accessibility Specification:** Explicit definitions for focus rings and
   keyboard-only visual cues.

## Workflow

### 1. Identify Interactive Elements

Categorize elements by their interaction type:

- **Actions:** Buttons, links, menu items.
- **Inputs:** Text fields, checkboxes, radio buttons, selects.
- **Containers:** Clickable cards, accordion headers, tabs.

### 2. Define the State Palette

Determine how visual variables change per state:

- **Hover (Mouse):** Slight change in background color, border, or elevation
  (shadow).
- **Focus (Keyboard):** A high-contrast ring or outline. _Must be distinct from
  the Hover state._
- **Active/Pressed:** Visual "compression" (e.g., slight darken or scale down)
  to indicate a successful click/tap.
- **Disabled:** Reduced opacity and removal of interactive cues (cursor
  changes).
- **Visited (Links):** A distinct color for navigated links (critical for
  content-heavy sites).

### 3. Establish Focus Logic

Design a "Global Focus Style" that ensures keyboard users always know where they
are.

- **Rule:** The focus indicator must have a contrast ratio of at least 3:1
  against the background AND against the non-focused state of the component.

### 4. Optimize for Touch (Mobile)

Since hover states don't exist on touch devices:

- Ensure `active` states provide immediate feedback.
- Verify touch targets are at least 44x44px.
- Remove hover-dependent information (use tooltips on tap or persistent labels).

### 5. Document Transitions

Define how the change happens:

- **Duration:** 150ms to 250ms is standard for state changes.
- **Easing:** `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`.

## Decision Rules

- **State Persistence:** Focus indicators must remain visible as long as the
  element has focus.
- **Affordance First:** Interactive elements must look "clickable" in their
  default state (e.g., buttons should have more visual weight than non-clickable
  tags).
- **No Color-Only States:** Do not rely solely on color to indicate a state
  (e.g., an error state should include an icon or border thickness change).
- **Immediate Feedback:** Interactive responses should feel instantaneous
  (<100ms start time).

## Constraints

- **Accessibility:** Focus indicators cannot be "hidden" via CSS `outline: none`
  without providing a robust alternative.
- **Responsiveness:** States must work on small screens without relying on mouse
  hover.
- **Performance:** Avoid heavy box-shadows or complex filters on states that
  trigger frequently (like hover) to prevent layout thrashing.

## Common Failure Patterns

- **The "Invisible" Focus:** Removing the browser's default focus ring and not
  replacing it, making the site unusable for keyboard users.
- **Hover-Only Logic:** Placing critical information or actions inside a hover
  state, making them inaccessible on mobile.
- **Vague Active States:** Buttons that don't change when clicked, leading users
  to click multiple times.
- **Confusing Disabled States:** Elements that look disabled but are actually
  clickable, or vice versa.

## Validation Criteria

- [ ] Every interactive element has a defined Hover, Focus, and Active state.
- [ ] Focus indicators meet the 3:1 contrast requirement.
- [ ] Touch targets are at least 44x44px for all mobile interactive elements.
- [ ] No critical information is hidden behind a hover-only interaction.
- [ ] Disabled states are visually distinct and have `pointer-events: none` (or
      equivalent logic).
- [ ] The system includes a clear transition/animation guideline for states.
