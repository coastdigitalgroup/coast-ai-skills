/**
 * AccessibleContextMenu.js
 * A lightweight, production-ready Vanilla JavaScript component for implementing
 * semantic, accessible, viewport-collision-aware custom context menus.
 *
 * Compliant with WAI-ARIA Menu and Menuitem specs, keyboard navigation (roving tabindex),
 * focus restoration, and touch long-press gestures.
 *
 * @example
 * import { AccessibleContextMenu } from './context-menu-boilerplate.js';
 *
 * const menu = new AccessibleContextMenu({
 *   menuElement: document.getElementById('my-context-menu'),
 *   triggerSelector: '.my-interactive-card',
 *   onAction: (action, targetEl) => {
 *     console.log(`Executed ${action} on`, targetEl);
 *   }
 * });
 */

export class AccessibleContextMenu {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.menuElement - The container element with role="menu"
   * @param {string} options.triggerSelector - Selector for triggering elements
   * @param {Function} [options.onAction] - Callback function called on item activation
   * @param {number} [options.longPressDuration=500] - Duration in ms for touch hold
   */
  constructor({ menuElement, triggerSelector, onAction, longPressDuration = 500 }) {
    this.menu = menuElement;
    this.triggerSelector = triggerSelector;
    this.onAction = onAction || (() => {});
    this.longPressDuration = longPressDuration;

    this.items = Array.from(this.menu.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'));
    this.activeTrigger = null;
    this.currentIndex = 0;

    // Timer references for long-press
    this.touchTimer = null;
    this.touchStartCoords = null;

    // Bind Event Methods to Keep Context
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.init();
  }

  init() {
    if (!this.menu) {
      console.error('AccessibleContextMenu: menuElement is required.');
      return;
    }

    // Set initial ARIA accessibility parameters
    this.menu.setAttribute('role', 'menu');
    this.menu.setAttribute('aria-hidden', 'true');
    this.menu.setAttribute('tabindex', '-1');

    this.items.forEach(item => {
      item.setAttribute('tabindex', '-1');
    });

    // Add listeners to document for event delegation on triggers
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleDocumentClick);

    // Touch setup for mobile devices
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchcancel', this.handleTouchEnd);

    // Inner menu interaction listeners
    this.menu.addEventListener('keydown', this.handleMenuKeyDown);
    this.menu.addEventListener('click', this.handleMenuClick);
  }

  /**
   * Handle contextmenu click interception (Right-Click)
   */
  handleContextMenu(e) {
    const trigger = e.target.closest(this.triggerSelector);
    if (!trigger) {
      // Clicked outside triggers. If menu is open, dismiss it.
      if (!this.menu.contains(e.target)) {
        this.close();
      }
      return;
    }

    e.preventDefault();

    // Check if keyboard triggered (clientX/Y are 0 or centered)
    const isKeyboard = e.button === 0 || (e.clientX === 0 && e.clientY === 0);
    let posX = e.clientX;
    let posY = e.clientY;

    if (isKeyboard) {
      // Align bottom-left to target bounds
      const rect = trigger.getBoundingClientRect();
      posX = rect.left;
      posY = rect.bottom;
    }

    this.open(posX, posY, trigger);
  }

  /**
   * Shift+F10 standard keyboard shortcut interceptor
   */
  handleKeyDown(e) {
    if (e.shiftKey && e.key === 'F10') {
      const trigger = document.activeElement.closest(this.triggerSelector);
      if (trigger) {
        e.preventDefault();
        const rect = trigger.getBoundingClientRect();
        this.open(rect.left + 16, rect.bottom - 8, trigger);
      }
    }
  }

  /**
   * Calculate collision-free coordinates relative to viewport boundary limits
   */
  calculatePosition(x, y) {
    // Reveal display state to read sizes
    this.menu.style.display = 'block';

    const menuWidth = this.menu.offsetWidth;
    const menuHeight = this.menu.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let finalX = x + scrollX;
    let finalY = y + scrollY;

    // Boundary Overflow check: Right-side collision
    if (x + menuWidth > viewportWidth) {
      finalX = (x - menuWidth) + scrollX;
      if (finalX < 0) finalX = scrollX;
    }

    // Boundary Overflow check: Bottom-side collision
    if (y + menuHeight > viewportHeight) {
      finalY = (y - menuHeight) + scrollY;
      if (finalY < 0) finalY = scrollY;
    }

    return { x: finalX, y: finalY };
  }

  open(clientX, clientY, triggerElement) {
    this.activeTrigger = triggerElement;

    // Calculate boundary alignment
    const coords = this.calculatePosition(clientX, clientY);
    this.menu.style.left = `${coords.x}px`;
    this.menu.style.top = `${coords.y}px`;

    // Accessibility reveal
    this.menu.setAttribute('aria-hidden', 'false');

    // Roving Index focus initialization
    this.currentIndex = 0;
    this.items.forEach((item, idx) => {
      item.setAttribute('tabindex', idx === 0 ? '0' : '-1');
    });

    // Enforce immediate focus onto first item (WAI-ARIA Menu requirement)
    setTimeout(() => {
      if (this.items.length > 0) {
        this.items[0].focus();
      }
    }, 50);
  }

  close() {
    if (this.menu.getAttribute('aria-hidden') === 'false') {
      this.menu.style.display = 'none';
      this.menu.setAttribute('aria-hidden', 'true');

      this.items.forEach(item => {
        item.setAttribute('tabindex', '-1');
      });

      // Restore Focus back to Trigger Element
      if (this.activeTrigger) {
        this.activeTrigger.focus();
        this.activeTrigger = null;
      }
    }
  }

  /**
   * Roving Index Keyboard Handler inside Open Menu
   */
  handleMenuKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        e.preventDefault();
        this.currentIndex = 0;
        this.focusCurrentItem();
        break;
      case 'End':
        e.preventDefault();
        this.currentIndex = this.items.length - 1;
        this.focusCurrentItem();
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'Tab':
        // Tab key is explicitly locked down inside context overlays
        e.preventDefault();
        break;
    }
  }

  moveFocus(direction) {
    if (this.items.length === 0) return;
    this.items[this.currentIndex].setAttribute('tabindex', '-1');
    this.currentIndex = (this.currentIndex + direction + this.items.length) % this.items.length;
    this.focusCurrentItem();
  }

  focusCurrentItem() {
    const activeItem = this.items[this.currentIndex];
    if (activeItem) {
      activeItem.setAttribute('tabindex', '0');
      activeItem.focus();
    }
  }

  /**
   * Menuitem activation click router
   */
  handleMenuClick(e) {
    const item = e.target.closest('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    if (!item) return;

    const action = item.getAttribute('data-action');
    if (action) {
      this.onAction(action, this.activeTrigger);
    }
    this.close();
  }

  /**
   * Dismiss context menu on out-clicks
   */
  handleDocumentClick(e) {
    if (!this.menu.contains(e.target)) {
      this.close();
    }
  }

  // --- Mobile Touch Gesture Handlers (Long-Press) ---

  handleTouchStart(e) {
    const trigger = e.target.closest(this.triggerSelector);
    if (!trigger) return;

    const touch = e.touches[0];
    this.touchStartCoords = { x: touch.clientX, y: touch.clientY };

    // Setup Timer to open menu after delay
    this.touchTimer = setTimeout(() => {
      e.preventDefault(); // Suppresses text selection, hover highlight, page magnifier
      this.open(touch.clientX, touch.clientY, trigger);
    }, this.longPressDuration);
  }

  handleTouchMove(e) {
    if (!this.touchStartCoords) return;

    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - this.touchStartCoords.x);
    const diffY = Math.abs(touch.clientY - this.touchStartCoords.y);

    // If swipe travel is greater than 10px, prioritize page scroll and discard timer
    if (diffX > 10 || diffY > 10) {
      this.cancelTouchTimer();
    }
  }

  handleTouchEnd() {
    this.cancelTouchTimer();
  }

  cancelTouchTimer() {
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
      this.touchTimer = null;
    }
    this.touchStartCoords = null;
  }

  /**
   * Perform garbage collection, releasing all registered listeners
   */
  destroy() {
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleDocumentClick);

    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchcancel', this.handleTouchEnd);

    this.menu.removeEventListener('keydown', this.handleMenuKeyDown);
    this.menu.removeEventListener('click', this.handleMenuClick);

    this.cancelTouchTimer();
    this.items = [];
    this.activeTrigger = null;
  }
}
