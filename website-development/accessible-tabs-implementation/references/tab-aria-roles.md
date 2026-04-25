# Tab ARIA Roles and Attributes

Correct ARIA roles and attributes are essential for screen reader users to
understand the structure and state of a tabbed interface.

## Core Roles

| Role       | Applied To             | Description                                                               |
| :--------- | :--------------------- | :------------------------------------------------------------------------ |
| `tablist`  | Container of tabs      | Identifies the element as a container for a set of tabs.                  |
| `tab`      | Individual tab trigger | Identifies the element as a selectable tab. Must be a child of `tablist`. |
| `tabpanel` | Content container      | Identifies the element as the content associated with a specific `tab`.   |

## State and Relationship Attributes

### On the `tab` element:

- `aria-selected="true|false"`: Indicates whether the tab is currently active.
- `aria-controls="[ID]"`: Points to the ID of the associated `tabpanel`.
- `tabindex="0|-1"`: Controls keyboard focusability. Only the active tab should
  have `0`.

### On the `tabpanel` element:

- `aria-labelledby="[ID]"`: Points to the ID of the associated `tab`. This
  provides a label for the panel when it receives focus.
- `tabindex="0"`: Highly recommended if the panel contains no focusable
  elements. This allows the panel itself to be focused so its content is read.

### On the `tablist` element:

- `aria-label="[Text]"`: Provides a label for the tab set (e.g., "Product
  details").
- `aria-orientation="horizontal|vertical"`: Indicates the visual orientation
  (defaults to `horizontal`).
