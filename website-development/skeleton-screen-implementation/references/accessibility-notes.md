# Skeleton Screen: Accessibility and Performance Notes

## Accessibility Guidelines

### 1. `aria-busy` Usage

The `aria-busy` attribute should be applied to the container of the content
being loaded.

- `aria-busy="true"`: Indicates the container is currently loading and its
  contents are unstable. Assistive technologies may wait until it is "false"
  before announcing changes.
- `aria-busy="false"`: Indicates the content is now ready for interaction.

### 2. Hiding Placeholders

Skeletons are purely visual decorative elements. They should be hidden from
screen readers to prevent them from announcing "blank" items or generic "divs".

- Use `aria-hidden="true"` on the individual skeleton components or the entire
  skeleton container.

### 3. Focus Management

If a user is navigating via keyboard while content is loading:

- Do not move focus into a skeleton element.
- If the skeleton replaces an interactive element (like a button), consider
  keeping a disabled version of the button or ensuring focus doesn't get trapped
  in a "void" when the skeleton is replaced.

### 4. Motion Sensitivity

Shimmer animations can be distracting or cause nausea for users with vestibular
disorders.

- Always use `@media (prefers-reduced-motion: reduce)` to disable the animation.
- Keep shimmer contrast low (delta between base and highlight should be subtle).

---

## Performance and Layout Stability (CLS)

### 1. Match the "Final Footprint"

The primary goal of a skeleton screen is to mitigate Cumulative Layout Shift
(CLS). This only works if the skeleton has the same dimensions as the final
content.

- **Images:** Use CSS `aspect-ratio` on the skeleton bone to match the image's
  ratio.
- **Text:** If you have a three-line paragraph, use three text-bones. A single
  large box will cause a shift if the final text wraps differently.
- **Lists:** Render the same number of skeleton items as you expect to receive
  (or a sensible default like 3-5).

### 2. High-Performance Animations

Animations should be "jank-free" and not interfere with the main thread.

- **DO:** Use `transform: translateX()` for the shimmer. This runs on the GPU
  (compositor thread).
- **AVOID:** Animating `left`, `margin`, `width`, or `background-position` as
  these trigger layout and paint cycles.

### 3. Perceived Speed

Research shows that skeletons with a "left-to-right" shimmer feel faster than
static placeholders or "pulsing" animations.

- Aim for a duration between 1.5s and 2.5s. Too fast feels frantic; too slow
  feels broken.

### 4. Avoiding the "Flicker"

If content loads extremely fast (e.g., from cache), showing a skeleton for 50ms
then swapping can create a jarring visual flicker.

- **Strategy:** Delay the appearance of the skeleton by 300-500ms using a CSS
  `transition-delay` or JavaScript `setTimeout`. If data arrives before the
  delay, the skeleton is never shown.
