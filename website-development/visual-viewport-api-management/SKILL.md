---
name: visual-viewport-api-management
description:
  Architect, implement, and debug responsive UI layouts that adapt dynamically to mobile virtual soft-keyboards, pinch-zoom levels, and layout viewport vs visual viewport shifts using window.visualViewport.
---

# Visual Viewport API Management

## Purpose

The Visual Viewport API Management skill provides a production-grade protocol, JavaScript controller architecture, CSS variable synchronization system, and cross-platform debugging framework for handling mobile visual viewport shifts.

It solves critical mobile web UX breakages caused by software virtual keyboards (iOS Safari, Android Chrome), pinch-to-zoom offsets, and viewport chrome shifts. Without visual viewport management, fixed bottom toolbars, floating chat inputs, sticky action bars, and modal forms get obscured behind the soft keyboard, flicker during scroll, or detach from the bottom of the screen.

---

## Use Cases

- **Mobile Floating Action / Chat Docking:** Docking input bars, send buttons, or persistent toolbars directly above the soft keyboard when an input receives focus on mobile devices.
- **Full-Screen Mobile Modals & Sheet Dialogs:** Keeping modal submit buttons and input fields inside the visible screen area without keyboard coverage or layout clipping.
- **Pinch-Zoom UI Adaptation:** Repositioning pinned UI overlays (heads-up displays, fixed controls, tooltips) when users pinch-zoom in on a document.
- **Virtual Keyboard Height & Offset Calculation:** Computing exact keyboard height in pixels dynamically across iOS Safari and Android Chrome to set offset CSS variables.
- **Interactive Viewport Resizing Alignment:** Standardizing viewport resize behavior across browsers using `interactive-widget` meta tag settings combined with JS fallback detection.

---

## When NOT to Use

- **Standard Document Scrolling:** Static article content or standard form pages where standard page scrolling natively brings inputs into view.
- **Static Desktop Layouts:** Layouts designed exclusively for desktop environments where `window.visualViewport` equals `window.innerWidth/innerHeight` and scale is 1.
- **CSS Safe-Area Hardware Insets Only:** Static hardware notches and iOS home indicators that are fixed hardware boundaries (use `env(safe-area-inset-*)` via `mobile-viewport-implementation`).
- **CSS-Only Viewport Units:** Basic full-screen layout containers where dynamic units like `svh` or `dvh` suffice without soft-keyboard offset tracking.

---

## Inputs

1. **Target Fixed/Absolute Elements:** Selectors or element references for components requiring keyboard-relative positioning (e.g., `.chat-input-bar`, `.modal-footer`).
2. **Viewport Meta Configuration:** Existing `<meta name="viewport">` string (specifically `viewport-fit` and `interactive-widget` values).
3. **Focus Container & Active Form Controls:** Input, textarea, or contenteditable elements that trigger the virtual soft keyboard.
4. **Device & OS Profile:** OS-specific rendering behavior (iOS Safari overlay model vs Android Chrome layout resize model).

---

## Outputs

1. **`VisualViewportController` Instance:** Lightweight event-driven JS controller listening to `window.visualViewport` `resize` and `scroll` events.
2. **Synchronized CSS Custom Properties:** `--visual-viewport-height`, `--visual-viewport-top`, `--keyboard-offset`, `--visual-viewport-scale` bound to target containers.
3. **Smooth Soft-Keyboard Docking:** Pinned UI elements that track keyboard appearance/disappearance seamlessly without jank or scroll bleed.

---

## Workflow

### 1. Configure Viewport Meta Tag and Widget Resizing Mode
Modern mobile browsers support the `interactive-widget` key within the viewport meta tag to dictate how virtual keyboards alter the viewport:

- `resizes-content`: Browser resizes the layout viewport when the keyboard opens (default on Android Chrome).
- `overlays-content`: Browser overlays the keyboard on top of the layout viewport without changing layout viewport height (default on iOS Safari).
- `resizes-visual`: Browser resizes only the visual viewport (leaving layout viewport unchanged).

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-visual">
```

### 2. Instantiate Visual Viewport Event Listeners
Listen to both `resize` and `scroll` events on `window.visualViewport` (not `window`).

```javascript
if ('visualViewport' in window) {
  const vv = window.visualViewport;

  const updateViewportState = () => {
    const layoutHeight = window.innerHeight;
    const visualHeight = vv.height;
    const visualTop = vv.offsetTop;
    const scale = vv.scale;

    // Estimate virtual keyboard height when input is focused
    const keyboardHeight = Math.max(0, layoutHeight - visualHeight - visualTop);

    document.documentElement.style.setProperty('--vv-height', `${visualHeight}px`);
    document.documentElement.style.setProperty('--vv-top', `${visualTop}px`);
    document.documentElement.style.setProperty('--vv-scale', `${scale}`);
    document.documentElement.style.setProperty('--keyboard-offset', `${keyboardHeight}px`);
  };

  vv.addEventListener('resize', updateViewportState);
  vv.addEventListener('scroll', updateViewportState);
  updateViewportState();
}
```

### 3. Position Fixed Docked UI Using CSS Custom Properties
Apply CSS logical rules to pin elements to the visual viewport rather than the static layout bottom:

```css
.docked-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(calc(-1 * var(--keyboard-offset, 0px)));
  transition: transform 120ms cubic-bezier(0, 0, 0.2, 1);
  will-change: transform;
}
```

### 4. Handle iOS Safari Focus Scroll Shifts
On iOS Safari, focusing an input inside a scrollable container forces the document body or window to scroll, causing `vv.offsetTop` to become non-zero.

- Clamp document scroll when a modal or pinned input bar is focused.
- Adjust `transform` or `bottom` calculation using `vv.offsetTop` to keep the docked element aligned flush with the soft keyboard edge.

```javascript
const getKeyboardOffset = () => {
  if (!window.visualViewport) return 0;
  const vv = window.visualViewport;
  // Account for layout viewport vs visual viewport top offset on iOS
  const windowHeight = window.innerHeight;
  const keyboardHeight = windowHeight - vv.height - vv.offsetTop;
  return Math.max(0, keyboardHeight);
};
```

### 5. Prevent Scroll Bleed & Touch Stutter
When the keyboard is visible, dragging on non-scrollable background areas can cause layout viewport shifting.

- Bind `touchmove` preventDefault guards on modal backdrops or non-scrollable wrappers when `--keyboard-offset` > 0.
- Ensure inputs use `scrollIntoView({ block: 'nearest', behavior: 'smooth' })` when focused if needed.

---

## Decision Rules

### Viewport Adapter Strategy Matrix

| Environment / Requirement | Strategy Choice | CSS Property Pattern | JS Event Listener Required? |
| :--- | :--- | :--- | :--- |
| **Android Chrome (default)** | `interactive-widget=resizes-content` | `position: fixed; bottom: 0;` | No (browser resizes layout natively). |
| **iOS Safari / Mixed Mobile** | `window.visualViewport` Controller | `transform: translateY(calc(-1 * var(--keyboard-offset)))` | Yes (`resize` + `scroll` on `visualViewport`). |
| **Pinch-Zoom Docked Overlay** | Visual Viewport Scale & Offset | `transform: scale(calc(1 / var(--vv-scale))) translate(...)` | Yes (listen to scale change). |
| **Full-Screen Mobile Dialog** | Fixed Visual Height Container | `height: var(--vv-height, 100vh); top: var(--vv-top, 0px);` | Yes. |

---

## Constraints

- **Browser API Support:** `window.visualViewport` is supported in all modern browsers (Chrome 61+, Safari 13+, Firefox 91+). Provide feature detection check (`'visualViewport' in window`).
- **iOS Safari Keystroke Delay:** iOS Safari fires `visualViewport` `resize` events with a slight delay relative to the keyboard animation curve. Use smooth CSS transitions (`100ms - 150ms`) on transformed elements to suppress jumpiness.
- **Pinch-Zoom Distortions:** When `vv.scale > 1`, `fixed` elements scale relative to the visual frame. You must invert scale (`scale(1 / vv.scale)`) if fixed elements should maintain constant physical screen dimensions.
- **Performance:** Avoid expensive layout recalculations (reading `offsetHeight`, `getBoundingClientRect`) inside raw `visualViewport` scroll listeners. Request animation frames (`requestAnimationFrame`) or CSS custom variable updates.

---

## Non-Goals

- Managing static safe-area notch insets (`env(safe-area-inset-top)` / `bottom`) without dynamic virtual keyboard movement.
- Virtual key mapping or custom on-screen JS canvas keyboards.
- Native mobile app webview bridges (iOS WKWebView / Android WebView native keyboard events).

---

## Common Failure Patterns

- **Using `window.onresize` for Keyboard Detection:** `window.onresize` does NOT fire on iOS Safari when the virtual keyboard appears because iOS overlays the keyboard on top of the layout viewport.
- **`position: fixed` Bottom Detachment:** Assuming `bottom: 0` will automatically stick above the iOS keyboard. Without `visualViewport` offsets, `bottom: 0` stays attached to the bottom of the layout viewport *behind* the keyboard.
- **Ignoring `visualViewport.offsetTop`:** Calculating keyboard height strictly as `innerHeight - visualViewport.height`. If the page scrolled up when focusing an input, `offsetTop` is positive, resulting in inaccurate keyboard height calculations.
- **Janky Animation Loops:** Updating layout DOM properties (`height`, `margin`) on every `visualViewport` scroll event instead of setting high-performance transform variables (`translateY`).
- **Missing Touch Guards:** Allowing background page scrolling while the soft keyboard is open, causing the active input to scroll off-screen while the keyboard remains open.

---

## Validation Steps

### 1. Visual Viewport API Feature & Setup Check
- [ ] Confirm `window.visualViewport` feature check exists before attaching listeners.
- [ ] Confirm `<meta name="viewport">` contains `viewport-fit=cover` and optional `interactive-widget=resizes-visual`.
- [ ] Verify `--keyboard-offset` and `--vv-height` CSS variables update dynamically in DOM inspector when virtual keyboard opens.

### 2. Device & Simulator Testing (iOS Safari & Android Chrome)
- [ ] **iOS Safari:** Tap an input field at the bottom of the screen. Verify the docked toolbar transitions smoothly to sit directly flush above the keyboard top edge.
- [ ] **Android Chrome:** Verify keyboard open/close triggers state updates cleanly without double-resizing or layout stutter.
- [ ] **Dismiss Test:** Tap outside or dismiss the keyboard. Verify the toolbar returns to `bottom: 0` without lingering whitespace.

### 3. Pinch-Zoom & Focus Scroll Audit
- [ ] Pinch-zoom into the page (scale > 1). Verify pinned UI controls maintain legibility and correct position relative to the visual screen frame.
- [ ] Focus input inside a scrollable container. Ensure input remains visible and focused state is not cut off by the keyboard.
