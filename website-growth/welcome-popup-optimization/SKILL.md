---
name: welcome-popup-optimization
description:
  Audit and optimize welcome offer popups and overlays to maximize first-time
  visitor email and SMS opt-ins, improve purchase conversion velocity, and
  prevent mobile user bounce rates.
---

# Welcome Popup Optimization

## Purpose

The Welcome Popup Optimization skill provides a systematic framework for auditing, designing, and refining welcome overlays and popups. First-time visitors represent the largest segment of traffic on most websites, yet up to 98% of them leave without purchasing. Welcome popups are the single most effective tool to capture these anonymous visitors and convert them into owned subscribers. However, poorly implemented popups create extreme user friction, trigger search engine penalties, and drive up mobile bounce rates. This skill balances aggressive subscriber growth with clean UX and accessibility.

## Use Cases

- E-commerce and DTC websites looking to capture first-time shopper contacts (Email/SMS) and drive immediate first purchases.
- High-traffic blogs, media publishers, and resource hubs building newsletter lists.
- SaaS and B2B platforms offering a low-friction top-of-funnel welcome incentive or resource before direct product engagement.
- High-intent brands launching new products or seasonal promotions where building a pre-interest database is critical.

## When NOT to Use

- **Middle and Bottom-of-Funnel Pages:** Do not show welcome popups on product detail pages (PDPs), cart pages, checkout funnels, or critical customer support portals, where they disrupt purchase or resolution momentum.
- **SaaS Logged-In Interfaces:** Once a user is logged in, use notification centers or in-app guidance rather than global overlays.
- **B2B High-Ticket Consulting Landing Pages:** Where the brand positioning is highly professional and high-touch, and typical "spin-to-win" or "10% off" overlays damage credibility.
- **Top-of-Funnel High-Bounce Ad Campaigns:** If paid search ads are targeting hyper-specific long-tail queries (e.g., "how to fix a leaking pipe"), an immediate welcome popup will cause instant exit.

## Inputs

1. **Current Opt-In Performance:** Email and SMS sign-up rates for first-time visitors (OIR - Opt-in Rate).
2. **Device Metrics:** Traffic breakdown (Desktop vs. Mobile) and corresponding bounce rates.
3. **Current Offers & Incentives:** Welcome discounts (e.g., 10% off, free shipping, free gift), gated lead magnets, or exclusive community access.
4. **Current Overlay Assets:** Wireframes, designs, or live screenshots of existing popups across desktop and mobile.
5. **Tech Stack Capabilities:** Platform limitations (e.g., Klaviyo, Attentive, Privy, or custom JS templates) for multi-step forms, cookie suppression, and trigger rules.

## Outputs

1. **Welcome Experience Audit:** A detailed diagnostic report flagging timing, mobile accessibility, and content friction issues.
2. **Two-Step Capture Architecture:** A schematic mapping out the multi-stage capture sequence (Step 1: Email, Step 2: SMS, Step 3: Success Code).
3. **Optimized Copy and Incentive Spec:** Contextual headlines, body text, and microcopy targeting maximum motivation.
4. **Suppression & Targeting Rules:** Concrete guidelines for browser cookies, frequency capping, and audience exclusion (e.g., hiding from existing subscribers).
5. **Mobile-Responsive Interaction Spec:** Exact touch-target dimensions and overlay layouts compliant with SEO and accessibility standards.

---

## Workflow

### 1. Audit Timing & Behavioral Triggers

Most sites trigger their welcome popups immediately upon page load. This is a "deadly sin" of conversion optimization that disrupts the user's initial orientation and causes high bounce rates.
- **Implement a Reading Delay:** Wait until the user has oriented themselves. The standard minimum is **5 to 8 seconds** on the site, or after the user scrolls **30% to 50%** of the page depth.
- **Leverage Intent-Based Triggers:** Use exit-intent detection on desktop as a backup or primary trigger for users who are about to leave without engaging.
- **Mobile Fallback Banner:** For mobile viewports, consider starting with a minimal, non-intrusive floating bar or bottom drawer that expands when tapped, rather than a full-screen blocker.

### 2. Implement the Two-Step Opt-In Sequence

Asking for both an Email address and a Phone number in a single form introduces extreme cognitive friction and drops conversion rates by up to 60%.
- **Step 1: Email Only:** Present a single input field for the email address with a highly visible primary CTA (e.g., "Unlocks 15% Off").
- **Step 2: SMS Option (In-Line Progression):** Upon submitting the email, dynamically swap the form contents inside the same overlay to request the phone number. Reframe the motivation: "Want SMS updates? We'll text your discount code right away."
- **Preserve Step 1 Submissions:** Ensure that even if the user closes the popup on Step 2, their Step 1 email is already successfully submitted and recorded in the database.
- **Step 3: Immediate Gratification:** Show the discount code directly on the success screen with a simple "Copy Code" button, in addition to sending it via email/SMS. Do not force them to leave your site and check their inbox just to get the code.

### 3. Maximize Motivation (Offer Architecture)

A welcome popup's conversion rate is directly tied to the perceived value of the offer vs. the friction of giving away personal contact data.
- **The Clear "Scent of Value":** Do not use generic "Join our newsletter" copy. Focus on the tangible benefit:
  - *Bad:* "Subscribe to our emails."
  - *Good:* "Get $15 off your first order over $50."
- **Tiered Incentives:** If standard discounts erode margin, test alternative welcome hooks:
  - "Unlock free shipping on your first order."
  - "Get our exclusive [Asset Name] checklist."
  - "Enter our monthly $500 product giveaway."
- **Urgency Framing:** Add a subtle, non-coercive timeline to the success code (e.g., "Code valid for the next 48 hours") to drive immediate purchase velocity.

### 4. Solve the Mobile Dismissal Crisis

The majority of welcome popup abandonment on mobile occurs because the popup is impossible to close. Users get stuck, feel trapped, and bounce.
- **The 44x44px Touch Target:** The close button ("X") must be a minimum of **44px by 44px** to match touch-screen accessibility standards. Do not make the close button a tiny 12px text link.
- **Off-Canvas/Scrim Tap-to-Dismiss:** Allow users to dismiss the popup by tapping any empty space outside the popup container (the dark background overlay or scrim).
- **Keyboard Dismissal (ESC):** Ensure pressing the "Escape" key on desktop instantly closes the overlay.
- **Suppress Mobile Keyboard Blocking:** Design the popup so input fields do not get covered by the mobile native keyboard when active. On mobile, place the input fields near the upper half of the screen.

### 5. Configure Suppression & Frequency Rules

A welcome popup should only be seen by anonymous first-time visitors who haven't subscribed yet.
- **Suppress Existing Contacts:** If a user lands on the site via an email newsletter link or SMS link, parse the URL parameters (e.g., `utm_source=klaviyo` or `uid=123`) and suppress the popup entirely.
- **Frequency Capping:** Set a local storage or cookie-based frequency cap. If a visitor dismisses the popup, do not show it to them again for at least **30 days**.
- **Customer Exclusions:** Suppress the welcome popup for any user who has a completed order history or an active account login.

---

## Decision Rules

- **The "Two-Step over Single-Step" Rule:** If you need to collect both email and SMS, always use a two-step multi-frame popup. Asking for both fields at once is prohibited as it creates high-friction drop-offs.
- **The "No Intrusive Interstitial" Rule on Mobile:** To comply with Google's SEO mobile layout rules, mobile overlays must not cover the entire main screen immediately on entry. Keep mobile popups to a maximum of **35% of the viewport height** upon initial automatic display, or trigger them only on explicit user click/tap.
- **The Immediate Submission Rule:** When a user clicks "Next" or "Submit" on Step 1 of a multi-step popup, the email must be sent to the database instantly. Do not wait for Step 2 or Step 3 completion.
- **Actionable CTA Text:** Never use passive words like "Submit," "Subscribe," or "Send." Use high-motivation, action-oriented phrases: "Unlock My 10% Off," "Reveal Code," or "Claim My Free Gift."

---

## Constraints

- **Compliance & Legal Gating:** SMS opt-ins must include explicit, un-checked consent copy and link to the terms and conditions / privacy policy. You cannot pre-check the SMS marketing consent box.
- **GDPR Compliance:** For European Union visitors, email signup forms must not pre-check the marketing newsletter checkbox. Consent must be an explicit, separate opt-in.
- **Accessibility:** Ensure the popup is accessible via screen readers, uses sufficient color contrast, and follows logical tab ordering for keyboard navigability.

## Non-Goals

- Setting up deep backend integrations or writing custom database connectors for email service providers (ESPs).
- Creating full automated email nurture flows (the actual welcome email sequences are a downstream marketing asset).
- Managing overall brand visual assets, typography choices, or logo designs.

---

## Common Failure Patterns

- **The "Instant Flash":** Showing the popup the exact millisecond the page loads, interrupting the user before they even know what the company sells.
- **The "Invisible Close Button":** Making the "X" button tiny, grey-on-grey, or positioned off-screen on mobile devices, trapping the user.
- **The "Zombie Popup":** Showing the welcome popup to returning active customers who are already logged in or have subscribed years ago.
- **The "Double-Gated Checkout":** Forcing a user to subscribe via a welcome popup, only to show them a second, different subscription popup when they reach the cart or checkout.
- **Form Data Wipeout:** If a user inputs a typo (e.g., `name@gamil.com` instead of `gmail.com`), wiping out the entire form and forcing them to re-enter all fields. Highlight the specific error and preserve the inputted text.

---

## Validation Criteria

- [ ] **Opt-In Conversion Rate (OIR):** (Subscribers captured / Total unique visitors to the site) * 100. Target: **5% to 12%** for e-commerce sites.
- [ ] **Step 1 to Step 2 Transition Rate:** Percentage of users who submit Step 1 (Email) and proceed to view Step 2 (SMS). Target: **>85%**.
- [ ] **Welcome Code Redemption Rate (CVR):** (Orders using the welcome discount code / Total welcome subscribers captured) * 100. Target: **8% to 15%** within 7 days of subscribing.
- [ ] **Mobile Bounce Rate Stability:** Compare mobile bounce rates before and after implementing the optimized popup. If bounce rates spike by >2%, adjust triggers or reduce popup viewport coverage.
- [ ] **Dismissal Rate and Exit Tracking:** Monitor the percentage of users who close the popup immediately vs. those who convert. If dismissal rate is >90%, test a stronger incentive or a longer trigger delay.
