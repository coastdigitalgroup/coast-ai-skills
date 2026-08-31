# Express Checkout Optimization Audit Checklist

Use this actionable audit checklist to evaluate, diagnose, and optimize express payment implementations across Product Detail Pages (PDP), Cart Drawers, and Checkout Funnels.

---

## 1. Device & Capability Detection

- [ ] **Native Wallet Matching:** iOS Safari users see Apple Pay as the top primary express option; Android Chrome users see Google Pay as the top express option.
- [ ] **Unsupported Fallback:** Inactive or unconfigured express options are dynamically hidden (no disabled or non-responsive payment buttons shown).
- [ ] **In-App Webview Detection:** In-app social browsers (Instagram, TikTok, Facebook Webview) that restrict Apple Pay domain verification gracefully display Shop Pay or Google Pay without breaking execution.
- [ ] **Cross-Platform Parity:** Non-iOS/Android devices receive a clean, universally supported express option (e.g., Shop Pay, PayPal Express, Amazon Pay).

---

## 2. Product Detail Page (PDP) Placement & UX

- [ ] **Dynamic Express CTA:** Dynamic express payment button is positioned directly adjacent to or beneath the primary "Add to Cart" button.
- [ ] **Visual Differentiation:** The express button has distinct visual hierarchy (e.g., branded Apple Pay black or Shop Pay purple) and does not visually obscure or confuse the main CTA.
- [ ] **Minimum Touch Target:** Button height is at least 48px–56px on mobile viewports with a minimum 8px margin spacing from surrounding elements.
- [ ] **Variant & Quantity Binding:** Quantity selectors, variant selections (size, color), and custom options correctly update the express wallet modal price payload before sheet authorization.
- [ ] **Out-of-Stock Guard:** Express checkout button is automatically disabled/hidden when the selected product variant is out of stock.

---

## 3. Cart Drawer & Slide-Out Cart Placement

- [ ] **Above-the-Fold Visibility:** At least one express payment button is visible without scrolling when the cart drawer opens on standard mobile devices (iPhone 13/14/15, Samsung Galaxy).
- [ ] **Express Accelerator Header:** Express payment options are anchored together in an explicit express container.
- [ ] **Section Divider:** A clear visual divider separates express checkout from manual checkout (`── OR CONTINUE WITH MANUAL CHECKOUT ──`).
- [ ] **Full Width Mobile Touch Target:** Express buttons span 100% full width of the cart drawer on mobile viewports.
- [ ] **Max Button Count Limit:** No more than 2 to 3 express buttons are rendered in the cart drawer to prevent choice paralysis ("button stack fatigue").

---

## 4. Checkout Step 1 (Contact / Shipping) Architecture

- [ ] **Top-Anchored Express Section:** Express payment options are anchored at the absolute top of Checkout Step 1, above contact info and shipping fields.
- [ ] **Auto-Fill Data Mapping:** Email, phone number, shipping address, and billing address automatically populate from wallet payload without requiring re-entry.
- [ ] **Guest Tokenization:** Express sessions complete seamlessly without forcing mandatory password or account creation steps.
- [ ] **Clear Return Path:** Users can exit the express wallet modal and return smoothly to standard checkout without losing cart contents or applied discounts.

---

## 5. Discount, Tax & Shipping Payload Synchronization

- [ ] **Cart Promo Code Sync:** Promo codes applied in the cart drawer are passed into the express wallet payload as explicit line-item reductions.
- [ ] **Real-time Shipping Callback:** Changing shipping address inside the Apple Pay / Payment Request sheet triggers an instant `onshippingaddresschange` API call to recalculate exact shipping rates.
- [ ] **Tax Recalculation:** Local, state, and international taxes update dynamically in the wallet modal once the shipping ZIP/postal code is selected.
- [ ] **Free Shipping Threshold Sync:** Free shipping thresholds configured on site are correctly evaluated inside the express wallet sheet.

---

## 6. Performance, Analytics & Failure Handling

- [ ] **Asynchronous SDK Loading:** Express payment SDKs (Apple Pay JS, Google Pay API, Shop Pay SDK) load asynchronously without blocking critical path rendering or LCP.
- [ ] **Event Tracking:** Analytics events are fired for:
  - `express_button_impression` (which wallet was displayed)
  - `express_button_click` (wallet initiated)
  - `express_authorization_success` (wallet authorized)
  - `express_checkout_complete` (order placed)
  - `express_checkout_error` (address/gateway error)
- [ ] **Error Messaging:** Clear, friendly inline error messages are displayed if an express transaction is declined or if address data is incomplete.
- [ ] **Post-Purchase Redirection:** After wallet authorization, customer is directed cleanly to an order confirmation / thank-you page with complete order details.
