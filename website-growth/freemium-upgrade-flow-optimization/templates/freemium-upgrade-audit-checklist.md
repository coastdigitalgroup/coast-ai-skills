# Freemium Upgrade Flow Audit & Optimization Checklist

Use this audit checklist to evaluate and optimize in-product feature gates, usage limit warnings, paywall modals, and self-serve upgrade paths across SaaS and digital product experiences.

---

## 1. Pre-Gate Usage Transparency & Nudges

- [ ] **Visible Usage Meters:** Is current usage capacity (e.g., "45 / 50 contacts used") clearly displayed in the primary app navigation or account workspace?
- [ ] **Soft Progressive Warnings:** Does the system trigger soft inline warnings or progress bar color changes at 80% and 90% capacity *before* a hard lock occurs?
- [ ] **Non-Disruptive Warning Copy:** Do pre-limit warnings focus on preventing workflow interruption rather than demanding immediate payment?
- [ ] **Proactive Upgrade Links:** Can active power users access an upgrade pathway from account settings or navigation at any time without waiting to hit a limit?

---

## 2. Feature Gate & Paywall Trigger UX

- [ ] **Soft Gating / Preview Mode:** Can users see, interact with, or configure paid features in "Preview Mode" before being prompted to upgrade upon saving or exporting?
- [ ] **Zero Data Loss Guarantee:** Does the system preserve all user input, form state, or configuration data when a paywall modal is triggered?
- [ ] **In-App Modal Overlay:** Does the paywall modal render as a native overlay or slide-over panel *inside* the active session, rather than redirecting to an external website?
- [ ] **Clear Dismissal / Exit Path:** Is there an easily visible "Not now / Return to workspace" link or close icon (`✕`) so users never feel trapped in a paywall?
- [ ] **Mobile Responsiveness:** Does the upgrade modal scale cleanly on mobile viewports without forcing horizontal scrolling or hiding the primary CTA?

---

## 3. Modal Copywriting & Value Framing

- [ ] **Intent-Matched Headline:** Does the modal headline explicitly reference the feature or task the user was trying to perform? (e.g., *"Unlock Unlimited CSV Exports"* vs. *"Upgrade Your Account"*).
- [ ] **Dynamic Usage Personalization:** Does the copy reference the user's real product activity to prove value? (e.g., *"You've generated 15 reports this month..."*).
- [ ] **3-Bullet Value Prop:** Does the modal highlight 2-3 high-impact benefits of the target paid tier, placing the triggered feature at the top of the list?
- [ ] **Outcome-Oriented Microcopy:** Does the CTA button focus on the immediate result? (e.g., *"Unlock Unlimited Exports Instantly"* vs. *"Submit Payment"*).

---

## 4. Choice Architecture & Pricing Transparency

- [ ] **Focused Tier Display:** For single upgrade paths (e.g., Free → Pro), is the modal streamlined around a single plan card rather than displaying an overwhelming 4-column pricing table?
- [ ] **Recommended Tier Highlighting:** If multiple paid tiers are displayed, is the tier containing the requested feature visually highlighted with a "Recommended" or "Best Value" badge?
- [ ] **Inline Billing Interval Toggle:** Can the user toggle between Monthly and Annual billing directly inside the modal window?
- [ ] **Transparent Billing Microcopy:** If Annual billing is selected, does the modal display both the effective monthly rate (*"$12/mo"*) and the exact upfront billing sum (*"Billed annually at $144/yr — Save $36"* )?

---

## 5. Checkout Friction & Entitlement Activation

- [ ] **In-App Checkout Execution:** Can credit card details or digital wallet payments (Apple Pay / Google Pay) be entered directly inside the overlay without navigating away?
- [ ] **Pre-filled Account Metadata:** Are user name, email, and organization details automatically pre-filled in the checkout form?
- [ ] **Risk Reversal Microcopy:** Is reassurance microcopy displayed directly underneath the primary CTA? (e.g., *"30-day money-back guarantee • Self-serve cancellation anytime"*).
- [ ] **Instant Entitlement Activation:** Are paid features unlocked immediately upon payment confirmation without forcing a page refresh or re-login?
- [ ] **Automated Task Execution:** Does the system automatically complete the previously blocked action (e.g., downloading the requested file) as soon as checkout succeeds?

---

## Audit Scoring & Action Plan

| Section | Passed Criteria (/4 or /5) | Priority Fix Required | Target Completion Date |
| :--- | :--- | :--- | :--- |
| **1. Usage Transparency** | _____ / 4 | | |
| **2. Gate UX** | _____ / 5 | | |
| **3. Copy & Framing** | _____ / 4 | | |
| **4. Choice & Pricing** | _____ / 4 | | |
| **5. Checkout & Activation** | _____ / 5 | | |
