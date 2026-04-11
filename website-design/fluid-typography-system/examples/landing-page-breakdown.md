# Fluid Typography Example: SaaS Landing Page

This example demonstrates how a fluid typography system adapts a standard SaaS landing page across three key viewport stages.

## System Parameters
- **Viewport Range:** 320px to 1280px
- **Base Size:** 16px to 18px
- **Ratio:** 1.250 (Major Third)

## Page Breakdown

### 1. Mobile Viewport (320px)
At the smallest supported width, the typography is compact to maximize content visibility on small screens.
- **Hero H1:** 30.52px (approx. 1.9rem) - Large enough to be the focal point without overwhelming the small screen.
- **Section H2:** 25px (approx. 1.56rem)
- **Body Text:** 16px (1rem) - Baseline readability.
- **Visual Impact:** The layout feels "tight" and readable. Lines are short, and the vertical rhythm is maintained with smaller spacing.

### 2. Tablet Viewport (768px)
As the screen grows, the `clamp()` function linearly increases all font sizes.
- **Hero H1:** ~43px
- **Section H2:** ~34px
- **Body Text:** ~17px
- **Visual Impact:** The typography begins to "breathe". The increased base size compensates for the typically greater viewing distance of tablets compared to phones.

### 3. Desktop Viewport (1280px and above)
At the maximum scaling width, the typography reaches its full design intent.
- **Hero H1:** 54.93px (approx. 3.43rem) - A bold, high-impact headline.
- **Section H2:** 43.95px (approx. 2.75rem)
- **Body Text:** 18px (1.125rem) - Comfortable reading size for large monitors.
- **Visual Impact:** High contrast between headings and body text creates a strong visual hierarchy. The layout uses the extra space for wider margins while the scaling text maintains a balanced measure (line length).

## CSS Implementation Snippet
```css
:root {
  /* Fluid Base: 16px at 320px, 18px at 1280px */
  --font-size-base: clamp(1rem, 0.9583rem + 0.2083vw, 1.125rem);

  /* Fluid H1 (Ratio 1.25^5): 30.52px to 54.93px */
  --font-size-h1: clamp(1.9075rem, 1.399rem + 2.5427vw, 3.4331rem);
}
```
