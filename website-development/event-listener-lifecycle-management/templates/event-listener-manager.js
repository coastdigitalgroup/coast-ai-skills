/**
 * EventListenerManager - A production-ready, zero-dependency controller
 * for managing DOM event listener lifecycles, event delegation, passive scrolling,
 * and signal-backed batch teardowns.
 */
export class EventListenerManager {
  /**
   * @param {Object} [options]
   * @param {AbortSignal} [options.parentSignal] - Optional parent signal to chain abort triggers
   */
  constructor(options = {}) {
    this.controller = new AbortController();
    this.isDestroyed = false;

    if (options.parentSignal) {
      if (options.parentSignal.aborted) {
        this.destroy();
      } else {
        options.parentSignal.addEventListener('abort', () => this.destroy(), {
          signal: this.controller.signal,
        });
      }
    }
  }

  /**
   * Get the active AbortSignal managed by this instance.
   * @returns {AbortSignal}
   */
  get signal() {
    return this.controller.signal;
  }

  /**
   * Attach a standard event listener bound to this manager's lifecycle.
   *
   * @param {EventTarget} target - Target DOM element, window, or document
   * @param {string} type - Event type (e.g., 'click', 'resize', 'scroll')
   * @param {EventListener|Function} handler - Event callback function
   * @param {AddEventListenerOptions|boolean} [options={}] - Standard addEventListener options
   * @returns {EventListenerManager} Self for chaining
   */
  on(target, type, handler, options = {}) {
    if (this.isDestroyed) return this;

    const listenerOptions = typeof options === 'boolean'
      ? { capture: options }
      : { ...options };

    listenerOptions.signal = this.controller.signal;
    target.addEventListener(type, handler, listenerOptions);
    return this;
  }

  /**
   * Attach a delegated event listener to a container element.
   * Intercepts events bubbling up from child elements matching the selector.
   *
   * @param {Element} container - Parent container element
   * @param {string} selector - CSS selector to match target elements against
   * @param {string} type - Event type (e.g., 'click', 'keydown')
   * @param {Function} handler - Callback invoked with (event, matchedTarget)
   * @param {AddEventListenerOptions} [options={}] - Additional listener options
   * @returns {EventListenerManager} Self for chaining
   */
  delegate(container, selector, type, handler, options = {}) {
    if (this.isDestroyed || !container) return this;

    const delegatedHandler = (event) => {
      const matchedTarget = event.target.closest(selector);
      if (matchedTarget && container.contains(matchedTarget)) {
        handler.call(matchedTarget, event, matchedTarget);
      }
    };

    return this.on(container, type, delegatedHandler, options);
  }

  /**
   * Attach a high-performance passive event listener (ideal for scroll, wheel, touch).
   *
   * @param {EventTarget} target - Target element or window
   * @param {string} type - Event type ('scroll', 'wheel', 'touchmove')
   * @param {Function} handler - Callback function
   * @returns {EventListenerManager} Self for chaining
   */
  passive(target, type, handler) {
    return this.on(target, type, handler, { passive: true });
  }

  /**
   * Create a transient tracking session for gesture/drag interactions.
   * Listens to pointermove/pointerup on document and automatically cleans up when gesture ends.
   *
   * @param {PointerEvent} startEvent - Initial pointerdown event
   * @param {Object} callbacks
   * @param {Function} [callbacks.onMove] - Invoked on pointermove
   * @param {Function} [callbacks.onEnd] - Invoked on pointerup/pointercancel
   */
  trackGesture(startEvent, { onMove, onEnd } = {}) {
    if (this.isDestroyed) return;

    const gestureController = new AbortController();
    const gestureSignal = gestureController.signal;

    const stopGesture = (event) => {
      gestureController.abort();
      if (onEnd) onEnd(event);
    };

    if (onMove) {
      document.addEventListener('pointermove', onMove, {
        signal: gestureSignal,
        passive: true,
      });
    }

    document.addEventListener('pointerup', stopGesture, {
      signal: gestureSignal,
      once: true,
    });

    document.addEventListener('pointercancel', stopGesture, {
      signal: gestureSignal,
      once: true,
    });
  }

  /**
   * Destroy the manager and immediately remove all registered event listeners.
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.controller.abort();
  }
}
