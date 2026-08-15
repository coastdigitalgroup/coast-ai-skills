---
name: waitlist-prelaunch-optimization
description:
  Audit and optimize waitlist experiences to build anticipation, validate
  demand, and drive viral growth before a product or feature launch. Trigger
  this skill for "Coming Soon" pages or pre-launch campaigns with low
  engagement or referral volume.
---

# Waitlist & Pre-launch Optimization

## Purpose
The Waitlist & Pre-launch Optimization skill provides a framework for
transforming a passive "Coming Soon" page into an active growth engine. By
leveraging psychological triggers like exclusivity, social proof, and the
"Robinhood Effect" (viral queue jumping), this skill aims to maximize pre-launch
signups, increase viral referrals (K-factor), and ensure a high-intent user base
is ready for day-one activation.

## Use Cases
- **New Product Launches:** Building a base of early adopters for a startup or
  new venture.
- **Feature Waitlists:** Managing demand for high-value features in an existing
  product.
- **Beta Programs:** Recruiting and segmenting testers for a new version.
- **Event Registration:** Creating early interest for conferences or major
  webinars.
- **Physical Product Drops:** Managing inventory scarcity for limited-edition
  releases.

## When NOT to Use
- **Immediate-Access Products:** If the product is ready and the goal is instant
  revenue, a waitlist adds unnecessary friction. Use `checkout-flow-optimization`.
- **Low-Utility Waitlists:** If the "wait" is purely administrative and offers
  no early-access benefit or incentive, it can damage brand trust.
- **B2B Enterprise Sales:** For high-touch, long-cycle sales where a generic
  waitlist might feel too "consumer-oriented" or impersonal.

## Inputs
1. **Launch Timeline:** When will the product/feature actually be available?
2. **Early Access Value:** What is the specific benefit of being on the
   waitlist? (e.g., "First 100 get it free," "Skip the line").
3. **Target Persona:** Who are the ideal early adopters?
4. **Current Pre-launch Metrics:** Sign-up conversion rate, referral rate, and
   social share volume.

## Outputs
1. **Waitlist Strategy Audit:** Identification of friction points in the signup
   and referral flow.
2. **Optimized Waitlist Landing Page:** Guidance on the "Hook," the value prop,
   and the simplicity of the signup.
3. **Viral Referral Loop Design:** A plan for the "Post-Signup" experience that
   incentivizes sharing to "jump the queue."
4. **Anticipation Management Plan:** Recommended email sequence to keep the
   waitlist "warm" until launch.

## Workflow

### 1. Define the "Why Wait?" (The Incentive)
A waitlist only works if the reward for waiting is clear.
- **Exclusivity:** "Only 1,000 spots available."
- **Early Access:** "Get it 2 weeks before anyone else."
- **Financial Reward:** "Locked-in lifetime discount for waitlist members."
- **Status:** "Founder's Edition" badges or early-access community perks.

### 2. The High-Conversion Signup (Minimum Friction)
The goal is to capture the email as fast as possible.
- **One-Field Form:** On the landing page, ask ONLY for an email.
- **The "Mystery" Hook:** Use a compelling, high-curiosity headline (e.g., "The
  end of slow meetings is coming").
- **Visual Teaser:** Show a glimpse of the product (blurred UI, silhouette, or
  short teaser video) to build curiosity.

### 3. Implement the Viral Loop (The Robinhood Effect)
The most successful waitlists turn signups into recruiters.
- **The Queue:** Give every user a position (e.g., "You are #5,402 in line").
- **Queue Jumping:** Allow users to move up by referring friends. (e.g., "Refer
  one friend to skip 500 spots").
- **Live Leaderboard:** Show top referrers to leverage social competition.

### 4. Post-Signup Momentum (The "Warm-up")
Don't let the waitlist go cold.
- **Immediate Confirmation:** Validate their spot and reiterate the referral
  benefit.
- **Progress Updates:** Send "behind-the-scenes" content or "development
  milestones" to maintain interest.
- **Interactive Tasks:** Ask for feedback or survey the waitlist to make them
  feel part of the building process.

### 5. The Transition (Waitlist-to-User)
Plan the "Roll-out" to maximize activation.
- **The "You're In" Notification:** High-excitement email with a direct link to
  onboarding.
- **Phased Access:** Invite users in batches to manage server load and maintain
  the sense of exclusivity.

## Decision Rules
- **Transparency vs. Mystery:** Use "Mystery" (vague but intriguing) for new-to-market
  innovations. Use "Transparency" (clear specs) for feature updates to existing
  products.
- **The Friction Balance:** If K-factor is low, the referral incentive is likely
  too weak. If CVR is low, the "Hook" is likely too vague or the form is too
  complex.
- **Mobile First:** Waitlist pages are often shared on social media; they MUST
  be perfectly optimized for mobile viewport "above-the-fold" signups.

## Constraints
- **Launch Commitment:** Do not build a waitlist if there is no realistic launch
  plan; infinite waitlists destroy brand credibility.
- **Referral Ethics:** Incentives for referrals must be clearly stated and
  honored — failing to deliver on a "skip the line" promise will backfire.
- **Data Privacy:** Waitlist signups must comply with GDPR/CCPA, especially
  when using third-party waitlist management tools.

## Non-Goals
- Does not optimize the post-launch onboarding experience once users gain
  access — see `user-onboarding-optimization`.
- Does not cover checkout or immediate-purchase flows — see
  `checkout-flow-optimization`.
- Does not address ongoing referral/loyalty programs beyond the pre-launch
  period — see `referral-loop-optimization`.

## Common Failure Patterns
- **The "Void":** Signing up and hearing nothing for months until the product
  finally launches.
- **Boring "Coming Soon":** A plain page with "Coming Soon" and a logo, giving
  the user no reason to care.
- **Complex Referral Requirements:** Asking for 5 referrals to get any benefit
  (high barrier to entry).
- **Broken Queue Logic:** Users moving *down* the list or positions not updating,
  which feels like a "scam."

## Validation Criteria
- [ ] **Waitlist Conversion Rate (CVR):** (Signups / Landing Page Views) * 100.
  Target: >20% for high-intent niches.
- [ ] **Viral Coefficient (K-factor):** (Avg. invites per user) * (Conversion rate
  of invites). Goal: >0.5.
- [ ] **Pre-launch Activation Rate:** Percentage of waitlist members who actually
  sign up/purchase on launch day.
- [ ] **Social Share Volume:** Number of organic shares of the waitlist link
  on Twitter/LinkedIn/WhatsApp.
