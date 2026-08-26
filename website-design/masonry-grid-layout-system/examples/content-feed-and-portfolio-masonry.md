# Masonry Grid Layout System Examples

This document demonstrates realistic breakdowns of the Masonry Grid Layout System applied to real-world website design problems.

---

## Example 1: Creative Agency Portfolio & Design Showcase

### Scenario
A creative agency needs to display a showcase of visual design projects, branding case studies, animation reels, and architectural photography. Project assets vary significantly in aspect ratio:
- 3:4 portrait poster renders
- 16:9 widescreen video reels
- 1:1 square icon sets
- 4:5 social campaign graphics

### Design Challenge
- Standard grid layouts force 16:9 videos to leave massive empty spaces beneath shorter 1:1 graphics in the same row.
- Pure CSS `column-count` layouts arrange projects vertically down Column 1, so when a user keyboard-tabs through projects, focus jumps straight down to the bottom of the page before jumping back up to the top of Column 2.

### Applied Masonry Solution

```text
DESKTOP MASONRY BREAKDOWN (4 COLUMNS, 24px Gaps)
+-----------------------+-----------------------+-----------------------+-----------------------+
| Project 1 [Aspect 3:4]| Project 2 [Aspect 1:1]| Project 3 [Aspect 16:9| Project 4 [Aspect 4:5]|
| "Poster Series"       | "Icon Brand Mark"     | "Product Reel 2024"   | "Campaign Visuals"    |
| [Tags: Branding, Print| [Tags: Logo]          | [Tags: 3D, Video]     | [Tags: Marketing]     |
|                       |                       |                       |                       |
+-----------------------+-----------------------+                       +-----------------------+
| Project 5 [Aspect 16:9|                       |                       | Project 6 [Aspect 1:1]|
| "Interface Design"    |                       +-----------------------+ "Typography Badge"    |
|                       |                       | Project 7 [Aspect 3:4]|                       |
|                       |                       | "Editorial Layout"    |                       |
+-----------------------+-----------------------+                       |                       |
                        | Project 8 [Aspect 4:5]|                       +-----------------------+
                        | "Mobile App Showcase" |                       | Project 9 [Aspect 16:9|
                        |                       |                       | "Motion Graphic"      |
                        +-----------------------+-----------------------+-----------------------+
```

### Key Structural Specifications

1. **Card Container & Media Framing:**
   ```css
   .portfolio-masonry-card {
     display: flex;
     flex-direction: column;
     border-radius: 12px;
     background: var(--surface-card, #1e1e24);
     border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
     overflow: hidden;
     transition: transform 0.2s ease, box-shadow 0.2s ease;
   }

   .portfolio-masonry-card:hover {
     transform: translateY(-4px);
     box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.4);
   }

   .card-media-wrapper {
     position: relative;
     width: 100%;
     background: var(--surface-placeholder, #2a2a32);
   }

   /* Aspect ratios pre-declared per item to prevent CLS */
   .aspect-3-4  { aspect-ratio: 3 / 4; }
   .aspect-16-9 { aspect-ratio: 16 / 9; }
   .aspect-1-1  { aspect-ratio: 1 / 1; }
   .aspect-4-5  { aspect-ratio: 4 / 5; }
   ```

2. **DOM-Visual Order Alignment (Row-First Left-to-Right Distribution):**
   - HTML source order: Card 1, Card 2, Card 3, Card 4, Card 5, Card 6, Card 7, Card 8.
   - Dynamic short-column placement places Card 5 in Column 1 (under Card 1), Card 6 in Column 4 (under Card 4), Card 7 in Column 3 (under Card 3), and Card 8 in Column 2 (under Card 2).
   - Tabbing order follows Card 1 → Card 2 → Card 3 → Card 4 → Card 5 → Card 6, maintaining visual scanning harmony.

---

## Example 2: E-Commerce Visual Discovery Feed

### Scenario
An online home decor platform presents a "Shoppable Inspiration Feed" combining high-res room photos, product callouts, customer reviews, and quick-add buy buttons.

### Content Variation
- **Visual Room Shots (Tall):** Height varies based on photography style (9:16 portrait).
- **Product Snippet Cards (Compact):** Square product image (1:1), price tag, rating stars, "Add to Cart" button.
- **Editorial Quote Cards (Text-only):** Customer review text, star rating, verified buyer badge.

### Breakdown of Card Components & Accessibility Rules

```text
┌───────────────────────────────────────┐
│ Room Inspiration Shot (Aspect 9:16)   │
│ ┌───────────────────────────────────┐ │
│ │ Image placeholder (CLS prevention)│ │
│ └───────────────────────────────────┘ │
│                                       │
│ Scandinavian Living Room              │
│ 🏷️ Modern Sofa, Floor Lamp            │
│ [Explore Room (Link)]                 │
└───────────────────────────────────────┘
┌───────────────────────────────────────┐
│ Product Spotlight (Aspect 1:1)        │
│ ┌───────────────────────────────────┐ │
│ │ Product Image                     │ │
│ └───────────────────────────────────┘ │
│ Minimalist Ceramic Vase               │
│ $48.00  ★★★★★ (42)                   │
│ [Add to Cart (Button)]                │
└───────────────────────────────────────┘
```

### Accessibility & Interaction Design Matrix

- **Tap Targets:** "Add to Cart" buttons and tag links maintain a minimum `44x44px` touch footprint on mobile viewports.
- **Focus visible state:** High-contrast 3px amber focus outline (`outline: 3px solid #f59e0b; outline-offset: 2px;`) activates when navigating via keyboard `Tab`.
- **Text Contrast:** Product title (#F9FAFB) against card background (#1F2937) achieves a **13.8:1** contrast ratio (WCAG AAA). Price text (#10B981) achieves **7.2:1** contrast ratio.
