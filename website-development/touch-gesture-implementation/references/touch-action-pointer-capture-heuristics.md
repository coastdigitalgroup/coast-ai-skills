# Touch Action, Pointer Capture & Gesture Heuristics Reference

This reference details the underlying browser mechanisms, mathematical formulas, CSS rules, and engine behavior quirks involved in building high-performance touch and pointer gestures on the web.

---

## 1. CSS `touch-action` Property Matrix

The `touch-action` CSS property dictates which gesture behaviors are handled natively by the browser compositor thread before JavaScript event handlers are evaluated.

| `touch-action` Value | Native Browser Behaviors Allowed | Custom JS Gesture Use Case |
| :--- | :--- | :--- |
| `auto` | All native scrolling, pinch-zoom, and double-tap zoom | Standard web page content with no custom dragging |
| `pan-y` | Vertical page scrolling & pinch-zoom | Horizontal swipe cards, horizontal carousels, swipeable list items |
| `pan-x` | Horizontal page scrolling & pinch-zoom | Vertical bottom sheets, vertical sliders, pull-to-refresh panels |
| `manipulation` | Vertical & horizontal panning, pinch zoom (disables double-tap zoom) | Fast interactive buttons and tap controls without 300ms delay |
| `none` | None (all touch gestures suppressed) | 2D pan/zoom image viewers, drawing canvases, drag-and-drop handles |

### Browser Compositor Thread Execution
Modern engines (Blink, WebKit, Gecko) evaluate `touch-action` on the compositor thread. When `touch-action: pan-y` is declared on an element:
1. Touch start and vertical drag run instantly on the compositor thread with 0ms delay.
2. If initial motion is horizontal, the browser hands gesture processing over to the main thread `pointermove` event listener.
3. This eliminates main-thread main thread layout thrashing during standard page scrolling.

---

## 2. Pointer Capture (`setPointerCapture`)

Pointer Capture allows a specific DOM node to redirect all subsequent pointer events (`pointermove`, `pointerup`, `pointercancel`) to itself, even if the cursor or finger moves outside its physical bounding box or off screen.

```javascript
// Activate Pointer Capture on primary contact
element.addEventListener('pointerdown', (event) => {
  if (event.button === 0) {
    element.setPointerCapture(event.pointerId);
  }
});

// Release Pointer Capture cleanly
element.addEventListener('pointerup', (event) => {
  if (element.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId);
  }
});
```

### Critical Pointer Capture Rules
1. **Requires Active Down Contact:** `setPointerCapture(pointerId)` MUST be invoked while the pointer is active (inside `pointerdown` or `pointermove` before release). Invoking it on an inactive `pointerId` throws an `InvalidPointerId` DOMException.
2. **Implicit Release on Pointer Up:** Browsers automatically release pointer capture when `pointerup` or `pointercancel` fires. However, explicitly invoking `releasePointerCapture()` or checking `hasPointerCapture()` prevents state race conditions.
3. **Lost Capture Event:** Browsers fire `lostpointercapture` when pointer capture is severed (e.g. DOM node removed from tree). Handle `lostpointercapture` to reset active UI states cleanly.

---

## 3. Mathematical Formulas for Gesture Metrics

### Single-Pointer Instantaneous Velocity ($px/ms$)
To determine if a user executed a rapid "flick" gesture regardless of absolute distance:

$$v_x = \frac{x_{\text{current}} - x_{\text{last}}}{t_{\text{current}} - t_{\text{last}}}$$

Recommended Flick Threshold: $|v_x| \ge 0.4 \text{ px/ms}$ (equivalent to 400px per second).

### Multi-Pointer Pinch Distance & Scale
Given two active pointers $P_1 = (x_1, y_1)$ and $P_2 = (x_2, y_2)$:

$$\text{Distance} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

$$\text{Scale Ratio} = \frac{\text{Distance}_{\text{current}}}{\text{Distance}_{\text{initial}}}$$

$$\text{Current Scale} = \text{Clamp}\left(\text{Scale}_{\text{start}} \times \text{Scale Ratio}, \, \text{MinScale}, \, \text{MaxScale}\right)$$

### Multi-Pointer Focal Midpoint
To zoom relative to the center between two fingers:

$$\text{Focal}_x = \frac{x_1 + x_2}{2}, \quad \text{Focal}_y = \frac{y_1 + y_2}{2}$$

---

## 4. Directional Axis Locking Protocol

Axis locking prevents multi-directional "diagonal jitter" when a user attempts a pure horizontal or vertical swipe.

```
       Vertical Scroll Intent (|dy| > |dx|)
                     ▲
                     │
                     │  [Lock Threshold: 8px]
                     │
 ◄───────────────────┼───────────────────► Horizontal Gesture Intent (|dx| > |dy|)
                     │
                     │
                     ▼
```

1. Maintain an initial lock threshold (e.g., 6px - 8px).
2. During initial movement below threshold, collect delta X and Y without locking or applying transforms.
3. Once total displacement exceeds threshold:
   - If $|dy| > |dx|$ for a horizontal swipe (`touch-action: pan-y`), release pointer capture and surrender gesture to native vertical page scroll.
   - If $|dx| > |dy|$, set `isAxisLocked = true` and commit exclusively to horizontal JS transform tracking.

---

## 5. iOS Safari Quirks & Touch Gotchas

1. **Passive Event Listener Default:** Mobile Safari and Chrome default touch event listeners to `{ passive: true }`. Calling `event.preventDefault()` inside a passive listener will fail and throw a console warning. Rely on CSS `touch-action` instead of JS `event.preventDefault()`.
2. **Text Highlight Spills:** On iOS, dragging a finger across text triggers callout menus unless `-webkit-user-select: none` is declared on the gesture target or container.
3. **Palm Rejection & `pointercancel`:** Hardware multi-touch screens frequently fire `pointercancel` when a palm touches the screen margin or when an OS gesture (e.g., bottom bar home swipe on iPhone) takes precedence. Always treat `pointercancel` as an immediate reset signal.
