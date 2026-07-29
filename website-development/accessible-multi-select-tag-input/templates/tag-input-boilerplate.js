/**
 * AccessibleTagInput - A portable, framework-agnostic Vanilla JavaScript boilerplate
 * for building and managing fully accessible multi-select tag (chip) inputs.
 *
 * Compliance: WCAG 2.1 AA, WAI-ARIA Authoring Practices (roving focus, status live region)
 */
class AccessibleTagInput {
  /**
   * @param {Object} options Configuration options
   * @param {HTMLElement} options.container - The wrapper container element (usually a div with label)
   * @param {Array<string>} [options.initialTags=[]] - Initial list of tags to pre-populate
   * @param {string} [options.placeholder=""] - Placeholder text when input is empty
   * @param {Function} [options.onTagAdded] - Callback fired when a tag is added
   * @param {Function} [options.onTagRemoved] - Callback fired when a tag is removed
   */
  constructor({
    container,
    initialTags = [],
    placeholder = "Add a tag...",
    onTagAdded = null,
    onTagRemoved = null
  }) {
    if (!container) {
      throw new Error("AccessibleTagInput requires a valid container element.");
    }

    this.container = container;
    this.tags = new Set(initialTags);
    this.placeholder = placeholder;
    this.onTagAdded = onTagAdded;
    this.onTagRemoved = onTagRemoved;

    this.focusedTagIndex = -1; // -1 means focus is in the text input element

    // DOM References
    this.tagListElement = null;
    this.inputElement = null;
    this.liveRegionElement = null;

    this.renderSkeleton();
    this.renderTags();
    this.initEvents();
  }

  /**
   * Generates the semantic base HTML structure dynamically.
   */
  renderSkeleton() {
    this.container.classList.add('ati-widget-wrapper');

    // Generate unique IDs for accessibility linkages
    const widgetId = 'ati-' + Math.random().toString(36).substring(2, 9);
    const labelId = `${widgetId}-label`;
    const descId = `${widgetId}-desc`;

    // Extract visible label if already in DOM, or create one
    let label = this.container.querySelector('.ati-label');
    if (!label) {
      label = document.createElement('label');
      label.className = 'ati-label';
      label.id = labelId;
      label.textContent = 'Tags';
      this.container.appendChild(label);
    } else {
      label.id = labelId;
    }

    // Creating description instructions (visually hidden)
    const instructions = document.createElement('span');
    instructions.className = 'ati-visually-hidden';
    instructions.id = descId;
    instructions.textContent = 'Use Left and Right arrow keys to navigate and delete individual tags.';
    this.container.appendChild(instructions);

    // Creating outer visual input frame
    const inputFrame = document.createElement('div');
    inputFrame.className = 'ati-input-frame';

    // Semantic tag list container
    this.tagListElement = document.createElement('ul');
    this.tagListElement.className = 'ati-tag-list';
    this.tagListElement.setAttribute('role', 'list');
    this.tagListElement.setAttribute('aria-label', 'Selected items');

    // Text input
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'ati-text-input';
    this.inputElement.placeholder = this.placeholder;
    this.inputElement.setAttribute('aria-labelledby', labelId);
    this.inputElement.setAttribute('aria-describedby', descId);
    this.inputElement.autocomplete = 'off';

    // Assemble input frame
    inputFrame.appendChild(this.tagListElement);
    inputFrame.appendChild(this.inputElement);
    this.container.appendChild(inputFrame);

    // Live Region
    this.liveRegionElement = document.createElement('div');
    this.liveRegionElement.className = 'ati-visually-hidden';
    this.liveRegionElement.setAttribute('role', 'status');
    this.liveRegionElement.setAttribute('aria-live', 'polite');
    this.container.appendChild(this.liveRegionElement);
  }

  /**
   * Refreshes the selected tags within the DOM, maintaining focus context
   */
  renderTags() {
    this.tagListElement.innerHTML = '';

    Array.from(this.tags).forEach((tagValue, index) => {
      const chipId = `ati-chip-${index}-${Math.random().toString(36).substring(2, 5)}`;
      const li = document.createElement('li');
      li.className = 'ati-tag-chip';
      li.setAttribute('role', 'listitem');
      li.id = chipId;
      li.dataset.value = tagValue;

      li.innerHTML = `
        <span class="ati-chip-text">${tagValue}</span>
        <button type="button"
                class="ati-chip-remove"
                aria-describedby="${chipId}"
                aria-label="Remove ${tagValue}"
                tabindex="-1">
          &times;
        </button>
      `;

      this.tagListElement.appendChild(li);
    });

    // Update input placeholder based on tag presence
    if (this.tags.size > 0) {
      this.inputElement.removeAttribute('placeholder');
    } else {
      this.inputElement.placeholder = this.placeholder;
    }
  }

  /**
   * Initializes event listeners for keyboard navigation and mouse interactions
   */
  initEvents() {
    const inputFrame = this.container.querySelector('.ati-input-frame');

    // Clicking the frame transfers focus to input
    inputFrame.addEventListener('click', (e) => {
      if (e.target === inputFrame || e.target === this.tagListElement) {
        this.focusInput();
      }
    });

    // Handle typing and trigger arrows from input
    this.inputElement.addEventListener('keydown', (e) => this.handleInputKeyDown(e));

    // Handle roving arrow keys and deletes in the list frame
    inputFrame.addEventListener('keydown', (e) => this.handleFrameKeyDown(e));

    // Handle remove buttons mouse click
    this.tagListElement.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.ati-chip-remove');
      if (removeBtn) {
        const chip = removeBtn.closest('.ati-tag-chip');
        this.removeTagByValue(chip.dataset.value);
        this.focusInput();
      }
    });

    // Reset focused visual state when focus leaves the widget
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.clearTagFocusState();
      }
    });
  }

  /**
   * Key event listener directly on the text input element
   */
  handleInputKeyDown(e) {
    const value = this.inputElement.value.trim();

    if (e.key === 'Enter') {
      e.preventDefault();
      if (value !== '') {
        this.addTag(value);
        this.inputElement.value = '';
      }
    } else if (e.key === 'ArrowLeft' && this.inputElement.selectionStart === 0) {
      // Left Arrow key triggers roving focus on tags when empty
      const chips = this.getChips();
      if (chips.length > 0) {
        e.preventDefault();
        this.focusTag(chips.length - 1);
      }
    } else if (e.key === 'Backspace' && this.inputElement.selectionStart === 0) {
      // Direct Backspace focuses the last tag to avoid accidental immediate deletes
      const chips = this.getChips();
      if (chips.length > 0) {
        e.preventDefault();
        this.focusTag(chips.length - 1);
      }
    }
  }

  /**
   * Key listener on the visual wrapper frame (for tags traversal)
   */
  handleFrameKeyDown(e) {
    if (this.focusedTagIndex === -1) return; // Ignore if focused inside the actual input field

    const chips = this.getChips();

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.focusedTagIndex > 0) {
          this.focusTag(this.focusedTagIndex - 1);
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (this.focusedTagIndex < chips.length - 1) {
          this.focusTag(this.focusedTagIndex + 1);
        } else {
          this.focusInput();
        }
        break;

      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        const valueToRemove = chips[this.focusedTagIndex].dataset.value;
        const indexToFocus = this.focusedTagIndex;
        this.removeTagByValue(valueToRemove);

        // Intelligently reset roving pointer focus
        const remaining = this.getChips();
        if (remaining.length === 0) {
          this.focusInput();
        } else {
          const nextFocus = Math.min(indexToFocus, remaining.length - 1);
          this.focusTag(nextFocus);
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.focusInput();
        break;

      case 'Tab':
        // Let standard tab indexing proceed naturally (and clear the temporary focused state)
        this.clearTagFocusState();
        break;
    }
  }

  /**
   * Adds a tag to the state and re-renders
   * @param {string} value - The tag value
   */
  addTag(value) {
    const sanitized = value.trim();
    if (!sanitized) return;

    if (this.tags.has(sanitized)) {
      this.announce(`Tag "${sanitized}" already selected.`);
      return;
    }

    this.tags.add(sanitized);
    this.renderTags();
    this.announce(`Added tag: ${sanitized}`);

    if (this.onTagAdded) {
      this.onTagAdded(sanitized);
    }
  }

  /**
   * Deletes a tag from state and re-renders
   * @param {string} value - The tag value to delete
   */
  removeTagByValue(value) {
    if (!this.tags.has(value)) return;

    this.tags.delete(value);
    this.renderTags();
    this.announce(`Removed tag: ${value}. ${this.tags.size} tags remaining.`);

    if (this.onTagRemoved) {
      this.onTagRemoved(value);
    }
  }

  /**
   * Highlights and focuses a specific tag in the list
   * @param {number} index - Index of the tag to focus
   */
  focusTag(index) {
    this.clearTagFocusState();
    const chips = this.getChips();
    if (index >= 0 && index < chips.length) {
      this.focusedTagIndex = index;
      const target = chips[index];
      target.classList.add('ati-chip-focused');
      target.setAttribute('tabindex', '0');
      target.focus();
    }
  }

  /**
   * Resets focus pointers and clears visual classes
   */
  clearTagFocusState() {
    const chips = this.getChips();
    chips.forEach(chip => {
      chip.classList.remove('ati-chip-focused');
      chip.removeAttribute('tabindex');
    });
    this.focusedTagIndex = -1;
  }

  /**
   * Transfers keyboard focus back into text entry input
   */
  focusInput() {
    this.clearTagFocusState();
    this.inputElement.focus();
  }

  /**
   * Retrieves current tag chip list item elements
   * @returns {Array<HTMLElement>}
   */
  getChips() {
    return Array.from(this.tagListElement.querySelectorAll('.ati-tag-chip'));
  }

  /**
   * Updates polite screen reader aria-live announcements
   * @param {string} message - Text announcement
   */
  announce(message) {
    this.liveRegionElement.textContent = '';
    // Short deferment to guarantee browsers read out the string cleanly
    setTimeout(() => {
      this.liveRegionElement.textContent = message;
    }, 50);
  }

  /**
   * Clean destruction of element observers and elements
   */
  destroy() {
    this.container.innerHTML = '';
    this.container.className = '';
  }
}

// Export module for ES6 imports or attach globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibleTagInput;
} else {
  window.AccessibleTagInput = AccessibleTagInput;
}
