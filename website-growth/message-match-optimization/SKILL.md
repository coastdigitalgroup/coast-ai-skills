---
name: message-match-optimization
description:
  Audit and optimize the alignment between traffic sources (ads, emails, social
  posts) and destination landing pages. Trigger this skill when a page has high
  bounce rates from specific traffic sources or low conversion despite high
  click-through rates on ads.
---

# Message Match Optimization

## Purpose

The Message Match Optimization skill provides a systematic framework for
ensuring that the expectations set by a traffic source (the "Ad") are perfectly
met by the destination page (the "Landing Page"). This "Scent of Information" is
critical for reducing bounce rates and maintaining user momentum. When a user
clicks an ad, they have a specific goal or expectation; if the landing page
fails to validate that expectation within 3 seconds, they will leave.

## Use Cases

- Optimizing Paid Search (Google Ads) journeys to improve Quality Score and
  conversion.
- Aligning Social Media ads (Facebook, Instagram, LinkedIn) with dedicated
  landing pages.
- Improving the transition from Email Marketing campaigns to product or offer
  pages.
- Audit of "broken scent" in organic search results vs. content.

## When NOT to Use

- **Generic Homepage Optimization:** If the traffic is diverse and not tied to a
  specific campaign, focus on `hero-section-optimization` instead.
- **Deep Site Navigation:** For users already deep within an app or logged-in
  experience where context is already established.
- **Brand Awareness Campaigns (No CTA):** Where there is no specific expectation
  of a follow-up action.

## Inputs

1. **Traffic Source Assets:** Copy, headlines, images, and the specific offer or
   promise made in the ad/email/post.
2. **Destination URL:** The current landing page or homepage where the traffic
   is being sent.
3. **Primary User Intent:** What is the user trying to achieve by clicking?
4. **Analytics by Source:** Bounce rate and conversion rate specifically for the
   traffic source being audited.

## Outputs

1. **Message Match Audit:** A gap analysis between the source "promise" and the
   destination "delivery."
2. **Headline & Copy Alignment:** Rewritten headlines and subheadlines that
   mirror the ad creative.
3. **Visual Continuity Recommendations:** Guidance on using consistent imagery,
   colors, and branding.
4. **CTA Continuity Plan:** Ensuring the "Ask" on the page matches the "Offer"
   in the ad.

## Workflow

### 1. Identify the "Promise" (The Source)

Analyze the traffic source (ad, email, or social post).

- What is the primary headline?
- What is the specific offer (e.g., "50% off", "Free Guide", "Book a Demo")?
- What is the visual style or key image used?
- What is the CTA text?

### 2. Audit the "First Impression" (The 3-Second Rule)

Open the landing page and assess what is visible "above the fold" in the first 3
seconds.

- Does the Headline immediately use the same keywords as the ad?
- Does the main image feel like a continuation of the ad's visual?
- Is the offer from the ad the most prominent thing on the page?

### 3. Map the Information Scent

Trace the path from click to conversion.

- **Headline Match:** The landing page H1 should be a direct reflection of the
  ad's headline or primary hook.
- **Visual Match:** If the ad showed a specific product or person, that same
  subject should appear on the landing page.
- **CTA Match:** If the ad said "Get a Quote," the landing page button should
  say "Get a Quote," not "Learn More."

### 4. Close the Gaps

Propose specific changes to the landing page to repair the "broken scent":

- **Update H1:** Use "Mirroring" to reflect ad copy.
- **Adjust Visuals:** Replace generic stock photos with assets that match the
  campaign creative.
- **Simplify the Path:** Remove any distracting links or content that doesn't
  relate to the specific campaign promise.

### 5. Review Against Decision Rules

Verify that the journey feels like a single, cohesive experience.

## Decision Rules

- **The Mirror Rule:** The H1 of the landing page must contain the core keyword
  or phrase used in the ad headline.
- **No Bait-and-Switch:** If the ad promises a specific discount or feature, it
  must be explicitly mentioned above the fold on the landing page.
- **Visual Persistence:** Use the same color palette and, if possible, the same
  key visual asset between the source and the destination.
- **The "Scent" Priority:** In a conflict between "Brand Consistency" and
  "Message Match," prioritize Message Match for campaign-specific landing pages.

## Common Failure Patterns

- **The "Generic Catch-All":** Sending targeted ad traffic to a generic
  homepage.
- **Headline Disconnect:** Ad says "Best CRM for Lawyers," landing page H1 says
  "Software for Professionals."
- **Broken Promise:** Ad mentions a price or offer that is nowhere to be found
  on the page.
- **Visual Shock:** Ad is bright and modern; landing page is dark and outdated
  (breaks brand trust).
- **CTA Pivot:** Ad says "Download the Ebook"; landing page forces a "Contact
  Sales" demo request.

## Validation Methods

- **Scent Test:** Show a user the ad for 3 seconds, then show them the landing
  page for 3 seconds. Ask: "Did you arrive where you expected?"
- **Bounce Rate by Source:** Monitor if bounce rates for specific campaigns
  decrease after optimization.
- **Quality Score (Google Ads):** Look for an increase in the "Landing Page
  Experience" component of Google Ads Quality Score.
- **Conversion Lift:** Measure the increase in CVR for traffic coming from the
  optimized journey.
