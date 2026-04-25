# Accordion Accessibility and Behavior Reference

## ARIA Roles and Attributes

| Attribute         | Applied To           | Description                                                                                    |
| :---------------- | :------------------- | :--------------------------------------------------------------------------------------------- |
| `aria-expanded`   | Trigger (`<button>`) | Indicates whether the panel is currently open (`true`) or closed (`false`).                    |
| `aria-controls`   | Trigger (`<button>`) | Contains the `id` of the panel element that the button controls.                               |
| `role="region"`   | Panel (`<div>`)      | Defines the panel as a landmark region. Screen readers can navigate directly to these regions. |
| `aria-labelledby` | Panel (`<div>`)      | Points to the `id` of the trigger button to provide a name for the region.                     |
| `aria-hidden`     | Icon (`<svg>`)       | Set to `true` if the icon is purely decorative and shouldn't be read.                          |

## Keyboard Interactions

- **Enter / Space:** Toggles the expansion state of the associated panel.
- **Tab:** Moves focus to the next focusable element. If the panel is expanded,
  the next element is the first focusable item within the panel. If collapsed,
  the next element is the next accordion trigger.
- **Shift + Tab:** Moves focus to the previous focusable element.
- **(Optional) Arrow Keys:**
  - **Down Arrow:** Moves focus to the next accordion header.
  - **Up Arrow:** Moves focus to the previous accordion header.
  - **Home:** Moves focus to the first accordion header.
  - **End:** Moves focus to the last accordion header.

## WCAG Compliance Checklist

1.  **Operable:** Every trigger must be reachable and activatable via keyboard.
2.  **Understandable:** The state (expanded/collapsed) must be announced.
3.  **Robust:** Use semantic HTML (`<button>`) to ensure native behavior is
    inherited.
4.  **Visible Focus:** Focus indicators must be clearly visible on the trigger
    buttons.

## Animation & Accessibility

When animating accordions, follow these rules:

- **Duration:** Keep transitions between 200ms and 400ms. Anything longer feels
  sluggish; anything shorter feels jarring.
- **Reduced Motion:** Respect user preferences by disabling animations if
  `(prefers-reduced-motion: reduce)` is active.
- **Content Visibility:** Ensure content is removed from the accessibility tree
  when fully collapsed (using `display: none`, `visibility: hidden`, or `hidden`
  attribute) AFTER the animation completes.

```css
@media (prefers-reduced-motion: reduce) {
  .accordion-panel {
    transition: none !important;
  }
}
```

## Native `<details>` vs Custom ARIA

| Feature            | `<details>` / `<summary>`                      | Custom ARIA (`button` + `aria-expanded`) |
| :----------------- | :--------------------------------------------- | :--------------------------------------- |
| **Ease of Use**    | High (native browser behavior)                 | Medium (requires JS)                     |
| **Animation**      | Hard (requires modern CSS or JS)               | Easy (can use Grid/Flex tricks)          |
| **Exclusive Mode** | Possible (`name` attribute in modern browsers) | Easy (custom JS logic)                   |
| **Control**        | Standardized                                   | Full control over structure and behavior |
