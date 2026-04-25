---
name: skeleton-screen-implementation
description:
  Implement and debug accessible skeleton screens to improve perceived
  performance and mitigate Cumulative Layout Shift (CLS) during content loading.
---

# Skeleton Screen Implementation

## Purpose

The Skeleton Screen Implementation skill provides a technical protocol for
creating "placeholder" versions of UI components (like cards, lists, or headers)
that appear while content is being fetched. It focuses on improving perceived
performance, providing immediate visual feedback, and preventing layout shifts.

## Use Cases

- Replacing "spinners" in content-heavy areas like product grids or news feeds.
- Mitigating Cumulative Layout Shift (CLS) by reserving space for asynchronous
  content.
- Providing immediate UI feedback in Single Page Applications (SPAs) during
  route transitions.
- Improving the loading experience on slow or unstable network connections.

## When NOT to Use

- **Static Content:** Do not use for content that is immediately available in
  the initial HTML.
- **Micro-Interactions:** Buttons or small icons usually benefit more from a
  spinner or immediate state change than a skeleton.
- **Fast-Loading Elements:** If content consistently loads in under 300ms, a
  skeleton screen may cause a "flicker" that is more distracting than helpful.
- **Unstructured Data:** If the final dimensions of the content are completely
  unpredictable, a generic spinner may be safer to avoid jarring layout jumps
  when the content arrives.

## Inputs

1. **Target Component:** The final UI component to be "skeletonized" (e.g., a
   Card, Table Row).
2. **Dimension Metadata:** The height, width, or aspect ratio of the final
   elements.
3. **Loading State Logic:** The mechanism (JS state, CSS class, or attribute)
   that toggles between "loading" and "ready."
4. **Theme Requirements:** Colors for the base background and the shimmer
   highlight.

## Outputs

1. **Semantic HTML Structure:** A placeholder structure that matches the final
   content's footprint.
2. **CSS Animation:** A high-performance "shimmer" effect using CSS gradients
   and transforms.
3. **Accessibility Attributes:** Proper use of `aria-busy` and `aria-hidden` to
   manage screen reader behavior.
4. **Layout Rules:** CSS to ensure the skeleton reserves exact dimensions to
   prevent CLS.

## Workflow

### 1. Define the Component Footprint

- Analyze the final component (e.g., a product card with image, title, and
  price).
- Identify the "bones" of the component: the primary shapes that define its
  structure.
- _Critical:_ Use `aspect-ratio` for images and `min-height` for text blocks to
  ensure the skeleton matches the final rendered size.

### 2. Implement the Base Styles

- Create a container for the skeleton.
- Use a neutral background color (e.g., `#eee` or a CSS variable).
- Define "bone" elements (divs or spans) that represent the content blocks.

### 3. Add the Shimmer Effect

- Apply a `linear-gradient` background to the bones.
- Animate the `background-position` or use a pseudo-element (`::after`) with a
  `transform: translateX()` for better performance.
- Ensure the animation duration is comfortable (typically 1.5s to 2s).

### 4. Wire Up Accessibility

- Apply `aria-busy="true"` to the container while content is loading.
- Apply `aria-hidden="true"` to the skeleton elements so they are ignored by
  screen readers.
- Ensure the container has an appropriate label (e.g.,
  `aria-label="Loading product list"`) if it replaces a significant page
  section.

### 5. Manage the Transition

- Switch `aria-busy` to `false` when the data arrives.
- Replace the skeleton markup with the real content.
- Use a subtle CSS fade-in transition (e.g., 200ms) to smooth the swap.

## Decision Rules

- **Aspect Ratio over Pixels:** Always prefer `aspect-ratio` for image skeletons
  to remain responsive.
- **Opacity for Shimmer:** Use low-contrast colors for the shimmer (e.g., 5-10%
  difference from base) to avoid eye strain.
- **Prefers-Reduced-Motion:** Always respect the user's system settings by
  disabling or simplifying the shimmer animation if
  `prefers-reduced-motion: reduce` is active.
- **Structural Match:** The skeleton must match the _general_ layout of the
  final content. Don't use a single box for a multi-line text block.

## Constraints

- **Performance:** Animations should use `transform` or `opacity` whenever
  possible to stay on the compositor thread. Avoid animating `width` or
  `height`.
- **Contrast:** Ensure the base skeleton color has sufficient contrast against
  the page background, but not so much that it looks like final content.
- **Nesting:** Do not nest skeletons too deeply; keep the markup flat to
  minimize rendering overhead.

## Non-Goals

- Generating skeletons automatically from existing DOM (this is a manual
  implementation pattern).
- Handling the actual data fetching or API logic.
- Styling the final content (the skill assumes final styles already exist).

## Common Failure Patterns

- **The "Flicker":** Skeleton and content having slightly different dimensions,
  causing the page to jump when data arrives (CLS).
- **Infinite Loading:** Forgetting to remove `aria-busy` or the skeleton if an
  API call fails.
- **Seizure Risk:** Shimmer animations that are too fast, high-contrast, or
  ignore `prefers-reduced-motion`.
- **Ghost Content:** Skeletons being read by screen readers as "blank" or
  "empty" because `aria-hidden` was omitted.

## Validation Steps

- [ ] **CLS Test:** Use Chrome DevTools "Performance" tab or "Show layout shift
      regions" to verify zero shift during the swap.
- [ ] **Accessibility Audit:** Verify that `aria-busy` is toggled and skeletons
      are `aria-hidden="true"`.
- [ ] **Motion Test:** Toggle "Reduced Motion" in OS settings and verify the
      animation stops or simplifies.
- [ ] **Responsive Test:** Resize the viewport and ensure the skeleton scales
      exactly like the final component.
- [ ] **Contrast Check:** Verify the skeleton is visible but distinct from
      interactive elements.
