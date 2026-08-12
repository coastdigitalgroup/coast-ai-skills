---
name: conversational-chat-ui-system
description:
  Design and implement a systematic, highly accessible, and responsive visual layout framework
  for conversational chat widgets, live chat boxes, and chatbot panels that ensures clear message
  scannability, native focus flow, and seamless mobile keyboard adaptation.
---

# Conversational Chat UI System

## Purpose

The Conversational Chat UI System provides a systematic methodology for designing and structuring persistent on-page chat widgets, live support dialogs, and automated chatbot interfaces. Chat windows are highly interactive, content-dense, and spatially constrained, making them prone to severe accessibility and usability failures.

This system solves the visual and structural design challenges of asynchronous messaging overlays. It guarantees that message streams are highly readable, that interactive triggers (quick-replies, action cards) are accessible, that assistivetech users are notified of new messages without focus disruption, and that mobile overlays adapt perfectly to system virtual keyboards and safe areas.

## Use Cases

- **Live Chat Support Panels:** Persistent widgets allowing direct communication with human customer support representatives.
- **Automated AI Chatbots:** In-app or on-site automated assistants guiding users through onboarding, troubleshooting, or product discovery.
- **Transactional Conversational Forms:** Step-by-step form completion designed as an interactive conversation.
- **Floating Help Center Widgets:** Viewport-docked overlays that search support articles and fallback to live chat threads.

## When NOT to Use

- **Dedicated Email/Inbox Applications:** Large-scale, full-screen communication dashboards (e.g., Gmail, Slack, Zendesk Agent Workspace) that demand high-density multi-pane layouts; use `dashboard-layout-system`.
- **Global Page Navigation:** Do not replace persistent site directories with chat-based sitemaps unless as a secondary assistive option; use `site-navigation-system`.
- **Complex Hierarchical Commenting:** Blog or article comments with nested thread responses; use `comment-and-discussion-system`.

## Inputs

1. **Conversational Scenarios:** Mapping the primary flows (user-initiated vs. system-triggered, bot vs. agent handoff).
2. **Visual Style and Palette:** Design tokens for background surfaces, incoming vs. outgoing bubbles, status dots, and focus indicators (from `accessible-color-system` and `focus-indicator-design-system`).
3. **Typography Scale:** Fluid, highly legible typography rules for compact layouts (from `fluid-typography-system`).
4. **Trigger Metrics:** Scrolling and event thresholds that determine when the chat launcher button or auto-welcome message activates.
5. **Interactive Media Assets:** File attachment options, image preview templates, and custom quick-reply formats.

## Outputs

1. **Chat Widget Layout Spec:** Precise pixel/rem boundaries for floating launchers and docked panels.
2. **Message Thread Anatomy:** Component spacing, typography weights, and color mappings distinguishing sender types.
3. **Responsive Mobile Blueprint:** Transition rules transforming desktop floating panels into mobile full-height drawers.
4. **Interactive States Matrix:** Visual feedback maps for message bubbles, text areas, action chips, and loading states.
5. **Accessibility Landmarks Blueprint:** A map of ARIA roles (`role="log"`, `aria-live="polite"`, `aria-busy`) and keyboard tab paths.

---

## Workflow

### 1. Position the Floating Launcher (FAB)
The floating chat trigger button is the primary entry point and must remain persistent without blocking key page body items.
- **Standard Positioning:** Dock the launcher in the bottom-right corner of the viewport (bottom-left for RTL layouts).
- **Desktop Grid Offsets:** Offset the launcher by `24px` from both the bottom and side viewport boundaries.
- **Mobile Grid Offsets:** Offset by `16px` from boundaries to preserve content area.
- **Collision Mitigation:** If a "Back to Top" button or persistent cookie banner is present, position them vertically opposite or stack them with a minimum of `16px` separation to prevent visual overlapping.

### 2. Structure the Chat Window Container
The chat window container houses the entire interaction frame. It sits above the base page and must follow a standard structural hierarchy:
- **Header (The Frame Anchor):** Persistent banner containing the avatar/identity of the chat partner (agent/bot), operational status (online indicator, active hours), and quick controls (Minimize `_`, Full-screen/Expand, and Close `X`).
- **Message Log Area (The Thread viewport):** The scrollable body displaying the conversation. Must handle infinite vertical scrolling with a scrollbar that is always visible during scroll actions.
- **Quick-Reply Deck (The Bridge):** A horizontal/wrapping block of interactive chips that sit directly above the input bar to offer single-tap prompt responses.
- **Input Bar (The Utility Pinned Bottom):** A persistent form container comprising the text input area, secondary utility triggers (emojis, paperclip file attachments), and the primary "Send" button.

### 3. Design Message Bubble Anatomy and Rhythm
To ensure rapid scannability, distinguish between messages using visual and physical direction:
- **Outgoing (User) Messages:**
  - **Alignment:** Right-aligned (left-aligned in RTL).
  - **Color:** Brand primary or high-contrast dark background with white/light text.
  - **Border-Radii:** Rounded on all corners except the bottom-right (bottom-left for RTL) to create a visual "speech bubble" anchor.
- **Incoming (Agent/Bot) Messages:**
  - **Alignment:** Left-aligned (right-aligned in RTL).
  - **Color:** Neutral light-gray or secondary brand tint with high-contrast text.
  - **Border-Radii:** Rounded on all corners except the bottom-left (bottom-right for RTL).
- **Grouped Messages:** If the same sender triggers multiple messages sequentially, stack them closely (`4px` gap) and only show the sender name, avatar, and timestamp on the final bubble or group header. Use `16px` spacing between different senders.
- **System/Action Messages:** Centered within the thread, small, muted, and styled as flat, borderless text to indicate meta-events (e.g., "Agent entered the chat", "Chat transcript emailed").

### 4. Create the Interactive Input Area
The text entry area is where the highest friction occurs. Design to maximize usability:
- **Auto-Expanding Input:** Use a `<textarea>` that starts at a single line (minimum `44px` height) and expands vertically as the user types (maxing out at 4–5 lines with vertical scrolling enabled inside) so long messages remain completely visible.
- **Input Border & Hover States:** Give the textarea a distinct border (minimum `1px`, high contrast `3:1` against the white chat box). Hovering must increase the border contrast, and active focus must trigger a high-contrast focus ring (minimum `2px`).
- **Send Button Affordance:** The send button should remain visually inactive (disabled and muted opacity) when the textarea is empty. Once characters are typed, transition the button to its primary active color state to signal input readiness.

### 5. Establish Mobile Viewport Adaptation (The Drawer Shift)
Desktop chat boxes are small overlays (usually `360px` to `400px` wide, `500px` to `650px` tall). On mobile, these proportions are unusable and clash with virtual keyboards.
- **Full Viewport Takeover:** Below the `576px` breakpoint, transition the chat container from a floating panel to a full-screen drawer (`width: 100%; height: 100%; top: 0; left: 0; border-radius: 0;`).
- **Virtual Keyboard Safe Area:** Ensure the Input Bar uses `position: sticky; bottom: 0;` and anchors to the bottom of the visible viewport, accounting for the mobile browser's bottom address bar and the virtual keyboard.
- **Prevent Scroll Leaks:** Lock the background body scroll using `body { overflow: hidden; }` or standard touch-interception classes whenever the full-screen mobile chat drawer is active.

---

## Decision Rules

- **Trigger Button Sizing:** The floating launcher button must have a visual diameter of at least `56px` on desktop and mobile, with an interactive touch footprint of `64x64px` to ensure effortless thumb activation.
- **The "Unread Badge" Priority:** When an unread message arrives while the panel is minimized, show a red/brand-colored numerical badge over the launcher. If a message is highly critical, show a temporary, self-dismissing text preview bubble adjacent to the launcher for `5 seconds` before collapsing to the badge.
- **Typing Indicator Display:** When the agent/bot is typing, display a persistent bubble containing a triple-dot bouncing animation. Position this indicator as the bottom-most incoming message, but remove it instantly when the actual message block arrives.
- **Notification Timing & Audio Cues:** Enable subtle, high-pitch audio alerts for incoming messages only if the tab is backgrounded. Provide a clear, persistent toggle in the chat header to mute sound notifications entirely.
- **Dynamic Scroll Anchoring:** When the user is at the bottom of the chat log, automatically scroll the thread container down to reveal new messages as they arrive. However, if the user has scrolled *up* to read past history, lock the scroll position to prevent jarring jumps, and display a floating "New Messages ↓" pill button at the bottom of the viewport.

---

## Constraints

### 1. Accessibility (WCAG AA Compliance)
- **Landmark & ARIA Roles:**
  - Wrap the main chat widget in a landmark container: `<section aria-label="Customer Chat">` or `<div role="region" aria-label="Support Chat">`.
  - The scrollable message log area must use `role="log"` and `aria-live="polite"`. This tells screen readers to announce new messages as they are appended, without interrupting the user's active keyboard navigation or text input.
  - The typing indicator bubble must set `aria-busy="true"` and include a hidden text alternative (e.g., `<span class="sr-only">Support agent is typing...</span>`).
- **Keyboard Access & Focus Trap:**
  - Standard `Tab` navigation must move through header controls, the scrollable message stream, quick-reply chips, and the input fields in logical sequence.
  - When the mobile full-screen chat drawer is open, trap keyboard focus within the drawer. Pressing `Escape` must instantly minimize or close the chat panel and return focus back to the floating launcher button.
- **Text & Component Contrast:**
  - All text within message bubbles (both incoming and outgoing) must meet a minimum contrast ratio of `4.5:1` against their respective bubble backgrounds.
  - Interactive icons (attachment clip, send arrow, close X) and form boundaries must meet a minimum contrast ratio of `3:1` against the adjacent background surfaces.

### 2. Responsiveness & Layout Preservation
- **Aspect-Ratio Stability:**
  - Message threads must use flexible percentages or flex-grow models to fill the container height, preventing text overflow or container collapse.
  - Images or cards sent within chat bubbles must have fixed aspect ratios or Max-Width boundaries (`max-width: 80%` of the bubble's width) to prevent visual blowing of the chat layout.
- **Layout Shift Prevention:**
  - When loading historical messages (e.g., infinite scroll up), use scroll anchoring techniques to prevent the active scroll position from snapping downwards, keeping the user's viewport perfectly locked on the message they were reading.

---

## Common Failure Patterns

- **The "Focus Hijack" Trap:** Automatically opening the chat widget on page load and instantly trapping keyboard focus inside the chat textarea. This completely blocks keyboard and screen-reader users from reading the main page content.
- **The "Keyboard Cover-Up":** On mobile, positioning the input bar with `absolute` coordinates, causing the device virtual keyboard to overlay and hide the textarea and send button during active typing.
- **The "Unannounced Stream":** Appending new messages into the thread purely visually without `role="log"` or `aria-live`, leaving blind and low-vision users completely unaware that the agent has responded.
- **The "Jumping Scroll" Bug:** Forcing the scroll viewport to jump down to the absolute bottom on every incoming message, interrupting a user who is trying to read historical instructions higher in the thread.
- **The "Contrast Fadeout" Trend:** Styling incoming bubbles with a ultra-light gray background and thin white text, violating contrast ratios and rendering the text unreadable under normal ambient lighting.

---

## Validation Criteria

- [ ] **Accessibility Landmark Check:** The chat widget is wrapped in a `<section>` or `role="region"` with a descriptive `aria-label`.
- [ ] **Screen Reader Announcement Check:** The message thread uses `role="log"` with `aria-live="polite"` and has been verified to announce incoming text dynamically.
- [ ] **Contrast Verification:** Outgoing and incoming bubbles meet the `4.5:1` text-to-background contrast standard, and form borders meet the `3:1` standard.
- [ ] **Keyboard Path Verification:** Focus traps operate correctly on mobile viewports, and pressing the `Escape` key closes the widget and returns focus to the launcher.
- [ ] **Mobile Drawer Adaptation:** The panel occupies 100% viewport height and width below `576px` with no scroll leak on the background page body.
- [ ] **Minimum Touch Targets:** Launcher trigger, close buttons, send controls, and quick-reply chips have interactive footprints of at least `44x44px`.
- [ ] **Message Bubble Rhythm:** Consecutive messages from the same sender are clustered with tight `4px` padding, while sender shifts use generous `16px` gaps.
- [ ] **Empty State Guard:** The send button is disabled and visually muted when the input textarea contains only whitespace.
