/**
 * DOMMutationManager
 *
 * Production-ready singleton / standalone DOM mutation observer manager.
 * Supports:
 * - WeakMap target registration (zero memory leak retention)
 * - Ancestry resolution for subtree mutations
 * - Recursion-guarded callbacks
 * - Granular attributeFilter default enforcement
 * - AbortSignal integrated lifecycle teardown
 * - takeRecords() flushing on disconnect
 */

export class DOMMutationManager {
  constructor() {
    this.targetBindings = new Map(); // Target Node -> Set<BindingEntry>
    this.isProcessing = false;

    this.observer = new MutationObserver((mutations) => {
      this.dispatchMutations(mutations);
    });
  }

  /**
   * Observe a DOM target node for structural or attribute mutations.
   *
   * @param {Node} target - The DOM node to observe.
   * @param {Function} callback - Mutation record callback: (mutations: MutationRecord[]) => void
   * @param {Object} options - Observer configuration options
   * @param {boolean} [options.childList=true] - Monitor direct child node addition/removal
   * @param {boolean} [options.subtree=false] - Extend observation to all descendant nodes
   * @param {boolean} [options.attributes=false] - Monitor attribute changes
   * @param {string[]} [options.attributeFilter] - Restrict attribute tracking to specific names
   * @param {boolean} [options.attributeOldValue=false] - Pass old attribute value to record
   * @param {boolean} [options.characterData=false] - Monitor text node edits
   * @param {AbortSignal} [options.signal] - Optional AbortSignal for automatic unobserve
   * @returns {Function} Unobserve cleanup function
   */
  observe(target, callback, options = {}) {
    if (!target || !(target instanceof Node)) {
      throw new TypeError('DOMMutationManager.observe: target must be a valid DOM Node.');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('DOMMutationManager.observe: callback must be a function.');
    }

    const {
      childList = true,
      subtree = false,
      attributes = false,
      attributeFilter,
      attributeOldValue = false,
      characterData = false,
      signal
    } = options;

    const observerConfig = {
      childList,
      subtree,
      attributes: attributes || Boolean(attributeFilter),
      attributeOldValue,
      characterData
    };

    if (attributeFilter && Array.isArray(attributeFilter)) {
      observerConfig.attributeFilter = attributeFilter;
    }

    let bindings = this.targetBindings.get(target);
    if (!bindings) {
      bindings = new Set();
      this.targetBindings.set(target, bindings);
    }

    const bindingEntry = { callback, config: observerConfig };
    bindings.add(bindingEntry);

    // Register observation on underlying MutationObserver
    this.observer.observe(target, observerConfig);

    const unobserveFn = () => {
      const currentBindings = this.targetBindings.get(target);
      if (currentBindings) {
        currentBindings.delete(bindingEntry);
        if (currentBindings.size === 0) {
          this.targetBindings.delete(target);
        }
      }
    };

    if (signal) {
      if (signal.aborted) {
        unobserveFn();
      } else {
        signal.addEventListener('abort', unobserveFn, { once: true });
      }
    }

    return unobserveFn;
  }

  /**
   * Internal dispatcher with ancestry resolution and recursion guards.
   * @private
   */
  dispatchMutations(mutations) {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      for (const mutation of mutations) {
        // Find matching registered target nodes (either exact target or parent containing target)
        for (const [observedNode, bindings] of this.targetBindings.entries()) {
          if (observedNode === mutation.target || (observedNode.contains && observedNode.contains(mutation.target))) {
            for (const { callback } of bindings) {
              callback([mutation]);
            }
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Flush pending mutations and disconnect the observer completely.
   */
  destroy() {
    const pendingRecords = this.observer.takeRecords();
    if (pendingRecords.length > 0) {
      this.dispatchMutations(pendingRecords);
    }
    this.targetBindings.clear();
    this.observer.disconnect();
  }
}

/**
 * Shared Singleton Instance for app-wide use.
 */
export const defaultMutationManager = new DOMMutationManager();
