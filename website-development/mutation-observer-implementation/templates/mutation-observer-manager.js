/**
 * MutationObserverManager
 * A production-grade singleton manager for observing DOM structural and attribute changes.
 */

export class MutationObserverManager {
  constructor() {
    this.targetHandlers = new WeakMap();
    this.isFlushing = false;

    this.observer = new MutationObserver((mutations) => {
      if (this.isFlushing) return;

      for (const mutation of mutations) {
        const registration = this.targetHandlers.get(mutation.target);
        if (registration && typeof registration.callback === 'function') {
          try {
            registration.callback(mutation);
          } catch (error) {
            console.error('[MutationObserverManager] Error executing handler:', error);
          }
        }
      }
    });
  }

  /**
   * Observe a DOM node for structural or attribute changes.
   *
   * @param {Node} target - The DOM node to observe.
   * @param {Function} callback - Function called on each MutationRecord.
   * @param {MutationObserverInit} [options] - MutationObserver options.
   * @param {AbortSignal} [signal] - Optional AbortSignal for automatic teardown.
   */
  observe(target, callback, options = { childList: true }, signal = null) {
    if (!target || !(target instanceof Node)) {
      throw new Error('[MutationObserverManager] Invalid target node provided.');
    }

    this.targetHandlers.set(target, { callback, options });
    this.observer.observe(target, options);

    if (signal && signal instanceof AbortSignal) {
      if (signal.aborted) {
        this.unobserve(target);
      } else {
        signal.addEventListener('abort', () => this.unobserve(target), { once: true });
      }
    }
  }

  /**
   * Stop observing a specific target node.
   *
   * @param {Node} target
   */
  unobserve(target) {
    if (!target) return;
    this.targetHandlers.delete(target);
    // Note: Native MutationObserver does not support per-target unobserve without full re-observation.
    // Clearing weak map reference prevents callback execution.
  }

  /**
   * Safe execution wrapper to modify the DOM inside an observer callback without triggering infinite loops.
   *
   * @param {Function} fn - Function executing DOM mutations.
   */
  executeGuarded(fn) {
    this.isFlushing = true;
    try {
      fn();
    } finally {
      this.observer.takeRecords();
      this.isFlushing = false;
    }
  }

  /**
   * Disconnect the observer completely.
   */
  disconnect() {
    this.observer.disconnect();
  }
}

export const mutationManager = new MutationObserverManager();
