# Card Structure Template

This template defines a portable, implementation-aware structure for a standard
UI card. Use this as a blueprint for HTML, Component (React/Vue), or Design Tool
layouts.

## Standard Modular Structure

```text
[ CARD CONTAINER ]
│  (Shadow/Border, Border Radius, Overflow Hidden)
│
├── [ IMAGE AREA (Anchor) ]
│   └── Aspect Ratio Box (e.g., 16:9)
│       └── Image (Object-fit: cover)
│
├── [ CONTENT AREA (Context) ]
│   │  (Padding: 1rem - 2rem)
│   │
│   ├── [ METADATA (Overline) ]
│   │   └── Category / Tag (Uppercase, 0.75rem)
│   │
│   ├── [ TITLE (Heading) ]
│   │   └── H3 / H4 (Bold, 1.25rem - 1.5rem)
│   │
│   ├── [ BODY (Description) ]
│   │   └── P (Clamped to 2-3 lines)
│   │
│   └── [ SECONDARY METADATA ]
│       └── List (Inline, Muted, e.g., Date | Author)
│
└── [ ACTION AREA (Target) ]
    │  (Padding: Top: 0, Bottom/Sides: Same as Content)
    │  (Margin-top: auto - Pushes to bottom)
    │
    └── [ PRIMARY CTA ]
        └── Button or Link (Minimum 44px height)
```

## Accessibility Checklist for Implementation

1.  **Semantic Wrapper:** Wrap the collection in a list (`<ul>` or `<ol>`) and
    each card in a list item (`<li>`).
2.  **Heading Level:** Ensure the card title uses a heading level (H2-H4) that
    fits the page's document outline.
3.  **Clickable Area:**
    - If the whole card should be clickable, use the **Stretched Link** pattern
      (a `::after` pseudo-element on the main `<a>` that covers the
      relative-positioned card).
    - Avoid wrapping the entire card in an `<a>` tag if it contains other links
      (like categories) or buttons.
4.  **Alt Text:**
    - `alt="Product name"` (Good)
    - `alt=""` (Only if the image is redundant with the title)
    - `alt="image"` (Bad)

## Responsive Configuration

| Breakpoint                  | Cards Per Row | Width Adjustment      |
| :-------------------------- | :------------ | :-------------------- |
| **Mobile (<600px)**         | 1             | 100% width            |
| **Tablet (600px - 1024px)** | 2             | ~48% width (with gap) |
| **Desktop (>1024px)**       | 3 or 4        | 25% - 33% width       |

## CSS "Grid Trick" for Equal Heights

To ensure all cards in a row have the same height and buttons align at the
bottom:

```css
.card {
  display: flex;
  flex-direction: column;
  height: 100%; /* Fill the grid cell */
}

.card__content {
  flex-grow: 1; /* Pushes action area down */
  display: flex;
  flex-direction: column;
}

.card__action {
  margin-top: auto; /* Final insurance for bottom alignment */
}
```
