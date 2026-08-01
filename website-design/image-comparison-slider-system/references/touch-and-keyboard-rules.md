# Image Comparison Slider Accessibility & Ergonomics Reference

This reference outlines the technical standards, mechanical requirements, and design parameters for implementing highly ergonomic, device-agnostic, and accessible **Before/After Image Comparison Sliders**.

---

## 1. Ergonomic Sizing & Touch Target Rules

The comparison handle must be easily manipulable on standard touch screens without causing accidental taps, missed focus, or page gesture intercept clashes.

### Core Touch Target Requirements
- **Minimum Interactive Size (WCAG 2.2 SC 2.5.8):** The interactive area must occupy a physical boundary of at least **24x24px**.
- **Ergonomic Target Floor:** For fluid drag widgets, the physical touch target should be at least **44x44px** to match average human thumb/finger precision.
- **Full Canvas Interception:** The recommended implementation strategy is to position the `<input type="range">` transparently over the **entire** slider canvas (`width: 100%; height: 100%`). This ensures that tapping or dragging anywhere inside the comparison frame immediately intercepts the custom coordinate and positions the divider accordingly, solving mobile dexterity friction.

### Swipe Gesture Prevention (`touch-action`)
To prevent the viewport from scrolling vertically or jittering when dragging the handle horizontally across mobile screens:
```css
.img-comp-container {
  touch-action: pan-y; /* Intercept horizontal swipes for sliding, delegate vertical swipes to native page scrolling */
}
```

---

## 2. Keyboard Control & Focus Requirements

Keyboard-only navigation must be treated as a first-class citizen. Standard JavaScript mouse tracking fails WCAG standards if not layered with keyboard handlers.

### Semantic Native Input Mapping
By using `<input type="range">` as the control layer, the browser automatically inherits native keyboard states:

| Key Press | Intended Visual Outcome | Value Change |
| :--- | :--- | :--- |
| `Tab` | Shifts focus to the range input, highlighting the handle badge. | None |
| `ArrowRight` | Moves the divider to the right, revealing more of the "Before" state. | Increments value by 1% (or 5%) |
| `ArrowLeft` | Moves the divider to the left, revealing more of the "After" state. | Decrements value by 1% (or 5%) |
| `ArrowUp` | Moves the divider to the right. | Increments value by 1% (or 5%) |
| `ArrowDown` | Moves the divider to the left. | Decrements value by 1% (or 5%) |
| `Home` | Instantly moves the divider to the far-left boundary. | Sets value to 0% |
| `End` | Instantly moves the divider to the far-right boundary. | Sets value to 100% |

### Focus Ring Design
When tabbed into, the indicator must be highly visible and meeting WCAG AA requirements:
- **Contrast:** Focus rings must maintain at least a **3:1 contrast ratio** against the surrounding background and component states.
- **Containment:** The focus ring must never be clipped by `overflow: hidden` on the outer slider frame. Position the ring with a offset (`outline-offset: 3px`) inside or around the handle badge to ensure full preservation.

---

## 3. ARIA & Screen Reader Representation

Screen readers must announce the presence and state of the comparison interface to satisfy **WCAG 2.1 SC 4.1.2 (Name, Role, Value)**.

### Input Attribute Configuration
The slider input element must be declared as follows:
- `role="slider"` (implicit via `<input type="range">`).
- `aria-label`: A descriptive string clarifying the two comparison states (e.g., `aria-label="Image comparison slider. Use left and right arrow keys to compare original uncompressed detail with optimized detail."`).
- `aria-valuemin`: `0`
- `aria-valuemax`: `100`
- `aria-valuenow`: Bind dynamically to the range input value attribute (automatically handled by the browser).

---

## 4. Aspect Ratio & Crop Techniques (CLS Prevention)

Cumulative Layout Shift (CLS) on media elements frustrates users and impacts search engine rankings.

### Explicit Proportions
Always specify a layout aspect ratio on the slider container. This instructs the browser to reserve the vertical grid space before the image files are completely retrieved.
```css
.img-comp-container {
  aspect-ratio: 16 / 9; /* Cinematic default */
}
@media (max-width: 640px) {
  .img-comp-container {
    aspect-ratio: 1 / 1; /* Adaptive square crop on compact viewports */
  }
}
```

### Cohesive Picture Alignment
The underlying images must fill the absolute frame exactly without stretching:
```css
.img-comp-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Forces cropped cover alignment without visual scaling distortion */
}
```
Both images must use identical visual dimensions, crop coefficients, and framing to ensure overlapping details remain synchronized.
