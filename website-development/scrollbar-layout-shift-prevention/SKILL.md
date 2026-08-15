---
name: scrollbar-layout-shift-prevention
description:
  Identify and prevent layout shifts caused by the appearance, disappearance, or
  locking of system scrollbars using CSS and JavaScript techniques.
---

# Scrollbar Layout Shift Prevention

## Purpose

The Scrollbar Layout Shift Prevention skill provides a technical protocol for
eliminating the "jump" or horizontal shift that occurs when a vertical
scrollbar appears or disappears. This is most common when navigating between
pages of different lengths or when opening a modal that locks the background
scrolling. It improves visual stability and Cumulative Layout Shift (CLS)
scores.

## Use Cases

- **Modal Dialogs:** Preventing the page content from shifting right when the
  `body` is set to `overflow: hidden` to lock scrolling.
- **Dynamic Content:** Ensuring the layout remains stable when a search result
  list or infinite scroll feed grows long enough to trigger a scrollbar.
- **Consistent Page Transitions:** Maintaining the same horizontal alignment
  across short "Home" pages and long "Article" pages.
- **Fixed Navigation Synchronization:** Ensuring sticky headers or sidebars
  don't misalign with the main content when scrollbars toggle.

## When NOT to Use

- **Overlay Scrollbars:** On platforms like macOS or mobile (where scrollbars
  float over content without taking up space), these techniques are usually
  unnecessary and can create unwanted empty gutters.
- **Full-Window Canvas/Games:** If the UI doesn't use standard scrollbars or
  manages its own layout engine.
- **Horizontal Scrollbars:** This skill focuses specifically on the vertical
  scrollbar's impact on horizontal layout stability.

## Inputs

1. **Target Container:** Usually the `<html>` or `<body>` element.
2. **Component Lifecycle:** Events for opening/closing modals or loading content.
3. **OS/Browser Profile:** Knowledge of whether the user is on a "Classic"
   (space-consuming) or "Overlay" (floating) scrollbar system.

## Outputs

1. **Stable Gutter Configuration:** CSS using `scrollbar-gutter: stable`.
2. **Scroll-Lock Utility:** JavaScript that calculates scrollbar width and
   applies compensating padding to fixed elements.
3. **Layout Normalization CSS:** Global styles to prevent shifts on short pages.

## Workflow

### 1. Implement the Modern CSS Solution

For browsers that support it, use the `scrollbar-gutter` property to reserve
space for the scrollbar even when it's not present.

```css
html {
  scrollbar-gutter: stable;
}

/* For dual-scrollbar layouts (e.g. centered content with two gutters) */
html {
  scrollbar-gutter: stable both-edges;
}
```

### 2. Handle Scroll Locking (Modals)

When a modal opens and you disable scrolling on the `body`, the scrollbar
disappears, causing the page to "jump" right.

- **Step A: Calculate Scrollbar Width**
  Measure the difference between `window.innerWidth` (includes scrollbar) and
  `document.documentElement.clientWidth` (excludes scrollbar).
- **Step B: Apply Compensating Padding**
  Apply the calculated width as `padding-right` to the `body` and any
  `position: fixed` elements (like headers).

### 3. Synchronize Fixed Elements

Fixed elements are not affected by `padding` on the `body`. You must
specifically target them when locking the scroll.

```javascript
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

// When locking
document.body.style.overflow = 'hidden';
document.body.style.paddingRight = `${scrollbarWidth}px`;
document.querySelector('.sticky-header').style.paddingRight = `${scrollbarWidth}px`;

// When unlocking
document.body.style.overflow = '';
document.body.style.paddingRight = '';
document.querySelector('.sticky-header').style.paddingRight = '';
```

### 4. Optimize for Overlay Scrollbars

Check if the scrollbar width is `0` before applying styles. This ensures you
don't add empty space on macOS or mobile devices where scrollbars don't
consume layout width.

### 5. Fallback for Classic Layouts

On older browsers, you can force the scrollbar to always be visible to prevent
shifts, though this may be less aesthetically pleasing.

```css
html {
  overflow-y: scroll;
}
```

## Decision Rules

- **`scrollbar-gutter: stable` vs `overflow-y: scroll`:** Use `scrollbar-gutter`
  as the primary modern approach. Use `overflow-y: scroll` only if you need to
  support very old browsers and don't mind a permanent scrollbar track.
- **JS vs CSS Locking:** Use JS-based padding compensation when you need
  to lock the scroll for modals/overlays. CSS-only solutions (like
  `scrollbar-gutter`) handle the appearance/disappearance during content
  growth but not the total removal during a "lock".
- **Fixed Element Management:** If your site has a sticky header, you MUST
  use the JS approach to prevent the header from shifting independently of the
  content.

## Constraints

- **Dynamic Resize:** If the user changes their system scrollbar settings (e.g.,
  plugging in a mouse on macOS), the width may change. Re-calculate on
  significant lifecycle events.
- **Browser Support:** `scrollbar-gutter` is supported in Chromium and Firefox.
  Safari does not support it as of 2026, but this matters less there since
  macOS/iOS Safari defaults to overlay scrollbars that don't consume layout
  width in the first place.
- **User Preference:** Avoid forcing scrollbars on users who prefer a clean,
  minimal UI unless it's critical for layout integrity.

## Non-Goals

- Styling the appearance (colors/width) of the scrollbar (see
  `scrollbar-color` or `::-webkit-scrollbar`).
- Implementing custom scrollbar libraries (e.g., PerfectScrollbar).
- Managing horizontal scrollbar layout.

## Common Failure Patterns

- **The "Header Jump":** Locking the `body` but forgetting to apply padding to
  the fixed header, causing them to move in opposite directions.
- **The "Double Gutter":** Applying `scrollbar-gutter: stable` and then also
  manually adding padding in JS, resulting in too much empty space.
- **Ignoring Overlay Scrollbars:** Adding 15px of padding on a device where
  the scrollbar width is actually 0.
- **Late Application:** Applying the scroll-lock padding *after* the modal
  animation starts, causing a visible "hiccup" during the transition.

## Validation Criteria

- [ ] **Modal Test:** Open a modal on a long page. Verify the background content
      and the header do not shift by even a single pixel.
- [ ] **Content Growth Test:** Add content dynamically to a short page. Verify
      no horizontal shift occurs when the scrollbar appears.
- [ ] **Classic vs Overlay Check:** Test on Windows (Classic) and macOS/Mobile
      (Overlay). Ensure no unnecessary gaps appear on Overlay systems.
- [ ] **Fixed Element Audit:** Ensure all sticky/fixed elements remain aligned
      with the main container during a scroll-lock.
- [ ] **CLS Monitoring:** Use the Layout Shift Region Highlighting in DevTools
      to confirm zero shifts when toggling the scroll state.
