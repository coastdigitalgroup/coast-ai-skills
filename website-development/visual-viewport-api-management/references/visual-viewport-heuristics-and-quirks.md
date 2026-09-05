# Visual Viewport API Technical Reference & Browser Quirks

## 1. Visual Viewport vs. Layout Viewport Architecture

To build responsive mobile web applications, developers must differentiate between the **Layout Viewport** and the **Visual Viewport**.

| Property | Layout Viewport | Visual Viewport (`window.visualViewport`) |
| --- | --- | --- |
| **Definition** | The full size of the CSS canvas layout. | The portion of the screen currently visible to the user. |
| **CSS Measurement** | `100vh`, `100vw`, `100dvh`, `window.innerHeight` | `visualViewport.height`, `visualViewport.width` |
| **Pinch-Zoom Impact** | Unchanged when user zooms in. | Shrinks proportionally to zoom level (`scale`). |
| **Soft Keyboard Impact** | Varies by OS (iOS: Unchanged; Android: May resize). | Shrinks on both iOS Safari and Android Chrome. |
| **Scroll Offsets** | `window.scrollY`, `window.scrollX` | `visualViewport.offsetTop`, `visualViewport.offsetLeft` |

## 2. iOS Safari vs. Android Chrome Soft Keyboard Behaviors

### iOS Safari (WebKit)
- **Behavior:** Opening an on-screen soft keyboard does **NOT** resize the layout viewport (`window.innerHeight` or `100vh`). Instead, WebKit pushes the visual viewport upward, overlaying the virtual keyboard over the lower section of the page layout viewport.
- **Offset Shift:** `visualViewport.offsetTop` can become positive when the user scrolls down inside an input field.
- **Keyboard Height Math:** `keyboardHeight = window.innerHeight - visualViewport.height - visualViewport.offsetTop`.

### Android Chrome (Blink)
- **Interactive-Widget Support:** Chrome 108+ supports `<meta name="viewport" content="interactive-widget=...">`:
  - `resizes-visual` *(Default)*: Resizes only the visual viewport when the virtual keyboard opens.
  - `resizes-content`: Resizes both layout and visual viewports, causing `100vh`/`100dvh` layout elements to shrink naturally.
  - `overlays-content`: Draws virtual keyboard on top of layout without resizing layout.
- **Cross-Platform Rule:** Relying on JavaScript synchronization with `window.visualViewport` guarantees uniform layout behavior across iOS Safari, Android Chrome, and embedded OS WebViews.

## 3. Font Size & Automatic Focus Zooming on iOS

- **Trigger:** On iOS Safari, focusing an `<input>`, `<textarea>`, or `<select>` element with a CSS `font-size` smaller than `16px` triggers an automatic, unpreventable page zoom gesture.
- **Effect:** The visual viewport scale increases (`scale > 1.0`), shifting `visualViewport.offsetLeft` and `visualViewport.offsetTop` and causing fixed elements to break alignment.
- **Remediation:** Always set form field font size to at least `16px` on mobile screens:

```css
@media (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}
```

## 4. Visual Viewport Math & CSS Custom Variable Formulas

When anchoring elements to the visual viewport:

1. **Computed Keyboard Height:**
   `const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);`
2. **Fixed Bottom Dock Alignment:**
   `transform: translateY(calc(-1 * var(--keyboard-height, 0px)));`
3. **Container Restraining (Preventing Body Scroll):**
   `height: var(--vv-height, 100dvh);`

## 5. Performance & Accessibility Considerations

- **Event Throttling:** `visualViewport` emits `resize` and `scroll` events at 60fps+ during pinch-zoom gestures and keyboard opening animations. Event handlers must pass work off to `requestAnimationFrame` to avoid main-thread scroll jank.
- **WCAG 1.4.4 Resize Text (Level AA):** Web applications must support pinch-zoom scaling up to 200% (`scale = 2.0`) without loss of content or functionality. Ensure fixed overlays do not clip scrollable document text when zoomed.
- **WCAG 2.1.2 No Keyboard Trap:** Ensure soft keyboard focus traps do not prevent mobile screen reader users (VoiceOver / TalkBack) from navigating outside the focused input dock.
