# Card Usability & Accessibility Checklist

Use this checklist during the design and audit phases to ensure cards are usable
by everyone and perform well across devices.

## 1. Content & Hierarchy

- [ ] **Scannability:** Can a user understand the card's purpose in under 2
      seconds?
- [ ] **Grouping:** Are related pieces of information (e.g., Price and Currency)
      visually grouped?
- [ ] **Priority:** Is the most important element (usually the Title) the most
      visually prominent?
- [ ] **Conciseness:** Does the card avoid "content bloat" (e.g., long
      paragraphs that belong on a detail page)?

## 2. Interaction & Affordance

- [ ] **Click Targets:** Are touch targets for buttons/links at least 44x44px?
- [ ] **Hover State:** Is there a clear visual change when a mouse user hovers
      over a clickable card?
- [ ] **Focus State:** Is there a high-contrast focus ring (min 3:1 contrast)
      for keyboard users?
- [ ] **Loading States:** Is there a pattern for how cards look while content is
      loading (e.g., skeleton screens)?

## 3. Accessibility (WCAG 2.1)

- [ ] **Heading Structure:** Do card titles use an appropriate heading level
      (e.g., H2 or H3) that fits the page's outline?
- [ ] **Link Text:** Are links descriptive (e.g., "Read [Article Name]") rather
      than generic ("Read More")?
- [ ] **Redundant Links:** If the whole card is clickable, are you using the
      "stretched link" pattern to avoid screen readers announcing the same
      destination multiple times?
- [ ] **Color Contrast:** Does all text meet the 4.5:1 contrast ratio against
      the card background?
- [ ] **Alt Text:** Do images have meaningful alt text (or `alt=""` if purely
      decorative)?

## 4. Responsiveness

- [ ] **No Fixed Widths:** Do cards grow/shrink based on the
      `responsive-grid-system`?
- [ ] **Aspect Ratios:** Do images maintain a consistent aspect ratio as the
      card width changes?
- [ ] **Alignment:** Do buttons or actions align across a row even when content
      lengths differ (e.g., using `margin-top: auto`)?
- [ ] **Text Overflow:** Are there rules for handling extremely long titles
      (e.g., wrapping vs. truncation)?

## 5. Visual Integrity

- [ ] **Spacing:** Is internal padding (`--space-m`) consistent across all cards
      in a set?
- [ ] **Borders/Shadows:** Is the elevation system consistent (e.g., don't mix
      heavy shadows with flat borders in the same grid)?
- [ ] **Brand Alignment:** Does the card style (corner radius, colors, fonts)
      match the parent brand system?
