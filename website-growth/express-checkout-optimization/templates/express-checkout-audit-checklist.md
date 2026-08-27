# Express Checkout Optimization Audit & Implementation Checklist

This checklist provides a systematic diagnostic and implementation audit for optimizing express payment wallets (Apple Pay, Google Pay, Shop Pay, PayPal Express, Amazon Pay) across Product Detail Pages (PDPs), cart drawers, and checkout flows.

---

## Phase 1: Gateway & Platform Diagnostic Audit

- [ ] **SSL & Security Context:**
  - Verify site is served exclusively over HTTPS.
  - Confirm valid SSL/TLS certificate configuration across main domain and checkout subdomains.

- [ ] **Apple Pay Domain Verification:**
  - Confirm merchant domain verification file is active at `/.well-known/apple-developer-merchantid-domain-association`.
  - Verify Apple Pay domain registration status inside payment gateway (Shopify Payments, Stripe, Adyen, Braintree).

- [ ] **Gateway Feature Activation:**
  - Confirm Apple Pay is enabled in gateway portal.
  - Confirm Google Pay is enabled in gateway portal.
  - Confirm Shop Pay (or platform equivalent one-touch wallet) is active.
  - Confirm PayPal Express Checkout API credentials are valid and active.

---

## Phase 2: Touchpoint Placement & Hierarchy Audit

### Product Detail Page (PDP)
- [ ] **Primary vs. Express Button Placement:**
  - Standard "Add to Cart" button is full-width, primary contrast color.
  - Express Checkout button ("Buy with Apple Pay" / "Buy with Shop Pay") is placed directly below "Add to Cart".
- [ ] **Touch Target Sizing:**
  - Minimum button height is **48px** (52px recommended on mobile).
  - Minimum touch padding between buttons is **8px**.
- [ ] **Variant Synchronization:**
  - Changing product size, color, or quantity dynamically updates the express wallet payload price and item details without page refresh.

### Cart Drawer / Slide-Out Mini-Cart
- [ ] **Cart Drawer Visibility:**
  - Express checkout buttons are rendered inside the mini-cart footer.
  - Express container is placed *above* or immediately adjacent to the manual "Proceed to Checkout" button.
- [ ] **Visual Separation:**
  - Clear visual divider exists between express wallet buttons and manual checkout CTA (`—— OR ——`).
- [ ] **Cart State Sync:**
  - Modifying cart quantities or removing items instantly recalculates the wallet subtotal.

### Checkout Entry Step
- [ ] **Header Banner Placement:**
  - Express Checkout button strip sits at the very top of Step 1 (Contact Info).
  - Explicit microcopy guides users: `"Express Checkout"`.
- [ ] **Form Bypass Continuity:**
  - Completing wallet authentication (Face ID / Touch ID) bypasses manual form fields and completes order without forcing re-entry of shipping address.

---

## Phase 3: Device Detection & Dynamic Wallet Rules

- [ ] **Device/Browser Detection Test Matrix:**
  - **iOS Safari:** Renders Apple Pay as Slot 1. Google Pay is suppressed.
  - **Android Chrome:** Renders Google Pay as Slot 1. Apple Pay is suppressed.
  - **Desktop Safari:** Renders Apple Pay as Slot 1 if Touch ID / paired iPhone available.
  - **Desktop Chrome:** Renders Google Pay or Shop Pay in Slot 1.
  - **Meta/TikTok In-App Webviews:** Renders Shop Pay or PayPal Express fallback smoothly.
- [ ] **Choice Limitation:**
  - Maximum **2 to 3** express buttons visible simultaneously to prevent choice overload.
  - Excess options collapsed under an expandable toggle (`"More Payment Options"`).

---

## Phase 4: User Experience & Microcopy Verification

- [ ] **Price & Tax Transparency:**
  - Express payment payload correctly includes calculated shipping rates and local taxes.
  - Total price displayed inside native Apple Pay / Google Pay sheet matches final order total 100%.
- [ ] **Default Shipping Selection:**
  - Pre-selects standard/fastest shipping option within wallet payload to avoid modal validation block.
- [ ] **Error Handling & Fallbacks:**
  - If user cancels wallet authentication, UI remains on current page without loss of cart contents or form inputs.
  - Descriptive, inline error messages display if payment fails (e.g., `"Card declined by issuer. Please try another card or standard checkout."`).

---

## Phase 5: Metric Tracking & Conversion Validation

- [ ] **Analytics Event Tracking:**
  - `express_checkout_impression`: Fired when express buttons render in viewport.
  - `express_checkout_click`: Fired when user taps an express wallet button (tagged by provider: `apple_pay`, `google_pay`, `shop_pay`, `paypal`).
  - `express_checkout_complete`: Fired upon successful wallet transaction completion.
- [ ] **KPI Benchmark Goals:**
  - [ ] **Express Payment Share:** >40% of mobile orders completed via express wallets.
  - [ ] **Mobile Conversion Lift:** +10% to +20% relative lift in mobile CCR.
  - [ ] **Time to Checkout:** <30 seconds average checkout duration for express wallet users.
