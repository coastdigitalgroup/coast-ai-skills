# Gift Wrapping and Messaging Audit Checklist

Use this actionable checklist to audit and optimize an e-commerce website's gifting UX, price suppression capabilities, and fulfillment workflows across Product Detail Pages (PDP), Cart Drawer, Checkout, and Warehouse Operations.

---

## 1. Product Detail Page (PDP) Gifting Indicators

- [ ] **Gifting Availability Callout:** Is there a clear visual indicator or micro-badge on PDPs for giftable items (e.g., `🎁 Ships in gift-ready packaging`)?
- [ ] **Packaging Preview Modal:** Can customers click to view high-resolution photos of the actual gift box, ribbon, or wrapping paper before adding to cart?
- [ ] **Size & Dimensional Compatibility:** Is it clearly stated if certain large or oversized items are *excluded* from gift wrapping options?
- [ ] **PDP Add-on Toggle (Optional):** For dedicated luxury/gifting brands, can gift wrapping be selected directly on the PDP alongside product variant selection?

---

## 2. Cart Drawer / Cart Page Gifting Mechanics

- [ ] **Prominent Placement:** Is the gift options widget positioned above the Cart Subtotal line in the main cart drawer (not buried below scroll)?
- [ ] **Un-collapsed / High-Visibility Trigger:** Is the trigger clearly labeled (e.g., `[🎁 Adding a gift? Add a free note or premium gift wrap]`)?
- [ ] **Price Suppression Pre-Check:** Is the checkbox `[X] Hide prices on packing slip` automatically selected when any gift option or note is entered?
- [ ] **Price-Blind Reassurance Microcopy:** Does the UI explicitly reassure givers: *"Don't worry—prices are never displayed on gift packing slips"*?
- [ ] **Gift Note Textarea & Character Counter:** Is there a clean `<textarea>` input for custom gift messages with a real-time character counter (e.g., `0 / 250 characters`)?
- [ ] **Emoji Sanitization / Handling:** Does the gift note field clearly inform users about special character restrictions if warehouse printers do not support unicode emojis?
- [ ] **Visual Packaging Tiles:** Are gift wrap options displayed as visual radio tiles with photos, titles, and prices (e.g., *Signature Navy Box - $6.00*) rather than plain text dropdowns?
- [ ] **Dynamic Subtotal Recalculation:** Does selecting paid gift wrapping instantly add the item to the cart subtotal without requiring a full page refresh?
- [ ] **Item-Level vs. Order-Level Clarity:** Is it crystal clear to the buyer whether the gift wrap applies to individual items or the entire package?

---

## 3. Checkout & Express Checkout Fallback

- [ ] **Express Checkout Fallback:** If a customer uses Apple Pay / Shop Pay / Google Pay directly from the cart, are gift attributes and price-suppression flags accurately passed through to the order payload?
- [ ] **Checkout Review Step Indicator:** Does the final order summary in checkout display a badge or line item confirming: `Gift Note Added` and `Prices Hidden on Packing Slip`?
- [ ] **Secondary Gift Option Trigger:** Is there a fallback "Is this a gift?" link on the checkout payment page for shoppers who bypassed the cart drawer?

---

## 4. Fulfillment, WMS, & Price-Blind Execution

- [ ] **Order Attribute Mapping:** Are custom attributes (`IsGiftOrder`, `HidePricesOnPackingSlip`, `GiftMessage`, `GiftWrapType`) mapped to structured JSON/metafield order attributes in the backend?
- [ ] **WMS Packing Slip Rules:** Does the WMS automatically suppress Unit Price, Subtotal, Tax, and Total fields whenever `HidePricesOnPackingSlip == true`?
- [ ] **Dedicated Note Card Printing:** Are gift notes formatted cleanly on a dedicated 4x6 greeting card or printed in a dedicated high-visibility box on the packing slip?
- [ ] **Font Overflow Verification:** Is the printed card layout tested against the maximum allowed character count (250–300 chars) to prevent line clipping or text cutoff?
- [ ] **Packaging Inventory Sync:** Is physical gift box/wrapping paper inventory tracked in the ERP/inventory management system to prevent overselling during holiday surges?

---

## 5. Post-Purchase & Customer Support

- [ ] **Order Confirmation Email:** Does the customer's order confirmation email display the gift note and confirmation of price-blind shipping without revealing prices in recipient notifications?
- [ ] **Support Escalation Protocols:** Are customer service representatives equipped with a protocol to quickly edit or update gift messages prior to warehouse fulfillment?
- [ ] **Return Policy Clarity:** Is there clear microcopy detailing how recipient returns or gift exchanges work without disclosing original purchase prices to the recipient?
