/**
 * RovingTabindexManager - Production-grade keyboard focus controller for composite UI widgets.
 * Handles 1D (horizontal/vertical) and 2D grid focus traversal, RTL reading direction,
 * disabled item skipping, dynamic DOM mutations, and clean AbortController lifecycle teardowns.
 */
export class RovingTabindexManager {
  /**
   * @param {Object} config
   * @param {HTMLElement} config.container - Root container element holding the widget.
   * @param {string} config.itemSelector - CSS selector targeting interactive item targets.
   * @param {'horizontal'|'vertical'|'grid'} [config.orientation='horizontal'] - Focus traversal axis.
   * @param {number} [config.columns=1] - Number of grid columns (required when orientation is 'grid').
   * @param {boolean} [config.wrap=true] - Whether arrow navigation wraps around boundary limits.
   * @param {boolean} [config.autoRtl=true] - Auto-detect Right-to-Left document reading direction.
   * @param {number} [config.defaultActiveIndex=0] - Initial active item index.
   * @param {AbortSignal} [config.signal] - Optional signal for automatic lifecycle cleanup.
   */
  constructor(config) {
    if (!config.container) throw new Error('RovingTabindexManager: container element is required');
    if (!config.itemSelector) throw new Error('RovingTabindexManager: itemSelector is required');

    this.container = config.container;
    this.itemSelector = config.itemSelector;
    this.orientation = config.orientation || 'horizontal';
    this.columns = config.columns || 1;
    this.wrap = config.wrap !== false;
    this.autoRtl = config.autoRtl !== false;
    this.currentIndex = config.defaultActiveIndex || 0;

    this.controller = new AbortController();
    this.mutationObserver = null;

    // Connect external signal if provided
    if (config.signal) {
      config.signal.addEventListener('abort', () => this.destroy(), { once: true });
    }

    this.init();
  }

  /** Initialize tab stop states and bind listeners */
  init() {
    this.syncItems();

    const { signal } = this.controller;

    // Intercept keyboard focus movements
    this.container.addEventListener('keydown', (e) => this.handleKeydown(e), { signal });

    // Sync roving index on pointer clicks or external focus shifts
    this.container.addEventListener('focusin', (e) => this.handleFocusIn(e), { signal });

    // Observe dynamic DOM additions, removals, and attribute updates
    this.mutationObserver = new MutationObserver(() => this.syncItems());
    this.mutationObserver.observe(this.container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled', 'hidden']
    });
  }

  /** Query all valid, non-disabled items matching selector */
  getItems() {
    return Array.from(this.container.querySelectorAll(this.itemSelector)).filter((el) => {
      const isHidden = el.hidden || getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden';
      const isDisabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
      return !isHidden && !isDisabled;
    });
  }

  /** Synchronize tabindex attributes across items */
  syncItems() {
    const items = this.getItems();
    if (items.length === 0) return;

    // Bound current index to valid range
    if (this.currentIndex >= items.length) {
      this.currentIndex = items.length - 1;
    }
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.setAttribute('tabindex', '0');
      } else {
        item.setAttribute('tabindex', '-1');
      }
    });
  }

  /** Check if container or document is in RTL layout mode */
  isRtl() {
    if (!this.autoRtl) return false;
    return getComputedStyle(this.container).direction === 'rtl';
  }

  /** Keydown handler */
  handleKeydown(event) {
    const items = this.getItems();
    if (items.length === 0) return;

    const key = event.key;
    const isRtl = this.isRtl();
    let targetIndex = this.currentIndex;

    const prevHoriz = isRtl ? 'ArrowRight' : 'ArrowLeft';
    const nextHoriz = isRtl ? 'ArrowLeft' : 'ArrowRight';

    switch (key) {
      case prevHoriz:
        if (this.orientation === 'horizontal' || this.orientation === 'grid') {
          event.preventDefault();
          targetIndex = this.getPreviousIndex(items.length);
        }
        break;

      case nextHoriz:
        if (this.orientation === 'horizontal' || this.orientation === 'grid') {
          event.preventDefault();
          targetIndex = this.getNextIndex(items.length);
        }
        break;

      case 'ArrowUp':
        if (this.orientation === 'vertical') {
          event.preventDefault();
          targetIndex = this.getPreviousIndex(items.length);
        } else if (this.orientation === 'grid') {
          event.preventDefault();
          targetIndex = this.getGridUpIndex(items.length);
        }
        break;

      case 'ArrowDown':
        if (this.orientation === 'vertical') {
          event.preventDefault();
          targetIndex = this.getNextIndex(items.length);
        } else if (this.orientation === 'grid') {
          event.preventDefault();
          targetIndex = this.getGridDownIndex(items.length);
        }
        break;

      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        targetIndex = items.length - 1;
        break;

      default:
        return; // Allow unhandled keys (Tab, Enter, Space) to propagate
    }

    this.focusItem(targetIndex);
  }

  /** FocusIn handler for mouse clicks */
  handleFocusIn(event) {
    const targetItem = event.target.closest(this.itemSelector);
    if (!targetItem || !this.container.contains(targetItem)) return;

    const items = this.getItems();
    const index = items.indexOf(targetItem);

    if (index !== -1 && index !== this.currentIndex) {
      if (items[this.currentIndex]) {
        items[this.currentIndex].setAttribute('tabindex', '-1');
      }
      targetItem.setAttribute('tabindex', '0');
      this.currentIndex = index;
    }
  }

  /** Calculate previous item index */
  getPreviousIndex(total) {
    if (this.currentIndex > 0) return this.currentIndex - 1;
    return this.wrap ? total - 1 : 0;
  }

  /** Calculate next item index */
  getNextIndex(total) {
    if (this.currentIndex < total - 1) return this.currentIndex + 1;
    return this.wrap ? 0 : total - 1;
  }

  /** Calculate grid up target index */
  getGridUpIndex(total) {
    const target = this.currentIndex - this.columns;
    if (target >= 0) return target;
    return this.wrap ? Math.max(0, total - (this.columns - (this.currentIndex % this.columns))) : this.currentIndex;
  }

  /** Calculate grid down target index */
  getGridDownIndex(total) {
    const target = this.currentIndex + this.columns;
    if (target < total) return target;
    return this.wrap ? this.currentIndex % this.columns : this.currentIndex;
  }

  /** Shift focus to specified index */
  focusItem(index) {
    const items = this.getItems();
    if (!items[index]) return;

    if (items[this.currentIndex]) {
      items[this.currentIndex].setAttribute('tabindex', '-1');
    }

    this.currentIndex = index;
    items[this.currentIndex].setAttribute('tabindex', '0');
    items[this.currentIndex].focus();
  }

  /** Destroy controller and disconnect observers */
  destroy() {
    this.controller.abort();
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }
}
