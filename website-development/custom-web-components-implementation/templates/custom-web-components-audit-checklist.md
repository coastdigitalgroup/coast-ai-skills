# Custom Web Components Audit & Checklist

Use this checklist to audit custom web component implementations for standard specifications compliance, Shadow DOM style encapsulation, memory leak prevention, ARIA accessibility, and host page interoperability.

---

## 1. Registration & Specification Compliance

- [ ] **Valid Tag Name:** Does the custom element tag name contain at least one hyphen (e.g., `<ui-toggle-switch>`, NOT `<uitoggle>`) and start with an ASCII letter?
- [ ] **Subclass Extension:** Does the custom element class correctly extend `HTMLElement` or a standard HTML element interface?
- [ ] **Constructor Restrictions:** Does `constructor()` call `super()` before any other action? Does it avoid reading attributes, inspecting light DOM children, or creating side effects before `connectedCallback()`?
- [ ] **Duplicate Registration Guard:** Is component registration wrapped in `if (!customElements.get('tag-name')) { customElements.define(...); }` to prevent runtime error collisions during module re-imports or hot-reloading?

---

## 2. Reactive Attributes & Properties

- [ ] **Observed Attributes Array:** Are observed attributes declared via `static get observedAttributes()` returning an array of string attribute names?
- [ ] **Infinite Loop Guard:** Does `attributeChangedCallback(name, oldValue, newValue)` check `if (oldValue === newValue) return;` to prevent recursive re-rendering loops?
- [ ] **Property-to-Attribute Reflection:** Are boolean attributes reflected correctly using `hasAttribute()` / `toggleAttribute()` and string attributes reflected using `getAttribute()` / `setAttribute()`?
- [ ] **Default Value Fallbacks:** Do property getters provide sensible default fallbacks when attributes are absent from host HTML?

---

## 3. Shadow DOM & Style Encapsulation

- [ ] **Open Shadow Root:** Is the shadow root attached using `this.attachShadow({ mode: 'open' })` to support testing, devtools inspection, and web standards access?
- [ ] **`:host` Selector Styling:** Do component CSS styles set `:host { display: block; }` or appropriate layout displays so custom elements respond to layout sizing predictably?
- [ ] **CSS Custom Properties API:** Are key design tokens (colors, borders, fonts, spacing) exposed via CSS variables (`var(--component-bg, #fff)`) to allow controlled host page theming?
- [ ] **Slotted Content Styling:** Are light DOM projected elements styled strictly using `::slotted(selector)` without relying on light-tree CSS bleed?
- [ ] **`:host([hidden])` Handling:** Does CSS specify `:host([hidden]) { display: none !important; }` so host-level `hidden` attributes hide the custom element completely?

---

## 4. Lifecycle & Memory Leak Prevention

- [ ] **Atomic Teardown with AbortController:** Are window, document, or global event listeners attached in `connectedCallback()` using an `AbortController` signal?
- [ ] **Disconnected Teardown Execution:** Does `disconnectedCallback()` invoke `controller.abort()` or explicitly clean up event listeners, timers (`clearInterval`, `clearTimeout`), and external observers (`ResizeObserver`, `MutationObserver`)?
- [ ] **Detached DOM Verification:** Has a Heap Snapshot memory test confirmed that unmounting the component leaves zero detached DOM retainers or un-garbage-collected listeners?

---

## 5. Event Propagation & Interoperability

- [ ] **Composed Custom Events:** Are component output events dispatched via `new CustomEvent('event-name', { detail, bubbles: true, composed: true })` so host page scripts can listen for them across Shadow DOM boundaries?
- [ ] **Event Detail Payload:** Is event metadata passed cleanly inside the `detail` object property?
- [ ] **Prevent Internal Event Leakage:** Are internal shadow DOM implementation events (e.g., sub-element clicks) kept non-composed (`composed: false`) unless explicitly required by host API contracts?

---

## 6. Accessibility & ARIA Boundaries

- [ ] **Keyboard Navigability:** Are all interactive shadow DOM controls focusable via `Tab` key with clear `:focus-visible` ring indicators?
- [ ] **ARIA Roles & States:** Do component containers specify appropriate ARIA roles (`tab`, `dialog`, `button`, `switch`) and reactive state attributes (`aria-selected`, `aria-expanded`, `aria-checked`)?
- [ ] **Cross-Boundary ARIA Isolation Guard:** Are `aria-labelledby`, `aria-describedby`, and `aria-controls` references checked to ensure they do NOT target element IDs across shadow root boundaries?
- [ ] **Form Participation (`ElementInternals`):** If acting as a form control, does the class specify `static formAssociated = true`, instantiate `this.attachInternals()`, and update `setFormValue()` on value mutation?
