# Subscription Behavioral Psychology & Design Heuristics

This reference guide details the core psychological principles and category-specific heuristics governing consumer adoption of recurring "Subscribe & Save" e-commerce models.

---

## Behavioral Psychology Mechanics in Subscription Design

### 1. Loss Aversion & Strikethrough Pricing
- **Psychological Principle:** Kahneman & Tversky's Prospect Theory demonstrates that consumers feel the pain of losing value twice as intensely as the pleasure of gaining equivalent value.
- **Application in Buy Boxes:** Showing a standard price crossed out (`~~$58.00~~ $46.40`) triggers loss aversion. Selecting "One-Time Purchase" feels like actively *losing* $11.60 and paying an unnecessary "one-time tax."
- **Execution Rule:** Never display a subscription price in isolation. Always pair it with the higher one-time anchor price and explicit dollar savings (`Save $11.60`).

### 2. Illusion of Control & Fear of Entrapment
- **Psychological Principle:** High-intent buyers frequently resist recurring commitments due to "reactance"—the psychological urge to resist perceived threats to personal autonomy or loss of control.
- **Application in Buy Boxes:** Shoppers fear being trapped in an endless billing cycle when life circumstances change (e.g., travel, product backlog, financial pressure).
- **Execution Rule:** Explicit risk-reversal microcopy (`✓ Cancel, pause, or skip anytime in 1 click`) restores perceived autonomy. Promising pre-shipment SMS reminders eliminates the fear of surprise credit card charges.

### 3. Perceived Value Stacking (The "Unfair Advantage" Perception)
- **Psychological Principle:** Value stacking increases perceived utility by combining monetary discounts with operational privileges and tangible gifts.
- **Application in Buy Boxes:** A 15% discount alone can feel incremental. Combining **15% OFF + Free Shipping + Free Gift on 1st Order + Price Lock** transforms the subscription into an overwhelming, exclusive VIP tier.
- **Execution Rule:** List stacked perks inside bulleted checklists directly inside the Subscribe & Save card container.

### 4. Default Effect & Status Quo Bias
- **Psychological Principle:** When presented with choices, humans disproportionately stick with the pre-selected default option to minimize cognitive effort.
- **Application in Buy Boxes:** Pre-selecting "Subscribe & Save" increases subscription mix % by 25% to 40% compared to neutral or unchecked states.
- **Execution Rule:** Pre-select "Subscribe & Save" *only* when the discount is $\ge 15\%$ and the risk-reversal guarantee is clearly visible. If the discount is low (<10%), forcing the subscription default creates friction and increases accidental order returns.

---

## Category-Specific Delivery Frequency Guidelines

Choosing the wrong default delivery interval causes either product depletion before replenishment (frustration) or excess inventory accumulation (cancellation). Match default frequencies to actual product usage cycles:

| Product Category | Typical Unit Size | Recommended Default Interval | Secondary Interval Options | Usage Anchor Microcopy |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Supplements / Greens** | 30 Servings | **30 Days** | 60 Days, 90 Days | `30 Days (Daily Use)` |
| **Specialty Whole Bean Coffee** | 12 oz Bag (15-20 cups) | **14 Days** | 30 Days, 45 Days | `14 Days (1-2 Cups / Day)` |
| **Facial Skincare / Serums** | 30 ml Bottle | **60 Days** | 45 Days, 90 Days | `60 Days (Morning & Night)` |
| **Pet Food / Kibble** | 15 lb Bag | **30 Days** | 45 Days, 60 Days | `30 Days (Medium Dog)` |
| **Eco Cleaning Refills** | 4-Pack Concentrate | **90 Days** | 60 Days, 120 Days | `90 Days (Quarterly Refresh)` |
| **Protein / Fitness Powder** | 2 lb Tub (20 scoops) | **30 Days** | 45 Days, 60 Days | `30 Days (Post-Workout)` |

---

## WCAG 2.2 Accessibility Guidelines for Buy Boxes

1. **Focus State Visibilities (SC 2.4.7):** Interactive Subscribe & Save option cards must display a visible focus outline ($2\text{px}$ solid high-contrast border or glow) when tabbed via keyboard navigation.
2. **Radio Group Semantics:** Group option cards inside a semantic HTML `<fieldset>` with a `<legend>` (e.g., `<legend class="sr-only">Select Purchase Type</legend>`).
3. **Contrast Ratios (SC 1.4.3):** Ensure text contrast against background fills achieves a minimum ratio of **4.5:1** for standard text and **3:1** for large headings/badges.
4. **Dynamic ARIA Announcements (SC 4.1.3):** When switching purchase type or frequency, announce updated totals to screen reader users via an `aria-live="polite"` region.
