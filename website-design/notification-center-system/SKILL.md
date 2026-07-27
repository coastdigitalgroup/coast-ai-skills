---
name: notification-center-system
description:
  Design and implement a centralized, highly accessible, and state-aware in-app
  notification center to aggregate system updates, user alerts, and actionable
  notifications without disrupting primary user workspaces.
---

# Notification Center System

## Purpose

The Notification Center System provides a structured, reusable design framework for in-app notification centers, feeds, or inboxes. In modern web applications, particularly SaaS workspaces, community portals, collaborative editors, and e-commerce accounts, notifications keep users updated on asynchronous events (e.g., mentions, comments, system alerts, workflow status updates, task completions).

Without a dedicated notification center, applications are forced to rely on intrusive overlays (Modals) or transient, easily-missed notifications (Toasts/Banners). This system centralizes those updates, managing their visual hierarchy, interactive states (read vs. unread), contextual groupings, and responsive adaptations, while ensuring full keyboard and screen-reader accessibility (WCAG AA).

## Use Cases

- **Collaborative Workspaces:** Aggregating document comments, shared folders, task assignments, and mentions (e.g., Slack, Notion, Figma).
- **Asynchronous Workflows:** Tracking long-running operations like data exports, background reports, build deployments, or batch processing.
- **Transactional Updates:** Tracking e-commerce delivery updates, subscription renewal reminders, or payment confirmations.
- **Social & Community Feeds:** Managing likes, replies, follows, group invitations, and activity updates.
- **Account Security & Health:** Informing users of new login locations, password changes, or storage quota warnings.

## When NOT to Use

- **Critical Blocks:** If an event must prevent the user from completing their current task (e.g., payment failed, session expired, invalid data submission), use an `overlay-and-dialog-system` (Modal/Alertdialog).
- **Transient, Single-task Feedback:** For immediate confirmation of a direct action (e.g., "Link copied," "Settings saved"), use a Toast (see `toast-and-snackbar-system`).
- **Global Downtime Announcements:** For site-wide, high-priority system alerts (e.g., "Scheduled maintenance in 30 minutes"), use global banners (see `banner-and-alert-system`).
- **Standalone Conversion Landing Pages:** Standalone landing pages should minimize external links and distractions. Global notification icons are counterproductive.

## Inputs

1. **Information Architecture (Notification Schema):**
   - *Metadata:* Author avatar/initials, event source, action type.
   - *Content:* Title (what happened), body text (additional details/context), timestamp.
   - *State:* Read vs. unread, high/medium/low priority, archived.
   - *Actions:* Primary target link, inline quick actions (e.g., "Approve", "Mark as read", "Mute thread").
2. **Display Context & Density:** Is the interface a highly dense SaaS dashboard (needs space-efficient popover list items) or a spacious platform (can utilize a slide-out drawer or page)?
3. **Trigger Iconography:** The visual anchor (usually a bell icon) and notification badge design (numerical counts vs. a simple dot indicator).
4. **Interactive Action Layout:** Available bulk actions (e.g., "Mark all as read," "Clear all," "Notification settings").

## Outputs

1. **Trigger Badge Anatomy:** Specific design criteria for the header icon, numeric badge count, and silent indicator dot.
2. **Container Layout Specification:** Sizing, boundaries, positioning, and container behavior (Dropdown, Side Drawer, or Dedicated Page).
3. **Notification Card Anatomy:** Explicit internal layout (avatar, body, timestamp, unread indicator dot, quick action triggers).
4. **State Transition Matrix:** Distinct styling for unread vs. read states, hover states, active states, focus rings, and loading skeletons.
5. **Keyboard & Screen-Reader Spec:** Focus-trap parameters, roving tabindex structure, live-region announcement definitions, and custom aria descriptions.

---

## Workflow

### 1. Design the Header Trigger & Badge Indicator
The entry point for the notification center is almost universally located in the global utility header (right-hand side).
- **The Bell Icon:** Choose a clean bell icon.
- **The Unread Count Badge:**
  - Place a circular badge in the top-right quadrant of the bell icon.
  - Limit the badge count to `99+` (or `9+` on extremely tight layouts) to avoid container overflow.
  - If the count is 0, the badge must be removed from the DOM or hidden using `display: none` (never show `0` inside a red bubble).
  - Include an `aria-label` or hidden screen-reader text that explicitly states the number of unread notifications (e.g., `<span class="sr-only">, 4 unread notifications</span>`).

### 2. Choose the Container Layout Pattern
Select the layout based on the density, target device, and amount of interaction required:
- **Pattern A: Dropdown Popover (Desktop default for medium content density)**
  - Positioned relative to the trigger.
  - Recommended dimensions: Min width `320px`, Max width `420px`. Height restricted to `500px` with a scrollable container (`overflow-y: auto`).
  - Anchor the popup using standard popover mechanics (or native Popover API) to ensure it appears in the top stacking context.
- **Pattern B: Side Drawer (Best for high content density or complex action flows)**
  - Slides in from the right edge of the screen, occupying the full viewport height.
  - Recommended width: `360px` to `480px`.
  - Dim the page background with a subtle backdrop overlay (scrim).
- **Pattern C: Dedicated Notification Page (Fallback for mobile viewports, or complex inbox management)**
  - A full-screen view suitable for sorting, searching, filtering, and bulk managing deep notification archives.

### 3. Establish internal Card Hierarchy & Anatomy
Each individual notification is a card (a list item `<li>` inside an `<ol>` or `<ul>`). It must follow a strict vertical and horizontal grid hierarchy:
```text
+-------------------------------------------------------------+
| (•) [Avatar]  **Jane Doe** mentioned you in _Project X_  (x) |
|               "Please review the revised UI sketches."      |
|               [ 3 hours ago ]  [ Approve ] [ Decline ]      |
+-------------------------------------------------------------+
```
- **Unread Indicator Dot (Horizontal Anchor):** Place a small, high-contrast, primary-colored dot (e.g., blue or purple) on the extreme left. This is the fastest scanning anchor for unread items.
- **The Avatar/Icon Area:** Place a circular avatar (for user-generated events) or a categorized utility icon inside a colored background (for system events) next to the indicator.
- **Text Block (Vertical Flow):**
  - *Title/Header:* Bold text highlighting the actor and action.
  - *Excerpt:* Smaller, muted text showing secondary content (e.g., comment text, error description). Limit to 2 lines of text max with CSS line-clamp.
  - *Timestamp:* Muted, small text (e.g., `12px`) showing relative time (e.g., "5m ago", "Yesterday").
- **Quick Actions (Contextual Triggers):**
  - Place quick-action buttons aligned beneath the text excerpt (e.g., "Accept Invite", "View Comment").
  - Provide a subtle secondary trigger (e.g., an overflow menu button, or a direct "Mark as read" checkmark button) on hover/focus in the right corner.
  - The close/dismiss icon (X) should be positioned in the top-right corner, measuring at least `24x24px` for touch interactions.

### 4. Create Clear State Transitions
Provide distinct states to reflect user interaction:
- **Unread State:** Light background, bold text, visible blue indicator dot.
- **Read State:** Fades the unread background, changes text weight to regular, hides the indicator dot.
- **Hover/Focus State:** Shifts the background color slightly (e.g., from white to a soft neutral grey) and reveals secondary inline triggers (e.g., "Archive", "Mark as read").
- **Focused state:** High-contrast focus rings around individual items when navigated via keyboard. Keep focus visible and sharp (minimum 2px outline with offset).
- **Disabled state:** If an action card is being processed (e.g., clicking "Approve"), apply an inline loading spinner, decrease opacity to `0.5`, and set button attributes to `disabled` to prevent double-clicks.

### 5. Define Bulk Operations and Empty States
- **Footer Navigation:** Always provide a footer link to "View all notifications" (links to a dedicated page) or "Mark all as read."
- **Empty State:** When no notifications are present, or when all notifications are cleared, display an empty state containing an encouraging visual (e.g., a checkmark or bell), a neutral header ("All caught up!"), and a secondary descriptive link to "Notification Settings" (see `empty-state-system`).

### 6. Implement Keyboard Focus and Screen-Reader Management
- **Trigger Toggle:** Pressing `Enter` or `Space` on the Bell icon toggles the popover. Apply `aria-expanded="true/false"` and `aria-controls="notification-panel-id"`.
- **Focus Trap (for Drawers and Popovers):** When opened, keyboard focus must move immediately to the first actionable element inside the panel (usually the "Mark all as read" button or the first notification item). Focus must be trapped inside the panel while it is visible. Pressing `Escape` must close the panel and return focus directly to the Bell icon.
- **Roving Tabindex / List Navigation:** If there are dozens of notification items, allow keyboard users to navigate between cards using the `ArrowUp` and `ArrowDown` keys, keeping a single tab stop (`tabindex="0"` for the active item, `tabindex="-1"` for others). This avoids forcing keyboard users to tab through 50 links to reach the end of the page.
- **Screen Reader Announcements:** Use a hidden `aria-live="polite"` region to announce updates to the unread count when they occur dynamically (e.g., "New notification from Sarah").

---

## Decision Rules

### Rule 1: Dropdown vs. Side Drawer vs. Page
Choose the container structure using this layout grid:
- **Choose Dropdown Popover if:** The app has fewer than 10-15 notifications on average, contains mostly short updates, and actions are simple (such as a direct link or quick dismiss).
- **Choose Side Drawer if:** The notification panel includes interactive tabs (e.g., "All", "Mentions", "Archive"), requires rich multi-line card summaries, or requires complex form fields (such as text input to reply directly inside the notification).
- **Choose Dedicated Page if:** The user is managing notification-heavy workloads (e.g., GitHub PR review inbox, Zendesk support tickets, Shopify store alerts) that require robust search filters, checkmark multi-selects, and massive archiving workflows.

### Rule 2: Avatar vs. Icon Indicators
- Use a **User Avatar** (image or initials) if the notification is a social or direct collaboration event triggered by a specific human (e.g., "Sarah shared a file").
- Use a **System Icon** (with status-specific colors: red for alert, yellow for warning, blue for info) if the event is system-generated (e.g., "Database backup completed").

### Rule 3: Mark-as-Read Action Behavior
- Clicking the notification card should **both** redirect the user to the deep link target **and** mark the item as read.
- Provide a dedicated, visible "Mark as read" checkmark icon on the card, enabling users to mark items read *without* navigating away from the panel.

---

## Constraints

### 1. Contrast & Sizing (WCAG AA)
- **Text Contrast:** Ensure all notification copy meets the `4.5:1` contrast ratio. Timestamps and muted excerpts must not fall below `4.5:1` (or `3:1` for large text).
- **Touch Targets:** Tap targets for individual buttons (close icons, accept/decline links, mark-as-read checkmarks) must meet the WCAG 2.2 SC 2.5.8 minimum target size of `24x24px`.
- **Keyboard Contrast:** Focus rings must have a minimum contrast ratio of `3:1` against the card background.

### 2. Responsiveness
- **Desktop:** Floating panels must position themselves intelligently. If the trigger is near the right edge of the screen, the popover must align to its right side to prevent clipping.
- **Mobile Viewports (`< 768px`):** Transform the desktop dropdown popover into a **Full-Screen Panel** or a **Bottom-Aligned Slide-Up Sheet** to ensure thumb-reach accessibility and prevent small, unscrollable popover containers.

### 3. Dynamic Stacking
- Ensure the popover or drawer z-index is configured above standard layout elements but below modal triggers (e.g., `--z-index-popover: 1000`, `--z-index-modal: 2000`).

---

## Common Failure Patterns

- **The "Unescapable Inbox":** Opening a dropdown notification popover on desktop, but failing to provide an `Escape` key close listener. Users are forced to find and click a tiny "X" or click outside to dismiss.
- **The "Stuck Badge" Loop:** A notification badge showing `3` unread items, but opening the panel does not visually highlight which cards are unread, nor does it provide a clear way to mark them read. The badge remains stuck, causing user fatigue and eventual banner-blindness.
- **The "Kitchen Sink" Feed:** Stuffing full paragraphs of emails, raw database logs, and marketing promotions into a tiny dropdown panel, causing layout overflow and crushing the visual hierarchy.
- **Layout Shift on Scroll:** Popovers that are styled with static pixel coordinates that fail to stay attached to the header bell icon when scrolling, floating randomly over content.
- **Double Focus Outlines:** Double-layer focus styling where both the outer container card *and* the internal deep link button capture focus simultaneously, requiring keyboard users to tab twice per notification.

---

## Validation Criteria

- [ ] **Badge Count Behavior:** If the unread count is `0`, the red dot or numeric indicator is completely hidden from view.
- [ ] **State Contrast:** Unread cards are clearly visually distinguished from read cards (using backgrounds, text weight, and indicator dots).
- [ ] **Target Sizes:** Every clickable button/link inside the card meets the WCAG 2.2 24x24px touch target minimum.
- [ ] **Responsive Transformation:** On mobile viewports, the notification center displays full-screen or as a bottom-aligned slide-up sheet without horizontal scrolling.
- [ ] **Keyboard Path:** Pressing `Escape` successfully closes the active notification popover/drawer and returns keyboard focus to the header trigger button.
- [ ] **Accessible Labels:** Screen-readers can hear a clear count of unread notifications when focusing on the header trigger.
- [ ] **Focus Visibility:** Focus outlines are sharp, distinct, and visible when tabbed via keyboard.
- [ ] **Z-Index Containment:** The notification popover overlay is fully container-independent and never clipped by parent container boundaries (`overflow: hidden` parent containers).
