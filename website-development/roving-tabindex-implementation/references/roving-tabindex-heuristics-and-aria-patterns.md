# Roving Tabindex Heuristics and ARIA Composite Patterns

## Overview

The Roving Tabindex pattern is the WAI-ARIA Authoring Practices Guide (APG) standard for managing keyboard focus within composite UI components. A composite UI component is a widget containing multiple focusable interactive sub-elements that function collectively as a single logical control on the page.

Without roving tabindex, complex UIs (such as toolbars with 20 buttons or menus with 50 options) pollute the page's natural sequential `Tab` key navigation sequence, requiring users to press `Tab` dozens of times to bypass a single component.

---

## ARIA Composite Widget Roles

Roving tabindex must be applied when creating components with any of the following WAI-ARIA composite roles:

| ARIA Composite Role | Expected Sub-Item Role | Navigation Axis | Selection Behavior |
| :--- | :--- | :--- | :--- |
| `role="toolbar"` | `button`, `link`, `checkbox` | Horizontal / Vertical | Activation on `Enter` / `Space` |
| `role="tablist"` | `role="tab"` | Horizontal / Vertical | Auto or Manual selection on Arrow key |
| `role="radiogroup"` | `role="radio"` | Horizontal / Vertical | Auto selection + check on Arrow key |
| `role="menu"` / `role="menubar"` | `role="menuitem"`, `role="menuitemcheckbox"` | Vertical / Horizontal | Focus on Arrow, trigger on `Enter` / `Space` |
| `role="grid"` | `role="gridcell"`, `role="row"` | 2D (`both`) | Spatial cell navigation via 4 arrow keys |
| `role="tree"` | `role="treeitem"` | Vertical + Horizontal (expand/collapse) | Focus on Arrow, expand on `ArrowRight`, collapse on `ArrowLeft` |

---

## Key Navigation Rules Matrix

Standardized key handling expectations across composite widgets:

```text
[ Tab / Shift+Tab ]
  ├── Enters widget -> Focuses the single item marked tabindex="0"
  └── Exits widget  -> Jumps completely past all sibling items to next/prev focusable page element

[ Arrow Keys ]
  ├── Horizontal Widget (LTR) : ArrowLeft  -> Prev Item | ArrowRight -> Next Item
  ├── Horizontal Widget (RTL) : ArrowLeft  -> Next Item | ArrowRight -> Prev Item
  ├── Vertical Widget         : ArrowUp    -> Prev Item | ArrowDown  -> Next Item
  └── 2D Grid                 : Up/Down    -> Prev/Next Row | Left/Right -> Prev/Next Column

[ Home / End ]
  ├── Home -> Move focus to first visible, non-disabled item
  └── End  -> Move focus to last visible, non-disabled item
```

---

## Comparison: Roving Tabindex vs. `aria-activedescendant`

Two primary techniques exist for handling visual keyboard focus inside composite UI controls. Choosing the correct strategy depends on DOM rendering constraints:

```text
Feature                     Roving Tabindex                 aria-activedescendant
---------------------------------------------------------------------------------------
DOM Focus Location          Moves from item to item         Stays fixed on container/input
Tabindex Strategy           One tabindex="0", rest "-1"     Container tabindex="0"
Child Focusability          Real focusable elements         Items have NO tabindex
Screen Reader Support       Universal native DOM focus      Requires correct ARIA structure
Virtual Scrolling Support   Harder (DOM nodes change)       Ideal for infinite virtual lists
DOM Mutation Overhead       Requires tabindex attribute updates  Requires ID / attribute updates
```

### Heuristic Rule:
- **Use Roving Tabindex** when child items are standard DOM elements (`<button>`, `<a>`, `[tabindex]`) rendered directly in the DOM.
- **Use `aria-activedescendant`** when maintaining physical DOM focus on an `<input>` field (such as an autocomplete combobox) while navigating a separate popup list, or when rendering virtualized lists with thousands of items.

---

## Browser & Screen Reader Gotchas

### 1. The Scroll-Blocking Arrow Key Gotcha
In web browsers, pressing `ArrowUp`, `ArrowDown`, `Home`, or `End` defaults to scrolling the viewport window.
- **Rule:** Always call `event.preventDefault()` inside the `keydown` event listener for handled navigation keys to prevent main window jank.

### 2. Native `<input>` Interaction Conflict
If a composite widget (e.g. `role="toolbar"`) contains an embedded text `<input>` or `<textarea>`:
- **Rule:** Do NOT intercept `ArrowLeft` or `ArrowRight` when focus is actively inside a text field, as arrow keys must move the text insertion caret.

### 3. Screen Reader Virtual Cursor vs. Keyboard Focus
Screen readers (NVDA, JAWS, VoiceOver) switch between "Focus Mode" (interactive navigation) and "Browse Mode" (virtual text reading).
- **Rule:** Standard composite roles (`role="toolbar"`, `role="tablist"`, `role="radiogroup"`) signal screen readers to automatically switch to Focus Mode when Tab enters the container. Never omit proper ARIA composite roles.

---

## Accessibility Compliance (WCAG 2.2 Requirements)

- **WCAG 2.1.1 Keyboard (Level A):** All functionality must be operable using only a keyboard.
- **WCAG 2.1.2 No Keyboard Trap (Level A):** Focus must not be trapped inside the composite widget; `Tab` and `Shift+Tab` must allow clean exit.
- **WCAG 2.4.7 Focus Visible (Level AA):** Focusable items must display a visually distinguishable focus indicator when receiving keyboard focus.
- **WCAG 1.3.2 Meaningful Sequence (Level A):** Visual navigation order must align logically with DOM navigation order.
