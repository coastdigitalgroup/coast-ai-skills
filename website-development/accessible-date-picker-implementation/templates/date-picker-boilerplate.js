/**
 * AccessibleDatePicker - A fully WCAG 2.1 AA compliant, highly portable custom
 * calendar date picker written in pure vanilla JavaScript.
 *
 * Implements the WAI-ARIA 1.2 Combobox and Dialog Grid design patterns.
 */
class AccessibleDatePicker {
  /**
   * @param {Object} config - Configuration object
   * @param {HTMLElement} config.wrapperElement - Container wrapping the input and dialog
   * @param {HTMLInputElement} config.inputElement - Target manual text input
   * @param {HTMLButtonElement} config.toggleButton - Trigger button for opening the calendar
   * @param {HTMLElement} config.dialogElement - Dialog container element
   * @param {HTMLElement} config.daysContainer - Tbody or Grid container where days will render
   * @param {HTMLElement} config.titleElement - Heading showing month and year (e.g. h2)
   * @param {HTMLButtonElement} config.prevButton - Button to navigate to previous month
   * @param {HTMLButtonElement} config.nextButton - Button to navigate to next month
   * @param {HTMLElement} config.liveAnnouncer - Screen reader polite live region
   * @param {Date} [config.minDate] - Earliest selectable date (defaults to today)
   * @param {Date} [config.maxDate] - Latest selectable date (optional)
   * @param {Array<string>} [config.months] - Custom localized month names
   * @param {Array<string>} [config.daysOfWeek] - Custom localized days of week
   * @param {Function} [config.onSelect] - Selection callback passing selected Date
   */
  constructor({
    wrapperElement,
    inputElement,
    toggleButton,
    dialogElement,
    daysContainer,
    titleElement,
    prevButton,
    nextButton,
    liveAnnouncer,
    minDate = null,
    maxDate = null,
    months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    onSelect = null
  }) {
    this.wrapper = wrapperElement;
    this.input = inputElement;
    this.toggle = toggleButton;
    this.dialog = dialogElement;
    this.daysContainer = daysContainer;
    this.titleElement = titleElement;
    this.prevBtn = prevButton;
    this.nextBtn = nextButton;
    this.announcer = liveAnnouncer;

    this.minDate = minDate || new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = maxDate;

    this.months = months;
    this.daysOfWeek = daysOfWeek;
    this.onSelect = onSelect;

    this.currentViewDate = new Date();
    this.selectedDate = null;
    this.focusedDate = null;
    this.isOpen = false;

    this.init();
  }

  /**
   * Set up keyboard focus binding and manual event listeners
   */
  init() {
    // Correctly enforce button tag specifications for form protection
    if (this.toggle.getAttribute('type') !== 'button') {
      this.toggle.setAttribute('type', 'button');
    }
    if (this.prevBtn.getAttribute('type') !== 'button') {
      this.prevBtn.setAttribute('type', 'button');
    }
    if (this.nextBtn.getAttribute('type') !== 'button') {
      this.nextBtn.setAttribute('type', 'button');
    }

    // Toggle overlay
    this.toggle.addEventListener('click', () => this.toggleDialog());

    // Month Navigation
    this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
    this.nextBtn.addEventListener('click', () => this.changeMonth(1));

    // Focus / Validation on native text input
    this.input.addEventListener('blur', () => this.validateInput());

    // Click outside handler
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.wrapper.contains(e.target)) {
        this.closeDialog(false);
      }
    });

    // Handle focus trapping and arrow keys inside the dialog
    this.dialog.addEventListener('keydown', (e) => this.handleDialogKeyDown(e));
  }

  toggleDialog() {
    if (this.isOpen) {
      this.closeDialog(true);
    } else {
      this.openDialog();
    }
  }

  openDialog() {
    this.isOpen = true;
    this.dialog.removeAttribute('hidden');
    this.toggle.setAttribute('aria-expanded', 'true');

    // Parse current input field value or fall back to current date
    const parsed = this.parseDateString(this.input.value);
    if (parsed && (!this.minDate || parsed >= this.minDate) && (!this.maxDate || parsed <= this.maxDate)) {
      this.selectedDate = parsed;
      this.currentViewDate = new Date(parsed);
    } else {
      this.currentViewDate = new Date();
      if (this.minDate && this.currentViewDate < this.minDate) {
        this.currentViewDate = new Date(this.minDate);
      }
    }

    this.focusedDate = new Date(this.currentViewDate);
    this.renderCalendar();

    // programmatically move focus to the roving tabindex cell (0) inside grid
    setTimeout(() => {
      const activeCell = this.daysContainer.querySelector('.day-btn[tabindex="0"]');
      if (activeCell) {
        activeCell.focus();
      }
    }, 50);
  }

  closeDialog(restoreFocus = true) {
    this.isOpen = false;
    this.dialog.setAttribute('hidden', '');
    this.toggle.setAttribute('aria-expanded', 'false');

    if (restoreFocus) {
      this.toggle.focus();
    }
  }

  changeMonth(offset) {
    this.currentViewDate.setMonth(this.currentViewDate.getMonth() + offset);
    this.focusedDate.setMonth(this.focusedDate.getMonth() + offset);

    // Bound targeted date inside month's maximum days limits
    const daysInMonth = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth() + 1, 0).getDate();
    if (this.focusedDate.getDate() > daysInMonth) {
      this.focusedDate.setDate(daysInMonth);
    }

    // Boundaries clipping for min/max offsets
    if (this.minDate && this.focusedDate < this.minDate) {
      this.focusedDate = new Date(this.minDate);
    }
    if (this.maxDate && this.focusedDate > this.maxDate) {
      this.focusedDate = new Date(this.maxDate);
    }

    this.renderCalendar();
    this.announceState(`${this.months[this.currentViewDate.getMonth()]} ${this.currentViewDate.getFullYear()}`);

    // Refocus active roving element after render
    setTimeout(() => {
      const activeCell = this.daysContainer.querySelector('.day-btn[tabindex="0"]');
      if (activeCell) {
        activeCell.focus();
      }
    }, 50);
  }

  announceState(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
    }
  }

  renderCalendar() {
    const year = this.currentViewDate.getFullYear();
    const month = this.currentViewDate.getMonth();

    this.titleElement.textContent = `${this.months[month]} ${year}`;

    // Get starting day index and total days count
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    this.daysContainer.innerHTML = '';

    let row = document.createElement('tr');
    row.setAttribute('role', 'row');

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthTotalDays - i);
      const cell = this.createDayCell(prevDate, 'prev-month');
      row.appendChild(cell);
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      if (row.children.length === 7) {
        this.daysContainer.appendChild(row);
        row = document.createElement('tr');
        row.setAttribute('role', 'row');
      }

      const date = new Date(year, month, day);
      const cell = this.createDayCell(date, 'current-month');
      row.appendChild(cell);
    }

    // Next month filler days
    let nextDayIndex = 1;
    while (row.children.length < 7) {
      const nextDate = new Date(year, month + 1, nextDayIndex++);
      const cell = this.createDayCell(nextDate, 'next-month');
      row.appendChild(cell);
    }
    this.daysContainer.appendChild(row);
  }

  createDayCell(date, monthType) {
    const td = document.createElement('td');
    td.setAttribute('role', 'gridcell');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `day-btn ${monthType}`;
    button.textContent = date.getDate();

    const isToday = this.isSameDay(date, new Date());
    const isSelected = this.selectedDate && this.isSameDay(date, this.selectedDate);
    const isFocused = this.focusedDate && this.isSameDay(date, this.focusedDate);

    // Boundary check
    const isDisabled = (this.minDate && date < this.minDate) || (this.maxDate && date > this.maxDate);

    if (isToday) button.classList.add('today');

    // Spoken semantic label for screen reader compatibility
    let label = `${this.daysOfWeek[date.getDay()]}, ${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    if (isToday) label += ' (Today)';
    if (isDisabled) {
      label += ' (Unavailable)';
      button.setAttribute('disabled', 'true');
      button.setAttribute('aria-disabled', 'true');
    }

    button.setAttribute('aria-label', label);

    // WAI-ARIA states
    button.setAttribute('aria-selected', isSelected ? 'true' : 'false');

    // Roving Tabindex management
    if (isFocused && !isDisabled) {
      button.setAttribute('tabindex', '0');
    } else {
      button.setAttribute('tabindex', '-1');
    }

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectDate(date);
    });

    td.appendChild(button);
    return td;
  }

  selectDate(date) {
    const isDisabled = (this.minDate && date < this.minDate) || (this.maxDate && date > this.maxDate);
    if (isDisabled) return;

    this.selectedDate = date;
    this.input.value = this.formatDate(date);

    // Trigger standard input/change events for custom framework watchers
    const event = new Event('change', { bubbles: true });
    this.input.dispatchEvent(event);

    this.closeDialog(true);

    if (this.onSelect) {
      this.onSelect(date);
    }
  }

  navigateToDate(targetDate) {
    // Apply boundary caps
    if (this.minDate && targetDate < this.minDate) {
      targetDate = new Date(this.minDate);
    }
    if (this.maxDate && targetDate > this.maxDate) {
      targetDate = new Date(this.maxDate);
    }

    const needsRerender =
      targetDate.getMonth() !== this.currentViewDate.getMonth() ||
      targetDate.getFullYear() !== this.currentViewDate.getFullYear();

    if (needsRerender) {
      this.currentViewDate = new Date(targetDate);
      this.focusedDate = new Date(targetDate);
      this.renderCalendar();
    } else {
      this.focusedDate = new Date(targetDate);

      // Perform in-place update of tabindex without expensive re-render
      const buttons = this.daysContainer.querySelectorAll('.day-btn');
      buttons.forEach(btn => {
        btn.setAttribute('tabindex', '-1');
      });

      const dayString = targetDate.getDate().toString();
      const targetBtn = Array.from(buttons).find(btn =>
        btn.textContent === dayString &&
        !btn.classList.contains('prev-month') &&
        !btn.classList.contains('next-month')
      );

      if (targetBtn) {
        targetBtn.setAttribute('tabindex', '0');
        targetBtn.focus();
      }
    }
  }

  handleDialogKeyDown(e) {
    const focusable = this.dialog.querySelectorAll('button:not([disabled])');
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    // Focus Trap wrapping
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      return;
    }

    // Dialog cancellation
    if (e.key === 'Escape') {
      this.closeDialog(true);
      e.preventDefault();
      return;
    }

    // Grid Navigation Arrow Bindings (only active when keyboard is focused inside cells)
    if (document.activeElement.classList.contains('day-btn')) {
      let handled = true;
      const nextDate = new Date(this.focusedDate);

      switch (e.key) {
        case 'ArrowLeft':
          nextDate.setDate(nextDate.getDate() - 1);
          break;
        case 'ArrowRight':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'ArrowUp':
          nextDate.setDate(nextDate.getDate() - 7);
          break;
        case 'ArrowDown':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'PageUp':
          if (e.shiftKey) {
            nextDate.setFullYear(nextDate.getFullYear() - 1);
          } else {
            nextDate.setMonth(nextDate.getMonth() - 1);
          }
          break;
        case 'PageDown':
          if (e.shiftKey) {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          } else {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          break;
        case 'Home':
          nextDate.setDate(nextDate.getDate() - nextDate.getDay());
          break;
        case 'End':
          nextDate.setDate(nextDate.getDate() + (6 - nextDate.getDay()));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.selectDate(this.focusedDate);
          return;
        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
        this.navigateToDate(nextDate);
      }
    }
  }

  validateInput() {
    const val = this.input.value.trim();
    if (val === '') return;

    const parsed = this.parseDateString(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isOutOfBounds =
      (this.minDate && parsed < this.minDate) ||
      (this.maxDate && parsed > this.maxDate);

    if (!parsed || isNaN(parsed.getTime()) || isOutOfBounds) {
      this.input.setAttribute('aria-invalid', 'true');
    } else {
      this.input.removeAttribute('aria-invalid');
      this.selectedDate = parsed;
    }
  }

  formatDate(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  parseDateString(str) {
    const parts = str.split('/');
    if (parts.length !== 3) return null;

    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(month) || isNaN(day) || isNaN(year) || year < 1000 || year > 9999) {
      return null;
    }

    const testDate = new Date(year, month, day);
    if (testDate.getFullYear() === year && testDate.getMonth() === month && testDate.getDate() === day) {
      return testDate;
    }
    return null;
  }

  isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
}

// Export for portable consumption across ESM/CJS contexts
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = AccessibleDatePicker;
} else {
  window.AccessibleDatePicker = AccessibleDatePicker;
}
