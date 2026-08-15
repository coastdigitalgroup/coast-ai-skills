---
name: user-onboarding-optimization
description:
  Audit and optimize the initial user experience to accelerate time-to-value,
  increase activation rates, and reduce early-stage churn. Trigger this skill
  when users drop off shortly after signup or fail to reach their "Aha! Moment."
---

# User Onboarding Optimization

## Purpose

The User Onboarding Optimization skill provides a systematic framework for
refining the "First Mile" of the user experience. The goal is to move users
from "Signed Up" to "Activated" as quickly and frictionlessly as possible. By
identifying the "Aha! Moment"—the point where a user first realizes the value of
the product—and streamlining the path to it, this skill directly improves
Activation Rate, 1-Day/7-Day Retention, and Lifetime Value (LTV).

## Use Cases

- **SaaS Platforms:** Helping new trial users set up their first project or
  integration.
- **Mobile Apps:** Guiding users through initial permissions and profile setup
  to reach core functionality.
- **Marketplaces:** Prompting new sellers to list their first item or new
  buyers to make their first search.
- **Complex B2B Tools:** Reducing the perceived complexity of a powerful
  interface through progressive disclosure.

## When NOT to Use

- **Top-of-Funnel Acquisition:** For improving ad click-through or landing
  page conversion, use `message-match-optimization` or
  `hero-section-optimization`.
- **Power User Optimization:** For optimizing workflows for daily active
  users who have already mastered the basics.
- **Checkout Flows:** While onboarding may include a payment step, use
  `checkout-flow-optimization` for dedicated payment funnel refinement.
- **Paywall/Upgrade Prompts:** Once a user has activated and reached the
  "Aha! Moment," optimizing the trial-expiration or upgrade prompt is
  covered by `trial-to-paid-optimization`.

## Inputs

1. **Activation Data:** Metrics on the "Aha! Moment" (e.g., "Users who do X
   within 24 hours are 5x more likely to stay").
2. **Current Onboarding Flow:** Screenshots or a walkthrough of the signup-to-
   success journey.
3. **User Personas:** Understanding different user goals (e.g., "The Manager"
   vs "The Individual Contributor").
4. **Onboarding Analytics:** Drop-off rates at each step of the setup wizard
   or welcome tour.

## Outputs

1. **Onboarding Friction Audit:** Identification of "Empty States," excessive
   form fields, and confusing UI patterns.
2. **"Aha! Moment" Definition:** A clear, data-informed target for the
   onboarding experience.
3. **Optimized Onboarding Roadmap:** A revised sequence of steps using
   progressive profiling and focused guidance.
4. **Activation UI Specs:** Recommendations for welcome screens, tooltips,
   checklists, and empty state improvements.

## Workflow

### 1. Identify the "Aha! Moment"

Determine the single action or set of actions that correlates most strongly
with long-term retention.

- Ask: "What is the minimum the user needs to do to see the value?"
- Example: For Slack, it's sending 2,000 messages. For Dropbox, it's putting
  one file in one folder.

### 2. Map the "Current Path to Value"

Walk through the existing signup flow and count every click, field, and
decision.

- **The "Field Kill" List:** Identify every non-essential form field that can
  be removed or delayed.
- **Friction Points:** Identify where users are forced to "wait" (e.g., email
  verification, data processing).

### 3. Implement Progressive Profiling

Shift the mindset from "Gather all data now" to "Gather data as needed."

- Only ask for information required for the *next* step in the journey.
- Use "Empty States" to collect data (e.g., "You haven't added a project yet.
  Click here to name your first one").

### 4. Direct the User Focus

Use UI patterns to guide the user toward the "Aha! Moment" without
overwhelming them.

- **The Welcome Screen:** Focus on one clear goal, not a tour of 50 features.
- **Onboarding Checklists:** Use a small, persistent list of 3-5 tasks with
  a progress bar to leverage the "Zeigarnik Effect."
- **Contextual Tooltips:** Show help only when the user is interacting with
  a specific feature for the first time.

### 5. Review Against Decision Rules

Verify the proposed flow against the onboarding heuristics.

## Decision Rules

- **The "One-Goal" Rule:** Every screen in the onboarding flow should have
  exactly ONE primary action.
- **Progressive Disclosure:** Never show advanced settings to a user who
  hasn't completed the basic setup.
- **The "No-Dead-End" Rule:** Every onboarding step must lead clearly to the
  next. Never leave a user on a screen without a clear "Next" or "Get Started"
  action.
- **Reward Immediate Action:** Provide immediate feedback or a "Success" state
  as soon as the user completes a task.
- **Default to Action:** Whenever possible, provide sensible defaults so the
  user can click "Next" rather than having to make a decision.

## Constraints

- **Aha Moment Definition:** The "Aha! Moment" must be explicitly defined before optimization begins — without a clear activation event, success cannot be measured.
- **Essential Steps:** Onboarding cannot bypass steps that are required for security, compliance, or core product function.
- **Privacy:** User data collected during onboarding (preferences, profile details) must be handled in accordance with the product's privacy policy.

## Non-Goals

- Feature development to improve the underlying product value being onboarded to.
- Email-based onboarding sequences sent after initial sign-up.
- Human-led customer success or sales-assisted onboarding.

## Common Failure Patterns

- **The "Grand Tour":** Forcing users through a 10-step modal tour of the
  entire interface before they can do anything.
- **Data Greed:** Asking for a phone number, company size, and job title
  before the user has even seen the product.
- **The "Empty Room":** Dropping a user into a blank dashboard with no data
  and no clear instruction on how to start.
- **Forced Verification:** Stopping the entire flow to wait for an email
  verification link, which often leads to users getting distracted or lost.
- **Irrelevant Onboarding:** Showing the same onboarding to a "Pro" user as
  to a "Beginner" user.

## Validation Criteria

- [ ] **Activation Rate:** (Users who reach the "Aha! Moment" / Total Signups) * 100.
- [ ] **Time-to-Value (TTV):** The average time it takes for a user to reach the
  "Aha! Moment." Goal: Decrease.
- [ ] **Onboarding Completion Rate:** Percentage of users who finish the initial
  setup wizard.
- [ ] **Day-1 Retention:** The percentage of users who return to the product the
  day after signing up.
