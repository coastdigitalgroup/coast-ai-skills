---
name: wishlist-optimization
description:
  Audit and optimize wishlist and "save-for-later" functionality to capture soft
  intent, reduce cart abandonment, and drive repeat traffic through
  personalized re-engagement.
---

# Wishlist Optimization

## Purpose

The Wishlist Optimization skill provides a systematic framework for capturing
"soft intent"—users who are interested in a product but are not ready to
purchase immediately. By providing a low-friction way to save items, this skill
reduces cart abandonment (by moving non-immediate items out of the cart) and
creates a bridge for future conversions. It transforms the wishlist from a
passive storage area into an active re-engagement engine that directly
improves Return Visitor Conversion Rate (RVCR) and Lifetime Value (LTV).

## Use Cases

- **High-Consideration E-commerce:** Items requiring research or budget
  planning (e.g., furniture, high-end electronics).
- **Gift Planning:** Seasonal events (holidays, weddings) where users aggregate
  multiple items over time.
- **Stock & Price Monitoring:** Users waiting for an item to come back in stock
  or for a price drop.
- **Comparison Shopping:** Users saving items across multiple categories to
  narrow down their final choice.

## When NOT to Use

- **Low-Involvement Impulse Buys:** Where adding any secondary action might
  distract from an immediate purchase (e.g., $5 digital stickers).
- **Urgent/Need-Based Services:** Emergency plumbing or immediate-use software
  where "saving for later" is irrelevant.
- **Single-Product Sites:** If there is only one item to buy, a wishlist adds
  unnecessary complexity.
- **Restricted/Regulated Goods:** Where saving items for later might violate
  compliance or safety standards (e.g., certain pharmaceuticals).

## Inputs

1. **Wishlist Analytics:** Wishlist Add Rate (WAR), Wishlist-to-Cart Conversion
   Rate, and average time-in-wishlist.
2. **Abandonment Data:** High rates of "Cart as Wishlist" behavior (users
   adding many items to cart but not checking out).
3. **Current UI Screenshots:** Visibility and placement of "Save" buttons on
   PLPs, PDPs, and in the Cart.
4. **Out-of-Stock Metrics:** Volume of users landing on unavailable products.

## Outputs

1. **Wishlist Friction Audit:** Identification of barriers like forced login or
   hidden "Save" buttons.
2. **Strategic Placement Map:** Guidance on button positioning to balance
   immediate purchase vs. saving for later.
3. **Guest Wishlist Strategy:** A plan for enabling persistence without
   requiring an account.
4. **Re-engagement Trigger Map:** Logic for email/SMS/push notifications based
   on wishlist activity (e.g., Price Drop, Back-in-Stock).

## Workflow

### 1. Identify "Cart as Wishlist" Friction

Analyze if users are using the shopping cart as a temporary storage area.
- If cart abandonment is high and "Items Removed" is low, users are likely
  using the cart to "save" items.
- **Solution:** Introduce a prominent "Move to Wishlist" or "Save for Later"
  option inside the cart to clear the path for immediate purchases.

### 2. Optimize the "Save" Entry Point

- **PLP Visibility:** Add a subtle heart or bookmark icon on product cards in
  the listing view to allow quick saving without leaving the discovery flow.
- **PDP Proximity:** Place the "Add to Wishlist" button near the "Add to Cart"
  button, but ensure it is visually subordinate (e.g., an outline button or
  text link) to avoid competing for the primary action.
- **Micro-interactions:** Provide immediate visual feedback (e.g., heart
  filling in, small animation) when an item is saved.

### 3. Implement the "Guest-First" Model

Eliminate the #1 friction point: Forced login to save.
- **Persistence:** Use local storage or cookies to maintain a guest wishlist
  for at least 30 days.
- **The "Lazy Login" Hook:** Only prompt for an account when the user wants to
  access the wishlist on a different device or after they have saved 3+ items.

### 4. Create an Active Wishlist Experience

Don't let the wishlist become a "black hole."
- **Empty State Guidance:** If the wishlist is empty, suggest popular items or
  show "Recently Viewed" products.
- **Sort & Organize:** For catalogs with many items, allow users to create
  multiple lists (e.g., "Living Room Ideas," "Birthday Wishlist").
- **Clear Path to Purchase:** Ensure every item in the wishlist has a prominent
  "Add to Cart" button and shows current stock/price status.

### 5. Design Re-engagement Triggers

Leverage the data to bring users back.
- **Price Drop Alerts:** Notify users when a saved item goes on sale.
- **Low Stock Warnings:** Create urgency for items in their list ("Only 2
  left!").
- **Back-in-Stock Notifications:** Automatically alert users when a previously
  unavailable saved item returns.

## Decision Rules

- **The Subordination Rule:** The "Add to Wishlist" button must never be more
  visually prominent than the "Add to Cart" button.
- **The One-Click Save:** Saving an item should never require a page reload or
  a multi-step modal.
- **Guest Access Default:** Anonymous users must be able to save at least one
  item before being asked to sign in.
- **Proximity of Intent:** On the PDP, the "Save" button should be within 20px
  of the "Add to Cart" button to capture the "not yet" moment.

## Constraints

- **Guest Persistence Limits:** Guest wishlists rely on local storage or
  cookies; users who clear browser data or switch devices will lose their
  list unless they create an account.
- **Real-Time Data Dependency:** Price-drop and back-in-stock alerts require
  inventory and pricing data to be available in near real time — stale data
  produces inaccurate or late notifications.
- **Platform Support:** Multi-list organization ("Living Room Ideas") is
  only viable on platforms/catalogs large enough to justify the added UI
  complexity.

## Non-Goals

- Does not cover the cart or checkout experience itself — see
  `cart-experience-optimization`.
- Does not design the recommendation logic behind "Recently Viewed" or
  empty-state suggestions, only where and when to surface them.
- Does not address gift registries or collaborative/shared list features as
  a distinct product surface.

## Common Failure Patterns

- **The "Login Wall":** Requiring an account just to save an item, which kills
  the "soft intent" moment.
- **Hidden in Header:** Making the wishlist only accessible through a tiny,
  unlabeled icon in the top navigation.
- **Static Storage:** Never emailing or notifying users about their saved
  items, leading to 0% return rates from the wishlist.
- **Cart Competition:** Making the "Save" button so large that users
  accidentally click it instead of "Buy Now."
- **Mobile Unfriendly:** Using tiny icons that are difficult to tap on
  touchscreens.

## Validation Criteria

- [ ] **Wishlist-to-Cart Conversion:** Measure the % of users who eventually
  move a wishlist item into their cart.
- [ ] **Cart Abandonment Rate:** Monitor if providing a "Save for Later" option
  in the cart reduces abandonment of the remaining items.
- [ ] **Wishlist Add Rate (WAR):** (Users who add to wishlist / Total users).
  Target: 5-10% of visitors.
- [ ] **Re-engagement CTR:** Measure the click-through rate of "Price Drop" or
  "Back in Stock" emails triggered by wishlist items.
