---
name: speculation-rules-prerendering
description:
  Implement and manage the Speculation Rules API to speculatively prefetch and
  prerender full pages for instant navigations while safely guarding against
  background side effects like analytics double-counting, media playback, and network waste.
---

# Speculation Rules & Prerendering

## Purpose

The Speculation Rules & Prerendering skill provides a production-grade frontend protocol for achieving near-instantaneous (sub-100ms) page navigations using the W3C Speculation Rules API (`<script type="speculationrules">`).

Unlike legacy resource hints (`<link rel="prefetch">` or `<link rel="prerender">`), Speculation Rules offer programmatic JSON-based heuristics, document-level link matching, flexible eagerness levels (`immediate`, `eager`, `moderate`, `conservative`), and full background page prerendering. This skill resolves critical edge cases associated with background execution: preventing premature analytics page-view triggers, blocking background audio/video playback, deferring non-idempotent state mutations, and throttling speculative activity under constrained network or battery conditions.

---

## Use Cases

- **E-Commerce Conversion Paths:** Speculatively prerendering high-intent Product Detail Pages (PDPs) or checkout steps from category pages or cart drawers when a user hovers over a primary CTA button.
- **Content Portals & Publishing:** Prerendering top news articles or next-chapter pages as users scroll near the bottom of an article.
- **Documentation & SaaS Dashboards:** Prefetching or prerendering primary navigation destinations (e.g., settings, analytics dashboard) based on user pointer interaction.
- **Search & Filter Interfaces:** Prerendering the top search result link on hover or focus to eliminate perceived latency.

---

## When NOT to Use

- **Authenticated State Changes / Non-Idempotent Actions:** Never target URLs that trigger immediate backend state changes (e.g., `/logout`, `/cart/add`, `/delete-item`, `/checkout/submit`). Prerendering sends a full HTTP GET request and executes JavaScript before the user clicks.
- **High-Cost External APIs or Paid Services:** Avoid prerendering pages that make expensive paid API calls (e.g., third-party geolocation, real-time credit checks) on initial script load unless guarded by `document.prerendering` checks.
- **Cross-Site External Links:** While cross-site prefetching/prerendering is supported in specific privacy-preserving configurations (Opt-in headers required), it requires strict cross-origin credentials and header handling. Default to same-origin or same-site navigations.
- **Single Page Applications (SPAs) with Internal Routers:** If your app handles page changes entirely client-side via React Router or Vue Router without actual browser document navigation, use router-level code-splitting and data prefetching instead of document speculation rules.

---

## Inputs

1. **Target Navigation Patterns:** URL patterns or DOM CSS selectors corresponding to likely next user destinations (e.g., `/products/*`, `a.featured-link`).
2. **User Intent Signals:** Pointer hover duration, pointerdown events, scroll depth thresholds, or viewport intersection events.
3. **Device & Network Context:** Hardware concurrency, device memory (`navigator.deviceMemory`), and network connection metrics (`navigator.connection.saveData`, `navigator.connection.effectiveType`).
4. **Third-Party Script Inventory:** List of side-effect scripts (Google Analytics, Segment, Meta Pixel, audio players, WebSockets) running on target pages that require prerender deferral guards.

---

## Outputs

1. **Speculation Rules JSON Markup:** Inline or dynamically injected `<script type="speculationrules">` block containing schema-compliant `prefetch` and `prerender` configurations.
2. **Prerender Lifecycle Guards:** JavaScript guards using `document.prerendering` and the `prerenderchange` event listener to isolate and defer side-effectful execution.
3. **Dynamic Speculation Rules Controller:** Frontend utility class for dynamically inserting, updating, or revoking speculation rules based on real-time user gestures and connection conditions.
4. **Fallback & Graceful Degradation Layer:** Progressive fallback strategy for unsupported browsers using Quicklink or standard `<link rel="prefetch">`.

---

## Workflow

### 1. Audit Target URLs and Side-Effect Safety
Before adding speculation rules, inspect the target destination pages:
- Verify target routes are idempotent (HTTP GET requests only, no state mutations on load).
- Identify scripts that log page views, initiate WebSocket connections, or auto-play media upon load.

### 2. Implement Prerender Execution Guards on Destination Pages
On any page that might be prerendered in the background, wrap non-idempotent scripts or analytics trackers with `document.prerendering` checks:

```javascript
function initializePageEffects() {
  // Safe to run: DOM updates, initial visual rendering, UI event bindings
  renderUI();

  if (document.prerendering) {
    // Page is rendering in a hidden background tab!
    // Listen for activation before firing analytics or media
    document.addEventListener('prerenderchange', () => {
      fireAnalyticsPageView();
      connectWebSockets();
    }, { once: true });
  } else {
    // Page loaded normally in the foreground
    fireAnalyticsPageView();
    connectWebSockets();
  }
}
```

### 3. Choose Between Prefetch and Prerender
- **`prefetch`:** Downloads the main HTML document and key subresources into the browser cache without rendering or executing JavaScript. Use this when pages have dynamic user-specific JS or high memory usage.
- **`prerender`:** Downloads the document, parses HTML/CSS, executes JavaScript, and builds the render tree in an invisible background tab. Use this for critical conversion paths to achieve sub-100ms transitions.

### 4. Configure Speculation Rules (Document Rules vs. List Rules)
Define rules declaratively using JSON inside `<script type="speculationrules">`.

#### Document-Level Rules (Automatic Link Matching):
```html
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "document",
      "where": {
        "and": [
          { "href_matches": "/products/*" },
          { "not": { "href_matches": "/products/custom-order" } },
          { "not": { "selector_matches": ".no-prerender" } }
        ]
      },
      "eagerness": "moderate"
    }
  ]
}
</script>
```

#### List-Based Rules (Explicit URL Lists):
```html
<script type="speculationrules">
{
  "prefetch": [
    {
      "source": "list",
      "urls": ["/cart", "/checkout/shipping"],
      "eagerness": "conservative"
    }
  ]
}
</script>
```

### 5. Tune Eagerness Levels Based on User Signals
Select the appropriate `eagerness` setting based on intent confidence:
- **`immediate`:** Triggered as soon as the speculation rule script is parsed. Use sparingly for 1 high-probability next page (e.g., onboarding step 2).
- **`eager`:** Triggered on subtle intent signals (e.g., link hovering for > 200ms or entering viewport).
- **`moderate`:** Triggered on explicit intent signals (e.g., hovering over a link for > 200ms or `pointerdown`).
- **`conservative`:** Triggered only on mouse down or touch start (`pointerdown`).

### 6. Respect Data Saver & Network Constraints
Check user preferences before injecting rules dynamically:
```javascript
if (navigator.connection?.saveData || ['slow-2g', '2g'].includes(navigator.connection?.effectiveType)) {
  console.log('Speculation rules skipped due to Data Saver or poor network.');
} else {
  injectSpeculationRules();
}
```

---

## Decision Rules

| Requirement / Constraint | Recommended Rule Source | Action & Eagerness | Rationale |
| :--- | :--- | :--- | :--- |
| **Primary Navigation Links (Header/Footer)** | `document` rules | `prefetch` with `eagerness: conservative` | High volume of links; prefetching on `pointerdown` avoids memory pressure while giving a ~100ms head start. |
| **E-Commerce Product Card Hover** | `document` rules | `prerender` with `eagerness: moderate` | User hovering for >200ms shows high purchase intent; prerendering provides instant PDP load. |
| **Single Next Step in Multi-Step Wizard** | `list` rules | `prerender` with `eagerness: immediate` or `eager` | Deterministic user flow; 95%+ probability user clicks Next. |
| **Search Engine Result Page (SERP) #1 Result** | `list` rules | `prerender` with `eagerness: eager` | Top search match is overwhelmingly clicked; immediate prerender maximizes satisfaction. |
| **Constrained Mobile Network / Low RAM** | Skip or Fallback | Downgrade `prerender` to `prefetch` | Prerendering creates background tabs consuming 50-100MB RAM. |

---

## Constraints

- **Single Document Limit:** Browsers enforce strict limits on simultaneous prerenders (typically 1 active prerender tab at a time for background pages, or max 10 prefetches). Older rules are evicted when new ones trigger.
- **Cross-Origin Restrictions:** Cross-origin prerendering requires target servers to send the `Supports-Loading-Mode: credentialed-prerender` HTTP response header. Without this header, cross-origin prerender requests are automatically downgraded to prefetch or canceled.
- **User Gestures & Autoplay:** Background prerendered pages cannot bypass browser autoplay policies. Audio or video element `.play()` calls initiated during prerendering will reject or remain muted until `prerenderchange` fires.
- **Memory & Power Management:** Operating systems may freeze background prerendering if device battery is below 15% or RAM usage exceeds system thresholds.

---

## Non-Goals

- Replacing client-side SPA routing or bundler code-splitting (`React.lazy`, `import()`).
- Managing server-side HTTP caching headers (`Cache-Control`, `ETag`).
- Implementing service worker offline caching strategies (see `service-worker-offline-and-cache-management`).

---

## Common Failure Patterns

- **Double-Counting Analytics Page Views:** Firing analytics scripts (GA4, Plausible, Mixpanel) during the background prerender phase, inflating page view metrics with non-navigated hits.
- **Side-Effect Mutation Leaks:** Triggering POST/PUT API calls or database updates inside the initial `DOMContentLoaded` routine of a prerendered page before user activation.
- **Over-Prerendering & Bandwidth Exhaustion:** Declaring `eagerness: immediate` on 20+ product links simultaneously, causing background network contention and crippling the active foreground page's performance.
- **Ignoring Browser Autoplay Restrictions:** Attempting to play audio or initialize WebGL audio contexts while `document.prerendering` is true, leading to uncaught promise rejections.
- **Missing CSP Script-Src Directives:** Failing to include `'inline-speculation-rules'` or proper nonces in Content Security Policy headers, causing browsers to block `<script type="speculationrules">`.

---

## Validation Steps

### 1. DevTools Speculative Loads Audit
- Open Chrome DevTools -> **Application** panel -> **Background Services** -> **Speculative Loads**.
- Inspect the **Rules** tab to verify that the JSON rule set is parsed correctly without syntax or rule errors.
- Inspect the **Speculations** tab to confirm that target links switch status from `Not Triggered` -> `Ready` (or `Prerendered`) upon hovering/interaction.

### 2. Network & Performance Trace Check
- Inspect the **Network** panel. Filter by `Is prerender`.
- Verify that subresources (CSS, JS, fonts, images) are fetched under the prerender tab.
- Confirm that no duplicate network requests occur when clicking the link to transition foreground focus.

### 3. Analytics & Side-Effect Guard Verification
- Open console on a destination page and simulate prerender loading by checking log outputs.
- Verify that page view events and WebSocket initialization do not fire while `document.prerendering === true`.
- Click the target link to activate the page. Verify that `prerenderchange` fires immediately and triggers analytics logging exactly once.
