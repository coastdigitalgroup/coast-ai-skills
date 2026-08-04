---
name: image-comparison-slider-system
description:
  Design and structure interactive, side-by-side visual comparison interfaces
  (before/after view) with keyboard control, touch-target optimization, and
  layout preservation rules.
---

# Image Comparison Slider System

## Purpose

The Image Comparison Slider System provides a systematic design and spatial methodology for constructing interactive "Before and After" visual comparison components. This system addresses the design challenge of presenting two overlapping states of an image (e.g., photo restoration, color grading, design mockups, environmental changes, or medical results) in a way that allows users to dynamically slide, reveal, and contrast details. It prevents visual disorientation, preserves layout stability, ensures touch targets are optimized for mobile, and satisfies WCAG AA accessibility standards via structured keyboard interactions and screen reader announcements.

---

## Use Cases

- **Creative & Editing Software Showcases:** Comparing unedited RAW files with final edited photographs, color-grading presets, or retouching work.
- **Architectural & Design Portfolios:** Exhibiting before-and-after construction phases, remodeling projects, interior staging, or website design system overhauls.
- **E-commerce & Product Demos:** Presenting products under different conditions (e.g., waterproof fabric testing, screen protectors, cleaning products, or wear-and-tear comparisons).
- **Environmental & Scientific Visualizations:** Presenting changes over time, such as satellite mapping of glacier retreats, urban expansion, or reforestation projects.
- **Cosmetics & Medical Case Studies:** Presenting high-fidelity treatment results under identical lighting and spatial conditions.

---

## When NOT to Use

- **Multi-Item Discovery:** If you need to compare discrete attributes of 2–5 distinct products, use the `comparison-matrix-system`.
- **General Image Grids:** For standard image display, media carousels, or galleries, use `imagery-and-media-system` or `carousel-and-slider-system`.
- **Text-Heavy Comparisons:** If the primary content is text or tabular data (e.g., software version features), use `data-table-ui-system` or `<dl>` list elements.
- **Low-Contrast Subtle Changes:** If the visual differences between the two images are minimal and cannot be easily perceived, a side-by-side or stacked layout with clear captions is more helpful.

---

## Inputs

1. **Dual Core Assets:** Two high-quality images ("Before" and "After") taken from the *exact* same spatial perspective, frame, and resolution.
2. **Component Dimensions:** Aspect ratios (e.g., 16:9, 4:3, or 1:1) and viewport boundaries (from `imagery-and-media-system`).
3. **Typography and Brand Tokens:** Typography sizes and colors for labels, handles, and instructional texts (from `fluid-typography-system`).
4. **Touch & Motion Preferences:** User choices regarding touch gestures and system-level motion reduced states.

---

## Outputs

1. **Slider Anatomy Blueprint:** Layout definition specifying the container, background track, clip-path overlay, handle bar, grab thumb, and state labels.
2. **Keyboard Control Spec:** Accessible coordinate tracking mapping keys like `ArrowLeft`, `ArrowRight`, `Home`, and `End` to relative clip-path percentages.
3. **Mobile & Touch Behavior Guide:** Precise specifications for touch target dimensions, gesture drag thresholds, and thumb spacing.
4. **Layout Preservation Rules:** Structural rules (e.g., aspect ratio preservation and absolute sizing) to prevent layout shift (CLS).

---

## Workflow

### 1. Establish the Spatial Track and Container
Preserve the aspect ratio and structural alignment:
- **Aspect Ratio Locking:** The container must have an explicit aspect ratio (e.g., `aspect-ratio: 16 / 9` or `aspect-ratio: 1 / 1`) to reserve layout space and prevent Cumulative Layout Shift (CLS).
- **Absolute Positioning Overlay:** Set the container to `position: relative; overflow: hidden;`. Place the "After" image as a standard background image block (`width: 100%; height: 100%; object-fit: cover;`).
- **Clipping Overlay Block:** Position the "Before" image within an absolute-positioned overlay wrapper (`position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;`).
- **Image Synchronization:** Ensure both the background and overlay images have identical dimensions, scaling properties (`object-fit: cover`), and alignments (`object-position: center`) so they overlap precisely.

### 2. Implement the Reveal Clip-Path
Use modern CSS clipping instead of dual-image resizing to prevent visual skewing:
- **Clip-Path Value:** Apply `clip-path: inset(0 calc(100% - var(--exposure-ratio)) 0 0);` to the overlay wrapper, where `--exposure-ratio` is a CSS custom property (e.g., `50%`) representing the slider position.
- **Dynamic Variable Binding:** Update `--exposure-ratio` dynamically via mouse, touch, or keyboard inputs.
- **Avoid Image Distortion:** Do not resize the images themselves when sliding; only clip the wrapper container. The images must remain stationary relative to each other.

### 3. Design the Handle and Touch Thumb
The handle serves as the primary visual affordance for the interaction:
- **Vertical Divider Line:** Style a vertical bar positioned absolutely at `left: var(--exposure-ratio);`. Set the width to a high-contrast thin line (e.g., `2px` to `4px`) with a drop shadow to pop against diverse image backgrounds.
- **Grab Thumb Target:** Position a circular or rounded grab thumb centered on the vertical line.
- **Visual Indicators:** Embed bidirectional horizontal arrows (← →) or contrasting textures inside the grab thumb to signal horizontal drag capabilities.
- **Touch Target Size (WCAG 2.2 SC 2.5.8):** The interactive grab thumb must have a physical touch target of at least `44px x 44px` on mobile/touch interfaces, regardless of its visual size. Accomplish this using transparent pseudo-elements (`::after`) or padding.

### 4. Construct Accessible Text Labels
Maintain user context and orientation:
- **Text Label Placement:** Position labels (e.g., "BEFORE" and "AFTER") in opposite corners of the container (e.g., "Before" at the top-left, "After" at the top-right).
- **High-Contrast Design:** Use semi-transparent dark backgrounds (scrims) behind white text labels to ensure a minimum contrast ratio of `4.5:1` (WCAG AA) regardless of image content.
- **Interactive State Feedback:** Optionally fade out text labels when the slider is active to minimize visual distraction, restoring them when the interaction ends.

### 5. Define Keyboard Navigation and ARIA Integration
The interface must be fully navigable by keyboard alone:
- **Range Slider Backing:** Back the visual comparison with a native, visually-hidden `<input type="range">` element. This provides native range handling, focus states, and aria roles.
- **ARIA Attribute Association:** Assign `aria-label` (e.g., "Before and after image comparison"), `aria-valuemin="0"`, `aria-valuemax="100"`, and dynamic `aria-valuenow` representing the percentage.
- **Keyboard Event Mapping:**
  - `ArrowLeft` / `ArrowDown`: Decrement position by 1% (or 5% for faster movement).
  - `ArrowRight` / `ArrowUp`: Increment position by 1% (or 5%).
  - `PageUp` / `PageDown`: Move slider position by 10% increments.
  - `Home`: Move immediately to 0% (fully revealing the "After" image).
  - `End`: Move immediately to 100% (fully revealing the "Before" image).
- **Focus Indicators:** When the slider is focused, display a high-contrast, distinct focus ring around the grab thumb. Never hide focus styles.

---

## Decision Rules

### Slider Movement Mode Selection

| Interaction Mode | Use Case Criteria | Implementation Method |
| :--- | :--- | :--- |
| **Active Click/Tap & Drag (Default)** | High-precision comparison; best for detailed analysis. | Update `--exposure-ratio` on `pointermove` only when the mouse/touch is pressed on the thumb. |
| **Hover Follow** | Casual/Exploratory comparisons; low-friction landing page features. | Update `--exposure-ratio` directly as the cursor moves over any part of the container. Not suitable as the sole method; fallback to click/drag is required for mobile. |
| **Dual Image Toggle (Click Anywhere)** | Simple, quick comparisons; best on small screens with very distinct visual shifts. | Click anywhere on the container triggers a transition between 0% and 100% exposure with a smooth `0.3s` easing. |

---

## Constraints

- **Accessibility (WCAG AA):** Text labels must satisfy the `4.5:1` contrast ratio. The interactive controller must support full keyboard focus, visible indicators (`:focus-visible`), and touch targets of `44px x 44px` minimum.
- **Cumulative Layout Shift (CLS):** Both images and their container must share the exact same predefined aspect ratio. Never let the container collapse to `0px` height while images are loading. Use CSS `aspect-ratio` or inline padding percentages.
- **Responsive Fluidity:** The component must scale down dynamically to mobile viewports. On screens `< 480px`, scale labels proportionally or move them directly beneath the image to prevent overlapping other core visual features.
- **Reduced Motion:** If a user prefers reduced motion (`@media (prefers-reduced-motion: reduce)`), disable smooth transitions when keyboard navigation is used, and avoid hover-follow triggers in favor of explicit click/tap actions.

---

## Common Failure Patterns

- **The "Image Squish" Trap:** Resizing or stretching the images during the drag interaction instead of clipping them, resulting in deformed visuals.
- **The "Zero-CLS Collapse":** Failing to set container dimensions, causing the layout to jump dramatically when the images finally download.
- **Keyboard Exclusion:** Creating a slider that can only be dragged with a mouse, making it completely unusable for keyboard, screen reader, and some assistive switch users.
- **The "Invisible Thumb" on Light Images:** Failing to add a drop shadow, border, or high-contrast overlay to the handle and thumb, causing them to blend entirely into light/busy images.
- **Touch-Target Traps:** Making the grab thumb tiny (e.g., `10px` wide) with no touch padding, causing massive user frustration on mobile devices.

---

## Validation Criteria

- [ ] **Precise Overlay Alignment:** The "Before" and "After" images are perfectly aligned with no horizontal offset, squishing, or distortion during sliding.
- [ ] **Zero Cumulative Layout Shift:** The container reserves layout space using a consistent aspect ratio or explicit dimensions before images load.
- [ ] **Mobile Touch Safety:** The grab handle/thumb touch target is at least `44px x 44px` on mobile/touch viewports.
- [ ] **Full Keyboard Navigability:** Users can navigate, focus, and adjust the slider position using standard keyboard keys (`Arrows`, `Home`, `End`).
- [ ] **ARIA Standards Compliant:** The interactive controller uses semantic elements (like `<input type="range">`) or correct ARIA roles (`role="slider"`, `aria-valuenow`, `aria-label`).
- [ ] **Contrast AA Compliance:** Text labels ("Before" and "After") and focus indicators meet the 4.5:1 WCAG contrast ratio against adjacent surfaces.
- [ ] **Motion Sensitivity:** Interaction behavior honors user preferences for reduced motion (`prefers-reduced-motion: reduce`).
