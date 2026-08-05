---
name: product-detail-layout-system
description:
  Design a systematic, high-conversion, and accessible layout framework for
  e-commerce and product detail pages (PDP), defining spatial composition,
  media gallery grids, configurator buy-boxes, and responsive bottom-docking adaptations.
---

# Product Detail Layout System

## Purpose

The Product Detail Layout System provides a standardized, high-performance visual and spatial framework for structuring e-commerce Product Detail Pages (PDPs). The Product Detail Page is the most critical conversion engine of any e-commerce or direct-to-consumer website. It requires balancing rich media, multi-variant configurators, dynamic pricing models, trust signaling, and primary calls-to-action (CTAs) within a cohesive, scannable, and completely accessible interface.

A systematic approach resolves common design friction points—such as unaligned purchasing grids ("Buy Boxes"), disorienting media sliders, layout shifting during variant switches (CLS), hidden mobile buy triggers, and critical accessibility blocks on custom selectors. This system bridges the gap between marketing presentation and technical implementation, ensuring pages load stably and drive maximum conversion while strictly complying with WCAG AA standards.

## Use Cases

- **B2C & Direct-to-Consumer (DTC) E-commerce:** Designing highly polished product pages for physical goods, apparel, cosmetics, or electronics.
- **Digital Product & Subscription Sales:** Organizing feature highlights, tier selectors, and payment checkouts on software, membership, or service landing pages.
- **Industrial and B2B Catalog Pages:** Structuring complex, spec-heavy hardware parts pages with downloadable schematics and quote builders.
- **Marketplace Detail Views:** Standardizing layout grids for diverse multi-vendor listings (real estate, travel bookings, peer-to-peer sales).

## When NOT to Use

- **SaaS Plan Comparison Landing Pages:** For comparing distinct subscription packages side-by-side, use `pricing-table-ui-system` or `comparison-matrix-system`.
- **Primary Product Discovery (PLPs):** For browsing catalogs or search result lists, use `card-ui-system` and `filter-and-sort-system`.
- **Simple Lead Capture or Forms:** For basic contact forms, newsletters, or single-step signups, use `form-design-system`.
- **Editorial & Blog Content:** For narrative storytelling, newsletters, and text-only columns, use `article-layout-system`.

## Inputs

1. **Content & Asset Inventory:** High-resolution product images/videos (aspect ratios, zoom requirements), specifications, reviews, price structures, and trust guarantees.
2. **Variant Matrix Complexity:** Number of options (e.g., color, size, material) and the presence of dependency relationships (e.g., "Size L only available in Black").
3. **Typography & Spacing Scale:** Relative size scales and fluid spacing tokens (from `fluid-typography-system` and `fluid-spacing-system`).
4. **Elevation and Color Tokens:** Brand accent colors, status shades (sale, warning, stock-out), surface elevations, and active/focus/hover states (from `accessible-color-system` and `elevation-and-depth-system`).
5. **Mobile Viewport constraints:** Viewport bounds and device notches (notably iOS home indicator and browser menu bars).

## Outputs

1. **Dual-Pane Spatial Blueprint:** Structural grid dividing the screen into a high-impact left-hand Media Pane and a scannable right-hand Purchase Configurator Pane (Buy Box).
2. **Responsive Stacking & Flow Rules:** Transition specifications showing how the layout collapses into a mobile-optimal vertical stack.
3. **Mobile Sticky Buy Drawer:** Specification for a viewport-docked purchase bar that persists on mobile viewports past the main CTA fold.
4. **Interactive Swatch & Selector Anatomy:** Component-level designs for size buttons, color swatches, and quantity counters.
5. **Aria live & Keyboard Spec:** Clear keyboard tab-routes, roving tabindexes, focus retention, and status-announcement triggers for screen reader compliance.

---

## Workflow

### 1. Establish the Dual-Pane Spatial Layout (Desktop >1024px)
Structure the desktop view using a 2-column CSS Grid or Flexbox layout, split proportionally:
- **Left Column: The Media Pane (Spans 50–55%):** Displays high-fidelity visual product assets. To prevent users from losing their purchase context during long scrolls, set the parent column to `align-items: start;` and make the media container sticky: `position: sticky; top: calc(var(--global-header-height) + var(--space-m));`.
- **Right Column: The Purchase Configurator / Buy Box (Spans 45–50%):** Houses all metadata and transaction controls. Keep it in a single vertical column with a clear hierarchy that reads top-to-bottom.
- **Grid Gutter:** Maintain a generous visual gutter (e.g., `gap: clamp(24px, 4vw, 48px)`) to keep media and controls distinct but unified.

### 2. Design the Visual Hierarchy of the Purchase Configurator (Buy Box)
Apply the "F-Pattern" reading flow down the Buy Box column. Order elements logically:
1. **Breadcrumbs & Category Indicator:** Small, muted text at the top (e.g., "Shop > Outdoor > Jackets") for context.
2. **Product Header:** Primary title using `h1` styled at `font-size: clamp(1.75rem, 3.5vw, 2.5rem)` with bold weight.
3. **Social Proof Summary:** Star-rating block displaying average rating and active text link to scroll down directly to the reviews section (e.g., "★ ★ ★ ★ ☆ (128 reviews)").
4. **Pricing Engine Block:** Highly visible pricing. Bold active price, smaller crossed-out MSRP (if on sale), and a clear colored sale badge (e.g., "Save $20"). Place installment messages (e.g., "Or 4 payments of $25 with Klarna") immediately below.
5. **Variant Configurator:** Sizing, color swatches, or materials. Use consistent label titles and spacing gaps (e.g., `margin-bottom: var(--space-m)`).
6. **Inventory & Shipping Reassurance:** Subtle real-time stock alerts (e.g., "● Only 3 left in stock - ships tomorrow") in proximity to variants.
7. **Primary Purchase CTA:** Prominent, high-contrast "Add to Cart" or "Buy Now" button stretching the full width of the Buy Box.
8. **Trust Badges & Return Policies:** Highly visible icon/text clusters (e.g., "✓ Free Shipping", "✓ 30-Day Returns") placed directly under the primary CTA to minimize purchase friction.

### 3. Structure the Left-Hand Media Gallery
Organize imagery to ensure navigation is fast, lightweight, and preserves layout stability:
- **Main Display Container:** Anchor the active image in a container with a fixed aspect ratio (typically `1:1` square or `3:4` portrait) using `aspect-ratio: 1 / 1; object-fit: cover;`. This prevents Cumulative Layout Shift (CLS) when loading images of slightly varying sizes.
- **Thumbnails Navigation:** Stack supportive thumbnails horizontally below the main image (or vertically to the left). Ensure active thumbnails have a high-contrast border and `aria-current="true"`.
- **Enlarge/Zoom Trigger:** Include a subtle zoom icon in the bottom-right corner of the active image. Triggering it opens a full-screen, swipeable modal lightbox (`image-gallery-and-lightbox-system`).

### 4. Create the Mobile Stacking & Mobile Sticky Buy Drawer (<768px)
On mobile screens, standard multi-column layouts break. Apply these adaptation rules:
- **Linear Vertical Flow:** Collapse the page into a single-column stack. Place the Media Gallery at the very top (full width or slightly inset), immediately followed by the Product Header, Price, Variant Configurator, CTA, and then detailed specifications.
- **The Mobile Sticky Buy Drawer:** Because the primary CTA scrolls off the screen quickly on mobile, implement a sticky bottom checkout drawer:
  - Keep the drawer hidden when the inline CTA is visible on the screen.
  - Once the user scrolls the inline CTA out of view (Threshold > 600px scroll), slide up a compact sticky bottom bar containing: [Product Thumbnail + Title] (optional/collapsed on small viewports), [Price], and a [Primary Add to Cart CTA] spanning the right-hand half of the bar.
  - Utilize `padding-bottom: env(safe-area-inset-bottom);` to respect mobile device swipe zones and prevent overlaps with system controls.

### 5. Standardize Custom Swatch & Variant Selector Interaction
Custom selectors (such as color circles or button matrices) must look polished and interact cleanly:
- **Visual Swatches:** Color circles must be at least `32x32px` on desktop and `40x40px` on mobile. Active swatches are indicated by an external concentric border ring (leaving a 2px gap of white space between the color circle and the border).
- **Size Buttons:** Use rounded pill outlines for sizes (e.g., "S", "M", "L"). Cross out and dim unavailable sizes (e.g., opacity `0.4` with a diagonal line slash) but keep them focusable so screen readers can announce "Size S - Out of Stock".
- **Dynamic Feedback:** Toggling a swatch must instantly update the visible price, inventory notice, and main image gallery without refreshing the entire page.

### 6. Design for Keyboard Navigation and Screen Reader Accessibility
Custom configurators are frequent sites of accessibility failure. Apply these strict guidelines:
- **Semantic Swatch Selection:** Implement swatches using standard `<input type="radio">` wrapped in `<label>` tags, styled to hide the native input visually while keeping it fully accessible. This guarantees native arrow-key navigation, automatic radio grouping, and keyboard focus states.
- **Aria Live Announcements:** When a user selects a swatch or variant, use an invisible `aria-live="polite"` div to announce the update to screen readers (e.g., "Selected Color: Crimson Red. Price updated to ninety-nine dollars. In stock.").
- **Skip Links & Contextual Anchors:** Ensure the "Rating Star Review link" has a visible focus ring and scrolls the keyboard focus smoothly down to the Review Section (`#reviews`) using `tabindex="-1"` on the destination.

---

## Decision Rules

### Swatch Style Selection

| Options Count | Recommended UI Selector Pattern | Design Rationale |
| :--- | :--- | :--- |
| **2 - 5 Options** (e.g., Red, Blue, Green) | **Visual Pill Buttons or Swatches** | Immediate visibility, low cognitive load, easy single-tap targets. |
| **6 - 15 Options** (e.g., 10 shoes sizes) | **Adaptive Flex Grid Matrix** | Compact grouping, fits neatly in Buy Box column without long scroll. |
| **16+ Options** (e.g., 50 device models) | **Custom Select Menu with Search** | Prevents visual clutter and overwhelming "choice paralysis" layout blocks. |

### Layout Splitting (Desktop vs. Tablet Viewports)
- **Desktop (>1024px):** 2-Column Grid (Sticky Left Media, Scrolling Right Configurator).
- **Tablet (768px - 1023px):** Re-evaluate column widths. Shift to a **50/50 split** or collapse the layout early to a **Single Column stack** with a simplified left-aligned container if the variant configurator contains dense matrix inputs.
- **Mobile (<768px):** Strict 1-Column stack. Active Mobile Sticky Buy Drawer triggers on scroll.

### Price Presentation Strategy
- **On-Sale Presentation:** Render the active sale price in high-contrast red or brand bold (minimum 24px/`1.5rem`). Render the original price (MSRP) crossed out in a muted gray next to it, and include a compact, solid-fill pill badge indicating savings (e.g., "Save $30" or "-25%") to maximize perceived value.
- **Standard Presentation:** Render the active price in bold neutral-dark/neutral-light (matching primary body heading color).

---

## Constraints

- **Accessibility (WCAG AA Minimum):**
  - **SC 2.4.11 Focus Not Obscured:** Ensure that focusable variant pills or quantity buttons are never obscured by sticky headers or the mobile bottom buy drawer. Use global `scroll-margin-top` and `scroll-margin-bottom` appropriately.
  - **SC 2.5.8 Target Size:** Every variant selector, swatch bubble, and quantity increment trigger (`+` / `-`) must provide a tap target of at least **24x24px** with clear separation, and **44x44px** on touchscreens.
  - **Contrast AA:** Primary text, prices, and selected border states must maintain at least a **4.5:1** contrast ratio. Color swatch circles must have an accompanying text label (either adjacent or as accessible tooltip/screen-reader text) to prevent relying solely on color (SC 1.4.1 Use of Color).
- **Cumulative Layout Shift (CLS) Preservation:**
  - Always reserve space for the product title, image container, and dynamic notice boxes. A skeleton state (`skeleton-state-system`) or explicit dimensions must prevent content from jumping when dynamic reviews or inventory counters load.
- **Dynamic Viewport Heights:** The mobile sticky buy drawer must respect environment safe zones (`env(safe-area-inset-bottom)`) to ensure physical home swipe buttons do not conflict with the primary checkout CTA.

---

## Common Failure Patterns

- **The "Staggered Buy Box" Shifting:** Sizing or color variant buttons that wrap wrapping lines differently depending on the product, causing the primary "Add to Cart" CTA to jump up and down dynamically.
- **The Color-Only Blind Spot:** Using unlabeled colored circles as swatches. Colorblind users cannot distinguish between green and brown swatches, and screen readers will only read "Color Button" unless explicit label text is associated.
- **The Mobile Virtual Keyboard Block:** Positioning a sticky bottom bar on mobile screens in a way that blocks or overlaps form fields when the mobile virtual keyboard expands, trapping the user.
- **Image Aspect Ratio Jumping:** Not declaring explicit aspect ratios on the main gallery display, causing the entire layout columns to collapse and expand as the user toggles between landscape and portrait product images.
- **Double Scrollbar Lockup:** Setting the sticky left column too high or letting it overflow, causing the left column to scroll independently within a tiny window and creating double scrollbars adjacent to each other.

---

## Validation Criteria

- [ ] **Dual-Pane Setup:** The desktop layout features a sticky left-hand media column and a scrolling right-hand Buy Box column with clean 1px borders or clear whitespace division.
- [ ] **Linear Mobile Cascade:** Mobile viewport collapses the grid to a single-column stack with no horizontal overflow.
- [ ] **Mobile Drawer Safe-Zone:** Mobile sticky buy drawer is implemented, triggers only after the inline CTA scroll fold, and includes `env(safe-area-inset-bottom)`.
- [ ] **Accessible Custom Swatches:** Swatches are semantically constructed with accessible `<input type="radio">` grouping, enabling full keyboard arrow navigation.
- [ ] **High-Contrast Focus Outlines:** Focused swatches and pills show clear, high-contrast, unclipped outlines that are easily visible on both light and dark card surfaces.
- [ ] **No CLS Gallery:** The main media image container uses an explicit `aspect-ratio` to ensure layout stability when switching slides.
- [ ] **Dynamic Announcement:** Variant changes trigger `aria-live="polite"` updates so screen-reader users are announced of pricing or stock changes.
- [ ] **Touch Target AA Compliance:** All variant selector buttons, swatches, and quantity toggles provide a minimum tap footprint of 24x24px (44x44px preferred on mobile viewports).
