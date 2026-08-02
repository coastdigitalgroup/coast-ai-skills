# Buy Now Pay Later (BNPL) Audit Checklist & Worksheet

This reusable template is designed to help e-commerce store owners, growth managers, and UX engineers audit their current Buy Now Pay Later (BNPL) integrations, calculate optimal payment thresholds, map out dynamic copy, and structure high-converting BNPL test-cards.

---

## Part 1: On-Site BNPL UX Audit Checklist

Use this checklist to identify friction points, visibility gaps, and cognitive blockers in your current BNPL implementation.

### 1. Above-The-Fold Product Detail Page (PDP) Visibility
- [ ] **Proximity to Price:** Is the BNPL installment calculation displayed directly below the main product price?
- [ ] **Dynamic Snippet Refresh:** When changing product variants (size, color, capacity) or quantity selectors, does the installment snippet update its calculations in real-time?
- [ ] **Interactive Info Icon (ⓘ):** Is there a clickable info icon next to the BNPL provider name?
- [ ] **Explainers in Popovers:** Does clicking the info icon open a lightweight popover/modal *on the same page* rather than redirecting the user to an external site?
- [ ] **Dual Provider Limit:** Are there at most two BNPL providers showcased on the product page (e.g., Klarna for Pay-in-4, Affirm for Long-term)?

### 2. Shopping Cart & Drawer Experience (Cart-level Reassurance)
- [ ] **Basket Installment Calculation:** Does the slide-out cart or shopping bag display the total cart subtotal parsed into installments (e.g., `"Subtotal: $150 or 4 payments of $37.50"`), rather than only showing a single static item's installment?
- [ ] **Soft Credit Reassurance:** Is there clear copy stating that applying has "no impact on your credit score"?
- [ ] **Minimum Threshold Nudges:** If the cart subtotal is slightly under the BNPL provider's minimum qualification limit (e.g., cart is $42 and minimum is $50), does a micro-nudge tell the user how much more to add to qualify?
- [ ] **Visual Hierarchy:** Does the installment text look visually subordinate to the primary "Checkout" call to action?

### 3. Last-Mile Checkout Completion
- [ ] **Equal Billing weight:** Is the BNPL payment option listed prominently alongside credit card entry and digital wallets, rather than buried under "Other Payments"?
- [ ] **No-Redirection Suspicion:** Does selecting the BNPL option display reassurance copy describing the redirection, secure authorization, and automatic return to the confirmation page?
- [ ] **Payment Split Confirmation:** Does the final checkout summary explicitly show today's immediate installment charge versus the remaining balance schedule?
- [ ] **Truth in Lending Disclosures:** Are APR disclosure statements and lender statements formatted in compliant, readable microcopy near the payment button?

---

## Part 2: BNPL Installment Calculation & Threshold Worksheet

Identify your product price ranges and calculate correct installment splitting metrics.

### 1. Data Collection
Analyze your store's price inventory and product list (past 90 days):

| Variable | Metric Name | Your Store's Value |
| :--- | :--- | :--- |
| **A** | Average Order Value (AOV) | $ __________________ |
| **P_high**| Threshold for High-Ticket Financing | $ __________________ (Typical threshold is $250) |
| **BNPL_min**| Provider Minimum Transaction Limit | $ __________________ (e.g., $35 or $50) |
| **Fee %** | Average BNPL Processing Fee | __________________ % (Typical range is 4% to 6%) |

### 2. Step-in-4 Splitting Formula (Prices $50 - $250)
For mid-tier products, calculate the standard 4-payment bi-weekly split:

$$\text{Bi-Weekly Payment} = \frac{\text{Product Price}}{4}$$

* **Calculation Examples:**
  * Product Price: $120.00 $\rightarrow$ 4 payments of **$30.00**
  * Product Price: $199.99 $\rightarrow$ 4 payments of **$50.00** (rounded to nearest cent)

### 3. Long-Term Financing Formula (Prices > $250)
For high-ticket products, calculate starting monthly rates based on promotional APRs (e.g., starting at 0% or 15% APR over 12 months):

$$\text{Est. Monthly Payment} = \frac{\text{Product Price} \times (1 + \text{Est. Interest Rate})}{12}$$

* **Calculation Worksheet:**
  ```text
  Product Price = $ _______________
  Divide by 12 = $ _______________ (Interest-free estimate: "as low as $X/mo")
  With interest (e.g., 15% simple) = $ _______________ × 1.15 / 12 = $ _______________/mo
  ```

---

## Part 3: Front-End UI Copy & Placement Specifications

Copy, customize, and paste these specifications into your engineering ticket backlog.

### 1. Product Detail Page (PDP) Snippet Specs
* **Visual Placement:** Exactly 8px directly below the product price display.
* **Font Family/Size/Color:** Secondary font, 14px, dark gray `#4a4a4a`.
* **Standard Copy String (Pay-in-4):**
  > `"or 4 interest-free payments of $[Product_Price / 4] with [BNPL Provider Logo] ⓘ"`
* **Standard Copy String (Financing for products > $[P_high]):**
  > `"or monthly payments as low as $[Product_Price / 12]/mo with [BNPL Provider Logo] ⓘ"`

### 2. Info Popover Modal Content Spec
* **Popover Dimensions:** Max-width 300px, responsive centered modal on mobile.
* **Heading Copy:** `"How installments work with [Provider Name]"`
* **Body Bullet points:**
  - `Select [Provider] at checkout as your payment method.`
  - `Complete your secure application in seconds with zero impact on your credit score.`
  - `Split your purchase into 4 equal interest-free payments billed every 2 weeks.`
  - `No late fees, no interest, and automatic processing on your card.`

### 3. Cart Drawer "Subtotal installment" Spec
* **Placement:** directly below the bold subtotal amount in the cart drawer footer.
* **Dynamic Cart Copy:**
  > `"Or pay in 4 interest-free payments of $[Subtotal / 4]/mo with [Provider]"`

### 4. Checkout Redirection Reassurance Statement
* **Placement:** Displayed in a card block below the BNPL option in the checkout billing stage.
* **Copy:**
  > `"Secure Checkout Redirection: You will be redirected to [Provider] to select your payment option. No hard credit inquiries are made. After selecting, you'll be automatically returned to our site to finish your purchase."`

---

## Part 4: A/B Testing Test-Card Template

Structure and pitch your BNPL Optimization experiment using this standard template.

### **Hypothesis:**
> "By integrating a **dynamic, above-the-fold BNPL installment split-in-4 calculation widget** on all Product Detail Pages priced above **$[BNPL_min]**, and mirroring the **installment subtotal in the cart drawer**, we will lower upfront pricing psychological resistance, resulting in a **[Target]% lift in Average Order Value (AOV)** and a **[Target]% lift in Checkout Completion Rate**."

### **Test Parameters:**
* **Traffic Allocation:** 50/50 split across all desktop and mobile traffic.
* **Variant A (Control):** PDPs show static full pricing only. BNPL payment option is listed as a generic accordion at the bottom of the checkout page.
* **Variant B (Challenger):** PDPs and Cart Drawer display dynamic installment calculations and soft-credit reassurance. BNPL option in checkout includes equal billing weight and redirect reassurance text.
* **Primary Success Metric:** Average Order Value (AOV)
* **Secondary Metrics:** Checkout Completion Rate (CCR), BNPL adoption rate (Share of Wallet), Product Page Add-to-Cart rate.
* **Run Time:** Minimum 14 days or until 95%+ statistical significance is achieved.
