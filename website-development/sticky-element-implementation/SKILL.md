---
name: sticky-element-implementation
description:
  Implement and debug robust sticky elements like headers, sidebars, and table
  headers while managing stacking contexts, overflow traps, and stuck-state detection.
---

# Sticky Element Implementation

## Purpose

The Sticky Element Implementation skill provides a technical protocol for
building and debugging elements that "stick" to the viewport as the user
scrolls. It focuses on solving common pitfalls like the "overflow trap" (where
sticky elements fail because an ancestor has `overflow: hidden`), managing
stacking contexts to prevent overlap bugs, and implementing "stuck" state
detection for dynamic styling.

## Use Cases

- **Sticky Headers:** Keeping navigation visible at the top of the viewport.
- **Sticky Sidebars:** Keeping supplementary info (ToC, filters, ads) in view
  during long content scrolls.
- **Sticky Table Headers:** Maintaining column context in large data sets.
- **Sticky Section Titles:** Creating "alphabetical" or "chronological" headers
  that stack or push each other.
- **Floating Action Bars:** Keeping "Save" or "Share" buttons accessible at the
  bottom of the viewport.

## When NOT to Use

- **Fixed Positioning:** Use `position: fixed` if the element should *always*
  be at a fixed coordinate regardless of its parent's scroll position.
- **Small Screens / Low Viewport Height:** Avoid large sticky headers on mobile
  devices where they consume too much vertical space.
- **Performance-Critical Scroll Effects:** For complex parallax effects tied to
  exact scroll percentages, `position: sticky` may be too limited; use
  `IntersectionObserver` or specialized libraries.

## Inputs

1. **Target Element:** The DOM element to make sticky.
2. **Sticky Container:** The parent element that defines the sticky boundary.
3. **Offset Values:** The distance from the edge (e.g., `top: 0`, `bottom: 20px`).
4. **Scrolling Context:** Identification of the scrollable ancestor.

## Outputs

1. **Robust CSS:** Implementation of `position: sticky` with appropriate
   offsets and stacking management.
2. **Overflow Audit:** Identification and resolution of restrictive ancestor
   styles.
3. **Stuck-State Logic:** Optional JavaScript (Intersection Observer) to toggle
   classes when the element sticks.
4. **Accessibility Overrides:** Fixes for jump-link clipping and focus visibility.

## Workflow

### 1. Establish the Sticky Context

- Set `position: sticky` on the target element.
- Define at least one threshold property: `top`, `bottom`, `left`, or `right`.
- **Critical:** Ensure the sticky element's parent has sufficient height. A
  sticky element can only "stick" within its parent's boundaries.

### 2. Solve the "Overflow Trap"

Sticky positioning fails if *any* ancestor has `overflow: hidden`, `scroll`, or
`auto` (unless that ancestor is the intended scroll container).
- **Audit:** Inspect the parent chain.
- **Fix:** Remove restrictive `overflow` properties or move the sticky element
  higher in the DOM.

### 3. Manage Stacking and Depth

- Sticky elements create a new stacking context.
- Assign a `z-index` to ensure it stays above other content.
- Coordinate with other sticky or fixed elements (e.g., a sticky header
  should usually be above a sticky sidebar).

### 4. Detect "Stuck" State (Optional)

To change styling (e.g., shrinking a header or adding a shadow) when an element
becomes stuck:
- Use a `0px` tall "sentinel" element just above the sticky element.
- Observe the sentinel with `IntersectionObserver`.
- Toggle a `.is-stuck` class on the sticky element based on the sentinel's
  visibility.

### 5. Handle Accessibility Gotchas

- **Jump-Link Offsets:** Use `scroll-margin-top` on headings to prevent them
  from being covered by a sticky header when navigated to via fragment links.
- **Focus Visibility:** Ensure focus indicators are not clipped by the sticky
  container or overlapping layers.

## Decision Rules

- **Sticky vs. Fixed:** Use **Sticky** if the element should move with its
  parent but stop at a viewport edge. Use **Fixed** if the element is
  completely removed from the document flow.
- **Top vs. Bottom:** Use `top` for headers and navigation. Use `bottom` for
  action bars or footers that should stick once reached.
- **Margin vs. Offset:** Use the sticky offset (`top: 10px`) for the trigger
  point. Use `margin` for spacing relative to the parent.

## Constraints

- **Parent Height:** If the parent is the same height as the sticky element, it
  will never appear to "stick" because there is no room to move.
- **Table Support:** `position: sticky` on `<thead>` or `<th>` works in modern
  browsers but requires `border-collapse: separate` (or specialized fixes) to
  prevent border artifacts.
- **Mobile Safari:** Be aware of the "rubber-banding" effect which can
  temporarily misalign sticky elements at the extreme ends of the scroll.

## Non-Goals

- Implementing full "Scrollspy" logic (see `table-of-contents-implementation`).
- Designing the visual appearance (shadows, transitions) of the elements.
- Handling horizontal scrolling for entire pages.

## Common Failure Patterns

- **The Overflow Parent:** Setting `overflow: hidden` on a wrapper `div` or
  `main` tag, causing all nested sticky elements to act like `position: static`.
- **Missing Threshold:** Forgetting to set `top: 0` or another offset, which
  results in the element not sticking.
- **Container Too Short:** The parent container ends too early, causing the
  sticky element to scroll away before intended.
- **Z-Index War:** Sticky elements appearing behind relative-positioned
  content because of nesting or low `z-index` values.
- **Clipped Focus:** A sticky container with `overflow: hidden` cutting off the
  focus rings of its children.

## Validation Criteria

- [ ] **Stickiness Test:** Scroll the page; verify the element stops at the
      specified offset and stays within its parent.
- [ ] **Overflow Audit:** Verify no ancestors have restrictive `overflow`
      settings that break the behavior.
- [ ] **Stacking Check:** Ensure the sticky element is visually above all
      scrolling content and below other high-priority overlays (like modals).
- [ ] **Jump-Link Test:** Click an internal anchor link; verify the target
      content is not obscured by the sticky header.
- [ ] **State Toggle Check:** (If using JS) Verify the `.is-stuck` class is
      applied and removed correctly at the threshold.
