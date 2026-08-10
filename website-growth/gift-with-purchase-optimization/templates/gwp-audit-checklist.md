# Gift-With-Purchase (GWP) Campaign Audit & Optimization Checklist

This reusable checklist is designed for growth marketers, product managers, and e-commerce engineers to audit, plan, and verify a Gift-With-Purchase (GWP) promotion. Complete each section sequentially to ensure maximum Average Order Value (AOV) uplift and zero margin leakage.

---

## Part 1: Mathematical Validation & Margin Safety

Setting a threshold without the proper financial validation can destroy profitability. Run your campaign numbers through this audit *before* designing any assets.

- [ ] **Establish Average & Median Order Values:**
  *   Record historical 90-day Average Order Value (AOV): `$__________`
  *   Record historical 90-day Median Order Value (MOV): `$__________` *(Note: Use MOV to establish the threshold if you have high-value order outliers).*
- [ ] **Calculate the GWP Stretch Target (Spend Threshold):**
  *   Apply a 25% to 40% stretch factor to the MOV/AOV baseline.
  *   *Calculation:* `MOV * 1.30 = $__________`
  *   Select a psychological pricing anchor (e.g., $75, $100, $150): Target Threshold = `$__________`
- [ ] **Calculate the Gift Value Ratio:**
  *   Advertised Retail Value of the Gift: `$__________`
  *   Verify that the Retail Value is between **15% and 30%** of the spend threshold: `(Retail Value / Spend Threshold) * 100 = __________%`
- [ ] **Verify Gross Margin Contributions:**
  *   Average incremental order value stretch (Threshold - MOV): `$__________`
  *   Brand's catalog gross margin %: `__________%`
  *   Incremental gross profit on the stretch (Stretch * Gross Margin %): `$__________` (A)
- [ ] **Determine Total Promotional Unit Cost:**
  *   Gift Cost of Goods Sold (COGS): `$__________`
  *   Picking & packing surcharge for the extra item: `$__________`
  *   Incremental shipping weight carrier cost: `$__________`
  *   Total GWP cost: `$__________` (B)
- [ ] **Verify Margin Profitability:**
  *   Is `A` (Incremental Gross Profit) strictly greater than `B` (Total GWP Cost)?
  *   *Pass Criteria:* `A - B = +$__________` *(Must be positive. If negative, increase the spend threshold or select a lower COGS gift).*

---

## Part 2: On-Site Visual UX & Funnel Placement

Ensure that shoppers are highly motivated and fully informed of the GWP offer throughout their browsing journey.

- [ ] **Homepage & Site-wide Header Banners:**
  *   Is there a persistent utility banner at the top of the viewport announcing the promotion?
  *   Does the banner clearly state the threshold (e.g., *"Free Full-Sized Serene Serum on Orders Over $80"* rather than just *"Free Gift with Purchase"*)?
- [ ] **Product Detail Page (PDP) Contextual Nudge:**
  *   Is there a micro-badge or text line directly under the main "Add to Cart" button indicating the item's progress toward the free gift?
  *   *Dynamic logic check:* If item price >= threshold, does the badge read: *"Buy this item to instantly unlock a FREE [Gift Name]!"*?
  *   If item price < threshold, does it display the remaining gap: *"Spend $X.XX more to unlock a FREE [Gift Name]!"*?
- [ ] **Sliding Mini-Cart / Drawer Progress Bar:**
  *   Is there a highly visible, high-contrast visual progress bar inside the sliding cart drawer?
  *   **State 1 Check (< Threshold):** Does the progress bar dynamically fill and calculate the exact dollar amount needed to unlock (e.g., *"You are $15 away from your FREE Lip Treatment"*)?
  *   **State 2 Check (>= Threshold):** Does the progress bar animate, change color (e.g., turn green), and display a success message (e.g., *"🎉 You've unlocked your FREE Lip Treatment!"*)?
- [ ] **Cart Line-Item Representation:**
  *   Is the GWP SKU instantly injected into the cart as a visible line item when the threshold is crossed?
  *   Is the retail price clearly struck through and accompanied by a bold green **"FREE"** or **"$0.00"** label?
  *   Are quantity editing controls (plus/minus buttons) disabled for the gift line item?
  *   Is there a "GIFT" label or icon next to the item name to prevent confusion?
  *   If the user drops below the threshold by deleting an item, does the GWP SKU instantly auto-remove?

---

## Part 3: Choice-Based (Variant) GWP Execution

*Complete this section only if the gift has options (e.g., different shirt sizes, cosmetics shades, or sample choices).*

- [ ] **Direct Cart-Drawer Selector:**
  *   Does the shade/size selector display *within the cart drawer* as soon as the threshold is reached?
  *   Does it avoid taking the user away from their checkout funnel to a separate product page?
- [ ] **Default Selection / Quick Add:**
  *   Are the variant options easy to select with simple, large touch-targets (e.g., swatch circles for colors, pill buttons for sizes)?
  *   Is the primary button copy highly actionable (e.g., *"Add My Free Gift"* or *"Confirm Shade"* şeklinde)?

---

## Part 4: Technical Protection & Abuse Prevention

Secure the checkout flow against coupon-stacking and return exploits.

- [ ] **Discount Recalculation (Checkout Security):**
  *   Does the system re-evaluate threshold qualification *after* any discount codes are applied?
  *   *Test Scenario:* Add $100 of products to qualify for a $80 threshold GWP. Apply a "30% OFF" coupon code (dropping the subtotal to $70).
  *   *Expected Behavior:* The free gift must be automatically stripped from the cart with an inline message: *"Subtotal dropped below $80. Add $10 more to re-unlock your free gift!"*
- [ ] **Zero-Dollar Checkout Prevention:**
  *   *Test Scenario:* Try to add *only* the GWP SKU to the cart and navigate to checkout.
  *   *Expected Behavior:* The cart/checkout must throw an error, block progression, and prompt the user to add standard items to their cart. Zero-dollar transactions must be impossible.
- [ ] **Returns & Refunds Policy Enforcement:**
  *   Is there a clear, legally compliant return disclaimer displayed in the cart footer and the FAQ/returns page?
  *   *Required Policy Language:* *"If you return the qualifying purchase, the free gift must also be returned in unused, unopened condition. If the gift is not returned, its retail value ($XX.XX) will be deducted from your total refund."*

---

## Part 5: Inventory & Fulfillment Operations

Coordinate with logistics to prevent stockouts and shipping delays.

- [ ] **Safety Buffer Alert Trigger:**
  *   Have you configured an automated alert to notify marketing and operations when the gift SKU inventory drops below `50` (or a chosen safety threshold) units?
- [ ] **Dynamic Fallback / Substitutions:**
  *   Is there a designated fallback GWP SKU (e.g., a "Mystery Gift" or secondary product) set up in the backend?
  *   *Technical script check:* If primary gift stock = 0, do on-site banners and the cart drawer instantly switch to advertise the fallback gift?
- [ ] **Warehouse Picking Optimization:**
  *   Has the fulfillment team been notified of the GWP campaign at least **14 days** in advance?
  *   Are the gift items stored in bins directly adjacent to the packing tables to minimize pick times?
  *   Are the gifts pre-packaged if they require special boxing or components?

---

## Part 6: Validation & Campaign Diagnostics

Measure the direct performance outcome of the GWP campaign.

- [ ] **Set Up A/B Testing Cohorts (Optional but Recommended):**
  *   Cohort A: Normal site experience (No GWP offer).
  *   Cohort B: GWP campaign active with on-site progress bar.
- [ ] **KPI Tracking Configuration:**
  *   Track **Average Order Value (AOV)**: Target relative lift of **15% to 30%**.
  *   Track **Site-wide Conversion Rate (CVR)**: Target absolute lift of **+0.3% to +0.8%**.
  *   Track **Promo Take Rate**: Target **>95%** of qualifying orders.
  *   Track **Gift Returns/Abuse**: Verify that returned orders are properly audited for gift inclusion, keeping gift leakage below **5%** of returns.
