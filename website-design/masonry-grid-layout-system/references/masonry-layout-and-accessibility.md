# Technical Reference: Masonry Layout Architecture & Accessibility Guidelines

This reference guide provides engineering specifications, layout algorithm comparisons, Cumulative Layout Shift (CLS) mitigation techniques, and WCAG AA accessibility rules for the **Masonry Grid Layout System**.

---

## 1. Architectural Algorithm Comparison Matrix

| Layout Approach | CSS Mechanics | JS Runtime Overhead | Reading & Tab Focus Sequence | CLS Vulnerability | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CSS Multi-Column (`column-count`)** | `column-count: N; break-inside: avoid;` | None (0 KB) | **Vertical Column Trap:** Tab key travels straight down Column 1 before Column 2. | Low (Native browser flow) | Use for static, read-only text columns. Avoid for interactive cards unless DOM is pre-bucketed. |
| **Multi-Track Flex Packing (Recommended)** | `display: flex; gap: 24px;` with N `.masonry-column` containers | Lightweight (~1.5 KB debounced script) | **Logical Row Order:** Items assigned to shortest track while preserving sequential DOM insertion. | **Zero CLS** when pre-allocated with `aspect-ratio`. | **Primary Standard** for dynamic feeds, portfolios, and interactive cards. |
| **CSS Grid Row Spanning** | `grid-auto-rows: 10px; gap: 16px;` + inline `grid-row-end: span X` | Moderate (Requires measuring card height after render) | **Left-to-Right DOM Order:** Standard CSS Grid cell placement. | Medium (Items jump when row spans are calculated). | Useful when single-container HTML markup is strictly enforced. |
| **Native CSS Grid Masonry (`grid-template-rows: masonry`)** | Experimental W3C Candidate Spec | None (0 KB) | Native Left-to-Right Grid Flow. | Zero CLS | **Future Standard** (Check browser support before deploying in production). |

---

## 2. DOM Focus Sequence & Keyboard Navigation Rules

### WCAG 2.1 SC 1.3.2 (Meaningful Sequence)
When users navigate a website using the `Tab` key or a screen reader, the focus sequence must mirror the spatial visual arrangement of the elements. In a masonry grid, visual reading order is expected to move **left-to-right, then top-to-bottom**.

```text
CORRECT Focus Flow (Row-Wise Across Columns):
[Card 1 (Col 1 Top)] ---> [Card 2 (Col 2 Top)] ---> [Card 3 (Col 3 Top)]
        |                          |                          |
        v                          v                          v
[Card 4 (Col 1 Mid)] ---> [Card 5 (Col 2 Mid)] ---> [Card 6 (Col 3 Mid)]

INCORRECT Focus Flow (CSS column-count Trap):
[Card 1 (Col 1 Top)]      [Card 4 (Col 2 Top)]      [Card 7 (Col 3 Top)]
        |                          |                          |
        v                          v                          v
[Card 2 (Col 1 Mid)]      [Card 5 (Col 2 Mid)]      [Card 8 (Col 3 Mid)]
        |                          |                          |
        v                          v                          v
[Card 3 (Col 1 Bot)]      [Card 6 (Col 2 Bot)]      [Card 9 (Col 3 Bot)]
```

### Implementation Safeguards
1. **Never use CSS `order` or `float` to reposition focusable masonry cards.**
2. **If using `column-count`, pre-sort cards into column buckets using JavaScript** so DOM order matches column display order.
3. **Ensure `:focus-visible` ring outlines are never clipped by `overflow: hidden` on column containers.** Use `padding: 4px` on parent wrappers or `outline-offset: -2px` if tight boundaries exist.

---

## 3. Cumulative Layout Shift (CLS) Mitigation

Cumulative Layout Shift occurs when un-sized media (images, videos, embeds) load asynchronously, pushing surrounding masonry cards down the page and causing recalculation jitter.

### Technique A: Pre-Allocated Aspect Ratio (Preferred)
Define explicit aspect ratios in CSS or inline styles when media dimensions are known in advance:

```css
.card-media-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3; /* Reserved spatial box before image load */
  background-color: var(--surface-muted);
}

.card-media-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Technique B: Skeleton Shimmer Placeholders
Render skeleton placeholders for dynamic feeds where card heights are fetched asynchronously:

```css
.skeleton-card {
  height: 320px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    var(--border-subtle) 25%,
    var(--surface-card-hover) 50%,
    var(--border-subtle) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 4. Responsive Breakpoint & Column Density Scale

| Viewport Category | Min Width | Max Width | Target Column Count | Recommended Gutter | Card Padding |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile Portrait** | `320px` | `639px` | **1 Column** | `16px` | `16px` |
| **Tablet / Mobile Landscape** | `640px` | `1023px` | **2 Columns** | `16px` | `16px` |
| **Desktop / Laptop** | `1024px` | `1439px` | **3 Columns** | `24px` | `20px` |
| **Large Desktop / Ultra-Wide**| `1440px` | `+` | **4 Columns** | `24px` | `24px` |

---

## 5. WCAG AA Compliance Audit Checklist

- [ ] **SC 1.3.2 Meaningful Sequence:** Tabbing through masonry cards follows a logical left-to-right, top-to-bottom spatial path.
- [ ] **SC 2.1.1 Keyboard:** Every interactive trigger inside cards (like button, save link, tag pills) can be focused and activated via `Keyboard` (`Tab`, `Space`, `Enter`).
- [ ] **SC 2.4.7 Focus Visible:** Focused cards and buttons display a high-contrast focus indicator (minimum 3:1 contrast against surrounding background).
- [ ] **SC 2.5.8 Target Size (Minimum):** All clickable controls inside cards measure at least 24x24px, with 44x44px minimum touch padding for mobile triggers.
- [ ] **SC 1.4.3 Contrast (Minimum):** Overlay text and badges meet at least 4.5:1 visual contrast ratio against card backgrounds or image overlays.
- [ ] **CLS Target:** Overall Cumulative Layout Shift during page load and dynamic card insertion remains strictly under `0.10`.
