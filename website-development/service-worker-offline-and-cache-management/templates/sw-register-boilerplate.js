/**
 * Service Worker Client Registration (sw-register-boilerplate.js)
 * Clean, production-ready class/utility to manage worker life cycle and updates.
 */

class ServiceWorkerManager {
  constructor(swUrl = '/sw.js', options = { scope: '/' }) {
    this.swUrl = swUrl;
    this.options = options;
    this.registration = null;
    this.listeners = new Set();
  }

  /**
   * Initialize and register the service worker
   */
  init() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported in this browser.');
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register(this.swUrl, this.options)
        .then((registration) => {
          this.registration = registration;
          console.log('[SW Manager] Service Worker registered:', registration.scope);

          // 1. Check if there is already a waiting service worker to notify
          if (registration.waiting) {
            this.notifyUpdateAvailable(registration.waiting);
          }

          // 2. Watch for dynamic updates being detected/installed
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Pre-cached assets are ready, worker is waiting to take control
                this.notifyUpdateAvailable(installingWorker);
              }
            });
          });
        })
        .catch((error) => {
          console.error('[SW Manager] Registration failed:', error);
        });
    });

    // 3. Coordinate page refresh when a new service worker skips waiting and takes over
    let isRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (isRefreshing) return;
      isRefreshing = true;
      console.log('[SW Manager] Active worker swapped. Reloading application...');
      window.location.reload();
    });
  }

  /**
   * Register callbacks for update notifications
   */
  onUpdateAvailable(callback) {
    this.listeners.add(callback);
  }

  /**
   * Trigger update available callbacks
   */
  notifyUpdateAvailable(waitingWorker) {
    this.listeners.forEach((callback) => {
      try {
        callback(() => this.triggerTakeover(waitingWorker));
      } catch (err) {
        console.error('[SW Manager] Error in update callback:', err);
      }
    });
  }

  /**
   * Signal the waiting worker to skip waiting and activate
   */
  triggerTakeover(waitingWorker) {
    if (waitingWorker) {
      console.log('[SW Manager] Dispatching SKIP_WAITING to waiting worker.');
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}

// Example instantiation and usage in client script:
/*
const swManager = new ServiceWorkerManager('/sw.js');

swManager.onUpdateAvailable((confirmUpdate) => {
  // Create your custom UI Toast or Popup here
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: #333; color: #fff; padding: 15px; border-radius: 8px; z-index: 10000;">
      A new update is available!
      <button id="sw-update-btn" style="margin-left: 10px; padding: 5px 10px; cursor: pointer;">Update Now</button>
    </div>
  `;
  document.body.appendChild(toast);

  document.getElementById('sw-update-btn').addEventListener('click', () => {
    confirmUpdate(); // Triggers skipWaiting and automatic reload
  });
});

swManager.init();
*/
export default ServiceWorkerManager;
