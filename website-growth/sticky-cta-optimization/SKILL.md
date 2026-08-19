---
name: sticky-cta-optimization
description:
  Audit, design, trigger, and optimize persistent sticky and floating call-to-action (CTA)
  bars for mobile and long-form pages to eliminate scroll friction, preserve conversion access,
  and increase primary action completion rates without blocking content or causing viewport collisions.
---

# Sticky CTA Optimization

## Purpose

The Sticky CTA Optimization skill provides a systematic framework for designing, triggering,
and positioning persistent floating Call-to-Action (CTA) bars on long pages and mobile viewports.
When visitors scroll down long landing pages, product pages, pricing tables, or articles, the primary
conversion action frequently scrolls out of view. Requiring users to scroll back up 3–5 viewports
to take action introduces severe "scroll friction" and causes conversion drop-offs.

This skill solves conversion leaks caused by lost action access by introducing smart, scroll-triggered
sticky bars (bottom dock, header bar, or desktop sidebar) that maintain seamless access to the next step
while protecting screen real estate, avoiding UI stack collisions, and preserving focus accessibility.

## Use Cases

- **Mobile E-Commerce Product Pages (PDPs):** Keeping "Add to Cart" and price accessible while customers browse reviews, image galleries, and specs.
- **SaaS Pricing & Plan Comparison Pages:** Floating plan selection or "Start Free Trial" sticky headers when users scroll through feature matrix tables.
- **Long-Form Lead Generation & Landing Pages:** Maintaining access to demo scheduling, quote requests, or sign-up forms on pages exceeding 2+ viewports.
- **Long-Form Articles & Content Marketing:** Converting organic search traffic into leads via persistent newsletter or content-upgrade sticky bars.
- **High-Friction Checkout & Application Steps:** Keeping the "Complete Order" or "Submit Application" button pinned above mobile keypads and scrolling forms.

## When NOT to Use

- **Short Above-the-Fold Pages:** Pages shorter than 1.5 screen viewports where the primary CTA remains continuously visible without scrolling.
- **High-Density Multi-Action Interfaces:** Complex web apps or dashboards where floating bars obscure critical data controls or cause UI clutter.
- **Conflicting Overlay Environment:** Pages already heavily constrained by mandatory overlays (e.g., intrusive age gates, complex cookie banners, active live chat modals) where adding a sticky bar causes severe screen blocking (< 60% viewable content area).
- **Early-Stage Search & Exploration Pages:** Category or search result pages where sticky buttons distract from filtering and browsing (use `product-listing-page-optimization` or `internal-search-optimization` instead).

## Inputs

1. **Scroll Depth & Analytics Data:** Average scroll depth, drop-off points, and CTA click location distribution (hero vs inline vs bottom).
2. **Device Breakdown & Viewport Sizes:** Mobile vs desktop traffic split, target screen heights, and OS keyboard behaviors.
3. **Primary & Secondary Conversion Intent:** The exact conversion goal (e.g., "Add to Cart", "Start 14-Day Free Trial", "Book a Demo") and required supporting elements (price, ratings, value proposition).
4. **Existing Overlay Inventory:** List of current fixed/sticky elements (sticky headers, cookie banners, chat widgets, announcement bars).

## Outputs

1. **Sticky CTA Placement & Trigger Spec:** Clear rules defining when (scroll threshold/element disappearance) and where (bottom dock vs top bar vs desktop rail) the sticky CTA appears.
2. **Visual & Microcopy Anatomy Specification:** Recommended layout, typography, primary button contrast, value anchor microcopy, and price/rating badge inclusion.
3. **Viewport Collision Matrix:** Rules for z-index hierarchy, margin offsets, and dynamic hiding logic to prevent overlap with chat widgets, cookies, or mobile keyboards.
4. **Accessibility & Responsive Blueprint:** WAI-ARIA roles, focus order specs, keyboard dismissability, and touch-target guidelines.

## Workflow

### 1. Audit Page Depth & Action Visibility Gap

Evaluate where and when the primary conversion button loses visibility.

- **Calculate Visibility Gap:** Measure the pixel height where the hero CTA scrolls off-screen until the next inline CTA appears. If the gap exceeds 1.5 viewports (~1000px on mobile), a sticky CTA is required.
- **Audit Mobile Screen Real Estate:** Measure the percentage of viewport height consumed by fixed headers, announcement bars, or cookie banners. Total sticky elements must never exceed 15% of vertical viewport height (~80px on standard mobile screens).
- **Identify Existing Overlay Collisions:** Inventory floating elements (e.g., Intercom/Zendesk chat widgets, cookie banners, WhatsApp buttons) that compete for bottom-screen space.

### 2. Define Trigger Logic & Scroll Thresholds

Choose the precise trigger conditions to prevent intrusive, unexpected popping.

- **Trigger Pattern A: Hero CTA Disappearance (Recommended):** Use `IntersectionObserver` on the main hero CTA button. The sticky bar smoothly slides in only after the main CTA scrolls past the top viewport threshold.
- **Trigger Pattern B: Percentage Scroll Depth:** Reveal the sticky bar after 25–30% scroll depth on long content/article pages.
- **Trigger Pattern C: Upward Scroll Reveal (Intent Trigger):** Hide the bar on downward scroll to maximize reading room; immediately slide the bar in on any upward scroll gesture signaling re-engagement.

### 3. Design the Sticky CTA Anatomy

Build a compact, high-converting layout optimized for quick scanning and thumb interaction.

- **Mobile Bottom Bar Layout (3-Zone Structure):**
  - **Zone 1 (Left):** Value anchor or product snippet (e.g., Title + Price, Star Rating, or "Free 14-day trial").
  - **Zone 2 (Right):** High-contrast primary CTA button (minimum touch target: 48x48px).
  - **Zone 3 (Optional Secondary):** Express payment button (Apple Pay/Google Pay) or variant dropdown selector.
- **Desktop Top/Header Dock or Sticky Sidebar:**
  - On desktop viewports (> 1024px), transform the bottom dock into a slim top header dock or pin the buy box in a sticky right rail (`position: sticky; top: 20px;`).

### 4. Resolve Collision & Accessibility Rules

Prevent UI breakage, z-index wars, and screen reader traps.

- **Z-Index Layering:** Assign clear z-index tiers (e.g., Content: 1–10, Sticky CTA: 100, Header Nav: 200, Modals/Overlays: 1000).
- **Floating Widget Auto-Shift:** Dynamically shift floating chat widgets upwards (e.g., `bottom: 80px`) when the sticky CTA becomes active so buttons do not overlap.
- **Keyboard & Screen Reader Access:** Ensure the sticky bar is properly situated in DOM tab order or accessible via ARIA landmark (`role="region" aria-label="Quick Purchase"`). Provide an easy collapse/dismiss option if the bar covers content.

### 5. Review Against Decision Rules

Verify the design against conversion heuristics before testing.

## Decision Rules

- **The "Hero Disappearance" Rule:** Never display a sticky CTA while the primary hero CTA is still visible in the current viewport. Double CTAs dilute attention and create visual noise.
- **The 15% Viewport Ceiling:** A mobile sticky bar must never exceed 15% of total screen height (e.g., maximum 80px height on an iPhone viewport).
- **The Thumb-Zone Priority:** On mobile, place primary action buttons in the bottom-right or full-width bottom zone for single-thumb ergonomics.
- **The "No-Cover" Content Rule:** Ensure bottom padding (`padding-bottom: 80px`) is added to the page body or footer container so the fixed sticky bar never covers the final footer links, copyright text, or total price summaries at the bottom of the page.
- **Contextual State Sync:** The sticky CTA must instantly reflect any selection changes made on the main page (e.g., size/variant changes, plan toggle switches, price updates).

## Constraints

- **Screen Real Estate Constraint:** On small mobile screens (< 375px wide), hide secondary microcopy and display only the primary button and core price/action label to prevent text clipping.
- **Input Focus Constraint:** Automatically hide or dock the sticky bar when an input field or text area receives focus to prevent virtual keyboard overlaps.
- **Cookie Consent Constraint:** If an unaccepted cookie consent banner sits at the bottom of the screen, defer the sticky CTA or dock it above the banner until accepted.

## Non-Goals

- Comprehensive page layout overhaul (use `landing-page-content-hierarchy` or `product-page-optimization`).
- Building interactive form fields within the sticky bar (keep sticky bars focused on navigation/trigger actions).
- Managing global header site navigation or mega-menus.

## Common Failure Patterns

- **The Screen Blocker:** Designing an oversized sticky bar (120px+) that takes up 25–30% of mobile viewports, infuriating users trying to read product details.
- **The Chat Widget Collision:** Positioning the sticky bar directly over the live chat bubble, rendering both buttons unclickable.
- **The Double CTA Flashing:** Hardcoding the sticky bar to display immediately on page load, resulting in two identical CTAs competing side-by-side above the fold.
- **The Keyboard Lock:** Failing to hide the sticky CTA when a user taps a form input on mobile, causing the sticky bar to float in the middle of the screen above the virtual keyboard.
- **The Hidden Footer Trap:** Positioning a `position: fixed; bottom: 0;` bar without adding bottom padding to `<body>`, permanently obscuring the "Place Order" button or footer links.
- **Stale Price Disconnect:** Updating the selected options in the main product form without updating the price or plan shown inside the sticky bar, causing user confusion and mistrust.

## Validation Methods

- **Sticky CTA Click-Through Rate (CTR):** (Clicks on Sticky CTA / Total Views of Sticky Bar) * 100. Target: 15–35% of all conversion clicks.
- **Primary Conversion Rate:** Measure overall conversion lift (Add to Cart Rate, Trial Sign-Up Rate, Lead Form Completion Rate). Target: +8% to +22% lift.
- **Scroll-to-Conversion Depth:** Measure conversion rate among users who scroll past 50% depth. Target: Significant reduction in scroll-back bounce.
- **Viewport Unusable Rate / Exit Rate:** Verify that bounce or exit rates do not increase due to intrusive screen blocking.
