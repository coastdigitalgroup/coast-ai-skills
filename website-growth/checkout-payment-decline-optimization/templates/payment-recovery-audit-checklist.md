# Checkout Payment Recovery Audit & Optimization Template

This document provides a systematic checklist and audit sheet designed to identify conversion leaks during payment processing and deploy robust, high-conversion decline handling mechanics.

---

## Part 1: Checkout Payment Friction Audit Sheet

Use this sheet to audit your current website checkout's payment failure experience. Run standard transactions using test cards (e.g., Stripe test cards with failure responses) to observe checkout behavior.

### 1. General Error UX & Mechanics
| Audit Question | Current State | Risk Level | Action Needed |
| :--- | :--- | :---: | :--- |
| **Do checkout fields reload/wipe on card decline?** | [ ] Yes [ ] No | **HIGH** | If yes, convert the form to AJAX/Fetch-based submissions to preserve full state. |
| **Does the viewport auto-scroll to the error banner?** | [ ] Yes [ ] No | **MEDIUM** | Ensure the screen automatically scrolls or focuses on the error so the user isn't left guessing. |
| **Is the error message displayed in close proximity to the final CTA?** | [ ] Yes [ ] No | **LOW** | Reposition the error banner so it resides directly above the "Place Order" button. |
| **Does the page have a loading spinner during checkout?** | [ ] Yes [ ] No | **MEDIUM** | Disable double-clicking on the CTA with a loading state to prevent double-charging. |

### 2. Error Message Tone & Clarity
| Audit Question | Current State | Risk Level | Action Needed |
| :--- | :--- | :---: | :--- |
| **Are raw developer error codes displayed to the user?** | [ ] Yes [ ] No | **HIGH** | Intercept raw gateway codes and replace them with friendly user-facing translations. |
| **Are decline reasons clearly explained?** | [ ] Yes [ ] No | **MEDIUM** | Make sure messages clearly separate "CVC Error" from "Insufficient Funds" or "Bank Block." |
| **Is the tone helpful and action-oriented?** | [ ] Yes [ ] No | **LOW** | Rewrite error copy to be encouraging, suggesting alternative next steps. |

### 3. Alternative Payment Escape Hatches
| Audit Question | Current State | Risk Level | Action Needed |
| :--- | :--- | :---: | :--- |
| **Are alternative payment methods shown near the error banner?** | [ ] Yes [ ] No | **HIGH** | Inject PayPal, Apple/Google Pay, or BNPL alternatives inside or immediately below the error block. |
| **Is it easy to switch payment methods with one click?** | [ ] Yes [ ] No | **MEDIUM** | Provide a direct click handler that switches focus to the alternative payment tab instantly. |

### 4. Continuous Friction Assistance
| Audit Question | Current State | Risk Level | Action Needed |
| :--- | :--- | :---: | :--- |
| **Do you offer live assistance after multiple failures?** | [ ] Yes [ ] No | **MEDIUM** | Implement a trigger to show live chat, callback support, or toll-free numbers on 2+ declines. |
| **Are abandoned decline sessions retargeted via email?** | [ ] Yes [ ] No | **MEDIUM** | Set up a cart abandonment flow specifically tailored for "Payment Failure" users within 30 minutes. |

---

## Part 2: High-Conversion Error Messaging Templates

Use these copy blocks to map your gateway's response codes to user-friendly messages.

### Template 1: General Card Decline (Generic)
*   **Gateway Trigger:** `card_declined` / `generic_decline` / `do_not_honor`
*   **Customer Headline:** `⚠️ Card Payment Could Not Be Completed`
*   **Customer Body:** `Your bank was unable to authorize this transaction. This can sometimes occur for online security protection. We recommend contacting your card issuer, using a different card, or choosing an alternative payment option like PayPal below to complete your checkout.`

### Template 2: Insufficient Funds
*   **Gateway Trigger:** `insufficient_funds`
*   **Customer Headline:** `⚠️ Payment Card Issue`
*   **Customer Body:** `It looks like your card doesn't have sufficient funds available to complete this transaction. To secure your items, you can complete checkout with a different payment card, or choose our interest-free installment option (Klarna/Afterpay) to split your order total.`

### Template 3: Incorrect Card Credentials
*   **Gateway Trigger:** `incorrect_cvc` / `incorrect_zip` / `invalid_expiry_year`
*   **Customer Headline:** `⚠️ Please Check Your Card Details`
*   **Customer Body:** `Some of your card information seems to be incorrect. Please check your CVV (security code on back), billing ZIP code, or expiration date and try again. Your billing and shipping information remains safe and saved below.`

### Template 4: Connection / Gateway Timeout
*   **Gateway Trigger:** `processing_error` / `lost_connection`
*   **Customer Headline:** `⚠️ Payment System Temporarily Busy`
*   **Customer Body:** `We're experiencing temporary connection issues with our card gateway. Don't worry—your cart is saved and you have not been charged. Please wait a few moments and try clicking "Complete Purchase" again, or checkout securely using PayPal.`

---

## Part 3: The 5-Step Decline Optimization Implementation checklist

Follow this step-by-step list to launch your optimized checkout payment recovery:

- [ ] **Step 1: Implement AJAX-Based Submission**
  - Replace form action redirects with an asynchronous JavaScript fetch call.
  - Test that shipping and billing info persists completely when a payment failure payload is returned.

- [ ] **Step 2: Map Gateway Codes to UX Translation Hook**
  - Integrate a middleware lookup function that intercepts JSON error payloads from the gateway API.
  - Replace raw strings with custom translation template keys (e.g., `decline_code_insufficient_funds`).

- [ ] **Step 3: Style the High-Contrast Error Container**
  - Ensure the container uses warning indicators (soft red background, dark red text, prominent icon).
  - Center-align or float the container directly in the user's focus plane (just above the final checkout button).

- [ ] **Step 4: Add One-Click Digital Wallet Fallbacks**
  - Embed alternative checkout shortcuts (e.g., Express PayPal/Apple Pay SDK buttons) inside the error block.
  - Wire the alternative buttons to trigger checkout validation using tokenized wallet payloads immediately.

- [ ] **Step 5: Set Up Live Assistance & Abandonment Triggers**
  - Write a JavaScript listener tracking consecutive failed checkout click attempts.
  - If attempts $\ge 2$, trigger live chat widget state to auto-open with a message offering payment assistance.
  - Sync the checkout decline event with your ESP (email service provider) to trigger a "Failed Payment Recovery" email campaign.
