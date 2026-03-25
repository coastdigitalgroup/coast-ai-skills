---
name: react
description: Build and review modern React components, hooks, state flows, and UI structures with clear data flow and maintainable composition. Use when working on React or JSX/TSX interfaces, refactoring components, improving state handling, or designing reusable UI patterns.
---

# React

Build components that are easy to understand, compose, and change.

## Core Approach

- Prefer small components with clear responsibilities.
- Keep data flow explicit and predictable.
- Derive UI from state instead of synchronizing duplicated state by hand.
- Extract shared patterns only when reuse is real.
- Preserve existing team conventions when the codebase already has them.

## Guardrails

- Avoid deeply nested component trees when a simpler split would work.
- Avoid effects for logic that can run during render or event handling.
- Avoid unnecessary prop drilling when composition or context is the better fit.
- Keep hooks focused and named for the behavior they provide.
- Optimize readability before micro-optimization.

## Working Pattern

1. Identify the user-facing behavior and the state that drives it.
2. Split the UI into components with clear boundaries.
3. Keep side effects isolated and intentional.
4. Model loading, empty, success, and error states explicitly.
5. Refine props and naming until the component API feels obvious.

## References

- Read [references/patterns.md](references/patterns.md) for common component and state patterns.

## Output Expectations

- Produce idiomatic React with readable component boundaries.
- Keep styling consistent with the host project.
- Add comments only when the behavior would otherwise be hard to follow.
