# React Patterns

## Use This Reference For

- choosing state ownership
- splitting components
- avoiding unnecessary effects
- handling async UI states clearly

## Common Patterns

### Lift state to the nearest useful owner

Keep state close to where it is used, but move it upward when multiple children
need the same source of truth.

### Represent UI states explicitly

Prefer visible state models such as:

- loading
- empty
- success
- error

### Keep effects narrow

Use effects for synchronization with external systems, not as a fallback for
ordinary application logic.

### Prefer composition over configuration overload

If a component needs too many boolean props, split it into smaller pieces or use
composition slots instead.
