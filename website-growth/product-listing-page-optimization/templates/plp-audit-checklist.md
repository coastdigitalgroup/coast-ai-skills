# Product Listing Page (PLP) Audit Checklist

Use this checklist to evaluate the effectiveness of any category or listing
page.

## 1. Interaction Cost & Filtering

- [ ] **The 3-Filter Rule:** Are only the top 3 most relevant filters expanded
      by default?
- [ ] **Filter Relevance:** Are "Zero Result" filter options hidden or disabled?
- [ ] **Active State:** Are applied filters clearly visible as "pills" or tags
      that can be removed individually?
- [ ] **Clear All:** Is there a single-click "Clear All" action for filters?
- [ ] **Mobile Access:** Is the filter trigger easily reachable (e.g., sticky
      button or prominent top placement)?

## 2. Product Card Information Density (Three-Point Rule)

- [ ] **Visual Anchor:** Does the image clearly represent the product and its
      primary use case?
- [ ] **Price Clarity:** Is the price visible immediately without interaction?
- [ ] **Rating/Proof:** Is there a star rating or "Best Seller" badge for
      high-performing items?
- [ ] **Availability:** Are "Out of Stock" items clearly labeled or moved to the
      end of the list?
- [ ] **Variant Preview:** If the product has multiple colors/patterns, are they
      indicated on the card (e.g., color swatches)?

## 3. Discovery & Layout

- [ ] **Mobile Grid:** Does the mobile view show at least 1.5 to 2 products in
      the first viewport?
- [ ] **Pogo-Sticking Check:** Do cards contain enough info to prevent
      "accidental" clicks?
- [ ] **Loading Pattern:** Is "Load More" used instead of infinite scroll (to
      preserve footer access and state)?
- [ ] **Content Injection:** Are there non-product tiles (educational or
      trust-based) to break up grid fatigue?

## 4. Technical Performance

- [ ] **Layout Shift (CLS):** Do product cards have defined aspect ratios to
      prevent jumping during image load?
- [ ] **Filter Speed:** Do filters apply instantly (AJAX) or require a full page
      reload? (Prefer AJAX for low friction).
