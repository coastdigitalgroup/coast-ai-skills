# Express Checkout UX Heuristics & Device Rules

This reference guide details behavioral heuristics, vendor compliance guidelines, device-level detection rules, and payload validation requirements for implementing express payment methods.

---

## 1. Core UX & Behavioral Heuristics

### A. The "Form Fatigue" Law
- **Principle:** Every additional form field required during checkout decreases mobile conversion rate by approximately 3% to 5%.
- **Application:** Express checkouts collapse 18–28 manual keystroke interactions into 1 single biometric action (Face ID / Touch ID / Fingerprint).

### B. The Single-Tap Choice Ceiling (Hick's Law)
- **Principle:** Giving users too many payment options at once causes decision paralysis and delays action.
- **Rule:** Limit visible express payment buttons to a maximum of **2 options** per touchpoint on mobile screens.
- **Priority Tiering:**
  - **iOS Safari / iOS Apps:** Apple Pay (Tier 1) + Shop Pay or PayPal (Tier 2).
  - **Android Chrome:** Google Pay (Tier 1) + Shop Pay or PayPal (Tier 2).
  - **Desktop Safari:** Apple Pay + Shop Pay / PayPal.
  - **Desktop Chrome / Windows:** Google Pay + Shop Pay / PayPal.

### C. Visual Hierarchy & "OR" Boundary Separation
- **Principle:** Express checkout triggers must never blend into or replace standard checkout buttons without clear visual differentiation.
- **Rule:** Use visual boundaries (e.g., contrasting button backgrounds, stacked button groupings) and text dividers (`— OR —`) to separate express wallet actions from manual form entry.

---

## 2. Platform & Vendor Compliance Rules

| Provider | Supported Browsers / OS | Mandatory Merchant Requirements | Brand Guidelines |
| :--- | :--- | :--- | :--- |
| **Apple Pay** | Safari (iOS & macOS), Native iOS Apps | - Domain verification via `.well-known/apple-developer-merchantid-domain-association`<br>- Active HTTPS<br>- Apple Pay Merchant ID | Must use official Apple Pay button assets or SVG markup (`apple-pay-button` CSS class). Do not alter button corner radius outside 3px-5px or distort logo aspect ratio. |
| **Google Pay** | Chrome (Android, Windows, macOS), Edge | - Google Pay Merchant ID<br>- Payment Gateway Integration (Stripe, Braintree, Adyen, etc.) | Must follow Google Pay Brand Guidelines (Black or White button with official Google Pay mark). Minimum height 40px. |
| **Shop Pay** | All browsers (Shopify Ecosystem) | - Active Shopify Payments gateway | Official Shop Pay purple (`#5A31F4`) or black/white button styling. |
| **PayPal Express** | All browsers & operating systems | - PayPal Developer API Credentials | Official PayPal yellow (`#FFC439`) or blue button styling. Minimum width 150px. |

---

## 3. Technical Data Payload Handshake Protocol

When an express wallet modal is launched, the front-end script exchanges data payloads with the native wallet sheet.

```text
[ USER TOUCHES EXPRESS BUTTON ]
             │
             ▼
[ 1. PAYLOAD INITIATION ]
├── Currency: "USD"
├── Country Code: "US"
├── Subtotal: Item price(s)
└── Mandatory Field Requests:
    ├── requestShipping: true
    ├── requestPayerName: true
    ├── requestPayerEmail: true
    └── requestPayerPhone: true
             │
             ▼
[ 2. USER SELECTS ADDRESS IN NATIVE SHEET ]
             │
             ▼
[ 3. ADDRESS CALLBACK HANDSHAKE ]
├── Front-end receives: Zip, City, State, Country
├── API Request sent to Store Backend: Calculate Taxes & Carrier Rates
└── Front-end returns to Wallet Sheet: Updated Total + Available Shipping Options
             │
             ▼
[ 4. BIOMETRIC AUTHENTICATION (Face ID / Touch ID) ]
             │
             ▼
[ 5. GATEWAY PAYMENT EXECUTION ]
├── Tokenized Payment Nonce sent to Gateway
└── Order Confirmation Page Rendered
```

---

## 4. Required Field & Error Handling Rules

1. **Mandatory Phone Number Request:** Always set `requestPayerPhone: true` in the express payload settings. Many shipping carriers (FedEx, UPS, DHL) require a recipient phone number for SMS tracking. Failing to capture this in the express sheet causes gateway errors or fulfillment holds.
2. **Unsupported Shipping Destination Exception:** If the customer selects a shipping address outside the merchant's delivery zone in the wallet sheet, return a clear error code:
   - *Apple Pay:* `ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS`
   - *Google Pay:* `reason: "SHIPPING_ADDRESS_UNSERVICEABLE"`
3. **Discount Transfer Handshake:** Always apply promo codes to the order subtotal *before* instantiating the Payment Request object. If a user enters a promo code after opening the wallet, recalculate `details.total` immediately.
