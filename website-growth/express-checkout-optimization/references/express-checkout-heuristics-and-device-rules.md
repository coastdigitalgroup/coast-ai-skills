# Express Checkout Heuristics, Device Detection, & Architecture Rules

## 1. Operating System & Browser Detection Architecture

To maintain high conversion rates and prevent broken UI interactions, express payment buttons must strictly align with the user's active device, operating system, and browser engine.

### Detection Matrix

| OS / Platform | Browser Engine | Primary Native Express | Secondary Universal Express | Anti-Pattern (DO NOT SHOW) |
| :--- | :--- | :--- | :--- | :--- |
| **iOS / iPadOS** | Safari (WebKit) | **Apple Pay** | Shop Pay, PayPal Express | Google Pay (unsupported natively) |
| **iOS / iPadOS** | Chrome / Firefox (WebKit) | **Apple Pay** (where supported via WebKit) | Shop Pay, PayPal Express | Native Google Pay modal |
| **iOS / iPadOS** | In-App (Instagram/TikTok WebView) | **Shop Pay / PayPal** (Universal SMS) | Apple Pay (if WebView permits) | Raw Google Pay |
| **Android** | Chrome / Samsung Internet (Blink) | **Google Pay** | Shop Pay, PayPal Express | Apple Pay (fails JS session check) |
| **Android** | In-App (Instagram/Meta WebView) | **Shop Pay / PayPal** (Universal SMS) | Google Pay | Apple Pay |
| **macOS** | Safari | **Apple Pay** | Shop Pay, PayPal Express | Google Pay |
| **Windows / Linux** | Chrome / Edge / Firefox | **Google Pay** | Shop Pay, PayPal Express | Apple Pay |

### Client-Side JavaScript Guard Rules

```javascript
// Rule 1: Apple Pay Session Verification
function isApplePayAvailable() {
  return (
    window.ApplePaySession &&
    ApplePaySession.canMakePayments()
  );
}

// Rule 2: Google Pay Payment Request Verification
async function isGooglePayAvailable(paymentsClient) {
  try {
    const response = await paymentsClient.isReadyToPay({
      allowedPaymentMethods: [/* Google Pay Allowed Methods */]
    });
    return response.result;
  } catch (err) {
    return false;
  }
}
```

---

## 2. Ergonomics & Mobile Thumb-Zone Placement

On mobile viewports (375px–430px width), the bottom half of the screen represents the **Natural Thumb Zone** (easiest area for single-handed navigation).

```text
  ┌─────────────────────────────────┐
  │                                 │
  │        HARD TO REACH ZONE       │
  │        (Avoid CTA Placement)    │
  │                                 │
  ├─────────────────────────────────┤
  │                                 │
  │        NATURAL THUMB ZONE       │
  │                                 │
  │  [ Pay Buy with Apple Pay    ] │ <── Preferred Express Target
  │  [ Shop Pay                   ] │
  │  ─────── OR ─────────────────   │
  │  [ Proceed to Checkout        ] │ <── Natural Primary Target
  │                                 │
  └─────────────────────────────────┘
```

### Thumb-Zone Ergonomic Rules:
1. **Vertical Stack Order:** Position the most popular device-native option (e.g., Apple Pay on iOS) immediately above the standard checkout CTA in the lower third of the viewport.
2. **Minimum Touch Target:** Express payment buttons must maintain a minimum height of **48px** and horizontal padding of **16px** to ensure easy tapping without accidental miss-clicks.
3. **Sticky Dock Guard:** On long scrolling PDPs, if a sticky bottom CTA bar is active, incorporate the Express Checkout pill inside the sticky bar container rather than floating two conflicting bars.

---

## 3. Discount Code & Dynamic Cart State Synchronization

A common point of checkout friction occurs when session discount codes (e.g., promotional codes, newsletter sign-up coupons) applied during browsing fail to pass into the native express wallet payment sheet.

### Data Flow Architecture

```text
[ User Selects Variant / Applies Coupon "SAVE20" ]
                        │
                        ▼
[ Client-Side Store State Updates Subtotal ($100 ➔ $80) ]
                        │
                        ▼
[ Express Button Click Listener Intercepts Payload ]
                        │
                        ▼
[ Construct Native Wallet Line Items & Display Total ($80) ]
                        │
                        ▼
[ User Authenticates via Face ID / Touch ID ]
                        │
                        ▼
[ Gateway Authorizes Tokenized Payment ($80) ]
```

### Critical Sync Heuristics:
1. **Never Hardcode Line Items:** Always assemble the wallet line-item payload dynamically from the current active cart object at the exact moment of click.
2. **Propagate URL Discounts:** If a discount coupon is set in `localStorage` or session cookies via a marketing URL parameter (e.g., `?discount=SUMMER20`), pass the coupon code directly to the checkout creation endpoint invoked by the express payment handler.
3. **Address-Based Tax/Shipping Recalculation:** Native wallet sheets fire callbacks when the user changes their saved address inside the wallet sheet (e.g., `onshippingaddresschange` in Payment Request API). You must attach event listeners to recalculate local sales tax and available shipping methods dynamically based on the newly selected shipping ZIP code before finalizing authorization.

---

## 4. Vendor Brand Styling Rules & Anti-Patterns

Vendor brand guidelines strictly govern how official express payment buttons must be presented. Non-compliant styling can lead to gateway rejection or merchant account suspension.

### Official Vendor Styling Guidelines

- **Apple Pay:**
  - Must use official CSS styles (`-webkit-appearance: -apple-pay-button`).
  - Allowed background themes: Black, White with line outline, White.
  - Logo must never be distorted, resized independently, or recolored.
- **Google Pay:**
  - Background must be solid dark (`#000000`) or light (`#FFFFFF`) with official Google Pay SVG brand mark.
  - Minimum surrounding clear space must equal at least half the height of the Google Pay brand mark.
- **Shop Pay:**
  - Must use official Shop Pay purple (`#5A31F4`) or dark container with white Shop Pay logotype.
- **PayPal Express:**
  - Must use official PayPal gold (`#FFC439`) or blue (`#0070BA`) pill styling.

### Visual Hierarchy Anti-Patterns to Avoid

- **The "Wall of Buttons":** Stacking 4 or 5 full-width express buttons vertically. Limit express options to **max 2–3 buttons** per view.
- **Missing Visual Separator:** Placing express buttons directly adjacent to standard checkout buttons without an "OR" divider line, leaving users unable to distinguish between 1-touch payment and manual checkout.
- **Microcopy Distortion:** Replacing official button microcopy with custom text (e.g., using "Click Here To Pay With Apple" instead of official "Buy with Apple Pay").
