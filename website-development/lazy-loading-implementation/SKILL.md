---
name: lazy-loading-implementation
description:
  Implement, configure, and debug performant lazy-loading strategies for images,
  iframes, and CSS background assets using native APIs and IntersectionObserver
  while avoiding layout shifts, accessibility regressions, and LCP issues.
---

# Lazy Loading Implementation

## Purpose

The Lazy Loading Implementation skill provides a technical protocol for progressively loading non-critical page assets (images, video elements, iframes, and CSS background resources) only when they are near or within the user's active viewport. This directly improves critical web performance metrics, specifically Page Load Time, Speed Index, and Largest Contentful Paint (LCP) by freeing up main-thread bandwidth during initial render. It also provides guidance on preventing Cumulative Layout Shift (CLS) and ensuring search engine optimization (SEO) compliance.

## Use Cases

- **Asset-Heavy Web Pages:** E-commerce product listing pages (PLPs), editorial/blog articles with multiple embedded graphics, and portfolio pages.
- **Embedded Content:** Embedded Google Maps, YouTube videos, Twitter feeds, or third-party advertising slots that should not block initial DOM parsing.
- **Stylized Layouts:** Large hero containers or card groups utilizing CSS background images that can be lazy-loaded on scroll.
- **Data/Bandwidth Savings:** Websites optimized for mobile-first configurations where users pay for metered data plans.

## When NOT to Use

- **Largest Contentful Paint (LCP) Elements:** Never lazy-load above-the-fold media or elements identified as (or highly likely to be) the LCP element (typically the primary banner image). This introduces significant fetch delay and hurts performance scores.
- **Critical Global Navigation & Logos:** Site headers, logos, and critical UI control elements must be fetched immediately to prevent awkward visual loading states or content flashing.
- **Small SVG Icons:** Inline SVGs, icon systems, or decorative vector graphics under ~4KB do not justify the scripting overhead or the HTTP request delay of lazy-loading.
- **Extremely Short Pages:** Pages where all elements are visible on the initial screen width/height (above-the-fold) do not benefit from lazy-loading.

## Inputs

1. **Target Assets:** The asset URLs and their context (e.g., standard `<img>` tags, parent block elements with CSS background-image, or `<iframe>` tags).
2. **Dimension Constraints:** The intrinsic aspect-ratio or explicitly defined width and height of each asset to reserve page layout space.
3. **Threshold Preferences:** The desired margin/distance from the viewport (e.g., `rootMargin: "200px 0px"`) before starting the fetch.
4. **Visual Transition Requirements:** Transition states (e.g., placeholders, low-resolution image proxies, skeleton states) and CSS animations (e.g., fade-in effect).

## Outputs

1. **Semantic HTML Markup:** `<img>` and `<iframe>` markup equipped with native `loading="lazy"` attributes, proper dimensions (`width` and `height`), and `<noscript>` fallbacks.
2. **Dynamic IntersectionObserver Utility:** JavaScript to handle progressive loading of CSS background assets, dynamic HTML blocks, and advanced script loading with performance-optimized offsets.
3. **Layout Stability Styling:** CSS techniques (e.g., `aspect-ratio` or aspect-ratio padding boxes) to prevent visual layout shifts when loading completes.
4. **Smooth Entry Animation rules:** CSS rules that gracefully transition assets from low-opacity or blurred states once loaded.

## Workflow

### 1. Identify and Categorize the Assets
Divide all page media and embeds into three distinct categories:
- **Critical Above-the-Fold (Primary):** Must load eagerly. No lazy-loading attributes.
- **Standard Below-the-Fold Images & Iframes (Inline):** Leverage native browser-level lazy-loading.
- **Dynamic Elements (Non-standard):** Elements requiring JS intervention (e.g., CSS background images, heavy third-party dynamic dynamic frames, and dynamic components).

### 2. Implement Native Lazy Loading (For Standard Images & Iframes)
Configure `loading="lazy"` native attribute on `<img>` and `<iframe>` elements.
```html
<!-- Native Image Lazy Loading with Layout Stability and Async Decoding -->
<img
  src="hero-fallback.jpg"
  srcset="hero-300w.jpg 300w, hero-800w.jpg 800w"
  sizes="(max-width: 600px) 100vw, 800px"
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
  alt="Detailed description of the image content"
  class="lazy-media"
/>
```
- **Constraint:** Ensure `width` and `height` attributes are present to establish a default aspect ratio for the browser's layout engine before rendering.

### 3. Implement Custom IntersectionObserver (For Background Images & Complex Layouts)
For CSS background images or complex widgets that cannot use native `loading="lazy"`, establish a custom intersection observer with an optimized viewport threshold.

- **Markup:** Use data-attributes (`data-bg` or `data-src`) and a placeholder state.
  ```html
  <div class="lazy-bg-container" data-bg="assets/large-bg.jpg">
    <!-- Overlay/Fallback Content -->
  </div>
  ```
- **IntersectionObserver Setup:** Initialize a lightweight, unified observer with a healthy `rootMargin` (usually `200px` to `400px` depending on average connection speeds) so assets are preloaded *before* they scroll directly into view.
  ```javascript
  const bgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const bgUrl = container.getAttribute('data-bg');
        if (bgUrl) {
          container.style.backgroundImage = `url('${bgUrl}')`;
          container.classList.add('bg-loaded');
        }
        observer.unobserve(container); // Terminate observing once loaded
      }
    });
  }, {
    rootMargin: '300px 0px 300px 0px', // Preload 300px before entry
    threshold: 0.01
  });
  ```

### 4. Mitigate Layout Shift (CLS)
Prevent the surrounding text and structural blocks from jumping when a media asset successfully resolves.
- **Aspect Ratio Rule:** Declare structural layout sizes directly in your stylesheet using the CSS `aspect-ratio` property, or set physical dimension attributes directly on the HTML tag.
- **Sizing CSS Pattern:**
  ```css
  .lazy-media {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9; /* Matches original asset aspect ratio */
    background-color: #f3f4f6; /* Gray placeholder background */
  }
  ```

### 5. Add Non-JS Fallbacks (`<noscript>`)
Search engine spiders (without full JS rendering capabilities) and users with JavaScript blocked or disabled must still receive functional image assets.
- **`<noscript>` Integration Pattern:**
  ```html
  <div class="lazy-image-wrapper">
    <img
      src="placeholder-lowres.jpg"
      data-src="full-resolution.jpg"
      loading="lazy"
      alt="Description"
      class="js-lazy-load"
    />
    <noscript>
      <img src="full-resolution.jpg" alt="Description" />
    </noscript>
  </div>
  ```
- **CSS Rule for Noscript:**
  If using JavaScript to swap data-attributes, hide the empty/placeholder element inside the stylesheet when Javascript is disabled, revealing the `<noscript>` block cleanly.
  ```css
  .no-js .js-lazy-load {
    display: none;
  }
  ```

### 6. Polish the Visual Loading Experience
A sudden, high-contrast visual "pop" of a loaded asset can degrade perceived user experience. Use CSS transitions to gracefully transition loaded images.
- **Fade-In Styling Rule:**
  ```css
  .lazy-media {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  .lazy-media[loading="lazy"] {
    /* If supported naturally, browser can handle */
  }
  /* For custom JS loader or once native image fires 'load' event */
  .lazy-media.loaded {
    opacity: 1;
  }
  ```

---

## Decision Rules

### When to use Native vs. Custom Lazy-Loading

| Feature Context | Native `loading="lazy"` | Custom `IntersectionObserver` |
| :--- | :--- | :--- |
| **Standard Inline Image (`<img>`)** | **Yes (Default)** | No (Avoid scripting overhead) |
| **Standard Frame/Iframe (`<iframe>`)** | **Yes (Default)** | No (Avoid scripting overhead) |
| **CSS Background Images (`background-image`)** | No (Unsupported by spec) | **Yes** (Essential) |
| **Dynamic JS Scripts/Modules** | No | **Yes** (Load script on scroll/proximity) |
| **Strict Custom Preload Offsets** | No (Browser controls distance threshold) | **Yes** (Configure precise `rootMargin`) |
| **Complex Callback Triggering** | No | **Yes** (Execute custom analytic/pixel tracking on load) |

---

## Constraints

- **Single Global Observer:** Do not instantiate a separate `IntersectionObserver` instance for every lazy-loaded element. Maintain a single, shared observer instance and register elements to it to minimize memory usage and avoid frame-rate drops.
- **Browser Compatibility:** Native `loading="lazy"` is universally supported across evergreen browsers (Chrome, Safari 15.4+, Firefox, Edge). For legacy environments, fall back gracefully to the original URL or a lightweight IntersectionObserver polyfill.
- **Decoding Delay:** Always add `decoding="async"` on heavy inline images to prevent the image decoding process from blocking main thread render ticks.
- **Print Layouts:** Lazy-loaded elements utilizing data-attributes will not resolve when a page is printed. Developers must run a window event listener for `beforeprint` and force-load all lazy assets.

---

## Non-Goals

- Creating a server-side image resizing, optimization, or cropping microservice.
- Building custom, full-featured Javascript libraries that replicate native scroll or viewport calculations.
- Handling client-side image cache validation protocols.

---

## Common Failure Patterns

- **Lazy-Loading Above-the-Fold Assets (LCP Regression):** Applying `loading="lazy"` to the main banner image. This causes a delay while the browser waits for layout and script execution before starting the image fetch, increasing LCP by 500ms–2000ms.
- **Missing Asset Dimensions (Layout Shifts):** Omitting `width`/`height` or CSS `aspect-ratio` attributes on standard lazy-loaded containers. When the image fetches, it shifts neighboring content downwards, hurting CLS scores.
- **Infinite Loading Loops / Jittering:** Putting the observer's target inside a container that collapses when empty. When hidden, the height is 0px, causing it to fall out of the viewport, which cancels the load, which changes the height, causing infinite layout loops.
- **Overloading Observers:** Instantiating dozens of separate `new IntersectionObserver()` structures instead of a single class-level static observer. This exhausts GPU resources and main-thread cycles.
- **Missing Accessibility/No-JS Support:** Failing to include `<noscript>` alternatives, meaning search engines and privacy-focused users see blank gray blocks.

---

## Validation Criteria

- [ ] **LCP Visual Load Check:** Open the **Network** tab in Chrome DevTools. Filter by "Img" and reload. Ensure that above-the-fold assets are requested immediately (status `200` or `304`) and below-the-fold lazy assets are *not* requested initially.
- [ ] **On-Scroll Loading Verification:** Scroll the page slowly while keeping the Network panel open. Observe that new image assets are requested sequentially *before* they enter the visible boundary of the viewport.
- [ ] **Cumulative Layout Shift (CLS) Audit:** Enable "Layout Shift Regions" in Chrome DevTools (Rendering panel). Scroll down and confirm that loading assets does *not* trigger purple visual flashes indicating layout shifts.
- [ ] **Javascript Disabled Verification:** Toggle JavaScript off in the browser's developer console and reload. Ensure all image assets still render correctly (via `<noscript>` execution).
- [ ] **Performance Profile Trace:** Run a trace in the Performance panel. Verify there are no long-running tasks (>50ms) stemming from the IntersectionObserver callbacks during scrolling.
