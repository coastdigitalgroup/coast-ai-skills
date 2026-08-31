# Before & After: Express Checkout Optimization

## Scenario Background

**Store:** *AeroGear Supply Co.* — an e-commerce brand selling technical outdoor apparel and accessories.
**Traffic Split:** 72% Mobile (iOS Safari & Android Chrome), 28% Desktop.
**Baseline Problem:**
Despite driving high-intent paid traffic from Instagram and Google Shopping to product detail pages (PDPs), AeroGear experienced a severe drop-off between cart creation and order completion on mobile devices.

### Baseline Metrics (Pre-Optimization)
- **Mobile Traffic Share:** 72%
- **Mobile Checkout Conversion Rate:** 1.42%
- **Mobile Cart-to-Checkout Drop-off:** 68.5%
- **Average Mobile Checkout Duration:** 148 seconds
- **Express Payment Share of Orders:** 8.2% (only standard PayPal link on last checkout step)

---

## BEFORE: Unoptimized Checkout Flow

### 1. Product Detail Page (PDP)
- Primary CTA: Large "Add to Cart" button.
- No express payment options shown on the PDP.
- Users had to add item to cart, wait for page redirect, open cart, and navigate through 3 checkout steps.

```text
[ Product Image: AeroGear Technical Shell ]
Price: $240.00
Variant: Medium / Black

[   ADD TO CART   ]  <-- Single primary button

[ Description Tabs ]
```

### 2. Cart Drawer
- Showed items, subtotal, and a single black button: `PROCEED TO CHECKOUT`.
- Express wallets (Apple Pay / Google Pay / Shop Pay) were completely absent from the cart drawer.

```text
┌──────────────────────────────────────────┐
│ Your Cart (1 Item)                     X │
├──────────────────────────────────────────┤
│ AeroGear Technical Shell                 │
│ Size: M | Color: Black                   │
│ $240.00                                  │
│                                          │
│ Subtotal: $240.00                        │
│ Taxes & shipping calculated at checkout  │
│                                          │
│ [      PROCEED TO CHECKOUT      ]        │
└──────────────────────────────────────────┘
```

### 3. Checkout Funnel (Multi-Step Form)
- Users were forced to complete 11 manual form fields: Email, First Name, Last Name, Address, Apartment, City, Country, State, ZIP, Phone, Credit Card Number, Expiry, CVV.
- Express payment options were buried on Step 3 (Payment Step), below traditional credit card fields, behind a small "More options" accordion.

---

## AFTER: Optimized Express Checkout Flow

### Key Optimizations Applied

1. **PDP Dynamic Express Payment Button:**
   - Implemented dynamic express checkout button below "Add to Cart".
   - Browser capability detection dynamically renders **Apple Pay** on iOS/Safari, **Google Pay** on Chrome/Android, or **Shop Pay** as default.
   - Distinct secondary visual framing to avoid overwhelming the primary CTA.

2. **Cart Drawer Express Accelerator Header:**
   - Added an express checkout action block at the top of the mobile cart drawer.
   - Introduced clear divider visual: `── OR FAST CHECKOUT WITH ──`.
   - Formatted express payment buttons as full-width 50px high touch targets.

3. **Checkout Step 1 Top-Anchored Express Block:**
   - Repositioned express payment buttons to the absolute top of Checkout Step 1.
   - Auto-filled contact, shipping address, and payment method directly from device wallet payloads upon user authorization.
   - Real-time address callback enabled instant shipping method selection directly within the native Apple Pay / Shop Pay sheet.

4. **Promo Code Pre-Syncing:**
   - Enabled discount input on the cart drawer that automatically passes applied coupon codes directly into the express wallet payload.

---

### AFTER Layouts

#### Product Detail Page (PDP) with Express Option
```text
[ Product Image: AeroGear Technical Shell ]
Price: $240.00
Variant: Medium / Black

[       ADD TO CART       ]  (Secondary outline style)

[  Pay Buy with Apple Pay ]  (Primary solid black, 52px target)
   - or -
[       Buy with Shop     ]  (Rendered on non-Apple mobile devices)
```

#### Cart Drawer with Express Accelerator
```text
┌──────────────────────────────────────────┐
│ Your Cart (1 Item)                     X │
├──────────────────────────────────────────┤
│ AeroGear Technical Shell                 │
│ Size: M | Color: Black                   │
│ $240.00                                  │
│                                          │
│ Promo Code: [ SUMMER20 ] [ Apply ]       │
│ Subtotal: $240.00                        │
│ Discount (20%): -$48.00                  │
│ Total: $192.00                           │
│                                          │
│ [  Pay Express Checkout with Apple Pay ] │
│ [      Pay with Shop Pay / Google Pay  ] │
│                                          │
│ ─────── OR CONTINUE TO MANUAL CHECKOUT ─────── │
│                                          │
│ [      PROCEED TO STANDARD CHECKOUT     ] │
└──────────────────────────────────────────┘
```

---

## Results & Measurable Impact

After running a 30-day split test (50/50 traffic allocation across 120,000 unique mobile visitors):

| Metric | Before (Control) | After (Optimized) | Absolute / Relative Delta |
| :--- | :--- | :--- | :--- |
| **Mobile Checkout Conversion Rate** | 1.42% | 1.84% | **+0.42% (+29.5% relative lift)** |
| **Mobile Cart-to-Checkout Drop-off** | 68.5% | 49.2% | **-19.3% reduction in drop-off** |
| **Average Checkout Completion Duration** | 148 seconds | 26 seconds | **122 seconds faster (-82.4%)** |
| **Express Wallet Share of Mobile Orders**| 8.2% | 48.6% | **+40.4% increase in wallet usage** |
| **Mobile Revenue (30-Day Period)** | $118,400 | $153,300 | **+$34,900 incremental revenue** |
| **Failed Transaction Rate (Address/Declines)** | 3.8% | 1.1% | **-2.7% drop in transaction errors** |

### Key Takeaways

1. **Eliminating Form Fatigue:** Bypassing 11 form fields using device-native Apple Pay and Shop Pay eliminated the single largest drop-off point in the mobile funnel.
2. **Contextual Wallet Targeting:** Rendering Apple Pay exclusively on iOS and Google Pay/Shop Pay on Android prevented clutter and eliminated broken button clicks.
3. **Cart Drawer Velocity:** Placing express buttons directly inside the cart drawer enabled 38% of converting buyers to complete their order without ever visiting the standard multi-step checkout form.
