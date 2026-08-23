# Player Controls, Hotkeys, and Accessibility Reference

A quick reference guide for control bar anatomy, hotkey mapping, screen reader announcements, contrast guidelines, and touch-target requirements in custom audio and video media players.

---

## 1. Hotkey & Keyboard Navigation Matrix

| Action | Standard Hotkey | Secondary Hotkey | ARIA Announcement Pattern |
| :--- | :--- | :--- | :--- |
| **Play / Pause Toggle** | `Space` | `K` | `"Playing"` / `"Paused"` |
| **Seek Backward 5s** | `Left Arrow` | - | `"Seek backward 5 seconds. Current time 04 minutes 10 seconds."` |
| **Seek Forward 5s** | `Right Arrow` | - | `"Seek forward 5 seconds. Current time 04 minutes 20 seconds."` |
| **Seek Backward 10s** | `J` | - | `"Seek backward 10 seconds."` |
| **Seek Forward 10s** | `L` | - | `"Seek forward 10 seconds."` |
| **Volume Up (+10%)** | `Up Arrow` | - | `"Volume 90%"` |
| **Volume Down (-10%)**| `Down Arrow` | - | `"Volume 70%"` |
| **Mute / Unmute** | `M` | - | `"Muted"` / `"Unmuted. Volume 80%"` |
| **Toggle Fullscreen** | `F` | `Esc` (to exit) | `"Entered fullscreen mode"` / `"Exited fullscreen mode"` |
| **Toggle Captions** | `C` | - | `"Closed captions enabled"` / `"Closed captions disabled"` |
| **Speed Cycle** | `Shift + >` | `Shift + <` | `"Playback speed set to 1.5x"` |

---

## 2. ARIA Attribute Bindings for Media Controls

### Timeline Scrub Slider Container (`role="slider"`)
```html
<div role="slider"
     tabindex="0"
     aria-label="Seek video timeline"
     aria-valuemin="0"
     aria-valuemax="750"
     aria-valuenow="255"
     aria-valuetext="04 minutes 15 seconds of 12 minutes 30 seconds">
</div>
```

### Volume Control Slider (`role="slider"`)
```html
<input type="range"
       aria-label="Volume level"
       min="0"
       max="100"
       value="80"
       aria-valuetext="80 percent">
```

### Captions Toggle Button
```html
<button type="button"
        aria-pressed="true"
        aria-label="Closed captions enabled">
  CC
</button>
```

---

## 3. WCAG AA Contrast & Touch Target Rules

1. **Overlay Scrim Contrast (SC 1.4.3 Visual Contrast):**
   - White text and iconography displayed over video frames must maintain at least **4.5:1 contrast**.
   - Always render a linear gradient scrim background (`linear-gradient(to top, rgba(0,0,0,0.85), transparent)`) behind lower control bars.

2. **Touch Target Sizing (SC 2.5.5 Target Size):**
   - Minimum physical clickable size for control icons: `24x24px`.
   - Minimum touch target bounding box on mobile devices: `44x44px` (achieved using transparent padding around control icons).

3. **Unclipped Focus Rings (SC 2.4.7 Focus Visible):**
   - All focusable buttons and timeline tracks must feature an unclipped 2px focus ring (`outline: 2px solid #60A5FA; outline-offset: 2px;`) that remains visible over dark video backgrounds.
