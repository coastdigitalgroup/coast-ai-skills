---
name: accessible-tabs-implementation
description:
  Implement and debug accessible tabbed interfaces using WAI-ARIA roles, states,
  and keyboard interaction patterns.
---

# Accessible Tabs Implementation

## Purpose

The Accessible Tabs Implementation skill provides a technical protocol for
building tabbed interfaces that are fully accessible to screen reader users and
keyboard-only navigators. It focuses on the correct application of ARIA roles
(`tablist`, `tab`, `tabpanel`) and the implementation of standard keyboard
interaction patterns (arrow key navigation).

## Use Cases

- **Dashboard Layouts:** Organizing user data into logical, switchable sections.
- **Product Information:** Displaying specs, reviews, and descriptions in a
  compact space.
- **Settings Panels:** Grouping configuration options without reloading the
  page.
- **Content Hubs:** Switching between related categories of articles or media.

## When NOT to Use

- **Global Navigation:** Use the `accessible-main-navigation` skill for
  site-wide menus. Tabs are for switching content _within_ a page, not for
  navigating between pages.
- **Accordions:** Use accordions if multiple sections of content need to be
  expanded simultaneously or if the layout is vertically constrained on mobile.
- **Simple Links:** If clicking an item navigates the user to a new URL, use
  standard links, not tabs.

## Inputs

1.  **Content Structure:** A list of labels and their corresponding content
    blocks.
2.  **Activation Strategy:** Decision on whether tabs should activate
    automatically on focus or manually on click/keypress.
3.  **Orientation:** Horizontal (default) or Vertical layout.

## Outputs

1.  **Semantic HTML:** A structure using appropriate ARIA roles and linking
    attributes (`aria-controls`, `aria-labelledby`).
2.  **Keyboard Logic:** JavaScript handlers for `ArrowRight`, `ArrowLeft`,
    `Home`, `End`, and `Enter`/`Space`.
3.  **Visual States:** CSS for `[aria-selected="true"]`, focus indicators, and
    panel visibility.

## Workflow

### 1. Structure the Markup

- **Container:** Apply `role="tablist"` to the wrapper of the tab buttons.
- **Buttons:** Use `<button>` elements with `role="tab"`. Link them to panels
  using `aria-controls`.
- **Panels:** Use elements with `role="tabpanel"`. Link them to tabs using
  `aria-labelledby`.

### 2. Manage State Attributes

- Set `aria-selected="true"` on the active tab and `false` on others.
- Ensure only the active tab is in the natural tab order (`tabindex="0"`). All
  other tabs must have `tabindex="-1"`.
- Use the `hidden` attribute or `display: none` to hide inactive tab panels.

### 3. Implement Keyboard Interaction

- **Arrow Keys:** Listen for `ArrowRight` and `ArrowLeft` (or
  `ArrowUp`/`ArrowDown` for vertical) to move focus between tabs.
- **Looping:** Ensure focus wraps from the last tab back to the first (and vice
  versa).
- **Home/End:** (Optional but recommended) Support jumping to the first and last
  tabs.

### 4. Apply Activation Logic

- **Automatic Activation:** The panel updates immediately as the user arrows
  through the tabs. Recommended for fast-loading, local content.
- **Manual Activation:** The user must press `Enter` or `Space` to switch panels
  after focusing a tab. Recommended if switching content triggers a network
  request or an expensive render.

## Decision Rules

- **Automatic vs. Manual:** Use **Automatic** by default for most UI tabs. Use
  **Manual** ONLY if content loading is slow enough to cause a "stutter" in
  keyboard navigation.
- **Vertical Orientation:** Use `aria-orientation="vertical"` on the `tablist`
  if the tabs are stacked vertically. In this case, use `ArrowUp` and
  `ArrowDown` for navigation.
- **Focusable Panels:** If a `tabpanel` does not contain any focusable elements
  (like links or buttons), add `tabindex="0"` to the panel itself so keyboard
  users can reach the content.

## Constraints

- **Single Active Tab:** Only one tab and one panel can be active at a time.
- **No Hover-to-Switch:** Tabs must never switch content purely on mouse hover;
  this is inaccessible and frustrating for users.
- **Visible Focus:** Never remove the `outline` from a focused tab without
  providing a high-contrast alternative.

## Non-Goals

- Styling the "look and feel" of the tabs (e.g., colors, borders).
- Implementing multi-level nested tabs (avoid these for better UX).
- Handling browser "Back" button integration for tab state (though this is a
  good advanced practice).

## Common Failure Patterns

- **Using Links for Tabs:** Using `<a>` tags with `href="#section"` instead of
  `<button>` with `role="tab"`.
- **Missing Tabindex:** Forgetting to set `tabindex="-1"` on inactive tabs,
  forcing keyboard users to `Tab` through every single tab label before reaching
  the content.
- **Focusing Inactive Panels:** Allowing focus to reach elements inside a hidden
  tab panel.
- **No Arrow Support:** Forcing users to use the `Tab` key to move between tabs
  instead of the standard arrow-key pattern.

## Validation Steps

- [ ] **Keyboard Navigation:** Can you move between tabs using arrow keys? Does
      focus wrap around?
- [ ] **Selection State:** Does `aria-selected` update correctly when a tab is
      activated?
- [ ] **Tab Order:** Does pressing `Tab` from an active tab move focus into the
      panel (or the next page element), skipping the other tabs?
- [ ] **Screen Reader Test:** Does the screen reader announce "Tab, 1 of 3" and
      indicate the selected state?
- [ ] **Manual Activation (if applicable):** If manual activation is used, do
      `Enter` and `Space` trigger the panel switch?
