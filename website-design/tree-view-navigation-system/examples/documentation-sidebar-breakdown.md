# Example Breakdown: SaaS Documentation Sidebar Layout

This example breaks down a high-fidelity documentation sidebar tree navigation system designed for a modern SaaS platform (such as an API developer portal or complex cloud platform console). It showcases how spatial hierarchy, custom visual states, and accessibility-compliant keyboard guidelines are applied to a real-world design problem.

---

## 1. The Design Scenario: Multi-Level API Reference Directory

The website requires a left-hand navigation sidebar that lets users navigate through a complex, deeply nested hierarchy of technical guides, API endpoints, SDK configurations, and standard documentation articles.

- **Total Depth:** 4 Levels (Category -> Guide -> Endpoint Group -> Specific Reference).
- **Target Container Width:** `280px` on desktop viewports.
- **Scroll Behavior:** Persistent floating sidebar with independent vertical scrolling (`overflow-y: auto`) to prevent main content scroll overlap.
- **Visual Goal:** High-density, premium-dark or premium-light layout that remains clean, scannable, and clearly indicates the active page without causing scanning fatigue.

---

## 2. Spatial Composition & Spacing Blueprint

To prevent horizontal layout collapse across 4 levels of depth, we utilize tight, highly precise fluid spacing tokens:

- **Root Padding:** Left/right padding of the container is set to `16px`.
- **Indentation Increment (`--indent-width`):** `12px` per level (reduced from desktop standard of `16px` to maximize horizontal reading space within the `280px` sidebar constraint).
- **Row Heights & Touch Margins:**
  - **Desktop (>=1024px):** Row height is set to `36px` (`padding: 6px 12px 6px calc(12px * var(--tree-depth, 0) + 8px)`).
  - **Mobile (<1024px Drawer):** Row height scales up to `46px` (`padding: 10px 16px 10px calc(16px * var(--tree-depth, 0) + 12px)`) to provide optimal touch safety.

### Vertical Spacing & Dividers
- Nodes within the same `.tree-group` are stacked with `0px` margin.
- High-level root categories (Level 1 branches) feature a vertical gap of `16px` between groups and are separated by a subtle divider line (`1px solid var(--border-neutral)`).
- This grouping breaks up the directory into manageable visual clusters.

---

## 3. Visual States & Design Palette (Light Theme Example)

Below is the design spec defining colors, contrast scores, and typography styles across all active states:

| State | Background Fill | Text Color / Weight | Chevron Indicator | Focus Outline | Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Default (Level 1)** | Transparent | `#1e293b` (Slate 800) / **600 (Semibold)** | `#64748b` (Slate 500) | None | `6.5:1` |
| **Default (Level 2+)** | Transparent | `#475569` (Slate 600) / **400 (Regular)** | `#94a3b8` (Slate 400) | None | `4.8:1` |
| **Hover (Any Level)** | `#f1f5f9` (Slate 100) | `#0f172a` (Slate 900) / **500 (Medium)** | `#475569` (Slate 600) | None | `7.2:1` (On hover bg) |
| **Focus-Visible** | Transparent | `#0f172a` (Slate 900) | `#475569` (Slate 600) | `2px solid #2563eb` (Blue 600) | `4.5:1` (Outline to background) |
| **Selected (Active Page)** | `#eff6ff` (Blue 50) | `#1d4ed8` (Blue 700) / **600 (Semibold)** | `#2563eb` (Blue 600) | None | `5.2:1` (Text on blue bg) |

---

## 4. Visual Layout Anatomy

Below is the visual structure of a single sidebar row (Level 2 Branch) at full detail:

```text
+-------------------------------------------------------------------------+
| [280px Sidebar Width Container]                                         |
+-------------------------------------------------------------------------+
| <------------ Level 1 Root Item: "API Reference" (Active Parent) -----> |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   | [Row: Hover State] -- Level 2 Branch (Depth: 1)                |   |
|   |                                                                 |   |
|   |  |- Indent Gap -| [v] [Folder Icon] [Label: Endpoint Access]    |   |
|   |    (12px width)   ^     ^             ^                         |   |
|   |                   |     |             +-- Font: 14px Medium     |   |
|   |                   |     |                 Color: Slate 900      |   |
|   |                   |     |                                       |   |
|   |                   |     +-- 16px Folder Icon (Slate 600)        |   |
|   |                   |                                             |   |
|   |                   +-- Rotating Chevron (Slate 600, Rotated Down)|   |
|   +-----------------------------------------------------------------+   |
|                                                                         |
|       +-------------------------------------------------------------+   |
|       | [Row: Active State] -- Level 3 Leaf (Depth: 2)              |   |
|       |                                                             |   |
|       |  |-- Indent Gap --| [File Icon] [Label: GET /v1/users]      |   |
|       |    (24px width)       ^           ^                         |   |
|       |                       |           +-- Font: 13px Semibold   |   |
|       |                       |               Color: Blue 700       |   |
|       |                       |                                     |   |
|       |                       +-- 14px Code Tag Icon (Blue 600)     |   |
|       +-------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

---

## 5. Mobile Responsive Adaptation Spec

When the screen size shifts below `1024px` (Tablet and Mobile viewports):

1. **Hide Sidebar:** The persistent sidebar is hidden (`display: none`).
2. **Expose Menu Trigger:** A sticky top header is shown with a hamburger icon menu labeled "Browse Docs" (`aria-haspopup="dialog"`, `aria-expanded="false"`).
3. **Launch Floating Sheet:** Clicking the button slides a 100% width drawer panel from the left, overlapping the main layout.
4. **Scale Targets:**
   - Text sizes scale up from `13px/14px` to a standardized **`16px`** to ensure excellent mobile legibility.
   - Item tap-targets scale to **`46px`** vertical height.
   - Chevrons expand their tap zones to a dedicated **`44px x 44px`** box, allowing users to safely expand or collapse directories without accidentally triggering page links.
5. **Scroll Focus Restoring:** When opening the menu, the scroll behavior of the drawer automatically focuses and scrolls to the active Level 3 page (`.is-selected`), ensuring immediate structural orientation.
