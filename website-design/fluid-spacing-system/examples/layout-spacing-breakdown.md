# Example: Fluid Spacing in a Marketing Landing Page

This example demonstrates how a fluid spacing scale is applied to a standard
marketing landing page to ensure it feels balanced on both a 375px wide iPhone
and a 1440px wide MacBook.

## The Spacing Scale

For this layout, we use a **1.5x Multiplicative Scale** with a base of 16px
(mobile) to 20px (desktop).

| Token        | Role             | Mobile (375px) | Desktop (1440px) | Implementation                              |
| :----------- | :--------------- | :------------- | :--------------- | :------------------------------------------ |
| `--space-xs` | Internal Padding | 8px            | 10px             | `clamp(0.5rem, 0.43rem + 0.19vw, 0.625rem)` |
| `--space-s`  | Component Gap    | 16px           | 20px             | `clamp(1rem, 0.86rem + 0.38vw, 1.25rem)`    |
| `--space-m`  | Card Padding     | 24px           | 30px             | `clamp(1.5rem, 1.29rem + 0.56vw, 1.875rem)` |
| `--space-l`  | Grid Gutter      | 32px           | 40px             | `clamp(2rem, 1.72rem + 0.75vw, 2.5rem)`     |
| `--space-xl` | Section Gap      | 64px           | 100px            | `clamp(4rem, 2.73rem + 3.38vw, 6.25rem)`    |

---

## Layout Breakdown

### 1. Hero Section

- **Top/Bottom Padding:** Uses `--space-xl`.
  - _Mobile:_ 64px gives enough room for the headline without pushing the CTA
    off-screen.
  - _Desktop:_ 100px creates a premium, spacious "airy" feel.
- **Headline to Subhead Gap:** Uses `--space-s`.
  - Maintains tight proximity as they are part of the same text block.

### 2. Feature Grid

- **Section Heading to Grid Gap:** Uses `--space-l`.
- **Gutter between Cards:** Uses `--space-l`.
  - As the screen grows, the cards get more "breathing room," preventing the
    grid from looking cramped on large displays.
- **Inside the Card:**
  - **Card Padding:** `--space-m`.
  - **Icon to Title Gap:** `--space-xs`.

### 3. Call to Action (CTA) Banner

- **Internal Padding:** `--space-xl` (vertical), `--space-l` (horizontal).
- **Button Padding:** `--space-s` (vertical), `--space-l` (horizontal).

---

## Visual Summary of Behavior

### On Mobile (375px)

The layout is compact. Section gaps are significant enough to define boundaries,
but the overall content remains "above the fold." Internal component spacing is
tight (8-16px) to maximize the limited screen real estate.

### On Desktop (1440px)

The layout "expands." The extra white space (up to 100px between sections)
signals a higher-end brand experience and reduces cognitive load by clearly
separating different messages. The gutters grow to match the larger typography
and imagery.
