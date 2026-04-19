# Before and After: E-commerce Checkout Optimization

This example demonstrates the transformation of a high-friction, multi-step
checkout into a streamlined, high-conversion flow for a fictional electronics
retailer, "ElectroMart."

## Before: The High-Friction Flow

**Scenario:** A user wants to buy a $500 pair of headphones.

1.  **Cart Page:** User clicks "Checkout."
2.  **Login Wall:** A full-screen popup appears: "Login or Sign Up to Continue."
    There is no guest checkout option.
3.  **Step 1 (Account Creation):** User is forced to create a password (must be
    12 chars, include a symbol and a number).
4.  **Step 2 (Shipping):** 15 fields, including "Company Name," "Address Line
    2," and "How did you hear about us?"
5.  **Step 3 (Shipping Method):** 5 confusing options with technical names like
    "Ground-Z 5-7 Day." Prices are not shown until this step.
6.  **Step 4 (Payment):** Only credit card accepted. A large "Coupon Code" box
    dominates the top of the page.
7.  **Final Review:** The "Total" includes a $15 "Processing Fee" never
    mentioned before.

**Outcome:** Abandonment rate of 78%. Mobile users drop off at the Login Wall.

---

## After: The Optimized Flow

**Scenario:** The same user buys the headphones after the optimization protocol
is applied.

1.  **Cart Page:** User clicks "Checkout."
2.  **Enclosed Flow:** The main site navigation disappears. The only exit is a
    small "Back to Cart" link.
3.  **Guest Checkout by Default:** No login wall. The first field is "Email
    Address" with a checkbox for "Create an account for later" (unchecked by
    default).
4.  **Step 1 (Shipping):**
    - Fields reduced to 6 essential inputs.
    - **Address Autocomplete:** User types "123 M..." and selects their address
      from a dropdown.
    - "Shipping same as billing" is pre-checked.
5.  **Step 2 (Payment):**
    - **Express Pay:** Apple Pay and Google Pay buttons are at the top.
    - Coupon box is collapsed into a small text link: "Have a promo code?"
    - **Persistent Summary:** A sidebar shows the item, the $0 shipping (free
      over $100), and the final total throughout the flow.
6.  **Trust Signals:** A "Secure Checkout" badge and a "30-Day Money Back
    Guarantee" badge are placed next to the "Place Order" button.

**Outcome:** Abandonment rate dropped to 42%. Mobile conversion increased by 35%
due to Apple Pay adoption.

---

## Key Changes Made

| Feature          | Before                  | After                   | Growth Lever                      |
| :--------------- | :---------------------- | :---------------------- | :-------------------------------- |
| **Account Req.** | Forced Registration     | Guest Checkout          | Reduces Interaction Cost          |
| **Navigation**   | Standard Header/Footer  | Enclosed Checkout       | Reduces Distraction/Exits         |
| **Data Entry**   | 15 Manual Fields        | 6 Fields + Autocomplete | Reduces Cognitive Load            |
| **Payment**      | CC Only                 | CC + Apple/Google Pay   | Reduces Friction (Mobile)         |
| **Fees**         | Hidden "Processing Fee" | Transparent Total       | Increases Trust                   |
| **Promos**       | Large Coupon Box        | Collapsed Link          | Prevents "Discount Hunting" Exits |
