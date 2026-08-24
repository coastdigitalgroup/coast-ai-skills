# Subscribe & Save Optimization: Before and After Case Study

## Executive Summary

- **Client:** "Verve Nootropics" (Direct-to-Consumer Daily Brain Supplement Brand)
- **Problem:** Low subscription adoption (8.2% opt-in rate), high cart abandonment when pre-selected, and customer confusion around delivery frequency control.
- **Intervention:** Re-architected PDP Subscribe & Save buy box with explicit dual-radio containers, dynamic dollar savings badges, transparent 3-point risk-reversal microcopy, and a 1-click cart drawer upgrade toggle.
- **Key Outcomes:**
  - **Subscribe & Save Opt-in Rate:** 8.2% ➔ **28.4%** (+246% relative increase)
  - **PDP Overall Conversion Rate:** 2.85% ➔ **3.42%** (+20.0% relative increase)
  - **Cart Abandonment Rate:** 68.4% ➔ **59.1%** (-13.6% relative decrease)
  - **90-Day Customer Lifetime Value (LTV):** $54.20 ➔ **$76.80** (+41.7% increase)

---

## Baseline Scenario (BEFORE)

### Background & Context

Verve Nootropics sells a daily 30-day supply capsule jar for $48.00. While the formula has strong customer satisfaction, 91.8% of web orders were one-time purchases. The merchant's goal was to transition one-time buyers into monthly subscribers to stabilize MRR and improve payback periods on paid ad acquisition.

### Baseline UX & UI State

1. **PDP Selector:** A subtle drop-down select element placed below the main price, with standard text: `Delivery: One-Time ($48.00)` vs `Delivery: Auto-Deliver Every Month ($43.20)`.
2. **Pre-selection:** The dropdown defaulted to "Auto-Deliver", but offered no explanation of cancellation terms, skip policies, or delivery intervals.
3. **Discount Framing:** Simple 10% percentage notation without displaying the exact dollar amount saved (`Save 10%`).
4. **Cart Drawer:** Displays the item as a fixed line item. No option to upgrade or switch purchase options inside the cart.
5. **Checkout & Support Complaints:** Customers who checked out without realizing they selected "Auto-Deliver" flooded customer support demanding refunds, while cautious shoppers abandoned their carts due to hidden commitment terms.

### Baseline Performance Metrics (30-Day Window)

| Metric | Baseline Value |
| :--- | :--- |
| **PDP Unique Visitors** | 42,000 |
| **Total Orders** | 1,197 |
| **PDP Overall Conversion Rate** | 2.85% |
| **Subscribe & Save Opt-in Rate** | 8.2% (98 subscription orders) |
| **One-Time Orders** | 91.8% (1,099 one-time orders) |
| **Cart Abandonment Rate** | 68.4% |
| **Post-Purchase Accidental Subscription Refund Rate** | 7.4% of subscription orders |
| **Average 90-Day Cohort LTV** | $54.20 |

---

## The Optimization Strategy (INTERVENTION)

Applying the **Subscribe & Save Optimization** skill framework, Verve Nootropics redesigned their PDP Buy Box and Cart Drawer over a 4-week implementation sprint.

```
BEFORE: Subtle Dropdown Selector          AFTER: High-Converting Dual-Radio Box
┌─────────────────────────────────┐      ┌─────────────────────────────────────────┐
│ Delivery:                       │      │ ○ One-Time Purchase             $48.00  │
│ [ Auto-Deliver Every Month  ▼ ] │ ────>│                                         │
│                                 │      │ 🔘 Subscribe & Save  [SAVE $7.20] $40.80 │
│ Price: $43.20 (Save 10%)        │      │    Delivered: [ Every 30 Days (Popular) ▼]│
│                                 │      │    ✓ Free Shipping  ✓ Cancel Anytime    │
└─────────────────────────────────┘      └─────────────────────────────────────────┘
```

### 1. PDP Buy Box Redesign (Choice Architecture)

- **Dual-Radio Container:** Replaced the plain select dropdown with two large, clickable container cards:
  - **Top Card (One-Time Purchase):** Clean outline, displaying standard `$48.00` retail price.
  - **Bottom Card (Subscribe & Save - Highlighting Most Popular):** Styled with a soft brand highlight border and a bold `SAVE 15% ($7.20 OFF)` pill badge. Displayed crossed-out retail price `~~$48.00~~` alongside the net subscriber price `$40.80`.
- **Default Logic:** Defaulted selection to **One-Time Purchase** for cold ad traffic landing pages, while pre-selecting **Subscribe & Save** for returning visitors and warm email traffic.

### 2. Calibrated Frequency Selector & Value Microcopy

- Revealed a clean, inline frequency selector when Subscribe & Save was selected:
  - Option 1: `Every 30 Days (Recommended for daily use)`
  - Option 2: `Every 45 Days`
  - Option 3: `Every 60 Days`
- Added dynamic value badges next to the selection: *"Includes Free Shipping + Price Lock Guarantee"*.

### 3. Transparent Risk-Reversal Guarantees

Positioned a high-trust microcopy block immediately underneath the primary "Subscribe & Save - $40.80" CTA button:

> 🔄 **Total Flexibility:** Skip, delay, or swap your delivery dates anytime in 1 click.
> ❌ **Zero Lock-In:** Cancel online anytime with no fees or hassle.
> 🔔 **No Surprises:** We send a reminder email 3 days before every automated renewal.

### 4. Cart Drawer 1-Click Upgrade Nudge

For shoppers who selected One-Time Purchase on the PDP, a high-converting nudge was embedded inside the cart drawer:

> 💡 **Want to save $7.20 on this order?**
> Switch your order to Subscribe & Save and get instant **15% OFF + Free Shipping**.
> `[ Toggle 1-Click Subscribe & Save ]`

---

## Post-Implementation Results (AFTER)

### Optimised Performance Metrics (30-Day Evaluation Window)

| Metric | Baseline | Optimized | Relative Change |
| :--- | :--- | :--- | :--- |
| **PDP Unique Visitors** | 42,000 | 44,500 | +5.9% |
| **Total Orders** | 1,197 | 1,521 | +27.1% |
| **PDP Overall Conversion Rate** | 2.85% | **3.42%** | **+20.0%** |
| **Subscribe & Save Opt-in Rate** | 8.2% | **28.4%** | **+246.3%** |
| **Cart Drawer Upgrade Rate** | 0.0% | **11.4%** | N/A (New Feature) |
| **Cart Abandonment Rate** | 68.4% | **59.1%** | **-13.6%** |
| **Accidental Subscription Refunds** | 7.4% | **0.8%** | **-89.2%** |
| **90-Day Customer LTV** | $54.20 | **$76.80** | **+41.7%** |

---

## Key Learnings & Takeaways

1. **Clear Savings Beat Abstract Percentages:** Displaying the explicit dollar savings (`Save $7.20`) alongside percentage badges (`Save 15%`) significantly boosted subscription selection over percentage-only copy.
2. **Transparency Increases Conversion:** Adding explicit "Cancel or skip anytime" microcopy adjacent to the CTA button reduced cart abandonment caused by subscription commitment anxiety.
3. **Cart Drawer Upgrades Recover One-Time Buyers:** 11.4% of shoppers who ignored the subscription widget on the PDP converted to subscriptions inside the cart drawer when framed as an instant discount before checkout.
