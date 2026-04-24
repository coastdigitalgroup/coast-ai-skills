# PLP Optimization: Before vs. After

This example illustrates a Product Listing Page (PLP) overhaul for a fictional
consumer electronics retailer, "TechFlow."

## Scenario: The "Information-Thin" Grid

**Site:** TechFlow (Consumer Electronics) **Problem:** High bounce rate on
category pages and significant "pogo-sticking" (users clicking products and
returning in <3 seconds).

---

## BEFORE: The Standard Grid

- **Layout:** 4-column grid on desktop, 1-column on mobile.
- **Filters:** A long list of 15 checkboxes on the left sidebar, all expanded.
- **Product Card:**
  - Small product image.
  - Product title (often truncated).
  - Price (small font).
  - "View Details" button.
- **Mobile:** Filters are at the top, requiring 3 screens of scrolling to see
  the first product.

### Issues:

1. **Choice Paralysis:** The expanded sidebar is overwhelming.
2. **Hidden Context:** Users don't know if a laptop has the right RAM or Screen
   Size until they click the PDP.
3. **Mobile Friction:** The vertical stack makes discovery extremely slow.

---

## AFTER: The Optimized Discovery Hub

- **Layout:** 3-column grid on desktop (larger images), 2-column grid on mobile.
- **Faceted Search:**
  - **3-Filter Rule:** Only "Price," "Brand," and "Processor" are expanded.
    Others are collapsed under a "More Filters" header.
  - **Visual Cues:** Color filters use actual color swatches.
- **Optimized Product Card:**
  - **High-Scent Data:** Key specs (RAM, Storage, Screen Size) added directly to
    the card.
  - **Social Proof:** Star rating and review count added.
  - **Inventory Transparency:** "In Stock - Ships Today" label added.
  - **Visual Scent:** Small swatches show available color options.
- **Mobile Discovery:**
  - **Persistent Trigger:** A floating "Filter & Sort" button at the bottom of
    the screen.
  - **Full-Screen Drawer:** Tapping "Filter" opens a dedicated UI that doesn't
    push the products down.

### Measurable Results:

- **PLP-to-PDP CTR:** Increased by 22% as users find relevant products faster.
- **Pogo-Sticking:** Decreased by 45% because users have enough info to
  "pre-qualify" a product before clicking.
- **Mobile Conversion:** 15% lift in checkout starts from mobile users.
