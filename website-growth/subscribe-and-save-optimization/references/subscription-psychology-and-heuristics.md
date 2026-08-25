# Subscription Psychology & UX Heuristics Reference

This reference outlines the behavioral psychology principles, conversion heuristics, choice architecture rules, and churn-mitigation patterns required to build high-converting Subscribe & Save experiences.

---

## 1. Behavioral Psychology & Persuasion Principles

### A. Loss Aversion & Strikethrough Framing
- **Psychological Principle:** Amos Tversky and Daniel Kahneman’s Prospect Theory proves that the pain of losing value is psychologically twice as powerful as the pleasure of gaining an equivalent benefit.
- **Application in Subscribe & Save:**
  - Standard framing (*"Subscribe and get 15% off"*) emphasizes a potential future gain.
  - Loss aversion framing (*"Unlock $7.50 instant savings + Never pay full retail again"*) frames missing the subscription option as forfeiting immediate money and overpaying.
  - Displaying the full retail price crossed out (`~~$50.00~~ $42.50`) creates an explicit visual reference point (price anchoring), making the discount feel tangible.

### B. Commitment Anxiety & Autonomy Preservation
- **Psychological Principle:** When presented with long-term commitments, users experience psychological reactance—a defensive resistance to feeling trapped or losing control over their future finances.
- **Application in Subscribe & Save:**
  - High commitment anxiety leads to cart abandonment when Subscribe & Save is forced or pre-selected without clear exit guarantees.
  - Reassuring users of complete autonomy (*"Skip, pause, or cancel anytime with 1 click"*) neutralizes psychological reactance.
  - Prominently featuring a 3-day pre-shipment email reminder promise signals that the brand respects customer control, eliminating fear of surprise recurring credit card charges.

### C. Default Effect & Choice Architecture
- **Psychological Principle:** The Default Effect shows that individuals overwhelmingly stick with pre-set options because changing them requires cognitive effort and decision energy.
- **Application in Subscribe & Save:**
  - Pre-selecting Subscribe & Save on high-intent pages increases subscription selection by up to 35%.
  - However, pre-selecting subscriptions without explicit risk-reversal microcopy on cold ad traffic increases post-purchase refund requests and support tickets.
  - *Heuristic Rule:* Default to Subscribe & Save only when (1) the savings badge is prominent, (2) the cancellation terms are explicitly stated near the CTA button, and (3) the audience has baseline brand familiarity.

---

## 2. UX & Interface Design Heuristics

### A. Dual-Radio Container Cards vs. Select Dropdowns
- **Heuristic:** Never hide Subscribe & Save options inside a standard `<select>` dropdown menu on PDPs.
- **Rationale:** Dropdowns conceal pricing differences, obscure discount percentages, and require extra clicks to inspect options.
- **Best Practice Standard:** Render two stacked or side-by-side full-width radio button containers:
  - Container 1: One-Time Purchase ($XX.XX)
  - Container 2: Subscribe & Save (Save XX% / $YY.YY) + Frequency Selector

```
┌────────────────────────────────────────────────────────┐
│ ○ One-Time Purchase                          $50.00    │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│ 🔘 Subscribe & Save     [SAVE 15%]           $42.50    │
│    └─ Delivered: [ Every 30 Days (Most Popular)  ▼ ]   │
│    └─ Includes Free Shipping + Price Guarantee         │
└────────────────────────────────────────────────────────┘
```

### B. The Rule of 3 for Delivery Frequencies
- **Heuristic:** Limit delivery frequency options to a maximum of **3 choices**.
- **Rationale:** Presenting too many options (e.g., 1 week, 2 weeks, 3 weeks, 4 weeks, 6 weeks, 8 weeks) causes decision paralysis (Hick's Law), leading shoppers to abandon the subscription choice and buy one-time.
- **Recommended Frequency Sets:**
  - *Daily Supplements / Coffee:* 30 Days (Default), 45 Days, 60 Days.
  - *Skincare / Cosmetics:* 30 Days, 60 Days (Default), 90 Days.
  - *Household Cleaning / Bulk CPG:* 45 Days, 60 Days (Default), 90 Days.

### C. Cart Drawer Upgrade Nudges
- **Heuristic:** Capture subscription intent during cart review without interrupting the checkout flow.
- **Mechanism:** When a user adds a one-time product to their mini-cart drawer, display an inline 1-click upgrade card:
  - *"Upgrade this item to Subscribe & Save and take an extra $7.50 off your order instantly!"*
  - `[ Single-Click Toggle: Switch to Subscription ]`

---

## 3. Retention & Churn Mitigation Design Rules

### A. Self-Serve Portal Accessibility
- **Rule:** Never force customers to call a phone number or email customer support to cancel or delay a subscription.
- **Impact:** Dark-pattern cancellation barriers lead to credit card chargebacks, negative reviews, and regulatory penalties under FTC and EU consumer protection laws.
- **Solution:** Provide a passwordless, 1-click magic link self-serve customer portal where users can:
  - Skip an upcoming delivery with 1 click.
  - Swap product flavors or variants.
  - Adjust delivery frequency (e.g., move from 30 days to 60 days).
  - Pause subscription for 30–90 days.

### B. Defensive Churn Mitigation (Cancellation Flow Optimization)
- **Heuristic:** When a subscriber clicks "Cancel Subscription" in their portal, present helpful alternatives before executing the cancellation.
- **Deflection Hierarchy:**
  1. *Offer 1-Click Skip:* "Overstocked? Skip your next delivery scheduled for Oct 12th."
  2. *Offer Frequency Adjustment:* "Receiving product too fast? Switch to delivery every 60 days."
  3. *Offer Product Swap:* "Bored of this flavor? Swap to Chocolate for your next delivery."
  4. *Offer Temporary Discount:* "Pause today and get 20% off your next shipment."
