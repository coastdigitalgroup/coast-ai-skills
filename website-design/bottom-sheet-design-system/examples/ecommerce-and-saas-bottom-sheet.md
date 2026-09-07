# E-Commerce and SaaS Bottom Sheet Design Examples

This document provides complete visual layout breakdowns, structural specifications, markup examples, and responsive desktop adaptation patterns for real-world mobile bottom sheets.

---

## Example 1: E-Commerce Product Option & Variant Selector Sheet

### Context & Goal
A mobile shopper browsing a Product Detail Page (PDP) or tapping "Quick Add" on a Category Page needs to select product size, color variant, and quantity without losing their scroll position or loading a full new page.

### Visual & Structural Breakdown (Mobile Viewport < 768px)

```text
+-------------------------------------------------------+
|                       [BACKDROP]                      |
|                   (rgba(0, 0, 0, 0.45))               |
|                                                       |
+-------------------------------------------------------+
|  +-------------------------------------------------+  |
|  |                   [=== HANDLE ===]              |  |
|  |                                                 |  |
|  |  Select Options                       [X Close] |  |
|  |  ---------------------------------------------  |  |
|  |  +-------+  Performance Running Tee             |  |
|  |  | IMG   |  $48.00  •  In Stock                 |  |
|  |  +-------+                                      |  |
|  |                                                 |  |
|  |  Color: Pacific Blue                            |  |
|  |  [ ( ) Black ] [ (*) Blue ] [ ( ) Sage ]        |  |
|  |                                                 |  |
|  |  Size: Select Size                              |  |
|  |  [ S ] [ M ] [ L ] [ XL ] [ 2XL ]               |  |
|  |                                                 |  |
|  |  Quantity:                                      |  |
|  |  [ - ]  1  [ + ]                                |  |
|  |  ---------------------------------------------  |  |
|  |  +-------------------------------------------+  |  |
|  |  |        [ Add to Cart — $48.00 ]          |  |  |
|  |  +-------------------------------------------+  |  |
|  |  ================ SAFE AREA ==================  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

### HTML Structural Markup

```html
<!-- Modal Backdrop Scrim -->
<div class="sheet-backdrop" id="pdp-sheet-backdrop" data-sheet-dismiss></div>

<!-- Bottom Sheet Container -->
<div
  class="bottom-sheet"
  id="pdp-variant-sheet"
  role="dialog"
  aria-modal="true"
  aria-labelledby="pdp-sheet-title"
>
  <!-- Handle Bar & Header -->
  <div class="sheet-header">
    <div class="sheet-handle" aria-hidden="true"></div>
    <div class="sheet-title-bar">
      <h2 id="pdp-sheet-title" class="sheet-title">Select Options</h2>
      <button
        type="button"
        class="sheet-close-btn"
        aria-label="Close product options"
        data-sheet-dismiss
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Scrollable Sheet Content -->
  <div class="sheet-body">
    <!-- Product Summary Card -->
    <div class="product-mini-summary">
      <img src="/images/tee-blue.jpg" alt="Pacific Blue Performance Running Tee" class="product-thumb" />
      <div class="product-info">
        <span class="product-name">Performance Running Tee</span>
        <span class="product-price">$48.00</span>
        <span class="stock-badge">In Stock</span>
      </div>
    </div>

    <!-- Variant Selector Groups -->
    <fieldset class="variant-group">
      <legend class="variant-label">Color: <span class="selected-value">Pacific Blue</span></legend>
      <div class="swatch-options">
        <label class="swatch-option">
          <input type="radio" name="color" value="black" />
          <span class="swatch-tile swatch-black">Black</span>
        </label>
        <label class="swatch-option">
          <input type="radio" name="color" value="pacific-blue" checked />
          <span class="swatch-tile swatch-blue">Pacific Blue</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="variant-group">
      <legend class="variant-label">Size</legend>
      <div class="size-options">
        <button type="button" class="size-btn">S</button>
        <button type="button" class="size-btn active">M</button>
        <button type="button" class="size-btn">L</button>
        <button type="button" class="size-btn">XL</button>
      </div>
    </fieldset>
  </div>

  <!-- Sticky Footer Action Dock -->
  <div class="sheet-footer">
    <button type="button" class="btn-primary btn-full-width">
      Add to Cart — $48.00
    </button>
  </div>
</div>
```

---

## Example 2: SaaS Mobile Filter & Sort Action Sheet

### Context & Goal
A mobile user analyzing a analytics dashboard or project task board needs to filter items by Status, Assignee, and Date Range.

### Desktop Responsive Adaptation (Viewport ≥ 768px)
When viewed on tablet or desktop screens, the slide-up bottom sheet automatically adapts into a centered floating modal dialog:

```text
+-------------------------------------------------------------------+
|                            [DESKTOP]                              |
|                                                                   |
|         +-----------------------------------------------+         |
|         | Filter & Sort Tasks                 [X Close] |         |
|         | --------------------------------------------- |         |
|         | Status                                        |         |
|         | [x] In Progress   [ ] Review   [ ] Done       |         |
|         |                                               |         |
|         | Priority                                      |         |
|         | ( ) All  (*) High Priority  ( ) Urgent        |         |
|         | --------------------------------------------- |         |
|         | [ Clear All ]               [ Apply Filters ] |         |
|         +-----------------------------------------------+         |
|                                                                   |
+-------------------------------------------------------------------+
```

### Key CSS Rules for Adaptation

```css
/* Base Mobile Bottom Sheet (Slide Up) */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 85dvh;
  background-color: var(--surface-background, #ffffff);
  border-radius: 20px 20px 0 0;
  transform: translateY(0);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background-color: var(--neutral-300, #d1d5db);
  border-radius: 999px;
  margin: 10px auto 4px auto;
}

/* Desktop Adaptation (Centered Modal Dialog) */
@media (min-width: 768px) {
  .bottom-sheet {
    bottom: auto;
    top: 50%;
    left: 50%;
    right: auto;
    width: 100%;
    max-width: 520px;
    max-height: 80vh;
    border-radius: 16px;
    transform: translate(-50%, -50%);
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
  }

  /* Hide mobile drag handle on desktop */
  .sheet-handle {
    display: none;
  }
}
```
