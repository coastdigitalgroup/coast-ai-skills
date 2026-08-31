---
name: custom-web-components-implementation
description:
  Build, encapsulate, and lifecycle-manage reusable HTML Web Components using
  Custom Elements v1, Shadow DOM v1, HTML Templates, slots, attribute reflection,
  and reactive state bindings.
---

# Custom Web Components Implementation

## Purpose

The Custom Web Components Implementation skill provides a standardized, framework-agnostic architectural protocol for building native, encapsulated, and lifecycle-managed HTML Web Components. It establishes patterns for Custom Element registration (`customElements.define`), Shadow DOM scoping (`attachShadow`), slot content projection (`<slot>`), reactive attribute reflection (`observedAttributes` and `attributeChangedCallback`), component teardown (`disconnectedCallback`), custom event propagation (`CustomEvent`), and Form-Associated Custom Elements (`ElementInternals`).

## Use Cases

- **Framework-Agnostic Design Systems:** Creating UI component libraries (buttons, modal dialogs, tab sets, accordions, dynamic inputs) that run seamlessly across React, Vue, Angular, Svelte, or vanilla HTML pages.
- **Micro-Frontend Integration:** Encapsulating feature widgets and independent DOM modules to prevent global CSS selector pollution, JavaScript variable leakage, and cross-team code interference.
- **Embedded Web Widgets:** Building third-party scripts or drop-in widgets (chat widgets, feedback tools, embedded calculators) that guarantee style isolation from host site CSS.
- **Design Token & Theme Distribution:** Leveraging CSS Custom Properties (`var(--...)`) and Shadow DOM `:host` selectors to expose controlled styling APIs while guarding internal layout structures.
- **Form-Associated Custom Controls:** Implementing custom form controls (e.g. custom rating inputs, tagged pickers) that participate natively in HTML `<form>` submission and validation using `ElementInternals`.

## When NOT to Use

- **Simple Static HTML/CSS Components:** When standard HTML semantic elements (`<details>`, `<dialog>`, `<nav>`) combined with CSS rules achieve the required layout without dynamic JavaScript lifecycle logic.
- **Purely Internal Single-Framework Apps:** If a project is strictly built within a single framework ecosystem (e.g. Next.js/React only) and has zero requirements for cross-framework portability or CSS encapsulation, standard framework components may be sufficient.
- **Lightweight Event Handling:** For simple script enhancements on existing DOM elements where standard event listeners and data attributes (`data-action`) suffice without defining a custom HTML tag.

## Inputs

1. **Custom Tag Name:** A valid hyphenated custom element tag name (e.g., `<ui-tab-panel>`, `<app-modal>`).
2. **Encapsulated Template Structure:** HTML markup defining internal component structure and content projection `<slot>` elements.
3. **Observed Attributes List:** Array of string attribute names to monitor for dynamic updates via `observedAttributes`.
4. **Style Encapsulation Mode:** Choice between `open` Shadow DOM, `closed` Shadow DOM, or Light DOM rendering.
5. **Form Participation Requirements:** Indicator whether the element acts as an HTML form control requiring `static formAssociated = true` and `ElementInternals`.

## Outputs

1. **Custom Element Class Definition:** An ES6 class extending `HTMLElement` (or specific subclass) registered via `customElements.define()`.
2. **Shadow Root & Style Architecture:** Scoped Shadow DOM tree with encapsulated CSS styles, `:host` selectors, and slotted content containers.
3. **Reactive Attribute Reflectors:** Property getters/setters synchronized with DOM attributes (`getAttribute`, `setAttribute`, `hasAttribute`).
4. **Custom Event Dispatches:** Standardized event emission (`CustomEvent`) configured with `bubbles`, `composed`, and `detail` properties.
5. **Teardown & Memory Cleanup Logic:** `disconnectedCallback` logic clearing event listeners, timers, and external observers.

## Workflow

### 1. Define Custom Element Skeleton and Register Tag Name

Define a class extending `HTMLElement`. Verify that the tag name contains a hyphen to avoid collisions with standard HTML elements. Register the element using `customElements.define()`, guarding against duplicate registration when executing in hot-reloading environments.

```javascript
class CustomCard extends HTMLElement {
  static get tag() {
    return 'custom-card';
  }

  constructor() {
    super();
    // Initialize Shadow Root
    this.attachShadow({ mode: 'open' });
  }
}

if (!customElements.get(CustomCard.tag)) {
  customElements.define(CustomCard.tag, CustomCard);
}
```

### 2. Configure Reactive Attributes and Property Reflection

Declare `static get observedAttributes()` returning an array of attributes to monitor. Implement `attributeChangedCallback(name, oldValue, newValue)` to trigger rendering updates when attributes mutate. Reflect properties to attributes via getters and setters.

```javascript
class CustomCard extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
  }

  get variant() {
    return this.getAttribute('variant') || 'default';
  }

  set variant(val) {
    if (val) {
      this.setAttribute('variant', val);
    } else {
      this.removeAttribute('variant');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    this.toggleAttribute('disabled', Boolean(val));
  }
}
```

### 3. Establish Encapsulated Template & Slot Architecture

Construct internal DOM using `<template>` elements or Shadow Root innerHTML. Use named and default `<slot>` elements to accept host markup projection. Apply CSS styles targeting `:host`, `:host([disabled])`, `::slotted(*)`, and CSS custom property theme tokens.

```javascript
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      border: 1px solid var(--card-border-color, #ccc);
      border-radius: var(--card-radius, 8px);
      padding: 1rem;
      background: var(--card-bg, #ffffff);
    }
    :host([disabled]) {
      opacity: 0.6;
      pointer-events: none;
    }
    header {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    ::slotted([slot="header"]) {
      margin: 0;
      color: var(--card-header-color, inherit);
    }
  </style>
  <header><slot name="header">Default Title</slot></header>
  <main><slot></slot></main>
`;

class CustomCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
```

### 4. Implement Lifecycle Callbacks & Event Listeners

Use `connectedCallback()` to attach internal DOM event listeners, initialize `AbortController` signals, and perform setup work when inserted into the document. Use `disconnectedCallback()` to abort listeners and clean up external resources.

```javascript
class CustomCard extends HTMLElement {
  connectedCallback() {
    this._abortController = new AbortController();
    const { signal } = this._abortController;

    const actionBtn = this.shadowRoot.querySelector('#action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => this._handleAction(e), { signal });
    }
  }

  disconnectedCallback() {
    if (this._abortController) {
      this._abortController.abort();
    }
  }

  _handleAction(event) {
    this.dispatchEvent(new CustomEvent('card-action', {
      detail: { timestamp: Date.now() },
      bubbles: true,
      composed: true // Allows event to pass through Shadow DOM boundary
    }));
  }
}
```

### 5. Form-Associated Custom Elements Integration (Optional)

For custom form elements, declare `static formAssociated = true`. Call `this.attachInternals()` in the constructor to acquire `ElementInternals`. Synchronize element value and validation status with the host `<form>`.

```javascript
class CustomToggle extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();
    this.internals_ = this.attachShadow({ mode: 'open' });
    this._internals = this.attachInternals();
  }

  set value(val) {
    this._value = val;
    this._internals.setFormValue(val);
  }
}
```

## Decision Rules

- **Shadow DOM vs. Light DOM:**
  - **Use Shadow DOM (`mode: 'open'`):** When complete CSS style encapsulation, slot content projection, and isolation from host page CSS rules are required.
  - **Use Light DOM (No Shadow Root):** When component styling relies directly on host global utility frameworks (e.g. Tailwind CSS or global theme stylesheets) or when server-rendered HTML accessibility requires direct light-tree DOM relationships.
- **Open vs. Closed Shadow Root:**
  - **Use `mode: 'open'`:** Always prefer open shadow roots (`this.shadowRoot`). Open roots enable testing tools, accessibility inspectors, and developer tools to inspect and interact with the shadow tree.
  - **Use `mode: 'closed'`:** Avoid unless building security-sensitive browser extensions or proprietary sandbox wrappers. `mode: 'closed'` does not provide true security and breaks many web standard tools.
- **Event `composed: true` vs. `composed: false`:**
  - **Use `composed: true`:** For component-level state changes or user interactions (e.g., `tab-select`, `modal-close`) that host page application scripts need to listen for outside the Shadow DOM boundary.
  - **Use `composed: false`:** For internal component events (e.g., internal element hover, sub-template recalculations) that should remain hidden within the component's internal Shadow DOM implementation.

## Constraints

- **Tag Naming Requirement:** Custom element tag names MUST contain at least one hyphen (e.g. `<my-element>`, NOT `<myelement>`) and start with an ASCII letter to adhere to the HTML specification.
- **Constructor Restrictions:** The `constructor()` MUST call `super()` first. Do NOT inspect attributes, append children, or manipulate light DOM siblings in the constructor because the element is not yet connected to the document.
- **Accessibility & ARIA Boundaries:** ARIA references (`aria-labelledby`, `aria-describedby`, `aria-controls`) using IDs CANNOT cross Shadow DOM boundaries directly. Use slotted element hierarchies or programmatic `ElementInternals` target references.
- **Form Interoperability:** Custom Elements do not submit values in native `<form>` elements unless `static formAssociated = true` and `ElementInternals.setFormValue()` are implemented.

## Non-Goals

- Replacing framework-specific client routers or application-level state trees (e.g. Redux, Pinia).
- Providing polyfills for ancient browser engines lacking Web Component v1 APIs (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+ natively support Web Components).
- Server-side rendering (SSR) DOM hydration engines (though Web Components work with Declarative Shadow DOM, full SSR hydration tooling is outside this skill).

## Common Failure Patterns

- **Constructor Attribute Access Error:** Reading `this.getAttribute()` inside `constructor()`, throwing an `Uncaught DOMException: Failed to construct 'CustomElement': The result must not have attributes`. Attributes MUST be read in `connectedCallback()` or `attributeChangedCallback()`.
- **Slotted Content Styling Failure:** Expecting shadow root CSS selectors (like `.internal-class`) to style light DOM elements passed into `<slot>`. Slotted content remains in the light DOM and can only be styled using the `::slotted(selector)` pseudo-element (top-level children only).
- **Leaked Document Event Listeners:** Attaching `window.addEventListener()` or `document.addEventListener()` in `connectedCallback()` without tearing them down in `disconnectedCallback()`, causing memory leaks and detached component retention.
- **Cross-Boundary ARIA Broken Links:** Setting `aria-labelledby="title-id"` on a shadow DOM input where `title-id` resides in host light DOM. The ID reference fails to resolve across shadow roots.
- **Infinite Attribute Mutation Loops:** Setting `this.setAttribute('foo', val)` inside `attributeChangedCallback('foo', ...)` without checking if `oldValue === newValue`, causing an infinite recursion loop.

## Validation Steps

- [ ] **Custom Element Registration Check:** Verify in DevTools Console that `customElements.get('tag-name')` returns the element class constructor without throwing errors.
- [ ] **Attribute Reflection Test:** Set attribute via `element.setAttribute('variant', 'primary')` and verify that `element.variant === 'primary'` updates reactively and updates shadow DOM UI.
- [ ] **Memory Teardown Verification:** Append component to DOM, remove it via `element.remove()`, and confirm via Chrome DevTools Memory Heap Snapshot that all attached `window`/`document` event listeners are removed.
- [ ] **Shadow DOM Isolation Test:** Apply global CSS rule `* { background: red !important; }` on host page and verify component internal shadow DOM elements preserve internal scoped styling if isolated via CSS custom properties.
- [ ] **Keyboard & ARIA Audit:** Confirm all interactive controls within the shadow root are focusable via `Tab` key, exhibit visible `:focus-visible` indicators, and announce correct ARIA roles in screen reader output.
