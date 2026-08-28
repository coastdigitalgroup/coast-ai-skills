# Browse Abandonment Optimization: Before & After Case Study

## Executive Summary

An online DTC footwear & apparel brand, **Strata Performance**, experienced high Product Detail Page (PDP) traffic but saw a steep drop-off before items were ever added to the shopping cart. Despite strong ad relevance and product interest, 87.4% of PDP sessions ended in abandonment without an "Add to Cart" action.

By applying the **Browse Abandonment Optimization** skill, Strata Performance replaced generic exit popups and static PDP elements with real-time browse intent tracking, context-specific micro-nudges (size fit assurances, price drop alert captures), and sticky mobile session docks.

---

## The Problem (Before Optimization)

### Baseline PDP Metrics

- **Monthly Unique PDP Visitors:** 180,000
- **Browse-to-Cart Conversion Rate (BTCR):** 12.6% (22,680 Add to Carts)
- **PDP Bounce / Abandonment Rate:** 87.4%
- **Mobile PDP BTCR:** 9.2%
- **Anonymous Session Re-engagement Rate:** < 1.0%

### Root Cause Diagnosis

1. **Abrupt Exit Vector Lockout:** Visitors who spent over 60 seconds cycling through shoe colorways and selecting sizes encountered no session continuity tools when moving their cursor to exit. The site relied on a aggressive, site-wide 10% welcome popup that fired immediately upon entry, which 94% of users closed immediately.
2. **Size & Fit Uncertainty:** The size selector had no inline fit guidance. Users who clicked between sizes Medium and Large frequently paused for >15 seconds before bouncing due to fear of ordering the wrong fit.
3. **Mobile Scroll Fatigue:** On mobile viewports, after users scrolled down to read reviews or material specifications, the primary "Add to Cart" CTA vanished off-screen. Re-scrolling up to purchase created visual friction.
4. **Tab Switch Context Loss:** Shoppers opening 4 competing tab options lost track of Strata's PDP, resulting in abandoned background tabs.

---

## The Optimization (After Strategy)

### Key Interventions Applied

1. **Replaced Generic Entry Popup with Intent-Based Browse Drawer:**
   - Suppressed the immediate entry welcome modal on PDPs.
   - Introduced a low-friction slide-over drawer triggered only when a visitor achieved a **Browse Intent Score (BIS) $\ge$ 5** (e.g., spent >45s on page, viewed $\ge 3$ images, selected a size variant) and exhibited an exit vector.
   - *Copy:* "Still deciding on the TrailGrip Pro in Slate Grey? Enter your email to save your configured size [Size 10] and get instant price drop alerts."
2. **Inline Fit Assurance Micro-Nudge:**
   - Added dynamic fit telemetry above the size buttons: "89% of runners report True to Size fit. [View 1-Tap Fit Chart]".
3. **Mobile Sticky Mini-Dock:**
   - Implemented an animated bottom bar that smoothly docked when the main CTA scrolled out of view. Displayed SKU thumbnail, active size selection, price ($140), and a high-contrast 1-tap "Add to Cart" button.
4. **Tab Focus Loss Re-Engagement:**
   - Updated document title dynamically when visibility switched to hidden: "👟 Saved: TrailGrip Pro (Size 10)". On refocussing, displayed a subtle top toast banner confirming active stock reservation for 15 minutes.

---

## Results & Measurable Outcome

After a 30-day A/B test split (50% Control PDP vs. 50% Optimized Browse Recovery PDP across 180,000 visitors):

| Metric | Before (Control) | After (Optimized) | Net Change |
| :--- | :--- | :--- | :--- |
| **Browse-to-Cart Rate (BTCR)** | 12.6% | **16.9%** | **+34.1% relative lift** (+4.3 pts) |
| **Mobile PDP BTCR** | 9.2% | **13.8%** | **+50.0% relative lift** (+4.6 pts) |
| **Browse Recovery Drawer Engagement** | N/A (0%) | **11.4%** | Captured 6,150 high-intent emails/mo |
| **Saved Session Return Rate** | < 1.0% | **21.3%** | 1,310 returning purchases within 7 days |
| **Monthly Add to Cart Volume** | 22,680 | **30,420** | **+7,740 additional carts / month** |
| **Estimated Monthly Revenue Impact** | Baseline | **+$162,500** | Based on 35% Checkout Completion Rate @ $60 AOV |

---

## Key Takeaways

1. **Context Trumps Discounts:** Giving users a frictionless way to save their exact selected variant (size/color) converted 3x better than firing generic site-wide discount popups.
2. **Eliminating Mobile Scroll Friction Delivers Immediate Wins:** Keeping an active mini-CTA docked on mobile recovered high-intent impulse buyers who previously abandoned after reading reviews.
3. **Behavioral Telemetry Prevents Spam:** Waiting for explicit high-intent signals (BIS $\ge 5$) ensured that low-intent bounce traffic was never annoyed by intrusive UI elements.
