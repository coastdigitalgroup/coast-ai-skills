# Reference: Contrast Pairing Guide (WCAG 2.1)

Use this guide to ensure your color system meets international accessibility
standards.

## 1. Contrast Ratio Requirements

| Element Type                         | Level AA | Level AAA |
| :----------------------------------- | :------- | :-------- |
| **Normal Text** (< 18pt)             | 4.5:1    | 7.0:1     |
| **Large Text** (> 18pt or 14pt bold) | 3.0:1    | 4.5:1     |
| **UI Components & Icons**            | 3.0:1    | 4.5:1     |
| **Incidental / Decorative**          | None     | None      |

## 2. Common "Safe" Pairing Patterns

### On White (#FFFFFF) / Light Gray

- **Safe AA:** Black, Dark Gray (#767676 minimum), Dark Blue, Deep Green.
- **Unsafe AA:** Light Blue (#00A3FF), Orange, Yellow, Light Gray (#CCCCCC).

### On Dark Gray / Black (#121212)

- **Safe AA:** White, Light Cyan, Yellow, Pastel colors.
- **Unsafe AA:** Dark Blue, Deep Red, Muted Purple.

## 3. The 60-30-10 Rule for Accessibility

To maintain hierarchy and accessibility:

- **60% (Primary Surface):** Use a high-contrast neutral (e.g., White or
  Off-white).
- **30% (Secondary Surface/Muted):** Use a safe secondary contrast (e.g., Light
  Gray).
- **10% (Action/Accent):** Use your brand color, but ensure text placed _on_ it
  or _in_ it meets the 4.5:1 ratio.

## 4. Semantic Color Best Practices

### Error (Red)

- **Avoid:** Red on Green (Colorblindness failure).
- **Use:** Red text on a very light red background, accompanied by an "Error"
  icon.

### Success (Green)

- **Avoid:** Light Green on White (Contrast failure).
- **Use:** Dark Emerald Green (#2F855A) for text.

### Info (Blue)

- **Use:** Standard "Link Blue" (#0055FF) usually requires a slightly darker
  variant (#0044CC) to pass 4.5:1 on white.

## 5. Non-Color Indicators

**Golden Rule:** Color should never be the _only_ visual means of conveying
information.

- **Bad:** Red border = Error.
- **Good:** Red border + "Error" icon + "Invalid email" text.
- **Bad:** Blue text = Link.
- **Good:** Blue text + Underline.
