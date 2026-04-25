---
name: product-listing-page-optimization
description:
  Audit and optimize e-commerce Product Listing Pages (PLPs) and category pages
  to reduce discovery friction, improve product-to-PDP click-through rates, and
  maximize Add-to-Cart (ATC) from the listing. Trigger this skill when category
  pages have high bounce rates or when users struggle to find specific products
  within a large catalog.
---

# Product Listing Page (PLP) Optimization

## Purpose

The Product Listing Page (PLP) Optimization skill provides a systematic
framework for treating category and search result pages as "Discovery Hubs"
rather than mere grids of items. While the homepage sets the brand and the
Product Detail Page (PDP) closes the sale, the PLP is the critical middle of the
funnel. It focuses on reducing "Interaction Cost"—the physical and mental effort
required to find a relevant product—by optimizing faceted search, product card
information density, and mobile navigation patterns.

## Use Cases

- E-commerce category pages with high traffic but low click-through rates (CTR)
  to products.
- Large catalogs where users are overwhelmed by choice (Choice Paralysis).
- Search result pages where users frequently bounce or perform multiple
  successive searches.
- Mobile shoppers struggling to navigate large catalogs with complex filtering
  needs.
- Seasonal or promotional landing pages that aggregate various product types.

## When NOT to Use

- **Product Detail Pages (PDPs):** These focus on conversion for a specific
  item. Use `product-page-optimization`.
- **Checkout Flows:** Once a user has selected an item, use
  `checkout-flow-optimization`.
- **Single-Product Sites:** If you only sell one thing, you don't need a PLP.
- **Brand Story Pages:** Pages focused on "About Us" or "Our Mission" where
  product discovery is not the primary goal.
- **Small Catalogs:** If a category has fewer than 10 items, complex filtering
  and discovery patterns may introduce unnecessary friction.

## Inputs

1. **Analytics Data:** CTR from PLP to PDP, filter usage rates, bounce rate by
   category, and "no results found" search queries.
2. **Catalog Metadata:** Available attributes for filtering (size, color, price,
   brand, rating, etc.).
3. **User Intent Data:** Common keywords, top search terms, and how they map to
   existing categories.
4. **Device Breakdown:** Understanding the percentage of mobile vs. desktop
   shoppers to prioritize layout strategies.

## Outputs

1. **PLP Discovery Audit:** Identification of friction points in the sorting,
   filtering, and scanning experience.
2. **Optimized Filter & Sort Strategy:** A prioritized list of facets and their
   default states (expanded vs. collapsed).
3. **Product Card Hierarchy:** Guidance on what information (price, badges,
   variants) to show in the grid view.
4. **Navigation & Pagination Strategy:** Recommendations for "Load More,"
   Infinite Scroll, or Pagination.
5. **Mobile Navigation Wireframe/Logic:** Optimized patterns for "Filter & Sort"
   drawers or sticky controls.

## Workflow

### 1. The Scannability Audit

Evaluate how quickly a user can identify the right product without clicking.

- **Information Density:** Does the product card contain the "Minimum Viable
  Info" (Title, Price, Star Rating, Primary Image)?
- **Visual Noise:** Are there too many badges (e.g., "New", "Sale", "Best
  Seller") competing for attention?
- **Consistency:** Ensure all cards in the grid follow the same layout to
  support rapid scanning.
- **The 3-Click Rule:** Can a user find a relevant product within 3 clicks from
  the entry point?

### 2. Optimize Choice Architecture (Filtering & Sorting)

Reduce the mental load of narrowing down the catalog.

- **The "3-Filter Rule":** On desktop, only expand the top 3 most relevant
  filters by default. Collapse the rest to prevent "Filter Fatigue."
- **The "High-Intent" Facets:** Place the filters that matter most (e.g., "Size"
  for apparel, "Compatibility" for tech) at the very top.
- **Faceted Search:** Ensure filters update the results in real-time (AJAX)
  without a full page reload.
- **Zero-Result Prevention:** Dynamically hide or gray out filter options that
  would result in zero products.
- **Smart Sorting:** Default to "Best Sellers" or "Top Rated" rather than
  alphabetical. Include a "New Arrivals" sort to reward repeat visitors.

### 3. Product Card Hierarchy (The Entry Point)

Balance visual appeal with the data needed to make a "click" decision.

- **Essential Data:** Title, Price, Star Rating, and "Hero" Image.
- **Primary Action:** Determine if the card needs an "Add to Cart" button or if
  the goal is strictly "View Details."
- **Decision Triggers:** Show "Low Stock" badges, "Sustainable" labels, or
  variant swatches (color/size) directly on the card.
- **Secondary Actions:** Include a "Quick Add" or "Quick View" button for
  standardized products to reduce the path to conversion.

### 4. Mobile Discovery Patterns

Mobile users have higher interaction costs for filtering.

- **Sticky Controls:** Keep "Filter" and "Sort" buttons accessible (usually
  sticky at the top or bottom).
- **Full-Screen Drawers:** Use high-contrast, full-screen overlays for filtering
  to maximize touch targets.
- **Applied Filter Visibility:** Always show which filters are currently active
  with "Clear All" or individual "X" tokens.
- **Image Aspect Ratios:** Use consistent aspect ratios (e.g., 4:5 or 1:1) to
  prevent "jumpy" layouts.

### 5. Review Against Decision Rules

Verify the proposed changes against the PLP growth heuristics.

## Decision Rules

- **The "3-Filter Rule":** Only keep 3 filter categories expanded by default on
  desktop.
- **No Dead Ends:** Never allow a filter combination to show a blank page
  without providing a clear way to reset or view related items.
- **Clarity over Volume:** If a product attribute (like "SKU number") doesn't
  help a user _choose_ between two items, remove it from the PLP card.
- **Price Transparency:** Always show the final price (and any discounts)
  clearly on the PLP card. Never hide the price behind a click.
- **The "Fingertip" Rule:** Mobile filter targets must be at least 44px
  tall/wide.
- **Load More vs. Pagination:** Use "Load More" for discovery-heavy browsing
  (e.g., fashion) and Pagination for specific-intent browsing (e.g., technical
  parts).

## Common Failure Patterns

- **The Hidden Filter:** Putting all discovery tools behind a single "Filter"
  button on desktop, increasing interaction cost.
- **Overwhelming Filters:** Showing 15 expanded filter categories that push the
  products off the screen.
- **Missing Vital Info:** Forgetting to show price or star ratings in the grid
  view, forcing "pogo-sticking" (clicking back and forth between PLP and PDP).
- **Unhelpful Sorting:** Defaulting to "Price: Low to High," which often shows
  low-value accessories or out-of-stock items first.
- **Slow Filtering:** Page reloads on every filter click instead of using
  asynchronous (AJAX) updates.
- **Non-Persistent State:** Losing the user's scroll position or applied filters
  when they click "Back" from a PDP.
- **Poor Image Consistency:** Using mixed aspect ratios or background styles in
  the grid, which disrupts scanning.

## Validation Methods

- **CTR to PDP:** (Clicks to PDP / PLP Views) \* 100. Target a 10-25% relative
  improvement.
- **Add-to-Cart (ATC) from PLP:** If using "Quick Add," measure the increase in
  direct-to-cart conversions.
- **Filter Engagement Rate:** Percentage of users who interact with at least one
  filter.
- **Pogo-sticking Rate:** Percentage of users who return to the PLP within 5
  seconds of clicking a product. A decrease indicates better information
  density.
- **Time to First Click:** How quickly users engage with a product after the PLP
  loads.
- **Search-to-Product Transition:** Measure if users find products faster via
  search-driven PLPs.
