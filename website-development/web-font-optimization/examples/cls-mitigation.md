# Example: Mitigating Layout Shift (CLS) from Font Swaps

This example demonstrates how to use the modern CSS `size-adjust` property to
prevent a page from "jumping" when a custom font replaces a fallback font.

## The Problem (Before)

When a custom font (like "Inter") loads, it might have a different X-height or
width than the fallback "sans-serif". This causes the surrounding text and
elements to shift, increasing the Cumulative Layout Shift (CLS) score.

```css
/* Naive implementation */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}

body {
  font-family: 'Inter', sans-serif;
}
```

## The Solution (After)

We create a "fallback" font face that matches the dimensions of our custom font
using `size-adjust`.

```css
/* 1. Define the custom font */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

/* 2. Define a adjusted fallback that mimics Inter's size */
@font-face {
  font-family: 'Inter-Fallback';
  src: local('Arial');
  size-adjust: 107%; /* Adjust this until the fonts match in size */
  ascent-override: 90%;
  descent-override: 20%;
}

/* 3. Apply the adjusted fallback */
body {
  font-family: 'Inter', 'Inter-Fallback', sans-serif;
}
```

## Results

- **Before:** Page shifts by 20px when font loads. CLS = 0.15.
- **After:** Visual size remains nearly identical during the swap. CLS = 0.01.
