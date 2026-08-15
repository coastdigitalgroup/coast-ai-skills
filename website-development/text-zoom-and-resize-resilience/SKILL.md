---
name: text-zoom-and-resize-resilience
description:
  Build, audit, and debug frontend web layouts to ensure absolute visual resilience to browser page zooming (up to 400%) and system default text resizing (up to 200%) in compliance with WCAG 2.1 AA.
---

# Text Zoom and Resize Resilience

## Purpose

The Text Zoom and Resize Resilience skill provides a comprehensive technical protocol, standard patterns, and debugging guidelines for building layouts that withstand browser page zooming (up to 400%) and system/browser default font resizing (up to 200%).

This is critical for complying with **WCAG 2.1 AA Success Criterion 1.4.4 (Resize Text)** and **Success Criterion 1.4.10 (Reflow)**. The core engineering problem is preventing layout breakage, visual overlap, truncation (unreadable clipped text), and double-scrollbars when text size increases independently of the viewport, or when the entire page is reflowed at high zoom levels.

---

## Use Cases

- **Design System Typography & Grid Setup:** Establishing baseline spacing and typography scaling rules (e.g., using `rem` or `em` units instead of rigid `px`).
- **Responsive Layout Auditing:** Ensuring desktop designs scale cleanly without overlapping when zoomed, or when the system font scale is altered.
- **Header, Navigation, and Footer Structures:** Protecting horizontal or sticky containers where content crowding is highly prevalent under text enlargement.
- **Dynamic Content Cards and Grids:** Preventing fixed-height elements from clipping overflow text when font sizes increase.
- **Multilingual Support:** Designing layouts that automatically adjust to longer text lengths and different language font dynamics.

---

## When NOT to Use

- **Images of Text (Logos / Diagrams):** While images of text are generally discouraged by WCAG, they do not reflow; instead, they scale proportionally. Use SVG or high-density raster images instead of styling HTML layout constraints.
- **Canvas-based Interactive Graphics / WebGL / Games:** Canvas-based rendering handles scaling differently, and standard CSS text-zoom constraints do not apply. Accessibility is handled through off-screen fallbacks or standard canvas aria landmarks.
- **Video Players and Audio Controllers:** Native media elements are excluded from some of the text-resize reflow rules, provided they have alternative accessible controls or responsive media controls.

---

## Inputs

1. **Target Markup (HTML / JSX):** The structural HTML of the components/page.
2. **Global Typography Styles (CSS / SASS):** Root font size settings and element-specific typography parameters.
3. **Container Dimension Rules:** Height and width CSS rules (`height`, `max-height`, `width`, `min-width`).
4. **Current Media Queries:** Existing breakpoint definitions (`@media (min-width: ...)`).

---

## Outputs

1. **Resilient CSS Rules:** Fluid-ready layouts using `rem`/`em` units, wrapping behaviors (`flex-wrap: wrap`, auto-placement grid), and content-driven sizing (`min-height: auto`, `height: auto`).
2. **Text Zoom Guardrails:** Safe clamp and max-width thresholds that handle 200% font scaling.
3. **Simulation Test Procedures:** Reusable commands and diagnostic checks to trigger browser font scaling and page zoom to verify visual resilience.

---

## Workflow

### 1. Establish the Fluid Base Unit
- **Never use hardcoded `px` for font-size, line-height, margin, or padding.**
- Set the default root font-size implicitly (e.g., `html { font-size: 100%; }` or leave as default browser `16px`). This allows browser preferences and system text sizing to multiply correctly.
- Use `rem` for global typography, global containers, margins, and padding.
- Use `em` for component-specific spacing, icons, or text-relative layout constraints (such as text margins or button inner padding) so they scale proportionally to their parent font-size.

### 2. Design Content-Driven Containers (Avoid Fixed Heights)
- **Do not define fixed `height` or `max-height` values on containers containing text.**
- Always use `min-height` rather than `height` to ensure that if the font size doubles, the container can expand vertically to accommodate the extra lines of text.
- Use `overflow: auto` or `overflow: visible` as a safety fallback. Avoid `overflow: hidden` on text containers, as this silently truncates enlarged text, rendering it completely unreadable.

### 3. Implement Layout Wrapping and Reflow Controls
Horizontal layouts (like nav bars, headers, or multi-column grids) must gracefully wrap when text expands.
- For Flexbox: Use `flex-wrap: wrap;` and ensure items are allowed to shrink and grow cleanly. Avoid `flex: 0 0 fixed-px`.
- For Grid: Use `grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));`. The `auto-fit` with `minmax` allows cards to automatically stack vertically if the font size enlarges beyond horizontal grid limits.
- Avoid absolute or fixed positioning for primary structural columns, as enlarged text will easily bleed out of these containers.

### 4. Apply Text Clamp Safely
Dynamic fluid typography (using `clamp()`) is highly effective for responsive design but can limit user-defined zoom if not written correctly.
- Ensure the viewport-relative term (`vw`) in your `clamp()` is always paired with a relative text unit (`rem` or `em`) to allow text resizing to scale.
- **Incorrect:** `font-size: clamp(1rem, 5vw, 3rem);` (at small viewport widths with 200% zoom, the `vw` factor may heavily restrict the scaling).
- **Correct:** `font-size: clamp(1rem, 2vw + 1rem, 3rem);` (the dynamic addition of `+ 1rem` ensures that browser-level text enlargement always forces a font scale change).

### 5. Media Queries via Relative Units
Breakpoints written in `px` do not scale with text-only resizing, meaning that a 200% text enlargement will stay on the "desktop" layout, resulting in horizontal clipping and overlapping.
- **Always write media queries in `em` units.**
- Conversion: `1em = 16px` (e.g., `768px` is `48em`, `1024px` is `64em`).
- When the user enlarges their text-only browser zoom, the `@media (min-width: 48em)` breakpoint will trigger much earlier, automatically swapping the page layout to the mobile view. This gracefully prevents horizontal layout clipping and preserves vertical readable flow.

---

## Decision Rules

### Unit Selection Grid

| Property | Primary Choice | Rationale | Secondary Choice |
| :--- | :--- | :--- | :--- |
| **`font-size`** | `rem` | Responds perfectly to root browser font size scaling. | `em` (for nested typography or elements that must scale relative to the parent). |
| **`line-height`** | Unitless (e.g., `1.5`) | Automatically inherits and scales dynamically proportional to any active `font-size` on the element. | None. |
| **`margin` / `padding`** | `rem` (global/grid), `em` (inside buttons/components) | Ensures spacing scales proportionally to text size, maintaining visual balance. | `px` (strictly for ultra-fine borders or stable micro-dividers only). |
| **`width` / `max-width`** | `rem` or `%` / `ch` | Limits container widths to a readable character length (e.g., `max-width: 75ch`). | `vw` (only when bound with safety clamping). |
| **`height` / `min-height`**| `min-height` with `rem` or `lh` | Allows container to stretch vertically to accommodate wrapped text. | `auto` (default block behavior). |

---

## Constraints

- **Accessibility (WCAG 2.1 AA 1.4.4):** Users must be able to resize text up to 200% without loss of content or functionality, and without horizontal scrolling on a 320px screen equivalent (Reflow 1.4.10).
- **No Text Truncation:** Text must never be truncated via `text-overflow: ellipsis` or clipped by `overflow: hidden` unless there is an accessible way to reveal the full content (e.g., an expandable disclosure toggle).
- **Browser Compatibility:** Standard CSS variables and grid-auto layouts work across all modern evergreen browsers. `scrollbar-width` and standard scroll behaviors should be verified across Chromium, Safari, and Firefox.

---

## Non-Goals

- Complete replacement of standard responsive breakpoints for standard mobile devices (this is an addition to, not a replacement of, basic responsive layout rules).
- Multi-column masonry layout balancing at high zoom levels (some visual asymmetry is accepted as long as content is fully readable and functional).
- Micro-optimizations for legacy browsers like IE11 or early non-evergreen webview environments.

---

## Common Failure Patterns

- **The PX Trap:** Setting `html { font-size: 16px; }` or hardcoding `font-size: 14px` on the body. This overrides the user's default browser preference, preventing system-level font scaling.
- **The Visual Overlap:** Using hardcoded container heights (`height: 300px`) combined with `position: absolute` elements. When text scales up, sentences spill out of their containing box and overlay adjacent items.
- **The "Desktop Trap" under Zoom:** Media queries declared in `px` instead of `em`. When a user scales text up, the page layout does not shift to a tablet/mobile column layout, causing text to squish into microscopic, unreadable columns.
- **The Infinite Horizontal Scrollbar:** Setting fixed container widths on inner layout blocks. At 400% zoom, the horizontal scrollbar triggers, violating WCAG Reflow guidelines which mandate vertical-only scrolling at that zoom level.
- **Unitless 100% clamp override:** Writing dynamic clamps such as `font-size: clamp(12px, 4vw, 24px)`. These static pixels and pure viewport factors completely ignore browser text size adjustments.

---

## Validation Criteria

### 1. Browser Font Size Scale Test (System Resize)
- [ ] In Google Chrome, go to **Settings > Appearance > Font Size** and set it to "Very Large" (or customize custom font size to `32px` - equivalent to 200%).
- [ ] Open the page in a new window at **100% page zoom**.
- [ ] Verify that all text has enlarged to twice its size, but layouts remain perfectly aligned, with zero text clipping, overlapping, or truncation.
- [ ] Confirm no horizontal scrollbar was introduced on standard desktop screen sizes.

### 2. WCAG Reflow Zoom Test (400% Page Zoom)
- [ ] Set your desktop browser to a window width of **1280px** and height of **1024px**.
- [ ] Use `Cmd +` (or `Ctrl +`) to zoom the page scale up to **400%**.
- [ ] This mimics a viewport of **320px** wide at 100%.
- [ ] Verify that the page reflows entirely into a single vertical column.
- [ ] Verify that all content remains readable and accessible without requiring horizontal scrolling (except for images, maps, or complex tables which are naturally exempt).

### 3. Code Quality Inspection
- [ ] Search the stylesheet for hardcoded container height rules (`height: Xpx`). Confirm they are replaced with `min-height` or deleted entirely.
- [ ] Audit the CSS for standard media queries. Ensure they use `em` units (e.g., `@media (min-width: 48em)` instead of `@media (min-width: 768px)`).
- [ ] Confirm that `clamp()` expressions always have a text-based relative unit (like `rem` or `em`) in their middle argument.
- [ ] Check for `text-overflow: ellipsis` or `overflow: hidden` on containing blocks. Ensure it is only used on non-vital text, or paired with toggle controls to read more.
