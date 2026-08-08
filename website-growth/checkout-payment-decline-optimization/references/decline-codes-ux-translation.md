# Credit Card Decline Codes: UX Translation Guide

This reference guide maps standard credit card and payment processor decline codes (used by major gateways such as Stripe, Adyen, Braintree, and PayPal) to friendly, conversion-focused customer-facing UX translations.

---

## The Philosophy of Error Translation

When a payment fails, the interface should never show technical jargon or blame the customer. Instead, follow these three core guidelines:

1.  **Reduce Guilt:** Soften the blow of financial declines (e.g., insufficient funds, bank block). Frame it as a common, minor bump rather than a credit failure.
2.  **Highlight State Preservation:** Reassure the user that their cart items and delivery information are safe and have not been lost.
3.  **Provide a Clear Next Step:** Every error message must tell the user exactly how to resolve the issue (e.g., check a specific field, try another card, or switch payment methods).

---

## Decline Code Mapping Table

| Raw Gateway Code | Common Meaning | High-Conversion UX Translation Copy | Recommended UI Action |
| :--- | :--- | :--- | :--- |
| `insufficient_funds` | The card has exceeded its limit or has insufficient balance. | *"It looks like your card doesn't have sufficient funds available to complete this purchase. To secure your items, you can complete checkout with a different card, or choose an interest-free installment option (BNPL) to split your order total."* | Dynamic wallet/BNPL alternative panel expands. |
| `incorrect_cvc` | The 3- or 4-digit security code is wrong. | *"The 3 or 4-digit security code on the back of your card seems to be incorrect. Please check the code and try again. Your billing and shipping information remains safe."* | Highlight the CVC field in red. Auto-focus cursor into the CVC input. |
| `expired_card` | The card expiration date has passed or was entered incorrectly. | *"This card appears to be expired. Please check the expiration date, try another card, or select an alternative payment option below."* | Highlight the Expiration Date input. |
| `do_not_honor` | The card issuer bank blocked the transaction (usually a generic fraud filter). | *"Your bank has declined this transaction. This often happens with online purchases to protect your security. You can contact your bank to approve it, try another card, or complete your checkout securely with PayPal or Apple Pay."* | Display a direct link to switch payment methods. |
| `suspected_fraud` | Gateway or bank's automated fraud engine blocked the card. | *"Your bank has temporarily flagged this purchase for your protection. To complete your order immediately without contacting your bank, we recommend checking out with PayPal or Apple Pay."* | Prioritize Express Digital Wallets (PayPal/Apple/Google) as they bypass standard bank fraud checks. |
| `incorrect_number` | The 15 or 16-digit card number is invalid. | *"The card number you entered seems to be incorrect. Please check the card number and try again. Your security details are safe and fully encrypted."* | Highlight the Credit Card Number field. Clear only this field, keeping other inputs populated. |
| `card_velocity_exceeded` | The card has exceeded its daily transaction limit. | *"Your card has reached its daily limit for online purchases. To secure your items before they sell out, you can checkout using another card, pay with PayPal, or use an installment method."* | Highlight alternative payment options. |
| `processing_error` | A technical glitch occurred between the gateway and the bank network. | *"We are experiencing a temporary network issue with our card gateway. Don't worry—your cart is saved and you have not been charged. Please wait a few moments and click 'Place Order' again, or checkout securely via PayPal."* | Display a "Try Again" button alongside PayPal fallback. |

---

## Field-Level Error Highlights (UI/CSS specs)

To minimize cognitive load, pair error messages with immediate visual feedback on the form inputs themselves:

*   **Error Border:** Apply a 2px solid light-red/crimson border (`#E53E3E`) to the invalid input field.
*   **Error Label:** Place a small, red helper message directly below the input field (e.g., `font-size: 0.85rem`, `color: #E53E3E`) repeating the specific guidance (e.g., *"Please enter a valid 3-digit CVV"*).
*   **Aria Attributes:** Update input field attributes dynamically to ensure screen readers announce errors correctly:
    *   Set `aria-invalid="true"`.
    *   Link the input to the error helper text using `aria-describedby="cvv-error-msg-id"`.
