---
name: user-intent-alignment
description:
  Audit and optimize the alignment between a user's stage in the buyer's journey
  (Awareness, Consideration, Decision) and the page's content, layout, and CTAs.
  Trigger this skill when high-traffic pages have high bounce rates or when
  conversion rates are low despite high-quality traffic.
---

# User Intent Alignment

## Purpose

The User Intent Alignment skill provides a systematic framework for matching a
website's experience to the user's psychological state. Most conversion
failures stem from "Intent Mismatch"—asking a user for a high-friction
commitment (like "Buy Now") when they are still in the early "Problem Aware"
stage. This skill focuses on diagnosing the user's level of awareness and
adjusting the content hierarchy and Calls-to-Action (CTAs) to provide the
logical next step, reducing bounce rates and building a high-velocity funnel.

## Use Cases

- **Educational Blog Posts:** Aligning informational content with low-friction
  lead magnets rather than direct product sales.
- **Comparison Pages:** Guiding "Solution Aware" users through the nuances of
  different options to build preference.
- **Direct-to-Product Landing Pages:** Ensuring that "Product Aware" users get
  the specific specs and proof they need to hit "Add to Cart."
- **Search Engine Results:** Optimizing pages that rank for high-intent vs.
  low-intent keywords.

## When NOT to Use

- **Generic Homepages:** Where the audience is too broad for a single intent;
  use `hero-section-optimization` to route users first.
- **Post-Purchase/Loyalty Flows:** Where the user's relationship is already
  established; intent is now about utility and retention.
- **Utility Tools/Dashboards:** Where the user is performing a specific task
  rather than browsing through a journey.
- **Ad/Source Copy Consistency:** For matching a specific ad or email's
  headline to the landing page, see `message-match-optimization`.
- **Section Ordering:** For the structure and sequence of page sections
  beneath the hero, see `landing-page-content-hierarchy`.

## Inputs

1. **Traffic Source Context:** What keywords did they search? Which ad did they
   click? (e.g., "how to fix X" vs. "buy product Y").
2. **Current Page Content:** The headline, body copy, and primary conversion
   goal.
3. **The 5 Levels of Awareness:** An assessment of where the user sits (Unaware,
   Problem Aware, Solution Aware, Product Aware, or Most Aware).
4. **Current Performance:** Bounce rate, scroll depth, and CTA click-through
   rate (CTR).

## Outputs

1. **Intent Alignment Audit:** Identification of friction points where the
   "Ask" exceeds the user's current "Awareness Level."
2. **Content-to-Intent Strategy:** Recommendations for adjusting the depth of
   information and the tone of the copy.
3. **Optimized CTA Framework:** A ladder of CTAs (Primary, Secondary, and
   Micro) matched to the user's journey stage.
4. **Visual Priority Plan:** Guidance on which elements to emphasize based on
   what the user is looking for (e.g., "Social Proof" for Solution Aware users).

## Workflow

### 1. Diagnose the Awareness Level

Identify which stage of the journey the visitor is in based on their entry
point:
- **Problem Aware:** "My [Process] is slow." (Needs: Empathy, Education).
- **Solution Aware:** "I need a better [Category] tool." (Needs: Comparison,
  Features).
- **Product Aware:** "Is [Company Name] better than [Competitor]?" (Needs: Proof,
  Specs).
- **Most Aware:** "I want to buy [Product]." (Needs: Price, Seamless Checkout).

### 2. Audit the "Intent Gap"

Compare the page's current "Ask" to the user's "Needs."
- Are we asking a "Problem Aware" user to "Book a Demo" (High Friction)
  instead of "Download a Checklist" (Low Friction)?
- Are we showing a "Most Aware" user a long "What is..." section that they
  already know?

### 3. Adjust the Content Depth

- **For Early Stages:** Focus on "Why" and the "Cost of Inaction." Use
  long-form content that builds authority.
- **For Middle Stages:** Focus on "How" and "Comparison." Use matrices,
  feature lists, and case studies.
- **For Late Stages:** Focus on "When" and "How Much." Use clean,
  frictionless layouts that remove all distractions.

### 4. Optimize the "Logical Next Step" (The CTA Ladder)

Replace mismatched CTAs with intent-aligned ones:
- **Early Intent:** "Learn More," "Get the Guide," "Subscribe for Tips."
- **Middle Intent:** "See How it Works," "Compare Plans," "Read Case Study."
- **Late Intent:** "Start Free Trial," "Buy Now," "Get a Quote."

### 5. Review Against Decision Rules

Verify that the page provides a "Bridge" to the next level of awareness.

## Decision Rules

- **The Awareness Ladder Rule:** You cannot jump more than one level of
  awareness in a single session without significant friction. Align your page
  to move the user *one* step forward.
- **Friction vs. Value:** The friction of the CTA must be proportional to the
  value the user has received on the page. Don't ask for a phone number for a
  basic blog post.
- **The "Scent" of Intent:** The primary headline must mirror the intent of the
  traffic source (e.g., if they searched for a problem, the headline must name
  the problem).
- **Secondary CTAs as "Safety Nets":** If a page has a high-intent primary CTA
  (e.g., "Buy Now"), always include a low-intent secondary CTA (e.g., "View
  Features") for users who aren't ready yet.

## Constraints

- **Messaging Consistency:** Intent alignment changes must not contradict the
  overall brand positioning or product truth.
- **Technical Capabilities:** Dynamic content adjustments based on traffic
  source require specific CMS or personalization tool capabilities.
- **Editorial Integrity:** Educational content must remain helpful; do not
  degrade the quality of a guide just to insert more conversion triggers.

## Non-Goals

- SEO keyword research or traffic acquisition strategy.
- Copywriting the entire page from scratch (focus is on structure and CTAs).
- Technical setup of attribution or personalization software.

## Common Failure Patterns

- **The "Premature Ask":** Placing a "Buy Now" button at the top of a beginner's
  educational guide.
- **The "Infinite Loop":** Providing great education but failing to offer any
  path forward to a solution.
- **The "Assumed Knowledge" Trap:** Using technical jargon for "Problem Aware"
  users who don't yet understand the category's terminology.
- **Ignoring the Source:** Sending users who searched for a specific competitor
  comparison to a generic product feature page.
- **Overwhelming Choice:** Offering "Problem Aware" users too many product
  options instead of one clear educational path.

## Validation Criteria

- [ ] **Bounce Rate Reduction:** Measure if users stay longer on the page after
  aligning content with their entry intent.
- [ ] **Next-Step Conversion Rate:** Track the percentage of users who move to the
  intended "Next Step" page (e.g., from Blog to Product Page).
- [ ] **Micro-Conversion Volume:** Measure the increase in low-friction actions
  (e.g., downloads) for early-intent traffic.
- [ ] **Qualitative Feedback:** User testing where participants are asked: "Did this
  page answer the question you had in mind?"
