# Express Checkout Optimization: Audit & Implementation Checklist

This template provides an end-to-end audit checklist for evaluating, configuring, and verifying express payment methods across Product Detail Pages (PDPs), cart drawers, and checkout flows.

---

## Section 1: Device & Browser Compatibility Audit

- [ ] **Native OS/Browser Detection Rules Enabled:**
  - [ ] **Apple Pay:** Configured to display *only* when `window.ApplePaySession` is supported (Safari on iOS / macOS). Hidden on Android/Windows Chrome.
  - [ ] **Google Pay:** Configured to display natively on Chrome for Android/Desktop via Payment Request API / Google Pay API.
  - [ ] **Shop Pay & PayPal Express:** Enabled cross-browser with responsive fallback popups/SMS authentication modals.
- [ ] **In-App Browser (WebView) Verification:**
  - [ ] Verified that express options function properly inside Instagram, TikTok, and Meta In-App WebViews without blocking biometric prompts or crashing.
  - [ ] Fallback universal options (Shop Pay SMS / PayPal) display properly when native Web Spatial/Biometric APIs are sandboxed in WebViews.
- [ ] **Suppression Rules for Unsupported Environments:**
  - [ ] No unclickable, disabled, or error-throwing express buttons appear on unsupported browser/OS combinations.

---

## Section 2: Touchpoint Placement & Visual Hierarchy Audit

### Product Detail Page (PDP)
- [ ] Express button is positioned directly below the primary "Add to Cart" button.
- [ ] Visual distinction is clear: Primary "Add to Cart" uses solid brand fill; Express button uses official vendor branded pill styling.
- [ ] Button height and touch target meet mobile guidelines (minimum **48px x 48px** touch target area).
- [ ] Tapping the PDP Express button directly launches the native payment sheet (skips intermediate cart page).

### Sliding Cart Drawer / Mini-Cart
- [ ] Express buttons are docked above or immediately below the main "Proceed to Checkout" button.
- [ ] Number of visible express buttons is strictly capped at **2 to 3 options** max to prevent "button stacking clutter".
- [ ] A clear visual divider (`—— OR ——`) separates express payment buttons from the standard form checkout button.
- [ ] Express buttons remain sticky or visible within the cart drawer container without obscuring cart items or order total summary.

### Checkout Page Step 1 Header
- [ ] Express Checkout dock is pinned at the top of Step 1 (Information Step), above contact email input fields.
- [ ] Framed with a clean background box and explicit header copy (e.g., *"Express Checkout — One-Touch Pay"*).
- [ ] A distinct visual divider separates express options from standard address input fields below.

---

## Section 3: Cart State, Variant, & Discount Sync Audit

- [ ] **Dynamic Variant Selection Sync:**
  - [ ] Changing size, color, quantity, or product bundle on PDP instantly updates the SKU payload sent to the express sheet without a page reload.
- [ ] **Promotional Discount Propagation:**
  - [ ] URL parameter discounts (e.g., `?discount=SAVE20`) or session auto-discounts accurately reflect in the subtotal shown inside the wallet payment sheet.
- [ ] **Tax & Shipping Rate Calculation:**
  - [ ] Real-time shipping options and tax calculations update dynamically in the native sheet as soon as the user selects a saved shipping address from their wallet.
  - [ ] No "$0.00 Free Shipping" false promises are displayed during sheet authorization if shipping charges actually apply.
- [ ] **Inventory Limits Check:**
  - [ ] Out-of-stock variants disable the PDP Express Checkout button simultaneously with the main "Add to Cart" button.

---

## Section 4: Brand Guidelines & UX Friction Audit

- [ ] **Official Vendor Styling Compliance:**
  - [ ] **Apple Pay:** Uses official Apple Pay button types (`buy`, `plain`, `checkout`) and official logo aspect ratio and corner radius.
  - [ ] **Google Pay:** Adheres to Google Pay brand guidelines (official black/white SVG mark, "Buy with Google Pay" microcopy).
  - [ ] **Shop Pay / PayPal:** Uses official brand purple/blue hex codes and unaltered brand marks.
- [ ] **Viewport Height Constraint:**
  - [ ] Total height of express payment stack does not consume more than **20% of vertical viewport height** on mobile screens.
- [ ] **Unauthenticated Dismissal Fallback:**
  - [ ] If the user opens the express wallet sheet but closes it without completing payment, they are returned gracefully to the cart or checkout page with all items intact and no error modals.

---

## Section 5: Post-Implementation Performance Verification

- [ ] **Express Adoption Benchmark:** Express payments account for **>35%** of total mobile checkout transactions.
- [ ] **Mobile Time-to-Checkout Test:** Average mobile checkout completion time via express payment is **<15 seconds**.
- [ ] **Zero Price Discrepancy Errors:** Order totals inside order confirmation emails match the exact total authorized inside the express payment sheet.
