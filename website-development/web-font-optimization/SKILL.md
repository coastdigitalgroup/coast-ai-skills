---
name: web-font-optimization
description:
  Implement and debug optimized web font loading to improve performance, prevent
  layout shifts (CLS), and ensure text visibility.
---

# Web Font Optimization

## Purpose

The Web Font Optimization skill ensures that custom typography is delivered
efficiently without compromising the user experience. It focuses on reducing
font file sizes, ensuring text remains visible during loading, and preventing
Cumulative Layout Shift (CLS) caused by font swaps.

## Use Cases

- Implementing self-hosted web fonts for privacy, performance, or offline
  capabilities.
- Fixing Cumulative Layout Shift (CLS) issues specifically related to font
  loading.
- Reducing the Largest Contentful Paint (LCP) by optimizing critical font
  assets.
- Migrating from third-party font services (e.g., Google Fonts) to self-hosted
  assets for better control.
- Auditing and debugging "invisible text" (FOIT) or "jumping text" (FOUT).

## When NOT to Use

- **System Font Stacks:** If the project uses only native system fonts (e.g.,
  `system-ui`, `Arial`, `sans-serif`), no optimization is needed.
- **Internal/Low-Traffic Tools:** Where performance and layout stability are not
  critical requirements.
- **Single-Page Proofs of Concept:** Where the overhead of optimization
  outweighs the benefits for a temporary project.

## Inputs

1. **Font Assets:** Raw font files (OTF, TTF) or existing web font formats.
2. **Design Specs:** Which weights (400, 700) and styles (normal, italic) are
   actually used.
3. **Target Audience:** Browser support requirements (determines format and
   feature needs).
4. **Performance Targets:** Specific goals for LCP and CLS.

## Outputs

1. **Optimized Assets:** Subsetted WOFF2 files.
2. **@font-face Declarations:** CSS with correct `font-display` and property
   mapping.
3. **Resource Hints:** `<link rel="preload">` or `<link rel="preconnect">` tags.
4. **Layout Shift Mitigation:** CSS using `size-adjust` and `ascent-override`
   for fallback fonts.

## Workflow

### 1. Audit and Inventory

- Identify every font file currently being loaded.
- Map which weights/styles are used in the CSS.
- Remove any fonts or weights that are not actively used.

### 2. Format and Subset

- **Convert to WOFF2:** Use WOFF2 as the primary format (highest compression,
  widely supported).
- **Subset:** Remove unused glyphs (e.g., keep only Latin characters if that is
  the project scope) to drastically reduce file size.
- **Variable Fonts:** If multiple weights are needed, consider a single Variable
  Font file instead of 5+ individual files.

### 3. Implement `@font-face`

- Use `font-display: swap;` to ensure text is visible immediately using a
  fallback font.
- Define `font-weight` and `font-style` explicitly to match the assets.
- Ensure the `src` path is correct and uses relative paths for self-hosted
  fonts.

### 4. Optimize Loading Strategy

- **Preload Critical Fonts:** Add
  `<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>` for
  fonts used above the fold (e.g., the primary heading font).
- **Limit Preloads:** Preload only the most critical 1-2 files to avoid
  bandwidth contention.

### 5. Mitigate Layout Shift (CLS)

- Use modern CSS properties (`size-adjust`, `ascent-override`,
  `descent-override`) on a `@font-face` declaration for the fallback font to
  match the dimensions of the custom font.
- This prevents the page from "jumping" when the custom font swaps in.

## Decision Rules

- **Self-Hosting vs. CDN:** Always prefer self-hosting for better performance
  (avoids extra DNS/TCP/TLS connections) and privacy compliance (GDPR).
- **font-display strategy:** Use `swap` for body text (readability first). Use
  `block` only for icon fonts where a fallback character is meaningless. Use
  `optional` for non-critical decorative fonts.
- **Subsetting:** If the site is multi-lingual, ensure the subset includes all
  necessary character ranges (Unicode ranges).

## Constraints

- **CORS:** Preloaded fonts must include the `crossorigin` attribute even if
  they are on the same domain.
- **Browser Support:** WOFF2 is supported in all modern browsers; provide WOFF
  as a fallback only if legacy support (IE11) is required.
- **File Size:** Aim for font files under 30KB per subsetted weight.

## Non-Goals

- Selecting or designing typefaces (Typography Design).
- Implementing complex canvas-based text rendering.
- Managing server-side HTTP headers (though they are related, this skill focuses
  on the frontend implementation).

## Common Failure Patterns

- **FOIT (Flash of Invisible Text):** Defaulting to `font-display: auto` which
  often hides text for up to 3 seconds.
- **FOUT (Flash of Unstyled Text) without Mitigation:** Text swaps in but causes
  a massive layout shift because the fallback and custom fonts have different
  heights.
- **Preloading Everything:** Preloading 10 font files, which delays the loading
  of the CSS and JavaScript.
- **Missing `crossorigin`:** Preload fails or downloads the font twice because
  the `crossorigin` attribute was omitted.
- **Redundant Weights:** Loading "Semi-Bold" when it's never used in the UI.

## Validation Steps

- [ ] **Lighthouse Check:** Run a performance audit and check for "Eliminate
      render-blocking resources" or "Preload key requests" related to fonts.
- [ ] **CLS Measurement:** Use Chrome DevTools "Performance" tab to ensure
      "Layout Shift" is near zero during font swap.
- [ ] **Network Analysis:** Verify that only the necessary WOFF2 files are
      downloaded and that they are compressed.
- [ ] **Text Visibility:** Throttling the network to "Slow 3G" to verify that
      fallback text appears immediately.
- [ ] **Subset Check:** Verify that the font file size is significantly smaller
      than the original unoptimized version.
