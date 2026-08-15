---
name: micro-survey-optimization
description:
  Audit and optimize on-site micro-surveys (intent polls, exit surveys, and
  feedback widgets) to maximize response rates and capture high-quality
  qualitative data that drives conversion experiments.
---

# Micro-Survey & Feedback Loop Optimization

## Purpose

The Micro-Survey Optimization skill provides a systematic framework for
identifying the "Why" behind user behavior. While quantitative analytics show
*where* users drop off, micro-surveys reveal *why* they leave, what they were
looking for, and what stopped them from converting. By optimizing the timing,
targeting, and phrasing of these interactions, this skill turns passive
browsers into active informants, providing the raw data needed for high-impact
conversion experiments.

## Use Cases

- **Exit Intent Recovery:** Asking users why they are leaving a high-intent page
  (e.g., Pricing or Checkout) without purchasing.
- **Intent Matching:** Identifying why a user landed on a page to ensure the
  content matches their expectations.
- **Friction Identification:** Pinpointing specific elements on a page that are
  confusing or frustrating.
- **Attribution & Source Quality:** Asking "How did you hear about us?" to
  validate marketing channel performance.
- **Post-Conversion Sentiment:** Measuring Customer Effort Score (CES) or CSAT
  immediately after a key action.

## When NOT to Use

- **High-Friction Transaction Steps:** Avoid interrupting a user who is
  actively typing credit card info or in the final 10% of a complex flow.
- **Low-Traffic Pages:** If a page gets fewer than 500 visitors a month, it will
  take too long to gather statistically significant qualitative patterns.
- **Brand Awareness/Top-of-Funnel:** Generic "How do you like the site?" surveys
  on the homepage often yield low-value data and annoy new visitors.
- **Sensitive Contexts:** Avoid surveys on pages dealing with sensitive medical,
  legal, or financial crises where an interruption feels tone-deaf.

## Inputs

1. **Drop-off Points:** Analytics data showing which pages have the highest
   bounce or exit rates.
2. **Survey Goal:** The specific question you need answered (e.g., "Why is the
   Pro plan not selling?").
3. **Current Survey Performance:** Response rates and completion rates of any
   existing feedback widgets.
4. **Target Segments:** Knowledge of who the survey should be shown to (e.g.,
   "Returning visitors who have spent >30s on the pricing page").

## Outputs

1. **Micro-Survey Audit:** Identification of generic, poorly timed, or
   high-friction survey prompts.
2. **Optimized Survey Logic:** A plan for triggers (Exit intent, Time on page,
   Scroll depth) and targeting.
3. **High-Response Question Set:** Benefit-driven, low-friction questions
   tailored to the page context.
4. **Insight-to-Action Roadmap:** A template for translating qualitative
   feedback into specific A/B test hypotheses.

## Workflow

### 1. Identify the "Insight Gap"

Look at your funnel. Where is the data "silent"?
- **Example:** Users are landing on the "Comparison" page but not clicking
  "Start Trial." You know *that* they are leaving, but not *if* they found the
  info they needed.

### 2. Choose the Strategic Trigger

Match the survey appearance to the user's state of mind.
- **Exit Intent:** Capture the "Why" as they are about to leave.
- **Time on Page:** Ask a question once they've had enough time to form an
  opinion (e.g., 30+ seconds).
- **Behavioral Trigger:** Show the survey after they've interacted with a
  specific element but haven't converted.

### 3. Draft the "Micro-Choice" Question

Reduce the cognitive load of responding.
- **The Hook:** Use a short, non-intrusive question.
- **Multiple Choice:** Provide 3–5 specific options based on known or suspected
  pain points.
- **The "Other" Escape Hatch:** Always include an "Other" option with a text
  box to capture unexpected insights.
- **Example:** Instead of "What do you think?", use "What's the #1 thing
  stopping you from signing up today?"

### 4. Optimize the "Second Step"

If they engage with the first question, ask for more detail.
- **Logic Branching:** If they select "Pricing is too high," the next step
  should ask "What was the price you were expecting to pay?"
- **The Email Grab (Optional):** Ask for an email only *after* they've provided
  value, and only if you intend to follow up.

### 5. Review Against Decision Rules

Verify that the survey is helpful, not a hurdle.

## Decision Rules

- **Context is King:** The survey question must relate directly to the content
  of the page it appears on.
- **The 3-Second Rule:** A user should be able to read and respond to the first
  step of the survey in under 3 seconds.
- **Incentivize Insights (Rarely):** Only use incentives (e.g., "Win a gift
  card") for long-form surveys. Micro-surveys should rely on the user's desire
  to be heard.
- **Avoid "The Interrogation":** Limit micro-surveys to 2 steps. If you need 5+
  questions, use a dedicated survey page.
- **Mobile Thumb-Zone:** Ensure the "Close" button and options are easily
  tappable on mobile devices.

## Constraints

- **Platform Dependencies:** Implementation depends on the capabilities of the
  feedback tool (e.g., Hotjar, Qualaroo, Sprig, or custom modals).
- **Sample Size:** Qualitative patterns require a minimum number of responses
  (typically 30–50) to be considered actionable for a new hypothesis.
- **Privacy Compliance:** Surveys must comply with GDPR/CCPA, particularly if
  collecting PII or using "session recording" in conjunction with feedback.

## Non-Goals

- Managing long-form customer satisfaction (NPS) campaigns or annual surveys.
- Technical implementation of survey widget CSS or API integrations.
- Qualitative user testing or moderated interviews.

## Common Failure Patterns

- **The "Vague Greeting":** Using "Hi! Do you have a second?" (Users say no).
- **Generic Timing:** Showing a survey 2 seconds after a user lands on a page,
  before they've even read the headline.
- **Text-Box-First:** Asking an open-ended question as the first step (High
  friction, low response).
- **The "Dead End":** Collecting data but never actually looking at it or
  turning it into a website experiment.
- **Overlap Conflict:** Triggering a survey at the same time as a chat widget or
  discount popup, creating a "clutter wall."

## Validation Criteria

- [ ] **Response Rate (RR):** (Surveys Started / Surveys Shown) * 100. Target:
  3–5% for contextual micro-surveys.
- [ ] **Completion Rate:** (Surveys Finished / Surveys Started) * 100. Target:
  >80%.
- [ ] **Insight-to-Experiment Ratio:** The number of valid A/B test hypotheses
  generated per 100 survey responses.
- [ ] **CVR Lift from Insights:** Measure the success of the A/B test that was
  derived from the micro-survey data.
