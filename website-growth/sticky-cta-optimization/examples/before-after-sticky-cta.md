# Before-and-After Scenario: Sticky CTA Optimization

## Overview

**Company:** ApexGlow Outdoors (Direct-to-Consumer Outdoor Equipment)
**Target Page:** Apex Titan Bivouac Tent Product Detail Page (Mobile PDP)
**Problem:** High mobile traffic (72% of total visitors), but mobile conversion rate was lagging desktop by 44%. Heatmaps showed visitors scrolled deep into the 6-viewport long PDP reading technical specs, customer photo reviews, and weather ratings, but only 18% scrolled all the way back up to tap the single "Add to Cart" button in the hero section.

---

## BEFORE Optimization

### State & User Experience
- **CTA Setup:** Single "Add to Cart" button located in the Hero section above the fold.
- **Page Length:** 6.2 screen viewports on mobile (containing photo galleries, dimensional specs, wind tunnel test results, 140+ reviews, and Q&A).
- **Mobile Behavior:** Once users scrolled past the hero section (past viewport 1), no CTA was visible. Users who decided to buy after reading reviews in viewport 4 had to manually scroll up 3 full screen heights.
- **Overlay Conflicts:** A floating live chat widget sat in the bottom-right corner (`bottom: 16px; right: 16px;`).

### Baseline Performance Metrics
- **Mobile Conversion Rate:** 1.42%
- **Mobile Add-to-Cart Rate:** 3.8%
- **Mobile Cart Abandonment from Deep Scroll:** 62% drop-off among visitors who scrolled past 50% depth without converting.

---

## AFTER Optimization

### Strategy & Implementation
1. **Scroll-Triggered Mobile Sticky Bottom Dock:**
   - Implemented an `IntersectionObserver` on the hero "Add to Cart" button.
   - When the main button scrolled off-screen, a 64px mobile bottom dock smoothly slid up (`transform: translateY(0)`).
2. **Anatomy of the Sticky Bar:**
   - **Left side:** Product title ("Titan Bivouac") + real-time price (`$299`) + rating badge (`★ 4.9`).
   - **Right side:** High-contrast primary "Add to Cart" button (48px height, full thumb target).
   - **Contextual Sync:** If the user selected a different tent color/size variant on the page, the price and variant in the sticky bar instantly updated.
3. **Collision & Viewport Protections:**
   - **Chat Widget Auto-Offset:** Shifted the live chat bubble up to `bottom: 80px` when the sticky bar was active.
   - **Footer Padding:** Added `padding-bottom: 80px` to the PDP main layout so the fixed bar never overlapped the footer links or cross-sell recommendations.
   - **Virtual Keyboard Hiding:** Added event listener on form inputs to temporarily hide the sticky bar when mobile keypads opened.

### Layout Spec (Mobile Bottom Dock)

```text
+-------------------------------------------------------------+
|                                                             |
|  [ Content: Wind Tunnel Test Results & Customer Reviews ]   |
|                                                             |
+-------------------------------------------------------------+
| STICKY BOTTOM DOCK (Height: 64px, Z-Index: 100)             |
|                                                             |
|  Titan Bivouac Tent      [ $299 ]    [ ADD TO CART - $299 ] |
|  ★ 4.9 (142 reviews)                                        |
+-------------------------------------------------------------+
```

---

## Results & Measurable Outcome

| Metric | Before Optimization | After Optimization | Lift / Impact |
| :--- | :--- | :--- | :--- |
| **Mobile Add-to-Cart Rate** | 3.8% | **5.9%** | **+55.2% relative lift** |
| **Mobile Overall Conversion Rate** | 1.42% | **2.08%** | **+46.4% relative lift** |
| **Sticky CTA Click Contribution** | N/A | **34.2%** | **34.2% of all ATCs originated from the sticky bar** |
| **Deep-Scroll Exit Rate** | 41.5% | **28.1%** | **-32.3% reduction in abandoned deep sessions** |

### Key Takeaway
Keeping the primary purchasing action continuously accessible in the mobile thumb-zone as users evaluated deep product information eliminated scroll friction and converted reader intent into immediate purchase action.
