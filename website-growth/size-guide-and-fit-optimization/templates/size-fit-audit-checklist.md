# E-commerce Sizing and Fit Audit Checklist

Use this reusable audit checklist to systematically evaluate, grade, and optimize an e-commerce brand's sizing system, measurement charts, and fit selectors to maximize conversion and reduce returns.

---

## 1. Sizing Experience Scorecard

Grade each area below on a scale of **0 to 3** and sum the scores:
* **0 = Missing / Completely Broken** (e.g., no size chart at all or links to a broken URL/PDF)
* **1 = Poor / Significant Friction** (e.g., non-responsive tables, hidden links, no units toggle)
* **2 = Good / Standard** (e.g., responsive tables with clear units, placed close to selector, basic model info)
* **3 = Excellent / World-Class** (e.g., interactive fit advisors, model height/weight details, crowdsourced reviews integrated)

| Audit Category | Current Score (0-3) | Target Score (3) | Notes / Observations |
| :--- | :---: | :---: | :--- |
| **A. Placement & Proximity** | | 3 | |
| **B. Mobile & Responsive Layout** | | 3 | |
| **C. Measurement Clarity & Overlaps** | | 3 | |
| **D. Model & Garment References** | | 3 | |
| **E. Social Proof & Crowd Feedback** | | 3 | |
| **F. Out-of-Stock Handling** | | 3 | |
| **TOTAL SCORE** | **_ / 18** | **18 / 18** | **Rating: <10 = Critical, 10-14 = Needs Work, 15+ = Optimized** |

---

## 2. Step-by-Step Optimization Audit

### A. Placement & Proximity (Visual Access)
- [ ] Is the "Size Guide" or "Size Chart" link visible within the main product buy-box? (Should be within **15px** of the size selector).
- [ ] Is there a visual icon (such as a ruler, hanger, or measuring tape) next to the link to increase scannability?
- [ ] Does clicking the size guide keep the user on the page (e.g., using a high-speed modal overlay, slide-out drawer, or accordion) rather than navigating them away to a separate URL?
- [ ] If the user scrolls past the buy-box, does the sticky mobile/desktop header retain easy access to size guide resources?

### B. Mobile & Responsive Layout (Usability)
- [ ] Does the size chart fit entirely within a 320px–375px mobile screen width without causing horizontal scrolling of the parent page?
- [ ] Are all font sizes in the chart/modal at least **14px** (ideally 16px) to ensure perfect legibility without pinch-to-zoom gestures?
- [ ] Are interactive buttons and toggle tabs in the modal at least **44px x 44px** to prevent fat-finger selection errors?
- [ ] Is the sizing modal easy to close on mobile (e.g., a prominent "X" close button in the top right, a "Close" button at the bottom, and tap-outside-to-dismiss)?

### C. Measurement Clarity & Overlaps (Calculations)
- [ ] Is there a dynamic toggle to switch instantly between **Imperial (Inches / Pounds)** and **Metric (Centimeters / Kilograms)**?
- [ ] Are sizing boundaries mutually exclusive, with no overlapping values? (e.g., Waist 30"–31.9" is S, 32"–33.9" is M, instead of 30"–32" and 32"–34").
- [ ] Is there a visual illustration or line-art diagram showing exactly *where* to measure the body for different garment types?
- [ ] Does the chart define whether the listed dimensions are **Body Measurements** (the body the clothes fit) or **Garment Measurements** (the actual flat dimensions of the item)?

### D. Model & Garment References (Context)
- [ ] Does the product page explicitly state the physical measurements of the model shown?
  * *Required metrics:* Height, weight, chest/waist sizes, and the exact size worn in the photos.
- [ ] Is the general "Cut" or "Silhouette" of the garment specified? (e.g., "Slim Fit / Runs Small—if you are between sizes, we recommend sizing up").
- [ ] Is there clear washing and shrinkage guidance? (e.g., "Pre-shrunk cotton—will not shrink" vs "100% Cotton—recommend air drying to prevent shrinkage").

### E. Social Proof & Crowd Feedback (Verification)
- [ ] Is there a visual fit summary widget (e.g., a slider or percentage bar) based on customer reviews? (e.g., "78% say True to Size, 15% say Runs Small, 7% say Runs Large").
- [ ] Can users filter the product reviews section by customer body metrics (Height, Weight, Body Type)?
- [ ] Does the review collection form incentivize reviewers to provide their sizing metrics to build up crowdsourced sizing data?

### F. Out-of-Stock Sizing Swaps (Error Recovery)
- [ ] Are out-of-stock sizes greyed out with a subtle diagonal strike-through but kept visible and clickable?
- [ ] Tapping an out-of-stock size replaces the primary CTA with a frictionless email/SMS opt-in for back-in-stock notifications.
- [ ] When a size is out-of-stock, does the system suggest active alternative colorways or highly similar products that *are* available in that size?

---

## 3. High-Impact Fix Roadmap

Prioritize your optimization efforts based on the difficulty and expected conversion lift of each change:

| Priority | Optimization Task | Ease of Implementation | Expected Lift | Business Metric Impacted |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Move Size Link into the Buy-box:** Place the size guide link directly adjacent to the size buttons. Never force a scroll or accordion expand to find it. | **High (Easy)** | ⭐⭐⭐ | PDP-to-Cart Conversion Rate |
| **2** | **Deploy Mobile Overlay Drawer/Modal:** Keep users on the page by rendering size tables in a responsive modal. | **Medium** | ⭐⭐⭐ | Checkout Starts (Cart Completion) |
| **3** | **Specify Model Metrics:** Add 1-2 lines of copy detailing the height and size worn by the models featured in product photos. | **High (Easy)** | ⭐⭐ | Product Return Rate |
| **4** | **Add Imperial/Metric Unit Toggle:** Implement instant JS toggles for centimeters and inches inside the size chart. | **Medium** | ⭐⭐ | Bounce Rate on PDPs |
| **5** | **Integrate Review Fit Sliders:** Surface customer feedback surveys on fit directly in the buy-box (e.g., "True to size"). | **Low (Harder)** | ⭐⭐⭐ | Return Rate & Sizing Queries |

---

## 4. Return & Sizing Economics Analysis Template

Before making sizing changes, establish your margin loss baseline. Use this mathematical formula to calculate the cost of sizing friction:

### A. Current Baseline Metrics
1. **Total Monthly Orders:** `____________` (A)
2. **Monthly Return Rate (All Reasons):** `____%` (B)
3. **Total Monthly Returns:** `____________` (C = A * B)
4. **Percentage of Returns Due to Sizing:** `____%` (D) *(From return surveys)*
5. **Sizing-Driven Returns:** `____________` (E = C * D)
6. **Average Cost of a Return:** `$___________` (F) *(Includes return shipping labels, inspection labor, restocking, and repackaging)*
7. **Monthly Return Cost Bleed:** `$___________` (G = E * F)

### B. Projected Savings (Targeting 20% Sizing Return Reduction)
1. **New Projected Sizing Returns:** `____________` (H = E * 0.80)
2. **Projected Monthly Financial Recovery:** `$___________` (I = [E - H] * F)
3. **Projected Annual Savings:** `$___________` (J = I * 12)
