# Table Accessibility and Browser Behavior

Handling tables responsively requires balancing visual layout with the semantic
structure that assistive technologies rely on.

## Semantic Requirements (WCAG)

### 1. The `<caption>` Element

Every data table should have a `<caption>`. It acts as a heading for the table,
providing immediate context for screen reader users.

- **Placement:** Must be the first child of `<table>`.
- **Visibility:** Can be visually hidden if the design doesn't allow it, but it
  must remain in the DOM.

### 2. Header Scoping

Use the `scope` attribute on `<th>` elements to explicitly define if it's a
header for a column or a row.

- `scope="col"`: For column headers in the `<thead>`.
- `scope="row"`: For row headers (the first cell in a `<tbody>` row).

### 3. Relationships

For complex tables where `scope` isn't enough, use `id` on headers and the
`headers` attribute on data cells to create a direct link.

```html
<th id="h-price">Price</th>
<td headers="h-price">$50</td>
```

## Browser Behavior Quirks

### The "Display: Block" Problem

When you apply `display: block`, `display: flex`, or `display: grid` to table
elements (`table`, `tr`, `td`), many browsers (most notably Safari) strip the
element's semantic role. To the accessibility tree, it's no longer a table but a
collection of `div`s.

**Solution:** Explicitly add ARIA roles to restore the semantics:

- `<table>` -> `role="table"`
- `<thead>` / `<tbody>` -> `role="rowgroup"`
- `<tr>` -> `role="row"`
- `<th>` -> `role="columnheader"` or `role="rowheader"`
- `<td>` -> `role="cell"`

### Overflow Scroll Focus

When using the Overflow Scroll pattern, the scrollable container must be
keyboard-accessible.

- **Requirement:** Add `tabindex="0"` to the container so keyboard users can
  focus it and scroll using arrow keys.
- **Labeling:** Add `aria-labelledby` or `aria-label` to the container to
  explain what is being scrolled.

```html
<div
  class="table-container"
  tabindex="0"
  role="region"
  aria-label="Financial data table, horizontal scroll"
>
  <table>
    ...
  </table>
</div>
```

## Performance & Rendering

- **`table-layout: fixed`:** Use this CSS property to speed up rendering for
  large tables. It tells the browser to determine column widths based on the
  first row rather than waiting for the entire table to load and calculate
  widths based on content.
- **Zebra Striping:** Use `:nth-child(even)` for better readability, but ensure
  the contrast ratio remains high enough for both background colors.
