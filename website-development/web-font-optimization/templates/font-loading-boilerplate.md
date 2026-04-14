# Optimized @font-face Template

Use this template as a starting point for self-hosting optimized web fonts.

## 1. CSS Template

```css
/**
 * Optimized @font-face Template
 * 1. Subset your fonts to include only the characters you need.
 * 2. Convert to WOFF2.
 * 3. Use 'font-display: swap' for better performance.
 */

@font-face {
  font-family: 'YOUR_FONT_NAME';
  font-style: normal;
  font-weight: 400; /* Regular */
  font-display: swap;
  src: url('../fonts/your-font-regular.woff2') format('woff2');
  /* unicode-range: U+0000-00FF, U+0131, ...; (Optional but recommended) */
}

@font-face {
  font-family: 'YOUR_FONT_NAME';
  font-style: normal;
  font-weight: 700; /* Bold */
  font-display: swap;
  src: url('../fonts/your-font-bold.woff2') format('woff2');
}

/* Fallback adjustment to prevent CLS */
@font-face {
  font-family: 'YOUR_FONT_NAME-Fallback';
  src: local('Arial'); /* Or another common system font */
  size-adjust: 100%; /* Calibrate this value */
}

:root {
  --font-primary: 'YOUR_FONT_NAME', 'YOUR_FONT_NAME-Fallback', sans-serif;
}
```

## 2. HTML Preload Template

Place this in the `<head>` BEFORE your CSS links for the most critical 1-2
fonts.

```html
<!-- Critical Font Preload -->
<link
  rel="preload"
  href="/fonts/your-font-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

## 3. Optimization Checklist

- [ ] Font files are in **WOFF2** format.
- [ ] Font files are **subsetted** (e.g., Latin-only).
- [ ] `font-display: swap` is applied.
- [ ] Only used **weights** and **styles** are being loaded.
- [ ] **Preload** is used for the primary body/heading font.
- [ ] `crossorigin` attribute is present on all `<link rel="preload">` tags.
- [ ] Fonts are **self-hosted** to avoid extra DNS lookups.
