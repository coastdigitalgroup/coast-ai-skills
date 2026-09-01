# WAAPI Technical Reference: Browser Mechanics, Composite Modes, and Performance

This reference guide details technical mechanics, browser gotchas, and performance optimization rules when using the Web Animations API (WAAPI) in frontend applications.

---

## 1. Keyframe Syntax Variations & Offsets

WAAPI supports two distinct format structures for defining keyframes:

### Array Syntax (Recommended)
An array of keyframe objects. Offsets are automatically spaced linearly unless specified explicitly.

```javascript
element.animate([
  { transform: 'translateY(0px)', opacity: 0, offset: 0 },
  { transform: 'translateY(-20px)', opacity: 0.8, offset: 0.6 },
  { transform: 'translateY(0px)', opacity: 1, offset: 1 }
], {
  duration: 400,
  easing: 'ease-out'
});
```

### Property-Indexed Object Syntax
An object mapping CSS properties to arrays of values.

```javascript
element.animate({
  transform: ['translateY(0px)', 'translateY(-20px)', 'translateY(0px)'],
  opacity: [0, 0.8, 1],
  offset: [0, 0.6, 1]
}, {
  duration: 400
});
```

---

## 2. Composite Operations (`replace`, `add`, `accumulate`)

The `composite` option determines how animated property values combine with underlying inline CSS or existing active animations on the element:

- **`replace` (Default):** The animated value overrides the element's existing underlying CSS property value completely.
- **`add`:** The animated value is appended/concatenated onto the underlying CSS property value.
  - *Example:* If underlying style is `transform: translateX(100px)` and animation keyframe is `transform: translateY(50px)`, `add` yields `transform: translateX(100px) translateY(50px)`.
- **`accumulate`:** Numerically combines values when possible (e.g., combining two `scale()` factors or pixel values).

```javascript
element.animate([
  { transform: 'scale(1.1)' }
], {
  duration: 300,
  composite: 'add' // Combines with base transform without overriding
});
```

---

## 3. WAAPI Style Composite Stack vs. `commitStyles()`

### The Fill Forwards Leak Problem
When setting `fill: 'forwards'`, WAAPI keeps the animation in an active state within the browser's internal **Animation Composite Effect Stack**.
- Over time, as users trigger interactions repeatedly, hundreds of invisible, inactive `Animation` instances accumulate in WebKit/Blink's memory.
- This creates severe layout recalculation overhead and style resolution bottlenecks.

### The `commitStyles()` Protocol
To solve the fill leak:
1. Allow the animation to complete (`await animation.finished`).
2. Call `animation.commitStyles()`: writes the calculated final keyframe values directly into the element's inline `style="..."` attribute.
3. Call `animation.cancel()`: removes the animation instance completely from the browser's Animation Composite Effect Stack.

```javascript
const animation = element.animate(keyframes, { duration: 300 });

await animation.finished;
animation.commitStyles(); // Writes values to element.style
animation.cancel();      // Removes from WAAPI engine memory
```

---

## 4. Hardware Acceleration & Compositor Properties

To guarantee 60fps / 120fps smooth animations on mobile and desktop:

| Property Category | Properties | Pipeline Phase | Compositor Thread? |
| :--- | :--- | :--- | :--- |
| **Compositor Only** | `transform`, `opacity`, `filter`, `backdrop-filter` | Composite | **YES (60fps guaranteed)** |
| **Paint Only** | `background-color`, `color`, `border-color`, `box-shadow` | Paint -> Composite | **NO (Triggers Paint)** |
| **Layout / Reflow** | `width`, `height`, `top`, `left`, `margin`, `padding`, `flex` | Layout -> Paint -> Composite | **NO (Triggers Heavy Reflow)** |

---

## 5. WAAPI Lifecycle Promises vs Event Listeners

Prefer native Promise attributes (`animation.finished` and `animation.ready`) over legacy event handlers (`onfinish`, `oncancel`):

### Why Promises Are Superior
- **Composability:** Can be chained with `async/await` and combined using `Promise.all()` or `Promise.race()`.
- **Cancellation Traps:** Promises reject with an `AbortError` when `animation.cancel()` is called explicitly, allowing clean error catching.

```javascript
try {
  const animation = element.animate(keyframes, { duration: 500 });
  await animation.ready;    // Resolves when animation is attached to GPU compositor
  await animation.finished; // Resolves when animation completes playback
} catch (err) {
  if (err.name === 'AbortError') {
    // Animation was cancelled mid-flight
  }
}
```

---

## 6. Browser Quirks & Feature Support

- **Safari `commitStyles()` Support:** Safari supports `commitStyles()` starting in Safari 13.1 (iOS 13.4). Always feature-detect `typeof animation.commitStyles === 'function'` before invoking.
- **Implicit Starting Keyframes:** Browsers support omitting the `0%` start keyframe (WAAPI will automatically infer current computed style as the start value). However, explicitly declaring `offset: 0` start values avoids visual flash bugs in Firefox and WebKit when elements have CSS transitions applied simultaneously.
