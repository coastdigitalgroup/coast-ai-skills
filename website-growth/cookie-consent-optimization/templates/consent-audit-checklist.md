# Cookie Consent & Privacy UX Audit Checklist

Use this audit template to evaluate any website's current cookie consent banner, identify conversion bottlenecks, spot illegal dark patterns, and specify optimizations to maximize opt-in rates and data tracking fidelity.

---

## Part 1: Interactive Friction & Visual Audit

Assess how the banner impacts the actual user journey, particularly on mobile viewports.

| Audit Question | Current State / Observation | Severity (Low/Med/High) | Action Required / Spec |
| :--- | :--- | :---: | :--- |
| **1. Viewport Coverage (Mobile)**<br>Does the banner cover more than 30% of the screen on a mobile device? | | | **Spec:** Mobile banner must be a bottom-docked slide-up drawer limited to max 25% height. |
| **2. Core CTA Overlap**<br>Does the banner cover or sit directly over primary landing page buttons or navigation menus? | | | **Spec:** Design the layout so key CTAs (e.g., "Add to Cart", "Start Trial") are fully visible above the banner fold. |
| **3. Trigger Timing**<br>Does the banner render instantly, causing Cumulative Layout Shift (CLS)? | | | **Spec:** Use fixed positioning `position: fixed` and introduce a 1.5-second fade-in transition. |
| **4. Button Size & Hit Target**<br>Are buttons large enough to tap easily on mobile without accidental misclicks? | | | **Spec:** Touch targets for "Accept," "Reject," and "Preferences" must be at least 48px high. |
| **5. Persistent Link Access**<br>Can a user easily change their preferences after making their initial choice? | | | **Spec:** Include a persistent floating "Cookie Settings" widget or a direct link in the footer. |

---

## Part 2: Copywriting & Trust-Framing Audit

Analyze the microcopy to transition from dry, alarming legalese to value-driven transparency.

### Copy Audit Scorecard

Evaluate your existing cookie copy against these three elements:
1. **Value Reciprocity:** Does the text explain *how* cookies benefit the user's experience (e.g., saving settings, keeping accounts secure) or only how it helps the business?
2. **Readability:** Is the text written in plain English, or is it a block of heavy, alarming legal definitions?
3. **Tone:** Is the tone friendly and professional, or does it sound cold and administrative?

### Microcopy Optimization Worksheet

Use this worksheet to draft and compare copy.

```text
[OLD DRY COPY]
--------------------------------------------------------------------------------
Example: "We and our partners use cookies on this site to personalize content,
provide social media features, and analyze our traffic. Please accept cookies."
--------------------------------------------------------------------------------

[REVISED OPTIMIZED TRUST COPY]
--------------------------------------------------------------------------------
Draft:
________________________________________________________________________________
________________________________________________________________________________
________________________________________________________________________________
--------------------------------------------------------------------------------
```

*Tip: Highlight security, personalization, and seamless site performance to motivate natural opt-ins.*

---

## Part 3: Regulatory & Dark Pattern Compliance Check

Avoid regulatory fines and reputation damage by identifying and fixing non-compliant practices.

- [ ] **No Hidden Reject Buttons (GDPR):** Is the "Reject All" or "Decline" button visible on the *first layer* of the banner? (Hiding "Reject" inside "Manage Preferences" is a major compliance violation in the EU).
- [ ] **No Pre-checked Non-Essential Categories:** In the "Preferences" panel, are Analytics, Personalization, and Marketing cookies unselected by default? (Only "Strictly Essential" cookies should be active prior to consent).
- [ ] **No Deceptive Color Contrast:** Are the "Accept" and "Reject" buttons readable? (Avoid making "Reject" invisible by matching its text color to the background color).
- [ ] **Geo-Targeting Activated:** Is IP-based geolocation active? (Deliver strict opt-in prompts only to regions that legally require it—like the EU, UK, Canada, Brazil—to protect tracking rates in the US and rest-of-world).
- [ ] **No Cookie Walls:** Can users still read and browse content if they decline or ignore the cookie banner? (Forcing acceptance to view public content is illegal under GDPR).

---

## Part 4: Technical Verification & Tracking Audit

Ensure that consent is properly wired into your actual marketing and analytics tag delivery.

1. **The Consent State Verification Test:**
   - Open a fresh Chrome Incognito window.
   - Right-click and choose **Inspect**, then go to the **Application** tab and expand **Cookies**.
   - Load the homepage.
   - **Verification 1:** Verify that *no* marketing pixels (e.g., Meta, Google Ads, LinkedIn) or analytics cookies (e.g., `_ga`, `_fbp`) are written to the browser *before* you click Accept.
   - **Verification 2:** Click **Accept All**. Verify that all tracking cookies are immediately successfully written.
   - **Verification 3:** Clear cookies, reload, and click **Reject All**. Verify that only strictly essential functional cookies (e.g., the CMP's own preference cookie) are written.

2. **The Consent Management Platform (CMP) Checklist:**
   - [ ] GTM (Google Tag Manager) Consent Mode is enabled and configured.
   - [ ] Consent categories are mapped correctly:
     - `ad_storage` -> Marketing/Advertising Cookies
     - `analytics_storage` -> Performance/Analytics Cookies
     - `personalization_storage` -> Customization/Preference Cookies
     - `security_storage` -> Functional/Essential Cookies
   - [ ] Cookie expiration is set to a reasonable duration (typically 6 months/180 days).
