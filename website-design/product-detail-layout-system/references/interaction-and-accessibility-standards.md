# PDP Interaction & Accessibility Reference Standards

This document establishes critical interaction specifications, spatial target metrics, and WCAG AA accessibility patterns for e-commerce Product Detail Pages (PDPs) built with the `product-detail-layout-system`.

---

## 1. Spatial Touch Target Blueprint (WCAG 2.2 SC 2.5.8)

To ensure the buying container is fully operable on mobile devices and prevents accidental clicks, variant selectors, swatch bubbles, and control buttons must satisfy minimum physical touch target metrics:

```
                  TOUCH TARGET SIZE SCHEMATICS

      Variant Swatch Circle                Size Pill Selector

       +------------------+                +-----------------------+
       |   Total Target   |                |     Total Target      |
       |     44x44px      |                |       Height: 48px    |
       |                  |                |                       |
       |     +------+     |                |     +-----------+     |
       |     |32px  |     |                |     |   "M"     |     |
       |     |Visual|     |                |     |   Visual  |     |
       |     +------+     |                |     +-----------+     |
       |                  |                |                       |
       +------------------+                +-----------------------+
       |<-- Gap: 12px -->|                 |<---- Gap: 8px ------->|
```

### Metrics Table
| UI Component | Minimum Visual Size | Target Footprint | Minimum Separation Gaps |
| :--- | :--- | :--- | :--- |
| **Color Swatch Circles** | 32px diameter | **44x44px** | 12px vertical/horizontal gap |
| **Sizing Option Pills** | 48px width / height | **48x48px** | 8px row/column gap |
| **Quantity Increment Buttons (`+`/`-`)** | 40x40px | **44x44px** | 0px (when encapsulated in 48px border) |
| **Primary Purchase CTA Button** | Full Buy-Box width / 48px height | **Full Width / 48px** | 16px bottom margin |
| **Review Star Link Anchor** | Line-height 20px | **44px vertical height** | 24px bottom margin |

---

## 2. Accessible Variant Selector Markup Pattern

Many e-commerce systems utilize unsemantic `div` or `span` elements styled to look like selectors, which renders them invisible to keyboard-only and screen-reader users. The `product-detail-layout-system` mandates the use of visually hidden but fully semantic `<input type="radio">` tags:

```html
<fieldset class="variant-section">
  <!-- Semantic Legend names the category and houses active selection preview -->
  <legend class="variant-label">
    Color: <span id="active-color" class="variant-preview">Forest Green</span>
  </legend>

  <div class="swatch-group">
    <!-- Crimson Red Swatch Option -->
    <label class="swatch-item">
      <input type="radio" name="color-variant" value="crimson-red" aria-describedby="active-color">
      <span class="swatch-visual" style="background-color: #be123c;" title="Crimson Red"></span>
      <span class="sr-only">Crimson Red</span>
    </label>

    <!-- Forest Green Swatch Option -->
    <label class="swatch-item">
      <input type="radio" name="color-variant" value="forest-green" checked aria-describedby="active-color">
      <span class="swatch-visual" style="background-color: #15803d;" title="Forest Green"></span>
      <span class="sr-only">Forest Green</span>
    </label>
  </div>
</fieldset>
```

### Advantages of this Pattern
1. **Native Radio Group Grouping:** The browser automatically handles selection exclusivity (checking one unchecks others).
2. **Keyboard Arrow Navigation:** Standard arrow keys (`Left`, `Right`, `Up`, `Down`) automatically move selection and focus between options.
3. **Built-in Focus Ring:** Browser handles `:focus-visible` outline routing natively, keeping keyboard pathways clean.

---

## 3. Dynamic Price & Stock Updates (ARIA Live Polite)

When variant selections change, the price, SKU, or stock warning on the page may update. Screen readers must be informed of these background content updates instantly:

### Announcement Mechanism
1. Place an empty, visually hidden live region container directly in the HTML document body:
   ```html
   <div id="pdp-status-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
   ```
2. When the user changes a color or size, compute the new string state and push it into the announcer container:
   ```javascript
   function announcePdpUpdates(selectedColor, selectedSize, priceString, stockStatus) {
     const announcer = document.getElementById('pdp-status-announcer');
     announcer.textContent = `Selected ${selectedColor} in size ${selectedSize}. Price updated to ${priceString}. ${stockStatus}.`;
   }
   ```
3. *Why `aria-live="polite"`?* This ensures that the screen reader waits until the user finishes active typing or arrow-keying before speaking the update, avoiding jarring voice interruptions.

---

## 4. Keyboard Navigation Sequence Map

Tabbing through the Product Detail Page must flow in a predictable, linear path matching the visual reading order:

```
[Global Header] -> [Breadcrumb link 1] -> [Breadcrumb link 2]
                       v
[Thumbnail Button 1] -> [Thumbnail Button 2] -> [Enlarge Image Trigger]
                       v
[Rating Star Review Link] -> [Size Radio S] -> [Size Radio M] -> [Size Radio L]
                       v
[Quantity Decrement Button] -> [Quantity Increment Button] -> [Add to Cart CTA]
                       v
[Product Specifications Accordion Trigger] -> [Footer Links]
```

### Key Navigation Requirements
- **Review Links:** The star reviews link (`<a href="#reviews">`) must jump the keyboard focus directly to the reviews section using `tabindex="-1"` on the reviews header target so the user does not have to tab through the entire buy box again to read comments.
- **Scroll Margin:** All target ID hashes on the PDP must specify:
  ```css
  #reviews {
    scroll-margin-top: calc(var(--global-header-height) + var(--space-m));
  }
  ```
  This prevents sticky navigation headers from covering the focused reviews block when scrolled.
- **Carousel Controls:** If the media gallery uses an active slide carousels, arrow keys must navigate slides, and `Home`/`End` keys must move focus to first/last slides respectively, following the ARIA APG Carousel Pattern.
