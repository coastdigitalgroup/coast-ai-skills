# Visual Viewport Heuristics & Browser Quirks

This reference details rendering engine behaviors, viewport specification differences, and platform quirks across iOS Safari and Android Chrome when working with the Visual Viewport API (`window.visualViewport`).

---

## 1. Layout Viewport vs. Visual Viewport

The browser maintains two distinct viewports:

1. **Layout Viewport:** The standard coordinate system used by CSS for positioning `position: absolute` elements and calculating media query breakpoints (`window.innerWidth`, `window.innerHeight`).
2. **Visual Viewport:** The portion of the screen currently visible to the user (`window.visualViewport.width`, `window.visualViewport.height`).

When a virtual soft keyboard appears or the user pinch-zooms into a page:
- The **Visual Viewport** shrinks or shifts (`offsetTop` / `offsetLeft` become non-zero).
- The **Layout Viewport** behavior depends on the browser engine and `interactive-widget` viewport meta tag settings.

---

## 2. Platform Rendering Models (iOS Safari vs. Android Chrome)

### iOS Safari (WebKit Overlay Model)
- **Default Behavior:** WebKit treats the software keyboard as an **overlay** placed on top of the layout viewport. `window.innerHeight` does NOT shrink when the keyboard appears.
- **Scroll Shift Quirk:** When an input near the bottom of the page is focused, WebKit shifts the document body or layout viewport upward to keep the active input visible. This makes `window.visualViewport.offsetTop` positive (e.g., `45px`).
- **Keyboard Height Calculation Formula:**
  $$\text{Keyboard Height} = \text{window.innerHeight} - \text{visualViewport.height} - \text{visualViewport.offsetTop}$$
- **Event Timing:** iOS Safari fires `visualViewport` `resize` events slightly out-of-sync with the keyboard spring animation. Adding a 100ms–150ms CSS transform transition smooths out visual jumpiness.

### Android Chrome (Blink Resize Model)
- **Default Behavior:** Blink historically resizes the layout viewport (`window.innerHeight` decreases) when the software keyboard opens.
- **`interactive-widget` Support:** Chrome 108+ introduced explicit control via the meta viewport tag:
  - `interactive-widget=resizes-content` (Default on Android Chrome): Resizes layout viewport; `position: fixed; bottom: 0;` natively docks above keyboard.
  - `interactive-widget=overlays-content`: Overlays keyboard like iOS Safari without resizing layout viewport.
  - `interactive-widget=resizes-visual`: Resizes visual viewport while leaving layout viewport untouched.

---

## 3. Pinch-Zoom Dynamics & Scale Handling

When users pinch-zoom:
- `window.visualViewport.scale` increases above `1.0`.
- Elements styled with `position: fixed` scale up relative to the visual screen frame.

### Inverse Scale Correction
To maintain a constant physical pixel size for heads-up displays or floating UI toolbars during pinch-zoom, apply inverse scale in CSS:

```css
.hud-overlay {
  transform: scale(calc(1 / var(--vv-scale, 1))) translate(...) ;
  transform-origin: bottom right;
}
```

---

## 4. Input Auto-Zoom Prevention

If a form `<input>` or `<textarea>` has a font size smaller than `16px` (e.g., `14px`), iOS Safari automatically zooms the visual viewport (`scale > 1.0`) upon field focus. This breaks fixed docking positioning and forces users to manually pinch-zoom out.

**Rule:** Always enforce `font-size: 16px` (or `font-size: 1rem` where root is 16px) on mobile form controls.

```css
@media (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}
```

---

## 5. Performance & Event Throttling Heuristics

1. **Avoid Layout Thrashing:** Do not read `element.offsetHeight` or `element.getBoundingClientRect()` inside `visualViewport` `scroll` or `resize` callbacks.
2. **Use GPU Composition:** Bind `--keyboard-offset` to `transform: translateY(...)` on composite layers (`will-change: transform`).
3. **Batch via RAF:** Always wrap updates in `requestAnimationFrame()` to sync variable assignments with browser render ticks.
