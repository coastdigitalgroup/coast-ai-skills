# Before and After: Mobile Sticky CTA Optimization

## Scenario Overview

**Business:** Lumina Skincare (Direct-to-Consumer Skincare Brand)
**Page Type:** Mobile Product Detail Page (PDP) for "HydraGlow Vitamin C Serum" ($68)
**Device Context:** Mobile Web (78% of total traffic, iOS and Android smartphones)
**Problem:** High mobile scroll depth (68% of visitors scrolled past customer reviews and ingredient breakdowns), but low mobile conversion rate (1.4% vs. 3.2% desktop baseline). Analytics revealed that 42% of mobile visitors who scrolled deep into reviews left the page without clicking "Add to Cart" because the primary buy box was off-screen.

---

## BEFORE Optimization

### Baseline State & UX Flaws

1. **Hidden Buy Box:** The primary "Add to Cart" button was located exclusively in the top hero buy box. Once a mobile user scrolled past the hero images and product description (approx. 650px depth), the buy box completely vanished.
2. **Scroll Friction:** A user convinced by customer reviews at 1,800px depth had to manually scroll up 3 full viewport heights to click "Add to Cart".
3. **Competing Fixed Elements:** A static live chat widget icon sat permanently in the bottom-right corner (`bottom: 20px`), overlapping long-form text.
4. **No Real-Time Re-engagement:** Users who selected a 2-pack or subscription option mid-page had no immediate visual confirmation or sticky CTA to finalize the purchase.

### Baseline Metrics (Pre-Optimization)

- **Mobile Pageviews:** 120,000 / month
- **Mobile Primary CTA Clicks (Add to Cart):** 2,520 (2.1% CTR)
- **Mobile Conversion Rate (CVR):** 1.42%
- **Average Order Value (AOV):** $71.00
- **Monthly Revenue from Mobile:** $120,984

---

## AFTER Optimization

### Implementation Details

1. **Intersection Observer Sentinel:**
   - Placed an invisible sentinel element directly below the main hero Buy Box button.
   - When the hero button scrolled completely off-screen, the bottom sticky CTA bar animated into view smoothly (`transform: translateY(0)` with CSS transition).
2. **Sticky Mobile Bottom Bar Design:**
   - **Height:** 64px + safe area padding (`env(safe-area-inset-bottom)`).
   - **Left Section:** Micro product thumbnail, product name, star rating badge (`4.9 ★ (1,240)`), and real-time price (`$68.00`).
   - **Right Section:** High-contrast primary CTA button (`#0F172A` background, `#FFFFFF` text) reading **"Add to Cart — $68"** with a minimum 48px touch height.
3. **Live Chat Adjustment:**
   - Dynamically set CSS custom property `--chat-bottom-offset: 80px` whenever the sticky CTA bar was active, lifting the live chat launcher button above the sticky bar without overlap.
4. **Footer Auto-Hide:**
   - Set an observer on the footer container to slide the sticky CTA bar out when the user reached the page footer.
5. **State Synchronization:**
   - When a user toggled the "Subscribe & Save 15%" radio button in the PDP body, the sticky CTA button copy updated in real time to **"Subscribe & Save — $57.80"**.

---

## Measurable Results (Post-Optimization)

After a 30-day A/B test split 50/50 across mobile traffic (60,000 visitors per variant):

| Metric | Before (Control) | After (Variant B) | Relative Lift |
| :--- | :--- | :--- | :--- |
| **Mobile Primary CTA Clicks (Add to Cart)** | 1,260 (2.1% CTR) | 2,220 (3.7% CTR) | **+76.2% CTR Lift** |
| **Mobile Cart-to-Checkout Rate** | 42.1% | 48.5% | **+15.2% Lift** |
| **Mobile Conversion Rate (CVR)** | 1.42% | 1.84% | **+29.6% CVR Lift** |
| **Average Revenue Per Visitor (RPV)** | $1.01 | $1.31 | **+29.7% RPV Lift** |
| **Monthly Mobile Revenue Impact** | Baseline | +$36,000 / month | **+$432,000 Annualized** |

### Key Behavioral Insight

By eliminating the 3-viewport scroll backtrack required to purchase, mobile shoppers who reached the customer review section converted at nearly double the rate of control users. The persistent price and 4.9-star rating badge inside the sticky bar served as continuous social proof while reading.
