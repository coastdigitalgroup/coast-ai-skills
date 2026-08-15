# Post-Purchase Heuristics & Persuasion Reference Guide

This reference guide details psychological heuristics, offer selection matrices, pricing mechanics, payment vaulting safety rules, and UX patterns for high-converting post-purchase cross-sell and upsell flows.

---

## 1. Behavioral Science & Cognitive Heuristics

Post-purchase monetization succeeds because it aligns with fundamental psychological principles of human decision-making:

### A. Commitment and Consistency (Cialdini)
Once an individual commits to a action (completing a purchase), their internal motivation to maintain consistency makes them significantly more receptive to related micro-decisions. Accepting an accessory that enhances the purchase they just made feels like a logical continuation of their initial choice.

### B. Price Anchoring & Contrast Effect
An accessory priced at $25 presented in isolation might trigger price evaluation. However, when presented immediately after a $200 primary purchase, $25 feels trivial in comparison. The mental baseline is anchored to $200, making $25 feel negligible.

### C. Zero Action Friction (Hyperbolic Discounting)
When a user has already authorized payment and entered shipping details, asking them to re-enter billing info introduces huge friction. Re-using vaulted payment tokens reduces the mental effort of a secondary purchase to zero ("1-click add").

### D. Psychological Ownership & Loss Aversion
Post-checkout buyers already feel ownership of the main product (*"My new headphones are on the way!"*). Framing the post-purchase cross-sell around protection or enhancement (*"Don't let your new headphones get scratched in your bag"*) triggers loss aversion.

---

## 2. Product Affinity & Offer Selection Matrix

Choosing the right offer post-purchase is critical. Mismatched offers create confusion and erode trust.

| Primary Product Category | High-Affinity Post-Purchase Cross-Sell | Ideal Price Ratio | Rationale |
| :--- | :--- | :--- | :--- |
| **Electronics / Hardware** | Protection plan, custom travel case, premium cables, screen protector | 10% – 20% | Protects primary investment; highly logical add-on. |
| **Apparel / Footwear** | Fabric/Leather care spray, specialty socks, cedar shoe trees | 10% – 15% | Extends longevity of fashion purchase. |
| **Consumables / Beauty** | Travel-size refills, sample packs, application brushes/tools | 15% – 25% | Low barrier to try complementary items. |
| **Subscription Box** | One-time "mystery bonus item" or past box favorite | 20% – 30% | Capitalizes on initial excitement before box arrives. |
| **SaaS / Digital Goods** | Annual billing upgrade (with discount), VIP 1-on-1 setup session | 20% – 40% | Instant value delivery with zero inventory cost. |
| **Event Tickets** | VIP lounge pass, parking pass, commemorative merchandise | 15% – 25% | Enhances event day experience. |

---

## 3. Pricing & Discount Heuristics

1. **The 25% Rule:** A post-purchase offer should rarely exceed 25% to 30% of the primary order total. A $100 upsell on a $40 purchase creates cognitive dissonance and high decline rates.
2. **Exclusive Post-Checkout Discounting:** Frame the price as a unique, one-time reward for purchasing (*"Save $15 exclusively because you ordered today"*).
3. **Free Shipping Framing:** Always clarify that the add-on item ships free in the same package (*"Ships free with your current order!"*).

---

## 4. Technical Payment Vaulting & Compliance Rules

### Payment Gateway Vaulting
- **Stripe:** Utilize `PaymentIntent` setup with `setup_future_usage: 'off_session'` or `confirmPayment` post-purchase extensions.
- **Shopify:** Leverage Shopify Post-Purchase Checkout Extensions (`@shopify/post-purchase-ui-extensions`).
- **Adyen / Braintree:** Utilize vaulted customer tokens generated during primary authorization.

### Strong Customer Authentication (SCA / PSD2 Compliance)
In regions governed by European PSD2 regulations:
- Ensure the initial payment authorization requests merchant-initiated transaction (MIT) exemptions or pre-authorizes potential incremental amounts where permitted by card schemes.
- If SCA step-up authentication is triggered by the issuing bank for the post-purchase charge, gracefully display a lightweight 3DS verification modal without breaking the order confirmation state.

---

## 5. UX Layout Guidelines for Interstitials & Confirmation Pages

### Interstitial Anatomy
```text
+-------------------------------------------------------------+
|  [✓] ORDER #12,345 CONFIRMED! SPECIAL ONE-TIME OFFER       |
+-------------------------------------------------------------+
|                                                             |
|   [ Product Image ]     Add the Custom Travel Case          |
|                         --------------------------          |
|                         - Shockproof hard shell             |
|                         - Cable storage compartment         |
|                         - Ships in the same box             |
|                                                             |
|                         Regular: $39.99                     |
|                         Post-Checkout Price: $24.99 (Save 37%)|
|                                                             |
|   [ YES! ADD TO MY ORDER FOR $24.99 (1-CLICK CHARGE) ]       |
|                                                             |
|            [ No thanks, take me to my order summary ]       |
|                                                             |
+-------------------------------------------------------------+
```

### UX Design Commandments
- **Always state the primary order is confirmed:** The top 20% of the screen must explicitly reassure the customer that their initial transaction succeeded.
- **One primary CTA:** Use a high-contrast primary action button containing the exact dollar amount and clear 1-click text.
- **Clean dismissal path:** Place a neutral text link below the primary CTA. Never obscure or hide the decline option.
