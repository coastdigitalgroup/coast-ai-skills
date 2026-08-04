/**
 * AccessiblePasswordField - Reusable Vanilla JS controller for accessible password inputs.
 * Features caret-preservation, dynamic strength meter tracking, and screen-reader polite announcements.
 */
class AccessiblePasswordField {
  /**
   * @param {HTMLElement} container - The wrapper containing password input, toggle button, and visual indicators.
   * @param {Object} options - Configuration parameters for customization.
   */
  constructor(container, options = {}) {
    if (!container) {
      throw new Error('AccessiblePasswordField requires a valid container element.');
    }

    this.container = container;
    this.input = container.querySelector('.password-input');
    this.toggleBtn = container.querySelector('.password-toggle');
    this.strengthMeter = container.querySelector('.strength-meter');
    this.strengthText = container.querySelector('.strength-text');
    this.srAnnouncer = container.querySelector('.password-sr-announcer');

    // Default configuration options
    this.options = {
      minLength: options.minLength || 8,
      requireNumber: options.hasOwnProperty('requireNumber') ? options.requireNumber : true,
      requireSymbol: options.hasOwnProperty('requireSymbol') ? options.requireSymbol : true,
      labels: options.labels || ['Empty', 'Weak', 'Fair', 'Good', 'Strong'],
      onStrengthChange: options.onStrengthChange || null,
      onToggle: options.onToggle || null,
      ...options
    };

    // Keep track of announced states to prevent redundant voice cues
    this.lastStrengthLabel = 'Empty';
    this.rules = {};

    this.init();
  }

  init() {
    if (!this.input || !this.toggleBtn) {
      console.warn('AccessiblePasswordField: Missing required child elements (input or toggle).');
      return;
    }

    this.setupRules();

    this.toggleBtn.addEventListener('click', () => this.toggleVisibility());
    this.input.addEventListener('input', () => this.handleInput());
  }

  setupRules() {
    // Locate criteria checklist items
    const lengthEl = this.container.querySelector('[data-rule="length"]');
    const numberEl = this.container.querySelector('[data-rule="number"]');
    const symbolEl = this.container.querySelector('[data-rule="symbol"]');

    if (lengthEl) {
      this.rules.length = { el: lengthEl, check: val => val.length >= this.options.minLength, announced: false };
    }
    if (numberEl && this.options.requireNumber) {
      this.rules.number = { el: numberEl, check: val => /\d/.test(val), announced: false };
    }
    if (symbolEl && this.options.requireSymbol) {
      this.rules.symbol = { el: symbolEl, check: val => /[^A-Za-z0-9]/.test(val), announced: false };
    }
  }

  toggleVisibility() {
    const isShowingText = this.input.type === 'text';

    // 1. Capture exact caret selection points
    const selectionStart = this.input.selectionStart;
    const selectionEnd = this.input.selectionEnd;

    // 2. Toggle field type
    this.input.type = isShowingText ? 'password' : 'text';

    // 3. Sync ARIA attributes on the toggle button
    this.toggleBtn.setAttribute('aria-label', isShowingText ? 'Show password' : 'Hide password');
    this.toggleBtn.setAttribute('aria-pressed', String(!isShowingText));

    // 4. Fire optional callback
    if (typeof this.options.onToggle === 'function') {
      this.options.onToggle(!isShowingText);
    }

    // 5. Restore focus and cursor positions (crucial for keyboard and magnifier users)
    if (document.activeElement === this.input || document.activeElement === this.toggleBtn) {
      this.input.focus();
      this.input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  handleInput() {
    const value = this.input.value;
    let score = 0;

    // Evaluate rules and update checklist
    for (const [key, rule] of Object.entries(this.rules)) {
      const isValid = rule.check(value);

      if (isValid) {
        rule.el.classList.add('valid');
        rule.el.setAttribute('aria-invalid', 'false');
        score++;

        if (!rule.announced) {
          this.announce(`${rule.el.textContent.trim()} requirement met.`);
          rule.announced = true;
        }
      } else {
        rule.el.classList.remove('valid');
        rule.el.setAttribute('aria-invalid', 'true');

        if (rule.announced) {
          this.announce(`${rule.el.textContent.trim()} requirement no longer met.`);
          rule.announced = false;
        }
      }
    }

    // Basic scoring fallback for typed text
    if (value.length > 0 && score === 0) {
      score = 1;
    }

    // Update Strength Meter attributes
    if (this.strengthMeter) {
      this.strengthMeter.setAttribute('data-score', String(score));
    }

    const currentLabel = this.options.labels[score];
    if (this.strengthText) {
      this.strengthText.textContent = currentLabel;
    }

    // Announce strength rating changes
    if (currentLabel !== this.lastStrengthLabel) {
      this.announce(`Password strength: ${currentLabel}`);
      this.lastStrengthLabel = currentLabel;
    }

    // Fire optional strength change callback
    if (typeof this.options.onStrengthChange === 'function') {
      this.options.onStrengthChange(score, currentLabel);
    }
  }

  /**
   * Safe, non-intrusive screen reader announcement
   * @param {string} message - Text to be spoken
   */
  announce(message) {
    if (!this.srAnnouncer) return;

    this.srAnnouncer.textContent = '';
    setTimeout(() => {
      this.srAnnouncer.textContent = message;
    }, 50);
  }
}

export default AccessiblePasswordField;
