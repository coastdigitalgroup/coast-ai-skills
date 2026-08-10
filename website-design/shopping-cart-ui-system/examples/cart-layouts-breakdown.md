# Shopping Cart Layouts & Spatial Breakdown

This document provides a realistic, practical breakdown of two primary shopping cart design patterns: the **Sliding Mini-Cart Drawer** and the **Dedicated Full-Page Cart**. It illustrates how spacing, hierarchy, alignment, and responsiveness are applied to solve real-world e-commerce friction.

---

## Pattern 1: Sliding Mini-Cart Drawer (Desktop)

This pattern slides out from the right side of the screen over the primary website content. It is designed to preserve browsing momentum while allowing users to inspect and adjust their choices.

### Visual Architecture & Grid Layout

```text
+-------------------------------------------------------+ [Viewport Edge]
| [X] Close (44x44px target)   **Your Cart (3 items)**  | [Drawer Header]
+-------------------------------------------------------+
| 🚀 You're only $15.00 away from Free Shipping!        | [Progress Banner]
| [======================================------] 80%    |
+-------------------------------------------------------+
|  +-------------------------------------------------+  | [Scrollable List]
|  | [📷]  **SentryFlow Pro Earbuds**       $129.00  |  | [Item Row 1]
|  | [64]  Color: Obsidian Black                     |  |
|  |       In Stock                                  |  |
|  |                                                 |  |
|  |       [- [ 1 ] +] (44px)        Remove (Trash)  |  |
|  +-------------------------------------------------+  |
|  +-------------------------------------------------+  |
|  | [📷]  **SentryFlow Protective Case**    $19.00  |  | [Item Row 2]
|  | [64]  Color: Alpine White       ~~$25.00~~      |  |
|  |                                                 |  |
|  |       [- [ 1 ] +] (44px)        Remove (Trash)  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  Subtotal:                                $148.00  | [Fixed Footer]
|  Shipping:                                  Free   | [Pricing Summary]
|  Est. Tax:                                 $11.84  |
|  **Estimated Total:**                     **$159.84** |
|                                                       |
|  +-------------------------------------------------+  |
|  |               PROCEED TO CHECKOUT               |  | [Primary CTA]
|  +-------------------------------------------------+  |
|  💳 PayPal, Apple Pay, Credit Card logos accepted     |
+-------------------------------------------------------+
```

### Technical Annotations & Spacing Specs

1. **Outer Drawer Container:**
   - Width is set to a fixed `400px` (using a fluid max-width rule of `max(320px, 100vw)` below `480px` viewports).
   - Styled with `position: fixed; right: 0; top: 0; bottom: 0; z-index: var(--z-index-overlay)`.
   - Uses `box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15)` to establish visual elevation.

2. **The Header Zone:**
   - Elements are spaced with standard medium padding (`padding: var(--space-m)`).
   - Title is set in heavy bold (`font-weight: 700; font-size: var(--font-size-lg)`).
   - Close button is an explicit `<button>` with an `aria-label="Close cart drawer"`.

3. **Free Shipping Progress Banner:**
   - Uses a light tint background derived dynamically: `background-color: color-mix(in oklch, var(--brand-color) 8%, white)`.
   - Progress bar uses standard container with `overflow: hidden; border-radius: 9999px` to prevent layout bugs.

4. **Scrollable Item Area:**
   - Implements `flex-grow: 1; overflow-y: auto; overflow-x: hidden`.
   - Features custom scrollbar styling (`scrollbar-width: thin`) to prevent visual clutter.
   - Gap between item cards is set to exact small spacing: `row-gap: var(--space-s)`.

5. **Fixed Footer Summary:**
   - Uses `box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05)` to signal that it sits above the scrolling list.
   - All pricing lines use flexbox alignment: `display: flex; justify-content: space-between`.
   - Primary Checkout CTA uses `--brand-color` with high-contrast text (`color: white`) and features a subtle hover scale/darken transformation.

---

## Pattern 2: Dedicated Full-Page Cart (Mobile Stacked)

This pattern is a standalone page view optimized for mobile. All elements stack vertically to fit a `360px` viewport, prioritizing readability, finger reach, and action speed.

### Mobile Visual Grid

```text
+---------------------------------------------------+
|  [<- Back to Shopping]                            | [Top Navigation]
+---------------------------------------------------+
|  **Your Cart** (2 items)                          | [Page Title]
+---------------------------------------------------+
|  🚀 You've got FREE SHIPPING on this order!       | [Status Notice]
+---------------------------------------------------+
|  +---------------------------------------------+  | [Scrollable List]
|  | +--------+  **SentryFlow Pro Earbuds**      |  | [Item Row 1]
|  | |  [📷]  |  $129.00                         |  |
|  | |  [80]  |  Size: Default                   |  |
|  | +--------+                                  |  |
|  |                                             |  |
|  |  [- [ 1 ] +] (44px)        [Remove (Trash)] |  | [Quantity & Trash]
|  +---------------------------------------------+  | [Aligned Bottom]
+---------------------------------------------------+
|  +---------------------------------------------+  |
|  |               PROMO CODE                    |  | [Collapsible Form]
|  |  [ Enter promo code       ]  [ Apply ]      |  |
|  +---------------------------------------------+  |
+---------------------------------------------------+
|  Subtotal:                             $129.00    | [Summary Block]
|  Shipping:                                FREE    |
|  **Estimated Total:**                  **$129.00**|
+---------------------------------------------------+
|  +---------------------------------------------+  | [Docked Mobile CTA]
|  |             PROCEED TO CHECKOUT             |  | [Sticky Footer]
|  +---------------------------------------------+  |
+---------------------------------------------------+
```

### Technical Annotations & Mobile Optimization Specs

1. **Backlink Wayfinding:**
   - Standard navigational text link (`<a>` tag with native href) positioned at the top-left to avoid confusing mobile users. Uses a leading left-arrow icon (`<-`).

2. **Mobile Row Grid Adaptability:**
   - The desktop multi-column grid is collapsed into a 2-column, 2-row configuration:
     ```css
     .cart-item-row {
       display: grid;
       grid-template-columns: 80px 1fr;
       grid-template-rows: auto auto;
       gap: var(--space-s);
       padding: var(--space-s);
     }
     ```
   - Row 1 holds the image on the left, and the text description & price on the right.
   - Row 2 spans the remaining space, placing the quantity counter and the removal action next to each other in the natural thumb zone.

3. **Sticky Mobile Footer:**
   - To prevent the user from having to scroll down a long list to find the "Checkout" button, the CTA is docked at the bottom of the viewport:
     ```css
     .mobile-checkout-dock {
       position: fixed;
       bottom: 0;
       left: 0;
       right: 0;
       padding: var(--space-s) var(--space-m);
       background: var(--color-background-surface);
       border-top: 1px solid var(--color-border-subtle);
       box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.08);
       z-index: var(--z-index-sticky);
     }
     ```
   - Adds bottom padding matching safe area bounds on iOS devices (`padding-bottom: env(safe-area-inset-bottom)`).

4. **Keyboard & Screen Reader Safety:**
   - When items are added or subtracted, the total amount is announced dynamically:
     ```html
     <div class="sr-only" aria-live="polite" id="cart-accessibility-status">
       Subtotal updated to $129.00.
     </div>
     ```
   - Each input is associated with its labels and has clear focus rings (`outline: 2px solid var(--brand-color)`).
