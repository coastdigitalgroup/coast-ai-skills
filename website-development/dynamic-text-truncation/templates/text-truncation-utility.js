/**
 * @file text-truncation-utility.js
 * @description A lightweight, framework-agnostic, and fully accessible utility for managing
 * dynamic text truncation (line clamping) with container-aware "Read More / Show Less" triggers.
 * It uses ResizeObserver to detect visual overflow dynamically, ensuring no "ghost" triggers
 * appear when text fits the available space.
 *
 * @version 1.0.0
 * @license MIT
 */

export class DynamicTextTruncator {
  /**
   * Create an instance of the truncator.
   * @param {HTMLElement} containerElement - The parent container element.
   * @param {Object} options - Custom configuration options.
   * @param {string} [options.contentSelector='.expandable-text-content'] - Selector for the text box.
   * @param {string} [options.triggerSelector='.expandable-text-trigger'] - Selector for the toggle button.
   * @param {string} [options.triggerTextSelector='.trigger-text'] - Selector for the text container inside the button.
   * @param {string} [options.expandedClass='is-expanded'] - CSS class to apply when expanded.
   * @param {string} [options.expandedText='Show less'] - Button text for the expanded state.
   * @param {string} [options.collapsedText='Show more'] - Button text for the collapsed state.
   * @param {boolean} [options.scrollOnCollapse=true] - Smoothly scroll container back into view on collapse.
   * @param {Function} [options.onExpand] - Callback hook triggered on expansion.
   * @param {Function} [options.onCollapse] - Callback hook triggered on collapse.
   * @param {Function} [options.onStateChange] - Callback hook triggered on any trigger visibility change.
   */
  constructor(containerElement, options = {}) {
    if (!containerElement || !(containerElement instanceof HTMLElement)) {
      throw new Error('DynamicTextTruncator requires a valid HTML container element.');
    }

    this.container = containerElement;

    // Merge default configurations with user options
    this.config = {
      contentSelector: '.expandable-text-content',
      triggerSelector: '.expandable-text-trigger',
      triggerTextSelector: '.trigger-text',
      expandedClass: 'is-expanded',
      expandedText: 'Show less',
      collapsedText: 'Show more',
      scrollOnCollapse: true,
      onExpand: null,
      onCollapse: null,
      onStateChange: null,
      ...options
    };

    this.content = this.container.querySelector(this.config.contentSelector);
    this.trigger = this.container.querySelector(this.config.triggerSelector);

    if (!this.content || !this.trigger) {
      console.warn('DynamicTextTruncator: Missing content or trigger elements in container:', this.container);
      return;
    }

    this.triggerText = this.trigger.querySelector(this.config.triggerTextSelector) || this.trigger;

    this.isExpanded = false;
    this.resizeObserver = null;
    this.hasActiveOverflow = false;

    this._boundToggle = this.toggle.bind(this);
    this._boundCheckOverflow = this.checkOverflow.bind(this);

    this.init();
  }

  /**
   * Set up event listeners and initialize ResizeObserver.
   */
  init() {
    // 1. Listen for user click interactions
    this.trigger.addEventListener('click', this._boundToggle);

    // 2. Setup ResizeObserver with requestAnimationFrame to decouple layout measurements
    // from mutations, preventing "ResizeObserver loop limit exceeded" warnings.
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(this._boundCheckOverflow);
      });
      this.resizeObserver.observe(this.content);
    } else {
      // Graceful fallback for legacy browsers without ResizeObserver
      this.checkOverflow();
      window.addEventListener('resize', this._boundCheckOverflow, { passive: true });
    }
  }

  /**
   * Evaluate whether the content visually overflows its container boundaries.
   */
  checkOverflow() {
    // If the widget is currently expanded, it cannot visually overflow the clamp.
    if (this.isExpanded) return;

    // scrollHeight represents full content height; clientHeight represents visible rendering height.
    const isOverflowing = this.content.scrollHeight > this.content.clientHeight;

    if (isOverflowing !== this.hasActiveOverflow) {
      this.hasActiveOverflow = isOverflowing;

      // Update trigger visibility
      if (this.hasActiveOverflow) {
        this.trigger.style.display = '';
        this.trigger.removeAttribute('aria-hidden');
      } else {
        this.trigger.style.display = 'none';
        this.trigger.setAttribute('aria-hidden', 'true');
      }

      // Invoke optional state change callback
      if (typeof this.config.onStateChange === 'function') {
        this.config.onStateChange(this.hasActiveOverflow);
      }
    }
  }

  /**
   * Toggle between the expanded and collapsed states.
   */
  toggle() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this._applyExpand();
    } else {
      this._applyCollapse();
    }
  }

  /**
   * Transition DOM elements into the expanded state.
   * @private
   */
  _applyExpand() {
    this.content.classList.add(this.config.expandedClass);

    // Update ARIA attributes
    this.content.setAttribute('aria-expanded', 'true');
    this.trigger.setAttribute('aria-expanded', 'true');

    // Update trigger text safely
    if (this.triggerText) {
      this.triggerText.textContent = this.config.expandedText;
    }

    // Fire expansion callbacks
    if (typeof this.config.onExpand === 'function') {
      this.config.onExpand(this.container);
    }
  }

  /**
   * Transition DOM elements into the collapsed state.
   * @private
   */
  _applyCollapse() {
    this.content.classList.remove(this.config.expandedClass);

    // Update ARIA attributes
    this.content.setAttribute('aria-expanded', 'false');
    this.trigger.setAttribute('aria-expanded', 'false');

    // Update trigger text safely
    if (this.triggerText) {
      this.triggerText.textContent = this.config.collapsedText;
    }

    // Fire collapse callbacks
    if (typeof this.config.onCollapse === 'function') {
      this.config.onCollapse(this.container);
    }

    // Prevent losing scroll placement context when content collapses upward
    if (this.config.scrollOnCollapse) {
      this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Clean up observers and listeners to prevent memory leaks when components unmount.
   */
  destroy() {
    this.trigger.removeEventListener('click', this._boundToggle);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this._boundCheckOverflow);
    }
  }
}
