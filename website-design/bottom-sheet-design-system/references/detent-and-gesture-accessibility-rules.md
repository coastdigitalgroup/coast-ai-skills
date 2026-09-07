# Detent Configuration and Gesture Accessibility Rules

This reference guide details technical specifications for height detent thresholds, swipe drag gestures, dynamic safe area insets, and WCAG AA accessibility compliance for bottom sheet interfaces.

---

## 1. Detent Height Threshold Matrix

| Detent State | Viewport Target Height | Typical Height Calc | Target Use Cases |
| :--- | :--- | :--- | :--- |
| **Peek State** | 10% - 20% `dvh` | `min(120px, 15dvh)` | Persistent audio controls, live map route bar, floating cart summary. |
| **Half-Expanded** | 40% - 60% `dvh` | `50dvh` | Standard action sheets, simple variant pickers, share menus, quick filters. |
| **Full-Expanded** | 85% - 95% `dvh` | `calc(100dvh - env(safe-area-inset-top, 20px))` | Multi-step form entries, long filter lists, complex checkout tasks. |

---

## 2. Touch Target and Gesture Ergonomics

- **Drag Handle Affordance:**
  - Minimum hit target around handle bar: `44px` height by `100%` header width.
  - Handle pill dimensions: `36px` to `48px` wide, `4px` to `5px` tall, rounded corners (`999px`).
  - Minimum visual contrast ratio for handle bar: `3:1` against sheet surface background.
- **Swipe Velocity Snap Thresholds:**
  - **Flick Gesture:** Velocity $> 0.5 \text{ px/ms}$ down triggers immediate collapse/dismissal.
  - **Drag Distance Threshold:** Dragging downward $> 30\%$ of current sheet height snaps sheet down to lower detent or dismisses sheet.
  - **Drag Distance Release $< 30\%$:** Restores sheet to active upper detent height smoothly (spring physics or cubic-bezier transition).

---

## 3. Safe Area Inset and Visual Viewport Standards

Mobile web applications run across diverse operating system shell bars (iOS Home Indicator, Safari URL bar, Android gesture bars, and software keyboards).

```css
/* Padding calculation for sticky bottom action dock */
.sheet-footer {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

/* Dynamic height calculations to prevent top overflow */
.bottom-sheet {
  max-height: calc(100dvh - env(safe-area-inset-top, 16px));
}
```

### Software Keyboard Avoidance
When input controls inside a bottom sheet receive focus, the mobile software keyboard rises, reducing the available visual viewport by 40%–50%.
- Use dynamic viewport height units (`dvh`) or JavaScript `window.visualViewport` event listeners.
- Scroll focused `<input>` or `<textarea>` elements automatically into view above the keyboard frame.

---

## 4. WCAG 2.2 AA Accessibility Compliance Rules

### ARIA & Structural Semantics
1. **Container Role:** The sheet container MUST feature `role="dialog"` (or `role="alertdialog"` for destructive confirmation sheets).
2. **Modal Property:** Must include `aria-modal="true"` to signal assistive technology that background page content is inactive.
3. **Labelling:** Must be linked directly to its header title via `aria-labelledby="[header-id]"` or described via `aria-describedby="[description-id]"`.

### Focus Trapping & Navigation Sequence
1. **Initial Focus:** On open, shift focus automatically to the primary header title, close button, or first interactive field.
2. **Focus Trap:** Tab and Shift+Tab key presses must cycle strictly within focusable elements inside the bottom sheet.
3. **Inert Background:** Apply `inert` attribute to all background page content wrappers (`<main>`, `<header>`, `<footer>`) while sheet is open.
4. **Escape Key Handling:** Pressing the `Escape` key must dismiss the sheet immediately.
5. **Focus Restoration:** On close, focus MUST return directly to the trigger element that launched the bottom sheet.
