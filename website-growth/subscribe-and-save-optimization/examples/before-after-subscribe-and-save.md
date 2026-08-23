# Before & After Scenario: Subscribe & Save Optimization

## Case Study: "NutraVital Greens" Daily Superfood Powder

### Background
NutraVital Greens is an e-commerce direct-to-consumer (DTC) wellness brand selling a high-margin $58 daily superfood powder (30-day supply). Although the product is inherently a daily consumable designed for monthly replenishment, NutraVital's online store suffered from an abysmal **11.4% Subscription Mix %** (only 11.4% of total orders selected "Subscribe & Save").

---

## The Baseline Problem (Before Optimization)

### PDP Buy Box Structure (Before)
- **Unclear Radio Button Layout:** The Buy Box presented two unformatted standard HTML radio buttons:
  - `( ) One-Time Purchase — $58.00`
  - `( ) Subscribe & Save — $52.20`
- **Weak Savings Framing:** A modest 10% discount ($5.80 savings) was buried in small gray text without strikethrough pricing or unit savings callouts.
- **Hidden Delivery Frequency:** Selecting "Subscribe & Save" did not reveal any frequency option. It defaulted to "30 Days" buried in a tooltip, leaving customers wondering when they would be billed next.
- **Zero Risk Reversal:** No reassurance copy was present near the Buy Box. Customer surveys revealed that 68% of non-subscribers avoided the option due to fear of "being locked into a monthly contract with no way to cancel."
- **Generic CTA Button:** The primary button read "ADD TO CART" regardless of whether One-Time or Subscribe was selected.
- **Passive Cart Drawer:** Adding a One-Time item to the cart drawer rendered a plain item card with no option to convert to a subscription before checkout.

### Baseline Performance Metrics
- **Subscription Mix %:** 11.4%
- **PDP Conversion Rate (CVR):** 2.15%
- **Average Order Value (AOV):** $61.20
- **Cart Drawer Subscription Upgrade Rate:** 0.0% (Feature did not exist)
- **Revenue Per Visitor (RPV):** $1.32
- **90-Day Subscriber Retention Rate:** 41.2% (High month-1 cancellation due to surprise renewals)

---

## The Optimization Plan

### Step 1: Restructure PDP Buy Box into Two Interactive Option Cards
Replaced unformatted radio buttons with a stacked card UI.

```text
+-----------------------------------------------------------------------+
|  [BEST VALUE]  Save 20% + FREE Shipping                               |
|  (o) SUBSCRIBE & SAVE                                                 |
|      ~~$58.00~~ $46.40 / pouch  (Save $11.60 / order)                 |
|                                                                       |
|      Deliver every:  [ 30 Days (Daily Use)  v ]                       |
|      ✓ Free Shipping included                                         |
|      ✓ Free Starter Shaker Bottle on 1st order ($15 value)            |
+-----------------------------------------------------------------------+
|  ( ) ONE-TIME PURCHASE                                                |
|      $58.00  (+ $5.95 shipping)                                       |
+-----------------------------------------------------------------------+
```

### Step 2: Value-Stacking & Strikethrough Pricing
- Increased recurring discount from 10% ($52.20) to **20% ($46.40)**.
- Stacked **Free Shipping** ($5.95 savings) onto all subscription orders.
- Added a high-value physical gift incentive: **Free Starter Shaker Bottle** included in the 1st subscription order.
- Explicit savings math displayed: `~~$58.00~~ $46.40 (Save $11.60 + Free Shipping)`.

### Step 3: Explicit Risk-Reversal Microcopy
Placed direct reassurance microcopy immediately above the main CTA:
> **`✓ Cancel, pause, or skip anytime in 1 click. SMS reminder sent 3 days before every renewal.`**

### Step 4: Dynamic CTA Button Alignment
Updated CTA button text to dynamically change when Subscribe & Save is active:
> **`SUBSCRIBE & SAVE — $46.40 / MONTH`**

### Step 5: Cart Drawer One-Click Upgrade Interstitial
Added a dynamic upgrade banner inside the cart drawer for one-time purchases:

```text
+-----------------------------------------------------------------------+
| NutraVital Greens Pouch (One-Time)                       $58.00       |
|                                                                       |
| +-------------------------------------------------------------------+ |
| | ⚡ UPGRADE TO SUBSCRIBE & SAVE                                    | |
| | Save $11.60 + Get Free Shipping + Free Shaker Bottle today!       | |
| | [ Switch to Subscription ($46.40/mo) ]                            | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

---

## Results & Measurable Outcomes

After 30 days of running the optimized Subscribe & Save experience in an A/B test ($n = 45,000$ visitors per variant):

| Metric | Baseline (Before) | Optimized (After) | Relative Lift / Impact |
| :--- | :--- | :--- | :--- |
| **Subscription Mix %** | 11.4% | **38.2%** | **+235.1% Relative Lift** |
| **PDP Conversion Rate (CVR)** | 2.15% | **2.62%** | **+21.8% CVR Lift** |
| **Cart Drawer Upgrade Rate** | 0.0% | **9.4%** | **New Conversion Stream** |
| **Average Order Value (AOV)** | $61.20 | **$66.80** | **+$5.60 AOV Lift** |
| **Revenue Per Visitor (RPV)** | $1.32 | **$1.75** | **+32.5% RPV Increase** |
| **90-Day Subscriber Retention**| 41.2% | **68.5%** | **+66.3% Retention Boost** |

### Key Takeaway
By transforming the Subscribe & Save selector from a passive radio button into an irresistible value stack with explicit risk reversal, NutraVital Greens tripled their subscription share of voice without sacrificing first-order conversion rates. The addition of the pre-shipment SMS reminder guarantee eliminated commitment anxiety and drastically improved month-1 retention.
