# Forced Layout Triggers & Rendering Pipeline Reference

This reference documents the browser's rendering pipeline mechanics and lists DOM properties and methods that force synchronous layout recalculations (reflows) when accessed while style trees are invalidated ("dirty").

---

## 1. The Critical Rendering Path Lifecycle

When the browser renders a frame, it executes operations in a strict sequential pipeline:

1. **JavaScript / Events:** JS handles user input, updates state, or mutates DOM/styles.
2. **Style Recalculation:** Calculates which CSS rules apply to which elements based on matching selectors.
3. **Layout (Reflow):** Computes geometric boundaries (width, height, top, left positions) for all visible elements.
4. **Paint:** Fills in pixels (text, colors, borders, shadows, images) into bitmap layers.
5. **Composite:** Sends draw layers to the GPU compositor thread to render on screen.

### Forced Synchronous Layout Mechanics

Normally, when JS modifies styles (`element.style.width = '100px'`), the browser marks the layout tree as **dirty** and defers the actual Layout step until the end of the current frame script execution.

However, if JS immediately requests geometric information (`element.offsetWidth`) while the layout tree is dirty, the browser **MUST** synchronously pause script execution, run Style Recalculation, and compute Layout immediately to return an accurate pixel value.

If this happens repeatedly inside a loop or event handler, it creates **Layout Thrashing** (N style recalcs and N reflows per frame).

---

## 2. Comprehensive List of Layout-Triggering Properties & Methods

Accessing any of the following properties or calling any of the following methods when styles are dirty forces a synchronous layout pass:

### Box Model & Dimension Properties
- `element.clientHeight`, `element.clientWidth`, `element.clientTop`, `element.clientLeft`
- `element.offsetHeight`, `element.offsetWidth`, `element.offsetTop`, `element.offsetLeft`
- `element.scrollHeight`, `element.scrollWidth`, `element.scrollTop`, `element.scrollLeft`
- `element.offsetParent`

### Bounding Rect & Geometry Methods
- `element.getBoundingClientRect()`
- `element.getClientRects()`
- `element.getBoxQuads()`

### Computed Style & Range APIs
- `window.getComputedStyle(element)`
- `document.width`, `document.height`
- `Range.getBoundingClientRect()`, `Range.getClientRects()`

### Window & Viewport Properties
- `window.innerWidth`, `window.innerHeight`
- `window.scrollX`, `window.scrollY`
- `window.outerWidth`, `window.outerHeight`

### Focus & Input Methods
- `element.focus()` (Forces layout when changing focus to an element that requires scroll alignment)
- `element.scrollIntoView()`, `element.scrollIntoViewIfNeeded()`

### SVG Geometry Methods
- `SVGLocatable.getBBox()`
- `SVGElement.getComputedTextLength()`

---

## 3. High-Performance Alternatives

| Anti-Pattern (Layout Trigger) | High-Performance Alternative | Pipeline Benefit |
| :--- | :--- | :--- |
| `element.style.top = `${y}px`` | `element.style.transform = `translate3d(0, ${y}px, 0)`` | Runs on Compositor thread; bypasses Layout & Paint |
| `element.style.width = `${w}px`` | `element.style.transform = `scaleX(${scale})`` | Compositor-only transformation |
| `element.offsetHeight` in loop | Two-pass batching (Read array then Write loop) | Single Layout pass at frame end |
| `scroll` handler `getBoundingClientRect()` | `IntersectionObserver` or `ResizeObserver` | Asynchronous, off-main-thread threshold notifications |
