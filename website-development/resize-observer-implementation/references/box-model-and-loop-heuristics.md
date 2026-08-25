# Technical Reference: ResizeObserver Spec Mechanics & Box Model Heuristics

This reference details the internal mechanics of the W3C `ResizeObserver` specification, box-model size resolution, device pixel rendering, frame-batching algorithms, and browser loop limit heuristics.

---

## 1. W3C ResizeObserver Notification Lifecycle

The browser's rendering engine processes `ResizeObserver` notifications as part of its document lifecycle loop, occurring **after layout calculation but before paint**:

1. **Recalculate Style & Layout:** The engine computes element geometry.
2. **Gather Active Resize Observations:** The engine evaluates observed elements whose box dimensions changed since the last observation cycle.
3. **Depth Check & Loop Detection:** For each active target, the engine compares the depth of the target DOM node against the deepest target delivered in the current microtask turn:
   - If `target.depth > currentDepth`, notification is delivered.
   - If `target.depth <= currentDepth` and the callback mutates layout, the engine marks the notification as delayed to the next frame turn.
   - If notifications recur at depth $\le$ `currentDepth` repeatedly, the browser aborts delivery for the current frame and emits: `ResizeObserver loop completed with undelivered notifications`.
4. **Callback Execution:** Active observation callbacks run.
5. **Paint:** Document updates are rendered to the screen.

---

## 2. Box Model Target Resolution (`ResizeObserverSize`)

The W3C spec supplies dimensions as an **Array of `ResizeObserverSize` objects** on the `ResizeObserverEntry`:

```typescript
interface ResizeObserverSize {
  readonly inlineSize: number; // Width in horizontal writing-mode
  readonly blockSize: number;  // Height in horizontal writing-mode
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly; // Deprecated legacy fallback
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
}
```

### Box Model Differences

| Box Model Target | Included Geometry | Primary Application |
| :--- | :--- | :--- |
| **`content-box`** | Inner content area (excludes padding, border, margin). | Dynamic text flow, inner child container layout. |
| **`border-box`** | Total visible box size (includes content + padding + border). | UI component cards, widgets, split panes, grid items. |
| **`device-pixel-content-box`** | Physical display hardware pixels (content area $\times$ DPR). | `<canvas>`, WebGL buffers, sub-pixel graphics. |

> **Fragmented Layout Note:** For inline elements fragmented across multiple columns or pages, `borderBoxSize` and `contentBoxSize` arrays contain one `ResizeObserverSize` entry per fragment box. For standard block elements, read index `[0]`.

---

## 3. Physical Device Pixel Alignment for Canvas

Drawing on HTML5 `<canvas>` elements requires matching the canvas backing store resolution (`canvas.width`, `canvas.height`) to the physical screen hardware pixels. Using CSS logical pixels causes interpolation blur on High-DPI (Retina) screens.

### Hardware Pixel Calculation Formula

$$\text{Backing Store Pixels} = \text{Math.round}(\text{Logical CSS Pixels} \times \text{window.devicePixelRatio})$$

Using `devicePixelContentBoxSize` provides the exact physical device pixel integer directly from the browser's compositor thread, bypassing floating-point rounding errors and multi-monitor fractional scale mismatch.

```javascript
// High-precision backing store assignment
const dprWidth = entry.devicePixelContentBoxSize?.[0]?.inlineSize
  ?? Math.round(entry.contentRect.width * (window.devicePixelRatio || 1));

const dprHeight = entry.devicePixelContentBoxSize?.[0]?.blockSize
  ?? Math.round(entry.contentRect.height * (window.devicePixelRatio || 1));

if (canvas.width !== dprWidth || canvas.height !== dprHeight) {
  canvas.width = dprWidth;
  canvas.height = dprHeight;
  // Redraw graphics at physical resolution
}
```

---

## 4. `requestAnimationFrame` Frame Batching Architecture

To guarantee zero loop-limit errors and prevent forced layout recalculation thrashing, decouple observation measurement from DOM write mutations:

```
[ ResizeObserver Event ]
        │
        ▼ (Queue latest entries into Map)
   pendingEntries.set(target, entry)
        │
        ▼ (Schedule single rAF if not active)
   requestAnimationFrame(flush)
        │
   ═════╪═══════════════════════════════════ [ Frame Boundary Transition ]
        │
        ▼ (Batch Execution Phase)
   For each [target, entry] in pendingEntries:
       1. Read entry dimensions
       2. Perform state updates / CSS class toggles
       3. Clear pendingEntries Map
```

This ensures that all DOM read tasks execute together before DOM write tasks, respecting the browser's render pipeline and eliminating layout thrashing.
