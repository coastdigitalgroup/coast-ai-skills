/**
 * AccessibleTagInput - A lightweight, framework-agnostic Vanilla JavaScript component
 * for managing multi-select tag (chip) lists paired with text input.
 *
 * Implements WAI-ARIA best practices including:
 * - A single Tab stop for the entire list (Roving Tabindex on <li> items).
 * - Focus-restoration fallback logic upon item deletion to prevent focus leakage.
 * - Real-time ARIA Live polite announcements for additions and deletions.
 * - Comprehensive keyboard navigation (ArrowLeft, ArrowRight, Backspace, Delete, Escape, Home, End).
 */
export class AccessibleTagInput {
  /**
   * @param {Object} config
   * @param {HTMLElement} config.containerEl - Outer compound container wrapping list and input
   * @param {HTMLUListElement} config.listEl - The <ul> element holding tag chips
   * @param {HTMLInputElement} config.inputEl - The text <input> element inside the container
   * @param {HTMLElement} config.announcerEl - Dedicated element with [aria-live="polite"]
   * @param {string[]} [config.initialTags=[]] - Optional list of initial tags to pre-render
   * @param {function} [config.onTagsChange] - Optional callback function triggered on tags update
   */
  constructor({ containerEl, listEl, inputEl, announcerEl, initialTags = [], onTagsChange = null }) {
    if (!containerEl || !listEl || !inputEl || !announcerEl) {
      throw new Error('AccessibleTagInput: Required elements are missing from configuration.');
    }

    this.container = containerEl;
    this.list = listEl;
    this.input = inputEl;
    this.announcer = announcerEl;
    this.onTagsChange = onTagsChange;

    this.focusedChipIndex = -1;

    // Track active event listeners for thorough cleanup
    this._listeners = new Map();

    this._init(initialTags);
  }

  /**
   * Initializes the tag input behavior and sets up listeners
   * @private
   */
  _init(initialTags) {
    // Render initial tags if provided
    initialTags.forEach(tag => this._createAndAppendTagEl(tag, false));

    // Bind event handlers
    this._registerEvent(this.input, 'keydown', (e) => this._handleInputKeydown(e));
    this._registerEvent(this.list, 'keydown', (e) => this._handleListKeydown(e));
    this._registerEvent(this.list, 'click', (e) => this._handleListClick(e));
    this._registerEvent(this.container, 'click', (e) => this._handleContainerClick(e));
  }

  /**
   * Registers event handlers safely for cleanup
   * @private
   */
  _registerEvent(element, eventType, handler) {
    element.addEventListener(eventType, handler);
    this._listeners.set({ element, eventType }, handler);
  }

  /**
   * Returns currently active tag chips
   * @returns {HTMLElement[]}
   */
  getChips() {
    return Array.from(this.list.querySelectorAll('.tag-chip'));
  }

  /**
   * Returns current active tag string values
   * @returns {string[]}
   */
  getValues() {
    return this.getChips().map(chip => chip.dataset.value);
  }

  /**
   * Dispatches text announcements to the ARIA Live region
   * @param {string} text
   */
  announce(text) {
    this.announcer.textContent = '';
    // Small timeout ensures screen readers process the textual delta
    setTimeout(() => {
      this.announcer.textContent = text;
    }, 50);
  }

  /**
   * Adds a new tag to the list programmatically or via user input
   * @param {string} value
   * @param {boolean} [shouldAnnounce=true]
   */
  addTag(value, shouldAnnounce = true) {
    const trimmed = value.trim();
    if (!trimmed) return false;

    // Reject duplicates
    const currentTags = this.getValues();
    if (currentTags.some(tag => tag.toLowerCase() === trimmed.toLowerCase())) {
      this.announce(`Tag "${trimmed}" has already been added.`);
      this.input.value = '';
      return false;
    }

    this._createAndAppendTagEl(trimmed, shouldAnnounce);
    this.input.value = '';

    if (this.onTagsChange) {
      this.onTagsChange(this.getValues());
    }

    return true;
  }

  /**
   * Appends markup and configures initial tabindex
   * @private
   */
  _createAndAppendTagEl(tagText, shouldAnnounce) {
    const li = document.createElement('li');
    li.className = 'tag-chip';
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '-1');
    li.dataset.value = tagText;

    const span = document.createElement('span');
    span.className = 'tag-label';
    span.textContent = tagText;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tag-remove-btn';
    button.setAttribute('aria-label', `Remove ${tagText} tag`);
    button.setAttribute('tabindex', '-1');
    button.innerHTML = '&times;';

    li.appendChild(span);
    li.appendChild(button);
    this.list.appendChild(li);

    if (shouldAnnounce) {
      this.announce(`Added tag: ${tagText}`);
    }
  }

  /**
   * Removes a specific tag from the list
   * @param {HTMLElement} chipElement
   */
  removeTag(chipElement) {
    const value = chipElement.dataset.value;
    const chips = this.getChips();
    const index = chips.indexOf(chipElement);

    if (index === -1) return;

    chipElement.remove();

    const remainingChips = this.getChips();
    this.announce(`Removed tag: ${value}. ${remainingChips.length} tag${remainingChips.length === 1 ? '' : 's'} remaining.`);

    if (this.onTagsChange) {
      this.onTagsChange(this.getValues());
    }

    // Resolve keyboard focus restoration target
    if (this.focusedChipIndex !== -1) {
      if (remainingChips.length === 0) {
        this.focusedChipIndex = -1;
        this.input.focus();
      } else {
        // If last element was deleted, focus the new end element
        const nextFocusIndex = index >= remainingChips.length ? remainingChips.length - 1 : index;
        this.focusChip(nextFocusIndex);
      }
    } else {
      this.input.focus();
    }
  }

  /**
   * Directs focus to a chip element using roving tabindex
   * @param {number} index
   */
  focusChip(index) {
    const chips = this.getChips();

    // Reset all chips and buttons to non-focusable
    chips.forEach(chip => {
      chip.setAttribute('tabindex', '-1');
      chip.querySelector('.tag-remove-btn').setAttribute('tabindex', '-1');
    });

    if (index >= 0 && index < chips.length) {
      this.focusedChipIndex = index;
      const targetChip = chips[index];
      targetChip.setAttribute('tabindex', '0');
      targetChip.focus();
    } else {
      this.focusedChipIndex = -1;
      this.input.focus();
    }
  }

  /**
   * Keyboard routing for input field
   * @private
   */
  _handleInputKeydown(e) {
    const value = this.input.value;
    const chips = this.getChips();

    if (e.key === 'Enter') {
      e.preventDefault();
      this.addTag(value);
    } else if (e.key === 'Backspace' && value === '' && chips.length > 0) {
      e.preventDefault();
      this.focusChip(chips.length - 1);
    } else if (e.key === 'ArrowLeft' && value === '' && this.input.selectionStart === 0 && chips.length > 0) {
      e.preventDefault();
      this.focusChip(chips.length - 1);
    }
  }

  /**
   * Keyboard routing for list elements
   * @private
   */
  _handleListKeydown(e) {
    const chips = this.getChips();
    if (chips.length === 0) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.focusedChipIndex > 0) {
          this.focusChip(this.focusedChipIndex - 1);
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (this.focusedChipIndex < chips.length - 1) {
          this.focusChip(this.focusedChipIndex + 1);
        } else {
          // Focus returns cleanly back to input field
          this.focusChip(-1);
        }
        break;

      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        if (this.focusedChipIndex !== -1) {
          this.removeTag(chips[this.focusedChipIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.focusChip(-1);
        break;

      case 'Home':
        e.preventDefault();
        this.focusChip(0);
        break;

      case 'End':
        e.preventDefault();
        this.focusChip(chips.length - 1);
        break;
    }
  }

  /**
   * Handles button click delegation inside the chip list
   * @private
   */
  _handleListClick(e) {
    const removeBtn = e.target.closest('.tag-remove-btn');
    if (removeBtn) {
      e.stopPropagation();
      const chip = removeBtn.closest('.tag-chip');
      this.removeTag(chip);
      return;
    }

    const chip = e.target.closest('.tag-chip');
    if (chip) {
      e.stopPropagation();
      const chips = this.getChips();
      this.focusChip(chips.indexOf(chip));
    }
  }

  /**
   * Redirects outer container clicks back to input
   * @private
   */
  _handleContainerClick(e) {
    if (e.target === this.container || e.target === this.list) {
      this.input.focus();
    }
  }

  /**
   * Resets and clears the component state
   */
  reset() {
    this.list.innerHTML = '';
    this.input.value = '';
    this.focusedChipIndex = -1;
    this.announce('All tags have been cleared.');
    this.input.focus();
    if (this.onTagsChange) {
      this.onTagsChange([]);
    }
  }

  /**
   * Removes all registered event listeners to prevent leaks
   */
  destroy() {
    this._listeners.forEach((handler, key) => {
      key.element.removeEventListener(key.eventType, handler);
    });
    this._listeners.clear();
    this.list.innerHTML = '';
  }
}
