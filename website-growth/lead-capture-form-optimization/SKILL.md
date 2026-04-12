---
name: lead-capture-form-optimization
description:
  Systematic approach to reducing friction and increasing conversion rates for
  lead generation forms. Use this when a form has high abandonment rates or low
  lead quality.
---

# Lead Capture Form Optimization

## Purpose

The Lead Capture Form Optimization skill provides a protocol for auditing and
refining web forms to maximize submissions. It focuses on reducing "interaction
cost" and cognitive load by optimizing field count, layout, microcopy, and error
handling. This skill directly impacts the conversion rate of high-value actions
like demo requests, trial signups, and gated content downloads.

## Use Cases

- Reducing drop-offs in a SaaS free trial signup flow.
- Increasing the volume of qualified leads from a "Contact Sales" page.
- Optimizing gated content landing pages (e.g., Whitepapers, Webinars).
- Improving mobile form completion rates for B2B services.

## When NOT to Use

- **Search Bars:** Simple search inputs don't require this level of
  optimization.
- **Internal Admin Tools:** Efficiency for power users often requires different
  patterns than conversion-focused growth forms.
- **Complex E-commerce Checkouts:** While some principles overlap, checkouts
  involve payment security and shipping complexities that require a dedicated
  checkout optimization skill.

## Inputs

1. **The Current Form:** URL or screenshots of the existing form in all states
   (empty, filled, error).
2. **Analytics Data:** Drop-off rate per field (if available), overall form
   completion rate (FCR), and mobile vs. desktop performance.
3. **User Intent:** What is the specific value the user expects after
   submission?
4. **Lead Requirements:** Minimum data points required by sales/marketing to
   qualify the lead.

## Outputs

1. **Form Friction Audit:** Identification of unnecessary fields and UX
   bottlenecks.
2. **Optimized Form Specification:** Revised list of fields, labels,
   placeholders, and validation rules.
3. **Functional Wireframe/Logic:** Guidance on single-step vs. multi-step logic.
4. **Microcopy Improvements:** Benefit-driven CTA and reassuring privacy/trust
   signals.

## Workflow

### 1. The Friction Audit (Field Consolidation)

- **Inventory:** List every field currently in the form.
- **Kill/Keep/Delay:**
  - _Kill_ fields that aren't used by the business.
  - _Keep_ essential fields.
  - _Delay_ non-essential fields to a post-submission profile build or thank-you
    page.
- **Rule of Thumb:** Every additional field can reduce conversion by 5-10%.

### 2. Information Architecture & Layout

- **Single Column:** Always use a single-column layout for better readability
  and mobile responsiveness.
- **Logical Grouping:** Group related fields (e.g., Personal Info vs. Company
  Info) if the form is long.
- **Mobile Optimization:** Ensure input types (e.g., `type="email"`,
  `type="tel"`) are set to trigger the correct mobile keyboard.

### 3. Microcopy & Interaction Design

- **Top-Aligned Labels:** Use labels above the input fields, never inside as
  placeholders (which disappear).
- **Benefit-Driven CTA:** Replace "Submit" with what they get (e.g., "Get My
  Free Guide").
- **Inline Validation:** Provide real-time feedback (green check/red error) as
  the user types, rather than waiting for submission.

### 4. Implementation of Trust Signals

- Add a "Privacy Promise" near the email field.
- Include a small testimonial or "Trusted by X companies" snippet near the form.

### 5. Validation & Feedback

- Define clear, helpful error messages that tell the user _how_ to fix the
  problem, not just _that_ there is one.

## Decision Rules

- **The "Minimum Viable Form" Rule:** If a field is not required to contact the
  lead, it must be removed.
- **Multi-step vs. Single-step:** Use multi-step forms for 5+ fields to avoid
  overwhelming the user (utilizing the "Sunk Cost" effect).
- **Mandatory vs. Optional:** Avoid optional fields. If it's not important
  enough to be mandatory, remove it.
- **Mobile Keyboard Rule:** Every numeric or email field must use the
  appropriate HTML5 input type.

## Common Failure Patterns

- **The "Data Greedy" Form:** Asking for a phone number or physical address for
  a digital download.
- **Captcha Friction:** Using "I am not a robot" puzzles that frustrate users
  (use hidden honeypots or invisible reCAPTCHA instead).
- **Reset Buttons:** Including a "Clear" or "Reset" button (users click these by
  mistake and lose all work).
- **Placeholder Labels:** Using placeholders instead of labels, making it
  impossible for users to check their work before hitting submit.

## Validation Methods

- **Form Completion Rate (FCR):** (Submissions / Form Views) \* 100. Target
  improvement: 15-30%.
- **Field-Level Drop-off:** Identify which specific field causes the most exits.
- **Time to Complete:** Measure how long it takes a user to finish the form.
- **Error Trigger Rate:** Percentage of users who see a validation error. High
  rates indicate confusing field requirements.
