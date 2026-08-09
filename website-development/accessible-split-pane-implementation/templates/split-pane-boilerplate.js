/**
 * AccessibleSplitter - A modular vanilla JavaScript controller for resizable layouts.
 * Conforms fully to W3C WAI-ARIA separator patterns for keyboard & touch accessibility.
 */
export class AccessibleSplitter {
  /**
   * @param {Object} options Configuration parameters.
   * @param {HTMLElement} options.container - The parent element enclosing the panes and splitter.
   * @param {HTMLElement} options.splitter - The interactive bar element with role="separator".
   * @param {string} options.orientation - 'vertical' (for columns moving left-to-right) or 'horizontal' (for rows moving top-to-bottom).
   * @param {string} options.cssVariable - The name of the CSS Custom Property on the container controlling pane dimensions (e.g. '--sidebar-width').
   * @param {function} [options.onResize] - Optional callback triggered on splitter adjustments with the current percentage value.
   */
  constructor({ container, splitter, orientation = 'vertical', cssVariable, onResize = null }) {
    if (!container || !splitter) {
      throw new Error('AccessibleSplitter requires both container and splitter HTMLElements.');
    }

    this.container = container;
    this.splitter = splitter;
    this.orientation = orientation;
    this.cssVar = cssVariable || (orientation === 'vertical' ? '--split-width' : '--split-height');
    this.onResizeCallback = onResize;

    // Bounds configured via semantic ARIA parameters
    this.minVal = parseFloat(this.splitter.getAttribute('aria-valuemin')) || 10;
    this.maxVal = parseFloat(this.splitter.getAttribute('aria-valuemax')) || 90;
    this.currentVal = parseFloat(this.splitter.getAttribute('aria-valuenow')) || 50;

    this.isDragging = false;
    this.previousVal = this.currentVal; // Track for expand/collapse toggle
    this.animationFrameId = null;

    // Bound listeners for proper event attachment/removal
    this.pointerDownHandler = this.onPointerDown.bind(this);
    this.pointerMoveHandler = this.onPointerMove.bind(this);
    this.pointerUpHandler = this.onPointerUp.bind(this);
    this.keyDownHandler = this.onKeyDown.bind(this);

    this.init();
  }

  init() {
    // 1. Confirm basic ARIA role setups
    this.splitter.setAttribute('role', 'separator');
    this.splitter.setAttribute('tabindex', '0');
    this.splitter.setAttribute('aria-orientation', this.orientation);

    // 2. Attach PointerEvent listeners (handles Mouse, Pen, and Touch screens uniformly)
    this.splitter.addEventListener('pointerdown', this.pointerDownHandler);
    this.splitter.addEventListener('pointermove', this.pointerMoveHandler);
    this.splitter.addEventListener('pointerup', this.pointerUpHandler);
    this.splitter.addEventListener('pointercancel', this.pointerUpHandler);

    // 3. Attach Keyboard navigation listeners
    this.splitter.addEventListener('keydown', this.keyDownHandler);

    // 4. Position layout initially
    this.updateSize(this.currentVal, false);
  }

  onPointerDown(e) {
    // Only drag with left mouse click or primary touch contact point
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    this.isDragging = true;
    this.splitter.classList.add('is-dragging');
    this.container.classList.add('is-dragging-layout');

    // Prevent cursor slippage by locking pointer interactions directly to the splitter
    this.splitter.setPointerCapture(e.pointerId);

    // Temporary layout styles to enhance dragging responsiveness
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.cursor = this.orientation === 'vertical' ? 'col-resize' : 'row-resize';

    e.preventDefault();
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    // Throttled frame loop to prevent layout reflow bottlenecks
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      const rect = this.container.getBoundingClientRect();
      let percentage;

      if (this.orientation === 'vertical') {
        const deltaX = e.clientX - rect.left;
        percentage = (deltaX / rect.width) * 100;
      } else {
        const deltaY = e.clientY - rect.top;
        percentage = (deltaY / rect.height) * 100;
      }

      this.updateSize(percentage);
    });
  }

  onPointerUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.splitter.classList.remove('is-dragging');
    this.container.classList.remove('is-dragging-layout');

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clean up temporary capture overrides
    this.splitter.releasePointerCapture(e.pointerId);
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.cursor = '';
  }

  onKeyDown(e) {
    let step = e.shiftKey ? 10 : 2; // Shift + Arrow keys accelerates adjustments
    let handled = false;
    let nextValue = this.currentVal;

    switch (e.key) {
      case 'ArrowLeft':
        if (this.orientation === 'vertical') {
          nextValue -= step;
          handled = true;
        }
        break;
      case 'ArrowUp':
        if (this.orientation === 'horizontal') {
          nextValue -= step;
          handled = true;
        }
        break;
      case 'ArrowRight':
        if (this.orientation === 'vertical') {
          nextValue += step;
          handled = true;
        }
        break;
      case 'ArrowDown':
        if (this.orientation === 'horizontal') {
          nextValue += step;
          handled = true;
        }
        break;
      case 'Home':
        nextValue = this.minVal;
        handled = true;
        break;
      case 'End':
        nextValue = this.maxVal;
        handled = true;
        break;
      case 'Enter':
        this.toggleCollapse();
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      this.updateSize(nextValue);
    }
  }

  /**
   * Double-clicking or Enter-key toggles collapsing a pane to its min limit.
   */
  toggleCollapse() {
    if (this.currentVal > this.minVal) {
      this.previousVal = this.currentVal;
      this.updateSize(this.minVal);
    } else {
      const targetRestore = this.previousVal || (this.maxVal + this.minVal) / 2;
      this.updateSize(targetRestore);
    }
  }

  /**
   * Sets the splitter size and propagates layout coordinates.
   * @param {number} rawPercent - Target width/height percent coordinates.
   * @param {boolean} triggerCallback - Whether to trigger onResize event.
   */
  updateSize(rawPercent, triggerCallback = true) {
    const clamped = Math.max(this.minVal, Math.min(this.maxVal, rawPercent));
    this.currentVal = Math.round(clamped * 10) / 10; // Precision rounding

    // 1. Update Layout via the CSS Custom Property on the parent
    this.container.style.setProperty(this.cssVar, `${this.currentVal}%`);

    // 2. Refresh Screen Reader attributes
    this.splitter.setAttribute('aria-valuenow', this.currentVal);

    // 3. Fire layout resizing callbacks
    if (triggerCallback && typeof this.onResizeCallback === 'function') {
      this.onResizeCallback(this.currentVal);
    }
  }

  /**
   * Clean up event bindings to prevent memory leaks in single-page applications.
   */
  destroy() {
    this.splitter.removeEventListener('pointerdown', this.pointerDownHandler);
    this.splitter.removeEventListener('pointermove', this.pointerMoveHandler);
    this.splitter.removeEventListener('pointerup', this.pointerUpHandler);
    this.splitter.removeEventListener('pointercancel', this.pointerUpHandler);
    this.splitter.removeEventListener('keydown', this.keyDownHandler);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
