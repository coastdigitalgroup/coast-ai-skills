/**
 * Production-grade Touch & Pointer Gesture Controller Boilerplate
 * Features:
 * - Pointer Capture management (setPointerCapture / releasePointerCapture)
 * - CSS touch-action orientation integration
 * - Directional axis locking (horizontal vs vertical page scroll)
 * - Instantaneous velocity calculation (px/ms)
 * - Multi-pointer tracking for pinch scale and focal midpoint
 * - AbortController cleanup lifecycle
 * - Keyboard accessibility event bindings
 */

export class TouchGestureController {
  /**
   * @param {HTMLElement} element - Target element receiving gesture interactions
   * @param {Object} options - Configuration parameters
   * @param {'swipe-x' | 'swipe-y' | 'pan-2d' | 'pinch-zoom'} [options.type='swipe-x'] - Gesture mode
   * @param {number} [options.distanceThreshold=100] - Displacement required for gesture completion (px)
   * @param {number} [options.velocityThreshold=0.4] - Instantaneous velocity required for flick completion (px/ms)
   * @param {number} [options.minScale=0.5] - Minimum zoom scale (for pinch-zoom mode)
   * @param {number} [options.maxScale=4.0] - Maximum zoom scale (for pinch-zoom mode)
   * @param {Function} [options.onStart] - Callback fired on pointer down
   * @param {Function} [options.onMove] - Callback fired during pointer movement with delta metrics
   * @param {Function} [options.onEnd] - Callback fired on gesture completion or release
   * @param {Function} [options.onCancel] - Callback fired on pointer cancel
   */
  constructor(element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('TouchGestureController requires a valid HTMLElement');
    }

    this.element = element;
    this.options = {
      type: 'swipe-x',
      distanceThreshold: 100,
      velocityThreshold: 0.4,
      minScale: 0.5,
      maxScale: 4.0,
      ...options
    };

    // State tracking
    this.activePointers = new Map();
    this.isAxisLocked = false;
    this.isGestureActive = false;

    // Single-pointer swipe metrics
    this.startX = 0;
    this.startY = 0;
    this.currentDeltaX = 0;
    this.currentDeltaY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.lastTimestamp = 0;
    this.velocityX = 0;
    this.velocityY = 0;

    // Multi-pointer pinch metrics
    this.scale = 1;
    this.startPinchDistance = 0;
    this.startPinchScale = 1;

    // Lifecycle manager
    this.abortController = new AbortController();

    this.configureTouchAction();
    this.initEventListeners();
  }

  /**
   * Enforces explicit CSS touch-action rules matching gesture configuration
   */
  configureTouchAction() {
    switch (this.options.type) {
      case 'swipe-x':
        this.element.style.touchAction = 'pan-y';
        break;
      case 'swipe-y':
        this.element.style.touchAction = 'pan-x';
        break;
      case 'pan-2d':
      case 'pinch-zoom':
        this.element.style.touchAction = 'none';
        break;
    }
    this.element.style.userSelect = 'none';
    this.element.style.webkitUserSelect = 'none';
  }

  initEventListeners() {
    const { signal } = this.abortController;

    this.element.addEventListener('pointerdown', (e) => this.handlePointerDown(e), { signal });
    this.element.addEventListener('pointermove', (e) => this.handlePointerMove(e), { signal });
    this.element.addEventListener('pointerup', (e) => this.handlePointerUp(e), { signal });
    this.element.addEventListener('pointercancel', (e) => this.handlePointerCancel(e), { signal });
    this.element.addEventListener('keydown', (e) => this.handleKeyDown(e), { signal });
  }

  handlePointerDown(event) {
    // Only accept primary mouse click (0) or touch/pen contacts
    if (event.button !== undefined && event.button !== 0) return;

    this.element.setPointerCapture(event.pointerId);

    const now = performance.now();
    const pointerData = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTimestamp: now
    };

    this.activePointers.set(event.pointerId, pointerData);

    if (this.activePointers.size === 1) {
      this.isGestureActive = true;
      this.isAxisLocked = false;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.lastTimestamp = now;
      this.velocityX = 0;
      this.velocityY = 0;
      this.currentDeltaX = 0;
      this.currentDeltaY = 0;

      if (typeof this.options.onStart === 'function') {
        this.options.onStart({ pointerId: event.pointerId, startX: this.startX, startY: this.startY });
      }
    } else if (this.activePointers.size === 2 && this.options.type === 'pinch-zoom') {
      // Multi-finger pinch initialization
      const pointers = Array.from(this.activePointers.values());
      this.startPinchDistance = Math.hypot(
        pointers[1].currentX - pointers[0].currentX,
        pointers[1].currentY - pointers[0].currentY
      );
      this.startPinchScale = this.scale;
    }
  }

  handlePointerMove(event) {
    if (!this.activePointers.has(event.pointerId)) return;

    const pointer = this.activePointers.get(event.pointerId);
    pointer.currentX = event.clientX;
    pointer.currentY = event.clientY;

    if (this.activePointers.size === 1) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      // Axis Locking Protocol
      if (!this.isAxisLocked && (this.options.type === 'swipe-x' || this.options.type === 'swipe-y')) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < 8 && absY < 8) return; // Pending directional movement

        if (this.options.type === 'swipe-x' && absY > absX) {
          // Surrender to vertical page scroll
          this.releasePointer(event.pointerId);
          return;
        }

        if (this.options.type === 'swipe-y' && absX > absY) {
          // Surrender to horizontal page scroll
          this.releasePointer(event.pointerId);
          return;
        }

        this.isAxisLocked = true;
      }

      // Calculate instantaneous velocity (px/ms)
      const now = performance.now();
      const dt = now - pointer.lastTimestamp;
      if (dt > 0) {
        this.velocityX = (event.clientX - pointer.lastX) / dt;
        this.velocityY = (event.clientY - pointer.lastY) / dt;
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        pointer.lastTimestamp = now;
      }

      this.currentDeltaX = deltaX;
      this.currentDeltaY = deltaY;

      if (typeof this.options.onMove === 'function') {
        this.options.onMove({
          deltaX,
          deltaY,
          velocityX: this.velocityX,
          velocityY: this.velocityY,
          scale: this.scale
        });
      }
    } else if (this.activePointers.size === 2 && this.options.type === 'pinch-zoom') {
      const pointers = Array.from(this.activePointers.values());
      const currentDist = Math.hypot(
        pointers[1].currentX - pointers[0].currentX,
        pointers[1].currentY - pointers[0].currentY
      );

      if (this.startPinchDistance > 0) {
        const ratio = currentDist / this.startPinchDistance;
        this.scale = Math.min(
          Math.max(this.startPinchScale * ratio, this.options.minScale),
          this.options.maxScale
        );

        const focalX = (pointers[0].currentX + pointers[1].currentX) / 2;
        const focalY = (pointers[0].currentY + pointers[1].currentY) / 2;

        if (typeof this.options.onMove === 'function') {
          this.options.onMove({ scale: this.scale, focalX, focalY });
        }
      }
    }
  }

  handlePointerUp(event) {
    if (!this.activePointers.has(event.pointerId)) return;

    if (this.activePointers.size === 1) {
      const isFlick = Math.abs(this.velocityX) > this.options.velocityThreshold ||
                      Math.abs(this.velocityY) > this.options.velocityThreshold;
      const isDistanceMet = Math.abs(this.currentDeltaX) > this.options.distanceThreshold ||
                            Math.abs(this.currentDeltaY) > this.options.distanceThreshold;

      const result = {
        completed: isFlick || isDistanceMet,
        isFlick,
        deltaX: this.currentDeltaX,
        deltaY: this.currentDeltaY,
        velocityX: this.velocityX,
        velocityY: this.velocityY,
        scale: this.scale
      };

      if (typeof this.options.onEnd === 'function') {
        this.options.onEnd(result);
      }
    }

    this.releasePointer(event.pointerId);
  }

  handlePointerCancel(event) {
    if (!this.activePointers.has(event.pointerId)) return;

    if (typeof this.options.onCancel === 'function') {
      this.options.onCancel({ pointerId: event.pointerId });
    }

    this.releasePointer(event.pointerId);
  }

  handleKeyDown(event) {
    if (this.options.type === 'swipe-x') {
      if (event.key === 'ArrowRight') {
        if (typeof this.options.onEnd === 'function') {
          this.options.onEnd({ completed: true, isFlick: false, direction: 'right', deltaX: 150 });
        }
      } else if (event.key === 'ArrowLeft') {
        if (typeof this.options.onEnd === 'function') {
          this.options.onEnd({ completed: true, isFlick: false, direction: 'left', deltaX: -150 });
        }
      }
    }
  }

  releasePointer(pointerId) {
    if (this.element.hasPointerCapture(pointerId)) {
      this.element.releasePointerCapture(pointerId);
    }
    this.activePointers.delete(pointerId);

    if (this.activePointers.size === 0) {
      this.isGestureActive = false;
      this.isAxisLocked = false;
    }
  }

  /**
   * Resets internal zoom scale
   */
  resetScale() {
    this.scale = 1;
  }

  /**
   * Completely tears down controller and event listeners
   */
  destroy() {
    this.abortController.abort();
    this.activePointers.clear();
    this.isGestureActive = false;
  }
}
