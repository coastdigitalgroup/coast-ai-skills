/**
 * AccessibleDragAndDrop: A portable, lightweight vanilla JS class for
 * implementing keyboard, mouse, and touch reordering on standard lists.
 */
class AccessibleDragAndDrop {
  /**
   * @param {Object} options
   * @param {string} options.listSelector - Selector for the list container (ul or ol)
   * @param {string} options.itemSelector - Selector for individual list items
   * @param {string} options.handleSelector - Selector for the grab handle button inside items
   * @param {string} options.announcerId - ID of an offscreen element with aria-live="assertive"
   * @param {Function} [options.onReorder] - Callback on list reordering completion
   */
  constructor({
    listSelector,
    itemSelector,
    handleSelector,
    announcerId,
    onReorder = () => {}
  }) {
    this.list = document.querySelector(listSelector);
    if (!this.list) {
      console.warn(`[AccessibleDragAndDrop] Container "${listSelector}" not found.`);
      return;
    }

    this.itemSelector = itemSelector;
    this.handleSelector = handleSelector;
    this.onReorder = onReorder;

    // Retrieve or create offscreen live announcer
    this.announcer = document.getElementById(announcerId);
    if (!this.announcer) {
      this.announcer = document.createElement('div');
      this.announcer.id = announcerId;
      this.announcer.className = 'sr-only';
      this.announcer.setAttribute('aria-live', 'assertive');
      this.announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.announcer);
    }

    this.activeItem = null;
    this.grabbedIndex = -1;
    this.originalOrder = [];

    // Drag-over styling classes
    this.grabbedClass = 'is-grabbed';
    this.dragOverTopClass = 'drag-over-top';
    this.dragOverBottomClass = 'drag-over-bottom';

    this.initKeyboard();
    this.initPointerDrag();
  }

  /**
   * Post assertive feedback to assistive technologies.
   * @param {string} text
   */
  announce(text) {
    this.announcer.textContent = '';
    // Small timeout ensures screen readers register the text node replacement
    setTimeout(() => {
      this.announcer.textContent = text;
    }, 50);
  }

  getItemName(item) {
    // Attempt to read label, then aria-label, fallback to inner text content
    const handle = item.querySelector(this.handleSelector);
    if (handle && handle.getAttribute('aria-label')) {
      return handle.getAttribute('aria-label').replace(/^Reorder\s*/i, '');
    }
    return item.textContent.replace(/\s+/g, ' ').trim();
  }

  getCurrentIndex(item) {
    return Array.from(this.list.children).indexOf(item);
  }

  // --- KEYBOARD ORCHESTRATION ---
  initKeyboard() {
    this.list.addEventListener('keydown', (e) => {
      const handle = e.target.closest(this.handleSelector);
      if (!handle) return;

      const item = handle.closest(this.itemSelector);
      const items = Array.from(this.list.children);
      const currentIndex = items.indexOf(item);

      switch (e.key) {
        case ' ': // Spacebar
        case 'Enter':
          e.preventDefault();
          this.toggleKeyboardGrab(item, handle, currentIndex);
          break;

        case 'ArrowDown':
        case 'ArrowRight':
          if (this.activeItem) {
            e.preventDefault();
            this.moveKeyboardItem(currentIndex, currentIndex + 1);
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          if (this.activeItem) {
            e.preventDefault();
            this.moveKeyboardItem(currentIndex, currentIndex - 1);
          }
          break;

        case 'Escape':
          if (this.activeItem) {
            e.preventDefault();
            this.cancelKeyboardReorder();
          }
          break;

        case 'Tab':
          // Auto-commit active grabs on tab away or losing focus
          if (this.activeItem) {
            this.toggleKeyboardGrab(this.activeItem, this.activeItem.querySelector(this.handleSelector), currentIndex);
          }
          break;
      }
    });
  }

  toggleKeyboardGrab(item, handle, index) {
    const isGrabbed = handle.getAttribute('aria-pressed') === 'true';

    if (!isGrabbed) {
      // Begin reorder mode
      this.activeItem = item;
      this.grabbedIndex = index;
      this.originalOrder = Array.from(this.list.children);

      item.classList.add(this.grabbedClass);
      handle.setAttribute('aria-pressed', 'true');

      this.announce(
        `Grabbed item "${this.getItemName(item)}". Position ${index + 1} of ${this.originalOrder.length}. Use Arrow Up and Arrow Down keys to reorder, Spacebar to drop, Escape to cancel.`
      );
    } else {
      // Drop item
      this.activeItem = null;
      item.classList.remove(this.grabbedClass);
      handle.setAttribute('aria-pressed', 'false');

      this.announce(
        `Dropped "${this.getItemName(item)}" at position ${index + 1} of ${this.list.children.length}. List reordered.`
      );
      this.emitReorder();
    }
  }

  moveKeyboardItem(fromIndex, toIndex) {
    const items = Array.from(this.list.children);
    if (toIndex < 0 || toIndex >= items.length) return;

    const currentItem = items[fromIndex];
    const targetItem = items[toIndex];

    if (toIndex > fromIndex) {
      this.list.insertBefore(currentItem, targetItem.nextSibling);
    } else {
      this.list.insertBefore(currentItem, targetItem);
    }

    // Crucial: Restore focus immediately onto the button handle.
    // DOM reordering drops browser focus states by default.
    const handle = currentItem.querySelector(this.handleSelector);
    if (handle) {
      handle.focus();
    }

    this.announce(`Moved "${this.getItemName(currentItem)}" to position ${toIndex + 1} of ${items.length}.`);
  }

  cancelKeyboardReorder() {
    if (!this.activeItem) return;

    this.list.innerHTML = '';
    this.originalOrder.forEach(node => this.list.appendChild(node));

    const originalItem = this.originalOrder[this.grabbedIndex];
    const handle = originalItem.querySelector(this.handleSelector);

    originalItem.classList.remove(this.grabbedClass);
    if (handle) {
      handle.setAttribute('aria-pressed', 'false');
      handle.focus();
    }

    this.announce(`Reordering canceled. "${this.getItemName(originalItem)}" restored to position ${this.grabbedIndex + 1}.`);

    this.activeItem = null;
    this.originalOrder = [];
  }

  // --- MOUSE & POINTER DRAG ---
  initPointerDrag() {
    let draggedItem = null;
    let dragOverItem = null;

    const items = this.list.querySelectorAll(this.itemSelector);
    items.forEach(item => {
      item.setAttribute('draggable', 'true');
    });

    this.list.addEventListener('dragstart', (e) => {
      // Restrict dragging to the handle element only
      const handle = e.target.closest(this.handleSelector);
      if (!handle) {
        e.preventDefault();
        return;
      }

      draggedItem = e.target.closest(this.itemSelector);
      if (!draggedItem) return;

      draggedItem.classList.add(this.grabbedClass);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggedItem.id || '');

      this.announce(`Started dragging item "${this.getItemName(draggedItem)}".`);
    });

    this.list.addEventListener('dragover', (e) => {
      e.preventDefault(); // Allows drop to register
      const currentOverItem = e.target.closest(this.itemSelector);
      if (!currentOverItem || currentOverItem === draggedItem) return;

      if (dragOverItem && dragOverItem !== currentOverItem) {
        dragOverItem.classList.remove(this.dragOverTopClass, this.dragOverBottomClass);
      }

      dragOverItem = currentOverItem;

      const rect = dragOverItem.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const midY = rect.height / 2;

      if (relativeY < midY) {
        dragOverItem.classList.add(this.dragOverTopClass);
        dragOverItem.classList.remove(this.dragOverBottomClass);
      } else {
        dragOverItem.classList.add(this.dragOverBottomClass);
        dragOverItem.classList.remove(this.dragOverTopClass);
      }
    });

    this.list.addEventListener('dragleave', (e) => {
      const item = e.target.closest(this.itemSelector);
      if (item) {
        item.classList.remove(this.dragOverTopClass, this.dragOverBottomClass);
      }
    });

    this.list.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!draggedItem || !dragOverItem) return;

      const insertBeforeTarget = dragOverItem.classList.contains(this.dragOverTopClass);

      if (insertBeforeTarget) {
        this.list.insertBefore(draggedItem, dragOverItem);
      } else {
        this.list.insertBefore(draggedItem, dragOverItem.nextSibling);
      }

      const finalIndex = this.getCurrentIndex(draggedItem);
      this.announce(`Dropped "${this.getItemName(draggedItem)}" at position ${finalIndex + 1} of ${this.list.children.length}.`);
      this.emitReorder();
    });

    this.list.addEventListener('dragend', () => {
      if (draggedItem) {
        draggedItem.classList.remove(this.grabbedClass);
      }
      const allItems = this.list.querySelectorAll(this.itemSelector);
      allItems.forEach(item => {
        item.classList.remove(this.dragOverTopClass, this.dragOverBottomClass);
      });
      draggedItem = null;
      dragOverItem = null;
    });
  }

  emitReorder() {
    const finalItemsArray = Array.from(this.list.querySelectorAll(this.itemSelector));
    const indexMap = finalItemsArray.map((item, index) => ({
      id: item.id || null,
      index,
      name: this.getItemName(item)
    }));
    this.onReorder(finalItemsArray, indexMap);
  }
}
