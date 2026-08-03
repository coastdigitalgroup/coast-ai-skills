# Buy Now Pay Later (BNPL) Integration Audit Checklist

Use this checklist and scoring template to audit a website's Buy Now Pay Later (BNPL) integration. This tool helps identify conversion bottlenecks, visual friction, and opportunities to increase Average Order Value (AOV).

---

## Part 1: Funnel Placement & Visibility Audit

### 1. Product Detail Page (PDP)
*   [ ] **Primary Visibility:** Is the BNPL installment widget placed directly below the primary price display?
*   [ ] **Visual Proximity:** Is the widget within 16px of the price so it is read as part of the same visual block?
*   [ ] **Dynamic Updates (Sync):** When you change options (sizes, colors, bundles, quantities), does the installment price instantly update in real-time?
*   [ ] **No Layout Shift:** Is there a reserved CSS height (e.g., `min-height: 24px`) so the widget doesn't cause a Cumulative Layout Shift (CLS) when loading asynchronously?
*   [ ] **Informational Trigger:** Is there an accessible information icon `[i]` next to the price that opens a modal window directly on the page, instead of redirecting the user to a new browser tab?

### 2. Cart & Slide-out Cart Drawer
*   [ ] **Subtotal Breakdown:** Does the cart display a fractional breakdown of the current cart total (e.g., *"or 4 interest-free payments of $45"*), keeping the installment anchor top-of-mind?
*   [ ] **Cart-to-Financing Sync:** Does the cart widget dynamically recalculate if the user changes product quantities or adds/removes items from the cart?
*   [ ] **Frictionless Upselling:** Are secondary accessories or cross-sells displayed with fractional prices (e.g., *"+ $5/mo with Klarna"*) rather than a full upfront cost?
*   [ ] **Express Portals:** Are BNPL Express buttons (e.g., Klarna Express, Afterpay Express) offered directly in the cart drawer to allow instant checkout?

### 3. Checkout and Payment Sorting
*   [ ] **Express Payment Proximity:** Are express BNPL options placed at the very top of checkout alongside other express shortcuts (e.g., Apple Pay, Shop Pay)?
*   [ ] **Clear Categorization:** On the payment selection step, are BNPL methods grouped under a clear, reassuring section header (e.g., *"Flexible Interest-Free Financing"* or *"Pay Over Time"*) rather than being mixed randomly with credit card fields?
*   [ ] **Geo-Routing Accuracy:** Is the BNPL options list geo-targeted so international users are only shown BNPL systems available in their respective countries?
*   [ ] **Zero-Redundant Fields:** If checkout forms are completed via the standard flow, are those details automatically passed into the BNPL gateway to avoid redundant typing?

---

## Part 2: Pricing Psychology & Messaging Audit

### 4. Psychological Triggers & Microcopy
*   [ ] **No Decimal Noise:** Are the installment prices displayed cleanly (e.g., rounding down or displaying as a whole number when appropriate)?
*   [ ] **"Interest-Free" Clarity:** Does the widget copy explicitly use the term "interest-free" or "0% APR" to eliminate immediate credit-associated anxiety?
*   [ ] **Regulatory Placement:** Are necessary legal disclaimers displayed in small, high-contrast, non-obtrusive footnotes below the CTA, rather than filling up prime visual real estate?
*   [ ] **No Competing Logos:** Are there fewer than 3 different BNPL logos on any single page to prevent analysis paralysis?

---

## Part 3: BNPL Integration Scoring Sheets

Evaluate each section using the scoring guidelines below to calculate your site's **BNPL Performance Score**.

### Scoring Matrix

| Rating | Points | Description |
| :---: | :---: | :--- |
| **Excellent (E)** | **3 pts** | Fully optimized, dynamic, zero layout shifts, high-contrast, fully accessible modal overlays. |
| **Moderate (M)** | **1 pt** | Static widget present but missing dynamic updates, causing layout shifts, or lacking cart integration. |
| **Poor (P)** | **0 pts** | Missing completely, broken calculations, redirects user to external pages, or causes high friction. |

### Scoring Sheet

| Funnel Area | Checklist Metric | Rating (E/M/P) | Score | Action Item / Notes |
| :--- | :--- | :---: | :---: | :--- |
| **PDP** | Widget Placement & Proximity | | | |
| **PDP** | Variant & Qty Selector Sync | | | |
| **PDP** | Modal Overlay (No Redirect) | | | |
| **PDP** | Core Web Vitals (CLS Reserve) | | | |
| **Cart** | Cart Total Installment Display | | | |
| **Cart** | Cross-sell Fractional Framing | | | |
| **Cart** | Express Checkout Option | | | |
| **Checkout** | Payment Step Method Priority | | | |
| **Checkout** | Geo-Targeted Filtering | | | |
| **Copy** | Clean "Interest-Free" Copy | | | |
| **Copy** | Lack of Logo Clutter (Max 2) | | | |
| **Total** | *Cumulative Score (Out of 33)* | | **/33** | |

---

## Part 4: Scoring Interpretation & Action Roadmap

*   **Score 28 to 33 | Elite Integration:** Your BNPL implementation is highly optimized, frictionless, and utilizing psychological pricing triggers. Continue monitoring SoC and AOV metrics.
*   **Score 15 to 27 | Moderate Friction:** Your integration is losing a substantial amount of potential AOV. You likely have high cart abandonment because the installment calculator is missing from the cart drawer, or because dynamic price calculations are broken on the PDP.
    *   *Priority 1:* Implement dynamic variant sync on the PDP immediately to prevent price misalignment.
    *   *Priority 2:* Add the installment pricing widget directly to the Cart Subtotal.
*   **Score 0 to 14 | Severe Abandonment Risk:** The BNPL integration is a major friction driver or is virtually invisible to high-intent shoppers.
    *   *Immediate Action:* Stop redirecting users to PDFs or external tabs for simple terms. Replace them with standard, accessible modal popups. Reserve CSS height for the PDP widget to fix Core Web Vitals issues, and elevate BNPL in the final payment options.
