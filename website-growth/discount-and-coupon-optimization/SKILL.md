---
name: discount-and-coupon-optimization
description:
  Audit and optimize the strategy, mechanics, and UI/UX of promotional
  discounts to increase conversion and AOV while reducing "coupon-hunt"
  abandonment and margin erosion.
---

# Discount and Coupon Strategy Optimization

## Purpose

The Discount and Coupon Strategy Optimization skill provides a systematic
framework for managing promotional incentives. Discounts are a powerful but
dangerous growth lever; if poorly implemented, they can train users to never pay
full price, erode profit margins, and increase cart abandonment through "coupon
hunting." This skill focuses on moving from generic, broad-based discounting to
targeted, behavior-driven incentives that maximize Revenue Per Visitor (RPV) and
customer loyalty.

## Use Cases

- **Cart Abandonment Recovery:** Using time-sensitive or "exit-intent" discounts
  to save a sale.
- **Average Order Value (AOV) Growth:** Implementing tiered discounts (e.g.,
  "Spend $100, save $20") to encourage larger baskets.
- **New Customer Acquisition:** Optimizing the "First Purchase" welcome offer
  to lower the barrier to entry.
- **Seasonal & Flash Sales:** Managing high-velocity promotional windows
  without technical or UX friction.
- **Re-engagement:** Reactivating dormant customers with personalized, high-
  value incentives.

## When NOT to Use

- **Premium/Luxury Positioning:** Where frequent discounting devalues the brand
  equity and exclusivity.
- **Low-Margin Commodities:** Where the profit margin is too thin to sustain
  meaningful price reductions.
- **Technical Bug Fixing:** This skill focuses on *strategy* and *UI/UX*; for
  fixing broken discount code logic in the backend, refer to platform
  documentation.
- **Subscription Pricing Changes:** For structural changes to SaaS tiers, use
  `pricing-page-optimization`.

## Inputs

1. **Margin Analysis:** Understanding the "Floor Price" for key products or
   categories to avoid selling at a loss.
2. **Current Discount Performance:** Redemption rates, AOV for discounted vs.
   non-discounted orders, and discount-to-revenue ratio.
3. **Cart Abandonment Data:** Specifically identifying drop-offs at the
   "Coupon/Promo Code" step in the checkout.
4. **Competitor Promotion Benchmarks:** How frequently and deeply do competitors
   discount?
5. **Technical Capabilities:** Does the platform support auto-apply logic,
   unique codes, or tiered cart rules?

## Outputs

1. **Discount Strategy Matrix:** A map of which offers to trigger for which
   user segments at specific funnel stages.
2. **Optimized Checkout UI Specs:** Guidance on the placement and visibility of
   the coupon field to reduce "hunting" behavior.
3. **Tiered Offer Logic:** Specifications for "Spend More, Save More"
   promotions.
4. **Incentive Copy & Messaging:** Benefit-driven copy for banners, modals, and
   cart notices.

## Workflow

### 1. The Margin & Intent Audit

Before offering a discount, determine the goal.
- **Goal: Acquisition?** Use a high-visibility welcome offer.
- **Goal: AOV?** Use tiered thresholds (e.g., "Free shipping at $50, $10 off at
  $100").
- **Goal: Clearance?** Use deep, category-specific discounts.
Audit margins to ensure the discount doesn't result in negative contribution
margin after shipping and acquisition costs.

### 2. Optimize the "Coupon Hunt" UX

The most common error is a high-contrast "Enter Promo Code" box that prompts
users to leave the site to search for a code.
- **Auto-Apply Logic:** Whenever possible, apply the discount automatically
  via URL parameters or cart rules so the user never sees a code box.
- **Visual Subordination:** If a field is necessary, make it a text link (e.g.,
  "Have a code?") rather than a prominent input box.
- **Internal Sourcing:** If a user clicks the code box, show "Current Offers"
  directly in a small dropdown to keep them on the site.

### 3. Design Tiered Incentives (AOV Boosters)

Move from flat % discounts to "Progressive Value" offers.
- Calculate your current AOV.
- Set the first discount tier at 15-20% above the current AOV.
- Example: If AOV is $60, offer "$10 off orders over $75."

### 4. Implement Behavior-Based Triggers

Trigger the discount at the moment of highest hesitation.
- **Exit Intent:** Show a "Wait! Take 10% off if you finish your order now"
  modal when the user moves their mouse toward the browser tab/close button.
- **Cart-Idle:** If a user stays on the cart page for >60 seconds without
  action, trigger a small "Need help? Here's a one-time code" prompt.

### 5. Review Against Decision Rules

Verify that the promotion is profitable, clear, and non-distracting.

## Decision Rules

- **The "Auto-Apply" Priority:** If a discount is advertised in an ad or email,
  it MUST be auto-applied in the cart. Never force the user to copy-paste.
- **Threshold Rule:** Discounts should ideally be tied to an action that
  benefits the business (e.g., "Sign up for SMS," "Spend $X," "Buy 2+").
- **Transparency:** Show the "Savings" clearly in the cart subtotal as soon as
  the discount is applied.
- **Specificity > Generality:** "Save $20" often performs better than "20% Off"
  for higher-priced items (over $100), while % often wins for lower-priced
  items.

## Constraints

- **Margin Data Required:** Discount depth and stacking rules cannot be
  recommended responsibly without floor-price and margin data; guessing at
  profitability risks negative-margin orders.
- **Platform Capability:** Auto-apply logic depends on the cart/checkout
  platform supporting URL-parameter or rule-based discounting. Legacy
  platforms may force a manual code-entry field.
- **Brand Positioning:** Discount frequency and depth must stay within
  limits the brand's premium/luxury positioning can absorb — see When NOT
  to Use.

## Non-Goals

- Does not design loyalty or points-based retention programs — those are a
  separate structural mechanic outside this skill's scope.
- Does not cover subscription tier or SaaS pricing structure — see
  `pricing-page-optimization`.
- Does not address backend fraud prevention, discount-code generation, or
  rule-engine implementation; it covers strategy and on-site UX only.

## Common Failure Patterns

- **The "Coupon Hunt" Prompt:** A giant, empty box in the checkout that sends
  users to Google to find a code, where they often find a competitor instead.
- **Stacking Errors:** Allowing multiple deep discounts to stack, resulting in
  unprofitable orders.
- **Invisible Discounts:** Applying a discount but not clearly showing the
  "Old Price" vs "New Price" and total savings.
- **Over-Discounting:** Training customers to wait for a 30% off sale before
  ever buying.
- **Complex Requirements:** "Buy 3 items from Category A and 1 from Category B
  to save 10% on the cheapest item" is too complex for users to calculate.

## Validation Criteria

- [ ] **Cart Abandonment Rate:** Monitor if hiding the promo code box or using
  auto-apply reduces abandonment.
- [ ] **Average Order Value (AOV):** Measure the impact of tiered discounting
  vs. flat discounts.
- [ ] **Discount-to-Revenue Ratio:** (Total Discount Amount / Total Gross
  Revenue). Target: Keep within defined margin limits.
- [ ] **Revenue Per Visitor (RPV):** The ultimate metric to ensure the discount
  is driving more total money, not just more orders.
