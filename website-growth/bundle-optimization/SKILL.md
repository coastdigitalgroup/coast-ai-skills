---
name: bundle-optimization
description:
  Audit, structure, frame, and optimize on-site product bundle offers (curated bundles, tier-discounted bundles, and build-your-own-bundle flows) to maximize Average Order Value (AOV), bundle take rate, and net contribution margin.
---

# Product Bundle Optimization

## Purpose

The Product Bundle Optimization skill provides a systematic framework for auditing, structuring, pricing, framing, and merchandising product bundles on e-commerce and direct-to-consumer (DTC) websites.

Bundling multiple complementary or consumable products into a single SKU or discounted group is one of the highest-leverage growth mechanics for driving Average Order Value (AOV). However, unoptimized bundle strategies frequently fail due to choice overload, unconvincing discount framing, excessive decision friction in custom bundle builders, or margin-eroding discount structures.

This skill addresses these failure modes by applying behavioral economics, step-reduction UI patterns, and margin-safe pricing formulas. It establishes optimal bundle composition rules, clear value framing, and frictionless cart/PDP interfaces that turn single-item browsers into multi-item buyers. It directly improves Average Order Value (AOV), Bundle Take Rate, Revenue Per Visitor (RPV), and Gross Profit Contribution per order.

## Use Cases

- **E-Commerce & DTC Brands:** Multi-product retailers looking to increase AOV by grouping core products with high-margin accessories or complementary items.
- **Consumable & CPG Brands:** Skincare, supplement, food, and beverage brands offering multi-packs, routine sets, or tiered quantity bundles (e.g., "Buy 2 Get 10% Off, Buy 3 Get 20% Off").
- **Custom "Build Your Own Bundle" (BYOB) Flows:** Merchants offering mix-and-match bundle builders where customers construct custom multi-item packages.
- **Subscription Starter Kits:** Brands packaging onboarding kits or trial bundles to increase first-order conversion and long-term subscriber retention.
- **Seasonal & Gift Bundles:** Peak holiday campaigns (e.g., Black Friday, Valentine's Day, Mother's Day) where curated gift sets simplify decision-making for gift buyers.

## When NOT to Use

- **Very Limited Catalogs (<3 SKUs):** Single-product brands or sites with fewer than 3 distinct items where natural product complementarity or multi-tier bundling does not exist.
- **High-Ticket Complex B2B Purchases:** Complex enterprise software or heavy industrial hardware where bundling requires custom sales quotes, contract negotiations, or engineering configurations.
- **Low-Margin / Commodity Retailers:** Businesses operating on razor-thin profit margins (e.g., consumer electronics, commodities) where discount-based bundling leads to negative gross margins.
- **Unrelated Product Collections:** Forcing unrelated or non-complementary items together into a bundle (e.g., bundling a dog leash with a coffee mug), which increases cognitive load and causes shopper confusion.

## Inputs

1. **Transaction & Order History:** Order composition data, top cross-purchased SKUs, item attachment rates, baseline Average Order Value (AOV), and baseline Revenue Per Visitor (RPV).
2. **Catalog Margin & Inventory Profiles:** Unit Cost of Goods Sold (COGS), gross margin percentage per SKU, pick/pack fulfillment costs, and real-time inventory levels.
3. **Current Bundle Performance (If Any):** Conversion rates of existing bundle SKUs, current bundle take rates, and refund/return rates for bundled items.
4. **On-Site UX Assets:** Screenshots and layout structures of Product Detail Pages (PDPs), cart drawers/mini-carts, collection pages, and current bundle builder flows.

## Outputs

1. **Bundle Architecture & Composition Matrix:** Data-backed selection of core "Anchor" products mapped to complementary "Attach" products or quantity tiers.
2. **Pricing & Margin Safety Spec:** Mathematical pricing models ensuring bundle discounts remain gross-margin positive after fulfillment costs.
3. **Visual UI & Framing Specification:** Layout, copy, and interaction guidelines for PDP bundle widgets, cart drawer upsells, and custom BYOB interfaces.
4. **Validation & Testing Plan:** A structured A/B testing blueprint specifying metrics, hypotheses, and guardrails to measure net profit and AOV lift.

---

## Workflow

### 1. Catalog & Basket Analysis (Bundle Architecture)

Never guess which items to bundle. Utilize transaction data to identify genuine product synergy.

- **Identify Anchor Products:** Find top-selling "Hero" items that drive the highest volume of site traffic.
- **Map Attachment Rates:** Analyze historical cart data to find items frequently co-purchased with the Hero item within 30–90 days.
- **Determine Bundle Type:** Select the optimal bundle mechanism based on product category:
  - *Curated Fixed Bundle:* Fixed set of complementary items sold as a single combined SKU (e.g., "3-Step Acne Treatment Kit"). Best for high-synergy products.
  - *Quantity Tier Bundle (Volume Discount):* Discounting identical or variant SKUs based on volume (e.g., "Buy 1 for $30, Buy 2 for $54, Buy 3 for $72"). Best for consumables/replenishables.
  - *Mix-and-Match / BYOB:* Interactive builder allowing users to choose $X$ items from a curated grid for a flat price or percentage savings. Best for flavor/shade variations.
  - *Add-On / PDP Cross-Sell Bundle:* Single-click option on a PDP to "Add [Complementary Item] for $15 more."

### 2. Pricing Architecture & Gross Margin Protection

Calculate bundle pricing to maximize gross profit dollars, not just top-line revenue.

- **The Goldilocks Discount Range:** Bundle discounts should typically fall between **10% and 20%** off total standalone retail prices. Discounts below 10% fail to motivate action; discounts above 25% erode profit margins and devalue the brand.
- **Calculate Incremental Contribution Margin:**
  - *Formula:* $\text{Incremental Margin} = (\text{Bundle Price} - \text{Total Bundle COGS} - \text{Incremental Pick/Pack}) - (\text{Anchor Standalone Price} - \text{Anchor COGS})$
  - *Rule:* The Incremental Margin dollars from the bundle *must* exceed the standalone Anchor margin dollars. If a bundle increases top-line sales by $20 but yields fewer net profit dollars, the bundle structure is flawed.
- **Framing Savings as Absolute Dollar Amounts:** Display savings as both percentage and exact currency values (e.g., *"Save $24 (20% OFF)"*). Psychological research shows absolute dollar savings (e.g., "$25 OFF") outperform percentage savings on higher-ticket items ($100+), while percentage savings outperform on lower-ticket items (<$50).

### 3. High-Conversion On-Site Merchandising & UI Design

Reduce decision friction and make the bundle value visually undeniable.

- **PDP "Frequently Bought Together" Widget:**
  - Place directly below the primary Buy Box on the anchor product's PDP.
  - Visual layout: Thumbnail images connected by `+` icons, culminating in an `=` sign next to the bundle total.
  - Pre-checked checkbox state: Allow users to uncheck individual items, but highlight the "Bundle & Save" total savings when all items remain selected.
  - Single "Add Bundle to Cart" CTA button.
- **Quantity Tier UI (The "Best Value" Badge):**
  - Present 3 tier cards horizontally on desktop or stacked vertically on mobile:
    - Tier 1: 1 Pack (Standard Price)
    - Tier 2: 2 Pack (Save 15% — tagged as "Most Popular")
    - Tier 3: 3 Pack (Save 25% — tagged as "Best Value")
  - Pre-select Tier 2 ("Most Popular") by default to anchor buyer expectations upward.
- **Build Your Own Bundle (BYOB) Flow Step-Reduction:**
  - Limit choices to **3 to 5 options per step** to prevent decision paralysis.
  - Real-time progress bar: Dynamic sticky footer or header showing *"Add 1 more item to unlock 20% OFF!"*
  - Instant visual confirmation when an item is tapped (no modal popups or reloads).

### 4. Cart Drawer & Checkout Integration

Ensure the bundle flows seamlessly into the purchase process.

- **Single Line Item Cart Representation:**
  - Display the bundle as a unified line item with expandable sub-items.
  - Clearly display original price strikethrough alongside the discounted price: ~~`$120.00`~~ **`$96.00`** `(Saved $24.00)`.
- **Cart Drawer Threshold Nudges:**
  - If a user adds a single item to their cart, trigger an inline mini-cart prompt: *"Upgrade to the 3-Piece Kit and save $20! [Upgrade in 1-Click]"*.

### 5. Inventory & Abuse Prevention Protocols

Protect stock and prevent refund exploitation.

- **Out-of-Stock Fallback:** If one item in a 3-part curated bundle goes out of stock, automatically switch the PDP display to a 2-part bundle or disable the "Bundle & Save" widget to prevent overselling or backorders.
- **Return Policy Safeguards:**
  - *Rule:* Bundles must be returned as a **complete set** for a full refund.
  - *Partial Return Logic:* If partial returns are permitted, recalculate the retained items at full retail price, deducting the difference from the refund amount.

---

## Decision Rules

- **The 3-Tier Limit Rule:** Never offer more than 3 quantity or tier options in a single bundle widget. Offering 4+ options increases cognitive load and decreases total conversion.
- **The "Anchor Dominance" Rule:** The core anchor product must account for at least 50% of the total bundle value. If secondary attach items outweigh the core item, customers perceive the offer as unnecessary filler.
- **Pre-Selection Default Rule:** Always pre-select the middle tier ("Most Popular") or the complete bundle package by default on PDP load. Unselected blank states reduce bundle adoption by up to 35%.
- **Mobile Stack Order Rule:** On mobile screens, place bundle selectors immediately above the main CTA button. Never force mobile users to scroll through long product descriptions to find variant/bundle selectors.

---

## Constraints

- **Platform Cart Capability:** Complex BYOB flows and multi-item discounts require support for automatic line-item discount scripts or custom cart APIs (e.g., Shopify Functions, Rebuy, CartTransform).
- **Physical Fulfillment Limits:** Ensure warehouse pickers can handle bundle kit assemblies efficiently without incurring excessive fulfillment surcharges.
- **Regulatory Disclosure:** Advertised original prices (strikethroughs) must reflect actual, historical standalone selling prices to comply with FTC and regional advertising standards.

## Non-Goals

- Physical kit packaging or custom box manufacturing design.
- Negotiating supplier COGS or manufacturing pricing.
- Off-site email/SMS remarketing sequences for abandoned carts.

---

## Common Failure Patterns

- **Choice Paralysis in Bundle Builders:** Presenting 30+ unorganized options in a BYOB builder without filters, leading to high drop-offs before completion.
- **Hidden Savings:** Showing a bundle price without displaying the standalone item prices or the explicit dollar amount saved. If users have to do mental math, they won't buy.
- **Margin Erosion (Over-Discounting):** Offering 30%+ discounts on bundles containing low-margin items, resulting in higher revenue but lower net profit.
- **Cluttered Mobile Buy Boxes:** Stacking multiple bundle options, variant selectors, and shipping badges on mobile PDPs, pushing the main CTA far below the fold.
- **Broken Component Tracking:** Selling bundles as a static single SKU without deducting individual inventory components from the WMS, causing overselling of out-of-stock sub-items.

---

## Validation Criteria

- [ ] **Average Order Value (AOV) Lift:** (Total Revenue / Total Orders). Target: **12% to 25%** relative lift post-implementation.
- [ ] **Bundle Take Rate:** (Orders containing a bundle / Total orders) * 100. Target: **>15%** for general catalog sites; **>35%** for consumable/tiered sites.
- [ ] **Net Profit Contribution per Order:** Verify that gross profit dollars per transaction increase after accounting for bundle discounts and pick/pack costs.
- [ ] **BYOB Completion Rate:** (Users who start BYOB flow and complete checkout / Users who view BYOB entry point) * 100. Target: **>40%**.
- [ ] **Return / Refund Rate Stability:** Ensure bundle return rates do not spike above baseline single-item return rates.
