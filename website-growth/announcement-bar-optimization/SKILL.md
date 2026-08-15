---
name: announcement-bar-optimization
description:
  Audit and optimize top-of-page announcement bars (banners) to drive
  sitewide conversion, communicate critical urgency, and improve discovery of
  high-value offers without increasing cognitive load.
---

# Announcement Bar Optimization

## Purpose

The Announcement Bar Optimization skill provides a framework for maximizing the effectiveness of sitewide banners (utility bars). Often treated as a "set and forget" element, the announcement bar is high-value real estate that sits above the primary navigation. This skill focuses on transforming it from a static text block into a dynamic growth engine that drives specific user behaviors—such as reaching shipping thresholds, adopting new features, or acting on limited-time promotions—while minimizing "Banner Blindness."

## Use Cases

- **E-commerce:** Promoting free shipping thresholds (e.g., "Free shipping on orders over $50") or site-wide sales.
- **SaaS:** Announcing major feature launches, product updates, or system status (maintenance).
- **Lead Gen:** Driving traffic to a high-value lead magnet (e.g., "Join our webinar on Tuesday").
- **Urgency & Scarcity:** Displaying countdown timers or "ending soon" notices for promotions.
- **Geotargeting:** Showing location-specific info (e.g., "Now shipping to the EU").

## When NOT to Use

- **Critical Warnings:** For destructive actions or high-stakes errors, use `accessible-toast-implementation` or dedicated on-page alerts that require dismissal.
- **Primary Page Navigation:** Do not use the announcement bar as a replacement for the main nav or search.
- **Ad-Heavy Sites:** If the page already has multiple display ads or "sticky" overlays, adding an announcement bar can trigger "ad fatigue" and increase bounce rates.
- **Bottom-of-Funnel Focus:** In the final stages of checkout or on a focused "Contact Sales" form, the bar can be a distraction from the primary conversion goal.
- **Entry-Triggered Modal Overlays:** For a blocking popup shown on page arrival, see `welcome-popup-optimization`.
- **Exit-Intent-Triggered Recovery:** For a blocking overlay triggered by exit intent, see `exit-intent-recovery`.

## Inputs

1. **Primary Promotion/Objective:** What is the most important thing for a new visitor to know?
2. **Current Sitewide Metrics:** Average Order Value (AOV), Conversion Rate (CVR), and sitewide bounce rate.
3. **Audience Segments:** Are there different messages for first-time vs. returning visitors?
4. **Offer Data:** Stock levels, shipping thresholds, or promotion end dates.

## Outputs

1. **Announcement Bar Audit:** Evaluation of visibility, clarity, and mobile-ergonomics.
2. **Contextual Messaging Strategy:** A plan for rotating or segmenting messages based on user behavior or page type.
3. **Optimized Design Specs:** Recommendations for contrast, typography, and "sticky" behavior.
4. **Interaction Specs:** Guidance on "Dismissal" logic and persistence across sessions.

## Workflow

### 1. Define the Priority Lever

Identify the primary goal for the current campaign:
- **AOV Booster:** Shipping thresholds or "Spend $X, Get $Y."
- **Direct Conversion:** Flash sale or lead magnet.
- **Discovery/Awareness:** New product launch or event.

### 2. Draft the "Micro-Copy"

Because space is extremely limited (especially on mobile), use the **Hook-Value-Action** formula:
- **Hook:** Immediate context (e.g., "Summer Sale:").
- **Value:** The benefit (e.g., "Up to 40% off sitewide").
- **Action:** A clear, concise CTA (e.g., "Shop Now" or "Get the Guide").

### 3. Apply High-Contrast Design

The bar must be distinct from the header without clashing with the brand:
- Use a bold "Action Color" that contrasts with the main header background.
- Ensure text is large enough to be readable but doesn't push the hero content too far down.
- Maintain a clear hierarchy: the announcement text must be the most prominent element in the bar.

### 4. Optimize for Mobile & Persistence

- **Mobile Wrapping:** Ensure the bar doesn't take up more than 10-15% of the mobile viewport height. Use horizontal scrolling or "sliding" text if necessary for longer messages.
- **Sticky Behavior:** Decide if the bar should stay fixed at the top (to maintain urgency) or scroll with the page (to reduce distraction).
- **Dismissal Logic:** Provide an 'X' to close the bar. Use `localStorage` to ensure that if a user dismisses it, it stays hidden for a defined period (e.g., 24 hours).

### 5. Contextual Filtering (Advanced)

Don't show the same bar to everyone:
- **Cart-Specific:** If a user has $40 in their cart and the threshold is $50, change the bar to: "You're only $10 away from FREE shipping!"
- **Post-Conversion:** If a user just signed up, hide the "Sign Up" bar and show a "Check out our latest features" bar.

## Decision Rules

- **Clever vs. Clear:** Always prioritize clarity. "Free Shipping" beats "No-Cost Delivery" or "Shipping is on us."
- **The "One Message" Rule:** Never have more than one announcement bar active at a time. If you have multiple messages, rotate them within a single bar.
- **CTA vs. Text:** A linkable announcement bar is 5x more effective than a static one. The entire bar should be a clickable link to the relevant destination.
- **Accessibility:** Use `role="status"` or `aria-label="Announcement"` to ensure screen readers identify the region.

## Constraints

- **Viewport Real Estate:** On mobile, the announcement bar must not obstruct primary navigation (like hamburger menus) or search bars.
- **Messaging Accuracy:** Prices, dates, and stock levels mentioned in the bar must be updated in real-time to avoid misleading users.
- **Brand Identity:** While contrast is needed, the bar should not look like a 3rd-party "spam" banner; it must be clearly part of the site's UI.

## Non-Goals

- Creating the marketing assets or offers themselves (e.g., determining the discount %).
- Implementing the technical "sliding" or "rotating" animation code.
- Managing 3rd-party ad placements or external banner networks.

## Common Failure Patterns

- **Banner Blindness:** Using a color that is too similar to the site's primary theme, causing users to ignore it.
- **The "Unreachable Header":** On mobile, a tall announcement bar can push the hamburger menu or logo off the screen or into a "dead zone."
- **False Urgency:** Having an "Ending Soon" bar that remains on the site for weeks.
- **Broken Link:** Promoting an offer but linking to a generic homepage or a broken URL.
- **Distraction from Cart:** Showing a promotional bar in the checkout flow that tempts users to leave the funnel to find "better" deals.

## Validation Criteria

- [ ] **Click-Through Rate (CTR):** Measure the percentage of sitewide visitors who click the announcement bar.
- [ ] **AOV Improvement:** Track if shipping threshold bars increase the average order value.
- [ ] **Checkout Start Rate:** Measure if "Save $X" bars in the cart increase the number of users starting checkout.
- [ ] **Bounce Rate Stability:** Ensure that the addition of the bar does not significantly increase the bounce rate for mobile users.
- [ ] **Interaction Decay:** Monitor if CTR drops significantly over time, indicating a need for message rotation.
