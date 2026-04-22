# Navigation Keyboard Interaction Patterns

Standardized keyboard interactions for website navigation ensure that users who
cannot use a mouse can still find and navigate through your site efficiently.

## Core Interactions

| Key               | Action        | Expected Behavior                                                              |
| :---------------- | :------------ | :----------------------------------------------------------------------------- |
| **Tab**           | Move Forward  | Moves focus to the next interactive element (link, button).                    |
| **Shift + Tab**   | Move Backward | Moves focus to the previous interactive element.                               |
| **Enter / Space** | Activate      | Follows the link or triggers the button (e.g., opens a mobile menu).           |
| **Escape**        | Dismiss       | Closes an open mobile menu or dropdown and returns focus to the toggle button. |

## Mobile Menu (Overlay) Specifics

When a mobile menu is an "overlay" (covering significant page content), the
following behaviors are expected:

1.  **Initial Focus:** When the menu opens, focus should ideally move to the
    first focusable element inside the menu.
2.  **Focus Trapping:** While the menu is open, the `Tab` key should cycle
    _only_ through elements within the menu. It should not "leak" into the
    background page content.
3.  **Scroll Locking:** While the menu is open, the background page (`body`)
    should not be scrollable.
4.  **Escape to Close:** Pressing `Escape` must close the menu immediately.
5.  **Focus Restoration:** Upon closing, focus **must** return to the button
    that opened the menu.

## Dropdown Navigation Specifics

For navigation items that trigger a sub-menu:

1.  **Activation:** The dropdown should be triggered by a `<button>` (either the
    main link itself or a chevron button next to it).
2.  **Disclosure Pattern:** Use `aria-expanded` on the trigger to indicate if
    the sub-menu is visible.
3.  **Tab Order:** Sub-menu links should follow the parent item in the tab
    order.
4.  **Closing:** Sub-menus should close when focus leaves the group or when
    `Escape` is pressed.

## The Skip Link

- **Location:** Must be the first focusable element in the DOM.
- **Visibility:** Can be visually hidden, but must become visible when it
  receives focus via `Tab`.
- **Function:** Must jump the user's focus to the start of the main content area
  (usually `<main id="main-content">`).
