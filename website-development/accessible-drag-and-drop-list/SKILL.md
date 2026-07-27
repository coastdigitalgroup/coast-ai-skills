---
name: accessible-drag-and-drop-list
description:
  Implement and debug accessible, keyboard-navigable, and screen-reader-friendly
  drag-and-drop list reordering systems with live ARIA announcements.
---

# Accessible Drag-and-Drop List Reordering

## Purpose

Drag-and-drop (DnD) reordering interfaces are notoriously hostile to keyboard-only users, screen readers, and touch-screen devices. The Accessible Drag-and-Drop List skill provides a high-performance, robust, and standards-compliant framework for implementing and auditing list reordering interfaces that are fully accessible to all users. It covers native HTML5 Drag and Drop API orchestration, PointerEvents touch handling, keyboard reordering via spacebar/arrows, and live ARIA announcements to communicate structural layout changes in real time.

## Use Cases

- **Task Boards & Kanbans:** Reordering cards or moving items between columns/lists.
- **Form Builders:** Rearranging form fields or questions in a structured template.
- **Navigation Menu Builders:** Reordering link structures or nested list hierarchies.
- **Media Playlists:** Sorting songs, videos, or slides in a specific playing order.
- **Dashboard Widgets:** Customizing layout placement of dashboard tiles.

## When NOT to Use

- **Simple Form Inputs:** For simple reordering of 3-4 items, a standard select menu, radio button group, or text input with priority index numbers is lighter and more reliable.
- **Tree Views / Nested Outliners:** When the list supports multi-level tree hierarchies, use `accessible-tree-view-implementation` instead.
- **Free-Form Canvas Layouts:** When elements are moved freely across an open 2D spatial coordinate plane (e.g., node editors, design canvases) rather than standard linear lists or grids.

## Inputs

1. **HTML List Structure:** A container (typically `<ul>` or `<ol>`) containing interactive list items (`<li>`).
2. **Handle Element (Optional but Recommended):** A dedicated grab-handle button within each item, ensuring users don't accidentally trigger drag actions on text blocks or interactive nested children (such as inputs or links).
3. **Reorder Callbacks:** A callback function `onReorder(items, updatedIndexMap)` triggered once a list item has successfully settled in its new index.

## Outputs

1. **Fully Accessible Markup:** Semantic elements equipped with `role="list"`, `role="listitem"`, `aria-roledescription`, `aria-describedby`, and grab/drop state descriptions.
2. **Live ARIA Announcements:** An off-screen `aria-live="assertive"` region that dynamically announces reordering instructions, current item focus, active lift states, position tracking (e.g., "Item 1 of 5"), and drag completion/cancellation.
3. **Pointer, Keyboard & Touch Controllers:** Combined event handlers managing standard drag-and-drop, pointer tracking, and keyboard navigation.

---

## Workflow

### 1. Build the Semantic DOM Structure
*   Use standard markup: An `<ul>` element as the container and `<li>` elements as the sortable items.
*   Avoid placing focusable elements directly on the draggable container if the whole item is draggable. If a handle is used, make the handle button the primary focusable trigger for keyboard reordering.
*   Include a hidden `aria-live` announcer block (`<div aria-live="assertive" class="sr-only"></div>`) to broad-cast dynamic feedback.

### 2. Apply Accessibility and Instruction Attributes
*   Each draggable handle/item must have `aria-describedby` pointing to a static instructions element containing keyboard and touch usage guides (e.g., "Press Space to grab, use Up/Down arrow keys to reorder, Space to drop, Escape to cancel.").
*   Add `aria-roledescription="sortable item"` or `"draggable list item"` on the list items to override default screen reader item announcements.
*   Use `aria-grabbed` (deprecated but still widely read by legacy assistive tech) and `aria-effectallowed` or leverage standard attributes like `aria-pressed` or `aria-selected` to reflect active grabs.

### 3. Implement Native Drag & Drop (Pointer Path)
*   Set `draggable="true"` on the sortable elements (or handles).
*   Listen for `dragstart` to attach active dragging styles, store the origin item, set the `dataTransfer.effectAllowed = 'move'`, and populate the `dataTransfer` package.
*   Listen to `dragover` on the list container. Calculate vertical offset offsets of siblings to determine where the drop indicator or item preview should slide. Prevent default behavior on `dragover` to allow dropping.
*   On `dragenter` and `dragleave`, handle visual drop-target boundaries and apply active transition classes.
*   On `drop`, prevent defaults, perform index mutations, execute callbacks, and cleanup drag styles.
*   On `dragend`, ensure absolute state cleanup even if the drag was canceled or dropped outside.

### 4. Implement Keyboard Sort Orchestration
Keyboard reordering is a mandatory core requirement. It acts as an alternate input system:
*   Listen to `keydown` on the item handle or draggable node.
*   **Space / Enter:** Toggles the "Grabbed" state. Set `aria-pressed="true"` (or `aria-grabbed="true"`) on the item. Trigger a live announcement: `"Grabbed item [Item Name]. Current position: 2 of 5. Use Up and Down arrow keys to move, Space to drop, Escape to cancel."`
*   **Up / Down Arrow Keys (or Left/Right in horizontal lists):**
    *   If **not grabbed**, shift keyboard focus to the previous or next list item.
    *   If **grabbed**, swap the item position with its sibling in the DOM. Ensure keyboard focus *stays* on the active item so the user does not lose their position. Announce the update: `"Moved item [Item Name] to position 3 of 5."`
*   **Escape:** Cancels the sorting operation. Restores the list to its original pre-grab layout, drops the grab, and announces: `"Reordering canceled. Item restored to original position."`
*   **Tab / Blur:** Dropping focus or tabbing away automatically cancels/drops the item to prevent focus leaks.

### 5. Add PointerEvents for Mobile Touch Devices
*   Native HTML5 Drag and Drop has poor support in many mobile browsers. Supplement the controller with standard `PointerEvents` (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`).
*   On `pointerdown` of the handle, check if a delay is needed to avoid fighting page scroll gestures. Apply CSS `touch-action: none` dynamically to disable default scrolling while dragging is in progress.
*   Track pointer coordinate changes to translate the item position visually. Use standard CSS transform (`translateY()`) for smooth rendering performance.
*   Identify overlapping sibling nodes using `document.elementFromPoint(clientX, clientY)` and shift list items dynamically.

### 6. Dynamic Live Announcements
Maintain precise, succinct live feedback. Ensure announcements are trigger-locked to prevent overwhelming screen readers:
*   **On Grab:** `"Grabbed item [Name]. Current position: 1 of 4. Use Up and Down arrows to reorder, Space to drop, Escape to cancel."`
*   **On Move:** `"Moved item [Name] to position 2 of 4."`
*   **On Drop:** `"Dropped item [Name]. New position: 3 of 4. List updated."`
*   **On Cancel:** `"Reordering canceled. Item [Name] returned to position 1 of 4."`

---

## Decision Rules

### Custom Pointer Events vs. Native HTML5 Drag and Drop API
- **Choose Custom Pointer Events** if:
  - Mobile web/touch experience is a high priority and external touch-polyfill libraries are restricted.
  - You require highly customized, fluid drag animations (e.g., items floating, spring dynamics, or custom drag-images) that standard HTML5 `setDragImage()` cannot perform reliably.
- **Choose Native HTML5 DnD** if:
  - You need to support dragging items *across different windows*, browser tabs, or dragging external files into the browser.
  - You need maximum compatibility with standard desktop drag structures without manual mouse-tracking viewport calculations.

### Whole-Row Grabbing vs. Dedicated Handle Buttons
- **Choose Whole-Row Grabbing** ONLY when the list items contain *no other focusable, selectable, or interactive elements* (no inputs, links, delete buttons, or select menus) and the list content is highly readable text.
- **Choose Dedicated Handle Buttons** (Recommended default) when the list items contain interactive sub-controls, editable text inputs, links, or when text selection within the item is a core user workflow.

---

## Constraints

- **Main Thread Budget:** Limit calculations inside pointer/mouse tracking events. Cache element dimensions and coordinate positions on drag start rather than repeatedly calling layout-thrashing APIs like `getBoundingClientRect()` inside the `dragover` or `pointermove` loop.
- **Screen Reader Compatibility:** Ensure elements being dragged retain their focus. When manipulating DOM hierarchies directly (e.g., `insertBefore`), the browser may trigger a temporary blur. The JavaScript implementation must trap focus and immediately restore it to the active element.
- **Reduced Motion:** If `window.matchMedia('(prefers-reduced-motion: reduce)')` is true, disable structural transitions and translation animations. Move list items instantly.

---

## Non-Goals

- Multi-dimensional layout reordering (e.g., masonry grid card swapping or free-form canvas moving).
- Dragging items between different browser windows or handling external desktop file uploads.
- Out-of-the-box framework wrappers (e.g., React-DnD or Vue.Draggable). The patterns provided must be built on portable Vanilla JavaScript and PointerEvents.

---

## Common Failure Patterns

- **No Keyboard Reordering:** Developers only test with mouse/trackpad, rendering the list completely static and locked for keyboard users (WCAG 2.1 - Keyboard).
- **Losing Keyboard Focus on DOM Swap:** When swapping nodes in the DOM dynamically (e.g., `container.insertBefore(a, b)`), browsers often strip keyboard focus from the active node. If focus is lost, the screen reader stops announcing moves, and the user must tab through the entire page again to re-find the list.
- **Scroll Hijacking on Touch:** Failing to set `touch-action: none` on the handle/item during pointer operations, causing the screen to scroll while the user tries to drag, creating erratic shaking and visual bugs.
- **Verbose Live Announcements:** Writing sentences that are too long for ARIA announcements (e.g., "You have successfully picked up the task card containing...'"). Screen readers will read the whole text, delaying feedback. Keep messages crisp: `"Task A grabbed. Position 1 of 3."`
- **Focus Leaks in Active Grabs:** Allowing keyboard focus to escape the current reordering list when an item is in an active "grabbed" state, leaving an item hanging in space.

---

## Validation Steps

- [ ] **No-Mouse Keyboard Sweep:** Focus on a list item's handle using `Tab`. Grab it with `Space`. Use `ArrowDown` or `ArrowUp` to swap its position. Ensure focus remains on the handle. Confirm you can drop with `Space` or cancel with `Escape`.
- [ ] **Screen Reader Live Verification:** Activate a screen reader (VoiceOver, NVDA, or JAWS). Verify that grab, move, cancel, and drop events are announced instantly and clearly. Confirm that structural changes (e.g., "2 of 5" updates) are read out accurately.
- [ ] **Touch Device Drag Verification:** Open the list on a mobile browser or use Chrome DevTools device simulation. Test dragging items by holding and sliding the handle. Verify that screen scrolling is locked during the gesture and that the layout transitions smoothly without jumping.
- [ ] **Layout Thrashing Check:** Run a Performance Panel trace in Chrome DevTools during reordering. Ensure there are no long red warning flags under the rendering timeline, and verify that `getBoundingClientRect` isn't repeatedly triggered on every pointer tick.
- [ ] **Reduced Motion Check:** Set OS system settings to "Reduce Motion." Confirm list swapping and pointer moves happen instantly without transition delays or sliding slide-effects.
