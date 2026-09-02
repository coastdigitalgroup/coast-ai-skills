---
name: waapi-animation-implementation
description:
  Build, control, and optimize imperative client-side animations using the
  Web Animations API (WAAPI), handling FLIP layout transitions, playback control,
  and state commitment without external dependencies.
---

# Web Animations API (WAAPI) Implementation

## Purpose

The WAAPI Animation Implementation skill provides a technical protocol for building, controlling, and optimizing high-performance JavaScript-driven animations using the browser's native **Web Animations API (WAAPI)** (`Element.animate()`, `Animation` objects, `KeyframeEffect`, and `AnimationTimeline`).

While CSS transitions and `@keyframes` excel at simple hover or toggle effects, and third-party libraries (like GSAP or Framer Motion) add bundle bloat, WAAPI provides **native, hardware-accelerated, programmatic control** directly in JavaScript. This skill details how to manage keyframes, pause/reverse/scrub timelines, synchronize multi-element sequences, implement FLIP (First, Last, Invert, Play) layout transitions, and avoid memory leaks using `commitStyles()` and `persist()`.

---

## Use Cases

- **FLIP Layout Transitions:** Smoothly animating reordering, filtering, or resizing of items in CSS Grids, masonry feeds, or lists when DOM positions change.
- **Dynamic Interactive Timelines:** Interactive UI widgets requiring precise runtime control over playback speed, reversing, seeking, or scrubbing (e.g., audio/video overlays, custom interactive charts, scrubber controls).
- **Chained & Orchestrated Sequences:** Coordinating complex entrance/exit sequences across multiple elements using `Animation.finished` promises without nesting `transitionend` or `animationend` event listeners.
- **Dynamic Physics/Coordinate Motion:** Animating elements to or from dynamically calculated runtime pixel coordinates (e.g., drag-and-drop snapping, floating action button expansion to modal origin).
- **Zero-Dependency Lightweight UI:** Delivering smooth 60fps programmatic animations in performance-critical sites without importing external animation libraries.

---

## When NOT to Use

- **Simple Hover / Active / Focus States:** Use declarative CSS transitions or `@keyframes` for static, pre-defined CSS state changes.
- **Scroll-Driven Animations:** Use native CSS `animation-timeline: scroll()` or `view()` for pure scroll-linked animations (see `scroll-driven-animations-implementation`).
- **Heavy 3D or Particle Graphics:** For thousands of moving particles or complex 3D scenes, use HTML5 Canvas, WebGL, or WebGPU rather than individual DOM elements.
- **View Transitions Between Pages:** Use the native View Transitions API for full SPA route transitions or document navigation (see `view-transitions-implementation`).

---

## Inputs

1. **Target Element(s):** The DOM `HTMLElement` or list of elements to animate.
2. **Keyframe Definitions:** An array of keyframe objects or a keyframe mapping object (`[{ transform: 'translateY(0)' }, { transform: 'translateY(100px)' }]`).
3. **Timing Options:** An object or duration specifying `duration`, `easing`, `delay`, `iterations`, `direction`, `fill`, and `composite`.
4. **Runtime Triggers / State:** Dynamic coordinates from `getBoundingClientRect()`, user gestures, or state changes requiring animation playback adjustments.

---

## Outputs

1. **Active `Animation` Controller Object:** Reference to the active WAAPI `Animation` instance providing `.play()`, `.pause()`, `.reverse()`, `.finish()`, `.cancel()`, and `.currentTime`.
2. **Cleaned-Up DOM State:** Properly committed inline CSS styles via `animation.commitStyles()` and disposed animation instances to prevent style tree leaks.
3. **Promise Lifecycle Chains:** Asynchronous workflows driven by `animation.finished` and `animation.ready` promises.
4. **Accessible Motion Fallbacks:** Built-in safeguards respecting `prefers-reduced-motion`.

---

## Workflow

### 1. Evaluate Motion Strategy (FLIP vs. Direct Keyframes)
Determine whether the animation is a fixed property transition or a **FLIP (First, Last, Invert, Play)** layout transition:
- **Direct Keyframe Animation:** Used when start and end states are known beforehand or calculated dynamically.
- **FLIP Transition:**
  1. **First:** Capture initial positions using `element.getBoundingClientRect()`.
  2. **Last:** Apply state/DOM changes and capture new positions.
  3. **Invert:** Calculate the difference (`dx = first.left - last.left`, `dy = first.top - last.top`, `sx = first.width / last.width`, `sy = first.height / last.height`) and set the element back to its initial visual spot using `transform`.
  4. **Play:** Animate `transform` back to `translate(0, 0) scale(1, 1)` using `element.animate()`.

### 2. Formulate Compositor-Only Keyframes
Construct keyframes using properties handled by the GPU compositor thread:
- Use `transform` (translate, scale, rotate) and `opacity`.
- Specify explicit `offset` values (0 to 1) if keyframe spacing is non-linear.
- Use composite modes (`replace`, `add`, or `accumulate`) when layering animations.

### 3. Check for `prefers-reduced-motion`
Always inspect user accessibility preferences before running motion effects:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const duration = prefersReducedMotion ? 0 : 300;
```

### 4. Execute `element.animate()` and Track the Instance
Invoke WAAPI on the element and store the returned `Animation` instance:
```javascript
const animation = element.animate(keyframes, {
  duration,
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
  fill: 'forwards'
});
```

### 5. Handle Lifecycle Promises and State Commitment
When using `fill: 'forwards'`, WAAPI holds the animation in an active style composite layer, causing **memory leaks and style recalculation overhead** if kept indefinitely.
- Await `animation.finished`.
- Call `animation.commitStyles()` to apply the final animation frame to the element's inline CSS `style` attribute.
- Call `animation.cancel()` to clear the animation from the WAAPI compositor stack.

```javascript
await animation.finished;
animation.commitStyles();
animation.cancel(); // Clears memory retainer in browser rendering pipeline
```

### 6. Implement Interactive Controls & Cleanup
Provide public control hooks (`play()`, `pause()`, `reverse()`, `updatePlaybackRate()`) and clean up animation references on component unmount or state destruction.

---

## Decision Rules

| Requirement | WAAPI Solution | Alternative Approach | Rationale |
| :--- | :--- | :--- | :--- |
| **Grid / List item reordering** | **FLIP via WAAPI** (`element.animate()`) | CSS Transition + Class Toggle | CSS class toggles cannot smoothly animate layout shifts when DOM positions jump instantly. |
| **Animation with Play / Pause / Reverse UI** | **WAAPI Control Methods** (`anim.pause()`, `anim.reverse()`) | External Library (GSAP) | WAAPI provides native `.pause()` and `.reverse()` without importing 30kB+ JS dependencies. |
| **Dynamic target coordinates (Drag-to-dock)** | **Dynamic WAAPI Keyframes** | CSS `@keyframes` | CSS `@keyframes` are static and cannot compute dynamic inline pixel values at runtime. |
| **Chained sequence across 5 elements** | `Promise.all(elements.map(el => el.animate().finished))` | Nested `animationend` callbacks | `Promise.all` with `animation.finished` avoids callback hell and ensures atomic completion. |
| **Static button hover animation** | **CSS `:hover` & `transition`** | WAAPI | CSS transitions are simpler, declarative, and require zero JS execution or listener tracking. |

---

## Constraints

- **Style Leaks (`fill: 'forwards'`):** Keeping `fill: 'forwards'` on long-lived SPA elements continuously accumulates animation fill layers in the browser's style cascade, leading to severe memory leaks and rendering slowdowns. Always pair `fill: 'forwards'` with `commitStyles()` and `cancel()`.
- **Browser Support for `commitStyles()`:** Supported across all modern evergreen browsers (Chrome 84+, Firefox 75+, Safari 13.1+). For legacy environments, fall back to setting inline `.style` explicitly upon `finished`.
- **Compositor Property Restriction:** Animating properties like `top`, `left`, `width`, `height`, or `margin` triggers main-thread layout reflows (reflow/repaint). Stick strictly to `transform` and `opacity`.
- **Accessibility:** Motion sensitive users can experience dizziness or nausea from unexpected movement. Honor `prefers-reduced-motion` by reducing duration to `0` or skipping non-essential transform effects.

---

## Non-Goals

- Replacing canvas-based game loop engines or WebGL rendering pipelines.
- Building a full SVG path-morphing engine (use SVG morph libraries for complex path interpolation).
- Setting up scroll-linked parallax (use `scroll-driven-animations-implementation`).

---

## Common Failure Patterns

- **The Memory Fill Leak:** Calling `element.animate(..., { fill: 'forwards' })` repeatedly on every click without calling `commitStyles()` or `cancel()`. The element retains thousands of inactive `Animation` objects in memory, degrading page performance over time.
- **The Stuttering Layout Jump (Non-FLIP):** Animating `width` and `height` or `left` and `top` directly during layout shifts instead of capturing `getBoundingClientRect()` and performing scale/translate transform inversions.
- **Callback Hell via Events:** Using `animation.onfinish = () => { ... }` instead of `await animation.finished`, leading to tangled asynchronous flows and race conditions when animations are cancelled or interrupted.
- **Ignoring Scale Distortions in FLIP:** Scaling an element with text or rounded corners without counter-scaling child elements, causing visible text stretch or distorted border radii during FLIP transitions.

---

## Validation Criteria

- [ ] **Compositor Check:** Inspect Chrome DevTools **Performance** panel or **Rendering > Paint Flashing**. Verify that animations run on the Compositor thread without triggering green paint rectangles or layout recalculations.
- [ ] **Memory & Style Retention Audit:** Open Chrome DevTools **Performance Monitor** or **Animations** inspector. Verify that finished animations do not remain in the `Animations` stack and memory remains flat after repeated trigger cycles.
- [ ] **FLIP Smoothness:** Test grid reordering, item filtering, or layout toggles. Confirm elements transition continuously without visual teleports or frame drops (60fps).
- [ ] **Accessibility Audit:** Enable `prefers-reduced-motion` in browser/system settings. Confirm animations complete instantly without motion effects.
- [ ] **Playback Control Test:** Test pause, play, reverse, and speed adjustment (e.g., `playbackRate = 2`). Confirm state transitions smoothly without visual jumps.
