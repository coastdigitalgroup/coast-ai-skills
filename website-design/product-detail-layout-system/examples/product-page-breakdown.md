# Product Page Layout Breakdown: Vanguard Expedition Parka

This example breaks down the visual and spatial design of a high-performance e-commerce Product Detail Page (PDP) for the **Vanguard Expedition Parka**. It demonstrates the implementation of the `product-detail-layout-system` on a highly complex product containing multiple media types, extensive variant attributes, dynamic pricing, and crucial trust and shipping disclosures.

---

## 1. Spatial Structure & Desktop Grid Composition

On desktop screens (`>= 1024px`), the layout is split into an asymmetrical 2-column CSS Grid. The visual assets (Left column) are given greater spatial presence than the configuration tools (Right column) to establish immediate emotional connection and anchor user attention.

```
+-----------------------------------------------------------------------------------+
|                                 GLOBAL HEADER                                     |
+-----------------------------------------------------------------------------------+
|  Shop > Apparel > Outerwear                                                       |
+------------------------------------------------------+----------------------------+
|                                                      | H1: Vanguard Parka         |
|                     [MAIN IMAGE]                     | [★ ★ ★ ★ ☆ (128)]          |
|                     (Aspect 1:1)                     | [Price: $299.00]           |
|                                                      |                            |
|                                                      | [Color Swatches]           |
|                                                      | [Size Selector Buttons]    |
|                                                      |                            |
|                                                      | [QTY]  [ADD TO CART (CTA)] |
|                                                      |                            |
|  [THUMB 1] [THUMB 2] [THUMB 3] [THUMB 4]             | [✓ Free Shipping & Returns]|
|                                                      | [Product Specs Accordion]  |
+------------------------------------------------------+----------------------------+
|                               SITE FOOTER                                         |
+-----------------------------------------------------------------------------------+
```

### CSS Grid Architecture (Desktop)
```css
.product-detail-container {
  display: grid;
  grid-template-columns: minmax(500px, 1.2fr) minmax(400px, 1fr);
  gap: clamp(24px, 5vw, 48px); /* Fluid gutter prevents columns from squeezing */
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-m) var(--space-l);
}

/* Sticky Left Panel Container */
.product-media-pane {
  position: sticky;
  top: calc(var(--global-header-height) + var(--space-m));
  align-self: start; /* Prevents column stretching to match the tall buy box height */
}

/* Right Scrollable Panel */
.product-configurator-pane {
  display: flex;
  flex-direction: column;
}
```

---

## 2. Left Column: Media Gallery Specification

To guarantee layout stability (zero CLS) and provide premium media interaction, the media gallery uses fixed aspect ratios and nested layout constraints:

- **Main Display Block:** Constrained to a strict `1:1` aspect ratio (`aspect-ratio: 1 / 1;`). It utilizes a `width: 100%` width with `object-fit: cover;` and is styled with a subtle `border-radius: 8px`. If an image is slow to load, the container retains its dimensions, preventing the right-hand Buy Box content from layout shifting.
- **Support Thumbnails:** Formatted in a horizontal flex strip below the main image:
  - **Padding/Gap:** `gap: var(--space-xs) (12px)`.
  - **Sizing:** Fixed at `80px x 80px`.
  - **Interaction Affordance:** The currently active thumbnail features a solid `3px solid var(--color-primary-accent)` border ring with a 2px interior white gap, and is annotated with `aria-current="true"`. Non-active thumbnails have a light gray `1px solid var(--border-neutral)` border.
- **Enlarge Modal (Lightbox) Trigger:** A circular button (44px diameter, `z-index: 10`) sits in the bottom-right corner of the main image, styled with a translucent glassmorphism background (`backdrop-filter: blur(4px); background: rgba(255, 255, 255, 0.7)`). Clicking it loads the high-resolution zoom interface (`image-gallery-and-lightbox-system`).

---

## 3. Right Column: Buy Box Visual Hierarchy & Typography

The right column ("Buy Box") is a scannable vertical stack structured using standard typographic hierarchies and clear proximity guidelines:

```
[Breadcrumbs]                     -- Font: 14px Regular, Gray 500 (Muted)
    v  Gap: 8px (--space-xxs)
[H1: Vanguard Expedition Parka]   -- Font: 36px Bold, Slate 900 (Primary Anchor)
    v  Gap: 12px (--space-xs)
[Reviews Block (Stars + Link)]    -- Font: 14px Medium, Amber 500 / Blue link
    v  Gap: 24px (--space-m)
[Pricing Engine Block]            -- Active: 28px Extra-Bold, Crimson (or Dark)
                                  -- MSRP: 18px Strikethrough, Gray 400
                                  -- Installments: 14px Regular, Gray 600
    v  Gap: 32px (--space-l)
[Variant Swatch Area]             -- Labels: 14px Semi-Bold, Slate 800
                                  -- Swatches: 32px Circles / 12px Gaps
    v  Gap: 24px (--space-m)
[Variant Size Button Matrix]      -- Buttons: 48px Height, Slate 900 / Bordered
    v  Gap: 32px (--space-l)
[Action Row (Qty + CTA Button)]   -- Qty: 48x48px, CTA: 48px Height (Full width)
    v  Gap: 16px (--space-s)
[Trust Badge Row]                 -- Icons + Labels: 13px Regular, Green 800
    v  Gap: 40px (--space-xl)
[Specifications Accordion]        -- Trigger: 44px Height, Details: 15px Regular
```

### Proximity Rules Applied
- Related elements are tightly grouped. For example, the **Product Title** and **Reviews link** are separated by just `12px` to establish structural relation.
- Interactive sections are clearly separated. The **Variant Configurator** sits a generous `32px` below the pricing block to indicate a new decision area.
- Trust markers are placed directly within `16px` of the primary Add to Cart CTA to immediately combat checkout anxiety.

---

## 4. Variant Configurator: Swatch & Sizing Matrix

To make choices clear and accessible, variants utilize highly interactive patterns that avoid relying purely on visual cues:

### Color Swatches (Visual Toggles)
- **Geometry:** 32px diameter circles.
- **Active State:** Indicated by a concentric focus border. The circle has a `2px` white border, which is itself surrounded by a `2px solid var(--color-primary-accent)` ring (Total diameter: 40px). This ensures color separation and meets contrast requirements.
- **Hover State:** Circle scales smoothly up by 10% (`transform: scale(1.1)`) with a 150ms ease transition.
- **Accessibility:** Color swatches are implemented using semantic `<input type="radio">` grouped under a `<fieldset>`. A screen reader hears: *"Color Radio Group, Crimson Red, Selected, 1 of 3"*.

### Sizing Buttons (Adaptive Matrix)
- **Layout:** Flex row with `gap: 8px`.
- **States:**
  - **Selected:** Solid background (`background: var(--color-slate-900); color: var(--color-white);`).
  - **Unselected:** Bordered style (`background: var(--color-white); color: var(--color-slate-900); border: 1px solid var(--border-neutral);`).
  - **Out of Stock:** Diagonal strikethrough line overlaid via a CSS background linear-gradient, with color opacity reduced to `0.4` (`cursor: not-allowed`).
  - **Focus Ring:** Explicit `:focus-visible` ring (`outline: 3px solid var(--color-blue-focus); outline-offset: 2px`).

---

## 5. Mobile Stacking & Sticky Bottom Buy Drawer

On mobile viewports (`< 768px`), the layout collapses into a single vertical scroll stream. To prevent the primary purchase action from being lost down the page, a mobile-optimized sticky drawer activates:

```
+--------------------------------------------------+
|                  MOBILE HEADER                   |
+--------------------------------------------------+
|                                                  |
|                   [MAIN MEDIA]                   |
|                                                  |
|   Vanguard Parka                                 |
|   $299.00                                        |
|                                                  |
|   ... Long scrolling details ...                 |
|   ... Specs Accordion ...                        |
|                                                  |
|                                                  |
+--------------------------------------------------+
| [Thumb] Vanguard Parka  | $299.00 | [ ADD TO CART ]| <-- STICKY BOTTOM DRAWER
+--------------------------------------------------+
```

### Mobile Sticky Buy Drawer Behavior
1. **Trigger threshold:** The drawer is completely hidden (`transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);`) when the primary inline CTA button is visible on-screen.
2. **Activation:** Once the page is scrolled past the inline buy CTA (Threshold > 600px of scroll), the drawer translates up into view: `transform: translateY(0);`.
3. **Safe-Area Insets:** The drawer's bottom padding uses environment variables to prevent overlapping the mobile system navigation bar:
   ```css
   .mobile-sticky-buy-drawer {
     position: fixed;
     bottom: 0;
     left: 0;
     right: 0;
     z-index: 150;
     background: var(--color-canvas-white);
     border-top: 1px solid var(--border-neutral-muted);
     padding: var(--space-s) var(--space-m) calc(var(--space-s) + env(safe-area-inset-bottom)) var(--space-m);
     display: flex;
     align-items: center;
     justify-content: space-between;
   }
   ```
4. **Internal Layout:** The left side displays a compact visual: a `40x40px` image thumbnail alongside the active variant selection and price. The right side contains a full-height, high-contrast **Add to Cart** button to enable single-tap conversion.

---

## 6. Accessibility Map & ARIA Flow

To satisfy WCAG AA standards, the layout is mapped with explicit roles and screen-reader announcements:

- **Semantic Landmark Regions:**
  - Left column is labeled: `<section aria-label="Product Media Gallery">`
  - Right column is labeled: `<section aria-label="Product Purchase Configurator">`
- **Dynamic Price Announcements:**
  When a user toggles between the Crimson Red and Dark Charcoal color options, the price or stock status might update. To inform blind users without disrupting focus, we target an invisible live region:
  ```html
  <div id="pdp-live-announcer" class="sr-only" aria-live="polite"></div>
  ```
  *Javascript update routine:*
  ```javascript
  const announcer = document.getElementById('pdp-live-announcer');
  announcer.textContent = "Color updated to Dark Charcoal. Price is two hundred ninety-nine dollars. In stock.";
  ```
- **Star Rating Trigger:**
  The rating text link (`<a href="#reviews">128 reviews</a>`) uses `scroll-behavior: smooth;` to glide to the bottom of the page. It programmatically sets focus to the `#reviews` heading which has `tabindex="-1"`, allowing keyboard users to tab immediately into the actual review items.
