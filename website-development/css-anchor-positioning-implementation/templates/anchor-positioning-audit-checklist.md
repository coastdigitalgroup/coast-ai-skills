# CSS Anchor Positioning Audit Checklist

Use this checklist to audit, verify, and remediate CSS Anchor Positioning implementations across modern web applications.

---

## 1. Syntax & Declaration Standards

- [ ] **Custom Ident Formatting:** Are all `anchor-name` definitions formatted with required leading double dashes (e.g., `anchor-name: --menu-anchor;`)?
- [ ] **Positioning Context:** Do all anchored target elements explicitly declare `position: fixed` or `position: absolute`?
- [ ] **Modern Area Shorthand:** Is `position-area` used instead of deprecated `inset-area` properties (or paired appropriately with fallback rules)?
- [ ] **Anchor Connection:** Is the anchored element explicitly connected via `position-anchor: --my-anchor;` or fine-grained `anchor(--my-anchor <edge>)` functions?
- [ ] **Dimensional Binding:** If the floating panel should match the trigger width (e.g., combobox or select dropdowns), is `width: anchor-size(--my-anchor width)` applied?

---

## 2. Top-Layer & Stacking Context Isolation

- [ ] **Container Clipping:** Is the anchored element immune to parent `overflow: hidden` or `overflow: auto` clipping bounds (e.g., using `position: fixed` and/or Popover API `<div popover>`)?
- [ ] **Z-Index Independence:** Does the floating element render above surrounding siblings without triggering z-index escalation wars?
- [ ] **Popover API Integration:** Is non-modal floating content using native HTML `popover` or `<dialog>` top-layer insertion for clean stacking context isolation?

---

## 3. Viewport Boundary & Overflow Protection (`@position-try`)

- [ ] **Position Try Fallbacks:** Is `position-try-fallbacks` defined with `flip-block`, `flip-inline`, or custom `@position-try` rule chains?
- [ ] **Boundary Stress Test:** When the anchor trigger is scrolled to the extreme bottom of the viewport, does the floating panel flip cleanly above the anchor without overflowing off-screen?
- [ ] **Side Margin Buffers:** Are margins (`margin-top`, `margin-bottom`) configured properly inside `@position-try` blocks so flipped elements maintain spacing gaps from the anchor?

---

## 4. Performance & Layout Stability

- [ ] **Compositor Engine Execution:** Is positioning handled entirely in CSS without main-thread `getBoundingClientRect()` or JS `scroll`/`resize` listeners?
- [ ] **Layout Thrashing Elimination:** Are legacy JS positioning libraries disabled or bypassed when native CSS Anchor Positioning support is detected?
- [ ] **Discrete Transitions:** Are entry and exit animations utilizing `@starting-style` and `transition: display 0.2s allow-discrete` to avoid flash-of-unpositioned-content?

---

## 5. Accessibility & Progressive Enhancement

- [ ] **ARIA Relationships:** Are `aria-expanded`, `aria-controls`, and `aria-haspopup` attributes maintained on trigger elements?
- [ ] **DOM Order Logic:** Does the logical DOM tab sequence match user expectations when opening and navigating floating menus or tooltips?
- [ ] **Legacy Degradation:** Is a valid fallback provided via `@supports not (anchor-name: --test)` or an optimized polyfill (e.g., `@oddbird/css-anchor-positioning`) for non-supporting browsers?
