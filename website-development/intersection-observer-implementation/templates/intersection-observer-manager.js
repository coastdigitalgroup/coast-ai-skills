/**
 * IntersectionObserverManager
 * A production-grade singleton observer pooling manager to optimize DOM visibility tracking,
 * prevent memory leaks, handle rootMargin pre-fetching, and safeguard initial callbacks.
 */

export class IntersectionObserverManager {
  static #instance = null;

  constructor() {
    if (IntersectionObserverManager.#instance) {
      return IntersectionObserverManager.#instance;
    }
    this.pools = new Map();
    IntersectionObserverManager.#instance = this;
  }

  /**
   * Generates a unique string key for pooling observer instances with identical options.
   */
  #createKey(options = {}) {
    const rootKey = options.root
      ? (options.root.id || options.root.getAttribute('data-observer-root-id') || 'custom-root')
      : 'viewport';

    const rootMargin = options.rootMargin || '0px 0px 0px 0px';

    const threshold = Array.isArray(options.threshold)
      ? options.threshold.join(',')
      : (options.threshold ?? 0.0);

    return `${rootKey}::${rootMargin}::${threshold}`;
  }

  /**
   * Attaches an element to an IntersectionObserver instance.
   * Reuses existing observer instances if options match.
   *
   * @param {HTMLElement} element - The target DOM element.
   * @param {Function} callback - Callback function (entry, observer) => void.
   * @param {IntersectionObserverInit} options - Standard IntersectionObserver options.
   */
  observe(element, callback, options = {}) {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
      throw new Error('[IntersectionObserverManager] Target must be a valid DOM Element.');
    }

    if (typeof callback !== 'function') {
      throw new Error('[IntersectionObserverManager] Callback must be a function.');
    }

    const key = this.#createKey(options);

    if (!this.pools.has(key)) {
      const targetsMap = new Map();
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          const targetCb = targetsMap.get(entry.target);
          if (targetCb) {
            targetCb(entry, obs);
          }
        });
      }, options);

      this.pools.set(key, { observer, targetsMap, options });
    }

    const pool = this.pools.get(key);

    if (!pool.targetsMap.has(element)) {
      pool.targetsMap.set(element, callback);
      pool.observer.observe(element);
    }
  }

  /**
   * Removes an element from its assigned IntersectionObserver instance.
   * Disconnects and destroys the observer if no elements remain.
   *
   * @param {HTMLElement} element - The target DOM element to unobserve.
   * @param {IntersectionObserverInit} options - The exact options used when invoking observe().
   */
  unobserve(element, options = {}) {
    if (!element) return;

    const key = this.#createKey(options);
    const pool = this.pools.get(key);

    if (pool && pool.targetsMap.has(element)) {
      pool.targetsMap.delete(element);
      pool.observer.unobserve(element);

      // Clean up empty observer instances
      if (pool.targetsMap.size === 0) {
        pool.observer.disconnect();
        this.pools.delete(key);
      }
    }
  }

  /**
   * Convenience helper for single-shot intersection tasks (e.g. lazy loading).
   * Automatically unobserves the element as soon as `isIntersecting === true`.
   *
   * @param {HTMLElement} element
   * @param {Function} onIntersect - Callback function executed once on intersection.
   * @param {IntersectionObserverInit} options
   */
  observeOnce(element, onIntersect, options = {}) {
    const handler = (entry, observer) => {
      // Guard against initial false callback when target is offscreen
      if (!entry.isIntersecting) return;

      onIntersect(entry, observer);
      this.unobserve(element, options);
    };

    this.observe(element, handler, options);
  }

  /**
   * Complete teardown of all active observer pools.
   */
  destroy() {
    this.pools.forEach((pool) => {
      pool.observer.disconnect();
      pool.targetsMap.clear();
    });
    this.pools.clear();
  }
}

export const globalObserverManager = new IntersectionObserverManager();
