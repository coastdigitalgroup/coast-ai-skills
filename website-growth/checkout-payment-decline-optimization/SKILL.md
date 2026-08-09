---
name: checkout-payment-decline-optimization
description:
  Audit, design, and optimize e-commerce payment decline flows, translating cryptic processor rejection codes into actionable UX copy, preserving checkout form states, and highlighting alternative payment method fallbacks to recover failed checkout attempts.
---

# Checkout Payment Decline Optimization

## Purpose

The Checkout Payment Decline Optimization skill provides a systematic framework for auditing, designing, and optimizing e-commerce payment decline flows.

A payment decline is one of the most high-friction events in the user journey. Shoppers have completed the entire funnel, added items, entered their shipping details, and explicitly decided to purchase, only to have their payment rejected. Standard checkout systems often show a generic, hostile, or cryptic message (e.g., "Transaction declined: Code 51" or "Your card was declined") and clear all payment fields or even the entire billing form. This triggers immediate frustration, anxiety, and distrust, causing up to 60% of declined users to abandon their purchase completely.

By translating cryptic processor decline codes (e.g., from Stripe, Adyen, Braintree, Shopify Payments) into clear, friendly, and actionable UX microcopy, maintaining form states, and presenting immediate alternative payment fallbacks (like Apple Pay, PayPal, or Buy Now Pay Later), this skill directly recovers failed checkout attempts, increases Checkout Completion Rate (CCR), and boosts Customer Lifetime Value (LTV).

## Use Cases

- **E-commerce & Subscription Sites:** Experiencing high checkout drop-offs correlated with payment failure events.
- **High Average Order Value (AOV) Sites:** Where banks are highly likely to trigger fraud alerts and reject legitimate high-value transactions.
- **International/Cross-Border Merchants:** Selling to international audiences where currency mismatch or regional credit card rules cause high processor declines.
- **Mobile First Funnels:** Where re-entering extensive form fields after a card error is particularly painful and leads to instant churn.

## When NOT to Use

- **B2B Invoicing/Purchase Orders:** Where payments are processed offline, via manual wire transfers, or through accounts receivable billing.
- **Pre-Payment Funnels:** For lead-generation sites, gated access landing pages, or free signups that do not require any card validation.
- **SaaS Account Management (Past-Due):** For handling failed recurring monthly subscriptions *after* the initial purchase. While similar principles apply, this skill specifically targets the checkout-stage active cart purchase. For subscription-specific billing issues, use `billing-interval-optimization` or `subscription-cancel-flow-optimization`.

## Inputs

1. **Processor Logs / Analytics:** Access to payment gateway decline codes (e.g., Stripe raw decline codes like `insufficient_funds`, `incorrect_cvc`, `approve_with_id`, `card_velocity_exceeded`).
2. **Current Decline UX screenshots/logs:** Screenshots of how errors are currently displayed on both mobile and desktop viewports, and whether billing form fields are retained or cleared.
3. **Current Checkout UI Layout:** The complete DOM/form structure of the checkout page, showing available alternative payment methods (e.g., PayPal, Apple Pay, Google Pay, Klarna).
4. **Customer Support Tickets:** Search logs for terms like "cannot pay", "card declined", "payment error", or "error code" to identify common points of user confusion.

## Outputs

1. **Decline Flow Diagnostic Audit:** An analysis identifying the gap between raw processor messages and user-facing copy, as well as form-state retention behavior.
2. **Actionable Decline Translation Matrix:** A custom mapping document translating raw gateway response codes into friendly, non-judgmental, and action-oriented UX microcopy.
3. **Form-State Retention Protocol:** Technical specifications to ensure non-sensitive checkout fields remain populated and the user is kept in the active checkout state after a failure.
4. **Alternative Payment Fallback Wireframes/Specs:** UI specs demonstrating how to dynamically highlight other payment options immediately following a decline.

---

## Workflow

### 1. Retrieve and Audit Decline Analytics
Compile and analyze payment gateway data to identify the scale and specific causes of failed transactions:
- **Measure the Decline Rate:** Calculate `(Total Declined Transactions / Total Checkout Attempts) * 100`. A decline rate above 5% indicates a significant recovery opportunity.
- **Identify Top Rejection Reasons:** Categorize declines into user-correctable errors (e.g., `incorrect_zip`, `expired_card`, `incorrect_cvc`) and systemic bank rejections (e.g., `insufficient_funds`, `suspected_fraud`, `generic_decline`).
- **Evaluate Form Behavior:** Test the checkout yourself using test cards. When a card is declined:
  - Are non-sensitive fields (name, billing address) cleared?
  - Does the page scroll back to the top, hiding the error?
  - Is the error message generic ("An error occurred") or helpful?

### 2. Map Rejection Codes to Actionable UX Copy
Standard decline messages sound like accusations. Translate raw gateway messages into polite, helpful, and clear instructions:
- **The "No Blame" Tone:** Never imply the user made a mistake or has no money. Use supportive and direct language.
- **Provide Next Steps:** Every error must clearly state *how* to resolve it.
  - *Example (Incorrect CVC):* Instead of "CVC invalid," say "Please double-check the 3-digit security code on the back of your card and try again."
  - *Example (Insufficient Funds):* Instead of "Insufficient funds," say "Your card issuer was unable to authorize this amount. Please try an alternative card, use an express payment option, or contact your bank."
  - *Example (Generic Decline/Suspected Fraud):* Instead of "Transaction declined," say "Your card issuer has declined this transaction. This often happens with high-value purchases to protect your security. You can resolve this quickly by calling the number on the back of your card, or by using another card or PayPal."

### 3. Implement Form-State Retention
Do not punish the user for a payment failure by forcing them to re-enter their information:
- **Retain Input Fields:** Ensure that all non-sensitive checkout fields (Full Name, Shipping Address, Billing Address, Email, Phone, Shipping Method) remain populated on screen.
- **Targeted Caret Placement:** Highlight the precise payment input that caused the error (e.g., the CVC field or ZIP code field) and automatically place the cursor focus there.
- **Do Not Wipe Card Fields Completely:** Retain the first 12 digits of the card and only clear the secure CVC and the last 4 digits if required by PCI-DSS. This allows the user to see if they made a simple typo in the card number without starting over.

### 4. Deploy Dynamic Alternative Fallbacks
When a primary payment card fails, immediately present alternative avenues to complete the purchase:
- **Conditional Visibility:** If a card transaction is declined twice, dynamically display a prominent "Fallback Section" directly below the card input box.
- **Fallback Promotion:** Promote quick-click express payment buttons (e.g., Apple Pay, Google Pay, PayPal) or flexible installment options (Klarna, Afterpay) with microcopy: *"Card not working? Complete your order instantly with Apple Pay or PayPal."*
- **Keep Cart Intact:** Ensure that under no circumstances is the user's cart emptied or expired due to a declined transaction.

### 5. Review Against Decision Rules
Verify that the updated payment decline flow conforms to the core decision rules below.

---

## Decision Rules

- **The "Three-Second Scroll" Rule:** After a payment decline, the checkout page must automatically and smoothly scroll to the error message (or focus the failing input field) within 300ms. The user must never be left wondering if their click worked.
- **The "Anti-Anxiety" Rule:** Never use alarming visual treatments (such as bright flashing red screens or aggressive warning symbols) which trigger fraud-related panic. Use clean, clear yellow or soft red warning callout banners with high-contrast text.
- **The "Dynamic Fallback" Priority:**
  - If the decline code is `insufficient_funds`, prioritize displaying Buy Now Pay Later (BNPL) methods (Klarna/Afterpay) as the first alternative, as it spreads the cost.
  - If the decline code is `suspected_fraud` or `generic_decline`, prioritize PayPal or Apple Pay, as bank authorization rates for tokenized/express payments are substantially higher than raw card entry.
- **The "Two-Strike" Limit:** Do not let a user attempt to submit a failing card more than three times consecutively without forcing a modal overlay that offers direct customer support (Live Chat or Phone) or alternative payment options. This prevents security triggers and card-velocity locks.

---

## Constraints

- **PCI-DSS Compliance:** Under no circumstances should the custom checkout form store, cache, or log sensitive payment credentials (full credit card number, expiration date, or CVV/CVC) on local servers.
- **Gateway Error Limitations:** Some payment gateways group various decline reasons into a single generic code (e.g., Stripe `generic_decline`). In these cases, the UX must provide a comprehensive, multi-option resolution message (e.g., checking expiration, calling bank, or switching cards) rather than a narrow diagnosis.
- **Fraud Prevention Policies:** Do not bypass or disable fraud monitoring rules (such as 3D Secure / PSD2 Strong Customer Authentication) solely to reduce declines. Balance conversion optimization with secure verification.

## Non-Goals

- Bypassing card network limits, standard merchant chargeback liability, or payment risk algorithms.
- Custom-building alternative checkout processing gateways or processing transactions natively without a certified merchant account.
- Direct merchant-bank settlement disputes or automated chargeback fighting.

---

## Common Failure Patterns

- **The "Silent Error" (The Dead Spin):** The user clicks "Place Order", a spinner appears, disappears, and nothing happens. The error is logged in the console, but no visual feedback is shown to the shopper.
- **The "Total Wipeout":** Clearing all form inputs—including shipping name, billing address, and email—following a card failure. This forces the user to start the entire checkout from scratch, causing immediate abandonment.
- **The Defensive "Legalese" Alert:** Showing a scary raw error message like `Processor Response Code: 51 - Host Reject` which makes the site look broken, untrustworthy, or compromised.
- **The Top-of-Page Jump:** Showing the error at the top of a long checkout page, but leaving the user's viewport scrolled to the bottom near the CTA. The user clicks repeatedly, thinking the button is broken, while duplicate pre-authorizations accumulate on their bank account.
- **Missing Card Brand Validation:** Failing to validate card brand rules client-side (e.g., checking card length or Luhn algorithm) before submitting, leading to unnecessary processor roundtrips and high decline records.

---

## Validation Methods

- [ ] **Checkout Completion Rate (CCR) Lift:** Compare `(Completed Orders / Checkout Starts) * 100` before and after implementing the optimized decline flow. Target: **3% to 8%** relative increase in total completed orders.
- [ ] **Declined User Recovery Rate:** Track the percentage of users who experience a decline event but successfully complete their purchase within the same session. Target: **>25% recovery rate**.
- [ ] **Form Fields Re-entry Time:** Use session recording tools to measure the time spent correcting payment errors. Target: **under 15 seconds** average correction time.
- [ ] **Customer Support Tickets:** Monitor support logs for payment-related tickets. Target: **>30% reduction** in "declined card" support volume.
- [ ] **Fallback Payment Adoption Rate:** Measure the share of recovered transactions completed via alternative payment options (PayPal, BNPL, Apple Pay) specifically following a credit card decline event.
