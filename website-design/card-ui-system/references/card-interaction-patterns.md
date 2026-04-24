# Card Interaction & Accessibility Reference

This reference provides detailed guidance on implementing accessible and
performant card interactions.

## 1. Clickable Area Patterns

### Pattern A: Specific Action Targets (Recommended)

- **Implementation:** Keep buttons and links as distinct elements.
- **Accessibility:** Users can tab through each individual action. Screen
  readers announce exactly what each button does.
- **Best For:** Complex cards (e.g., e-commerce product cards with "Add to
  Cart", "Add to Wishlist", and "View Details").

### Pattern B: Stretched Link (The "Pseudo-Button" Pattern)

- **Implementation:**
  1. Set the card container to `position: relative`.
  2. Apply a pseudo-element (`::after`) to the primary link (usually the title).
  3. Expand the pseudo-element to fill the container:
     `position: absolute; top: 0; left: 0; right: 0; bottom: 0;`.
- **Accessibility:** The entire card becomes clickable, but the semantic "link"
  is the title. Tabbing focus lands on the title.
- **Best For:** Simple discovery cards (e.g., blog post previews) where the
  whole card leads to one destination.

### Pattern C: Full-Card Link

- **Implementation:** Wrap the entire `<article>` in an `<a>` tag.
- **Constraint:** Never nest other interactive elements (buttons, links) inside
  a Full-Card Link. This is invalid HTML and causes major accessibility
  failures.
- **Best For:** Very high-level discovery where no secondary actions are needed.

## 2. Accessibility Checklist

- [ ] **Semantic Markup:** Use the `<article>` tag for cards that represent
      independent content units.
- [ ] **Heading Hierarchy:** Use an appropriate heading level (usually `<h3>` or
      `<h4>`) for the card title.
- [ ] **Focus Management:**
  - Ensure the focus indicator is not hidden by `overflow: hidden`.
  - Use `outline-offset` to keep the focus ring visible on high-contrast
    backgrounds.
- [ ] **Alternative Text:** Always provide descriptive `alt` text for card
      images, unless the image is purely decorative.
- [ ] **Link Text Clarity:** Ensure links like "Read More" are descriptive
      enough in isolation or use `aria-label` to provide context (e.g.,
      `aria-label="Read more about [Article Title]"`).

## 3. Visual States Matrix

| State        | Visual Signal                                      | Purpose                                        |
| ------------ | -------------------------------------------------- | ---------------------------------------------- |
| **Default**  | Standard styling                                   | The baseline state.                            |
| **Hover**    | Cursor: pointer; Shadow increase; Transform        | Indicates the card is interactive.             |
| **Focus**    | High-contrast outline                              | Indicates where the keyboard user is.          |
| **Active**   | Slight scale down (0.98); Color shift              | Provides immediate tactile feedback on click.  |
| **Disabled** | Opacity reduction; Gray scale; Cursor: not-allowed | Indicates the action is currently unavailable. |

## 4. Performance Considerations

- **Containment:** Use `contain: content` or `contain: layout` on card grid
  items to optimize browser rendering of large lists.
- **Lazy Loading:** Always lazy-load card images (`loading="lazy"`) to improve
  initial page load performance.
- **Shadows:** Use `will-change: transform, box-shadow` sparingly only if you
  notice jank during hover animations on low-end devices.
