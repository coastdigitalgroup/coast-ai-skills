# Checkout Order Bump Audit Checklist

Use this reusable checklist to audit existing checkout-level offers, or to plan and implement a high-converting, compliant checkout order bump on your e-commerce, SaaS, or booking portal.

---

## Part 1: Offer Viability & Relevance Audit

Before writing a single line of copy or code, ensure the order bump candidate is a logical, high-margin, and low-friction companion to the main product.

- [ ] **Low Cognitive Friction:** Does the item require *zero* selection configuration? (e.g., No size charts, color selections, fragrance choices, or complex model choices). If the user has to stop and think "Will this fit me?" or "Which color should I pick?", it is *not* a good candidate.
- [ ] **High Contextual Relevance:** Is there a direct, logical connection between the main cart item and the bump?
  - *Example:* Electronics -> Batteries or charging brick (Yes)
  - *Example:* Physical shoes -> Water-repellent protection spray (Yes)
  - *Example:* Software subscription -> 1-on-1 setup consultation or cheat sheets (Yes)
  - *Example:* Premium kitchen knives -> Portable shipping insurance (Yes)
- [ ] **The 25% Price Cap:** Is the order bump price less than 25-30% of the average cart value?
  - Recommended threshold: If AOV is $100, the bump should be priced between $9.95 and $24.95.
- [ ] **High Profit Margin:** Does the candidate product have a high gross margin? (Warranties, shipping insurance, processing upgrades, and digital companion downloads typically have 85–100% gross margins and are ideal candidates).

---

## Part 2: Compliance & Trust Verification (Anti-Deceptive Design)

Protect your brand from customer disputes, chargebacks, and legal liabilities by ensuring full transparency.

- [ ] **Auto-Opt-Out Default:** Is the order bump checkbox **unchecked by default**? Pre-checking the box is a deceptive design pattern that damages customer trust and violates several privacy and consumer protection laws (GDPR, California's Consumer Protection Acts).
- [ ] **Instant Price Transparency:** When the user checks the bump box, is the price addition immediately and explicitly reflected in the "Order Summary" sidebar? (Taxes and updated shipping costs should adjust in real time).
- [ ] **One-Tap Cancelation:** Can the user uncheck the box to instantly remove the item from their order without page refreshes, warnings, or errors?
- [ ] **No Recurring Billing Surprises:** If the order bump is a subscription, is this clearly and conspicuously disclosed directly beneath the checkbox in standard font size? (e.g., *"Billed monthly at $9.99/mo after 14-day free trial. Cancel anytime."*).

---

## Part 3: Visual Design & Styling Standards

The order bump should catch the user's eye as they scroll down the checkout page, without obstructing primary actions.

- [ ] **Dashed Border Container:** Is the bump wrapped in a dashed or dotted border (e.g., `border: 1.5px dashed var(--accent-color);`) to differentiate it from standard inputs?
- [ ] **Contrasting Background Fill:** Does the container have a light, warm background color (such as `#FFFDF5` yellow-tint or `#FAF8FF` violet-tint) to separate it from the main page background?
- [ ] **Urgency/Exclusivity Badge:** Does it feature a small, distinctive badge (such as "🎁 Special Add-on" or "🔥 One-time Offer") at the top left of the container?
- [ ] **Proximity to Primary CTA:** Is the order bump positioned immediately above the main "Place Order" or "Complete Purchase" button (or in the order summary column on desktop)?
- [ ] **Mobile-Responsive Stack Order:** On mobile viewports, does the order bump stack above the payment fields or immediately above the sticky bottom CTA bar so that users encounter it *before* final submission?
- [ ] **Clickable Container Hotspot:** Can the user click anywhere within the order bump box (not just on the tiny checkbox square) to activate/toggle the offer?

---

## Part 4: Copywriting & Value-Framing Scorecard

You have limited screen real estate. Use this scorecard to audit and refine your order bump microcopy.

- [ ] **The "Yes" Frame Hook (Headline):** Does the headline use active, positive reinforcement?
  - *Example (Good):* `"Yes, Add Lifetime Replacement Warranty for $5.99"`
  - *Example (Bad):* `"Warranty Option"`
- [ ] **Value-Driven Benefits (1-2 Sentences):** Does the description state the immediate utility and value?
  - *Example (Good):* `"Rest easy knowing your device is fully covered. If it cracks, breaks, or stops working, we will ship you a brand-new one with zero questions asked."`
  - *Example (Bad):* `"This is an extended warranty product managed by ApexInsure. Terms and conditions apply."`
- [ ] **Exclusivity Constraint:** Does the copy communicate that this special price is *only* available at this exact step in the checkout funnel? (e.g., *"One-time offer: This 50% discount is not available on our store catalog."*).
- [ ] **Clear CTA Checkbox Label:** Is the checkbox label simple, clear, and price-explicit? (e.g., *"Add to order for $5.99"*).

---

## Part 5: Technical Integration & UX Audit

- [ ] **AJAX Dynamic Updates:** Does checking/unchecking the box trigger a quick asynchronous request (`fetch`/`axios`) to update the server session and cart total in **under 200ms**?
- [ ] **No Screen Flickers/Jumps:** Does the UI update smoothly without causing the page to scroll-jump, flicker, or freeze?
- [ ] **Unified Form Submission:** Does the final "Place Order" click submit both the main cart items and the order bump in a single API request, eliminating secondary steps or loading screens?
- [ ] **Robust Error Handling:** If the session expires or a network error occurs when the user clicks the bump checkbox, does a non-blocking, localized toast message appear explaining the issue, while keeping the main checkout function active?
