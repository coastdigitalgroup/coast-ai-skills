---
name: text-zoom-and-resize-resilience
description:
  Design, build, and debug web layouts to ensure resilience to browser page zoom (up to 400%)
  and system/browser default text-only resizing (up to 200%) without content clipping,
  overlapping, or breaking, in compliance with WCAG 2.1 AA Reflow and Resize Text guidelines.
---

# Zoom and Text-Resize Resilient Layout Design

## Purpose

The Zoom and Text-Resize Resilient Layout Design skill provides a rigorous frontend development protocol for building layouts, components, and media assets that dynamically adapt when a user resizes browser text or zooms the page.

Over 2.2 billion people globally have a near or far vision impairment. To read web content comfortably, many of these users rely on:
1. **Default Font Size Scaling:** Adjusting the OS or browser's default font size (e.g., from `16px` to `24px` or `32px`). This shifts the browser root font size (`1rem`).
2. **Page Zooming:** Standard page scaling (e.g., zoom up to `400%` using `Ctrl +` / `Cmd +`). This scales the virtual viewport width down and increases the size of layout content in CSS pixels.

If a frontend developer builds layouts using fixed pixel heights (`height: 50px`), restricts horizontal container wrapping, positions overlapping elements absolutely, or defines media queries using absolute physical units (`px`), the text will break. It will clip inside container walls, spill over and overlap neighboring text blocks, or create uncomfortable double horizontal scrollbars.

This skill solves these issues by establishing a relative-unit framework (`rem`/`em`), utilizing fluidly wrapping layout architectures (Flexbox/Grid), defining zoom-proportionate media query breakpoints (`em`), and managing overflowing text content safely to ensure complete compliance with Web Content Accessibility Guidelines (WCAG) 2.1 AA Success Criteria:
- **Success Criterion 1.4.4 (Resize Text):** Text can be resized without assistive technology up to 200% without loss of content or functionality.
- **Success Criterion 1.4.10 (Reflow):** Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions (typically a vertical page scrolling horizontally at a width of 320 CSS pixels).

## Use Cases

- **Navbars and Headers:** Building headers that safely expand vertically or reflow to a mobile-style menu when text is enlarged.
- **Multi-column Grids & Cards:** Preventing fixed card heights from clipping long descriptions when the text is scaled to 200%.
- **Text-on-Image/Hero Overlays:** Ensuring text overlaid on fixed-aspect-ratio elements wraps cleanly and shifts elements underneath rather than overlapping them.
- **Data-dense Dashboards & Tables:** Ensuring sidebar panels, data columns, and control bars wrap and wrap gracefully instead of truncating critical labels.
- **Form Controls:** Designing text inputs, checkboxes, and buttons whose labels, padding, and tap targets scale in lockstep with the font.

## When NOT to Use

- **Fixed-Asset Canvas Games:** Real-time 2D/3D visual environments relying on absolute canvas pixel grids where HTML text reflow is physically inapplicable.
- **Native PDF Renderers/Exporters:** In-browser document generation targeting exact physical print/page boundaries (e.g., exactly 8.5" x 11" pages) where resizing layout elements breaks standard pagination. For general print stylesheets, use `print-style-optimization`.
- **Purely Decorative Graphic Art:** Svg-heavy illustrations or standalone decorative visual elements where text size is structurally tied to visual nodes.

## Inputs

1. **Document Typography Scale:** The base typography system (preferably defined in `rem` relative to a dynamic root `16px`).
2. **Target Layout/Component Code:** The CSS and HTML structure of elements experiencing text-clipping, overflow, or overlapping during zoom/resize testing.
3. **Responsive Breakpoint Matrix:** The standard media query widths used to pivot layouts across viewport widths.
4. **Target Zoom/Resize Goals:** Verification milestones, specifically **200% Text-Only Resize** and **400% Page Zoom**.

## Outputs

1. **Relative-Unit Layout Styles:** Refactored CSS declarations replacing absolute heights (`height`, `px`) with proportional flex/grid-based heights and margins using relative units (`rem`, `em`).
2. **Zoom-Aware Media Breakpoints:** Breakpoints defined using `em` rather than `px` to force layouts to adapt smoothly based on font size.
3. **Resilient Flex/Grid Configurations:** Flexbox structures equipped with wrap safeguards (`flex-wrap: wrap`) and Grid tracks using intrinsic sizing bounds (`minmax`, `auto`).
4. **Scrollable Overflow Overrides:** Strategic scroll container boundaries (`overflow-y: auto`) to protect isolated containers against silent clipping.

---

## Workflow

### 1. Execute a Font-Resize & Zoom Audit
To detect hidden fragility, inspect your components under extreme scaling environments:
- **Text-Only Scale:** Open your browser's settings and increase the default font size to maximum or 24px/32px. In Firefox, check `View -> Zoom -> Zoom Text Only`, then zoom in to 200%.
- **Page-Zoom Scale:** In Chrome or Edge, open DevTools, select responsive device mode, set the resolution to `1280px` wide, and set Page Zoom to `400%` (simulating a `320px` viewport).
- **Flag Errors:** Note any text clipping behind neighboring elements, horizontal overflow scrollbars on the main document, absolute text overlaps, or truncated titles.

### 2. Replace Fixed Vertical Constraints with Fluid Flow
Fixed vertical pixel values are the primary cause of text clipping.
- **Rule:** Never define a rigid `height` or `max-height` on containers holding text content (e.g., `height: 60px` or `max-height: 200px`).
- **Correction:** Replace with `min-height` (e.g., `min-height: 3.75rem`). This establishes a baseline layout dimension but allows the container to grow vertically if the text scales.
- **Gap & Padding:** Let container height be determined naturally by vertical padding (e.g., `padding: 1rem 0;`) and element `gap` spacing inside Flex/Grid containers.

```css
/* BAD: Fragile layout that clips text when resized */
.card-header {
  height: 64px;
  overflow: hidden;
}

/* GOOD: Resilient layout that expands naturally */
.card-header {
  min-height: 4rem; /* Baseline height */
  padding: 1rem;    /* Fluid vertical breathing space */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

### 3. Translate Pixel-Based Media Queries to Relative `em`
If media queries are declared in pixels (e.g., `@media (max-width: 768px)`), and a user sets their default browser font size to `32px` (200%), the text size doubles but the layout remains in "desktop" multi-column mode. The page has no physical space to support the expanded text, leading to severe overlap and clipping.

- **Rule:** Define all responsive breakpoints in `em` rather than `px`.
- **The Math:** Divide the pixel value by `16` (the default browser font-size).
  - `768px / 16 = 48em`
  - `1024px / 16 = 64em`
  - `1280px / 16 = 80em`
- **Result:** When the user increases their browser text size, the relative layout width of the breakpoint shifts proportionally. If the text is scaled by 2x, the `48em` breakpoint triggers at a physical screen width of `1536px` (`768px * 2`). This forces the browser to automatically deliver the mobile layout on desktop screens, giving the enlarged text the single-column space it needs to flow without clipping or requiring a horizontal scrollbar.

```css
/* BAD: Keeps desktop multi-column layout at large font sizes */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}

/* GOOD: Correctly pivots to single column when text size expands */
@media (max-width: 48em) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
```

### 4. Inject Fail-Safe Wrap Rules on Flex and Grid Layouts
Inline layouts (items side-by-side) are highly vulnerable to horizontal truncation and overlapping when text size expands.
- **Flexbox Wrap:** Always add `flex-wrap: wrap` to inline flex containers. If a text element inside the flex container grows, wrapping prevents it from pushing sibling items off-screen.
- **Grid Auto-sizing:** When using CSS Grid, avoid fixed column tracks (e.g., `grid-template-columns: 200px 1fr;`). Instead, use relative fractions or flexible intrinsic tracks like `minmax()` combined with wrapping capabilities.

```css
/* Good wrapping flex list */
.badge-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Elements drop to next line cleanly as text expands */
  gap: 0.5rem;
}

/* Good responsive grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18.75rem, 1fr)); /* minmax is 300px in rem */
  gap: 1.5rem;
}
```

### 5. Pair Local Scaling with the local `em` unit
While `rem` (root em) is the standard for universal spacing, certain interactive elements should have their internal spacing scale in direct proportion to their specific localized `font-size`.
- **Interactive Component Rule:** Use the `em` unit for inputs, buttons, toggles, and icons.
- **Why:** If you increase the font size of a button from `1rem` to `1.5rem`, any padding defined in `em` scales proportionally. This preserves the button's balanced visual ratio and ensures the focus indicator and touch targets maintain comfortable breathing room.

```css
.custom-button {
  font-size: 1rem; /* Inherited/scalable root font */
  padding: 0.5em 1em; /* Scales proportionally based on local font-size */
  border-radius: 0.25em;
}
.custom-button.large {
  font-size: 1.5rem; /* Padding automatically scales to 0.75rem 1.5rem */
}
```

### 6. Control Overflow clipping on isolated content
For deep-nested layouts where text scroll is a design-approved requirement (e.g., a custom data table row or scrollable sidebar panel):
- Apply `overflow-y: auto` or `overflow-x: auto` on containers containing text that could overflow.
- Ensure the focus outline remains visible if the user navigates into a scroll container. Add `tabindex="0"` to scrollable containers so keyboard users can focus and scroll the element using arrow keys. Pair with an `aria-label` describing the content (e.g., `aria-label="Scrollable code sample"`).

---

## Decision Rules

### When to Use `rem` vs. `em` vs. `px`

| Layout Property | Recommended Unit | Primary Rationale |
| :--- | :--- | :--- |
| **Typography (`font-size`)** | `rem` | Responds immediately to the user's root browser settings while maintaining a predictable global typographic scale. |
| **Layout Containers (`margin`, `padding`, `gap`)** | `rem` | Ensures page gutters, grid gaps, and section spacing scale in alignment with the content. |
| **Component Padding (`buttons`, `inputs`)** | `em` | Keeps internal padding perfectly proportional to the component's font-size, preventing visual distortion. |
| **Borders (`border-width`)** | `px` | Fine decorative borders (1px, 2px) are best defined in pixels to prevent sub-pixel rendering artifacts at fractional scales. |
| **Media Breakpoints (`@media`)** | `em` | Converts physical screen boundaries into font-relative triggers. Triggers the responsive layout earlier as text size grows. |

### Selecting Vertical Constraint Strategies

- **Primary Strategy (Default):** Maintain natural vertical document flow. Use no vertical bounds and rely on margins, paddings, and auto heights.
- **Secondary Strategy (Fixed Aspect Ratio needed):** If an element *must* keep a specific height (like a card image container), place the text *below* or *above* the container in the DOM flow. Never absolute-position multi-line content inside fixed-aspect boxes unless you can toggle scrollbars on overflow.

---

## Constraints

- **The WCAG "Two-Dimensional" Rule:** When zoomed to 400%, a vertical page must reflow so that users are *never* required to scroll horizontally to read a line of text. The document must wrap cleanly into a single vertical scroll stream.
- **Windows High Contrast Mode (WHCM):** Custom focus rings must not disappear under High Contrast templates. Always pair outline adjustments with `outline: 2px solid transparent; outline-offset: 2px;` to ensure system-generated borders appear in WHCM.
- **Native Browser Zoom Limits:** Standard browsers zoom up to 500% natively, but WCAG requirements evaluate up to 400% on a standard desktop screen (equivalent to a 320px viewport). Ensure all responsive components are fully operational at this scale.

## Non-Goals

- Creating responsive desktop-to-tablet CSS breakpoints (covered by general layout systems like CSS Grid).
- Custom polyfilling for browsers that do not support CSS variables or flex wrap (every modern browser natively supports these).
- Scaling vector paths inside `<svg>` nodes proportionally (handled by native SVGs and coordinate scaling).

---

## Common Failure Patterns

- **The "Overlapping Text" Collision:** Hardcoding a fixed container height and placing text elements inside. When the text scales, it breaks out of the bottom of the container and overlays the paragraph below it, rendering both unreadable.
- **The "Mute Button" Breakage (Mismatched Media Queries):** Breaking layouts when using pixel-based media queries on a page where the default font size has been doubled. The desktop multi-column layout is preserved, but columns are squeezed, clipping navigation links and content.
- **Silent Truncation:** Misusing `text-overflow: ellipsis` or `overflow: hidden` on descriptive text paragraphs. Instead of allowing the paragraph to wrap and grow, the text is quietly sliced off, causing critical information loss for both screen readers and visual users.
- **The "Stitched" Inline Nav:** Placing inline navigation links side-by-side with hardcoded padding and no wrap rules. Scaling font sizes forces the links to overflow the side of the viewport, creating a secondary horizontal scroll bar at the top of the screen.
- **Line Height Squeeze:** Setting absolute line heights in pixels (e.g., `font-size: 1.5rem; line-height: 20px;`). As the font scales, lines overlap vertically. Always define line-height as a unitless multiplier (e.g., `line-height: 1.5`).

---

## Validation Steps

- [ ] **200% Text-Only Resize Audit:**
  - In Firefox, enable `Zoom Text Only` under `View -> Zoom`.
  - Zoom the viewport in to 200%.
  - Verify that all headers, text containers, cards, and nav links expanded cleanly without clipping or overlapping.
- [ ] **400% Page-Zoom Reflow Audit:**
  - Open Chrome/Edge DevTools. Set responsive mode width to `1280px`.
  - Zoom the page in to `400%`.
  - Verify that the layout adapted seamlessly to its single-column mobile view, and that the main document does *not* require horizontal scrolling to read any text line.
- [ ] **Relative Unit Inspections:**
  - Inspect elements using DevTools Computed styles.
  - Verify that there are no absolute `height`, `max-height`, or media-query rules defined in `px` (except for small icons or border thicknesses).
- [ ] **Flex/Grid Wrap Assurance:**
  - Shrink the browser container. Verify that all inline lists, tag clouds, or badge collections wrap cleanly to the next line rather than running off-screen.
- [ ] **Keyboard Nav in Scrollable Overflow:**
  - If any container implements `overflow: auto` to catch large text blocks, verify that it has a valid `tabindex="0"` and appropriate `aria-label`, allowing a keyboard user to focus it and scroll using arrows.
