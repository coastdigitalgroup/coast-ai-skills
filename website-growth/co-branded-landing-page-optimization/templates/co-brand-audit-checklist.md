# Co-Branded Landing Page Audit & Setup Checklist

Use this audit checklist and setup template to evaluate existing partner/influencer campaigns, identify trust leakages, reduce user friction, and implement dynamic co-branding capabilities on your website.

---

## 1. The Trust & Continuity Scorecard

Rate your current co-branded landing page experience across the 5 core pillars of referral continuity. Assign a score of **0 (Absent)**, **1 (Weak/Partial)**, or **2 (Strong/Fully Optimized)** to each criteria.

| Category | Audit Question | Score (0-2) |
| :--- | :--- | :--- |
| **Visual Handshake** | Does the landing page feature the referring partner's name, brand logo, or headshot above the fold? | |
| **Headline Matching** | Does the main page headline directly reference the partner or the specific pain point/hook emphasized in their referring content? | |
| **Incentive Alignment** | Is the specific discount, extended trial, or bonus promised by the partner highlighted as the primary offer on page load? | |
| **Catalog Curation** | Is the page layout restricted to the specific products or packages recommended by the partner, rather than showing a generic catalog? | |
| **Frictionless Redemption** | Is the promo code or discount automatically loaded and applied in the cart/checkout without requiring manual input or copy-paste? | |

### Score Diagnostics:
* **8–10 Points:** **Fully Optimized.** Trust is maintained, friction is minimized, and campaign conversion rates should be at peak performance.
* **5–7 Points:** **Leaky Funnel.** There is an active disconnect causing cognitive fatigue. Users are drop-shipping or leaving checkout because of mismatched expectations.
* **0–4 Points:** **Bait-and-Switch Experience.** You are burning ad/sponsorship budget. Users are bouncing because they feel they landed on the wrong page.

---

## 2. Referral Journey Friction Checklist

Perform a manual test-through of the campaign referral funnel from a mobile device (where influencer traffic primarily lives) and check the boxes below.

### Phase A: Landing Page Discovery (Above-the-Fold)
- [ ] **2-Second Reassurance:** A user can confirm within 2 seconds of page load that they are receiving the exclusive partner deal.
- [ ] **No Overlap Blockers:** The co-branded "Welcome Handshake" banner does not overlap with other cookie notices, welcome popups, or general announcement bars.
- [ ] **Proportionate Sizing:** The partner’s logo or image does not exceed 15% of the viewport height on mobile, keeping pricing and value propositions visible.
- [ ] **Load Time Under 2s:** The page fully renders (including partner images and media) in under 2.0 seconds on a simulated 3G/4G cellular network.

### Phase B: Curated Content & Social Proof
- [ ] **Direct Quote Display:** The landing page features an explicit quote/testimonial from the referring partner with high typographic contrast.
- [ ] **Single Clear CTA:** There is only one primary call to action (e.g., "Claim [Partner Name]'s Offer") rather than multiple competing choices.
- [ ] **Visual Validation:** Product photos match the exact color/style featured in the partner's referral content.

### Phase C: Cart & Checkout Seamlessness
- [ ] **Dynamic Pricing Update:** When the partner link is used, all pricing tables on the landing page immediately reflect the discounted prices (e.g., showing retail crossed out and the partner price in red/green).
- [ ] **Auto-Applied Discount:** The coupon is automatically loaded in the background via URL query parameters or referral cookie headers.
- [ ] **No Coupon Field Distraction:** The coupon input box at checkout is collapsed or subordinated so users aren't tempted to leave and hunt for a different, larger coupon code.
- [ ] **Preserved Attribution:** Navigating back and forth between product pages and the cart does not drop the partner's referral tag or cookie.

---

## 3. Co-Branded Layout Blueprint (Wireframe Guide)

```text
+-----------------------------------------------------------------------+
| [Brand Logo]    ×    [Partner Logo / Headshot]   [Welcome Partner!]   |  <-- Co-Brand Welcome Bar (Sticky on scroll, max 50px tall)
+-----------------------------------------------------------------------+
|                                                                       |
|  "The Premium Setup Curated by [Partner Name] for [Community Name]"  |  <-- Contextual Hero Headline
|                                                                       |
|  [Custom 45-Second Partner Welcome Video or Curated Product Hero]      |  <-- Visual Reassurance
|                                                                       |
|  +---------------------------+    +--------------------------------+  |
|  | Standard Bundle           |    | [Partner Name]'s Recommended   |  |
|  |                           |    |   STARTER SET                  |  |
|  | Price: $150               |    |   Price: $127.50 (Save 15%)    |  |  <-- Dynamic Price Crossing
|  | [Select]                  |    |   [Claim Partner Offer]        |  |  <-- Benefit-Led CTA Button
|  +---------------------------+    +--------------------------------+  |
|                                                                       |
+-----------------------------------------------------------------------+
|  "[Partner Quote/Review: Why this product is a game-changer for me]"  |  <-- Custom Testimonial Card with Creator Headshot
+-----------------------------------------------------------------------+
|  "Why [Brand Name] is the choice of [Partner Name]'s followers..."     |  <-- Value Props tailored to referred audience pain-points
+-----------------------------------------------------------------------+
|  [FAQs: Delivery, Warranty, Trial Length, and Support]                |  <-- Risk Reversal & Friction Reducers
+-----------------------------------------------------------------------+
```

---

## 4. JavaScript Blueprint: Dynamic Query-Based Co-Branding

If you are using a unified landing page template and need to personalize it dynamically for multiple partners without hard-coding separate HTML files, deploy this reusable vanilla JavaScript helper script.

It automatically parses URL parameters (e.g., `?partner=Julian&code=JULIAN15&discount=15`) to update the welcome banner, pricing cards, and inject partner coupon codes into local storage or cookies for the checkout.

```javascript
/**
 * Dynamic Co-Branded Landing Page Controller
 * Deploy this on your landing page template to parse query parameters
 * and personalize the user experience dynamically.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Helper function to parse URL query parameters
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // 2. Extract partner variables from URL
  const partnerName = getQueryParam("partner");  // e.g., ?partner=Julian's Kitchen
  const promoCode = getQueryParam("code");        // e.g., &code=JULIAN15
  const discountVal = getQueryParam("discount");   // e.g., &discount=15 (percent or dollar)

  // 3. Fallback check: If no partner is specified, exit script (show default brand elements)
  if (!partnerName) {
    console.log("No partner parameter detected. Displaying standard layout.");
    return;
  }

  // 4. Update the Co-Branded Visual Welcome Handshake Bar
  const welcomeBar = document.getElementById("cobrand-welcome-bar");
  const welcomeText = document.getElementById("cobrand-welcome-text");

  if (welcomeBar && welcomeText) {
    welcomeText.textContent = `Welcome ${partnerName} viewers! Your exclusive discount is auto-applied at checkout.`;
    welcomeBar.style.display = "flex"; // Reveal the hidden co-branded welcome bar
  }

  // 5. Update Dynamic Headlines & Subtitles on Page
  const dynamicHeadline = document.getElementById("cobrand-hero-headline");
  if (dynamicHeadline) {
    dynamicHeadline.textContent = `The Custom Setup Curated by ${partnerName}`;
  }

  // 6. Apply Dynamic Pricing Adjustments
  if (discountVal) {
    const originalPriceElements = document.querySelectorAll(".retail-price");
    const discountedPriceElements = document.querySelectorAll(".discounted-price");
    const savingsBadges = document.querySelectorAll(".savings-badge");

    originalPriceElements.forEach(el => {
      const basePrice = parseFloat(el.getAttribute("data-base-price"));
      if (!isNaN(basePrice)) {
        // Cross out original retail price
        el.style.textDecoration = "line-through";
        el.style.opacity = "0.6";

        // Calculate and apply discount (assumes percentage discount)
        const discountFactor = (100 - parseFloat(discountVal)) / 100;
        const finalPrice = (basePrice * discountFactor).toFixed(2);
        const savedAmount = (basePrice - finalPrice).toFixed(2);

        // Update discounted pricing fields
        discountedPriceElements.forEach(dpEl => {
          if (dpEl.getAttribute("data-product-id") === el.getAttribute("data-product-id")) {
            dpEl.textContent = `$${finalPrice}`;
            dpEl.style.fontWeight = "bold";
            dpEl.style.color = "#2e7d32"; // Green conversion color
          }
        });

        // Update savings badges
        savingsBadges.forEach(sbEl => {
          if (sbEl.getAttribute("data-product-id") === el.getAttribute("data-product-id")) {
            sbEl.textContent = `SAVE $${savedAmount} INSTANTLY`;
            sbEl.style.display = "inline-block";
          }
        });
      }
    });
  }

  // 7. Store Promo Code in LocalStorage / Cookie for Checkout Redirection
  if (promoCode) {
    localStorage.setItem("applied_partner_promo", promoCode);

    // Set cookie as fallback for cross-subdomain checkout redirection
    const maxAgeOneWeek = 60 * 60 * 24 * 7;
    document.cookie = `applied_partner_promo=${promoCode}; path=/; max-age=${maxAgeOneWeek}; SameSite=Lax; Secure`;

    console.log(`Partner promo [${promoCode}] successfully stored in user session.`);
  }
});
```
