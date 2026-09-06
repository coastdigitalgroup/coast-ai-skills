# Customer Review & Rating Audit Checklist

This audit template provides a systematic framework for evaluating e-commerce review implementations, identifying friction points, verifying legal/FTC compliance, and scoring conversion-readiness across Product Detail Pages (PDPs).

---

## Audit Overview & Metadata

- **Store / Brand Name:** ________________________
- **Product Page Audited (URL):** ________________________
- **Product Category:** ________________________
- **Total Review Volume:** ________ | **Average Rating:** ________ / 5.0
- **Auditor Name:** ________________________
- **Audit Date:** ____ / ____ / ________

---

## Scoring Matrix & Summary Scorecard

Rate each checklist item using the following scale:
- **Pass (2 pts):** Fully implemented, high-contrast, frictionless, and conversion-optimized.
- **Partial (1 pt):** Present but sub-optimal (e.g., non-interactive, poor contrast, missing mobile optimization).
- **Fail (0 pts):** Completely missing or exhibiting dark patterns/usability barriers.

| Category | Max Score | Actual Score | Percentage (%) |
| :--- | :---: | :---: | :---: |
| **1. Above-the-Fold Buy-Box Micro-Proof** | 10 pts | ______ | ______% |
| **2. Review Summary Header & Histograms** | 12 pts | ______ | ______% |
| **3. Dimensional Attribute & Fit Meters** | 10 pts | ______ | ______% |
| **4. Search, Filter & Sorting UX** | 14 pts | ______ | ______% |
| **5. Individual Review Card Anatomy** | 16 pts | ______ | ______% |
| **6. User-Generated Visual Proof (UGC)** | 12 pts | ______ | ______% |
| **7. Post-Purchase Review Loop & Compliance**| 12 pts | ______ | ______% |
| **TOTAL SCORE** | **86 pts** | **______** | **______%** |

---

## Detailed Audit Items

### Section 1: Above-the-Fold Buy-Box Micro-Proof

- [ ] **1.1 Primary Star Anchor Visibility:** Star rating (e.g., `★★★★½ 4.7`) is prominently placed directly under or above the product title in high-contrast color.
- [ ] **1.2 Interactive Jump Link:** Clicking the star rating or review count text smoothly scrolls the viewport directly to the review section and auto-expands the widget if collapsed.
- [ ] **1.3 Review Count Display:** Total review count is explicitly shown alongside stars (e.g., `(1,420 reviews)`), avoiding vague badges.
- [ ] **1.4 Recommendation Percentage Micro-Badge:** Highlighting `90%+` recommendation rate near price (e.g., *"94% of buyers recommend this product"*).
- [ ] **1.5 Mobile Viewport Placement:** Stars and review count fit onto mobile viewport above the main CTA without forcing primary buy-box elements below the fold.

### Section 2: Review Summary Header & Histograms

- [ ] **2.1 Overall Rating Breakdown:** Clear, large display of numerical average (e.g., `4.7 / 5.0`) with total rating count.
- [ ] **2.2 Interactive Star Histogram:** Visual percentage bars for 5, 4, 3, 2, and 1-star reviews that act as instant filters when clicked.
- [ ] **2.3 Balanced Feedback Representation:** Realistic rating distribution displayed without hiding negative reviews or inflating scores.
- [ ] **2.4 Anchor Reviews (Side-by-Side):** Display of "Most Helpful Positive" and "Most Helpful Critical" reviews directly above the main list.
- [ ] **2.5 Recency Indication:** Display of review velocity (e.g., *"14 new reviews added this week"* or latest review date within past 30 days).
- [ ] **2.6 Clear Write-A-Review CTA:** Visible "Write a Review" button allowing customers to submit feedback directly from the PDP.

### Section 3: Dimensional Attribute & Fit Meters

- [ ] **3.1 Aggregated Fit Scale:** Visual slider showing whether items run small, true to size, or large (critical for apparel/footwear).
- [ ] **3.2 Key Attribute Breakdown:** 5-point meters for category-specific attributes (e.g., *Comfort*, *Durability*, *Quality*, *Battery Life*).
- [ ] **3.3 Explicit Fit Advice Callout:** Summary text statement providing actionable guidance (e.g., *"88% of customers report this runs true to size. Order your normal size."*).
- [ ] **3.4 Category Customization:** Attribute meters match the specific product category (e.g., *Coverage/Finish* for beauty, *Ease of Assembly* for furniture).
- [ ] **3.5 Sample Size Transparency:** Clear display of how many reviewers contributed to attribute meter scores (e.g., *"Based on 450 verified buyer responses"*).

### Section 4: Search, Filter & Sorting UX

- [ ] **4.1 In-Widget Keyword Search Bar:** Functional search box allowing users to query reviews for specific terms (e.g., *"wide feet"*, *"battery life"*).
- [ ] **4.2 Buyer Attribute / Demographic Filters:** Dropdown filters enabling buyers to match reviewer profiles (e.g., *Height*, *Weight*, *Size Purchased*, *Age Group*).
- [ ] **4.3 Star Rating Filters:** Ability to filter reviews by exact star count (e.g., isolate 3-star reviews).
- [ ] **4.4 Visual Proof Filter Toggle:** Dedicated toggle or button to show only reviews containing customer photos or videos.
- [ ] **4.5 Verified Buyer Filter Toggle:** Option to filter strictly for verified purchases.
- [ ] **4.6 Sorting Options:** Clear sort dropdown supporting *Most Recent*, *Highest Rating*, *Lowest Rating*, and *Most Helpful*.
- [ ] **4.7 Mobile Filter Drawer:** On mobile devices, filters condense into an easy-to-use sticky drawer or bottom sheet.

### Section 5: Individual Review Card Anatomy

- [ ] **5.1 Verified Buyer Badge:** Clear visual badge (`✓ Verified Buyer` or `✓ Verified Purchase`) on confirmed customer reviews.
- [ ] **5.2 Reviewer Metadata Display:** Reviewer name, location, and relevant specs (e.g., *"Purchased Size: M | Fits: True to Size"*) displayed in card header.
- [ ] **5.3 Scannable Title & Headline:** Bold, prominent headline for each review capturing main sentiment.
- [ ] **5.4 Bold Key Phrase Highlighting:** Critical quotes or key sentiment text visually emphasized or formatted for fast scanning.
- [ ] **5.5 Helpful / Unhelpful Voting Buttons:** Functional "Was this review helpful? [Yes] [No]" buttons with live vote counts.
- [ ] **5.6 Official Merchant Response:** Cleanly styled brand response boxes addressing customer issues or thanking reviewers professionally.
- [ ] **5.7 Incentive Disclosure Badge:** Automatic badge (`Received Free Product` or `Incentivized Review`) on incentivized or gifted reviews.
- [ ] **5.8 Review Date Display:** Clear timestamp showing when the review was submitted.

### Section 6: User-Generated Visual Proof (UGC)

- [ ] **6.1 Customer Photo & Video Gallery Grid:** Dedicated visual grid showcasing real customer photos/videos at top of review section.
- [ ] **6.2 Modal Lightbox Expansion:** Clicking any customer thumbnail opens a full-screen or enlarged lightbox modal with high-res image and associated review text.
- [ ] **6.3 Direct PDP Gallery Integration:** Top customer photos cross-tagged and visible within the primary PDP image slider.
- [ ] **6.4 Mobile Gesture Support:** UGC modal supports swipe gestures and pinch-zoom on touch devices.
- [ ] **6.5 Media Performance Optimization:** Customer images lazy-loaded and served in WebP/AVIF formats to preserve page speed.
- [ ] **6.6 Customer Video Playback:** Uploaded videos feature mute controls, inline playback, and low buffering.

### Section 7: Post-Purchase Review Loop & Compliance

- [ ] **7.1 Delivery-Triggered Timing:** Review request communications triggered by package carrier delivery confirmation rather than order creation date.
- [ ] **7.2 Zero Review Gating (FTC Compliance):** Review submission flow open to all buyers without filtering negative feedback to support channels.
- [ ] **7.3 In-Email Rating Capture:** Single-click star selection inside email to minimize submission friction.
- [ ] **7.4 Photo/Video Request Prompts:** Explicit callout encouraging media attachments during submission.
- [ ] **7.5 Transparent Incentive Terms:** Incentives offered uniformly to all reviewers regardless of rating score (5-star or 1-star).
- [ ] **7.6 Automated Fraud & Spam Suppression:** Machine-learning or validation rules filtering spam, profane content, or competitor attacks without censoring genuine negative reviews.

---

## Priority Recommendations & Action Plan

Identify top 3 critical fixes based on lowest section scores:

1. **Immediate High-Impact Fix:** __________________________________________________
2. **Medium-Term UX Optimization:** __________________________________________________
3. **Post-Purchase Loop Adjustment:** __________________________________________________
