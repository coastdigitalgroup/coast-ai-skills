# Custom Audio Player Accessibility Audit Checklist

Use this checklist to audit custom-designed, custom-styled, or refactored HTML5 media players against **WCAG 2.1 AA** standards.

---

## 1. Semantic Markup & Structural Integrity

- [ ] **Descriptive Player Labeling:** The overall player container has an explicit description (e.g., `aria-label="Audio player for: Episode 12 - Deep Dive into Frontend Performance"`).
- [ ] **Interactive Buttons:** All controls (Play, Skip, Mute, Volume Toggle) use native `<button type="button">` elements. *Never* use un-focusable `<div>` or `<span>` containers for click-triggers.
- [ ] **Hidden Design Decorative Elements:** Purely aesthetic design features inside controls (like SVGs or Font Awesome icons) have explicit `aria-hidden="true"` labels so they do not clutter screen-reader pronunciation flows.
- [ ] **Action Labels:** Action buttons have descriptive, screen-readable names via `aria-label` (e.g., `<button aria-label="Play">`) instead of empty SVG payloads.
- [ ] **Volume and Speed Inputs:** Volume controls and seeking sliders use native range sliders (`<input type="range">`) rather than custom coordinate-pointer math blocks.

---

## 2. Keyboard Access & Interaction Sequences

- [ ] **Logical Focus Hierarchy:** Keyboard `Tab` navigation sweeps through controls in a logical sequence: Play/Pause ➔ Time Seek Bar ➔ Skip Back ➔ Skip Forward ➔ Mute Toggle ➔ Volume Bar ➔ Playback Rate.
- [ ] **No Focus Traps:** Focus moves freely out of the media player boundaries when using the standard keyboard tab path (WCAG 2.1.2 No Keyboard Trap).
- [ ] **Native Keyboard Slider Behaviors:** The Seek and Volume range elements respond cleanly to standard arrow inputs (`ArrowRight`, `ArrowLeft`), as well as fast skips (`PageUp`, `PageDown`) and boundary jumping (`Home`, `End`).
- [ ] **Shortcut Overlap Protection:** Global keystroke events (like `Space` or `M`) are isolated inside the container bounds and bypassed when focusing standard dropdown menus (like speed selection) to prevent user frustration.
- [ ] **No Focus Obstruction:** Standard browser outlines (`:focus-visible`) are clearly distinct, have adequate contrast against the background, and are never cropped or hidden by absolute layout overflow or clip boundaries.

---

## 3. Screen Reader Communication & Telemetry

- [ ] **Live Announcement Feeds:** Key state updates (Play, Pause, Buffering, Completion) are pushed politely to a persistent, visually hidden status live region (`role="status" aria-live="polite"`).
- [ ] **Debounced Alert Telemetry:** Live alerts are throttled or debounced (e.g., by 150ms) to prevent speech overlap conflicts when clicking actions rapidly.
- [ ] **Real-Time Progress Tracking:** The Seek slider dynamically updates `aria-valuenow` (elapsed seconds) and custom `aria-valuetext` (e.g., "3 minutes, 14 seconds elapsed") during active playback.
- [ ] **Volume Level Synchronization:** Adjusting the volume slider updates `aria-valuenow` and `aria-valuetext` (e.g., "Volume 75 percent") synchronously.
- [ ] **Mute/Unmute Label Shifts:** Toggling mute changes the button icon and immediately swaps the `aria-label` (e.g., from "Mute volume" to "Unmute volume") to declare the upcoming action.

---

## 4. Mobile Layout & Responsive Targets

- [ ] **Minimum Interaction Boundary Size:** All interactive buttons possess a touch target diameter of at least **44x44px** (WCAG 2.1 SC 2.5.5) or at least **24x24px** with clear separation gaps (WCAG 2.2 SC 2.5.8).
- [ ] **Interaction Distance:** Seeking sliders and Volume range inputs are spaced adequately to prevent accidental fat-finger selection overlap on mobile touch viewports.
- [ ] **Media Session Integration (Optional):** The player uses the browser's native `navigator.mediaSession` API to display media controls (Play/Pause/Skip) directly on mobile system lockscreens and background drawers.

---

## 5. Visual Rendering & Contrast

- [ ] **Minimum Color Contrast:** Interactive element outlines, text timestamps, labels, and track indicators maintain a contrast ratio of at least **4.5:1** against the background (WCAG 1.4.3).
- [ ] **High Contrast Compatibility:** Outlines and visual tracks degrade gracefully into standard canvas text/highlight bounds when Windows High Contrast / Forced Colors Mode is active.
- [ ] **No Color-Only Indicators:** Status changes (like active buffering or errors) do not rely solely on color codes (e.g., green/red) and include explicit accompanying text symbols or screen-reader descriptions (WCAG 1.4.1).

---

## Evaluation Results

| Audit Area | Status (Pass/Fail) | Notes & Remediation Actions |
| :--- | :--- | :--- |
| **Semantic Structure** | | |
| **Keyboard Access** | | |
| **Assistive Telemetry** | | |
| **Touch Interaction Targets** | | |
| **Visual Rendering / Forced Colors** | | |
