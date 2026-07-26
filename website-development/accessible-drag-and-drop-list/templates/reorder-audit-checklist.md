# Accessible List Reordering Audit & Checklist

Use this audit checklist to evaluate existing or newly implemented drag-and-drop or sortable list components for complete user accessibility, semantic correctness, and rendering performance.

---

## 1. Keyboard Navigation Verification

| Evaluation Criteria | Yes/No | Notes / Remediation |
| :--- | :---: | :--- |
| **Tab Accessibility:** Can keyboard-only users navigate onto each sortable item (or its dedicated grab handle) using standard `Tab` / `Shift+Tab`? | | |
| **Keyboard Grabbing Activation:** Does pressing `Spacebar` or `Enter` toggle the item's grabbed state? | | |
| **Position Shifting:** Once grabbed, do standard direction keys (`ArrowUp`/`ArrowDown` or `ArrowLeft`/`ArrowRight`) swap the position of the item dynamically within the list? | | |
| **Focus Preservation:** When an item is swapped in the DOM, does the keyboard focus remain securely locked onto the active item/handle (instead of resetting to the body)? | | |
| **Reorder Cancellation:** Can a user cancel an active grab by pressing `Escape`? Does the list return instantly to its original pre-grab layout? | | |
| **Blur & Escape Cleanup:** Does tabbing away from the grabbed item or clicking elsewhere on the screen automatically drop/commit or cancel the drag gracefully without locking focus? | | |

---

## 2. Assistive Technology & Screen Reader (ARIA) Audit

| Evaluation Criteria | Yes/No | Notes / Remediation |
| :--- | :---: | :--- |
| **Draggable Semantics:** Do list elements contain standard `role="list"` and `role="listitem"` parent-child hierarchies? | | |
| **Static Instructions:** Is there an instructions block with a unique `id` clearly explaining keyboard controls (e.g. "Space to grab, arrows to reorder, space to drop")? | | |
| **ARIA Association:** Does each item's focusable handle/node reference the instructions using `aria-describedby="instructions-id"`? | | |
| **Role Override:** Are list items given an `aria-roledescription="sortable item"` or `"draggable list item"` to override generic list announcements? | | |
| **Dynamic State Announcements:** Is there an offscreen element containing `aria-live="assertive"`? | | |
| **Grab State Feedback:** On grab, does the announcer report item selection, current index position (e.g., "1 of 5"), and reordering guides? | | |
| **Step-by-Step Movement Announcements:** On every arrow swap, does the announcer immediately state the item name and its updated position (e.g., "Moved card to position 3 of 5")? | | |
| **Commit/Drop Announcements:** On drop, does the announcer state: `"Dropped item [Name] at position X. List updated."`? | | |
| **Cancel Announcements:** On cancel (`Escape`), does the announcer state: `"Reordering canceled. Item restored to original position."`? | | |

---

## 3. Touch Screen & Pointer Audits

| Evaluation Criteria | Yes/No | Notes / Remediation |
| :--- | :---: | :--- |
| **Scroll Interference Lock:** When dragging items via touch-gestures, is vertical page scrolling locked (using `touch-action: none` on handles/elements) to avoid erratic shaking? | | |
| **Visual Grab Feedback:** Is there clear, immediate styling (e.g., drop-shadow, background tint, opacity changes) to show that an item is lifted? | | |
| **Drop Target Guides:** Are drop guides or indicator lines displayed when hovering/dragging over adjacent siblings to make target placement intuitive? | | |
| **Pointer Cancellation:** Does lifting a finger or mouse button outside the list boundary or hitting an alert boundary clean up drag styles? | | |

---

## 4. Performance & Layout Verification

| Evaluation Criteria | Yes/No | Notes / Remediation |
| :--- | :---: | :--- |
| **No Layout Thrashing:** Are expensive layout APIs (like `getBoundingClientRect()`, `offsetHeight`, `scrollTop`) cached on `dragstart` or throttled inside `dragover` / `pointermove` cycles? | | |
| **Hardware Acceleration:** Are dragging elements translated using CSS `transform` (e.g., `translateY(0px)`) to keep transitions on the GPU thread? | | |
| **Reduced Motion Compliance:** If the user prefers reduced motion (`prefers-reduced-motion: reduce`), are structural slide/transition animations disabled, with items swapping immediately? | | |
