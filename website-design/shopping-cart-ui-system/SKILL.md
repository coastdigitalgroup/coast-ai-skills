---
name: shopping-cart-ui-system
description:
  Design a systematic, highly accessible, and conversion-optimized layout
  framework for e-commerce shopping carts, defining spatial structures for
  sliding mini-cart drawers, dedicated cart pages, and item list components.
---

# Shopping Cart UI System

## Purpose

The Shopping Cart UI System provides an accessible, high-conversion visual and structural framework for direct-to-consumer (DTC) and multi-channel e-commerce shopping carts. Operating as the essential transactional bridge between product discovery (PDP) and checkout completion, the shopping cart must elegantly handle order updates, promotional nudges, cross-sells, and real-time shipping progress indicators.

A systematic design approach resolves standard cart friction points—such as unexpected layout shifts (CLS) when items are updated, illegible item summaries, hidden interactive controls on mobile, inaccessible quantity selectors, and the lack of a clear psychological path to checkout. This system ensures consistent styling, smooth micro-interactions, layout resilience, and strict adherence to WCAG AA accessibility rules.

## Use Cases

- **E-commerce & Direct-to-Consumer (DTC) Portals:** High-velocity retail platforms that utilize persistent mini-carts and dedicated checkout reviews.
- **B2B & Wholesale Catalog Orders:** Bulk ordering desks with tabular lists, multi-sku selectors, and quick-add tools.
- **Service & Experience Booking Engines:** Organizing multi-day tickets, reservations, rental add-ons, or event passes.
- **Software, SaaS, & Digital Good Bundlers:** Aggregating licenses, service add-ons, and subscription tiers before final payment checkout.

## When NOT to Use

- **Single-Item or One-Click Checkouts:** For platforms bypassing the cart directly to checkout (e.g., Apple Pay on PDP), use `checkout-flow-optimization` and `product-detail-layout-system`.
- **Primary Product Browsing:** For showcasing item cards or list results, use `card-ui-system` and `filter-and-sort-system`.
- **Side-by-Side Product Comparison:** To compare distinct plans or product features, use `comparison-matrix-system` or `pricing-table-ui-system`.
- **Bulk Product CSV Ordering:** For highly specialized tabular admin entry panels, use `data-table-ui-system`.

## Inputs

1. **E-commerce Design Tokens:** Global typography scale, brand color palette (primary CTA, warning red, success green), fluid spacing scale, and surface shadow elevations.
2. **Product SKU Metadata:** Image aspect-ratio rules, title constraints, variation strings (e.g., "Color: Onyx / Size: L"), unit pricing, and sale/discount states.
3. **Fulfillment & Logic Configurations:** Free-shipping thresholds, coupon code rules, shipping estimations, and quantity limits.
4. **Cross-Sell Catalog Data:** Recommendations mapped by current cart items to populate impulse-buy modules.
5. **Mobile Viewport Boundaries:** Device dimensions, touch tap target guidelines, and environment safe-area constraints.

## Outputs

1. **Sliding Mini-Cart Drawer (Slide-Out Side Panel):** Component-level grid blueprint for quick cart overview and mobile-first fast-path checkout.
2. **Dedicated Cart Page (Full Page Grid):** Spatial 2-column layout (Main Cart List + Order Summary sidebar) for deep reviews.
3. **Cart Line-Item Row Architecture:** Detailed specifications for spacing, layouts, interactive quantity controls, and delete elements within a single row.
4. **Free Shipping & Promotional Progress Bar:** Spatial layout showing real-time feedback and dynamic message thresholds.
5. **A11y Routing & Screen Reader Spec:** Detailed guidelines for focus traps, keyboard tab order, roving tabindex, `aria-live` announcements, and touch target rules.

---

## Workflow

### 1. Define the Spatial Mechanics: Mini-Cart Drawer vs. Dedicated Cart Page
An optimized design must support both high-impact visual formats depending on the screen size and context:
- **The Mini-Cart Drawer (Desktop & Mobile):** Slides in from the right edge, covering the right 400px–460px of the screen on desktop, and 100% of the screen on mobile. It overlays the main viewport behind a semi-transparent backdrop (`background: rgba(0,0,0,0.5)`). Use an elastic layout dividing the drawer into three fixed areas:
  - *Header (Fixed height):* Cart title (with count), close button (✕), and free-shipping progress tracker.
  - *Scrollable Line Items (Flex grow/auto scroll):* The list of added items (`overflow-y: auto;`).
  - *Footer (Fixed height, docked):* Subtotal, tax/shipping notice, promo message, and prominent checkout CTA.
- **The Dedicated Cart Page (Desktop >1024px):** Uses a asymmetrical 2-column layout grid:
  - *Left Column (Spans 60–65%):* Contains a clean, left-aligned tabular-like view of cart line items, including bulk-removal actions and empty states.
  - *Right Column (Spans 35–40%):* Houses the sticky Order Summary card (`position: sticky; top: var(--header-height);`), containing subtotal calculations, estimated shipping, coupon code input, dynamic payment badges, and primary Checkout button.

### 2. Design the Cart Line-Item Row Architecture
Every row in the cart represents a miniature hierarchy. Standardize layout flow inside a `100%`-width container using CSS Flexbox or Grid:
```text
+-------------------------------------------------------------+
| [Thumbnail]  [Item Title]                      [Delete X]   |
| (64x64px)    Size: M / Color: Blue                          |
|                                                             |
|              [-] [ 1 ] [+]                     [Price]      |
|              (Quantity Input)                  $120.00      |
+-------------------------------------------------------------+
```
- **Product Thumbnail:** Anchor using a compact fixed aspect-ratio container (`64x64px` up to `96x96px` max) with `border-radius: var(--radius-s)` and `object-fit: cover;`. Ensure alt text is present but descriptive (e.g., `alt="Wool Jacket in Navy Blue"`).
- **Metadata Stack:** Standard vertical layout containing:
  - Title: Bold, neutral-dark, linked to the PDP.
  - Variant attributes: Muted gray, smaller font-size (e.g., `12px/0.75rem`).
  - Unit price: Subtle if single item, but emphasized if quantity > 1.
- **The Accessible Quantity Selector:** Ensure buttons are larger than typical text. Wrap the value input in flat visual borders.
  - Decrement Button (`-`), Quantity Input box (text or number), Increment Button (`+`).
  - Ensure the decrement button converts to a visible garbage-bin delete icon if quantity is `1`, indicating that clicking it will remove the item from the cart.
- **Line Pricing:** Align to the bottom right of the row. If the item is discounted, render the original crossed-out price in light gray directly adjacent to the active sale price (rendered in high-contrast red or brand bold).
- **The Delete Button:** Placed in the top right of the row. Utilize an explicit `aria-label="Remove [Item Name] from cart"` to prevent screen readers from announcing only "button" or "X".

### 3. Build the Free-Shipping & Promotional Progress Engine
Encourage higher Average Order Values (AOV) by giving users instant feedback on fulfillment targets:
- **Visual Progress Bar:** Use a horizontal container (`height: 8px`) with rounded ends, styled in light gray, that fills from left to right using a bright accent color (e.g., green, blue) as the user's subtotal approaches the target.
- **Dynamic Micro-Copy:** Write clear, action-driven messages above or below the bar:
  - *Under threshold:* "You are **$15.00** away from **Free Shipping**! [Add more]"
  - *Over threshold:* "🎉 **Congratulations!** You've unlocked **Free Shipping**!"
- **Layout Location:** Position the progress engine at the very top of both the mini-cart drawer and the main cart page so it remains visible above the fold.

### 4. Optimize the Checkout CTA and Order Summary Footer
The checkout anchor is the focal point of the shopping cart experience. Ensure it reads as a solid, trustworthy block:
- **Calculations List:** Render subtotal, applied discounts (green text with promo code badge e.g., `SUMMER20 [x]`), estimated shipping (or "Calculated at checkout"), and final estimated total using key-value list layouts with clear dot-leaders or aligned grids.
- **Primary Checkout Button:** High contrast, full-width (100%), with bold typography. Must display clear loading indicators when clicked (e.g., converting the label text "Secure Checkout" to a spinner) to prevent double-clicks.
- **Supported Payment Badges:** Muted grayscale or standard-color payment icon badges (Visa, Mastercard, Amex, PayPal, Apple Pay, Klarna) directly below the checkout button to establish trust.

### 5. Create Responsive Fluid Layout Adaptation
Shopping carts are heavily used on mobile. Design the breakpoints with extreme precision:
- **Mini-Cart Mobile Overlay:** At viewport width `<768px`, force the mini-cart to span `100vw`. Place the close trigger explicitly in a large, easy-to-tap top-left or top-right target.
- **Cart Page Line-Item Stacking:** On mobile viewports, the horizontal row collapses:
  - Product thumbnail and title sit side-by-side.
  - The Quantity Selector and Price collapse below the title, with quantity left-aligned and price right-aligned on the same horizontal axis.
- **Fixed Mobile Checkout Drawer:** On mobile cart pages, implement a fixed bottom footer that anchors the Subtotal and checkout CTA securely above browser UI elements, utilizing `padding-bottom: env(safe-area-inset-bottom);`.

### 6. Establish Keyboard Focus Routings & ARIA Live Triggers
An inaccessible cart blocks screen-reader and keyboard-only users from finalizing purchases.
- **Mini-Cart Focus Trap:** When the mini-cart drawer is opened:
  1. Trigger focus immediately to the first interactive element (usually the Close button or the top item title).
  2. Implement a focus trap, preventing users from tabbing to elements hidden behind the backdrop.
  3. Trap the escape key (`Esc`) to close the drawer. Return focus cleanly to the trigger button that originally opened the cart (e.g., Header Cart Icon).
- **Dynamic Announcements (`aria-live`):** Toggling quantity, deleting an item, or applying a coupon must instantly communicate updates via an invisible `aria-live="polite"` element. Screen readers should announce: "Onyx Jacket quantity updated to two. Subtotal updated to two hundred and forty dollars."
- **Focus Rings:** Avoid standard browser outlines; implement a custom, high-contrast, unclipped focus indicator ring around all interactive controls in the cart.

---

## Decision Rules

### Dedicated Cart Page vs. Mini-Cart Drawer Triggers

| Trigger Event | Optimal UX Response Pattern | Design Rationale |
| :--- | :--- | :--- |
| **User adds item from PDP** | **Slide open Mini-Cart Drawer** | Confirms successful add-to-cart, updates subtotal instantly, provides immediate feedback, but keeps them on the PDP to continue shopping. |
| **User clicks global cart header icon** | **Toggle Mini-Cart Drawer (if item count > 0) / Navigate to Cart Page (Optional)** | Fast access to edit item list without loading a new page. If the catalog is highly complex (e.g., hundreds of B2B parts), navigate directly to the Dedicated Cart Page. |
| **Cart is empty (0 items)** | **Show Inline Empty State with CTAs** | Instead of a blank page or closing the drawer, render a clear message (e.g., "Your cart is currently empty") accompanied by 3–4 targeted, category-based primary shopping links. |

### Quantity Input Style Selection

| Interface Style | Use Case Application | Design Rationale |
| :--- | :--- | :--- |
| **Button Stepper `[-] [ 1 ] [+]`** | DTC, Retail, Apparel, standard e-commerce | Easiest single-tap interaction on mobile, prevents typing errors, simple incrementing. |
| **Native Text Input Field** | Heavy B2B catalog order sheets, wholesale quantities | Allows the user to type large arbitrary numbers (e.g., `150`) directly instead of clicking 150 times. |
| **Standard Select Dropdown `(Qty: 1) v`** | High-ticket items, electronics, single-quantity limit subscriptions | Limits purchases to pre-set quantity scales (e.g., max 10) and prevents unhandled high-count inventory requests. |

---

## Constraints

- **Accessibility (WCAG AA Minimum):**
  - **SC 2.4.7 Focus Visible:** Cart drawer must maintain highly visible focus outlines on close buttons, title anchors, steppers, and inputs.
  - **SC 2.5.8 Target Size:** Tap targets for quantity increment (`+`) and decrement (`-`) buttons, delete trashcans, and promo remove links must be at least **24x24px** on desktop and **44x44px** on mobile viewports.
  - **SC 1.1.1 Non-text Content:** Every image must have clear alternate text. Decorative backgrounds inside empty states must be ignored (`role="presentation"` or `alt=""`).
- **Cumulative Layout Shift (CLS) Prevention:**
  - Standardize line-item heights or reserve minimum skeleton state heights during loading states.
  - Dynamic promo calculations must not push the checkout CTA button off the screen or fold abruptly.
- **Dynamic Overlay Scroll-Lock:**
  - Opening the mini-cart drawer overlay must lock background scrolling on the primary body element (`overflow: hidden;` applied to `<body>`). This prevents double scrolling and jumping navigation artifacts.

---

## Common Failure Patterns

- **The Ghost Cart Close:** Closing the drawer or clicking out of it completely resets the focus index, dropping keyboard users back to the very top of the underlying page and forcing them to re-tab everything.
- **The Cryptic Delete Target:** Designing trashcan icons or "X" delete triggers as unlabelled text symbols, causing screen readers to output "button" or "unlabeled button", leaving users unable to prune their cart.
- **The Lagging Update Drift:** Allowing a delay between clicking `+` and updating the pricing without displaying a loading spinner. If the user clicks `+` three times rapidly, the price drifts behind the action and leads to inaccurate totals.
- **The Blocked Mobile Keyboard:** Centering a coupon input on the dedicated cart page in a layout stack that gets completely blocked or pushed off the visible screen when the mobile device’s soft keyboard rolls up.
- **The Empty-Cart Dead-End:** Rendering a simple text string "Your cart is empty." with zero navigation options, forcing users to hit the browser back button or manually dig through menus to return to shopping.

---

## Validation Criteria

- [ ] **Dual-Format Ready:** The system outlines spatial blueprints for both a sliding right-hand mini-cart drawer and a dedicated 2-column full-page cart layout.
- [ ] **Linear Mobile Cascade:** Single-column layout on mobile (<768px) with optimized vertical stacking of product attributes and quantity controls.
- [ ] **Semantic Line-Items:** Line items are wrapped in appropriate list-item semantic markup (`<ul>` and `<li>`), with explicit `<button>` or `<input>` controls.
- [ ] **Aria-Labelled Delete Controls:** All delete/remove triggers utilize clear accessibility labels, e.g., `aria-label="Remove Red Wool Jacket from cart"`.
- [ ] **Keyboard Trap Mini-Cart:** Active mini-cart drawer implements a robust keyboard focus trap and closes smoothly upon pressing the `Escape` key.
- [ ] **Scroll-Lock Integration:** Active overlays apply scroll-lock patterns to the `<body>` element to prevent background viewport scrolling.
- [ ] **Free-Shipping Metric Display:** Includes a visual progress bar with dynamic, calculated micro-copy indicating proximity to free-shipping thresholds.
- [ ] **Responsive Touch Footprints:** All clickable elements (such as quantity steppers, discount removal buttons, and checkout links) offer touch-target sizes of 44x44px or greater on mobile viewports.
- [ ] **Aria-Live Order Status Updates:** Quantity adjustments and item removals trigger clear `aria-live="polite"` status announcements.
