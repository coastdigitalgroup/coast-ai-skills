---
name: touch-gesture-implementation
description:
  Implement, optimize, and debug custom touch and pointer gestures (swipe, pan,
  pinch-zoom, velocity flick) using Pointer Events, pointer capture, touch-action,
  and keyboard accessibility fallbacks.
---

# Touch Gesture Implementation

## Purpose

The Touch Gesture Implementation skill provides a technical protocol for building,
optimizing, and debugging custom pointer and multi-touch interactions on the web.
Naive touch handling frequently suffers from scroll interference, lost tracking when
fingers leave element bounds, main-thread jank, multi-touch race conditions, and
accessibility gaps for keyboard users. This skill establishes production-grade
patterns using the unified **Pointer Events API**, **Pointer Capture**, CSS
`touch-action`, instantaneous velocity calculation, directional axis locking,
and keyboard fallback mechanics to deliver smooth, leak-free, and accessible gestures.

## Use Cases

- **Swipeable Cards & Lists:** Building swipe-to-dismiss, swipe-to-reveal action buttons,
  or dismissible notifications on mobile touch devices.
- **Pinch-to-Zoom & Pan Viewers:** Implementing pan/zoom image viewers, canvas map
  navigators, or interactive document previews using multi-point touch tracking.
- **Carousel & Slider Dragging:** Creating custom horizontal content carousels or
  range sliders where horizontal gestures must take priority without blocking
  vertical page scrolling.
- **Flick & Velocity Momentum:** Detecting fast flick gestures (`px/ms`) to trigger
  snappy state transitions regardless of absolute travel distance.
- **Custom Drag & Drop Handles:** Dragging floating elements, canvas nodes, or tool window
  bars cleanly across viewport boundaries.

## When NOT to Use

- **Native CSS Scroll Snapping:** Standard horizontal image carousels or paged galleries
  where native `scroll-snap-type: x mandatory` achieves native momentum without custom JS
  (see `css-scroll-snap-implementation`).
- **Modal Background Scroll Locking:** Locking standard `<body>` scroll when opening a
  lightbox or modal dialog (see `body-scroll-lock-implementation`).
- **Standard Link & Button Clicking:** Standard clickable UI elements requiring no dragging,
  swiping, or pinch scaling.
- **Browser-Native Pinch Zoom:** Whole-page document pinch zooming where standard viewport
  metatag settings should be respected.

## Inputs

1. **Target Gesture Element:** The DOM element receiving touch/pointer interaction.
2. **Gesture Type:** Primary target gesture (`swipe-x`, `swipe-y`, `pan-2d`, `pinch-zoom`).
3. **Trigger Thresholds:** Minimum displacement distance (`px`) and velocity threshold
   (`px/ms`) to activate gesture completion.
4. **Axis Locking Rules:** Determination of whether vertical page scrolling should be
   permitted during horizontal gesture initiation.
5. **Keyboard Counterpart:** Keyboard triggers (Arrow keys, Escape, Enter, Space) mapped
   to identical UI actions.

## Outputs

1. **Declarative CSS `touch-action` Rules:** Optimized CSS preventing browser gesture
   conflicts on relevant axes.
2. **Pointer Event Controller:** Robust event listener binding covering `pointerdown`,
   `pointermove`, `pointerup`, and `pointercancel`.
3. **Pointer Capture Management:** Invocation of `setPointerCapture` and `releasePointerCapture`
   to guarantee uninterrupted gesture tracking.
4. **Gesture Metric State:** Real-time updates providing delta X/Y, angle, distance,
   instantaneous velocity, scale factor, and focal center coordinates.
5. **Accessible Control Surface:** Keyboard handlers and ARIA attribute synchronizations.

## Workflow

### 1. Configure CSS `touch-action` to Eliminate Browser Interference

Before writing JavaScript event listeners, declare CSS `touch-action` on the gesture target.
This informs the browser engine which gestures it may handle natively (e.g., vertical page
scrolling) and which gestures are surrendered to custom JavaScript tracking.

- For horizontal swipes (`swipe-x`): apply `touch-action: pan-y`. This allows native vertical page scrolling while delegating horizontal drag detection to JS.
- For 2D pan/zoom (`pan-2d` / `pinch-zoom`): apply `touch-action: none`. This blocks default viewport pan and pinch zoom on that element.
- For interactive controls (`button`): apply `touch-action: manipulation` to eliminate double-tap zoom delay while preserving scrolling.

```css
.swipeable-card {
  touch-action: pan-y; /* Vertical page scroll permitted; horizontal gestures intercepted */
  user-select: none;   /* Prevents unwanted text highlight during drag */
  will-change: transform;
}
```

### 2. Bind Unified Pointer Events & Capture the Pointer

Attach `pointerdown`, `pointermove`, `pointerup`, and `pointercancel` listeners. On `pointerdown`, call `element.setPointerCapture(event.pointerId)` to ensure all subsequent pointer events remain routed to the target element even if the cursor or finger slides outside its physical DOM bounds.

```javascript
class TouchGestureController {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.activePointers = new Map();
    this.controller = new AbortController();
    this.initEvents();
  }

  initEvents() {
    const { signal } = this.controller;

    this.element.addEventListener('pointerdown', (e) => this.handlePointerDown(e), { signal });
    this.element.addEventListener('pointermove', (e) => this.handlePointerMove(e), { signal });
    this.element.addEventListener('pointerup', (e) => this.handlePointerUp(e), { signal });
    this.element.addEventListener('pointercancel', (e) => this.handlePointerCancel(e), { signal });
  }

  handlePointerDown(e) {
    // Only process primary mouse click or touch inputs
    if (e.button !== undefined && e.button !== 0) return;

    this.element.setPointerCapture(e.pointerId);
    this.activePointers.set(e.pointerId, {
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      timestamp: performance.now()
    });
  }
}
```

### 3. Implement Directional Axis Locking

For single-axis gestures (e.g. horizontal card swipe), track initial movement before committing to the custom gesture. If the user moves vertically first beyond a lock threshold (e.g. 8px), release pointer capture and surrender control to native page scrolling. If movement is predominantly horizontal, commit to the gesture.

```javascript
handlePointerMove(e) {
  if (!this.activePointers.has(e.pointerId)) return;

  const pointer = this.activePointers.get(e.pointerId);
  const deltaX = e.clientX - pointer.startX;
  const deltaY = e.clientY - pointer.startY;

  if (!this.isAxisLocked) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 8 && absY < 8) return; // Threshold pending

    if (absY > absX) {
      // User intends to scroll vertically; cancel custom gesture
      this.element.releasePointerCapture(e.pointerId);
      this.activePointers.delete(e.pointerId);
      return;
    }

    this.isAxisLocked = true;
  }

  // Update gesture transform...
}
```

### 4. Calculate Instantaneous Velocity & Momentum Flick Detection

Do not rely solely on displacement distance to trigger actions. Track timestamped pointer positions to calculate instantaneous velocity (`px/ms`). A short distance travel combined with high velocity should trigger gesture completion (a "flick").

$$\text{velocity}_x = \frac{x_{\text{current}} - x_{\text{previous}}}{t_{\text{current}} - t_{\text{previous}}}$$

```javascript
updateVelocity(e, pointer) {
  const now = performance.now();
  const dt = now - pointer.lastTimestamp;
  if (dt <= 0) return;

  const dx = e.clientX - pointer.lastX;
  pointer.velocityX = dx / dt; // px/ms

  pointer.lastX = e.clientX;
  pointer.lastTimestamp = now;
}

handlePointerUp(e) {
  if (!this.activePointers.has(e.pointerId)) return;

  const pointer = this.activePointers.get(e.pointerId);
  const totalDeltaX = e.clientX - pointer.startX;
  const velocityX = pointer.velocityX || 0;

  // Trigger if total displacement > 120px OR velocity > 0.5 px/ms
  const isFlick = Math.abs(velocityX) > 0.5;
  const isDistanceMet = Math.abs(totalDeltaX) > 120;

  if (isFlick || isDistanceMet) {
    const direction = totalDeltaX > 0 || velocityX > 0 ? 'right' : 'left';
    this.completeGesture(direction);
  } else {
    this.resetGesture();
  }

  this.cleanupPointer(e.pointerId);
}
```

### 5. Multi-Touch Tracking for Pinch-Zoom and Focal Point Calculation

When two pointers are active (`activePointers.size === 2`), calculate the Euclidean distance between pointers to derive scale, and calculate the midpoint coordinate to preserve focal point zoom positioning.

$$\text{distance} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
$$\text{focalX} = \frac{x_1 + x_2}{2}, \quad \text{focalY} = \frac{y_1 + y_2}{2}$$

```javascript
calculatePinchMetrics() {
  const [p1, p2] = Array.from(this.activePointers.values());
  const distance = Math.hypot(p2.currentX - p1.currentX, p2.currentY - p1.currentY);
  const focalX = (p1.currentX + p2.currentX) / 2;
  const focalY = (p1.currentY + p2.currentY) / 2;

  return { distance, focalX, focalY };
}
```

### 6. Handle `pointercancel` & Teardown Cleanly

Browsers fire `pointercancel` when hardware gestures (e.g. OS task switcher, palm rejection, system swipe) preempt the webpage. Always handle `pointercancel` by restoring element state and releasing pointer capture.

```javascript
handlePointerCancel(e) {
  this.resetGesture();
  this.cleanupPointer(e.pointerId);
}

destroy() {
  this.controller.abort(); // Cleans up all event listeners atomically
  this.activePointers.clear();
}
```

### 7. Provide Keyboard Accessibility Controls

Touch gestures must not lock out keyboard and screen reader users. Always bind equivalent keyboard shortcuts (e.g. `ArrowLeft`/`ArrowRight` for swipeable cards, `+`/`-` or `PageUp`/`PageDown` for pan/zoom).

```javascript
element.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    this.completeGesture('right');
  } else if (e.key === 'ArrowLeft') {
    this.completeGesture('left');
  }
}, { signal: this.controller.signal });
```

---

## Decision Rules

| Gesture Goal | CSS `touch-action` | Primary Strategy | Fallback / Recovery |
| :--- | :--- | :--- | :--- |
| **Horizontal Swipe (Card/Dismiss)** | `touch-action: pan-y` | Axis-locking + Velocity Flick | Snap back if threshold not met |
| **Vertical Drag / Bottom Sheet** | `touch-action: pan-x` | Axis-locking + Velocity Flick | Snap back on `pointercancel` |
| **2D Pan & Canvas Drag** | `touch-action: none` | Single-pointer transform translation | Reset view position |
| **Pinch-to-Zoom Image Viewer** | `touch-action: none` | Two-pointer Euclidean distance + Focal Point | Clamp min/max scale limits (0.5x - 4x) |
| **Interactive Tap Controls** | `touch-action: manipulation` | Native click handler | Native tap response |

---

## Constraints

- **Pointer Capture Support:** Always invoke `element.hasPointerCapture(pointerId)` before attempting `releasePointerCapture(pointerId)` to avoid `DOMException` errors on uncaptured pointers.
- **Passive Listener Conflicts:** Do NOT set `{ passive: true }` on `pointermove` if you plan to call `event.preventDefault()`. Conversely, prefer CSS `touch-action` over `event.preventDefault()` whenever possible as modern browsers handle `touch-action` on the compositor thread.
- **Text Selection Junk:** Always set `user-select: none` (`-webkit-user-select: none`) on gesture targets to prevent text highlight highlights during touch drags.
- **Reduced Motion Compliance:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')`. Disable spring or inertia transition animations for users who request reduced motion, instantly applying final positions instead.

---

## Non-Goals

- Replacing native OS scrolling for entire web pages.
- Building complex 3D WebGL camera controls (use dedicated math libraries for 3D matrix math).
- Managing multi-page SPA routing transitions.

---

## Common Failure Patterns

- **The "Stuck Drag" (Missing `pointercancel`):** Failing to handle `pointercancel` or missing `setPointerCapture`. When the user slides off screen or an incoming notification appears, the element gets stuck in a dragging visual state.
- **Vertical Scroll Blockage:** Setting `touch-action: none` on a wide horizontal container, preventing mobile users from scrolling down the page when placing their thumb on the container.
- **Ignoring Velocity (The Distance Fallback Trap):** Requiring users to drag a card >200px to dismiss it, making snappy flick gestures fail and feel unresponsive.
- **Multi-Touch Race Conditions:** Storing pointer position as a single global object instead of mapping active pointers by `e.pointerId`, causing erratic jumping when a second finger touches the screen.
- **Keyboard Exclusion:** Creating gesture-only swipe interfaces without ARIA role bindings or keyboard equivalents, leaving screen reader and keyboard users unable to operate the feature.

---

## Validation Steps

- [ ] **Mobile Scroll Coexistence Test:** Touch a `touch-action: pan-y` element on a physical touch screen (or Chrome DevTools touch emulation) and drag vertically. Confirm the document scrolls smoothly without jank or getting blocked.
- [ ] **Pointer Off-Screen Capture Test:** Initiate a drag on the element, move finger/mouse entirely off the browser window, and release. Confirm that `pointerup` fires cleanly and state resets or completes without sticking.
- [ ] **Velocity Flick Test:** Perform a rapid short flick gesture (<50px travel, fast speed). Confirm the gesture completes successfully based on velocity calculation.
- [ ] **Multi-Touch Pinch Scale Test:** Place two fingers on a pinch target, adjust spacing, and verify smooth zoom scaling around the calculated focal center point without viewport layout shift.
- [ ] **Keyboard Equivalence Audit:** Focus the target element using `Tab` key and press `ArrowLeft`/`ArrowRight`. Verify the exact same UI state transition occurs smoothly.
