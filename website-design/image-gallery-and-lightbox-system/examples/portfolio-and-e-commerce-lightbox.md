# Examples: Image Gallery & Lightbox layouts

This document contains two realistic design breakdowns demonstrating the Image Gallery and Lightbox System applied to actual design challenges: a **Creative Photography Portfolio** and an **E-Commerce Product Detail Page (PDP)**.

---

## Example 1: Creative Photography Portfolio (Responsive Grid to Immersive Lightbox)

### The Challenge
An art director wants a photography portfolio website that looks clean, features high-impact photography, and adapts beautifully to mobile devices.
- **The Problem:** Vertical and horizontal photos mixed together in a traditional grid often result in sloppy cropping, leaving heads cut off or key details hidden. Opening images in standard modals often results in portrait-oriented images stretching beyond the viewport, making navigation controls inaccessible.
- **The Solution:** A responsive, aspect-ratio locked grid with custom focal-point positions, transitioning into an optimized, viewport-aware fullscreen lightbox modal.

### Static Gallery Grid Specification
The gallery utilizes a CSS Grid layout with a standardized aspect ratio. Rather than a messy masonry layout that disrupts reading flow, we use a structured modular grid with varying column spans.

```css
/* Container Grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-m); /* Fluid spacing: 24px on desktop, 16px on mobile */
}

/* Individual Portfolio Items */
.portfolio-item {
  grid-column: span 4; /* Default: 3 columns */
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

/* Landscape/Feature Item Span */
.portfolio-item--wide {
  grid-column: span 8; /* Highlight span */
}

/* Aspect Ratio Lock & Image Fit */
.portfolio-item button {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3; /* Fixed layout ratio */
  border: none;
  background: var(--color-surface-muted);
  padding: 0;
  cursor: zoom-in;
}

.portfolio-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover crop without stretching */
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Preserve portrait focal points (prevent chin/head crops) */
.portfolio-item--portrait img {
  object-position: center 20%; /* Keep faces/subjects in upper-middle view */
}

/* Hover/Focus Zoom Affordance */
.portfolio-item button:hover img,
.portfolio-item button:focus-visible img {
  transform: scale(1.05);
}
```

### Fullscreen Lightbox Layout Spec
When a portfolio item button is clicked, the gallery state transitions to the fullscreen lightbox.

```
+------------------------------------------------------------+
|  [Logo / Brand]                                      (X)   | <--- Close Button in Safe Zone (48x48px target)
|                                                            |
|       +--------------------------------------------+       |
|       |                                            |       |
|       |                                            |       |
|  (<)  |               Landscape Image              |  (>)  | <--- Desktop Prev/Next Nav Controls
|       |                 (16:9 or 4:3)              |       |      (4.5:1 Contrast Scrim behind arrows)
|       |                                            |       |
|       |                                            |       |
|       +--------------------------------------------+       |
|                                                            |
|       Sunset Over the Pacific - Pacific Coast Highway      | <--- Captions positioned at safe margins
|                          [ 3 / 12 ]                        | <--- Real-time index counter
+------------------------------------------------------------+
```

#### Viewport-Aware Height Restraint (Critical Design Rule)
To prevent vertical images from running off the screen and hiding controls, the media element inside the lightbox is restrained:

```css
.lightbox-media-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--space-xl) var(--space-m);
}

.lightbox-image {
  max-width: 90vw;
  max-height: 75vh; /* Leaves 25vh for header, caption, and spacing */
  width: auto;
  height: auto;
  object-fit: contain; /* Never crop or stretch in lightbox view */
  border-radius: 2px;
  box-shadow: var(--shadow-xl);
}
```

---

## Example 2: E-Commerce Product Zoom (PDP Grid and Pinch-Zoom Lightbox)

### The Challenge
An e-commerce retailer wants to optimize their Product Detail Page (PDP) gallery.
- **The Problem:** Shoppers on mobile want to inspect product stitching, fabric texture, and small details. If they pinch-zoom or double-tap on an image and it behaves badly, they abandon the cart. Desktop users want hover-zoom, but they also want to launch a distraction-free gallery to view all angles.
- **The Solution:** A dual-mode PDP gallery (Desktop Hover-Zoom + Click-to-launch Fullscreen Lightbox with responsive zoom controls).

### Interaction Flow Breakdown

#### Phase 1: Main PDP Gallery Grid
The page loads with one primary active view and a list of scrollable thumbnails underneath.

```
+----------------------------------+
|                                  |
|                                  |
|          Primary Active          |
|              Image               |
|              (1:1)               |
|                                  |
|                                  |
+----------------------------------+
| [Th 1]  *[Th 2]*  [Th 3]  [Th 4] | <--- Thumbnail carousel. *Th 2* active
+----------------------------------+      with 3px primary border.
```

- **Thumbnail interaction:** Hovering/focusing a thumbnail swaps the primary active image container.
- **Desktop Zoom Affordance:** The mouse cursor changes to `cursor: zoom-in` when hovering the main active image. Clicking launches the Fullscreen PDP Lightbox.

#### Phase 2: Fullscreen PDP Lightbox
Upon click, a high-resolution version of the media is loaded into the Lightbox.

```
+-------------------------------------------------------------+
| PDP Lightbox: Titanium Chronograph Watch              (X)   | <--- Header with Title & Close (Aria-labelled)
|                                                             |
|         +-----------------------------------------+         |
|         |                                         |         |
|         |                                         |         |
|   (<)   |            Active PDP Image             |   (>)   | <--- Big Navigation Margins (desktop only)
|         |              (High-Res Zoom)            |         |
|         |                                         |         |
|         |                                         |         |
|         +-----------------------------------------+         |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  [Th 1]   *[Th 2]*   [Th 3]   [Th 4]   [Th 5]       |   | <--- Lightbox Thumbnail Strip for fast hopping.
|   +-----------------------------------------------------+   |      Highlight indicates current item.
+-------------------------------------------------------------+
```

#### Dual-Gesture Touch Zoom Specs (Mobile Viewports)
When loaded on mobile, the Next/Previous desktop buttons are completely hidden. Instead:
1. **Swipe Left/Right:** Navigates standard slides.
2. **Double-Tap / Pinch-Zoom:** Launches the zoom state.
   - The image scale increases to `scale(2.5)`.
   - The cursor becomes a grabbing icon (`cursor: grab`), and touch drag/mouse drag shifts the image focal point (`object-position` or CSS `translate()`) to allow detailed inspection of textures.
   - Swiping navigation gestures are *temporarily disabled* while zoomed in to prevent accidental slide changes while panning.
   - Double-tapping again (or zooming back out) restores the image to standard scale and re-enables navigation.
