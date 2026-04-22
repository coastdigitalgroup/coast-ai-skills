---
name: message-match-optimization
description:
  Audit and optimize the alignment between traffic sources (ads, emails, social)
  and landing pages to maintain the "scent of information" and reduce bounce
  rates. Trigger this skill when paid traffic has high bounce rates despite
  strong ad performance.
---

# Message Match Optimization

## Purpose

The Message Match Optimization skill provides a framework for ensuring that the
promise, tone, and visual cues of a traffic source (the "Ad") are immediately
fulfilled on the destination page (the "Landing Page"). This maintains the
**Scent of Information**—the trail of cues that users follow to reach their
goal. Strong message match reduces cognitive friction and prevents "click
shock," leading to significantly lower bounce rates and higher conversion
efficiency.

## Use Cases

- Paid search campaigns (Google Ads) with high bounce rates.
- Social media ads (Meta, LinkedIn) where the "vibe" of the ad doesn't match the
  page.
- Email marketing campaigns where the CTA promise isn't the first thing seen on
  the page.
- Affiliate traffic or co-marketing landing pages.

## When NOT to Use

- **Direct Navigation/Organic Homepage Traffic:** Where the user's intent is
  broad and not tied to a specific external promise.
- **Internal Product Navigation:** Where the user is already within an app and
  knows the context.
- **SEO/Long-tail Content:** Where the goal is general education rather than
  converting a specific ad-driven offer.

## Inputs

1. **The Source Material:** A screenshot or copy of the ad, email, or social
   post driving the traffic.
2. **The Destination URL:** The landing page where the traffic arrives.
3. **Primary CTA/Offer:** What exactly was promised in the source? (e.g., "Free
   Trial," "20% Discount," "Download Whitepaper").
4. **Target Keywords/Hooks:** The specific words or pain points used to get the
   click.

## Outputs

1. **Message Match Audit:** A comparison between the source and destination
   across Copy, Visuals, and Offer.
2. **Optimized Destination Copy:** Revisions to the H1 and subheadlines to match
   the ad's hook.
3. **Visual Alignment Guidance:** Recommendations for image or color adjustments
   to ensure continuity.
4. **Offer Sync Plan:** Ensuring the "Ask" on the landing page is identical to
   the "Offer" in the ad.

## Workflow

### 1. The "Scent of Information" Audit

Analyze the source and destination side-by-side. Score the match on a scale of
1-5 for:

- **Headline Match:** Does the landing page H1 use the same primary keywords as
  the ad?
- **Visual Match:** Are the colors, fonts, and imagery consistent with the ad?
- **Offer Match:** Is the specific deal or "carrot" exactly the same?

### 2. Identify "Click Shock" Points

Look for elements that might cause a user to feel they are in the wrong place:

- **Missing Keywords:** If the ad is about "Affordable CRM," but the page says
  "Enterprise Sales Platform," the scent is broken.
- **Visual Jarring:** An ad with a bright, playful design leading to a dark,
  serious corporate page.
- **The Hidden Offer:** If the ad promised "Free Shipping" but it's not
  mentioned until the footer or checkout.

### 3. Re-Align the Narrative

- **Echo the Headline:** The landing page H1 should be a direct evolution of the
  ad's headline.
- **Repeat the Hook:** If the ad focused on a specific pain point (e.g., "Stop
  losing leads"), that pain point must be the first thing addressed on the page.
- **Maintain Visual Thread:** Use the same hero image or a very similar style to
  the ad's creative.

### 4. Apply the 3-Second Rule

The user must realize they are in the "right place" within 3 seconds.

- Ensure the primary hook is "above the fold."
- Ensure the CTA button is visible and uses similar language to the ad's CTA.

### 5. Review Against Decision Rules

Verify the alignment against the growth heuristics below.

## Decision Rules

- **The Rule of Keywords:** At least 50% of the primary keywords in the ad must
  be present in the landing page H1 or subheadline.
- **Continuity of Offer:** The offer on the landing page must be at least as
  good as the ad. Never "downgrade" the offer (e.g., ad says "50% off," page
  says "Up to 50% off").
- **Visual Anchor:** If the ad uses a specific human face or product shot, that
  same anchor should ideally be visible on the landing page.
- **Tone Consistency:** If the ad is "edgy" and "informal," the landing page
  cannot be "stiff" and "academic."

## Common Failure Patterns

- **The "Bait and Switch":** An ad for a specific product leading to a general
  category page or homepage.
- **The "Generic Hero":** Using a high-performing ad hook but sending it to a
  landing page with a vague, "corporate-speak" headline.
- **The "Disconnected CTA":** Ad says "Get a Demo," Landing page button says
  "Contact Sales."
- **Visual Disconnect:** Using a stock photo in the ad and a completely
  different (or no) photo on the page.

## Validation Methods

- **The 3-Second Clarity Test:** Show the source, then show the destination for
  3 seconds. Ask: "Is this what you expected to see?"
- **Bounce Rate by Source:** Compare the bounce rate of the ad traffic vs.
  organic traffic. A high gap indicates a message match failure.
- **Click-Through Rate (CTR) to Next Step:** Measure how many users proceed from
  the landing page to the next step of the funnel.
- **Heatmap Consistency:** Check if users are looking at the headline first
  (scent follow) or immediately scrolling/looking for an exit.
