# Media Player Controls & Accessibility Reference

This reference provides complete accessibility mappings, keyboard interaction rules, touch target guidelines, and ARIA attributes for custom media players complying with WCAG 2.1 AA standards.

---

## 1. Keyboard Shortcuts Mapping Matrix

Custom web media players must support intuitive, standardized keyboard shortcuts.

| Key Trigger | Command / Action | ARIA & State Updates | Live Region Announcement |
| :--- | :--- | :--- | :--- |
| `Space` or `K` | Toggle Play / Pause | Toggle `aria-label` ("Play" / "Pause") | *"Video playing"* / *"Video paused"* |
| `J` | Rewind 10 seconds | Update `aria-valuenow` on scrubber | *"Rewound 10 seconds"* |
| `L` | Fast-Forward 10 seconds | Update `aria-valuenow` on scrubber | *"Fast-forwarded 10 seconds"* |
| `Left Arrow` | Rewind 5 seconds | Seek `-5s` | *"02:10"* |
| `Right Arrow` | Fast-Forward 5 seconds | Seek `+5s` | *"02:20"* |
| `Up Arrow` | Increase Volume (+10%) | Update `aria-valuenow` on volume slider | *"Volume 80 percent"* |
| `Down Arrow` | Decrease Volume (-10%) | Update `aria-valuenow` on volume slider | *"Volume 60 percent"* |
| `M` | Toggle Mute / Unmute | Set `aria-label` ("Unmute audio") | *"Audio muted"* / *"Audio unmuted"* |
| `F` | Toggle Fullscreen | Set `aria-label` ("Exit fullscreen") | *"Entered fullscreen mode"* |
| `C` | Toggle Closed Captions | Toggle `aria-pressed="true|false"` | *"Captions enabled"* / *"Captions disabled"* |
| `0` to `9` | Seek to 0% - 90% | Seek percentage calculation | *"Seeked to 50 percent"* |

---

## 2. ARIA Role & Attribute Specifications

```html
<!-- Container Region -->
<div role="region" aria-label="Video lesson player" tabindex="0">

  <!-- Interactive Timeline Slider -->
  <input
    type="range"
    role="slider"
    aria-label="Video timeline scrubber"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="35"
    aria-valuetext="04 minutes 12 seconds of 12 minutes 45 seconds">

  <!-- Mute / Unmute Toggle Button -->
  <button
    type="button"
    aria-label="Mute audio"
    aria-pressed="false">
    <svg aria-hidden="true">...</svg>
  </button>

  <!-- Closed Captions Toggle -->
  <button
    type="button"
    aria-label="Closed captions"
    aria-pressed="true">
    <svg aria-hidden="true">...</svg>
  </button>

  <!-- Live Region Announcer for Screen Readers -->
  <div id="playerAnnouncer" class="sr-only" aria-live="polite"></div>

</div>
```

---

## 3. Touch Target & Spatial Contrast Guidelines

- **Touch Target Padding (WCAG SC 2.5.8):**
  - Desktop control icons: Minimum **24x24px** click area (36x36px button padded container).
  - Mobile / Touch viewports: Minimum **44x44px** hit target for all buttons and range thumb sliders.
- **Overlay Contrast Shield (WCAG SC 1.4.3):**
  - Control bar background must include a linear gradient protection layer: `background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.95) 100%);`.
  - Ensures control icons (`#F8FAFC`) maintain a contrast ratio **≥ 7:1** across bright white or dark video frames.
