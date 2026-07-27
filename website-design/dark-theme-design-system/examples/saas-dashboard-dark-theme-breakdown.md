# Example: SaaS Dashboard Light-to-Dark Translation Breakdown

This example demonstrates how to apply the **Dark Theme Design System** skill to a complex, data-dense SaaS Analytics Dashboard. It breaks down the spatial structure, typography, and contrast mapping to transition a dashboard from light mode to an accessible, low-fatigue dark mode.

---

## 1. Dashboard Structure & Component Inventory

The SaaS Dashboard consists of the following structural zones:
1. **Sidebar Navigation (Level 1 Elevation):** Vertical navigation containing links, user profile, and theme switcher.
2. **Top Navigation/Utility Bar (Level 1 Elevation):** Horizontal bar containing search, notifications, and profile dropdown.
3. **Dashboard Canvas (Level 0 Elevation - Base):** The background upon which data cards sit.
4. **Metrics Cards (Level 2 Elevation):** 4 small panels displaying high-level KPIs with trend indicators.
5. **Analytics Charts (Level 2 Elevation):** Main interactive area showing a multi-line graph and a category bar chart.
6. **Activity Table (Level 2 Elevation):** A data table listing recent transactions with colored status badges.
7. **Filter Dropdown (Level 3 Elevation):** A popover containing filter checkboxes.
8. **Confirmation Modal (Level 4 Elevation):** A centered dialog confirming a high-stakes setting change.

---

## 2. Light-to-Dark Color & Token Map

Here is how the color systems translate, ensuring that we reverse the elevation shadows, desaturate the brand accents, and use off-whites for text.

| Visual Role | Light Mode Value (Token) | Dark Mode Value (Token) | Design Rationale & Calculation |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | `#F8F9FA` (`--bg-canvas`) | `#121214` (`--bg-canvas`) | A dark blue-gray charcoal base prevents glare, maintaining soft warmth. |
| **Surface (Card)** | `#FFFFFF` (`--bg-surface`) | `#1E1E22` (`--bg-surface`) | Elevation Level 1. Lighter than base (`#121214`) to simulate catching ambient light. |
| **Surface (Header)** | `#FFFFFF` (`--bg-header`) | `#252529` (`--bg-header`) | Elevation Level 2. Placed on top of cards, slightly lighter than Level 1. |
| **Surface (Modal)** | `#FFFFFF` (`--bg-modal`) | `#2D2D33` (`--bg-modal`) | Elevation Level 3. Our highest surface; stands out clearly with a soft dark shadow. |
| **Text (Primary)** | `#1A202C` (`--text-primary`) | `#E2E8F0` (`--text-primary`) | Off-white at 88% perceived brightness; avoids the harsh halation of `#FFF`. |
| **Text (Secondary)**| `#4A5568` (`--text-secondary`)| `#94A3B8` (`--text-secondary`)| Opacity reduced to ~60% for secondary metadata and helper labels. |
| **Primary Accent** | `#0055FF` (`--accent-primary`)| `#60A5FA` (`--accent-primary`)| High-saturation brand blue is desaturated from `100%` to `55%` to prevent visual vibration. |
| **Success Status** | `#10B981` (`--status-success`)| `#34D399` (`--status-success`)| Emerald green desaturated slightly and lightened to meet 4.5:1 text contrast. |
| **Error Status** | `#EF4444` (`--status-error`)  | `#F87171` (`--status-error`)  | Red accent shifted to a lighter coral-red, safe on `#1E1E22` background. |

---

## 3. Component Breakdown

Let's analyze how individual components are transformed using the design system's rules.

### A. Metrics Cards (KPI Summary Panels)
These cards sit on the canvas and display key figures.

*   **Light Mode Design:**
    *   **Background:** `#FFFFFF` (pure white) card.
    *   **Shadow:** `0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)`.
    *   **KPI Text:** `#1A202C` (slate-900), size 32px, weight **700 (Bold)**.
    *   **Helper Label:** `#4A5568` (slate-600), size 14px, weight 500.
    *   **Trend Badge:** Saturated light green background (`#D1FAE5`) with dark green text (`#065F46`).
*   **Dark Mode Translation:**
    *   **Background:** `#1E1E22` (Surface 1). No borders.
    *   **Shadow:** Very soft, large black shadow (`0px 10px 15px -3px rgba(0, 0, 0, 0.3)`).
    *   **KPI Text:** `#F8FAFC` (slate-50), size 32px, weight adjusted to **600 (Semi-Bold)**. *Why? To counteract irradiation which makes light-on-dark text look swollen.*
    *   **Helper Label:** `#94A3B8` (slate-400), size 14px, weight 500.
    *   **Trend Badge:** Desaturated dark green background (`rgba(52, 211, 153, 0.15)`) with desaturated light green text (`#34D399`). *Why? Avoids the blinding effect of solid light-green on dark surfaces while maintaining clear semantic indicators.*

---

### B. Interactive Analytics Chart
The main chart shows a multi-line graph of Monthly Active Users (MAU).

*   **Light Mode Design:**
    *   **Gridlines:** `#E2E8F0` (light gray) lines.
    *   **Primary Active Line:** Solid `#0055FF` (vibrant blue) at 3px width.
    *   **Secondary Active Line:** Solid `#EF4444` (vibrant red) at 3px width.
    *   **Tooltip Popover:** `#1A202C` (dark background) with `#FFFFFF` text.
*   **Dark Mode Translation:**
    *   **Gridlines:** `#334155` (slate-700) lines, styled with `opacity: 0.4` to keep them visually secondary.
    *   **Primary Active Line:** Solid `#60A5FA` (desaturated, luminous light blue).
    *   **Secondary Active Line:** Solid `#F87171` (desaturated coral red). *Why? High-saturation lines cause visual "vibration" and double-imaging against dark slate.*
    *   **Tooltip Popover:** `#2D2D33` (Surface 3 - elevated modal bg) with a `#1E1E22` dark border. Text is `#E2E8F0`. Focus/active pointer dots are surrounded by a `#121214` canvas-colored halo to visually isolate the pointer from the gridlines.

---

### C. Activity Table with Status Badges
A data table displaying recent activity.

*   **Light Mode Design:**
    *   **Table Header Row:** Background `#F1F5F9`, text `#475569` (slate-600) uppercase.
    *   **Table Dividers:** Solid `#E2E8F0` borders.
    *   **Status Badge (Pending):** Yellow background `#FEF3C7` with dark brown text `#92400E`.
*   **Dark Mode Translation:**
    *   **Table Header Row:** No background color; instead, we use a slightly thicker bottom border (`1px solid #334155`). Text is `#94A3B8` (slate-400) uppercase, tracked out (`letter-spacing: 0.05em`).
    *   **Table Dividers:** `#334155` borders (slate-700) at `opacity: 0.5`.
    *   **Status Badge (Pending):** Translucent yellow background `rgba(245, 158, 11, 0.15)` with desaturated yellow/amber text `#FBBF24`. *This keeps the table clean, high-contrast, and prevents color overload.*

---

### D. Confirmation Modal Dialog
A critical overlay centered over the page to confirm destructive changes.

*   **Light Mode Design:**
    *   **Backdrop/Scrim:** `#000000` at `opacity: 0.5` (50% opaque black).
    *   **Modal Body:** `#FFFFFF` card with heavy outer shadow.
    *   **Modal Header:** Slate-900 title text. Close button (X) is slate-500.
    *   **Destructive Action Button:** Solid `#EF4444` (red) button with white text.
*   **Dark Mode Translation:**
    *   **Backdrop/Scrim:** `#000000` at `opacity: 0.7` (70% opaque black). *Why? A darker scrim is required to fully block out and dim the background dark UI, helping the modal stand out.*
    *   **Modal Body:** `#2D2D33` (Surface 3 - our lightest elevated dark gray) to show it is closest to the light source. It has a subtle white border at `opacity: 0.1` (`1px solid rgba(255, 255, 255, 0.1)`) to define its boundaries against the dark scrim.
    *   **Modal Header:** Slate-100 title text (`#F1F5F9`). Close button (X) has a focus ring that is custom-styled with a desaturated blue outline (`#60A5FA`).
    *   **Destructive Action Button:** Desaturated red `#F87171` button with `#121214` dark text (or white text if contrast is higher, e.g. `#111827` dark slate is preferred for maximum text readability).

---

## 4. Key Takeaways & Optical Lessons Applied

1.  **Reversed Light Model:** Notice that as we went from Canvas -> Card -> Header -> Modal in light mode, the backgrounds stayed white but shadows grew. In dark mode, the color shifted from `#121214` (dark canvas) -> `#1E1E22` (lighter card) -> `#252529` (even lighter header) -> `#2D2D33` (lightest modal). **Lighter means elevated.**
2.  **Anti-Vibration Accents:** The primary blue changed from `#0055FF` to `#60A5FA`. The vibrant blue would have caused severe eye fatigue and failed WCAG 2.2 AA contrast rules against `#1E1E22`.
3.  **No Pure Colors:** No `#000` or `#FFF` were used as standard backgrounds or body texts, avoiding high-contrast glare and halation issues.
4.  **Irradiation Defense:** Table text and KPI bold headers had their font-weights reduced slightly (e.g., from `700` to `600`) and letter spacing opened up (`letter-spacing: 0.02em`) to maintain legibility.
