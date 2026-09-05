# Pre-Order & Backorder Optimization Audit Checklist & UI Spec Template

This checklist and spec template provides a structured audit process for evaluating, designing, and optimizing pre-order and backorder flows across Product Detail Pages (PDPs), cart drawers, checkouts, and post-purchase communications.

---

## Part 1: Pre-Order Audit Checklist

### Section 1: Delivery Timeline Transparency & Date Framing
- [ ] **Specific Shipping Date Window:** Does the PDP state a bounded 10-to-14-day expected dispatch window (e.g., *"Ships Oct 15 – Oct 25"*) rather than vague text (*"Ships Soon"*, *"Fall 2024"*)?
- [ ] **Prominent Location:** Is the delivery window badge placed inside the primary PDP buy box above or directly adjacent to the main CTA button?
- [ ] **Batch Allocation Indicator:** If launching in production batches, is the current batch number (e.g., *"Batch #1"*) and allocation percentage/remaining units clearly displayed?
- [ ] **Variant-Level Specificity:** If only certain variants (e.g., Size M, Black) are pre-order while others are in-stock, does the delivery badge update dynamically when switching variants?
- [ ] **Safety Buffer Verified:** Has a 14-day logistics buffer been added to factory/freight arrival estimates to prevent missed shipping deadlines?

### Section 2: Payment Structure & Disclosures
- [ ] **Explicit Payment Timing:** Is payment timing (Charged Today vs. Charged on Shipment vs. Partial Deposit) clearly stated next to or below the primary CTA button?
- [ ] **Price Lock Guarantee:** Is a price-protection or early-bird launch discount badge highlighted to incentivize pre-ordering today?
- [ ] **Deposit Terms Breakdown (If Applicable):** If using a partial deposit model, is the exact dollar amount due today and remaining amount due at shipment broken down visually?
- [ ] **Checkout Summary Disclosure:** Does the final checkout payment step reiterate payment terms and expected fulfillment date range before payment submission?

### Section 3: Cart Drawer & Mixed Cart UX
- [ ] **Line-Item Badge:** Are pre-order items tagged with a prominent **[PRE-ORDER]** or **[BACKORDER]** label in cart drawer line-item titles?
- [ ] **Expected Delivery Window in Cart:** Is the expected delivery window visible next to the product thumbnail in the cart drawer?
- [ ] **Mixed-Cart Split Shipping Option:** If the cart contains both in-stock and pre-order items, does the cart drawer allow the buyer to choose between split shipping or single bundled delivery?
- [ ] **1-Click Quantity Adjustments:** Can buyers modify or remove pre-order items from the cart drawer without breaking line-item pre-order tags?

### Section 4: Risk Reversal & Cancellation Policies
- [ ] **"Cancel Anytime" Guarantee:** Is microcopy stating *"Cancel anytime in 1 click before shipment for a 100% full refund"* displayed adjacent to the CTA?
- [ ] **Self-Serve Portal Access:** Can buyers access a self-serve portal link in confirmation emails to cancel or change shipping addresses without emailing customer support?
- [ ] **FTC 30-Day Rule Compliance:** Is an automated mechanism configured to notify buyers and request consent if shipping delays exceed 30 days beyond the promised date?
- [ ] **Processor Risk Compliance:** Are overall pre-order cancellation rates kept under 8% and chargebacks under 0.25% through proactive communication?

### Section 5: Post-Purchase Status Communications
- [ ] **Immediate Order Confirmation:** Does the instant confirmation email clearly display pre-order status, payment terms, and expected delivery dates?
- [ ] **Automated Milestone Updates:** Are automated email/SMS updates scheduled for manufacturing completion, customs transit, and warehouse intake?
- [ ] **Address Verification Nudge:** Is an automated email sent 7 days prior to dispatch asking buyers to confirm their shipping address before labels are generated?

---

## Part 2: Pre-Order PDP UI Specification Template

Use this markup and microcopy specification when building or modifying pre-order PDP buy boxes.

```html
<!-- PRE-ORDER PDP BUY BOX CONTAINER -->
<div class="pdp-preorder-buybox" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; background-color: #fafafa;">

  <!-- 1. DELIVERY WINDOW BADGE -->
  <div class="preorder-delivery-badge" style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #1e3a8a; margin-bottom: 12px;">
    <span class="badge-icon">📦</span>
    <span>Pre-Order Guarantee: Expected Dispatch Oct 15 – Oct 25</span>
  </div>

  <!-- 2. BATCH ALLOCATION PROGRESS METER -->
  <div class="preorder-allocation-meter" style="margin-bottom: 16px;">
    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; margin-bottom: 4px;">
      <span>Batch #1 Allocation</span>
      <span style="color: #dc2626; font-weight: 600;">82% Reserved (Only 18 spots left)</span>
    </div>
    <div class="progress-bar-track" style="width: 100%; height: 8px; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
      <div class="progress-bar-fill" style="width: 82%; height: 100%; background-color: #2563eb;"></div>
    </div>
  </div>

  <!-- 3. PRIMARY PRE-ORDER CTA BUTTON -->
  <button type="submit" class="preorder-cta-button" style="width: 100%; padding: 14px 20px; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 700; border: none; border-radius: 6px; cursor: pointer;">
    Reserve Batch #1 — Ships Oct 15
  </button>

  <!-- 4. TRANSPARENT PAYMENT DISCLOSURE -->
  <div class="preorder-payment-notice" style="text-align: center; font-size: 12px; color: #4b5563; margin-top: 8px;">
    🔒 Full payment charged today. Price-lock launch discount applied.
  </div>

  <!-- 5. RISK REVERSAL & TRUST BULLETS -->
  <ul class="preorder-trust-bullets" style="margin-top: 16px; padding-left: 0; list-style: none; font-size: 13px; color: #374151; display: flex; flex-direction: column; gap: 6px;">
    <li style="display: flex; align-items: center; gap: 6px;">
      <span style="color: #16a34a;">✓</span>
      <span><strong>Cancel Anytime:</strong> 100% full refund in 1 click prior to shipment dispatch.</span>
    </li>
    <li style="display: flex; align-items: center; gap: 6px;">
      <span style="color: #16a34a;">✓</span>
      <span><strong>Production Updates:</strong> Bi-weekly manufacturing progress reports via email.</span>
    </li>
    <li style="display: flex; align-items: center; gap: 6px;">
      <span style="color: #16a34a;">✓</span>
      <span><strong>Price Guarantee:</strong> Locks in early-bird price protection.</span>
    </li>
  </ul>

</div>
```

---

## Part 3: Cart Drawer Line-Item Spec

```html
<!-- CART DRAWER PRE-ORDER LINE ITEM -->
<div class="cart-line-item preorder-item" style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
  <img src="product-thumb.jpg" alt="Apex Wireless Pro" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px;">

  <div class="line-item-details" style="flex: 1;">
    <div style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-bottom: 4px;">
      PRE-ORDER BATCH #1
    </div>
    <div style="font-weight: 600; font-size: 14px;">Apex Wireless Pro Headphones</div>
    <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">
      📦 Expected Dispatch: Oct 15 – Oct 25
    </div>
    <div style="font-weight: 700; font-size: 14px; margin-top: 4px;">$254.00</div>
  </div>
</div>
```

---

## Part 4: Scoring & Decision Matrix

| Total Checked Checklist Items | Audit Score | Recommended Action Plan |
| :--- | :--- | :--- |
| **16 – 18 Items** | 🟢 **Optimal (Low Risk)** | Pre-order architecture is robust. Proceed with launch and monitor A/B test conversion. |
| **11 – 15 Items** | 🟡 **Moderate Friction** | High risk of support ticket volume and cancellations. Add explicit 10-day date windows and 1-click cancellation guarantees. |
| **< 11 Items** | 🔴 **Severe Friction (High Risk)** | **Halt pre-order campaign.** Vague dates or hidden charges will trigger chargebacks and merchant processor flags. Implement PDP UI spec immediately. |
