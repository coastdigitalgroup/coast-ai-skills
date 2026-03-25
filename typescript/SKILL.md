---
name: typescript
description: Build and review strict TypeScript codebases with strong domain modeling, safe runtime validation, exhaustive state handling, and maintainable type design. Use when working on TypeScript or TSX code, designing shared types, improving type safety, creating validation boundaries, or refactoring loosely typed application logic.
---

# TypeScript

Build for correctness first.

## Core Approach

- Prefer explicit domain models over ad hoc object shapes.
- Validate external input at the boundary before it enters the domain layer.
- Use discriminated unions for state and result modeling.
- Favor `unknown` plus narrowing over unsafe assertions.
- Keep types readable enough that teammates can maintain them.

## Guardrails

- Avoid `any`.
- Avoid non-null assertions.
- Avoid broad `as` assertions unless there is no safer boundary strategy.
- Prefer string unions or `as const` objects over enums.
- Prefer readonly input shapes when mutation is not required.
- Model impossible states away instead of documenting them.

## Working Pattern

1. Identify the domain entities, inputs, outputs, and failure modes.
2. Create narrow types for those shapes before writing implementation details.
3. Add validation for API, storage, form, or environment boundaries.
4. Model control flow with unions or typed result objects.
5. Refine the implementation until the types express the intended behavior clearly.

## Common Choices

- Use schema validation libraries such as Zod or Valibot when runtime parsing is needed.
- Use branded or opaque identifiers when mixing IDs would be dangerous.
- Use exhaustive matching patterns when state transitions matter.
- Keep utility types local unless they are clearly reusable across the codebase.

## References

- Read [references/basics.md](references/basics.md) for concrete patterns and examples.

## Output Expectations

- Produce idiomatic `.ts` or `.tsx` code.
- Add short comments only when the code would otherwise be hard to parse.
- Preserve team conventions when the surrounding codebase already has them.
