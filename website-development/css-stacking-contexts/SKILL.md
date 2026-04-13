---
name: css-stacking-contexts
description:
  Systematically manage and debug CSS layering issues by understanding and
  controlling stacking contexts and z-index.
---

# CSS Stacking Contexts

## Purpose

The CSS Stacking Contexts skill provides a structured approach to managing the
vertical ordering (layering) of elements on a webpage. It enables developers to
debug "broken" z-index values, prevent layering conflicts, and implement
predictable UI depth.

## Use Cases

- Debugging why a high `z-index` value (e.g., `9999`) is appearing _behind_ an
  element with a lower value.
- Implementing complex UI components like sticky headers, modal overlays,
  tooltips, and dropdowns that must appear in a specific order.
- Orchestrating multi-layered animations or parallax effects.
- Preventing "z-index wars" where developers continually increase values to fix
  layering issues.

## When NOT to Use

- **Simple Document Flow:** When standard source order naturally handles
  layering (elements later in the DOM appear on top).
- **SVG Internal Layering:** SVG uses a different layering model based on
  document order alone; `z-index` does not apply to SVG child elements.
- **Canvas Rendering:** Layering within a `<canvas>` element is handled by the
  drawing context, not CSS.

## Inputs

1. **Target Elements:** The elements whose layering is incorrect or needs to be
   defined.
2. **Current CSS Properties:** The styles applied to the elements and their
   parent chain (specifically `position`, `z-index`, `opacity`, `transform`,
   `filter`, `isolation`, `will-change`).
3. **DOM Hierarchy:** The nesting relationship of the elements in question.

## Outputs

1. **Stacking Audit:** Identification of which elements are creating new
   stacking contexts.
2. **Layering Strategy:** A plan for where to establish stacking contexts and
   what z-index values to assign.
3. **Optimized CSS:** Refined styles that achieve the desired layering with the
   lowest possible complexity.

## Workflow

### 1. Identify the Stacking Contexts

Use browser DevTools (e.g., Chrome's "Layers" panel or "Stacking Context"
extensions) to trace the hierarchy. An element's `z-index` only matters _within_
its closest ancestor that forms a stacking context.

### 2. Locate the "Trap"

If an element is appearing behind something it shouldn't, check its parents. If
a parent has a stacking context and a lower `z-index` (or is just lower in the
DOM order) than a sibling, no amount of `z-index` on the child will bring it in
front of that sibling.

### 3. Choose a Layering Pattern

- **Flat Management:** Keep major UI layers (header, main, footer, overlays) as
  direct children of `body` to minimize nesting issues.
- **Local Isolation:** Use `isolation: isolate;` on a component container to
  prevent its internal `z-index` values from leaking out or being affected by
  the outside.
- **Variable-Based Scale:** Use CSS variables (e.g., `--z-index-modal: 1000`) to
  manage values centrally.

### 4. Apply Corrective Styles

- To move an element to the top: Ensure it has a `position` other than `static`
  and a `z-index`.
- To fix a "trapped" element: Either move the element out of the restrictive
  parent in the DOM or remove the property creating the stacking context from
  the parent (if possible).
- To create a "clean slate": Use `isolation: isolate;` on a parent to start a
  fresh stacking context for its children.

### 5. Prevent Regressions

Document the layering intent in CSS comments or by using a standardized z-index
scale.

## Decision Rules

- **The "Context First" Rule:** Before changing a `z-index` value, identify the
  parent stacking context.
- **Lower is Better:** Use the smallest possible `z-index` values. If you need
  `9999`, your stacking strategy is likely broken.
- **Isolation over Position:** Use `isolation: isolate;` to create a stacking
  context without needing to change `position` or `z-index` on the element
  itself.
- **Source Order Priority:** Whenever possible, use DOM order to manage layering
  instead of `z-index`.

## Constraints

- **The "Atomic" Stacking Context:** Some properties (like `opacity < 1` or
  `transform`) create a stacking context automatically, even if you don't want
  one.
- **Browser Limits:** While `z-index` can be a very large integer, extreme
  values are a sign of poor architecture.

## Non-Goals

- Managing 3D transforms (`preserve-3d`) which involve the `w` axis and
  different rendering rules.
- General layout positioning (Centering, Grids, Flexbox) unless it relates to
  layering.

## Common Failure Patterns

- **Z-Index Fighting:** Incrementing values (10, 100, 1000, 9999) without
  understanding the underlying contexts.
- **The "Parent Trap":** Trying to bring a child "above" a sibling of its parent
  when the parent has a lower z-index or stacking context.
- **Implicit Contexts:** Forgetting that properties like `filter`, `mask`,
  `opacity`, or `will-change` create stacking contexts that reset the `z-index`
  of their children.
- **Fixed Position Confusion:** `position: fixed` elements always create a
  stacking context (in most modern browsers).

## Validation Steps

- [ ] **Layer Audit:** Use DevTools to confirm the stacking context hierarchy.
- [ ] **Dynamic Content Test:** Verify that dynamically added content (like
      tooltips) still appears in the correct layer.
- [ ] **Mobile/Touch Test:** Ensure that layering doesn't interfere with touch
      events or scrolling.
- [ ] **Overflow Check:** Ensure that `overflow: hidden` on a parent isn't
      clipping an element that was moved to a higher layer.
