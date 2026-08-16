---
name: css-anchor-positioning-implementation
description:
  Implement, optimize, and polyfill CSS Anchor Positioning to tether floating UI elements (tooltips, popovers, context menus, dropdowns) to anchor elements in pure CSS without JavaScript scroll/resize event listeners or layout thrashing.
---

# CSS Anchor Positioning Implementation

## Purpose

The CSS Anchor Positioning Implementation skill provides a technical protocol, CSS architecture, fallback mechanism, and auditing process for dynamically tethering floating UI elements (such as tooltips, popovers, dropdown menus, context menus, and hovercards) to visual anchor elements directly in CSS.

Historically, tethering floating elements required JavaScript position calculations (`getBoundingClientRect()`), active event listeners on scroll and resize, or heavy third-party positioning libraries (e.g., Floating UI or Popper.js). These JavaScript approaches cause main-thread layout thrashing, scroll lag, and synchronization delay during fast viewport scrolling. CSS Anchor Positioning delegates layout, clipping, and overflow-driven position fallbacks directly to the browser rendering engine, operating on the compositor thread for zero-latency positioning.

---

## Use Cases

- **Interactive Tooltips and Action Badges:** Positioning informational callouts or status badges relative to specific inline elements or icons.
- **Dropdown and Combo Box Menus:** Pinning option lists or multi-select dropdown panels directly below or above trigger buttons.
- **Context Menus and Hovercards:** Anchoring user profile preview cards or contextual action menus to user avatars, tables, or text references.
- **Popover API Integration:** Tethering top-layer modal/non-modal popovers (`<div popover>`) to their triggering `<button>` elements without needing parent `position: relative` wrappers or stacking context hacks.
- **Floating Toolbar & Annotation Anchoring:** Tethering rich-text formatting bars or collaborative comments to text selections or inline elements.

---

## When NOT to Use

- **Global Viewport-Centered Modals:** Standard modal dialogs that are visually fixed to the center of the viewport (e.g., `<dialog modal>`) should use fixed positioning (`position: fixed; inset: 0; margin: auto;`), not element-relative anchoring.
- **Off-Canvas Drawers & Bottom Sheets:** Sliding side drawers or mobile bottom sheets (see `accessible-bottom-sheet-implementation`) anchor to viewport edges, not target inline nodes.
- **Simple Flow-Based Tooltips (Static Hover):** Simple text tooltips that can be positioned with standard CSS flex/grid or static flex containers without risk of clipping or viewport overflow.
- **Legacy Browser Requirements Without Polyfill Strategy:** If a project strictly requires native support in legacy browsers (e.g., Safari < 17.4, Firefox < 129, Chrome < 125) and prohibits client-side JavaScript polyfills, fallback to standard CSS positioning or JS positioning engines.

---

## Inputs

1. **Anchor Element:** The DOM element act as the reference point (e.g., `<button id="menu-trigger">`).
2. **Target Floating Element:** The element to tether (e.g., `<ul id="menu-list" popover>`).
3. **Preferred Placement:** Primary desired position relative to the anchor (e.g., `bottom right`, `top center`, `right start`).
4. **Fallback Chain (`@position-try`):** Secondary and tertiary placement options when the primary placement overflows the visual viewport.
5. **Polyfill / Fallback Strategy:** Design decision for non-supporting browsers (e.g., Popover API Polyfill / `@oddbird/css-anchor-positioning` or CSS `@supports` inline-block fallback).

---

## Outputs

1. **Anchor CSS Declaration:** Semantic declaration linking the anchor (`anchor-name: --my-anchor;`) and target (`position-anchor: --my-anchor;` or `anchor()`).
2. **Declarative Layout Alignment:** Use of modern alignment properties (`position-area` / `inset-area` or explicit `top: anchor(--my-anchor bottom)`) for explicit attachment.
3. **Viewport Collision Fallback System:** `@position-try` custom rulesets and `position-try-fallbacks` chains to dynamically flip or slide floating elements when near viewport boundaries.
4. **Top-Layer and Stacking Context Isolation:** Integration with native Popover API or `position: fixed` top-layer management to eliminate `overflow: hidden` clipping bugs.
5. **Progressive Enhancement / Polyfill Integration:** Polyfill configuration or robust `@supports (anchor-name: --test)` fallback styles.

---

## Workflow

### 1. Identify Anchor and Target Roles

Establish the relationship between the trigger/anchor and the positioned UI element.

```html
<!-- Anchor Trigger Element -->
<button id="trigger-btn" class="anchor-trigger" popovertarget="action-popover">
  Options
</button>

<!-- Target Floating Element (Using Top-Layer Popover) -->
<div id="action-popover" class="anchored-popover" popover>
  <nav class="menu-list">
    <a href="#edit">Edit</a>
    <a href="#duplicate">Duplicate</a>
    <button type="button" class="danger">Delete</button>
  </nav>
</div>
```

---

### 2. Declare Anchor Name and Position Coupling

Bind the anchor element using `anchor-name` with a dashed custom-ident (e.g., `--trigger-anchor`).

```css
/* 1. Define the anchor reference name */
.anchor-trigger {
  anchor-name: --trigger-anchor;
}

/* 2. Style the anchored element */
.anchored-popover {
  /* Position must be absolute or fixed (fixed recommended for top-layer) */
  position: fixed;
  position-anchor: --trigger-anchor;

  /* Modern shorthand: position-area (formerly inset-area) */
  /* Places element directly below anchor, aligned to the left edge */
  position-area: bottom span-right;

  /* Add margin gap between anchor and floating element */
  margin-top: 8px;
}
```

---

### 3. Implement Fine-Grained `anchor()` Functions (Alternative to `position-area`)

When custom offsets, complex sizing (`anchor-size()`), or explicit edge binding are required instead of predefined grid areas:

```css
.anchored-popover-custom {
  position: fixed;

  /* Bind explicit top to anchor's bottom edge */
  top: anchor(--trigger-anchor bottom);

  /* Align left edge with anchor's left edge */
  left: anchor(--trigger-anchor left);

  /* Set width dynamically relative to anchor's width */
  width: anchor-size(--trigger-anchor width);
  min-width: 200px;

  margin-top: 6px;
}
```

---

### 4. Configure Visual Viewport Boundary Handling (`@position-try`)

Prevent floating elements from rendering off-screen when scrolled near viewport edges by defining adaptive fallback placements.

```css
/* Define custom position try options */
@position-try --try-top {
  position-area: top span-right;
  margin-top: 0;
  margin-bottom: 8px;
}

@position-try --try-bottom-left {
  position-area: bottom span-left;
}

@position-try --try-top-left {
  position-area: top span-left;
  margin-top: 0;
  margin-bottom: 8px;
}

.anchored-popover {
  anchor-name: --trigger-anchor;
  position: fixed;
  position-anchor: --trigger-anchor;

  /* Default preferred placement */
  position-area: bottom span-right;
  margin-top: 8px;

  /* Automatic overflow handling using predefined keywords or custom rules */
  position-try-fallbacks: flip-block, --try-top, --try-bottom-left, --try-top-left;
}
```

---

### 5. Add Implicit Anchoring with Popover API

When using HTML native Popover API (`popovertarget`), modern engines support **implicit anchoring** where the target automatically infers its anchor trigger without explicit CSS `anchor-name` declarations.

```html
<button id="nav-btn" popovertarget="nav-menu">Menu</button>

<div id="nav-menu" popover class="implicit-anchored-menu">
  <ul>
    <li><a href="/profile">Profile</a></li>
    <li><a href="/settings">Settings</a></li>
  </ul>
</div>
```

```css
.implicit-anchored-menu {
  position: fixed;
  /* Uses implicit anchor trigger established by popovertarget */
  position-area: bottom span-right;
  margin-top: 4px;
}
```

---

### 6. Provide Polyfill & Progressive Enhancement Fallbacks

Ensure robust cross-browser degradation using CSS `@supports` queries and optional lightweight JS polyfill loading.

```css
/* Baseline / Legacy Fallback Style */
.anchored-popover {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
}

/* Native CSS Anchor Positioning Support */
@supports (anchor-name: --test) {
  .anchor-trigger {
    anchor-name: --trigger-anchor;
  }

  .anchored-popover {
    position: fixed;
    position-anchor: --trigger-anchor;
    position-area: bottom span-right;
    top: auto;
    left: auto;
  }
}
```

---

## Decision Rules

### Anchor Positioning Technique Selection

| Requirements | Recommended Syntax | Advantages |
| :--- | :--- | :--- |
| Standard 9-region placement (Top, Bottom, Left, Right, Corners) | `position-area: <region>` | Cleanest syntax, zero manual calculation, automatic grid mapping. |
| Dynamic width/height matching trigger element | `width: anchor-size(width)` | Seamless search dropdowns & custom combobox matching trigger width. |
| Custom positioning math (e.g., offset by 15px or centered math) | `top: calc(anchor(bottom) + 12px)` | Full mathematical flexibility with CSS `calc()`. |
| Automatic vertical/horizontal flipping on scroll | `position-try-fallbacks: flip-block, flip-inline` | Declarative viewport boundary protection handled on compositor thread. |
| Scoped dynamic list items (e.g., multi-row table hovercards) | `anchor-name: --item-anchor` + Inline CSS variable ID | Scopes anchor names dynamically across dynamic DOM lists. |

---

## Constraints

- **Positioning Rule:** Anchored elements MUST have `position: absolute` or `position: fixed`. Floating elements with `position: static` or `relative` cannot use anchor functions.
- **Top-Layer Superiority:** Always combine Anchor Positioning with the native Popover API (`popover`) or `<dialog>` when positioning menus/tooltips over container elements with `overflow: hidden`, `overflow: auto`, or non-standard `z-index` stacking contexts.
- **Dashed Ident Syntax:** `anchor-name` identifiers MUST start with double dashes (e.g., `--my-anchor`), identical to CSS Custom Property syntax.
- **Syntactic Evolution:** The CSS specification updated `inset-area` to `position-area`. Modern implementations MUST use `position-area` while maintaining backwards compatibility or polyfill aliasing for legacy Chrome releases (versions 125-128).
- **Accessibility Requirements:** CSS positioning DOES NOT alter DOM tree order or accessibility trees. Ensure keyboard focus management (Tab / Arrow keys) and ARIA relationships (`aria-expanded`, `aria-controls`, `aria-describedby`) remain correctly structured in HTML.

---

## Non-Goals

- Replacing framework state engines (React, Vue, Svelte) for conditional rendering of UI elements.
- Re-architecting accessible keyboard navigation or focus trapping inside popovers (see `accessible-tooltip-implementation` and `accessible-modal-dialog`).
- Implementing complex drag-and-drop spatial grid engines.

---

## Common Failure Patterns

- **Clipping Parent (`overflow: hidden`):** Placing an anchored element with `position: absolute` inside a parent container with `overflow: hidden`. The floating element gets clipped. *Fix:* Use `position: fixed` and/or top-layer Popover API (`popover`).
- **Missing Double Dash Ident:** Declaring `anchor-name: my-anchor;` without `--`. The browser rejects the property as invalid syntax.
- **Incorrect Spec Property Name (`inset-area` vs `position-area`):** Using deprecated `inset-area` without `position-area` support, leading to failed rules in modern browsers.
- **Implicit Anchor Breakdown:** Relying on implicit popover anchoring when `<button>` and `popover` are in detached DOM subtrees or lack standard `popovertarget` linkage.
- **Viewport Lock Without `@position-try`:** Hardcoding `top: anchor(bottom)` without defining `@position-try` fallbacks, causing dropdown menus at the bottom of the page to render below the fold off-screen.
- **Layout Thrashing in Polyfills:** Loading unoptimized polyfills that attach naive `scroll` event listeners without `requestAnimationFrame` debouncing on non-supporting browsers.

---

## Validation Steps

- [ ] **Native Syntax Validation:** Verify `anchor-name: --custom-ident` and `position-anchor: --custom-ident` or `position-area` parse cleanly in CSS devtools without warnings.
- [ ] **Viewport Boundary Test:** Scroll the page so the anchor element reaches the screen bottom/top. Confirm that `position-try-fallbacks` dynamically flips or reposition the element inside the visible viewport.
- [ ] **Top-Layer Stacking Context Audit:** Place the anchor inside an overflow-scroll container (`overflow: auto`) with `z-index: 1`. Open the floating element and verify it renders completely un-clipped above all surrounding layout bounds.
- [ ] **Dimension Sync Verification:** On combobox/select inputs using `anchor-size(width)`, resize the browser window and confirm the target panel matches the trigger width in real time.
- [ ] **Keyboard Accessibility Audit:** Ensure tabbing into and out of the anchored popover follows visual and logical expectation (`aria-haspopup`, `aria-controls`, `aria-expanded`).
- [ ] **Cross-Browser Degradation Test:** Test the layout in browsers without native Anchor Positioning (or disable flag). Verify that progressive fallback styles or JS polyfills maintain usable positioning without breaking page flow.
