---
name: css-grid-layout-implementation
description:
  Implement and debug robust, responsive website layouts using CSS Grid.
  Focuses on intrinsic responsiveness, named areas, subgrid alignment, and
  accessible content ordering.
---

# CSS Grid Layout Implementation

## Purpose

The CSS Grid Layout Implementation skill provides a technical framework for
building complex, two-dimensional website layouts. It prioritizes "intrinsic
responsiveness" (layouts that adapt without excessive media queries) and
leverages modern features like `subgrid` for alignment and `grid-template-areas`
for readable, maintainable structures.

## Use Cases

- Building complex "Bento Box" or "Editorial" style landing pages.
- Implementing card-based layouts where elements (like footers or headers) must
  align across different cards using `subgrid`.
- Creating responsive grids that automatically wrap and resize based on content
  width (`auto-fit`/`auto-fill`).
- Reordering content visually for different breakpoints without changing the
  DOM order.
- Designing "Holy Grail" layouts with sticky headers, footers, and sidebars.

## When NOT to Use

- **Simple One-Dimensional Layouts:** Use Flexbox for simple rows or columns
  that don't require alignment across two axes.
- **Legacy Browser Support:** If the project must support IE11, a simplified
  Flexbox fallback or a different layout strategy is required (standard Grid
  support is modern).
- **Tabular Data:** Use `<table>` for semantic data tables; Grid is for layout,
  not for structured data relationships.

## Inputs

1. **Layout Blueprint:** Wireframes or designs showing the desired arrangement
   of content blocks.
2. **Responsive Requirements:** How the layout should change across mobile,
   tablet, and desktop viewports.
3. **Content Hierarchy:** The logical order of elements in the DOM (for
   accessibility).
4. **Alignment Needs:** Do internal components of nested grids need to line up
   with the parent grid (requires `subgrid`)?

## Outputs

1. **Grid Container CSS:** Definitions for `grid-template-columns`, `rows`, and
   `areas`.
2. **Grid Item CSS:** Placement logic using `grid-area`, `grid-column`, or
   `grid-row`.
3. **Responsive Logic:** Intrinsic sizing rules (`minmax`) or breakpoint-specific
   area redefinitions.
4. **Subgrid Implementation:** CSS for nested elements to inherit parent grid
   tracks.

## Workflow

### 1. Define the Grid Strategy

- **Intrinsic vs. Explicit:** Use `auto-fit`/`auto-fill` with `minmax()` for
  fluid grids. Use explicit tracks and `grid-template-areas` for fixed-slot
  editorial layouts.
- **Named Areas:** For complex layouts, use `grid-template-areas` to create a
  visual "map" of the layout in the CSS.

### 2. Establish the HTML Structure

- Maintain a logical DOM order that follows the visual reading order as much as
  possible.
- Keep the structure flat where possible to make Grid management easier, unless
  `subgrid` is needed for nested alignment.

### 3. Implement the Parent Grid

- Apply `display: grid` to the container.
- Define columns using `fr`, `px`, or `minmax()`.
- Set a `gap` to manage gutter spacing without margins.

### 4. Place Grid Items

- Use `grid-area` to assign items to named slots.
- For fluid layouts, let items flow naturally into the tracks defined by
  `auto-fit`.

### 5. Leverage Subgrid (Modern Alignment)

- To align items inside a nested container with the parent grid, set the nested
  container to `display: grid` and `grid-template-columns: subgrid`.

### 6. Responsive Refinement

- On smaller screens, redefine `grid-template-areas` to stack items
  vertically.
- Adjust `gap` values using CSS variables or media queries.

## Decision Rules

- **`auto-fit` vs. `auto-fill`:** Use `auto-fit` to expand items to fill the
  remaining space. Use `auto-fill` to maintain the specified track size even if
  it leaves empty slots.
- **Flexbox vs. Grid:** Use Grid when you need to control both rows and columns
  simultaneously. Use Flexbox when content should just flow in one direction
  and push items aside.
- **`grid-template-areas` vs. Line Numbers:** Use named areas for "macro" page
  layouts (header, sidebar, main). Use line numbers or spans for "micro"
  component-level placements.

## Constraints

- **Accessibility:** Never use Grid `order` to move critical content in a way
  that breaks the logical tab sequence. The visual order should generally
  match the DOM order.
- **Subgrid Support:** `subgrid` is widely supported in modern browsers but
  check requirements for older versions (e.g., Safari < 16).
- **Performance:** Avoid creating an excessive number of grid tracks (e.g., a
  100x100 grid) as it can impact layout calculation time.

## Non-Goals

- Building complex 3D CSS layouts.
- Detailed styling of the contents (colors, typography).
- Implementing framework-specific (React/Vue) grid components.

## Common Failure Patterns

- **Over-reliance on Breakpoints:** Creating 10 different media queries for a
  grid that could have been handled with `minmax(300px, 1fr)`.
- **The "Broken Subgrid":** Forgetting that `subgrid` requires the nested item
  to also be a `display: grid` container.
- **Keyboard Confusion:** Moving a "Submit" button to the top of the grid
  visually while it remains at the bottom of the DOM, confusing keyboard
  users.
- **Fixed Widths:** Using `px` for grid tracks instead of `fr` or `%`, causing
  overflow on small screens.
- **Ignoring `min-width: 0`:** Grid items by default have `min-width: auto`,
  which can prevent them from shrinking below their content's size and break
  the layout. Use `min-width: 0` on items to allow them to shrink.

## Validation Criteria

- [ ] **Responsiveness Test:** Shrink the viewport and ensure no horizontal
      overflow occurs and items wrap or stack correctly.
- [ ] **Tab Order Test:** Use the `Tab` key to ensure the navigation order
      remains logical and predictable.
- [ ] **Subgrid Alignment Check:** Verify that elements in nested cards line up
      perfectly across the horizontal axis.
- [ ] **Lighthouse Layout Audit:** Verify no "Avoid large layout shifts" issues
      related to the grid definition.
- [ ] **Accessibility Audit:** Verify that `order` property hasn't created a
      discrepancy between visual and focus order.
