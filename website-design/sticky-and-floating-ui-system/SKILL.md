---
name: sticky-and-floating-ui-system
description:
  Design a systematic framework for persistent, overlaying, and scroll-responsive UI elements,
  including progressive headers, mobile bottom docks, floating action buttons, and sticky sidebar
  widgets that maximize conversion and utility while preventing layout blocking and WCAG focus obscuration.
---

# Sticky and Floating UI System

## Purpose

The Sticky and Floating UI System provides a methodology for designing persistent, viewport-docked, and scroll-responsive interface components. It ensures that critical controls—such as primary navigation, conversion-driving calls-to-action (CTAs), contextual utility widgets, and quick-action buttons—remain easily accessible during active scroll states.

A well-designed sticky and floating system solves the spatial tension between immediate action availability and primary content consumption. It prevents layout fatigue, protects the viewport from excessive visual clutter, honors mobile physical safe areas (such as device notches and system home indicators), and strictly mitigates keyboard focus obscuration failures (WCAG 2.2 SC 2.4.11).

## Use Cases

- **Progressive Navigation Headers:** Headers that hide on scroll-down (maximizing reading area) and reveal on scroll-up (making navigation immediately available).
- **Mobile Persistent Bottom Docks:** Floating or docked bottom bars containing primary conversion actions (e.g., "Add to Cart", "Book Now", "Apply") for mobile layouts.
- **Sticky Sidebar Widgets:** Contextual sub-navigation, sharing bars, or product purchase configurations that scroll with the main content area but lock in place before reaching structural boundaries.
- **Floating Action Buttons (FABs):** Viewport-anchored triggers for quick high-frequency actions, such as "Back to Top" navigation, direct support chats, or cart drawers.
- **Anchor and Reading-Progress Bars:** Sticky elements tracking viewport completion rates or offering direct links to page-body subsections.

## When NOT to Use

- **Data-Dense SaaS Dashboards:** Where screen space is heavily constrained by tabular data, work canvases, or viewport-locked panels; use `dashboard-layout-system`.
- **Short/Single-Viewport Pages:** Where the entire page content fits within a single screen view and can be accessed without scrolling.
- **Narrative-Driven Experimental Sites:** Where intentional visual disorientation or immersive 3D spatial flow is chosen over standard navigation utility.
- **Keyboard-Focused Forms:** Overloading pages with multi-field forms with sticky buttons that overlap and cover active input fields on mobile virtual keyboards.

## Inputs

1. **Content and Narrative Structure:** The page's wireframe sequence (from `section-composition-system`) to understand when and where sticky elements should activate.
2. **Device Viewport Constraints:** Target mobile, tablet, and desktop breakpoints to adapt layouts between docked bars and floating side containers.
3. **Primary and Secondary CTAs:** Identification of the conversion goals that require persistent visibility.
4. **Z-Index Stacking Strategy:** Stacking relationships and tiers established in `elevation-and-depth-system` to prevent visual overlapping conflicts.
5. **System Safe-Area Metrics:** Hardware safe-area insets (`env(safe-area-inset-bottom)`, notches) required to prevent device chrome overlaps.

## Outputs

1. **Sticky Behavior Specification:** Explicit definitions of scroll triggers, animation thresholds, and entry/exit transition formulas.
2. **Mobile Bottom Dock Layout:** Spatially optimized layout blueprints for mobile screens, detailing target sizes, safe-area offsets, and contrast requirements.
3. **Obscuration Mitigation Map:** Design definitions showing how to keep sticky overlays from blocking focused elements (WCAG 2.2 SC 2.4.11).
4. **Desktop Sidebar/Widget Locking Spec:** Boundary rules (headers, footers, section end-points) where scrolling side elements must snap-in and lock.

## Workflow

### 1. Establish Viewport Zoning and Spatial Budgets

Before positioning persistent layers, define the "Visual Safe Zone" to ensure content readability is preserved.
- **The 15% Budget Rule:** Sticky elements must never consume more than 15% of the total vertical viewport on any device screen.
- **Z-Index Assignment:** Assign clear stacking values using `elevation-and-depth-system` tiers.
  - Progressive Headers: `z-index: 100` (Level 3: Sticky)
  - Mobile Bottom Docks: `z-index: 150` (Level 3: Sticky / Floating)
  - Floating Action Buttons: `z-index: 200` (Level 3: Floating Triggers)
- **Avoid Stacked Overlap:** Never allow a sticky header and a sticky bottom bar to both remain static if they crowd the screen; ensure they have enough breathing room or hide under specific states.

### 2. Design the Progressive Header Behavior

A static sticky header occupies valuable vertical pixels. Implement a "Progressive" model:
- **Default State:** Transparent or integrated header matching the page background.
- **Scroll-Down (Threshold >100px):** Smoothly translate the header up out of view (`transform: translateY(-100%)`) to maximize content scanning area.
- **Scroll-Up (Delta >15px):** Instantly or smoothly translate the header back into view, applying a solid or blurred surface background (`backdrop-filter: blur(8px)`) with a subtle shadow to indicate separation from page body text.
- **Boundary Stop:** Disable the scroll-up transition once the scrollbar returns to the top of the viewport (scrollY < 50px), returning the header to its original static layout.

### 3. Engineer the Mobile Persistent Bottom Dock

Bottom persistent bars are major drivers of mobile conversion, but they are highly prone to physical and visual interference.
- **Physical Safe Areas:** Always anchor the bottom edge of the dock using CSS environment variables: `padding-bottom: calc(var(--base-padding) + env(safe-area-inset-bottom))`. This ensures it sits cleanly above the iOS Home Indicator and Android navigation bars without overlapping interactive triggers.
- **Entering Scroll-Trigger:** Do not show the mobile bottom dock in the initial Hero viewport. Wait until the user has scrolled past the main inline CTA of the Hero section (Threshold > 100% VH) before sliding the dock up from the bottom (`transform: translateY(0)` from `translateY(100%)`).
- **Layout Splitting:** Limit the dock to a single primary action button (e.g., "Add to Cart") and one secondary utility button/badge (e.g., "Price" or "Save") to keep tap targets extremely clean.

### 4. Structure Desktop Sticky Sidebars and Widgets

A sidebar widget must remain locked in viewport focus while scrolling alongside deep main-content columns:
- **Container Isolation:** The sidebar must reside inside a column container matching the height of the main content area.
- **Position Sticky Spec:** Style the widget with `position: sticky; top: calc(var(--header-height) + var(--space-l));`. This prevents the widget from sliding behind or overlapping the main navigation bar.
- **Footer Boundary Lock:** Ensure the sticky widget's parent column has `overflow: visible` (or is properly contained within a Grid flex wrapper), allowing the browser to naturally stop the widget from overlapping the global footer or bottom sections.

### 5. Prevent Keyboard Focus Obscuration (A11y Core)

One of the most frequent web design accessibility failures occurs when a keyboard tab-user focuses on a link, but that link is hidden underneath a sticky header or bottom dock (violating WCAG 2.2 SC 2.4.11 Focus Not Obscured).
- **Scroll Margin Top:** Apply a global `scroll-margin-top` to all target sections, headings (`h2`, `h3`), and key interactive targets:
  ```css
  :target, [id] {
    scroll-margin-top: calc(var(--header-height) + var(--space-m));
  }
  ```
- **Focus Padding:** If an interactive element receives keyboard focus, the browser view must scroll so that the element is fully visible outside the boundary of any persistent sticky overlay.
- **Escape Hatch:** If a modal or dropdown is opened from a sticky element, trap the focus (using `focus-trap-implementation`) and make background page content `inert`.

### 6. Design Floating Action Buttons (FABs) and Back-to-Top Triggers

FABs sit in the lower corners of the viewport to offer quick, secondary global utilities.
- **Threshold-Based Entrance:** Hide the "Back to Top" trigger until the user has scrolled through at least two full viewports (scrollY > 200% VH). Once triggered, fade and scale it in (`transform: scale(1); opacity: 1;` from `scale(0.8); opacity: 0;`).
- **Viewport Offsets:** Keep FABs at least `24px` away from the right viewport edge on desktop, and `16px` on mobile.
- **Avoid Target Blocking:** Position FABs horizontally opposite to primary content read lines. Ensure they do not block links, social icons, or inline navigation in the footer when scrolling to the page bottom.

## Decision Rules

- **Static vs. Progressive Header:** Use a **Static Sticky Header** if the site is a task-heavy web portal or e-commerce shop where search and filtering are constantly used. Use a **Progressive Sticky Header** for article layouts, content marketing, or sales landing pages where vertical reading area is a priority.
- **Bottom Dock vs. Inline CTA:** On mobile, use a **Bottom Docked CTA** if the page contains a single high-value conversion goal (like signing up or purchasing). Do not use a bottom dock if the page has multiple competing equal-priority actions.
- **FAB Sizing and Touch Area:** Ensure floating triggers are circular or rounded cards. The visual element must be at least `48px` in diameter, and the actual interactive tap container must meet a minimum footprint of `44x44px` (WCAG 2.2 preferred) to allow easy thumb access.
- **Progressive Blur vs. Solid Colors:** Use `backdrop-filter: blur(8px)` with a slightly transparent color (e.g., `rgba(255, 255, 255, 0.8)`) instead of fully opaque backgrounds. This maintains a sense of visual depth and lets the user perceive scroll progress behind the sticky frame.

## Constraints

- **Accessibility (WCAG AA Minimum):**
  - **SC 2.4.11 Focus Not Obscured (Minimum):** High-contrast focus rings must never be hidden behind sticky elements. Ensure elements can be tabbed through cleanly without being blocked by headers or footers.
  - **SC 2.5.8 Target Size (Minimum):** All interactive targets in sticky bars and FABs must be at least 24x24px, with 44x44px preferred for primary thumb triggers on mobile bottom docks.
  - **No Tab Trap:** Keyboard users must be able to navigate into and out of sticky bar controls using standard `Tab` / `Shift+Tab`.
- **Responsiveness (Layout Stability):**
  - Sticky layers must never cause horizontal viewport overflow. Use percentage-based widths or `left: 0; right: 0;` layouts with precise box-sizing constraints.
  - On mobile, transition desktop sticky sidebars into simple inline panels or collate them into the bottom drawer.
- **Layout Shift Mitigation (CLS):**
  - Never change an element from `position: static` to `position: fixed` dynamically without reserving its original spatial volume. Switching to `fixed` instantly collapses its original container height, causing a massive Cumulative Layout Shift (CLS). Instead, use `position: sticky` (which reserves layout volume) or toggle styles within a pre-reserved container.

## Common Failure Patterns

- **The Focus Blocking Veil:** A keyboard user tabs through the page, but the focus ring lands on links that are completely hidden underneath the sticky header, making them impossible to see.
- **The iOS Home Indicator Overlap:** Docking a mobile bottom bar without adding `env(safe-area-inset-bottom)`, which results in the native OS swipe-bar sitting directly on top of the "Buy Now" button.
- **The Jittery Scroll Loop:** Setting up a scroll transition using JavaScript that triggers precisely at a boundary line, causing the sticky bar to cycle between visible and hidden states in a rapid visual stutter.
- **The Viewport Sandwich:** Having a thick sticky header and a thick sticky bottom bar active simultaneously on a small mobile device, reducing the readable screen space to a tiny 40% window.
- **The CLS Snapping Collapse:** Toggling a header to `fixed` on scroll, which instantly snaps the main page content up by `80px` and disorients the user.

## Validation Criteria

- [ ] **Viewport Area Check:** Sticky elements never occupy more than 15% of the vertical viewport on desktop or mobile.
- [ ] **Focus Protection (SC 2.4.11):** All keyboard-focused elements remain fully visible outside the boundaries of persistent sticky elements. Global `scroll-margin-top` is configured.
- [ ] **Mobile Safe-Area Alignment:** The mobile bottom dock explicitly utilizes `env(safe-area-inset-bottom)` to prevent device control overlaps.
- [ ] **Trigger Threshold Logic:** The mobile bottom dock stays hidden in the initial Hero viewport, fading/translating in only after passing the Hero CTA.
- [ ] **Layout Shift Prevention:** Progressive headers and sticky sidebar widgets are styled using `position: sticky` or are placed within pre-measured containers to guarantee zero Cumulative Layout Shift (CLS).
- [ ] **No Overlap Clashing:** Stacking context z-indexes are clearly mapped and documented to prevent overlapping visual errors.
- [ ] **Target Footprints:** Mobile docked triggers and FABs meet the 44x44px touch target preference.
