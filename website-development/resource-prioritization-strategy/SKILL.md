---
name: resource-prioritization-strategy
description:
  Optimize the browser's loading sequence by explicitly signaling asset
  importance using fetchpriority, preload, and prefetch to improve Core Web
  Vitals.
---

# Resource Prioritization Strategy

## Purpose

The Resource Prioritization Strategy skill provides a technical framework for
orchestrating how the browser discovers and downloads assets. It solves the
"resource contention" problem where secondary assets (like tracking scripts or
background images) compete for bandwidth with critical path elements, leading
to slow Largest Contentful Paint (LCP) and high Total Blocking Time (TBT).

## Use Cases

- Optimizing the LCP image to appear as early as possible.
- Reducing the "Flash of Unstyled Text" (FOUT) by prioritizing critical fonts.
- Speeding up initial page execution by managing `async` and `defer` scripts.
- Speculatively loading assets for the user's next likely navigation.
- Debugging "late discovery" of critical assets (e.g., fonts buried in CSS).

## When NOT to Use

- **Small, Simple Pages:** If a page has very few assets and already loads
  instantly, adding prioritization hints adds maintenance overhead for
  negligible gain.
- **Third-Party Script Control:** You cannot use `fetchpriority` on scripts
  injected by third-party libraries that you don't control (though you can
  prioritize the initial loader).
- **HTTP/1.1 Environments:** While still somewhat useful, these strategies are
  most effective in HTTP/2 and HTTP/3 environments where multiplexing allows
  true prioritization.

## Inputs

1. **Performance Audit:** LCP element identification and a waterfall chart
   showing resource discovery times.
2. **Asset Inventory:** List of critical (LCP image, fonts, primary CSS) vs.
   non-critical (analytics, ads, footer images) assets.
3. **User Flow:** Knowledge of the most common next steps for speculative
   loading (`prefetch`).

## Outputs

1. **Prioritized Markup:** HTML implementation of `fetchpriority`, `<link rel="preload">`, and `<link rel="prefetch">`.
2. **Script Loading Strategy:** Optimized `<script>` tags using `async` or
   `defer`.
3. **Warm-up Hints:** Implementation of `preconnect` and `dns-prefetch` for
   cross-origin critical assets.

## Workflow

### 1. Identify the LCP Element
Use DevTools "Performance" or "Lighthouse" to identify the LCP element (usually
a hero image or a large text block).

### 2. Elevate Critical Assets
- **LCP Image:** Apply `fetchpriority="high"` directly to the `<img>` or
  `<picture>` tag.
- **Critical Fonts:** Use `<link rel="preload" as="font" type="font/woff2" crossorigin>`
  in the `<head>` to ensure fonts start loading before the CSS is fully parsed.

### 3. Manage Resource Discovery
- **Late Discovery:** If a critical image is defined in CSS (e.g., `background-image`),
  the browser won't see it until the CSS is downloaded and parsed. Use
  `<link rel="preload" as="image" href="...">` to move it to the front of the queue.

### 4. Optimize Script Execution
- **Non-Critical JS:** Use `defer` for scripts that are needed for functionality
  but don't affect the initial render.
- **Independent Scripts:** Use `async` for scripts like analytics that can run
  whenever they arrive without blocking the parser.

### 5. Speculative Loading
- **Next Page:** Use `<link rel="prefetch" href="...">` for assets needed on the
  user's most likely next page (e.g., the product page from a listing).

### 6. Warm-up Cross-Origin Connections
- For assets on different domains (CDNs, Google Fonts), use `preconnect` to
  handle DNS, TCP, and TLS handshakes early.

## Decision Rules

- **Preload vs. Fetchpriority:** Use `preload` for assets the browser *doesn't
  know about yet* (late discovery). Use `fetchpriority` for assets the browser
  *already sees* but needs to prioritize higher than its default.
- **Async vs. Defer:** Use `defer` for scripts that depend on the DOM or other
  scripts. Use `async` for completely independent scripts.
- **Preconnect vs. DNS-Prefetch:** Use `preconnect` for the 1-2 most critical
  cross-origin domains. Use `dns-prefetch` as a fallback or for less critical
  domains to save resources.

## Constraints

- **Preload Limit:** Do not preload more than 2-3 essential resources. Over-using
  preload causes "bandwidth contention" where the browser struggles to load
  everything at once, potentially slowing down the very thing you tried to speed
  up.
- **Correct 'as' Attribute:** When preloading, you MUST provide the correct `as`
  attribute (e.g., `as="style"`, `as="script"`, `as="font"`) or the browser will
  download the resource twice.
- **CORS for Fonts:** Fonts MUST always include the `crossorigin` attribute in
  the preload link, even if they are on the same domain.

## Non-Goals

- Image compression or format conversion (see `responsive-images`).
- General CSS or JS minification.
- Server-side performance tuning (TTFB).

## Common Failure Patterns

- **Preloading Everything:** Turning the "priority" queue into a second
  bottleneck by preloading 10+ assets.
- **Double Downloads:** Missing the `as` attribute or mismatched URLs in preload
  vs. actual usage.
- **Prioritizing Below-the-Fold:** Setting `fetchpriority="high"` on images the
  user can't see, stealing bandwidth from the LCP.
- **Async LCP Scripts:** Marking the script that renders the LCP content as
  `async`, leading to unpredictable rendering times.

## Validation Criteria

- [ ] **Waterfall Audit:** Verify in the Network tab that preloaded assets and
      `fetchpriority="high"` assets start downloading earlier and have a
      higher priority than before.
- [ ] **Console Check:** Ensure no "Preload was created but not used within a
      few seconds" warnings appear in the DevTools console.
- [ ] **Core Web Vitals Test:** Verify LCP improvement using Lighthouse or
      PageSpeed Insights.
- [ ] **Unused Preload Test:** Confirm that preloaded assets are actually used
      by the page and not wasted bytes.
