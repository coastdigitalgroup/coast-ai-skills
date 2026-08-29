# Masonry Grid Layout System Example: Creative Portfolio & UGC Media Feed

This document breaks down a real-world application of the **Masonry Grid Layout System** for an agency portfolio and creator showcase platform ("PixelCraft Showcase"). The page displays variable-aspect-ratio media cards, interactive feedback triggers, and dynamic creator notes packed into a responsive 3-column desktop layout.

---

## 1. Visual Composition & Spatial Layout Map

### Desktop Layout Structure (1440px Viewport)

```text
+--------------------------------------------------------------------------------------------------+
| HEADER: Logo, Category Filter Pills (All, UI/UX, Motion, Photography, Branding), Search Bar     |
+--------------------------------------------------------------------------------------------------+
| MASONRY GRID CONTAINER (Max Width: 1440px, Margin Auto, Gap: 24px)                               |
|                                                                                                  |
| [ COLUMN 1 (Width: 33.3%) ]       [ COLUMN 2 (Width: 33.3%) ]       [ COLUMN 3 (Width: 33.3%) ]   |
|                                                                                                  |
| +-------------------------+       +-------------------------+       +-------------------------+  |
| | Card 1 (TAB INDEX 1)    |       | Card 2 (TAB INDEX 2)    |       | Card 3 (TAB INDEX 3)    |  |
| | Portrait Image (3:4)    |       | Landscape Image (16:9)  |       | Square Image (1:1)      |  |
| | Height: 480px           |       | Height: 280px           |       | Height: 360px           |  |
| | - Title & Author        |       | - Title & Author        |       | - Title & Author        |  |
| | - Like & Save buttons   |       | - Like & Save buttons   |       | - Like & Save buttons   |  |
| +-------------------------+       +-------------------------+       +-------------------------+  |
|                                   |                         |       |                         |  |
| +-------------------------+       | +---------------------+ |       | +---------------------+ |  |
| | Card 4 (TAB INDEX 4)    |       | | Card 5 (TAB INDEX 5)| |       | | Card 6 (TAB INDEX 6)| |  |
| | Text Quote + Badge      |       | | Tall Portrait (9:16)| |       | | Landscape Image(4:3)| |  |
| | Height: 220px           |       | | Height: 540px       | |       | | Height: 320px       | |  |
| | - Featured Feedback     |       | | - Title & Tags      | |       | | - Title & Tags      | |  |
| +-------------------------+       | +---------------------+ |       | +---------------------+ |  |
|                                   +-------------------------+       +-------------------------+  |
| +-------------------------+                                         |                         |  |
| | Card 7 (TAB INDEX 7)    |                                         | +---------------------+ |  |
| | Square Image (1:1)      |                                         | | Card 8 (TAB INDEX 8)| |  |
| | Height: 360px           |                                         | | Wide Banner (2:1)   | |  |
| +-------------------------+                                         | | Height: 240px       | |  |
|                                                                     | +---------------------+ |  |
|                                                                     +-------------------------+  |
+--------------------------------------------------------------------------------------------------+
| FOOTER / INFINITE SCROLL LOADER (Skeleton Cards Shimmer Indicator)                              |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Card Anatomy and Dimensional Specifications

### A. Media Card (Standard Image / Video Preview)
- **Container Surfaces:**
  - Background: `var(--surface-card, #FFFFFF)`
  - Border: `1px solid var(--border-subtle, #E5E7EB)`
  - Border Radius: `16px` (`var(--radius-l)`)
  - Shadow: `0 4px 12px -2px rgba(0, 0, 0, 0.05)`
- **Media Wrapper Box:**
  - Width: `100%`
  - Height: Bounded by `aspect-ratio` metadata (e.g., `aspect-ratio: 4 / 3`, `3 / 4`, or `1 / 1`).
  - Skeleton Fallback: `background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)` during initial fetch.
  - Image Object Fit: `cover`.
- **Card Content Body:**
  - Padding: `16px 20px 20px 20px` (`var(--space-m)`)
  - Headline (`<h3>`): `font-size: 1.125rem; font-weight: 600; color: var(--text-primary, #111827)`.
  - Creator Byline: `font-size: 0.875rem; color: var(--text-secondary, #4B5563)` with 24x24px avatar circle.
  - Description: Max 2 lines using `-webkit-line-clamp: 2` to limit unexpected height drift.
- **Card Actions Dock:**
  - Layout: `display: flex; justify-content: space-between; align-items: center; margin-top: 12px;`
  - Like Button: `24x24px` icon inside `40x40px` touch target button with explicit `aria-label="Save project to collection"`.

### B. Text Quote / Testimonial Card (Non-Media Block)
- **Container Surface:** Accent tinted background (`var(--surface-brand-subtle, #EFF6FF)`).
- **Typography:** `font-size: 1.25rem; font-style: italic; line-height: 1.4; color: var(--text-brand, #1E40AF)`.
- **Author Tag:** Avatar + Author Name + Verified Creator Badge.
- **Purpose:** Breaks up heavy visual media with lightweight typographic commentary.

---

## 3. Keyboard Focus Parity and DOM Sequence Map

### Problem Addressed
In traditional CSS `column-count` layouts, pressing `Tab` navigates down Column 1 through Card 1, Card 4, and Card 7 before jumping back up to Card 2 at the top of Column 2. This causes severe disorientation for keyboard and screen reader users.

### Solution Applied: Multi-Track DOM Distribution
Cards are sequentially distributed across Column Containers (`Column 1`, `Column 2`, `Column 3`) based on real-time vertical height balancing, while preserving logical left-to-right DOM order:

```text
DOM Tree Traversal Sequence:
1. <a href="/item-1" class="card"> -> Column 1 Top (Visual Position 1)
2. <a href="/item-2" class="card"> -> Column 2 Top (Visual Position 2)
3. <a href="/item-3" class="card"> -> Column 3 Top (Visual Position 3)
4. <a href="/item-4" class="card"> -> Column 1 Middle (Visual Position 4)
5. <a href="/item-5" class="card"> -> Column 2 Middle (Visual Position 5)
6. <a href="/item-6" class="card"> -> Column 3 Middle (Visual Position 6)
```

### Keyboard Tab Test Traversal Matrix

| Focus Step | Interactive Element | Target Location | Visual Row | WCAG Compliance |
| :--- | :--- | :--- | :--- | :--- |
| **Tab 1** | Primary Card Link 1 | Top Left (Col 1) | Row 1 | SC 2.1.1 Pass |
| **Tab 2** | Like Button Card 1 | Top Left (Col 1) | Row 1 | SC 2.5.8 Pass |
| **Tab 3** | Primary Card Link 2 | Top Center (Col 2) | Row 1 | SC 1.3.2 Pass |
| **Tab 4** | Primary Card Link 3 | Top Right (Col 3) | Row 1 | SC 1.3.2 Pass |
| **Tab 5** | Primary Card Link 4 | Mid Left (Col 1) | Row 2 | SC 1.3.2 Pass |

---

## 4. Responsive Adaptation Matrix

| Device Viewport | Column Tracks | Column Gap | Card Padding | Image Aspect Ratio Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile (<640px)** | `1 Column` | `16px` | `16px` | Native aspect-ratio with `100%` width. Full-width touch cards. |
| **Tablet (640px–1023px)** | `2 Columns` | `16px` | `16px` | Balanced 2-column flex packing. Minimum card width 280px. |
| **Desktop (1024px–1439px)** | `3 Columns` | `24px` | `20px` | 3-column flex packing. Bounded track width (~320px–400px). |
| **Wide Desktop (≥1440px)**| `4 Columns` | `24px` | `24px` | 4-column max container (1600px). Peak density presentation. |

---

## 5. Performance & CLS Mitigation Workflow

1. **Pre-allocated Aspect Ratio Wrappers:** Every media item is rendered inside `<div class="media-aspect-box" style="aspect-ratio: 4/3">`. This allocates pixel dimensions in the DOM before image download completes, keeping Cumulative Layout Shift (CLS) at `0.00`.
2. **IntersectionObserver Lazy Loading:** Images below the fold use native `loading="lazy"` combined with low-resolution blur placeholders (`blur-up` pattern).
3. **Debounced Resize Observer:** Viewport resizing triggers a debounced recalculation (`150ms`) to re-distribute cards across columns without layout thrashing.
