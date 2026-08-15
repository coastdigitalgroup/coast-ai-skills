---
name: exit-intent-recovery
description:
  Audit and optimize exit-intent interventions to recover abandoning users and
  convert them into leads or customers. Trigger this skill when a site has high
  bounce or abandonment rates and no mechanism to capture users before they
  leave.
---

# Exit-Intent Recovery

## Purpose

The Exit-Intent Recovery skill provides a systematic framework for capturing
value from users who are about to leave a website. By detecting abandonment
signals and triggering context-aware interventions (such as discounts, lead
magnets, or assistance), this skill aims to reduce bounce rates, minimize cart
abandonment, and increase overall conversion volume. It transforms a "lost"
visitor into a lead, subscriber, or customer at the moment of highest friction.

## Use Cases

- **E-commerce:** Reducing cart abandonment by offering a last-minute discount
  or "Save for Later" option.
- **SaaS Landing Pages:** Capturing leads from users who aren't ready to sign up
  for a trial but might want a free resource (whitepaper, checklist).
- **Pricing Pages:** Offering a demo or a "Talk to an Expert" prompt when a user
  shows hesitation on high-value tiers.
- **Content Sites:** Increasing newsletter subscriptions by offering a content
  upgrade as a user prepares to exit an article.

## When NOT to Use

- **High-Momentum Flows:** Do not interrupt users who are actively progressing
  through a multi-step form or checkout (unless they show signs of "stuck"
  behavior or are moving to close the tab).
- **Post-Conversion:** Avoid showing exit-intent prompts to users who have just
  completed the primary goal (e.g., after "Order Complete").
- **Low-Value Pages:** Don't use on utility pages like "Privacy Policy" or
  "Terms of Service" where abandonment is expected and non-critical.
- **Privacy-Restricted Environments:** Where aggressive tracking of mouse
  movement or behavior might violate strict regional compliance or brand
  integrity.
- **Entry-Triggered Overlays:** For popups shown on page arrival rather than
  on exit intent, see `welcome-popup-optimization`.
- **Persistent, Non-Blocking Messaging:** For an always-visible top-of-page
  message rather than a triggered overlay, see `announcement-bar-optimization`.

## Inputs

1. **Abandonment Analytics:** Data on which pages have the highest exit rates.
2. **Current Offer Inventory:** Available lead magnets, discounts, or service
   promises (e.g., "Free consultation").
3. **User Intent by Page:** What was the user looking for on the specific exit
   page? (e.g., Pricing vs. Product Details).
4. **Technical Trigger Capabilities:** Ability to detect mouse velocity, tab
   switching, or scroll-up (on mobile).

## Outputs

1. **Exit-Intent Audit:** Identification of key "leakage" points in the funnel.
2. **Contextual Offer Strategy:** A map of which recovery offer to show on which
   page segment.
3. **Optimized Popup/Overlay Design:** Guidance on copy, visual hierarchy, and
   CTA for the intervention.
4. **Logic & Timing Specs:** Rules for when to trigger (e.g., "Once per
   session," "After 30 seconds on page").

## Workflow

### 1. Identify Leakage Points

Audit analytics to find where users are dropping off. Focus on "High Intent,
High Exit" pages:

- Checkout Step 1
- Pricing Page
- High-traffic Product Detail Pages (PDPs)

### 2. Match Offer to Context (The "Pivot")

Don't show the same offer everywhere. Pivot based on page type:

- **E-commerce Cart:** Offer a discount, free shipping, or "Email my cart."
- **Informational Blog:** Offer a related lead magnet (PDF, template).
- **Service/SaaS Page:** Offer a "Low Friction" next step (Demo, Newsletter).

### 3. Draft the Recovery Copy

The copy must acknowledge the exit and provide immediate value.

- **Headline:** Address the hesitation (e.g., "Not ready to buy yet?", "Wait!
  Don't leave empty-handed").
- **Benefit:** State the value clearly (e.g., "Take 10% off your first order").
- **CTA:** Use a low-friction, high-value verb (e.g., "Get My Discount," "Send
  Me the Guide").

### 4. Set the Behavioral Triggers

Define the technical rules for showing the intervention:

- **Desktop:** Trigger on "Mouse-out" (moving cursor toward the browser bar).
- **Mobile:** Trigger on "Fast Scroll Up" or "Back Button" press.
- **Inactivity:** Trigger after X seconds of no movement on a high-intent page.

### 5. Define "Persistence" and "Annoyance" Rules

Ensure the intervention doesn't degrade the user experience.

- **Frequency:** Limit to once per 7-30 days per user.
- **Suppression:** Hide the exit-intent if the user has already converted in the
  current session.
- **Ease of Exit:** The "Close" (X) button must be highly visible and easy to
  click (especially on mobile).

## Decision Rules

- **The Value-Exchange Rule:** The recovery offer must be significantly more
  valuable than the effort required to stay (e.g., a real discount vs. a generic
  "Sign up for updates").
- **Relevance over Revenue:** On informational pages, prioritize lead capture
  (newsletter/guide) over direct sales (discounts).
- **Mobile-Specific Design:** For mobile exit-intent, use full-screen overlays
  with large tap targets, as "mouse-out" detection is unavailable.
- **The "No-Pressure" Exit:** Always provide a clear "No thanks" or "I'm not
  interested" link that closes the intervention immediately.

## Constraints

- **Honest Offers:** Discounts and incentives must be genuine — fake exit offers erode brand trust and may violate advertising standards.
- **Mobile Limitation:** Exit-intent detection is unreliable on mobile (no mouseout event); mobile strategies require alternative triggers such as scroll velocity or inactivity.
- **Consent Compliance:** Email capture through exit overlays must comply with GDPR/CCPA opt-in requirements.

## Non-Goals

- Email re-engagement campaigns for users who have already left the site.
- Paid retargeting ad strategy for abandoning visitors.
- Fixing the underlying UX or offer issues that drive users to exit in the first place.

## Common Failure Patterns

- **Generic "Wait!" Popups:** Showing the same generic message on every page,
  regardless of user context.
- **Immediate Interruption:** Triggering the "exit" popup too early (e.g.,
  within 2 seconds of page load), which users perceive as spam.
- **Impossible to Close:** Tiny or hidden "X" buttons that frustrate users and
  damage brand trust.
- **Breaking the Flow:** Showing an exit-intent popup to someone who just
  clicked a "Buy" button (false positive).
- **Incompatible Offers:** Offering a discount on a page where the user is
  seeking support or documentation.

## Validation Criteria

- [ ] **Exit-Intent Conversion Rate (EICR):** (Conversions from Exit-Intent / Total
  Exit-Intent Displays) \* 100.
- [ ] **Abandoned Cart Recovery Rate:** Percentage of users who return to complete a
  purchase after seeing an exit-intent offer.
- [ ] **Lead Volume Growth:** Measure the increase in total leads/subscribers
  attributed specifically to the exit-intent source.
- [ ] **Bounce Rate Impact:** Monitor if the intervention actually keeps users on
  the site for longer or leads to secondary page views.
