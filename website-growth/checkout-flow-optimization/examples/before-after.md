# Checkout Optimization: Before vs. After

This example demonstrates the optimization of a "Mediocre" e-commerce checkout
flow to a "High-Conversion" flow based on the Checkout Flow Optimization skill.

## Scenario: The "HomeDecor" Online Store

**Problem:** HomeDecor noticed a 75% abandonment rate at the "Shipping &
Account" step. Users were dropping off immediately after clicking "Checkout"
from the cart.

---

## ❌ Before: The "High-Friction" Flow

### Characteristics:

1.  **Forced Account Creation:** Users were met with a mandatory "Sign Up or
    Login" screen. No guest option was visible.
2.  **Vague Shipping:** Shipping options were listed as "Standard (5-7 days)"
    and "Express (2-3 days)."
3.  **Data Greedy Form:** Required "First Name," "Last Name," "Company
    (Optional)," and "Phone" (with no explanation).
4.  **Hidden Costs:** Taxes and shipping fees were only calculated on the "Final
    Review" page (Step 4).
5.  **Distracted UI:** The full site header (including search and category
    links) remained visible, giving users many "exit" paths.

### User Impact:

- **Frustration:** Users didn't want to manage another password just for a
  one-time lamp purchase.
- **Cognitive Load:** Users had to calculate if "5-7 days" meant business days
  and if it would arrive before their weekend event.
- **Anxiety:** Users worried about why their phone number was needed and what
  the "final" price would actually be.

---

## ✅ After: The "Optimized" Flow

### Characteristics:

1.  **Guest Checkout Prominence:** The login screen was replaced with three
    options: "Express Checkout" (Apple/Google Pay), "Guest Checkout" (Primary
    Action), and "Sign In" (Secondary Link).
2.  **Delivery Dates:** Shipping options now read: "Standard: Arrives Friday,
    Oct 12 (Free)" and "Express: Arrives tomorrow, Oct 9 ($15.00)."
3.  **Streamlined Form:**
    - Combined "First/Last Name" into one "Full Name" field.
    - Hidden "Company" field behind an "Add company name" link.
    - Included microcopy: _"We only use your phone number for delivery updates
      via SMS."_
4.  **Early Transparency:** A "Summary" sidebar was added to Step 1, showing
    estimated tax and shipping based on a ZIP code auto-detect.
5.  **Enclosed Checkout:** Removed the main site navigation. The only way "out"
    was back to the cart or forward to completion.

### Results:

- **Completion Rate:** Increased by 22%.
- **Mobile Conversion:** Increased by 35% due to Apple Pay adoption and fewer
  form fields.
- **Support Tickets:** 40% reduction in "Where is my order?" inquiries due to
  clear delivery dates.

---

## Key Optimization Summary

| Element          | Before                | After                        | Lever              |
| :--------------- | :-------------------- | :--------------------------- | :----------------- |
| **Initial Step** | Forced Login          | Guest Checkout + Express Pay | Guest Prominence   |
| **Fulfillment**  | Shipping Speed (Days) | Delivery Date (Calendar)     | Clarity            |
| **Forms**        | 8 Fields (Scattered)  | 5 Fields (Consolidated)      | Friction Reduction |
| **Trust**        | Hidden Price          | Summary with Estimated Total | Transparency       |
| **Layout**       | Full Navigation       | Enclosed Flow                | Focus              |
