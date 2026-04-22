---
name: product-page-optimization
description:
  Audit and optimize e-commerce Product Detail Pages (PDPs) to improve
  add-to-cart rates and reduce shopper hesitation. Trigger this skill when
  product pages have high traffic but low conversion, or when users frequently
  exit before adding items to the cart.
---

# Product Page Optimization

## Purpose

The Product Page Optimization skill provides a systematic framework for refining
the most critical decision point in the e-commerce funnel: the Product Detail
Page (PDP). It focuses on maximizing "Add to Cart" (ATC) rates by optimizing the
buy-box hierarchy, visual evidence, product descriptions, and trust signals. By
reducing uncertainty and highlighting value, this skill directly improves
revenue per visitor (RPV) and overall conversion rates.

## Use Cases

- E-commerce sites with high product-page traffic but low Add-to-Cart rates.
- Launching new products where features and benefits need clear articulation.
- Improving mobile conversion rates for specific high-value products.
- Reducing return rates by ensuring product expectations are accurately set.

## When NOT to Use

- **Category Pages (PLPs):** These require "Product Listing Page" optimization
  focused on filtering and sorting.
- **Checkout Flows:** Once the item is in the cart, use
  `checkout-flow-optimization`.
- **B2B Service Landing Pages:** Use `landing-page-content-hierarchy` for
  lead-gen focused services without direct "Add to Cart" actions.
- **Simple Blog Posts:** Use general SEO or content engagement strategies.

## Inputs

1. **Product Data:** High-resolution images, video, technical specs, and
   original descriptions.
2. **Customer Feedback:** Common questions from support tickets, reviews, and
   Q&A sections.
3. **Analytics:** ATC rate, bounce rate on PDP, and time-on-page.
4. **Competitor Benchmarks:** How similar products are presented in the market.
5. **Inventory/Shipping Info:** Lead times, stock levels, and shipping costs.

## Outputs

1. **PDP Friction Audit:** Identification of missing information, visual
   clutter, or unclear CTAs.
2. **Optimized Buy-Box Layout:** Guidance on the placement of price, variants,
   and the ATC button.
3. **Enhanced Product Story:** Scannable descriptions that focus on benefits and
   handle objections.
4. **Trust & Proof Mapping:** Strategic placement of reviews, badges, and
   real-world usage images.

## Workflow

### 1. Buy-Box Audit (The "Golden Triangle")

Focus on the area where the price, selection, and ATC button reside.

- **Visibility:** Is the ATC button the most prominent element on the page?
- **Clarity:** Is the price clearly visible near the button?
- **Hierarchy:** Ensure the sequence is: Title -> Price -> Variants -> ATC.

### 2. Visual Evidence Optimization

- **The "Feel" Test:** Can the user "feel" the product through the screen?
- **Requirements:**
  - Multiple high-res angles.
  - Zoom capability.
  - Lifestyle shots (product in use).
  - Video or 360-degree views for complex items.

### 3. Benefit-Driven Copywriting

Audit the description for scannability and impact.

- **The "So What?" Test:** Every feature must be followed by a benefit.
- **Scannability:** Use bullet points for technical specs and bold headers for
  key selling points.
- **Objection Handling:** Address the top 3 reasons why someone might NOT buy
  (e.g., "Will this fit?", "Is it durable?") directly in the copy.

### 4. Reducing Anxiety (Risk Reversal)

Place "Security Blankets" near the ATC button:

- **Shipping Transparency:** Show delivery dates or "Free Shipping" status
  immediately.
- **Return Policy:** A simple "30-Day Money Back Guarantee" or "Free Returns"
  link.
- **Stock Urgency:** If stock is low, show a "Only 3 left" indicator to drive
  action.

### 5. Social Proof Integration

- **Review Summary:** Show a star rating and review count near the product
  title.
- **Specific Proof:** Feature "Top Positive" and "Top Critical" reviews to build
  authenticity.
- **User-Generated Content (UGC):** Display photos from actual customers using
  the product.

## Decision Rules

- **The "Fold" Rule:** On mobile, the Product Title, Price, and at least the top
  of the ATC button must be visible without scrolling.
- **Contrast Rule:** The ATC button must use a color that has high contrast
  against the rest of the page (e.g., a "Pop" color).
- **No Mystery Meat:** Variant selectors (size, color) must be intuitive. Don't
  hide them in deep dropdowns if there are fewer than 5 options.
- **Mobile First:** Ensure touch targets (buttons, variant swatches) are at
  least 44x44px.

## Common Failure Patterns

- **Generic Descriptions:** Using the manufacturer's stock description instead
  of unique, benefit-driven copy.
- **Hidden Shipping Costs:** Waiting until the cart/checkout to reveal that
  shipping is expensive.
- **Friction in Selection:** Requiring users to select 3 different dropdowns
  before the ATC button becomes active.
- **Social Proof Absence:** No reviews or only 5-star "fake-looking" reviews.
- **Cluttered Visuals:** Too many badges, popups, or "People also bought"
  widgets that distract from the main ATC goal.

## Validation Methods

- **Add-to-Cart (ATC) Rate:** (ATC clicks / PDP Views) \* 100. Target a 10-20%
  relative lift.
- **Review Sentiment:** Monitor if questions asked in reviews decrease (due to
  better descriptions).
- **Heatmap Interaction:** Verify that users are engaging with variant selectors
  and lifestyle images.
- **Return Rate:** A decrease in "item not as described" returns indicates
  better PDP clarity.
