---
name: accessible-split-pane-implementation
description:
  Implement and audit resizable side-by-side or stacked content panes separated by a draggable splitter, supporting touch drag gestures, fluid mouse controls, and WAI-ARIA separator keyboard accessibility.
---

# Accessible Split Pane Implementation

## Purpose

The Accessible Split Pane Implementation skill provides a technical framework for building and auditing multi-pane resizable layouts (commonly called "split panes" or "splitters"). Users often need to resize adjacent dashboard widgets, document previews, or sidebar panels. To remain accessible to keyboard and screen reader users under WCAG standards, resizable splitters must use the `separator` role, be keyboard focusable, and communicate their values (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`). This skill details how to manage mouse, touch, and keyboard-driven layout adjustments seamlessly without sacrificing responsive sizing, DOM focus order, or rendering performance.

## Use Cases

- **Dashboard Layouts:** Resizable sidebar filters alongside a primary data visualization grid.
- **Side-by-Side Previews:** Interactive code playgrounds, markdown editors, or email clients showing an inbox pane next to a message body view.
- **Compare Views:** Double-pane comparison interfaces where users drag to reveal before/after media states.
- **Workspace Partitioning:** Administrative dashboards and multi-column file explorers where users customize workspace allocation.

## When NOT to Use

- **Static Multi-column Layouts:** If columns do not require user-controlled resizing, use standard CSS Flexbox, Grid, or container query breakpoints.
- **Image Comparison Sliders:** For purely visual "before/after" image reveal slides, use a specialized image comparison slider pattern that focuses on media masks rather than focusable panel layout adjustments.
- **Content Accordions:** If panels stack vertically and only toggle open/close rather than slide freely, use the Accordion pattern (`role="button"` and `aria-expanded`).
- **Standard Tabs:** If only one panel is visible at a time, use the Tabs pattern (`role="tab"`, `role="tabpanel"`).

## Inputs

1. **Orientation:** Resizing direction, either horizontal (resizing left-to-right panes) or vertical (resizing top-to-bottom panes).
2. **Dimension Constraints:** Minimum and maximum dimensions (in percentage, pixels, or flex-basis ratios) for each adjacent panel to prevent collapsing critical content out of view.
3. **Panel Content:** The HTML markup for the left/top panel (Pane A), right/bottom panel (Pane B), and the interactive splitter bar.
4. **Initial State:** The default size distribution (e.g., `50% / 50%` or `250px / calc(100% - 250px)`).

## Outputs

1. **Semantic DOM Layout:** HTML structures identifying the splitter using `role="separator"` paired with state indicators (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`).
2. **Universal Event Handlers:** JavaScript managing PointerEvents (for integrated mouse, pen, and touch-drag support) and keyboard event listeners for layout recalculations.
3. **Robust Visual Styling (CSS):** Dynamic CSS layout rules (typically utilizing Flexbox flex-basis or CSS grid columns) responding directly to splitter updates, styled focus states, and pointer cursor states.
4. **State Persistence (Optional):** Integration strategies for persisting panel dimensions across browser reloads via `localStorage` or URL query parameters.

## Workflow

### 1. Structure the HTML Semantically

A compliant split pane consists of at least two content panes and an interactive splitter bar between them. The splitter must act as the focusable control for resizing.

```html
<div class="split-pane-container" id="my-split-layout">
  <!-- Pane A: Left or Top Content -->
  <div class="split-pane split-pane-first" id="pane-first">
    <h2>Files</h2>
    <!-- Focusable inner content -->
    <a href="#link1">Project Settings</a>
  </div>

  <!-- The Interactive Splitter Bar -->
  <div class="split-pane-splitter"
       role="separator"
       tabindex="0"
       id="split-handle"
       aria-label="Layout resize handle"
       aria-controls="pane-first"
       aria-orientation="vertical"
       aria-valuenow="30"
       aria-valuemin="10"
       aria-valuemax="80">
    <div class="splitter-knob" aria-hidden="true"></div>
  </div>

  <!-- Pane B: Right or Bottom Content -->
  <div class="split-pane split-pane-second" id="pane-second">
    <h2>Document Editor</h2>
    <textarea aria-label="Editor content">Type here...</textarea>
  </div>
</div>
```

*Note on ARIA attributes:*
- `role="separator"`: Informs assistive technologies that this element separates content.
- `aria-orientation`: Explicitly defined as `"vertical"` (if dividing left/right columns) or `"horizontal"` (if dividing top/bottom rows). **Caution:** In ARIA terms, a vertical separator moves horizontally (left/right) because the separator line itself is vertical.
- `aria-controls`: Associates the splitter directly with the primary resizable container (Pane A).
- `aria-valuenow`: Expresses the current size ratio (usually percentage-based from `0` to `100`).
- `aria-valuemin` & `aria-valuemax`: Set the safe boundary ranges to prevent squishing layout panels into unusable dimensions.

---

### 2. Style Resiliently with Flexbox and CSS Variables

To achieve highly performant dragging without style recalculation bottlenecks (reflow/layout thrashing), utilize Flexbox alongside CSS Custom Properties to bind JS computations directly to the layout structure.

```css
.split-pane-container {
  display: flex;
  width: 100%;
  height: 600px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  --splitter-width: 8px;
  --first-panel-size: 30%; /* Configured dynamically by JS */
}

/* Vertical Splitter layout (columns) */
.split-pane-container.is-vertical {
  flex-direction: row;
}

/* Horizontal Splitter layout (rows) */
.split-pane-container.is-horizontal {
  flex-direction: column;
}

.split-pane {
  overflow: auto;
}

.split-pane-first {
  /* Set size based on the custom property */
  flex: 0 0 var(--first-panel-size);
}

.split-pane-second {
  /* Let Pane B absorb all remaining space fluidly */
  flex: 1 1 0%;
}

/* Interactive Splitter Styling */
.split-pane-splitter {
  flex: 0 0 var(--splitter-width);
  background-color: #e2e8f0;
  position: relative;
  transition: background-color 0.15s ease;
  user-select: none;
  -webkit-user-select: none;
  outline: none;
}

/* Switch mouse cursor based on orientation */
.is-vertical > .split-pane-splitter {
  cursor: col-resize;
  width: var(--splitter-width);
}

.is-horizontal > .split-pane-splitter {
  cursor: row-resize;
  height: var(--splitter-width);
}

/* Hover and Active styling */
.split-pane-splitter:hover,
.split-pane-splitter.is-dragging {
  background-color: #3b82f6;
}

/* Visual Grip Handle inside the splitter */
.splitter-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #94a3b8;
  border-radius: 4px;
}

.is-vertical .splitter-knob {
  width: 4px;
  height: 24px;
}

.is-horizontal .splitter-knob {
  width: 24px;
  height: 4px;
}

/* Highly visible Focus Indicator conforming to WCAG AA */
.split-pane-splitter:focus-visible {
  box-shadow: 0 0 0 3px #3b82f6, 0 0 0 5px rgba(59, 130, 246, 0.4);
  background-color: #2563eb;
  z-index: 10;
}
```

---

### 3. Implement Multi-Device Dragging with PointerEvents

Relying on mouse events (`mousedown`, `mousemove`) breaks touch layouts on mobile devices. Standardizing on **PointerEvents** allows a single event stream to gracefully handle mice, tracks, stylus inputs, and touchscreens.

Use `setPointerCapture` to bind pointer updates directly to the splitter element, preventing cursor separation issues during high-speed drags.

```javascript
class SplitPane {
  constructor(containerElement) {
    this.container = containerElement;
    this.splitter = this.container.querySelector('[role="separator"]');
    this.isVertical = this.container.classList.contains('is-vertical');

    // Bounds extracted from ARIA structure
    this.minPercent = parseFloat(this.splitter.getAttribute('aria-valuemin')) || 10;
    this.maxPercent = parseFloat(this.splitter.getAttribute('aria-valuemax')) || 90;
    this.currentPercent = parseFloat(this.splitter.getAttribute('aria-valuenow')) || 50;

    this.isDragging = false;
    this.init();
  }

  init() {
    // Bind Pointer Events
    this.splitter.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.splitter.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.splitter.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.splitter.addEventListener('pointercancel', this.onPointerUp.bind(this));

    // Bind Keyboard Events
    this.splitter.addEventListener('keydown', this.onKeyDown.bind(this));

    // Set Initial Position
    this.updateLayout(this.currentPercent);
  }

  onPointerDown(e) {
    // Only drag with left mouse button / primary touch point
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    this.isDragging = true;
    this.splitter.classList.add('is-dragging');

    // Capture pointer events to this element even if pointer drifts outside splitter bounds
    this.splitter.setPointerCapture(e.pointerId);

    // Set layout class to prevent selecting text during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = this.isVertical ? 'col-resize' : 'row-resize';

    e.preventDefault();
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    const containerRect = this.container.getBoundingClientRect();
    let newPercent;

    if (this.isVertical) {
      const offsetX = e.clientX - containerRect.left;
      newPercent = (offsetX / containerRect.width) * 100;
    } else {
      const offsetY = e.clientY - containerRect.top;
      newPercent = (offsetY / containerRect.height) * 100;
    }

    this.updateLayout(newPercent);
  }

  onPointerUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.splitter.classList.remove('is-dragging');
    this.splitter.releasePointerCapture(e.pointerId);

    // Clean up body states
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  updateLayout(percent) {
    // Constrain percentages to limits
    const constrained = Math.max(this.minPercent, Math.min(this.maxPercent, percent));
    this.currentPercent = Math.round(constrained * 10) / 10; // Round to 1 decimal place

    // Apply layout change via CSS custom property
    this.container.style.setProperty('--first-panel-size', `${this.currentPercent}%`);

    // Update accessibility attributes
    this.splitter.setAttribute('aria-valuenow', this.currentPercent);
  }
}
```

---

### 4. Wire Keyboard Resize Interactions

W3C WAI-ARIA requires separators to support precise keyboard resizing when focused:
- `ArrowLeft` / `ArrowUp`: Decrements the size of the first panel (shifts separator left/up).
- `ArrowRight` / `ArrowDown`: Increments the size of the first panel (shifts separator right/down).
- `Home`: Instantly sets size to minimum limit (`aria-valuemin`).
- `End`: Instantly sets size to maximum limit (`aria-valuemax`).
- Optional: `Enter`: Toggles collapse/restore of the panel (toggles between min limit and previous state).

```javascript
  onKeyDown(e) {
    let increment = 2; // Incremental percent change per key stroke
    if (e.shiftKey) increment = 10; // Shift + Arrow speeds up resizing

    let handled = false;
    let nextPercent = this.currentPercent;

    switch (e.key) {
      case 'ArrowLeft':
        if (this.isVertical) {
          nextPercent -= increment;
          handled = true;
        }
        break;
      case 'ArrowUp':
        if (!this.isVertical) {
          nextPercent -= increment;
          handled = true;
        }
        break;
      case 'ArrowRight':
        if (this.isVertical) {
          nextPercent += increment;
          handled = true;
        }
        break;
      case 'ArrowDown':
        if (!this.isVertical) {
          nextPercent += increment;
          handled = true;
        }
        break;
      case 'Home':
        nextPercent = this.minPercent;
        handled = true;
        break;
      case 'End':
        nextPercent = this.maxPercent;
        handled = true;
        break;
      case 'Enter':
        // Collapse toggle behavior
        if (this.currentPercent > this.minPercent) {
          this.previousPercent = this.currentPercent;
          nextPercent = this.minPercent;
        } else {
          nextPercent = this.previousPercent || (this.maxPercent + this.minPercent) / 2;
        }
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      this.updateLayout(nextPercent);
    }
  }
```

## Decision Rules

- **CSS Variable Percent vs. Pixels (`flex-basis` px):**
  - **Use Percentages (`%`):** When building responsive layouts that must shrink or grow proportionally with the viewport size. Best for standard dashboard layouts.
  - **Use Pixels (`px`):** When one panel represents a fixed-width sidebar (e.g., a 250px folder navigation panel) that should retain its exact size regardless of window width, while the secondary panel resizes to fill the viewport remaining area.

- **Standard PointerEvents vs. Drag & Drop API:**
  - Always use **PointerEvents** for splitters. The HTML5 Drag and Drop API is designed for transferring data payloads between source and target elements and displays a rigid ghost image. It is unsuitable for smooth, in-place visual layout resizing.

- **Performance Throttling (JS reflow avoidance):**
  - Use simple direct state assignment via CSS custom properties on the container. This causes a single layout pass on the container parent instead of updating multiple panel elements manually.
  - For complex layouts containing high-cost graphics or canvas frames, throttle the resize handler using `requestAnimationFrame`.

## Constraints

- **Focus Visibility:** Do not use `outline: none` or clear focus indicators. The splitter is an active control and must render an obvious, highly visible keyboard focus ring.
- **Iframe Drag Collision:** If a panel contains an `<iframe>` element (e.g., an interactive playground or rich editor preview), pointer events will get intercepted by the iframe, disrupting drag-handling. To resolve this, apply `pointer-events: none` to all panels or iframes during dragging:
  ```css
  .split-pane-container.is-dragging .split-pane {
    pointer-events: none;
  }
  ```
- **Text Selection:** Standard mouse dragging selects text on the page as the user sweeps across the panels. Apply `user-select: none` to the `body` or container elements only while `is-dragging` is active, and restore it on pointer release.

## Non-Goals

- Implementing nested compound split panes (e.g., splitting vertical pane A into two horizontal panels). This skill covers the baseline mechanics; nesting is achieved by compounding multiple modular SplitPane instances.
- Integrating persistence adapters for global state frameworks (e.g., Redux, Vuex). Handlers should instead expose an optional simple lifecycle callback (e.g., `onResize(percent)`).

## Common Failure Patterns

- **The "Lost Mouse" Bug (No pointer capture):** Relying on simple `mousemove` on the splitter itself. If the user moves the mouse too fast, the cursor slips off the splitter, and the drag stops working. Always use `setPointerCapture(e.pointerId)` on `pointerdown`.
- **Keyboard Exclusion:** Creating resizable layouts that can only be resized via mouse drag, leaving keyboard-only and screen reader users trapped with static, poorly sized panels.
- **Silent ARIA Updates:** Forgetting to update `aria-valuenow` dynamically on splitter movement, preventing screen readers from reading state updates.
- **Mouse-Only Event Listeners:** Listening exclusively to `mousedown` and `mouseup`, which leaves mobile touch screens unable to operate the splitter.
- **Unbounded Collapse:** Allowing users to drag the separator to `0%` or `100%`, completely hiding panels without providing a mechanism to restore them, leading to broken page layouts.

## Validation Steps

- [ ] **Roving Pointer Test:** Drag the splitter rapidly with a mouse and touch input. Confirm that the splitter tracks the pointer smoothly without catching, lagging, or decoupling from the gesture, even when dragging over nested text or elements.
- [ ] **Iframe Test:** Place an `<iframe>` inside Pane B. Drag the splitter toward the iframe. Verify that dragging works consistently and is not blocked/frozen when the cursor crosses into the iframe viewport.
- [ ] **Keyboard Resizing Test:** Press `Tab` to focus the splitter element. Verify that a visible focus indicator appears. Press `ArrowLeft`/`ArrowUp` and `ArrowRight`/`ArrowDown` to adjust panel widths. Verify that `Home` shrinks Pane A to its minimum bounds and `End` expands it to maximum bounds.
- [ ] **Screen Reader Reading Test:** Activate a screen reader (e.g., VoiceOver or NVDA) and focus the splitter. Check that it announces the role ("splitter" or "separator") and reads the initial state percent (e.g., "Layout resize handle, separator, 30%"). Press arrow keys and ensure the screen reader announces the updated value.
- [ ] **Contrast Verification:** Ensure the splitter focus ring and hover states meet the WCAG AA minimum contrast ratio of 3:1 against surrounding panels.
- [ ] **Form Submission Isolation:** Ensure interacting with the focusable separator does not trigger inadvertent actions (such as form submissions or page scrolls). Verify that pressing `Enter` on the separator collapses/restores panels and does not submit forms.
