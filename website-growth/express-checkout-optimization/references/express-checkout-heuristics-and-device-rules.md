# Express Checkout Heuristics, Device Rules, & UX Reference

This reference documentation provides technical heuristics, Payment Request API standards, browser/OS detection rules, and design guidelines for implementing express checkout wallets.

---

## 1. Biometric Authentication & Friction Reduction Heuristics

### The Typing Friction Index (TFI)
Manual mobile checkout forms require an average of **120 to 180 individual screen taps/keystrokes** across 10–14 input fields (Email, First Name, Last Name, Street Address, Apt, City, State, ZIP, Phone, Credit Card Number, Expiration Date, CVV).

Express wallet authentication reduces keystrokes from ~150 down to **1 to 2 biometric interactions**:
1. Single tap on `Buy with Apple Pay` / `Pay with GPay`
2. Face ID scan (or Touch ID fingerprint)

### The 30-Second Rule
- **Manual Form Duration:** Average completion time: 110–140 seconds.
- **Express Wallet Duration:** Average completion time: 15–25 seconds.
- **Conversion Correlation:** Every 10-second reduction in checkout duration yields a ~1.8% to 3.2% relative lift in mobile conversion completion rate.

---

## 2. Browser & Operating System Detection Matrix

Express payment APIs depend on browser engine security models and host operating system capabilities.

| Browser / OS Environment | Slot 1 Priority | Slot 2 Priority | Fallback Option |
| :--- | :--- | :--- | :--- |
| **iOS Safari (iPhone/iPad)** | Apple Pay | Shop Pay | Standard Checkout |
| **Android Chrome** | Google Pay | Shop Pay | PayPal Express / Credit Card |
| **Desktop Safari (macOS)** | Apple Pay | Shop Pay / PayPal | Credit Card |
| **Desktop Chrome / Edge** | Google Pay | Shop Pay / PayPal | Credit Card |
| **Meta In-App Browser (iOS)** | Shop Pay | PayPal Express | Standard Checkout |
| **TikTok In-App Browser (Android)** | Google Pay | Shop Pay / PayPal | Standard Checkout |

### Payment Request API Detection (JavaScript Example)

```javascript
// Check for native Payment Request API availability
async function detectAvailableWallets() {
  const wallets = {
    applePay: false,
    googlePay: false
  };

  // Apple Pay specific check (Safari)
  if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    wallets.applePay = true;
  }

  // W3C Payment Request API (Google Pay / Standard Web Wallets)
  if (window.PaymentRequest) {
    const networks = ['visa', 'mastercard', 'amex'];
    const supportedMethods = [{
      supportedMethods: 'https://google.com/pay',
      data: {
        gateway: 'stripe',
        'stripe:publishableKey': 'pk_live_xxx',
        'stripe:version': '2020-08-27'
      }
    }];

    const details = {
      total: { label: 'Total', amount: { currency: 'USD', value: '1.00' } }
    };

    try {
      const request = new PaymentRequest(supportedMethods, details);
      wallets.googlePay = await request.canMakePayment();
    } catch (e) {
      console.warn('PaymentRequest check failed:', e);
    }
  }

  return wallets;
}
```

---

## 3. Brand Identity & Touch Target Guidelines

Payment networks strictly enforce visual branding compliance for payment buttons.

### Apple Pay Button Guidelines
- **Height Minimum:** 44px (Recommended: 48px to 52px on mobile).
- **Corner Radius:** Must match host app button radius (standard 4px or rounded full pill).
- **Color Variants:**
  - `Black`: Best for light mode / white backgrounds.
  - `White`: Best for dark mode / dark gray backgrounds.
  - `White with Outer Line`: Best for light backgrounds requiring contrast outline.
- **Prohibited Actions:** Never alter the Apple Pay logo aspect ratio, replace text with custom fonts, or translate "Apple Pay" into non-English scripts.

### Google Pay Button Guidelines
- **Height Minimum:** 48px.
- **Padding & Margin:** Minimum 8px clear space around all sides.
- **Color Variants:**
  - `Dark` (Black): Standard for light UI backgrounds.
  - `Light` (White with border): Standard for dark UI backgrounds.

### Shop Pay Button Guidelines
- **Color Accent:** `#5A31F4` (Shop Pay Purple).
- **Placement:** Works as universal single-click wallet across all browsers (iOS, Android, Desktop).

---

## 4. Common Edge Cases & Technical Mitigation

### Edge Case 1: In-App Webview Constraints
**Problem:** Social media apps (Instagram, TikTok, Facebook) open links in embedded webviews that restrict native iOS `ApplePaySession` JavaScript bridges for security reasons.
**Solution:**
- Detect webview User Agent (`/Instagram/i` or `/FBAN/i` or `/ByteLocale/i`).
- Automatically prioritize **Shop Pay** or **PayPal Express** as Slot 1 in webview environments to maintain high express wallet availability.

### Edge Case 2: Variant & Inventory Out-of-Stock Race Conditions
**Problem:** User keeps PDP open for 20 minutes, then taps "Buy with Apple Pay". The selected variant has gone out of stock.
**Solution:**
- Perform real-time AJAX inventory validation immediately upon the `onpaymentmethodselected` event before authorizing the payment payload.
- If out of stock, abort payment session and show inline toast error: `"Selected size is now out of stock. Please select another variant."`

### Edge Case 3: Discount Code Application
**Problem:** User applies a promo code in cart drawer, but express payment payload reflects full non-discounted subtotal.
**Solution:**
- Recalculate subtotal, taxes, and shipping fees after applying discount code object before invoking `PaymentRequest.show()` or `ApplePaySession`.
