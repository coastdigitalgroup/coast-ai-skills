# Split-Screen Layout & Accessibility Specification

This reference guide outlines technical rules, spatial proportions, scroll interaction models, and WCAG 2.2 AA accessibility requirements for implementing dual-panel split-screen layouts.

---

## 1. Spatial Proportions & Grid Specifications

When designing split-screen layouts, spatial distribution determines visual dominance and content focus.

### Proportion Ratios

| Split Ratio | Visual Pane Width | Interactive Pane Width | Ideal Application |
| :--- | :--- | :--- | :--- |
| **50 / 50** | `50%` (`1fr`) | `50%` (`1fr`) | Sign-in / Sign-up portals, A/B choice comparisons, dual personas |
| **60 / 40** | `60%` (`1.5fr`) | `40%` (`1fr`) | Interactive media showcases, 3D model configuration |
| **35 / 65** | `35%` (`1fr`) | `65%` (`1.85fr`) | Multi-step checkout, complex registration forms, settings wizards |
| **70 / 30** | `70%` (`2.33fr`) | `30%` (`1fr`) | Primary document/editor pane with sticky contextual metadata sidebar |

### Viewport Height Rules
- **Do NOT use fixed `height: 100vh` on full-screen splits.** On mobile browsers (iOS Safari, Chrome for Android), dynamic address bar expansion and collapse will cause `100vh` layouts to clip content at the bottom of the viewport.
- **DO use `min-height: 100dvh`.** Dynamic Viewport Height (`100dvh`) automatically adjusts as dynamic browser chrome expands or retracts, preserving bottom button visibility.

---

## 2. Scroll Interaction Models

Split-screen layouts support three primary scrolling behavior paradigms:

```text
+-------------------------------------------------------------------------+
| SCROLL MODEL MATRIX                                                     |
|                                                                         |
| Model A: Fixed Viewport (100dvh)  --> Neither panel scrolls globally.  |
|                                       Internal overflow: auto if text   |
|                                       exceeds height.                   |
|                                                                         |
| Model B: Sticky Media Dock       --> Visual panel position: sticky.    |
|                                       Content panel scrolls naturally.  |
|                                                                         |
| Model C: Unified Natural Scroll   --> Both panels grow to fit content   |
|                                       and scroll together.              |
+-------------------------------------------------------------------------+
```

### Model A: Fixed Viewport Split
- Container uses `min-height: 100dvh` and `overflow: hidden`.
- Panels use `overflow-y: auto` to allow independent internal scrolling if content exceeds viewport height.
- Essential CSS:
  ```css
  .split-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100dvh;
  }
  .split-panel {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  ```

### Model B: Sticky Media Dock
- The visual media panel remains pinned in the viewport while the adjacent content panel scrolls naturally.
- Essential CSS:
  ```css
  .sticky-panel {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  ```

---

## 3. WCAG 2.2 AA Accessibility & DOM Sequencing

### Meaningful Sequence (WCAG SC 1.3.2)
Visual positioning must not alter logical reading and focus order.
- **Rule:** The primary actionable panel (`<main>`) must always appear FIRST in the HTML source code, regardless of whether CSS Grid displays it on the left or right side visually.
- **Example:**
  ```html
  <!-- HTML Source Order -->
  <div class="split-wrapper">
    <main class="panel-form">...</main> <!-- 1st in DOM -->
    <aside class="panel-brand">...</aside> <!-- 2nd in DOM -->
  </div>
  ```

### Focus Visibility Across Dual Background Tones (WCAG SC 2.4.11 / 2.4.13)
Dual-panel layouts often combine a dark brand panel with a light action panel. A single global focus outline style will fail contrast on one of the panels.
- **Light Panel Focus Outline:** Dark indigo or blue (e.g., `outline: 2px solid #2563eb; outline-offset: 2px`).
- **Dark Panel Focus Outline:** Bright cyan or white (e.g., `outline: 2px solid #38bdf8; outline-offset: 2px`).

### Decorative Media & Screen Readers (WCAG SC 1.1.1)
- Background illustrations, abstract gradient meshes, and ambient background video in the visual panel must be hidden from screen readers using `aria-hidden="true"`.
- Product interface screenshots that convey essential product capability information must include descriptive `alt` text.

---

## 4. Responsive Mobile Stacking Rules

When transitioning from desktop landscape view to mobile screens (< 768px):

1. **Collapse Grid to Single Column:** Reset `grid-template-columns` to `1fr`.
2. **Prioritize Primary Action:** Ensure the form or primary heading remains at the top of the mobile stack.
3. **Control Mobile Media Heights:** Reduce visual panels to fluid blocks (`max-height: 280px` or `aspect-ratio: 16 / 9`) to prevent users from having to scroll through full-screen imagery on mobile.
4. **Touch Target Size (WCAG SC 2.5.8):** All form fields, links, and buttons must satisfy a minimum tap target height of `44px`.
