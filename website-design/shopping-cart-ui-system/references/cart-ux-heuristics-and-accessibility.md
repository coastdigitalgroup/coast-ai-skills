# Shopping Cart UX Heuristics & Accessibility Reference

This reference establishes core cognitive usability guidelines, behavioral psychology principles, and technical WCAG AA accessibility rules for designing high-conversion shopping cart interfaces.

---

## 1. Cognitive and Behavioral UX Heuristics

### A. Friction Reduction (Fitts's Law & Goal-Gradient Effect)
- **Primary Action Proximity:** Keep the primary "Proceed to Checkout" call-to-action (CTA) prominent and easy to target. On mobile, the CTA should be docked to the bottom edge where it is easily reachable within the user's natural thumb sweep.
- **Goal-Gradient Progress:** The dynamic free-shipping progress bar leverages the Goal-Gradient Effect: the closer a customer is to achieving a goal (e.g., "Free Shipping"), the harder they will work to complete it (e.g., adding a companion item or accessory to the cart).
- **Clear Cost Transparency:** Never hide fees or shipping expenses. Displaying shipping rules and showing taxes as early as possible reduces checkout sticker-shock, which is the #1 reason for cart abandonment.

### B. Action Confirmation & Recalculation Stability (Anti-Pattern Prevention)
- **Avoid Content Shifting:** Ensure subtotal text blocks have a reserved layout footprint. Toggling quantities must not cause vertical text shifting (Cumulative Layout Shift) because jumps can lead to user confusion or accidental misclicks.
- **Prevent Double-Tap Errors:** When users click `+` or `-` to alter quantities, implement a debounce or programmatic loading block (`aria-busy="true"`) to prevent double-click race conditions from hitting your API and causing unexpected quantity jumps.
- **Save for Later alternative:** Provide a secondary option like "Save for Later" or "Move to Wishlist". This allows users who are not ready to commit to clean their cart without permanently losing their list of desired items.

---

## 2. Accessibility Guidelines (WCAG AA Compliance)

### A. Keyboard Navigation & Focus Flow
Any interactive element in a shopping cart must be operable using standard keyboard-only controls.

- **Interactive Tab Order:**
  - Standard focus route for a Cart Line Item: `Product Link` -> `Decrease (-) Button` -> `Quantity Input Field` -> `Increase (+) Button` -> `Remove Button`.
- **Keyboard Shortcuts Specification:**
  - **`Space` or `Enter`:** Triggers buttons (Close, Increase, Decrease, Remove, Checkout).
  - **`Escape`:** Instantly closes the slide-out mini-cart drawer and returns focus directly to the header "Cart" button.
- **Focus Trapping on Drawers:**
  - When the mini-cart drawer opens, keyboard focus must be trapped inside. Users pressing `Tab` should cycle exclusively through elements inside the drawer (from the top Close button to the bottom Checkout CTA) and never leak back to background page content.

### B. ARIA Roles & Screen Reader Mappings
The cart is a highly dynamic component. Standard HTML tags must be enriched with ARIA properties to ensure screen reader users receive equal status information:

- **List Semantics:** Wrap the active item list in a `<ul role="list">` tag. This ensures screen readers announce the exact count of items present in the list (e.g., "List, 2 items").
- **Clear Quantity Controls:** Do not use plain buttons labeled with "+" or "-". Use descriptive `aria-label` bindings:
  - Decrement Button: `aria-label="Decrease quantity of [Product Name]"`
  - Increment Button: `aria-label="Increase quantity of [Product Name]"`
  - Input Field: `aria-label="Quantity of [Product Name]"`
- **Descriptive Removal Trigger:** Avoid generic text like "Delete" or a simple garbage can icon without a label. Use:
  - `aria-label="Remove [Product Name] from your shopping bag"`.
- **ARIA Live Regions for Recalculation:** Use an invisible live-region container to announce dynamic changes to the page without reloading or shifting focus:
  ```html
  <div class="sr-only" aria-live="polite" aria-atomic="true" id="cart-accessibility-announcer">
    <!-- Updated programmatically via JavaScript -->
  </div>
  ```
  *Example Announcements:*
  - On adding/increasing quantity: `"Quantity updated to 2 for Organic Cotton Crewneck Tee."`
  - On removal: `"Organic Cotton Crewneck Tee was removed from your shopping bag."`

---

## 3. Visual & Styling Standards

### A. Touch-Target Footprints (WCAG 2.2 SC 2.5.8)
- Every touchscreen button (specifically the `+` / `-` increment/decrement buttons and the remove button) must provide a target area of at least **24x24px** with clear surrounding margin, and a preferred size of **44x44px** to ensure tap accuracy for users with motor impairments.

### B. Contrast Ratios (WCAG 2.1 SC 1.4.3)
- Ensure all text labels (including subtotal values, strike-through original prices, and variant details) maintain at least a **4.5:1** contrast ratio against their respective background colors.
- Secondary actions (e.g., "Remove") must use clear styling or text descriptors rather than relying solely on color (such as a light-red outline) to represent deletion (WCAG SC 1.4.1 Use of Color).
