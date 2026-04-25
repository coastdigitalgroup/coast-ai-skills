---
name: accessible-tabs-implementation
description:
  Implement and debug accessible tabbed interfaces using ARIA roles, state
  management, and specific keyboard patterns (Arrows, Home, End).
---

# Accessible Tabs Implementation

## Purpose

The Accessible Tabs Implementation skill provides a technical protocol for
building tabbed interfaces that are fully accessible to screen reader and
keyboard users. It focuses on the correct application of ARIA roles (`tablist`,
`tab`, `tabpanel`), state management (`aria-selected`, `tabindex`), and
implementing standard keyboard interaction patterns.

## Use Cases

- Implementing a multi-pane content area where only one pane is visible at a
  time.
- Organizing related content into logical sections to save vertical space.
- Auditing existing tab components for WCAG 2.1 compliance (e.g., keyboard
  operability, focus management).

## When NOT to Use

- **Navigation Menus:** Use `accessible-main-navigation` or standard links for
  primary site navigation that leads to different URLs. Tabs are for switching
  content within the same page context.
- **Accordions:** Use accordions when multiple sections need to be open
  simultaneously or when the content is strictly linear (stacked).
- **Step-by-Step Wizards:** While visually similar to tabs, wizards often have a
  strict sequence and may require different aria patterns (e.g.,
  `aria-current`).

## Inputs

1. **Content Structure:** A list of tab labels and their corresponding content
   panels.
2. **Behavioral Requirement:** Whether tabs should activate on focus (automatic)
   or on click/Enter/Space (manual).
3. **Visual Design:** Responsive requirements for how tabs should behave on
   smaller screens (e.g., scrolling or wrapping).

## Outputs

1. **Semantic HTML:** Structure using appropriate ARIA roles and attributes.
2. **Interactive Logic:** JavaScript to handle state transitions, attribute
   updates, and keyboard events.
3. **CSS Styles:** Styles for visual states (selected, hover, focus) and
   visibility management for panels.

## Workflow

### 1. Establish the ARIA Structure

- Wrap the tab triggers in a container with `role="tablist"`.
- Assign `role="tab"` to each trigger (usually a `<button>`).
- Wrap each content section in a container with `role="tabpanel"`.
- Use `aria-labelledby` on the panel to point to the tab ID.
- Use `aria-controls` on the tab to point to the panel ID.

### 2. Manage Initial State

- Only the "active" tab should have `aria-selected="true"` and `tabindex="0"`.
- All other tabs should have `aria-selected="false"` and `tabindex="-1"`.
- Only the "active" panel should be visible; other panels should be hidden
  (using `hidden` attribute or `display: none`).

### 3. Implement Selection Logic

- When a tab is selected (via click or keyboard):
  - Update all tabs to `aria-selected="false"` and `tabindex="-1"`.
  - Set the selected tab to `aria-selected="true"` and `tabindex="0"`.
  - Hide all panels and show the panel associated with the selected tab.

### 4. Implement Keyboard Navigation

- **Right Arrow:** Move focus to the next tab.
- **Left Arrow:** Move focus to the previous tab.
- **Home:** Move focus to the first tab.
- **End:** Move focus to the last tab.
- **Automatic vs Manual:** If "automatic", selection occurs immediately on
  focus. If "manual", selection only occurs on `Enter` or `Space`.

### 5. Handle Focus Management

- Ensure the focus indicator is clearly visible on the active tab.
- When focus moves into the tablist via `Tab`, it should land on the currently
  selected tab.

## Decision Rules

- **Automatic Activation:** Use when panels are small and can be rendered
  quickly. This is the most common pattern for simple tabs.
- **Manual Activation:** Use when panel content is large, contains heavy assets,
  or when the user needs to "skip over" tabs without triggering their content
  (e.g., if content loads via AJAX).
- **Horizontal vs Vertical:** Tablists are usually horizontal. If vertical, use
  `aria-orientation="vertical"` on the `tablist` and use Up/Down arrow keys
  instead of Left/Right.

## Constraints

- **One Active Tab:** Only one tab in a tablist should be "selected" at a time.
- **Panel Visibility:** Hidden panels must be hidden from screen readers (e.g.,
  `display: none` or `hidden` attribute).

## Non-Goals

- Designing the visual aesthetic (colors, fonts).
- Implementing "nested" tabs (which should generally be avoided for UX clarity).
- Handling data fetching logic for the panels.

## Common Failure Patterns

- **Missing Roles:** Using `<div>`s for tabs without `role="tab"`, making them
  invisible as "tabs" to screen readers.
- **Focusable Hidden Content:** Forgetting to hide panels with `display: none`,
  allowing keyboard users to tab into links inside hidden panels.
- **Incorrect Tabindex:** Leaving all tabs with `tabindex="0"`, forcing users to
  tab through every tab trigger before reaching the panel.
- **Lack of Keyboard Support:** Only supporting mouse clicks, making the
  component unusable for keyboard-only users.
- **Missing `aria-selected`:** Not updating the selection state, so screen
  reader users don't know which tab is active.

## Validation Steps

- [ ] **Screen Reader Test:** Verify the role "tablist" is announced and the
      number of tabs is identified.
- [ ] **Selection Announcement:** Verify that selecting a tab announces it as
      "selected".
- [ ] **Keyboard Navigation:** Verify that Arrow keys, Home, and End keys move
      focus correctly between tabs.
- [ ] **Tab Order:** Verify that `Tab` moves focus to the selected tab, then
      directly into the active panel's content.
- [ ] **Hidden Content Test:** Ensure that content in inactive panels cannot be
      reached by the `Tab` key.
