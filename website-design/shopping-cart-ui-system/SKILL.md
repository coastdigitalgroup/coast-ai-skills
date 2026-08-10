---
name: shopping-cart-ui-system
description:
  Design a systematic, highly accessible, and conversion-optimized layout
  framework for e-commerce shopping carts, defining spatial structures for sliding
  mini-cart drawers, dedicated cart pages, and item list components.
---

# Shopping Cart UI System

## Purpose

The Shopping Cart UI System skill provides a systematic design and spatial framework for the digital shopping cart, the critical transitional interface between product discovery and the checkout funnel. The shopping cart must perform three competing functions: confirm purchase intent (accuracy), offer seamless modifications (control), and motivate progression to payment (momentum) without creating layout shifts, visual clutter, or accessibility blocks. This system establishes standards for cart drawer slide-outs, dedicated cart pages, itemized lists, pricing summaries, and dynamic state feedback.

## Use Cases

- **E-Commerce Marketplaces:** Designing standard shopping cart interfaces for physical products.
- **SaaS Subscription Configurators:** Structuring carts for plans, add-ons, user seats, and billing cycles.
- **Service Booking Engines:** Organizing selected time-slots, service add-ons, and regional taxes in a unified view.
- **Digital Product Delivery:** Managing downloadable assets, licensing tiers, and virtual services.

## When NOT to Use

- **Single-Item Direct Checkout (Instant Buy):** When clicking "Buy Now" bypasses a cart entirely and takes the user directly to a payment checkout page; use `checkout-flow-optimization` instead.
- **In-Store POS (Point of Sale) Interfaces:** Dedicated employee-facing register layouts with separate mechanical physical requirements.
- **B2B Bulk Purchase Order Forms:** Dense spreadsheets or key-value CSV upload grids; use `responsive-data-tables` or bulk import systems.

## Inputs

1. **Product Inventory Metadata:** Images (thumbnails), titles, unique identifiers (SKUs), selected configurations (size, color), unit prices, and stock availability signals.
2. **Pricing Structure Rules:** Subtotal calculations, active discount/promotional codes, shipping thresholds, and estimated taxes.
3. **Cart Mode Choice:** Defining if the site will use a **Sliding Mini-Cart Drawer**, a **Full-Page Cart**, or a hybrid pattern.
4. **Primary Interaction Flow:** How the user triggers the cart (e.g., clicking header icon vs. auto-opening on "Add to Cart").

## Outputs

1. **Spatial Cart Blueprint:** Layout templates for both a Sliding Drawer (mini-cart) and a Dedicated Cart Page.
2. **Item Row Anatomy Spec:** Structured grid configuration for individual cart items (Image, Meta, Controls, Pricing, Removal).
3. **Summary & Checkout Panel Spec:** Organization of price calculations, shipping counters, promo fields, and primary proceed actions.
4. **Interactive States & Accessibility Mapping:** Focus-trapping rules for sliding drawers, screen-reader announcements for cart changes, and keyboard navigation matrices.

---

## Workflow

### 1. Select the Spatial Cart Model
Select the physical presentation format of the cart based on inventory catalog density and user behavior:

- **The Sliding Mini-Cart Drawer (Recommended Default):**
  - *When:* Fast-moving e-commerce or retail with high browse-and-add frequency.
  - *Layout:* Right-side vertical slide-out (spanning 320px–420px on desktop, 100vw on mobile).
  - *Benefit:* Keeps users in the shopping context. Allows quick adjustments without disrupting the browsing flow.
  - *Interaction:* Focus must trap within the drawer when open, background must be `inert`, and clicking the backdrop or hitting `Escape` must close it.

- **The Dedicated Cart Page:**
  - *When:* High-consideration purchases (furniture, luxury electronics, custom configurators) or complex B2B selections.
  - *Layout:* Two-column layout on desktop:
    - Left Column (65%): Scrollable list of items, active promotions, and upsells.
    - Right Column (35%): Sticky Pricing Summary, promo-code input, and high-visibility Checkout CTA.
  - *Benefit:* Maximum spatial breathing room for multi-layered selections, extensive product comparison, and shipping calculations.

- **The Hybrid System:** Use a sliding drawer on desktop to preserve browsing momentum, but redirect to a dedicated cart page on mobile if the spatial density of the drawer exceeds screen limitations.

### 2. Design the Item Row Anatomy
The individual cart item row is the most dense component. Map its grid carefully using CSS Grid or Flexbox to prevent structural breakage with long text or price variations:

```text
+-------------------------------------------------------------+
|  [📷 Thumbnail]  **Product Title**             [Price: $49] |
|  [64 x 64 px]    Size: Large | Color: Navy                  |
|                  Status: In Stock                           |
|                                                             |
|                  [- [ 1 ] +] Quantity           [Remove (X)]|
+-------------------------------------------------------------+
```

- **Thumbnail Zone:** Standard square ratio (1:1), bounded to exactly 64x64px or 80x80px.
- **Meta Info Column:** Title (linked to PDP), selected attributes (size/color), and inventory status (e.g., "Only 2 left" in warning amber).
- **Quantity Selector:** Interactive counter. Buttons must have a minimum target of 44x44px for touch, enclosing a read-only input value. Do not allow typing letters.
- **Price Column:** Right-aligned unit price, or total item price if quantity > 1. Bold text, with any original/slashed sale prices styled in a muted gray with lower priority.
- **Action Zone:** A distinct, easily tappable "Remove" button (represented by an accessible "Trash" icon or explicit "Remove" text).

### 3. Structure the Summary and checkout Panel
The Summary Panel is the visual culmination of value. Arrange it vertically to guide the eye toward the final action button:

- **Free Shipping Progress Tracker:** Place at the very top of the panel. A visual progress bar calculating remaining value (e.g., "You are $15.00 away from Free Shipping!").
- **Pricing Calculation Stack:**
  - Subtotal (high-contrast label and value).
  - Applied Discounts (labeled with green text and a removable promo code badge, e.g., `SAVE20 [x]`).
  - Shipping cost (explicitly stating "Free" or "Calculated at next step" to avoid billing surprises).
  - Estimated Taxes.
  - Estimated Total (the largest, boldest price value on the screen).
- **Primary Checkout Button:** High-contrast, full-width filled button. Text must be action-oriented and explicit (e.g., "Proceed to Checkout" or "Secure Checkout"). Include accepted payment logos immediately below.

### 4. Create the Feedback and Loading Loop
Cart modifications are asynchronous. Prevent visual jitter and layout shifts during updates:

- **Activity Indicators:** When quantity changes, apply a subtle semi-transparent skeleton mask or loading spinner *only* over the modified item row and the subtotal section.
- **Accessibility Announcements:** Screen readers must be notified of changes via an `aria-live="polite"` region (e.g., "Quantity updated to 2. New subtotal is $98.00").
- **Dynamic Badge Counts:** The global cart icon (usually in the site navigation) must update its badge count instantly. If empty, the badge must be hidden rather than displaying `0`.

### 5. Define Responsive Stacking and Touch Adaptation
Ensure the cart transitions flawlessly to mobile viewports (< 768px):

- **Item Row Reordering:** Under CSS Grid, change the 4-column desktop layout (Image -> Title -> Quantity -> Price) into a compact vertical stacked arrangement:
  - Image stays left, but Title, Price, and Attributes sit in a single vertical stack next to it.
  - Quantity selector and Remove button align across the bottom of the item container.
- **Sticky Footer Action:** On mobile full-page carts, dock the "Checkout" CTA button as a persistent sticky footer at the bottom of the viewport so users can proceed instantly without scrolling to the bottom of the long list.

### 6. Implement WCAG AA Accessibility Standards
- **Keyboard Navigation:** All interactive elements (Quantity buttons, Remove button, Promo inputs) must be reachable via `Tab` with highly visible `:focus-visible` outlines.
- **Dialog Role (For Drawers):** Sliding carts must use `<dialog>` or `role="dialog"` with `aria-modal="true"`.
- **Labels:** Quantity decrement and increment buttons must have descriptive `aria-labels` (e.g., `aria-label="Decrease quantity by 1"`, `aria-label="Increase quantity by 1"`).
- **Contrast:** Price details and cart metadata must maintain a minimum contrast ratio of 4.5:1 against the container background.

---

## Decision Rules

### Sliding Drawer vs. Dedicated Page Selection Matrix

| E-commerce Metric | Typical Purchase Count | CONSIDER | RECOMMENDATION |
| :--- | :--- | :--- | :--- |
| **High Frequency / Low Price** | 3–15 items | Browsing Momentum | **Sliding Mini-Cart Drawer** |
| **Low Frequency / High Price** | 1–2 items | Details validation | **Hybrid (Drawer -> Page)** |
| **Complex Configurations** | Variable | Cross-checking specs | **Dedicated Cart Page** |
| **B2B Procurement** | Large volume (50+) | Density & Line Items | **Full-Page Grid Table** |

### Auto-Open Drawer Behavior Rules
- **Rule 1:** When a user clicks "Add to Cart" on a desktop viewport, **automatically open** the Sliding Cart Drawer to confirm successful addition and show checkout pathway.
- **Rule 2:** On mobile viewports, **do not auto-open** the drawer as it occupies the entire screen and disrupts shopping. Instead, show a transient floating toast notification with a "View Cart" shortcut.
- **Rule 3:** If the cart is empty, replace the entire drawer/page content with a friendly illustration, a descriptive "Your cart is empty" heading, and a direct button back to primary product listings (e.g., "Shop All Products"). Do not show an empty pricing table.

---

## Constraints

- **Accessibility:**
  - Standard HTML structure with native form elements or accessible buttons.
  - Active focus trapping within Sliding Drawers when open.
  - `aria-live="polite"` regions for screen reader announcements on quantity additions and removals.
  - `aria-hidden="true"` applied to background content while drawers are active.
- **Responsiveness:**
  - Drawer max-width bound: 420px on desktop, 100% on viewports < 480px.
  - Minimum touch target area for interactive selectors: 44x44px.
  - Vertical scroll lock applied to `<body>` while cart drawers are open.
- **Visual Hierarchy:**
  - Checkout CTA must have the highest visual weight on the entire screen (highest contrast background, boldest font).
  - original prices (if items are on sale) must be struck through and have at least 15% lower visual weight than the active purchase price.

---

## Common Failure Patterns

- **The "Invisible Loader":** Modifying quantities without a visual spinner or progress mask, leaving the user unsure if their click registered or if the final subtotal is accurate.
- **Broken Focus Trapping (The Keyboard Leak):** Keyboard users tab "through" the sliding cart drawer and begin selecting items behind the dimmed backdrop, leading to severe confusion.
- **The Mobile Layout Blowout:** Forcing a wide, multi-column desktop layout (Image - Name - Quantity - Remove - Price) onto a 360px mobile viewport, causing horizontal scrollbars or squeezed, overlapping text.
- **Hidden Extra Fees (Bill Shock):** Concealing shipping estimates or additional service fees until the last screen of checkout, causing high cart abandonment. State cost estimates clearly in the cart summary.
- **Double-announcing decorative elements:** Screen readers reading aloud background icons or decorative "+" and "-" characters instead of reading "Increase quantity" and "Decrease quantity".

---

## Validation Criteria

- [ ] **Spatial Adaptation:** Cart layout transitions gracefully between desktop (drawer or split columns) and mobile (stacked or persistent dock footer).
- [ ] **Item Row Grid Stability:** Long product titles or price lengths wrap gracefully without pushing the quantity selector or pricing columns out of bounds.
- [ ] **Feedback Systems:** Loading/updating states visually mask modified items, and an `aria-live` region announces cart changes.
- [ ] **Accessibility (Focus & Roles):** Sliding mini-carts trap keyboard focus, support `Escape` to close, and use proper `role="dialog"` or `<dialog>` elements.
- [ ] **Touch Target Safety:** All quantity controls, removal targets, and checkout CTA buttons have a minimum interactive zone of 44x44px.
- [ ] **Contrast Integrity:** Text elements, pricing values, and discount indicators maintain a minimum 4.5:1 contrast ratio.
- [ ] **Clear Empty State:** When empty, the cart renders a welcoming illustration, an empty message, and a primary CTA returning users to active shopping category grids.
