# Shopping Cart UX Heuristics, Accessibility & Spatial Design Reference

This reference manual documents the accessibility standards, design metrics, and behavioral heuristics required to implement a world-class shopping cart system that conforms to WCAG 2.1 AA.

---

## 1. WAI-ARIA Role Mappings & Attributes

To ensure screen readers can accurately interpret the cart layout, utilize the following mappings:

| Component | HTML Element | ARIA Attributes | Accessibility Purpose |
| :--- | :--- | :--- | :--- |
| **Drawer Container** | `<section>` or `<div>` | `role="dialog"`<br>`aria-modal="true"`<br>`aria-labelledby="[id]"` | Declares the sliding drawer as a modal dialog, letting assistive tech know content outside is inert. |
| **Close Button** | `<button>` | `aria-label="Close Shopping Cart Drawer"` | Provides a text name for a purely visual graphical icon (✕). |
| **Fulfillment progress bar** | `<div>` | `role="progressbar"`<br>`aria-valuemin="0"`<br>`aria-valuemax="100"`<br>`aria-valuenow="[75]"`<br>`aria-describedby="[msg-id]"` | Standardizes progress announcement, mapping percent and linking description context. |
| **Quantity Input** | `<input type="number">` | `aria-label="[Item Name] quantity"` | Directly correlates the standalone text box with its product context. |
| **Delete Button** | `<button>` | `aria-label="Remove [Item Name] from cart"` | Ensures the action is completely clear and distinguished from other rows. |
| **Live Updates Area** | `<div>` | `aria-live="polite"`<br>`class="sr-only"` | Announces dynamic updates (pricing, item removal) politely without disrupting current navigation. |

---

## 2. Keyboard Navigation Protocols (The "Focus-Flow" Matrix)

An accessible cart must be 100% operable via a keyboard using standard key strokes:

### Drawer Opened (Activation)
1. **Focus Trap Initiation:** Instantly move focus to the first focusable element inside the drawer—either the Close Button (✕) or the first item title.
2. **Tab Key Progression (`Tab`):** Traverses sequentially:
   `Close Button` -> `Fulfillment Links` -> `Line Item Titles` -> `Quantity Buttons (- / +)` -> `Remove Buttons` -> `Promo Inputs` -> `Checkout CTA`.
3. **Shift-Tab Backward (`Shift + Tab`):** Sequentially traverses backward. Focus must loop from the Close Button back to the primary Checkout CTA if tabbing backward.
4. **The Escape Key Escape Route (`Esc`):** Pressing the Escape key must instantly close the drawer and return focus cleanly back to the header Cart Trigger button that activated it.

### Quantity Adjustment Buttons
- **Space or Enter (`Space` / `Enter`):** Triggers the decrement or increment action.
- **Dynamic Live Announcement:** Triggers the `aria-live` polite region to announce: "Quantity updated. Subtotal is now [Amount]."

---

## 3. Spatial Typography Scale & Grid Rhythm

Maintain a clean visual rhythm in dense cart layouts using these standardized tokens:

### Spacing Guidelines (Fluid Scale)
- **Outer Row Padding:** `16px` on mobile, `24px` on desktop (`var(--space-m)` / `var(--space-l)`). Keep content inset cleanly.
- **Line-Item Row Gap:** `16px` gap between the product thumbnail and metadata text column.
- **Vertical Stack Gap:** `8px` or `12px` between product titles, attributes, and stepper rows.

### Typography Scale
- **Header Title:** `1.25rem` / `20px` bold. Tells the user exactly where they are.
- **Line-Item Product Title:** `0.875rem` / `14px` up to `1rem` / `16px` medium. Links should have hover underline decoration.
- **Line-Item Variant Details:** `0.75rem` / `12px` regular with muted gray text.
- **Line-Item Pricing:** `0.875rem` / `14px` bold. Sale prices are emphasized with a color change (sale red) and larger font weight, while original MSRP is `12px` grey and strikethrough.
- **Subtotal & Total Row:** Labels are `14px` medium, but the Final Estimated Total is `1.125rem` / `18px` up to `1.25rem` / `20px` extra-bold.

---

## 4. E-Commerce Behavioral Heuristics & Conversion Boosters

Optimize the checkout conversion rate using these key human-centered heuristics:

- **The End-of-Funnel Reassurance Nudge:**
  Place explicit micro-copy directly below the Checkout button: *"✓ 100% Secure Checkout"*, *"✓ Free 30-day returns"*, or *"✓ Pay in interest-free installments with Klarna"*. This reduces "buyer remorse" and checkout friction at the most intense psychological moment.
- **Frictionless In-Cart Promo Codes:**
  Do not hide the discount code container behind complex menus, but make the apply action simple. If the user applies a code, instantly render the savings in a success green color and provide a highly visible "Remove" trigger `[x]` next to it so they feel in control.
- **The Non-Disruptive "Complete Your Look" Cross-Sell:**
  Recommend low-friction, high-value add-ons (under $20, e.g., socks, protective cases, cleaning kits) directly in the cart drawer. Enable a single-tap "Add to Cart" button within the recommendations. Ensure adding a cross-sell product is done via AJAX, instantly updating totals and shipping bars without reloading the page or closing the drawer.
- **The Immediate Cart Recovery Trigger:**
  If a user has items in their cart and attempts to leave, retain the cart state in LocalStorage (`client-side-storage-management`) for at least 14 days. When they return, display a subtle notification bubble on the Cart header icon to remind them of their pending items.
