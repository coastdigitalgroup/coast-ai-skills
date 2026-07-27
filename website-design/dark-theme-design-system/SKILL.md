---
name: dark-theme-design-system
description:
  Design and specify a systematic dark theme framework, establishing rules for
  elevation-based surface colors, desaturated brand accents, text legibility,
  and media adaptation to ensure an accessible, low-fatigue experience.
---

# Dark Theme Design System

## Purpose

The Dark Theme Design System skill provides a methodology for translating light-themed web interfaces into dark-themed counterparts. Designing a dark mode is not a simple matter of inverting color values. Doing so breaks physical lighting metaphors, causes severe visual fatigue, and creates illegible, high-glare interfaces.

This system establishes the visual and spatial rules of low-light design:
- **Elevation Reversal:** Conveying depth in dark mode by *lightening* elevated surface backgrounds rather than using dark shadows.
- **Color Desaturation:** Adapting vibrant brand and semantic accent colors to low-contrast levels to prevent visual "vibration" and eye strain.
- **Contrast & Halation Prevention:** Avoiding pure white-on-black combinations which cause extreme glow (halation) for astigmatic or dyslexic readers, opting instead for off-whites and off-blacks.
- **Typographic Weight Calibration:** Countering "irradiation" (the optical illusion where light text on dark backgrounds appears thicker and bolder than dark text on light backgrounds).
- **Media Dimming:** Adapting images, videos, and vector diagrams so they don't visually "blind" the user in low-light conditions.

---

## Use Cases

- **Designing Dual-Theme UI Kits:** Establishing the semantic design token architecture for a system that natively supports both light and dark modes.
- **Redesigning SaaS Dashboards & Reading Environments:** Creating low-fatigue interfaces optimized for long-duration viewing, developer workflows, or evening use.
- **Auditing Inaccessible Dark Themes:** Identifying and fixing contrast issues, vibrating accents, illegible text weights, and blinding media assets.
- **Providing Multi-Theme Handoff Specifications:** Generating clean, developer-ready specifications showing exactly how elements behave across themes.

---

## When NOT to Use

- **Dark-by-Default (Cinematic) Environments:** If an application is exclusively dark (e.g., Spotify, Netflix, or game streaming platforms) and will never support a light theme. A dual-theme design system is unnecessary overhead in this case.
- **Highly Expressive / Artistic Micro-campaigns:** Standalone landing pages where visual disruption, extreme high-saturation palettes, or artistic branding supersedes long-duration viewing comfort or strict accessibility rules.
- **Strictly Static Legacy Frameworks:** Applications whose front-end architectures cannot load dynamic stylesheets or lack CSS variable support, preventing a systematic theme adaptation.

---

## Inputs

1. **Light Mode Core Palette & Brand Styles:** The existing primary brand colors, secondary colors, typography scales, and fluid spacing tokens.
2. **Component Inventory & Depth Hierarchy:** A comprehensive list of the page layouts and UI layers (backgrounds, sidebars, cards, modals, dropdowns).
3. **Lighting Environment Context:** The typical physical surroundings of the target user (e.g., evening bedtime reading vs. a brightly lit industrial control floor).
4. **Accessibility Target:** Standard WCAG 2.2 AA (minimum) or AAA (enhanced), including considerations for astigmatism and color-blindness.

---

## Outputs

1. **Unified Semantic Token Map:** A systematic specification bridging light-mode values directly to their corresponding dark-mode equivalents.
2. **Elevation-Based Surface Scale:** A 5-to-6 step scale defining how surface background values lighten as they float higher on the Z-axis.
3. **Desaturated Accent Palette:** A calibrated set of primary, secondary, and semantic status colors desaturated for dark backgrounds.
4. **Typographic Style Sheet Corrections:** Specific rules for font-weight, letter-spacing, and text color adjustments to counteract the irradiation effect.
5. **Media Dimming Specifications:** CSS and HTML techniques for reducing image contrast/brightness and adjusting vector graphics.

---

## Workflow

### 1. Set the Foundation: Select Off-Black and Off-White
Avoid absolute `#000000` (pure black) for backgrounds and absolute `#FFFFFF` (pure white) for body text.
- **The Base Background:** Establish a dark, tinted neutral (e.g., deep slate, charcoal, or dark navy-gray between `#121212` and `#1A1A1A`). This reduces eye strain, prevents screen flickering, and retains some visual depth.
- **The Text Base:** Choose an off-white or light gray (e.g., `#E2E8F0` or `#EAEAEA` with an opacity of `85%` to `90%`). This ensures comfortable contrast without causing halation (light scattering in the reader's eye).

### 2. Translate Depth via Elevation Lightening
In a light theme, we indicate that an element is elevated by casting a darker shadow. In a dark theme, a dark shadow is invisible against a dark background.
- **The Lightening Principle:** As an element rises higher on the Z-axis, it moves closer to the virtual ambient light source and becomes *lighter*, not darker.
- **Create an Elevation Surface Scale:**
  - **Level 0 (Canvas Base):** Darkest color (e.g., `#121212`).
  - **Level 1 (Card/List Item):** Slightly lighter (e.g., `#1D1D1D`).
  - **Level 2 (Sticky Header/Floating Action):** Lighter still (e.g., `#242424`).
  - **Level 3 (Modal/Dialog Box):** Lightest surface (e.g., `#2C2C2C`).
- **Support with Soft Shadows:** Use very subtle, dark-gray or translucent black shadows on elevated layers (e.g., `rgba(0, 0, 0, 0.5)`) to provide separation on larger surfaces that sit over Level 1 items.

### 3. Calibrate and Desaturate Accent Colors
Highly saturated colors that look vibrant on a white canvas will "vibrate" on a dark canvas, creating severe visual fatigue and failing contrast tests.
- **Desaturate the Brand Accents:** Shift brand colors to lighter, softer, and more pastel-like equivalents. (e.g., a vibrant primary blue `#0055FF` on light background should map to a desaturated blue `#66A3FF` or `#80B3FF` on dark).
- **Maintain Contrast Safe Accents:** Verify that desaturated accent colors on dark surfaces still meet WCAG 2.2 AA standards (minimum 4.5:1 ratio for text, 3:1 for interactive states).
- **Avoid Large Saturated Blocks:** Instead of rendering whole buttons or banners in solid saturated colors, use them sparingly—such as text links, borders, or subtle indicators.

### 4. Adjust Typography for Optical Irradiation
Light text on a dark background suffers from **irradiation**—the white text seems to "bleed" into the surrounding darkness, making letters appear bolder, thicker, and closer together than their dark-on-light equivalents.
- **Weight Calibration:** Reduce the font-weight of light-themed bold headings by one tier (e.g., change `700` (Bold) to `600` (Semi-Bold) or even `500` (Medium) on dark).
- **Letter Spacing Calibration:** Increase the letter-spacing (tracking) slightly for dark-mode body text (e.g., `letter-spacing: 0.02em;` or `0.015em;`) to keep individual letters from bleeding together.
- **Secondary/Tertiary Hierarchy:** Control hierarchy by adjusting text color opacity, not just size. Use `opacity: 0.87` for high-priority body, `opacity: 0.60` for secondary helper text, and `opacity: 0.38` for disabled indicators.

### 5. Adapt Media and Rich Content
Unmodified photos, charts, and diagrams can ruin an otherwise perfect dark mode experience by blinding the user with bright, high-contrast whites.
- **Photo Dimming:** Apply a subtle brightness and contrast reduction to photographs to blend them into the low-light atmosphere.
  ```css
  [data-theme="dark"] img:not(.avatar) {
    filter: brightness(0.85) contrast(0.95);
  }
  ```
- **Vector Assets & Illustrations:** Swap bright background colors in SVGs or use SVG filters to invert specific paths. For illustrative graphics, use `<picture>` with media queries to load customized dark-themed assets.
- **Data Visualizations:** Redefine chart color series to use desaturated lines and semi-transparent area fills that remain legible without excessive luminance.

---

## Decision Rules

### The Elevation Lightness Rule
Whenever establishing a visual container's background, consult the elevation level. Never make an elevated modal or dropdown *darker* than the page background beneath it.

| Elevation Level | Light Mode Background | Dark Mode Background | Implied Elevation Cue |
| :--- | :--- | :--- | :--- |
| **Level 0 (Canvas)** | `#FFFFFF` (White) or `#F8F9FA` | `#121212` (Off-black) | Ground level / base |
| **Level 1 (Card/Section)**| `#FFFFFF` (White) with border | `#1E1E1E` (Surface 1) | Floating 1-2dp |
| **Level 2 (Header/Sticky)**| `#FFFFFF` or subtle translucent tint| `#252525` (Surface 2) | Floating 4-8dp |
| **Level 3 (Modal/Dialog)** | `#FFFFFF` with heavy shadow | `#2D2D2D` (Surface 3) | Floating 12-24dp |

### The Saturation Cap
- Accents used as backgrounds for interactive states (e.g., a secondary chip container) should have a saturation of **10% to 15%** in dark mode.
- Accents used as foreground text or icons should have a saturation of **40% to 60%** to ensure they stand out without vibrating against the dark surface.

### The Contrast Buffer
Because screen glare and low-quality screens degrade dark-mode visibility more severely than light-mode, always aim for a **5.0:1** contrast ratio on dark mode body text (exceeding the WCAG 4.5:1 minimum) to act as a buffer for poor physical environments.

---

## Constraints

- **Accessibility (WCAG AA):** Text elements must achieve at least 4.5:1 contrast (3:1 for large text). UI borders, focus rings, and functional icons must achieve at least 3:1 contrast. Focus indicators must remain highly visible and not be drowned out by dark background glows (WCAG 2.2 SC 2.4.11).
- **Responsive Glare Adaptation:** Text colors must be resilient to high ambient glare (such as mobile screens used outdoors), meaning absolute minimal contrast levels must be avoided.
- **No Color-Only Hierarchy:** Do not rely purely on a desaturated color's hue to convey status (e.g., warning vs. error in charts). Integrate distinct patterns, text labels, or iconography.

---

## Common Failure Patterns

- **The "Literal Inverter":** Running an automated color inversion filter on a light theme. This turns elevated light-mode elements with dark shadows into sunken dark-mode elements with glowing white rings, breaking all natural lighting models.
- **The "Vibrating Neon" Nightmare:** Placing fully saturated brand colors (e.g., `#00FF00` or `#FF00FF`) directly on a pure black background. This triggers visual fatigue, rendering the text nearly impossible to read for more than a few seconds.
- **The OLED Extreme (Pure Black Glow):** Using `#FFFFFF` text directly on `#000000` backgrounds. This creates a severe haloing/glare effect on many displays, reducing reading speed and causing eye strain.
- **The Disappearing Focus Ring:** Designing a beautiful dark mode but leaving default browser focus indicators, which are often dark blue and become completely invisible on dark slate backgrounds.
- **The Blinding Illustration:** Creating a seamless dark UI, but leaving high-contrast, pure-white backgrounds inside SVG charts, logos, or illustrative icons.

---

## Validation Criteria

- [ ] **Base Values:** No absolute pure black (`#000`) is used for the main canvas background, and no absolute pure white (`#FFF`) is used for body text.
- [ ] **Elevation Model:** Surfaces become progressively lighter (higher lightness value) as they elevate higher on the Z-axis.
- [ ] **Contrast Check:** Every text color, including muted helper text, meets or exceeds the WCAG 2.2 AA contrast ratio (4.5:1 normal, 3:1 large).
- [ ] **Non-vibrating Accents:** Accent and status colors are desaturated to range between 10% and 60% saturation depending on application, avoiding visual vibration.
- [ ] **Focus Visibility:** Interactive elements have high-contrast, distinct focus indicators clearly visible against dark surfaces.
- [ ] **Typographic Calibration:** Bold text is adjusted (stepped down one weight tier or tracked out) to compensate for irradiation.
- [ ] **Media Filter:** A responsive mechanism (CSS filters or dark asset swapping) is specified to reduce the brightness and contrast of rich media and vector assets.
