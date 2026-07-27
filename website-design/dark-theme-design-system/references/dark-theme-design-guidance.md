# Reference: Dark Theme Design Guidance & Optical Principles

This reference guide details the key physical, psychological, and optical principles involved in designing high-quality, low-fatigue dark themes. It covers the phenomenon of **irradiation**, formulas for **color desaturation**, and **contrast compliance** (WCAG 2.2 and APCA models).

---

## 1. The Optical Phenomenon of "Irradiation"

**Irradiation** is a physiological optical illusion where a light-colored surface or text placed on a dark background appears larger and thicker than its exact dark-colored equivalent on a light background.

### Why It Happens
When light hits the human eye, photons scatter across the retina. Against a bright canvas (light mode), this scattering is drowned out by the ambient background illumination. Against a dark canvas (dark mode), however, the scattered light "bleeds" outward into the adjacent dark pixels.

This causes two major issues for readers:
1.  **Text Bleeding/Swelling:** Bold headings appear "bloated" or "smudged," closing up tight gaps inside letters like `e`, `a`, and `o`.
2.  **Visual Crowding:** Individual letters bleed into each other, reducing reading speed and comprehension.

### Design Counters for Irradiation
To combat this, designers must apply **optical weight correction** when transitioning an interface to dark mode:

*   **Step Down Font Weight:** If a heading uses `700` (Bold) in light mode, step it down to `600` (Semi-Bold) or `500` (Medium) in dark mode. It will *appear* to have the exact same bold weight as the light-mode version.
*   **Open Letter Spacing (Tracking):** Increase tracking slightly for body copy in dark mode. Adding `letter-spacing: 0.01em` to `0.02em` (or `0.015rem`) prevents letters from merging.
*   **Reduce Text Luminance:** Avoid `#FFFFFF` (100% white) text. Using an off-white (such as `#E2E8F0` or `#EAEAEA` with an opacity of `85%` to `90%`) reduces the quantity of emitted photons, dramatically minimizing retina-bleed.

---

## 2. Color Desaturation & Avoiding Visual "Vibration"

Placing highly saturated colors directly onto dark backgrounds causes a painful phenomenon known as **chromatic vibration** or **visual vibration**.

### The Science of Vibration
Our eyes focus different wavelengths of light at slightly different depths on the retina. Red wavelengths focus slightly behind blue wavelengths. When you place a highly saturated blue or red directly against black, the eye's ciliary muscles are forced to constantly and rapidly contract and relax to reconcile the depth difference. This causes rapid ocular fatigue, headaches, and physical discomfort.

### How to systematically Desaturate Brand Colors
To safely port a brand color to dark mode, you must desaturate it (reduce the `C` (Chroma) in OKLCH, or the `S` (Saturation) in HSL/HSV) while compensating with lightness:

1.  **The Saturation Ceiling Rule:**
    *   For **large decorative blocks or backgrounds**, keep saturation below **15%**.
    *   For **interactive elements (text, links, buttons)**, keep saturation between **40% and 60%**.
2.  **The Desaturation Math (HSL Shortcut):**
    *   Identify the Light Mode base HSL: e.g., Primary Blue `hsl(220, 100%, 50%)`.
    *   To adapt for dark mode background surface overlays: Keep the hue (`220`), reduce saturation (`100% -> 15%`), and adjust lightness (`50% -> 20%`). Result: `hsl(220, 15%, 20%)`.
    *   To adapt for dark mode text/accents: Keep the hue (`220`), reduce saturation (`100% -> 60%`), and increase lightness (`50% -> 75%`). Result: `hsl(220, 60%, 75%)` (a highly readable, non-vibrating pastel blue).

---

## 3. Contrast Calibration: WCAG 2.2 vs. APCA

To ensure that your dark theme is fully accessible, you must design with contrast targets in mind.

### A. The WCAG 2.x Contrast Model (AA & AAA)
WCAG 2.1/2.2 utilizes a simplified relative luminance formula ($(L1 + 0.05) / (L2 + 0.05)$) to determine contrast.

*   **WCAG AA Normal Text (<18pt / 24px):** **4.5:1** minimum contrast.
*   **WCAG AA Large Text (>18pt or >14pt bold):** **3.0:1** minimum contrast.
*   **WCAG AA UI Components & Graphics:** **3.0:1** minimum contrast. (This includes borders of input fields, focus rings, and active state indicators).
*   **WCAG AAA Enhanced Text:** **7.0:1** minimum (Normal) and **4.5:1** minimum (Large).

*Note: While WCAG 2.x is the current legal standard for accessibility, its math is flawed for dark mode. It often overestimates the readability of dark text on light backgrounds, and underestimates the readability of light text on dark backgrounds.*

### B. The APCA (Advanced Perceptual Contrast Algorithm) Model
APCA is the contrast model designed for WCAG 3. It is a modern, perceptually-accurate algorithm that accounts for font weight, context of use, and spatial frequency.

Under APCA, contrast is expressed as a **Lightness Contrast (Lc)** value:

*   **Lc 90 (Preferred Body Text):** The gold standard for dark mode body text. Safe for normal reading widths at size 14px-16px.
*   **Lc 75 (Minimum Body Text):** Absolute minimum contrast for content reading.
*   **Lc 60 (Large Text & Subtitles):** Safe for text larger than 24px or bold text larger than 18px.
*   **Lc 45 (Decorative Text & Borders):** Safe for non-text UI borders and inactive disabled states.

APCA recognizes that a thin white font on black needs a higher Lc score than a thick bold font on black, allowing for more natural, flexible, and truly accessible styling.

---

## 4. Interaction & Focus Ring Best Practices

In a dark environment, focus indicators must be custom-tailored to avoid becoming invisible:

*   **Never hide focus-visible rings:** Leaving `:focus { outline: none; }` without an alternative is a critical accessibility failure.
*   **Contrasting Outlines:** Use a dual-outline approach. A standard focus ring should consist of a thin dark spacer (matching the background surface) and a bright desaturated outline:
    ```css
    button:focus-visible {
      outline: 2px solid var(--accent-base);
      outline-offset: 2px; /* Creates the background-colored spacer */
    }
    ```
*   **Do not use color alone:** When an input element changes state (e.g., hover or active), use a combination of border weight, background shifts, and elevation lighting to reinforce the change.
