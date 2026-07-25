# Example: Focus Indicator Visual System Breakdown

This breakdown demonstrates how the Focus Indicator Design System is applied to a set of common and custom interactive components on a modern, high-trust website. It details visual anatomy, spacing, contrast ratios, and state transformations.

---

## 1. Global Focus Styling Tokens

We define a standardized spacing and color hierarchy to keep focus indicators visually cohesive across different context boundaries.

```text
--space-focus-thickness: 3px;
--space-focus-offset: 2px;
--color-focus-light-bg: #2563eb; (Blue 600 - Contrast against #FFF is 6.1:1)
--color-focus-dark-bg:  #60a5fa; (Blue 400 - Contrast against #111827 is 5.8:1)
```

---

## 2. Component Breakdown

Below is the design specification for four core interactive patterns under focus.

### A. Primary Button (Offset Outline Pattern)
Standard buttons use the **Offset Outline Pattern**. This ensures the focus ring is offset from the button edge, preventing visual clash and preserving the button's rounded corners.

#### Visual Anatomy (Focused State)
```text
      +-----------------------------------------+
   +--|                                         |--+  <-- Focus Outline (3px solid, --color-focus-light-bg)
   |  |   +---------------------------------+   |  |
   |  |   |                                 |   |  |  <-- Offset Gap (2px transparent)
   |  |   |         Primary Button          |   |  |
   |  |   |                                 |   |  |  <-- Button Body (Solid Blue, White text)
   |  |   +---------------------------------+   |  |
   +--|                                         |--+
      +-----------------------------------------+
```

#### State Transition Details
- **Default State:** Solid blue background (`#2563eb`), white text (`#ffffff`), no outline.
- **Hover State:** Background shifts to deep blue (`#1d4ed8`), cursor becomes pointer, gentle transition (`150ms ease`).
- **Focus State (`:focus-visible`):** Instantly displays a `3px` solid blue outline (`#2563eb`) with a `2px` offset (`outline-offset: 2px`).
- **Contrast Check:**
  - Focus Ring vs. Background (`#fff`): **6.1:1** (Passes WCAG 3:1 Non-Text Contrast)
  - Focused State vs. Unfocused State (Outline vs. Button edge): Fully separated by `2px` transparent gap, preventing color blend.

---

### B. Text Link (Underline Shift & Bottom Outline)
Inline text links can have tight line wrapping. Custom rectangular outlines around wrapped inline text links can look messy and break visual layout. We use a **Border-Bottom Focus Indicator** that expands the standard underline into a high-contrast focus line.

#### Visual Anatomy (Focused State)
```text
   +---------------------------------------------+
   |  Read our latest accessibility guidelines.  | <-- Standard text
   |           -----------------------           | <-- Double-thick underline (3px, Blue 600)
   +---------------------------------------------+
```

#### State Transition Details
- **Default State:** Medium gray (`#374151`), thin `1px` underline (`text-decoration`).
- **Hover State:** Link color changes to Blue 600 (`#2563eb`), underline thickens to `2px`.
- **Focus State (`:focus-visible`):** Text color shifts to deep blue (`#1d4ed8`), background turns to a very light blue tint (`#eff6ff`), and a bottom outline or thick `3px` border-bottom is applied.
- **Contrast Check:**
  - Active text vs. Background (`#eff6ff`): **8.4:1** (Exceeds WCAG 4.5:1 Text Contrast)
  - Focus Indicator vs. Background: Border-bottom meets **6.1:1** contrast.

---

### C. Text Input Field (Inner Highlight Pattern)
For form input fields, an outward offset outline can overlap adjacent fields or labels, cluttering dense forms. Instead, we use an **Active Border Shift** combined with a high-contrast **Inner Box Shadow Ring**.

#### Visual Anatomy (Focused State)
```text
   +---------------------------------------------+  ^
   |  |  +---------------------------------+  |  |  | Focus Ring (2px inset shadow, Blue 600)
   |  |  |  Enter your email...            |  |  |  |
   |  |  +---------------------------------+  |  |  | Border (2px solid, Blue 600)
   +---------------------------------------------+  v
```

#### State Transition Details
- **Default State:** Gray border (`#d1d5db`), white background, placeholder text (`#9ca3af`).
- **Hover State:** Border darkens to `#9ca3af`.
- **Focus State (`:focus-visible`):** Border shifts to Blue 600 (`#2563eb`). An inset box-shadow of `2px` Blue 600 is applied, creating a double-thick border effect without shifting layout dimensions.
- **Contrast Check:**
  - Active Border vs. Form background (`#ffffff`): **6.1:1**
  - Active Border vs. Default border: **3.2:1** (Passes WCAG 3:1 component state change contrast)

---

### D. Custom Content Card (Stretched Link & Unified Focus Ring)
For clickable content grids (e.g., blog previews), putting individual focus rings on the image, title, and "Read More" link results in a chaotic and repetitive keyboard tabbing experience. We use the **Unified Card Focus Pattern** (Stretched Link).

#### Keyboard Flow Spec
- The user hits `Tab`.
- Focus lands on the card *as a single unified container*.
- A high-contrast focus ring outlines the *outer edge of the entire card*.

#### Visual Anatomy (Focused State)
```text
  +----------------------------------------------------+  ^
  |  +----------------------------------------------+  |  | Focus Outline (3px solid, Blue 600)
  |  |  [ Image: Accessibility Lab ]                 |  |  |
  |  |  Aspect Ratio: 16:9                          |  |  | Offset (4px)
  |  +----------------------------------------------+  |  |
  |                                                    |  |
  |  ### Web Accessibility Standards (H3)              |  |
  |  Designing accessible interfaces for modern web   |  |
  |  applications using CSS & ARIA.                    |  |
  |                                                    |  |
  |  Read Article ->                                   |  |
  +----------------------------------------------------+  v
```

#### State Transition Details
- **Default State:** Subtly bordered card (`1px` solid `#e5e7eb`), transparent focus ring.
- **Hover State:** Card lifts slightly via shadow (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)`), title turns Blue 600.
- **Focus State (`:focus-visible`):** Card boundary displays a `3px` outer focus ring (`#2563eb`) with a `4px` offset. The focused element inside is the card's primary anchor (using a CSS `::after` pseudo-element to stretch the clickable area over the entire card container).
- **Contrast Check:**
  - Focus Ring vs. Adjacent background: **6.1:1**
  - Outer focus ring is fully separated from card edge to prevent visual clipping when card has `overflow: hidden` on images.

---

## 3. High Contrast Mode (Forced Colors) Remediations

When a Windows user activates a High Contrast Theme (Forced Colors Mode):

1. Custom `box-shadow` rings (used on our Text Inputs) are automatically disabled by the operating system.
2. Custom background colors (like our Link focused state tint `#eff6ff`) are stripped out.

To solve this, we specify forced-colors overrides to ensure focus visibility is preserved:

| Component | Default Custom CSS Focus style | Forced Colors Mode Remediated Style |
| :--- | :--- | :--- |
| **Primary Button** | `outline-color: var(--color-focus-light-bg)` | Native `outline` reverts to `ButtonText` color, maintaining the 2px offset. |
| **Text Input** | `box-shadow: inset 0 0 0 2px var(--color-focus-light-bg)` | Replaced with `outline: 2px solid Highlight` inside the media query, which maps to the user's high-contrast theme selection. |
| **Content Card** | `outline-color: var(--color-focus-light-bg)` | Reverted to standard high-contrast outline (`outline: 3px solid Highlight`). |

---

## 4. Scroll Container Buffer Spec

To prevent focused elements from being buried under sticky headers during keyboard tabbing, we specify scroll alignment properties.

```text
       +---------------------------------------------+
       | [Logo] [Menu]                     [Account] | <-- Sticky Navigation Header (Height: 80px)
       +---------------------------------------------+
========================================================= <-- Scroll Boundary Line
       :                                             :
       :  (Scroll Buffer Space: 96px)                 : <-- Controlled via scroll-padding-top: 96px
       :                                             :
       +---------------------------------------------+
       | (Focused Element)                           | <-- Keyboard focus moves here, fully visible!
       | [ Button ]                                  |
       +---------------------------------------------+
```
This ensures that the focused button is always centered or placed below the sticky header by at least `16px` of clear margin.
