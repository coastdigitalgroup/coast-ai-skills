/**
 * Accessible & Gesture-Dismissible Bottom Sheet Controller
 * Boilerplate template for standard frontend applications
 */
class AccessibleBottomSheet {
  /**
   * @param {Object} config
   * @param {string} config.overlaySelector - CSS selector for the backdrop overlay
   * @param {string} config.panelSelector - CSS selector for the sliding sheet panel container
   * @param {string} config.dragHandleSelector - CSS selector for the interactive drag handle bar
   * @param {string} config.triggerSelector - CSS selector for the button(s) triggering the sheet
   * @param {string} config.closeSelector - CSS selector for button(s) that close the sheet
   * @param {number} [config.dismissThreshold=0.35] - Height ratio (0 to 1) required to dismiss the sheet on drag release
   * @param {Function} [config.onOpen] - Callback function executed when sheet is opened
   * @param {Function} [config.onClose] - Callback function executed when sheet is closed
   */
  constructor({
    overlaySelector,
    panelSelector,
    dragHandleSelector,
    triggerSelector,
    closeSelector,
    dismissThreshold = 0.35,
    onOpen = null,
    onClose = null
  }) {
    this.overlay = document.querySelector(overlaySelector);
    this.panel = document.querySelector(panelSelector);
    this.dragHandle = document.querySelector(dragHandleSelector);
    this.triggers = document.querySelectorAll(triggerSelector);
    this.closeButtons = document.querySelectorAll(closeSelector);

    this.dismissThreshold = dismissThreshold;
    this.onOpen = onOpen;
    this.onClose = onClose;

    // State properties
    this.isOpen = false;
    this.isDragging = false;
    this.startY = 0;
    this.currentDeltaY = 0;
    this.lastFocusedElement = null;

    // Scope bindings
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.trapFocus = this.trapFocus.bind(this);
    this.handleResize = this.handleResize.bind(this);

    if (this.overlay && this.panel) {
      this.init();
    } else {
      console.error('AccessibleBottomSheet: Required overlay or panel elements were not found in the DOM.');
    }
  }

  init() {
    // 1. Establish initial ARIA states
    this.overlay.setAttribute('aria-hidden', 'true');
    this.panel.setAttribute('tabindex', '-1');

    // 2. Attach trigger events
    this.triggers.forEach(trigger => {
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', this.panel.id || '');
      trigger.addEventListener('click', this.open);
    });

    // 3. Attach close button events
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', this.close);
    });

    // 4. Attach backdrop overlay click-to-close event
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // 5. Attach pointer gestures for drag-dismissal (on mobile viewport)
    if (this.dragHandle) {
      this.dragHandle.addEventListener('pointerdown', this.handlePointerDown);
    }

    // 6. Global listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    // Save previous active focus
    this.lastFocusedElement = document.activeElement;

    // Activate classes & modify ARIA properties
    this.overlay.classList.add('is-active');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-scroll-locked');

    // Focus the sheet element (accessible entrance target)
    setTimeout(() => {
      this.panel.focus();
    }, 50);

    // Trap focus to dialog panel boundaries
    this.panel.addEventListener('keydown', this.trapFocus);

    // Fire user-defined callback
    if (typeof this.onOpen === 'function') {
      this.onOpen();
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    // Deactivate classes & modify ARIA properties
    this.overlay.classList.remove('is-active');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-scroll-locked');

    // Detach focus trap
    this.panel.removeEventListener('keydown', this.trapFocus);

    // Restore previous active focus
    if (this.lastFocusedElement) {
      setTimeout(() => {
        this.lastFocusedElement.focus();
      }, 50);
    }

    // Reset panel translation offsets in case of active gesture remnants
    this.panel.style.transform = '';

    // Fire user-defined callback
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  /* ==========================================================================
     Pointer Gesture Handlers (Unifies Touch & Mouse Swipe Action)
     ========================================================================== */
  handlePointerDown(e) {
    // Disable drag logic on desktop breakpoints
    if (window.innerWidth >= 768) return;

    this.isDragging = true;
    this.startY = e.clientY;

    // Restrict inputs to drag handle and preserve capture
    this.dragHandle.setPointerCapture(e.pointerId);
    this.panel.style.transition = 'none'; // Lock default transition during manual drag

    this.dragHandle.addEventListener('pointermove', this.handlePointerMove);
    this.dragHandle.addEventListener('pointerup', this.handlePointerUp);
    this.dragHandle.addEventListener('pointercancel', this.handlePointerUp);
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;

    const deltaY = e.clientY - this.startY;

    if (deltaY > 0) {
      // Swipe down (direction of close)
      this.currentDeltaY = deltaY;
      this.panel.style.transform = `translateY(${deltaY}px)`;
    } else {
      // Swipe up (provide heavy drag resistance past normal boundaries)
      const resistanceFactor = 0.12;
      this.panel.style.transform = `translateY(${deltaY * resistanceFactor}px)`;
    }
  }

  handlePointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    // Release pointer capture
    this.dragHandle.releasePointerCapture(e.pointerId);

    // Detach listeners
    this.dragHandle.removeEventListener('pointermove', this.handlePointerMove);
    this.dragHandle.removeEventListener('pointerup', this.handlePointerUp);
    this.dragHandle.removeEventListener('pointercancel', this.handlePointerUp);

    // Restore smooth default CSS transition
    this.panel.style.transition = '';

    const panelHeight = this.panel.offsetHeight;

    if (this.currentDeltaY > panelHeight * this.dismissThreshold) {
      this.close();
    } else {
      // Snap panel back to resting viewport baseline
      this.panel.style.transform = 'translateY(0%)';
    }

    this.currentDeltaY = 0;
  }

  /* ==========================================================================
     Accessibility & Window Controls
     ========================================================================== */
  handleKeyDown(e) {
    if (!this.isOpen) return;

    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.close();
    }
  }

  trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusableQuery = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = this.panel.querySelectorAll(focusableQuery);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab (wrap backward from first item to last)
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (wrap forward from last item to first)
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleResize() {
    // If browser is scaled up to desktop layout widths, reset active inline transforms
    if (window.innerWidth >= 768) {
      this.panel.style.transform = '';
      this.panel.style.transition = '';
    }
  }

  /**
   * Destroys instance, cleaning up all event listeners and state
   */
  destroy() {
    this.close();

    this.triggers.forEach(trigger => {
      trigger.removeEventListener('click', this.open);
    });

    this.closeButtons.forEach(btn => {
      btn.removeEventListener('click', this.close);
    });

    if (this.dragHandle) {
      this.dragHandle.removeEventListener('pointerdown', this.handlePointerDown);
    }

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Export for module support if required
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibleBottomSheet;
}
