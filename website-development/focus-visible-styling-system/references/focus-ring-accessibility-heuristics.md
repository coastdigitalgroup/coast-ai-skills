# Focus Ring Accessibility & Engineering Reference

## WCAG 2.2 Focus Success Criteria Overview

| Success Criterion | Level | Key Requirement | Implementation Strategy |
| :--- | :--- | :--- | :--- |
| **2.4.7 Focus Visible** | Level A | Keyboard focus indicator must be visible on operable controls. | Provide distinct `:focus-visible` styles on all interactive elements. Never leave `outline: none` without replacement. |
| **2.4.11 Focus Appearance** | Level AA | Focus ring must meet 3:1 contrast ratio against unfocused state and background, with minimum perimeter area. | Use contrast colors (`>= 3:1`) with double-ring (`outline` + `box-shadow`) or 2px+ solid outline lines. |
| **2.4.13 Focus Unobscured** | Level AA | Focused element must not be fully covered by sticky/fixed page overlays. | Set `scroll-margin-top` / `scroll-margin-bottom` on focusable controls equal to fixed header/footer height. |

---

## Contrast & Minimum Area Mathematics (SC 2.4.11)

WCAG 2.2 SC 2.4.11 establishes quantitative mathematical bounds for focus indicator visibility:

### 1. Contrast Ratio Requirement
- The focus indicator color must have a **3:1 contrast ratio** against:
  1. The background colors immediately adjacent to the indicator.
  2. The element's unfocused state background/border.
- *Calculation Example:* If a button has a background of `#0f172a` (dark blue/black), a focus ring of `#38bdf8` (light cyan) achieves a **9.2:1 contrast ratio**, well exceeding the 3:1 requirement.

### 2. Area Calculation
The focus indicator must satisfy one of the following geometric bounds:
- **Perimeter Option:** Extends along the full 1px perimeter of the element (e.g., a 1px solid outline around a 100px x 40px button yields `2 * (100 + 40) = 280 sq px`).
- **Thicker Solid Segment Option:** Minimum 4px thickness along the shortest boundary dimension.

---

## Keyboard Modality Heuristics (`:focus-visible`)

Browsers evaluate user input modality dynamically to determine when `:focus-visible` matches:

1. **Keyboard Events:** Pressing `Tab`, `Shift + Tab`, Arrow keys, `Space`, or `Enter` switches the browser modality state to **Keyboard**. Any element gaining focus while in this state matches `:focus-visible`.
2. **Pointer Events:** Clicking or tapping with a mouse, trackpad, stylus, or touch screen sets the input modality state to **Pointer**. Standard controls like `<button>` or `<a>` gaining focus on click do NOT match `:focus-visible`.
3. **Text Inputs Excepted:** `<input type="text">`, `<textarea>`, and `[contenteditable="true"]` ALWAYS trigger `:focus-visible` on focus regardless of pointer click, because visual cursor indication is required for text editing.

---

## Forced Colors Mode (Windows High Contrast Mode)

When Windows High Contrast Mode is active:
- CSS `box-shadow`, `background-color`, and `color` properties are overridden or stripped by the system graphics engine.
- System colors (`Canvas`, `CanvasText`, `Highlight`, `HighlightText`, `ButtonText`) are enforced.
- **Critical Rule:** Custom focus indicators that rely on `box-shadow` halos (e.g. `box-shadow: 0 0 0 4px blue`) disappear completely!
- **Remediation:** Always supply a native `outline` (e.g., `outline: 2px solid Transparent` or `outline: 2px solid Highlight`) alongside `box-shadow`. The native `outline` remains fully visible in forced-colors mode.
