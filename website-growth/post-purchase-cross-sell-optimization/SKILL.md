---
name: post-purchase-cross-sell-optimization
description:
  Audit and optimize post-purchase cross-sells, one-click upsells, and
  thank-you page offer flows to increase Average Order Value (AOV), elevate
  post-purchase take rates, and maximize Customer Lifetime Value (LTV) without
  introducing pre-purchase checkout friction.
---

# Post-Purchase Cross-Sell & Upsell Optimization

## Purpose

The Post-Purchase Cross-Sell & Upsell Optimization skill provides a systematic framework for offering relevant, high-margin add-ons, warranties, complementary accessories, or subscription upgrades *after* the initial purchase payment authorization has succeeded—either via interstitial post-checkout 1-click upsell screens or on the order confirmation ("Thank You") page.

Unlike pre-purchase upsells or checkout cart bumps which add friction to the primary conversion decision, post-purchase cross-sells capture additional revenue when customer trust, buying intent, and cognitive commitment are at their absolute peak—without risking cart abandonment.

This skill guides the auditing, offer targeting, UI positioning, payment token reuse logic, and copy optimization required to elevate Average Order Value (AOV) and Post-Purchase Take Rate while preserving customer satisfaction.

## Use Cases

- **Direct-to-Consumer (DTC) E-commerce:** Presenting complementary accessories, extended warranties, or refills (e.g., shoe care kits after buying leather boots; extra filters after buying an air purifier) immediately after payment completion.
- **SaaS & Digital Products:** Offering annual billing upgrades, add-on user seats, premium support packages, or setup/onboarding services immediately following initial subscription checkout.
- **Event Ticketing & Travel:** Presenting VIP upgrades, parking passes, travel insurance, or event merchandise on the booking confirmation screen.
- **Subscription Services:** Offering single-purchase trial bundles or flavor sample packs to new subscribers post-checkout to increase immediate cart value.

## When NOT to Use

- **Pre-Purchase Cart Offers:** For offers presented inside the sliding cart drawer or pre-checkout cart page, use `upsell-cross-sell-optimization` or `cart-experience-optimization`.
- **Single-Checkbox Checkout Bumps:** For inline checkout payment form add-ons, use `checkout-order-bump-optimization`.
- **Order Retention & Cancellation Flows:** For retaining subscribers or customers attempting to cancel, use `subscription-cancel-flow-optimization`.
- **Primary Checkout Friction Fixing:** If the core checkout funnel has high drop-off or payment error rates, prioritize `checkout-flow-optimization` or `checkout-payment-decline-optimization` before adding post-purchase offers.

## Inputs

1. **Transaction & Basket Data:** Primary purchase SKUs, category affinities, basket total, payment gateway capability (support for Vaulting / Payment Intent token reuse / Payment Element 1-click charges).
2. **Current Confirmation Flow Assets:** Screenshots or screen recordings of the current order confirmation page, confirmation emails, and any existing post-purchase modals.
3. **Product Catalog Margin & Inventory Matrix:** High-margin accessories, consumables, protection plans, or digital add-ons available for cross-selling.
4. **Customer Segment Data:** New vs. returning buyers, subscription vs. one-time purchasers, traffic source (e.g., high-intent search vs. impulse paid social).

## Outputs

1. **Post-Purchase Offer Matrix:** SKU-level or category-level affinity mapping defining which post-purchase offer triggers for specific primary cart combinations.
2. **Post-Checkout 1-Click Interstitial Flow Blueprint:** UX specification for 1-click post-purchase offer pages inserted between payment completion and final order confirmation.
3. **Order Confirmation Page Offer Block Specification:** Layout, copy, and interaction specs for dynamic "Add to Existing Order" components on the Thank You page.
4. **Payment Tokenization & Order Editing Rules:** Technical requirements for handling payment vaulting, order modification time windows (e.g., 15-minute order editing window), and batch fulfillment grouping.

## Workflow

### 1. Audit Current Confirmation Flow & Payment Capabilities

Examine the post-payment journey and infrastructure:
- **Payment Gateway Audit:** Confirm whether the payment processor (e.g., Stripe, Shopify Payments, Adyen) supports tokenized card vaulting or zero-friction 1-click order modification post-authorization.
- **Flow Mapping:** Map the current post-payment sequence (Payment Submit -> [Post-Purchase Interstitial] -> Order Confirmation Page -> Confirmation Email).
- **Baseline Metric Capture:** Record baseline AOV, primary checkout conversion rate, refund/cancellation rate, and customer support ticket rates.

### 2. Construct the Post-Purchase Offer Hierarchy

Define a prioritized 2-tiered post-purchase structure:
- **Tier 1: Post-Checkout 1-Click Interstitial (Max 1-2 Offers):**
  - Appears immediately *after* the initial payment authorization succeeds, *before* reaching the Thank You page.
  - Features a single, hyper-relevant item (e.g., "Add the matching protective case for 30% off").
  - Includes a prominent 1-click buy button (*"Yes! Add to My Order for $19"*) and an explicit decline button (*"No thanks, take me to my order confirmation"*).
  - Must NOT require re-entering credit card details or shipping addresses.
- **Tier 2: Order Confirmation Page (Thank You Page) Add-Ons:**
  - Embedded seamlessly within the order summary block on the final Thank You page.
  - Displays a 15-to-30-minute "Edit Order / Add Accessories" timer before fulfillment lock.
  - Enables adding consumables, mystery add-ons, or warranties with a single tap using saved checkout credentials.

### 3. Apply Behavioral & Copy Persuasion Rules

Structure the offer creative to match the buyer's psychological state post-purchase:
- **Acknowledge Primary Purchase Success:** State clearly that the main order is already confirmed (*"Order #12345 Confirmed! Exclusive One-Time Add-On Offer"*).
- **Anchor Against Main Purchase Price:** Offer add-ons priced at 10%-25% of the primary cart total. A $20 accessory feels negligible immediately after a $150 purchase.
- **Exclusivity & Single-Action Discount:** Frame the offer as a post-checkout exclusive discount not available elsewhere on the site (*"Special post-checkout price: $14 (Reg. $24). Ships in the same box!"*).
- **Frictionless Rejection Path:** Ensure the decline link is visible, clear, and non-manipulative. Avoid manipulative "confirm-shaming" copy (e.g., avoid *"No, I hate saving money"*).

### 4. Configure Order Management & Logistics Logic

Prevent customer support issues and fulfillment friction:
- **Order Merging Logic:** Ensure post-purchase add-ons are appended to the *original* order ID or created as a parent-child linked order to prevent duplicate shipping fees or separate packages.
- **Hold Window for Fulfillment:** Enforce a 15-30 minute fulfillment hold on the warehouse management system (WMS) or ERP to allow customers time to add post-purchase items before the picking label is generated.
- **Instant Order Summary Update:** Dynamically update the Thank You page order summary immediately when a post-purchase item is added.

### 5. Validate Against Decision Rules & Test

Verify compliance with safety, performance, and compliance rules prior to deployment.

## Decision Rules

- **The Zero-Payment-Friction Rule:** A true post-purchase offer must NEVER require re-entering payment or shipping information. If the gateway cannot process a 1-click charge using vaulted tokens, fall back to a "Reserve for Next Order" or single-click order update flow rather than asking for full checkout info again.
- **The Price Ratio Rule:** The price of the post-purchase cross-sell should not exceed 25%-30% of the primary order value. High-ticket offers post-checkout generate hesitation, confusion, or impulse buyer's remorse.
- **Max Interstitial Rule:** Limit post-checkout interstitial screens to a maximum of 1 step (or 2 downsell steps if declined). Never subject buyers to a frustrating multi-screen "upsell tunnel" of 3+ consecutive popups.
- **The "Ships Free Together" Rule:** Always emphasize that post-purchase add-ons ship in the same package with no additional shipping charge.
- **The Instant Confirmation Rule:** Always display an explicit order confirmation message at the top of the interstitial screen so the customer knows their original purchase is safe and complete.

## Constraints

- **Payment Gateway Tokenization Limitations:** Requires payment processors that support post-authorization charges, token vaulting, or order modification APIs (e.g., Stripe PaymentIntents, Shopify Post-Purchase Checkout Extensions).
- **3D Secure (3DS) / SCA Compliance:** In regions requiring Strong Customer Authentication (SCA/PSD2 in Europe), post-purchase charges exceeding initial authorization limits may trigger re-authentication. Mitigation strategies (such as pre-authorizing maximum limits or using merchant-initiated transaction exemptions) must be configured correctly.
- **Warehouse Fulfillment Speed:** Instant-fulfillment operations (e.g., automated digital delivery or same-minute label generation) must implement delay buffers so post-purchase additions can be merged into a single shipment.

## Non-Goals

- Does not cover pre-purchase cart drawer cross-sells or cart recommendations — see `upsell-cross-sell-optimization`.
- Does not cover inline single-checkbox payment form bumps — see `checkout-order-bump-optimization`.
- Does not cover post-purchase transactional email sequences or Win-Back email flows — see `post-conversion-momentum`.

## Common Failure Patterns

- **The Unclear Confirmation Trap:** Presenting an upsell interstitial without clearly confirming that the original order was successfully placed, causing anxious customers to close the browser or re-order.
- **The Multi-Step Upsell Tunnel:** Forcing customers through 3, 4, or 5 consecutive post-purchase upsell modals. This ruins brand trust, increases cancellation rates, and drives chargebacks.
- **Separate Shipping Fee Surprise:** Charging an extra shipping fee on the post-purchase add-on item, leading to immediate customer complaints and order cancellations.
- **Order Splitting & Duplicate Freight:** Creating two completely separate orders in the ERP, resulting in the customer receiving two separate boxes and paying double fulfillment costs.
- **Manipulative Confirm-Shaming Copy:** Using aggressive decline button text (e.g., *"No thanks, I prefer damaged equipment"*), which alienates high-value customers.

## Validation Criteria

- [ ] **Post-Purchase Take Rate:** Measure the percentage of buyers who accept a post-purchase offer. Target: 5% - 15% conversion rate on 1-click post-purchase offers.
- [ ] **Average Order Value (AOV) Lift:** Measure the net increase in total basket value across all orders. Target: 4% - 12% overall AOV increase.
- [ ] **Primary Order Cancellation / Refund Rate:** Verify that post-purchase offers do not increase initial order refunds or customer support tickets. Target: <0.5% change in refund rate.
- [ ] **Order Merging Accuracy:** Verify via test transactions that 100% of post-purchase additions are successfully merged into a single shipping label and parent order ID.
- [ ] **Mobile Touch Efficiency:** Ensure post-purchase interstitial CTA buttons feature at least 48px height touch targets and dismiss cleanly on iOS and Android viewports.
