# Before-and-After: Sizing & Fit Optimization

This example details how **AeroActive**, a mid-market DTC athletic apparel and footwear brand, optimized its on-site sizing experience. AeroActive was suffering from high product return rates (which killed net margins) and high cart-to-checkout drop-off because of fit confusion.

---

## 1. The Baseline (Before State)

### The User Experience
- **Invisible Size Link:** The size guide link on the apparel Product Detail Page (PDP) was located far below the buy-box, nested inside a collapsed accordion tab alongside "Shipping & Returns."
- **Horizontal Scroll & No Toggles:** Clicking the link redirected users to a separate URL (`/pages/size-chart`). The sizing charts were massive, non-responsive static tables. On mobile devices, users had to pan left and right, losing track of column headers. Measurements were listed strictly in inches.
- **Overlapping Ranges:** The chart had overlapping waist ranges (e.g., Size S: 30"-32"; Size M: 32"-34"). Customers with a 32" waist had no clear choice.
- **No Model Info:** The PDP featured high-resolution images of models, but nowhere did it mention what size the model was wearing or their physical height/weight.
- **Out-of-Stock Friction:** When a user selected an out-of-stock size (e.g., XL), the button was simply disabled. The CTA changed to "Unavailable," but provided no dynamic notification options or suggested alternatives.

### The Problem Metrics
- **PDP-to-Cart Click-Through Rate:** 5.2%
- **Product Return Rate (Sizing Reasons):** 28.5% of total sales (mostly "Too Small")
- **Bracket Buying Frequency:** 14% of orders (customers buying the exact same SKU in both Medium and Large to try on and return one)
- **Sizing Customer Support Volume:** 22% of all daily live chat and email support tickets

---

## 2. The Intervention (The Optimization Strategy)

AeroActive applied the **Size Guide and Fit Optimization** framework to rebuild their on-site sizing flow.

### Action 1: Relocated and Framed Sizing Prompts
- Relocated the "Size Guide" link directly above the size variant selector (within **10px**).
- Added a small hanger icon next to the text link to increase scannability and draw high-intent clicks.

### Action 2: Built a Responsive Unit-Toggle Modal
- Developed a fast-loading, zero-redirect modal overlay that prevents the user from leaving the product page.
- Programmed a high-contrast switch to toggle instantly between **Imperial (In, Lbs)** and **Metric (Cm, Kg)** units.
- Eliminated overlapping ranges by establishing strict boundaries (e.g., Small: 29.5"–31.5"; Medium: 31.6"–33.5").
- Rendered visual line-art diagrams inside the modal pointing directly to anatomical measuring points.

### Action 3: Displayed Model Reference Anchors
- Under the sizing chart and inside the product description, AeroActive added concrete reference statements:
  * "Model is 6'1" (185cm) / 180 lbs (81 kg) with a 32" (81cm) waist, wearing size Medium."

### Action 4: Launched crowdsourced "Fit Feedback" Badges
- Integrated a mini-slider directly below the size buttons based on verified purchaser post-purchase surveys:
  ```
  [ Runs Small (5%) | True to Size (87%) | Runs Large (8%) ]
  ```
  This immediately reassured shoppers that they could comfortably order their standard size.

### Action 5: Optimized Out-of-Stock Sizing Swaps
- Greyed out out-of-stock sizes but kept them clickable.
- Tapping an out-of-stock size dynamically replaced the "Add to Cart" button with a highly-visible "Notify Me When Back in Stock" input.
- Added a small, high-contrast nudge showing available colors for the selected size (e.g., "Size Large is currently out of stock in Crimson Red, but available in Royal Blue [View Royal Blue]").

---

## 3. The Outcome (After State)

### The Optimized User Experience
Sizing anxiety was completely neutralized. When customers selected athletic leggings, they instantly saw that "87% say True to Size." Those who still wanted exact measurements clicked the clean hanger icon link next to the size buttons, which instantly triggered an interactive overlay modal on their mobile screens. They could toggle to centimeters, view exactly where the hips measurement was taken, and make an immediate, confident purchase decision without leaving the buy-box.

### The Results (Measurable Outcome)

| Metric | Before | After | Delta (%) / Lift |
| :--- | :---: | :---: | :---: |
| **PDP-to-Cart Conversion Rate** | 5.2% | 6.1% | **+17.3% relative lift** |
| **Product Return Rate (Sizing)** | 28.5% | 18.2% | **-36.1% relative reduction** |
| **Bracket Buying Frequency** | 14.0% | 4.8% | **-65.7% relative reduction** |
| **Sizing Support Ticket Ratio** | 22.0% | 8.5% | **-61.3% relative reduction** |

By optimizing sizing trust and UI flow, AeroActive not only boosted direct conversion rates but also significantly reduced reverse-logistics shipping costs (returns), directly saving hundreds of thousands of dollars in operating margins.
