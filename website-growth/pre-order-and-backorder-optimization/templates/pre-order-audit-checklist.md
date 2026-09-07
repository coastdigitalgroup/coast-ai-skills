# Pre-Order and Backorder Optimization Audit Checklist

Use this actionable, step-by-step audit template to diagnose friction, trust deficits, compliance risks, and conversion leaks across pre-order, backorder, and made-to-order purchase journeys.

---

## 1. Supply Chain & Payment Processing Configuration

- [ ] **Order Classification Defined**: Is the product clearly categorized as a Pre-Order (unreleased launch), Backorder (temporary restock), or Made-to-Order SKU?
- [ ] **Payment Capture Mode Optimized**:
  - [ ] For lead times < 30 days: Is deferred capture ("Pay when order ships") enabled via credit card vaulting/tokenization?
  - [ ] For lead times > 30 days or custom items: Is full payment or deposit collection communicated with clear terms?
- [ ] **Inventory Allocation Caps Set**: Are pre-order inventory buffers configured in the ERP/commerce platform to prevent over-selling beyond confirmed factory output?
- [ ] **FTC 30-Day Rule Compliance**: Is a tracking system in place to issue automated opt-in delay notices and refund offerings if estimated ship dates slip by > 30 days?

---

## 2. Product Detail Page (PDP) UX & Hierarchy

- [ ] **Primary CTA Messaging**: Does the main action button explicitly state pre-order/backorder status and shipping date? (e.g., `Pre-Order Now — Ships Nov 10` instead of generic `Add to Cart` or `Buy`).
- [ ] **Status Badge Visibility**: Is a high-contrast badge or pill element placed near the product title/price indicating current batch status? (e.g., `[Batch 2 Reserve] Est. Delivery Nov 12–18`).
- [ ] **Payment Schedule Transparency**: Is there clear subtext placed immediately below the CTA detailing payment terms?
  - *Pay Later*: "Card authorized today, charged $X when item dispatches."
  - *Pay Now*: "Card charged today to lock in your guaranteed launch allocation."
- [ ] **Production / Fulfillment Progress Visual**: For items with lead times > 21 days, is a visual milestone timeline widget displayed? (e.g., `Design -> Manufacturing -> In Transit -> Delivery`).
- [ ] **Fulfillment Guarantee Box**: Is a high-trust reassurance block present highlighting:
  - Estimated dispatch window
  - Price lock guarantee
  - Hassle-free 1-click cancellation policy before dispatch

---

## 3. Cart Drawer & Checkout Experience

- [ ] **Cart Item Badging**: Is every pre-order or backorder item in the cart drawer tagged with an explicit `[PRE-ORDER]` or `[BACKORDER]` pill badge?
- [ ] **Ship Date Persistence**: Is the estimated delivery timeline clearly stated next to the item name in the cart summary?
- [ ] **Mixed-Cart Handling Rules**: If the cart contains both in-stock and pre-order items:
  - [ ] Is an option provided for split shipments (e.g., "Ship in-stock items now")?
  - [ ] If shipping consolidated, is an explicit banner displayed: *"Entire order will ship on [Date] when pre-order item arrives"*?
- [ ] **Checkout Disclosure**: Does the final order review step display an explicit agreement text or consent box regarding pre-order delivery windows?
- [ ] **Express Payment Alignment**: Do Apple Pay, Google Pay, or Shop Pay modal sheets display pre-order status and shipping timeframe before payment approval?

---

## 4. Post-Purchase Communications & Lifecycle

- [ ] **Transactional Receipt Clarity**: Does the order confirmation email prominent feature:
  - Clear `[Pre-Order Summary]` block
  - Estimated dispatch date window
  - Link to the self-serve Order Portal
- [ ] **Automated Milestone Updates**: Are bi-weekly or stage-based progress emails configured (e.g., Factory production complete -> Vessel departure -> Warehouse arrival)?
- [ ] **Self-Service Order Management**:
  - [ ] Can customers update their shipping address self-serve prior to dispatch?
  - [ ] Can customers cancel their pre-order with a single click before warehouse processing?
- [ ] **Pre-Charge Notification**: If using deferred payment, is an automated email/SMS sent 24–48 hours before charging the vaulted card?

---

## Audit Scoring & Action Plan Matrix

| Score Category | Findings & Identified Gaps | Priority (High/Med/Low) | Target Resolution Date |
| :--- | :--- | :--- | :--- |
| **PDP Hierarchy** | | | |
| **Payment Model** | | | |
| **Cart & Mixed Orders** | | | |
| **Post-Purchase Lifecycle** | | | |
