# Roving Tabindex Implementation Audit Checklist

## 1. Tab Sequence & Single Tab-Stop Verification

- [ ] **Single Active Stop:** Verify that only ONE item within the composite widget container has `tabindex="0"`.
- [ ] **Inactive Item Isolation:** Confirm that all other sibling items within the composite widget have `tabindex="-1"`.
- [ ] **Inbound Tab Test:** Press `Tab` from a preceding form input/link. Verify focus lands directly on the item marked with `tabindex="0"`.
- [ ] **Outbound Tab Test:** Press `Tab` while focused inside the composite widget. Verify focus immediately exits the entire composite widget and moves to the next focusable page element (without stepping through sibling items).
- [ ] **Shift+Tab Test:** Press `Shift+Tab` while focused on an element following the composite widget. Verify focus lands back directly on the single `tabindex="0"` active item inside the widget.

## 2. Keyboard Spatial Navigation (1D & 2D)

- [ ] **Horizontal Arrow Navigation:** For horizontal toolbars (`role="toolbar"`), tab lists (`role="tablist"`), or horizontal radio groups (`role="radiogroup"`), verify that `ArrowRight` moves focus forward and `ArrowLeft` moves focus backward.
- [ ] **Vertical Arrow Navigation:** For menus (`role="menu"`), vertical tab lists, or vertical button groups, verify that `ArrowDown` moves focus to the next item and `ArrowUp` moves focus to the previous item.
- [ ] **2D Matrix Navigation:** For grids (`role="grid"`), verify that all four arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) navigate correctly across row and column boundaries.
- [ ] **Home Key Support:** Pressing `Home` while focused anywhere inside the widget jumps focus immediately to the first visible, non-disabled item.
- [ ] **End Key Support:** Pressing `End` while focused anywhere inside the widget jumps focus immediately to the last visible, non-disabled item.
- [ ] **Prevent Default Page Scrolling:** Verify that pressing `ArrowUp`, `ArrowDown`, `Home`, or `End` inside the composite widget does NOT cause the outer web page to scroll vertically or horizontally.

## 3. Right-To-Left (RTL) & Localization Support

- [ ] **RTL Directional Inversion:** When container or parent element has `dir="rtl"` or CSS `direction: rtl`, verify that `ArrowLeft` moves to the visually *next* item (right-to-left) and `ArrowRight` moves to the visually *previous* item.
- [ ] **Dynamic RTL Toggle:** Verify that toggling text direction dynamically at runtime correctly updates arrow key calculations.

## 4. State Synchronization & Accessibility

- [ ] **Focus Ring Visibility:** Verify that every focusable item displays a high-contrast focus indicator (`:focus-visible`) meeting WCAG 2.2 Level AA requirements (at least 3:1 contrast against background).
- [ ] **ARIA Selection State:** If applicable, verify `aria-selected="true"`, `aria-checked="true"`, or `aria-pressed="true"` updates synchronously when focus changes or items are activated.
- [ ] **Disabled Element Skipping:** Verify that natively disabled (`disabled`) items are cleanly skipped during arrow key navigation and cannot receive `tabindex="0"`.

## 5. Dynamic DOM Mutations & Teardown

- [ ] **Dynamic Item Insertion:** Add a new item dynamically via DOM manipulation. Verify `sync()` updates `tabindex` attributes without breaking arrow key index calculations.
- [ ] **Active Item Removal:** Programmatically remove the item currently marked `tabindex="0"`. Verify the roving manager automatically transfers `tabindex="0"` to the nearest remaining sibling.
- [ ] **Clean Teardown:** Call `destroy()` or abort the `AbortSignal`. Check DevTools listener inspector to confirm zero lingering `keydown` or `click` listeners remain on the container.
