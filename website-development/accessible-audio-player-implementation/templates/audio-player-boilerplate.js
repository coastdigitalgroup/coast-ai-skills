/**
 * AccessibleAudioController
 * A modular, lightweight, and framework-agnostic Vanilla JavaScript class
 * to wire custom HTML audio controls to a native HTML5 `<audio>` element.
 *
 * Complies with WCAG 2.1 AA keyboard navigation, focus management,
 * and device media session state management.
 */
export class AccessibleAudioController {
  /**
   * @param {HTMLElement} playerContainer - The outer wrapper element containing the audio player controls.
   * @param {Object} options - Configuration parameters.
   */
  constructor(playerContainer, options = {}) {
    if (!playerContainer) {
      throw new Error('AccessibleAudioController: Container element is required.');
    }

    this.container = playerContainer;
    this.options = {
      audioSelector: 'audio',
      playPauseBtnSelector: '[data-audio-control="play-pause"]',
      muteBtnSelector: '[data-audio-control="mute"]',
      timelineSelector: '[data-audio-control="timeline"]',
      volumeSelector: '[data-audio-control="volume"]',
      currentTimeSelector: '[data-audio-display="current-time"]',
      durationSelector: '[data-audio-display="duration"]',
      playIconSelector: '.icon-play',
      pauseIconSelector: '.icon-pause',
      volumeIconSelector: '.icon-volume',
      muteIconSelector: '.icon-muted',
      ...options
    };

    // Cache DOM Elements
    this.audio = this.container.querySelector(this.options.audioSelector);
    this.playPauseBtn = this.container.querySelector(this.options.playPauseBtnSelector);
    this.muteBtn = this.container.querySelector(this.options.muteBtnSelector);
    this.timeline = this.container.querySelector(this.options.timelineSelector);
    this.volumeSlider = this.container.querySelector(this.options.volumeSelector);
    this.currentTimeDisplay = this.container.querySelector(this.options.currentTimeSelector);
    this.durationDisplay = this.container.querySelector(this.options.durationSelector);

    this.playIcon = this.container.querySelector(this.options.playIconSelector);
    this.pauseIcon = this.container.querySelector(this.options.pauseIconSelector);
    this.volumeIcon = this.container.querySelector(this.options.volumeIconSelector);
    this.muteIcon = this.container.querySelector(this.options.muteIconSelector);

    if (!this.audio) {
      throw new Error('AccessibleAudioController: Native <audio> element not found.');
    }

    // State Variables
    this.isSeeking = false;
    this.boundListeners = {};

    this.init();
  }

  /**
   * Initializes bindings, state, and event listeners.
   */
  init() {
    this.setupMediaSession();
    this.bindEvents();
    this.resetUI();
  }

  /**
   * Helper to bind events and preserve correct 'this' execution context.
   */
  addEventListenerWithCleanup(element, eventName, handler) {
    if (!element) return;
    const boundHandler = handler.bind(this);
    element.addEventListener(eventName, boundHandler);

    // Track listener details for clean unbinding inside destroy()
    const key = `${element.id || Math.random()}_${eventName}`;
    this.boundListeners[key] = { element, eventName, handler: boundHandler };
  }

  /**
   * Bind event listeners to custom UI inputs and native audio elements.
   */
  bindEvents() {
    // 1. Native Audio State Change Listeners (Crucial for external hardware sync)
    this.addEventListenerWithCleanup(this.audio, 'play', this.onPlay);
    this.addEventListenerWithCleanup(this.audio, 'pause', this.onPause);
    this.addEventListenerWithCleanup(this.audio, 'timeupdate', this.onTimeUpdate);
    this.addEventListenerWithCleanup(this.audio, 'durationchange', this.onDurationChange);
    this.addEventListenerWithCleanup(this.audio, 'loadedmetadata', this.onDurationChange);
    this.addEventListenerWithCleanup(this.audio, 'volumechange', this.onVolumeChange);
    this.addEventListenerWithCleanup(this.audio, 'ended', this.onEnded);

    // 2. Button Interactive Click Toggles
    this.addEventListenerWithCleanup(this.playPauseBtn, 'click', this.togglePlay);
    this.addEventListenerWithCleanup(this.muteBtn, 'click', this.toggleMute);

    // 3. Native Slider Interactions
    if (this.timeline) {
      this.addEventListenerWithCleanup(this.timeline, 'input', this.onTimelineInput);
      this.addEventListenerWithCleanup(this.timeline, 'change', this.onTimelineChange);
    }
    if (this.volumeSlider) {
      this.addEventListenerWithCleanup(this.volumeSlider, 'input', this.onVolumeSliderInput);
    }

    // 4. Global Keyboard Hotkeys (Only active when focusing inside player)
    this.addEventListenerWithCleanup(this.container, 'keydown', this.onKeyDown);
  }

  /**
   * Set up initial visual layouts.
   */
  resetUI() {
    if (this.currentTimeDisplay) {
      this.currentTimeDisplay.textContent = '0:00';
    }
    this.onDurationChange();
    this.onVolumeChange();
  }

  /**
   * Integrates with System Media Controls (Lock screens, Bluetooth keyboards).
   */
  setupMediaSession() {
    if ('mediaSession' in navigator) {
      const title = this.container.getAttribute('data-track-title') || 'Custom Track';
      const artist = this.container.getAttribute('data-track-artist') || 'Unknown Artist';

      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist
      });

      // Bind OS-level events to custom triggers
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const offset = details.seekOffset || 10;
        this.audio.currentTime = Math.max(this.audio.currentTime - offset, 0);
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const offset = details.seekOffset || 10;
        this.audio.currentTime = Math.min(this.audio.currentTime + offset, this.audio.duration);
      });
    }
  }

  /**
   * Native audio handlers.
   */
  play() {
    this.audio.play().catch(error => {
      console.warn('AccessibleAudioController: Playback blocked by browser policy.', error);
    });
  }

  pause() {
    this.audio.pause();
  }

  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
  }

  /**
   * Event callback: Native play triggered.
   */
  onPlay() {
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-pressed', 'true');
      this.playPauseBtn.setAttribute('aria-label', 'Pause');
    }
    if (this.playIcon) this.playIcon.style.display = 'none';
    if (this.pauseIcon) this.pauseIcon.style.display = 'block';

    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
    }
  }

  /**
   * Event callback: Native pause triggered.
   */
  onPause() {
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-pressed', 'false');
      this.playPauseBtn.setAttribute('aria-label', 'Play');
    }
    if (this.playIcon) this.playIcon.style.display = 'block';
    if (this.pauseIcon) this.pauseIcon.style.display = 'none';

    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  }

  /**
   * Event callback: Playback progress. Updates timeline slider and text label.
   */
  onTimeUpdate() {
    if (this.isSeeking) return;

    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration || 0;

    if (this.timeline) {
      this.timeline.value = currentTime;
    }

    if (this.currentTimeDisplay) {
      this.currentTimeDisplay.textContent = this.formatTime(currentTime);
    }
  }

  /**
   * Event callback: Track duration became available.
   */
  onDurationChange() {
    const duration = this.audio.duration;

    // Avoid Nan displays if loaded asynchronously
    const isValidDuration = isFinite(duration) && duration > 0;
    const durationText = isValidDuration ? this.formatTime(duration) : '0:00';

    if (this.durationDisplay) {
      this.durationDisplay.textContent = durationText;
    }

    if (this.timeline && isValidDuration) {
      this.timeline.max = duration;
    }
  }

  /**
   * Event callback: Volume or mute shifted. Updates visual layouts.
   */
  onVolumeChange() {
    const isMuted = this.audio.muted || this.audio.volume === 0;

    if (this.muteBtn) {
      this.muteBtn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
      this.muteBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
    }

    // Toggle SVGs
    if (this.volumeIcon) this.volumeIcon.style.display = isMuted ? 'none' : 'block';
    if (this.muteIcon) this.muteIcon.style.display = isMuted ? 'block' : 'none';

    if (this.volumeSlider) {
      this.volumeSlider.value = isMuted ? 0 : this.audio.volume;
    }
  }

  /**
   * Event callback: Track reached end.
   */
  onEnded() {
    this.onPause();
    if (this.timeline) this.timeline.value = 0;
    if (this.currentTimeDisplay) this.currentTimeDisplay.textContent = '0:00';
  }

  /**
   * Slider timeline scrubbing triggers.
   */
  onTimelineInput(event) {
    this.isSeeking = true;
    const targetValue = parseFloat(event.target.value);
    if (this.currentTimeDisplay) {
      this.currentTimeDisplay.textContent = this.formatTime(targetValue);
    }
  }

  onTimelineChange(event) {
    this.isSeeking = false;
    const targetValue = parseFloat(event.target.value);
    this.audio.currentTime = targetValue;
  }

  /**
   * Slider volume triggers.
   */
  onVolumeSliderInput(event) {
    const targetValue = parseFloat(event.target.value);
    this.audio.volume = targetValue;
    if (targetValue > 0 && this.audio.muted) {
      this.audio.muted = false;
    }
  }

  /**
   * Custom hotkey commands for focus environments.
   */
  onKeyDown(event) {
    const activeEl = document.activeElement;
    if (!activeEl) return;

    // Guard: ignore keys if keyboard focus is targeting a text field
    if (activeEl.tagName === 'INPUT' && activeEl.type === 'text') {
      return;
    }

    switch (event.key) {
      case ' ':
        // Spacebar triggers play / pause
        event.preventDefault(); // Prevent standard page scrolling action
        this.togglePlay();
        break;
      case 'm':
      case 'M':
        // M key toggles mute
        event.preventDefault();
        this.toggleMute();
        break;
      default:
        break;
    }
  }

  /**
   * Utility: Format raw seconds into standard MM:SS clock string.
   */
  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Safely dismounts controller class to prevent memory leaks in Single Page Apps.
   */
  destroy() {
    // Unbind all events captured under constructor phase
    Object.keys(this.boundListeners).forEach(key => {
      const { element, eventName, handler } = this.boundListeners[key];
      if (element) {
        element.removeEventListener(eventName, handler);
      }
    });

    this.boundListeners = {};

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
    }
  }
}
