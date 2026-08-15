---
name: inclusive-conversion-optimization
description:
  Audit and optimize website journeys to remove friction for users with diverse
  abilities (permanent, temporary, or situational) to expand reachable market
  share and improve conversion rates for all segments.
---

# Inclusive Conversion Optimization

## Purpose

The Inclusive Conversion Optimization skill provides a systematic framework for
expanding reachable market share and improving conversion rates by identifying
and removing friction points for users with diverse abilities. Unlike
traditional accessibility which focuses on compliance, this skill treats
inclusivity as a growth engine. By optimizing for users with permanent
disabilities, temporary impairments (e.g., a broken arm), or situational
constraints (e.g., glare on a mobile screen or holding a baby), you improve
the experience for 100% of users, leading to higher CVR and LTV.

## Use Cases

- **Checkout Flows:** Reducing drop-offs by ensuring all payment and form
  interactions are frictionless for keyboard and screen-reader users.
- **Mobile Commerce:** Optimizing for users in high-distraction or
  poor-lighting environments.
- **B2B SaaS:** Ensuring complex dashboards and configuration tools don't
  alienate users with cognitive or motor impairments.
- **Global Expansion:** Improving conversion for users in low-bandwidth areas
  or those using older hardware.
- **Video Content:** Increasing engagement and conversion from video by
  ensuring it's accessible without sound or visual focus.

## When NOT to Use

- **Internal Alpha/Technical Spikes:** When the goal is purely proof-of-concept
  and conversion is not a metric.
- **Non-Conversion Content:** Purely decorative or ephemeral content where no
  user action is required.
- **Hyper-Specific Assistive Technology Support:** If the goal is debugging a
  specific obscure screen reader bug rather than general conversion
  optimization (this is a development task).

## Inputs

1. **Target Funnel Step:** The specific page or flow being audited (e.g.,
   Registration Form, Product Page).
2. **Current Conversion Data:** Bounce rates, exit rates, and time-to-task
   metrics, ideally segmented by device.
3. **Inclusive Audit Data:** Results from automated scans (e.g., Lighthouse,
   Axe) and manual keyboard/screen-reader walkthroughs.
4. **User Personas (Inclusive):** Understanding the diverse ways users interact
   with the site (e.g., "The Keyboard Only Shopper," "The Distracted Parent").

## Outputs

1. **Inclusive Friction Audit:** Identification of specific barriers that
   prevent segments of users from converting.
2. **Prioritized Remediation Plan:** A list of fixes ranked by their impact on
   reachable market share and ease of implementation.
3. **Inclusive Design Specs:** Guidance on color contrast, touch target sizes,
   form labels, and error handling.
4. **Outcome Projections:** Estimated lift in conversion based on expanding the
   reachable audience.

## Workflow

### 1. Identify "Reachable Market" Gaps

Analyze your funnel for signs of inclusive friction:
- **Mobile Drop-offs:** Are users exiting because touch targets are too small
  or contrast is too low in outdoor lighting?
- **Form Abandonment:** Are users getting stuck on fields that lack clear
  labels or have punishing error handling?
- **Speed-to-Task:** Are certain segments taking 3x longer to complete a
  purchase?

### 2. Run the "Inclusive Stress Test"

Walk through the primary conversion path using three constraints:
- **Keyboard Only:** Can you complete the goal without a mouse? (Tests motor
  and vision path logic).
- **No Sound / No Vision:** Can you understand the value and the CTA if one
  sensory channel is blocked? (Tests clarity and semantics).
- **High Distraction:** Can you complete the flow in 30-second bursts? (Tests
  cognitive load and state persistence).

### 3. Diagnose the Friction Type

Categorize barriers found during the stress test:
- **Perception Barriers:** Low contrast, small text, lack of captions.
- **Interaction Barriers:** Small touch targets, no keyboard focus, "Trap"
  modals.
- **Cognitive Barriers:** Overwhelming choice, complex jargon, lack of progress
  indicators.

### 4. Apply Inclusive Growth Fixes

Prioritize changes that benefit the widest range of users:
- **Form Clarity:** Use persistent labels and real-time, helpful error
  messaging.
- **Visual Robustness:** Increase contrast and font sizes to exceed minimums;
  ensure CTAs are unmistakable.
- **Path Simplification:** Reduce the number of steps and choices to lower
  cognitive load for everyone.

### 5. Review Against Decision Rules

Verify that the optimizations improve the experience for all users without
degrading the "standard" journey.

## Decision Rules

- **The "Growth-First" Rule:** Prioritize inclusive fixes that appear on the
  critical conversion path (Home -> Product -> Cart -> Checkout).
- **Proactive over Reactive:** Don't wait for a complaint or a fail. If a CTA
  is hard to see in low-light, it's losing you money now.
- **The "Universal Benefit" Rule:** If a change helps a user with a disability
  (e.g., larger buttons) but also helps a non-disabled user (e.g., faster
  tapping on mobile), it is a P0 priority.
- **Redundancy is Reliability:** Always provide multiple ways to perceive
  critical information (e.g., Color + Icon for error states).

## Constraints

- **Brand Integrity:** Inclusive optimizations must work within the brand's
  visual identity, though the identity may need to evolve for contrast
  compliance.
- **Technical Feasibility:** Some deep-seated inclusive issues (e.g., a legacy
  third-party checkout) may require long-term engineering rather than
  short-term growth fixes.
- **Legal Requirements:** While this skill focuses on growth, it must never
  compromise baseline WCAG 2.1/2.2 AA compliance.

## Non-Goals

- Comprehensive WCAG certification or legal audits.
- Fixing deep-level infrastructure or browser-specific rendering bugs.
- Content translation or localization (see `localization-optimization`).

## Common Failure Patterns

- **Compliance as the Ceiling:** Stopping at "passing a scan" rather than
  optimizing for an actual user's success and speed.
- **The "Separate but Equal" Trap:** Creating a dedicated "accessible" version
  of a page that is neglected and converts poorly.
- **Invisible Focus:** Having keyboard navigation that works but doesn't show
  the user where they are (no focus ring).
- **Assumed Knowledge:** Using icons without labels or jargon that requires
  high cognitive effort to decode.

## Validation Criteria

- [ ] **Conversion Rate (CVR) Lift:** Measure the increase in overall conversion
  as the reachable market expands.
- [ ] **Success Rate by Segment:** Use tools like Fable or manual testing to
  ensure 100% success rate for keyboard and screen-reader users.
- [ ] **Time-to-Task Reduction:** Measure if the time to complete a purchase
  decreases for all users.
- [ ] **Mobile Exit Rate:** Monitor if exit rates on high-distraction pages
  (e.g., Checkout) decrease after inclusive optimizations.
