# Decline Codes UX Translation Reference Sheet

This reference sheet maps standard, cryptic payment processor decline codes (used by Stripe, Adyen, Braintree, and Shopify Payments) to user-centric, helpful UX microcopy that minimizes buyer anxiety and maximizes transaction recovery.

---

## The Core Philosophy of Decline Translation

When a payment fails, standard payment gateways return raw machine-readable codes. Standard checkout integrations often render these codes directly to the user (or show a generic "Your card was declined"). This is a conversion killer.

To optimize for recovery, apply the **Four Rules of Polite Decline Copy**:
1. **Never Accuse:** Avoid terms like "invalid," "failed," "wrong," or "user error."
2. **Explain the "Why":** Give a non-technical explanation of why the card issuer rejected the transaction.
3. **Offer Actionable "Next Steps":** Always tell the shopper exactly what they can do next to complete the purchase.
4. **Leverage Trust Proximity:** Place the friendly explanation right next to the card input form or CVC box.

---

## Code Translation Matrix

Below is a master translation table mapping raw payment gateway codes to optimized consumer UX copy.

| Raw Processor Code (Stripe / Adyen) | Technical Meaning | The "Before" Copy (Hostile / Cryptic) | The "After" Copy (Optimized & Actionable UX) |
| :--- | :--- | :--- | :--- |
| `insufficient_funds` / `card_not_honored` | Card has insufficient balance or limit exceeded. | `Declined: Insufficient funds. Use another card.` | ⚠️ **Your card issuer was unable to authorize this purchase.**<br><br>This can happen if a credit limit is reached or if the transaction exceeds a daily limit. To complete your order, you can try another card, use an express option like PayPal, or choose a flexible monthly installment plan below. |
| `incorrect_cvc` / `cvv_invalid` | The 3- or 4-digit security code is incorrect. | `Invalid CVC. Re-enter security code.` | 🔍 **The security code (CVC/CVV) does not match.**<br><br>Please double-check the 3-digit code on the back of your card (or 4-digit code on the front for American Express) and try again. Your billing details are safe. |
| `expired_card` | The card's expiration date is in the past. | `Card expired. Transaction rejected.` | 📅 **This card appears to have expired.**<br><br>Please double-check the expiration date on your card or try using a different card or alternative payment option to secure your order. |
| `incorrect_zip` / `billing_address_mismatch` | Billing ZIP code/address failed AVS check. | `AVS Failure: Billing ZIP mismatch.` | 🏡 **The billing address does not match your card.**<br><br>For your security, card issuers require the billing ZIP/Postal code to exactly match the address associated with your card statement. Please update the ZIP code and try again. |
| `suspected_fraud` / `fraudulent` | Bank's automated fraud detection blocked the transaction. | `Transaction declined: Suspected fraud.` | 🔒 **Your card issuer has temporarily held this payment for your security.**<br><br>Banks frequently hold transactions on high-value orders to prevent unauthorized use. You can resolve this instantly by calling the number on the back of your card to pre-approve Vanguard Living, or by completing your purchase with PayPal or Apple Pay. |
| `card_velocity_exceeded` / `transaction_not_allowed` | Card has too many transactions in a short period. | `Limit Exceeded: Try again later.` | ⏳ **Card limit reached.**<br><br>Your card issuer has put a temporary limit on the frequency of transactions on this card. Try completing your checkout using PayPal, Apple Pay, or an alternative card to avoid any delivery delays. |
| `generic_decline` / `do_not_honor` | Bank declined without giving a specific reason. | `Transaction Declined. Contact Bank.` | ⚠️ **Your card issuer was unable to process this payment.**<br><br>This is a standard security block from your bank. To secure your order, please call the number on the back of your card and ask them to approve "Vanguard Living," or try using another card or PayPal. |

---

## Implementation Best Practices for Developers

To make this translation reference highly effective, developers should wire the front-end forms with the following programmatic rules:

### AVS & Zip Code Fallback Rule
If your site experiences high address verification (AVS) declines:
- Place a checkbox reading: **"My billing address is the same as my shipping address"** and check it by default.
- If unchecked, dynamically slide down a clean billing address form. This prevents 90% of accidental AVS declines before they occur.

### Client-side Card Validation (Luhn Check)
Do not wait for the payment processor round-trip to identify basic typos. Implement client-side input masking and verification:
- Validate that the card number passes the Luhn algorithm.
- Prevent submission and show a gentle inline tip if the card number is too short or long for its detected brand (e.g., 15 digits for Amex, 16 for Visa).
- Ensure input fields dynamically format spacing: `4111 1111 1111 1111` instead of `4111111111111111`. This makes typo checking far easier for the customer.
