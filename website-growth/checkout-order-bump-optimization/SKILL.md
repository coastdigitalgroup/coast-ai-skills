---
name: checkout-order-bump-optimization
description:
  Audit and optimize checkout order bumps to increase Average Order Value (AOV)
  with highly-targeted, single-checkbox impulse offers directly on the checkout page.
  Trigger this skill when checkout-to-purchase conversion is healthy, but cart-level
  Average Order Value and initial transaction profitability are low.
---

# Checkout Order Bump Optimization

## Purpose

The Checkout Order Bump Optimization skill provides a systematic framework for auditing, selecting, positioning, styling, and writing checkout-level "order bumps" (also known as point-of-sale impulse offers). An order bump is a highly targeted, low-friction, and low-cost complementary offer presented on the final checkout page that users can add to their order with a single checkbox click before completing the transaction.

By utilizing cognitive heuristics such as micro-commitments, choice framing, and low-friction checkout, this skill aims to maximize Average Order Value (AOV) and initial transaction margin without hurting primary checkout conversion rates.

---

## Use Cases

- **E-Commerce and D2C Brands:** Introducing small, low-risk, high-margin physical add-ons (e.g., priority shipping, extended warranty, product care kits, mystery gifts, or accessory items) during checkout.
- **SaaS and Digital Products:** Offering low-ticket digital add-ons (e.g., premium setup assistance, templates, exclusive video training, PDF cheat sheets, or priority customer support) on the payment page.
- **Service Providers:** Introducing fast-track options, insurance, or minor service extensions (e.g., white-glove assembly, zero-liability waiver) directly on the booking or deposit form.
- **Funnel Optimization Audits:** Identifying and rectifying leaky checkouts where previous complex cross-sell efforts (e.g., intrusive interstitials or multi-step redirects) caused checkout abandonment.

---

## When NOT to Use

- **High-Friction Checkout Environments:** If the baseline checkout-to-purchase completion rate is poor (below industry average or declining), adding an order bump will introduce unnecessary distraction. Resolve core `checkout-flow-optimization` issues first.
- **Complex, Configurable Products:** Do not use order bumps for options that require complex decisions, configurations, size selections, color configurations, or high-touch cognitive consideration (e.g., choosing a laptop RAM size or picking custom furniture fabrics).
- **High-Ticket Offers:** Order bumps must be impulse purchases. Do not offer items priced above 25-30% of the main cart value, as this causes buyer's remorse or hesitation, resulting in cart abandonment.
- **Subscription-Only Portals with Strict Anti-Churn Regulations:** If introducing a recurring service bump, avoid checkouts where local regulations require explicit multi-checkbox/separate opt-in disclosures that would overload the viewport.

---

## Inputs

1. **Cart Metrics:** Baseline checkout completion rate, Average Order Value (AOV), typical cart composition, and profit margin per product.
2. **Product Catalog & Margin Profiles:** A list of potential low-friction, high-margin add-ons, accessory products, or digital assets that could serve as bumps.
3. **Checkout Layout Specs:** The exact structure, viewport layouts (desktop vs. mobile), step sequence, and DOM structure of the current checkout flow (e.g., single-page checkout vs. multi-step checkout).
4. **Target Customer Archetype:** The primary customer motivations, potential purchase anxieties, and accessory needs (e.g., "Buying a expensive lens -> Anxiety about scratching -> Offer lens protection filter").

---

## Outputs

1. **Order Bump Audit & Recommendation Matrix:** Identification of optimal placement, price points, and item types matched to the current cart.
2. **Copywriting Sheet:** Headlines, persuasive microcopy (limited to 2-3 sentences), value-framing callouts, and benefit-driven checkbox labels.
3. **UX & Layout Specification:** Exact visual guidelines (container borders, background contrasts, accent icons, checkbox sizing, mobile responsive stacking order) to ensure the bump remains high-visibility but non-intrusive.
4. **A/B Testing Framework:** Clear hypotheses, test variations, and success metrics for validating the impact of the order bump on checkout conversion and AOV.

---

## Workflow

### 1. Match the Offer to Cart Intent (The "Perfect Companion")
To prevent decision paralysis or checkout distraction, select an order bump that requires near-zero cognitive friction:
- **No-Brainer Utility:** Batteries for electronic devices, a cleaning kit for shoes, lens filters for cameras, or screen protectors for phones.
- **Risk Reversal/Peace of Mind:** Lifetime warranty, shipping insurance (theft/loss protection), premium returns protection, or priority support.
- **Speed & Convenience:** Rush processing, priority shipping dispatch, pre-assembled setup, or VIP fast-track onboarding.
- **Digital Accoutrement:** Interactive worksheets, pre-made templates, a short audio course companion, or quick-start PDF manuals.

### 2. Establish the Perfect Pricing Formula
The order bump must be framed as a minor "add-on" or an impulse impulse-buy rather than a major purchase:
- **The 25% Threshold:** The bump price should ideally be less than 25% (or max 30%) of the average primary cart value. For instance, if the average cart value is $100, the order bump should be priced between $9.95 and $24.95.
- **Psychological Price Points:** Use price ending in `.95` or `.00` to denote value, or frame it as a massive discount off the standalone retail price (e.g., "Add for only $9.00 — regularly $29").
- **Margin Priority:** Prioritize items with high gross margins (digital products, warranties, priority handling) to ensure high net revenue capture from the bump.

### 3. Engineer High-Contrast Visual Hierarchy
Position the order bump where the user is already focusing, but do not let it block the primary checkout CTAs:
- **Placement Hotspots:**
  - *Primary Recommendation:* Place the order bump box immediately above the final "Place Order" or "Complete Purchase" CTA.
  - *Secondary Recommendation:* Place it directly within the order summary sidebar, right next to the subtotal calculations.
- **The "Attention Box" styling:**
  - Wrap the bump in a dashed or dotted border (commonly styled in a warm accent color like orange, red, or brand-accented violet) to make it stand out as a "special offer box."
  - Give it a light, warm background fill (such as `#FFFDF5` yellow-tint or `#FAFAFA` light gray) to separate it visually from the rest of the form.
  - Include an eye-catching, high-contrast icon or badge (e.g., a small "🔥 Hot Offer" or "🎁 Special Add-on" badge).
- **Single-Tap Addition:** Ensure clicking anywhere on the order bump container (or the large, tap-optimized checkbox) instantly adds the item to the cart summary without page reloads.

### 4. Write High-Impact, Minimalist Copy
You have only a small box (approx. 250px–400px wide) to persuade the customer. Write copy that fits the following strict layout:
- **Attention Grabber (Headline):** A bold, benefit-focused hook. (e.g., *"Yes, Add Shipping Protection for $2.95"* or *"Upgrade to Lifetime Warranty for just $9.95"*).
- **The Context/Benefit Statement (1-2 sentences):** Explains exactly what they get and why they need it *now*. Avoid fluff. (e.g., *"Protect your shipment against loss, theft, or damage during transit. We will immediately ship out a replacement if anything happens."*).
- **The Exclusive Frame:** Highlight that this offer is *only* available at this exact checkout screen. (e.g., *"One-time offer: This price is not available anywhere else on our site."*).
- **The Action-Oriented Checkbox Label:** Explicitly state the price and the action. (e.g., *"Add to order for $4.95"*).

### 5. Seamless Technical Integration
The bump must act as a seamless extension of the form:
- **No Page Reloads:** Use AJAX/fetch to update the order totals, taxes, and shipping fees dynamically in the DOM within 200ms of clicking the checkbox.
- **Single Action Checkout:** The checkout form submission should submit *both* the main cart and the checked order bump in a single payload. Do not require a secondary checkout button or multi-step modal prompts.
- **Auto-Opt-Out Default:** The order bump must be unchecked by default. Force-checking the bump (pre-checking) is a dark pattern that erodes customer trust and increases chargebacks/support requests.

---

## Decision Rules

- **The Goldilocks Price Rule:**
  - If AOV is < $30: Offer a digital upgrade, shipping insurance, or minor accessory priced between $2.99 and $7.99.
  - If AOV is $30 – $100: Offer an accessory, care kit, or warranty priced between $9.95 and $19.95.
  - If AOV is > $100: Offer a premium accessory, protection plan, or priority assembly priced between $19.95 and $39.95.
- **Digital vs. Physical Bumps:**
  - If selling physical items: Prioritize shipping insurance/warranties (high margin, zero logistics friction) or physical care/accessory items (highly contextual).
  - If selling SaaS/services: Prioritize templates, expedited setup, training content, or VIP priority support.
- **Visual Stacking (Mobile vs. Desktop):**
  - On desktop, if the page has a two-column layout (form on left, order summary on right), place the order bump immediately above the final CTA on the left column.
  - On mobile, where the layout stacks vertically, place the order bump directly beneath the shipping form and above the "Payment Info" block to ensure it is encountered before billing details are submitted.

---

## Constraints

- **Single Checkbox Only:** The order bump must be activated by a single checkbox click. No dropdowns, no quantity selectors, and no field inputs allowed inside the order bump container.
- **No Pre-Checking (Consent First):** The checkbox must be unchecked by default. Pre-checked order bumps represent a deceptive design pattern and violate regulations in several global jurisdictions (e.g., GDPR, CCPA).
- **Zero Checkout Latency:** The update of the price summary must happen instantly via client-side javascript without blocking or freezing the user's interface.

---

## Non-Goals

- Optimizing the entire multi-step billing or shipping field forms (covered under `checkout-flow-optimization`).
- Configuring backend subscription billing platforms, merchant processing agreements, or payment gateways.
- Building off-page email or SMS remarketing flows (covered under other growth skills).

---

## Common Failure Patterns

- **The Deceptive Pre-Check (Deceptive Design):** Pre-checking the bump checkbox. While this might briefly increase the initial "take rate," it drastically increases customer support tickets, refund requests, chargeback risks, and drops overall brand trust.
- **The Information Overload Box:** Adding a long description, multiple product images, or dropdown menus inside the order bump box. This creates choice paralysis, increases cognitive load, and slows down the checkout, tanking total conversion.
- **Mismatched Context:** Offering a generic add-on that has zero relevance to the cart. For example, offering a water bottle order bump on a website checkout for custom accounting software.
- **Flickering/Laggy DOM Updates:** When checking the bump box causes the page to lag, flicker, or scroll-jump, making the user nervous about the security or stability of the payment form.

---

## Validation Criteria

### 1. Primary Metrics (The Growth KPI)
- **Order Bump Take Rate (%):** Calculate as `(Orders containing checkout bump / Total checkout orders) * 100`. Target benchmark: **10% to 35%** depending on the vertical and pricing.
- **Average Order Value (AOV) Lift:** Compare the AOV of transactions with the order bump active vs. the historical AOV. Target: **3% to 15% increase**.
- **Net Margin Lift:** Ensure that the increased revenue from the order bump (especially if digital/warranty-based) translates directly to high-margin profitability.

### 2. Guardrail Metrics (The Safety Net)
- **Primary Checkout Completion Rate:** Monitor the overall checkout completion rate (Cart-to-Purchase conversion) to ensure the presence of the order bump did not introduce friction or drop overall purchases by even 0.5%.
- **Refund & Chargeback Rates:** Monitor refund requests specifically for the order bump item over the subsequent 30 days to verify that users did not feel tricked or suffer from buyer's remorse.
