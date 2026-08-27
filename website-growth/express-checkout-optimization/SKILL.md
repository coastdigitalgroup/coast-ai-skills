---
name: express-checkout-optimization
description:
  Audit, position, configure, and optimize express payment methods (Apple Pay, Google Pay,
  Shop Pay, PayPal Express, Amazon Pay) across product detail pages, cart drawers, and checkout
  flows to accelerate one-touch purchasing, reduce form fatigue, and boost mobile conversion rates.
---

# Express Checkout Optimization

## Purpose

The Express Checkout Optimization skill provides a systematic, conversion-focused framework for auditing, positioning, ordering, and configuring one-touch wallet buttons (Apple Pay, Google Pay, Shop Pay, PayPal Express, Amazon Pay) across e-commerce Product Detail Pages (PDPs), cart drawers/mini-carts, and initial checkout steps.

Typing billing addresses, shipping details, and credit card numbers on mobile viewports introduces high typing friction and form fatigue. Mobile users abandon carts at a significantly higher rate (~78%) compared to desktop users (~66%) primarily due to input fatigue and security hesitation during multi-field checkout. Express checkout buttons eliminate up to 85% of checkout form fields by leveraging biometric authentication (Face ID / Touch ID) and pre-stored shipping/payment profiles.

This skill maximizes Express Payment Adoption Rate, reduces checkout completion time, eliminates mobile cart drop-off, and lifts overall Mobile Checkout Completion Rate (CCR).

## Use Cases

- **Mobile-Heavy E-Commerce Storefronts:** Sites with >50% mobile traffic suffering from high checkout drop-off between cart view and order completion.
- **Single-Item or Impulse-Buy Purchases:** Direct PDP checkout flows where buyers want to purchase a single product immediately without navigating through cart drawers and multi-step checkout forms.
- **Cart Drawers & Slide-Out Mini-Carts:** Merchandising instant checkout wallet options directly inside the slide-out cart before entering the traditional checkout funnel.
- **Top-of-Funnel Paid Social Campaigns:** Landing pages receiving traffic from Instagram, TikTok, or Meta ads where mobile friction directly impacts Return on Ad Spend (ROAS).
- **Subscription First-Order Enrollment:** Accelerating initial subscriber checkout by combining one-click wallet authorization with subscription sign-up.

## When NOT to Use

- **B2B Custom Quote & Net-30 Invoicing:** B2B portals requiring purchase orders, custom tax-exempt documentation, or manual sales approval (use `request-for-quote-optimization` instead).
- **High-Touch Configurable Products:** Orders requiring mandatory detailed custom customization inputs, file uploads, or complex delivery date scheduling prior to checkout validation.
- **Early-Stage Discovery Pages:** Category pages or broad product listing pages where express buttons clutter browsing interfaces (use `product-listing-page-optimization` or `guided-discovery-optimization` instead).
- **Unsupported Payment Geographies:** Localized markets where wallet penetration is under 5% and local alternative payment methods (e.g., iDEAL, Klarna, PIX, Boleto) dominate consumer preference.

## Inputs

1. **Traffic & Device Breakdown:** Percentage split of mobile vs. desktop visitors, browser distribution (Safari vs. Chrome vs. Mobile App Webviews).
2. **Current Payment Analytics:** Breakdown of current payment gateway usage (Credit Card vs. PayPal vs. Apple Pay vs. Shop Pay) and checkout completion rates by payment method.
3. **Checkout Funnel Drop-off Metrics:** Step-by-step funnel data (PDP -> Cart Drawer -> Checkout Step 1 Shipping -> Checkout Step 2 Payment -> Completed Order).
4. **Current On-Site Placement Audit:** Screenshots and DOM locations of current express payment buttons across PDPs, cart drawers, and checkout headers.
5. **Gateway & Platform Capabilities:** Active payment processor capabilities (Shopify Payments, Stripe, Adyen, Braintree, PayPal Commerce) and API capabilities for express wallet rendering.

## Outputs

1. **Express Payment Placement & Hierarchy Spec:** Layout blueprints detailing placement, order, and visual sizing of express wallet buttons across PDP, mini-cart, and checkout entry.
2. **Dynamic Wallet Detection Protocol:** Logic rules for browser/device-aware wallet rendering (e.g., showing Apple Pay only on Safari/iOS, Google Pay on Chrome/Android).
3. **Checkout Friction Audit & Form Bypass Map:** Identification of redundant fields eliminated by wallet payload authorization (address, email, phone, billing).
4. **Validation & A/B Testing Plan:** Concrete testing roadmap measuring express wallet adoption rate, checkout completion velocity, and mobile conversion lift.

---

## Workflow

### 1. Audit Current Express Wallet Coverage & Device Alignment

Evaluate existing wallet integration across all critical touchpoints.

- **Check Browser & OS Alignment:** Test wallet visibility across iOS Safari, Android Chrome, and in-app browsers (Instagram/TikTok webviews). Ensure Apple Pay renders natively on Safari and Google Pay/Shop Pay on Chrome.
- **Measure Baseline Express Penetration:** Calculate the percentage of orders currently completed via express wallets versus standard manual credit card forms. Benchmark target: **35–55% of mobile orders** should utilize express payment.
- **Identify Placement Gaps:** Check if express buttons exist on PDPs (buy-now), Cart Drawers, and Checkout Step 1. Missing express buttons in the cart drawer is the single most common cause of mobile drop-off.
- **Audit Field Redundancy:** Verify if clicking an express wallet button bypasses address and contact forms completely or if it improperly dumps the user back into an empty manual form.

### 2. Establish Express Button Placement & Hierarchy

Position wallet buttons where buyer intent is highest without disrupting secondary purchase options.

- **Product Detail Page (PDP) Layout:**
  - Place standard "Add to Cart" as the primary full-width button.
  - Position dynamic Express Checkout button ("Buy with Apple Pay" / "Buy with Shop Pay") directly below "Add to Cart".
  - Ensure equal visual weight (min height 48px) and distinct brand colors (Apple Pay black/white, Shop Pay purple, Google Pay dark/white).
- **Cart Drawer / Mini-Cart Layout:**
  - Position express wallet container *above* or directly adjacent to the standard "Proceed to Checkout" button.
  - Group express buttons in a dedicated, branded container labeled `"Express Checkout"` or `"Instant One-Touch Checkout"`.
- **Checkout Step 1 (Contact Info):**
  - Feature the Express Checkout button strip at the very top of the checkout form, separated from standard manual fields by a clear visual divider: `—— OR CONTINUE BELOW ——`.

### 3. Implement Dynamic Wallet Detection & Smart Ordering

Never show unavailable or unconfigured payment methods to users.

- **Leverage Payment Request API:** Use `window.PaymentRequest` or native gateway SDKs (Stripe, Shopify) to detect active card wallets on the user's device before rendering.
- **Prioritize Device Native Wallets:**
  - **iOS Safari / macOS Safari:** Prioritize Apple Pay as Slot 1.
  - **Android Chrome / Windows Chrome:** Prioritize Google Pay or Shop Pay as Slot 1.
  - **Universal / Mobile Webviews:** Position Shop Pay or PayPal Express as top fallback options.
- **Limit Visible Buttons:** Display maximum 2–3 express buttons at a time to avoid visual clutter and choice paralysis. Collapse excess options under a "More Payment Options" toggle.

### 4. Optimize the Express Payment Authorization Flow

Eliminate secondary friction once the wallet sheet opens.

- **Pre-calculate Shipping Rates:** Ensure shipping costs and taxes are passed dynamically to the wallet payload so the total amount inside Apple Pay/Google Pay sheet is 100% accurate before biometric approval.
- **Default to Free/Standard Shipping:** Pre-select the fastest or most common shipping method within the wallet sheet to prevent shipping selection errors inside the native modal.
- **Require Minimal Fields in Wallet Request:** Request only `shippingAddress`, `payerEmail`, and `payerPhone`. Do not request unnecessary data that triggers wallet modal validation errors.

### 5. Review Against Decision Rules & Test Across Viewports

Confirm all implementation details conform to express conversion heuristics prior to deployment.

---

## Decision Rules

- **The "No Hidden Total" Rule:** Total purchase price (including estimated shipping and taxes) must be reflected inside the express wallet sheet prior to biometric authorization (Face ID / Touch ID / Fingerprint).
- **The Touch Target Floor:** All express checkout buttons must maintain a minimum touch target height of **48px** (preferably 52px) with at least 8px spacing between adjacent payment buttons to prevent accidental mis-clicks on mobile screens.
- **Device-First Native Priority:** Always display the device-native wallet (Apple Pay on iOS, Google Pay on Android) as the first visual option in the express container.
- **The "Single Visual Divider" Rule:** When presenting express payment options above standard form fields, separate them with a thin, clear divider line and explicit microcopy (e.g., `Or checkout with credit card`).
- **Synchronized Variant State:** Express buttons on PDPs ("Buy It Now") must pass the currently selected product variant, quantity, and custom attributes directly to the wallet payload without requiring an intermediate cart load.

---

## Constraints

- **Brand Styling Guidelines:** Payment network brand guidelines (Apple, Google, Shop Pay, PayPal) strictly prohibit altering button logos, altering official trademark colors, or modifying trademarked typography.
- **Browser Security Requirements:** Express payment APIs require secure HTTPS contexts and valid SSL certificates. Apple Pay requires domain verification files uploaded to `.well-known/apple-developer-merchantid-domain-association`.
- **In-App Browser Webview Restrictions:** Webviews inside Instagram, TikTok, and Facebook ads may block native Apple Pay JS APIs. Fall back smoothly to Shop Pay, PayPal, or standard checkout forms when native wallet APIs are restricted.

## Non-Goals

- Gateway merchant account negotiation or payment processing fee reduction.
- Building custom backend payment processing engines or PCI-compliant vaulting systems.
- Designing physical POS (Point of Sale) terminal interfaces.

---

## Common Failure Patterns

- **The "Double Form Trap":** User clicks "Apple Pay", authenticates with Face ID, but is then redirected to Step 1 of standard checkout to re-enter their address and email manually.
- **Invisible Wallet Buttons on Mobile Webviews:** Failing to account for Instagram/Meta in-app browsers where Apple Pay API is suppressed, resulting in blank white gaps where express buttons should be.
- **Mismatched Variant Purchase:** User selects "Size Large / Red" on PDP, clicks "Buy with Apple Pay", but the wallet payload defaults to the base variant "Size Small / Black" because PDP JS state was not synced.
- **Express Button Clutter (The Rainbow Stack):** Stacking 5+ express buttons (Apple Pay, Google Pay, Shop Pay, PayPal, Amazon Pay, Venmo) vertically, consuming half of the mobile viewport and overwhelming the user with choice paralysis.
- **Missing Express Options in Cart Drawer:** Offering express checkout on PDP and Checkout page, but omitting it from the slide-out cart drawer where 60%+ of mobile users initiate checkout.

---

## Validation Criteria

- [ ] **Express Payment Adoption Rate:** (Orders completed via Express Wallets / Total Orders) * 100. Target: **35% to 55%** of mobile transactions.
- [ ] **Mobile Checkout Completion Rate (CCR):** (Completed Orders / Checkout Initiations on Mobile) * 100. Target: **+10% to +22% relative lift**.
- [ ] **Time-to-Checkout Velocity:** Average time elapsed from clicking checkout to order completion. Target: **<30 seconds** for express wallet users (vs. 120+ seconds for manual credit card forms).
- [ ] **Cart Abandonment Rate Reduction:** Measure drop-off reduction between Cart Drawer and Order Confirmation. Target: **8% to 15% reduction** in cart abandonment.
