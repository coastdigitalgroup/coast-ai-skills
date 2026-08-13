# Shopping Cart Layouts Breakdown

This example provides structural, spatial, and semantic breakdowns for the two primary e-commerce shopping cart layouts: the **Slide-Out Mini-Cart Drawer** (ideal for active, uninterrupted browsing) and the **Dedicated Shopping Cart Page** (ideal for final bulk review, detailed comparison, and payment routing).

---

## 1. The Slide-Out Mini-Cart Drawer (Overlaid Panel)

Below is an ASCII representation of the spatial composition, layout zones, and keyboard focus flow for a desktop slide-out drawer (typically `440px` wide).

```text
+--------------------------------------------------------+---------+
| PAGE CONTENT (Overlaid by Semitransparent Backdrop)    | DRAWER  |
|                                                        | [X] Esc | <--- 1. Focus starts here (Close button)
|                                                        |         |
|                                                        +---------+
|                                                        | SHIPPING|
|                                                        | PROGRESS| <--- Spend $15.00 more for FREE SHIPPING
|                                                        | [====== | ======] (50% complete)
|                                                        +---------+
|                                                        | ITEMS   |
|                                                        | [ul]    |
|                                                        | +-----+ |
|                                                        | |(img)| | [Tab] -> [Product Title]
|                                                        | | 80x | | [Tab] -> [-] Dec Quantity
|                                                        | | 80px| | [Tab] -> [input] (Tabular numbers)
|                                                        | +-----+ | [Tab] -> [+] Inc Quantity
|                                                        |         | [Tab] -> [Trash Icon] (Remove item)
|                                                        | +-----+ |
|                                                        | |(img)| |
|                                                        | |     | |
|                                                        | +-----+ |
|                                                        +---------+
|                                                        | SUMMARY |
|                                                        | Subtotal| $135.00
|                                                        | Discount| -$10.00
|                                                        |         |
|                                                        | [CHECKOUT] <--- [Tab] -> Primary CTA (Proceed to Checkout)
+--------------------------------------------------------+---------+
```

### Layout Specification (CSS Grid Anatomy)
```css
/* Container for the sliding panel drawer */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 440px;
  height: 100vh;
  background-color: var(--color-surface-primary);
  box-shadow: var(--shadow-elevation-high);
  z-index: 1000;
  display: grid;
  grid-template-rows: auto auto 1fr auto; /* Header, Promo, Scrollable Items, Footer */
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-drawer.is-open {
  transform: translateX(0);
}

/* Semi-transparent backdrop to block page interaction and satisfy contrast standards */
.cart-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.cart-backdrop.is-visible {
  opacity: 1;
  pointer-events: auto;
}
```

### Operational Interaction Annotations
1. **Trigger Action:** The user clicks the header cart count button.
   - **Accessibility Action:** The drawer container receives the class `.is-open`, the backdrop receives `.is-visible`, and background scroll is disabled via `document.body.style.overflow = 'hidden'`.
   - **Keyboard Focus Shift:** Focus is immediately captured and shifted to the Drawer Close Button (`[X]`), which is marked with `aria-label="Close Shopping Cart"`.
2. **Keyboard Focus Trap:** The user tabs through the interactive items list.
   - Focus flows from: `Close button` -> `Line-item 1 Link` -> `Line-item 1 Minus` -> `Line-item 1 Qty Input` -> `Line-item 1 Plus` -> `Line-item 1 Trash` -> `Line-item 2...` -> `Promo Code Field` -> `Checkout CTA`.
   - When reaching `Checkout CTA`, pressing `Tab` wraps focus cleanly back to the `Close button` at the top (instead of letting focus leak to the background page links).
3. **Recalculation:** The user clicks the plus button (`+`) on an item row.
   - **Optimistic State:** The quantity increments immediately in the UI input, and the parent container gets an `aria-busy="true"` attribute.
   - **Screen Reader Update:** The invisible element `<div id="cart-announcer" class="sr-only" aria-live="polite">` is programmatically updated to announce: *"Quantity updated for organic cotton tee. Subtotal is now seventy-five dollars."*

---

## 2. The Dedicated Shopping Cart Page

Below is an annotated layout breakdown for a large desktop screen (`>1200px`) showing spatial columns, spacing ratios, and responsive boundaries.

```text
+----------------------------------------------------------------------------------------------------------+
|  LOGO                                                           [Search Products...]       (Cart Icon: 2) |
+----------------------------------------------------------------------------------------------------------+
|  Home > Shop > Shopping Cart                                                                             |
|                                                                                                          |
|  # Your Shopping Cart (2 items)                                                                          |
|                                                                                                          |
|  +-------------------------------------------------------------+  +-----------------------------------+  |
|  | CART ITEMS COLUMN (65% Width)                               |  | ORDER SUMMARY COLUMN (35% Width)  |  |
|  |                                                             |  |                                   |  |
|  | +---------------------------------------------------------+ |  | +-------------------------------+ |  |
|  | | [ul role="list"]                                        | |  | | Order Summary                 | |  |
|  | |                                                         | |  | |                               | |  |
|  | | LINE ITEM ROW (1)                                       | |  | | Subtotal (2 items)    $185.00 | |  |
|  | | +-----+  Organic Cotton Tee                  $45.00     | |  | | Shipping             FREE     | |  |
|  | | |(img)|  Color: Sage Green                              | |  | | Est. Taxes & Fees      $12.50 | |  |
|  | | | 80x |  Size: Medium                                   | |  | |                               | |  |
|  | | | 80px|                                                 | |  | | Promo Code                    | |  |
|  | | +-----+  Qty: [-] [ 1 ] [+]         [Save]  [Remove]    | |  | | [Enter Promo...]     [Apply]  | |  |
|  | |                                                         | |  | |                               | |  |
|  | +---------------------------------------------------------+ |  | | Total                 $197.50 | |  |
|  |                                                             |  | |                               | |  |
|  | +---------------------------------------------------------+ |  | | [PROCEED TO CHECKOUT]         | |  |
|  | | LINE ITEM ROW (2)                                       | |  | |                               | |  |
|  | | +-----+  Overland Trail Boot                $140.00     | |  | | (Accepted Payments Icons)     | |  |
|  | | |(img)|  Color: Tan Leather                             | |  | +-------------------------------+ |  |
|  | | | 80x |  Size: 10.5                                     | |  |                                   |  |
|  | | | 80px|                                                 | |  | (Need Help? Live Chat / Phone)    |  |
|  | | +-----+  Qty: [-] [ 1 ] [+]         [Save]  [Remove]    | |  |                                   |  |
|  | |                                                         | |  +-----------------------------------+  |
|  | +---------------------------------------------------------+ |                                         |
|  +-------------------------------------------------------------+                                         |
|                                                                                                          |
|  +-----------------------------------------------------------------------------------------------------+ |
|  | RECOMMENDATIONS / UPSELLS (Bento-style horizontal layout)                                           | |
|  | Complete Your Outfit:                                                                               | |
|  | +-----------------------+   +-----------------------+   +-----------------------+                   | |
|  | | Waterproof Spray $12  |   | Merino Socks      $18 |   | Canvas Cleaning Kit $9|                   | |
|  | | [Add to Cart]         |   | [Add to Cart]         |   | [Add to Cart]         |                   | |
|  | +-----------------------+   +-----------------------+   +-----------------------+                   | |
|  +-----------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------------+
```

### Layout Specifications
- **Column Split Ratio:** CSS Grid with `grid-template-columns: 2fr 1fr;` at screens larger than `1024px`, with a consistent gap spacing of `var(--space-l)` (`32px`).
- **Sticky Order Summary:** The right summary column holds `position: sticky; top: var(--space-m);` so that when a customer has a long list of items (or scrolling through upsells), the "Proceed to Checkout" button remains present on the viewport, eliminating scroll-fatigue abandonment.
- **Responsive Stack Behavior:**
  - **Between 768px and 1023px (Tablet):** The layout shifts to `grid-template-columns: 1fr;`. The Order Summary is pushed directly beneath the Cart Items list.
  - **Below 768px (Mobile):** The layout is a tight, single-column vertical cascade. The "Proceed to Checkout" CTA pins stickily to the bottom of the device viewport (`position: fixed; bottom: 0; left: 0; right: 0; background: var(--color-surface-primary);`) to enable rapid touchscreen checkout triggering.
