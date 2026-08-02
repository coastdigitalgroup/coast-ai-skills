---
name: image-gallery-and-lightbox-system
description:
  Design and implement a structured, accessible, and responsive image gallery
  and immersive fullscreen lightbox system that supports touch-swipe gestures,
  keyboard navigation, and proper focus management.
---

# Image Gallery and Lightbox System

## Purpose

The Image Gallery and Lightbox System provides a rigorous design methodology for showcasing media collections on the web. It structures how a group of images or videos is presented in a static grid (the gallery) and how those assets transition into a high-impact, distraction-free, fullscreen overlay (the lightbox). This system ensures that visual portfolios, e-commerce product zooms, and case studies remain highly responsive, maintain deep accessibility compliance (WCAG AA), and support physical devices through touch-swipe gestures, keyboard controls, and focus traps.

## Use Cases

- Portfolio sites showcasing photography, artwork, architectural designs, or case studies.
- E-commerce Product Detail Pages (PDPs) requiring large-scale detailed image exploration.
- Content-rich media sites where articles feature interactive photo galleries.
- Event pages and marketing landing pages displaying event photography or testimonial logs.
- Real estate websites presenting properties with high-resolution interior and exterior tours.

## When NOT to Use

- **Single Background or Inline Media:** For standalone, non-grouped background imagery or simple inline article diagrams that do not benefit from a zoom or carousel-style interaction.
- **Data-Heavy Dashboard Views:** When the primary task is sorting or analyzing structured data points (e.g., tables or charts) where a fullscreen overlay would interrupt the workspace. Use `data-table-ui-system` instead.
- **Complex Documents or PDFs:** Where users need to read multi-page text documents; lightboxes are optimized for visual media, not reading-intensive assets.
- **Independent Contextual Modals:** When the dialog contains form inputs, settings, or rich interactive applications rather than structured media. Use `overlay-and-dialog-system` or `settings-interface-system` instead.

## Inputs

1. **Media Inventory:** High-resolution source assets and corresponding low-resolution or compressed thumbnail variants.
2. **Contextual Metadata:** Titles, descriptions, copyright info, captions, and necessary accessibility alternative (`alt`) text.
3. **Responsive Spacing Rules:** Target grid gutters, margins, and layout column rules based on the site's established `responsive-grid-system` and `fluid-spacing-system`.
4. **Interactive Contrast Palette:** Accessible text and icon color specifications (meeting WCAG 4.5:1 minimum contrast) for control overlays, close buttons, and pagination dots.

## Outputs

1. **Gallery Grid Spec:** Defined column layouts, image aspect ratios, hover states, and focal point preservation rules.
2. **Lightbox Anatomy Blueprint:** Structure of the fullscreen overlay, detailing controls (Previous, Next, Close), caption positions, and thumbnail strip layouts.
3. **Gesture & Keyboard Spec:** A complete interaction matrix mapping keyboard events, tap/touch zones, and drag/swipe behaviors.
4. **Accessibility Landmarks Map:** Logical roles (`dialog`, `group`), labels (`aria-label`), focus-trapping rules, and real-time state announcements.

## Workflow

### 1. Build the Gallery Grid Foundation

Start by structuring the primary page gallery to balance scanning and screen real estate:
- **Aspect Ratio Standardization:** Group gallery thumbnails using a uniform aspect ratio (e.g., 1:1 square or 4:3 standard) to establish an orderly rhythm. Use the CSS `aspect-ratio` property to prevent layout jumps.
- **Gaps and Gutters:** Use `fluid-spacing-system` tokens (typically `--space-s` or `--space-m`) for grid gaps.
- **Hover/Focus Affordances:** Apply `interactive-state-system` conventions. When a user hovers or focuses on a thumbnail, trigger a subtle visual change (e.g., zoom scaling, soft overlay contrast, custom search/zoom cursor) to signal that the item is clickable.
- **Semantic HTML:** Structure the gallery using a list wrapper (`<ul>` / `<li>`) with thumbnails marked as `button` elements (or links if indexing/deep-linking is required) to ensure keyboard reachability.

### 2. Design the Fullscreen Lightbox Backdrop

The lightbox backdrop must separate the viewer from the rest of the page:
- **Scrim Layer:** Overlay a solid or slightly translucent backdrop (e.g., `#0a0a0a` with a 95% opacity or a dark backdrop-blur) to eliminate peripheral distractions.
- **Aspect Ratio Preservation:** Position the active image at the absolute center of the viewport. Ensure the container scales dynamically with `max-width: 90vw` and `max-height: 80vh` to fit within any viewport without clipping or cropping the source aspect ratio.
- **Loading State:** Build a centered visual indicator (spinner, loading skeleton, or progress ring) that is aria-aware (`aria-busy="true"`), ensuring users know high-resolution assets are downloading.

### 3. Establish Navigation Controls and Caption Overlay

Position and style overlay elements to optimize ergonomics across desktop and mobile:
- **Close Target:** Position the Close button in the top-right corner. It must have a clear visual boundary, meet a minimum touch target size of 48x48px (or 44x44px per WCAG), and maintain a clear keyboard focus ring.
- **Previous & Next Arrows:** Center navigation arrows vertically on the left and right margins. On mobile devices, hide these arrows or inset them slightly to keep the focus entirely on touch-swipe actions.
- **Captions & Index Indicator:** Place semantic captions and indices (e.g., "Image 3 of 12") at the bottom of the container. Use an `aria-live` container to notify screen readers of change events when the index updates.
- **Thumbnail Strip:** Underneath the main image, display a scrollable row of small thumbnails. Highlight the active item with a thick, high-contrast border and a distinct `:focus` outline.

### 4. Wire Keyboard and Gesture Mechanics

The lightbox must handle desktop peripheral and mobile gesture interaction with equal elegance:
- **Keyboard Mappings:** Ensure immediate support for key controls: `Escape` closes the lightbox, `ArrowRight`/`ArrowDown` triggers "Next", and `ArrowLeft`/`ArrowUp` triggers "Previous".
- **Focus Trapping:** When the lightbox opens, trap keyboard focus within it. Users must not be able to tab back to the background page. The first focused element should be the main dialog container or the Close button.
- **Focus Restoration:** When the lightbox closes, immediately restore focus to the specific thumbnail button that triggered it.
- **Swipe-to-Navigate:** Support smooth swipe-left and swipe-right touch-screen gestures.
- **Swipe-to-Dismiss:** Allow dragging or swiping vertically (up or down) to quickly dismiss the lightbox, replicating native mobile operating system patterns.

### 5. Finalize Accessibility and Document Outlines

Apply advanced ARIA declarations to guarantee a WCAG AA-compliant screen reader experience:
- **Roles & Labels:** Mark the lightbox wrapper with `role="dialog"`, `aria-modal="true"`, and label it using `aria-label` or `aria-labelledby` referencing the title/caption.
- **Background Occlusion:** When the lightbox is active, apply `aria-hidden="true"` to the main page wrapper (`<main>` or `#app-root`) to keep screen reader sweeps isolated within the overlay.
- **Live Updates:** Ensure the image title/caption changes are announced by placing them inside or referencing them via an `aria-live="polite"` zone.

## Decision Rules

- **The Resolution Split:** Thumbnails in the gallery grid must be heavily compressed and appropriately sized (e.g., max-width 600px). The lightbox must load the master high-resolution variant, but only *on demand* (lazy loading the next and previous slides) to save mobile bandwidth.
- **Keyboard vs. Touch Prioritization:** On mobile viewports (widths < 768px), prioritize screen space for the image. Hide desktop UI controls (Next/Prev arrows) in favor of touch-swipe gestures, but always keep a highly visible "Close" button.
- **Infinite Loop vs. Hard Stop:**
  - *Use Infinite Loop (carousel loops back to 1 after the last item)* when showcasing creative portfolios, testimonials, or products where fluid scanning is preferred.
  - *Use Hard Stop (next arrow disabled on the last item)* for step-by-step sequential tutorials, instruction sets, or chronological timelines where directionality is critical.
- **Captions vs. Overlay Space:** If an image has a long description, do not overlay it on top of the image itself. Place it in a dedicated bottom bar below the image bounds, allowing the text to scroll independently if it overflows vertical screen space.
- **Desktop Cursor Affordance:** Change the desktop cursor dynamically:
  - Hovering gallery thumbnails: `cursor: zoom-in`
  - Active lightbox image (zoomable): `cursor: zoom-in` (clicking expands to full resolution, changing the cursor to `cursor: zoom-out` for panning).
  - Hovering lightbox backdrop: `cursor: pointer` (clicking closes the overlay).

## Constraints

- **Responsiveness:** Images must never distort or lose their aspect ratio inside the lightbox. Containers must use flexible viewport units (`vw`/`vh`) and CSS `object-fit: contain` to stay strictly within screen boundaries on all device orientations.
- **Contrast Ratios:** Close, Navigation, and Thumbnail interactive controls must meet a contrast ratio of at least 4.5:1 against the backdrop and image overlays.
- **Focus States:** Every active navigation element must have a visible `:focus-visible` ring. Focus indicators must never be clipped by bounding boxes or adjacent elements.
- **Touch Targets:** Tap targets on mobile devices must meet WCAG 2.2 SC 2.5.8 (at least 24x24px, but 44x44px is strongly preferred for primary actions like Close and Navigation).

## Common Failure Patterns

- **The "Infinite Tab Trap":** Tabbing out of the open lightbox into the background page, which causes screen readers to read invisible content and breaks keyboard navigation.
- **The "Image Overrun":** Tall portrait images expanding past the top or bottom of the mobile viewport, making navigation arrows or close buttons completely unreachable.
- **Focal Point Loss:** Thumbnails in the static gallery cropping out the core subject (e.g., a person's head) due to absolute centered cropping. Solve using `object-position` or custom responsive cropping.
- **The "Dead Escape":** Forgetting to wire the `Escape` key, leaving keyboard-only users stranded inside the modal overlay with no intuitive way to close it.
- **Layout Shift on Open:** The browser scrollbar disappearing when the lightbox opens, causing the entire background page layout to jitter or shift sideways. Solve by adding a matching gutter or scroll-lock padding.
- **No Focus Restoration:** Closing the lightbox resets focus back to the top of the sitemap or the body, forcing keyboard-users to tab through the entire header navigation again to return to where they were.

## Validation Criteria

- [ ] Gallery thumbnails use a standardized aspect ratio and have clear hover/focus indicators.
- [ ] Active lightbox images maintain their aspect ratios and fit perfectly within viewport limits (`max-width: 90vw` and `max-height: 80vh`).
- [ ] Close button and arrows meet a minimum 4.5:1 contrast ratio against the background layer.
- [ ] Keyboard navigation is active: `Escape` closes, `ArrowRight` advances, `ArrowLeft` reverses.
- [ ] Focus is trapped inside the lightbox when open, and restores perfectly to the originating gallery element on close.
- [ ] Touch gestures are enabled: swipe-left/right to navigate, swipe-up/down to dismiss on mobile viewports.
- [ ] Main page wrapper is marked `aria-hidden="true"` when the lightbox modal is active.
- [ ] Loading state spinner is visible and marked `aria-busy="true"` when high-res assets are loading.
