---
name: shopping-cart-ui-system
description:
  Design a systematic, highly accessible, and conversion-optimized layout
  framework for e-commerce shopping carts, defining spatial structures for
  sliding mini-cart drawers, dedicated cart pages, and item list components in compliance with WCAG AA.
---

# Shopping Cart UI System

## Purpose

The Shopping Cart UI System provides a standardized, high-performance visual, spatial, and interactive framework for designing and structuring e-commerce shopping carts. As the critical bridge between product discovery (Product Detail Pages) and final transaction (Checkout Flow), the shopping cart must elegantly balance item management, dynamic cost calculations, upsell opportunities (order bumps), and clear navigation to checkout.

A systematic cart design prevents common e-commerce friction points—such as hidden costs, high interaction cost for modifying item quantities, layout shifting (CLS) during quantity updates, poor mobile tap targets, and severe accessibility barriers for screen readers and keyboard-only users. This skill guarantees that whether the cart is implemented as a sliding slide-out panel (mini-cart drawer) or a full dedicated page, the user experience is smooth, reassuring, accessible, and conversion-optimized.

## Use Cases

- **Direct-to-Consumer (DTC) & Retail E-commerce:** Designing cart interfaces for physical goods, apparel, consumer electronics, or homeware.
- **B2B Procurement Portals:** Structuring line-item carts with bulk quantity modifiers, purchase order inputs, and multi-address shipping selectors.
- **Subscription Services:** Organizing recurring plan additions, addon-item selections, and subscription interval summaries before entering checkout.
- **Digital Asset Marketplaces:** Designing cart layouts for stock media, software assets, or online course enrollments where instant delivery is expected.

## When NOT to Use

- **Single-Item Instant Checkout (Express Purchase):** For single-product funnels or landing pages where clicking "Buy" redirects directly to an express checkout page (e.g., Apple Pay, Shopify Express Checkout), bypassing a cart layout completely.
- **Complex Configurable Booking Funnels:** For travel, hotels, or rental systems with multi-step reservation builders, use custom booking configurators and `step-progress-system` patterns instead.
- **Post-Purchase Upsell Pages:** For upsells or offers presented *after* checkout has been completed, use specialized marketing landing page layouts.

## Inputs

1. **Information Architecture (IA) & Cart States:** The choice between a slide-out mini-cart drawer, a dedicated cart page, or a hybrid model.
2. **Product Item Schema:** Required item attributes to render (thumbnail, title, active variant options, price, original price, SKU, stock status, error notices).
3. **Price Calculation Variables:** Subtotal, discounts/promo code deductions, estimated shipping thresholds, tax indicators, and dynamic progress bar values.
4. **Brand Design Tokens:** Typography scales, fluid spacer tokens, active/hover/focus states, and container elevation/border-radius tokens.
5. **Mobile Viewport Boundaries:** Device viewport limits, specifically handling touch zones and virtual keyboard interactions.

## Outputs

1. **Dual-Scenario Cart Architecture:** High-fidelity spatial blueprints for:
   - **The Mini-Cart Drawer (Slide-out):** For rapid, non-disruptive cart validation.
   - **The Dedicated Cart Page:** For deep review, bulk edits, and primary checkout preparation.
2. **Anatomy of a Cart Item Row:** Component-level design for cart line-items, specifying the positioning of thumbnails, titles, interactive quantity selectors, and deletion triggers.
3. **Dynamic Shipping Progress Bar:** Spatial and accessibility specifications for an interactive shipping threshold indicator (e.g., "Spend $15 more for Free Shipping").
4. **Interaction Spec & ARIA Matrix:** Detailed guidance on keyboard tab routes, screen reader live-region updates (announcing subtotal changes), focus trapping in drawers, and tactile touch-target sizing.

---

## Workflow

### 1. Choose the Cart Architecture Model
Determine the primary spatial model based on catalog depth and user shopping behavior:
- **The Slide-Out Mini-Cart Drawer (Overlaid Panel):** Best for frequent-add catalogs (cosmetics, apparel, grocery) where users continue browsing after adding items. The drawer glides out from the right viewport edge, overlaying the content.
- **The Dedicated Cart Page (Full-screen view):** Best for high-consideration purchases (electronics, furniture, high-end luxury) or B2B platforms where bulk edits, detailed specs, and extensive payment configurations are reviewed before committing.
- **The Hybrid Pattern (Recommended):** Use a slide-out mini-cart drawer for immediate visual feedback upon "Add to Cart", with a prominent secondary link to view/edit on a dedicated cart page.

### 2. Structure the Mini-Cart Drawer (Desktop & Mobile)
Layout the slide-out drawer using CSS Grid to ensure independent, scrollable regions:
- **Fixed Width (Desktop):** Keep the drawer width bounded between `400px` and `480px` to maintain comfortable readability. On mobile, the drawer occupies `100%` of the viewport width.
- **Header Region (Fixed):** Displays "Your Cart" (using a descriptive heading level like `h2`), active item count, and a prominent "Close" button (labeled with a high-contrast icon and `aria-label="Close Cart"`).
- **Cart Items List Region (Scrollable):** Uses `flex: 1 1 auto; overflow-y: auto;` to allow independent scrolling of cart items. Ensure that this list is contained inside a semantic `<ul role="list">` to ensure clean screen-reader announcements.
- **Footer Summary Region (Fixed):** Docked to the bottom. Contains the subtotal, dynamic free-shipping progress indicator, promotional/discount cues, and the primary "Proceed to Checkout" call-to-action (CTA).

### 3. Structure the Dedicated Cart Page (Desktop >1024px)
Organize the dedicated cart page using a 2-column spatial layout (65% left column, 35% right column):
- **Left Column: Cart Items List:** Displays a vertical stack of detailed cart item rows. Features bulk action options (e.g., "Clear Cart", "Save for Later") at the top or bottom of the list.
- **Right Column: Order Summary Card (Sticky):** Positioned using `position: sticky; top: var(--space-m);` to remain anchored during long page scrolls. Houses the itemized cost breakdown (Subtotal, Estimated Shipping, Tax, promo code input fields) and the checkout CTA button.

### 4. Design the Anatomy of a Cart Item Row
Avoid layout shifting and maintain high scannability within each individual cart row:
- **Spatial Alignment:** Use a flexible horizontal grid:
  ```text
  [Thumbnail (80x80px)]  [Title + Variants + Price]  [Quantity Toggle + Remove Button]
  ```
- **Thumbnail Image:** Set explicit sizing (e.g., `80px` width and height) and `object-fit: cover;` with a subtle border radius. Do not use generic alt text; use `alt="Thumbnail of [Product Name]"` or mark as decorative `alt=""` if the title is adjacent.
- **Metadata Stack:** Align text left (or right in RTL layouts). Use hierarchy: product title in bold, selected variants (e.g., "Size: M", "Color: Charcoal") in smaller, muted gray, followed by the active price. If the item is on sale, show the strikethrough MSRP and the active sale price in red/accent color.
- **Quantity Selector Component:** Avoid native select menus or simple input boxes. Instead, design a unified pill:
  - An decrement button (`-`), a numerical indicator (readonly or keypress-capable text input), and an increment button (`+`).
  - Target size for each tap area must be at least `40x40px` on mobile with a clear border outline.
- **Remove Trigger:** Place a distinct "Trash" icon or textual "Remove" button near the row end. Label it with `aria-label="Remove [Product Name] from cart"` so screen readers don't announce a generic "Trash button".

### 5. Design the Dynamic Shipping Progress Bar
Incorporate margin-safe upsell thresholds directly inside the cart:
- **Visual Presentation:** A solid horizontal bar (typically 6px height) placed near the top of the cart drawer or summary block.
- **Dynamic Calculation:** Color the active progress portion in an accent brand color (e.g., green for positive feedback).
- **Textual Indicator:** Display a clear statement above the bar: e.g., "You are **$15.00** away from **Free Shipping**!".
- **Threshold Achievement State:** Once the cart total crosses the threshold, transition the text to a congratulatory confirmation (e.g., "✓ You've unlocked **Free Shipping**!") and shift the bar to a completed state.

### 6. Establish Keyboard Focus, ARIA, and Accessibility Controls
The shopping cart is an active application state. Ensure keyboard and screen reader accessibility are flawless:
- **Drawer Focus Trap (Slide-out Mini-cart):** When the cart drawer slides open, programmatic focus must instantly shift to the "Close" button or the first focusable element. Trap focus within the drawer (using a vanilla utility or library) so pressing `Tab` never leaks into background page elements. Pressing `Escape` must close the drawer and restore focus to the originating header "Cart" button.
- **Skip Links & Section Landmarks:** On the dedicated cart page, label the main sections with appropriate ARIA landmarks: e.g., `<main>`, `<section aria-label="Shopping Cart Items">`, and `<aside aria-label="Order Summary">`.
- **Aria-Live Updates:** When a user increases/decreases a product quantity or removes an item, do not refresh the page. Instead, use an invisible `aria-live="polite"` region to announce the change (e.g., "Quantity updated. Subtotal is now seventy-five dollars.").
- **Disabled State Prevention:** While a quantity recalculation is in progress, apply `aria-busy="true"` and temporarily disable interactive buttons with visually elegant loading spinners. This prevents users from double-tapping or overloading requests.

---

## Decision Rules

### Cart Format Selection Heuristic

| Average Items per Order | Catalog/Direct Navigation Flow | Recommended Primary Cart Format |
| :--- | :--- | :--- |
| **1 - 1.5 Items** (e.g., High-end electronics, enterprise SaaS) | Direct flow to single transaction. | **Dedicated Cart Page or Instant Checkout Redirect.** |
| **2 - 4 Items** (e.g., Standard apparel, shoes, home goods) | Users continue browsing but expect review. | **Slide-out Mini-Cart Drawer** with secondary link to Dedicated Cart Page. |
| **5+ Items** (e.g., Grocery, cosmetics, pharmacy, wholesale) | High-volume, bulk line edits are common. | **Dedicated Cart Page** with persistent sidebar summary. |

### Empty Cart Presentation Strategy
Never display a plain blank column or text saying "Your cart is empty." design a structured "Empty Cart State":
- **Illustration/Icon:** A friendly, muted illustration of an empty shopping cart or bag.
- **Encouraging Copy:** Clear heading (e.g., "Your shopping bag is empty") with helpful body copy (e.g., "Looks like you haven't added anything to your cart yet. Let's find something you love!").
- **Primary CTA Buttons:** Provide 2–3 targeted quick-links to top collections (e.g., "Shop New Arrivals", "Shop Best Sellers", "View Sale Items") to guide the user back into the conversion funnel.

---

## Constraints

- **Accessibility (WCAG AA Minimum):**
  - **SC 1.4.3 Contrast:** Cart prices, titles, discount indicators, and button texts must meet a minimum contrast of **4.5:1** (**3:1** for large text >18pt).
  - **SC 2.1.1 Keyboard Navigable:** Every interaction in the cart (increasing quantity, deleting items, closing the drawer, entering discount codes) must be executable using only the `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Escape` keys.
  - **SC 2.5.8 Target Size:** Interactive elements (specifically increment/decrement quantity toggles and trash/remove icons) must possess a touchscreen-friendly tap footprint of at least **24x24px** (preferably **44x44px**).
- **Layout Shift Mitigation (CLS):**
  - Cart row containers must have reserved height values so that loading spinners or stock availability notices ("Only 2 left!") don't push adjacent items up or down.
  - Subtotal numbers must use tabular numeral fonts (`font-variant-numeric: tabular-nums;`) to prevent slight horizontal jumps as numbers change.
- **Mobile Viewport Compatibility:**
  - The cart page sticky order summary must collapse underneath the cart items list on screen widths `< 1024px`.
  - Ensure the mobile sticky checkout button uses `padding-bottom: env(safe-area-inset-bottom);` on bottom-anchored mobile cart drawers.

---

## Common Failure Patterns

- **The "Invisible Loader" Trap:** Letting users click the "+" quantity button multiple times without visual feedback or loading indicators, resulting in the server processing multiple requests and overcharging the user.
- **The "Lost Close Button" on Mobile:** Placing the drawer close button so close to the viewport edge that mobile users cannot easily tap it, causing frustration and page bounces.
- **The Screen-Reader "Black Hole":** Dynamically removing an item from the cart without updating the focus. When the row is destroyed, focus is lost, causing screen readers to jump back to the very top of the HTML document.
- **Unannounced Hidden Fees:** Failing to indicate estimated shipping and taxes clearly in the subtotal region, leading to immediate cart abandonment when high extra fees are unexpectedly revealed on the final checkout screen.
- **The Keyboard Trap:** Opening a mini-cart drawer overlay but failing to trap focus inside, allowing keyboard users to tab "through" the drawer onto interactive links hidden in the background page.

---

## Validation Criteria

- [ ] **Dual-Blueprint Completeness:** The system explicitly details both a slide-out drawer layout structure and a dedicated 2-column cart page layout.
- [ ] **Semantic Line Item Construction:** Every item row features an explicit thumbnail image (with alt descriptions), metadata text stack, unified quantity modifier pill, and accessible removal trigger.
- [ ] **Tap Target Footprint:** Increment, decrement, and removal triggers meet the WCAG target size minimum of at least 24x24px (44x44px preferred on mobile).
- [ ] **Focus Trapping on Drawers:** Mini-cart drawers programmatically restrict keyboard focus when open and return focus to the originating trigger when closed.
- [ ] **Tabular Numeral Pricing:** Numeric prices and subtotals utilize `font-variant-numeric: tabular-nums` to eliminate layout jitter during quantity updates.
- [ ] **Dynamic Live Region Announcements:** Dynamic subtotal modifications or item removals trigger clear text announcements via an invisible `aria-live="polite"` element.
- [ ] **Mobile Touch-Safe Zones:** Bottom checkout CTAs on mobile respect system safe area parameters using `env(safe-area-inset-bottom)`.
- [ ] **Actionable Empty State:** The empty cart view contains rich contextual CTAs guiding the user back to high-intent collections.
