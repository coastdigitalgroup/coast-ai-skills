/**
 * IdleMonitor
 *
 * A robust, performance-optimized, and accessible client-side inactivity tracking utility.
 * Handles browser background tab throttling, multi-tab state synchronization,
 * and exposes clean callbacks for accessibility-compliant warning modals.
 */
class IdleMonitor {
  /**
   * @param {Object} options Configuration options
   * @param {number} options.idleThreshold Inactivity timeout in milliseconds (default: 15 minutes)
   * @param {number} options.warningDuration Warning countdown duration in milliseconds (default: 1 minute)
   * @param {string[]} options.activityEvents DOM events to listen to for resetting idle time (default: standard pointer/keyboard/scroll)
   * @param {number} options.throttleDelay Minimum milliseconds between processing active interactions (default: 1000ms)
   * @param {string} options.syncChannelName BroadcastChannel name for multi-tab sync (default: 'idle_monitor_sync')
   * @param {Function} options.onWarning Callback triggered when entering warning state. Receives remaining time in ms.
   * @param {Function} options.onTimeout Callback triggered when session expires.
   * @param {Function} options.onActivity Callback triggered when user registers activity (resets idle state).
   * @param {Function} options.onRemainingTimeUpdate Callback triggered on heartbeat ticks during the warning countdown. Receives remaining time in ms.
   */
  constructor(options = {}) {
    this.idleThreshold = options.idleThreshold || 15 * 60 * 1000; // 15 mins
    this.warningDuration = options.warningDuration || 60 * 1000; // 1 min
    this.activityEvents = options.activityEvents || [
      'mousedown', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'
    ];
    this.throttleDelay = options.throttleDelay || 1000; // Throttle to 1s
    this.syncChannelName = options.syncChannelName || 'idle_monitor_sync';

    // Callbacks
    this.onWarning = options.onWarning || null;
    this.onTimeout = options.onTimeout || null;
    this.onActivity = options.onActivity || null;
    this.onRemainingTimeUpdate = options.onRemainingTimeUpdate || null;

    // Internal State
    this.lastActivityTime = Date.now();
    this.expirationTime = this.lastActivityTime + this.idleThreshold;
    this.isWarningActive = false;
    this.isDestroyed = false;
    this.heartbeatIntervalId = null;

    // Event throttling tracker
    this.lastProcessedTime = 0;

    // Cross-tab Synchronization
    this.syncChannel = null;

    // Bind event handlers
    this.handleInteraction = this.handleInteraction.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.syncReceived = this.syncReceived.bind(this);
    this.checkSessionState = this.checkSessionState.bind(this);
  }

  /**
   * Starts the inactivity tracking process.
   */
  start() {
    if (this.isDestroyed) return;

    this.resetTimerLocally();
    this.setupListeners();
    this.setupSyncChannel();

    // Start a precision heartbeat checker running every 500ms
    this.heartbeatIntervalId = setInterval(this.checkSessionState, 500);

    // Initial check in case of loaded state
    this.checkSessionState();
  }

  /**
   * Sets up global event listeners with passive flags where appropriate.
   */
  setupListeners() {
    this.activityEvents.forEach(eventName => {
      // Use passive event listeners for high-frequency scroll/pointer events to prevent scroll-jank
      const isPassiveEvent = ['scroll', 'touchstart', 'wheel', 'touchmove', 'pointermove'].includes(eventName);
      window.addEventListener(eventName, this.handleInteraction, isPassiveEvent ? { passive: true } : false);
    });

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Cleans up event listeners and intervals to prevent memory leaks.
   */
  destroy() {
    this.isDestroyed = true;

    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }

    this.activityEvents.forEach(eventName => {
      window.removeEventListener(eventName, this.handleInteraction);
    });

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.syncChannel) {
      this.syncChannel.close();
      this.syncChannel = null;
    }
  }

  /**
   * Initializes the BroadcastChannel for cross-tab communication.
   */
  setupSyncChannel() {
    if ('BroadcastChannel' in window) {
      try {
        this.syncChannel = new BroadcastChannel(this.syncChannelName);
        this.syncChannel.onmessage = this.syncReceived;
      } catch (err) {
        console.warn('Failed to initialize BroadcastChannel:', err);
        this.setupLocalStorageFallback();
      }
    } else {
      this.setupLocalStorageFallback();
    }
  }

  /**
   * Fallback for tabs sync when BroadcastChannel is not supported.
   */
  setupLocalStorageFallback() {
    window.addEventListener('storage', (event) => {
      if (event.key === `${this.syncChannelName}_activity`) {
        const remoteTime = parseInt(event.newValue, 10);
        if (!isNaN(remoteTime)) {
          this.resetTimerLocally(remoteTime, false);
        }
      }
    });
  }

  /**
   * Broadcasts a local activity reset to all other open tabs.
   * @param {number} timestamp The timestamp of activity.
   */
  broadcastActivity(timestamp) {
    if (this.syncChannel) {
      this.syncChannel.postMessage({ type: 'activity_reset', timestamp });
    } else {
      // LocalStorage Fallback: triggers 'storage' event in other tabs
      localStorage.setItem(`${this.syncChannelName}_activity`, timestamp.toString());
    }
  }

  /**
   * Handles incoming synchronization signals from other tabs.
   */
  syncReceived(event) {
    if (event.data && event.data.type === 'activity_reset') {
      this.resetTimerLocally(event.data.timestamp, false);
    }
  }

  /**
   * Throttled input handler to record active interactions.
   */
  handleInteraction() {
    const now = Date.now();
    // Throttle checks to avoid hammering CPU during rapid movements/scrolling
    if (now - this.lastProcessedTime >= this.throttleDelay) {
      this.lastProcessedTime = now;
      this.resetTimerLocally(now, true);
    }
  }

  /**
   * Resets the inactivity timers.
   * @param {number} [timestamp] The epoch time to reset to (defaults to Date.now()).
   * @param {boolean} [shouldBroadcast] Whether to broadcast this update to other tabs (default: true).
   */
  resetTimerLocally(timestamp = Date.now(), shouldBroadcast = true) {
    this.lastActivityTime = timestamp;
    this.expirationTime = this.lastActivityTime + this.idleThreshold;

    if (this.isWarningActive) {
      this.isWarningActive = false;
      if (this.onActivity) {
        this.onActivity();
      }
    }

    if (shouldBroadcast) {
      this.broadcastActivity(this.lastActivityTime);
    }
  }

  /**
   * Handles visibility changes (e.g., user returns to this backgrounded tab).
   * Instantly re-evaluates absolute time to avoid displaying laggy state.
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.checkSessionState();
    }
  }

  /**
   * The core heartbeat runner evaluating state based on absolute epoch timestamps.
   * Eliminates errors caused by browser background timer freezing.
   */
  checkSessionState() {
    if (this.isDestroyed) return;

    const now = Date.now();
    const remainingTime = this.expirationTime - now;

    // Case 1: Time has fully expired
    if (remainingTime <= 0) {
      this.destroy(); // Cease all tracking
      if (this.onTimeout) {
        this.onTimeout();
      }
      return;
    }

    // Case 2: Within the warning threshold
    if (remainingTime <= this.warningDuration) {
      if (!this.isWarningActive) {
        this.isWarningActive = true;
        if (this.onWarning) {
          this.onWarning(remainingTime);
        }
      }

      if (this.onRemainingTimeUpdate) {
        this.onRemainingTimeUpdate(remainingTime);
      }
    } else {
      // Handle the edge case where activity was synchronized from another tab
      // and we need to dismiss an active warning state locally.
      if (this.isWarningActive) {
        this.isWarningActive = false;
        if (this.onActivity) {
          this.onActivity();
        }
      }
    }
  }

  /**
   * Proactively triggers manual session extension.
   */
  extendSession() {
    this.resetTimerLocally(Date.now(), true);
  }
}

// Export for ES Modules support if requested, otherwise attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IdleMonitor;
} else if (typeof define === 'function' && define.amd) {
  define(() => IdleMonitor);
} else {
  window.IdleMonitor = IdleMonitor;
}
