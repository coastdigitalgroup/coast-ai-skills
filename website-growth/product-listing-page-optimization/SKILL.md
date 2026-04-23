---
name: product-listing-page-optimization
description:
  Audit and optimize e-commerce Product Listing Pages (PLPs) and category pages
  to improve product discovery and click-through rates (CTR) to product detail
  pages. Trigger this skill when category pages have high bounce rates or low
  progression to PDPs.
---

# Product Listing Page Optimization

## Purpose

The Product Listing Page Optimization skill provides a framework for treating
category and search result pages as "Discovery Hubs" rather than mere grids of
items. It focuses on reducing interaction cost—the physical and mental effort
required to find a relevant product—by optimizing faceted search, product card
information density, and mobile navigation patterns.

## Use Cases

- E-commerce category pages with high traffic but low click-through rates (CTR)
  to products.
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
- **Static Content Landing Pages:** For single-offer or lead-gen pages, use
  `landing-page-content-hierarchy`.
- **Small Catalogs:** If a category has fewer than 10 items, complex filtering
  and discovery patterns may introduce unnecessary friction.

## Inputs

1. **Analytics Data:** CTR from PLP to PDP, filter usage rates, bounce rate by
   category, and "no results found" search queries.
2. **Catalog Metadata:** Available attributes for filtering (size, color, price,
   brand, rating, etc.).
3. **User Search Intent:** Common keywords and how they map to existing
   categories.
4. **Device Breakdown:** Understanding the percentage of mobile vs. desktop
   shoppers to prioritize layout strategies.

## Outputs

1. **PLP Discovery Audit:** Identification of friction points in the sorting,
   filtering, and scanning experience.
2. **Optimized Filter Strategy:** A prioritized list of facets and their default
   states (expanded vs. collapsed).
3. **Product Card Hierarchy:** Guidance on what information (price, badges,
   variants) to show in the grid view.
4. **Mobile Navigation Wireframe/Logic:** Optimized patterns for "Filter & Sort"
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

### 2. Faceted Search Optimization

Reduce the mental load of narrowing down the catalog.

- **The "3-Filter Rule":** On desktop, only expand the top 3 most relevant
  filters by default. Collapse the rest to prevent "Filter Fatigue."
- **Relevance Ranking:** Place filters in order of user importance (e.g., Size
  usually outranks Material).
- **Zero-Result Prevention:** Dynamically hide or gray out filter options that
  would result in zero products.

### 3. Product Card Hierarchy (The Entry Point)

- **Primary Action:** Determine if the card needs an "Add to Cart" button or if
  the goal is strictly "View Details."
- **Secondary Evidence:** Show variant indicators (e.g., color swatches) if they
  are key decision drivers.
- **Contextual Badging:** Use badges sparingly to highlight genuine urgency or
  relevance (e.g., "Limited Edition" or "Eco-Friendly").

### 4. Mobile Discovery Patterns

Mobile users have higher interaction costs for filtering.

- **Sticky Controls:** Keep "Filter" and "Sort" buttons accessible (usually
  sticky at the top or bottom).
- **Full-Screen Drawers:** Use high-contrast, full-screen overlays for filtering
  to maximize touch targets.
- **Applied Filter Visibility:** Always show which filters are currently active
  with "Clear All" or individual "X" tokens.

### 5. Sorting & Relevance

- **Default Sort:** Ensure the "Featured" or "Best Selling" default is actually
  relevant to the user's intent.
- **Intent-Based Sorting:** Provide clear options like "Price: Low to High,"
  "Newest," and "Top Rated."

## Decision Rules

- **The "3-Filter Rule":** Only keep 3 filter categories expanded by default on
  desktop.
- **Clarity over Volume:** If a product attribute (like "SKU number") doesn't
  help a user _choose_ between two items, remove it from the PLP card.
- **The "Fingertip" Rule:** Mobile filter targets must be at least 44px
  tall/wide.
- **Load More vs. Pagination:** Use "Load More" for discovery-heavy browsing
  (e.g., fashion) and Pagination for specific-intent browsing (e.g., technical
  parts).

## Common Failure Patterns

- **Overwhelming Filters:** Showing 15 expanded filter categories that push the
  products off the screen.
- **Missing Vital Info:** Forgetting to show price or star ratings in the grid
  view, forcing "pogo-sticking" (clicking back and forth between PLP and PDP).
- **Slow Filtering:** Page reloads on every filter click instead of using
  asynchronous (AJAX) updates.
- **Non-Persistent State:** Losing the user's scroll position or applied filters
  when they click "Back" from a PDP.
- **Poor Image Consistency:** Using mixed aspect ratios or background styles in
  the grid, which disrupts scanning.

## Validation Methods

- **CTR to PDP:** (Clicks to PDP / PLP Views) \* 100. Target a 15-25% relative
  improvement.
- **Filter Usage Rate:** Percentage of users who interact with at least one
  filter.
- **Pogo-sticking Rate:** Percentage of users who return to the PLP within 5
  seconds of clicking a product. A decrease indicates better information
  density.
- **Time to First Click:** How quickly users engage with a product after the PLP
  loads.
