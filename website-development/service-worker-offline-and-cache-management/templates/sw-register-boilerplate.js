/**
 * Service Worker Registration and Lifecycle Manager Boilerplate
 * A reusable, class-based Vanilla JS controller to handle clean registration,
 * update listening, and triggers for custom UI alerts.
 */

export class ServiceWorkerController {
  /**
   * @param {Object} options Configuration options
   * @param {string} options.scriptPath Path to the Service Worker file (default: '/sw.js')
   * @param {Function} options.onUpdateAvailable Callback fired when a new Service Worker is waiting (passes waiting worker instance)
   * @param {Function} options.onInstalledSuccess Callback fired on the very first successful service worker installation
   */
  constructor(options = {}) {
    this.scriptPath = options.scriptPath || '/sw.js';
    this.onUpdateAvailable = options.onUpdateAvailable || null;
    this.onInstalledSuccess = options.onInstalledSuccess || null;
    this.registration = null;
    this.isRefreshing = false;
  }

  /**
   * Initializes Service Worker Registration
   */
  init() {
    // 1. Check browser compatibility
    if (!('serviceWorker' in navigator)) {
      console.warn('[SW Controller] Service Workers are not supported in this browser.');
      return;
    }

    // 2. Wait until page loads to prevent competing with main-thread rendering performance
    window.addEventListener('load', () => {
      this.register();
      this.setupControllerChangeListener();
    });
  }

  /**
   * Registers the Service Worker and binds lifecycle state listeners
   */
  async register() {
    try {
      this.registration = await navigator.serviceWorker.register(this.scriptPath);
      console.log('[SW Controller] Registered with scope:', this.registration.scope);

      // A. Check if there's already an active service worker waiting in the background
      if (this.registration.waiting) {
        this.handleUpdate(this.registration.waiting);
        return;
      }

      // B. Monitor for an installing worker transitioning to installed
      this.registration.addEventListener('updatefound', () => {
        const installingWorker = this.registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // A controller already exists, indicating this is a real update
              this.handleUpdate(installingWorker);
            } else {
              // No controller exists, meaning this is the very first install success
              if (this.onInstalledSuccess) {
                this.onInstalledSuccess();
              }
            }
          }
        });
      });
    } catch (error) {
      console.error('[SW Controller] Registration failed:', error);
    }
  }

  /**
   * Handles update discovery by triggering user-defined callbacks
   * @param {ServiceWorker} waitingWorker The Service Worker waiting to activate
   */
  handleUpdate(waitingWorker) {
    console.log('[SW Controller] A new Service Worker is waiting to activate.');
    if (this.onUpdateAvailable) {
      this.onUpdateAvailable(waitingWorker);
    }
  }

  /**
   * Posts the skipWaiting command directly to the waiting worker.
   * This should be called by your update banner click event.
   * @param {ServiceWorker} waitingWorker The target waiting worker
   */
  activateUpdate(waitingWorker) {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Binds the controllerchange listener to automatically reload the page
   * once skipWaiting completes and the new worker takes control.
   */
  setupControllerChangeListener() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.isRefreshing) return;
      this.isRefreshing = true;
      console.log('[SW Controller] Active worker changed. Reloading page...');
      window.location.reload();
    });
  }
}
