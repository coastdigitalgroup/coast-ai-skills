---
name: browse-abandonment-optimization
description:
  Audit and optimize on-site intent triggers, active session recovery prompts, price drop/back-in-stock quick captures, and contextual browse nudges to convert high-intent page viewers into cart additions before they leave.
---

# Browse Abandonment Optimization

## Purpose

The Browse Abandonment Optimization skill provides a systematic framework for detecting, engaging, and recovering high-intent visitors who explore product detail pages (PDPs) or high-density category pages (PLPs) but leave without adding items to their cart or starting checkout.

While cart abandonment optimization targets users who have already taken an explicit purchase step (Add to Cart), browse abandonment occurs much earlier in the funnel—where up to 85–90% of total site traffic drops off. Users spend significant time reading product descriptions, cycling through gallery images, checking sizing options, or comparing variants, yet bounce due to unanswered micro-objections, temporary price hesitation, or lack of session continuity. This skill captures high-intent browsing signals in real time to deliver non-intrusive contextual interventions, soft visual save triggers, and frictionless session re-engagement mechanisms that directly lift the Browse-to-Cart Conversion Rate (BTCR) and PDP Session Continuation Rate.

## Use Cases

- **E-Commerce PDP Browsing Hesitation:** Visitors who spend >45 seconds on a Product Detail Page, view multiple image thumbnails or color swatches, select size variants, but move their cursor toward the tab close button or scroll up rapidly on mobile without clicking "Add to Cart".
- **High-Consideration B2B/SaaS Product Catalog Browsing:** Users evaluating complex solution modules, software feature tiers, or customized enterprise products who repeatedly toggle between specification tabs without requesting a quote or starting a trial.
- **Repeat Category/Product Viewers:** Returning visitors who view the same product category or specific SKU across multiple sessions without converting or adding items to a wishlist.
- **Stock & Variant Hesitation:** Shoppers viewing product variants with low inventory or out-of-stock sizes who abandon because they are unaware of restock updates or alternative matching recommendations.

## When NOT to Use

- **Cart or Checkout Abandonment:** For users who have already added items to their shopping cart or entered the checkout funnel, use `cart-experience-optimization` or `exit-intent-recovery`.
- **General Homepage or Blog Bounce Reduction:** For top-of-funnel visitors dropping off generic informational pages without intent signals, use `landing-page-content-hierarchy` or `hero-section-optimization`.
- **Out-of-Stock Notification Signups:** For purely capturing back-in-stock email alerts on completely sold-out products, use `stockout-recovery-optimization`.
- **First-Time Welcome Discount Popups:** For immediate, site-wide welcome offers shown to visitors upon entry, use `welcome-popup-optimization`.

## Inputs

1. **Browse Behavior & PDP Analytics:**
   - Product Detail Page (PDP) bounce rates, average time-on-page, image gallery engagement rates, and current Browse-to-Cart Conversion Rate (BTCR).
   - Drop-off rates by product category, price tier, and device type (Mobile vs. Desktop).
2. **Current Product & Inventory Data:**
   - Active SKU inventory levels, promotional discounts, review ratings, shipping threshold policies, and return guarantees.
3. **Behavioral Tracking Capabilities:**
   - Real-time event detection capabilities (cursor exit trajectory, mobile rapid scroll-up, idle dwell time on variant selectors, tab switching focus events).
4. **Session Storage & Auth Context:**
   - User authentication state (logged in vs. anonymous guest), past browsing history stored in session/local storage, and email capture state.

## Outputs

1. **Browse Intent Friction Audit:** Comprehensive diagnostic mapping key drop-off points, missing reassurance signals, and friction hotspots across PDP image galleries, pricing blocks, and variant selectors.
2. **Real-Time Browse Recovery Trigger Matrix:** Structured behavioral rules governing when to deploy subtle inline nudges, slide-out drawer teasers, or session save overlays based on intent level.
3. **Contextual Browse Nudge Wireframe & Copy Specifications:** Detailed UX specs for low-friction re-engagement components, including "Save Product to Session", "Instant Price Drop Watch", and "Viewed SKU Micro-Comparison" cards.
4. **Browse-to-Cart Optimization Workflow Specs:** Technical guidelines for inline sticky mini-bar prompts, session-restoration deep links, and anonymous visitor browser storage persistence.

---

## Workflow

### 1. Audit Browse Intent Signals & Micro-Friction Hotspots

Analyze user telemetry on PDPs and category listing pages to distinguish casual window shoppers from high-intent evaluators who hit friction.
- **Identify High-Intent Browse Signals:**
  - *Image Gallery Depth:* User views 3 or more product gallery photos or expands zoom modal.
  - *Variant Interaction:* User selects size, color, or specification options.
  - *Accordion/Tab Expansion:* User expands "Shipping & Returns", "Dimensions", or "Ingredients/Materials".
  - *Review Dwell Time:* User scrolls down to the reviews section and filters by 4-star/5-star or verified buyers.
  - *Dwell Time & Scroll Threshold:* User spends >45 seconds on a single SKU page and scrolls past 60% of page height.
- **Pinpoint Micro-Friction Causes:**
  - Unclear delivery lead times or hidden shipping costs until checkout.
  - Missing key technical specifications or fit guidance directly beside the "Add to Cart" button.
  - Hesitation over total cost without clear installment payment options visible.
  - Sudden loss of browsing context when switching between product variants.

### 2. Segment Browsers by Intent Level & Hesitation Type

Do not treat all abandoning browsers equally. Categorize abandonment triggers into distinct behavioral buckets:
- **Price & Shipping Hesitater:** Spends time looking at price and shipping policy tabs; exit vector triggered right after viewing delivery estimates.
- **Feature & Fit Hesitater:** Toggles multiple size buttons or specification accordions; abandons without selecting a size.
- **Visual Evaluator:** Views all gallery images and customer photos; abandons near top of page after zooming.
- **Multi-Tab Comparison Browser:** Opens 3–5 product tabs simultaneously, causing current tab to lose focus (visibilityState = hidden).

### 3. Design Non-Intrusive Contextual Interventions

Deploy interventions tailored to the specific browse intent bucket without disrupting the primary browsing experience.
- **For Multi-Tab Comparison Browsers (Tab Focus Loss):**
  - Change favicon/title dynamic update: "👀 Still evaluating [Product Name]?" or "Don't lose your place in line!"
  - On tab refocussing, render a subtle top notification bar: "Saved your selected size [Medium] for 15 minutes."
- **For Price & Shipping Hesitaters (Exit Trajectory / High Dwell):**
  - Show a non-blocking bottom slide-over card: "Get notified if [Product Name] drops in price or goes on sale + enjoy Free Returns." with 1-click email/SMS capture.
  - Or show an inline shipping calculator directly under the main CTA: "Orders ship tomorrow — Arrives by [Date] with Free Shipping."
- **For Variant & Fit Hesitaters (Dwell on Size Selector >15s):**
  - Trigger an inline micro-prompt right above the size selector: "Unsure about fit? 88% of buyers say this fits true to size. View 1-step sizing guide."
- **For High-Intent Exit Vector (Cursor move to tab bar on Desktop / Rapid scroll-up on Mobile):**
  - Present a soft slide-up "Save Session" mini-drawer: "Browsing on the go? Email your current 3-item view history to finish on desktop."

### 4. Implement Session Storage & One-Click Re-Engagement

Ensure browsing history and selected options are preserved seamlessly across browser refreshes and device switches.
- **Local Browser Session Persistence:** Store the last 5 viewed SKUs, selected variant options, and active scroll position in `localStorage`/`indexedDB`.
- **Sticky PDP Mini-Dock on Mobile:** When scrolling past the primary "Add to Cart" button, trigger a persistent bottom dock featuring thumbnail image, product title, price, selected size, and a 1-tap "Add to Cart" button.
- **1-Click "Email My Session" Capture:** Allow anonymous users to enter their email in a single field to receive a direct deep link back to their exact configured product setup.

### 5. Validate & Measure Browse-to-Cart Impact

Run controlled A/B tests isolating browse recovery interventions against control PDP experiences.
- Measure primary uplift in **Browse-to-Cart Conversion Rate (BTCR)** and secondary lift in **PDP-to-Checkout Funnel Progression**.
- Monitor negative friction metrics: PDP bounce rate, modal dismissal rate, and total session duration.

---

## Decision Rules

### Rule 1: Choose Trigger Based on Browse Intent Score
Calculate a dynamic **Browse Intent Score (BIS)** based on user actions before firing an intervention:
- **BIS < 3 points (Low Intent, e.g., landing and scrolling <10s):** Do NOT show any browse recovery prompts. Allow natural browsing.
- **BIS 3–5 points (Moderate Intent, e.g., >30s dwell + 2 photo views):** Enable passive inline nudges (e.g., sticky mobile CTA bar, shipping countdown badge).
- **BIS > 5 points (High Intent, e.g., variant selected + review section read + exit trajectory):** Trigger active browse recovery prompts (e.g., "Save Product / Price Drop Notification" slide-over drawer).

### Rule 2: Intervention Presentation Style
- **Never use full-screen dark overlays for browse abandonment.** Unlike cart abandonment (where high purchase intent is confirmed), browse abandonment requires low-friction, non-blocking slide-outs or inline nudges that do not obscure product details.
- **Mobile First Rule:** On mobile devices, restrict interventions to bottom slide-up drawers occupying under 30% of screen height to preserve thumb ergonomics and viewport context.

### Rule 3: Frequency & Persistence Limits
- Maximum **1 active browse recovery prompt per user session**.
- If a user closes or dismisses a browse recovery prompt, suppress all browse prompts across all product pages for **14 days**.
- Suppress all browse abandonment triggers immediately if the user completes an "Add to Cart" action during the session.

---

## Constraints

- **Zero Impact on Page Load Performance:** All browse intent tracking scripts and DOM observers must be non-blocking and execute asynchronously without delaying Largest Contentful Paint (LCP) or First Input Delay (FID).
- **No Deceptive Urgency or Stock Claims:** Fake inventory counters ("Only 1 left in stock!") or artificial countdown timers on browse nudges strictly violate brand trust and consumer protection guidelines.
- **Respect Privacy & Cookie Preferences:** Session tracking and email capture must comply with GDPR, CCPA, and cookie consent preferences.

## Non-Goals

- Building automated post-session email/SMS retargeting drip flows (Klaviyo/Attentive campaign setups).
- Re-architecting e-commerce inventory management or ERP systems.
- Designing paid display/social remarketing ad campaigns (Meta/Google Ads).

---

## Common Failure Patterns

- **Premature Interruption:** Triggering a browse pop-up after only 5 seconds of viewing a PDP, frustrating users before they have digested the headline or hero image.
- **Blocking Product Images & Details:** Overlaying large modal banners over the primary product photo gallery, forcing users to close a popup just to view the item.
- **Generic "Don't Go!" Copywriting:** Displaying vague headlines like "Wait! Check out our catalog" instead of context-specific prompts referencing the exact SKU, color, or size currently being viewed.
- **Loss of Selected Variant State:** Asking users to email their session or save a product, but failing to restore their selected size/color variant when they re-open the link.
- **Competing Trigger Conflicts:** Allowing a browse recovery nudge to fire simultaneously over a chat widget or discount welcome banner, cluttering the UI.

---

## Validation Criteria

- [ ] **Browse-to-Cart Conversion Rate (BTCR):** Track (Users who click "Add to Cart" on PDP / Total PDP Visitors) * 100. Target: +15% to +30% relative lift.
- [ ] **PDP Session Continuation Rate:** Percentage of PDP visitors who either add to cart or navigate to a secondary PDP/category page rather than bouncing. Target: >45%.
- [ ] **Browse Recovery Prompt Engagement Rate:** (Clicks or email captures on browse nudge / Total nudge impressions) * 100. Target: >8%.
- [ ] **Saved Session Return Rate:** Percentage of visitors who send themselves a session link or price drop alert and return within 7 days to complete a purchase. Target: >18%.
- [ ] **Nudge Suppression Compliance:** 100% verification that users who add an item to cart or dismiss a prompt experience zero redundant popup interruptions.
