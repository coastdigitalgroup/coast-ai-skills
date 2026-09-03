# Review UX & Trust Heuristics Reference

This reference documents behavioral heuristics, cognitive psychology patterns, regulatory compliance rules, and UX guidelines for designing high-converting customer review and star rating experiences.

---

## 1. Behavioral Psychology & Cognitive Trust Patterns

### A. The "Perfect 5.0" Paradox (Uncanny Valley of Trust)
- **Heuristic:** Products with an average rating between **4.2 and 4.8 stars** convert significantly higher than products with a flawless 5.0 rating.
- **Cognitive Mechanism:** Shoppers expect real-world variability. A unbroken string of 5-star reviews triggers skepticism and suspicions of astroturfing or censorship.
- **Design Action:** Embrace authentic 3-star and 4-star reviews. Highlight constructive feedback and demonstrate how customer service resolves minor complaints.

### B. The Negative Review First Behavior (Risk Mitigation)
- **Heuristic:** Over 80% of high-intent shoppers actively seek out negative (1, 2, or 3-star) reviews before completing a purchase.
- **Cognitive Mechanism:** Consumers engage in loss aversion: they want to identify the "worst-case scenario" to determine if potential flaws (e.g., "zipper is stiff", "takes 2 weeks to ship") are dealbreakers for their personal use case.
- **Design Action:** Make the 1-star and 2-star histogram bars interactive filter toggles. Never hide low ratings behind obscure menus.

### C. Similarity Bias in Social Proof
- **Heuristic:** Buyers assign significantly greater weight to reviews from individuals who share their physical dimensions, skin profile, or specific use case.
- **Cognitive Mechanism:** A general review ("Great jacket!") provides minimal decision utility compared to a peer match ("Fits my 6'2" broad-shoulder build perfectly with room for a sweater").
- **Design Action:** Implement structured customer attribute chips (Height, Build, Skin Type, Experience Level) and allow 1-click filtering by profile similarity.

---

## 2. Rating Distribution & Visual Hierarchy Standards

### A. The 3-Column Summary Header Structure
To maximize scanning efficiency, structure the review section header into three functional columns:

1. **Left Column (Aggregate Score):**
   - Large score numeral (e.g., `4.7` in 36px font).
   - Visual star graphic rendered with precise fractional fill (e.g., 4.7 stars = 70% filled 5th star).
   - Explicit review count + Recommendation percentage (`94% would recommend`).

2. **Center Column (Interactive Histogram):**
   - 5 horizontal bars representing 5, 4, 3, 2, and 1-star ratings.
   - Percentage fill bars with exact counts (e.g., `5 Star: 280 (81%)`).
   - Interactive hover/focus state indicating filter functionality.

3. **Right Column (Attribute Gauges):**
   - Visual slider scales summarizing key SKU dimensions:
     - *Fit:* `Runs Small ───●─── Runs Large`
     - *Comfort:* `Basic ───────● High`
     - *Durability:* `Standard ──────● Exceptional`

---

## 3. Regulatory & Legal Compliance Guidelines

### A. FTC Guidelines on Consumer Reviews (16 CFR Part 255)
- **Authenticity Requirement:** Merchants must not edit, manipulate, or misrepresent customer reviews. Removing negative reviews or cherry-picking only 5-star feedback violates FTC policy.
- **Incentivized Review Disclosure:** Any review written in exchange for a free sample, discount coupon, or sweepstakes entry must feature a prominent disclosure badge: `Incentivized Review` or `Received Free Product`.
- **Verified Buyer Verification:** `Verified Buyer` badges must only be applied to reviews matched against actual completed store order records.

### B. EU Consumer Rights Directive (Omnibus Directive)
- **Transparency Mandate:** Online sellers in the EU must inform consumers whether and how they ensure that published reviews originate from consumers who actually used or purchased the product.

---

## 4. Mobile Review UX & Touch Target Heuristics

### A. Touch-Friendly Filter Chips
- Filter chips must have a minimum height of **40px** and horizontal padding of **16px** to ensure effortless tapping on mobile touchscreens.
- Render filter chips in a single-row horizontally scrollable container with smooth momentum scrolling (`-webkit-overflow-scrolling: touch`) and subtle edge gradient fade indicating more options.

### B. Full-Screen Mobile Lightbox Modals
- When tapping customer photo thumbnails on mobile, open a dedicated touch-swipeable lightbox modal with:
  - High-res customer photo.
  - Pinch-to-zoom support.
  - Review text and reviewer attributes displayed below image.
  - Fixed bottom bar containing `[Select Size & Add to Cart]`.
