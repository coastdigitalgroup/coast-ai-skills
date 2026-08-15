---
name: accessible-range-slider-implementation
description:
  Implement and debug accessible single-thumb and multi-thumb (dual) range
  sliders using native elements, CSS styling strategies, and keyboard/touch
  state synchronization.
---

# Accessible Range Slider Implementation

## Purpose

Range sliders allow users to select a single value or a range of values (min/max) within predefined boundaries (e.g., price ranges, date ranges, volume levels, or financial calculators). While the native HTML `<input type="range">` works well for single values, styling it consistently across browsers is notoriously difficult. Furthermore, HTML provides no native multi-thumb (dual) range slider.

When developers build custom range sliders using generic elements (`<div>`, `<span>`) and mouse/touch tracking, they almost always break keyboard navigation, touch responsiveness, layout stability, and screen reader compatibility.

This skill provides a technical protocol and architectural blueprints for:
1. **Consistent, responsive styling of native single-thumb range sliders.**
2. **Implementing highly performant, fully accessible dual-thumb range sliders** using overlapping native elements, avoiding the massive accessibility overhead of custom drag-and-drop implementations.

---

## Use Cases

Apply this skill when implementing:
- **E-commerce filters:** Filtering product listings by min and max prices (e.g., "$10 to $150").
- **Financial calculators:** Interactive sliders to configure loan amounts, interest rates, or payback periods.
- **Data visualization controls:** Selecting a range of dates or years to filter a chart or map.
- **Media players:** Volume controls or video timeline scrubbers.
- **Custom application settings:** Adjusting sliders for dimensions, zoom, opacity, or threshold sensitivities.

---

## When NOT to Use

Do not use this skill for:
- **Binary states:** For basic on/off toggles, use an accessible switch (`accessible-switch-implementation`).
- **Discontinuous values or distinct options:** If choices are distinct text values (e.g., "Small", "Medium", "Large"), use a segmented control (`segmented-control-system`), a native `<select>`, or a combobox (`accessible-combobox-implementation`).
- **Unbounded inputs:** If values can be arbitrarily large or small, or require high textual precision, use standard numeric inputs (`<input type="number">`) instead of or alongside a slider.
- **Simple ratings:** For star ratings or qualitative metrics, use an accessible rating component (`accessible-star-rating-implementation`).

---

## Inputs

When building or auditing a range slider, you require:
1. **Slider Type:** Single-thumb or multi-thumb (dual-thumb).
2. **Numeric Boundaries:** Minimum value (`min`), maximum value (`max`), and increment step (`step`).
3. **Current State:** Default values (e.g., starting value for single, or starting min/max values for dual).
4. **Visual Guidelines:** Specifications for the slider track, active progress highlight, thumb handle (size, shape, states), and focus ring representation.
5. **Contextual Labels:** How the value is made readable (e.g., prepending currency symbols, formatting dates) and what label describes the input to assistive technology.

---

## Outputs

This skill produces:
1. **Semantic HTML Structure:**
   - Single-thumb: A labeled `<input type="range">`.
   - Dual-thumb: Two overlapping `<input type="range">` elements enclosed in a structural wrapper with a shared background track, visually styled to look like a unified dual slider.
2. **Cross-Browser CSS System:** Custom CSS rules targeting browser-specific pseudo-elements (`-webkit-slider-thumb`, `-moz-range-thumb`, etc.) that align layout, remove default user-agent styles, and implement robust visual states.
3. **Synchronization Logic (Vanilla JS):** High-performance event handlers that:
   - Calculate and update the highlighted track between the min and max positions.
   - Prevent the min thumb from crossing or overlapping past the max thumb (collision handling).
   - Dynamically swap DOM `z-index` stacking orders so the active or focused thumb is always on top and remains grabbable.
4. **Screen Reader Optimizations:** Full keyboard operability and dynamic ARIA state management (`aria-valuetext` mapping for non-integer units like dates or currencies).

---

## Workflow

### Step 1: Establish the Semantic Structure

For single-thumb sliders, use a standard labeled input. For dual-thumb sliders, overlap two native inputs inside a shared positioning context. Wrapping them in a container allows positioning the visual tracks and thumbs perfectly.

```html
<!-- Dual Range Slider Semantic Structure -->
<div class="range-slider-container">
  <!-- Visual background and progress tracks -->
  <div class="range-slider-track-bg"></div>
  <div class="range-slider-track-fill" id="sliderFill"></div>

  <!-- Accessible Range Inputs -->
  <input
    type="range"
    id="sliderMin"
    name="price-min"
    min="0"
    max="1000"
    step="10"
    value="200"
    aria-label="Minimum price"
  >
  <input
    type="range"
    id="sliderMax"
    name="price-max"
    min="0"
    max="1000"
    step="10"
    value="800"
    aria-label="Maximum price"
  >
</div>
```

*Note on ARIA:* By utilizing native `<input type="range">` elements, the browser automatically provides `role="slider"`, keyboard accessibility, and standard slider properties (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`).

---

### Step 2: Implement the Cross-Browser CSS Overlay Pattern

The secret to dual-thumb sliders with native inputs is **overlapping**. By positioning both range inputs absolute in the same container, giving them transparent tracks, and making their thumbs grabbable, we achieve a native layout that works seamlessly with standard keyboard/mouse/touch.

1. **Container Styling:** Establish a relative positioning context with a defined height matching the touch-target sizing guidelines.
2. **Reset User-Agent Styles:** Set `appearance: none` (and prefix `-webkit-appearance`) on both inputs, make background tracks `transparent`, and pointer-events `none`.
3. **Re-Enable Pointer Events on Thumbs:** Apply `pointer-events: auto` to the thumb pseudo-elements so they remain interactive.
4. **Visual Highlights:** Design the visual track elements as absolute-positioned layers underneath the inputs.

```css
.range-slider-container {
  position: relative;
  width: 100%;
  height: 40px; /* Touch target depth */
  display: flex;
  align-items: center;
}

/* Hide standard inputs and prevent blocking other elements */
.range-slider-container input[type="range"] {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none; /* Let clicks pass through to track */
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  outline: none;
}

/* Re-enable interaction specifically on the thumb handles */
.range-slider-container input[type="range"]::-webkit-slider-thumb {
  pointer-events: auto;
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #2563eb;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.range-slider-container input[type="range"]::-moz-range-thumb {
  pointer-events: auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #2563eb;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

/* Visual track elements placed below the inputs */
.range-slider-track-bg {
  position: absolute;
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  z-index: 1;
}

.range-slider-track-fill {
  position: absolute;
  height: 6px;
  background-color: #2563eb;
  border-radius: 3px;
  z-index: 2;
}
```

---

### Step 3: Prevent Thumb Stacking Deadlocks (Z-Index Swap)

When two slider inputs overlap, the browser stacks them based on DOM order. If the "maximum" thumb is placed after the "minimum" thumb in the HTML, the min thumb can get trapped underneath the max thumb when they are close or touching, making it impossible to grab with a mouse.

We must dynamically monitor user hover, touch, and focus to swap the active input's `z-index`.

```javascript
const sliderMin = document.getElementById('sliderMin');
const sliderMax = document.getElementById('sliderMax');

function updateZIndex(activeInput) {
  if (activeInput === sliderMin) {
    sliderMin.style.zIndex = '10';
    sliderMax.style.zIndex = '9';
  } else {
    sliderMin.style.zIndex = '9';
    sliderMax.style.zIndex = '10';
  }
}

// Bind handlers to swap z-index on interaction
sliderMin.addEventListener('input', () => updateZIndex(sliderMin));
sliderMax.addEventListener('input', () => updateZIndex(sliderMax));
sliderMin.addEventListener('mouseover', () => updateZIndex(sliderMin));
sliderMax.addEventListener('mouseover', () => updateZIndex(sliderMax));
sliderMin.addEventListener('focus', () => updateZIndex(sliderMin));
sliderMax.addEventListener('focus', () => updateZIndex(sliderMax));
```

---

### Step 4: Keep Track Fill and Collisions Synchronized

We must handle value collisions (e.g., minimum value must not exceed maximum value) and update the visual highlight track's starting and ending percentages on every value update.

```javascript
const minGap = 20; // Minimum distance threshold between thumbs

function syncValues() {
  let valMin = parseInt(sliderMin.value);
  let valMax = parseInt(sliderMax.value);

  // Ensure collision boundaries are respected
  if (valMax - valMin < minGap) {
    if (document.activeElement === sliderMin) {
      sliderMin.value = valMax - minGap;
    } else {
      sliderMax.value = valMin + minGap;
    }
  }

  // Calculate percentages for track fill styling
  const minLimit = parseInt(sliderMin.min);
  const maxLimit = parseInt(sliderMin.max);
  const range = maxLimit - minLimit;

  const leftPercent = ((sliderMin.value - minLimit) / range) * 100;
  const rightPercent = 100 - (((sliderMax.value - minLimit) / range) * 100);

  const fill = document.getElementById('sliderFill');
  fill.style.left = `${leftPercent}%`;
  fill.style.right = `${rightPercent}%`;
}

sliderMin.addEventListener('input', syncValues);
sliderMax.addEventListener('input', syncValues);
// Initial sync
syncValues();
```

---

### Step 5: Screen Reader Integration

By default, screen readers read out the numeric value of the range input. If your slider selects something other than raw, unformatted integers (e.g., prices or dates), screen readers should announce a friendly, formatted description.

Use `aria-valuetext` on the input to declare this custom translation, and update it dynamically as values change.

```javascript
function updateScreenReaderLabels() {
  const formattedMin = `$${sliderMin.value}`;
  const formattedMax = `$${sliderMax.value}`;

  // Update value descriptions for screen readers
  sliderMin.setAttribute('aria-valuetext', formattedMin);
  sliderMax.setAttribute('aria-valuetext', formattedMax);
}

sliderMin.addEventListener('input', updateScreenReaderLabels);
sliderMax.addEventListener('input', updateScreenReaderLabels);
```

---

## Decision Rules

### When to choose native overlap vs. custom pointers?

| Requirement | Native Overlapping `<input type="range">` | Custom PointerEvents on `<div>` / `<span>` |
|---|---|---|
| **Keyboard Accessibility** | **Excellent (Built-in).** No manual key codes for arrows, page up/down, home/end, or tab indices required. | **Complex.** Requires keyboard listeners, boundary calculations, page sizing adjustments, and correct focus routing. |
| **Mobile Touch Support** | **Excellent (Built-in).** Leverages OS-level sliding mechanics and native acceleration. | **Complex.** Requires tracking pointer move/up, touch target scaling, text selection prevention, and edge bounding. |
| **Development Complexity** | **Low to Medium.** Just requires styling overrides, z-index swapping, and track fill updates. | **High.** Requires writing massive amounts of code to handle drag, touch transitions, boundaries, and accessibility. |
| **Multi-Thumb Support** | **Supported.** Fully achievable through overlapping with minor JS synchronization. | **Supported.** Custom coordinates can support an arbitrary number of handles. |
| **Visual Styling** | **Good.** High level of flexibility, though styling thumb handles across cross-browser vendors requires vendor prefixes. | **Unlimited.** Complete freedom of DOM structuring. |

**Rule:** Always default to **Native Overlapping inputs** for single-range and dual-range sliders. Only build custom pointers using `PointerEvents` if you require 3 or more concurrent thumbs on a single bar, or if you must support vertical non-standard sliding ranges with extremely decorative shape models that native sliders cannot represent.

---

## Constraints

- **Touch Interaction Targets:** The actual clickable target or grabbable handle must meet WCAG 2.2 SC 2.5.8 (Target Size - Minimum 24x24px, preferably 44x44px padding around the track to prevent missed taps).
- **Interactive Focus Ring:** Focus indicators on the thumbs must be high-contrast (minimum 3:1) and never be cut off or clipped by overflow/clip limits of the outer container (WCAG 2.2 SC 2.4.11).
- **Reduced Motion:** If using smooth CSS transition effects on thumb moves or track fills, wrap transitions in `@media (prefers-reduced-motion: no-preference)` to respect user choices.
- **Form Integrity:** Ensure the slider inputs participate naturally in forms. Submitting the parent form must pass the min/max input names and current values accurately.

---

## Non-Goals

- Building complex radial or circular sliders.
- Implementing backend filtering or API processing logic.
- Building custom visualization libraries (such as complex charts or histograms) directly inside the background track of the slider.

---

## Common Failure Patterns

- **The Stacking Deadlock:** Placing two inputs in the DOM where the min slider is underneath the max slider. When they touch, the min slider can never be hovered or grabbed with a mouse again.
- **Ignoring Vendor Prefixes:** Creating rules for `.range-slider-container input[type="range"]::slider-thumb` without writing independent rule sets for `-webkit-slider-thumb` and `-moz-range-thumb`. If grouped together in a single selector block, browsers discard the entire CSS block when they encounter an unrecognized vendor pseudo-selector.
- **Color Contrast Flaws:** Choosing weak yellow, light grey, or pastel colored track highlights that fall under the 3:1 ratio for non-text graphics, rendering the active progress selection invisible to low-vision users.
- **Keyboard Neglect:** Creating custom slider handles using standard `<div>` wrappers and forgetting to attach `tabindex="0"`, `role="slider"`, keydown listeners for arrow keys, or `aria-valuenow` attributes.

---

## Validation Criteria

### Step 1: Automated & Functional Tests
- [ ] Run an accessibility checker (Axe/Wave) on the page containing the slider to verify that inputs possess associated `<label>` references or valid `aria-label` declarations.
- [ ] Verify that submitting the containing form successfully passes the min/max keys and chosen parameters in the request payload.

### Step 2: Keyboard Navigation Routine
- [ ] Tab onto the range slider component. Verify that the focus indicator is clearly visible around the focused thumb.
- [ ] Press `ArrowRight` or `ArrowUp` to increase the value, and `ArrowLeft` or `ArrowDown` to decrease it. Verify increments align with the defined `step` attribute.
- [ ] Press the `Home` and `End` keys. Confirm the thumb hops exactly to the minimum and maximum boundaries respectively.
- [ ] Press `PageUp` and `PageDown` to verify larger jumps (or confirm standard native slider paging step).
- [ ] Tab again. The focus must transition cleanly between the Min thumb and the Max thumb, and then exit the slider container without keyboard trapping.

### Step 3: Screen Reader Interaction Audits
- [ ] Activate a screen reader (e.g., VoiceOver, NVDA, or JAWS).
- [ ] Focus on each thumb handle. Ensure that the reader announces:
  - The correct accessible label (e.g., "Minimum price").
  - The correct current role ("Slider" or "Range indicator").
  - The dynamic value formatted naturally (e.g., "$200" instead of "200" if custom formatting is configured via `aria-valuetext`).

### Step 4: Touch and Interaction Reliability
- [ ] Open the implementation on a mobile touch emulator or actual mobile device.
- [ ] Attempt to drag both thumbs. Ensure dragging works smoothly without jumping, visual stutter, or vertical screen scrolling/bouncing.
- [ ] Verify that tapping on the empty track moves the closest thumb to that click coordinate instead of jamming.
- [ ] Verify that when both thumbs are placed at the exact same value (touching), you are still able to select and slide them both outward again.
