/**
 * ScrollSnapController
 * Modular, vanilla JavaScript class for managing CSS Scroll Snap containers,
 * synchronizing active pagination states via IntersectionObserver, and binding
 * keyboard navigation controls.
 */
export class ScrollSnapController {
  /**
   * @param {HTMLElement} wrapper - The outer component wrapper element.
   * @param {Object} [options] - Configuration options.
   * @param {string} [options.containerSelector='.scroll-snap-horizontal, .scroll-snap-vertical']
   * @param {string} [options.itemSelector='.scroll-snap-item, .scroll-snap-slide']
   * @param {string} [options.dotSelector='.dot']
   * @param {string} [options.prevBtnSelector='.prev-btn']
   * @param {string} [options.nextBtnSelector='.next-btn']
   * @param {number} [options.intersectionThreshold=0.6]
   */
  constructor(wrapper, options = {}) {
    if (!wrapper || !(wrapper instanceof HTMLElement)) {
      throw new Error('ScrollSnapController requires a valid wrapper HTMLElement.');
    }

    this.wrapper = wrapper;
    this.options = {
      containerSelector: '.scroll-snap-horizontal, .scroll-snap-vertical',
      itemSelector: '.scroll-snap-item, .scroll-snap-slide',
      dotSelector: '.dot',
      prevBtnSelector: '.prev-btn',
      nextBtnSelector: '.next-btn',
      intersectionThreshold: 0.6,
      ...options
    };

    this.container = this.wrapper.querySelector(this.options.containerSelector);
    if (!this.container) {
      throw new Error(`ScrollSnapController: Container matching "${this.options.containerSelector}" not found.`);
    }

    this.items = Array.from(this.container.querySelectorAll(this.options.itemSelector));
    this.dots = Array.from(this.wrapper.querySelectorAll(this.options.dotSelector));
    this.prevBtn = this.wrapper.querySelector(this.options.prevBtnSelector);
    this.nextBtn = this.wrapper.querySelector(this.options.nextBtnSelector);

    this.activeIndex = 0;
    this.observer = null;

    this.init();
  }

  init() {
    this.setupObserver();
    this.setupControls();
    this.setupKeyboard();
  }

  setupObserver() {
    const observerOptions = {
      root: this.container,
      threshold: this.options.intersectionThreshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = this.items.indexOf(entry.target);
          if (index !== -1) {
            this.updateActiveState(index);
          }
        }
      });
    }, observerOptions);

    this.items.forEach((item) => this.observer.observe(item));
  }

  updateActiveState(index) {
    this.activeIndex = index;

    // Toggle active class on snap items
    this.items.forEach((item, idx) => {
      item.classList.toggle('is-active', idx === index);
    });

    // Update pagination dots
    this.dots.forEach((dot, idx) => {
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    // Update Prev / Next button states
    if (this.prevBtn) this.prevBtn.disabled = index === 0;
    if (this.nextBtn) this.nextBtn.disabled = index === this.items.length - 1;

    // Dispatch custom state change event
    this.wrapper.dispatchEvent(
      new CustomEvent('scrollsnapchange', {
        detail: { activeIndex: index, activeItem: this.items[index] },
        bubbles: true
      })
    );
  }

  scrollToIndex(index) {
    if (index < 0 || index >= this.items.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetItem = this.items[index];

    targetItem.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start'
    });
  }

  setupControls() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToIndex(this.activeIndex - 1));
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToIndex(this.activeIndex + 1));
    }

    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => this.scrollToIndex(idx));
    });
  }

  setupKeyboard() {
    this.container.addEventListener('keydown', (e) => {
      const isVertical = this.container.classList.contains('scroll-snap-vertical');

      let handled = false;
      let targetIndex = this.activeIndex;

      if ((!isVertical && e.key === 'ArrowRight') || (isVertical && e.key === 'ArrowDown')) {
        targetIndex = this.activeIndex + 1;
        handled = true;
      } else if ((!isVertical && e.key === 'ArrowLeft') || (isVertical && e.key === 'ArrowUp')) {
        targetIndex = this.activeIndex - 1;
        handled = true;
      } else if (e.key === 'Home') {
        targetIndex = 0;
        handled = true;
      } else if (e.key === 'End') {
        targetIndex = this.items.length - 1;
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        this.scrollToIndex(targetIndex);
      }
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
