# UX Heuristics & Persuasion Principles for Sizing & Fit

Sizing is not merely a technical layout challenge; it is a psychological barrier. Understanding the cognitive biases at play helps design sizing interfaces that actively convert undecided shoppers.

---

## 1. Psychological Drivers of Fit Friction

### A. Loss Aversion & Return Friction
Under Kahneman & Tversky’s **Loss Aversion** theory, the pain of losing is psychologically twice as powerful as the pleasure of gaining. In e-commerce, the potential "loss" includes:
- Paying for return shipping.
- The hassle of repackaging and traveling to a shipping drop-off location.
- Being stuck with a garment that doesn't fit and cannot be worn.

When sizing is ambiguous, Loss Aversion triggers immediate purchase deferral (cart abandonment). **Clear sizing tools act as risk mitigators**, neutralizing these perceived losses before they halt the checkout process.

### B. Choice Paralysis & The "Bracketing" Behavior
When a customer is unsure whether they are a Medium or a Large, **Choice Paralysis** (or the Paradox of Choice) sets in. To cope, shoppers either:
1. **Abandon the purchase completely:** (CRO Loss)
2. **Engage in Bracketing:** Ordering both sizes with the explicit intention of returning one. This artificially inflates transaction numbers but devastates margin metrics through shipping cost bleed, repackaging labor, and tied-up inventory.

Providing dynamic, high-confidence sizing recommendations (such as comparative sizing or verified purchaser consensus sliders) eliminates choice paralysis and prevents bracketing.

### C. Cognitive Load & Unit Conversions
Requiring users to do manual division or multiplication to convert inches to centimeters or pounds to kilograms increases **Cognitive Load**. When cognitive load increases, decision energy drops.
- **Heuristic:** Sizing tools must do the heavy lifting. All unit conversions must be instantaneous, client-side, and require zero input calculation from the user.

---

## 2. Interface Design and Spacing Guidelines

### A. Modal Dialog Geometry
Sizing tables contain high-density grid data. To keep them usable on mobile viewports:
- **Full-Width Drawer vs. Overlay Modal:** On mobile screens under 480px, render the size guide as a vertical slide-out drawer (`width: 100%; height: 100%`) rather than a floating window. This maximizes screen real estate and prevents clipping.
- **Frozen Table Headers (`position: sticky`):** When scrollable sizing tables are necessary, make the first row (the column headers like Size, Chest, Waist) and the first column (the sizes like S, M, L) sticky. This ensures the customer never loses spatial reference while panning.

### B. Size Selector Touch Targets
Size selectors are frequently styled as simple text blocks. To ensure they are accessible under WCAG 2.2:
- **Tap Area:** Each size button (e.g., [ S ], [ M ], [ L ]) must have a minimum interactive tap target area of **44px x 44px**.
- **Clear Active State:** The selected size must have high visual contrast (e.g., solid black background with white text) compared to unselected sizes (light grey or thin border).
- **Out-of-Stock Styling:** Out-of-stock sizes should utilize a low-contrast border and a diagonal line across the button, while still allowing the button to be clickable to trigger back-in-stock notifications.

---

## 3. Post-Purchase Fit Survey Heuristics

To build crowdsourced sizing badges (e.g., "Runs True to Size"), collect structured feedback from verified buyers.

### A. The 30-Day Window Rule
Trigger the post-purchase fit survey **14 to 30 days after delivery** (not order date). This ensures the customer has washed, worn, and experienced the actual fit and potential shrinkage of the item.

### B. Frictionless Rating Schema
Avoid open-ended text fields for fit surveys. Use simple, standard 5-point radio scales:
1. **Runs very small** (Size up 1-2 sizes)
2. **Runs slightly small** (If between sizes, size up)
3. **True to size** (Order your standard size)
4. **Runs slightly large** (If between sizes, size down)
5. **Runs very large** (Size down 1-2 sizes)

Aggregating these ratings into a simple percentages slider on the PDP provides instant, persuasive social proof for prospective buyers.
