---
name: focus-indicator-design-system
description:
  Design, specify, and audit high-contrast, robust keyboard focus indicators across all interactive elements in a design system to ensure compliance with WCAG 2.1/2.2, seamless brand integration, and native high-contrast mode support.
---

# Focus Indicator Design System

## Purpose

The Focus Indicator Design System provides a systematic methodology for designing, specifying, and auditing keyboard focus indicators across all interactive elements (buttons, links, form inputs, custom toggles, and complex widgets).

Focus indicators are the primary visual wayfinder for keyboard navigators, screen reader users, and people using alternative inputs. When designers hide the default browser focus ring because it "looks ugly" or replace it with a low-contrast override, they create an immediate, catastrophic accessibility barrier. This system ensures focus indicators are branded, high-contrast, robustly positioned, and compliant with WCAG 2.1 and 2.2 standards, without compromising visual aesthetics.

## Use Cases

- **Design System Creation:** Establishing global token-based focus states within a brand UI kit.
- **Component Design Specifications:** Defining custom focus rings for complex elements (e.g., custom checkboxes, range sliders, or tab groups).
- **Accessibility Remediation Audits:** Identifying and fixing invisible or low-contrast focus outlines on an existing website.
- **Theme and Background Adaptations:** Standardizing focus indicators for light, dark, and brand-colored backgrounds.
- **Cross-Platform Input Optimization:** Configuring `:focus-visible` behaviors to ensure mouse users do not see distracting focus rings while keyboard navigators get high-visibility indicators.

## When NOT to Use

- **Static Content:** Do not design focus indicators for non-interactive elements (e.g., plain paragraphs, images, headers, or informational cards without links).
- **Native Unmodified Controls:** If a project relies purely on default browser controls without any custom styling or branding overrides, and the native focus behavior is completely untouched.
- **Alternative Wayfinding Modalities:** On voice-controlled smart displays or pure-touch native mobile applications where keyboard-style focus rings are not part of the platform's standard accessibility architecture.

## Inputs

1. **Brand Palette and Background Tokens:** Core colors, background colors (light, dark, and brand-tinted), and container borders.
2. **Interactive Elements Inventory:** A list of all interactive UI components requiring focus states (buttons, links, text fields, radios, custom overlays).
3. **Corner Radius System:** Token values for component rounding (e.g., `--radius-s`, `--radius-m`) to ensure focus rings match the element shape.
4. **Target WCAG Level:** Standard AA minimum compliance (WCAG 2.1/2.2) or AAA target.

## Outputs

1. **Global Focus Tokens:** Standardized design tokens defining focus ring color, thickness, outline style, and offset spacing.
2. **Component Specific Focus Specifications:** Spatial layout rules for inner focus rings, outer focus rings, and complex nested outlines.
3. **High-Contrast (Forced Colors) Style Rules:** CSS specifications ensuring compatibility with Windows Forced Colors Mode.
4. **Focus-Visible Integration Logic:** Specifications separating keyboard navigation cues from mouse click responses.

## Workflow

### 1. Catalog Component Contexts
Audit interactive components and group them by container background to determine focus contrast requirements:
- **Light backgrounds:** Require a dark focus ring.
- **Dark backgrounds:** Require a light focus ring.
- **Brand backgrounds (e.g., Vivid Blue):** May require a neutral-white or secondary high-contrast ring, as standard brand-colored outlines will blend into the background.

### 2. Define the Sizing & Placement Model
Select the geometric relationship between the element and its focus ring:
- **Outer Offset Outline:** The focus ring is positioned outside the element border using a transparent gap (offset). Recommended for buttons, tags, and links.
- **Inset Focus Ring:** The focus ring is positioned within the element borders. Recommended for text fields, select menus, and items clipped by `overflow: hidden`.
- **Contrast Halo (Dual-Ring):** An outer ring wrapped in a contrasting secondary line (e.g., 2px white ring with a 1px black outline). Extremely robust, as it guarantees visibility against *any* background.

### 3. Establish the WCAG Contrast and Sizing Tokens
Determine minimum styling values to satisfy WCAG:
- Set focus ring thickness to a minimum of **2px** (3px preferred).
- Maintain a minimum contrast ratio of **3:1** against the adjacent background, and against the element's unfocused state.
- Ensure the focus indicator has a surface area at least equal to a 2px solid border around the perimeter of the control (WCAG 2.2 Focus Appearance).

### 4. Separate Pointer vs. Keyboard States
Avoid "design friction" by utilizing the `:focus-visible` pseudo-class.
- **Keyboard navigation (`:focus-visible`):** Triggers high-contrast, visually prominent focus indicators.
- **Mouse/Touch interaction (`:focus` without `:focus-visible`):** Keeps focus rings suppressed or extremely subtle for mouse clicks, preventing design complaints while maintaining full accessibility.

### 5. Define High-Contrast Mode Fallbacks
Ensure focus indicators do not disappear under assistive styling preferences (like Windows High Contrast Mode / Forced Colors):
- Native `outline` with transparent color is automatically mapped by Forced Colors, but custom `box-shadow` styles are discarded.
- Always include an `outline` fallback (even if set to `outline: 2px solid transparent` or using `outline-color: CanvasText` in media queries) so High-Contrast Mode renders a visible outline.

## Decision Rules

### Rule 1: Inner vs. Outer Ring Placement
- Use an **Outer Offset Outline** if the element has custom borders and does not have an overflow mask (`overflow: hidden`).
- Use an **Inset Focus Ring** (`box-shadow: inset ...`) if the element is part of a tight grid, has `overflow: hidden` on its parent container, or is a text input field where external outlines would overlap adjacent elements.

### Rule 2: Single-Color vs. Dual-Color Halo
- Use a **Single-Color Ring** if the background is uniform and predictable (e.g., always light or always dark) and contrast is verified at >= 3:1.
- Use a **Dual-Color Contrast Halo** (e.g., dark blue inner, pure white outer) if the element sits on top of images, gradients, user-generated content, or slides between varying backgrounds (such as sticky headers scrolling over section boundaries).

### Rule 3: Focus Ring Border Radius
- The focus outline must mirror the `border-radius` of its parent control.
- Ensure `outline-offset` is positive (e.g., `2px` or `4px`) and the border radius of the outline matches the card/button curvature, or use `box-shadow` which naturally maps to the component's rounded corners.

```text
CORRECT:
[   Button (Radius 8px)   ]
   (Gap: 2px)
============================= Focus Outline (Radius 10px)

INCORRECT:
[   Button (Radius 8px)   ]
   (Gap: 2px)
----------------------------- Focus Outline (Sharp 90-degree Corners)
```

## Constraints

- **Accessibility (Contrast):** The focus ring must have a contrast ratio of at least **3:1** against its surrounding background (WCAG 2.1 SC 1.4.11 Non-text Contrast).
- **Accessibility (Visibility):** The indicator must be fully visible. Focus indicators must never be hidden behind sticky headers, floating chat widgets, or overlays (WCAG 2.2 SC 2.4.11 Focus Not Obscured).
- **Accessibility (Appearance):** The focus indicator must be large enough. It must meet the WCAG 2.2 SC 2.4.13 (Focus Appearance) math: minimum 2px width and a minimum area equal to the perimeter multiplied by 2px.
- **Responsiveness:** Focus indicators must not stretch the container or trigger horizontal horizontal page layout overflow. Always use absolute positioning, absolute CSS outlines, or inset box-shadows, which do not alter the DOM layout flow.

## Common Failure Patterns

- **The `:focus { outline: none; }` Eraser:** Completely hiding the focus indicator without providing a robust pseudo-class replacement.
- **Low-Contrast "Ghost" Rings:** Using a light-gray outline on a white background, making the active focus state invisible to users with low-contrast vision.
- **The "Clipped Outline" Trap:** Placing an outer focus ring on an element nested inside a container with `overflow: hidden`. The focus indicator gets sliced off on the left and right, leaving only horizontal slivers.
- **The "Sticky Header Cover-Up":** Tab-focusing onto an anchor element situated at the top of the viewport, but the sticky navigation bar overlaps and completely obscures it (WCAG 2.2 SC 2.4.11 violation).
- **Click-Prompting Focus Clutter:** Not using `:focus-visible`, leading to heavy blue rings flashing on every mouse click, which frustrates design teams and prompts them to request total removal of focus styles.
- **Forced Colors Erasure:** Building beautiful focus rings purely out of CSS custom properties and `box-shadow` values without a transparent `outline` fallback, resulting in completely invisible focus indicators in Windows High Contrast Mode.

## Validation Criteria

- [ ] Every interactive element shows a highly visible, distinct focus indicator when navigated to via the `Tab` key.
- [ ] Every global and component focus indicator contrast is verified at >= 3:1 against its background.
- [ ] Custom focus styling uses the `:focus-visible` selector to ensure it triggers on keyboard navigation but stays clean during mouse clicks.
- [ ] No focus indicator is clipped or sliced by parent container `overflow: hidden` rules (either offset adjusted or shifted inset).
- [ ] Keyboard navigation to elements near sticky headers or floating elements keeps the focused element fully visible (using `scroll-margin-top` overrides).
- [ ] Focus indicators are verified in High Contrast/Forced Colors Mode using transparent outline rules.
- [ ] The perimeter surface area of custom indicators meets the WCAG 2.2 SC 2.4.13 minimum calculations.
