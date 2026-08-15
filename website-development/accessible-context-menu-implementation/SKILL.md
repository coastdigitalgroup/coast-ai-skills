---
name: accessible-context-menu-implementation
description: Implement, style, and debug highly accessible, viewport-aware custom context menus using semantic HTML, keyboard roving tabindex focus controls, and mobile touch-friendly long-press interaction handlers.
---

# Accessible Context Menu Implementation

## Purpose

The Accessible Context Menu skill provides a robust frontend engineering protocol for designing, implementing, and debugging custom context menus (the options menu triggered by right-clicking or long-pressing an element).

While custom context menus are vital for desktop-grade SaaS dashboards, file managers, and rich collaborative canvases, they are notoriously difficult to implement correctly. Standard implementations often break native browser context menus, fail to support mobile touch displays, overflow past screen edges (viewport collision), create keyboard traps, and remain entirely invisible to screen readers. This skill details the technical steps to resolve these defects, ensuring menus are fully keyboard-navigable, screen-reader compatible, responsive, and resilient.

---

## Use Cases

- **File and Asset Managers:** Triggering custom actions (e.g., "Rename", "Download", "Delete", "Share") on specific files, folders, or grid cards.
- **Rich Text / Code Editors:** Right-clicking on selected text or workspace rows to copy, format, or search.
- **Collaborative Canvases and Dashboards:** Interactive nodes or panels that have context-specific actions.
- **List and Grid Items:** Adding quick access utility menus to list items on dense, mouse-driven desktop views.

---

## When NOT to Use

- **Global Navigation:** For top-level main site navigation, use standard navigation links (see `responsive-navigation-implementation`).
- **Dropdown / Select Fields:** For standard form fields where a user chooses from options, use standard select elements (`<select>`) or a combobox (see `accessible-combobox-implementation`).
- **Split Buttons and Accordions:** For general in-page action menus associated with a static button, use standard popover disclosures or custom popover API buttons (see `popover-api-implementation`).
- **Standard Link Directories:** Avoid replacing browser link context menus (like "Open link in new tab"). Custom context menus must only be applied to custom application objects, not standard anchor links.

---

## Inputs

1. **Trigger Target:** The DOM element(s) or class selector that should intercept the native contextmenu event.
2. **Context Options Configuration:** The array of actions, labels, icons, and keyboard shortcuts required for the menu.
3. **Trigger Source:** Mouse right-clicks, keyboard triggers (`Shift+F10` or the native `Context Menu` key), and mobile touch events (long-press).
4. **Bounding Layout:** Sticky headers, sidebars, and viewport dimensions to calculate boundaries.

---

## Outputs

1. **Semantic ARIA Structure:** An overlay utilizing `role="menu"` for the container and `role="menuitem"` (or `menuitemcheckbox`/`menuitemradio`) for choices, complete with state management attributes (`aria-expanded`, `aria-haspopup`).
2. **Viewport-Aware Positioning Script:** A lightweight script that computes the exact coordinates of the trigger event and adjusts the menu position to prevent off-screen clipping.
3. **Roving Tabindex Controller:** Focus management logic that handles arrow-key navigation (up/down), Home, End, Escape closing, and focus restoration to the trigger element on dismissal.
4. **Mobile Long-Press Emulator:** An event handler mapping touch events (`touchstart`, `touchend`, `touchmove`) to a simulated context menu trigger, preventing accidental page scrolls.

---

## Workflow

### 1. Construct the Semantic HTML Structure

A custom context menu is not just a styled `<div>`. It is a semantic menu pattern that assistive technologies rely on for navigation.

- Use a wrapper with `role="menu"`.
- Use a `<ul>` containing `<li>` elements, where each interactive trigger has `role="menuitem"`.
- Keep the menu hidden in the DOM via `aria-hidden="true"`, `display: none`, or the native `popover` attribute, then toggle states dynamically.

```html
<div id="app-context-menu"
     class="context-menu"
     role="menu"
     aria-hidden="true"
     tabindex="-1">
  <ul class="context-menu-list">
    <li role="presentation">
      <button type="button"
              role="menuitem"
              id="menuitem-open"
              tabindex="-1"
              class="context-menu-item">
        <span class="menuitem-icon" aria-hidden="true">📂</span>
        <span class="menuitem-label">Open Item</span>
        <span class="menuitem-shortcut">Enter</span>
      </button>
    </li>
    <li role="presentation">
      <button type="button"
              role="menuitem"
              id="menuitem-rename"
              tabindex="-1"
              class="context-menu-item">
        <span class="menuitem-icon" aria-hidden="true">✏️</span>
        <span class="menuitem-label">Rename</span>
        <span class="menuitem-shortcut">F2</span>
      </button>
    </li>
    <li role="separator" class="context-menu-separator"></li>
    <li role="presentation">
      <button type="button"
              role="menuitem"
              id="menuitem-delete"
              tabindex="-1"
              class="context-menu-item context-menu-item-danger">
        <span class="menuitem-icon" aria-hidden="true">🗑️</span>
        <span class="menuitem-label">Delete</span>
        <span class="menuitem-shortcut">Del</span>
      </button>
    </li>
  </ul>
</div>
```

---

### 2. Set Up Context Capture (Mouse & Keyboard)

Standard users trigger context menus via right-click or the context-menu keyboard shortcuts (`Shift+F10` or the dedicated `Apps` key). We must capture both while preserving standard focus parameters.

- **Capture Right-Click:** Prevent the default system menu by calling `e.preventDefault()` inside the `contextmenu` listener.
- **Capture Keyboard Triggers:** High-quality browsers trigger the `contextmenu` event natively when keyboard shortcuts (`Shift+F10`, Menu key) are pressed. However, if the target is triggered via a keyboard, the coordinates (`clientX`, `clientY`) will be `0` or centered on the element. Your positioning logic must detect this and position the menu at the element's corner instead of the cursor position.

```javascript
targetElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  // Detect if event is from a keyboard trigger
  const isKeyboard = e.button === 0 || (e.clientX === 0 && e.clientY === 0);

  let posX = e.clientX;
  let posY = e.clientY;

  if (isKeyboard) {
    // Position menu near the trigger item's bottom-left corner
    const rect = targetElement.getBoundingClientRect();
    posX = rect.left;
    posY = rect.bottom;
  }

  openContextMenu(posX, posY, targetElement);
});
```

---

### 3. Handle Boundary-Aware Positioning (CSS & JS)

If a user right-clicks near the bottom-right of the screen, the custom menu will overflow off-screen, creating layout bugs and clipping interactive options. The script must calculate available space before positioning.

```javascript
function calculatePosition(x, y, menuElement) {
  // Briefly make menu visible but offscreen or transparent to get dimensions
  menuElement.style.display = 'block';
  const menuWidth = menuElement.offsetWidth;
  const menuHeight = menuElement.offsetHeight;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Account for scroll offsets
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  let finalX = x + scrollX;
  let finalY = y + scrollY;

  // Viewport Collision: Horizontal Boundary
  if (x + menuWidth > viewportWidth) {
    finalX = (x - menuWidth) + scrollX;
    // Safety check in case it now clips the left edge
    if (finalX < 0) finalX = scrollX;
  }

  // Viewport Collision: Vertical Boundary
  if (y + menuHeight > viewportHeight) {
    finalY = (y - menuHeight) + scrollY;
    // Safety check in case it now clips the top edge
    if (finalY < 0) finalY = scrollY;
  }

  return { x: finalX, y: finalY };
}
```

```css
.context-menu {
  position: absolute;
  z-index: 1000; /* Ensure overlay floats on top of other elements */
  display: none; /* Control display state through JS */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  min-width: 180px;
}
```

---

### 4. Implement Roving Tabindex & Focus Control

Once open, the context menu must trap focus and follow standard WAI-ARIA Menu keyboard rules:
- **Focus the First Item:** When the menu is opened, instantly move keyboard focus to the first active `.context-menu-item`.
- **Roving Tabindex:** Maintain focus within the menu using Arrow keys. The container itself should not receive focus.
- **Escape Close:** Pressing `Escape` closes the menu and restores focus back to the target element that opened the menu.
- **Close on Out-Click:** Clicking anywhere outside the menu must close it.

```javascript
class RovingFocusMenu {
  constructor(menuElement, triggerElement) {
    this.menu = menuElement;
    this.trigger = triggerElement;
    this.items = Array.from(this.menu.querySelectorAll('[role="menuitem"]'));
    this.currentIndex = 0;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.init();
  }

  init() {
    this.items.forEach(item => item.setAttribute('tabindex', '-1'));
    this.items[0].setAttribute('tabindex', '0');
    this.items[0].focus();

    this.menu.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
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
        // Tab is explicitly blocked to keep focus confined inside the overlay
        e.preventDefault();
        break;
    }
  }

  moveFocus(direction) {
    this.items[this.currentIndex].setAttribute('tabindex', '-1');
    this.currentIndex = (this.currentIndex + direction + this.items.length) % this.items.length;
    this.focusCurrentItem();
  }

  focusCurrentItem() {
    const item = this.items[this.currentIndex];
    item.setAttribute('tabindex', '0');
    item.focus();
  }

  close() {
    this.menu.removeEventListener('keydown', this.handleKeyDown);
    this.menu.style.display = 'none';
    this.menu.setAttribute('aria-hidden', 'true');
    this.trigger.focus(); // Focus Restoration
  }
}
```

---

### 5. Handle Mobile Touch Screens (Long-Press Emulation)

Mobile viewports do not have a right-click. Mobile users expect context menus to trigger on a "long-press" (holding their finger down on an element for ~500ms).
- **Prevent Native Interactions:** When long-pressing, prevent native text selection or callouts.
- **Simulate coordinates:** Trigger the context menu based on the `touch` coordinates.
- **Scroll Detection:** If the user scrolls their finger, cancel the timer so the menu does not trigger during standard page scrolling.

```javascript
let touchTimer = null;
let lastTouchStart = null;

function setupTouchEvents(element) {
  element.addEventListener('touchstart', (e) => {
    // Capture touch point
    const touch = e.touches[0];
    lastTouchStart = { x: touch.clientX, y: touch.clientY };

    // Setup timer to trigger context menu after 500ms
    touchTimer = setTimeout(() => {
      e.preventDefault(); // Prevent standard browser select magnifier
      openContextMenu(touch.clientX, touch.clientY, element);
    }, 500);
  }, { passive: false });

  element.addEventListener('touchmove', (e) => {
    if (!lastTouchStart) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - lastTouchStart.x);
    const diffY = Math.abs(touch.clientY - lastTouchStart.y);

    // If user moves finger > 10px, they are scrolling, cancel the menu
    if (diffX > 10 || diffY > 10) {
      clearTimeout(touchTimer);
    }
  });

  element.addEventListener('touchend', () => {
    clearTimeout(touchTimer);
    lastTouchStart = null;
  });
}
```

---

## Decision Rules

### Triggering Paradigm Selection

| Implementation Pattern | Native `<div popover>` Pattern | JS Managed absolute position overlay |
| :--- | :--- | :--- |
| **Use case** | Best when building on modern browsers with native rendering support. | Best when support for legacy browsers is mandatory, or when positioning needs complex animation libraries. |
| **DOM overhead** | Extremely light. Utilizes browser native top-layer stacking context. | Standard. Needs careful handling of `z-index` stacking context issues. |
| **Pros** | Automatically places menu in the top-layer, bypassing parent `overflow: hidden` bugs. | Fully custom control over CSS transforms and precise placement heuristics. |
| **Cons** | Requires polyfills for older browser support (e.g. Safari < 17). | Prone to being cropped if parent containers use `overflow: hidden` or absolute transforms. |

### Roving Tabindex vs. Aria-ActiveDescendant

- **Use Roving Tabindex (Default) when:** Implementing simple or medium menus where DOM structures are direct. This moves physical keyboard focus natively to buttons, ensuring screen reader feedback is instantaneous and standard outlines work out-of-the-box.
- **Use `aria-activedescendant` when:** Building highly dynamic multi-level trees (e.g. inside a massive folder hierarchy) where moving physical focus breaks virtual focus trackers or interrupts rapid input matching.

---

## Constraints

- **Z-Index Stacking Issues:** A context menu must not be trapped beneath other absolute overlays or dialogs. If the parent container has `overflow: hidden`, a custom absolutely positioned context menu *will be clipped*.
  - *Mitigation:* Always append the context menu `<div>` directly to the `<body>` element, or use the HTML native `popover` API to promote it directly into the browser's native **Top Layer**.
- **Touch Target Sizing:** Mobile items must be at least **44x44px** in height. Compact desktop style context menus with 24px rows must scale up to be tap-friendly when mobile touch triggers are detected.
- **Forced Colors Mode:** Windows Contrast Mode overrides standard color mappings. You must utilize CSS properties like `outline` and native system colors (e.g. `SelectedText`, `ButtonText`) to ensure elements remain distinct.
- **Page Scrolling Suppression:** When the menu is active, keyboard arrow keys must not scroll the background page. You must intercept keydowns (`ArrowUp`, `ArrowDown`) and call `e.preventDefault()`.

---

## Non-Goals

- Replacing the user's *global* browser context menu across the entire page (the goal is limited, scoped context menus on specific interactive workspace entities).
- Creating complex nested cascading menus that span three or more levels deep (multi-tier trees require complex coordination beyond the scope of a standard context menu).
- Standard dropdown forms or combobox selections.

---

## Common Failure Patterns

- **The Overflow Crop:** Appending the context menu directly inside an item card that has `overflow: hidden` on its CSS. When right-clicked near the border, the menu gets cut off and becomes unusable.
- **Double Menus (Missing `preventDefault`):** Forgetting to stop the native context menu event. Right-clicking displays both your custom overlay and the standard browser menu stacked on top of it.
- **Keyboard Trap:** Forgetting to handle the `Tab` or `Escape` key inside the menu, locking keyboard users into the menu with no way to close it without refreshing.
- **Flickering Placement:** Computing positions inside a container layout without adding the page scroll values (`window.scrollY`), leading to menus rendering in the wrong location when the page is scrolled down.
- **Text Selection Highlight on Hold:** Mobile users holding down to trigger the menu get the native iOS/Android text selector highlight instead of a clean, responsive popup.

---

## Validation Criteria

- [ ] **Context Menu Suppression Check:** Right-click inside the trigger area. Verify that the native system menu is fully blocked and ONLY the custom context menu is displayed.
- [ ] **Keyboard Invocation Check:** Select the target element and press `Shift + F10` or the `Context Menu` key. Ensure the context menu opens correctly anchored at the bottom-left corner of the element, not at `(0,0)`.
- [ ] **Roving Keyboard Focus Test:** Open the menu and press `ArrowDown` and `ArrowUp`. Verify focus moves cleanly between options, that the container stops background scrolling, and that `Tab` is blocked.
- [ ] **Focus Restoration Check:** Focus an option, then press `Escape`. Confirm that the menu collapses and keyboard focus is returned exactly back to the element that was right-clicked.
- [ ] **Out-Of-Bounds Position Test:** Right-click at the very bottom-right corner of the window. Verify that the menu relocates its anchor coordinates to render entirely within the screen boundaries.
- [ ] **Mobile Long-Press Test:** Open the page on a mobile device or toggle the mobile emulator in Chrome DevTools. Perform a 500ms long-press. Ensure the menu triggers without opening native text selectors, and verify that finger scrolling cancels the trigger cleanly.
- [ ] **Screen Reader Readout Check:** Open a screen reader (e.g. VoiceOver). Ensure that right-clicking announces the menu landmark (e.g. *"Context Menu, menu, 4 items"*) and that moving arrows correctly reads option labels.
- [ ] **Windows High Contrast Verification:** Toggle system contrast themes. Ensure that boundaries, active focus boxes, and item icons are clearly visible and conform to accessibility thresholds.
