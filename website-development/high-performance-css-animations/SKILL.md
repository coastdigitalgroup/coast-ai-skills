---
name: high-performance-css-animations
description:
  Implement smooth, 60fps animations by leveraging the browser's rendering
  pipeline, focusing on compositor-only properties and avoiding layout thrashing.
---

# High-Performance CSS Animations

## Purpose

The High-Performance CSS Animations skill provides a technical framework for
creating smooth, 60fps web animations. It focuses on offloading animation work
to the browser's compositor thread, minimizing "jank" caused by layout
recalculations (reflows) and expensive repaints on the main thread.

## Use Cases

- Implementing fluid UI transitions (e.g., sliding menus, fading overlays).
- Creating complex micro-interactions that remain smooth on low-end mobile devices.
- Optimizing existing animations that cause frame drops or high CPU usage.
- Orchestrating multi-element entrance animations without impacting interaction latency.
- Managing "expensive" visual effects like blurs or shadows during motion.

## When NOT to Use

- **Static Content:** Do not add animations for the sake of movement if they
  distract from the user's task or content.
- **Data-Heavy Visualizations:** For thousands of moving parts, `<canvas>` or
  WebGL is preferred over individual DOM element animations.
- **Legacy Browser Requirements:** Some advanced properties (like `filter` or
  modern `will-change` optimizations) may require fallbacks for very old browsers.

## Inputs

1. **Target Elements:** The DOM elements to be animated.
2. **Animation Parameters:** Duration, easing function (e.g., `cubic-bezier`),
   and delay.
3. **Motion Design:** The desired visual change (e.g., "slide in from left",
   "scale up").
4. **Environment:** Device capability profile (high-end desktop vs. low-end mobile).

## Outputs

1. **Optimized CSS Rules:** Use of `transform`, `opacity`, and `filter` for motion.
2. **Keyframe Definitions:** Smooth sequences using percentage-based steps.
3. **Performance Hints:** Correct application of the `will-change` property.
4. **Accessibility Hooks:** Support for `prefers-reduced-motion`.

## Workflow

### 1. Identify the "Cheap" Properties

Only four CSS properties are consistently handled by the compositor thread
without triggering layout or paint:
- **`transform`:** (translate, scale, rotate, skew)
- **`opacity`:** (transparency)
- **`filter`:** (mostly optimized in modern browsers, but can be expensive)
- **`backdrop-filter`:** (expensive, use sparingly)

### 2. Avoid Layout-Triggering Properties

Never animate properties that change geometry or document flow:
- **Avoid:** `top`, `left`, `margin`, `padding`, `width`, `height`, `flex`, `grid-template`.
- **Alternative:** Use `transform: translate()` instead of `top`/`left`. Use `transform: scale()` instead of `width`/`height`.

### 3. Implement `will-change` (Judiciously)

Signal to the browser that an element will change to promote it to its own
compositor layer.
- **Rule:** Apply `will-change` to elements just before the animation starts or
  on elements that animate frequently.
- **Warning:** Do not apply to everything; excessive layers consume memory and
  can crash mobile browsers.

### 4. Optimize Easing and Timing

- Use `cubic-bezier()` for natural-feeling motion.
- Avoid `linear` unless for constant-speed loops.
- Keep durations short (200ms–500ms) for UI feedback to maintain perceived performance.

### 5. Support Reduced Motion

Respect users who have "Reduce Motion" enabled at the OS level.
```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation-iteration-count: 1 !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Decision Rules

- **Transform vs. Position:** Always use `transform: translate()` over `top`/`left`
  to avoid triggering the "Layout" phase.
- **Scale vs. Dimensions:** Use `transform: scale()` instead of changing
  `width` or `height`. Note: Scale affects children; if layout-relative sizing
  is needed, animate a wrapper or use a "FLIP" technique.
- **Hardware Acceleration:** Force layer promotion using `transform: translateZ(0)`
  or `will-change` if the browser isn't automatically optimizing.

## Constraints

- **Main Thread Contention:** Even "cheap" animations can stutter if the main
  thread is blocked by heavy JavaScript (see `interaction-performance-optimization`).
- **Memory Limits:** Each compositor layer (promoted via `will-change` or
  transforms) consumes GPU memory. Limit the number of concurrent layers.
- **Sub-pixel Rendering:** `transform` can sometimes cause text to appear
  blurry if not handled correctly.

## Non-Goals

- Complex character animation or 3D rigging (use specialized tools).
- SVG path-morphing (often requires JS and triggers heavy paint).
- JavaScript-driven animation libraries (e.g., GSAP), though the principles
  apply to their configuration.

## Common Failure Patterns

- **Animating Layout:** Moving a header by animating `height`, causing the
  entire page to recalculate positions 60 times per second.
- **Layer Explosion:** Applying `will-change: transform` to every item in a long
  list, causing memory exhaustion and browser crashes on mobile.
- **The "Stuttering" Start:** Not promoting an element to a layer until the
  animation starts, causing a "hiccup" during the first frame.
- **Ignoring User Preferences:** Forcing bouncy or fast animations on users
  with vestibular disorders or motion sensitivity.

## Validation Criteria

- [ ] **DevTools Rendering Audit:** Open "Rendering" tab in Chrome DevTools and
      enable "Paint flashing". The animated element should NOT flash green
      during motion.
- [ ] **Layer Inspection:** Use the "Layers" panel to confirm the element is on
      its own compositor layer during animation.
- [ ] **Performance Profile:** Record a trace in the Performance tab. Look for
      "Layout" or "Recalculate Style" tasks occurring within the animation frames.
- [ ] **Throttling Test:** Use "CPU Throttling" (4x or 6x slow down) to ensure
      the animation remains fluid on lower-end virtual hardware.
- [ ] **Accessibility Check:** Verify the animation is disabled or simplified
      when "Reduce Motion" is enabled.
