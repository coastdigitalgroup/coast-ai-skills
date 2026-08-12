# Accessibility and Viewport Reference Guide

Conversational chat interfaces are highly dynamic, overlay-dependent, and input-heavy, making them a common source of critical accessibility and mobile usability failures. This reference guide outlines the technical requirements and standards to ensure full compliance with **WCAG 2.1 AA** and a resilient mobile viewport experience.

---

## 1. WAI-ARIA Semantics and Assistive Technology

To ensure users of screen readers and other assistive technologies can navigate and understand the conversation flow, you must apply the correct semantic landmarks and ARIA states.

### Landmark Roles
- **The Wrapper:** The parent chat widget container must use either `<section aria-label="Support Chat">` or `<div role="region" aria-label="Support Chat">`. This exposes the chat widget as an accessible landmark, enabling screen-reader users to jump directly to it using landmark navigation keys.
- **The Chat Log:** The scrollable message stream area must use `role="log"`. This role is semantically designed for sequential, time-based updates. It has an implicit `aria-live="polite"` behavior, meaning new items appended to the container are announced immediately, but without interrupting active reading or typing.
  - *Code Spec:* `<div role="log" aria-live="polite" aria-relevant="additions" aria-atomic="false">`

### Interactive State Mappings
- **The Launcher Toggle Button:**
  - Must have a clear, persistent accessible name (e.g., `aria-label="Open Apex Athletics Support Chat"`).
  - Must declare its open/close status using `aria-expanded="true|false"`.
  - Must programmatically target the panel container using `aria-controls="panel-id"`.
- **System Typing Indicators:**
  - When the bot or agent is typing, the indicator element must have `aria-busy="true"` and a hidden text helper for screen readers:
    - *Code Spec:* `<div aria-busy="true"><span class="sr-only">Agent is typing...</span></div>`
- **Dynamic Content Updates:**
  - Do not use `aria-live="assertive"` for incoming messages, as this will immediately interrupt the user, potentially wiping out what they are currently typing in the input area. Keep it `aria-live="polite"`.

---

## 2. Keyboard Access and Focus Routing

A keyboard-only user must be able to open, navigate, use, and close the chat widget without encountering focus traps or losing orientation.

### Focus Management Cycle
1. **Triggering Open:**
   - When the user activates the launcher button, move focus to either the chat panel's header close button or directly into the message text area. Do not let focus remain on the launcher behind the panel.
2. **Keyboard Tab Order:**
   - Standard navigation must follow a linear, logical sequence:
     - Header Actions (Minimize/Close) -> Scrollable Message Thread -> Quick-Reply Chips -> Attachment Button -> Input Textarea -> Send Button.
3. **Escaping/Closing:**
   - The user must be able to close or minimize the panel at any time by pressing the `Escape` key.
   - Upon closing, focus must instantly return to the original launcher button. This prevents focus loss (which resets focus to the top of the `<body>`).
4. **Mobile Focus Trap:**
   - On viewports `< 576px` where the chat is full-screen, implement a complete **focus trap**. Focus must cycle strictly within the chat widget and must not escape to links on the background page.

---

## 3. Mobile Viewport Height and Soft Keyboard Management

Mobile browsers present unique layout bugs due to the dynamic height of browser toolbars (address bars) and the unpredictable intrusion of device virtual (soft) keyboards.

### Dynamic Viewport Height (dvh)
Traditional `height: 100vh` on mobile often causes the bottom of the layout (including the crucial input bar) to be pushed below the visible viewport edge, hidden by browser chrome.
- **The Solution:** Use CSS logical properties and dynamic viewport height units:
  - *CSS Spec:* `height: 100dvh;` or `height: -webkit-fill-available;`
  - This ensures the chat drawer scales dynamically as address bars collapse or expand.

```css
.chat-panel-mobile {
  height: 100vh; /* Fallback for older browsers */
  height: 100dvh; /* Dynamic Viewport Height */
  display: flex;
  flex-direction: column;
}
```

### Soft Keyboard Overlay Prevention
When a user taps the input area, the mobile soft keyboard slides up. If the input area is positioned using absolute coordinates (`position: absolute; bottom: 0;`), it is frequently covered up by the keyboard.
- **The Solution:** Use a flexbox or grid layout wrapper with `overflow: hidden` on the container, and make the input bar `position: sticky; bottom: 0;`. This forces the browser to resize the active viewport window, automatically shrinking the scrollable message thread area while keeping the input bar pinned right above the keyboard.

### Preventing Page Scroll Leak
When a user scrolls to the top or bottom of the chat message thread on mobile, further scrolling can "leak" to the background page, causing the underlying website to scroll and disorienting the user.
- **The Solution:** Apply `overscroll-behavior: contain;` on the scrollable message thread container:
  - *CSS Spec:* `.chat-thread { overscroll-behavior: contain; }`
  - Additionally, apply a helper class to the `<body>` on open that sets `overflow: hidden`.

---

## 4. Hardware Safe Areas and Touch Targets

Mobile device designs have physical notches, rounded corners, and system navigation indicators (e.g., Apple's Home Indicator) that can overlap interactive UI elements if not budgeted.

### CSS Environment Variables (Safe Areas)
Always apply safe area inset padding-bottom to the bottom-most input bar or launcher when on mobile screens.
- **Implementation:**
  ```css
  .chat-input-bar {
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
  ```

### Touch Targets (WCAG 2.2 SC 2.5.8)
Accidental taps are highly frustrating in compact mobile panels.
- **The Rule:** Every clickable or tappable element must meet a minimum interactive footprint of **24x24px** (with **44x44px** highly preferred for primary touch inputs like the launcher, quick-replies, and send button).
- **Spaced Targets:** If two small buttons (like Minimize and Close in the header) are adjacent, separate their clickable areas by at least `8px` of margin.
- **Quick-Reply Deck Scrolling:** Quick-reply chips must be arranged in a single horizontal row with horizontal scrolling enabled (`overflow-x: auto;`). Each chip must have `white-space: nowrap;` and a minimum height of `44px` to allow fast thumb-swiping and tapping.
