# Reference: ARIA & Keyboard Accessibility Guidelines for Notification Centers

This reference documents the technical accessibility guidelines (ARIA specifications and Keyboard interaction design patterns) required to achieve WCAG 2.2 AA compliance for interactive notification centers.

---

## 1. Landmark & ARIA Structural Attributes

To ensure assistive technologies can parse, identify, and navigate the notification trigger and popover, apply the following attributes:

### Header Trigger Button
- **`role="button"`** (implied natively by `<button>`): Do not use a `<div>` or `<a>` as a trigger.
- **`aria-haspopup="true"`** (or `"menu"` / `"dialog"`): Announces to assistive technology that activating this button opens an overlay/dropdown.
- **`aria-expanded="true" | "false"`**: Dynamically toggled via JavaScript. When the panel is visible, set to `true`. When hidden, set to `false`.
- **`aria-controls="panel-container-id"`**: Explicitly links the trigger button to the panel container element.
- **`aria-label="Notifications, 4 unread items"`**: Explains the button's purpose and dynamically updates when the unread count changes.

### Panel Container
- **`id="panel-container-id"`**: Must match the `aria-controls` attribute on the trigger.
- **`role="region"`** or **`role="dialog"`**: Defines the container's structural role. If keyboard focus is trapped (as in a Side Drawer modal), use `role="dialog"`. If background interaction is permitted while open (as in a search toolbar), use `role="region"`.
- **`aria-labelledby="heading-id"`**: Points to the main `<h2>` title inside the panel header (e.g., "Notifications") to provide an accessible name for the panel.
- **`hidden` attribute / `display: none`**: Ensure the panel is completely removed from the accessibility tree when closed. Do not simply hide it visually using `opacity: 0` or `z-index: -1`.

### Notification Feed List
- Use a semantic list container (`<ol>` or `<ul>`) with **`role="list"`** to announce item groups and total item counts to screen readers (e.g., "List, 1 of 12 items").

### Unread Indicators & Icons
- **`aria-hidden="true"`**: Place this on decorative elements like status icons, user avatars, unread indicator dots, and decorative divider bars to prevent screen reader noise.
- **Text Alternatives**: Avoid relying on icons to convey states. Ensure that screen readers read status text, such as:
  - Red warning triangle -> `<span class="sr-only">Warning:</span>`
  - Green check circle -> `<span class="sr-only">Success:</span>`

---

## 2. Keyboard Interaction Patterns

A compliant notification center must be fully operable without a mouse. Implement one of the two standard keyboard navigation styles:

### Pattern A: Standard Tab Sequence (For Short Lists / Simple Panels)
Users navigate through the trigger and all actionable card links sequentially.

| Key | Target Element | Action |
| :--- | :--- | :--- |
| **`Tab`** | Page | Moves focus to the Header Bell Trigger button. |
| **`Enter` / `Space`** | Bell Trigger | Toggles panel visibility. On open, focus is shifted immediately to the first actionable element in the panel (e.g., "Mark all read"). |
| **`Tab`** | Panel Items | Focuses each actionable item sequentially: Card 1 CTA -> Card 1 "Mark as read" button -> Card 2 CTA -> Panel Footer. |
| **`Shift + Tab`** | Panel Items | Moves focus backward through the elements in reverse order. |
| **`Escape`** | Any element in Panel | Closes the notification panel immediately and **returns keyboard focus directly to the Bell Trigger**. |

### Pattern B: Roving Tabindex Sequence (Recommended for High Density / Long Feeds)
Focus is managed so that the entire notification feed behaves as a single tab stop, reducing tab fatigue.

- Only the **active** notification card has `tabindex="0"`. All other cards have `tabindex="-1"`.
- Clicking the `Tab` key skips past individual cards and jumps straight to the footer or out of the panel.
- Users navigate between individual cards using arrow keys.

| Key | Target Element | Action |
| :--- | :--- | :--- |
| **`ArrowDown`** | Active Notification Card | Moves focus to the next card in the list, updating the active card's `tabindex` to `0` and setting the previous card's `tabindex` to `-1`. |
| **`ArrowUp`** | Active Notification Card | Moves focus to the previous card in the list. |
| **`Home`** | Active Notification Card | Instantly jumps focus to the first card in the list. |
| **`End`** | Active Notification Card | Instantly jumps focus to the last card in the list. |
| **`Tab`** | Active Notification Card | Jumps focus out of the list container to the footer or next global control. |

---

## 3. Dynamic Live Announcements

When notifications arrive asynchronously while the user is active on the page, the user must be informed without disrupting their current focus.

- Create a persistent, visually-hidden live-region element in your layout:
  ```html
  <div class="sr-only" aria-live="polite" aria-atomic="true" id="live-notification-announcer"></div>
  ```
- When a new background notification is received:
  1. Update the DOM elements in the notification panel list.
  2. Inject text into the `#live-notification-announcer` element (e.g., `"New notification: Jane Cooper replied to your comment."`).
  3. Assistive screen readers will announce this text politely when the user reaches a natural pause.

---

## 4. Focus Management & Inert State (Side Drawer)

If you implement the notification center as a **Side Drawer** overlay (Pattern B in SKILL.md):
- When the drawer opens, you must add `inert` to the main container elements of your application layout (e.g., `<main>`, `<nav>`) so that keyboard tab focus and screen reader cursors cannot escape the drawer into the background page content.
- Example structure:
  ```html
  <body>
    <!-- App layout gets 'inert' when notification drawer is active -->
    <div id="app-root" inert>
      <!-- Page content... -->
    </div>

    <!-- Active notification drawer remains interactive -->
    <section id="notification-drawer" class="drawer-active" role="dialog" aria-modal="true">
      <!-- Drawer contents... -->
    </section>
  </body>
  ```
- This completely prevents scroll leaks, background keyboard navigation, and structural disorientation for keyboard and screen reader users.
