# Checkout Best Practices & UX Heuristics

This reference guide summarizes the psychological principles and UX heuristics
that drive high-performing checkout flows.

## 1. The Principle of Momentum

Users in the checkout have high intent. Every field or decision is a "friction
point" that drains their momentum.

- **The Goal:** Minimize "Interaction Cost."
- **Technique:** Use "Enclosed Checkout" to remove exit paths and keep the user
  focused on the finish line.

## 2. Adaptive Validation (Error Recovery)

Generic error messages like "Invalid Input" increase user anxiety and lead to
abandonment.

- **Best Practice:** Use "Adaptive Messages" that tell the user exactly what is
  wrong.
- **Example:**
  - _Bad:_ "Invalid Phone Number"
  - _Good:_ "Phone number must be at least 10 digits (e.g., 555-0199)"

## 3. Shipping Transparency (The #1 Abandonment Reason)

According to Baymard Institute, nearly 50% of abandonments are due to high extra
costs (shipping, tax, fees) that are hidden until the end.

- **Heuristic:** Calculate the total as early as Step 1.
- **Technique:** If the exact shipping is unknown, provide a "Shipping
  Calculator" or "Estimated Total" based on the user's detected location.

## 4. Guest Checkout Heuristics

Forced registration is the #2 reason for abandonment.

- **The "Account as a Reward" Pattern:** Do not ask for an account at the start.
  Instead, ask the user if they want to "Save my information for next time" on
  the **Thank You** page after the order is complete.

## 5. Mobile Checkout Specifics

- **The Thumb Zone:** Place primary "Next" buttons in the bottom third of the
  screen where they are easiest to reach.
- **Input Types:**
  - `type="email"`: Triggers the `@` and `.` keys.
  - `type="tel"`: Triggers the numeric keypad.
  - `autocomplete="shipping address-line1"`: Enables browser-saved address
    filling.

## 6. Psychology of the Promo Code Box

A prominent promo code box acts as a "Bail Out" trigger. Users leave the
checkout to search Google for "StoreName Coupon," find a competitor, or get
distracted.

- **Best Practice:** Keep the promo code field collapsed behind a text link
  (e.g., "Have a promo code?") to keep it out of sight for users who don't
  already have one.

## 7. Trust Signal Proximity

Trust isn't global; it's contextual.

- **Heuristic:** Place security badges (e.g., "Verified by Visa") and privacy
  promises (e.g., "We won't share your email") exactly where the user is
  entering that specific data. Trust signals at the footer are less effective
  than those next to the Credit Card field.
