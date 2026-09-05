/**
 * VisualViewportController
 * Production-grade controller for synchronizing window.visualViewport state
 * with CSS custom variables, layout offsets, and soft keyboard detection.
 */
export class VisualViewportController {
  /**
   * @param {Object} options
   * @param {HTMLElement} [options.target=document.documentElement] Element to set CSS variables on
   * @param {number} [options.keyboardThreshold=100] Min height diff in px to register as open keyboard
   * @param {function} [options.onChange] Callback invoked on viewport changes
   */
  constructor(options = {}) {
    this.target = options.target || document.documentElement;
    this.keyboardThreshold = options.keyboardThreshold || 100;
    this.onChange = options.onChange || null;

    this.controller = new AbortController();
    this.rafId = null;

    this.state = {
      height: 0,
      width: 0,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      keyboardHeight: 0,
      isKeyboardOpen: false,
      isPinchZoomed: false,
    };

    this.init();
  }

  /**
   * Initializes event listeners and performs initial calculation
   */
  init() {
    if (typeof window === 'undefined' || !window.visualViewport) {
      console.warn('[VisualViewportController] Visual Viewport API not supported.');
      return;
    }

    const { signal } = this.controller;

    // Attach listeners to visualViewport object using AbortController signal
    window.visualViewport.addEventListener('resize', () => this.scheduleUpdate(), {
      passive: true,
      signal,
    });
    window.visualViewport.addEventListener('scroll', () => this.scheduleUpdate(), {
      passive: true,
      signal,
    });

    window.addEventListener('orientationchange', () => this.scheduleUpdate(), {
      passive: true,
      signal,
    });

    // Initial measurement
    this.update();
  }

  /**
   * Schedules an update using requestAnimationFrame for 60fps interaction
   */
  scheduleUpdate() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.update();
    });
  }

  /**
   * Reads visual viewport dimensions and writes CSS custom properties
   */
  update() {
    const vv = window.visualViewport;
    if (!vv) return;

    const layoutHeight = window.innerHeight;
    const layoutWidth = window.innerWidth;

    // Compute keyboard height taking offsetTop into account (critical for scrolled pages on iOS)
    const rawKeyboardHeight = layoutHeight - vv.height - vv.offsetTop;
    const keyboardHeight = Math.max(0, rawKeyboardHeight);
    const isKeyboardOpen = keyboardHeight > this.keyboardThreshold;
    const isPinchZoomed = vv.scale > 1.05;

    // Mutate state object
    this.state = {
      height: vv.height,
      width: vv.width,
      offsetTop: vv.offsetTop,
      offsetLeft: vv.offsetLeft,
      scale: vv.scale,
      keyboardHeight,
      isKeyboardOpen,
      isPinchZoomed,
    };

    // Synchronize CSS custom properties
    this.target.style.setProperty('--vv-height', `${vv.height}px`);
    this.target.style.setProperty('--vv-width', `${vv.width}px`);
    this.target.style.setProperty('--vv-offset-top', `${vv.offsetTop}px`);
    this.target.style.setProperty('--vv-offset-left', `${vv.offsetLeft}px`);
    this.target.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
    this.target.style.setProperty('--vv-scale', `${vv.scale}`);

    // Synchronize declarative state attributes
    this.target.setAttribute('data-keyboard-open', isKeyboardOpen ? 'true' : 'false');
    this.target.setAttribute('data-pinch-zoomed', isPinchZoomed ? 'true' : 'false');

    // Notify listener if provided
    if (typeof this.onChange === 'function') {
      this.onChange(this.state);
    }
  }

  /**
   * Returns a snapshot of current viewport state
   * @returns {Object}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Tears down all event listeners and cancels pending animation frames
   */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.controller.abort();

    // Clean up applied inline CSS variables
    this.target.style.removeProperty('--vv-height');
    this.target.style.removeProperty('--vv-width');
    this.target.style.removeProperty('--vv-offset-top');
    this.target.style.removeProperty('--vv-offset-left');
    this.target.style.removeProperty('--keyboard-height');
    this.target.style.removeProperty('--vv-scale');

    this.target.removeAttribute('data-keyboard-open');
    this.target.removeAttribute('data-pinch-zoomed');
  }
}
