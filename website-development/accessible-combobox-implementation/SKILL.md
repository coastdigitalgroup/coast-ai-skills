---
name: accessible-combobox-implementation
description:
  Implement and debug accessible comboboxes (custom select menus and
  autocompletes) that manage focus, handle complex keyboard interactions, and
  synchronize state with assistive technologies.
---

# Accessible Combobox Implementation

## Purpose

The Accessible Combobox Implementation skill provides a technical framework for
building custom select menus, typeaheads, and autocomplete inputs. Because
native `<select>` elements are difficult to style, developers often build custom
alternatives that are frequently inaccessible. This skill ensures these widgets
follow the ARIA 1.2 Combobox pattern, making them usable for everyone.

## Use Cases

- Implementing an autocomplete search input with a dropdown of suggestions.
- Creating a stylized dropdown menu that cannot be achieved with native
  `<select>`.
- Building a "tagging" or "multi-select" input where users pick from a filtered
  list.
- Auditing existing custom select implementations for accessibility gaps.

## When NOT to Use

- **Simple Selection:** If the default browser styling for `<select>` is
  acceptable, always use the native element. It is more robust and requires zero
  JavaScript for accessibility.
- **Navigation Menus:** If the dropdown is for site navigation (links), use a
  navigation menu pattern (e.g., `responsive-navigation-implementation`) instead of a
  combobox.
- **Large Data Sets without Search:** A combobox with hundreds of items but no
  filtering is a poor user experience.

## Inputs

1. **Data Source:** The list of options to be displayed.
2. **Input Context:** Is it an autocomplete (text entry allowed) or a custom
   select (selection only)?
3. **Visual Design:** Requirements for the toggle, listbox, and highlighted
   states.
4. **Selection Logic:** Does it support single or multiple selections?

## Outputs

1. **Semantic HTML Structure:** A combination of an `<input>` (or toggle), a
   `role="listbox"`, and `role="option"` elements.
2. **ARIA State Management:** Logic to synchronize `aria-expanded`,
   `aria-activedescendant`, and `aria-controls`.
3. **Keyboard Handlers:** Logic for `ArrowUp`, `ArrowDown`, `Enter`, `Escape`,
   `Home`, and `End`.
4. **Focus Management:** Ensuring the input maintains focus while the listbox is
   navigated.

## Workflow

### 1. Establish the ARIA 1.2 Structure

- The wrapper or the input itself should have `role="combobox"`.
- The input must have `aria-autocomplete="list"` (if it filters) or
  `aria-autocomplete="none"`.
- The input must have `aria-expanded="false"` initially.
- The listbox container must have `role="listbox"` and a unique `id`.
- The input must link to the listbox via `aria-controls="listbox-id"`.

### 2. Implement Item Rendering

- Each selectable item must have `role="option"`.
- Use `aria-selected="true"` for the currently selected item(s).
- Each option must have a unique `id` for `aria-activedescendant` targeting.

### 3. Manage Visual vs. Programmatic Focus

- **Important:** The focus usually stays on the `<input>`.
- As the user uses arrow keys, update `aria-activedescendant` on the input to
  point to the `id` of the "visually focused" option.
- Ensure the visually focused option is scrolled into view within the listbox.

### 4. Handle Keyboard Interactions

- `ArrowDown`: Open the listbox (if closed) and move visual focus to the next
  option.
- `ArrowUp`: Move visual focus to the previous option.
- `Enter`: Select the visually focused option and close the listbox.
- `Escape`: Close the listbox and clear the input (if appropriate).
- `Tab`: Close the listbox and move focus to the next element.

### 5. Synchronize State

- Update `aria-expanded` when the listbox opens/closes.
- Ensure the `aria-live` region (if used for status updates like "3 results
  found") is updated appropriately for screen readers.

## Decision Rules

- **Focus Trap?** Unlike modals, comboboxes should **not** trap focus. Tabbing
  should move the user out of the widget.
- **Click vs. Hover:** Options should be selectable by click. Hovering should
  update visual styling but **not** necessarily update `aria-activedescendant`
  unless it also moves programmatic selection.
- **Mobile UX:** On small screens, consider transforming the combobox listbox
  into a bottom-aligned drawer (see `overlay-and-dialog-system`).

## Constraints

- **No "Lost" Focus:** Closing the listbox must never cause the focus to jump to
  the top of the page.
- **Visibility:** Options that are not visible should be hidden from the DOM or
  marked with `display: none` so they aren't read by screen readers prematurely.
- **Labeling:** The combobox must have a visible `<label>` or an `aria-label`.

## Non-Goals

- Implementing the backend search API or data fetching logic.
- Complex multi-column listbox layouts.
- Styling the specific look and feel (beyond basic accessibility indicators).

## Common Failure Patterns

- **Focus Disconnection:** Moving physical focus into the listbox items. In a
  standard combobox, focus stays on the input.
- **Missing `aria-activedescendant`:** Screen reader users don't know which item
  is currently highlighted as they arrow through the list.
- **Invalid ARIA Parents:** Putting `role="option"` elements directly inside a
  `div` that doesn't have `role="listbox"`.
- **Stale `aria-expanded`:** Leaving the state as `true` after the listbox has
  been hidden.
- **No "No Results" Feedback:** Failing to inform screen reader users when a
  search returns zero items.

## Validation Criteria

- [ ] **Keyboard Test:** Can you open, navigate, select, and close the widget
      using only the keyboard?
- [ ] **Screen Reader Test:** Does the screen reader announce "Expanded" when
      opened? Does it read the content of each option as you arrow through?
- [ ] **ARIA Sync Test:** Inspect the DOM while interacting. Does
      `aria-activedescendant` update to match the highlighted item's ID?
- [ ] **Touch Test:** Are the options large enough (44x44px) for mobile users to
      tap reliably?
- [ ] **Labeling Check:** Does the input have a correctly associated `<label>`?
