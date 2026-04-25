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
framework for refining the middle of the e-commerce funnel. While the homepage
sets the brand and the Product Detail Page (PDP) closes the sale, the PLP is the
"discovery hub." It focuses on reducing "Interaction Cost" by making filtering,
sorting, and product comparison effortless. By optimizing information density
and navigation, this skill directly improves product findability and overall
conversion rates.

## Use Cases

- Category pages with high bounce rates or low average time-on-page.
- Large catalogs where users are overwhelmed by choice (Choice Paralysis).
- Search results pages with low click-through rates (CTR) to products.
- Mobile commerce experiences where vertical scrolling is the primary discovery
  method.

## When NOT to Use

- **Product Detail Pages (PDPs):** These focus on individual product conversion.
  Use `product-page-optimization`.
- **Checkout Flows:** Once the intent to buy is established, use
  `checkout-flow-optimization`.
- **Single-Product Sites:** If you only sell one thing, you don't need a PLP.
- **Brand Story Pages:** Pages focused on "About Us" or "Our Mission" where
  product discovery is not the primary goal.

## Inputs

1. **Category Analytics:** Bounce rate, PDP click-through rate (CTR), and filter
   usage data.
2. **Catalog Metadata:** Available attributes for filtering (size, color, price,
   specs).
3. **User Intent Data:** Top search terms and common "wayfinding" questions from
   support.
4. **Current Mobile vs. Desktop Split:** How many users are browsing on small
   screens?

## Outputs

1. **PLP Friction Audit:** Identification of technical and cognitive barriers to
   finding products.
2. **Optimized Filter & Sort Strategy:** A logical hierarchy of facets and
   sorting options.
3. **Product Card Design Guidance:** Revised information architecture for the
   individual grid items.
4. **Navigation & Pagination Strategy:** Recommendations for "Load More,"
   Infinite Scroll, or Pagination.

## Workflow

### 1. Audit the "Discovery Path"

Measure how many actions a user must take to find a specific product.

- **The 3-Click Rule:** Can a user find a relevant product within 3 clicks from
  the entry point?
- **Filter Visibility:** Are filters hidden behind a "Filter" button, or are the
  most important ones (Price, Size, Rating) visible immediately?
- **Zero Results Path:** What happens when a user filters too deeply? Is there a
  "Clear All" or "You might also like" fallback?

### 2. Optimize Choice Architecture (Filtering & Sorting)

- **The "High-Intent" Facets:** Place the filters that matter most (e.g., "Size"
  for apparel, "Compatibility" for tech) at the very top.
- **Faceted Search:** Ensure filters update the results in real-time (AJAX)
  without a full page reload.
- **Smart Sorting:** Default to "Best Sellers" or "Top Rated" rather than
  alphabetical. Include a "New Arrivals" sort to reward repeat visitors.

### 3. Refine Product Card Information Density

Balance visual appeal with the data needed to make a "click" decision.

- **Essential Data:** Title, Price, Star Rating, and "Hero" Image.
- **Decision Triggers:** Show "Low Stock" badges, "Sustainable" labels, or
  variant swatches (color/size) directly on the card.
- **Secondary Actions:** Include a "Quick Add" or "Quick View" button for
  standardized products to reduce the path to conversion.

### 4. Optimize for Mobile Discovery

- **Sticky Filters:** Ensure the "Filter & Sort" bar remains accessible as the
  user scrolls.
- **Image Aspect Ratios:** Use consistent aspect ratios (e.g., 4:5 or 1:1) to
  prevent "jumpy" layouts.
- **Tap Targets:** Ensure variant swatches and "Add to Cart" buttons are at
  least 44x44px.

### 5. Review Against Decision Rules

Verify the proposed changes against the PLP growth heuristics.

## Decision Rules

- **The 3-Filter Rule:** On desktop, at least the top 3 most-used filter
  categories must be expanded by default.
- **No Dead Ends:** Never allow a filter combination to show a blank page
  without providing a clear way to reset or view related items.
- **The "Scannability" Priority:** Use a grid layout (usually 2-col on mobile,
  3-4 on desktop) that allows the eye to compare prices and ratings quickly.
- **Price Transparency:** Always show the final price (and any discounts)
  clearly on the PLP card. Never hide the price behind a click.

## Common Failure Patterns

- **The Hidden Filter:** Putting all discovery tools behind a single "Filter"
  button on desktop, increasing interaction cost.
- **Unhelpful Sorting:** Defaulting to "Price: Low to High," which often shows
  low-value accessories or out-of-stock items first.
- **Information Overload:** Adding too many badges (New, Sale, Top Seller,
  Eco-friendly) to a single product card, creating visual noise.
- **Pagination Friction:** Using standard pagination (1, 2, 3...) for large
  catalogs on mobile instead of a "Load More" button.

## Validation Methods

- **PDP Click-Through Rate (CTR):** (Product Clicks / PLP Views) \* 100. Target:
  10-15% lift.
- **Add-to-Cart (ATC) from PLP:** If using "Quick Add," measure the increase in
  direct-to-cart conversions.
- **Filter Engagement Rate:** Percentage of users who interact with at least one
  filter.
- **Search-to-Product Transition:** Measure if users find products faster via
  search-driven PLPs.
