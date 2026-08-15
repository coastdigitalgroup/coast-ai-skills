---
name: trial-to-paid-optimization
description:
  Audit and optimize the transition from free trials or freemium tiers to paid
  subscriptions. Trigger this skill when trial-to-paid conversion rates are low
  or when users drop off immediately after a trial expires.
---

# Trial-to-Paid Optimization

## Purpose

The Trial-to-Paid Optimization skill provides a systematic framework for
converting free users into paying customers. While `user-onboarding-optimization`
focuses on the initial "Aha! Moment," this skill focuses on the "Paywall Moment."
It optimizes the timing, messaging, and incentives used to bridge the gap
between experiencing value and committing to a purchase. By refining feature
gating, expiration triggers, and upgrade prompts, this skill directly improves
Trial-to-Paid Conversion Rate (TPCR) and Customer Acquisition Cost (CAC)
efficiency.

## Use Cases

- **SaaS Platforms:** Optimizing the end-of-trial sequence for time-bound or
  usage-bound trials.
- **Freemium Models:** Identifying and optimizing the "Upgrade Triggers" that
  move users from free to premium tiers.
- **Mobile Apps:** Refining the paywall experience and subscription prompts
  within a trial period.
- **Credit Card Up-front Trials:** Reducing churn at the moment the first
  billing cycle occurs.

## When NOT to Use

- **Top-of-Funnel Lead Gen:** Use `lead-magnet-optimization` or
  `lead-capture-form-optimization` for capturing initial interest.
- **Initial User Activation:** If users aren't reaching the "Aha! Moment,"
  optimize onboarding first using `user-onboarding-optimization`.
- **Pure E-commerce:** For one-time purchases, use `checkout-flow-optimization`.
- **Enterprise Sales:** For high-touch sales cycles involving manual contracts,
  focus on `conversational-conversion-optimization`.

## Inputs

1. **Trial Model Details:** Is the trial time-based (e.g., 14 days), usage-based
   (e.g., 100 credits), or feature-based (Freemium)?
2. **Conversion Analytics:** Trial-to-paid conversion rate, drop-off points
   during the trial, and most common upgrade triggers.
3. **User Behavior Data:** Which features are used most by users who *do*
   convert vs. those who don't?
4. **Current Upgrade UI:** Screenshots of paywalls, upgrade buttons, and
   expiration notifications.

## Outputs

1. **Upgrade Friction Audit:** Identification of technical barriers or
   psychological "cliff edges" in the transition.
2. **Optimized Trigger Map:** A plan for when and how to prompt users to
   upgrade based on time and usage.
3. **Paywall & Copy Refinements:** Specific improvements to the upgrade
   interface, focusing on benefit-driven "Value Overlap."
4. **Incentive & Scarcity Strategy:** Recommendations for "Early Bird" upgrades
   or "Trial Extension" offers.

## Workflow

### 1. Identify "Value Gaps" and "Wall Types"

Audit how the "Paywall" is currently presented:
- **Hard Wall:** Total lockout after the trial ends.
- **Soft Wall:** Usage limits reached (e.g., "You've used 4 of 5 reports").
- **Feature Wall:** Clicking a "Pro" feature triggers an upgrade prompt.
Determine which features are currently gated and if they represent "Core Value"
(required for the Aha! moment) vs. "Expansion Value" (worth paying for).

### 2. Optimize the "Expiration Narrative"

Move from "Your trial is over" to "Don't lose your progress."
- **The Countdown:** Implement a persistent but non-intrusive countdown or
  status bar showing trial days/usage remaining.
- **The Warning Sequence:** Send/show notifications at 3 days, 1 day, and 0
  hours left.
- **Loss Aversion:** Frame the upgrade as a way to "Keep your data" or
  "Maintain your momentum."

### 3. Design Contextual Upgrade Triggers

Don't wait for the trial to end to ask for the sale.
- **"Just-in-Time" Prompts:** Show an upgrade option the moment a user
  encounters a gated feature or reaches 80% of a usage limit.
- **The "Value Recap":** Show the user a summary of what they've achieved during
  the trial (e.g., "You saved 12 hours this week with Automations. Upgrade to
  keep saving time").

### 4. Refine the Paywall UI

Optimize the "Upgrade Page" or modal.
- **The Plan Comparison:** Clearly show the delta between the "Free/Trial"
  state and the "Paid" state.
- **Frictionless Transition:** If you already have their info (from signup),
  ensure the upgrade process requires minimal additional steps.
- **Risk Reversal:** Reiterate "Cancel anytime" or "Money-back guarantee" at
   the moment of purchase.

### 5. Review Against Decision Rules

Verify the proposed strategy against the conversion heuristics below.

## Decision Rules

- **Don't Gate the "Aha!":** Ensure users can reach the core value of the
  product *before* being forced to pay. Gating the primary value too early kills
  activation.
- **The 80% Rule:** Start the "Upgrade Conversation" when a user has consumed
  80% of their trial time or usage limit.
- **Contextual Pricing:** If a user clicks a specific "Pro" feature, the
  paywall should highlight *that specific feature* as the primary reason to
  upgrade.
- **The "Grace Period":** Offer a 24-48 hour grace period or a one-time "Trial
  Extension" in exchange for a survey or profile completion to recover
  fence-sitters.

## Constraints

- **Billing System Integration:** Upgrade flows are constrained by the
  capabilities of the billing provider (Stripe, Chargebee, etc.).
- **Subscription Transparency:** You must clearly state billing frequency,
  renewal terms, and cancellation policies to comply with legal requirements.
- **Data Retention:** Clear communication is required regarding what happens to
  user data if they choose *not* to upgrade.

## Non-Goals

- Does not optimize initial user activation or the "Aha! Moment" — see
  `user-onboarding-optimization`.
- Does not cover one-time e-commerce checkout flows — see
  `checkout-flow-optimization`.
- Does not address enterprise/high-touch sales cycles with manual contracts
  — see `conversational-conversion-optimization`.

## Common Failure Patterns

- **The "Paywall Cliff":** Providing no warning that a trial is ending,
  leading to a sudden lockout and user frustration.
- **Gating the Core Value:** Making it impossible for a user to see the product
  work without paying first.
- **Vague Benefit:** Saying "Upgrade to Pro" without explaining the specific
  outcome the user will get.
- **Too Many Choices:** Presenting a complex 5-tier pricing table at the
  moment of upgrade. Keep the "Upgrade Path" simple.

## Validation Criteria

- [ ] **Trial-to-Paid Conversion Rate (TPCR):** (Paid Conversions / Total Trials)
  * 100. Target: 5-15% lift.
- [ ] **Time-to-Upgrade:** Measure if users are upgrading *earlier* in the trial
  period.
- [ ] **Expansion Revenue:** Measure if contextual triggers lead to more users
  picking higher-tier plans.
- [ ] **Trial Extension Completion:** If offered, measure how many users who
  extend their trial eventually convert to paid.
