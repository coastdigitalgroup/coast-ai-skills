# Detent, Gesture & Accessibility Reference Rules

This reference guide establishes the mathematical, spatial, gesture-handling, and WCAG AA accessibility rules for implementing bottom sheet design systems.

---

## 1. Detent Snap Point Configurations

A **detent** represents a stable vertical height stop for a bottom sheet within the mobile viewport.

| Detent Mode | Height Calculation | Target Use Cases | Scroll Behavior |
| :--- | :--- | :--- | :--- |
| **Peek Detent** | `10vh` to `15vh` (~80px–120px) | Active navigation routes, media player mini bar, map summary cards. | Sheet body fixed; dragging upward transitions to Half detent. |
| **Half / Medium Detent** | `45vh` to `55vh` (~380px–460px) | Initial default state for content pickers, share sheets, and quick filters. | Prevents complete occlusion of background map or product page. |
| **Expanded / Full Detent** | `85vh` to `92vh` | Comprehensive forms, long filter lists, and detailed product specifications. | Enables vertical internal scroll (`overflow-y: auto`) for content exceeding viewport height. |
| **Content-Fit Detent** | `fit-content` (`max-height: 80vh`) | Action sheets with 3–6 options. | Height dynamically fits content bounds; no extra whitespace. |

---

## 2. Touch Gesture Physics & Swipe Thresholds

To ensure intuitive touch responsiveness without accidental dismissal or gesture jitter:

1. **Velocity Threshold:**
   - If a downward drag gesture velocity exceeds **0.5 px/ms**, trigger immediate snap to the next lower detent or close the sheet regardless of distance traveled.
2. **Distance Threshold:**
   - If drag distance exceeds **35% of the current detent height**, snap to the adjacent detent on drag release.
   - If drag distance is less than 35%, elasticity snaps the sheet back to its original detent.
3. **Scroll Boundary Protection (Gesture Collision Prevention):**
   - Downward touch drags initiated inside the `.bottom-sheet-body` container MUST NOT shrink or close the sheet unless the scroll container's `scrollTop === 0`.
   - When `scrollTop > 0`, touch drag events must strictly scroll the body content upwards/downwards.

---

## 3. WCAG AA Accessibility Checklist

### SC 2.1.1 Keyboard Accessibility
- [ ] Bottom sheet must be triggerable via standard keyboard controls (`Enter` or `Space` key on `<button>`).
- [ ] Pressing `Escape` key at any point must immediately close an active modal bottom sheet and return focus to the trigger element.

### SC 2.4.3 Focus Order & Focus Trapping
- [ ] When a modal bottom sheet opens, focus must automatically move into the sheet container (typically targeting the close button or first input field).
- [ ] Focus must be trapped inside the modal bottom sheet while open, preventing `Tab` or `Shift+Tab` from focusing elements in the hidden background page.
- [ ] Background interactive elements behind a modal sheet must set `aria-hidden="true"` or `inert`.

### SC 4.1.2 Name, Role, Value
- [ ] Sheet wrapper element must contain `role="dialog"` or `role="region"`.
- [ ] Modal bottom sheets must declare `aria-modal="true"`.
- [ ] The sheet must link to its header heading via `aria-labelledby="[heading-id]"`.
- [ ] If an optional subtitle exists, link via `aria-describedby="[subtitle-id]"`.

### SC 2.5.8 Target Size (Minimum)
- [ ] Drag handle touch zone must provide a minimum touch target height of **48px**.
- [ ] Header close button (`✕`) must have a minimum width and height of **48x48px** (or 40x40px with 8px surrounding padding gap).
- [ ] All interactive items inside the sheet (pills, radio options, checkboxes, buttons) must measure at least **48px** in primary dimension.

---

## 4. Mobile Visual Viewport & Keyboard Handling

When mobile users focus a text input field (e.g., promo code input or search bar) inside a bottom sheet, the software keyboard pops up, reducing the `window.visualViewport.height` by up to 50%.

### Implementation Rule for Soft Keyboards:
1. Do NOT set fixed pixel heights (`height: 600px`). Always use viewport-relative units or dynamic max-height (`max-height: 90vh`).
2. Utilize `window.visualViewport` listener in JavaScript to dynamically adjust the sheet height or scroll the active input into center view:
   ```javascript
   if (window.visualViewport) {
     window.visualViewport.addEventListener('resize', () => {
       const activeInput = document.activeElement;
       if (activeInput && sheet.contains(activeInput)) {
         activeInput.scrollIntoView({ block: 'center', behavior: 'smooth' });
       }
     });
   }
   ```
