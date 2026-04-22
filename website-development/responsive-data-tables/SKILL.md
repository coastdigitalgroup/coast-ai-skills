---
name: responsive-data-tables
description:
  Implement and debug responsive data tables that remain accessible and readable
  across all screen sizes using patterns like overflow scroll, stacked blocks,
  and column toggling.
---

# Responsive Data Tables

## Purpose

The Responsive Data Tables skill provides a technical framework for presenting
tabular data on small screens without sacrificing accessibility or usability. It
focuses on choosing the right responsive pattern for the data's complexity and
ensuring screen readers can still interpret the table structure.

## Use Cases

- Presenting product comparison tables on mobile devices.
- Displaying financial data or spreadsheets in a responsive dashboard.
- Optimizing "feature lists" that use a grid-like comparison format.
- Fixing tables that "break" layouts by overflowing the viewport on small
  screens.

## When NOT to Use

- **Simple 2-Column Key/Value Pairs:** Use a Description List (`<dl>`) instead
  of a table.
- **Layout Grids:** Use CSS Flexbox or Grid for page layout; tables are strictly
  for data.
- **Small, Static Tables:** If a table is narrow enough to fit on the smallest
  target screen (usually 320px), no complex responsive pattern is needed.

## Inputs

1. **Data Complexity:** Number of columns, data types (text vs. numbers), and
   row count.
2. **Criticality of Columns:** Which columns are essential for user
   understanding and which are secondary.
3. **Container Constraints:** The width available for the table in the parent
   layout.

## Outputs

1. **Semantic HTML:** Correct use of `<table>`, `<thead>`, `<tbody>`, `<th>`,
   `<td>`, and `<caption>`.
2. **Responsive CSS:** Layout logic for different patterns (e.g.,
   `overflow-x: auto`, `display: block` for stacking).
3. **Accessibility Metadata:** Proper use of `scope`, `aria-describedby`, and
   data attributes for pseudo-element labels.

## Workflow

### 1. Structure the Table Semantically

- Use `<caption>` to describe the table's purpose.
- Use `<thead>` for headers and `<tbody>` for the main content.
- Use `<th>` with the `scope` attribute (`col` or `row`) to define
  relationships.

### 2. Choose a Responsive Pattern

- **Pattern A: Overflow Scroll (Simple)**
  - Wrap the `<table>` in a container with `overflow-x: auto`.
  - Best for large tables where the horizontal relationship between columns must
    be preserved.
- **Pattern B: Stacked / Block (Moderate)**
  - At a breakpoint, change table elements to `display: block`.
  - Use data attributes (e.g., `data-label`) on `<td>` to show headers via CSS
    `:before` pseudo-elements.
  - Best for narrow viewports where rows become distinct cards.
- **Pattern C: Column Toggle / Priority (Complex)**
  - Use JavaScript or CSS to hide less important columns at smaller breakpoints.
  - Provide a UI for users to toggle column visibility.

### 3. Implement Visual Indicators

- For **Overflow Scroll**, add a visual cue (gradient or "Scroll for more"
  indicator) so users know more data exists.
- For **Stacked**, ensure a clear visual distinction between "rows" (now cards).

### 4. Ensure Screen Reader Compatibility

- _Warning:_ Applying `display: block` or `display: flex` to table elements can
  strip their semantic role in some browsers.
- Apply `role="table"`, `role="row"`, `role="cell"`, etc., to restore semantics
  if using the Stacked pattern.

## Decision Rules

- **Column Count < 5:** Use **Overflow Scroll**; the table will likely fit or
  only require minor scrolling.
- **Data is Comparative:** Use **Overflow Scroll** or **Stacked with Labels**;
  the relationship between the header and the value is critical.
- **Data is Primary Content:** Use **Stacked** to provide a "mobile-first"
  card-like experience.
- **Highly Complex / Many Columns:** Use **Column Toggle** to prioritize "Need
  to Know" over "Nice to Know" data.

## Constraints

- **Horizontal Space:** Tables must never cause the entire page to scroll
  horizontally.
- **Label Duplication:** In the Stacked pattern, ensure labels are managed via
  `data-` attributes to avoid duplicating content in the DOM.
- **Touch Targets:** Any interactive elements within cells (links, buttons) must
  remain at least 44x44px on mobile.

## Non-Goals

- Styling the visual theme (borders, zebra-striping).
- Implementing advanced sorting/filtering logic (though the table structure
  should support it).
- Creating fixed/sticky headers (separate specialized skill).

## Common Failure Patterns

- **The "Broken" Layout:** Allowing the table to expand beyond the viewport
  width.
- **Hidden Context:** Hiding the headers on mobile without providing another way
  to identify what the data means (e.g., Stacked pattern without labels).
- **Broken Semantics:** Using `display: block` on tables without adding ARIA
  roles, making the data a "string of text" for screen readers.
- **Missing Interaction Cues:** Users not realizing a table is scrollable.

## Validation Steps

- [ ] **Viewport Stress Test:** Check the table at 320px, 768px, and 1024px.
      Does it overflow?
- [ ] **Screen Reader Check:** Does the screen reader still announce "Table, 5
      columns, 10 rows" and navigate correctly?
- [ ] **Visual Clarity:** On mobile, is it clear which value belongs to which
      header?
- [ ] **Keyboard Nav:** Can all links/buttons inside the table be reached and
      activated?
