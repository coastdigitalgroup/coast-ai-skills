# Example: Debugging a "Trapped" Z-index

This example demonstrates a common scenario where a developer tries to make a
tooltip appear on top of a header, but it remains "trapped" behind it due to
stacking context rules.

## The Problem

A tooltip inside a sidebar remains hidden behind the main site header, even
though the tooltip has `z-index: 9999` and the header only has `z-index: 100`.

### The "Broken" HTML Structure

```html
<header class="site-header">
  <!-- z-index: 100 -->
</header>

<main>
  <aside class="sidebar">
    <!-- opacity: 0.9 (Creates a Stacking Context!) -->
    <button class="has-tooltip">
      Hover me
      <span class="tooltip">I am the tooltip</span>
      <!-- z-index: 9999 -->
    </button>
  </aside>

  <section class="content">...</section>
</main>
```

### The "Broken" CSS

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
}

.sidebar {
  position: relative;
  opacity: 0.9; /* Hidden trap: this creates a new stacking context */
}

.tooltip {
  position: absolute;
  z-index: 9999; /* This 9999 is only relative to other elements INSIDE .sidebar */
  background: black;
  color: white;
}
```

## The Diagnosis

1.  **Identify Stacking Contexts:** The `.sidebar` has `opacity: 0.9`. In CSS,
    any opacity less than 1 creates a new stacking context.
2.  **Compare Contexts:**
    - The `.site-header` is in the root stacking context with `z-index: 100`.
    - The `.sidebar` is also in the root stacking context, but it has no
      `z-index` (default `auto`), so it follows DOM order. Since it comes after
      `.site-header` in the DOM, it should be on top, _but_ the header is
      `sticky` with `z-index: 100`.
    - The `.tooltip` is **not** in the root stacking context. It is trapped
      inside the `.sidebar` context.
3.  **The Conflict:** Because `.sidebar` (the parent) is effectively "below"
    `.site-header` in the root context, no `z-index` value on the `.tooltip` can
    ever make it jump out of its parent and over the header.

## The Solution

### Option 1: Move the Stacking Context (Recommended)

If the opacity was only for styling, move it to a child element or use a
semi-transparent background instead.

```css
.sidebar {
  position: relative;
  /* opacity: 0.9; REMOVED to break the stacking context */
  background: rgba(255, 255, 255, 0.9); /* Achieve look without context */
}
```

### Option 2: Elevate the Parent

Give the parent `.sidebar` its own `z-index` high enough to beat the header.

```css
.sidebar {
  position: relative;
  opacity: 0.9;
  z-index: 200; /* Now the sidebar (and all children) are above the header */
}
```

### Option 3: Portals (Advanced)

Move the tooltip in the DOM so it is a direct child of `<body>`, bypassing the
sidebar's stacking context entirely.

```html
<body>
  <header class="site-header">...</header>
  <main>
    <aside class="sidebar">...</aside>
  </main>
  <!-- Tooltip moved here via JavaScript "Portal" -->
  <div class="tooltip" style="top: 150px; left: 50px;">I am the tooltip</div>
</body>
```
