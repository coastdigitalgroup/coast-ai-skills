---
name: checkout-flow-optimization
description:
  Audit and optimize the checkout process to minimize friction, reduce cart
  abandonment, and increase completion rates. Trigger this skill when there is a
  significant drop-off between "Cart" and "Order Complete" or when users report
  difficulty completing purchases.
---

# Checkout Flow Optimization

## Purpose

The Checkout Flow Optimization skill provides a systematic framework for
identifying and removing barriers in the final stage of the user journey. By
optimizing form design, choice architecture, and trust signals, this skill aims
to maximize Checkout Completion Rate (CCR) and minimize "last-mile" friction. It
moves from a business-centric "data collection" mindset to a user-centric
"facilitation" mindset.

## Use Cases

- E-commerce sites with high cart abandonment rates (industry average is ~70%).
- SaaS platforms optimizing for trial-to-paid or direct subscription conversion.
- Mobile commerce apps where thumb-friendly design and speed are critical.
- Sites seeing high "Guest vs. Account" drop-off at the start of checkout.

## When NOT to Use

- **Early Funnel Optimization:** Do not use for landing page or product list
  optimization (use `hero-section-optimization` or
  `landing-page-content-hierarchy` instead).
- **Lead Gen Forms:** If the goal is a simple inquiry without a payment/order
  step, use `lead-capture-form-optimization`.
- **Post-Purchase Experience:** Does not cover "Thank You" pages or shipping
  notifications.

## Inputs

1. **Checkout Analytics:** Data on where users drop off (e.g., Step 1: Account,
   Step 2: Shipping, Step 3: Payment).
2. **Current Checkout URL/Screenshots:** Full visibility into the current flow,
   including mobile viewports.
3. **Fulfillment Model:** Shipping options, tax calculation methods, and
   available payment gateways.
4. **User Feedback/Support Tickets:** Common complaints related to checkout
   errors or confusion.

## Outputs

1. **Checkout Friction Audit:** A list of high-impact barriers (e.g., "Forced
   account creation," "Hidden shipping costs").
2. **Optimized Flow Specification:** Recommended changes to layout (e.g.,
   single-page vs. multi-step), field requirements, and button placement.
3. **UX & Copy Refinements:** Specific improvements to microcopy, error
   messages, and trust signal placement.
4. **Priority Roadmap:** Categorization of fixes by "Ease of Implementation" vs.
   "Impact on Conversion."

## Workflow

### 1. Audit the Entry Point (The "Guest" Factor)

Analyze the first interaction after clicking "Checkout."

- **Guest Prominence:** Is "Checkout as Guest" the most prominent option?
- **Social Login:** Are express options (Apple Pay, Google Pay, PayPal) offered
  early to bypass forms?
- **Login Friction:** If account creation is required, are password rules
  minimal (e.g., 8+ chars only)?

### 2. Streamline Information Gathering

Audit every field in the shipping and billing forms.

- **Field Consolidation:** Use a single "Full Name" field instead of First/Last.
- **Auto-Fill & Validation:** Implement address auto-complete (Google Places
  API) and real-time inline validation.
- **Optional vs. Required:** Explicitly mark BOTH required and optional fields.
  Hide uncommon optional fields (e.g., "Company Name") behind a link.

### 3. Clarify Fulfillment & Costs

Address the #1 reason for abandonment: unexpected costs.

- **Delivery Dates:** Show "Delivers by Friday, Oct 12" instead of "3-5 Business
  Days."
- **Transparency:** Show total costs (including tax and shipping) as early as
  possible.
- **Fulfillment Choice:** Include all options (Store Pickup, Standard, Express)
  in a single interface.

### 4. Optimize for Mobile & Speed

Ensure the flow is "thumb-friendly" and fast.

- **Numeric Keyboards:** Use `type="tel"` or `type="number"` for phone and ZIP
  code fields.
- **Visual Progress:** If multi-step, use a clear progress indicator.
- **Express Payments:** Prioritize "Buy Now" buttons (Apple Pay/Shop Pay) that
  bypass the checkout flow entirely.

### 5. Review Against Decision Rules

Verify the proposed changes against the checkout heuristics below.

## Decision Rules

- **The "No Surprises" Rule:** Total cost (including shipping/taxes) must be
  calculated and displayed before the final "Place Order" button is active.
- **Guest-First Default:** Guest checkout should always be the default or most
  visually prominent path for new users.
- **Adaptive Error Messages:** Errors must tell the user _how_ to fix it (e.g.,
  "Phone number must be 10 digits") rather than just "Invalid Input."
- **Proximity of Trust:** Place security badges and guarantees (e.g., "Secure
  SSL Encryption") directly next to the "Place Order" button.
- **One Primary Action:** Every checkout step should have exactly one clear
  "Next" button. Remove site navigation (header/footer) to minimize
  distractions.

## Common Failure Patterns

- **The "Forced Marriage":** Requiring account creation before the user can even
  see shipping costs.
- **The "Hidden Tax":** Waiting until the very last step to add shipping fees or
  taxes.
- **Coupon Code Distraction:** Making the "Promo Code" box too prominent,
  prompting users to leave the site to hunt for a discount.
- **Vague Delivery Times:** Using "Shipping Speed" (e.g., Standard) which
  requires mental math for the user to estimate arrival.
- **The "Clear All" Trap:** Including a "Reset Form" button that users might
  accidentally click.

## Validation Methods

- **Checkout Completion Rate (CCR):** (Completed Orders / Checkout
  Starts) \* 100. Target: 5-15% lift.
- **Cart-to-Detail Rate:** Measure if changes to shipping transparency in the
  cart reduce checkout abandonment.
- **Form Analytics:** Track time-spent and error-rate per field to identify
  "stuck" points.
- **User Testing (The "No Scroll" Test):** Can a user complete the primary
  shipping form on mobile without excessive vertical scrolling?
