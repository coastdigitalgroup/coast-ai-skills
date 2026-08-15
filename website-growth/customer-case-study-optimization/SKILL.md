---
name: customer-case-study-optimization
description:
  Audit and optimize customer case studies to transform them from passive
  narratives into high-conversion assets. Trigger this skill when case studies
  have low engagement, high bounce rates, or fail to drive prospects toward
  primary conversion actions.
---

# Customer Case Study Optimization

## Purpose

The Customer Case Study Optimization skill provides a systematic framework for
transforming customer success stories into active conversion assets. Many case
studies are written as passive narratives that lack clear outcomes or a path to
action. This skill focuses on optimizing structural narrative flow, the
visibility of measurable results, and friction-free pathing to CTAs. By using
the Problem-Solution-Result (PSR) framework, this skill directly improves Lead
Conversion Rate from success content.

## Use Cases

- **B2B SaaS:** Demonstrating technical capability and business ROI to
  stakeholders.
- **Service Agencies:** Proving the efficacy of a specific methodology or
  process.
- **Complex Products:** Reducing perceived risk by showing successful
  implementation in a similar industry.
- **Sales Enablement:** Providing the sales team with "proof points" that map
  directly to common prospect objections.

## When NOT to Use

- **B2C Low-Consideration Goods:** For simple products (e.g., apparel), use
  `social-proof-optimization` (reviews/testimonials) instead of long-form case
  studies.
- **Internal Success Reporting:** Documentation intended for internal stakeholders
  that doesn't require a persuasive conversion-oriented structure.
- **Pre-Result Projects:** Do not write a case study if the project is still
  in progress or if measurable results have not yet materialized.

## Inputs

1. **Customer Raw Data:** Interviews, project notes, and raw performance metrics
   (e.g., "Sales increased by 20%").
2. **Target Persona:** Who are we trying to persuade with this specific story?
3. **Primary Objection:** What specific doubt does this case study aim to
   neutralize? (e.g., "Will this work for a company of our size?").
4. **Primary CTA:** What is the specific next step the user should take? (e.g.,
   "Book a similar audit").

## Outputs

1. **Case Study Audit:** Identification of narrative gaps, missing data, and
   CTA friction.
2. **Optimized Narrative Structure:** A revised draft following the
   Problem-Solution-Result (PSR) framework.
3. **Result Visualization Plan:** Guidance on how to make the "Result" the most
   visually prominent part of the page.
4. **CTA Strategy:** Strategically placed "In-line" and "Terminal" calls to action.

## Workflow

### 1. The Outcome-First Audit

Analyze the current case study. Is the "Result" buried at the bottom?

- **The Headline Test:** Does the headline include a measurable outcome?
  (e.g., "How [Company] Saved $10k" vs. "Case Study: [Company]").
- **The "Executive Summary" Check:** Is there a summary block that allows a
  busy stakeholder to get the value in 15 seconds?

### 2. Apply the PSR Framework

Restructure the narrative to build empathy and then prove capability:

- **Problem:** Define the business pain point and the *impact* of that pain.
  (Why did they seek a solution now?).
- **Solution:** Describe the specific implementation, focusing on the
  "Unique Mechanism" that solved the problem.
- **Result:** Present the quantifiable outcomes (Numbers, %, Time saved) and
  the qualitative impact (Quotes, peace of mind).

### 3. Maximize Proof Scannability

Ensure the "Proof" is impossible to miss:

- **The "Big Number" Callout:** Use large typography for the primary metric.
- **The Verified Quote:** Use a high-quality photo of the customer next to a
  specific, result-oriented quote.
- **Visual Evidence:** Use screenshots, "Before vs. After" charts, or photos of
  the product in the customer's environment.

### 4. Implement Pathing (CTAs)

A case study is a funnel, not a dead-end:

- **Contextual CTAs:** Add "In-line" buttons that relate to the solution
  steps (e.g., "See the tool we used").
- **The "Industry Match" CTA:** If the case study is about a Fintech company,
  the final CTA should be "See how we help Fintech firms."
- **Low-Friction Alternatives:** Offer a PDF download version for users who
  want to share the proof internally.

### 5. Review Against Decision Rules

Verify the optimized case study against the conversion heuristics below.

## Decision Rules

- **Specificity > Storytelling:** Data and specific numbers carry more weight
  than general narrative "fluff."
- **Relatability Rule:** The customer featured must be a "Mirror" for the
  target persona you want to attract.
- **Result Prominence:** The outcome must be visible in the top 20% of the page
  (Hero or Summary).
- **The "One Win" Rule:** Focus the case study on solving ONE primary problem
  exceptionally well rather than trying to mention every feature used.

## Constraints

- **Requires Verifiable Data:** The "Specificity > Storytelling" rule only
  works with real, customer-approved metrics. Do not fabricate or round
  numbers beyond what the customer confirmed.
- **Consent and Sign-Off:** Publishing a customer's name, logo, or quote
  requires their explicit approval; anonymized case studies ("A leading
  bank") are a fallback, not a first choice, and reduce persuasive power.
- **Relationship Dependency:** Producing a strong case study depends on
  access to the customer for interviews and data — this skill cannot
  substitute for that access.

## Non-Goals

- Does not cover general testimonial widgets, star ratings, or review
  aggregation — see `social-proof-optimization`.
- Does not cover video production or editing quality, only the narrative
  structure and on-page placement of case study content.
- Does not apply to B2C low-consideration goods or internal success
  reporting — see When NOT to Use.

## Common Failure Patterns

- **The "Wall of Text":** Long, unformatted paragraphs that nobody reads.
- **Vague Results:** Using "Increased efficiency" instead of "Reduced
  processing time from 4 days to 2 hours."
- **Missing "Why":** Explaining *what* was done but not *why* it was the
  right strategic choice for that customer.
- **The Dead-End Page:** No clear call to action at the bottom of the story.
- **Anonymous Customers:** "A leading bank" is significantly less persuasive
  than "Lloyds Bank."

## Validation Criteria

- [ ] **CTA Click-Through Rate:** Measure how many users click the primary CTA
  after reading the case study.
- [ ] **Time on Page:** An increase in time on page usually indicates users are
  actually reading the narrative.
- [ ] **Sales Attribution:** Track how many closed deals had "Case Study X" as
  a touchpoint in the journey.
- [ ] **The "Squint Test":** Squint at the page; the most prominent element should
  be the primary result/metric.
