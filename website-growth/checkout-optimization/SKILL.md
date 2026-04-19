---
name: checkout-optimization
description:
  Systematic framework for reducing friction and abandonment during the
  e-commerce checkout process. Trigger this skill when cart abandonment rates
  are high or checkout conversion is below industry benchmarks.
---

# Checkout Optimization

## Purpose

The Checkout Optimization skill provides a protocol for auditing and refining
the final stages of the e-commerce funnel. It focuses on removing "exit points,"
reducing interaction cost, and building sufficient trust to finalize a
transaction. By streamlining the path from "Cart" to "Thank You," this skill
directly improves conversion rates and revenue.

## Use Cases

- Reducing high cart abandonment rates in B2C e-commerce.
- Optimizing complex subscription sign-up flows.
- Improving mobile checkout conversion for retail sites.
- Transitioning from a multi-page checkout to a streamlined accordion or
  single-page flow.

## When NOT to Use

- **Lead Gen Forms:** Use `lead-capture-form-optimization` for non-transactional
  forms.
- **Top-of-Funnel Pages:** Use `hero-section-optimization` or
  `landing-page-content-hierarchy` for landing pages.
- **Internal Tools:** Where users are required to complete a process regardless
  of friction (though UX principles still apply).

## Inputs

1. **Current Checkout URL:** Access to the live checkout flow.
2. **Analytics Data:** Abandonment rate at each checkout step (Shipping,
   Billing, Payment).
3. **Mobile vs. Desktop Split:** Conversion rates by device type.
4. **Current Payment Methods:** List of supported gateways (e.g., Credit Card,
   PayPal, Apple Pay).
5. **Shipping/Tax Rules:** Understanding of when costs are calculated and
   displayed.

## Outputs

1. **Checkout Friction Audit:** Identification of technical or psychological
   barriers to completion.
2. **Optimized Flow Specification:** Revised step-by-step logic and field
   requirements.
3. **Trust & Security Plan:** Placement of badges, guarantees, and support
   links.
4. **Functional Recommendations:** Guidance on address autocomplete, guest
   checkout, and express payment options.

## Workflow

### 1. The Funnel Audit

- **Identify the Leak:** Use analytics to find which step has the highest
  drop-off.
- **Count the Fields:** Inventory every input. Any field that isn't required for
  shipping, billing, or tax is a candidate for removal.
- **The "Enclosure" Check:** Check if the standard site header/footer
  (navigation links) is still present. If so, it must be removed to prevent
  distraction.

### 2. Streamlining the Interaction

- **Mandatory Guest Checkout:** Ensure users can finish without creating an
  account. Move account creation to the "Thank You" page.
- **Address Autocomplete:** Implement Google Maps API or similar to reduce
  typing.
- **One-Click Payments:** Prioritize express buttons (Apple Pay, Google Pay,
  Shop Pay) at the top of the flow.
- **Default Settings:** Default "Shipping address same as billing" to checked.

### 3. Visual & Information Architecture

- **Persistent Order Summary:** Keep the total cost, items, and shipping fees
  visible throughout the entire process.
- **Progress Indicator:** For multi-step checkouts, show a clear breadcrumb
  (e.g., 1. Shipping -> 2. Payment -> 3. Review).
- **Mobile-First Inputs:** Ensure `tel` and `numeric` input types are used to
  trigger the correct mobile keyboards.

### 4. Risk Mitigation & Trust

- **Proximity Trust:** Place security badges (SSL, McAfee, etc.) and credit card
  icons directly next to the "Place Order" button.
- **Transparent Costs:** Never "surprise" the user with tax or shipping costs at
  the very last step. Show estimates as early as possible.
- **Inline Support:** Provide a phone number or "Live Chat" link for users who
  encounter technical errors.

### 5. Validation

- **Error Message Audit:** Ensure error messages are specific (e.g., "Card
  expired") rather than generic ("Error processing payment").
- **Final Review Step:** Ensure the user has one last chance to see exactly what
  they are buying before the final charge.

## Decision Rules

- **The Guest Checkout Rule:** Never force account creation before a purchase.
  Forced registration is a top reason for abandonment.
- **The Enclosure Rule:** The checkout page should have zero outbound links
  except for "Back to Cart," "Privacy Policy," and "Terms of Service."
- **The "No Surprises" Rule:** Shipping costs must be revealed as soon as a zip
  code is entered, not after the credit card is provided.
- **The Mobile Pay Rule:** If mobile traffic is >50%, express checkout buttons
  (Apple/Google Pay) must be at the very top of the first checkout step.

## Common Failure Patterns

- **Coupon Code Distraction:** Having a massive, empty coupon box that
  encourages users to leave the site to hunt for a discount.
- **The Data Greedy Checkout:** Asking for "How did you hear about us?" or
  "Phone number" (if not needed for shipping) during the payment flow.
- **Complex Password Requirements:** Forcing users to create a "12-character,
  1-symbol" password during checkout.
- **Hidden Totals:** Hiding the final "Total to be charged" behind a click or at
  the bottom of a long scroll.

## Validation Methods

- **Checkout Completion Rate:** (Completed Orders / Checkout Starts) \* 100.
  Target: 10-20% lift.
- **Step-Specific Drop-off:** Measuring the reduction in abandonment at the
  specific step that was optimized.
- **User Testing:** Observing users (especially on mobile) trying to complete a
  purchase with a dummy card.
- **Device Conversion Gap:** Closing the gap between desktop and mobile
  conversion rates.
