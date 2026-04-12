---
name: responsive-grid-system
description: Design and implement a flexible, column-based layout system that scales across devices. Trigger this skill when asked to structure page layouts, design UI components, or establish responsive behavior for a website.
---

# Responsive Grid System

## Purpose
The Responsive Grid System skill provides a structured foundation for organizing content on a webpage. By using a consistent set of columns, gutters, and margins, this system ensures visual alignment, maintains hierarchy, and simplifies the transition of designs across different screen sizes (Mobile, Tablet, Desktop).

## Use Cases
- Designing the structural layout of a new website or application.
- Building a UI kit or design system component library.
- Organizing complex content like dashboards or data-heavy interfaces.
- Ensuring a consistent vertical rhythm and horizontal alignment across multiple pages.

## When NOT to Use
- **Experimental/Brutalist Designs:** When the visual goal is to intentionally break standard layout conventions for artistic effect.
- **Single-Purpose Simple Pages:** When the content is so minimal (e.g., a single centered form) that a full grid system adds unnecessary overhead.
- **Fixed-Width Environments:** When the output is strictly for a non-responsive medium (though a grid is still useful for alignment).

## Inputs
To establish a responsive grid system, you need:
1.  **Device Breakpoints:** The screen widths where the layout changes (e.g., 600px, 900px, 1200px).
2.  **Column Counts:** Number of vertical tracks for content at each breakpoint (standard: 12 for desktop, 4 for mobile).
3.  **Gutter Width:** The space between columns (e.g., 16px, 24px).
4.  **Outer Margins:** The padding on the left and right edges of the viewport (e.g., 20px on mobile, 5% or fixed max-width on desktop).
5.  **Content Requirements:** A list of components and their relative priority/size.

## Outputs
1.  **Grid Specification:** A definition of columns, gutters, and margins for each major breakpoint.
2.  **Layout Map:** A visual or descriptive guide showing how components span columns at different sizes.
3.  **Implementation Logic:** CSS (Grid or Flexbox) properties to realize the system.

## Workflow

### 1. Define Breakpoints
Select the key screen widths where your layout needs to adapt.
*Common Scale:*
- **Mobile:** 0 - 599px
- **Tablet:** 600px - 899px
- **Desktop:** 900px+ (with a max-width container around 1200px-1440px)

### 2. Set Column & Gutter Parameters
Determine the "inner logic" of the grid.
- **Mobile:** 4 columns, 16px gutters, 16px margins.
- **Tablet:** 8 columns, 24px gutters, 32px margins.
- **Desktop:** 12 columns, 24px gutters, auto margins (centered container).

### 3. Establish Container Behavior
Decide if the grid is **Fluid** (scales as a percentage of viewport), **Fixed** (stays at a specific width until the next breakpoint), or **Adaptive** (a mix). *Recommendation:* Use a fluid grid with a fixed `max-width`.

### 4. Map Content to the Grid
Assign components to span specific column counts.
*Example:* A sidebar might span 3 columns on desktop (12-col grid), while the main content spans 9. On mobile, both would span all 4 columns (stacking).

### 5. Define Stacking & Ordering
Determine how elements move when the screen shrinks. Usually, elements on the left stack on top of elements on the right.

## Decision Rules
- **The 12-Column Rule:** Use a 12-column grid for desktop because it is divisible by 2, 3, 4, and 6, offering maximum flexibility.
- **Consistency:** Use the same gutter width throughout a single breakpoint to maintain alignment.
- **Mobile First:** Always design the 4-column mobile layout first to ensure core content is prioritized.
- **The "Safety Zone":** Ensure outer margins are large enough to prevent content from touching the screen edges on mobile devices.

## Constraints
- **Accessibility:** Ensure that when columns shrink, text remains legible and tap targets (buttons) remain large enough (min 44x44px).
- **Responsiveness:** No element should have a fixed pixel width that exceeds the mobile viewport width (avoid horizontal scrolling).
- **Hierarchy:** Use the grid to reinforce importance; more important elements should typically span more columns or appear higher in the stack.

## Common Failure Patterns
- **Inconsistent Gutters:** Using different spacing between different columns, which breaks the visual "line".
- **Gutter-less Design:** Placing content right against each other without breathing room (unless intentional for imagery).
- **Over-Complexity:** Creating too many breakpoints for minor adjustments, leading to unmaintainable CSS.
- **Ignoring the "In-Between":** Testing only at 320px and 1440px but ignoring how the layout looks at 800px or 1024px.

## Validation Criteria
- [ ] Content is perfectly aligned to the vertical lines of the grid.
- [ ] No horizontal scrollbars appear at any viewport width from 320px to 2560px.
- [ ] The transition between breakpoints feels logical and content remains readable.
- [ ] Gutters and margins remain consistent across the entire page.
- [ ] The system is implemented using relative units (%, fr, rem) rather than hardcoded pixels for column widths.
