/**
 * OptimisticUIManager - Zero-dependency JavaScript class for managing
 * optimistic UI state updates, automatic error rollbacks, action queuing,
 * idempotency tokens, and screen reader announcements.
 */
export class OptimisticUIManager {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.liveRegion] - Element used for ARIA live announcements.
   * @param {Function} [options.onError] - Global error handler (e.g. trigger toast notification).
   */
  constructor(options = {}) {
    this.liveRegion = options.liveRegion || this._getOrCreateLiveRegion();
    this.globalOnError = options.onError || null;
    this.inFlightControllers = new Map(); // Action key -> AbortController
  }

  /**
   * Execute an optimistic mutation lifecycle.
   *
   * @param {Object} config
   * @param {string} config.key - Unique key identifying the target action (e.g., 'like_article_102').
   * @param {HTMLElement} [config.targetElement] - Target DOM element for setting aria-busy pending state.
   * @param {Function} config.snapshot - Function returning immutable pre-mutation state snapshot.
   * @param {Function} config.applyOptimistic - Function executing synchronous UI mutation using (snapshotPayload).
   * @param {Function} config.asyncTask - Async function performing network API fetch. Receives ({ signal, idempotencyKey }).
   * @param {Function} config.rollback - Function restoring UI state using (snapshotPayload, error).
   * @param {Function} [config.reconcile] - Function updating UI with canonical server data using (serverData).
   * @param {string} [config.announceOptimistic] - Screen reader text to announce on immediate mutation.
   * @param {string} [config.announceSuccess] - Screen reader text to announce on API success.
   * @param {string} [config.announceError] - Screen reader text to announce on failure/rollback.
   * @param {Function} [config.onError] - Local error override handler.
   */
  async mutate(config) {
    const {
      key,
      targetElement,
      snapshot,
      applyOptimistic,
      asyncTask,
      rollback,
      reconcile,
      announceOptimistic,
      announceSuccess,
      announceError,
      onError
    } = config;

    if (!key || typeof snapshot !== 'function' || typeof applyOptimistic !== 'function' || typeof asyncTask !== 'function' || typeof rollback !== 'function') {
      throw new Error('OptimisticUIManager: Missing required configuration properties (key, snapshot, applyOptimistic, asyncTask, rollback).');
    }

    // 1. Abort prior in-flight request for the same action key to prevent race conditions
    if (this.inFlightControllers.has(key)) {
      this.inFlightControllers.get(key).abort();
    }

    const controller = new AbortController();
    this.inFlightControllers.set(key, controller);

    // 2. Capture immutable pre-mutation state snapshot
    const stateSnapshot = snapshot();

    // 3. Generate unique idempotency token
    const idempotencyKey = `opt_${key}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 4. Apply immediate visual mutation & set pending status
    try {
      applyOptimistic(stateSnapshot);

      if (targetElement) {
        targetElement.setAttribute('aria-busy', 'true');
        targetElement.dataset.optimisticPending = 'true';
      }

      if (announceOptimistic) {
        this.announce(announceOptimistic, 'polite');
      }
    } catch (mutationErr) {
      console.error('OptimisticUIManager: Synchronous mutation failed:', mutationErr);
      return;
    }

    // 5. Perform async network request
    try {
      const serverData = await asyncTask({
        signal: controller.signal,
        idempotencyKey
      });

      // Clear controller tracking on success
      if (this.inFlightControllers.get(key) === controller) {
        this.inFlightControllers.delete(key);
      }

      // Clear pending state
      if (targetElement) {
        targetElement.removeAttribute('aria-busy');
        delete targetElement.dataset.optimisticPending;
      }

      // Reconcile server payload if provided
      if (typeof reconcile === 'function') {
        reconcile(serverData);
      }

      if (announceSuccess) {
        this.announce(announceSuccess, 'polite');
      }

      return serverData;
    } catch (error) {
      // Ignore manual aborts triggered by rapid new actions
      if (error.name === 'AbortError') {
        return;
      }

      // Clean controller tracking
      if (this.inFlightControllers.get(key) === controller) {
        this.inFlightControllers.delete(key);
      }

      // Clear pending state
      if (targetElement) {
        targetElement.removeAttribute('aria-busy');
        delete targetElement.dataset.optimisticPending;
      }

      // 6. Perform deterministic state rollback
      try {
        rollback(stateSnapshot, error);
      } catch (rollbackErr) {
        console.error('OptimisticUIManager: Rollback callback threw an exception:', rollbackErr);
      }

      // Announce error to screen reader
      const failureMsg = announceError || 'Action failed. Changes were reverted.';
      this.announce(failureMsg, 'assertive');

      // Trigger local or global error handler
      if (typeof onError === 'function') {
        onError(error, stateSnapshot);
      } else if (typeof this.globalOnError === 'function') {
        this.globalOnError(error, stateSnapshot, key);
      }
    }
  }

  /**
   * Announce message to assistive technology live region.
   * @param {string} message
   * @param {'polite'|'assertive'} [politeness='polite']
   */
  announce(message, politeness = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', politeness);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 50);
  }

  /**
   * Helper to locate or lazily inject a visually-hidden ARIA live region.
   * @private
   */
  _getOrCreateLiveRegion() {
    let region = document.getElementById('opt-a11y-live-region');
    if (!region && typeof document !== 'undefined') {
      region = document.createElement('div');
      region.id = 'opt-a11y-live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(region);
    }
    return region;
  }
}
