---
name: accessible-breadcrumb-implementation
description:
  Implement and debug semantic, responsive, and accessible breadcrumb
  navigation systems using WAI-ARIA patterns and modern CSS techniques.
---

# Accessible Breadcrumb Implementation

## Purpose

The Accessible Breadcrumb Implementation skill provides a technical framework
for building secondary navigation trails that allow users to understand their
current location within a website's hierarchy and easily navigate to parent
levels. It focuses on semantic HTML structure, proper ARIA labeling, and
responsive behaviors like horizontal scrolling or truncation.

## Use Cases

- Implementing navigation trails for deep e-commerce category structures.
- Building wayfinding systems for documentation, wikis, or knowledge bases.
- Providing context in complex SaaS dashboards or nested resource management.
- Optimizing breadcrumb display for mobile devices with limited horizontal space.

## When NOT to Use

- **Flat Site Architectures:** If a site is only 1-2 levels deep, breadcrumbs
  often add unnecessary visual noise.
- **Progressive Disclosure/Checkout Flows:** Use a step-indicator pattern (see
  `website-design/step-progress-system`) for linear processes.
- **History-Based Navigation:** If the goal is to return the user to their
  previous page (e.g., "Back to Search Results"), use a simple "Back" button
  rather than a hierarchical breadcrumb.

## Inputs

1. **Hierarchy Data:** A list of parent pages, their labels, and URLs.
2. **Current Page Title:** The label for the current location.
3. **Viewport Constraints:** The available width for the breadcrumb trail.

## Outputs

1. **Semantic HTML Markup:** Structure using `<nav>`, `<ol>`, and `aria-current`.
2. **Responsive CSS:** Styles for layout, separators, and overflow management.
3. **Accessibility Metadata:** Proper labeling to ensure screen reader users
   understand the trail's purpose and their current position.

## Workflow

### 1. Structure the Markup
- Wrap the breadcrumbs in a `<nav>` element with an `aria-label="Breadcrumb"`.
- Use an ordered list (`<ol>`) to communicate the sequence and total number of
  levels to screen readers.
- *Note:* W3C recommends `<ol>` over `<ul>` for breadcrumbs because the path is
  hierarchical and sequential.

### 2. Handle the Current Page
- The last item in the list represents the current page.
- It should be plain text (not a link) to avoid "looping" users back to the same page.
- Apply `aria-current="page"` to this item (or its container if necessary) to
  programmatically identify it for assistive technology.

### 3. Implement Visual Separators
- Use CSS (e.g., `::after` or `content`) or an SVG to add separators between links.
- If using characters in HTML (like `/` or `>`), ensure they are hidden from
  screen readers using `aria-hidden="true"` to prevent them from being announced
  between every link.

### 4. Manage Responsive Behavior
- **Horizontal Scroll (Preferred):** On small screens, allow the breadcrumb to
  scroll horizontally within its container. Use a mask or gradient to indicate
  more content.
- **"Back to Parent" Pattern:** Alternatively, on mobile, collapse the full trail
  into a single "<- Back to [Parent Name]" link.

### 5. Ensure Keyboard Accessibility
- Ensure all links are focusable and have a visible focus indicator.
- Maintain a logical tab order that matches the visual sequence.

## Decision Rules

- **Horizontal Scroll vs. Truncation:** Use **Horizontal Scroll** when the user
  needs full context of the hierarchy (e.g., documentation). Use **Truncation**
  (e.g., `Home > ... > Category > Product`) for extremely deep paths where
  intermediate levels are less critical.
- **Link Style:** Ensure breadcrumb links are visually distinct from the current
  page text but consistent with other site links.
- **Separator Choice:** Use a separator that is common in the user's culture
  (e.g., `>` or `/` for LTR, mirrored for RTL).

## Constraints

- **Touch Targets:** Links must meet minimum touch target sizes (e.g., 24x24px
  minimum for WCAG 2.2).
- **Contrast:** Text and separators must meet WCAG AA contrast ratios (4.5:1).
- **ARIA Landmark:** The `<nav>` element must have a label (`aria-label` or
  `aria-labelledby`) because there are often multiple `<nav>` elements on a page.

## Non-Goals

- Designing the Information Architecture (IA) or hierarchy itself.
- Implementing the backend logic to generate the breadcrumb trail.
- Handling history-based "back" functionality.

## Common Failure Patterns

- **Using `<ul>` instead of `<ol>`:** Failing to communicate the hierarchical
  sequence to screen readers.
- **Linking the Current Page:** Creating a confusing experience where users click
  a link that reloads their current view.
- **Announcing Separators:** Not hiding the `>` or `/` characters, leading
  screen readers to say "Home, greater than, Products, greater than..."
- **Missing Landmark Label:** Not labeling the `<nav>` element, making it
  difficult for screen reader users to find the breadcrumbs among other navigation.
- **Clipped Content on Mobile:** Not handling overflow, causing the layout to
  break or titles to be cut off without an indication of more content.

## Validation Criteria

- [ ] **Screen Reader Test:** Navigate the breadcrumbs with a screen reader.
      Verify the landmark is announced as "Breadcrumb", the list is announced
      as an ordered list, and separators are NOT read.
- [ ] **Keyboard Test:** Verify you can tab through each breadcrumb link in order.
- [ ] **Aria-Current Check:** Inspect the current page item; verify
      `aria-current="page"` is present.
- [ ] **Mobile Overflow Test:** Shrink the viewport; verify that the breadcrumbs
      either scroll horizontally or truncate gracefully without breaking the UI.
- [ ] **Contrast Check:** Verify text and separator contrast meets WCAG AA.
