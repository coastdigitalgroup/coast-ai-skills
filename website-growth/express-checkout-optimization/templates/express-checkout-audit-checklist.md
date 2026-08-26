# Express Checkout Optimization Audit Checklist

Use this reusable checklist to audit, troubleshoot, and optimize express payment methods (Apple Pay, Google Pay, Shop Pay, PayPal Express, Amazon Pay) across mobile and desktop e-commerce experiences.

---

## 1. Device & Browser Compatibility Audit

- [ ] **Dynamic Native Detection Implemented:** Express buttons render *only* when supported by the user's browser, operating system, and wallet authorization status.
  - [ ] iOS Safari: Apple Pay initialized and displayed as primary single-tap method.
  - [ ] Mac Safari: Apple Pay initialized when Touch ID / linked device is detected.
  - [ ] Android Chrome: Google Pay / Payment Request API initialized as primary single-tap method.
  - [ ] Windows Chrome / Edge: Google Pay, PayPal, or Shop Pay rendered; non-functional Apple Pay buttons suppressed.
- [ ] **Domain Verification Verified:** HTTPS is enforced and domain verification files are registered with Apple Developer / Google Pay merchant accounts.
- [ ] **Graceful Fallback:** Browsers lacking Web Payments API support default smoothly to standard checkout without rendering empty or broken layout blocks.

---

## 2. Visual Hierarchy & Placement Audit

### Product Detail Page (PDP)
- [ ] **Primary Action Distinction:** "Add to Cart" retains primary visual hierarchy (solid brand color, highest contrast).
- [ ] **Instant Buy Secondary Framing:** Express button is positioned below or alongside "Add to Cart" with a clear visual text indicator (e.g., `— OR INSTANT BUY —`).
- [ ] **Variant Selection Lock:** Express payment button is disabled or triggers a validation alert if mandatory product variants (Size, Color, Model) have not been selected.

### Cart Drawer / Slide-Out Cart
- [ ] **Speedway Positioning:** Express payment buttons are placed above or immediately below the primary "Proceed to Checkout" button.
- [ ] **Viewport Height Constraint:** Combined cart footer elements (Subtotal + Express Buttons + Primary CTA) consume less than 35% of total vertical screen height on mobile.
- [ ] **Pre-Express Discount Entry:** Customers can enter or view applied discount codes inside the cart drawer *before* clicking an express payment trigger.

### Checkout Page (Top of Step 1)
- [ ] **Express Speedway Container:** Express buttons sit in a dedicated top-of-page card (e.g., `#F6F6F6` background) titled *"Express Checkout"*.
- [ ] **Explicit Divider:** A clear divider separates express buttons from standard manual address inputs (e.g., `—— OR CONTINUE BELOW FOR MANUAL CHECKOUT ——`).

---

## 3. Data Sync & Technical Payload Audit

- [ ] **Complete Customer Attributes Requested:** Wallet payload requests all mandatory merchant fields:
  - [ ] First Name & Last Name
  - [ ] Email Address
  - [ ] Phone Number (for SMS delivery updates and carrier fulfillment)
  - [ ] Complete Shipping Address (Street, City, State, Zip, Country)
- [ ] **Real-Time Shipping & Tax Recalculation:** Changing the delivery address inside the native wallet modal triggers an immediate API callback (`onshippingaddressselected` / `onPaymentDataChanged`) to recalculate shipping options and taxes.
- [ ] **Discount Code Transfer:** Promo code discounts applied on PDP or Cart are accurately deducted from the subtotal shown inside the wallet sheet.
- [ ] **Currency & Item Mapping:** Subtotal, tax, shipping, and total amounts inside the wallet sheet match the cart exact values down to the currency code (e.g., `USD`, `EUR`, `GBP`).
- [ ] **Stock & Inventory Locking:** Triggering the express sheet locks cart items to prevent overselling during checkout execution.

---

## 4. Accessibility & UX Friction Audit

- [ ] **Touch Target Size:** Express buttons satisfy minimum touch target guidelines (at least 48px height, 48x48px touch area).
- [ ] **Color Contrast:** Button colors and vendor logos maintain sufficient contrast against page backgrounds (WCAG AA compliant).
- [ ] **Keyboard Navigable:** Express buttons are focusable via `Tab` key and executable via `Enter` or `Space`.
- [ ] **Screen Reader Labels:** Buttons include explicit accessibility labels (e.g., `aria-label="Pay with Apple Pay"` or `aria-label="Buy now with Shop Pay"`).

---

## 5. Scoring & Conversion Readiness Summary

Rate each section on a scale of 0 to 2:
- **0** = Missing / Broken
- **1** = Partially Implemented / Minor Friction
- **2** = Fully Optimized & Tested

| Audit Category | Score (0 - 2) | Audit Notes & Remediation Actions |
| :--- | :--- | :--- |
| 1. Dynamic Device Detection | | |
| 2. PDP Variant State Lock | | |
| 3. Cart Drawer Promo Code Field | | |
| 4. Visual "OR" Dividers | | |
| 5. Requested Phone Number | | |
| 6. Real-Time Shipping Callback | | |
| 7. Touch Target Size (>=48px) | | |
| 8. Accessibility & ARIA Labels | | |
| 9. Checkout Speedway Container | | |
| 10. Inventory Lock Handshake | | |
| **TOTAL SCORE (out of 20)** | | **Target: 16+ for Production Launch** |

---

## Implementation Code Blueprint (Payment Request API)

```javascript
// Express Payment Detection & Trigger Blueprint
async function initExpressPayment() {
  if (!window.PaymentRequest) {
    console.log('Payment Request API not supported. Hiding express buttons.');
    return;
  }

  const supportedInstruments = [
    {
      supportedMethods: 'https://apple.com/apple-pay',
      data: {
        version: 3,
        merchantIdentifier: 'merchant.com.yourstore',
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        merchantCapabilities: ['supports3DS']
      }
    },
    {
      supportedMethods: 'basic-card',
      data: { supportedNetworks: ['visa', 'mastercard', 'amex'] }
    }
  ];

  const details = {
    total: {
      label: 'Store Order Total',
      amount: { currency: 'USD', value: '140.00' }
    },
    displayItems: [
      { label: 'Subtotal', amount: { currency: 'USD', value: '140.00' } }
    ]
  };

  const options = {
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestShipping: true,
    shippingType: 'shipping'
  };

  try {
    const request = new PaymentRequest(supportedInstruments, details, options);
    const canPay = await request.canMakePayment();

    if (canPay) {
      document.getElementById('DynamicExpressContainer').style.display = 'block';

      // Address selection callback for real-time shipping calculation
      request.addEventListener('shippingaddresschange', async (evt) => {
        evt.updateWith(fetchUpdatedShippingRates(request.shippingAddress));
      });
    }
  } catch (err) {
    console.error('Express payment initialization error:', err);
  }
}
```
