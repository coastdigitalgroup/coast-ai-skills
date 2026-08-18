---
name: focus-visible-styling-system
description:
  Build, audit, and remediate high-contrast focus indicators using :focus-visible and CSS outline/box-shadow techniques that comply with WCAG 2.2 AA (SC 2.4.7, SC 2.4.11, SC 2.4.13) without disturbing pointer interactions.
---

# Focus Visible Styling System

## Purpose

The Focus Visible Styling System provides a comprehensive architecture, standard implementation patterns, and debugging guidelines for designing and implementing accessible focus indicators across modern web components.

It solves the core frontend challenge of maintaining clear keyboard navigation cues that comply with **WCAG 2.2 AA (SC 2.4.7 Focus Visible, SC 2.4.11 Focus Appearance, and SC 2.4.13 Focus Unobscured)** without introducing unwanted focus rings during mouse clicks or touch taps, and without suffering from contrast loss in dark mode or Windows High Contrast Mode (Forced Colors).

---

## Use Cases

- **Design System Focus Ring Tokens:** Establishing standardized CSS custom properties for focus indicators across custom buttons, links, form controls, tabs, and interactive cards.
- **Mouse vs. Keyboard Modality Separation:** Suppressing persistent focus outlines on mouse/touch clicks while strictly preserving focus styling for keyboard navigation (Tab/Shift+Tab) and screen reader focus.
- **Component Remediation for WCAG 2.2 SC 2.4.11 / 2.4.13:** Refactoring components where focus outlines fail contrast ratios against dynamic background colors or are clipped by `overflow: hidden` containers.
- **Windows High Contrast Mode (WHCM) Integration:** Ensuring focus indicators remain visible when custom `box-shadow` or background color tricks are stripped by forced-colors mode.
- **Sticky / Floating Element Focus Guardrails:** Preventing fixed headers, banners, or floating footers from obscuring focused controls during sequential tabbing.

---

## When NOT to Use

- **Non-Interactive Content:** static text, structural containers, and non-actionable card wrappers should not receive focus or focus rings unless programmatically made focusable for screen reader roving tabindex patterns.
- **Standard Native Native Browser Controls without Custom Styling:** If an application relies entirely on unstyled browser native elements (`<input type="text">`, `<button>`) and default user agent focus rings are acceptable to the design system, custom focus ring overrides are unnecessary.
- **Canvas / WebGL Rendering Contexts:** Internal rendering of canvas scenes cannot use CSS `:focus-visible`. Use fallback HTML accessibility nodes or custom canvas state management instead.

---

## Inputs

1. **Target Markup:** HTML/JSX structure for interactive elements (`<button>`, `<a>`, `<input>`, `[tabindex="0"]`).
2. **Color Palette Tokens:** Theme color variables for surface background, primary accent, background contrast, and high-contrast outline borders.
3. **Container Boundary Rules:** CSS property rules on parent containers (`overflow`, `position: sticky`, `z-index`, `clip-path`).
4. **Target WCAG Conformance Level:** Level AA or Level AAA requirement for minimum contrast ratio (3:1 vs 4.5:1) and pixel thickness/area calculations.

---

## Outputs

1. **Focus Visible CSS Rules:** Modular CSS rules leveraging `:focus-visible`, `outline`, `outline-offset`, and dual-ring `box-shadow` patterns.
2. **Forced Colors / Dark Mode Enhancements:** CSS `@media (forced-colors: active)` and theme-aware focus ring variables ensuring high visibility across all environments.
3. **Focus Ring Offset & Clipping Defenses:** Layout adjustments (`outline-offset`, scroll margins, or relative positioning) that prevent focus clipping inside overflow boxes.

---

## Workflow

### 1. Enforce Modality Separation via `:focus-visible`
- **Never use `outline: none` or `outline: 0` without immediately providing a `:focus-visible` replacement.**
- Reset legacy `:focus` outlines strictly when `:focus:not(:focus-visible)` is active, or rely on modern browsers' native `:focus-visible` semantics.
- Apply focus indicator rules using `element:focus-visible` so that keyboard navigation triggers the visual ring, while mouse pointer clicks suppress it.

```css
/* Core Modality Rule */
.btn:focus {
  outline: none; /* Suppress generic focus ring if focus-visible is supported */
}

.btn:focus-visible {
  outline: 2px solid var(--focus-ring-color, #0969da);
  outline-offset: 2px;
}
```

### 2. Implement the Double-Ring / High-Contrast Pattern
A single-color focus outline easily loses contrast when positioned over complex gradients, dark/light themes, or multi-colored images.
- Combine a solid outer `outline` with a contrasting inner `box-shadow` (or `outline-offset` spacing with high contrast against the background).
- The dual-ring approach guarantees visibility: a 2px outer primary color ring with a 2px offset or inner white/black contrast line.

```css
.interactive-element:focus-visible {
  outline: 2px solid var(--focus-color, #0284c7);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--focus-halo, rgba(2, 132, 199, 0.25));
}
```

### 3. Handle High Contrast Mode (Forced Colors)
In Windows High Contrast Mode / Forced Colors, `box-shadow` and `rgba()` background halos are completely removed by the browser engine.
- Always use native `outline` (e.g., `outline: 2px solid CanvasText` or `outline: 2px solid Transparent`) alongside custom shadows.
- System colors like `Highlight` or `CanvasText` adapt automatically in forced-colors mode.

```css
@media (forced-colors: active) {
  .interactive-element:focus-visible {
    outline: 3px solid Highlight !important;
    outline-offset: 3px;
  }
}
```

### 4. Prevent Clipping with Overflow and Containment
When an element inside a scrollable container with `overflow: hidden` or `overflow: auto` gains focus, a positive `outline-offset` can be clipped by the parent bounding box.
- For tight overflow containers, use negative `outline-offset` (e.g., `outline-offset: -2px`) or an inset `box-shadow` to keep the focus ring within the element's interior boundaries.
- Ensure containers have sufficient padding (at least 3-4px) if outer outlines are required.

### 5. Support SC 2.4.13 Focus Unobscured (WCAG 2.2)
When users tab through elements, sticky headers, fixed navigation bars, or floating cookiebanners can obscure focused elements.
- Apply `scroll-margin-top` and `scroll-margin-bottom` to interactive elements equal to the height of sticky headers/footers.
- This ensures the browser automatically scrolls the focused element into full view with a visible buffer.

```css
.focusable-card,
:is(h1, h2, h3, button, a, input, [tabindex="0"]) {
  scroll-margin-top: 5rem; /* Height of sticky header + gap */
  scroll-margin-bottom: 2rem;
}
```

---

## Decision Rules

### Focus Indicator Strategy Matrix

| Component Type | Preferred Technique | Rationale | Fallback / Guardrail |
| :--- | :--- | :--- | :--- |
| **Buttons & Action Links** | Outer `outline` (2px) + `outline-offset: 2px` | Leaves element geometry intact; clearly separates focus ring from button background. | Use negative offset (`-2px`) if inside tight toolbar containers. |
| **Form Controls (Input, Select)** | Dual-ring (`outline` + `border-color` highlight) | Provides immediate feedback both on the input border and surrounding focus area. | Avoid replacing inputs with `overflow: hidden` wrappers. |
| **Card Components / Grid Tiles** | Inset `outline` (`outline-offset: -3px`) or inset `box-shadow` | Prevents outline clipping from grid gaps or `overflow: hidden` edges. | Ensure inner content has 4px internal padding so outline doesn't overlap text. |
| **Custom Toggles & Switches** | Custom `box-shadow` ring + solid `outline: 2px solid transparent` | Allows rounded halo shapes while keeping `outline` present for High Contrast Mode. | Must test under `@media (forced-colors: active)`. |
| **Inline Text Links** | `outline: 2px solid` with `outline-offset: 1px` and `border-radius: 2px` | Wraps multiline text links without creating rectangular box distortion across line breaks. | Avoid `box-shadow` on multiline inline links (causes line-break box glitches). |

---

## Constraints

- **WCAG 2.2 SC 2.4.7 (Level A - Focus Visible):** Any keyboard-operable user interface must have a mode of operation where the keyboard focus indicator is visible.
- **WCAG 2.2 SC 2.4.11 (Level AA - Focus Appearance):**
  - **Contrast:** Focus indicator must have a contrast ratio of at least **3:1** between its focused state color and unfocused state background, AND between focused state color and adjacent background colors.
  - **Area:** Focus indicator area must be at least as large as a 1px thick perimeter around the component, or 4px thick solid line along the shortest side.
- **WCAG 2.2 SC 2.4.13 (Level AA - Focus Unobscured):** When an item receives keyboard focus, it must not be fully hidden by author-created sticky headers, floating overlays, or sticky footers (Minimum: item must be partially visible; Level AAA requires 100% unobscured).

---

## Non-Goals

- Replacing or overriding screen-reader virtual cursor announcement behavior.
- Polyfilling `:focus-visible` for Internet Explorer 11 or non-evergreen browser environments (modern evergreen browsers support `:focus-visible` natively since 2022).
- Defining complex focus traversal order or managing programmatic focus traps (use `focus-trap-implementation` skill for focus management).

---

## Common Failure Patterns

- **The `outline: none` Sin:** Applying `* { outline: none; }` or `button:focus { outline: none; }` globally without providing a replacement `:focus-visible` rule. Keyboard users become completely lost.
- **Low Contrast Focus Rings:** Using low-contrast pastel colors or subtle 1px gray rings that fail the 3:1 contrast requirement against dark or white backgrounds.
- **The Invisible Clipping Mask:** Setting `outline-offset: 4px` on interactive elements housed inside parent containers with `overflow: hidden`. The focus ring is completely chopped off visually.
- **Forced-Colors Invisibility:** Relying exclusively on `box-shadow` or background color shifts for focus state. In Windows High Contrast Mode, `box-shadow` is removed, leaving zero visual indication of focus.
- **Sticky Header Occlusion:** Tab focus moves to an input field behind a `position: sticky` top navigation bar, rendering the focus indicator completely invisible to the user.

---

## Validation Steps

### 1. Modality & Contrast Verification
- [ ] Navigate the page using **Tab / Shift+Tab**. Confirm every interactive element displays a distinct, high-contrast focus ring.
- [ ] Measure contrast of focus ring against adjacent backgrounds using a color contrast analyzer (minimum **3:1** ratio).
- [ ] Click the same interactive elements using a **mouse / trackpad / touch tap**. Confirm the focus ring does NOT trigger on click for standard buttons or links.

### 2. High Contrast Mode (Forced Colors) Test
- [ ] Enable Windows High Contrast Mode or emulate forced colors in Chrome DevTools (**Rendering > Emulate CSS media feature forced-colors: active**).
- [ ] Tab through all interactive components.
- [ ] Verify that every element renders a visible system high-contrast border or outline in its focused state.

### 3. Overflow & Sticky Occlusion Test
- [ ] Audit elements inside scroll containers (`overflow: auto` / `overflow: hidden`). Ensure focus rings are not clipped by container edges.
- [ ] Tab through the entire page on screens with fixed/sticky headers or footers.
- [ ] Verify that focused elements are automatically scrolled into view and never hidden beneath sticky overlays (WCAG 2.2 SC 2.4.13).
