/**
 * AccessiblePasswordField
 * A portable, framework-agnostic Vanilla JavaScript class that makes custom
 * password fields complete with a visibility toggle, validation checklist,
 * and strength indicator fully accessible and compatible with screen readers.
 */
export class AccessiblePasswordField {
  /**
   * @param {HTMLElement} container - The wrapper element containing the input, button, and status elements.
   * @param {Object} options - Configuration options.
   * @param {string} [options.inputSelector='.password-input'] - Selector for the password input.
   * @param {string} [options.toggleSelector='.password-toggle'] - Selector for the visibility toggle button.
   * @param {string} [options.liveStatusSelector='.password-live-status'] - Selector for the ARIA live region.
   * @param {string} [options.meterSelector='.password-strength-meter'] - Selector for the <meter> or visual gauge.
   * @param {string} [options.ruleItemSelector='.rule-item'] - Selector for individual requirement list items.
   * @param {number} [options.debounceDelay=800] - Time in milliseconds to delay screen reader live announcements.
   * @param {Function} [options.onStrengthChange] - Callback invoked whenever the evaluated password strength updates.
   */
  constructor(container, options = {}) {
    if (!container) {
      throw new Error('AccessiblePasswordField requires a valid container element.');
    }

    this.container = container;

    // Merge default selectors
    this.config = {
      inputSelector: '.password-input',
      toggleSelector: '.password-toggle',
      liveStatusSelector: '.password-live-status',
      meterSelector: '.password-strength-meter',
      ruleItemSelector: '.rule-item',
      debounceDelay: 800,
      ...options
    };

    // DOM Elements
    this.input = this.container.querySelector(this.config.inputSelector);
    this.toggleBtn = this.container.querySelector(this.config.toggleSelector);
    this.liveStatus = this.container.querySelector(this.config.liveStatusSelector);
    this.meter = this.container.querySelector(this.config.meterSelector);
    this.ruleItems = this.container.querySelectorAll(this.config.ruleItemSelector);

    if (!this.input) {
      console.warn(`AccessiblePasswordField: Missing input element matching "${this.config.inputSelector}"`);
    }
    if (!this.toggleBtn) {
      console.warn(`AccessiblePasswordField: Missing toggle button matching "${this.config.toggleSelector}"`);
    }

    // State Variables
    this.debounceTimeout = null;
    this.lastStrengthLevel = -1;

    // Bind event handlers for clean removal
    this._handleInputBind = this.handleInput.bind(this);
    this._toggleVisibilityBind = this.toggleVisibility.bind(this);

    this.init();
  }

  /**
   * Set up event listeners.
   */
  init() {
    if (this.input) {
      this.input.addEventListener('input', this._handleInputBind);
    }
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', this._toggleVisibilityBind);
    }
  }

  /**
   * Toggles input type between password and text while preserving
   * the text cursor caret selection range and focus.
   */
  toggleVisibility() {
    if (!this.input || !this.toggleBtn) return;

    // 1. Capture exact cursor/selection and focus states
    const selectionStart = this.input.selectionStart;
    const selectionEnd = this.input.selectionEnd;
    const isFocused = document.activeElement === this.input;

    // 2. Perform the visual type toggle
    const isShowing = this.input.type === 'text';
    this.input.type = isShowing ? 'password' : 'text';

    // 3. Update standard ARIA attributes
    this.toggleBtn.setAttribute('aria-pressed', !isShowing);
    this.toggleBtn.setAttribute(
      'aria-label',
      isShowing ? 'Show password as plain text' : 'Hide password'
    );

    // Provide styling hooks via CSS classes on the button (optional)
    this.toggleBtn.classList.toggle('is-revealed', !isShowing);

    // 4. Safely restore focus and caret selections
    if (isFocused) {
      this.input.focus();
    }
    this.input.setSelectionRange(selectionStart, selectionEnd);
  }

  /**
   * Coordinates input updates, rule checking, and live announcements.
   */
  handleInput() {
    if (!this.input) return;

    const value = this.input.value;
    const evaluation = this.evaluatePassword(value);

    // Highly responsive visual updates
    this.updateRulesChecklist(evaluation.rules);
    this.updateStrengthMeter(evaluation.strength, evaluation.label);

    // Invoke optional custom callback
    if (typeof this.config.onStrengthChange === 'function') {
      this.config.onStrengthChange(evaluation);
    }

    // Debounce the screen reader announcement
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.announceStatus(evaluation);
    }, this.config.debounceDelay);
  }

  /**
   * Evaluates current password criteria. Override this method to custom-fit rules.
   * @param {string} value - Current input value.
   * @returns {Object} Password evaluation details.
   */
  evaluatePassword(value) {
    const rules = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    };

    const satisfiedRulesCount = Object.values(rules).filter(Boolean).length;
    const totalRulesCount = Object.keys(rules).length;
    const allRulesSatisfied = satisfiedRulesCount === totalRulesCount;

    let strength = 0;
    let label = 'Empty';

    if (value.length > 0) {
      strength = satisfiedRulesCount;
      if (strength === 1) label = 'Very Weak';
      else if (strength === 2) label = 'Weak';
      else if (strength === 3) label = 'Good';
      else if (strength === 4) label = 'Strong';
    }

    return {
      rules,
      strength,
      label,
      satisfiedRulesCount,
      totalRulesCount,
      allRulesSatisfied
    };
  }

  /**
   * Updates state attributes on elements matching the selector list.
   * @param {Object} rules - Object containing rule name keys and boolean values.
   */
  updateRulesChecklist(rules) {
    if (this.ruleItems.length === 0) return;

    // We look for dataset rule keys matching: data-rule="length", etc.
    this.ruleItems.forEach((item) => {
      const ruleKey = item.getAttribute('data-rule');
      if (ruleKey && ruleKey in rules) {
        const satisfied = rules[ruleKey];
        item.setAttribute('data-satisfied', satisfied);

        // Assistive element checkmark / icon update
        const iconEl = item.querySelector('.rule-icon');
        if (iconEl) {
          iconEl.textContent = satisfied ? '✅' : '❌';
        }
      }
    });
  }

  /**
   * Sets current state of the visual meter.
   * @param {number} strength - Value inside the maximum range.
   * @param {string} label - Text label (e.g., "Strong").
   */
  updateStrengthMeter(strength, label) {
    if (this.meter) {
      this.meter.value = strength;
    }

    const valueTextEl = this.container.querySelector('.strength-value-text');
    if (valueTextEl) {
      valueTextEl.textContent = label;
    }
  }

  /**
   * Issues the screen reader announcement only when the level changes
   * to avoid vocal fatigue.
   * @param {Object} evaluation - Evaluated password result.
   */
  announceStatus(evaluation) {
    if (!this.liveStatus) return;

    if (!this.input || this.input.value.length === 0) {
      this.liveStatus.textContent = '';
      this.lastStrengthLevel = -1;
      return;
    }

    // Only speak to user if the strength changes
    if (this.lastStrengthLevel !== evaluation.strength) {
      this.lastStrengthLevel = evaluation.strength;

      this.liveStatus.textContent = `Password strength is ${evaluation.label}. ${evaluation.satisfiedRulesCount} of ${evaluation.totalRulesCount} requirements met.`;
    }
  }

  /**
   * Unbinds events and cleans up timeouts to prevent memory leaks.
   */
  destroy() {
    clearTimeout(this.debounceTimeout);
    if (this.input) {
      this.input.removeEventListener('input', this._handleInputBind);
    }
    if (this.toggleBtn) {
      this.toggleBtn.removeEventListener('click', this._toggleVisibilityBind);
    }
  }
}
