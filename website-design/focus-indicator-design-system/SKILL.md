---
name: focus-indicator-design-system
description:
  Design, specify, and audit visible focus indicator styles for keyboard and assistive
  navigation, ensuring WCAG 2.1/2.2 compliance, high contrast mode support, and seamless brand integration.
---

# Focus Indicator Design System

## Purpose

The Focus Indicator Design System provides a systematic methodology for designing, specifying, and auditing keyboard focus indicators across standard and custom interactive elements. A visible focus indicator is the single most critical accessibility affordance for keyboard navigators, power users, and individuals using assistive technologies (such as switch devices, screen readers, or voice control).

While default browser outlines are often visually jarring or get suppressed (`outline: none`) for aesthetic reasons, this design system establishes a framework that treats focus states as a first-class citizen of the visual system. It ensures focus indicators are high-contrast, brand-aligned, visually distinct from hover states, fully resilient in Windows Forced Colors Mode (High Contrast Mode), and compliant with WCAG 2.1 and 2.2 criteria.

## Use Cases

- Creating or extending a UI kit or design system component library.
- Auditing and remediating an existing website for keyboard accessibility and WCAG AA/AAA compliance.
- Designing high-contrast accessibility themes and styling conventions.
- Standardizing keyboard-only pathways on transactional websites (checkout, checkout forms, dashboards).
- Drafting precise visual specifications for development handoff.

## When NOT to Use

- **Non-Interactive Layouts:** Purely static web pages with no links, buttons, inputs, forms, or custom toggle elements.
- **Experimental Native-Only Projects:** Where the client mandates strict reliance on standard, untouched user-agent browser focus styling (defaulting entirely to the operating system's native focus ring).
- **In-Canvas Renderers:** Standard visual focus styles cannot be directly styled via CSS inside native `<canvas>` or WebGL applications (which require custom accessible fallback DOM layers or specific canvas drawing focus logic).

## Inputs

1. **Brand Palette & Style Tokens:** Base brand colors, interactive color tokens, and primary border-radius tokens.
2. **Component Inventory:** Listing of all standard (buttons, links, inputs) and custom (cards, switches, dropdown selectors, overlays) interactive controls.
3. **Accessibility Target:** WCAG Level AA (standard) or Level AAA (enhanced).
4. **Contrast Boundaries:** Surface color variables (light, dark, muted, and colored backgrounds) where components reside.

## Outputs

1. **Global Focus Indicator Specification:** The visual rules governing shape, thickness, color, and offsets.
2. **State Matrix Integration:** Defined visual differences between Hover, Active, and Focus states.
3. **High Contrast Mode (Forced Colors) Map:** Rules for outline overrides under `@media (forced-colors: active)`.
4. **Development Handoff CSS:** Structured CSS Custom Properties and utility class templates targeting `:focus-visible`.

## Workflow

### 1. Define the Global Focus Formula

Establish a consistent visual signature for focus indicators across the website. The system should define:

- **Type of Indicator:** Choose whether to use an **Offset Outline**, an **Inward/Outward Dual Ring**, or a **Custom Internal Highlight**. (An Offset Outline is highly recommended as it never distorts component bounds).
- **Stroke/Thickness:** Minimum 2px (preferably 3px for high-density components or AAA compliance).
- **Offset/Gap:** A clear gap (usually 2px or 3px) between the component's edge and the focus indicator to ensure the indicator is fully visible regardless of the component's background color.
- **Color Selection:** A highly contrasting hue (e.g., brand primary, deep blue, or pure white/black contrast pair) that meets contrast requirements on both light and dark backgrounds.

### 2. Handle Focus Contrast and Area (WCAG 2.2 SC 2.4.13)

To comply with the latest WCAG 2.2 focus appearance guidelines:

- **Area Requirement:** The focus indicator must be large enough. Specifically, it must have an area at least equal to a 2px thick outline around the perimeter of the component, or a 4px solid border along one edge.
- **Contrast Check 1 (Indicator vs. Background):** The focus indicator must have at least a 3:1 contrast ratio against the adjacent page background.
- **Contrast Check 2 (Focused vs. Unfocused State):** The focus indicator must have at least a 3:1 contrast ratio against the component's unfocused border/background.

### 3. Differentiate Focus from Hover (The Visual Separation)

Ensure that "Focus" and "Hover" states are visually distinct. Keyboard users navigate sequentially, whereas mouse users navigate spatially.
- **Hover Pattern:** Gentle color transitions, subtle drop-shadows, or cursor changes (`cursor: pointer`).
- **Focus Pattern:** Crisp, high-contrast outlines or rings.
- **The Golden Rule:** Never rely on the hover style alone to represent focus. Hover effects (like simple background color changes) are frequently unnoticeable when moving through a page sequentially via keyboard.

### 4. Implement Windows Forced Colors Mode (High Contrast) Resiliency

Operating systems have "High Contrast" modes that override standard CSS backgrounds and borders with user-selected colors. Standard shadows and custom background-color-based focus rings become invisible in these modes.
- **Ensure Native Outlines Fallback:** Custom focus indicators that rely on `box-shadow` or background transitions MUST use `outline` or `forced-color-adjust` fallbacks.
- **The CSS Specifier:** Under `@media (forced-colors: active)`, declare a transparent or solid standard CSS `outline` (e.g., `outline: 2px solid CanvasText` or `outline: 3px double ButtonText`). This guarantees the OS forces a high-contrast focus line around the focused element.

### 5. Prevent Keyboard Focus Obscurity (WCAG 2.2 SC 2.4.11)

In modern web layouts, sticky headers, promotional banners, floating panels, or footer navigation bars can hover over content.
- **The Problem:** Scrolling through elements sequentially via the `Tab` key can move focus behind a sticky header, leaving the active element completely invisible to the keyboard user.
- **Design Remedy:** Establish safety margins. Use `scroll-padding-top` and `scroll-padding-bottom` CSS logical values on the HTML wrapper to ensure any focused element scrolls into view with a buffer that places it completely clear of sticky headers/footers.

---

## Decision Rules

### Rule 1: Outline vs. Box Shadow
- Use **Outline** (specifically `outline` and `outline-offset`) for standard buttons, inputs, and text links. This is the safest, most accessible method as it does not trigger container reflow and is natively supported by Forced Colors Mode.
- Use **Box Shadow / Dual Ring** (such as a 2px white shadow followed by a 2px blue shadow) ONLY for rounded elements, circular buttons, or elements with complex clipping paths (e.g., tags, avatars) where standard rectangular browser outlines look broken. Ensure a fallback `outline` is provided for Forced Colors Mode.

### Rule 2: Light vs. Dark Background Adapters
- **On Light Surfaces (`#FFF` to `#E5E7EB`):** Use a dark, highly saturated focus color (e.g., `#0055FF` or `#1F2937`).
- **On Dark Surfaces (`#111827` to `#374151`):** Use a bright, glowing focus color (e.g., `#60A5FA` or `#FFFFFF`).
- **The Adaptive Token:** Use a dynamic custom property (like `--focus-color`) that is overridden inside dark-themed containers:
  ```css
  .theme-light { --focus-color: #2563eb; }
  .theme-dark { --focus-color: #60a5fa; }
  ```

### Rule 3: Choosing Between `:focus` and `:focus-visible`
- **Use `:focus-visible` as the default:** It only applies focus rings when the user navigates via keyboard (or when focus is moved programmatically without pointer input). This avoids showing focus rings on mouse click, preventing visual clutter for mouse users while providing perfect clarity for keyboard users.
- **Never use bare `:focus { outline: none }`:** This completely disables keyboard focus indicators and represents a severe WCAG Level A violation.

---

## Constraints

- **Accessibility:**
  - Visual focus indicators must be provided for *all* interactive elements.
  - The focus indicator must meet a minimum contrast ratio of 3:1 against the adjacent background and 3:1 against the component's unfocused color.
  - Touch-only states do not eliminate the need for focus; a tablet with a Bluetooth keyboard requires the exact same focus path.
- **Responsiveness:** Focus indicators must scale and fit within the viewport. Outlines with large offsets must not cause horizontal layout overflow; if a component is flush against the edge of the mobile screen, the focus indicator must wrap inward or use `box-shadow` to avoid clipping.
- **Visual Hierarchy:** The active focus indicator must stand out immediately on a page. When a user tabs onto a page, their eye should instantly lock onto the focused component.

---

## Common Failure Patterns

- **The "Outline: None" Crime:** Developers disabling default browser outlines because of a "design requirement," without writing an alternative focus style. This locks out keyboard-only users.
- **The "Hover Copy" Trap:** Reusing the exact same hover treatment for focus (e.g., the button turns a slightly darker shade of blue on both hover and focus). Since the change is subtle, keyboard users lose track of where they are.
- **The "Box Shadow Fade" in High Contrast Mode:** Creating elegant, soft focus shadows (`box-shadow: 0 0 10px rgba(0, 85, 255, 0.5)`) that completely disappear under Windows High Contrast Mode because high-contrast themes disable custom shadows.
- **The "Clipped Focus" Overflow Fail:** Placing a focused element inside a container with `overflow: hidden`. The offset outline is clipped, making the focus indicator partially or completely invisible.
- **Sticky Header Burial:** sequential keyboard tabbing moves the focus indicator behind a fixed/sticky header, violating WCAG 2.2 SC 2.4.11.

---

## Validation Criteria

- [ ] Every interactive component (buttons, links, inputs, cards, disclosures) has a distinct, visible focus style.
- [ ] Focus styles are triggered strictly on keyboard navigation via `:focus-visible`.
- [ ] Focus indicators have a contrast ratio of at least 3:1 against their adjacent background.
- [ ] Focus indicators have a contrast ratio of at least 3:1 against the element's default unfocused state.
- [ ] Custom focus rings degrade gracefully in Windows Forced Colors Mode using standard outline properties.
- [ ] No focused element is clipped or hidden by parent containers with `overflow: hidden`.
- [ ] Scroll offsets (using `scroll-padding-top`) are configured to keep focused elements fully visible below sticky navigation headers.
- [ ] Focus indicators do not cause horizontal layout overflow on mobile viewports.
