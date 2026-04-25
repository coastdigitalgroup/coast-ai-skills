# ARIA Roles and Attributes for Tabs

Correct ARIA usage is critical for screen readers to identify the "Tabs" widget
and communicate the relationship between labels and content.

## Roles

### `role="tablist"`

- **Element:** The container for the set of tabs.
- **Requirement:** Must have an `aria-label` or `aria-labelledby` if there are
  multiple tab sets on the page.

### `role="tab"`

- **Element:** The individual tab button.
- **Requirement:** Must be a child of `tablist` (or programmatically owned by
  it).
- **Behavior:** Acts like a radio button (only one selected at a time).

### `role="tabpanel"`

- **Element:** The container for the content associated with a tab.
- **Requirement:** Should be focusable (`tabindex="0"`) if it doesn't contain
  focusable children.

## States and Properties

### `aria-selected`

- Applied to `role="tab"`.
- `true` for the active tab, `false` for others.

### `aria-controls`

- Applied to `role="tab"`.
- Value is the `id` of the corresponding `tabpanel`.

### `aria-labelledby`

- Applied to `role="tabpanel"`.
- Value is the `id` of the corresponding `tab`.

### `aria-orientation`

- Applied to `role="tablist"`.
- Values: `horizontal` (default) or `vertical`.
