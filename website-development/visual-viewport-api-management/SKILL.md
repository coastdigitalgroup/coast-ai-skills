---
name: visual-viewport-api-management
description:
  Manage mobile virtual soft keyboards, pinch-zoom levels, and dynamic viewport dimensions using window.visualViewport, CSS custom variables, and viewport-fit layout techniques.
---

# Visual Viewport API Management

## Purpose

The Visual Viewport API Management skill provides a production-grade framework, JavaScript controller architecture, CSS variable synchronization system, and cross-platform debugging protocol for handling mobile soft keyboard displays, pinch-zoom events, and visual viewport offsets. On mobile devices (iOS Safari and Android Chrome), opening an on-screen keyboard or pinch-zooming alters the *visual viewport* while leaving the layout viewport (`100vh`, `100dvh`) unchanged or behaving inconsistently across OS vendors. This causes sticky bottom bars, fixed input docks, full-height chat interfaces, modal overlays, and action toolbars to obscure content, jump off-screen, or get hidden beneath the virtual keyboard. This skill establishes deterministic CSS variable updates, resize/scroll listeners, and layout math using `window.visualViewport` to guarantee rock-solid positioning across mobile devices.

## Use Cases

- **Mobile Chat & Messaging Interfaces:** Anchoring fixed bottom message input bars directly above the soft keyboard on iOS Safari and Android Chrome without awkward page jumping or content occlusion.
- **Mobile Web App Bottom Sheets & Modals:** Ensuring slide-up dialogs, drawers, and action sheets stay fully visible and scrollable within the remaining visible screen space when form fields inside them receive focus.
- **Sticky Toolbars & Action Docks:** Keeping bulk action bars, checkout CTA docks, or canvas formatting controls pinned strictly to the visible bottom of the physical screen during keyboard toggles or pinch-zoom interactions.
- **Pinch-Zoom Adaptive Layouts:** Adapting fixed overlay controls, navigation headers, or floating widgets so they scale or reflow gracefully when a user pinch-zooms into a webpage.
- **Full-Height App Viewports (`100dvh` Fallbacks):** Handling cross-browser inconsistencies where `100dvh` or `100vh` fails on iOS Safari when the virtual keyboard opens or dynamic browser chrome collapses.

## When NOT to Use

- **Standard Scrolling Desktop Pages:** Standard desktop layout web pages that rely on native browser scrollbars and have no fixed overlays or mobile soft keyboard positioning requirements.
- **Pure CSS `interactive-widget` Supported Scenarios:** Simple Android-only web forms where `meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"` natively solves the layout requirements and iOS Safari support is not needed.
- **Simple Static Forms:** Basic vertical single-column login or registration forms without fixed-position elements, where natural browser page scrolling onto the active input field is sufficient.

## Inputs

1. **Target Container / Fixed Element:** The DOM element (e.g., `.chat-input-dock`, `.bottom-sheet`, `.floating-cta`) that must lock to the visual viewport boundary.
2. **Viewport Events:** `resize` and `scroll` events dispatched by `window.visualViewport`.
3. **Layout Mode:** The desired alignment strategy:
   - *Offset Mode:* Adjusting `bottom` or `transform: translateY()` via CSS custom properties based on `window.height - visualViewport.height - visualViewport.offsetTop`.
   - *Height Mode:* Restricting a full-screen app container to `--visual-viewport-height` to prevent page body overflow.
4. **Viewport Meta Configuration:** Viewport tags (`viewport-fit=cover`, `interactive-widget`).

## Outputs

1. **Real-Time CSS Custom Properties:** Synchronized CSS variables attached to `:root` or container element:
   - `--visual-viewport-height`: Current visible height in px.
   - `--visual-viewport-width`: Current visible width in px.
   - `--visual-viewport-offset-top`: Top offset relative to layout viewport in px.
   - `--visual-viewport-offset-left`: Left offset relative to layout viewport in px.
   - `--keyboard-height`: Computed virtual keyboard height in px.
   - `--visual-viewport-scale`: Pinch-zoom scale factor (1.0 = unzoomed).
2. **Keyboard State Data Attributes:** Data attributes (`data-keyboard-open="true|false"`, `data-pinch-zoomed="true|false"`) applied to `<html>` or container for declarative styling.
3. **Clean Event Teardown:** An `AbortController`-backed lifecycle listener ensuring zero memory leaks upon SPA route teardown.

## Workflow

### 1. Viewport Concept & Geometry Calculation

Understand the distinction between the **Layout Viewport** (`window.innerHeight`, `document.documentElement.clientHeight`, `100vh`/`100dvh`) and the **Visual Viewport** (`window.visualViewport`).

```text
+------------------------------------+  <- Layout Viewport Top (0px)
| Top Fixed Header                   |
+------------------------------------+  <- Visual Viewport Top (offsetTop)
|                                    |  |
| Visible Scrollable Content Area    |  | visualViewport.height
|                                    |  |
+------------------------------------+  <- Visual Viewport Bottom
| [Input Dock]                       |
+------------------------------------+
| Virtual Soft Keyboard              |  | keyboardHeight =
| (iOS / Android Chrome)             |  | window.innerHeight - visualViewport.height
+------------------------------------+  <- Layout Viewport Bottom
```

Mathematical formulas:
- `keyboardHeight = Math.max(0, window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop)`
- `scale = window.visualViewport.scale`

### 2. Configure Viewport Meta Tag

Set the initial HTML viewport meta tag to support edge-to-edge layout and configure `interactive-widget` behavior for supported modern browsers (Android Chrome 108+):

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-visual">
```

*Note:* iOS Safari ignores `interactive-widget`, making JavaScript `visualViewport` synchronization required for cross-platform reliability.

### 3. Initialize Visual Viewport JavaScript Controller

Create a controller that attaches passive `resize` and `scroll` listeners to `window.visualViewport`, batches updates via `requestAnimationFrame`, and writes CSS custom properties.

```javascript
class VisualViewportController {
  constructor(options = {}) {
    this.target = options.target || document.documentElement;
    this.controller = new AbortController();
    this.rafId = null;
    this.isKeyboardOpen = false;

    this.init();
  }

  init() {
    if (!window.visualViewport) {
      console.warn('Visual Viewport API not supported in this browser.');
      return;
    }

    const { signal } = this.controller;

    // Attach listeners to visualViewport object, not window
    window.visualViewport.addEventListener('resize', () => this.scheduleUpdate(), { passive: true, signal });
    window.visualViewport.addEventListener('scroll', () => this.scheduleUpdate(), { passive: true, signal });
    window.addEventListener('orientationchange', () => this.scheduleUpdate(), { passive: true, signal });

    // Initial measurement
    this.update();
  }

  scheduleUpdate() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.update();
    });
  }

  update() {
    const vv = window.visualViewport;
    const layoutHeight = window.innerHeight;

    // Compute virtual keyboard height and offset
    const keyboardHeight = Math.max(0, layoutHeight - vv.height - vv.offsetTop);
    const isKeyboardVisible = keyboardHeight > 100; // Threshold to prevent false triggers from bar collapses
    const isPinchZoomed = vv.scale > 1.05;

    // Write CSS variables
    this.target.style.setProperty('--vv-height', `${vv.height}px`);
    this.target.style.setProperty('--vv-width', `${vv.width}px`);
    this.target.style.setProperty('--vv-offset-top', `${vv.offsetTop}px`);
    this.target.style.setProperty('--vv-offset-left', `${vv.offsetLeft}px`);
    this.target.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
    this.target.style.setProperty('--vv-scale', `${vv.scale}`);

    // Update data attributes for CSS hooks
    if (this.isKeyboardOpen !== isKeyboardVisible) {
      this.isKeyboardOpen = isKeyboardVisible;
      this.target.setAttribute('data-keyboard-open', isKeyboardVisible ? 'true' : 'false');
    }
    this.target.setAttribute('data-pinch-zoomed', isPinchZoomed ? 'true' : 'false');
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.controller.abort();
  }
}
```

### 4. CSS Variable Integration Patterns

#### Pattern A: Fixed Bottom Dock (Chat Input / CTA Bar)

Pin an input dock cleanly above the soft keyboard:

```css
.fixed-bottom-dock {
  position: fixed;
  left: 0;
  right: 0;
  /* Use env(safe-area-inset-bottom) when keyboard is closed; use keyboard offset when open */
  bottom: 0;
  transform: translateY(calc(-1 * var(--keyboard-height, 0px)));
  transition: transform 0.1s ease-out; /* Smooth keyboard pop animation */
  z-index: 100;
}

/* Include safe area padding when keyboard is closed */
:root[data-keyboard-open="false"] .fixed-bottom-dock {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

#### Pattern B: Full-Viewport App Container (Chat / Dashboard)

Lock a flex/grid container to the exact visual viewport height so content scrolls within available space:

```css
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Fallback for legacy engines */
  height: var(--vv-height, 100dvh);
  overflow: hidden;
}

.chat-scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

## Decision Rules

- **Target Element Styling Strategy:**
  - **Use `transform: translateY()`:** For fixed bottom toolbars and input docks. Translating via GPU composite layer avoids forcing layout recalculations during rapid keyboard transitions.
  - **Use `height: var(--vv-height)`:** For full-screen web apps (chat, photo editors, spreadsheet grids) where the root layout container must shrink when the soft keyboard appears.
- **Handling iOS Safari vs. Android Chrome:**
  - **iOS Safari:** Always requires JavaScript `visualViewport` listener intervention. iOS Safari pushes the visual viewport up without shrinking `window.innerHeight`.
  - **Android Chrome:** Shrinks `window.innerHeight` in `resizes-content` mode, but `visualViewport` API handles both iOS and Android consistently across mode settings.
- **Focus Scroll Behavior (`scrollIntoView`):**
  - When an `<input>` or `<textarea>` gains focus on iOS, the browser may involuntarily scroll the document. Call `element.scrollIntoView({ block: 'nearest' })` inside a `setTimeout` or `focus` handler to prevent layout jumps.

## Constraints

- **Main Thread Throttling:** `visualViewport` fires `scroll` and `resize` events rapidly during keyboard animations and pinch-zoom gestures. Always batch CSS variable writes with `requestAnimationFrame`.
- **Keyboard Height False Positives:** Dynamic browser URL bar collapsing/expanding can alter `vv.height` by 40px–80px. Always apply a threshold (e.g., `keyboardHeight > 100px`) before flagging `data-keyboard-open="true"`.
- **Safe Area Insets (`env(safe-area-inset-bottom)`):** When the virtual keyboard is open, the soft keyboard covers the hardware home indicator notch area; safe area bottom padding should drop to `0px` or be controlled explicitly.
- **iOS Rubber-Banding:** iOS Safari body rubber-banding when scrolling past bounds alters `vv.offsetTop`. Set `overscroll-behavior-y: none` on fixed overlays or root containers to prevent unintended shifting.

## Non-Goals

- Native mobile keyboard customization (altering OS keyboard colors, key layouts, or native hardware haptics).
- Handling hardware keyboard attach/detach events on desktop/tablet hybrid devices beyond reporting viewport measurements.
- Replacing CSS media queries for standard device width breakpoints.

## Common Failure Patterns

- **Using `100vh` or `100dvh` for Soft-Keyboard-Sensitive Fixed Docks:** `100vh` ignores soft keyboards completely; `100dvh` updates asynchronously or inconsistently across OS webviews, causing input bars to be swallowed behind the keyboard on iOS.
- **Listening to `window.onresize` Instead of `window.visualViewport`:** On iOS Safari, `window.resize` does NOT fire when the soft keyboard opens; only `window.visualViewport` fires `resize` and `scroll` events.
- **Unbounded Event Listeners:** Attaching raw, unthrottled event listeners directly to `window.visualViewport` that execute heavy DOM reads/writes on every pixel of movement, causing severe touch jank during pinch-zoom.
- **Ignoring Visual Viewport `offsetTop`:** Calculating keyboard height as `window.innerHeight - visualViewport.height` without subtracting `visualViewport.offsetTop`, leading to inaccurate positioning when the page is scrolled down on iOS.

## Validation Steps

- [ ] **Soft Keyboard Open Test:** Focus an input in a mobile browser (iOS Safari and Android Chrome) and confirm the fixed dock stays visible immediately above the virtual keyboard.
- [ ] **Soft Keyboard Dismiss Test:** Blur the input or tap the keyboard hide button and confirm the fixed dock smoothly returns to the bottom of the viewport with correct safe-area padding.
- [ ] **Pinch-Zoom Test:** Pinch-zoom into the page on a touch device and verify fixed overlay controls adjust or transform without drifting out of view or clipping content.
- [ ] **Memory Teardown Verification:** Call `.destroy()` on the controller and inspect `getEventListeners(window.visualViewport)` in browser DevTools to confirm all event listeners are cleanly removed.
- [ ] **Performance Audit:** Perform a CPU throttle test during pinch-zoom and keyboard toggle, verifying frame rates remain at 60fps without forced reflow layout thrashing.
