# Responsive Images: Reference Guide

## Browser Selection Logic
When using `srcset` with width descriptors (`w`), the browser follows these steps:

1.  **Look at the `sizes` attribute:** It determines the intended display width of the image based on the current viewport.
2.  **Calculate required physical pixels:** It multiplies the display width by the device pixel ratio (e.g., 2x for Retina).
3.  **Consult `srcset`:** It picks the smallest image in the list that is at least as large as the calculated physical pixel requirement.
4.  **Cache Check:** If a larger version of the image is already in the cache, the browser might choose to use it instead of downloading a smaller one.

## Syntax Comparison

| Feature | `srcset` + `sizes` | `<picture>` + `<source>` |
| :--- | :--- | :--- |
| **Primary Use** | Resolution Switching | Art Direction / Format Switching |
| **Control** | Browser decides based on heuristics | Developer forces based on media queries |
| **Aspect Ratio** | Must be identical across all variants | Can vary across sources |
| **Complexity** | Low to Medium | Medium to High |

## Performance Heuristics
- **LCP (Largest Contentful Paint):** Never lazy-load the LCP image. It should be visible as soon as possible.
- **Async Decoding:** `decoding="async"` allows the browser to continue parsing and rendering HTML while the image is being decoded in the background.
- **Modern Formats:**
  - **AVIF:** Best compression, supports transparency and HDR. Slowest to encode.
  - **WebP:** Great compression, widely supported, supports transparency.
  - **JPG:** Universal fallback. Use "Progressive JPG" for better perceived loading.

## Layout Shift Prevention (CLS)
Modern browsers use the `width` and `height` attributes on an `<img>` tag to calculate the aspect ratio *before* the image has downloaded.

**Rule of Thumb:** Always include the original aspect ratio dimensions in the HTML.
```html
<img src="..." width="1600" height="900">
```

## Accessibility Checklist
1.  **Informative Images:** Use `alt="Descriptive text"`.
2.  **Functional Images (Links/Buttons):** Use `alt` to describe the *action* (e.g., `alt="Search"`).
3.  **Decorative Images:** Use `alt=""`. This tells screen readers to ignore the image entirely.
4.  **Text in Images:** Avoid putting text inside images. If necessary, the `alt` text must contain all the text shown in the image.
