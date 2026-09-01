---
name: split-screen-layout-system
description: Design and structure high-impact dual-panel split-screen web pages and hero sections with responsive stacking, independent scrolling, high-contrast visual balance, and WCAG AA accessibility.
---

# Split-Screen Layout System

## Purpose

The Split-Screen Layout System provides a systematic design framework for structuring dual-panel web pages and hero sections (e.g., 50/50, 60/40, or visual/interactive splits). It balances two distinct content streams—such as marketing storytelling vs. conversion forms, or visual brand media vs. interactive UI tools—within a single viewport or section.

This system solves critical layout and user experience challenges:
- Eliminating visual competition and awkward focal points when two high-priority content blocks share equal horizontal weight.
- Managing responsive mobile stacking order so primary conversion actions or key narrative context are never lost below fold lines.
- Preventing scroll locking and nested scroll traps when combining fixed media panels with variable-height scrolling content.
- Ensuring independent color themes (e.g., dark media panel paired with light form panel) maintain WCAG AA contrast and clear focus indicators across panel boundaries.

## Use Cases

- **Authentication & Onboarding Pages:** Pair a focused, high-converting sign-in/sign-up form on one panel with brand testimonials, feature previews, or animated product graphics on the other.
- **Split Hero Sections:** Deliver a primary value proposition and call-to-action on one panel alongside an interactive product demo, high-res showcase media, or code sandbox on the adjacent panel.
- **Comparative & Side-by-Side Views:** Contrast two opposing options, product tiers, before-and-after states, or target persona paths with clear, symmetrical visual weighting.
- **E-Commerce Product & Checkout Showcases:** Present sticky high-impact lifestyle/product visuals on one side while shoppers scroll through product variants, specifications, and cart summary on the other.

## When NOT to Use

- **Multi-Card Content Collections:** For displaying multiple discrete cards or variable-height content items simultaneously, use `bento-grid-layout-system` or `responsive-grid-system`.
- **Resizable Developer Panes:** For IDEs, split-view code editors, or user-draggable panes requiring live drag-resizing, pointer capture, and keyboard splitter controls, use `accessible-split-pane-implementation`.
- **Master-Detail Data Interfaces:** For email clients, admin tables, or document trees where selecting an item from a list populates a detail view, use `master-detail-layout-system`.
- **Linear Narrative Reading Pages:** For uninterrupted text-heavy articles, editorial essays, or documentation pages, use `article-layout-system`.

## Inputs

1. **Panel Content Inventory & Intent:** Classification of content for both panels (e.g., Primary Action/Form vs. Brand Media/Illustration).
2. **Proportional Ratio Requirement:** Target split ratio based on content density (`50/50` equal weight, `60/40` action-heavy, `40/60` media-heavy).
3. **Scroll & Pin Strategy:** Determination of panel height behavior (`100vh` locked split, sticky media with scrolling text, or standard natural height flow).
4. **Theme & Palette Boundary Map:** Surface background colors, dark/light contrast modes, and surface elevation for each panel.
5. **Breakpoint & Stacking Priority:** Mobile breakpoint threshold (`768px` or `1024px`) and stacking sequence rule (Action First vs. Context First).

## Outputs

1. **Split-Screen Layout Specification:** Structural grid and flexbox definitions including ratio tracks, fluid padding tokens, and container query thresholds.
2. **Responsive Mobile Stacking Map:** Blueprint defining element DOM ordering vs. visual stacking placement across viewports.
3. **Scroll & Height Orchestration Spec:** Detailed CSS rules for viewport locking, sticky positioning (`position: sticky`), and overflow behavior (`overflow-y: auto`).
4. **Surface Contrast & Focus Isolation Matrix:** Color mapping and focus-visible styling that guarantees WCAG AA compliance across panel theme transitions.

---

## Workflow

### 1. Establish Split Ratios and Spatial Composition
Select the proportional split that matches the visual dominance of your content.
- **50/50 Equal Split:** Best for binary choices, equal side-by-side comparisons, or balanced SaaS landing hero sections where image and copy hold equal weight.
- **60/40 Primary Action Split:** Allocate 60% of horizontal width to the primary action panel (e.g., complex multi-step forms, interactive calculator) and 40% to secondary media/social proof.
- **40/60 Media Showcase Split:** Allocate 60% to immersive visual media (e.g., product video, interactive 3D model) and 40% to minimal headline, description, and primary CTA.

### 2. Determine Height and Scroll Mechanics
Choose the scrolling paradigm based on content volume and page role.
- **Full Viewport Lock (`100vh` / `100dvh`):** Both panels locked to viewport height without overall page scroll. Ideal for auth pages and compact onboarding flows. Use `overflow-y: auto` on the scrolling panel if content exceeds short viewports.
- **Sticky Media + Natural Content Scroll:** The media panel stays pinned (`position: sticky; top: 0; height: 100vh`) while the adjacent content panel scrolls naturally with the page. Best for feature deep-dives and e-commerce product pages.
- **Symmetrical Section Split:** A standard page section that fits naturally within section padding without locking viewport heights.

### 3. Establish DOM Source Order and Mobile Stacking Strategy
Ensure DOM order matches logical keyboard tab sequence and screen reader reading flow.
- **Context First Rule:** Place the narrative headline or value proposition first in the HTML source code, followed by the form or visual element.
- **Mobile Flex Direction Override:** On mobile screens (< 768px), switch from horizontal row layout (`flex-direction: row` or `grid-template-columns: 1fr 1fr`) to single column (`flex-direction: column` or `grid-template-columns: 1fr`).
- **Visual Stacking Order:** If the form is critical for mobile conversion, place it first in visual order using CSS grid or flex order, while preserving semantic heading structure for screen readers.

### 4. Design Theme Boundaries and Contrast Transitions
Manage contrast when panels feature split themes (e.g., dark mode left, light mode right).
- **Explicit Surface Tokens:** Define distinct CSS custom properties for each panel (e.g., `--panel-left-bg`, `--panel-left-text`, `--panel-right-bg`, `--panel-right-text`).
- **Focus Indicator Visibility:** Ensure global focus ring colors remain visible against both light and dark panel backgrounds. Use dual-color outlines (`outline: 2px solid var(--accent); outline-offset: 2px`) or adaptive focus tokens per panel.
- **Visual Divider/Separator:** Introduce a crisp border or subtle elevation shadow between panels if background contrast between left and right panels is below `1.2:1`.

### 5. Apply Fluid Typography and Responsive Spacing
Scale padding and font sizes smoothly as viewports adjust.
- Use fluid spacing tokens (e.g., `padding: clamp(1.5rem, 4vw, 4rem)`) so panel padding shrinks gracefully before reaching the mobile breakpoint.
- Constrain maximum line length inside wide text panels using `ch` units (`max-width: 60ch`) to maintain optimal readability.

---

## Decision Rules

### Split Ratio Selection Matrix

| Content Configuration | Recommended Ratio | Desktop Layout CSS | Mobile Stacking Order |
| :--- | :--- | :--- | :--- |
| **Auth / Sign-In Form + Brand Testimonial** | `50 / 50` or `45 / 55` | `grid-template-columns: 1fr 1fr` | Form Top (1st), Brand Media Bottom (2nd) |
| **SaaS Hero + Interactive Product UI** | `40 / 60` | `grid-template-columns: 4fr 6fr` | Hero Text/CTA Top, Interactive UI Bottom |
| **Complex Form / Calculator + Summary** | `60 / 40` | `grid-template-columns: 6fr 4fr` | Calculator Top, Summary Bottom |
| **Side-by-Side Comparison (Plan A vs B)** | `50 / 50` | `grid-template-columns: 1fr 1fr` | Option A Top, Option B Bottom |

### Scroll Behavior Selection

```text
Is content strictly bounded within the viewport (e.g., Auth Page)?
├── YES ──> Use Viewport Lock (height: 100dvh, overflow-y: auto on form panel)
└── NO  ──> Is one panel a long scrolling narrative and the other a visual asset?
             ├── YES ──> Use Sticky Media Split (position: sticky; top: 0 for media panel)
             └── NO  ──> Use Natural Section Split (standard padding-box flow)
```

---

## Constraints

- **Dynamic Viewport Height (`dvh`):** Always use `100dvh` instead of `100vh` for full-screen split layouts to prevent UI clipping beneath mobile browser address bars.
- **Contrast Ratios (WCAG AA):** Text and essential controls in both panels must maintain minimum `4.5:1` contrast against their respective panel background.
- **Focus Indicator Visibility (WCAG 2.2 SC 2.4.13):** Focus outlines must not cross panel boundaries or become invisible when shifting from light to dark panel surfaces.
- **Touch Target Floor (WCAG 2.2 SC 2.5.8):** Interactive controls inside both panels must meet the minimum `24x24px` target size, preferring `44x44px` on mobile screens.
- **No Horizontally Trap Scrollbars:** Never set `overflow-x: scroll` on individual split panels unless delivering an explicit, accessible code sandbox or data table.

---

## Common Failure Patterns

- **The Mobile Double-Scroll Trap:** Setting `height: 100vh; overflow: hidden` on the page body while forcing an inner panel to scroll. On mobile, this causes nested scrollbars where users get trapped scrolling inside a panel instead of the main page.
- **Flipped Context on Mobile:** Stacking decorative graphics at the top of mobile viewports while pushing headlines and CTA buttons below the fold line, severely degrading mobile conversion.
- **Bleeding Focus Outlines:** Using a white focus outline that disappears when tabbing into a light-themed panel from a dark-themed adjacent panel.
- **Fixed Width Pixel Column Spans:** Hardcoding panel widths (e.g., `width: 600px; width: 600px`) causing horizontal overflow on laptop screens (1024px–1280px).
- **Unequal Height Ragged Layouts:** Leaving one panel with a stark dark background and short content next to a tall white scrolling panel, creating awkward empty void space at the bottom of the shorter panel.

---

## Validation Criteria

- [ ] **Fluid Proportioning:** Split panels scale responsively using relative units (`fr`, `%`, `vw`) without horizontal scrollbar trigger on viewports down to `320px`.
- [ ] **Mobile Stacking Integrity:** On viewports below `768px`, panels stack cleanly into a single column with primary conversion actions and key narrative visible without excessive scrolling.
- [ ] **Independent Contrast AA:** Text, inputs, and icons in both left and right panels pass `4.5:1` WCAG AA contrast against their specific surface colors.
- [ ] **Tab & Reading Sequence:** Tabbing sequence follows logical DOM order top-to-bottom and left-to-right without chaotic visual focus jumping.
- [ ] **Viewport Height Resilience (`100dvh`):** Full-bleed split layouts use dynamic viewport units (`100dvh`) to accommodate mobile browser chrome expansion/retraction without clipping buttons.
- [ ] **No Scroll Traps:** Inner panel scrolling (if present) gracefully releases focus and page scroll without locking user scroll gestures on touch devices.
