# Interaction State Matrix Template

Use this template to document the interaction behavior of new components. Copy
and fill this out for each unique interactive element.

## Component Name: [Insert Name]

### Visual Variables

_Identify which properties will change (e.g., Background, Border, Shadow, Scale,
Opacity)._

- **Variable A:** [e.g., Background Color]
- **Variable B:** [e.g., Box Shadow]

### State Map

| State        | Visual Specification | Animation/Transition |
| ------------ | -------------------- | -------------------- |
| **Default**  | [Value]              | N/A                  |
| **Hover**    | [Value]              | [Duration] [Easing]  |
| **Focus**    | [Value]              | [Duration] [Easing]  |
| **Active**   | [Value]              | [Duration] [Easing]  |
| **Disabled** | [Value]              | [Duration] [Easing]  |

### Touch (Mobile) Behavior

- **Tap Feedback:** [Describe the active state response on mobile]
- **Touch Target Size:** [Confirm min 44x44px]
- **Long Press:** [Specify if any secondary action exists]

### Accessibility Requirements

- **Focus Indicator Contrast:** [Confirm 3:1 ratio]
- **Keyboard Navigation:** [Specify Tab order behavior]
- **Aria Attributes:** [List any necessary `aria-expanded`, `aria-checked`,
  etc.]

---

## Global Interaction Tokens (Reference)

| Token Name           | Value                | Usage                      |
| -------------------- | -------------------- | -------------------------- |
| `--trans-duration`   | 200ms                | Standard state transitions |
| `--trans-easing`     | ease-in-out          | Smooth entry/exit          |
| `--focus-ring-width` | 2px                  | Global focus visibility    |
| `--focus-ring-color` | var(--color-primary) | Consistent brand focus     |
