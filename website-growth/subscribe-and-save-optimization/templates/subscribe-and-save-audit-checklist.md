# Subscribe & Save Optimization Audit Checklist

Use this checklist to systematically audit, remediate, and verify the Subscribe & Save experience on e-commerce product detail pages (PDPs) and cart drawers.

---

## 1. Value Proposition & Discount Framing

- [ ] **Explicit Percentage & Dollar Savings:** Does the Subscribe & Save selector explicitly show both percentage discount AND dollar savings (e.g., `Save 20% ($11.60 OFF)`)?
- [ ] **Strikethrough Pricing:** Is original retail price shown with a strikethrough (e.g., `~~$58.00~~ $46.40`) immediately adjacent to the subscription price?
- [ ] **Perk Stacking:** Are subscription-exclusive perks (e.g., *Free Shipping*, *Price Lock Guarantee*, *Free Gift on 1st Order*) listed clearly inside the subscription card?
- [ ] **Unit Price / Per-Serving Price:** For consumable products, is unit pricing displayed (e.g., `$1.54 / serving` vs `$1.93 / serving`) to highlight daily savings?
- [ ] **Discount Threshold Check:** Is the recurring discount at least 10% (ideally 15%–20%) to create meaningful motivation over one-time purchase?

---

## 2. PDP Buy Box Visual Hierarchy & Microcopy

- [ ] **Two-Card Stacked Option Architecture:** Are "Subscribe & Save" and "One-Time Purchase" formatted as clean, interactive card containers rather than bare unstyled radio buttons?
- [ ] **Visual Distinction for Subscription:** Is the Subscribe & Save card visually emphasized with a distinct border color, light background fill, or accent badge (e.g., "MOST POPULAR" or "BEST VALUE")?
- [ ] **Default State Logic:** Is "Subscribe & Save" pre-selected *only* if the discount is $\ge 15\%$ and risk-reversal microcopy is clearly visible?
- [ ] **Dynamic CTA Button State:** Does clicking between "One-Time" and "Subscribe & Save" immediately update the main CTA button text to state the purchase type and total (e.g., `SUBSCRIBE & SAVE — $46.40 / MONTH`)?
- [ ] **Accessible Selector States:** Do checked/unchecked states satisfy WCAG 2.2 color contrast ratios ($\ge 4.5:1$) and include explicit keyboard focus rings?

---

## 3. Delivery Frequency & Customization Ergonomics

- [ ] **Inline Frequency Selector:** Is the delivery frequency dropdown or pill selector rendered directly inside the Subscribe & Save card without requiring secondary modal clicks?
- [ ] **Usage-Anchored Options:** Are frequency options paired with human usage context (e.g., `30 Days (Daily Use)`, `60 Days (Alternate Days)`)?
- [ ] **Logical Frequency Pre-Selection:** Is the default frequency matched to average product replenishment cycles (e.g., 30 days for 30-day supplies)?
- [ ] **3-Option Maximum Rule:** Are visible frequency options limited to 3 choices (e.g., 30, 60, 90 days) to prevent decision paralysis?
- [ ] **Easy Post-Purchase Adjustments:** Is it made clear that frequency can be adjusted at any time post-purchase inside the portal?

---

## 4. Risk Reversal & Trust Signals

- [ ] **Cancellation & Flexibility Guarantee:** Is reassurance microcopy placed directly near the main CTA (e.g., `✓ Cancel, pause, or skip anytime in 1 click`)?
- [ ] **Pre-Shipment Notification Guarantee:** Does copy explicitly promise pre-shipment notice (e.g., `SMS or email reminder sent 3 days before every renewal`)?
- [ ] **No Hidden Minimums:** Are any commitment requirements (e.g., "Cancel after 1st renewal") disclosed transparently without fine print traps?
- [ ] **Self-Serve Portal Confirmation:** Is it stated that subscribers manage their own account online without calling customer support?

---

## 5. Cart Drawer & Checkout Upgrade Mechanics

- [ ] **Inline Cart Drawer Upgrade:** Does the cart drawer render a 1-click "Upgrade to Subscribe & Save" toggle for any one-time items?
- [ ] **Cart Savings Real-Time Update:** Does upgrading in the cart drawer instantly recalculate subtotal and apply free shipping without a full page refresh?
- [ ] **Cart Items Line Representation:** Are subscription items clearly identified in the cart with recurring badges and interval labels (e.g., `Delivered Every 30 Days`)?
- [ ] **No Default Forced Upgrades:** Is the cart upgrade optional rather than retroactively converting one-time items without consent?

---

## 6. Mobile Ergonomics & Viewport Alignment

- [ ] **Viewport Fit ($<480\text{px}$):** Does the entire Buy Box selector fit within the mobile screen without pushing the main CTA button far below the fold?
- [ ] **Touch Target Size:** Are radio cards, frequency dropdowns, and pill buttons at least $44\times44\text{px}$ for easy thumb interaction?
- [ ] **Sticky Add-to-Cart Synchronization:** Does the sticky mobile bottom bar dynamically update its price and copy when switching between One-Time and Subscription?
- [ ] **Zero Layout Shift (CLS):** Does expanding/selecting frequency options preserve container dimensions without causing sudden layout shifts?

---

## Scoring & Action Plan

- **30–35 Items Passed:** **Optimum Subscription Machine.** High subscription mix %, low friction, strong retention.
- **20–29 Items Passed:** **Moderate Subscription Conversion.** Value framing or risk reversal missing; minor leaks in cart drawer.
- **<20 Items Passed:** **Critical Subscription Failure.** High commitment fear, unanchored pricing, hidden frequency options suppressing adoption.
