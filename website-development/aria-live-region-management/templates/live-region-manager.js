/**
 * LiveRegionManager - Accessible ARIA Live Region Announcer
 *
 * Provides production-ready screen reader announcements for dynamic UI changes,
 * enforcing persistent DOM containers, debouncing rapid search/filter events,
 * micro-clearing text nodes to repeat identical messages, and queuing consecutive status updates.
 */

export class LiveRegionManager {
  /**
   * @param {Object} options
   * @param {string} [options.politeId='a11y-live-polite'] - ID of polite live container
   * @param {string} [options.assertiveId='a11y-live-assertive'] - ID of assertive live container
   * @param {number} [options.queueGapMs=800] - Gap in ms between queued announcements
   */
  constructor(options = {}) {
    this.politeId = options.politeId || 'a11y-live-polite';
    this.assertiveId = options.assertiveId || 'a11y-live-assertive';
    this.queueGapMs = options.queueGapMs || 800;

    this.debounceTimer = null;
    this.queue = [];
    this.isProcessing = false;

    this._ensureContainersExist();
  }

  /**
   * Announce a status message to screen readers.
   *
   * @param {string} message - Text content to announce.
   * @param {'polite' | 'assertive'} [politeness='polite'] - Priority level.
   * @param {number} [debounceMs=0] - Optional debounce duration in ms.
   */
  announce(message, politeness = 'polite', debounceMs = 0) {
    if (!message || typeof message !== 'string') return;

    const trimmed = message.trim();
    if (!trimmed) return;

    if (debounceMs > 0) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this._dispatch(trimmed, politeness);
      }, debounceMs);
    } else {
      this._enqueue(trimmed, politeness);
    }
  }

  /**
   * Clear all live region text nodes immediately and empty the pending queue.
   */
  clear() {
    clearTimeout(this.debounceTimer);
    this.queue = [];
    this.isProcessing = false;

    const polite = document.getElementById(this.politeId);
    const assertive = document.getElementById(this.assertiveId);

    if (polite) polite.textContent = '';
    if (assertive) assertive.textContent = '';
  }

  /**
   * Ensure live region containers exist in static DOM. If absent, injects them.
   * @private
   */
  _ensureContainersExist() {
    if (typeof document === 'undefined') return;

    this._getOrCreateContainer(this.politeId, 'polite');
    this._getOrCreateContainer(this.assertiveId, 'assertive');
  }

  /**
   * Get an existing container or create a visually hidden container.
   * @private
   */
  _getOrCreateContainer(id, politeness) {
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.setAttribute('aria-live', politeness);
      container.setAttribute('aria-atomic', 'true');
      container.setAttribute('aria-relevant', 'additions text');

      // Visually hidden styles
      Object.assign(container.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0'
      });

      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Push message to processing queue.
   * @private
   */
  _enqueue(message, politeness) {
    this.queue.push({ message, politeness });
    if (!this.isProcessing) {
      this._processQueue();
    }
  }

  /**
   * Process pending queue sequentially.
   * @private
   */
  _processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const { message, politeness } = this.queue.shift();
    this._dispatch(message, politeness);

    setTimeout(() => {
      this._processQueue();
    }, this.queueGapMs);
  }

  /**
   * Dispatch text to target DOM container with microtask clearing.
   * @private
   */
  _dispatch(message, politeness) {
    const id = politeness === 'assertive' ? this.assertiveId : this.politeId;
    const container = document.getElementById(id) || this._getOrCreateContainer(id, politeness);

    // Step 1: Wipe text node to force AT tree mutation even on identical strings
    container.textContent = '';

    // Step 2: Inject text after 50ms reflow delay
    setTimeout(() => {
      container.textContent = message;
    }, 50);
  }
}
