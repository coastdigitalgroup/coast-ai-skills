---
name: product-listing-page-optimization
description:
  Audit and optimize Product Listing Pages (PLPs) and category pages to improve
  product discovery and click-through rates (CTR) to product pages. Trigger this
  skill when users are "pogo-sticking" or when filter engagement is low.
---

# Product Listing Page Optimization

## Purpose

The Product Listing Page (PLP) Optimization skill provides a systematic
framework for improving the "Discovery Hub" of an e-commerce site. It focuses on
reducing the interaction cost of finding the right product through optimized
faceted search, effective information density on product cards, and smart
sorting strategies. By helping users find what they want faster, this skill
increases CTR to Product Detail Pages (PDPs) and reduces bounce rates.

## Use Cases

- E-commerce sites with large catalogs where users struggle to navigate results.
- Category pages with high bounce rates or low engagement with filters.
- Improving mobile discovery where screen real estate is limited.
- Reducing "Pogo-sticking" (users clicking a product then immediately returning
  to the list).

## When NOT to Use

- **Single-Product Sites:** If there is only one primary product, focus on
  `product-page-optimization`.
- **Checkout Flows:** Once the user has selected a product, use
  `checkout-flow-optimization`.
- **Pure Lead Gen:** For sites without a product catalog, use
  `landing-page-content-hierarchy`.

## Inputs

1. **Catalog Data:** Number of products per category and available attributes
   (facets).
2. **Analytics:** PLP-to-PDP Click-Through Rate (CTR), filter usage rates, and
   pogo-sticking metrics.
3. **User Behavior:** Heatmaps showing interaction with filters vs. product
   cards.
4. **Current Sorting Logic:** Default sort orders and how they are determined.

## Outputs

1. **PLP Friction Audit:** Identification of discovery barriers, such as
   overwhelming filters or "information-thin" cards.
2. **Faceted Search Specification:** Optimized filter hierarchy and interaction
   design (e.g., the "3-Filter Rule").
3. **Product Card Hierarchy:** Defined data points for cards to reduce the need
   for "pogo-sticking."
4. **Mobile Discovery Plan:** Tailored layout and filter patterns for small
   screens.

## Workflow

### 1. The Pogo-Sticking Audit

Analyze the "bounce back" behavior from PDPs.

- **Heuristic:** If users return to the PLP within 5 seconds of clicking a
  product, the product card likely lacks critical information (e.g., price,
  available sizes, or a clear usage context).
- **Action:** Identify the "missing link" and move that data point from the PDP
  up to the PLP product card.

### 2. Faceted Search Optimization

Reduce choice paralysis by organizing filters effectively.

- **The 3-Filter Rule:** On desktop, expand only the top 3 most used/important
  filter categories by default. Collapse the rest to keep the UI clean.
- **Dynamic Facets:** Show the number of results for each filter option (e.g.,
  "Blue (12)"). Hide or gray out options with zero results.
- **Visual Filters:** Use color swatches or icons for visual attributes (like
  color or shape) instead of plain text.

### 3. Information Density & Visual Scent

Optimize the product card to facilitate a "buying decision" from the list.

- **Information Balance:** Ensure cards include: High-quality image, Brand/Name,
  Price, Star Rating, and "Visual Scent" (e.g., "Available in 4 colors").
- **Secondary Actions:** Consider "Quick Add" or "Quick View" for low-complexity
  items to speed up the funnel.
- **Grid Ratio:** Balance image size with text. If images are the primary driver
  (fashion), use larger images; if specs matter (tools), prioritize text.

### 4. Mobile Discovery Patterns

Adapt for the "Thumb-Driven" experience.

- **Filter Drawer:** Use a persistent "Filter & Sort" button that opens a
  full-screen drawer. Accordion-style filters at the top of the list push
  content too far down.
- **Two-Column Grid:** For most retail, a two-column grid provides the best
  balance between image clarity and scannability.
- **Sticky Actions:** Keep the "Sort/Filter" trigger accessible during scroll.

### 5. Sorting & Social Proof

- **Default Sorting:** Avoid "Alphabetical" or "Newest" as defaults. Use "Best
  Selling" or "Highly Rated" to lead with social proof.
- **Smart Labels:** Use "Best Seller," "Sale," or "New" badges on cards to
  provide additional discovery cues.

## Decision Rules

- **The 3-Filter Rule:** Never auto-expand more than 3 filter categories on
  initial page load.
- **Pogo-Sticking Threshold:** If pogo-sticking (return < 5s) is > 20%, the
  product cards are "under-informed."
- **Mobile First Filters:** Mobile filters MUST be in a modal or drawer to
  preserve vertical space for products.
- **The Empty State Rule:** Never show a "No Results" page without providing
  clear "Clear All Filters" buttons or "You might also like" recommendations.

## Common Failure Patterns

- **The Filter Graveyard:** Too many filters that require excessive scrolling to
  find the products.
- **Hidden Prices:** Forcing users to click to the PDP just to see the price.
- **Lack of "Scent":** Not showing that other colors or sizes are available,
  leading users to assume the item doesn't meet their needs.
- **Mobile Single-Column:** Using a single-column layout for small items,
  creating an "infinite scroll" of death.

## Validation Methods

- **PLP-to-PDP CTR:** Measure the increase in users moving from the list to a
  specific product.
- **Reduction in Pogo-Sticking:** Track if users stay longer on the PDP after
  clicking from an optimized card.
- **Filter Interaction Rate:** Percentage of users who use at least one filter
  to narrow their search.
- **Average Time to PDP:** A decrease in time indicates a more efficient
  discovery process.
