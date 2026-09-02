# Gift UX & Fulfillment Heuristics Reference

This reference guide details consumer psychology heuristics, UI/UX interaction standards, character limit guidelines, and warehouse fulfillment protocol specifications for gift wrapping and messaging optimization.

---

## 1. Consumer Psychology of Gift Giving

Gift givers operate under fundamentally different cognitive and emotional states than self-purchasers:

### A. The Dual Anxieties
1. **Price Tag Anxiety (The Faux Pas Fear):**
   - *Psychological Trigger:* The giver fears the recipient seeing how much (or how little) was spent, causing social embarrassment.
   - *UX Requirement:* Givers need explicit, high-contrast, written guarantees that prices will be removed. Microcopy must state: *"Price-blind shipping guaranteed. No invoices or prices will be included in the box."*
2. **Presentation Anxiety (The Unboxing Fear):**
   - *Psychological Trigger:* The giver fears the gift arriving as a cold, utilitarian brown box filled with plastic packing peanuts and a crumpled packing slip.
   - *UX Requirement:* High-resolution visual imagery showing the closed gift box, ribbon texture, and open card presentation builds confidence that the unboxing experience will reflect care and elegance.

### B. Willingness to Pay for Convenience
- Gift givers exhibit significantly lower price sensitivity for packaging add-ons compared to product price discounts.
- A $5.00 to $8.00 gift wrap add-on represents a minimal fraction of a $100+ order while saving the giver 30+ minutes of manual wrapping, driving an average 70–80% gross margin on packaging add-ons.

---

## 2. Character Limits & Card Typography Guidelines

Printed gift cards have physical spatial constraints. Allowing unlimited text in online input fields leads to severe warehouse print errors.

### Standard 4x6 Inch Gift Card Layout
- **Dimensions:** 4 inches x 6 inches (101.6 mm x 152.4 mm)
- **Printable Area:** 3.5 inches x 5.5 inches (margins: 0.25 in / 6.35 mm)
- **Optimal Font Size:** 11 pt to 13 pt (serif or clean script font e.g., Georgia, Playfair, or Snell Roundhand)
- **Maximum Character Count:** **250 to 300 characters** (including spaces).
- **Line Count Limit:** Maximum 8 to 10 lines of text.

### Character Counter UX Rule
- Provide a real-time character counter directly below the textarea field:
  ```
  [214 / 250 characters]
  ```
- Soft warning at 225 characters (change text color to subtle amber).
- Hard stop at 250 characters (prevent further typing).

### Unicode & Emoji Sanitization Protocol
- Warehouse thermal card printers (Zebra, TSC, DYMO) frequently lack UTF-8 Unicode glyph rendering for modern emojis (`🎂`, `❤️`, `🎁`), resulting in corrupted printed output like `??` or `□□`.
- **UI Prevention Options:**
  1. *Sanitization Regex:* Automatically sanitize or strip emoji characters on backend order processing, replacing them with standard text equivalents or notifying the user in the UI: *"Please use plain text characters; emojis cannot be printed on physical cards."*
  2. *TrueType Vector Printing:* Route gift card printing to standard PDF rasterization pipelines (using thermal printers with bitmap font rendering) to ensure crisp emoji output.

---

## 3. Order Metadata Schemas & WMS Payloads

To ensure price-blind fulfillment and card generation, cart and checkout scripts must attach structured order attributes to the backend checkout engine (e.g., Shopify `note_attributes`, BigCommerce custom fields, WooCommerce order meta, or custom REST APIs).

### Standard JSON Order Payload Schema

```json
{
  "order_id": "ORD-98421",
  "is_gift_order": true,
  "hide_prices_on_packing_slip": true,
  "gift_options": {
    "gift_message": "Happy 30th Birthday Alex! Wishing you an incredible year ahead. With all my love, Taylor.",
    "wrap_type_sku": "GW-NAVY-BOX-01",
    "wrap_type_title": "Signature Navy Gift Box",
    "wrap_fee_charged": 6.00,
    "recipient_name": "Alex Smith"
  }
}
```

### WMS Packing Station Rule Logic
1. **If `is_gift_order == true` OR `hide_prices_on_packing_slip == true`:**
   - Set packing slip template = `TEMPLATE_PRICE_BLIND_PACKING_SLIP`.
   - Omit columns: `Unit Price`, `Extended Price`, `Order Subtotal`, `Tax`, `Shipping Cost`, `Total Paid`.
   - Retain columns: `SKU`, `Item Description`, `Quantity Ordered`, `Quantity Shipped`.
2. **If `gift_message` IS NOT NULL:**
   - Trigger print job to `PRINTER_GREETING_CARD_01`.
   - Render `gift_message` centered inside card border template with `recipient_name`.

---

## 4. Mobile Ergonomics and Accessibility Rules

- **Touch Target Dimensions:** All gift option checkboxes, radio buttons, and expand/collapse triggers must have minimum touch targets of **44x44 CSS pixels**.
- **Keyboard & Screen Reader Accessibility:**
  - Expandable gift widgets must use proper ARIA attributes: `aria-expanded="true|false"` and `aria-controls="gift-options-drawer"`.
  - The gift message textarea must have a distinct, programmatic `<label for="gift-message-input">Gift Message (Optional)</label>`.
- **Viewport Scroll Management:** Expanding the gift widget in a mobile cart drawer must not jump scroll focus or push the primary "Proceed to Checkout" button off-screen without smooth scrolling.
