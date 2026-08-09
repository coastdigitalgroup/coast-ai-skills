# HTML5 Media Event Lifecycle & Cross-Browser Slider Reference

Custom media players require combining the browser's native audio engine events with detailed CSS rules to override range input styles. This reference outlines standard media events, browser-specific range pseudo-selectors, and WCAG accessibility standards.

---

## 1. Native HTML5 Media Element Events

Always bind custom UI updates to these native events on the `<audio>` element rather than basic mouse or touch click triggers. This ensures flawless synchronization when users interact with OS-level widgets, Bluetooth headsets, or physical keys.

| Event Name | Trigger Context | Custom UI Response Action |
| :--- | :--- | :--- |
| **`play`** | Playback starts (called via `.play()` or system action). | Toggle button graphic to "Pause", set `aria-pressed="true"`, update label to "Pause". |
| **`pause`** | Playback stops (called via `.pause()`, track finishes, or system pause). | Toggle button graphic to "Play", set `aria-pressed="false"`, update label to "Play". |
| **`timeupdate`** | Continuous updates during active playback (fired ~4-250ms). | If not currently seeking, update timeline `.value` and `current-time` text label. |
| **`durationchange`** | Metadata headers parsed and the total length is calculated. | Replace placeholder (`0:00`) with actual duration, update timeline `max` attribute. |
| **`volumechange`** | Volume adjusts or muted property toggles. | Sync mute button `aria-pressed` state, switch mute/unmute SVG icons, align volume slider `.value`. |
| **`seeking`** | User begins scrubbing (dragging timeline slider). | Set state flag `isSeeking = true` to prevent `timeupdate` from fighting user drag positions. |
| **`seeked`** | User finishes scrubbing (releases timeline slider). | Set state flag `isSeeking = false` to resume automatic `timeupdate` visual ticking. |
| **`ended`** | Audio reaches the end of the track. | Reset timeline value to `0`, call pause callback, update icons, clear active states. |

---

## 2. Browser Range Input Pseudo-Element Architecture

Browsers do not share a unified CSS selector for range input sliders. Styling them consistently requires overriding individual engine-specific pseudo-elements.

### Important: Never Group Selectors
Never group browser-specific pseudo-selectors into a single comma-separated rule (e.g., `input[type="range"]::-webkit-slider-thumb, input[type="range"]::-moz-range-thumb { ... }`). If a browser does not recognize even one selector in a comma-separated block, it is specified by the CSS Standard to **discard the entire block**. You must write separate, individual rules for every pseudo-element.

### Webkit Engines (Chrome, Safari, Edge, Opera, Samsung Internet)
- **`input[type="range"]`**: Main outer wrapper element. Use `-webkit-appearance: none;` to remove browser-default skins.
- **`input[type="range"]::-webkit-slider-runnable-track`**: Styles the horizontal track line.
- **`input[type="range"]::-webkit-slider-thumb`**: Styles the draggable round handle/thumb. Use `-webkit-appearance: none;` to reset native styling. Use `margin-top` to align it within the track height.

### Gecko Engine (Firefox)
- **`input[type="range"]::-moz-range-track`**: Styles the horizontal track line.
- **`input[type="range"]::-moz-range-thumb`**: Styles the draggable round handle/thumb. Explicitly declare `border: none;` to remove the default gray border.

---

## 3. High Contrast and Forced Colors Mode Compliance

When users activate "Forced Colors" (High Contrast) mode on Windows, standard CSS background-colors and borders are stripped away. To ensure custom players remain fully usable in high contrast setups:

- Use **`box-shadow`** or native **`outline`** for focus indicators, as backgrounds disappear.
- Leverage **`currentColor`** for SVG icon fills so they inherit the active high-contrast text color natively.
- Provide a clear high-contrast fallback for active/playing states:

```css
@media (forced-colors: active) {
  /* Style overrides for Windows Forced Colors */
  .player-control-button {
    border: 2px solid ButtonText;
    background: ButtonFace;
  }
  .player-control-button svg {
    fill: ButtonText;
  }
}
```

---

## 4. Audio Performance Tuning Guidelines

- **Preload Strategy:** Use `preload="metadata"` for standard player placements on secondary pages. This loads the audio headers to retrieve track duration and metadata without pre-downloading the entire mega-byte content file. Use `preload="none"` for players positioned far below the fold or inside hidden tabs.
- **Prevent Memory Leaks:** If your audio player runs inside a Single Page Application (like React or Vue), always remove the event listeners when the component unmounts. Unremoved event listeners targeting global window, document, or native audio media elements will keep the player in memory, creating a garbage-collection block.
- **Event Throttling on Seeking:** Listen to `'input'` events on range sliders for instantaneous visual feedback, but defer setting `audio.currentTime` until the `'change'` event is fired (the moment the user lets go of the track handle). Triggering native browser media seeks on every single millisecond pixel drag of the `'input'` event causes heavy layout-thrashing and media buffering stutters on mobile devices.
