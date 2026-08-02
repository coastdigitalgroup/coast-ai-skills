# Reference: Touch Gestures & Keyboard Rules for Lightboxes

This reference guide establishes the exact physical and behavioral specifications for touch and keyboard interactions within the Image Gallery and Lightbox System, satisfying WCAG AA standards.

---

## 1. Accessible Keyboard Matrix

The lightbox must capture, contain, and react to physical keyboard inputs instantly. It acts as a standard modal dialog according to WAI-ARIA practices.

| Keyboard Event | Target Area | Intended Action / UI Response |
| :--- | :--- | :--- |
| **`Tab`** | Any focused control | Moves focus to the next interactive control (loops back to the first interactive item when on the last). |
| **`Shift` + `Tab`** | Any focused control | Moves focus to the previous interactive control (loops back to the last interactive item when on the first). |
| **`Escape`** | Anywhere in overlay | Immediately closes the open Lightbox overlay. Focus *must* restore to the triggering gallery button. |
| **`ArrowRight` / `ArrowDown`**| Anywhere in overlay | Activates the **Next** slide or image. Updates live announcers. |
| **`ArrowLeft` / `ArrowUp`** | Anywhere in overlay | Activates the **Previous** slide or image. Updates live announcers. |
| **`Space` / `Enter`** | Active control (e.g. thumb / arrow) | Triggers the focused button action (navigation, select, or close). |

### Keyboard Focus Trap Rules (Algorithm Design)
1. Maintain an ordered list of all focusable elements within the open lightbox dialog container:
   `const focusables = lightbox.querySelectorAll('button, [tabindex="0"], a')`
2. Cache the first and last element of this array:
   `const firstFocusable = focusables[0]`
   `const lastFocusable = focusables[focusables.length - 1]`
3. Listen for the `keydown` event on the open lightbox:
   - If the key is `Tab` without `Shift` and the active element is `lastFocusable`, override default behavior (`e.preventDefault()`) and focus `firstFocusable`.
   - If the key is `Tab` with `Shift` and the active element is `firstFocusable`, override default behavior (`e.preventDefault()`) and focus `lastFocusable`.

---

## 2. Touch Gesture Heuristics (Mobile Devices)

On touch-sensitive viewports, standard pointer icons are hidden and touch triggers take precedence. Implement the following gesture thresholds.

```
       Swipe Dismiss (Y-axis)
              ^
              |      Swipe Prev
              |       (X-axis)
      <---------------+--------------->
      Swipe Next      |
       (X-axis)       |
                      v
             Swipe Dismiss (Y-axis)
```

### X-Axis Swipe (Horizontal Navigation)
- **Action:** Navigating slides (Next / Previous).
- **Triggers:** Pointer down (`touchstart`) followed by horizontal delta.
- **Math/Threshold:**
  - Let `deltaX = currentTouch.clientX - startTouch.clientX`.
  - Let `deltaY = currentTouch.clientY - startTouch.clientY`.
  - **Condition:** Math.abs(deltaX) > Math.abs(deltaY) AND Math.abs(deltaX) > **50px** (or 15% of the viewport width).
  - **Execution:**
    - If `deltaX > 0`: Trigger **Previous** image slide.
    - If `deltaX < 0`: Trigger **Next** image slide.

### Y-Axis Swipe (Vertical Dismissal)
- **Action:** Drag-to-dismiss. Swiping the active image up or down closes the lightbox, matching native app patterns.
- **Triggers:** Pointer down (`touchstart`) followed by vertical delta.
- **Math/Threshold:**
  - Let `deltaY = currentTouch.clientY - startTouch.clientY`.
  - Let `deltaX = currentTouch.clientX - startTouch.clientX`.
  - **Condition:** Math.abs(deltaY) > Math.abs(deltaX) AND Math.abs(deltaY) > **100px** (or 20% of the viewport height).
  - **Execution:** Trigger **Close** action and fade out lightbox.
  - **Visual Feedback:** Apply `translateY(deltaY)` to the active image in real-time to show the image dragging along with the finger before popping back or closing.

---

## 3. WCAG AA Accessibility Checklist

To confirm compliance with WCAG 2.1 and 2.2 AA success criteria:

- [ ] **Focus Visible (WCAG 2.4.7):** All keyboard-navigable controls (Close button, Prev/Next buttons, thumbnail buttons) must have a high-contrast focus ring. Avoid using outline offsets that blend into dark backgrounds.
- [ ] **Target Size Minimum (WCAG 2.2 - 2.5.8):** All primary touch actions (Close, Prev/Next controls, thumbnail buttons) must have a hit target area of at least **24x24 CSS pixels**, or **44x44 CSS pixels** (WCAG 2.1 AAA / mobile best practices) where space allows.
- [ ] **Focus Not Obscured (WCAG 2.2 - 2.4.11):** The open lightbox container has the highest z-index (`z-index: 1000+`) and covers the entire page, ensuring no background focus outline peaks out.
- [ ] **Accessibility Alternative (Alt) Text (WCAG 1.1.1):** All active images in the lightbox must inherit or copy the descriptive alternative text (`alt="Description..."`) of their corresponding gallery thumbnail. Mark loader spinners with `aria-hidden="true"`.
- [ ] **Accessible Names (WCAG 4.1.2):** Standard navigation icons (e.g., SVG arrows or crosses) must be wrapped inside buttons with explicit, descriptive screen-reader names:
  - `<button aria-label="Next slide">`
  - `<button aria-label="Close Lightbox">`
