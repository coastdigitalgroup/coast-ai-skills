# Syntax Highlighting & Code Accessibility Reference Guide

This reference provides technical accessibility specifications, WCAG AA color contrast guidelines, monospace font stack recommendations, and assistive technology interaction models for the **Code Block UI System**.

---

## 1. WCAG AA Syntax Token Color Contrast Standards

Under **WCAG 2.1 SC 1.4.3 (Contrast Minimum)**, all text and code tokens must maintain a minimum contrast ratio of **4.5:1** against the background color. Low-contrast syntax highlighting (frequently found in developer tools and comments) creates severe barriers for low-vision users.

### Dark Theme Reference Tokens (`#0F172A` Slate Background)

| Token Category | Semantic Target | Color Hex | Contrast Ratio | Compliant Role |
| :--- | :--- | :--- | :--- | :--- |
| **Code Canvas Surface** | Background | `#0F172A` | Base Surface | Outer `<pre>` container |
| **Keywords** | `const`, `function`, `import` | `#C084FC` | **7.2:1** | `.tok-kw` |
| **Functions & Methods** | `fetch()`, `useState()` | `#38BDF8` | **8.5:1** | `.tok-fn` |
| **Strings & Text** | `"hello world"`, `'GET'` | `#4ADE80` | **9.1:1** | `.tok-str` |
| **Comments** | `// TODO: handle retry` | `#94A3B8` | **5.1:1** | `.tok-cm` |
| **Types & Classes** | `User`, `Promise<void>` | `#FACC15` | **11.4:1** | `.tok-type` |
| **Numbers & Booleans** | `200`, `true`, `false` | `#FB923C` | **7.8:1** | `.tok-num` |
| **Base Code & Punctuation**| `{`, `}`, `;`, `=`, `,` | `#E2E8F0` | **12.5:1** | Default text |

### Light Theme Reference Tokens (`#F8FAFC` Off-White Background)

| Token Category | Semantic Target | Color Hex | Contrast Ratio | Compliant Role |
| :--- | :--- | :--- | :--- | :--- |
| **Code Canvas Surface** | Background | `#F8FAFC` | Base Surface | Outer `<pre>` container |
| **Keywords** | `const`, `function`, `import` | `#6B21A8` | **9.4:1** | `.tok-kw` |
| **Functions & Methods** | `fetch()`, `useState()` | `#0369A1` | **7.8:1** | `.tok-fn` |
| **Strings & Text** | `"hello world"`, `'GET'` | `#15803D` | **6.2:1** | `.tok-str` |
| **Comments** | `// TODO: handle retry` | `#475569` | **7.1:1** | `.tok-cm` |
| **Types & Classes** | `User`, `Promise<void>` | `#A16207` | **5.2:1** | `.tok-type` |
| **Numbers & Booleans** | `200`, `true`, `false` | `#C2410C` | **6.5:1** | `.tok-num` |
| **Base Code & Punctuation**| `{`, `}`, `;`, `=`, `,` | `#0F172A` | **15.8:1** | Default text |

---

## 2. Monospace Font Stack & Typography Guidelines

1. **Recommended System Monospace Stack:**
   ```css
   font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
   ```
2. **Character Distinction:** Ensure the selected typeface provides unambiguous visual distinction between:
   - Zero (`0`) vs. Capital O (`O`)
   - One (`1`), lowercase L (`l`), and uppercase I (`I`)
   - Backtick (``` ` ```) vs. single quote (`'`)
3. **Font Sizing & Line Height Ratio:**
   - Preferred Font Size: `0.875rem` (14px). Minimum: `0.8125rem` (13px).
   - Line Height: `1.6` (22.4px at 14px size). A line height tighter than 1.5 causes brackets, superscripts, and syntax underscores to clash visually.
4. **Font Ligatures Caution:** Avoid enabling coding ligatures (e.g., converting `==` into `≡` or `=>` into `⇒`) by default on documentation platforms, as ligatures can confuse beginner developers learning language syntax. Allow ligatures only as an explicit user preference.

---

## 3. Screen Reader & Clipboard DOM Architecture

Screen readers navigate code character-by-character or line-by-line. If line numbers or diff symbols are placed in the DOM as raw text inside `<pre>`, screen readers will announce line numbers interspersed with code, and clipboard copy actions will fail by copying line numbers.

### Compliant DOM Pattern

```html
<div class="code-line">
  <!-- Line Number: Hidden from screen readers AND clipboard selection -->
  <span class="line-number" aria-hidden="true">12</span>

  <!-- Line Content: Pure code, easily copyable -->
  <span class="line-content">
    <span class="tok-kw">export const</span> auth = <span class="tok-fn">getAuth</span>();
  </span>
</div>
```

### CSS Isolation Rules

```css
.line-number {
  user-select: none;          /* Prevents text selection during cursor drag */
  -webkit-user-select: none;
  pointer-events: none;       /* Prevents click focus interception */
}
```

---

## 4. Accessibility Rules for Code Diffs & Callouts

When displaying code diffs (`+` additions and `-` deletions) or line highlights:

1. **Do NOT rely on color alone (WCAG SC 1.4.1):**
   - Colorblind users cannot distinguish red vs. green line backgrounds.
   - Always include explicit `+` or `-` characters, or include visually hidden screen reader text:
     ```html
     <div class="code-line diff-add">
       <span class="line-number" aria-hidden="true">+</span>
       <span class="line-content">
         <span class="sr-only">Added line:</span>
         <span class="tok-kw">import</span> { retry } <span class="tok-kw">from</span> <span class="tok-str">'./utils'</span>;
       </span>
     </div>
     ```

2. **Full-Width Line Highlight Spans:**
   - Ensure highlighted lines set `min-width: 100%` on the line container so the background tint covers the full scrollable horizontal canvas when code extends beyond the viewport width.

---

## 5. Keyboard Navigation & ARIA Patterns

- **Multi-File Header Tabs:** Use standard WAI-ARIA Tabs pattern (`role="tablist"`, `role="tab"`, `aria-selected="true/false"`, `aria-controls="panel-id"`). Support Arrow key navigation between file tabs.
- **Copy Button Feedback:** Use `aria-live="polite"` region for dynamic status announcements without disrupting keyboard focus.
- **Scroll Container Focus:** If the code container is horizontally scrollable and accessible via keyboard, apply `tabindex="0"` with `aria-label="Code snippet scrollable container"` and a high-contrast focus ring (`outline: 2px solid #38BDF8`).
