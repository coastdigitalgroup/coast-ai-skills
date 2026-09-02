/**
 * IntersectionObserverManager
 * Production-grade singleton pool manager for IntersectionObserver targets.
 * Handles target grouping, WeakMap callback mapping, custom roots, rootMargin formatting,
 * AbortSignal teardown, and fallback execution.
 */
export class IntersectionObserverManager {
  constructor() {
    /**
     * Internal pool mapping option key strings to observer instances.
     * Key structure: "rootId|rootMargin|thresholds"
     * Value: { observer: IntersectionObserver, callbacks: WeakMap<Element, Function>, targetCount: number }
     * @type {Map<string, { observer: IntersectionObserver, callbacks: WeakMap<Element, Function>, targetCount: number }>}
     */
    this.pool = new Map();

    /**
     * WeakMap mapping root elements to generated unique identifiers
     * @type {WeakMap<Element, string>}
     */
    this.rootIds = new WeakMap();
    this.rootIdCounter = 0;
  }

  /**
   * Generates a unique string identifier for a custom root element
   * @private
   * @param {Element|null} root
   * @returns {string}
   */
  _getRootId(root) {
    if (!root) return 'window_viewport';
    if (!this.rootIds.has(root)) {
      this.rootIdCounter++;
      this.rootIds.set(root, `root_id_${this.rootIdCounter}`);
    }
    return this.rootIds.get(root);
  }

  /**
   * Formats and normalizes observer options into a unique hash key string
   * @private
   * @param {Object} options
   * @returns {string}
   */
  _buildPoolKey(options = {}) {
    const rootId = this._getRootId(options.root || null);
    const margin = options.rootMargin ? options.rootMargin.trim() : '0px 0px 0px 0px';

    let thresholdKey = '0';
    if (Array.isArray(options.threshold)) {
      thresholdKey = options.threshold.map(t => Number(t).toFixed(3)).join(',');
    } else if (typeof options.threshold === 'number') {
      thresholdKey = Number(options.threshold).toFixed(3);
    }

    return `${rootId}::${margin}::${thresholdKey}`;
  }

  /**
   * Registers a target element to be observed by the pool manager
   *
   * @param {Element} target - The DOM element to observe
   * @param {Function} callback - Handler function receiving (entry, unobserveFn, observer)
   * @param {Object} [options] - Observer configuration options
   * @param {Element|null} [options.root=null] - Ancestor element used as root boundary
   * @param {string} [options.rootMargin='0px'] - Margins around the root box
   * @param {number|number[]} [options.threshold=0] - Single or array of intersection ratios
   * @param {AbortSignal} [options.signal] - AbortSignal to trigger unobservation automatically
   * @returns {Function} Function to invoke manually to unobserve the target
   */
  observe(target, callback, options = {}) {
    if (!target || !(target instanceof Element)) {
      console.warn('[IntersectionObserverManager] Invalid DOM element target provided.');
      return () => {};
    }

    if (typeof callback !== 'function') {
      console.warn('[IntersectionObserverManager] Callback parameter must be a function.');
      return () => {};
    }

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      return this._executeFallback(target, callback);
    }

    const key = this._buildPoolKey(options);
    let poolEntry = this.pool.get(key);

    if (!poolEntry) {
      const callbacks = new WeakMap();

      const observer = new IntersectionObserver((entries, obs) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const cb = callbacks.get(entry.target);
          if (cb) {
            const unobserveFn = () => this.unobserve(entry.target, key);
            cb(entry, unobserveFn, obs);
          }
        }
      }, {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold ?? 0
      });

      poolEntry = {
        observer,
        callbacks,
        targetCount: 0
      };
      this.pool.set(key, poolEntry);
    }

    poolEntry.callbacks.set(target, callback);
    poolEntry.observer.observe(target);
    poolEntry.targetCount++;

    const unobserveFn = () => this.unobserve(target, key);

    // Bind optional AbortSignal for automated component unmount cleanup
    if (options.signal && options.signal instanceof AbortSignal) {
      if (options.signal.aborted) {
        unobserveFn();
      } else {
        options.signal.addEventListener('abort', unobserveFn, { once: true });
      }
    }

    return unobserveFn;
  }

  /**
   * Unobserves a specific target element and cleans up observer resources if empty
   *
   * @param {Element} target - Target element to unobserve
   * @param {string} [poolKey] - Optional pool key for accelerated lookup
   */
  unobserve(target, poolKey) {
    if (!target) return;

    if (poolKey && this.pool.has(poolKey)) {
      const entry = this.pool.get(poolKey);
      if (entry.callbacks.has(target)) {
        entry.callbacks.delete(target);
        entry.observer.unobserve(target);
        entry.targetCount--;

        if (entry.targetCount <= 0) {
          entry.observer.disconnect();
          this.pool.delete(poolKey);
        }
      }
      return;
    }

    // Fallback: search across all active pool entries if poolKey not provided
    for (const [key, entry] of this.pool.entries()) {
      if (entry.callbacks.has(target)) {
        entry.callbacks.delete(target);
        entry.observer.unobserve(target);
        entry.targetCount--;

        if (entry.targetCount <= 0) {
          entry.observer.disconnect();
          this.pool.delete(key);
        }
        break;
      }
    }
  }

  /**
   * Fallback handler for legacy browser environments without IntersectionObserver
   * @private
   */
  _executeFallback(target, callback) {
    const timer = setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const fakeEntry = {
        target,
        isIntersecting: true,
        intersectionRatio: 1.0,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: null,
        time: performance.now()
      };
      callback(fakeEntry, () => clearTimeout(timer), null);
    }, 16);

    return () => clearTimeout(timer);
  }

  /**
   * Returns current pool diagnostic stats (total active observers and targets)
   * @returns {{ activeObservers: number, totalObservedTargets: number }}
   */
  getDiagnostics() {
    let totalTargets = 0;
    for (const entry of this.pool.values()) {
      totalTargets += entry.targetCount;
    }
    return {
      activeObservers: this.pool.size,
      totalObservedTargets: totalTargets
    };
  }
}

// Export default singleton instance
export const globalIntersectionManager = new IntersectionObserverManager();
