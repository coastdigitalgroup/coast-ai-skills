---
name: accessible-accordion-implementation
description:
  Implement and debug accessible, animatable accordion and disclosure components
  using semantic HTML and ARIA.
---

# Accessible Accordion Implementation

## Purpose

The Accessible Accordion Implementation skill provides a technical framework for
building and debugging disclosure widgets (accordions) that are usable by
everyone, including screen reader users and keyboard-only navigators. It covers
semantic structure, focus management, and implementation patterns for smooth
animations without sacrificing accessibility.

## Use Cases

- **FAQ Sections:** Collapsible question and answer pairs.
- **Progressive Disclosure:** Hiding secondary information until requested to
  reduce cognitive load.
- **Mobile Navigation:** Handling nested menu items in a mobile drawer.
- **Vertical Toolbars:** Grouping related controls in a compact space.

## When NOT to Use

- **Tabs:** If the panels are related and users need to switch between them
  quickly while staying in context, a Tab component might be better (see
  `accessible-tabs-implementation`).
- **Main Navigation (Desktop):** Standard horizontal navigation usually
  shouldn't be wrapped in an accordion unless it's a specific "Mega Menu"
  pattern.
- **Filtering:** For simple toggles that don't reveal a large block of content,
  a checkbox or simple toggle button is more appropriate.

## Inputs

1. **Content Structure:** A list of headers (labels) and their corresponding
   content panels.
2. **Expansion Mode:** Exclusive (only one panel open at a time) vs.
   Non-exclusive (multiple panels can be open).
3. **Trigger Type:** Click, Keyboard (Enter/Space), and optionally Arrow keys.

## Outputs

1. **Semantic HTML:** Correct use of `<button>`, `aria-expanded`,
   `aria-controls`, and `role="region"`.
2. **Expansion Logic:** JavaScript to toggle visibility and update ARIA states.
3. **Styling Hooks:** CSS for handling "open/closed" states and smooth
   transitions.

## Workflow

### 1. Define the Semantic Core

- Use a `<button>` for the header/trigger. Never use a `<div>` or `<a>` for a
  toggle action.
- Place the trigger inside a heading tag (`<h2>`-`<h6>`) if the accordion
  sections represent a hierarchy in the document.
- Use a container (e.g., `<div>` or `<section>`) for the panel content.

### 2. Apply ARIA Attributes

- **Trigger:**
  - `aria-expanded="false"` (default) or `"true"`.
  - `aria-controls="panel-id"`: Links the trigger to the content panel it
    controls.
  - `id="button-id"`: For the panel to reference back via `aria-labelledby`.
- **Panel:**
  - `id="panel-id"`: Matches the `aria-controls` on the trigger.
  - `role="region"`: Defines the panel as a landmark region (useful for screen
    readers).
  - `aria-labelledby="button-id"`: Provides a name for the region.

### 3. Implement Toggle Logic

- Listen for `click` events on the trigger button.
- Toggle `aria-expanded` between `true` and `false`.
- For **Exclusive Accordions**: Before opening a new panel, find the currently
  open panel and close it (setting its `aria-expanded="false"`).
- Handle the `hidden` attribute or `display: none` on the panel to ensure its
  contents are removed from the accessibility tree when closed.

### 4. Enable Smooth Transitions

- To animate height from `0` to `auto`, use the CSS Grid trick:
  `grid-template-rows: 0fr;` to `1fr;`.
- Ensure that `visibility: hidden` or `overflow: hidden` is used during the
  transition to prevent content from leaking out.

### 5. Keyboard Interactions

- Standard `<button>` behavior handles `Enter` and `Space` automatically.
- (Optional) Implement arrow key navigation (`Up`/`Down`) to move focus between
  triggers in the accordion group.

## Decision Rules

- **`<details>` and `<summary>` vs. Custom ARIA:**
  - Use `<details>`/`<summary>` for simple disclosures where standard browser
    behavior is sufficient and IE support isn't required.
  - Use Custom ARIA (`button` + `aria-expanded`) when you need:
    - Specific animation control (easier to animate height).
    - Exclusive expansion logic.
    - Integration into a complex design system with specific heading
      requirements.
- **Exclusive vs. Multi-expand:**
  - Use **Exclusive** for FAQs or configurations where focus on a single item is
    preferred.
  - Use **Multi-expand** when users might need to compare information across
    different panels.

## Constraints

- **Focusable Content:** When a panel is closed, its contents must NOT be
  focusable via the keyboard. Use `display: none`, `visibility: hidden`, or the
  `hidden` attribute.
- **Labels:** Every accordion trigger must have a clear, descriptive text label.

## Non-Goals

- Design-specific styling (colors, borders, icons).
- Multi-level nested accordions (though the principles scale, the complexity of
  focus management increases).

## Common Failure Patterns

- **Non-Button Triggers:** Using `div` or `span` as the trigger, making it
  unreachable for keyboard users.
- **Missing `aria-expanded`:** Screen readers won't know if the panel is open or
  closed.
- **Focusable Hidden Content:** Hiding the panel visually but leaving its
  links/buttons in the tab order.
- **Lack of Heading Hierarchy:** Putting the accordion at the top level without
  using proper headings (`h3`, `h4`), breaking the document outline.

## Validation Steps

- [ ] **Keyboard Test:** Can I open and close every panel using only the
      keyboard (`Tab`, `Enter`, `Space`)?
- [ ] **Screen Reader Test:** Does the screen reader announce "Expanded" or
      "Collapsed" when the state changes?
- [ ] **Tab Order Test:** When a panel is closed, are the links inside it
      skipped?
- [ ] **Animation Test:** Does the panel expand smoothly without layout
      thrashing?
- [ ] **Exclusive Logic Test:** (If applicable) Does opening one panel close the
      others?
