---
name: cart-experience-optimization
description:
  Audit and optimize the shopping cart experience to reduce friction, eliminate
  cost surprises, and bridge the gap between product selection and checkout
  start. Trigger this skill when there is a high "Cart-to-Checkout" drop-off
  rate.
---

# Cart Experience Optimization

## Purpose

The Cart Experience Optimization skill provides a framework for refining the
transitional state between "Shopping" and "Buying." While the product page
generates intent and the checkout closes the deal, the cart is where users
validate their choices, calculate total costs, and overcome final hesitations.
By optimizing the cart for transparency, speed, and reassurance, this skill
directly improves the Checkout Start Rate and reduces Cart Abandonment.

## Use Cases

- E-commerce sites with a high volume of items per order.
- Sites seeing a significant drop-off between "Add to Cart" and "Begin Checkout."
- Mobile commerce where the cart experience often feels cramped or confusing.
- Situations where users use the cart as a "wishlist" or comparison tool rather
  than a purchase step.

## When NOT to Use

- **Direct-to-Checkout Flows:** If your product uses a "Buy Now" button that
  skips the cart entirely, use `checkout-flow-optimization`.
- **SaaS Subscription Signups:** Where there is no "Cart" concept, only a
  pricing selection leading to a form.
- **Lead Generation:** For non-transactional sites, use
  `lead-capture-form-optimization`.

## Inputs

1. **Cart Analytics:** Data on "Cart-to-Checkout" transition rates and average
   items per cart.
2. **Current Cart UI:** Screenshots of the cart (Slide-out, Modal, or Full-page)
   across mobile and desktop.
3. **Fulfillment Logic:** Shipping thresholds, tax calculation methods, and
   available discounts.
4. **User Feedback:** Comments regarding unexpected costs, difficulty modifying
   quantities, or confusion about shipping.

## Outputs

1. **Cart Friction Audit:** Identification of hidden costs, lack of trust
   signals, or poor usability.
2. **Optimized Cart Layout:** Recommendations for the placement of order
   summaries, CTAs, and shipping calculators.
3. **Transparency Specs:** Guidance on how to display taxes, shipping, and
   estimated delivery dates early.
4. **Reassurance Strategy:** Placement of trust badges, return policy summaries,
   and "Secure Checkout" messaging.

## Workflow

### 1. Audit for "Total Cost" Transparency
The #1 reason for cart abandonment is unexpected costs at checkout.
- **Shipping Calculator:** Provide a "Zip Code" estimator so users don't have
  to start checkout to see shipping costs.
- **Progress Bars:** Show "You are $X away from Free Shipping" to encourage
  Average Order Value (AOV) and reduce abandonment due to shipping fees.
- **Tax Inclusion:** If possible, show an estimated tax or clearly state "Taxes
  calculated at checkout."

### 2. Optimize the "Bridge" UX
Make it effortless to move from the cart to the checkout.
- **Primary CTA Prominence:** Ensure the "Checkout" button is the most
  visually dominant element in the cart.
- **Express Pay Options:** Display Apple Pay, PayPal, or Shop Pay buttons
  directly in the cart to bypass the multi-step checkout.
- **Sticky Footer (Mobile):** On mobile carts, keep the "Checkout" button
  and "Total" fixed at the bottom of the viewport.

### 3. Streamline Cart Management
Allow users to modify their intent without leaving the funnel.
- **Easy Quantity Adjustment:** Use simple +/- buttons rather than dropdowns
  or manual text inputs.
- **"Save for Later":** Provide a way to move items to a wishlist to prevent
  users from deleting items they might buy later.
- **Undo Actions:** If a user removes an item, show a temporary "Undo" or
  "Restore" link to prevent frustration.

### 4. Inject Reassurance and Trust
Address the "Buyer's Remorse" that happens just before spending.
- **Security Signals:** Place a "Secure SSL" icon or lock symbol near the
  Checkout button.
- **Return Policy Summary:** A simple "30-Day Easy Returns" note builds
  confidence.
- **Payment Method Icons:** Show logos of accepted credit cards and payment providers.

### 5. Review Against Decision Rules
Verify that the cart serves as a facilitator, not a roadblock.

## Decision Rules

- **The "No Surprises" Rule:** Never wait until the final checkout step to reveal
  shipping costs if they can be calculated in the cart.
- **Visual Priority:** The "Checkout" button must have the highest contrast and
  be immediately findable without scrolling (especially on mobile).
- **Navigation Freedom:** Do not "lock" the user in the cart. Allow an easy
  "Back to Shopping" path to encourage further discovery.
- **The "Mini-Cart" Preference:** For stores with 1-3 items per order, use a
  Slide-out or Drawer cart to keep the user on the current page. For 5+ items,
  a full-page cart is often better for clarity.

## Constraints

- **Data Dependency:** "No Surprises" transparency requires real-time
  shipping and tax calculation data available before checkout begins. If the
  platform can only calculate these at checkout, recommendations are limited
  to estimated ranges.
- **Template Limits:** Slide-out vs. full-page cart layout is often
  constrained by the underlying platform's theme architecture (e.g.,
  Shopify, custom-built carts); some platforms cannot support both.
- **Express Pay Availability:** Displaying Apple Pay/PayPal/Shop Pay
  buttons in the cart depends on the payment processor and platform
  supporting cart-level express checkout.

## Non-Goals

- Does not cover the address, shipping-method, and payment-entry steps
  after "Begin Checkout" — see `checkout-flow-optimization`.
- Does not design the recommendation algorithm behind "People Also Bought"
  modules, only their placement and restraint within the cart.
- Does not apply to "Buy Now" flows that skip the cart entirely, or to
  SaaS pricing selection with no cart concept — see When NOT to Use.

## Common Failure Patterns

- **The "Mystery Total":** Showing a subtotal only, leaving the user to guess
  the final price until they've entered their address.
- **The "Coupon Hunt":** Making the "Promo Code" field so prominent that users
  leave the site to find a code and never return.
- **Cluttered Upsells:** Adding so many "People Also Bought" items that the
  user loses sight of the "Checkout" button.
- **Forced Registration:** Not showing the checkout button until the user has
  logged in or created an account.
- **Broken Mobile Layout:** Large product tables that require horizontal
  scrolling on mobile devices.

## Validation Criteria

- [ ] **Checkout Start Rate:** (Checkout Starts / Add to Carts) * 100. Target
  improvement: 10-20%.
- [ ] **AOV Lift:** Measure if "Free Shipping" progress bars increase the
  average order value.
- [ ] **Cart Abandonment Rate:** The percentage of users who add items but never
  start checkout.
- [ ] **Time to Checkout:** Measure the duration from "Add to Cart" to "Begin
  Checkout."
