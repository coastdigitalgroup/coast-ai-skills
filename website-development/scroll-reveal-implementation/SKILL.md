---
name: scroll-reveal-implementation
description:
  Implement and debug performant, accessible entrance animations triggered by
  scrolling using Intersection Observer and CSS transitions.
---

# Scroll-Reveal Implementation

## Purpose

The Scroll-Reveal Implementation skill provides a technical protocol for
triggering entrance animations as elements enter the viewport. It focuses on
using the performant Intersection Observer API instead of heavy scroll
listeners, ensuring accessibility for users with motion sensitivities, and
providing robust fallbacks for users with JavaScript disabled.

## Use Cases

- Implementing "fade-in" or "slide-in" animations for sections as a user
  scrolls down a landing page.
- Creating staggered entrance effects for grids of cards or features.
- Triggering data-loading or heavy asset initialization only when an element
  is about to be seen.
- Auditing existing scroll-animation libraries for performance bottlenecks
  or accessibility violations.

## When NOT to Use

- **Above-the-Fold Content:** Primary hero content should be visible
  immediately without waiting for a scroll trigger or animation delay.
- **Critical Functional Elements:** Buttons, navigation, or forms that the
  user needs to interact with should not be hidden behind entrance
  animations that might fail or feel sluggish.
- **Data-Heavy Dashboards:** Excessive animation in productivity tools can
  increase cognitive load and slow down the user's workflow.

## Inputs

1. **Target Elements:** The DOM elements to be animated (e.g., `.reveal-on-scroll`).
2. **Animation Styles:** CSS definitions for the "hidden" (initial) and
   "visible" (target) states.
3. **Thresholds:** How much of the element should be visible before the
   animation triggers (e.g., 10%, 50%).
4. **Root Margin:** Offsets for the viewport trigger zone (e.g., "0px 0px -100px 0px").

## Outputs

1. **Intersection Observer Script:** A performant JS utility to manage
   entrance states.
2. **Accessible CSS:** Transitions that respect `prefers-reduced-motion` and
   provide JS-disabled fallbacks.
3. **State Management Logic:** Use of classes (e.g., `.is-revealed`) to
   trigger animations.

## Workflow

### 1. Define the Initial and Target States (CSS)

- Use a base class to set the initial state (e.g., `opacity: 0; transform: translateY(20px);`).
- Use a modifier class (e.g., `.is-revealed`) to define the target state
  (e.g., `opacity: 1; transform: translateY(0);`).
- Apply `transition` properties to the base class.

### 2. Implement the Observer (JavaScript)

- Create an `IntersectionObserver` instance.
- Define the `callback` to add the `.is-revealed` class when an element
  intersects the viewport.
- **Important:** Once an element is revealed, call `observer.unobserve(element)`
  to save resources, unless "reveal-on-every-scroll" is specifically required.

### 3. Configure Thresholds and Margins

- Set a `threshold` (e.g., `0.1` for 10%) to ensure the element is
  meaningfully in view before animating.
- Use `rootMargin` (e.g., `0px 0px -50px 0px`) to trigger the animation
  slightly before or after the element enters the physical viewport.

### 4. Ensure Accessibility

- **Motion Sensitivity:** Wrap your transition properties in a
  `@media (prefers-reduced-motion: no-preference)` block.
- **Focus Management:** Ensure that hidden elements are not focusable
  (if they contain links or buttons) until they are revealed, or use
  `opacity` and `visibility` carefully.

### 5. Progressive Enhancement

- Add a `.js-enabled` class to the `<html>` or `<body>` via script.
- Only apply the initial "hidden" styles if `.js-enabled` is present. This
  ensures content is visible to users with JavaScript disabled.

## Decision Rules

- **CSS vs. JS Animation:** Always use CSS transitions or `@keyframes` for the
  actual movement. Use JS only to toggle the state (the class).
- **Single vs. Multiple Reveal:** Use `unobserve()` after the first reveal
  for 90% of marketing/landing pages. Only re-trigger animations if the
  repetitive motion serves a clear functional or brand purpose.
- **Staggering:** For grids, use CSS `transition-delay` with inline styles or
  nth-child selectors to create a sequential entrance effect without
  complex JS timers.

## Constraints

- **Performance:** Never use `window.addEventListener('scroll', ...)` for
  triggering entrance animations.
- **Z-Index:** Be aware that `transform` and `opacity` create new stacking
  contexts.
- **Reflows:** Avoid animating properties that cause layout shifts (like
  `height`, `margin`, or `top`). Stick to `transform` and `opacity`.

## Non-Goals

- Building complex parallax scrolling effects (where position is tied to
  scroll percentage).
- Handling scroll-linked progress bars.
- Managing 3D scroll-driven scenes (e.g., Three.js integration).

## Common Failure Patterns

- **The "Blank Page" Bug:** Hiding content with `opacity: 0` via CSS but
  forgetting to handle cases where JavaScript fails to load, leaving the
  user with an empty screen.
- **Layout Thrashing:** Animating `top` or `left` instead of `translate`,
  causing the browser to re-calculate layout on every frame.
- **Triggering Too Early/Late:** Using a threshold of `1.0` (100%) for a large
  element that never fully fits in the viewport, so it never reveals.
- **Ignoring Reduced Motion:** Forcing large, sweeping animations on users
  who have requested reduced motion, which can cause physical nausea.

## Validation Criteria

- [ ] **JavaScript-Disabled Test:** Disable JS in browser settings and verify
      all content is immediately visible.
- [ ] **Reduced Motion Test:** Enable "Reduce Motion" in system settings and
      verify animations are disabled or simplified to an instant reveal.
- [ ] **Performance Audit:** Ensure no "Long Tasks" are triggered by the
      Intersection Observer in the DevTools Performance panel.
- [ ] **Threshold Test:** Verify that elements only animate once they are
      meaningfully visible (no "flashing" at the very bottom of the screen).
- [ ] **Device Test:** Test on mobile to ensure touch-scrolling remains
      smooth and the `rootMargin` accounts for mobile address bars.
