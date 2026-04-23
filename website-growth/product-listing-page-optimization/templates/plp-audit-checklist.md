# PLP Discovery & Scannability Audit Checklist

Use this checklist to evaluate the effectiveness of an e-commerce Product
Listing Page (PLP) or Category Page.

## 1. Interaction Cost & Filtering

- [ ] **The "3-Filter Rule":** Are only the top 3-4 most relevant filter
      categories expanded by default?
- [ ] **Relevance Ordering:** Are filters ordered by user importance (e.g., Size
      before Material)?
- [ ] **Visual Feedback:** Do users get immediate visual confirmation (loader or
      count update) when a filter is applied?
- [ ] **Zero-Result Handling:** Are combinations that lead to 0 results
      prevented or clearly indicated?
- [ ] **Breadcrumbs:** Is there a clear path back to parent categories?

## 2. Product Card Information Density

- [ ] **Minimum Viable Info:** Does every card show:
  - Product Title
  - Current Price (and original price if on sale)
  - Star Rating & Review Count
  - Primary Image
- [ ] **Decision Drivers:** Are key variants (e.g., color swatches) visible on
      the card?
- [ ] **Badging Strategy:** Are badges (Sale, New, Top Rated) used sparingly and
      consistently?
- [ ] **Price Visibility:** Is the price visible immediately without hovering?

## 3. Mobile Discovery Patterns

- [ ] **Touch Targets:** Are all filter options and buttons at least 44x44px?
- [ ] **Sticky Navigation:** Is the "Filter/Sort" control easily accessible
      (sticky header or footer)?
- [ ] **Active Filter Tokens:** Can users see all applied filters at a glance
      and remove them individually?
- [ ] **Grid Density:** Does the mobile view use a 1-column (visual focus) or
      2-column (scannability) layout appropriately for the product type?

## 4. Visual Scannability

- [ ] **Image Consistency:** Do all product images use the same aspect ratio and
      background style?
- [ ] **Alignment:** Are titles, prices, and buttons aligned across the row to
      create a "clean" horizontal scan?
- [ ] **Whitespace:** Is there enough breathing room between cards to prevent
      the "wall of products" effect?

## 5. Technical Performance & State

- [ ] **Asynchronous Loading:** Does filtering happen without a full page
      reload?
- [ ] **Back-Button Persistence:** If a user clicks a product and then hits
      "Back," are their filters and scroll position preserved?
- [ ] **Loading States:** Is there a clear "Skeleton Screen" or spinner while
      results are being fetched?
