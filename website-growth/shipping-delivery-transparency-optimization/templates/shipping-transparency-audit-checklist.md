# Shipping & Delivery Transparency Audit Checklist & Matrix

Use this checklist and matrix to audit an e-commerce funnel for shipping, fulfillment, and delivery transparency gaps.

---

## 1. Funnel Touchpoint Audit Checklist

### Touchpoint A: Product Detail Page (PDP)
- [ ] **Dynamic Delivery Calendar Date:** Is an estimated arrival date range displayed (e.g., *"Arrives Thu, Oct 18 – Sat, Oct 20"*) instead of generic text?
- [ ] **Dispatch Cutoff Countdown:** Is a live countdown timer displayed for same-day/next-day dispatch (e.g., *"Order in 2h 15m for dispatch today"*)?
- [ ] **Location / ZIP Code Detector:** Is the delivery estimate localized based on IP address or postal code with an easy "Edit Location" option?
- [ ] **Handling / Processing Disclosures:** Are custom, backordered, or made-to-order lead times explicitly stated directly above the Add-to-Cart button?
- [ ] **Fulfillment Origin Trust Badge:** Is the warehouse location/country clearly stated (e.g., *"Ships from USA warehouse"* or *"Local EU Dispatch"*)?

### Touchpoint B: Cart Drawer & Cart Page
- [ ] **Upfront Shipping Fee Estimate:** Does the cart display an estimated shipping cost or "FREE" indicator before starting checkout?
- [ ] **Delivery Summary in Cart:** Is the estimated delivery date range reinforced inside the cart drawer summary?
- [ ] **Free Shipping Incentive Progress:** Is a dynamic progress bar visible showing how much more to add for free shipping (if applicable)?
- [ ] **No "Calculated at Checkout" Surprise:** Is "Shipping: Calculated at checkout" replaced with transparent estimations or flat-rate rules?

### Touchpoint C: Checkout Flow (Shipping & Payment Steps)
- [ ] **Option Hierarchy by Arrival Date:** Are shipping options organized and labeled primarily by calendar arrival date rather than carrier names alone?
- [ ] **Warehouse Lead Time Inclusion:** Does the displayed checkout delivery date include warehouse processing time ($1–2$ days) + carrier transit time?
- [ ] **Cross-Border Duties & Taxes Clarity:** For international orders, is it explicitly communicated whether duties are included (DDP) or collected on delivery (DDU)?
- [ ] **Address Validation & PO Box Alerts:** Is real-time postal code verification active to prevent undeliverable shipping addresses before payment?

### Touchpoint D: Post-Purchase & Tracking Experience
- [ ] **Order Confirmation Arrival Guarantee:** Does the Thank You page and confirmation email reiterate the promised delivery window?
- [ ] **4-Stage Visual Order Tracker:** Is a visual progress bar (`Confirmed` ➔ `Staging` ➔ `Shipped` ➔ `Delivered`) present on the order status page?
- [ ] **Proactive SMS/Email Triggers:** Are automated status notifications enabled for order dispatch, out-for-delivery, and delivery completion?
- [ ] **Self-Serve Tracking Portal:** Can users track their package on-site without logging in or contacting support?

---

## 2. Fulfillment Transparency Scoring Matrix

Evaluate each criterion on a scale of **0 (Absent/Misleading)** to **3 (Best Practice)**.

| Audit Dimension | 0 - Poor | 1 - Basic | 2 - Good | 3 - Optimized (Best Practice) | Score (0-3) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PDP Delivery Messaging** | No delivery information visible on PDP. | Generic "Ships in 3-5 days" text. | Shows transit business days (e.g., "3 business days"). | **Dynamic location-aware arrival dates (e.g., "Arrives Thu, Oct 18") with dispatch countdown.** | _____ |
| **Cart Shipping Transparency** | "Shipping calculated at checkout" only. | Shows standard shipping price list in footer link. | Zip code shipping calculator present in cart. | **Instant zip-code detection + live shipping fee + delivery date range in cart drawer.** | _____ |
| **Checkout Speed Hierarchy** | Carrier names only (e.g., "FedEx Ground $8"). | Carrier name + speed (e.g., "FedEx 3-Day"). | Estimated business days shown. | **Calendar dates + guaranteed delivery option (e.g., "Arrives Wednesday, Oct 17").** | _____ |
| **Handling Lead Time** | Warehouse handling time undisclosed. | Small print disclaimer in Terms page. | Processing note in shipping FAQ. | **Processing time added into promised calendar arrival date automatically.** | _____ |
| **International Duties & Taxes** | Undisclosed DDU fees causing delivery shock. | Generic "Customs may apply" warning at checkout. | Duties calculated but paid at doorstep. | **DDP checkout with duties pre-calculated and option to pre-pay upfront.** | _____ |
| **Post-Purchase WISMO Defense** | Static email with raw carrier tracking link. | Email confirmation with static delivery speed. | Order status page with carrier link. | **Interactive on-site visual order status page + proactive SMS delivery alerts.** | _____ |

### Scoring Summary
- **15–18 Points:** **World-Class Shipping Transparency** (High conversion conversion efficiency, low WISMO rate).
- **10–14 Points:** **Moderate Friction** (Minor conversion leak at cart/checkout).
- **0–9 Points:** **Severe Transparency Friction** (High cart abandonment, heavy WISMO ticket burden).

---

## 3. Implementation Action Plan

1. **Short-Term Fixes (Week 1):** Replace "3–5 business days" with specific date ranges in checkout. Add shipping fee estimate to cart drawer.
2. **Medium-Term Upgrades (Weeks 2–3):** Deploy location-aware PDP delivery widget with dispatch countdown timer. Implement address validation.
3. **Long-Term Optimization (Month 2):** Integrate DDP cross-border duties app (Zonos/Global-e) and deploy custom on-site order status tracking portal.
