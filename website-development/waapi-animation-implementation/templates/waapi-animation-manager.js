/**
 * WAAPI Animation Manager
 * A robust, framework-agnostic helper class for orchestrating Web Animations API (WAAPI)
 * animations, FLIP layout transitions, playback speed, timeline controls, and memory cleanup.
 */

export class WAAPIAnimationManager {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.honorReducedMotion=true] Respect prefers-reduced-motion OS settings
   * @param {string} [options.defaultEasing='cubic-bezier(0.2, 0, 0, 1)'] Default easing curve
   * @param {number} [options.defaultDuration=300] Default animation duration in ms
   */
  constructor(options = {}) {
    this.honorReducedMotion = options.honorReducedMotion !== false;
    this.defaultEasing = options.defaultEasing || 'cubic-bezier(0.2, 0, 0, 1)';
    this.defaultDuration = options.defaultDuration || 300;

    /** @type {Set<Animation>} */
    this.activeAnimations = new Set();
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  isReducedMotionPreferred() {
    if (!this.honorReducedMotion) return false;
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Animate a single element using WAAPI with automatic promise lifecycle management and style commitment.
   *
   * @param {HTMLElement} element - Target element
   * @param {Array<Object>|Object} keyframes - WAAPI keyframe array or object
   * @param {KeyframeAnimationOptions} [options] - WAAPI timing options
   * @returns {Promise<{ animation: Animation, finished: boolean }>}
   */
  async animate(element, keyframes, options = {}) {
    if (!element) throw new Error('[WAAPIAnimationManager] Target element is required.');

    const isReduced = this.isReducedMotionPreferred();
    const duration = isReduced ? 0 : (options.duration ?? this.defaultDuration);
    const easing = options.easing || this.defaultEasing;

    const timingOptions = {
      ...options,
      duration,
      easing
    };

    // Instantiate WAAPI Animation
    const animation = element.animate(keyframes, timingOptions);
    this.activeAnimations.add(animation);

    try {
      // Await native finished promise
      await animation.finished;

      // Commit final style state if fill mode or custom option requested commitment
      if (options.fill === 'forwards' || options.commitOnFinish) {
        if (typeof animation.commitStyles === 'function') {
          animation.commitStyles();
        }
        animation.cancel(); // Clears style layer retainer in WAAPI stack
      }

      return { animation, finished: true };
    } catch (err) {
      // Animation was aborted or cancelled explicitly
      return { animation, finished: false };
    } finally {
      this.activeAnimations.delete(animation);
    }
  }

  /**
   * Perform a FLIP (First, Last, Invert, Play) transition on a list of elements.
   *
   * @param {Array<HTMLElement>|NodeList} elements - Array or NodeList of elements to transition
   * @param {Function} mutateDOMFn - Callback function that performs the synchronous DOM update
   * @param {Object} [flipOptions]
   * @param {number} [flipOptions.duration=400]
   * @param {string} [flipOptions.easing]
   * @returns {Promise<Array<{ animation: Animation, finished: boolean }>>}
   */
  async flip(elements, mutateDOMFn, flipOptions = {}) {
    const elemArray = Array.from(elements);

    // 1. FIRST: Capture initial BoundingClientRects
    const firstPositions = new Map();
    elemArray.forEach((el) => {
      firstPositions.set(el, el.getBoundingClientRect());
    });

    // 2. MUTATE DOM
    mutateDOMFn();

    // 3 & 4. LAST, INVERT, & PLAY
    const promises = elemArray.map((el) => {
      const first = firstPositions.get(el);
      if (!first) return Promise.resolve({ animation: null, finished: true });

      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const dw = first.width / (last.width || 1);
      const dh = first.height / (last.height || 1);

      // Skip if position/size hasn't changed
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(dw - 1) < 0.01 && Math.abs(dh - 1) < 0.01) {
        return Promise.resolve({ animation: null, finished: true });
      }

      const keyframes = [
        {
          transform: `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`
        },
        {
          transform: 'translate(0, 0) scale(1, 1)'
        }
      ];

      return this.animate(el, keyframes, {
        duration: flipOptions.duration || 400,
        easing: flipOptions.easing || this.defaultEasing,
        commitOnFinish: true
      });
    });

    return Promise.all(promises);
  }

  /**
   * Pause all currently active managed animations.
   */
  pauseAll() {
    this.activeAnimations.forEach((anim) => anim.pause());
  }

  /**
   * Resume / Play all currently active managed animations.
   */
  playAll() {
    this.activeAnimations.forEach((anim) => anim.play());
  }

  /**
   * Reverse playback direction of all managed active animations.
   */
  reverseAll() {
    this.activeAnimations.forEach((anim) => anim.reverse());
  }

  /**
   * Set playback speed rate across all managed active animations.
   * @param {number} rate - Playback rate factor (e.g. 0.5 = half speed, 2.0 = double speed)
   */
  setPlaybackRate(rate) {
    this.activeAnimations.forEach((anim) => {
      anim.playbackRate = rate;
    });
  }

  /**
   * Cancel and clear all active animations.
   */
  cancelAll() {
    this.activeAnimations.forEach((anim) => anim.cancel());
    this.activeAnimations.clear();
  }
}
