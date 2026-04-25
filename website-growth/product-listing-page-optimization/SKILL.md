---
name: product-listing-page-optimization
description:
  Audit and optimize Product Listing Pages (PLPs) and category pages to improve
  discovery, reduce interaction cost, and increase click-through rates (CTR) to
  Product Detail Pages (PDPs). Trigger this skill when users exhibit
  "pogo-sticking" behavior or when category pages have high bounce rates.
---

# Product Listing Page Optimization

## Purpose

The Product Listing Page Optimization skill provides a protocol for transforming
static category pages into high-performance discovery hubs. It focuses on
reducing the "Interaction Cost" of finding the right product through faceted
search optimization, product card information density, and mobile discovery
patterns. By ensuring users can make informed decisions without constant
back-and-forth between the PLP and PDP, this skill directly improves session
efficiency and downstream conversion rates.

## Use Cases

- E-commerce category pages with high traffic but low CTR to product pages.
- Large catalogs where users struggle to find specific items through navigation.
- Mobile shoppers experiencing high "pogo-sticking" (clicking back within 5
  seconds).
- Seasonal sales or "New Arrivals" pages that require rapid scanning.

## When NOT to Use

- **Product Detail Pages (PDPs):** Use `product-page-optimization` for
  single-product conversions.
- **Search Result Pages (zero results):** These require "Null Search" recovery
  strategies.
- **Single-Product Landing Pages:** Use `hero-section-optimization` or
  `landing-page-content-hierarchy`.
- **Checkout/Cart:** Use `checkout-flow-optimization`.

## Inputs

1. **Category Analytics:** Bounce rate, CTR to PDP, and "Pogo-sticking" rate.
2. **Filter Usage Data:** Which filters are used most (and least).
3. **User Intent:** Are users "browsing" (discovery) or "hunting" (specific
   item)?
4. **Competitor Layouts:** How do market leaders handle similar product
   densities?
5. **Mobile vs. Desktop Split:** How many users are navigating via touch.

## Outputs

1. **PLP Friction Audit:** Identification of discovery blockers and information
   gaps.
2. **Optimized Faceted Search Map:** Selection of the most effective filters and
   their priority.
3. **Product Card Hierarchy:** Defined data points for the "Three-Point Rule" on
   cards.
4. **Mobile Discovery Protocol:** Implementation of full-screen drawers or
   persistent UI for filters.

## Workflow

### 1. Identify Discovery Friction

Analyze how users interact with the list. Look for the "Pogo-Sticking
Heuristic": if users return to the PLP within 5 seconds of clicking a product,
the card lacked the necessary information for an informed click.

- **Action:** Identify what data was missing (price, size availability, color
  options, ratings).

### 2. Optimize Faceted Search (Filters)

Reduce the cognitive load of narrowing down the selection.

- **Apply the 3-Filter Rule:** On desktop, expand only the top three most used
  filters by default. Collapse the rest.
- **Dynamic Relevance:** Show only filters that have results for the current
  view.
- **Selection Visibility:** Ensure active filters are clearly displayed and
  easily removable with a "Clear All" option.

### 3. Establish Card Hierarchy (The Three-Point Rule)

Each product card must provide three critical entry points:

1. **The Anchor (Visual):** High-quality product image that shows the item
   clearly.
2. **The Context (Metadata):** Essential info (Title, Brand, Price, Star
   Rating).
3. **The Target (Primary Action):** A clear path to the PDP or a quick "Add to
   Cart/Wishlist" button.

### 4. Optimize for Mobile Discovery

Mobile screens have limited space; the layout must prioritize navigation over
volume.

- **The Filter Drawer:** Use a full-screen drawer for filters to manage
  complexity.
- **Visual Feedback:** Show the number of results that will be returned on the
  "Apply Filters" button.
- **Infinite Scroll vs. Pagination:** Use "Load More" to maintain state and
  avoid the layout shifts of infinite scroll or the friction of traditional
  pagination.

### 5. Content Injection

Break the "Grid Fatigue" by injecting non-product content.

- **Educational Tiles:** Add a card that explains a feature or a "How to Choose"
  guide within the grid.
- **Trust Signals:** Inject a social proof tile (e.g., "Top Rated by 500+
  Users").

## Decision Rules

- **Information Density:** If the product is technical (electronics), prioritize
  specs on the card. If visual (fashion), prioritize large imagery.
- **The "Fold" Heuristic:** On mobile, at least two full product cards (in a
  2-column grid) should be visible or partially visible in the first view.
- **Filter Accessibility:** Use a "Sticky" filter button on mobile that remains
  accessible as the user scrolls.
- **Inventory Transparency:** Always show "Out of Stock" or "Low Stock" on the
  PLP to prevent wasted clicks.

## Common Failure Patterns

- **Overwhelming Filters:** Showing 20+ filter categories at once, leading to
  choice paralysis.
- **Mystery Cards:** Product cards that don't show the price until the user
  clicks through.
- **Layout Shift:** Adding content that causes the product grid to jump as
  images load.
- **Dead-End Filtering:** Allowing users to select combinations that result in
  "0 results" without warning.

## Validation Methods

- **PDP Click-Through Rate:** (PDP Clicks / PLP Views) \* 100.
- **Pogo-Sticking Rate:** Percentage of users who return to the PLP within <5
  seconds. Goal: <15%.
- **Filter Utilization:** Percentage of users who apply at least one filter.
- **Average Products Viewed:** A higher number indicates better discovery
  efficiency.
