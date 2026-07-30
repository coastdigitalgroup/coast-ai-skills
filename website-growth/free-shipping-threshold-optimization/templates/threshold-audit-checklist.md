# Free Shipping Threshold Audit & Calculator Template

This template provides a step-by-step mathematical workbook and a UX checklist to evaluate and optimize your store's free shipping threshold. Use it to determine if your current threshold is hurting conversion, subsidizing too many orders, or failing to drive average order value (AOV) growth.

---

## Part 1: Historical Data Workbook

Gather the following metrics for the last **30 to 90 days** from your e-commerce platform and analytics software.

### 1. Key Unit Economics Baseline
- **[A]** Total Store Revenue: $__________________
- **[B]** Total Number of Orders: __________________
- **[C]** Calculated Average Order Value (AOV) `[A / B]`: $__________________
- **[D]** Median Order Value (MOV): $__________________ *(The absolute middle value of all orders)*
- **[E]** Average Gross Profit Margin %: __________________% *(e.g., 60%)*
- **[F]** Average Cost of Shipping Paid by Merchant: $__________________ *(Actual carrier cost + fulfillment packaging)*
- **[G]** Current Free Shipping Threshold: $__________________
- **[H]** Standard Flat-Rate Shipping Fee: $__________________

---

## Part 2: Mathematical Optimization Calculator

Use the formulas below to model the impact of raising or lowering your free shipping threshold.

### Formula 1: Threshold Range Modeling
Historically, the optimal free shipping threshold lies between **15% and 30% above your baseline AOV or MOV**, depending on your product price points and catalog variety.

$$\text{Minimum Threshold Target} = \text{MOV} \times 1.15$$
$$\text{Maximum Threshold Target} = \text{AOV} \times 1.30$$

- **Your Minimum Target:** $__________________
- **Your Maximum Target:** $__________________
- **Ideal Rounded Consumer Threshold:** $__________________ *(e.g., if target is $46.50, choose $49.00 or $50.00)*

---

### Formula 2: The Two-Item Combination Check
List your top 3 selling hero products. Verify if a customer buying a single hero item automatically qualifies for free shipping. If they do, your threshold is too low and you are losing margin.

| Product Name | Product Price | Current Threshold | Does it qualify alone? (Y/N) | Recommended Threshold adjustment |
| :--- | :---: | :---: | :---: | :--- |
| *e.g., Hydrating Serum* | *$28.00* | *$35.00* | *No ($7.00 gap)* | *Keep. Encourage $10 accessory add-on.* |
| *e.g., Premium Silk Pillow* | *$55.00* | *$35.00* | *Yes* | *Increase threshold to $75.00 to force 2nd item.* |
| 1. __________________ | $_________ | $_________ | [  ] Yes  [  ] No | _____________________________________________ |
| 2. __________________ | $_________ | $_________ | [  ] Yes  [  ] No | _____________________________________________ |
| 3. __________________ | $_________ | $_________ | [  ] Yes  [  ] No | _____________________________________________ |

---

### Formula 3: Net Profit Delta Projection
Calculate if the profit margin gained from pushing a customer to buy an additional item outweighs the shipping fee absorbed by your business.

**Scenario Parameters:**
- **Current Average Order (No free shipping):** $30.00 (Customer pays shipping)
- **Proposed Threshold Order (Free shipping):** $50.00 (Merchant absorbs shipping)
- **Gross Profit Margin:** 60%
- **Average Merchant Shipping Cost:** $6.50

$$\text{Gross Profit on Old Order} = \$30.00 \times 0.60 = \$18.00$$
$$\text{Gross Profit on New Order} = \$50.00 \times 0.60 = \$30.00$$
$$\text{Net Margin on New Order} = \text{Gross Profit on New Order} - \text{Shipping Absorbed} = \$30.00 - \$6.50 = \$23.50$$
$$\text{Net Profit Gain per Order} = \text{Net Margin on New Order} - \text{Gross Profit on Old Order} = \$23.50 - \$18.00 = +\$5.50$$

*Result: Pushing the user to the $50 threshold yields an extra **$5.50 in net cash profit** per transaction compared to the $30 order, fully validating the strategy.*

---

## Part 3: UX & Behavioral Design Audit Checklist

Evaluate your site's current shipping threshold presentation against this 15-point diagnostic checklist.

### 1. Site-Wide Visibility (Top-of-Funnel)
- [ ] **Announcement Bar Active:** Is the current shipping threshold prominently promoted in a dedicated sitewide banner above the main header?
- [ ] **Contrast Verification:** Does the announcement bar background color contrast highly with the primary header so that it captures attention instantly?
- [ ] **Clear Flat-Rate Anchor:** Is the flat-rate shipping fee clearly communicated (e.g., "or $5.95 flat-rate") so users can immediately anchor the alternative cost?
- [ ] **No Hidden Fees:** Is it clear that there are no hidden handling fees or surcharges added to shipping at checkout?

### 2. Micro-Incentives & Product Pages (Mid-Funnel)
- [ ] **PDP Proximity Messaging:** On the Product Detail Page (PDP), is there copy near the "Add to Cart" button indicating how much closer this product gets them to free shipping?
- [ ] **Sub-Threshold Warning:** If a product is priced just below the threshold, is there an explicit warning? (e.g., "Add a $5 accessory to get free shipping!").
- [ ] **Clear Eligibility Tags:** Are eligible items clearly tagged on collection pages (e.g., "Ships Free" or "Eligible for Free Shipping")?

### 3. Cart & Progress Loop Optimization (Bottom-of-Funnel)
- [ ] **Dynamic Goal-Gradient Bar:** Does the slide-out/drawer cart contain an interactive, animated progress bar?
- [ ] **Active Calculation Copy:** Does the cart explicitly state the remaining amount needed? (e.g., "You are only $12.50 away from FREE Shipping!" rather than leaving the user to subtract the subtotal from the threshold).
- [ ] **Instant Micro-Add-Ons ("Gap-Fillers"):** Are there 2–3 low-cost, high-margin accessories visible directly inside the cart drawer?
- [ ] **One-Click Quick Add:** Can these gap-fillers be added to the cart with a single click without refreshing the page or redirecting the user?
- [ ] **Achievement Celebration:** When the threshold is reached, does the UI provide immediate visual reinforcement? (e.g., a green progress bar and a "🎉 You've unlocked FREE shipping!" message).

### 4. Checkout Integrity & Safeguards
- [ ] **Pre-checkout Calculation:** Are taxes and estimated shipping calculated and visible *within the cart* before entering the checkout funnel?
- [ ] **Coupon and Discount Safeguards:** If a discount code is applied at checkout that drops the subtotal *below* the threshold, does the system clearly prompt the user to add another item to restore free shipping?
- [ ] **Persistent Option Selection:** Is the "Free Standard Shipping" option pre-selected as the default option on the checkout shipping page?
- [ ] **No "Clear Cart" Risks:** Does adjusting quantities or deleting items inside the cart dynamically update the progress bar instantly without breaking the page state?
