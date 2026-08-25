/**
 * MutationObserverManager
 * A production-ready manager utility for managing MutationObserver instances
 * with recursion protection, microtask/rAF batching, AbortSignal integration,
 * and WeakMap scoping.
 */
export class MutationObserverManager {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.batchWithRaf=false] - If true, defers heavy mutation callback processing to requestAnimationFrame to avoid microtask layout thrashing.
   */
  constructor(options = {}) {
    this.batchWithRaf = options.batchWithRaf ?? false;
    this.registrations = new WeakMap();
    this.isProcessing = false;
    this.rafId = null;
    this.pendingMutationsMap = new Map();
  }

  /**
   * Observe a DOM target element for mutations.
   *
   * @param {Node} target - The target node to observe.
   * @param {Function} callback - Callback accepting (mutationsList, observer).
   * @param {MutationObserverInit} observerConfig - Standard MutationObserver configuration options.
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal] - Optional AbortSignal for automatic unobserving.
   * @returns {Function} Unobserve function to stop watching the target.
   */
  observe(target, callback, observerConfig = {}, options = {}) {
    if (!target || !(target instanceof Node)) {
      throw new Error('MutationObserverManager.observe: target must be a valid DOM Node.');
    }

    // Stop existing observation if target is re-registered
    this.unobserve(target);

    const observer = new MutationObserver((mutationsList, obs) => {
      // Recursion Guard: Prevent re-entrant loops when callbacks mutate observed nodes
      if (this.isProcessing) return;

      if (this.batchWithRaf) {
        // Collect mutations per target and schedule execution on next animation frame
        const existing = this.pendingMutationsMap.get(target) || [];
        this.pendingMutationsMap.set(target, [...existing, ...mutationsList]);

        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            this.flushBatch();
          });
        }
      } else {
        // Immediate microtask execution
        try {
          this.isProcessing = true;
          callback(mutationsList, obs);
        } finally {
          this.isProcessing = false;
        }
      }
    });

    observer.observe(target, observerConfig);

    const registration = {
      observer,
      callback,
      target
    };

    this.registrations.set(target, registration);

    // Bind optional AbortSignal
    const signal = options.signal;
    if (signal) {
      if (signal.aborted) {
        this.unobserve(target);
      } else {
        signal.addEventListener(
          'abort',
          () => {
            this.unobserve(target);
          },
          { once: true }
        );
      }
    }

    return () => this.unobserve(target);
  }

  /**
   * Process all batched frame mutations stored when batchWithRaf is enabled.
   */
  flushBatch() {
    try {
      this.isProcessing = true;
      for (const [target, mutations] of this.pendingMutationsMap) {
        const reg = this.registrations.get(target);
        if (reg && mutations.length > 0) {
          reg.callback(mutations, reg.observer);
        }
      }
    } finally {
      this.pendingMutationsMap.clear();
      this.isProcessing = false;
    }
  }

  /**
   * Stop observing a specific DOM node and clear pending mutations.
   *
   * @param {Node} target - The DOM node to stop observing.
   */
  unobserve(target) {
    if (!target) return;

    const registration = this.registrations.get(target);
    if (registration) {
      // Flush undelivered pending mutations if needed
      const pending = registration.observer.takeRecords();
      if (pending.length > 0 && !this.batchWithRaf) {
        try {
          this.isProcessing = true;
          registration.callback(pending, registration.observer);
        } finally {
          this.isProcessing = false;
        }
      }

      registration.observer.disconnect();
      this.registrations.delete(target);
      this.pendingMutationsMap.delete(target);
    }
  }

  /**
   * Safely execute a DOM mutation block on target without triggering the observer.
   * Temporarily takes records and disconnects, runs action, then resumes observation.
   *
   * @param {Node} target - Observed target node.
   * @param {Function} action - Function executing DOM reads/writes.
   * @param {MutationObserverInit} [observerConfig] - Config to resume observation with.
   */
  silentMutation(target, action, observerConfig = {}) {
    const registration = this.registrations.get(target);
    if (!registration) {
      action();
      return;
    }

    // Flush undelivered records and temporarily disconnect
    registration.observer.takeRecords();
    registration.observer.disconnect();

    try {
      action();
    } finally {
      // Resume observation
      registration.observer.observe(target, observerConfig);
    }
  }
}

// Export default singleton instance
export const globalMutationManager = new MutationObserverManager();
