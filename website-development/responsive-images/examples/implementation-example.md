# Responsive Images Implementation Examples

This document demonstrates two primary patterns: Resolution Switching and Art Direction.

## 1. Resolution Switching (Fluid Layout)

**Problem:** A blog post feature image needs to be sharp on all screens but shouldn't waste bandwidth on small devices.

**Solution:** Use `srcset` with width descriptors and a `sizes` attribute that matches the layout.

```html
<!--
  Layout Logic:
  - Mobile: 100vw
  - Desktop ( > 800px): Fixed at 750px
-->
<img
  src="blog-feature-800.jpg"
  srcset="blog-feature-400.jpg 400w,
          blog-feature-800.jpg 800w,
          blog-feature-1200.jpg 1200w,
          blog-feature-1600.jpg 1600w"
  sizes="(max-width: 800px) 100vw, 750px"
  alt="A detailed description of the blog feature image"
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
  style="width: 100%; height: auto; display: block;"
>
```

---

## 2. Art Direction + Modern Formats

**Problem:** A hero image needs a wide landscape crop on desktop and a tight square crop on mobile. It should also use AVIF/WebP where supported.

**Solution:** Use the `<picture>` element to manage media queries and format types.

```html
<picture>
  <!-- Desktop: AVIF -->
  <source
    media="(min-width: 1024px)"
    srcset="hero-desktop.avif"
    type="image/avif"
  >
  <!-- Desktop: WebP -->
  <source
    media="(min-width: 1024px)"
    srcset="hero-desktop.webp"
    type="image/webp"
  >
  <!-- Desktop: JPG Fallback -->
  <source
    media="(min-width: 1024px)"
    srcset="hero-desktop.jpg"
  >

  <!-- Mobile: AVIF -->
  <source
    srcset="hero-mobile.avif"
    type="image/avif"
  >
  <!-- Mobile: WebP -->
  <source
    srcset="hero-mobile.webp"
    type="image/webp"
  >

  <!-- Fallback Image (also handles Mobile JPG) -->
  <img
    src="hero-mobile.jpg"
    alt="People working together in a bright office"
    width="600"
    height="600"
    fetchpriority="high"
  >
</picture>
```

### Key Takeaways from this Example:
1.  **Order Matters:** Browsers take the first `<source>` that matches. List modern formats (AVIF, WebP) before standard ones (JPG/PNG).
2.  **LCP Optimization:** Note `fetchpriority="high"` on the hero image to signal its importance for the Largest Contentful Paint.
3.  **Fallback:** The `<img>` tag is mandatory. It provides the fallback for browsers that don't support `<picture>` and is where the `alt` text and dimensions live.
