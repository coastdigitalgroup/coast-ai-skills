# Card Accessibility & Best Practices

Cards are complex UI components because they often combine multiple types of
information (images, text, data) with one or more interactive targets. Use this
reference to ensure your card designs are usable and accessible.

## 1. Clickable Area Patterns

There are three common ways to handle card interactivity. Choose based on the
user's primary goal.

### Pattern A: Specific Action Targets (Recommended)

- **Design:** Only the Title and the Button are clickable.
- **Why:** Prevents "accidental clicks" when users are trying to select text or
  scroll on mobile.
- **Accessibility:** Clearer for screen readers; users know exactly where they
  are going.

### Pattern B: The Stretched Link

- **Design:** The entire card looks and feels clickable, but the link is
  technically attached to the Title.
- **Why:** Best for "Discoverability" where you want to minimize the effort to
  click.
- **Implementation:** Use a CSS `::after` pseudo-element on the title link that
  expands to cover the entire card container.

### Pattern C: Multi-Action Card

- **Design:** The card contains multiple links (e.g., Category link, Title link,
  and a "Save" icon).
- **Why:** Use only when users need to perform different types of tasks from the
  same card.
- **Constraint:** Ensure each action has a unique, descriptive label for screen
  readers.

## 2. The Accessibility Checklist

- [ ] **Semantic Structure:** The card container should ideally be an
      `<article>` or a `<li>` within a `<ul>`.
- [ ] **Heading Order:** Card titles must be headings (`H2`-`H4`). Do not skip
      levels (e.g., do not go from an `H1` page title directly to `H4` card
      titles).
- [ ] **Image Alt Text:**
  - If the image is the same as the title (e.g., product photo), it can be
    marked as decorative (`alt=""`) to avoid redundancy.
  - If it provides unique info (e.g., a "Sold Out" badge), it MUST have alt
    text.
- [ ] **Focus States:** When a user Tabs into a card, there must be a clear,
      high-contrast visual indicator.
- [ ] **Touch Targets:** Interactive areas (buttons, icons) must be at least
      **44x44px**.

## 3. Visual Hierarchy & Proximity

- **The Squint Test:** When you squint at a grid of cards, the primary action
  (Target) and the visual hook (Anchor) should be the most prominent.
- **Spacing:** Group related items together. The Title and Price should have
  less space between them than the Price and the CTA.
- **Typography:** Use a distinct weight or color for the Title to separate it
  from the metadata.

## 4. Mobile Considerations

- **Stacking:** In a single-column mobile view, decide if the image should stay
  at the top or move to the left.
- **Density:** If your desktop card has a long description, consider hiding it
  on mobile to keep the cards scannable.
- **Horizontal Scrolling:** For "Related Products" or "Featured Articles," a
  horizontal scroll container (carousels) is often better than a long vertical
  list on mobile.
