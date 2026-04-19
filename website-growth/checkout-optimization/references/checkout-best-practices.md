# Checkout UX Best Practices & Heuristics

This reference guide covers the core psychological and functional principles
that drive checkout conversion.

## 1. The Enclosed Checkout (The "Tunnel" Effect)

Once a user enters the checkout, the goal shifts from "browsing" to
"completing."

- **Heuristic:** Remove the global header (navigation links, search bar) and
  global footer.
- **Why:** Every link is an opportunity for the user to leave the funnel and
  never return.
- **Exceptions:** Keep the logo (links to home), "Back to Cart," and essential
  legal links (Privacy, Terms).

## 2. Guest Checkout & The "Sunk Cost" Account Creation

Forcing registration is the #2 reason for cart abandonment (after unexpected
costs).

- **Heuristic:** Offer a "Guest Checkout" button as the primary action.
- **The Pro Move:** Don't ask for a password at all during checkout. On the
  "Thank You" page, say: "Save your details for next time? [Enter Password]."
- **Why:** Users perceive "Creating an Account" as a high-effort task that
  implies future marketing spam.

## 3. The "No Surprises" Rule (Transparency)

Users have a "mental price" they expect to pay based on the cart.

- **Heuristic:** Show tax and shipping estimates as early as the Zip Code is
  known.
- **Why:** Finding out about a $15 shipping fee at the _last_ click of a
  5-minute process triggers "Loss Aversion" and leads to rage-quitting.

## 4. Reducing Interaction Cost

Every keystroke is a chance for an error or a distraction.

- **Address Autocomplete:** Reduces typing by ~80% and prevents shipping errors.
- **Credit Card Recognition:** Automatically detect the card type (Visa,
  Mastercard) from the first few digits. Do not ask the user to select the card
  type from a dropdown.
- **Mobile Keyboards:** Use HTML5 input types (`type="tel"`, `type="number"`) so
  the user doesn't have to switch keyboard layouts.

## 5. Coupon Box Psychology

A large, empty "Enter Promo Code" box is a siren song for users to leave.

- **The Problem:** Users see the box, realize they don't have a code, open a new
  tab to "Google for [Brand] Coupons," find a fake code, get frustrated when it
  doesn't work, and never come back.
- **Heuristic:** Hide the promo code field behind a text link (e.g., "Have a
  promo code?"). If a user _has_ a code, they will look for the link. If they
  don't, they won't feel like they are missing out.

## 6. Proximity of Trust

Trust signals are most effective when they are placed exactly where the "buying
pain" occurs.

- **Heuristic:** Place your "Secure Checkout" lock icon and "Money Back
  Guarantee" within 50px of the final submission button.
- **Why:** Trust is not a global state; it is a local requirement at the moment
  of financial risk.

## 7. The Progress Indicator

- **Heuristic:** For checkouts with more than 2 steps, show a progress bar.
- **Why:** It manages the user's expectations of "How much longer will this
  take?" and provides a sense of accomplishment as they move through steps.
