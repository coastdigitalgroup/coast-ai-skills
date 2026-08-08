/**
 * AccessibleAudioPlayer
 * A lightweight, portable, and fully accessible Vanilla JS controller class
 * that links custom HTML5 audio UI controls to a native HTML5 Audio element.
 *
 * Supports complete keyboard interaction, screen-reader polite status telemetry,
 * standard speed rates, and cross-browser custom range sliders.
 */
export class AccessibleAudioPlayer {
  /**
   * @param {HTMLElement} container - The wrapper element containing all player UI controls
   * @param {string} audioSrc - The URL of the target audio asset to load
   */
  constructor(container, audioSrc) {
    if (!container) {
      throw new Error("AccessibleAudioPlayer initialization failed: container element is required.");
    }
    if (!audioSrc) {
      throw new Error("AccessibleAudioPlayer initialization failed: audio source URL is required.");
    }

    this.container = container;

    // Create native media element programmatically to ensure portability and lifecycle isolation
    this.audio = new Audio();
    this.audio.src = audioSrc;
    this.audio.preload = 'metadata';

    // UI Element Selections
    this.playPauseBtn = container.querySelector('#audio-play-pause');
    this.playIcon = this.playPauseBtn ? this.playPauseBtn.querySelector('.icon-play') : null;
    this.pauseIcon = this.playPauseBtn ? this.playPauseBtn.querySelector('.icon-pause') : null;

    this.seekSlider = container.querySelector('#audio-seek-slider');
    this.currentTimeDisplay = container.querySelector('#audio-current-time');
    this.durationDisplay = container.querySelector('#audio-duration-display');

    this.skipBackBtn = container.querySelector('#audio-skip-back');
    this.skipForwardBtn = container.querySelector('#audio-skip-forward');

    this.muteBtn = container.querySelector('#audio-mute-toggle');
    this.volHighIcon = this.muteBtn ? this.muteBtn.querySelector('.icon-volume-high') : null;
    this.volMutedIcon = this.muteBtn ? this.muteBtn.querySelector('.icon-volume-muted') : null;
    this.volumeSlider = container.querySelector('#audio-volume-slider');

    this.speedSelector = container.querySelector('#audio-speed-selector');
    this.liveStatus = container.querySelector('#audio-live-status');

    // State Guards & Debouncing
    this.isSeeking = false;
    this.announcementDebounce = null;

    this.init();
  }

  /**
   * Initializes bindings and keyboard shortcut setups
   */
  init() {
    this.bindEvents();
    this.setupKeyboardShortcuts();

    // Set initial volume values if slider exists
    if (this.volumeSlider) {
      const vol = parseFloat(this.volumeSlider.value);
      this.audio.volume = isNaN(vol) ? 1.0 : vol;
    }
  }

  /**
   * Binds HTML5 Audio media events directly to UI updates
   */
  bindEvents() {
    // Play / Pause toggling
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => this.togglePlayback());
    }
    this.audio.addEventListener('play', () => this.onPlayState());
    this.audio.addEventListener('pause', () => this.onPauseState());
    this.audio.addEventListener('ended', () => this.onEndedState());

    // Seeking & Progress Synchronization
    this.audio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());

    if (this.seekSlider) {
      this.seekSlider.addEventListener('input', (e) => this.onSeekInput(e));
      this.seekSlider.addEventListener('change', (e) => this.onSeekChange(e));
    }

    // Skip Back / Skip Forward Actions
    if (this.skipBackBtn) {
      this.skipBackBtn.addEventListener('click', () => this.skip(-10));
    }
    if (this.skipForwardBtn) {
      this.skipForwardBtn.addEventListener('click', () => this.skip(10));
    }

    // Volume & Muting Controls
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => this.toggleMute());
    }
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => this.onVolumeInput(e));
    }
    this.audio.addEventListener('volumechange', () => this.onVolumeChanged());

    // Playback Speed Selector
    if (this.speedSelector) {
      this.speedSelector.addEventListener('change', () => this.onSpeedChanged());
    }

    // Capture Buffer Waiting/Stalling States for Accessible Loading Feedback
    this.audio.addEventListener('waiting', () => {
      this.announceToScreenReader("Buffering audio. Please wait...");
    });
    this.audio.addEventListener('playing', () => {
      // Clear buffering status once audio resumes playing
      this.liveStatus.textContent = '';
    });
  }

  /**
   * Toggles audio play/pause state safely catching autoplay rejection errors
   */
  togglePlayback() {
    if (this.audio.paused) {
      this.audio.play().catch(err => {
        console.error("Playback failed: Interaction requirement not met.", err);
        this.announceToScreenReader("Playback blocked. Please interact with the page and click Play again.");
      });
    } else {
      this.audio.pause();
    }
  }

  onPlayState() {
    if (this.playIcon) this.playIcon.classList.add('hidden');
    if (this.pauseIcon) this.pauseIcon.classList.remove('hidden');
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-label', 'Pause');
    }
    this.announceToScreenReader("Playing");
  }

  onPauseState() {
    if (this.playIcon) this.playIcon.classList.remove('hidden');
    if (this.pauseIcon) this.pauseIcon.classList.add('hidden');
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-label', 'Play');
    }
    this.announceToScreenReader("Paused");
  }

  onEndedState() {
    if (this.playIcon) this.playIcon.classList.remove('hidden');
    if (this.pauseIcon) this.pauseIcon.classList.add('hidden');
    if (this.playPauseBtn) {
      this.playPauseBtn.setAttribute('aria-label', 'Play');
    }
    this.announceToScreenReader("Playback completed");

    if (this.seekSlider) {
      this.seekSlider.value = '0';
      this.seekSlider.setAttribute('aria-valuenow', '0');
    }
    if (this.currentTimeDisplay) {
      this.currentTimeDisplay.textContent = '0:00';
    }
  }

  onMetadataLoaded() {
    const duration = this.audio.duration;
    if (isNaN(duration) || !isFinite(duration)) return;

    if (this.seekSlider) {
      this.seekSlider.max = duration.toString();
      this.seekSlider.setAttribute('aria-valuemax', Math.round(duration).toString());
    }
    if (this.durationDisplay) {
      this.durationDisplay.textContent = this.formatTime(duration);
    }
  }

  onTimeUpdate() {
    // Only update progress slider if the user isn't actively dragging it
    if (!this.isSeeking) {
      const current = this.audio.currentTime;
      if (this.seekSlider) {
        this.seekSlider.value = current.toString();
        this.seekSlider.setAttribute('aria-valuenow', Math.round(current).toString());
        this.updateSeekSliderAriaText(current);
      }
      if (this.currentTimeDisplay) {
        this.currentTimeDisplay.textContent = this.formatTime(current);
      }
    }
  }

  /**
   * Fires while dragging/seeking slider visually
   */
  onSeekInput(e) {
    this.isSeeking = true;
    const value = parseFloat(e.target.value);
    if (this.currentTimeDisplay) {
      this.currentTimeDisplay.textContent = this.formatTime(value);
    }
  }

  /**
   * Fires only when slider dragging is completed/released
   */
  onSeekChange(e) {
    this.isSeeking = false;
    const value = parseFloat(e.target.value);
    this.audio.currentTime = value;
    this.updateSeekSliderAriaText(value);
    this.announceSeekToScreenReader(value);
  }

  /**
   * Skips forward or backward by the specified seconds interval
   * @param {number} seconds - Direction and magnitude (e.g., -10 or 10)
   */
  skip(seconds) {
    if (isNaN(this.audio.duration)) return;

    let targetTime = this.audio.currentTime + seconds;
    if (targetTime < 0) targetTime = 0;
    if (targetTime > this.audio.duration) targetTime = this.audio.duration;

    this.audio.currentTime = targetTime;
    if (this.seekSlider) {
      this.seekSlider.value = targetTime.toString();
      this.seekSlider.setAttribute('aria-valuenow', Math.round(targetTime).toString());
    }
    this.updateSeekSliderAriaText(targetTime);
    this.announceToScreenReader(`Skipped ${Math.abs(seconds)} seconds ${seconds > 0 ? 'forward' : 'backward'}`);
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
  }

  onVolumeInput(e) {
    const value = parseFloat(e.target.value);
    this.audio.volume = value;
    if (this.audio.muted && value > 0) {
      this.audio.muted = false;
    }
  }

  onVolumeChanged() {
    const isMuted = this.audio.muted || this.audio.volume === 0;
    const volVal = this.audio.muted ? 0 : this.audio.volume;

    if (this.volumeSlider) {
      this.volumeSlider.value = volVal.toString();
      const percentage = Math.round(volVal * 100);
      this.volumeSlider.setAttribute('aria-valuenow', percentage.toString());
      this.volumeSlider.setAttribute('aria-valuetext', `Volume ${percentage} percent`);
    }

    const percentage = Math.round(volVal * 100);

    if (isMuted) {
      if (this.volHighIcon) this.volHighIcon.classList.add('hidden');
      if (this.volMutedIcon) this.volMutedIcon.classList.remove('hidden');
      if (this.muteBtn) {
        this.muteBtn.setAttribute('aria-label', 'Unmute volume');
      }
      this.announceToScreenReader("Volume muted");
    } else {
      if (this.volHighIcon) this.volHighIcon.classList.remove('hidden');
      if (this.volMutedIcon) this.volMutedIcon.classList.add('hidden');
      if (this.muteBtn) {
        this.muteBtn.setAttribute('aria-label', 'Mute volume');
      }
      this.announceToScreenReader(`Volume set to ${percentage} percent`);
    }
  }

  onSpeedChanged() {
    const speed = parseFloat(this.speedSelector.value);
    this.audio.playbackRate = speed;
    this.announceToScreenReader(`Playback speed changed to ${speed === 1.0 ? 'Normal' : speed + 'x'}`);
  }

  /**
   * Helper to format raw durations into MM:SS layouts
   * @param {number} seconds - Raw duration seconds
   * @returns {string} - Formatted MM:SS time string
   */
  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Updates standard ARIA text reading out current elapsed timestamps clearly
   */
  updateSeekSliderAriaText(seconds) {
    if (!this.seekSlider) return;
    const elapsedMins = Math.floor(seconds / 60);
    const elapsedSecs = Math.round(seconds % 60);
    const text = `${elapsedMins} minute${elapsedMins !== 1 ? 's' : ''}, ${elapsedSecs} second${elapsedSecs !== 1 ? 's' : ''} elapsed`;
    this.seekSlider.setAttribute('aria-valuetext', text);
  }

  /**
   * Announce seek destinations politely
   */
  announceSeekToScreenReader(seconds) {
    const elapsedMins = Math.floor(seconds / 60);
    const elapsedSecs = Math.round(seconds % 60);
    this.announceToScreenReader(`Seeked to ${elapsedMins} minute${elapsedMins !== 1 ? 's' : ''}, ${elapsedSecs} second${elapsedSecs !== 1 ? 's' : ''}`);
  }

  /**
   * Dispatches text payloads to ARIA status regions while debouncing rapid events
   * @param {string} message - Telemetry payload to speak
   */
  announceToScreenReader(message) {
    if (!this.liveStatus) return;
    clearTimeout(this.announcementDebounce);
    this.announcementDebounce = setTimeout(() => {
      this.liveStatus.textContent = message;
    }, 150);
  }

  /**
   * Configures player-level keyboard shortcut mappings inside the container bounds
   */
  setupKeyboardShortcuts() {
    this.container.addEventListener('keydown', (e) => {
      // Avoid intercepting shortcuts inside dropdown elements (such as playback speeds)
      if (e.target.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();

      switch (key) {
        case ' ': // Spacebar
          e.preventDefault();
          this.togglePlayback();
          break;
        case 'm': // M Key - mute
          e.preventDefault();
          this.toggleMute();
          break;
        case 'arrowleft': // Left Arrow
          // Only skip programmatically if target is not a range input (which handles arrow navigation natively)
          if (e.target !== this.seekSlider && e.target !== this.volumeSlider) {
            e.preventDefault();
            this.skip(-5);
          }
          break;
        case 'arrowright': // Right Arrow
          if (e.target !== this.seekSlider && e.target !== this.volumeSlider) {
            e.preventDefault();
            this.skip(5);
          }
          break;
      }
    });
  }

  /**
   * Fully cleans up internal bindings and closes files to mitigate browser memory leaks
   */
  destroy() {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
    clearTimeout(this.announcementDebounce);

    // Explicitly unbind listeners to garbage collect elements
    this.audio.replaceWith(this.audio.cloneNode(true));
  }
}
