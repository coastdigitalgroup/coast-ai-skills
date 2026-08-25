/**
 * ResizeObserverManager - Production-Grade Shared Observer Manager
 *
 * Provides a unified, high-performance ResizeObserver architecture that:
 * 1. Shares a single native ResizeObserver instance across all target DOM elements.
 * 2. Batches all dimension callbacks using requestAnimationFrame to eliminate
 *    "ResizeObserver loop completed with undelivered notifications" errors.
 * 3. Handles box-model targets ('border-box', 'content-box', 'device-pixel-content-box').
 * 4. Normalizes ResizeObserverSize array spec properties with legacy contentRect fallbacks.
 * 5. Uses AbortSignal and WeakMap for automatic, zero-leak memory management.
 */

export class ResizeObserverManager {
  /**
   * Initialize singleton observer manager
   */
  constructor() {
    /** @type {WeakMap<Element, { callback: Function, box: string }>} */
    this.callbacks = new WeakMap();

    /** @type {Map<Element, ResizeObserverEntry>} */
    this.pendingEntries = new Map();

    /** @type {number | null} */
    this.rafId = null;

    /** @type {ResizeObserver | null} */
    this.observer = null;

    this.initNativeObserver();
  }

  /**
   * Instantiate the native ResizeObserver
   * @private
   */
  initNativeObserver() {
    if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
      return;
    }

    this.observer = new ResizeObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        this.pendingEntries.set(entry.target, entry);
      }

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => this.flushPendingEntries());
      }
    });
  }

  /**
   * Flush all pending entries on the next animation frame
   * @private
   */
  flushPendingEntries() {
    this.rafId = null;

    for (const [target, entry] of this.pendingEntries) {
      const config = this.callbacks.get(target);
      if (config) {
        const dimensions = this.extractDimensions(entry, config.box);
        try {
          config.callback(dimensions, entry);
        } catch (error) {
          console.error('[ResizeObserverManager] Callback execution error:', error, target);
        }
      }
    }

    this.pendingEntries.clear();
  }

  /**
   * Extract normalized width and height dimensions from a ResizeObserverEntry
   * @param {ResizeObserverEntry} entry
   * @param {'border-box' | 'content-box' | 'device-pixel-content-box'} boxType
   * @returns {{ width: number, height: number }}
   */
  extractDimensions(entry, boxType = 'border-box') {
    // 1. Device Pixel Content Box (Physical hardware pixels for Canvas/WebGL)
    if (boxType === 'device-pixel-content-box' && entry.devicePixelContentBoxSize?.length) {
      return {
        width: entry.devicePixelContentBoxSize[0].inlineSize,
        height: entry.devicePixelContentBoxSize[0].blockSize
      };
    }

    // 2. Border Box (Outer bounding size including padding and border)
    if (boxType === 'border-box' && entry.borderBoxSize?.length) {
      return {
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      };
    }

    // 3. Content Box (Inner content area excluding padding and border)
    if (entry.contentBoxSize?.length) {
      return {
        width: entry.contentBoxSize[0].inlineSize,
        height: entry.contentBoxSize[0].blockSize
      };
    }

    // 4. Legacy contentRect fallback
    return {
      width: entry.contentRect.width,
      height: entry.contentRect.height
    };
  }

  /**
   * Observe dimensions of a target element
   * @param {Element} target - The DOM element to observe
   * @param {(dimensions: { width: number, height: number }, entry: ResizeObserverEntry) => void} callback
   * @param {Object} [options]
   * @param {'border-box' | 'content-box' | 'device-pixel-content-box'} [options.box='border-box']
   * @param {AbortSignal} [options.signal] - Optional AbortSignal for auto-teardown
   */
  observe(target, callback, options = {}) {
    if (!target || !(target instanceof Element)) {
      return;
    }

    if (!this.observer) {
      // Fallback for legacy environments without ResizeObserver
      const rect = target.getBoundingClientRect();
      callback({ width: rect.width, height: rect.height }, null);
      return;
    }

    const box = options.box || 'border-box';
    this.callbacks.set(target, { callback, box });

    try {
      this.observer.observe(target, { box });
    } catch (e) {
      // Graceful fallback if device-pixel-content-box is unsupported by browser
      if (box === 'device-pixel-content-box') {
        this.observer.observe(target, { box: 'content-box' });
      } else {
        throw e;
      }
    }

    if (options.signal) {
      if (options.signal.aborted) {
        this.unobserve(target);
      } else {
        options.signal.addEventListener('abort', () => this.unobserve(target), { once: true });
      }
    }
  }

  /**
   * Stop observing a specific target element
   * @param {Element} target
   */
  unobserve(target) {
    if (!target || !this.observer) return;

    this.callbacks.delete(target);
    this.pendingEntries.delete(target);
    this.observer.unobserve(target);
  }

  /**
   * Disconnect the underlying observer and cancel pending frames
   */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.pendingEntries.clear();

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Shared singleton instance for global application use
 */
export const resizeManager = new ResizeObserverManager();
