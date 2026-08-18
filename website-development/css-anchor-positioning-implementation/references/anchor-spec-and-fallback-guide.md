# CSS Anchor Positioning Technical Reference

This guide details the technical specifications, property syntax, top-layer interaction, and browser polyfill strategies for implementing **CSS Anchor Positioning** (W3C CSS Anchor Positioning Module Level 1).

---

## 1. Key Specification Properties & Functions

### `anchor-name`
Declares an element as a named anchor reference point. Must use a dashed-ident (custom identifier starting with `--`).

```css
.trigger-button {
  anchor-name: --nav-anchor;
}
```

### `position-anchor`
Links a positioned element (`position: absolute` or `fixed`) to a default anchor element.

```css
.dropdown-menu {
  position: fixed;
  position-anchor: --nav-anchor;
}
```

### `position-area` (formerly `inset-area`)
Shorthand property placing an element relative to its anchor using a 3x3 layout grid concept. Grid tracks are named: `top`, `bottom`, `left`, `right`, `center`, `start`, `end`, `span-top`, `span-bottom`, `span-left`, `span-right`, `span-all`.

```css
.dropdown-menu {
  /* Places element below anchor, aligning left edge of element with left edge of anchor */
  position-area: bottom span-right;
}
```

#### Common `position-area` Patterns:
- `bottom span-right`: Directly below anchor, left-aligned.
- `bottom span-left`: Directly below anchor, right-aligned.
- `top span-right`: Directly above anchor, left-aligned.
- `right center`: To the right of anchor, vertically centered.
- `left center`: To the left of anchor, vertically centered.

---

### `anchor()` Function
Provides fine-grained position calculations by resolving edge values (`top`, `bottom`, `left`, `right`, `start`, `end`, `center`, or `<percentage>`) of a specified or default anchor.

```css
.tooltip {
  position: fixed;
  /* Attach tooltip top to anchor bottom */
  top: anchor(--my-anchor bottom);
  /* Center horizontal position relative to anchor center */
  left: anchor(--my-anchor 50%);
  transform: translateX(-50%);
}
```

---

### `anchor-size()` Function
Queries the physical dimensions (`width`, `height`, `inline-size`, `block-size`) of an anchor element for responsive sizing matching.

```css
.combobox-list {
  position: fixed;
  position-anchor: --input-anchor;
  position-area: bottom span-right;
  /* Match list width exactly to trigger input width */
  width: anchor-size(--input-anchor width);
}
```

---

## 2. Boundary Fallbacks (`@position-try` & `position-try-fallbacks`)

When an anchored element overflows the visual viewport boundary (e.g., when scrolling near page edges), `@position-try` rules and `position-try-fallbacks` allow automatic layout adaptation on the compositor thread.

### Built-in Flip Keywords:
- `flip-block`: Flips vertical positioning (e.g., `bottom` converts to `top`).
- `flip-inline`: Flips horizontal positioning (e.g., `left` converts to `right`).
- `flip-start`: Flips diagonal axes.

### Custom `@position-try` Rule Chains:

```css
@position-try --top-aligned {
  position-area: top span-right;
  margin-top: 0;
  margin-bottom: 8px;
}

@position-try --bottom-right {
  position-area: bottom span-left;
}

.anchored-popover {
  position: fixed;
  position-anchor: --menu-anchor;
  position-area: bottom span-right;
  margin-top: 8px;

  /* Sequential fallback trial chain */
  position-try-fallbacks: flip-block, --top-aligned, --bottom-right;
}
```

---

## 3. Stacking Context & Top-Layer Integration

A historical flaw of absolute positioning was parent clipping caused by `overflow: hidden` or `overflow: auto` on ancestor elements.

### The Top-Layer Popover Solution:
By pairing CSS Anchor Positioning with the **Popover API** (`<div popover>`), floating elements are promoted to the browser's native **Top Layer**.

1. The element renders outside the document flow, immune to all ancestor `overflow: hidden` boundaries.
2. The element automatically bypasses all ancestor `z-index` stacking context limitations.
3. CSS Anchor Positioning tracks the in-flow anchor trigger's position and anchors the Top-Layer element accurately.

```html
<!-- Anchor inside overflow-scroll container -->
<div style="overflow: auto; height: 200px;">
  <button id="trigger" popovertarget="menu">Options</button>
</div>

<!-- Target in Top-Layer -->
<div id="menu" popover class="anchored-menu">
  <p>Top-layer un-clipped menu</p>
</div>
```

---

## 4. Browser Polyfill & Fallback Strategy

For browsers lacking native CSS Anchor Positioning support (e.g., older Safari or Firefox versions), integrate `@oddbird/css-anchor-positioning` or progressive `@supports` degradation.

### Progressive `@supports` Query:

```css
/* Legacy standard positioning */
.floating-card {
  position: absolute;
  top: 100%;
  left: 0;
}

/* Native CSS Anchor Positioning */
@supports (anchor-name: --test) {
  .trigger-node {
    anchor-name: --card-anchor;
  }

  .floating-card {
    position: fixed;
    position-anchor: --card-anchor;
    position-area: bottom span-right;
    top: auto;
    left: auto;
  }
}
```
