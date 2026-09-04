# Customer Review & Rating Optimization Audit Checklist

Use this checklist to audit, optimize, and validate Product Detail Page (PDP) customer review sections, rating summary widgets, user-generated content (UGC) media galleries, search/filter controls, and compliance standards.

---

## 1. Above-the-Fold & PDP Integration

- [ ] **Clickable Star Anchor**: Is the star rating near the product title hyperlinked to the review section (`href="#reviews"`)?
- [ ] **Review Count & Score Display**: Is the total review count and average numerical rating (e.g., "4.8 ★ (248 reviews)") explicitly visible above the fold?
- [ ] **Recommendation Percentage**: Is a recommendation callout shown if high (e.g., "95% of buyers recommend this product")?
- [ ] **Keyboard Accessibility**: Can keyboard users focus on the above-the-fold review link and hit `Enter` to jump directly to the review section?
- [ ] **Zero-Review State**: If a product has 0 reviews, is the rating UI gracefully formatted (e.g., "Be the first to write a review") without showing broken or empty star graphics?

---

## 2. Review Summary Hero & Histogram Breakdown

- [ ] **Interactive Star Distribution Bar Chart**: Does the review summary display a 5-star to 1-star bar chart showing the exact count and percentage of reviews per tier?
- [ ] **Click-to-Filter Bars**: Clicking on any star bar (e.g., 3-star bar) instantly filters the review feed to only show reviews of that rating level.
- [ ] **Category-Specific Attribute Meters**: Are structured sliders or rating bars configured for category dimensions?
  - Apparel/Footwear: Fit (Runs Small ↔ True to Size ↔ Runs Large), Comfort, Quality.
  - Beauty/Skincare: Skin Type (Dry/Oily/Combo), Age Range, Skin Concern, Shade Match.
  - Electronics/Home: Assembly Ease, Durability, Battery Life, Value for Money.
- [ ] **Actionable Fit Guidance**: If fit attribute data shows a strong skew (e.g., >60% say "Runs Small"), is a prominent guidance callout displayed above the size selector?

---

## 3. UGC Photo & Video Gallery

- [ ] **Customer Media Gallery Strip**: Is a dedicated row or grid of customer-submitted photos/videos displayed above the written text review feed?
- [ ] **Interactive Lightbox Modal**: Does clicking a customer photo open a full-screen lightbox modal displaying:
  - High-resolution customer image/video.
  - Corresponding review text, headline, and star score.
  - Reviewer attributes (e.g., height, weight, size purchased, color variant).
  - Direct "Add to Cart" or variant selection tag if applicable.
- [ ] **Media Upload CTA**: Is there a clear button for verified buyers to upload their own photos/videos during review submission?
- [ ] **Content Moderation & Safety**: Are UGC uploads filtered for inappropriate content without suppressing legitimate unedited product photos?

---

## 4. Search, Filtering, and Sorting Controls

- [ ] **In-Review Search Bar**: Is there a real-time search input allowing shoppers to search reviews by custom keywords (e.g., "warmth", "pockets", "sensitive skin")?
- [ ] **Dynamic Keyword Pill Chips**: Are automatically extracted high-frequency keyword chips displayed for instant filtering (e.g., `[Comfortable (84)]`, `[Sizing (42)]`, `[Quality (31)]`)?
- [ ] **Multi-Dimension Filtering**: Can users filter reviews by:
  - Rating (5, 4, 3, 2, 1 Stars)
  - Verified Buyer Status
  - Product Variant (Color, Size, Style)
  - Customer Attributes (Height, Build, Skin Type, Use Case)
  - Has Photos / Videos
- [ ] **Sort Priority Dropdown**: Are standard sorting options provided:
  - Default: **Most Helpful** (weighted by community votes and verified status).
  - Most Recent
  - Highest Rating
  - Lowest Rating

---

## 5. Individual Review Cards & Trust Badges

- [ ] **Verified Buyer Badge**: Is a prominent `✓ Verified Buyer` badge displayed on reviews verified through order management systems?
- [ ] **Reviewer Demographics & Metadata**: Does each card display relevant buyer attributes (Name/Initial, Purchase Date, Variant Purchased, Location, Height/Weight/Skin Type)?
- [ ] **Variant Purchased**: Is the exact SKU variant purchased (e.g., "Color: Charcoal / Size: Medium") explicitly stated on the review card?
- [ ] **Helpfulness Voting**: Are "Was this review helpful? [Yes (12)] [No (1)]" buttons available on every review?
- [ ] **Pinned Helpful Comparison**: Are the "Most Helpful Favorable Review" and "Most Helpful Critical Review" highlighted side-by-side at the top of the feed for high-volume SKUs?
- [ ] **Merchant Response Block**: Are official merchant support replies styled cleanly underneath critical reviews, displaying company badge, response date, and resolution?

---

## 6. SEO, Performance, and Compliance

- [ ] **Structured Data (JSON-LD)**: Is valid `Product` and `AggregateRating` schema embedded in the page source for search engine rich snippets?
  ```json
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Alpine Expedition Parka",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "248"
    }
  }
  ```
- [ ] **FTC & EU Omnibus Compliance**:
  - [ ] Are negative (1–3 star) reviews published without suppression?
  - [ ] Are incentivized reviews (e.g., free sample, sweepstakes entry) clearly labeled (e.g., *"Incentivized Review"* / *"Received Free Product"* )?
  - [ ] Is there full disclosure regarding how verified buyer badges are earned?
- [ ] **Mobile Layout & Script Performance**:
  - [ ] Are review images lazy-loaded with proper `width`/`height` attributes to prevent Cumulative Layout Shift (CLS)?
  - [ ] Is initial review widget JS deferred or server-side rendered to protect LCP and INP performance?
  - [ ] Is review list paginated or capped at 5 reviews on mobile with a "Load More Reviews" button?
  - [ ] Are touch targets for filter pills and helpfulness buttons at least 44×44px?
