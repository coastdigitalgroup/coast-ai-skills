# Before & After: Shipping & Delivery Transparency Optimization

## Overview

This case study illustrates how **AuraGlow Apparel**, a mid-market DTC athleticwear brand ($14M ARR), resolved high cart abandonment rates and a overwhelming volume of post-purchase customer service tickets by optimizing shipping and delivery transparency across their entire purchase funnel.

---

## Baseline Situation & The Problem

AuraGlow was driving high-intent paid social and search traffic to product pages. However, analytics revealed a sharp drop-off at the final payment step of checkout:
- **Product Detail Page Add-to-Cart (ATC) Rate:** 6.8%
- **Cart-to-Checkout Start Rate:** 42.1%
- **Checkout Completion Rate (CCR):** 46.2%
- **Overall Conversion Rate:** 1.32%
- **WISMO Support Ticket Share:** 44% of all inbound customer support volume ("Where is my order?", "Did my package ship?", "Why was I charged $18 customs?").

### Key Friction Points Identified in Audit

1. **PDP Opacity:** Product pages only showed `"Free Shipping on Orders Over $75"`. There was no indication of how fast orders ship, where packages ship from, or when items would arrive.
2. **Ambiguous Cart Messaging:** The slide-out cart drawer displayed subtotal and items, but listed Shipping as `"Calculated at checkout"`. Users were forced to initiate checkout and enter their full shipping address just to learn the shipping cost.
3. **The "3–5 Business Days" Trap:** At checkout, shipping options were listed as `"Standard Shipping (3–5 business days) — $5.99"`. Because warehouse processing took 1–2 days and orders placed on Thursday afternoon didn't ship until Monday, customers expected delivery within 3–5 calendar days and felt misled when items took 8 days to arrive.
4. **Cross-Border Tariff Shock:** Canadian and European customers were hit with an undisclosed $12–$25 DHL customs/brokerage fee upon delivery (DDU model), leading to a 6.2% order refusal/return rate on international sales.

---

## The Optimization Intervention

AuraGlow implemented the **Shipping & Delivery Transparency Optimization** framework across four touchpoints:

### 1. PDP Dynamic Calendar Date Widget & Cutoff Timer
- Added a location-aware delivery badge below the primary ATC button:
  > **🚚 Arrives between Thursday, Oct 18 – Saturday, Oct 20** to *Chicago, 60611*
  > ⚡ *Order within 2h 14m for same-day dispatch from our US warehouse.*
- Integrated an IP-based ZIP code detector with an "Edit Location" modal.
- Configured backend logic to combine warehouse processing lead times (24h) + carrier transit time, excluding weekends.

### 2. Upfront Cart Drawer Estimator & Shipping Fee Guarantee
- Updated the cart drawer to display an instant shipping summary before checkout start:
  > **Shipping:** Standard ($5.99) or **FREE** (You are $12 away from Free Standard Shipping!).
  > **Estimated Delivery:** Oct 18 – Oct 20.

### 3. Clear Checkout Shipping Hierarchy & Pre-Paid Duties (DDP)
- Standardized checkout shipping options with exact arrival dates rather than carrier speeds:
  - `Standard Delivery (Arrives Thu, Oct 18 – Sat, Oct 20) — $5.99`
  - `Express 2-Day (Guaranteed Delivery by Wed, Oct 17) — $14.99`
- Integrated Zonos/Global-e for international checkouts:
  - Canadian/EU checkouts now feature a pre-calculated duties option: `Duties & Import Taxes Included (DDP) — No hidden fees on delivery`.

### 4. Post-Purchase Transparency & Self-Serve Tracking
- Upgraded order confirmation email and status page to feature a 4-stage visual timeline (`Ordered` ➔ `In Warehouse Staging` ➔ `In Transit` ➔ `Delivered`).
- Added real-time SMS tracking updates for dispatch, out-for-delivery, and doorstep delivery.

---

## Quantitative Results (90-Day A/B Test)

| Metric | Before Optimization | After Optimization | Delta / Impact |
| :--- | :--- | :--- | :--- |
| **PDP Add-to-Cart (ATC) Rate** | 6.8% | 7.6% | **+11.8%** |
| **Cart-to-Checkout Start Rate** | 42.1% | 51.4% | **+22.1%** |
| **Checkout Completion Rate (CCR)** | 46.2% | 53.8% | **+16.5%** |
| **Overall Funnel Conversion Rate** | 1.32% | 1.82% | **+37.9% Relative Lift** |
| **WISMO Support Ticket Share** | 44.0% of all tickets | 16.2% of all tickets | **-63.2% Reduction** |
| **International Refusal/Return Rate** | 6.2% | 0.4% | **-93.5% Reduction** |
| **Average Order Value (AOV)** | $68.50 | $74.20 | **+$5.70 (+8.3%)** |

---

## Visual Comparison Matrix

```text
BEFORE (Opaque & High Friction)
----------------------------------------------------------------------
[PDP]
  Price: $48.00
  [ Add to Cart ]
  Microcopy: "Free shipping on orders over $75"
  (User Question: "When will I actually receive this?")

[CART DRAWER]
  Subtotal: $48.00
  Shipping: Calculated at checkout
  [ Begin Checkout ]
  (User Question: "How much is shipping going to cost me?")

[CHECKOUT]
  Option 1: Standard Shipping (3-5 business days) - $5.99
  Option 2: Expedited Shipping (2 business days) - $15.99
  (User Question: "Does 3-5 days include weekend packing?")
----------------------------------------------------------------------

AFTER (Transparent & Reassuring)
----------------------------------------------------------------------
[PDP]
  Price: $48.00
  [ Add to Cart ]
  ------------------------------------------------------------------
  🚚 Arrives Thu, Oct 18 - Sat, Oct 20 to Chicago, 60611 [Change]
  ⚡ Order within 2h 14m for same-day dispatch
  ------------------------------------------------------------------

[CART DRAWER]
  Subtotal: $48.00
  Shipping: $5.99 (Add $27.00 for FREE Shipping!)
  Estimated Delivery: Oct 18 - Oct 20
  [ Begin Checkout ]

[CHECKOUT]
  Option 1: Standard (Arrives Thu, Oct 18 - Sat, Oct 20) - $5.99
  Option 2: Express Guaranteed (Arrives Wed, Oct 17) - $15.99
  ✔ Duties & Import Taxes Included (No fees on delivery)
----------------------------------------------------------------------
```

---

## Core Takeaways

1. **Calendar Dates Outperform Shipping Speeds:** Customers think in calendar arrival dates, not abstract "business days". Showing "Arrives Thursday, Oct 18" eliminates uncertainty and accelerates purchase decisions.
2. **Hidden Shipping Costs Ruin Conversions:** Revealing estimated shipping fees inside the cart drawer increased Cart-to-Checkout conversion by 22.1% by qualifying high-intent buyers early.
3. **Transparency Eliminates Support Overhead:** Providing clear post-purchase tracking timelines cut WISMO support tickets by over 63%, saving the CX team dozens of hours weekly.
