# Pointer Gestures and iOS Quirks Reference

Building a fluid, mobile-first sliding bottom sheet on the web requires deep understanding of pointer events, layout rendering, and mobile browser engine quirks (specifically Apple WebKit/iOS Safari). This document outlines key technical references for frontend engineers.

---

## 1. Unified Inputs with Pointer Events

Historically, developers had to maintain duplicate listener trees to support mouse and touch drags:
- Mouse listeners: `mousedown`, `mousemove`, `mouseup`
- Touch listeners: `touchstart`, `touchmove`, `touchend`

This approach is highly prone to synchronization bugs and double-firing issues (since touch devices fire simulated mouse events for backward compatibility). Modern evergreen browsers support **Pointer Events**, which unify mouse, physical touch, and pen/stylus inputs.

### Why Pointer Capture is Critical
When a user swipes or drags their finger rapidly down a screen, they often slide off the tiny visual drag bar.
- Without pointer capture, once the pointer leaves the bounds of the drag bar, the `pointermove` and `pointerup` events stop firing, and the sheet gets permanently "stuck" in a half-dragged state.
- Calling `element.setPointerCapture(pointerId)` on `pointerdown` instructs the browser to redirect *all* subsequent pointer movements to that element, regardless of where the finger coordinates wander.
- Calling `element.releasePointerCapture(pointerId)` on `pointerup` cleanups this redirection.

```javascript
dragHandle.addEventListener('pointerdown', (e) => {
  // Direct all move/up actions to dragHandle
  dragHandle.setPointerCapture(e.pointerId);
});
```

---

## 2. Eliminating Browser Interference (`touch-action`)

By default, mobile browsers intercept touch movements to perform native zoom or scroll behaviors. If you try to drag an element vertically on iOS Safari or Chrome, the browser might assume you are trying to scroll the page or trigger a pull-to-refresh action, which cancels your custom JavaScript gesture tracking.

To prevent this conflict, you **must** use the CSS `touch-action` property.

```css
.sheet-drag-handle {
  /* Do not let the browser scroll or pan this element natively */
  touch-action: none;
}
```

Declaring `touch-action: none` tells the browser that your JavaScript code is entirely responsible for handling all touch gestures on this element, freeing up smooth tracking for `pointermove`.

---

## 3. Resolving the iOS Safari Background Scroll Leak

Setting `overflow: hidden` on the `<body>` element is the standard way to lock page scrolling on desktop. However, **iOS Safari (WebKit) completely ignores `overflow: hidden` on the body** when touch gestures are performed. If a user swipes on the backdrop overlay, the background document scrolls or elastic-bounces underneath the sheet.

To resolve this iOS scroll leak:

### Option A: The Touch Interception Protocol
Prevent the default behavior of `touchmove` events on the backdrop overlay. Note that modern browsers register touch event listeners as passive by default to boost scroll performance. You must explicitly specify `{ passive: false }`.

```javascript
overlay.addEventListener('touchmove', (e) => {
  // block scroll leak on iOS Safari
  if (e.cancelable) e.preventDefault();
}, { passive: false });
```

### Option B: The Position-Fixed Hard Lock
Instantly lock the page layout when the sheet opens by freezing the body's coordinates.

```javascript
// On Open:
const currentScrollY = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${currentScrollY}px`;
document.body.style.width = '100%';

// On Close:
document.body.style.position = '';
document.body.style.top = '';
document.body.style.width = '';
window.scrollTo(0, currentScrollY);
```

This approach is highly reliable across all iOS Safari releases and doesn't require complex coordinate tracking inside dynamic containers.

---

## 4. Modern Viewport Sizing (`dvh` and safe-area insets)

### The `vh` vs. `dvh` Trap
On mobile devices, native browser UI overlays (like the Safari address bar or navigation bars) collapse and expand dynamically as the user interacts with the page.
- Sizing a bottom sheet panel using standard CSS `max-height: 90vh` is problematic because `100vh` represents the viewport height *including* the hidden address bar. When the address bar is visible, the bottom 60px of your bottom sheet is clipped off-screen, hiding critical action buttons or forms.
- Modern CSS introduces **Dynamic Viewport Height** (`dvh`), which automatically scales to represent the exact, active visible viewport area. Sizing sheets with `max-height: 90dvh` guarantees the panel remains perfectly framed.

### Safe Area Insets (The Notch)
Modern devices with screen notches or physical home indicators (e.g. iPhone 15, iPad Pro) require bottom sheets to respect system Safe Area margins. Without accounting for safe areas, action buttons sitting at the absolute bottom of a sheet are covered by the system home bar.

Use CSS variables to apply padding bottom adjustments cleanly:

```css
.sheet-footer {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
```

---

## 5. Mobile Virtual Keyboard Collisions

When a user taps an input element inside a bottom sheet, the mobile browser launches its software virtual keyboard.
- In many cases, the browser automatically resizes the page, but in some configurations, the virtual keyboard simply floats *over* the bottom sheet, completely obscuring the text field.
- Utilizing the standard **Visual Viewport API** allows developers to track virtual keyboard heights in real time and offset the bottom sheet accordingly.

```javascript
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    const keyboardHeight = window.innerHeight - window.visualViewport.height;
    if (keyboardHeight > 0) {
      // Shift the sheet panel upwards to keep input visible
      sheet.style.bottom = `${keyboardHeight}px`;
    } else {
      sheet.style.bottom = '0px';
    }
  });
}
```
