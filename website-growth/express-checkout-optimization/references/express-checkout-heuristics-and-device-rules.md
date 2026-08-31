# Express Checkout Technical & UX Heuristics

## Overview

Express payment methods (Apple Pay, Google Pay, Shop Pay, PayPal Express, Amazon Pay) leverage stored credit card and shipping credentials from a user's operating system, browser, or platform account. This reference details key UX heuristics, technical specifications, device matching rules, and integration strategies required for high-converting express checkout experiences.

---

## 1. Device & Browser Capabilities Matrix

| Express Payment Method | Native Ecosystem / Browser | Secondary / Cross-Platform Availability | Device Requirements |
| :--- | :--- | :--- | :--- |
| **Apple Pay** | iOS Safari, macOS Safari | Supported in Safari on iOS/macOS; limited third-party iOS browsers via WebKit | Active Wallet pass configured; Secure Element / Touch ID / Face ID enabled |
| **Google Pay** | Android Chrome, Desktop Chrome | Supported on Chrome, Edge, Brave, Android Webviews | Google Account signed in with saved payment card; Payment Request API support |
| **Shop Pay** | Shopify Platform (All browsers) | Universal via SMS OTP / Shop App cookie recognition | Saved Shop Pay profile tied to mobile phone number / email |
| **PayPal Express** | Universal (All browsers/devices) | Universal via pop-up or redirect web view | Active PayPal account or One Touch cookie |
| **Amazon Pay** | Universal (All browsers/devices) | Universal via Amazon OAuth widget | Active Amazon account |

---

## 2. Core UX & Positioning Heuristics

### Heuristic 1: Device-Native Priority
Users trust payment methods integrated natively into their device operating systems.
- On Apple hardware (iPhones, iPads, Macs running Safari), **Apple Pay** produces the highest conversion rate because authorization requires only a biometric scan (Face ID / Touch ID).
- On Android hardware and Chrome browsers, **Google Pay** provides the lowest friction path.
- Always display the native wallet as the primary express CTA.

### Heuristic 2: The "Stack Limit" (Rule of 3)
Displaying 4 or more payment buttons simultaneously triggers choice paralysis, slows down decision-making, and creates severe visual clutter on mobile screens.
- **Max Recommended Express CTAs:** 2 (Primary + Secondary).
- **Absolute Maximum:** 3 (only if formatted neatly in a 2-column or structured grid).

### Heuristic 3: Explicit Funnel Distinction
Express checkout must be visually separated from standard checkout to avoid confusing users who prefer entering standard credit card or invoice details.
- Use an explicit divider: `── OR ──` or `────── CONTINUE WITH EXPRESS CHECKOUT ──────`.
- Label standard checkout buttons clearly: `PROCEED TO MANUAL CHECKOUT` or `CONTINUE TO SHIPPING`.

### Heuristic 4: Touch Target Ergonomics
On mobile devices, payment buttons are primary conversion nodes in the "thumb zone".
- Minimum touch target height: **48px** (Recommended: **52px–56px**).
- Full width (100% block width) on mobile screen sizes (< 768px).
- Tap targets must have at least 8px padding from surrounding elements to eliminate accidental taps.

---

## 3. Dynamic Address & Shipping Callbacks

When a user initiates express checkout directly from a PDP or cart drawer, shipping rates and taxes cannot be pre-calculated because the user's destination address is unknown until the wallet sheet opens.

### Callback Execution Sequence

```text
[ User Clicks Express Button ]
              │
              ▼
  [ Express Wallet Sheet Opens ]
              │
              ▼
[ User Selects Shipping Address in Sheet ]
              │
              ▼
   (Trigger: onshippingaddresschange API event)
              │
              ▼
[ Merchant Server Recalculates Shipping Rates & Taxes ]
              │
              ▼
[ Server Passes Line-Item Rates Back to Wallet Sheet (<300ms) ]
              │
              ▼
[ User Chooses Shipping Method & Authorizes Order ]
```

### SLA & Latency Requirements
- Shipping rate recalculations inside the express wallet sheet must return in **under 300 milliseconds**.
- If shipping callbacks take longer than 1500ms, Apple Pay / Google Pay sheets will time out and display a generic error, aborting the checkout.

---

## 4. Promo Code & Cart Synchronization Rules

1. **Pre-Session Application:** Any coupon code applied in the cart drawer before launching express checkout must be encoded into the express line-item summary object (e.g., `total: subtotal - discount`).
2. **In-Sheet Promotion Display:** Show the discount code title explicitly as a negative line item (e.g., `Discount (WELCOME10): -$15.00`) inside the wallet summary so the user verifies the discount was honoured.
3. **Cart Lock During Express Session:** When an express sheet is open, the underlying cart state must be locked to prevent price discrepancies if background inventory or cart timers change.

---

## 5. Analytics & Funnel Tracking Architecture

To accurately diagnose express checkout performance, track the following standard telemetry events in your analytics layer:

```javascript
// Example Analytics Event Payload Strategy
window.dataLayer = window.dataLayer || [];

// 1. Impression Event (Fired when express buttons render)
window.dataLayer.push({
  event: 'express_checkout_impression',
  ecommerce: {
    visible_wallets: ['apple_pay', 'shop_pay'],
    location: 'cart_drawer' // 'pdp' | 'cart_drawer' | 'checkout_step_1'
  }
});

// 2. Click Event
window.dataLayer.push({
  event: 'express_checkout_click',
  ecommerce: {
    selected_wallet: 'apple_pay',
    location: 'cart_drawer',
    cart_value: 192.00
  }
});

// 3. Authorization Success Event
window.dataLayer.push({
  event: 'express_checkout_authorized',
  ecommerce: {
    selected_wallet: 'apple_pay',
    transaction_id: 'tx_123456789'
  }
});
```
