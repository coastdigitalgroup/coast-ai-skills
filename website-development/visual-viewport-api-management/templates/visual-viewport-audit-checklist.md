# Visual Viewport & Mobile Keyboard Audit Checklist

## 1. Viewport Meta Configuration
- [ ] Viewport meta tag includes `width=device-width, initial-scale=1.0, viewport-fit=cover`.
- [ ] `interactive-widget=resizes-visual` (or `resizes-content` / `overlays-content` as appropriate) is declared for Android Chrome 108+ support.
- [ ] Inputs have `font-size: 16px` (or larger) to prevent iOS Safari from automatically zooming into the field upon focus.

## 2. Visual Viewport Event Handling
- [ ] Listeners are attached directly to `window.visualViewport` (`resize` and `scroll`), NOT solely `window.onresize`.
- [ ] Event listeners use `AbortController` signal or explicit removal hooks for clean SPA unmounting.
- [ ] Event updates are throttled via `requestAnimationFrame` to avoid layout thrashing during gestures.
- [ ] A minimum height delta threshold (e.g., >100px) is applied before classifying the keyboard as open to avoid false positives from browser address bar collapses.

## 3. Keyboard Offset & Layout Positioning
- [ ] Keyboard height calculation accounts for `visualViewport.offsetTop`:
  `keyboardHeight = Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop)`.
- [ ] Fixed bottom toolbars/docks use `transform: translateY(calc(-1 * var(--keyboard-height)))` or CSS visual viewport offsets instead of `position: fixed; bottom: 0` without JS adjustment.
- [ ] Safe area bottom padding (`env(safe-area-inset-bottom)`) is enabled when the soft keyboard is closed and reset to `0px` or handled cleanly when open.
- [ ] Full-screen app viewports use `height: var(--vv-height)` or `height: 100dvh` with visual viewport fallback to prevent vertical page overflow when typing.

## 4. Cross-Device & Platform Testing
- [ ] **iOS Safari (iPhone):** Input focus brings keyboard up without hiding the active field or sticky CTA dock.
- [ ] **iOS Safari (iPhone):** Keyboard dismissal smoothly returns dock to page bottom with safe-area home indicator padding intact.
- [ ] **Android Chrome:** Soft keyboard display resizes/adjusts layout cleanly without double scrollbars.
- [ ] **Pinch-Zoom:** Pinching to zoom in on mobile touch devices maintains proper layout contrast and fixed element visibility.
- [ ] **Orientation Change:** Rotating device from portrait to landscape recalculates visual viewport dimensions without leaving ghost blank spaces.
