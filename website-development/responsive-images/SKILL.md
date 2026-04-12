---
name: responsive-images
description: Implement and debug responsive images using srcset, sizes, and the <picture> element to optimize performance, handle art direction, and prevent layout shifts.
---

# Responsive Images

## Purpose
The Responsive Images skill ensures that websites deliver the most appropriate image assets based on the user's device capabilities (screen resolution, viewport size) and connection speed. It focuses on reducing bandwidth usage, improving page load times, and maintaining visual intent through art direction.

## Use Cases
- Implementing a multi-resolution image gallery to serve high-DPI assets only when needed.
- Using "art direction" to provide different image crops for mobile vs. desktop layouts.
- Modernizing a site to use next-gen formats (WebP/AVIF) with standard fallbacks.
- Fixing Cumulative Layout Shift (CLS) caused by images without defined dimensions.

## When NOT to Use
- **Purely Decorative Graphics:** Use CSS background images or SVGs for simple patterns or icons that don't require multiple resolutions.
- **Fixed-Size Small Icons:** Standard SVGs or icon fonts are usually better than responsive raster images for small, consistent UI elements.
- **Dynamic User-Generated Content (without a backend/CDN):** If images are uploaded by users and not processed by an image service, the frontend cannot magically create responsive variants.

## Inputs
1. **Source Assets:** A set of image URLs at different widths and/or formats.
2. **Layout Requirements:** How the image should appear at different breakpoints (e.g., full width on mobile, 33vw on desktop).
3. **Art Direction Needs:** Whether the image needs to be cropped or swapped entirely for different screen orientations or sizes.

## Outputs
1. **HTML Markup:** Optimized `<img>` with `srcset`/`sizes` or `<picture>` element with `<source>` children.
2. **CSS Rules:** Styling for aspect-ratio preservation and layout integration.
3. **Accessibility Metadata:** Meaningful `alt` text and appropriate loading strategies.

## Workflow

### 1. Determine Image Role
- **Resolution Switching:** Same image content, different sizes. Use `<img>` with `srcset` and `sizes`.
- **Art Direction:** Different image content/cropping for different breakpoints. Use `<picture>`.
- **Format Support:** Serving WebP/AVIF to capable browsers. Use `<picture>`.

### 2. Prepare `srcset` (Resolution Switching)
- List available image widths (e.g., `image-400.jpg 400w, image-800.jpg 800w`).
- Provide a default `src` for legacy browsers.

### 3. Calculate `sizes` Attribute
- Define how wide the image will be on the screen relative to the viewport.
- Match CSS media queries (e.g., `(max-width: 600px) 100vw, 33vw`).
- *Critical:* `sizes` tells the browser how big the image *will* be before it downloads the CSS.

### 4. Implement Art Direction (if needed)
- Use `<picture>` with `<source media="(...)">`.
- Always include a final `<img>` tag inside `<picture>` as the fallback and for accessibility.

### 5. Prevent Layout Shift
- Apply `width` and `height` attributes to the `<img>` tag to provide an aspect ratio.
- Use CSS `aspect-ratio` or a wrapper for modern layout control.

### 6. Optimize Loading
- Use `loading="lazy"` for images below the fold.
- Use `fetchpriority="high"` for the Largest Contentful Paint (LCP) image.
- Ensure `decoding="async"` is used for non-critical images.

## Decision Rules
- **srcset vs. <picture>:** Use `srcset` for 90% of cases where you just want the browser to pick the best size. Use `<picture>` ONLY when you need to change the image content (Art Direction) or serve different file formats.
- **Width Descriptors (w) vs. Pixel Density (x):** Prefer `w` descriptors and the `sizes` attribute for fluid layouts. Use `x` descriptors (e.g., `1x, 2x`) only for fixed-width images.
- **Alt Text:** If the image is informative, describe it. If it is decorative, use `alt=""`.

## Constraints
- **Aspect Ratio Consistency:** For `srcset`, all images should ideally have the same aspect ratio. If they don't, use `<picture>` to avoid stretching/misalignment.
- **Browser Priority:** Browsers pick the image from `srcset` based on their own heuristics (including connection speed in some cases); you cannot "force" a specific download from a `srcset`.

## Non-Goals
- Building an automated image processing pipeline (resizing, compression).
- Implementing client-side JavaScript "lazy loaders" (native `loading="lazy"` is preferred).
- Managing a Content Delivery Network (CDN).

## Common Failure Patterns
- **Missing `sizes`:** If `srcset` uses `w` descriptors but `sizes` is missing, browsers default to `100vw`, often downloading images that are too large.
- **Wrong `sizes` Values:** Providing a `sizes` value that doesn't match the actual CSS-rendered width of the image.
- **Invalid `srcset` Syntax:** Mixing `w` and `x` descriptors in the same `srcset` attribute.
- **Forgotten `alt`:** Failing to provide an `alt` attribute (even an empty one), which causes screen readers to announce the file name.
- **CLS Issues:** Not defining `width` and `height` on the `<img>`, causing the page to jump as images load.

## Validation Steps
- [ ] **Network Inspector Test:** Open DevTools, set "Throttling" to a mobile profile, and verify that a smaller image variant is downloaded.
- [ ] **Resolution Test:** Check that a high-DPI screen (like Retina) downloads a @2x or @3x version.
- [ ] **Art Direction Test:** Resize the browser window and verify the image content changes at the specified breakpoints.
- [ ] **Lighthouse/PageSpeed Audit:** Verify no "Properly size images" or "Avoid enormous network payloads" warnings.
- [ ] **Layout Shift Test:** Use "Show layout shift regions" in Chrome DevTools to ensure the image doesn't cause shifting.
- [ ] **Accessibility Check:** Verify `alt` text is present and meaningful.
