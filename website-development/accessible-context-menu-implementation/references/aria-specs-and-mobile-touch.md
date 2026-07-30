# Context Menu Accessibility & Mobile Touch Reference

## WAI-ARIA 1.2 Keyboard Specifications for `role="menu"`

Custom context menus must emulate native software menu bars to ensure keyboard-only users can navigate options with standard patterns. When a container carries `role="menu"`, the browser and screen reader expect the following keyboard interaction specs:

### Navigation Keys

| Key | Action |
| :--- | :--- |
| `ArrowDown` | Moves focus to the next item in the menu. Loops to the first item if focus is on the last item. |
| `ArrowUp` | Moves focus to the previous item in the menu. Loops to the last item if focus is on the first item. |
| `Home` | Instantly shifts focus to the first item in the menu. |
| `End` | Instantly shifts focus to the last item in the menu. |
| `Enter` / `Space` | Activates the focused item, triggers its callback action, and closes the menu. Focus is returned to the triggering element. |
| `Escape` | Closes the menu and restores focus back to the target element that initiated the context menu. |
| `Tab` | **Blocked.** Standard `Tab` navigation must be suppressed inside an open context menu to prevent keyboard focus from "leaking" behind the overlay into background elements. Focus can only leave via an explicit select action or dismissal (`Escape`). |

---

## Screen Reader Semantics

### Landmarking and Relationship

1. **Menu Indicator on Target:**
   Any element that hosts a custom context menu can optionally denote this feature to screen readers using `aria-haspopup="menu"`.
   ```html
   <div class="file-card" tabindex="0" aria-haspopup="menu">...</div>
   ```

2. **Landmark Context:**
   The menu overlay itself must carry the `role="menu"` landmark, and each button should carry `role="menuitem"`. It is recommended to use standard buttons inside list items (`<li>` with `role="presentation"` or no role) to prevent screen readers from reading nested list depth, focusing strictly on the menuitem elements.

3. **Status Announcements:**
   When the menu triggers, screen readers expect the first element to receive focus immediately. This ensures that the screen reader reads the option labels and item indices instantly (e.g. *"Open, menuitem, 1 of 5"*). If focus is left on the background or onto the outer container, the user has no confirmation that the menu successfully loaded.

---

## Mobile Touch Long-Press (Hold) Implementation Heuristics

Mobile devices have no right-click mechanism. Implementing custom context menus on mobile requires mapping native touch events to simulate a right-click.

### Touch Event Flow

1. **`touchstart`:**
   - Record the screen coordinates of the finger placement: `e.touches[0].clientX` and `e.touches[0].clientY`.
   - Start a setTimeout timer for `~500ms` - `550ms`.
   - Prevent the default action (using `e.preventDefault()`) on iOS and Android to prevent the browser's native text magnifier, selection overlays, or system copy-paste bubbles from appearing.
   - Note: The `touchstart` event listener must be configured with `{ passive: false }` to allow `e.preventDefault()` to run successfully.

2. **`touchmove`:**
   - On mobile, users scroll pages by dragging their fingers. If a user starts dragging, they are scrolling, not holding.
   - Track finger drift by comparing the active touch coordinates with the original touchstart position.
   - If the finger drifts more than **8px to 10px** along either the X or Y axis, **cancel the setTimeout timer** immediately to let the background page scroll normally.

3. **`touchend` / `touchcancel`:**
   - If the user releases their finger *before* the 500ms timer completes, cancel the timer. This represents a standard tap or click action rather than a long-press.
   - Always call cleanups to release touch coords.

### Avoiding "Double Triggers" on Hybrid Devices
Devices with both touch screens and mouse controls (like touch-enabled laptops or iPads with magic keyboards) can fire both touch and mouse events. Ensuring that your long-press script doesn't trigger *twice* when a tap is fired is crucial.
- Use standard `e.preventDefault()` inside your touchstart timer, which suppresses the subsequent mouse events (like `mousedown`, `click`) for that interaction.

---

## High Contrast / Forced Colors Styling Heuristics

Users with low vision often utilize OS-level Forced Contrast modes (e.g., Windows High Contrast Mode) which strip out custom styling sheets and force elements into system-defined palettes.

1. **Visible Borders:**
   High contrast modes ignore CSS box-shadows. This means an absolutely positioned context menu with no border will blend completely into the background page, making its borders invisible.
   - *Fix:* Always supply a standard border (`1px solid var(--border-color)`) on the menu element, or utilize the `@media (forced-colors: active)` query to explicitly define a high-contrast border:
     ```css
     @media (forced-colors: active) {
       .context-menu {
         border: 2px solid ButtonText;
       }
     }
     ```

2. **Focus Indicators:**
   Avoid utilizing background color *alone* to indicate focus.
   - *Fix:* Ensure the active item has a clear outline or uses system keywords like `SelectedText` as background and `SelectedTextText` as color in forced-colors mode.
