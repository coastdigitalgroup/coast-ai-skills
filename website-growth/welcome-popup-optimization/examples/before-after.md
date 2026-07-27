# Before & After: Welcome Offer Popup Overhaul

This example demonstrates how **Aurora Beauty**, an organic skincare D2C e-commerce brand, transformed its low-performing welcome popup into a high-converting, user-friendly, and mobile-accessible subscription engine.

## The Challenge

Aurora Beauty had healthy organic traffic (~80,000 monthly unique sessions, with 72% on mobile devices). However, they were struggling with two core metrics:
1. **Low Visitor-to-Subscriber Capture:** Only **1.8%** of first-time visitors subscribed to their newsletter.
2. **High Mobile Bounce Rates:** Mobile bounce rates on the homepage and core landing pages sat at an elevated **54%**, with heatmap recordings showing users repeatedly attempting and failing to dismiss an overlay.

---

## The "Before" State: Intrusion & Friction

The original welcome popup was designed around standard platform defaults with no optimization.

```text
+-----------------------------------------------------------+
|                                                      [x]  |  <-- Tiny 12px grey close button
|   JOIN THE AURORA BEAUTY COMMUNITY!                       |
|                                                           |
|   Sign up for our email newsletter and SMS alerts         |
|   to get updates on product launches, sales, and tips!    |  <-- Low-motivation, generic value proposition
|                                                           |
|   [ Enter your email address          ]                   |
|   [ Enter your phone number (optional) ]                   |  <-- Asking for both fields at once
|                                                           |
|   [ SUBSCRIBE ]                                           |  <-- High-friction, passive CTA text
|                                                           |
+-----------------------------------------------------------+
```

### Key Flaws:
- **Instant Trigger:** The popup fired **0.5 seconds** after the page loaded. Visitors were blocked before they could even read the logo or understand what Aurora Beauty sold.
- **Double-Field Friction:** Demanding both an Email and a Phone number in the initial view created massive cognitive load.
- **Micro Close Target:** The `[x]` button was a tiny 12px target in the far top-right corner. On mobile screens, users frequently mis-tapped the close button, accidentally highlighting text or clicking background elements, leading to extreme frustration and immediate site exit.
- **No Suppression:** Returning customers who came to the site via active marketing email campaigns were repeatedly blasted with the same "join our community" popup.
- **Delayed Gratification:** Once submitted, users had to log into their email provider, search their spam folders, and copy the code, interrupting their shopping flow.

### Performance Baselines:
- **Email Opt-In Rate (OIR):** 1.8%
- **SMS Opt-In Rate:** 0.4%
- **Welcome Code Purchase Redemption Rate:** 2.1%
- **Mobile Homepage Bounce Rate:** 54.2%

---

## The "After" State: The Two-Step, Mobile-First Flow

Aurora Beauty implemented the Welcome Popup Optimization workflow to rebuild a multi-stage, timed, and accessible capture experience.

### Timing & Trigger Changes:
- **Orientation Delay:** The popup was set to trigger after a user remained on the page for **7 seconds AND scrolled at least 35%** of the page depth.
- **Exit-Intent Backup:** On desktop, if a user moved their cursor toward the browser's address bar before the 7-second mark, the popup triggered instantly as a recovery attempt.

### Step 1: Low-Friction Email Capture

```text
+-----------------------------------------------------------+
|                                                   ( X )   |  <-- Large, high-contrast 44x44px close target
|   UNLOCK 15% OFF YOUR FIRST ORDER                         |  <-- Highly motivating, benefit-driven headline
|                                                           |
|   Get instant access to our organic, vegan formulas for   |
|   less. We'll send your exclusive code immediately.       |
|                                                           |
|   [ Enter your email address          ]                   |  <-- Single input field (lowest friction)
|                                                           |
|   [ UNLOCK MY 15% OFF ]                                   |  <-- Benefit-oriented CTA button
|                                                           |
|   No thanks, I prefer paying full price                   |  <-- Opt-out link
+-----------------------------------------------------------+
```

### Step 2: Dynamic SMS Progression

Upon clicking "UNLOCK MY 15% OFF," the email was instantly saved to the database, and the modal dynamically morphed inside the same frame without a page reload.

```text
+-----------------------------------------------------------+
|                                                   ( X )   |
|   WANT IT SENT TO YOUR PHONE?                             |  <-- Re-anchored motivation
|                                                           |
|   Enter your phone number below and we'll text your       |
|   15% off code right now so you don't lose it.            |
|                                                           |
|   [ Enter your mobile number          ]                   |
|   [ ] Send me marketing texts. Consent not req. to buy.   |  <-- Un-checked, compliant consent checkbox
|                                                           |
|   [ TEXT MY DISCOUNT ]                                    |  <-- High-value, specific action CTA
|                                                           |
|   No thanks, just show me my code                         |  <-- Clean skip link
+-----------------------------------------------------------+
```

### Step 3: Instant Success Code

If the user completed Step 2 (or clicked "No thanks, just show me my code" on Step 2), they were instantly presented with the success frame.

```text
+-----------------------------------------------------------+
|                                                   ( X )   |
|   YOU'RE IN! HERE IS YOUR CODE:                           |
|                                                           |
|                       AURORA15                            |  <-- Clear, easy-to-read discount code
|                                                           |
|                   [ COPY CODE ]                           |  <-- Single-tap copy utility
|                                                           |
|   *Discount applies automatically at checkout.            |
|   Code valid for 48 hours.                                |  <-- Gentle urgency framing
|                                                           |
|   [ START SHOPPING BEST-SELLERS ]                         |  <-- Direct routing to category
+-----------------------------------------------------------+
```

---

## Measurable Outcomes

Six weeks after implementing the optimized two-step welcome popup, Aurora Beauty achieved the following results:

| Metric | Before Overhaul | After Overhaul | Net Improvement |
| :--- | :---: | :---: | :---: |
| **Email Opt-In Rate (OIR)** | 1.8% | **6.4%** | **+255% Increase** |
| **SMS Opt-In Rate** | 0.4% | **3.1%** | **+675% Increase** |
| **Welcome Code Redemption Rate** | 2.1% | **11.8%** | **+461% Increase** |
| **Mobile Bounce Rate** | 54.2% | **38.5%** | **-29% Bounce Reduction** |
| **Subscriber-to-Buyer Velocity** | 14.2 Days | **1.9 Days** | **86% Speed-to-Purchase Boost** |

### Why This Worked:
1. **First Impressions Restored:** By delaying the popup by 7 seconds, users had time to browse and realize they wanted the products, making the discount offer far more valuable.
2. **Eliminated "Close-Fatigue":** The large 44px close target and off-canvas dismissal reduced user frustration, drastically dropping the homepage mobile bounce rate.
3. **The Zeigarnik Effect:** Once users committed to Step 1 (entering their email), they felt a psychological urge to complete Step 2 (entering their phone number) since the task was already "in progress."
4. **Immediate Redemption:** Showing the code on the success screen with a "Copy Code" button and applying it automatically to the checkout prevented users from abandoning the shopping cart to check their email inboxes.
