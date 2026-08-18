---
name: content-visibility-optimization
description:
  Optimize initial page load, DOM rendering performance, and off-screen layout/style calculation times using CSS content-visibility: auto, contain-intrinsic-size, and layout containment while preserving accessibility and scroll stability.
---

# Content Visibility & Rendering Performance Optimization

## Purpose

The Content Visibility & Rendering Performance Optimization skill provides a technical protocol, CSS architecture, and auditing workflow for optimizing initial page rendering, style recalculation, and layout performance on DOM-heavy websites.

By leveraging CSS `content-visibility: auto`, `contain-intrinsic-size`, and explicit layout containment (`contain: layout paint style size`), browsers can skip rendering work (including layout calculation and painting) for off-screen elements until they approach the viewport. This dramatically speeds up initial rendering, reduces Rendering Thread work, improves Interaction to Next Paint (INP) and First Contentful Paint (FCP), while maintaining full find-in-page (`Ctrl+F`), screen reader accessibility, and scrollbar integrity.

---

## Use Cases

- **Long Content Feeds & Articles:** News sites, blogs, documentation pages, or e-commerce category pages with long scrolling lists of cards, comments, or rich media blocks.
- **Heavy Off-Screen Components:** Complex footers, mega-menus, tab panels, below-the-fold dynamic widgets, or accordion lists that cause massive DOM trees (1,000+ DOM nodes).
- **Infinite Scrolling & Virtualized Lists Alternative:** Non-virtualized lists where DOM elements remain in the document tree for SEO or accessibility reasons, but off-screen layout costs need to be eliminated.
- **Large Data Tables & Dashboards:** Multi-section analytics dashboards or deep data views with off-screen cards or collapsed accordion panels.
- **Reducing Style Recalculation Jank:** Applications where dynamic CSS updates (e.g., toggling a class on `<body>`) trigger expensive global style recalculations across thousands of off-screen DOM nodes.

---

## When NOT to Use

- **Above-the-Fold Critical Content:** Never apply `content-visibility: auto` to critical hero sections, main headers, or elements rendered immediately in the initial viewport. Doing so can delay initial painting and negatively impact Largest Contentful Paint (LCP).
- **Small DOM Trees (< 500 nodes):** For simple, lightweight web pages, rendering containment adds negligible performance benefits and increases testing complexity without measurable rendering gains.
- **Dynamic Variable-Height Containers Without Sizing Defaults:** If off-screen elements have completely unpredictable heights and cannot be estimated with `contain-intrinsic-size`, scrollbar jumping and Cumulative Layout Shift (CLS) may occur as elements enter the viewport.
- **Elements Containing Target IDs for Hash Navigation without Height Reserves:** If deep links or anchor tags (`#section-id`) target contained off-screen elements without proper sizing reserves, scroll positioning during jump navigation can become inaccurate.

---

## Inputs

1. **DOM Tree and Component Structure:** HTML structure of off-screen components, lists, cards, or sections.
2. **Performance Profile Baseline:** Chrome DevTools Performance trace identifying long **Recalculate Style** or **Layout** tasks caused by off-screen nodes.
3. **Height Measurement Inventory:** Dimensional measurements or height estimates (e.g., card height, section height) for off-screen components to populate `contain-intrinsic-size`.

---

## Outputs

1. **Contained CSS Rules:** CSS rule blocks applying `content-visibility: auto` and `contain-intrinsic-size` to below-the-fold content sections and repeating list items.
2. **Intrinsic Size Fallback Architecture:** Sizing rules using `contain-intrinsic-size: auto 500px` or `contain-intrinsic-size: 0px 350px` to prevent layout jumps and scrollbar thrashing.
3. **Accessibility and Search Verification:** Audit confirming screen readers (VoiceOver, NVDA) and browser find-in-page (`Ctrl+F`) discover hidden text seamlessly.
4. **Performance Measurement Log:** DevTools trace comparison confirming reductions in **Recalculate Style** and **Layout** execution times.

---

## Workflow

### Step 1: Profile and Identify Off-Screen Rendering Bottlenecks

1. Open Chrome DevTools -> **Performance** panel.
2. Record a page load or an interaction that triggers style recalculation (e.g., toggling a dark theme class or filtering a list).
3. Inspect the **Main** thread track:
   - Look for wide purple bars labeled **Recalculate Style** and **Layout**.
   - Check the DOM node count in the Performance summary or Console (`document.querySelectorAll('*').length`).
4. Identify large, repeated off-screen sections (e.g., comment threads, product grids, footer blocks, accordion bodies).

---

### Step 2: Implement `content-visibility: auto` and `contain-intrinsic-size`

Apply `content-visibility: auto` to major off-screen content wrappers. Always pair it with `contain-intrinsic-size` to give the element an estimated placeholder size when skipped.

```css
/* Below-the-fold section container optimization */
.article-section,
.product-grid-item,
.comment-block,
.site-footer {
  /* Skips layout and paint for off-screen elements while preserving accessibility */
  content-visibility: auto;

  /* Provides placeholder height to prevent scrollbar jump and CLS */
  contain-intrinsic-size: auto 400px;
}
```

#### Understanding Sizing Keywords:
- `contain-intrinsic-size: 400px;` — Sets an explicit placeholder height of 400px when the element is off-screen.
- `contain-intrinsic-size: auto 400px;` — The `auto` keyword tells modern browsers to remember the actual rendered element height once it enters the viewport. When scrolled off-screen again, the browser uses its cached actual size instead of the 400px fallback!

---

### Step 3: Progressive Enhancement and `@supports` Guarding

Guard `content-visibility` rules with `@supports` feature queries to ensure older browsers safely fallback to normal layout rendering without CSS syntax errors:

```css
@supports (content-visibility: auto) {
  .lazy-render-card {
    content-visibility: auto;
    contain-intrinsic-size: auto 320px;
  }
}
```

---

### Step 4: Handle Anchor Navigation & Focus Management

When users navigate to a fragment URL (`#section-3`) or tab to an off-screen interactive element:
1. Browsers supporting `content-visibility: auto` automatically expand and render contained elements when they are focused or targeted by find-in-page (`Ctrl+F`).
2. Ensure interactive elements inside contained blocks receive proper focus styles (`:focus-visible`).
3. For smooth anchor scrolling to contained sections, ensure `scroll-margin-top` is set to account for fixed headers:

```css
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px;
  scroll-margin-top: 80px; /* Offset for sticky navigation header */
}
```

---

### Step 5: Containment Tuning for Complex UI Components

When custom containment control is required (e.g., widgets, modals, overlays):
- `contain: layout paint;` — Isolates internal DOM layout and paint operations from the rest of the page.
- `contain: strict;` — Equivalent to `contain: size layout paint style`. Requires explicit `width` and `height` properties.

```css
/* Strict containment for fixed-size widget cards */
.dashboard-widget-card {
  contain: layout paint;
  /* Prevents internal layout changes from triggering parent page relayout */
}
```

---

## Decision Rules

### 1. Strategy Matrix for Off-Screen Optimization

| Component Type | Recommended CSS Rule | `contain-intrinsic-size` Value | Rationale |
| :--- | :--- | :--- | :--- |
| **Long Article Sections** | `content-visibility: auto` | `auto 600px` | Remembers actual section height once rendered; prevents scroll jump. |
| **Product Grid Cards** | `content-visibility: auto` | `auto 350px` | Uniform or semi-uniform cards benefit hugely during fast scrolling. |
| **Comment List Items** | `content-visibility: auto` | `auto 120px` | Reduces style recalculation across hundreds of comment nodes. |
| **Footer & Complex Below-Fold**| `content-visibility: auto` | `auto 500px` | Skips rendering massive footer links until user scrolls to bottom. |
| **Fixed-Size Dashboard Cards**| `contain: layout paint` | N/A | Isolates layout re-paints without hiding content off-screen. |
| **Above-the-Fold Hero / Header**| **DO NOT USE** | N/A | Off-screen skipping will delay LCP paint on initial load. |

### 2. Choosing `contain-intrinsic-size` Values

- **Exact Height Known:** If a component has a fixed height (e.g., 300px video embed container), set `contain-intrinsic-size: 300px`.
- **Variable / Dynamic Content:** Use `contain-intrinsic-size: auto <estimated-height>px`. The `auto` keyword caches rendered element height, eliminating scroll jitter on subsequent scrolls.
- **Horizontal Scrolling Lists:** Set both width and height: `contain-intrinsic-size: auto 280px auto 400px;` (width height).

---

## Constraints

- **Accessibility Tree Preservation:** Unlike `display: none` or `visibility: hidden`, `content-visibility: auto` keeps elements in the accessibility tree and DOM search index. Users can search text with `Ctrl+F` and screen readers can discover content.
- **Initial Scrollbar Calculation:** If `contain-intrinsic-size` drastically underestimates or overestimates actual height across 500+ items, the browser's scrollbar thumb will shift slightly as elements enter the viewport. Estimate heights as accurately as average component height.
- **Top-Level Body Rule:** Never apply `content-visibility: auto` to `<body>` or `<html>`. Apply it strictly to specific descendant section wrappers or list items.
- **Top Layer Elements:** Elements rendered in the browser top layer (such as `<dialog>` modals or Popover API elements) automatically bypass `content-visibility` containment when opened.

---

## Non-Goals

- **JavaScript DOM Node Removal:** This skill does not replace DOM virtualizers (like React Virtual / TanStack Virtual) for extreme datasets (10,000+ items) where JS memory footprint is the primary constraint.
- **Image Lazy Loading:** Use standard `loading="lazy"` and `decoding="async"` on `<img>` tags alongside CSS content visibility.
- **CSS Animation Orchestration:** Standard CSS keyframes apply inside rendered nodes, but animations in off-screen contained nodes will be paused by the browser rendering pipeline.

---

## Common Failure Patterns

- **Applying to Above-the-Fold Content:** Placing `content-visibility: auto` on hero images or main headings. The browser delays painting these elements while calculating visibility, degrading LCP.
- **Missing `contain-intrinsic-size`:** Omitting `contain-intrinsic-size`. The element collapses to `0px` height when off-screen, causing catastrophic scrollbar jumping, erratic scrolling, and CLS score penalties.
- **Gross Height Misestimates:** Setting `contain-intrinsic-size: 2000px` on a card that is only `100px` tall. The page height will jump dramatically as the user scrolls.
- **Confusing with `display: none`:** Assuming `content-visibility: auto` hides elements from accessibility APIs. Unlike `display: none`, contained elements remain queryable and discoverable.
- **Over-Containment on Parent Containers:** Applying `content-visibility: auto` to a massive parent `main` container, wrapping the entire page. Containment must be applied to repeating or distinct sub-sections, not the whole page wrapper.

---

## Validation Steps

- [ ] **Performance Profile Verification:** Record a trace in Chrome DevTools Performance panel before and after applying `content-visibility: auto`. Verify significant reduction in **Recalculate Style** and **Layout** execution times.
- [ ] **Scroll Jump & CLS Audit:** Scroll slowly down the page and monitor the scrollbar. Confirm smooth scrolling without visual layout shifts or sudden scrollbar thumb resizing.
- [ ] **Find-In-Page Test:** Use `Ctrl+F` (or `Cmd+F`) to search for text located in an off-screen, contained section. Confirm the browser highlights the text and smoothly scrolls to and reveals the section.
- [ ] **Screen Reader Walkthrough:** Navigate off-screen contained sections with VoiceOver or NVDA. Confirm text and headings are announced properly in the screen reader virtual cursor.
- [ ] **Feature Fallback Test:** Test in a browser without `content-visibility` support (or disable feature flag). Confirm page renders normally without visual layout bugs.
