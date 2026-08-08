# Media Events and Custom Range Styling Reference

This guide provides technical specifications for binding to native HTML5 Media APIs and styling custom range inputs securely across modern browser engines.

---

## 1. Native HTML5 Audio Event Lifecycles

To synchronize custom UI displays accurately, developers must bind to specific media state-transitions of the native `<audio>` element (or `new Audio()` object instance).

| API Event | Triggering Condition | Key Synchronized UI Action |
| :--- | :--- | :--- |
| **`loadedmetadata`** | Fired when the browser successfully parses the file's duration, sample rates, and meta headers. | Update seek bar `max` and configure total duration timer text displays. |
| **`timeupdate`** | Fired repeatedly (roughly 4-250ms interval) as the media playback index advances. | Set seek bar `value` and update elapsed timer text (if not currently dragging/seeking). |
| **`play`** | Fired when the media transitions from paused/stalled state to playing. | Reveal the Pause icon, hide the Play icon, and update play button `aria-label`. |
| **`pause`** | Fired when active playback is suspended (by user click, focus loss, or system interruption). | Reveal the Play icon, hide the Pause icon, and update play button `aria-label`. |
| **`volumechange`**| Fired when the volume amplitude is modified or the muted property transitions. | Align volume sliders, toggle mute icons, and announce level adjustments via ARIA live. |
| **`ended`** | Fired when the play head reaches the exact end of the audio file duration. | Reset Play/Pause toggles, clear progress coordinates, and announce completion via ARIA live. |
| **`waiting`** | Fired when playback halts because of network throttling or content buffering delays. | Display loading spinner or announce buffering state via ARIA live status region. |

---

## 2. Cross-Browser Custom Slider Styling

Native `<input type="range">` elements are highly accessible but extremely inconsistent to style. Different browsers use completely separate CSS pseudo-element selectors for the track (the horizontal bar) and the thumb (the draggable node).

To customize sliders consistently, you **must override all browser selectors** explicitly:

### WebKit / Blink Engine (Safari, Chrome, Edge, Opera)
WebKit/Blink browsers require `-webkit-appearance: none;` on the range input wrapper, followed by specific runway-track and thumb selectors.

```css
/* Range input base */
input[type="range"].audio-slider {
  -webkit-appearance: none;
  background: transparent; /* Clear native background box */
}

/* Run track override */
input[type="range"].audio-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
}

/* Drag thumb override */
input[type="range"].audio-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #005a9c;
  margin-top: -6px; /* Offset alignment math: (Track Height / 2) - (Thumb Height / 2) */
  cursor: pointer;
}
```

### Gecko Engine (Firefox)
Firefox does not require standard appearance resets on the input element but relies on specialized `::-moz` prefixes for styles.

```css
/* Run track override */
input[type="range"].audio-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
}

/* Drag thumb override */
input[type="range"].audio-slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #005a9c;
  border: none;
  cursor: pointer;
}
```

---

## 3. Keyboard Event Dispatching Best Practices

When listening to global keyboard triggers (such as `Space` for play/pause, or arrow keys for custom seeks), developers must prevent default browser scrolls without hijacking native element interaction hooks.

1. **Localize Listeners:** Avoid adding keydown event listeners to the global `window` or `document` scope. Bind keyboard interactions directly to the player container element so page-level scrolls remain unaffected when the player is inactive.
2. **Select Exception Rule:** Custom input elements, search boxes, and `<select>` dropdown lists within the player (such as playback rate speeds) possess their own keyboard controls. Do not run custom audio commands when these elements have focus:
   ```javascript
   container.addEventListener('keydown', (e) => {
     if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
       return; // Pass through to allow native dropdown navigation
     }
     ...
   });
   ```
3. **Prevent Page Scrolling:** Prevent the default document scroll when a user presses the `Spacebar` while focusing the player controls:
   ```javascript
   if (e.key === ' ') {
     e.preventDefault(); // Stop standard viewport page-down scroll
     this.togglePlayback();
   }
   ```

---

## 4. Mobile Screen Reader & VoiceOver Caveats

Mobile viewports (specifically VoiceOver on iOS Safari) handle range sliders in a unique manner.
1. **Swipe to Value Gestures:** When a range slider receives focus under VoiceOver on iOS, users must swipe up or down to modify values. Ensure that `step` and `max` values are not configured with microscopic floating points (e.g., `step="0.001"`) which renders swipe-adjustments impossible. Keep step boundaries at `0.1` or higher.
2. **`aria-valuetext` Pronunciation:** Some screen readers speak both `aria-valuenow` and `aria-valuetext` back-to-back. To prevent repetitiveness, verbalize numbers clearly in text (e.g., `"Volume 50 percent"` or `"1 minute elapsed"`), matching the active scale context cleanly.
