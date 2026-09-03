# Customer Review & Rating Audit Checklist

Use this checklist to systematically audit, score, and optimize customer review widgets, star rating summaries, filter controls, and UGC media displays on Product Detail Pages (PDPs).

---

## 1. Above-the-Fold Star Rating Anchor

- [ ] **Visibility & Placement:** Star rating visual (e.g., `★★★★☆`) and average score (e.g., `4.7`) are located directly below the primary product title and above price/variant selectors.
- [ ] **Review Count Link:** Total review count is explicitly shown (e.g., `(248 Reviews)`) and formatted as a clickable link or button.
- [ ] **Smooth Scroll Behavior:** Clicking the star rating or review count smooth-scrolls the viewport directly to the full review section without reloading the page.
- [ ] **Zero-Review Fallback:** For SKUs with zero reviews, display an encouraging anchor (e.g., `☆☆☆☆☆ Be the first to write a review`) rather than leaving empty space or hiding the title alignment.

---

## 2. Review Summary Header & Rating Distribution

- [ ] **Average Score & Recommendation Meter:** Overall numerical score (e.g., `4.7 / 5.0`) is highlighted alongside a customer recommendation percentage (e.g., `94% of buyers recommend this item`).
- [ ] **Interactive 5-Star Histogram:** Star distribution bars (5, 4, 3, 2, 1 star) display exact counts and percentages.
- [ ] **Histogram Filter Buttons:** Every bar in the histogram is an interactive button that instantly filters the review list when clicked.
- [ ] **Product Attribute Meters:** Key product characteristics (e.g., *Fit: Runs Small | True to Size | Runs Large*; *Quality: Average | High*) are displayed as visual scale bars based on aggregate buyer votes.

---

## 3. Review Search & Attribute Filtering

- [ ] **Keyword Search Input:** A search bar is positioned at the top of the review list with placeholder text encouraging queries (e.g., *"Search reviews for fit, material, battery life..."*).
- [ ] **Customer Attribute Filter Chips:** Multi-select filter chips are available based on relevant customer traits (e.g., Height, Weight, Size Purchased, Skin Type, Experience Level).
- [ ] **Clear Active Filters:** Active search terms and selected attribute chips are displayed as removable tags with a 1-click `"Clear All Filters"` button.
- [ ] **Flexible Sorting Controls:** A sort dropdown provides options for *Most Relevant*, *Most Recent*, *Highest Rating*, *Lowest Rating*, and *With Media*.

---

## 4. Review Cards & Trust Badges

- [ ] **Verified Purchase Badging:** Every verified buyer review features a prominent, high-contrast `✓ Verified Buyer` tag.
- [ ] **Purchased Variant Metadata:** Specific variant details (e.g., `Color: Slate Grey | Size: Medium`) are clearly visible on each review card.
- [ ] **Customer Profile Attributes:** Reviewer traits (e.g., *Height: 5'10", Usual Size: M*) are displayed adjacent to the reviewer name.
- [ ] **Helpfulness Voting:** Each card includes `"Was this helpful? 👍 Yes (12) 👎 No (1)"` buttons with live vote updating.
- [ ] **Official Brand Responses:** Merchant responses to critical (1-3 star) reviews are formatted distinctly under the customer review, demonstrating support responsiveness.

---

## 5. UGC Customer Media Showcase

- [ ] **Aggregated Photo & Video Gallery:** Customer-submitted images/videos are grouped into a dedicated visual carousel or grid at the top of the review section.
- [ ] **Lightbox Modal Inspection:** Clicking a customer thumbnail opens a full-screen lightbox modal displaying the high-resolution photo, reviewer details, and review text.
- [ ] **Direct Cart Addition from Lightbox:** Lightbox modal includes a button to select and add the exact shown variant to cart.
- [ ] **Lazy Loading & Performance:** All customer images are served compressed via CDN with native `loading="lazy"` to protect mobile page load speed.

---

## 6. Mobile Responsiveness & Accessibility

- [ ] **Touch Target Size:** All filter chips, star buttons, and search inputs have a minimum touch target area of `44px x 44px`.
- [ ] **Horizontal Overflow Prevention:** Attribute filter chips scroll smoothly horizontally or collapse into an accessible filter button without breaking page layout.
- [ ] **ARIA Labels & Screen Reader Support:** Star rating elements include proper `aria-label` tags (e.g., `aria-label="4.7 out of 5 stars based on 342 reviews"`).
- [ ] **Contrast Compliance:** Text labels, badge backgrounds, and star fill colors meet WCAG AA contrast ratio standards (minimum 4.5:1).

---

## Review Audit Scoring Matrix

| Section | Max Points | Points Earned | Priority Action Item |
| :--- | :--- | :--- | :--- |
| **1. Above-the-Fold Anchor** | 15 | | |
| **2. Summary Header & Histogram** | 20 | | |
| **3. Search & Attribute Filters** | 25 | | |
| **4. Cards & Trust Badging** | 20 | | |
| **5. UGC Media Showcase** | 10 | | |
| **6. Mobile & Accessibility** | 10 | | |
| **TOTAL SCORE** | **100** | | *(Scores < 70 indicate high conversion friction)* |
