# CSS Stacking Context Triggers

A stacking context is formed by any element that meets one of the following
criteria. Once a stacking context is formed, the z-indices of child elements are
relative only to that context.

## Common Triggers

| Property           | Condition                                                                                        |
| :----------------- | :----------------------------------------------------------------------------------------------- |
| **Root**           | The `<html>` element always forms the base stacking context.                                     |
| **Position**       | `absolute` or `relative` with a `z-index` value other than `auto`.                               |
| **Fixed/Sticky**   | `position: fixed` or `position: sticky` (sticky only in some older browsers, but generally yes). |
| **Flex/Grid**      | A child of a flex/grid container with `z-index` other than `auto`.                               |
| **Opacity**        | `opacity` value less than `1`.                                                                   |
| **Mix Blend Mode** | `mix-blend-mode` value other than `normal`.                                                      |
| **Isolation**      | `isolation: isolate` (Explicitly creates a context).                                             |

## CSS3 / Modern Triggers

These properties create a stacking context even if their value doesn't visually
change the element:

- `transform` (e.g., `translateZ(0)`, `rotate(0deg)`, `scale(1)`)
- `filter` (e.g., `blur(0px)`)
- `backdrop-filter`
- `perspective`
- `clip-path`
- `mask` / `mask-image` / `mask-border`
- `will-change` (when specifying any property that would create a context)
- `contain` (values like `layout`, `paint`, or composites like `content` or
  `strict`)

## Critical Behaviors to Remember

1.  **Atomic Rendering:** A stacking context is treated as a single "flattened"
    unit in the parent stacking context.
2.  **Z-index != Stacking Context:** You can create a stacking context _without_
    `z-index` (e.g., `opacity: 0.99`). You can also have `z-index` _without_ a
    stacking context (e.g., on a `position: absolute` element whose `z-index` is
    `auto`).
3.  **The "Global" Myth:** There is no "global" z-index. Every `z-index` is
    relative.
4.  **Hierarchy Matters:** If Parent A is below Parent B, Child A can never be
    above Child B, regardless of their individual `z-index` values, provided the
    parents create stacking contexts.
