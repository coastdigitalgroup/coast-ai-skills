# Accessible Reordering Specifications & References

## W3C WAI-ARIA Authoring Practices (APG) Patterns

To comply with the Web Content Accessibility Guidelines (WCAG) 2.1 and 2.2, reordering systems must provide functional equivalency for all forms of keyboard navigation and screen readers.

### Keyboard Interface Specification

- **Focus Target:** Standard list items containing complex content must isolate their interactive reordering trigger to a single button with `role="button"` (the grab handle). If the list is text-only with no focusable elements inside, the element itself can double as the focus target using `tabindex="0"`.
- **Space / Enter:**
  - Grabs the item and initiates reorder mode.
  - While in reorder mode, locks keyboard navigation so Arrow keys manipulate element position *instead* of standard focus flows.
  - Pressing Space or Enter a second time releases/drops the item.
- **Up / Down Arrow Keys:**
  - Moves the grabbed item up or down respectively inside a vertical list container.
  - For horizontal list structures, swap with **Left / Right Arrow Keys**.
  - Always keep the browser focus pinned directly onto the active moving node. Swapping elements via `container.insertBefore()` often strips browser focus; the controller must intercept this and call `element.focus()` dynamically.
- **Escape Key:**
  - Cancels the reordering layout in progress.
  - The DOM structure must revert instantly to its original order cached during `dragstart`.
  - Reverts the handle button state to `aria-pressed="false"`.

---

## Dynamic State Communication (ARIA-Live Announcements)

Assistive technologies cannot visually track elements moving on a 2D screen coordinate. We must use an explicit offscreen announcer region to broadcast structural changes.

### Semantic Configuration
```html
<div id="reorder-announcer" class="sr-only" aria-live="assertive" aria-atomic="true"></div>
```
- **`sr-only` class:** Positions the element off-screen so visual users do not see it, while keeping it visible to screen readers.
- **`aria-live="assertive"`:** Instructs the screen reader to immediately interrupt any current announcements to relay the reorder state change. This is essential because spatial movement is immediate.
- **`aria-atomic="true"`:** Forces the screen reader to read the entire contents of the announcer div as a single unified announcement rather than reading partial text updates.

---

## PointerEvents and Mobile Touch Engineering

Using standard desktop-only drag events (`drag`, `dragover`, `drop`) does not provide adequate support on mobile Safari or Android Chrome. PointerEvents solve this by standardizing mouse, touch, and pen gestures.

### Scroll Interference Mitigation
When a user slides their finger vertically to drag an item, the mobile browser naturally tries to scroll the entire viewport. This breaks the drag lifecycle and causes glitchy rendering jumps.

1. **CSS `touch-action` Property:**
   Apply `touch-action: none` to drag handles or draggable lists to prevent viewport panning gestures while active dragging is occurring:
   ```css
   .dnd-handle {
     touch-action: none;
   }
   ```
2. **Dynamic Drag State:**
   Toggle pointer capture using `element.setPointerCapture(pointerId)` on the handle on pointer down to lock all mouse/touch tracking onto that specific element until pointer up.

### Rendering Performance Heuristics
- **GPU Acceleration:** Always use CSS `transform: translateY(Ypx)` or CSS `transform: translate3d(Xpx, Ypx, 0)` for sliding dragging visuals. Using `top` or `margin-top` forces full visual reflows (Layout & Paint cycles), which causes framerate drops.
- **Reduced Motion Support:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    .sortable-item {
      transition: none !important;
      transform: none !important;
    }
  }
  ```
