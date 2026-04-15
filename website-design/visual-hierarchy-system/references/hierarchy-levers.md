# Visual Hierarchy Levers & Heuristics

A reference guide for the primary ways to manipulate visual weight on a website.

## 1. The 5 Primary Levers

### Size (Scale)

The most direct way to indicate importance. Larger elements attract attention
first.

- **Rule:** Your H1 should be at least 200% the size of your body text.

### Color and Contrast

Warm colors (Red, Orange, Yellow) "advance" toward the viewer, while cool colors
(Blue, Green, Purple) "recede".

- **Rule:** Use high contrast for Priority 1 and low contrast (gray-on-white)
  for Priority 3/4.

### Typography (Weight & Style)

Bold weights feel "heavier" and attract more attention than regular or light
weights.

- **Rule:** Use `font-weight: 700+` for headlines and `400` for body. Avoid
  using too many weights (stay under 3).

### Whitespace (Proximity)

Whitespace is not "empty space"; it is a tool for isolation. The more space
around an element, the more important it feels.

- **Rule:** If a CTA isn't being clicked, try doubling the margin around it.

### Position (Layout)

Users scan in predictable patterns.

- **Z-Pattern:** Used for landing pages with minimal text. The eye moves:
  Top-Left -> Top-Right -> Bottom-Left -> Bottom-Right.
- **F-Pattern:** Used for text-heavy pages. The eye moves across the top, then
  down the left side, with occasional horizontal scans.

---

## 2. Scan Patterns

| Pattern       | Best For             | Strategy                                                                                |
| :------------ | :------------------- | :-------------------------------------------------------------------------------------- |
| **Z-Pattern** | Visual Landing Pages | Place Logo (TL), Secondary CTA (TR), Headline (Center), and Primary CTA (BR).           |
| **F-Pattern** | Blogs, Documentation | Place H1 at the top, H2s along the left margin, and use bullet points to catch the eye. |

---

## 3. The "Hick's Law" Constraint

The more choices you present to a user, the longer it takes for them to make a
decision.

- **Hierarchy Fix:** If you have 5 buttons on a page, give ONE a primary style,
  TWO a secondary style, and TWO a tertiary (link) style. This reduces the
  cognitive load by creating a clear hierarchy of choice.
