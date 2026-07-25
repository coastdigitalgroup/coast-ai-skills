/**
 * AccessibleTreeView - A framework-agnostic Vanilla JavaScript controller
 * designed to bring full WAI-ARIA 1.2 compliance and interactive keyboard navigation
 * to hierarchical HTML lists.
 *
 * Requirements:
 * 1. Root container must have [role="tree"]
 * 2. Nodes must have [role="treeitem"]
 * 3. Collapsible branches must have [aria-expanded="true|false"] and contain a [role="group"] container.
 */
export class AccessibleTreeView {
  /**
   * @param {HTMLElement} treeElement - The root <ul> or container with [role="tree"]
   * @param {Object} options - Custom callbacks and configurations
   * @param {Function} [options.onSelect] - Callback triggered when a node is selected (Space/Enter/Click)
   * @param {Function} [options.onToggle] - Callback triggered when a branch is expanded or collapsed
   */
  constructor(treeElement, options = {}) {
    if (!treeElement) {
      throw new Error('AccessibleTreeView requires a valid target HTML element.');
    }

    this.tree = treeElement;
    this.onSelectCallback = options.onSelect || null;
    this.onToggleCallback = options.onToggle || null;

    this.init();
  }

  /**
   * Initializes state and attaches event handlers
   */
  init() {
    // 1. Ensure the root has correct ARIA role
    if (this.tree.getAttribute('role') !== 'tree') {
      this.tree.setAttribute('role', 'tree');
    }

    // 2. Setup initial roving tabindex (first item is 0, rest are -1)
    const allItems = this.getItems();
    if (allItems.length > 0) {
      // Find currently active item or default to first
      let hasActive = false;
      allItems.forEach((item, index) => {
        const isSelected = item.getAttribute('aria-selected') === 'true';
        if (isSelected && !hasActive) {
          item.setAttribute('tabindex', '0');
          hasActive = true;
        } else {
          item.setAttribute('tabindex', '-1');
        }
      });

      if (!hasActive) {
        allItems[0].setAttribute('tabindex', '0');
      }
    }

    // 3. Attach keyboard and click listeners (using delegation on root container)
    this.tree.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.tree.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Fetch all treeitem nodes in the tree
   * @returns {HTMLElement[]}
   */
  getItems() {
    return Array.from(this.tree.querySelectorAll('[role="treeitem"]'));
  }

  /**
   * Fetch only currently visible treeitem nodes (skips closed groups)
   * @returns {HTMLElement[]}
   */
  getVisibleItems() {
    const allItems = this.getItems();
    return allItems.filter(item => {
      let parentGroup = item.closest('[role="group"]');
      while (parentGroup) {
        const parentItem = parentGroup.closest('[role="treeitem"]');
        if (parentItem && parentItem.getAttribute('aria-expanded') === 'false') {
          return false;
        }
        parentGroup = parentItem ? parentItem.parentElement.closest('[role="group"]') : null;
      }
      return true;
    });
  }

  /**
   * Check if a node is a branch (contains collapsible children)
   * @param {HTMLElement} item
   * @returns {boolean}
   */
  isBranch(item) {
    return item.hasAttribute('aria-expanded');
  }

  /**
   * Set physical focus on a node and update the roving tabindex state
   * @param {HTMLElement} item
   */
  focusItem(item) {
    if (!item) return;

    const allItems = this.getItems();
    allItems.forEach(node => {
      node.setAttribute('tabindex', '-1');
    });

    item.setAttribute('tabindex', '0');
    item.focus();
  }

  /**
   * Toggles the expanded state of a branch node
   * @param {HTMLElement} item
   */
  toggleBranch(item) {
    if (!this.isBranch(item)) return;

    const isExpanded = item.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;
    item.setAttribute('aria-expanded', String(nextState));

    if (this.onToggleCallback) {
      this.onToggleCallback({
        element: item,
        expanded: nextState,
        id: item.id,
        label: this.getNodeLabel(item)
      });
    }
  }

  /**
   * Selects/activates a tree node
   * @param {HTMLElement} item
   */
  selectItem(item) {
    if (!item) return;

    // Remove active selection from other items
    const allItems = this.getItems();
    allItems.forEach(node => {
      node.setAttribute('aria-selected', 'false');
    });

    item.setAttribute('aria-selected', 'true');

    if (this.onSelectCallback) {
      this.onSelectCallback({
        element: item,
        id: item.id,
        label: this.getNodeLabel(item),
        isBranch: this.isBranch(item)
      });
    }
  }

  /**
   * Retrieve descriptive text from a node
   * @param {HTMLElement} item
   * @returns {string}
   */
  getNodeLabel(item) {
    // Looks for specialized label selectors first, otherwise falls back to text content
    const labelEl = item.querySelector('.node-label') || item.querySelector('.tree-label');
    return labelEl ? labelEl.textContent.trim() : item.textContent.trim();
  }

  /**
   * Master click delegator
   * @param {MouseEvent} event
   */
  handleClick(event) {
    const item = event.target.closest('[role="treeitem"]');
    if (!item) return;

    // Prevent container clicks from double firing
    event.stopPropagation();

    this.focusItem(item);

    // If clicking a specialized toggle button (e.g. Chevron/Triangle)
    const toggleTrigger = event.target.closest('.tree-toggle, .toggle-btn');
    if (toggleTrigger && this.isBranch(item)) {
      this.toggleBranch(item);
    } else {
      this.selectItem(item);
      if (this.isBranch(item) && !toggleTrigger) {
        // Option: expand folder as a secondary behavior when clicking full node
        this.toggleBranch(item);
      }
    }
  }

  /**
   * Keyboard Events implementation according to APG standards
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    const item = event.target.closest('[role="treeitem"]');
    if (!item) return;

    const visibleItems = this.getVisibleItems();
    const currentIndex = visibleItems.indexOf(item);
    let preventDefault = true;

    switch (event.key) {
      case 'ArrowDown':
        if (currentIndex < visibleItems.length - 1) {
          this.focusItem(visibleItems[currentIndex + 1]);
        }
        break;

      case 'ArrowUp':
        if (currentIndex > 0) {
          this.focusItem(visibleItems[currentIndex - 1]);
        }
        break;

      case 'ArrowRight':
        if (this.isBranch(item)) {
          if (item.getAttribute('aria-expanded') === 'false') {
            this.toggleBranch(item);
          } else {
            // Move focus into the first child node inside its nested role="group"
            const group = item.querySelector('[role="group"]');
            if (group) {
              const firstChild = group.querySelector('[role="treeitem"]');
              if (firstChild) this.focusItem(firstChild);
            }
          }
        }
        break;

      case 'ArrowLeft':
        if (this.isBranch(item) && item.getAttribute('aria-expanded') === 'true') {
          this.toggleBranch(item);
        } else {
          // Move focus to parent branch
          const group = item.parentElement.closest('[role="group"]');
          if (group) {
            const parentItem = group.closest('[role="treeitem"]');
            if (parentItem) this.focusItem(parentItem);
          }
        }
        break;

      case 'Enter':
      case ' ':
        this.selectItem(item);
        break;

      case 'Home':
        if (visibleItems.length > 0) {
          this.focusItem(visibleItems[0]);
        }
        break;

      case 'End':
        if (visibleItems.length > 0) {
          this.focusItem(visibleItems[visibleItems.length - 1]);
        }
        break;

      case '*':
        // Asterisk: Expand active node and all siblings at same level
        if (this.isBranch(item)) {
          const depthClass = this.getDepth(item);
          const allSiblingNodes = this.tree.querySelectorAll(`[role="treeitem"]`);
          allSiblingNodes.forEach(sibling => {
            if (this.isBranch(sibling) && this.getDepth(sibling) === depthClass) {
              sibling.setAttribute('aria-expanded', 'true');
            }
          });
        }
        break;

      default:
        // Type-ahead behavior: Focus next node starting with typed character
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          const char = event.key.toLowerCase();
          let nextIndex = currentIndex + 1;
          for (let i = 0; i < visibleItems.length; i++) {
            const target = visibleItems[nextIndex % visibleItems.length];
            const name = this.getNodeLabel(target).toLowerCase();
            if (name.startsWith(char)) {
              this.focusItem(target);
              break;
            }
            nextIndex++;
          }
        } else {
          preventDefault = false;
        }
        break;
    }

    if (preventDefault) {
      event.preventDefault();
    }
  }

  /**
   * Calculates depth level of the current item
   * @param {HTMLElement} item
   * @returns {number}
   */
  getDepth(item) {
    let depth = 0;
    let parent = item.parentElement;
    while (parent && parent !== this.tree) {
      if (parent.getAttribute('role') === 'group') {
        depth++;
      }
      parent = parent.parentElement;
    }
    return depth;
  }
}
