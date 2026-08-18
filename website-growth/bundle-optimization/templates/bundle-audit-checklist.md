# Product Bundle Optimization Audit & Execution Checklist

Use this actionable checklist to audit existing product bundle offers, calculate profit-safe discount thresholds, design high-converting PDP/cart UI elements, and prevent margin erosion.

---

## Part 1: Initial Data & Catalog Discovery Audit

- [ ] **1. Basket Analysis & Co-Purchase Mapping:**
  - Export 60–90 days of order item history from CMS/analytics.
  - Identify top 5 "Anchor / Hero" products by order volume.
  - Calculate item attachment rates: Which secondary items are purchased alongside anchor items >= 15% of the time?

- [ ] **2. Baseline Metrics Benchmark:**
  - Record baseline Average Order Value (AOV): `$______`
  - Record baseline Revenue Per Visitor (RPV): `$______`
  - Record baseline Bundle Take Rate (% of orders with 2+ items): `______%`
  - Record baseline Site Conversion Rate (CVR): `______%`

- [ ] **3. Unit Economics & Margin Audit:**
  - Calculate Average Gross Margin % for core products: `______%`
  - Estimate pick/pack fulfillment surcharge per extra bundled item: `$______`
  - Verify that proposed bundle discount leaves gross profit dollars higher than single-item sales.

---

## Part 2: Bundle Structure & Pricing Strategy Evaluation

| Evaluation Criteria | Status | Audit Notes & Corrective Actions |
| :--- | :---: | :--- |
| **Optimal Discount Depth** | [ ] Pass / [ ] Fail | Is the bundle discount between 10% and 20%? (Discounts <10% don't convert; >25% erode margin). |
| **Anchor Item Dominance** | [ ] Pass / [ ] Fail | Does the core anchor item account for >= 50% of the total bundle value? |
| **3-Tier Limit Rule** | [ ] Pass / [ ] Fail | Are quantity/bundle options limited to 3 choices or fewer? |
| **Dual Savings Framing** | [ ] Pass / [ ] Fail | Are both absolute currency savings ($) and percentage savings (%) explicitly displayed? |
| **Gross Margin Dollars Test** | [ ] Pass / [ ] Fail | Does `(Bundle Price - Bundle COGS - Pick Surcharge)` exceed single-item gross profit? |

---

## Part 3: On-Site Merchandising & UI/UX Audit

### A. Product Detail Page (PDP) Integration
- [ ] **1. In-Context Buy Box Placement:** Is the bundle offer integrated directly inside or immediately below the main Buy Box on individual PDPs (rather than isolated on separate pages)?
- [ ] **2. Default Pre-Selection:** Is a multi-item tier or complete bundle option pre-selected by default when the PDP loads?
- [ ] **3. Visual Cohesion:** Are bundled items visually connected using `+` icons, thumbnail cards, and clear strikethrough original pricing?
- [ ] **4. Single-Action CTA:** Can the entire bundle be added to the cart with a single click?

### B. Build Your Own Bundle (BYOB) Builder Flow
- [ ] **1. Step Reduction:** Is the bundle builder broken into 3–4 logical steps (e.g., Step 1: Base, Step 2: Flavor, Step 3: Accessory) rather than a single long 20-item scroll?
- [ ] **2. Choice Constraint:** Are choices capped at 3–5 items per step to prevent decision paralysis?
- [ ] **3. Persistent Progress Bar:** Is there a sticky footer/header progress indicator showing exact remaining progress (e.g., *"Add 1 more to save 20%"*)?
- [ ] **4. Mobile Responsiveness:** Are all selection cards >= 44x44px touch targets on mobile viewports?

### C. Mini-Cart & Checkout Integration
- [ ] **1. Unified Line Item Display:** Does the cart drawer represent the bundle as a clear unified group with expandable sub-items?
- [ ] **2. Strikethrough & Savings Highlight:** Is the savings amount highlighted in green or high-contrast accent text (e.g., *Saved $18.00*)?
- [ ] **3. Dynamic Cart Nudge:** Does the mini-cart prompt single-item shoppers with a 1-click bundle upgrade option?

---

## Part 4: Technical, Inventory & Safeguards Audit

- [ ] **1. Inventory Component Tracking:** Does the e-commerce system deduct individual stock SKUs from inventory when a bundle is purchased?
- [ ] **2. Out-of-Stock Graceful Fallback:** If one item in a bundle goes out of stock, does the PDP widget automatically adjust or hide the offer to prevent checkout errors?
- [ ] **3. Return Policy Protection:** Is the bundle return policy clearly stated (e.g., *"Bundles must be returned in full for a complete refund"* or partial refund recalculation)?
- [ ] **4. Discount Stacking Security:** Are coupon code rules configured so percentage site-wide coupons do not unprofitably stack on top of pre-discounted bundles?

---

## Part 5: Validation & Success Tracking Sheet

| Metric | Pre-Optimization Baseline | 30-Day Post-Launch | Target Benchmark | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Average Order Value (AOV)** | `$______` | `$______` | **+12% to +25%** | [ ] |
| **Bundle Take Rate** | `______%` | `______%` | **>15% (General) / >35% (CPG)** | [ ] |
| **Revenue Per Visitor (RPV)** | `$______` | `$______` | **+15% Lift** | [ ] |
| **BYOB Completion Rate** | `______%` | `______%` | **>40% Completion** | [ ] |
| **Net Profit Dollars / Order** | `$______` | `$______` | **Net Positive Lift** | [ ] |
