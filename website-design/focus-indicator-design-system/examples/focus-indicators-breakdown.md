# Example: Focus Indicator Systems Applied to a SaaS Landing Page

This example demonstrates how a cohesive, accessibility-aware focus indicator system is applied to a high-traffic SaaS landing page layout across multiple backgrounds and element types.

## Page Layout Context

The SaaS Landing Page features three primary visual sections with varying background values:
1. **Global Header (Light Background):** Clean white container (`#FFFFFF`).
2. **Hero Section (Vivid Brand Background):** Rich, saturated brand blue (`#0D52FF`).
3. **Features Section with Nested Grid Cards (Muted Dark Background):** Off-black/charcoal container (`#12141C`) with nested slate cards (`#1E2230`).

---

## 1. Global Header Focus Styling (Light Background)

### The Interactive Controls
- **Global Logo / Brand Anchor:** Standard text+icon link.
- **Main Nav Links:** Inline textual items.
- **"Book Demo" CTA Button:** Saturated primary-accent fill button with rounded corners.

### Applied Focus Spec

#### Brand Anchor & Nav Links
- **Focus Pattern:** Outer Offset Outline.
- **Design Tokens:**
  - Focus Ring: `2px solid #0D52FF` (Vivid Blue, 5.2:1 contrast against #FFFFFF)
  - Offset Gap: `2px` (creates clear spacing from text)
  - Radius: `4px` (matches subtle rounding of text containers)
- **Keyboard Behavior:** When tabbed into, a clean blue rectangle floats neatly around the text.
- **Mouse Behavior:** Supressed via `:focus-visible`.

#### "Book Demo" Button
- **Component Border-Radius:** `8px`
- **Focus Pattern:** Outer Offset Outline (Geometric Shape Sync).
- **Design Tokens:**
  - Focus Ring: `2px solid #12141C` (Off-black, 15.2:1 contrast against #FFFFFF background)
  - Offset Gap: `4px` (avoids blending into the button fill color)
  - Radius: `12px` (`button-radius (8px) + offset (4px) = 12px` to keep curves mathematically concentric)
- **Why this works:** Using an off-black focus ring on white background ensures supreme visibility, whereas a blue focus ring on a blue button would be invisible.

---

## 2. Hero Section Focus Styling (Vivid Brand Background)

### The Interactive Controls
- **Email Form Input:** Text field with light border and white background.
- **"Start Trial" Submit Button:** Pure white fill button with dark blue text.
- **Privacy Agreement Link:** Underlined text sitting directly on the vivid blue background.

### Applied Focus Spec

#### Email Form Input
- **Focus Pattern:** Inset Focus Ring.
- **Design Tokens:**
  - Focus Ring: `inset 0 0 0 3px #12141C` (Inner ring, 7.8:1 contrast against white input background)
  - Border Adjustment: Border color shifts to `#12141C` simultaneously.
- **Why Inset?** Form inputs are aligned on a tight grid. An outer offset focus ring would overlap the adjacent "Start Trial" button and look structurally sloppy.

#### "Start Trial" Submit Button (Pure White Button)
- **Focus Pattern:** Contrast Halo (Dual-Ring).
- **Design Tokens:**
  - Inner Ring: `2px solid #0D52FF` (Vivid Blue, maps curve)
  - Outer Ring: `2px solid #FFFFFF` (Pure White, creates contrast halo against the vivid background)
  - Combined Offset: `3px`
- **Why this works:** The dual-ring guarantees that the button is highly visible both against the vivid blue background and against the button's own white fill.

#### Privacy Agreement Link
- **Focus Pattern:** Contrast Halo Outline.
- **Design Tokens:**
  - Outline: `2px solid #FFFFFF` (3.8:1 contrast against `#0D52FF` brand background)
  - Offset: `2px`
- **Why this works:** Text links sitting directly on brand backgrounds must use a light focus ring, as dark blue outlines would be completely invisible against the saturated blue background.

---

## 3. Features Section & Cards (Muted Dark Background)

### The Interactive Controls
- **Feature Cards:** Interactive elements with full-surface hover and focus actions.
- **Custom Toggle Switch:** A toggle widget within a card.
- **"Read More" Secondary Buttons:** Text link with trailing chevron icon.

### Applied Focus Spec

#### Interactive Feature Cards
- **Parent Container:** `#12141C` (Off-black)
- **Card Background:** `#1E2230` (Slate)
- **Card Border-Radius:** `16px`
- **Focus Pattern:** Outer Offset Outline.
- **Design Tokens:**
  - Focus Ring: `2px solid #90B4FC` (Light sky blue, 4.8:1 contrast against `#12141C` charcoal)
  - Offset Gap: `2px` (using a slate border `#1E2230` to visual bridge element to focus ring)
  - Radius: `18px` (`16px + 2px`)

#### Custom Toggle Switch
- **Track Border-Radius:** `100px` (Capsule shape)
- **Focus Pattern:** Inset Border Ring.
- **Design Tokens:**
  - Outline: `2px solid #90B4FC`
  - Offset: `2px`
  - Radius: `100px` (Inherited capsule contour)
- **High Contrast Fallback:** Always includes an explicit, transparent outline rule: `outline: 2px solid transparent; outline-offset: 2px;` so keyboard users operating in Windows Forced Colors Mode still receive a visible outline.

---

## 4. Summary Contrast Matrix

| Location | Element | Background Color | Focus Ring Color | Contrast Ratio | Pattern Applied |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Header | Nav Link | `#FFFFFF` (White) | `#0D52FF` (Blue) | 5.2:1 (Pass AA) | Outer Offset (2px gap) |
| Header | CTA Button | `#FFFFFF` (White) | `#12141C` (Charcoal) | 15.2:1 (Pass AAA) | Outer Offset (4px gap) |
| Hero | Input Field | `#FFFFFF` (White) | `#12141C` (Charcoal) | 15.2:1 (Pass AAA) | Inset Outline (3px inset) |
| Hero | Text Link | `#0D52FF` (Brand) | `#FFFFFF` (White) | 3.8:1 (Pass AA) | Outer Offset (2px gap) |
| Features | Card | `#12141C` (Dark) | `#90B4FC` (Sky) | 4.8:1 (Pass AA) | Outer Offset (2px gap) |
| Features | Toggle | `#1E2230` (Slate) | `#90B4FC` (Sky) | 4.1:1 (Pass AA) | Capsule Outline |
