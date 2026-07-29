# Free Shipping Threshold Audit Checklist & Calculator

This reusable template is designed to help e-commerce store owners, marketers, and growth engineers audit their current shipping policies, calculate a profit-optimized free shipping threshold, and draft high-converting UI specifications.

---

## Part 1: On-Site Shipping UX Audit Checklist

Use this checklist to identify friction points and conversion killers in your current customer shopping journey.

### 1. Above-The-Fold Visibility & Discovery
- [ ] **Global Header Banner:** Is there a sitewide announcement bar communicating the shipping offer?
- [ ] **Mobile Announcement Bar:** Is the announcement bar readable on mobile without taking up more than 10% of the vertical viewport?
- [ ] **PDP Proximity:** Is the shipping offer displayed near the "Add to Cart" button on Product Detail Pages?
- [ ] **Footer Disclosure:** Is the full shipping policy (including shipping speeds, carriers, and international rules) linked in the global footer?

### 2. Shopping Cart Experience (The Bridge)
- [ ] **Free Shipping Progress Bar:** Does the slide-out cart or shopping bag display a dynamic progress bar showing how close the user is to free shipping?
- [ ] **Dynamic "Remaining Value" Copy:** Does the cart copy update in real-time (e.g., *"You are only $12.50 away from free shipping!"*) rather than showing a static message?
- [ ] **One-Click Cart-Fillers:** Are there low-cost, high-margin items (under $15) recommended directly inside the cart drawer?
- [ ] **Variant Pre-Selection:** Can recommended cart-fillers be added with one-click without forcing the user to navigate away or select sizes/colors in a modal?

### 3. Last-Mile Checkout Experience
- [ ] **Guest-Checkout Retained:** Does free shipping apply equally to guest checkouts and registered accounts?
- [ ] **Dynamic Discount Handling:** If a coupon code drops the subtotal below the free shipping threshold, does the system clearly warn the user before they proceed to payment?
- [ ] **No Hidden Surcharges:** Are heavy/oversized item shipping surcharges clearly stated on the PDP, rather than appearing unexpectedly at checkout?
- [ ] **Estimated Delivery Dates:** Are actual delivery dates shown (e.g., *"Arrives Friday, Nov 10"*) instead of raw shipping windows (e.g., *"Standard Shipping 3-5 days"*)?

---

## Part 2: Shipping Threshold Calculation Worksheet

Follow these steps and fill in your store's data to calculate a margin-safe, mathematically optimized shipping threshold.

### 1. Data Collection
Identify the following baseline metrics (use past 90 days of store data):

| Variable | Metric Name | Your Store's Value |
| :--- | :--- | :--- |
| **A** | Average Order Value (AOV) | $ __________________ |
| **M** | Median Order Value (MOV) | $ __________________ |
| **C** | Average Outbound Shipping Cost (Carrier Cost) | $ __________________ |
| **G** | Average Gross Margin % (excl. shipping) | __________________ % |
| **P** | Average Price per Product | $ __________________ |

### 2. Optimal Threshold Formula ($T_{opt}$)
Choose the threshold stretch multiplier (typically 15% to 20% over AOV or MOV):

* **Standard Multiplier Option:** $A \times 1.15$ to $1.20$
* **High-Friction Option (for low-ticket stores):** $M + P$ (Median + Price of one average item)

```text
Threshold Estimate 1 = [Your AOV] $ _________ × 1.15 = $ _________
Threshold Estimate 2 = [Your AOV] $ _________ × 1.20 = $ _________

Rounded Psychological Anchor (Choose $49, $50, $75, $99, etc.):
Proposed Threshold (T_opt) = $ __________________
```

### 3. Margin Safety Verification
Verify that the profit from the additional items added to the cart will exceed the cost of absorbing the shipping charge.

```text
1. Incremental Cart Value (ICV) = T_opt - AOV
   ICV = $ __________ - $ __________ = $ __________

2. Incremental Gross Margin = ICV × Gross Margin %
   Incremental Margin = $ __________ × [ % as decimal] = $ __________

3. Compare to Carrier Cost:
   Is [Incremental Gross Margin] > [Average Outbound Shipping Cost (C)]?
   $ __________  >  $ __________
```

* **Decision:**
  * **YES:** Your proposed threshold is **MARGIN-SAFE**. Proceed to implementation.
  * **NO:** Your proposed threshold is too low, or your average shipping costs are too high. Increase the threshold or negotiate better carrier rates before proceeding.

---

## Part 3: On-Site UI/UX Copy Specifications

Copy and paste this template to define exact copy strings for your engineering team.

### 1. Announcement Bar Copy (Sitewide Header)
* **Default State (Empty Cart):**
  > `"Free shipping on all orders over $[T_opt]! Check out our new arrivals."`
* **Progressing State (Items added, below threshold):**
  > `"You are only $[T_opt - Cart_Subtotal] away from FREE shipping! 🚚 [Add more items]"`
* **Success State (Above threshold):**
  > `"🎉 Congrats! You have unlocked FREE shipping. [Checkout Now]"`

### 2. Cart Drawer Progress Bar Spec
* **Progress Bar Color:** High-contrast brand accent color (e.g., `#2ecc71` green or `#3498db` blue).
* **Progress Bar Track Background:** Light gray (`#f1f1f1`).
* **Cart Filler Section Title:** `"Frequently Added Accessories"` or `"Complete Your Order & Get Free Shipping"`
* **Cart Filler Items (Define 3 default, low-cost accessories):**
  1. Product: `______________________` | Price: `$______` | [Default Variant: `______`]
  2. Product: `______________________` | Price: `$______` | [Default Variant: `______`]
  3. Product: `______________________` | Price: `$______` | [Default Variant: `______`]

---

## Part 4: A/B Testing Test-Card Template

Use this format to pitch and structure your Free Shipping Threshold A/B test.

### **Hypothesis:**
> "By increasing our free shipping threshold from **$[Old Threshold]** to **$[New Calculated Threshold]** and implementing a **dynamic, interactive cart progress bar with one-click accessories**, we will motivate shoppers to build larger carts, resulting in a **[Target]% lift in Average Order Value (AOV)** while **maintaining or improving our net transaction margins**."

### **Test Parameters:**
* **Traffic Allocation:** 50/50 split.
* **Control (Variant A):** Existing shipping policy ($[Old Threshold]) with static on-site messaging.
* **Challenger (Variant B):** Profit-optimized shipping policy ($[New Threshold]) with interactive cart progress bar and accessory upsells.
* **Primary Metric:** Average Order Value (AOV)
* **Secondary Metrics:** Cart-to-Checkout Transition Rate, Checkout Completion Rate, Total Net Profit Margin per Order.
* **Run Time:** Minimum of 14 days or until statistical significance (95%+) is reached.
