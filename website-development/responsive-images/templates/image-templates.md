# Responsive Image Templates

Use these snippets as starting points for common image implementation patterns.

## 1. Standard Fluid Responsive Image (The "Go-To")
Use this for the majority of content images.

```html
<img
  src="${DEFAULT_IMAGE_URL}"
  srcset="${IMAGE_W_400} 400w,
          ${IMAGE_W_800} 800w,
          ${IMAGE_W_1200} 1200w"
  sizes="(max-width: ${MOBILE_BREAKPOINT}px) 100vw, ${MAX_CONTENT_WIDTH}px"
  alt="${DESCRIPTIVE_ALT_TEXT}"
  width="${ORIGINAL_WIDTH}"
  height="${ORIGINAL_HEIGHT}"
  loading="lazy"
  decoding="async"
>
```

---

## 2. Art-Directed Hero Component
Use this for images that change aspect ratio or content between mobile and desktop.

```html
<picture>
  <!-- Desktop Variant -->
  <source
    media="(min-width: 1024px)"
    srcset="${DESKTOP_IMAGE_URL}"
    width="${DESKTOP_WIDTH}"
    height="${DESKTOP_HEIGHT}"
  >
  <!-- Mobile/Fallback Variant -->
  <img
    src="${MOBILE_IMAGE_URL}"
    alt="${HERO_ALT_TEXT}"
    width="${MOBILE_WIDTH}"
    height="${MOBILE_HEIGHT}"
    fetchpriority="high"
  >
</picture>
```

---

## 3. Prevents Layout Shift (CSS)
Always pair your HTML with CSS to ensure images behave predictably.

```css
/* Base responsive image styles */
img {
  max-width: 100%;
  height: auto; /* Works with width/height attributes to preserve ratio */
  display: block;
}

/* Aspect ratio container (Modern approach) */
.image-container {
  aspect-ratio: 16 / 9;
  background-color: #f0f0f0; /* Placeholder color while loading */
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 4. Audit Checklist (Template)
Use this when reviewing an existing implementation.

| Check | Requirement | Pass/Fail |
| :--- | :--- | :--- |
| **Alt Text** | `alt` attribute present (can be `""` if decorative) | |
| **Dimensions** | `width` and `height` attributes set | |
| **srcset** | Multiple resolutions provided for bandwidth savings | |
| **sizes** | `sizes` attribute matches actual rendered layout | |
| **Lazy Loading** | `loading="lazy"` used for non-critical images | |
| **LCP** | `fetchpriority="high"` used for the main hero image | |
| **Formats** | Modern formats (WebP/AVIF) served where possible | |
