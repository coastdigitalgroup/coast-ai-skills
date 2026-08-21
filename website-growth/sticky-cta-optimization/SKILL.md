---
name: sticky-cta-optimization
description:
  Audit, design, trigger, and position persistent floating Call-to-Action (CTA) bars on mobile and long-form pages to eliminate scroll friction and increase primary conversion rates.
---

# Sticky CTA Optimization

## Purpose

The Sticky CTA Optimization skill provides a systematic framework for auditing, designing, triggering, and positioning persistent floating Call-to-Action (CTA) bars across mobile web and long-form desktop landing pages.

On long-form product pages (PDPs), SaaS sales pages, and high-intent lead capture flows, the primary CTA button frequently scrolls out of view. When visitors reach peak intent mid-page (e.g., after reading feature specs, customer reviews, or pricing tables), requiring them to scroll back up or down to find the action button introduces high friction, resulting in lost conversions and high bounce rates.

This skill eliminates scroll friction by deploying smart, persistent CTA bars that appear dynamically when the primary hero CTA leaves the viewport. It establishes viewport trigger thresholds using `IntersectionObserver`, safeguards mobile safe areas (iOS Home Indicator), enforces minimum 48px tap targets, prevents layout shifts (CLS), syncs real-time state (price, variant, rating, loading state), and avoids collisions with live chat widgets, cookie banners, or sticky site headers.

It directly improves Mobile Conversion Rate (CVR), Primary CTA Click-Through Rate (CTR), Scroll-to-Action Drop-off, and Average Revenue Per Visitor (RPV).

## Use Cases

- **Mobile E-Commerce PDPs:** Displaying a persistent bottom bar with price, review rating, variant selector, and "Add to Cart" button when scrolling past the main buy box.
- **B2B SaaS Landing Pages:** Floating top or bottom "Start Free Trial" or "Book a Demo" bar on long-form landing pages with deep feature breakdowns.
- **Multi-Step Lead Capture Forms:** Maintaining a sticky "Continue" or "Get Quote" bar on long mobile intake forms or custom configurators.
- **Limited-Time Promo Pages:** Pairing sticky CTAs with dynamic countdown timers or threshold bars (e.g., "Free Shipping Unlocked").
- **High-Intent Editorial Content:** Affixing a persistent CTA bar to long-form product comparison articles or buyer's guides.

## When NOT to Use

- **Above-the-Fold Short Pages:** Pages where the primary CTA remains continuously visible without scrolling (e.g., simple sign-in or single-screen LP).
- **Active Checkout & Cart Drawers:** Adding a floating sticky CTA inside modal dialogs, drawer overlays, or multi-step checkout steps where it competes with native step buttons.
- **Cookie Consent / Privacy Banners:** Displaying a sticky CTA bar simultaneously over active full-width compliance banners, which clutters screen real estate.
- **Multi-CTA Choice Ambiguity:** Forcing 3+ competing action buttons into a sticky bar, causing choice overload in a restricted viewport area.

## Inputs

1. **Page Scroll & Heatmap Analytics:** Scroll depth data, hero CTA viewport exit depth, and click distribution across long-form page sections.
2. **Primary Conversion Action Specs:** Target CTA destination, product pricing, star ratings, variant selection dependence, and primary color system.
3. **Device Viewport & Safe Area Requirements:** Mobile device breakpoints, bottom navigation bar clearance, and iOS Home Indicator inset dimensions (`env(safe-area-inset-bottom)`).
4. **Competing Fixed Overlays:** Position, z-index, and dimensions of sticky top navigation, live chat widgets, cookie consent bars, and support triggers.

## Outputs

1. **Sticky CTA Architecture Spec:** UI layout, component hierarchy, typography, and contrast rules for mobile bottom bars and desktop top/bottom floating strips.
2. **Intersection Observer Trigger Logic:** Clean JavaScript trigger spec activating the sticky bar only after the primary hero CTA scrolls off-screen.
3. **Z-Index & Overlap Resolution Matrix:** Stacking context hierarchy ensuring sticky CTAs sit above page content while yielding cleanly to full-screen modals and drawers.
4. **A/B Testing & Validation Blueprint:** Specific hypothesis, tracking events, and metric thresholds to evaluate CTR and conversion lift.

---

## Workflow

### 1. Scroll Friction & Viewport Audit

Identify where visitors experience scroll disconnects on long-form pages.

- **Map Hero CTA Exit Depth:** Determine the exact scroll position (in pixels or percentage) where the primary hero CTA scrolls completely out of view.
- **Analyze Mid-Page Engagement:** Review analytics heatmaps to locate sections with high dwell time (reviews, spec tables, pricing comparison) that lack immediate conversion triggers.
- **Audit Competing Floating Elements:** Inventory all fixed or sticky elements already on page (site header, chat widget button, announcement bar, cookie drawer) to identify z-index and spacing collisions.

### 2. Viewport Trigger & Observer Mechanics

Never display a sticky CTA bar while the primary hero CTA is still visible on screen.

- **Sentinel Element Placement:** Attach an `IntersectionObserver` sentinel element to the hero CTA wrapper.
- **Trigger Condition:**
  - *Show Sticky CTA:* When hero CTA intersection ratio drops to `0` (hero CTA completely off-screen).
  - *Hide Sticky CTA:* When hero CTA intersection ratio rises above `0` (hero CTA enters viewport).
- **Exit Target Hiding (Form / Footer Reached):** Auto-hide or transform the sticky CTA when the user scrolls into the primary inline form or page footer to prevent visual duplication and clutter.

### 3. Visual Anatomy & Layout Engineering

Design compact, high-contrast sticky bars tuned for touch interaction.

- **Mobile Bottom Bar Layout (320px–480px Viewports):**
  - *Left Block:* Compact product context—Product Title / Price + Strikethrough + Star Rating badge.
  - *Right Block:* Full-width primary CTA button with minimum `48px` height and high-contrast color.
  - *Height Constraint:* Max container height of `64px–72px` excluding safe-area padding to avoid consuming more than 10-12% of screen height.
- **Desktop Top/Bottom Strip Layout (>1024px Viewports):**
  - Horizontal bar fixed to top (below header) or bottom viewport edge.
  - Contains Product Title, Price tag, Risk Reversal badge ("14-Day Free Trial" or "Free Shipping"), and primary button.
- **Mobile Safe Area Protection:** Always apply CSS safe-area padding for modern edge-to-edge smartphones:
  ```css
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  ```

### 4. Real-Time State & Interaction Synchronization

Ensure the sticky CTA bar is fully functional, not just a passive redirect.

- **Variant & Quantity Sync:** If the user changes a product variant (color, size, billing interval) on the main page, instantly reflect the updated variant, stock status, and price in the sticky CTA bar.
- **Direct Action Execution:** Clicking "Add to Cart" or "Start Free Trial" inside the sticky CTA must execute the primary action immediately (opening cart drawer or triggering modal), rather than forcing a scroll back up.
- **Loading & Success Feedback:** Include inline spinner state on button click to prevent double-tapping.

### 5. Stacking Context & Focus Management

Prevent UX bugs with competing overlays and screen readers.

- **Z-Index System Allocation:**
  - Base Content: `z-index: 1–10`
  - Sticky Headers: `z-index: 100`
  - Sticky CTA Bar: `z-index: 200`
  - Chat Widgets: Offset bottom spacing by sticky CTA height (`bottom: 80px`) when sticky CTA is active.
  - Modals & Drawers: `z-index: 1000+` (must visually cover sticky CTA).
- **WCAG Accessibility & Unobscured Focus:**
  - Include readable `aria-label` on sticky bar CTA.
  - Set `scroll-margin-top` / `scroll-margin-bottom` on main focusable inputs so keyboard tabbing is not obscured by the sticky CTA bar.

---

## Decision Rules

- **Hero Intersection Rule:** The sticky CTA bar *must never* be visible while the primary hero CTA is in the viewport. Premature display causes visual duplication and distracts the user.
- **Single Primary Action Rule:** Limit the sticky bar to **one primary action button**. Offering multiple conflicting buttons (e.g., "Buy Now" + "Learn More" + "Call Us") in a restricted floating bar destroys conversion focus.
- **Maximum Height Rule:** The mobile sticky CTA container must never exceed **80px** total height (including safe area padding). Consuming >15% of vertical viewport space degrades reading comfort.
- **Chat Widget Clearance Rule:** When a bottom sticky CTA is visible on mobile, automatically adjust live chat floating icons using CSS custom properties (`bottom: calc(72px + env(safe-area-inset-bottom))`) to eliminate overlap.
- **Footer Auto-Hide Rule:** Automatically hide the floating sticky CTA when scrolling into within `100px` of page footers or inline multi-step forms where native submit buttons reside.

---

## Common Failure Patterns

- **Premature Display Overlap:** Showing the sticky CTA bar immediately on page load, covering part of the hero section and distracting the user before they read the value proposition.
- **Mobile Safe Area Clipping:** Failing to use `env(safe-area-inset-bottom)`, causing the CTA button to be partially cut off by iOS swipe bars or Android gesture areas.
- **Chat Widget Obscuration:** Placing sticky bottom bars on top of live chat triggers (Intercom, Drift, Gorgias), rendering chat unclickable and creating ugly UI overlaps.
- **Out-of-Sync State:** Displaying an outdated base price or wrong variant in the sticky bar after a user selected a higher tier or custom option on the main page.
- **Scroll Jank & Layout Shift (CLS):** Triggering sticky bar toggles via unthrottled window `scroll` event listeners rather than `IntersectionObserver`, causing stuttery scrolling and layout shifts.
- **Passive Scroll Jumping:** Clicking the sticky CTA button merely scrolls the page back up to the top buy box instead of executing the add-to-cart or checkout trigger directly.

---

## Validation Methods

- [ ] **Mobile Primary CTA Click-Through Rate (CTR):** (Sticky CTA Clicks + Hero CTA Clicks) / Total Mobile Pageviews. Target: **+15% to +35%** relative increase in primary CTA clicks.
- [ ] **Overall Mobile Conversion Rate (CVR):** (Completed Orders or Signups on Mobile / Total Mobile Visitors) * 100. Target: **+8% to +20%** lift.
- [ ] **Mid-Page Scroll-to-Action Rate:** Measure conversion rate of users who scroll past 50% depth. Target: **+25%** lift compared to non-sticky baseline.
- [ ] **Cumulative Layout Shift (CLS) Impact:** Confirm CLS score remains `<0.1` when sticky CTA toggles visibility.
- [ ] **Chat & Support Engagement Integrity:** Verify live chat open rates remain stable with zero touch overlap reported.
