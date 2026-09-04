/**
 * VisualViewportController
 * Production-grade controller for tracking window.visualViewport changes,
 * estimating mobile soft virtual keyboard heights, and binding CSS custom properties.
 */

export class VisualViewportController {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.targetElement=document.documentElement] Element to bind CSS custom properties to.
   * @param {string} [options.prefix='vv'] Prefix for CSS custom property names (e.g. --vv-height).
   * @param {boolean} [options.autoScrollFocus=true] Whether to scroll focused inputs into view on viewport resize.
   * @param {Function} [options.onChange=null] Callback invoked whenever viewport state changes.
   */
  constructor(options = {}) {
    this.target = options.targetElement || document.documentElement;
    this.prefix = options.prefix || 'vv';
    this.autoScrollFocus = options.autoScrollFocus !== false;
    this.onChange = typeof options.onChange === 'function' ? options.onChange : null;

    this.rafId = null;
    this.isSupported = typeof window !== 'undefined' && 'visualViewport' in window;

    this.state = {
      height: 0,
      width: 0,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      keyboardHeight: 0,
      isKeyboardVisible: false,
    };

    this._handleViewportChange = this._handleViewportChange.bind(this);
    this._handleFocusIn = this._handleFocusIn.bind(this);
  }

  /**
   * Start listening to visualViewport and window events.
   */
  connect() {
    if (!this.isSupported) {
      console.warn('[VisualViewportController] window.visualViewport API is not supported in this environment.');
      return;
    }

    const vv = window.visualViewport;
    vv.addEventListener('resize', this._handleViewportChange, { passive: true });
    vv.addEventListener('scroll', this._handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', this._handleViewportChange, { passive: true });

    if (this.autoScrollFocus) {
      window.addEventListener('focusin', this._handleFocusIn, { passive: true });
    }

    this.update();
  }

  /**
   * Stop listening and clean up event bindings.
   */
  disconnect() {
    if (!this.isSupported) return;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const vv = window.visualViewport;
    vv.removeEventListener('resize', this._handleViewportChange);
    vv.removeEventListener('scroll', this._handleViewportChange);
    window.removeEventListener('orientationchange', this._handleViewportChange);
    window.removeEventListener('focusin', this._handleFocusIn);
  }

  /**
   * Force update viewport calculation and set CSS properties.
   */
  update() {
    if (!this.isSupported) return;

    const vv = window.visualViewport;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const height = vv.height;
    const width = vv.width;
    const offsetTop = vv.offsetTop;
    const offsetLeft = vv.offsetLeft;
    const scale = vv.scale;

    // Calculate keyboard height accounting for iOS layout viewport scroll offsets
    const keyboardHeight = Math.max(0, windowHeight - height - offsetTop);
    const isKeyboardVisible = keyboardHeight > 100; // Threshold to prevent minor chrome shifts

    this.state = {
      height,
      width,
      offsetTop,
      offsetLeft,
      scale,
      keyboardHeight,
      isKeyboardVisible,
    };

    // Apply CSS Custom Properties
    const p = this.prefix ? `--${this.prefix}-` : '--';
    this.target.style.setProperty(`${p}height`, `${height}px`);
    this.target.style.setProperty(`${p}width`, `${width}px`);
    this.target.style.setProperty(`${p}top`, `${offsetTop}px`);
    this.target.style.setProperty(`${p}left`, `${offsetLeft}px`);
    this.target.style.setProperty(`${p}scale`, `${scale}`);
    this.target.style.setProperty(`--keyboard-offset`, `${keyboardHeight}px`);

    if (this.onChange) {
      this.onChange(this.state);
    }
  }

  _handleViewportChange() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(() => {
      this.update();
    });
  }

  _handleFocusIn(event) {
    const target = event.target;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable)
    ) {
      setTimeout(() => {
        if (typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 300);
    }
  }
}
