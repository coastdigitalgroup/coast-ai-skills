# Checkout Friction Audit Checklist

Use this checklist to identify bottlenecks in an e-commerce checkout flow. A
"No" to any of these questions indicates a conversion leak.

## 1. Interaction & Flow

- [ ] **Guest Checkout:** Can a user complete a purchase without creating a
      password?
- [ ] **Account Creation Delay:** Is account creation offered _after_ the
      purchase is complete (on the Thank You page)?
- [ ] **Enclosed Layout:** Are the main site navigation and footer hidden to
      prevent exit-clicks?
- [ ] **Address Autocomplete:** Does the address field use an API (like Google
      Maps) to suggest and fill addresses?
- [ ] **Field Count:** Are there fewer than 10 total input fields across the
      entire checkout?
- [ ] **Logical Grouping:** Are fields grouped logically (Shipping -> Payment ->
      Review)?

## 2. Payment & Costs

- [ ] **Express Payments:** Are 1-click options (Apple Pay, Google Pay, PayPal)
      available and prominent?
- [ ] **Transparent Costs:** Are shipping and taxes shown as soon as the zip
      code is entered?
- [ ] **No Hidden Fees:** Is the "Total" at the end exactly what was expected
      from the cart page?
- [ ] **Collapsed Promo Box:** Is the coupon/promo code field a subtle link
      rather than a large, empty input box?
- [ ] **Defaulting:** Is "Shipping same as Billing" checked by default?

## 3. Trust & Confidence

- [ ] **Proximity Trust:** Are security badges (SSL, Payment icons) placed near
      the final "Place Order" button?
- [ ] **Risk Reversal:** Is the return policy or guarantee visible during the
      checkout process?
- [ ] **Inline Support:** Is there a clear way to get help (phone number or
      chat) if a technical error occurs?
- [ ] **Order Summary:** Is a summary of items and the final total visible on
      every step of the checkout?

## 4. Mobile Optimization

- [ ] **Correct Keyboards:** Do numeric fields (Credit Card, CVV, Zip) trigger a
      numeric keypad on mobile?
- [ ] **Touch Targets:** Are all buttons and form fields at least 44x44 pixels?
- [ ] **Auto-Correct Disabled:** Is auto-correct disabled for fields like "Name"
      and "Address" to prevent frustration?

## Audit Scorecard

- **0-5 "No"s:** High performing. Focus on minor A/B tests.
- **6-10 "No"s:** Significant friction. Prioritize Guest Checkout and Express
  Pay.
- **11+ "No"s:** Critical failure. Immediate redesign of the checkout flow is
  required.
