---
name: message-match-optimization
description:
  Audit and optimize the consistency between an external traffic source (ads,
  emails, social) and the destination landing page. Trigger this skill when ad
  CTR is high but landing page bounce rate is also high, or when conversion
  rates are low despite strong individual components.
---

# Message Match Optimization

## Purpose

The Message Match Optimization skill provides a protocol for ensuring a seamless
transition for users moving from a traffic source (like a Google Ad, Facebook
Post, or Email) to a landing page. It focuses on maintaining the "Scent of
Information" by aligning headlines, visuals, keywords, and offers. High message
match reduces cognitive friction and bounce rates by immediately confirming to
the user that they have landed in the right place.

## Use Cases

- Optimizing Paid Search (PPC) campaigns where "Quality Score" is low.
- Improving the conversion rate of email marketing campaigns.
- Synchronizing social media promotions with dedicated landing pages.
- Troubleshooting high bounce rates on high-traffic landing pages.

## When NOT to Use

- **Organic Homepages:** Where the traffic sources are too varied to match a
  single message (though hero sections can still be optimized for general
  clarity).
- **In-App Navigation:** Where the user is already within a logged-in
  environment and the "source" is a known internal state.
- **Direct Traffic:** When there is no specific external "source" message to
  match against.

## Inputs

1. **Traffic Source Assets:** Screenshots or copy of the ad, email, or social
   post that the user clicks on.
2. **Landing Page URL/Screenshot:** The destination page the user sees
   immediately after clicking.
3. **Primary Keyword/Hook:** The specific phrase or promise that drove the
   click.
4. **Target Audience Intent:** Why did the user click? (e.g., "Looking for a
   discount," "Seeking a specific feature").
5. **Analytics Data:** Bounce rate and conversion rate specifically for the
   traffic source being audited.

## Outputs

1. **Message Match Audit:** A comparison of Source vs. Destination across key
   dimensions (Headline, Visuals, CTA, Tone).
2. **Optimized Landing Page Copy:** Revised H1 and subheadlines that
   specifically echo the source's promise.
3. **Visual Alignment Guidance:** Recommendations for imagery or design elements
   that bridge the gap between source and destination.
4. **Offer Synchronization:** ensuring the price, discount, or value proposition
   in the source is identical to the one on the page.

## Workflow

### 1. Source Analysis (Audit the Click)

Identify the "Hook" of the traffic source:

- What is the exact H1/Headline of the ad?
- What visual elements are used (colors, people, icons)?
- What is the specific call to action?
- What is the core promise or discount mentioned?

### 2. Destination Audit (Audit the Landing)

Perform the "Mirror Test":

- Does the Landing Page H1 contain the same keywords as the Ad Headline?
- Does the hero image feel like a continuation of the ad's visual style?
- Is the promised offer (e.g., "20% Off") immediately visible and identical?

### 3. Gap Identification

Flag "Cognitive Breaks":

- **Headline Gap:** Ad says "Affordable CRM," Landing Page says "Welcome to our
  Platform."
- **Visual Gap:** Ad uses a specific blue theme; Landing Page is bright orange.
- **Offer Gap:** Ad promises a "Free Trial"; Landing Page asks for a "Demo
  Booking."

### 4. Implementation (Bridge the Gap)

- **Headline Matching:** Ensure the landing page H1 uses the same primary
  keywords as the source.
- **Visual Continuity:** If the ad used a specific product screenshot, use a
  larger version of that same screenshot in the hero.
- **The "Dynamic" Approach:** If multiple ads point to one page, recommend
  Dynamic Text Replacement (DTR) to match headlines to ad groups.

### 5. Validation

Review the "Path to Conversion":

- Does the user feel a "sense of relief" upon landing?
- Is the "Scent of Information" preserved from click to conversion?

## Decision Rules

- **The H1 Rule:** The landing page H1 must reflect the ad headline within 3
  seconds of page load.
- **The Visual Anchor:** Use at least one common visual element (color, image,
  or icon) between the source and the destination.
- **Offer Parity:** Never change the offer between the ad and the page. If the
  ad says "Free," the page cannot say "Starting at $10."
- **Language/Tone Consistency:** If the ad is playful and informal, the landing
  page should not immediately shift to dense, corporate jargon.

## Common Failure Patterns

- **Generic Destinations:** Sending specific ad traffic to the homepage.
- **The Bait-and-Switch:** Promising one thing in an email but requiring
  multiple steps or a different action on the page.
- **Message Drift:** Over time, ads are updated while landing pages remain
  static, causing the match to degrade.
- **Headline Disconnect:** Using the company name as the H1 instead of the
  benefit promised in the ad.

## Validation Methods

- **Bounce Rate by Source:** Compare the bounce rate of the optimized page vs.
  the previous version for specific ad groups.
- **Expectation Survey:** Use a 1-question on-site poll: "Did this page provide
  what you expected based on the link you clicked?"
- **Conversion Rate Lift:** Measure the increase in CVR for the specific traffic
  segment.
- **Quality Score Improvement:** (Google Ads) Monitor the "Landing Page
  Experience" component of the Quality Score.
