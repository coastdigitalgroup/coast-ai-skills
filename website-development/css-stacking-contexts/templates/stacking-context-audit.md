# Stacking Context Audit Checklist

Use this checklist when you encounter unexpected layering behavior (elements
appearing on top of or behind others incorrectly).

## 1. Visual Inspection

- [ ] Which element is incorrectly layered?
- [ ] What is the intended "above/below" relationship?
- [ ] Does the issue only happen on certain browsers or screen sizes?

## 2. Parent Stacking Context Audit

Trace up the DOM tree from the problematic element and check for properties that
create a stacking context:

- [ ] `position: absolute` or `relative` with a `z-index` other than `auto`.
- [ ] `position: fixed` or `sticky`.
- [ ] `opacity` less than 1.
- [ ] `transform` other than `none` (e.g., `scale(1)`, `translate(0)`).
- [ ] `filter` other than `none`.
- [ ] `backdrop-filter` other than `none`.
- [ ] `mix-blend-mode` other than `normal`.
- [ ] `isolation: isolate`.
- [ ] `will-change` with any property that creates a context.
- [ ] `container-type` (Size queries).

## 3. Z-Index Comparison

- [ ] What is the `z-index` of the problematic element?
- [ ] What is the `z-index` of the element it is conflicting with?
- [ ] Are these two elements in the **same** stacking context? (If not, their
      `z-index` values cannot be compared directly).

## 4. Root Cause Identification

- [ ] **Is it a "Trap"?** Is the element inside a parent that has a lower
      `z-index` than the conflicting element?
- [ ] **Is it "Static"?** Does the element have `position: static`? (Z-index
      only works on positioned elements).
- [ ] **Is it DOM Order?** If neither has a `z-index`, is the conflicting
      element simply later in the HTML?

## 5. Proposed Fixes

- [ ] Remove the property creating the unnecessary stacking context.
- [ ] Move the element higher in the DOM (e.g., outside the restrictive parent).
- [ ] Apply `z-index` to the parent instead of the child.
- [ ] Use `isolation: isolate` to encapsulate the component's internal layering.
