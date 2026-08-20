/**
 * EventListenerManager - Production-grade Vanilla JS utility for declarative
 * event listener registration, scoped AbortController teardown, event delegation,
 * and passive event optimization.
 *
 * @example
 * const manager = new EventListenerManager();
 *
 * // 1. Delegated click listener
 * manager.delegate('.list-container', 'click', 'button[data-action]', (event, target) => {
 *   console.log('Action:', target.dataset.action);
 * });
 *
 * // 2. Passive scroll listener
 * manager.on(window, 'scroll', () => handleScroll(), { passive: true });
 *
 * // 3. Clean teardown on component unmount
 * manager.destroy();
 */
export class EventListenerManager {
  /**
   * Initialize a new EventListenerManager with an internal AbortController.
   */
  constructor() {
    this.controller = new AbortController();
    this.weakState = new WeakMap();
  }

  /**
   * Get the AbortSignal associated with this manager's lifecycle.
   * @returns {AbortSignal}
   */
  get signal() {
    return this.controller.signal;
  }

  /**
   * Register an event listener bound to this manager's AbortSignal lifecycle.
   *
   * @param {EventTarget} target - DOM element, Window, or Document.
   * @param {string} type - Event type (e.g. 'click', 'scroll', 'keydown').
   * @param {EventListener} handler - Callback function.
   * @param {AddEventListenerOptions|boolean} [options={}] - Options object or capture flag.
   * @returns {EventListenerManager} Returns `this` for chaining.
   */
  on(target, type, handler, options = {}) {
    if (!target || typeof target.addEventListener !== 'function') {
      throw new TypeError('Invalid event target provided to EventListenerManager.on()');
    }

    const opts = typeof options === 'boolean'
      ? { capture: options }
      : { ...options };

    // Automatically bind the manager's lifecycle signal
    opts.signal = this.signal;

    target.addEventListener(type, handler, opts);
    return this;
  }

  /**
   * Attach a delegated event listener to a container element.
   * Matches descendant targets using `Element.closest()`.
   *
   * @param {Element|string} container - Parent container element or CSS selector.
   * @param {string} type - Event type (e.g. 'click', 'change').
   * @param {string} targetSelector - CSS selector matching child targets.
   * @param {function(Event, Element): void} handler - Callback invoked with event and matched target element.
   * @param {AddEventListenerOptions} [options={}] - Listener options.
   * @returns {EventListenerManager}
   */
  delegate(container, type, targetSelector, handler, options = {}) {
    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!containerEl) {
      console.warn(`[EventListenerManager] Delegation container "${container}" not found in DOM.`);
      return this;
    }

    const delegatedHandler = (event) => {
      // Find closest element matching the target selector up to container root
      const matchedTarget = event.target.closest(targetSelector);

      if (matchedTarget && containerEl.contains(matchedTarget)) {
        handler.call(matchedTarget, event, matchedTarget);
      }
    };

    return this.on(containerEl, type, delegatedHandler, options);
  }

  /**
   * Attach a self-terminating transient listener for pointer drag operations.
   * Automatically teardown move/up listeners when pointer is released or cancelled.
   *
   * @param {Element} element - Drag target element.
   * @param {object} callbacks - Handlers for move and end events.
   * @param {function(PointerEvent): void} callbacks.onMove - Invoked on move.
   * @param {function(PointerEvent): void} [callbacks.onEnd] - Invoked on drop/cancel.
   */
  bindDrag(element, { onMove, onEnd }) {
    this.on(element, 'pointerdown', (startEvent) => {
      // Create sub-controller specifically for drag duration
      const dragController = new AbortController();
      const dragSignal = dragController.signal;

      const handleMove = (moveEvent) => {
        if (onMove) onMove(moveEvent);
      };

      const handleEnd = (endEvent) => {
        dragController.abort(); // Terminate sub-listeners
        if (onEnd) onEnd(endEvent);
      };

      window.addEventListener('pointermove', handleMove, { signal: dragSignal, passive: true });
      window.addEventListener('pointerup', handleEnd, { signal: dragSignal });
      window.addEventListener('pointercancel', handleEnd, { signal: dragSignal });
    });
  }

  /**
   * Associate state with a DOM element without preventing garbage collection.
   *
   * @param {Element} element - Target element.
   * @param {*} data - Metadata to associate.
   */
  setElementData(element, data) {
    this.weakState.set(element, data);
  }

  /**
   * Retrieve state associated with a DOM element.
   *
   * @param {Element} element - Target element.
   * @returns {*}
   */
  getElementData(element) {
    return this.weakState.get(element);
  }

  /**
   * Tear down all event listeners registered through this manager instance.
   */
  destroy() {
    this.controller.abort();
  }
}

export default EventListenerManager;
