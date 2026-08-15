---
name: view-transitions-implementation
description:
  Implement and debug smooth, high-performance UI state transitions using the
  native View Transitions API for both single-page and multi-page experiences.
---

# View Transitions Implementation

## Purpose

The View Transitions Implementation skill provides a technical protocol for creating seamless visual transitions between different UI states or pages. It leverages the browser's native View Transitions API to automatically capture "before" and "after" snapshots, allowing for complex element morphing and polished animations without the overhead of heavy third-party animation libraries or manual DOM manipulation orchestration.

## Use Cases

- **List-to-Detail Morphing:** Transitioning an image from a small thumbnail in a list to a large hero image on a detail page.
- **Single-Page Navigation:** Smoothly swapping out main content areas while keeping global UI (header/footer) stable.
- **Theme Switching:** Animating the transition between light and dark modes (e.g., a "circular clip" effect).
- **Multi-Page App (MPA) Transitions:** Providing app-like transitions between standard page loads in modern browsers.
- **Filtering and Sorting:** Animating elements as they rearrange or fade out when a filter is applied.

## When NOT to Use

- **Non-Visual State Changes:** Do not use for background data fetches or state updates that don't result in a meaningful UI change.
- **High-Frequency Updates:** Avoid using View Transitions for very rapid sequences (e.g., every frame of a game or a high-speed data ticker).
- **Critical Interaction Paths:** If a transition adds significant delay to a critical user task (e.g., checkout), prefer an instant state change.
- **Legacy Browser Support Only:** If the project requires support for older browsers without a clear fallback strategy (though progressive enhancement is recommended).

## Inputs

1. **Update Function:** A callback function that performs the DOM update (for same-document transitions).
2. **Transition Names:** Unique identifiers (`view-transition-name`) assigned to elements that should be "morphed" across states.
3. **Motion Design Specs:** Duration, timing functions, and custom CSS animations for the transition pseudo-elements.
4. **Context:** Is it a same-document (SPA-like) transition or a cross-document (MPA) navigation?

## Outputs

1. **Transition Wrapper:** Implementation of `document.startViewTransition()`.
2. **CSS View Transition Names:** Assignment of `view-transition-name` to specific DOM elements.
3. **Custom Transition Styles:** CSS overrides for `::view-transition-old()` and `::view-transition-new()` pseudo-elements.
4. **Progressive Enhancement Logic:** Fallbacks for browsers that do not support the API.

## Workflow

### 1. Identify Elements to Morph

- Select elements that persist across both states (e.g., a card title or product image).
- Assign a unique `view-transition-name` to these elements via CSS:
  ```css
  .product-image {
    view-transition-name: product-hero;
  }
  ```
- **Note:** Names must be unique on the page at any given time.

### 2. Wrap the State Change (Same-Document)

- Use `document.startViewTransition(updateCallback)`.
- The `updateCallback` should perform the actual DOM change (e.g., updating a React state or manual DOM manipulation).
- Provide a fallback for unsupported browsers:
  ```javascript
  if (!document.startViewTransition) {
    updateCallback();
    return;
  }
  document.startViewTransition(updateCallback);
  ```

### 3. Configure Cross-Document Transitions (MPA)

- Enable the feature in CSS for the participating pages:
  ```css
  @view-transition {
    navigation: auto;
  }
  ```
- Ensure the elements that should morph have the same `view-transition-name` on both the source and destination pages.

### 4. Customize the Animation (CSS)

- Use the `::view-transition-*` pseudo-elements to override the default cross-fade.
- Target specific named transitions:
  ```css
  ::view-transition-old(product-hero),
  ::view-transition-new(product-hero) {
    animation-duration: 0.5s;
    mix-blend-mode: normal;
  }
  ```

### 5. Manage Transition Lifecycle

- Use the promises returned by `startViewTransition` (e.g., `.ready`, `.finished`) to trigger additional logic, such as focus management or analytics.

## Decision Rules

- **Same-Document vs. Cross-Document:** Use same-document for SPAs or component-level state changes. Use cross-document for standard page-to-page navigation where supported.
- **Global vs. Local:** By default, the API captures the whole page. If only a small part of the UI changes, consider whether a full-page transition is appropriate or if you should target specific elements.
- **Auto-names vs. Manual:** Use manual `view-transition-name` only for elements that specifically need to "travel" or morph. Let the default cross-fade handle everything else.

## Constraints

- **Name Uniqueness:** If multiple elements have the same `view-transition-name` at the same time, the transition will fail.
- **Accessibility:** Respect the `prefers-reduced-motion` media query. Disable or simplify transitions for sensitive users.
- **Stacking Contexts:** `view-transition-name` properties can create new stacking contexts and affect layout in unexpected ways during the transition.
- **Interaction Block:** The main thread is often blocked briefly during the "capture" phase. Keep the update function fast.

## Non-Goals

- Building complex "scrollytelling" animations tied to scroll position (see `scroll-reveal-implementation`).
- Handling server-side data fetching logic.
- Managing 3D WebGL or Canvas transitions.

## Common Failure Patterns

- **Duplicate Names:** Assigning `view-transition-name: item` to every item in a list, causing the browser to skip the animation.
- **Z-index Clashes:** Elements appearing to "jump" layers because they were promoted to a transition layer.
- **Content Clipping:** Forgetting that the browser takes "snapshots" which might have different aspect ratios or scroll positions.
- **JS Dependency:** Not providing a fallback for browsers that don't support `startViewTransition`, leading to broken state changes.
- **Heavy Snapshots:** Capturing extremely large or complex DOM trees that lead to stuttering (jank) on low-end devices.

## Validation Criteria

- [ ] **Browser Support Check:** Verify that the transition falls back gracefully to an instant change in browsers like Firefox or Safari (if not yet supported).
- [ ] **Console Audit:** Check for "Duplicate view-transition-name" errors in the DevTools console.
- [ ] **Reduced Motion Test:** Verify that transitions are disabled or significantly simplified when `prefers-reduced-motion` is active.
- [ ] **Focus Management Test:** Ensure focus is correctly placed on the new content after the transition completes.
- [ ] **Performance Profile:** Record a trace in the Performance panel to ensure the transition doesn't cause significant frame drops or long tasks.
