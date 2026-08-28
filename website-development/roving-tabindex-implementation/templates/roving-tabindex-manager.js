/**
 * RovingTabindexManager - Production-grade spatial focus controller for WAI-ARIA composite widgets.
 *
 * Supports:
 * - 1D Horizontal & Vertical spatial navigation (toolbars, tablists, menus, radio groups)
 * - 2D Grid matrix spatial navigation (grids, image pickers, data tables)
 * - Automatic Right-to-Left (RTL) text direction flipping
 * - Home and End key boundary jumping
 * - Dynamic DOM target syncing & disabled node skipping
 * - AbortController signal cleanup
 */
export class RovingTabindexManager {
  /**
   * @param {HTMLElement} container - Composite parent container element
   * @param {Object} options - Configuration options
   * @param {string} options.itemSelector - CSS selector for focusable items (default: '[role="tab"], [role="menuitem"], [role="radio"], [role="gridcell"], button, a[href]')
   * @param {'horizontal' | 'vertical' | 'both'} [options.orientation='horizontal'] - Navigation direction axis
   * @param {number} [options.columns=1] - Number of columns for 2D matrix navigation
   * @param {boolean} [options.wrap=true] - Wrap boundary navigation from end to start
   * @param {boolean} [options.autoSelect=false] - Trigger click/selection on arrow movement
   * @param {'ltr' | 'rtl' | 'auto'} [options.dir='auto'] - Text direction configuration
   * @param {AbortSignal} [options.signal] - Optional external AbortSignal for lifecycle cleanup
   */
  constructor(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('RovingTabindexManager: A valid container HTMLElement is required.');
    }

    this.container = container;
    this.options = {
      itemSelector: '[role="tab"], [role="menuitem"], [role="radio"], [role="gridcell"], button, a[href]',
      orientation: 'horizontal',
      columns: 1,
      wrap: true,
      autoSelect: false,
      dir: 'auto',
      ...options
    };

    this.controller = new AbortController();
    this.signal = options.signal
      ? this.combineSignals(options.signal, this.controller.signal)
      : this.controller.signal;

    this.init();
  }

  /**
   * Combines external signal with internal controller signal
   * @private
   */
  combineSignals(externalSignal, internalSignal) {
    if (externalSignal.aborted) return externalSignal;
    const combined = new AbortController();
    const onAbort = () => combined.abort();
    externalSignal.addEventListener('abort', onAbort, { once: true });
    internalSignal.addEventListener('abort', onAbort, { once: true });
    return combined.signal;
  }

  /**
   * Returns filtered list of currently visible, non-disabled item targets
   * @returns {HTMLElement[]}
   */
  getItems() {
    return Array.from(this.container.querySelectorAll(this.options.itemSelector)).filter((el) => {
      const isDisabled = el.disabled || el.getAttribute('aria-disabled') === 'true';
      const isHidden = el.offsetParent === null || el.getAttribute('aria-hidden') === 'true';
      return !isDisabled && !isHidden;
    });
  }

  /**
   * Initializes event listeners and initial tabindex state
   * @private
   */
  init() {
    const { signal } = this;

    this.container.addEventListener('keydown', (e) => this.handleKeyDown(e), { signal });
    this.container.addEventListener('click', (e) => this.handleClick(e), { signal });
    this.container.addEventListener('focusin', (e) => this.handleFocusIn(e), { signal });

    this.sync();
  }

  /**
   * Synchronizes tabindex attributes so exactly one element has tabindex="0"
   */
  sync() {
    const items = this.getItems();
    if (items.length === 0) return;

    let activeIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
    if (activeIndex === -1) {
      // Check for aria-selected or aria-checked
      activeIndex = items.findIndex((item) => item.getAttribute('aria-selected') === 'true' || item.getAttribute('aria-checked') === 'true');
      if (activeIndex === -1) activeIndex = 0;
    }

    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
  }

  /**
   * Sets active focus item and shifts tabindex="0"
   * @param {HTMLElement} targetItem - Item to activate
   * @param {boolean} [shouldFocus=true] - Whether to call targetItem.focus()
   */
  setActiveItem(targetItem, shouldFocus = true) {
    const items = this.getItems();
    if (!items.includes(targetItem)) return;

    items.forEach((item) => {
      if (item === targetItem) {
        item.setAttribute('tabindex', '0');
        if (shouldFocus) item.focus();
        if (this.options.autoSelect) {
          targetItem.click();
        }
      } else {
        item.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * Helper determining if container is currently rendered in Right-to-Left direction
   * @returns {boolean}
   * @private
   */
  isRTL() {
    if (this.options.dir === 'rtl') return true;
    if (this.options.dir === 'ltr') return false;
    const computedDir = this.container.getAttribute('data-direction') || this.container.dir || getComputedStyle(this.container).direction;
    return computedDir === 'rtl';
  }

  /**
   * KeyDown handler managing spatial navigation
   * @param {KeyboardEvent} event
   * @private
   */
  handleKeyDown(event) {
    const items = this.getItems();
    if (items.length === 0) return;

    const currentTarget = event.target.closest(this.options.itemSelector);
    if (!currentTarget || !items.includes(currentTarget)) return;

    const currentIndex = items.indexOf(currentTarget);
    const { orientation, wrap, columns } = this.options;
    const rtl = this.isRTL();

    let nextIndex = currentIndex;

    if (orientation === 'both' && columns > 1) {
      nextIndex = this.calculate2DNextIndex(currentIndex, items.length, columns, event.key, wrap, rtl, event);
    } else {
      nextIndex = this.calculate1DNextIndex(currentIndex, items.length, orientation, event.key, wrap, rtl, event);
    }

    if (nextIndex !== null && nextIndex !== currentIndex && items[nextIndex]) {
      this.setActiveItem(items[nextIndex], true);
    }
  }

  /**
   * Calculates next index for 1D navigation
   * @private
   */
  calculate1DNextIndex(currentIndex, total, orientation, key, wrap, rtl, event) {
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : (rtl ? 'ArrowRight' : 'ArrowLeft');
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : (rtl ? 'ArrowLeft' : 'ArrowRight');

    switch (key) {
      case prevKey:
      case (orientation === 'horizontal' ? 'ArrowUp' : 'ArrowLeft'):
        event.preventDefault();
        return currentIndex <= 0 ? (wrap ? total - 1 : 0) : currentIndex - 1;

      case nextKey:
      case (orientation === 'horizontal' ? 'ArrowDown' : 'ArrowRight'):
        event.preventDefault();
        return currentIndex >= total - 1 ? (wrap ? 0 : total - 1) : currentIndex + 1;

      case 'Home':
        event.preventDefault();
        return 0;

      case 'End':
        event.preventDefault();
        return total - 1;

      default:
        return null;
    }
  }

  /**
   * Calculates next index for 2D spatial grid navigation
   * @private
   */
  calculate2DNextIndex(currentIndex, total, columns, key, wrap, rtl, event) {
    const totalRows = Math.ceil(total / columns);
    const currentRow = Math.floor(currentIndex / columns);
    const currentCol = currentIndex % columns;

    let targetRow = currentRow;
    let targetCol = currentCol;

    switch (key) {
      case 'ArrowLeft':
        event.preventDefault();
        targetCol = rtl ? currentCol + 1 : currentCol - 1;
        if (targetCol < 0) {
          targetCol = columns - 1;
          targetRow = wrap ? (targetRow > 0 ? targetRow - 1 : totalRows - 1) : 0;
        } else if (targetCol >= columns) {
          targetCol = 0;
          targetRow = wrap ? (targetRow < totalRows - 1 ? targetRow + 1 : 0) : totalRows - 1;
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        targetCol = rtl ? currentCol - 1 : currentCol + 1;
        if (targetCol >= columns) {
          targetCol = 0;
          targetRow = wrap ? (targetRow < totalRows - 1 ? targetRow + 1 : 0) : totalRows - 1;
        } else if (targetCol < 0) {
          targetCol = columns - 1;
          targetRow = wrap ? (targetRow > 0 ? targetRow - 1 : totalRows - 1) : 0;
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        targetRow = currentRow - 1;
        if (targetRow < 0) targetRow = wrap ? totalRows - 1 : 0;
        break;

      case 'ArrowDown':
        event.preventDefault();
        targetRow = currentRow + 1;
        if (targetRow >= totalRows) targetRow = wrap ? 0 : totalRows - 1;
        break;

      case 'Home':
        event.preventDefault();
        return 0;

      case 'End':
        event.preventDefault();
        return total - 1;

      default:
        return null;
    }

    return Math.min(targetRow * columns + targetCol, total - 1);
  }

  /**
   * Click handler syncs active item state on pointer interactions
   * @param {MouseEvent} event
   * @private
   */
  handleClick(event) {
    const item = event.target.closest(this.options.itemSelector);
    if (item && this.getItems().includes(item)) {
      this.setActiveItem(item, false);
    }
  }

  /**
   * FocusIn handler ensuring correct tabindex when container receives focus
   * @param {FocusEvent} event
   * @private
   */
  handleFocusIn(event) {
    const items = this.getItems();
    const item = event.target.closest(this.options.itemSelector);

    if (item && items.includes(item) && item.getAttribute('tabindex') !== '0') {
      this.setActiveItem(item, false);
    }
  }

  /**
   * Tears down listeners and aborts signals
   */
  destroy() {
    this.controller.abort();
  }
}
