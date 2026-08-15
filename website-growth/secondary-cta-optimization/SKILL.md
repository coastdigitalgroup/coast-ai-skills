---
name: secondary-cta-optimization
description:
  Audit and optimize Secondary Calls-to-Action (SCTAs) to capture "Not Ready
  Yet" visitors, reducing bounce rates and building a long-term lead pipeline
  without cannibalizing primary conversions.
---

# Secondary CTA Optimization

## Purpose

The Secondary CTA Optimization skill addresses the "Conversion Binary" problem:
the reality that on most pages, a user either completes the primary high-intent
action (e.g., "Buy Now" or "Book a Demo") or they leave. For many users, the
primary CTA represents too high a hurdle for their current stage of awareness or
trust. This skill provides a framework for implementing low-friction
"Micro-Commitments" that capture these users, keeping them in the funnel and
building the trust necessary for a future primary conversion.

## Use Cases

- **High-Ticket B2B:** Where "Contact Sales" is a massive leap for a first-time
  visitor.
- **Complex SaaS:** Where users want to "Watch a Demo" before "Starting a
  Trial."
- **Considered E-commerce:** For products with long research cycles (e.g.,
  furniture, high-end electronics) where "Download a Guide" or "Compare Models"
  is a valuable mid-funnel step.
- **Educational Content:** Bridging the gap between reading a blog post and
  signing up for a product.

## When NOT to Use

- **Low-Cost Impulse Buys:** For simple products (e.g., a $10 t-shirt), a
  secondary CTA often creates "Choice Paralysis" and reduces overall conversion.
- **Deep Checkout Funnels:** Once a user is in the checkout or final signup
  flow, any secondary action acts as a distraction and should be removed.
- **Urgency-Driven Pages:** On pages where the offer is extremely time-limited
  (e.g., a Flash Sale), focus 100% of the attention on the primary goal.
- **Multiple In-Body Contextual Links:** For placing several section-specific
  CTAs throughout long-form content, see `contextual-cta-optimization`.

## Inputs

1. **Primary Goal:** The single most important action on the page.
2. **Commitment Gap Analysis:** An assessment of how "heavy" the primary action
   is (e.g., does it require a credit card? A 30-minute call? High cost?).
3. **Asset Library:** Available low-friction resources (videos, PDFs,
   calculators, newsletters).
4. **Current Conversion Metrics:** Primary CTA conversion rate and overall page
   bounce rate.

## Outputs

1. **SCTA Strategy Map:** A selection of "Intent-Matched" secondary offers for
   specific pages.
2. **Visual Hierarchy Specs:** Guidance on button styling, placement, and
   contrast to ensure the SCTA remains subordinate to the primary.
3. **Microcopy Recommendations:** Benefit-driven copy for the SCTA that
   emphasizes low risk and high immediate value.
4. **Funnel Integration Plan:** Defining how the SCTA leads the user toward the
   eventual primary conversion.

## Workflow

### 1. Identify the Commitment Gap

Evaluate your primary CTA. If your bounce rate is high (60%+) and your primary
conversion is low (<2%), the "ask" is likely too big for the average visitor.
Calculate the "Commitment Cost":
- Does it cost money?
- Does it cost time?
- Does it require giving up sensitive data?

### 2. Audit Visitor Intent

Determine what a "Not Ready Yet" visitor is actually looking for.
- Are they looking for **Proof?** (Secondary: "See Case Studies")
- Are they looking for **Education?** (Secondary: "Download the Guide")
- Are they looking for **Visuals?** (Secondary: "Watch 2-Min Demo")
- Are they looking for **Confidence?** (Secondary: "View Comparison")

### 3. Match the "Micro-Commitment"

Select a secondary action that is at least 5x "lighter" than the primary.
- **Primary:** "Book a 30-min Demo" -> **Secondary:** "Watch 2-min Video."
- **Primary:** "Start 14-Day Trial" -> **Secondary:** "Get Feature Checklist."
- **Primary:** "Buy Now" -> **Secondary:** "Calculate My Savings."

### 4. Implement Visual Subordination

Ensure the secondary CTA does not compete with the primary for attention.
- **The "Ghost" Style:** Use an outline (ghost) button for the secondary and a
  solid, high-contrast button for the primary.
- **Proximity:** Place the secondary near the primary to capture the eye as it
  scans the decision area, but ensure it is visually "quieter."
- **Text Links:** In some cases, a simple text link below the main button is the
  most effective secondary CTA.

### 5. Define the "Nurture Path"

A secondary conversion is only valuable if it leads to a primary one.
- What happens after they click?
- Does the "Watch Demo" video end with a "Start Trial" button?
- Does the "Download Guide" email sequence eventually ask for the "Sales Call"?

## Decision Rules

- **The Subordination Rule:** The SCTA must never be more visually prominent
  than the primary CTA. If a user "squints," the primary should be the only
  thing they see.
- **The "Single Alternative" Rule:** Never offer more than one secondary CTA in
  the same visual field. Too many choices lead to zero action.
- **Intent Alignment:** The SCTA must be a logical "stepping stone" toward the
  primary goal, not a tangential distraction.
- **Low-Barrier Entry:** If the secondary CTA requires a form, it must have
  significantly fewer fields than the primary (or no fields at all, e.g., a
  video play).

## Constraints

- **No Cannibalization:** The goal is to capture users who would have otherwise
  bounced, not to divert users who were ready to take the primary action.
- **Asset Quality:** A secondary CTA is a promise of value. If the "Demo Video"
  or "Guide" is poor quality, it will destroy the trust needed for the primary
  conversion.
- **Tracking Accuracy:** Secondary conversions must be tracked separately from
  primary conversions to avoid inflating "Success" metrics.

## Non-Goals

- Creating the lead magnets or video content themselves.
- Email marketing automation or lead nurturing sequences.
- Retargeting ad strategy for users who took the secondary action.

## Common Failure Patterns

- **The "Equal Weight Trap":** Making the "Buy Now" and "Learn More" buttons
  the same color and size, causing user hesitation.
- **The "Dead End" Secondary:** Providing a resource (like a PDF) that doesn't
  have a clear next step back to the primary CTA.
- **Data Greed:** Asking for a phone number for a "Simple Guide." The friction
  of the SCTA should match the value of the asset.
- **Irrelevant Offers:** Offering a newsletter signup on a high-intent product
  page instead of a product-specific comparison or demo.

## Validation Criteria

- [ ] **Total Lead Volume:** (Primary Conversions + Secondary Conversions). Goal:
  Increase overall "Lead Capture" by 20-50%.
- [ ] **Cannibalization Check:** Ensure the Primary Conversion Rate does not
  drop significantly (>5% relative) after adding the SCTA.
- [ ] **Funnel Progression:** Percentage of users who take the SCTA and
  eventually complete the primary action (Assist Value).
- [ ] **Bounce Rate Reduction:** Measure the decrease in page exits after the
  introduction of the SCTA.
