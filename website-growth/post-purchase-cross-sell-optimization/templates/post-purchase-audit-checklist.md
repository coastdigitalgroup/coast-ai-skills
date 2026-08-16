# Post-Purchase Cross-Sell & Upsell Optimization Checklist

Use this audit checklist and implementation framework to evaluate, design, and optimize post-purchase cross-sell flows, 1-click interstitial offers, and Thank You page order modification blocks.

---

## Part 1: Initial Discovery & Technical Readiness Audit

- [ ] **1. Payment Processor Capability Verification**
  - [ ] Confirmed payment gateway supports vaulted token billing or payment intent modification without requiring manual card re-entry (e.g. Stripe PaymentIntents, Shopify Post-Purchase API, Adyen Tokenization).
  - [ ] Checked SCA / 3DS compliance in relevant regions (EU/UK PSD2) for post-checkout charge limits.
  - [ ] Verified payment method compatibility (Credit Cards, Apple Pay, Google Pay support token vaulting vs. local payment methods like Klarna/PayPal).

- [ ] **2. ERP & Fulfillment Merging Check**
  - [ ] Confirmed Warehouse Management System (WMS) supports appending items to an existing un-fulfilled order ID.
  - [ ] Verified fulfillment hold delay (15–30 minute buffer) is active before picking labels are printed.
  - [ ] Verified logic prevents charging extra shipping fees or creating split multi-box shipments for post-purchase add-ons.

- [ ] **3. Baseline Performance Capture**
  - [ ] Recorded baseline Average Order Value (AOV).
  - [ ] Recorded baseline primary checkout conversion rate.
  - [ ] Recorded baseline order refund / cancellation rate.
  - [ ] Recorded baseline customer support ticket volume regarding shipping/billing.

---

## Part 2: Product Affinity & Offer Strategy Mapping

- [ ] **4. Primary-to-Secondary SKU Mapping**
  - [ ] Mapped Top 20 primary SKUs/Categories to specific high-affinity accessories, consumables, or protection plans.
  - [ ] Ensured offer price is **<= 25% - 30%** of the primary cart subtotal.
  - [ ] Verified cross-sell inventory levels are stable and high-margin (>60% gross margin preferred).
  - [ ] Created a default "Universal High-Margin Offer" (e.g., Mystery Box, Extended Warranty, Express Shipping Upgrade) for unmapped SKUs.

- [ ] **5. Offer Hierarchy & Channel Placement**
  - [ ] **Tier 1 (Post-Checkout Interstitial):** Maximum 1 primary offer (plus 1 optional downsell).
  - [ ] **Tier 2 (Thank You Page):** Maximum 2–3 contextual add-on items embedded in order summary block.

---

## Part 3: Interstitial & Thank You Page UX Audit

- [ ] **6. Post-Checkout Interstitial Screen Design**
  - [ ] **Explicit Confirmation Banner:** Top banner clearly states *"Order #[ID] Confirmed! Special One-Time Offer"*.
  - [ ] **Product Visuals:** High-resolution product image showing the add-on paired with or next to the main item.
  - [ ] **Price & Savings Anchoring:** Display regular price struck through next to exclusive post-purchase price (*"Regularly $39 -> Post-Checkout Price $24"*).
  - [ ] **Zero-Friction CTA Button:** Button text explicitly state single-action charge (*"YES! Add to My Order for $24.99"*). Touch target height >= 48px.
  - [ ] **Clear & Neutral Decline Path:** Visible, non-manipulative text link (*"No thanks, view my order summary"*).
  - [ ] **Shipping Assurance:** Explict copy stating *"Ships in the same box with FREE shipping"*.

- [ ] **7. Order Confirmation Page (Thank You Page) Add-Ons**
  - [ ] Embedded dynamic "Add to Order" widget within the main order summary block.
  - [ ] Prominent countdown timer showing remaining order modification window (*"Your order is processing. Add items for the next 14:59 minutes"*).
  - [ ] 1-click button updates order total dynamically without page reload.

---

## Part 4: Copy, Persuasion & Behavioral Principles

- [ ] **8. Trust & Transparency Verification**
  - [ ] No hidden recurring charges or un-checked subscription boxes.
  - [ ] No countdown timer reset tricks or fake scarcity warnings.
  - [ ] Avoid manipulative confirm-shaming copy on decline buttons.
  - [ ] Clear customer support email and cancellation policy displayed on confirmation screen.

---

## Part 5: Pre-Launch QA & Validation Protocol

- [ ] **9. End-to-End Functional Test**
  - [ ] Placed test order using desktop browser -> Verified interstitial appears post-payment -> Clicked 1-Click Buy -> Verified token charged and order updated.
  - [ ] Placed test order on mobile iOS Safari -> Verified touch layout, button sizing, and instant decline path work cleanly.
  - [ ] Placed test order on mobile Android Chrome -> Verified responsive viewports.
  - [ ] Verified decline path leads directly to clean Order Confirmation Page with no extra popups.
  - [ ] Inspected WMS / Shopify admin / Stripe logs to confirm single order ID, single shipment label, and correct subtotal/tax/shipping calculations.

---

## Post-Launch Scorecard

| Metric | Target Goal | Actual Result | Status (Pass/Fail) |
| :--- | :--- | :--- | :--- |
| **Post-Purchase Take Rate** | 5.0% – 15.0% | | |
| **AOV Lift** | +4.0% – +12.0% | | |
| **Checkout Abandonment Change** | 0.0% (No impact) | | |
| **Support Ticket Increase** | < 0.2% change | | |
| **Order Merging Success Rate** | 100% | | |
