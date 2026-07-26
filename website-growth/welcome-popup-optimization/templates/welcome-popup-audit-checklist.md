# Welcome Popup Audit & Optimization Checklist

Use this checklist to audit your website's welcome popup, locate friction points, and optimize it to maximize Email/SMS captures and first-order conversion rates.

---

## 1. Triggering & Timing

*   [ ] **First-Touch Orientation:** Does the popup wait at least **5 to 8 seconds** (or 30%+ scroll depth) before displaying to first-time users?
    *   *Why:* Immediate triggers disrupt orientation, leading to high bounce rates and automated dismissals.
*   [ ] **Exit-Intent Backup:** On desktop, is an exit-intent trigger configured to capture abandoning users who didn't trigger the scroll or time-based popup?
*   [ ] **Page Exclusion List:** Is the popup suppressed on high-intent conversion and utility pages? (e.g., Cart, Checkout, Support, login pages).
*   [ ] **Search Interstitial Safety:** If the page gets significant mobile organic search traffic, is the automatic popup delayed or set to a non-intrusive mobile banner to avoid Google SEO search penalties?

---

## 2. Value Proposition & Copy

*   [ ] **Benefit-Led Headline:** Does the headline highlight a tangible reward (e.g., "Get 15% Off Your First Order" or "Unlock Your Free Guide") instead of generic newsletter copy ("Join Our Newsletter")?
*   [ ] **Action-Oriented CTAs:** Are the buttons labeled with benefit-driven phrases (e.g., "Unlock My Discount" or "Claim Free Gift") instead of passive words ("Submit", "Subscribe", or "Send")?
*   [ ] **Frictionless Opt-Out Option:** Is there an explicit "No thanks" option that is clean and readable (e.g., "No thanks, I prefer paying full price")?
*   [ ] **Urgency Integration:** Does the success screen highlight a gentle validity timeframe (e.g., "Code valid for 48 hours") to accelerate immediate checkout intent?

---

## 3. Form Fields & Step Progression

*   [ ] **Two-Step Capture Flow:** If collecting both Email and SMS, does the form ask for them in two distinct, sequential frames?
    *   *Why:* Single-step forms asking for both fields drop conversions by up to 60%.
*   [ ] **Instant Step-1 Submission:** Does Step 1 (Email capture) submit immediately to the database when the button is clicked, so that if the user drops off on Step 2 (SMS) their email is still saved?
*   [ ] **Single-Input Fields:** Does each step show only **one** required input field? (e.g., Email only on Step 1; Phone only on Step 2).
*   [ ] **Form Input Preservation:** If a validation error occurs, does the input field retain the user's text instead of clearing the form?
*   [ ] **Autofill Compatibility:** Do form input elements use standard semantic attributes (e.g., `type="email"` or `autocomplete="email"`) so browsers can autofill them?

---

## 4. Mobile Usability & Accessibility

*   [ ] **Accessible Close Target:** Is the dismiss/close button ("X") at least **44px by 44px** in size to prevent mis-taps on touch-screen devices?
*   [ ] **Scrim/Off-Canvas Dismissal:** Can a user dismiss the popup by tapping the empty background area (scrim/dark overlay) outside the container?
*   [ ] **Keyboard Navigation:** Can desktop users dismiss the popup by hitting the "Escape" key?
*   [ ] **Keyboard Collision Prevention:** On mobile viewports, are the input fields placed in the top/middle of the overlay so the native virtual keyboard does not block the inputs or the submit button?
*   [ ] **Screen Reader Friendly:** Does the popup container use appropriate ARIA attributes (e.g., `role="dialog"`, `aria-modal="true"`, and `aria-label="Welcome Offer"`) so assistive technologies read it correctly?

---

## 5. Targeting & Suppression Rules

*   [ ] **Source Suppression:** Is the popup completely suppressed for users landing via existing promotional email or SMS links (by checking URL params like `utm_source=klaviyo` or `utm_medium=sms`)?
*   [ ] **Frequency Cap:** If a visitor dismisses the popup, is a local cookie/storage key set to prevent the popup from displaying again for at least **30 days**?
*   [ ] **Customer Suppression:** Is the popup permanently suppressed for active logged-in users or visitors with purchase history?
*   [ ] **Compliance Consent:** For SMS, is there explicit, un-checked consent copy beneath the form linking to the Terms of Service and Privacy Policy?
*   [ ] **Dual-Opt-In Alignment:** For GDPR compliance, does the email capture section follow explicit consent rules for EU-located IP addresses?

---

## Audit Rating Sheet

Score your welcome popup experience based on the number of checked boxes above:

| Score | Rating | Action Required |
| :---: | :--- | :--- |
| **20-24** | **Opt-In Leader** | Excellent! Your popup is fully optimized, user-friendly, and accessible. Continually test alternative copy or tier incentives to raise conversion ceilings. |
| **14-19** | **Medium Friction** | Moderate opportunity. Your popup captures leads but is likely leaking mobile traffic and causing unnecessary friction. Focus on mobile close targets and suppression rules first. |
| **0-13** | **Funnel Blocker** | Critical priority. Your welcome popup is actively frustrating users, triggering mobile bounces, and likely harming your Google SEO ranking. Prioritize timing delays and a two-step sequence. |
