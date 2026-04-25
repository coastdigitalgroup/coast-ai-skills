---
name: visual-hierarchy-system
description:
  Design and implement a clear order of importance for UI elements using scale,
  color, contrast, and spacing. Trigger this skill when a layout feels
  cluttered, key information is being missed, or you need to guide user
  attention toward a specific goal.
---

# Visual Hierarchy System

## Purpose

The Visual Hierarchy System provides a methodology for organizing and
prioritizing content so that users can process information efficiently and take
action intuitively. It moves beyond "making things look good" to a structured
application of visual levers (Size, Color, Contrast, Proximity, and White Space)
that guide the eye through a page in a predictable, high-conversion sequence.

## Use Cases

- Designing landing pages with multiple competing calls-to-action (CTAs).
- Structuring complex dashboards where data density is high.
- Organizing long-form content or documentation for scan-ability.
- Refining a UI where the "Primary Action" is not immediately obvious.

## When NOT to Use

- **Art-Only Projects:** Where the goal is abstract expression or subverting
  user expectations rather than usability.
- **Fixed Single-Element Screens:** Like a splash screen or a single-field login
  where there is only one possible action and no competing elements.
- **Purely Raw Data Exports:** Where the user is expected to sort and filter
  rather than follow a prescribed path (though some hierarchy still helps).

## Inputs

To establish a visual hierarchy, you need:

1. **Content Inventory:** A list of all elements that must appear on the
   page/screen.
2. **Priority Scoring:** A rank of each element's importance (e.g., Priority 1:
   Buy Button, Priority 2: Price, Priority 3: Product Description).
3. **User Intent/Scan Pattern:** Is the user searching for something specific
   (F-pattern) or being guided through a story (Z-pattern)?
4. **Brand Guardrails:** Existing typography scales and color palettes.

## Outputs

1. **Priority Map:** A document or wireframe highlighting the levels of
   hierarchy (Level 1, Level 2, Level 3).
2. **Visual Weight Specifications:** Rules for how each level is treated (e.g.,
   "Level 1 uses H1 + Primary Color + 48px margin").
3. **Implementation Rules:** CSS-specific guidance on font weights, layering
   (z-index), and spacing.

## Workflow

### 1. Perform Priority Scoring

List every element on the screen. Assign a score from 1 (Most Critical) to 4
(Least Critical).

- _Level 1:_ The one thing the user MUST see/do (e.g., Headline + Primary CTA).
- _Level 2:_ Secondary information needed for the decision (e.g., Features,
  Social Proof).
- _Level 3:_ Ancillary details (e.g., Footer links, secondary navigation).

### 2. Map Visual Levers

For each level, apply one or more levers to create distinction:

- **Size:** Larger elements attract the eye first.
- **Color & Contrast:** High-contrast or vibrant colors pull attention.
- **Typography:** Bold weights for Level 1, lighter for Level 3.
- **Whitespace:** Surround Priority 1 elements with "breathing room" to isolate
  them.
- **Position:** Place high-priority items in the top-left or centered above the
  fold.

### 3. Apply the "Squint Test"

Squint your eyes until the page is blurred.

- What is the first thing you see? (Should be Level 1).
- What is the second? (Should be Level 2).
- If multiple elements are competing for attention while blurred, the hierarchy
  is flat.

### 4. Define Scan Paths

Check if the hierarchy supports common reading behaviors:

- **Z-Pattern:** For simple, visual-heavy pages (Logo -> Top Right Nav -> Center
  Content -> Bottom Right CTA).
- **F-Pattern:** For content-heavy pages (Headline -> First Sentence ->
  Subheadings).

### 5. Document CSS Classes

Translate the hierarchy into reusable classes (e.g., `.text-display-lg`,
`.btn-primary`, `.text-muted`).

## Decision Rules

- **The Rule of One:** There should only be one "Level 1" element visible at a
  time (e.g., one Primary H1 and one Primary CTA per viewport).
- **Size-Contrast Trade-off:** If an element must be small for layout reasons,
  use high contrast or color to maintain its priority.
- **Proximity equals Relationship:** Keep related items (e.g., Headline and its
  Subhead) closer together than unrelated items.
- **Scanning over Reading:** Users don't read; they scan. Hierarchy must be
  clear enough that a user can understand the page value without reading the
  body text.

## Constraints

- **Accessibility:** Never use color alone to indicate priority. Ensure contrast
  ratios (WCAG AA) are maintained even for Level 2/3 text.
- **Mobile Responsiveness:** Hierarchy often shifts from horizontal (Desktop) to
  vertical (Mobile). Ensure the Priority 1 element remains "Above the Fold" on
  mobile.
- **Consistency:** Use the same visual weight for the same level across the
  entire site (e.g., all H2s should look identical to preserve the hierarchy
  system).

## Common Failure Patterns

- **The "Everything is Important" Trap:** Making every headline bold and every
  button bright red, resulting in visual noise.
- **Weak Level 1:** A headline that is too small or lacks contrast, causing
  users to bounce because they don't know what the page is about.
- **Buried CTA:** Placing the primary action in a place where it blends in with
  the background or other secondary buttons.
- **Lack of Whitespace:** Cramming elements too close together, which prevents
  the eye from resting on the most important information.

## Validation Criteria

- [ ] The Primary CTA is the most visually prominent element on the screen.
- [ ] The "Squint Test" reveals a clear path of importance.
- [ ] Typography follows a logical scale (H1 > H2 > H3).
- [ ] Related elements are grouped using proximity.
- [ ] The design guides the user toward a specific goal without confusion.
- [ ] Hierarchy remains intact and logical on mobile viewports.
