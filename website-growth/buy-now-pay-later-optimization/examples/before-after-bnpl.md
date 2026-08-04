# BNPL Optimization: Before and After Case Study

## Context & Background

**Merchant:** "ComfortNest Furniture"
**Industry:** Premium Home Goods & Furniture
**Core Challenge:** ComfortNest sells luxury modular sofas, ergonomic office chairs, and designer bed frames. While search volume and traffic are high, the Average Order Value (AOV) is high ($850), and mobile cart abandonment is a major issue. Many shoppers spend 5–10 minutes customizing a sofa but abandon the page or cart upon seeing the total price.

---

## Before: The Fragmented, High-Friction Experience

### User Journey Breakdown

1.  **Product Detail Page (PDP):**
    *   The "Aero Modular Sofa" displays a high, lump-sum price of **$1,200** in a bold, dark font.
    *   A static, small gray badge below the price says: *"Klarna available at checkout."*
    *   Clicking the badge opens a generic, non-responsive PDF of terms and conditions in a new browser tab, taking the shopper away from the product page.
    *   When the user selects a premium velvet fabric upgrade (adding **$300** to the base price), the price rises to **$1,500**, but the BNPL badge remains static and unchanged.

2.  **Cart Drawer (Slide-out):**
    *   The cart drawer displays the subtotal: **$1,500.00**.
    *   There is no mention of installment options or flexible financing.
    *   The only text is: *"Shipping and taxes calculated at checkout."*
    *   A prominent cross-sell offer is displayed: *"Add matching velvet pillows for $120"*—which users completely ignore due to the existing sticker shock.

3.  **Checkout Flow:**
    *   The user starts checkout and is forced to enter their full shipping and billing address across two steps.
    *   On the final Payment step, "Klarna" is listed as the 4th payment method, positioned below Credit Card, PayPal, and Amazon Pay.
    *   Selecting Klarna redirects the user to an external Klarna page where they have to fill out their details again.

### Key Performance Metrics (Before)

*   **Product Page Conversion Rate:** 1.2%
*   **Average Order Value (AOV):** $850.00
*   **Cart-to-Checkout Abandonment Rate:** 76% (83% on mobile)
*   **BNPL Share of Checkout (SoC):** 4.2%

---

## After: The Optimized, Low-Anxiety Journey

ComfortNest implemented the **Buy Now Pay Later (BNPL) Optimization** skill to restructure their pricing presentation, reduce checkout steps, and utilize fractional pricing psychology.

### Applied Optimizations

1.  **PDP "Layout-Safe" Fractional Pricing:**
    *   Reserved a 24px placeholder directly below the price element to prevent Cumulative Layout Shift (CLS).
    *   Replaced the static gray badge with a dynamic widget: *"or 4 interest-free payments of **$300** with **Klarna** [i]"*.
    *   Wired the widget to the product variant and fabric selector. When the user upgrades to the premium fabric (bringing the price to **$1,500**), the widget instantly and smoothly updates to show *"or 4 interest-free payments of **$375** with **Klarna** [i]"* in real-time.
    *   The info `[i]` icon opens an elegant, accessible, lightweight modal overlay showing the payment schedule (today, Week 2, Week 4, Week 6) without taking the user off the page.

2.  **Cart-Drawer "Affordability" Nudges:**
    *   Inside the cart drawer, the subtotal is presented alongside its BNPL breakdown: *"Just 4 interest-free payments of $375"*.
    *   Reframed the cross-sell velvet pillows. Instead of *"Add velvet pillows for $120"*, the copy reads: *"Add matching velvet pillows for just **$30/mo** with Klarna!"*
    *   An "Add" click instantly updates the cart's dynamic total and adjusts the fractional pricing display.

3.  **Express Checkout & Payment Priority:**
    *   ComfortNest integrated **Klarna Express Checkout**. On the Cart Drawer, a prominent, high-contrast peach-colored "Klarna Express" button was added directly next to standard Express buttons.
    *   Clicking "Klarna Express" opens a secure overlay that pre-fills the shopper's shipping and billing details from their Klarna account, reducing form-entry fields from 14 down to 0.
    *   On the standard checkout payment page, Klarna was elevated to the **second** spot, directly below Credit Card, with a clear headline: *"Interest-Free Financing Options"*.

---

## The Measurable Outcome

Six weeks after implementing these changes, ComfortNest ran a full funnel performance analysis and verified the following gains:

| Metric | Before Optimization | After Optimization | Real-World Impact |
| :--- | :---: | :---: | :--- |
| **Product Page Conversion** | 1.2% | **1.72%** | **+43%** lift in overall purchases |
| **Average Order Value (AOV)** | $850.00 | **$1,028.50** | **+21%** lift due to increased cross-sell uptake and bundle conversions |
| **Cart-to-Checkout Abandonment** | 76.0% | **58.5%** | **23%** fewer cart abandonments (drop-off on mobile halved) |
| **BNPL Share of Checkout (SoC)** | 4.2% | **28.4%** | Over a quarter of all sales processed via interest-free installments |
| **Cumulative Layout Shift (CLS)** | 0.18 | **0.02** | Eliminated asynchronous widget jumps, improving SEO and Core Web Vitals |

### Analysis: Why It Worked

1.  **Price Anchoring and Cognitive Ease:** Breaking down a intimidating $1,500 price into 4 interest-free installments of $375 shifted the user's mental accounting from "major capital investment" to "affordable monthly cash flow."
2.  **Interactive Alignment:** Syncing the BNPL widget with variant upgrades ensured the shopper always had an accurate representation of the cost, making upsells (velvet fabric upgrade) feel negligible (+ $75/installment).
3.  **Zero-Friction Cross-Selling:** Reframing the $120 pillow accessory to its fractional equivalent of $30/month drastically lowered the interaction barrier, driving a 3x higher attachment rate in the cart.
4.  **Bypassing the Form Barrier:** Implementing Klarna Express Checkout allowed mobile users to check out with two taps, completely avoiding the tedious process of typing addresses on mobile keyboards.
