# Shopping Cart Layouts & Spatial Composition Breakdown

This guide breaks down two core layout systems for e-commerce shopping carts:
1. **The Slide-Out Mini-Cart Drawer (Sidebar Overlay)** - Optimized for rapid, non-disruptive shopping feedback.
2. **The Dedicated Cart Page** - Optimized for wholesale orders, subscription reviews, and structured multi-item configurations.

---

## 1. The Slide-Out Mini-Cart Drawer (Desktop & Mobile)

The mini-cart drawer handles quick interactions without removing the customer from their context (usually the Product Detail Page or Product Listing Page). It utilizes a 3-part fixed-scroll layout stack.

### Visual Blueprint (Wireframe)

```text
+-------------------------------------------------------+
| SHOPPING BAG (3 ITEMS)                            [X] | <-- FIXED HEADER (A)
| [========================(75%)------------] Free Ship! |
+-------------------------------------------------------+
|  +-----+  Onyx Athletic Jacket              [Remove]  | <-- SCROLLABLE AREA (B)
|  |     |  Size: M / Color: Black                      |     (Line Items)
|  | IMG |                                              |
|  |     |  [-] [ 2 ] [+]                       $198.00 |
|  +-----+                                              |
|  ---------------------------------------------------  |
|  +-----+  Merino Wool Sock Pack             [Remove]  |
|  |     |  Size: L / Color: Grey                       |
|  | IMG |                                              |
|  |     |  [-] [ 1 ] [+]                        $24.00 |
|  +-----+                                              |
+-------------------------------------------------------+
| Subtotal:                                     $222.00 | <-- FIXED FOOTER (C)
| Shipping:                             FREE (Unlocked) |     (Checkout Summary)
|                                                       |
|  +-------------------------------------------------+  |
|  |                 SECURE CHECKOUT                 |  |
|  +-------------------------------------------------+  |
|  [visa] [mastercard] [apple-pay] [paypal] [klarna]    |
+-------------------------------------------------------+
```

### Spatial & Layout Specifications (CSS Blueprint)

```css
/* Layout Wrapper */
.mini-cart__drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 440px; /* Comfortably displays image, metadata, quantity and delete */
  height: 100vh;
  background-color: var(--color-surface-primary);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column; /* Force vertical 3-part stack */
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scroll Lock on Backdrop Open */
body.cart-open {
  overflow: hidden;
}

/* Part A: Fixed Header */
.mini-cart__header {
  flex-shrink: 0;
  padding: var(--space-m) var(--space-l);
  border-bottom: 1px solid var(--color-border-muted);
}

/* Part B: Scrollable Core */
.mini-cart__items-list {
  flex-grow: 1;
  overflow-y: auto; /* Independent scrolling */
  padding: var(--space-m) var(--space-l);
  -webkit-overflow-scrolling: touch;
}

/* Part C: Fixed Footer */
.mini-cart__footer {
  flex-shrink: 0;
  padding: var(--space-l);
  border-top: 1px solid var(--color-border-muted);
  background-color: var(--color-surface-secondary);
}
```

---

## 2. The Dedicated Cart Page (Desktop >1024px)

The Dedicated Cart Page is a landing interface that divides responsibilities across an asymmetric 2-column grid. This format is ideal for users with multi-item lists or subscription bundles where extensive discount configurations, tax calculations, or shipping estimations are conducted.

### Spatial Composition Blueprint

```text
+-----------------------------------------------------------------------------------------+
|  SHOPPING CART (2 ITEMS)                                                                |
+-----------------------------------------------------------------------------------------+
|                                                           |                             |
|  LINE ITEMS COLUMN (60% Width)                            |  ORDER SUMMARY COLUMN (40%) |
|                                                           |  (Sticky sidebar card)      |
|  +-----------------------------------------------------+  |                             |
|  | [IMG] Onyx Athletic Jacket               [Remove]   |  |  +-----------------------+  |
|  |       Size: M / Color: Black                        |  |  | ORDER SUMMARY         |  |
|  |                                                     |  |  +-----------------------+  |
|  |       [-] [ 2 ] [+]                      $198.00    |  |  | Subtotal:     $222.00 |  |
|  +-----------------------------------------------------+  |  | Shipping:        FREE |  |
|                                                           |  | Tax:            $17.76 |  |
|  +-----------------------------------------------------+  |  |                       |  |
|  | [IMG] Merino Wool Sock Pack              [Remove]   |  |  | [SUMMER20]    -$44.40 |  |
|  |       Size: L / Color: Grey                         |  |  |                       |  |
|  |                                                     |  |  | Total:        $195.36 |  |
|  |       [-] [ 1 ] [+]                       $24.00    |  |  |                       |  |
|  +-----------------------------------------------------+  |  | +-------------------+ |  |
|                                                           |  | |  PROMO CODE [App] | |  |
|  +-----------------------------------------------------+  |  | +-------------------+ |  |
|  | COMPLETE YOUR LOOK (Cross-Sells)                    |  |  |                       |  |
|  |                                                     |  |  | +-------------------+ |  |
|  | +--------+  +--------+  +--------+                  |  |  | |  SECURE CHECKOUT  | |  |
|  | |[ITEM 1]|  |[ITEM 2]|  |[ITEM 3]|                  |  |  | +-------------------+ |  |
|  | | $35.00 |  | $12.00 |  | $40.00 |                  |  |  +-----------------------+  |
|  | +--------+  +--------+  +--------+                  |  |                             |
|  +-----------------------------------------------------+  |                             |
+-----------------------------------------------------------------------------------------+
```

### Layout Rules & Responsive Stacking (CSS Blueprint)

```css
/* Layout Main Grid */
.cart-page__layout {
  display: grid;
  grid-template-columns: 1fr; /* Default mobile single-column */
  gap: var(--space-xl);
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-l);
}

/* Tablet & Desktop Breakpoints */
@media (min-width: 1024px) {
  .cart-page__layout {
    grid-template-columns: 1.6fr 1fr; /* 60% Left, 40% Right */
    align-items: start;
  }

  .cart-page__sidebar {
    position: sticky;
    top: calc(var(--global-header-height) + var(--space-m));
    /* Prevents sidebar from scrolling off when scrolling long item lists */
  }
}
```

---

## 3. Interaction Mechanics & Cart-Recovery UX Guidelines

The following interaction states ensure high visual feedback and prevent abandons:

### Dynamic Free-Shipping Unlock (The Psychological Progress Bar)
The progress bar updates immediately on quantity changes, triggering live status alerts:

- **State 1: Empty or Low Subtotal**
  - Subtotal: `$24.00` (Threshold: `$100.00`)
  - Progress: `24%`
  - Announcement: "You are $76.00 away from unlocking free shipping."
  - Accent Color: Muted neutral gray or secondary brand tone.

- **State 2: Close to Unlock (Nudging Zone)**
  - Subtotal: `$88.00`
  - Progress: `88%`
  - Announcement: "So close! Only $12.00 away from Free Shipping! Add our Cotton Beanie to qualify."
  - Accent Color: Brand highlight amber/yellow.

- **State 3: Unlocked (Celebration Zone)**
  - Subtotal: `$120.00`
  - Progress: `100%`
  - Announcement: "Congratulations! You've unlocked free shipping!"
  - Accent Color: Trust green or vivid success green.

### Double-Tap Prevention on Add/Subtract Steppers
To prevent API rate limits, duplicate database calls, or visual jitter:
1. When a user taps `+` or `-`, immediately dim the text input containing the value (opacity `0.5`).
2. Display a subtle, micro-loading spinner inside the line-item subtotal price field or the change button.
3. Temporarily disable the `+` and `-` button click handlers until the server returns the updated cart JSON.
4. Update the numerical values, total calculations, and promotional indicators in one unified visual batch to avoid Cumulative Layout Shift (CLS).
