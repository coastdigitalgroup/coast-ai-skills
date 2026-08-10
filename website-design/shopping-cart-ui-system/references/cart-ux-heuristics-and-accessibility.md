# Cart UX Heuristics & Accessibility Reference

This reference sheet outlines the critical design heuristics, keyboard interactions, screen reader specifications, and layout guidelines for implementing a frictionless, highly accessible shopping cart system.

---

## 1. Key UX Design Heuristics

E-commerce carts are highly sensitive transition zones. Apply these core behavioral principles to maximize trust and conversion:

### A. The "No Surprises" Price Policy
- **Heuristic:** Never force a user to initiate the checkout funnel to see simple charges like shipping or taxes.
- **Implementation:** If precise shipping cannot be calculated in the cart, clearly state "Calculated at next step" or "FREE Shipping on orders over $50." Display the active promo discount immediately in the cart subtotal rather than waiting for checkout.

### B. Prevention of Layout Shift (CLS)
- **Heuristic:** Adding, removing, or updating quantities of products should never cause the entire panel to jump, size-shift, or flicker.
- **Implementation:** Mask modified rows with a semi-transparent loading state (`opacity: 0.5`) and run a loading spinner inside the element. Reserve spatial bounds for the totals block using skeleton placeholder lines.

### C. Context Retention & Browsing Flow
- **Heuristic:** Clicking "Add to Cart" should offer immediate reassurance without forcing the user out of their product discovery flow.
- **Implementation:** Open a right-aligned sliding drawer on desktop viewports. On mobile, keep the user on the PDP or collection page and show a temporary toast message with a "View Cart" CTA.

---

## 2. Keyboard Navigation Matrix (WCAG 2.1 / 2.2)

To ensure the shopping cart is navigable by keyboard-only and screen reader users, implement the following key mapping rules, particularly when utilizing a **Sliding Mini-Cart Drawer**:

| Key | Target Element | Action |
| :--- | :--- | :--- |
| **Tab** | Any active element | Focuses the next interactive element inside the cart drawer. |
| **Shift + Tab** | Any active element | Focuses the previous interactive element inside the cart drawer. |
| **Escape** | Sliding Mini-Cart | Closes the cart drawer instantly and restores keyboard focus to the shopping cart trigger button on the host page. |
| **Space / Enter** | Quantity Counter Button | Triggers the increment or decrement of the product quantity. |
| **Space / Enter** | Close Button | Closes the cart drawer. |
| **Space / Enter** | Remove Action | Triggers the asynchronous removal of the item from the cart. |

### Focus Trapping Protocol (For Sliding Drawers)
When the cart drawer opens:
1. Save the active element that triggered the open action (`document.activeElement`).
2. Move keyboard focus to the first focusable element inside the drawer (usually the "Close" button or "Your Cart" header).
3. Trap focus within the container: pressing `Tab` on the last focusable element (usually the Checkout CTA) must wrap focus back to the first focusable element (Close button).
4. When closed, return focus back to the saved triggering element.

---

## 3. Screen Reader & ARIA Technical Specs

Screen readers do not perceive visual overlays or changes unless specified in the semantic markup. Build your templates utilizing these rules:

### A. Accessible Roles
- **Sliding Drawer Container:** Apply `<dialog>` or `role="dialog"`, with `aria-modal="true"`.
- **Relationship Association:** Link the container to the primary header using `aria-labelledby="cart-heading-id"`.
- **Lists:** Always wrap cart item rows in semantic lists (`<ul>` and `<li>`) to allow screen readers to announce the number of items currently in the list.

### B. Button Labels (Descriptive Off-Screen Text)
Native button elements with only mathematical symbols (like `+` and `-`) are unhelpful to screen readers. Add descriptive labels:
- **Incorrect:** `<button>+</button>` (Announced as: "Button, plus")
- **Correct:** `<button aria-label="Increase quantity by 1 for SentryFlow Pro Earbuds">&plus;</button>`

### C. Real-Time Status Announcements (`aria-live`)
- Create a persistent screen-reader announcer element:
  ```html
  <div class="sr-only" aria-live="polite" id="cart-accessibility-status"></div>
  ```
- Use JavaScript to inject descriptive status strings when modifications occur:
  - *When quantity increases:* "Quantity of SentryFlow Pro Earbuds updated to 2. New subtotal is $258.00."
  - *When an item is removed:* "SentryFlow Protective Case removed from cart. Subtotal is now $129.00."

---

## 4. Visual Contrast & Accessibility Guidelines

- **Typography Contrast:** Subtotals, product titles, prices, and attribute strings must have a minimum contrast ratio of **4.5:1** against the background.
- **Button / Border Contrast:** Form input borders and action buttons must have a minimum contrast ratio of **3:1** against their adjacent backgrounds to ensure visibility for users with low-vision.
- **Interactive Touch Targets:** All interactive triggers inside the cart (including counter buttons and close buttons) must have a minimum interactive zone of **44x44px** on mobile screens (WCAG 2.2 SC 2.5.8), ensuring ease of touch without accidental misclicks.
- **Vertical Body Lock:** While sliding drawer carts are active, apply `overflow: hidden` to the main `<body>` container to prevent background scroll leaking.
