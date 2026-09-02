# Shadow DOM & Custom Web Components Technical Reference

A developer reference covering browser specifications, CSS inheritance rules, slotting mechanics, event retargeting, ARIA boundaries, and performance heuristics for HTML Web Components.

---

## 1. The Custom Elements Lifecycle

Custom Elements v1 defines four standard lifecycle callbacks executed synchronously by the browser engine:

| Lifecycle Callback | Trigger Condition | Primary Use Case | Critical Restrictions |
| :--- | :--- | :--- | :--- |
| `constructor()` | Instantiation of element class (`document.createElement` or HTML parsing) | Attach shadow root, set private initial values | DO NOT inspect attributes, children, or parent nodes |
| `connectedCallback()` | Element inserted into active document DOM tree | Attach event listeners, query internal nodes, initialize observers | May fire multiple times if element is moved in DOM |
| `disconnectedCallback()` | Element removed from active document DOM tree | Abort event listeners, clear timers, disconnect observers | MUST clean up external references to prevent leaks |
| `attributeChangedCallback(name, oldVal, newVal)` | An observed attribute is added, removed, or modified | Synchronize attribute state to internal DOM / properties | Fires only for attributes listed in `observedAttributes` |
| `adoptedCallback()` | Element moved to a new `Document` via `adoptNode()` | Update iframe or sub-document references | Rarely needed in standard single-document SPAs |

---

## 2. Shadow DOM Scoping & CSS Encapsulation Rules

Shadow DOM (`mode: 'open'`) isolates the shadow tree DOM nodes and CSS rules from the host light DOM document tree.

### CSS Selector Scope Boundaries

- **Styles inside Shadow DOM** ONLY match elements inside that shadow root. Global host CSS rules (e.g. `p { color: red; }`) do NOT penetrate the shadow root boundary.
- **Exception 1: Inherited CSS Properties:** Properties that naturally inherit down the DOM tree (e.g., `font-family`, `color`, `line-height`, `visibility`, `text-align`) WILL flow from the host document through the shadow root into internal elements unless overridden by internal CSS.
- **Exception 2: CSS Custom Properties (`var(--...)`):** CSS variables cross shadow DOM boundaries seamlessly. They serve as the primary public styling API for web components.

### Special Pseudo-Selectors for Shadow DOM

```css
/* Target the host custom element itself from inside shadow root */
:host {
  display: block;
  box-sizing: border-box;
  background-color: var(--component-bg, #ffffff);
}

/* Target host element only when it matches a specific attribute/class selector */
:host([disabled]) {
  opacity: 0.5;
  pointer-events: none;
}

:host(.primary-variant) {
  border: 2px solid var(--primary-color, #2563eb);
}

/* Target host element based on ancestor context in light DOM */
:host-context(.dark-theme) {
  background-color: #1e293b;
  color: #f8fafc;
}

/* Target top-level elements projected into a <slot> from host Light DOM */
::slotted(h2) {
  margin: 0;
  color: var(--header-color, inherit);
}

::slotted([slot="icon"]) {
  width: 24px;
  height: 24px;
}
```

> **Crucial Rule on `::slotted()`:** `::slotted(selector)` CAN ONLY target top-level direct child elements projected into the slot. It CANNOT target nested descendants inside slotted elements (e.g., `::slotted(div p)` is invalid). Slotted elements remain in the Light DOM, so host CSS can still style them directly.

---

## 3. Slot Mechanics & Content Projection

Slots provide placeholder outlets within the Shadow DOM template where host Light DOM children are projected.

### Slot Assignment Types

1. **Default Slot (`<slot></slot>`):** Captures all un-slotted light DOM children.
2. **Named Slot (`<slot name="header"></slot>`):** Captures light DOM children matching `slot="header"`.

### Slot Lifecycle Events & JavaScript API

```javascript
// Accessing assigned elements in shadow root
const slot = this.shadowRoot.querySelector('slot[name="header"]');

// Get direct assigned DOM elements (excluding text nodes)
const assignedNodes = slot.assignedElements();

// Listen for dynamic slotted content changes
slot.addEventListener('slotchange', (event) => {
  console.log('Slotted content changed:', slot.assignedElements());
});
```

---

## 4. Custom Event Dispatching & Retargeting

Events dispatched inside a Shadow Root undergo **Event Retargeting** when crossing the shadow boundary.

### Retargeting Behavior

When an event bubbles out of a shadow root into the light DOM document, the browser changes `event.target` to point to the host Custom Element itself (`<ui-modal>`), preserving internal DOM implementation details.

### CustomEvent Dispatched Configuration Matrix

| `bubbles` | `composed` | Behavior Outside Shadow Root |
| :--- | :--- | :--- |
| `false` | `false` | Event stays strictly inside the internal shadow DOM element that fired it. |
| `true` | `false` | Event bubbles UP inside the shadow root, but STOPS at the shadow boundary. Host page cannot hear it. |
| `true` | `true` | Event bubbles UP inside shadow root, PASSES through shadow boundary, retargets `target` to custom element, and bubbles UP host Light DOM tree. |

```javascript
// Recommended CustomEvent dispatch pattern
this.dispatchEvent(new CustomEvent('selection-change', {
  detail: { selectedValue: 'option-1' },
  bubbles: true,   // Allow event to bubble up DOM tree
  composed: true,  // Allow event to pass through Shadow DOM root boundary
  cancelable: true // Allow host code to call e.preventDefault()
}));
```

---

## 5. Accessibility & ARIA Cross-Boundary Gotchas

Accessibility tree nodes are constructed from both light DOM and shadow DOM trees, but ID reference attributes (`aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-owns`, `for`) **CANNOT cross shadow root boundaries**.

### Broken Pattern:
```html
<!-- Host Light DOM -->
<span id="external-label">Username</span>
<custom-input aria-labelledby="external-label"></custom-input>
<!-- Inside shadow DOM of <custom-input>, <input aria-labelledby="external-label"> FAILS because #external-label is outside the shadow root! -->
```

### Correct Solutions:
1. **Pass Text via Slots:** Project text into `<slot>` and link ARIA roles internally inside the shadow root.
2. **ElementInternals Accessibility Target References:** Use `this.attachInternals()` for form-associated custom elements to expose aria states programmatically.
3. **Host-Level Role Management:** Place container ARIA attributes directly on the host custom element rather than inside the shadow root.

---

## 6. Form-Associated Custom Elements (FACE) API

Custom Elements can act as native HTML form controls using `ElementInternals`.

```javascript
class CustomNumberInput extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.attachShadow({ mode: 'open' });
  }

  set value(val) {
    this._value = val;
    // Set form value for submit requests
    this._internals.setFormValue(val);

    // Set native form validation state
    if (val < 0) {
      this._internals.setValidity({ valueMissing: true }, 'Value must be positive');
    } else {
      this._internals.setValidity({});
    }
  }

  get form() { return this._internals.form; }
  get name() { return this.getAttribute('name'); }
}
```

---

## 7. Performance Heuristics

1. **Shared Template Cloning:** Define HTML `<template>` elements once outside the class definition or statically on the module level. Clone using `template.content.cloneNode(true)` inside constructors to eliminate repeated HTML parsing.
2. **Constructable Stylesheets:** For large component libraries, use `new CSSStyleSheet()` and `shadowRoot.adoptedStyleSheets = [sharedSheet]` to share parsed CSS memory across thousands of element instances.
3. **Avoid Over-Observed Attributes:** Keep `observedAttributes` minimal. For complex objects or arrays, use JavaScript properties instead of serializing JSON into DOM attributes.
