# Touch Target & Keyboard Rules: Image Comparison Slider

This reference outlines the exact touch physics, gesture mechanics, keyboard event handlers, and screen reader announcements required to achieve WCAG AA compliance with the **Image Comparison Slider System**.

---

## 1. Touch Target Geometry Rules (WCAG 2.2 SC 2.5.8)

On mobile and touch-screen devices, precision dragging with a finger is significantly harder than with a mouse. To prevent user frustration, accidental clicks, or missing the trigger, the slider component must observe these strict coordinate layout rules:

*   **Interactive Target Area:** The interactive touch zone of the center grab thumb must be at least **`44px` in width and `44px` in height** (preferring `48px` to `54px` on screen sizes `< 480px`).
*   **The Pseudo-Element Hack:** If the visual design calls for a sleek, thin divider line or a tiny grab circle (e.g., `24px` diameter), do not shrink the physical touch target. Expand the hit-area using a transparent pseudo-element (`::after` or `::before`):
    ```css
    .slider-grab-thumb {
      position: absolute;
      width: 24px; /* Visual Width */
      height: 24px; /* Visual Height */
    }
    .slider-grab-thumb::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;  /* Interactive Hit-Width */
      height: 48px; /* Interactive Hit-Height */
      border-radius: 50%;
      background: transparent; /* Remains completely invisible to the eye */
    }
    ```
*   **Grip Margin Buffer:** Ensure a boundary margin of at least `24px` is maintained on the far left (0%) and far right (100%) limits of the track. This prevents users from sliding the thumb fully off-screen or losing the ability to grip the controller when it rests against the viewport boundaries.

---

## 2. Keyboard Control Event Mapping

The slider component must be fully operable without a mouse or touch gestures. This is typically achieved by linking the visual coordinates to an underlying `<input type="range">` control. The element must capture and map keyboard events exactly as follows:

| Standard Key | Slider Interaction Action | Recommended Step Percentage |
| :--- | :--- | :--- |
| `ArrowLeft` / `ArrowDown` | Decrements position value (slides further to the left, revealing more of the "After" state). | -1% (or -5% on long tracks) |
| `ArrowRight` / `ArrowUp` | Increments position value (slides further to the right, revealing more of the "Before" state). | +1% (or +5% on long tracks) |
| `PageDown` | Coarse-step decrement (slides left quickly). | -10% |
| `PageUp` | Coarse-step increment (slides right quickly). | +10% |
| `Home` | Moves directly to the extreme left boundary. | Set to 0% exposure (Full "After" reveal) |
| `End` | Moves directly to the extreme right boundary. | Set to 100% exposure (Full "Before" reveal) |

---

## 3. ARIA & Screen Reader Announcement Guidelines

Since an image comparison slider is a highly visual element, screen reader users need programmatic context to understand what is being compared and what the current slider value signifies.

*   **Primary Controller Tagging:** Always apply `role="slider"` (built-in if utilizing `<input type="range">`) to the interactive element.
*   **Accessible Naming:** Use `aria-label` or `aria-labelledby` to describe the contents of the comparison:
    ```html
    <input type="range" aria-label="Before and after colorization comparison of historical archive image" ... />
    ```
*   **Active State Feedback:** Ensure screen readers announce the numeric percentage dynamically as the slider moves:
    *   `aria-valuemin="0"`
    *   `aria-valuemax="100"`
    *   `aria-valuenow="[current_percentage_here]"` (update this attribute dynamically on every slider shift).
*   **Descriptive Image Alt Text:** Both the background and overlaid images must contain distinct, descriptive `alt` tags that explain their respective states:
    *   **Before Image Alt:** `alt="Historical portrait from 1924, showing extensive scratch damage and sepia fading."`
    *   **After Image Alt:** `alt="Historically restored and color-graded portrait, with scratches repaired and natural skin tones added."`

---

## 4. Layout Preservation and Performance Rules

*   **Layout Shift Prevention (CLS Rule):** Never leave the image container's height unset. Always apply `aspect-ratio: [width] / [height]` directly on the outer container. This forces the rendering engine to allocate the exact box container on screen layout before the images begin downloading, ensuring zero Cumulative Layout Shift (CLS).
*   **Synchronized Scalability:** Both the before and after images must utilize the exact same CSS sizing attributes:
    ```css
    .comparison-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    ```
    If one image scales differently or has a different crop, the alignment will shift when sliding, creating a distracting "ghosting" or "shaking" effect that ruins the comparison.
*   **Motion Sensitive Interactions:** When implementing automated sliding sequences (e.g., an onboarding hover loop that moves the slider automatically back and forth to show it is interactive), always wrap the keyframes or javascript loops in a reduced motion check:
    ```css
    @media (prefers-reduced-motion: reduce) {
      .slider-automatic-loop {
        animation: none; /* Disable automatic shifting */
      }
    }
    ```
