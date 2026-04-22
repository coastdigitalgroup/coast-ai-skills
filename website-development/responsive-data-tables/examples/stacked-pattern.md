# Responsive Table: Stacked Pattern Example

This example demonstrates the "Stacked" pattern, which transforms table rows
into individual "cards" on small screens. This is ideal for tables with a
limited number of columns where each row represents a distinct entity (e.g., a
product or a plan).

## Scenario

A pricing comparison table that needs to be readable on mobile devices without
horizontal scrolling.

## Implementation

### HTML

The key is using `data-label` attributes on each `<td>` to match the column
header. We also add ARIA roles to ensure accessibility is maintained when we
change the CSS `display` properties.

```html
<table class="responsive-table stacked" role="table">
  <caption>
    Subscription Plan Comparison
  </caption>
  <thead role="rowgroup">
    <tr role="row">
      <th scope="col" role="columnheader">Plan</th>
      <th scope="col" role="columnheader">Price</th>
      <th scope="col" role="columnheader">Storage</th>
      <th scope="col" role="columnheader">Users</th>
    </tr>
  </thead>
  <tbody role="rowgroup">
    <tr role="row">
      <td data-label="Plan" role="cell">Basic</td>
      <td data-label="Price" role="cell">$10/mo</td>
      <td data-label="Storage" role="cell">5GB</td>
      <td data-label="Users" role="cell">1 User</td>
    </tr>
    <tr role="row">
      <td data-label="Plan" role="cell">Pro</td>
      <td data-label="Price" role="cell">$25/mo</td>
      <td data-label="Storage" role="cell">50GB</td>
      <td data-label="Users" role="cell">5 Users</td>
    </tr>
    <tr role="row">
      <td data-label="Plan" role="cell">Enterprise</td>
      <td data-label="Price" role="cell">Custom</td>
      <td data-label="Storage" role="cell">Unlimited</td>
      <td data-label="Users" role="cell">Unlimited</td>
    </tr>
  </tbody>
</table>
```

### CSS

We use a media query to switch the table elements to `display: block` and use
pseudo-elements to display the labels.

```css
/* Base Table Styles */
.responsive-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.responsive-table th,
.responsive-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

/* Stacked Pattern for Mobile */
@media (max-width: 600px) {
  .responsive-table.stacked,
  .responsive-table.stacked thead,
  .responsive-table.stacked tbody,
  .responsive-table.stacked th,
  .responsive-table.stacked td,
  .responsive-table.stacked tr {
    display: block;
    width: 100%;
  }

  /* Hide the table header row visually */
  .responsive-table.stacked thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .responsive-table.stacked tr {
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .responsive-table.stacked td {
    /* Make room for the label */
    padding-left: 50%;
    position: relative;
    border: none;
    border-bottom: 1px solid #eee;
  }

  .responsive-table.stacked td:last-child {
    border-bottom: none;
  }

  /* Insert the label from data-label attribute */
  .responsive-table.stacked td:before {
    content: attr(data-label);
    position: absolute;
    left: 0.75rem;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: bold;
    color: #555;
  }
}
```

## Why this works

1. **No Horizontal Scrolling:** The table fits within the viewport.
2. **Context Retention:** The `data-label` attribute ensures users know what
   each value represents even when the header is hidden.
3. **Accessibility:** Adding `role="table"`, `role="row"`, etc., fixes the issue
   where browsers (like Safari) stop treating the elements as a table when
   `display: block` is applied.
4. **Visual Hierarchy:** Each row becomes a distinct card, making it easier to
   scan on small screens.
