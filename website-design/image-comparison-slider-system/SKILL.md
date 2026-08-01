---
name: image-comparison-slider-system
description:
  Design and implement an accessible, responsive, and performance-optimized
  image comparison slider system (before/after view) with keyboard controls,
  touch-target optimization, and layout preservation rules.
---

# Image Comparison Slider System

## Purpose

The Image Comparison Slider System provides a systematic methodology for designing and structuring interactive visual comparison interfaces (commonly referred to as "before/after" sliders). It solves the problem of displaying two overlapping images where users can drag a divider or handle horizontally to reveal more or less of each state. This system establishes strict guidelines for layout stability, proportional scaling, tactile touch target sizing, clear state representation, and keyboard/screen reader accessibility. This transforms what is frequently implemented as an inaccessible, layout-shifting widget into a robust, high-trust, and standard-compliant component.

## Use Cases

- **Product & Aesthetic Demonstrations:** Showcasing the direct effects of beauty products, photo-editing tools, cleaning agents, or renovation services.
- **Visual Design and Optimization:** Comparing "Before" vs. "After" states of redesigned websites, compressed vs. uncompressed imagery, or dark mode translations.
- **Geospatial & Historical Archives:** Illustrating satellite or topographic shifts over time, urban development progress, or archaeological restorations.
- **Technical Capabilities:** Demonstrating resolution improvements, detail extraction, noise reduction, or night-mode enhancements.

## When NOT to Use

- **Multi-Item Comparisons:** When users need to compare more than two states or compare attributes across different objects; use `comparison-matrix-system` or `data-table-ui-system` instead.
- **Non-Overlapping Media:** If the two images do not share identical framing, perspectives, or aspect ratios, a side-by-side or stacked grid using `imagery-and-media-system` is more readable.
- **Narrative Slideshows:** If the goal is to cycle through unrelated pictures or promotional banners, use `carousel-and-slider-system` instead.
- **Video Overlays:** For dynamic temporal media comparison (e.g., comparing video streams), use `native-video-implementation` with custom layout switches.

## Inputs

1. **Comparison Media Assets:** Two high-quality images (representing "Before" and "After" states) with identical framing, dimensions, and visual boundaries.
2. **Layout Dimensions & Aspect Ratios:** The target display sizing, such as a cinematic 16:9, standard 4:3, or container-derived fluid ratios.
3. **Handle Style Tokens:** Design tokens for the sliding divider line, drag handle indicator (dimensions, icons, shadows), and focused rings.
4. **Fluid Spacing Scale:** Fluid padding and margin tokens to ensure correct spatial positioning within parent layouts (from `fluid-spacing-system`).
5. **Brand Color System:** Accessible contrast tokens for labels, borders, handles, and fallback states.

## Outputs

1. **Slider Anatomy Map:** Exact visual and markup specification for the overlapping containers, clipping layers, drag handle, and semantic controls.
2. **Keyboard Interaction Model:** Specific key mappings and focus state treatments that enable full device-agnostic operation.
3. **Art Direction & Aspect Ratio Spec:** Sizing strategies that preserve focal alignment and crop cohesion across desktop, tablet, and mobile.
4. **Progressive Enhancement Strategy:** A fallback layout specification for when JavaScript is disabled or fails to load.

---

## Workflow

### 1. Establish Layout Geometry and Container Stability
Because this system overlaps two absolute-positioned images, it is highly vulnerable to Cumulative Layout Shift (CLS) during page load.
- **Enforce Parent Aspect Ratio:** Set a strict CSS `aspect-ratio` on the outer slider container (e.g., `aspect-ratio: 16 / 9` or `aspect-ratio: 4 / 3`) or specify explicit heights using fluid units to allocate page space before images download.
- **Absolute Stack Setup:** Position the "Before" (underlying) image as standard flow or absolute within the container. Wrap the "After" (overlay) image in a secondary div container styled with `position: absolute; top: 0; left: 0; width: 100%; height: 100%;` and set `overflow: hidden`.
- **Match Image Fit:** Both images must use identical layout properties (`width: 100%; height: 100%; object-fit: cover; display: block;`) to ensure their pixels align perfectly when clipped.

### 2. Design the Clipping Layer and Handle Anatomy
The slider works by modifying the width of the overlay layer container using percentage values.
- **Percentage-Based Clipping:** Control the visible width of the top container using standard CSS widths (e.g., `width: 50%`). Avoid using complex JS clip-paths unless required for non-linear dividers.
- **The Split Divider Line:** Render a vertical divider line at the same percentage coordinate (e.g., `left: 50%`). Ensure the line meets a minimum 3:1 contrast ratio against the underlying imagery or uses a drop shadow/border stroke to guarantee visibility across any background.
- **The Drag Handle Badge:** Center a circular or pill-shaped handle badge over the divider line. Standardize on a minimum touch target size of **44x44px** on the handle to guarantee mobile ergonomic safety. Include directional visual cues within the badge (e.g., left and right arrows `← →` or chevron indicators).

### 3. Implement the Semantic Input Control Layer
Instead of relying on arbitrary mouse coordinate tracking alone, use a native HTML range input to manage the interaction state.
- **Native Range Overlay:** Overlay an `<input type="range" min="0" max="100" value="50">` directly over the entire slider component. Position it absolutely with `top: 0; left: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: col-resize; z-index: 10;`.
- **Value Binding:** Bind the input's `input` event to update a CSS custom property on the parent container (e.g., `--slide-value: 50%` or `--slide-value: 50`). Use this CSS variable to drive the width of the clipping layer and the positioning of the handle line (`left: var(--slide-value)`).
- **No-JS Fallback:** Ensure that if JavaScript is disabled, both images are displayed side-by-side, or the slider defaults to a 50/50 split overlay where the user can still see portions of both states.

### 4. Create Accessible Labels and Text Overlays
- **Semantic Badges:** Place text labels ("Before" / "After" or custom descriptors) in opposing corners (e.g., top-left for "Before", top-right for "After").
- **Visual Contrast Protection:** Place labels inside solid background badges with high-contrast text meeting the WCAG AA `4.5:1` minimum threshold (e.g., white text on semi-transparent dark gray `rgba(0,0,0,0.7)`).
- **Context-Aware Hide:** When the slider handle is dragged close to either edge (e.g., < 10% or > 90%), fade out or translate the corresponding label to prevent visual clashing and handle overlapping.

### 5. Define Responsive and Art Direction Rules
- **Desktop (1024px+):** The slider occupies its natural column width. Hover states on the handle or container reveal labels and enhance the interactive cursor.
- **Tablet & Mobile (< 1024px):** Since hover states do not exist on touch viewports, label badges must remain persistently visible (or switch to a top/bottom header layout). The touch target area is expanded globally.
- **Ratio Adaptation:** When transitioning to vertical smartphone screens, evaluate if a horizontal comparison remains effective. If portrait-style crops are needed, use a picture element structure or shift to an adaptive aspect ratio (such as `4:5` or `1:1`) to prevent vertical squishing while keeping the subject framed.

---

## Decision Rules

### Slider Interaction Mechanics

| Visual Goal | Slider Strategy | Recommended Implementation |
| :--- | :--- | :--- |
| **High Precision Comparisons** | Horizontal slider driven by semantic input element. | `<input type="range">` with custom property binding. |
| **Non-Linear / Angle Comparisons** | Angled clipping mask with specialized hover track. | CSS Custom Property tracking with angled clip-path. |
| **Step-by-Step Changes (3+ phases)** | Multi-state toggle control with layered transitions. | Tabbed segmented control alongside fading layers. |
| **Ambient/Introductory Contrast** | Auto-oscillating slider that stops on user hover/tap. | CSS animation keyframes on width, cleared on interaction. |

### Visual Placement of Labels
- **Inside Overlay:** Best for spacious images (like landscapes, architecture). Place in top-left and top-right corners with high-contrast background containers.
- **Outside Overlay (Header/Footer):** Best for text-heavy comparisons, extreme detail maps, or compact cards where internal labels block critical content. Position as a structured subtitle grid above or below the image.

---

## Constraints

- **Accessibility (WCAG 2.2 SC 2.1.1 / 1.3.2):** The component must be fully operable by keyboard. Tabbing into the slider must highlight the range input with a highly visible focus ring. Keyboard arrow keys (`ArrowLeft`, `ArrowRight`, `Home`, `End`) must increment/decrement the slider value in predictable steps (typically 1% or 5%).
- **Aria Representation (WCAG 2.1 SC 4.1.2):** The range input must have a clear descriptive label (e.g., `aria-label="Image comparison slider, use left and right arrow keys to compare before and after"`).
- **Focus Obscuration Prevention (WCAG 2.2 SC 2.4.11):** The custom focus indicator on the handle must never be clipped by `overflow: hidden` on the outer comparison container. Ensure sufficient margin or allow the focus ring to render on the range input container.
- **Contrast Ratios (WCAG AA):** The sliding handle button, divider line, and control state indicators must have at least a `3:1` contrast ratio against the underlying imagery or utilize drop-shadows and high-contrast borders (e.g., a white line with a dark drop shadow).
- **Layout Stability (CLS):** Never leave the image comparison height unconstrained. Set an explicit aspect-ratio or height token so the browser reserves space during asset load.

---

## Common Failure Patterns

- **The "Invisible" Divider:** Using a razor-thin single color line with no drop shadow. On light or busy images, the divider disappears, leaving users unable to locate the slider control.
- **Keyboard Dead Ends:** Creating custom mouse-tracking logic in JS that does not bind to keyboard events. Keyboard users cannot compare the states.
- **Responsive Squishing:** Scaling the container width while keeping a fixed height, which distorts the aspect ratio and stretches the comparison imagery.
- **Touch Intercept Clashes:** Placing the comparison slider inside a scrollable container or on a page with heavy swipe gestures without setting `touch-action: pan-y` on the slider, causing page-scroll jitter during comparison.
- **No-JS Content Loss:** Stacking the images on top of each other with `opacity: 0` when JS is disabled, rendering one of the states completely inaccessible.

---

## Validation Criteria

- [ ] **Proportional Layout Stability:** The outer container has a defined `aspect-ratio` or height to prevent Cumulative Layout Shift (CLS).
- [ ] **Fluid Scaling:** Both images remain perfectly scaled and aligned (`object-fit: cover` with identical cropping) when the slider is moved.
- [ ] **Keyboard Accessibility:** The slider can be focused via `Tab` and fully controlled using `ArrowLeft`, `ArrowRight`, `Home`, and `End` keys.
- [ ] **Semantic ARIA Labels:** The input range has an active, descriptive `aria-label` detailing the before/after state comparison.
- [ ] **Ergonomic Touch Targets:** The custom handle or input wrapper provides at least a `44x44px` physical touch interaction zone.
- [ ] **Visual Contrast AA Compliance:** Opposing text labels sit in high-contrast badges (minimum 4.5:1 text contrast) and remain legible on all backgrounds.
- [ ] **Graceful No-JS Fallback:** The component degrades gracefully to a side-by-side layout or static split when JS is absent.
- [ ] **Focus Ring Visibility:** The slider handle displays a high-contrast focus indicator when navigated to via keyboard, with no clipping from parent boundaries.
