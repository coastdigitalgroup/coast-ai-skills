# Custom Audio Player Audit Checklist

Use this checklist to audit custom media players for WCAG 2.1 AA accessibility compliance and performance regressions.

---

## 1. Semantic Structure & Landmark Isolation
- [ ] **Landmark Wrapping:** Is the player wrapped in a container utilizing `role="region"`?
- [ ] **Landmark Labeling:** Does the container have a descriptive `aria-label` identifying the specific track (e.g., `aria-label="Audio Player: Episode 4"`)?
- [ ] **Semantic Buttons:** Are interactive control items (play/pause, mute, skip) built using native `<button>` tags? (Never use `<div>`, `<span>`, or empty `<a>` anchors).
- [ ] **Keyboard Range Sliders:** Are the timeline and volume scrubbers built using native `<input type="range">`? (Never use custom mouse-drag click tracks made of nested `div`s, which block keyboard access).
- [ ] **Visually Hidden Labels:** Do all sliders have connected `<label>` descriptors utilizing a `.visually-hidden` styling block?

---

## 2. Keyboard Navigation & Hotkey Compliance
- [ ] **Tab Order Access:** Can a keyboard user access every single control (Play, Timeline, Mute, Volume) in a logical, sequential left-to-right tab order?
- [ ] **Focus Indication:** Do all interactive elements have high-contrast `:focus-visible` outline rings? (No elements should use `outline: none` without providing custom high-contrast styling).
- [ ] **Slider Scrub Actions:** Can the timeline and volume sliders be operated using the standard keyboard navigation shortcuts?
  - `ArrowRight` / `ArrowUp` (increment position)
  - `ArrowLeft` / `ArrowDown` (decrement position)
  - `Home` (snap to beginning)
  - `End` (snap to end)
  - `PageUp` (increment by larger step)
  - `PageDown` (decrement by larger step)
- [ ] **Context-Bounded Shortcuts:** If global media keyboard shortcuts are implemented (e.g., `Space` to toggle play), are they properly scoped so they only fire when focus is within the player container? (Ensuring keyboard inputs don't intercept typing inside textboxes or search fields).
- [ ] **Tab Trapping:** Is the player keyboard focus loop un-blocked? (Tabbing after the volume slider should let focus continue onto the rest of the web page rather than looping infinitely inside the media player).

---

## 3. Screen Reader & ARIA State Management
- [ ] **Aria-Pressed States:** Do the Play/Pause and Mute toggle buttons employ `aria-pressed="true"` when active/muted, and `aria-pressed="false"` when inactive?
- [ ] **Live Labels:** Do buttons dynamically toggle their `aria-label` values when clicked? (e.g. Play button announces "Play" when paused, and "Pause" when playing).
- [ ] **Screen Reader Silence:** Does the ticking current time stamp container lack `aria-live` or `role="status"` attributes? (Ensure screen readers are not continuously flooded with time ticking announcements every single second).
- [ ] **Slider Announcements:** Does tabbing into the timeline slider cause screen readers to read the slider's semantic state and current value (e.g., "Seek progress slider, 45 percent")?

---

## 4. Hardware Synchronizations & Media Lifecycles
- [ ] **Native Event Coupling:** Are visual state transitions (icon toggles, label updates) bound to native `<audio>` element events (`play`, `pause`, `volumechange`) rather than direct button `click` listeners?
- [ ] **Bluetooth/Hardware Headset Check:** If the user pauses or plays the track utilizing physical Bluetooth headset buttons or OS-level lock screen widgets, do the browser player controls stay in sync?
- [ ] **SPA Memory Allocation Cleanup:** If used in a Single Page App (React, Vue, Svelte, Angular), does the player lifecycle expose a destruction method that unbinds all event listeners and resets MediaSession action handlers to prevent memory leaks?
- [ ] **The "NaN" Duration Defense:** Does the total track duration display prevent showing `NaN:NaN` on slow network connections while metadata headers are parsing?

---

## 5. Visual Rendering & Performance Tuning
- [ ] **Minimum Touch Targets:** Are all interactive control elements designed with a minimum clickable hitting zone of `44px` by `44px`?
- [ ] **Layout Preservation (CLS):** Does the loading phase of the media metadata avoid shifting nearby layout positions (CLS = 0)?
- [ ] **Hover/Pointer Indicators:** Do all interactive elements display an explicit cursor style change (e.g., `cursor: pointer`) when hovered?
- [ ] **High Contrast System Support:** When the system's Force Colors/High Contrast setting is toggled, remain all controls, icons, and focus outlines clearly distinguishable?
