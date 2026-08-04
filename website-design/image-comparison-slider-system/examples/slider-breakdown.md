# Image Comparison Slider: Professional Photo Restoration Example

This example demonstrates how to apply the **Image Comparison Slider System** to a professional photo restoration and color-grading showcase. The goal is to design a high-fidelity, interactive widget that lets users compare a damaged, faded historical photograph ("Before") with a fully restored, colorized masterpiece ("After").

---

## Design Problem

A digital archive platform and restoration studio wants to showcase their archival restoration quality. They have two image assets:
1.  **Before Asset (`restoration-before.jpg`):** A 1920s portrait with heavy silvering, deep scratches, water stains, and severe sepia fading.
2.  **After Asset (`restoration-after.jpg`):** The same portrait with scratches seamlessly filled, contrast restored, silvering removed, and historically accurate hand-tinted colorization.

To prove the mastery of the restoration work, the user needs to inspect fine details—like the texture of the subject's vintage lace collar or the grain structure of the background. Placing two images side-by-side or stacked vertically makes it very difficult to compare exact coordinates. Showing them in a fade-in slideshow obscures the direct alignment.

An interactive image comparison slider allows the user to slide a vertical bar back and forth, revealing the restored details exactly on top of the original damage.

---

## Component Layout Blueprint (Desktop)

The component is structured with a fixed **16:9 widescreen aspect ratio** and is centered within a contained layout to prevent massive viewports from making detail inspection difficult.

```text
+-------------------------------------------------------------------------+
|                  ARCHIVAL PHOTO RESTORATION SHOWCASE                     |
|                                                                         |
|  +---------------------------[ CONTAINER ]----------------------------+  |
|  | [BEFORE LABEL]                                       [AFTER LABEL] |  |
|  | "ORIGINAL (1924)"                                 "RESTORED & COL" |  |
|  |                                                                    |  |
|  | <------ [CLIPPED OVERLAY]             [BACKGROUND TRACK] --------> |  |
|  | Before Image (Damaged)                After Image (Restored)       |  |
|  | (visible up to exposure line)         (visible after exposure line) |  |
|  |                                                                    |  |
|  |                         |  [THUMB]  |                              |  |
|  |                         |   ( < > ) | <--- Grab Handle             |  |
|  |                         |           |                              |  |
|  |                         v           v                              |  |
|  +------------------------- exposure-line ----------------------------+  |
|                                                                         |
|                Instructions: Drag slider or use arrow keys              |
+-------------------------------------------------------------------------+
```

---

## Detailed Component Anatomy Specifications

### 1. The Outer Container
*   **Sizing:** Max-width of `960px` with an aspect ratio of `16 / 9` (`aspect-ratio: 16 / 9;`).
*   **Layout:** Centered horizontally on the page with a fluid outer margin. Set to `position: relative; overflow: hidden; border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);`.
*   **Layout Stability (CLS):** Utilizing the `aspect-ratio` property ensures that even if the network is slow, the browser reserves exactly `960px` width and `540px` height (or scaled equivalent), preventing the rest of the page layout from jumping.

### 2. The Background Image ("After")
*   **Dimensions:** Sized to fill the parent container completely (`width: 100%; height: 100%; object-fit: cover;`).
*   **Asset:** Displays the fully colorized and restored portrait.

### 3. The Clipped Overlay Wrapper ("Before")
*   **Dimensions:** Positioned absolutely to cover the entire container (`position: absolute; top: 0; left: 0; width: 100%; height: 100%;`).
*   **Clipping Mechanism:** Uses CSS clip-path: `clip-path: inset(0 calc(100% - var(--exposure-ratio, 50%)) 0 0);`.
*   **The Overlaid Image:** Sized exactly like the background image (`width: 100%; height: 100%; object-fit: cover;`). This ensures the two images overlap pixel-for-pixel, preventing any visual stretching or alignment drift during drag interactions.

### 4. The Grab Handle & Thumb
*   **Handle Bar:** A vertical line positioned absolutely at `left: var(--exposure-ratio, 50%); top: 0; bottom: 0; width: 2px; background: rgba(255, 255, 255, 0.9); box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); pointer-events: none;`.
*   **Grab Thumb:** A circle positioned at the center of the vertical line:
    *   **Visual Dimensions:** `36px` diameter, solid white background with a subtle border (`border: 2px solid rgba(0, 0, 0, 0.2)`), and shadow (`box-shadow: 0 4px 10px rgba(0,0,0,0.3)`).
    *   **Interactive Target Size (WCAG AA):** The physical interactive touch-target is expanded to `48px x 48px` using a pseudo-element (`::after`) to accommodate thumbs on mobile viewports without cluttering the visual interface.
    *   **Affordance Icons:** Inside the thumb, two small horizontal chevrons (← and →) are colored in high-contrast charcoal gray (`#1a1a1a`), signaling directionality.

### 5. High-Contrast Corner Labels
*   **Original Label ("Before"):** Positioned at `top: 16px; left: 16px;`. Text: "ORIGINAL (1924)".
*   **Restored Label ("After"):** Positioned at `top: 16px; right: 16px;`. Text: "RESTORED & COLORIZED".
*   **Visual Contrast:** Sized at `0.75rem` (uppercase, bold, letter-spaced). Rendered in pure white text inside a semi-transparent black pill backdrop (`background: rgba(0, 0, 0, 0.65); padding: 6px 12px; border-radius: 4px;backdrop-filter: blur(4px);`). This guarantees a contrast ratio exceeding `7:1`, bypassing any readability issues stemming from bright background pixels in either photo state.

---

## Technical Markup and State Mapping

Here is the HTML blueprint mapping how the layers are structured to ensure robust state tracking, visual styling, and semantic screen-reader integration.

```html
<div class="comparison-widget" style="--exposure-ratio: 50%;">

  <!-- 1. After Image (Background) -->
  <img src="restoration-after.jpg" alt="Fully restored and hand-colored vintage portrait" class="image-after" />

  <!-- 2. Before Image (Clipped Overlay) -->
  <div class="image-before-wrapper">
    <img src="restoration-before.jpg" alt="Original damaged and faded black and white portrait" class="image-before" />
  </div>

  <!-- 3. Dynamic Labels -->
  <span class="label label-before">Original (1924)</span>
  <span class="label label-after">Restored & Colorized</span>

  <!-- 4. Handle Line and Thumb -->
  <div class="slider-handle">
    <div class="slider-thumb" aria-hidden="true">
      <svg class="chevron-icons" viewBox="0 0 24 24" width="16" height="16">
        <path d="M8.5 5l-7 7 7 7M15.5 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>

  <!-- 5. Accessibility Controls (Keyboard Backing) -->
  <input
    type="range"
    class="accessibility-slider-control"
    min="0"
    max="100"
    value="50"
    aria-label="Before and after restoration image comparison slider"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="50"
  />
</div>
```

---

## Responsive Breakpoint Adaptation Plan

To maintain usability and clarity on small viewports, the layout adapts gracefully at two core breakpoints.

### Desktop & Tablet Viewports (>= 768px)
*   **Dimensions:** Aspect ratio is locked to `16:9`. Max-width is `960px`.
*   **Interaction:** Full drag, click-anywhere-to-slide, and full keyboard focus are supported.
*   **Labels:** Floating in-corner pill badges are rendered at full size.

### Mobile Viewports (< 768px)
*   **Dimensions:** The aspect ratio adapts to `4:3` or `1:1` square to optimize vertical screen space, giving the image details more physical room on narrow screens.
*   **Labels:** The labels can scale down slightly (`font-size: 0.7rem; padding: 4px 8px;`). If the viewport width drops below `360px`, the floating corner badges are hidden from the overlay, and standard text descriptions are placed immediately beneath the widget ("Left: Original Damaged, Right: Restored Color") to ensure the visual assets remain completely unobstructed.
*   **Grab Target:** The transparent mobile touch target on the thumb expands to `54px x 54px` to accommodate larger touch profiles and prevent accidental page scrolls when dragging.
