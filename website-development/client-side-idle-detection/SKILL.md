---
name: client-side-idle-detection
description:
  Implement and debug high-performance client-side user inactivity tracking
  and session timeout management, using passive event throttling, the Page Visibility
  API, cross-tab BroadcastChannel sync, and WCAG-compliant alert dialogues.
---

# Client-Side Idle Detection and Session Lifetime Management

## Purpose

The Client-Side Idle Detection and Session Lifetime Management skill provides a high-performance, resilient, and accessible protocol for tracking user inactivity. In secure web portals, SaaS dashboards, and transactional checkouts, terminating inactive sessions is a core security compliance (e.g., PCI-DSS, HIPAA) and resource-saving requirement.

This skill solves:
1. **Performance Degradation:** Preventing UI jank and main thread bloat when capturing global user inputs (clicks, keypresses, scrolls, mouse movements).
2. **Timer Accuracy / Throttling:** Solving browser background tab throttling (where browsers suspend or slow down `setTimeout`/`setInterval` to save battery), which causes standard JS timers to fall out of sync with real-time server sessions.
3. **Multi-Tab Sync:** Preventing a user active in Tab A from being logged out in Tab B of the same site.
4. **WCAG Compliance:** Satisfying WCAG 2.1/2.2 Success Criterion 2.2.1 (Timing Adjustable) by providing an accessible warning modal that allows users to extend their session before forced termination.

## Use Cases

- **Financial and Medical Portals:** Logging out inactive patients or clients to protect sensitive PII and HIPAA compliance.
- **E-commerce Carts:** Expiring reserved cart stock or promotional ticket holds after user inactivity.
- **SaaS Workspace Security:** Auto-locking client accounts or prompting credential re-validation.
- **Asset/Media Pause:** Stopping heavy background video streams, WebRTC, or polling queries when the user leaves their desk.

## When NOT to Use

- **Static Content-Only Pages:** Marketing websites, blogs, or document directories where user state is not authenticated or transaction-bound.
- **Media Players with Native Focus:** Video or audio playback setups where system-level sleep/screensaver inhibition is handled entirely via the Screen Wake Lock API or native media controls.
- **Internal Tools with Zero Autologout Requirement:** Where administrative workflow must never be interrupted under any circumstances.

## Inputs

1. **Idle Threshold:** Total duration of inactivity (e.g., 15 minutes) before the session is considered idle.
2. **Warning Duration:** Countdown duration (e.g., 60 seconds) shown in the warning modal prior to session expiration.
3. **Activity Event Triggers:** The specific list of DOM events that qualify as "active user" signals.
4. **Callback Hooks:** Functional handlers for transition states (`onWarning`, `onTimeout`, `onActivity`, `onRemainingTimeUpdate`).

## Outputs

1. **Optimized Activity Monitor:** A highly responsive JS controller tracking throttled, passive global events.
2. **Absolute Timestamp State Engine:** Time-keeping logic based on real-time epoch comparison (`Date.now()`) instead of sequential incrementing.
3. **Cross-Tab Synchronization Channel:** A BroadcastChannel API integration broadcasting and listening for activity updates across same-origin tabs.
4. **WCAG-Compliant Warning Dialog:** An ARIA-decorated dialog with automated focus-trapping and periodic `aria-live` countdown assertions.

## Workflow

```text
[User Action] ---> [Throttled Tracker] ---> [Reset Idle Time] ---> [Broadcast Reset to other tabs]
                                                 |
                                         (Timeout Reached?)
                                                 |
                                                 v
                                        [Show Warning Modal]
                                        - Trap focus inside
                                        - Announce via aria-live
                                                 |
                        +------------------------+------------------------+
                        |                                                 |
               [Extend Session Button]                             (No Action taken?)
                        |                                                 |
                        v                                                 v
               [Dismiss Modal & Reset]                            [Trigger Expiration]
                                                                  - Clear storage/tokens
                                                                  - Redirect to logout page
```

### 1. Set Up Throttled Event Tracking
Register event listeners globally. To prevent scroll-blocking and main-thread layout thrashing:
- Use **passive event listeners** (`{ passive: true }`) for events like `scroll`, `touchstart`, and `wheel`.
- **Throttle activity resets:** Do not execute logic on every single mouse movement or pixel scrolled. Store a memory variable (`lastTrackedActivityTime`) and only process updates if at least 1–2 seconds have elapsed since the last tracked interaction.

### 2. Solve Browser Background Suspension (Absolute Timing)
- **The Problem:** When a browser tab is minimized or backgrounded, `setTimeout`/`setInterval` delay accuracy degrades heavily, often firing only once per minute to preserve device battery.
- **The Solution:** Never count time by subtracting 1 from a JS counter inside an interval (e.g. `count = count - 1`). Instead, store an absolute target timestamp `expirationTimestamp = Date.now() + idleThreshold`.
- Run a heartbeat interval (e.g., every 500ms–1000ms). In each tick, calculate the remaining time by evaluating:
  `const remaining = expirationTimestamp - Date.now();`
- If `remaining <= warningDuration`, transition the UI to the warning state.

### 3. Sync State Across Tabs (BroadcastChannel)
- Construct a same-origin `BroadcastChannel` (e.g., `new BroadcastChannel('session_idle_tracker')`).
- When activity is registered in the current tab, post a `"user_active"` message through the channel.
- When other tabs receive this message, they instantly reset their local `expirationTimestamp` to sync with the current active tab.
- *Fallback:* If `BroadcastChannel` is not supported or falls back, use the `storage` event on `localStorage`.

### 4. Implement pagehide and visibilitychange Events
- When the tab transitions from hidden to visible (`document.visibilityState === 'visible'`), immediately check `Date.now()` against the stored `expirationTimestamp`.
- If the current time has surpassed the expiration timestamp during background sleep, trigger immediate silent logout without presenting the modal to avoid "modal flashes" on long-dormant tabs.

### 5. Build the Accessible WCAG Warning Dialog
Ensure absolute compliance with WCAG Success Criterion 2.2.1:
- **ARIA Structure:** Give the dialog `role="alertdialog"` (for high-severity interruptions) or `role="dialog"` with `aria-modal="true"`.
- **Labeling:** Link the header and descriptive text using `aria-labelledby` and `aria-describedby`.
- **Focus Management:** On modal entry, immediately move focus to the "Extend Session" button (not the "Log Out" button) to prevent accidental keyboard submission. Trap keyboard focus inside the modal using a `keydown` loop.
- **Aria-Live Updates:** Screen readers do not automatically announce visual countdown numbers. Define a visually hidden container with `aria-live="assertive"` or `aria-live="polite"`. To prevent screen reader spam, do not announce every single second. Update and assert the countdown text at logical intervals: every 15 seconds, and once per second during the final 10 seconds.
- **Focus Restoration:** If the user clicks "Extend Session", hide the modal and restore focus to the trigger or pre-modal active element.

## Decision Rules

- **`BroadcastChannel` vs. `localStorage` storage event:**
  - *BroadcastChannel (Preferred):* Real-time, lighter footprint, does not pollute local disk storage, and is fully supported in all evergreen browsers.
  - *localStorage (Fallback):* Use if supporting older webview runtimes or legacy environments.
- **`role="alertdialog"` vs. `role="dialog"`:**
  - *`role="alertdialog"`:* Use when the timeout warning represents a critical security state requiring immediate remediation. Screen readers will immediately interrupt any other readouts.
  - *`role="dialog"`:* Use for standard, less disruptive inactivity indicators (e.g., dynamic page auto-saving notifications).
- **Graceful Termination vs. Forced Redirect:**
  - Always prefer notifying the server API of client termination *before* redirecting. If the API call fails due to network outage, clear client tokens/cookies manually and enforce a redirection.

## Constraints

- **No Active-Listener Blockers:** Interaction listeners must never use `event.preventDefault()`. Doing so would freeze normal page clicking, scrolling, and keyboard actions.
- **Strict Keyboard Operability:** Users must be able to navigate to the "Extend" button and activate it via `Space` or `Enter` keys.
- **Storage Cleanup:** Unregister visibility listeners and disconnect the `BroadcastChannel` on component teardown or logout to avoid memory leaks.

## Non-Goals

- Managing secure server-side session cookies (HTTP-Only Cookie lifecycle is managed purely by backend configurations).
- Implementing biometric/OAuth identity validation (re-authentication flows).
- System-wide user activity tracking (tracking input outside of the browser window).

## Common Failure Patterns

- **Main Thread Stalling:** Registering unthrottled `mousemove` listeners that trigger heavy calculations or layout reads (`offsetHeight`, `getBoundingClientRect()`), causing sluggish scrolling and dropping INP performance.
- **The Passive Hook Trap:** Registering scroll or wheel listeners without `{ passive: true }`, triggering browser console warnings and scrolling lag.
- **The "Background Snooze" Desync:** Using sequential `setInterval` countdown ticks. When the user closes their laptop lid or backgrounds the browser, the browser pauses the timer. When the user opens the laptop hours later, the client displays a remaining time of 10 minutes while the server-side session was actually destroyed hours ago.
- **Silent Timeout Warnings:** Displaying a visual modal overlay but failing to alert screen readers, leading to blind/visually impaired users being suddenly logged out without warning.
- **Tab Desync Logout:** Working actively in Tab A for an hour, while inactive Tab B's local timer triggers a modal and logs the user out globally, interrupting active work on Tab A.

## Validation Steps

- [ ] **Performance Profile Check:** Run a Performance Panel trace while vigorously moving the mouse and scrolling. Ensure no "Long Tasks" are present and CPU usage from the idle tracking hooks is negligible.
- [ ] **Background Suspension Simulation:** Set an idle timeout of 5 seconds. Open the tab, background it (switch tabs), wait 10 seconds, and switch back. Verify that the session is instantly recognized as expired on focus without a laggy countdown.
- [ ] **Multi-Tab Synchronization Test:** Open Tab A and Tab B. Let both sit until 10 seconds before the warning threshold. Trigger activity in Tab A. Verify that Tab B's timer instantly resets and synchronization is complete.
- [ ] **Accessibility (A11y) Tab and Focus Trap Audit:** Open the warning modal. Press `Tab` repeatedly. Verify that focus cycles exclusively between the "Extend Session" and "Logout Now" buttons and cannot escape to background links.
- [ ] **Screen Reader Announcement Check:** Turn on a screen reader (VoiceOver, NVDA). Verify that the warning modal reads its title and description, and that countdown announcements (via the `aria-live` region) are read correctly at defined intervals.
