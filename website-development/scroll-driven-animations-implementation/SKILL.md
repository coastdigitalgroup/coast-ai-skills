---
name: scroll-driven-animations-implementation
description:
  Implement and debug performant, scroll-linked animations using native CSS
  scroll-timeline and view-timeline for progress bars, parallax, and sticky
  transitions.
---

# Scroll-Driven Animations Implementation

## Purpose

The Scroll-Driven Animations Implementation skill provides a technical protocol
for creating high-performance animations that are linked directly to the
scroll position of a container or the visibility of an element within the
viewport. It replaces heavy JavaScript-based scroll listeners with native CSS
capabilities that run on the browser's compositor thread, minimizing jank
and improving Interaction to Next Paint (INP).

## Use Cases

- **Progress Indicators:** Reading progress bars at the top of an article that
  fill as the user scrolls.
- **Scroll-Linked Parallax:** Background images or decorative elements that
  move at different speeds relative to the scroll.
- **Header Transitions:** A header that shrinks, changes color, or adds a
  shadow as the user scrolls away from the top of the page.
- **View-Linked Reveals:** Elements that fade in, scale, or slide into place
  only as they become visible in the viewport.
- **Image Scrubbing:** Playing a sequence of images or a video-like animation
  controlled by the scroll offset.

## When NOT to Use

- **Entrance-Only Animations:** If an animation only needs to trigger once
  when an element enters the viewport (and not "scrub" with the scroll), use
  `scroll-reveal-implementation` with Intersection Observer.
- **Complex Logic-Dependent Motion:** If the animation path depends on
  dynamic external data or complex conditional logic that CSS cannot handle.
- **Legacy Browser Support:** If the project must support browsers older than
  2023 (e.g., Safari < 17, Chrome < 115) without a JavaScript-based polyfill.

## Inputs

1. **Target Element:** The DOM element to be animated.
2. **Scroll Container:** The element whose scroll position drives the
   animation (usually `root` or a scrollable `div`).
3. **Animation Timeline:** Choice between `scroll-timeline` (container-based)
   or `view-timeline` (element-visibility-based).
4. **Animation Range:** The specific scroll range (e.g., `entry`, `exit`,
   `cover`) where the animation should occur.

## Outputs

1. **Named or Anonymous Timelines:** CSS defining `scroll-timeline` or
   `view-timeline`.
2. **Animation Linking:** Use of `animation-timeline` to connect keyframes to
   scroll progress.
3. **Range Configuration:** CSS `animation-range` to fine-tune the start and
   end of the motion.
4. **Progressive Enhancement:** Fallback logic for non-supporting browsers.

## Workflow

### 1. Define the Keyframes

Create standard CSS `@keyframes`. Instead of thinking in "seconds," think in
"percentages" of the scroll progress (0% is start of range, 100% is end).

```css
@keyframes progress-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### 2. Establish the Timeline

- **Scroll Timeline (Container-based):** Link to the scroll position of a
  container.
  ```css
  .progress-bar {
    animation-timeline: scroll(root block); /* Anonymous timeline */
  }
  ```
- **View Timeline (Visibility-based):** Link to when the element enters/exits
  the viewport.
  ```css
  .reveal-item {
    view-timeline-name: --item-reveal;
    view-timeline-axis: block;
  }
  ```

### 3. Link the Animation

Apply the animation to the element and set `animation-timeline`. Use
`animation-duration: auto` or a dummy value (as the duration is now scroll-based).

```css
.reveal-item {
  animation-name: fade-in;
  animation-timeline: --item-reveal;
  animation-fill-mode: both;
}
```

### 4. Configure the Animation Range

Define exactly when the animation starts and ends using `animation-range`.
Common values: `entry 0%`, `cover 50%`, `exit 100%`.

```css
.reveal-item {
  animation-range: entry 10% entry 90%; /* Starts when 10% visible, ends at 90% */
}
```

### 5. Add Progressive Enhancement

Since this API is modern, ensure the layout is functional even if the
animation doesn't run. Use `@supports` or a JS polyfill.

```css
@supports (animation-timeline: scroll()) {
  /* Scroll-driven styles here */
}
```

## Decision Rules

- **`scroll()` vs `view()`:** Use `scroll()` when the animation is driven by
  the *total* length of a container (e.g., a progress bar). Use `view()` when
  the animation is driven by an element's *visibility* within its container
  (e.g., a card fading in as it appears).
- **Anonymous vs Named Timelines:** Use anonymous timelines (`scroll(root)`)
  for simple, direct relationships. Use named timelines (`scroll-timeline-name`)
  when an animation on one element is driven by the scroll of a *different*
  distant element.
- **Axes:** Always specify `block` (vertical) or `inline` (horizontal) to avoid
  ambiguity, though `block` is the common default.

## Constraints

- **Main Thread vs Compositor:** Stick to "cheap" properties (`transform`,
  `opacity`) to ensure the animation remains smooth even if the main thread
  is busy.
- **Stacking Contexts:** Named timelines require the container and the
  animated element to be in a shared subtree where the name is visible.
- **Reduced Motion:** Always respect `prefers-reduced-motion` by disabling
  or simplifying scroll-driven motion.

## Non-Goals

- Implementing scroll-linked progress for complex SVG paths (requires specific
  path-length math).
- Managing server-side scroll position persistence.
- Handling 3D WebGL scenes driven by scroll (use Three.js instead).

## Common Failure Patterns

- **The "Invisible Animation":** Forgetting `animation-fill-mode: both`, causing
  the element to snap back to its initial state before or after the range.
- **Misaligned Ranges:** Using `cover` when `entry` was intended, causing the
  animation to finish before the user even sees the element.
- **Container Overflow Trap:** Attempting to use a scroll timeline on an
  element whose parent has `overflow: visible` (scroll timelines require a
  scrollable container).
- **Layout Loops:** Animating a property that changes the container's height
  (like `margin` or `padding`), which in turn changes the scroll timeline,
  creating a "vibrating" or "jittery" layout.
- **Ignoring Horizontal Scroll:** Forgetting that `scroll()` defaults to the
  nearest scroll container, which might be a horizontal gallery instead of
  the main page.

## Validation Criteria

- [ ] **Compositor Check:** Use the "Layers" and "Rendering" tabs in DevTools.
      The animation should NOT trigger "Paint" or "Layout" during scroll.
- [ ] **Range Audit:** Use the **Animations** tab in Chrome DevTools to
      inspect the scroll-timeline and verify the start/end offsets.
- [ ] **Reduced Motion Test:** Verify the animation is suppressed when
      `prefers-reduced-motion` is enabled.
- [ ] **Overflow Test:** Ensure the scroll container has `overflow: auto` or
      `scroll` and that the timeline is correctly bound.
- [ ] **Resize Test:** Verify that the animation range updates correctly
      when the viewport or container size changes.
