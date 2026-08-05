# Checkout Order Bump Optimization: Before vs. After

This before-and-after scenario demonstrates how implementing and optimizing a checkout order bump can dramatically increase Average Order Value (AOV) and gross profitability without affecting primary checkout completion.

---

## Scenario: "ApexFit" Fitness Equipment

ApexFit sells a premium at-home resistance band kit for **$79.00**. They have an optimized checkout flow with a strong **42% checkout-to-purchase conversion rate**. However, their average order value is stagnant at $79.00 because they have no supplementary offers. Shipping costs and paid acquisition are eating into their margins, and they want to increase gross profit per initial transaction.

---

## ❌ Before: The "Zero-Offer" Checkout

### Visual Layout:
- A standard, clean checkout page.
- Left Column: Shipping address fields, shipping speed selection, and credit card entry.
- Right Column: Order summary showing:
  - Resistance Band Kit: $79.00
  - Shipping: Free
  - Total: $79.00
- No complementary or accessory suggestions are made during the entire session.

### Technical Behavior:
- Fast checkout, but missing an immediate impulse opportunity.
- To buy accessories (like heavy-duty anchors or a storage pouch), customers must exit the checkout, search the store catalog, add items to their cart, and re-initiate checkout.

### Metrics:
- **Average Order Value (AOV):** $79.00
- **Checkout Completion Rate:** 42.0%
- **Take Rate on Accessories:** 0% (at checkout)
- **Gross Margin per Transaction:** $47.40 (60% margin on the $79 kit)

---

## ✅ After: The "High-Yield" Optimized Order Bump

ApexFit designs and implements an optimized, single-checkbox order bump directly above the final "Complete Purchase" CTA on the payment screen.

### The Offer: "The ApexFit Door Anchor Pro"
- **Product Type:** A heavy-duty, high-utility door attachment accessory.
- **Regular Retail Price:** $24.90
- **Order Bump Price:** $12.95 (approx. 16.4% of primary cart value, well below the 25% threshold).
- **Gross Margin on Anchor:** 85% ($11.00 net margin per unit).

### Visual Styling & Copy Implementation:
```text
┌────────────────────────────────────────────────────────────────────────┐
│  🎁 SPECIAL ADD-ON OFFER (Only available on this page)                 │
│                                                                        │
│  [ ] Yes, Add the Heavy-Duty Door Anchor Pro for only $12.95 (Save 50%)│
│                                                                        │
│  Supercharge your workout. Secure your bands to any standard door      │
│  frame for 50+ additional exercises. Includes lifetime safety warranty.│
└────────────────────────────────────────────────────────────────────────┘
```
- **Styling Details:**
  - Styled with a dashed borders highlighted in a distinct accent color (`#E056FD`).
  - Warm, subtle background shading (`#FAF8FF`) to draw focus without looking like spam.
  - Large, tap-friendly checkbox.
- **Default State:** Unchecked.

### Technical Integration:
- Built with Vanilla JavaScript and Fetch API.
- Clicking the checkbox instantly updates the Order Summary column dynamically in **120ms** without freezing the browser or requiring a page reload.
- Calculates correct sales tax dynamically if the bump is checked.

---

## The Results (After 30-Day A/B Test)

| Metric | Before (Control) | After (Optimized Bump) | Impact |
| :--- | :--- | :--- | :--- |
| **Checkout Completion Rate** | 42.0% | 41.8% | Negligible (Within margin of error) |
| **Order Bump Take Rate** | — | **26.4%** | Highly successful |
| **Average Order Value (AOV)** | $79.00 | **$82.42** | **+$3.42 (+4.33%)** lift overall |
| **Gross Margin per Transaction**| $47.40 | **$50.30** | **+$2.90 (+6.1%)** lift in net profit |
| **Customer Refund/Support Rate**| 0.8% | 0.9% | No statistically significant increase |

### Key Takeaways:
1. **Low Cognitive Load:** The price point ($12.95) was low enough that users didn't have to deliberate. It felt like a small, helpful utility add-on rather than an aggressive upsell.
2. **Contextual Match:** Every customer buying resistance bands needs a door anchor to get full utility out of the bands. The context was 100% matched.
3. **No Interruption:** Placing the offer immediately above the purchase button captured attention at the peak moment of purchase intent, but because it didn't block the screen with a popup, it preserved the baseline completion rate.
