# CSS Scroll Snap Audit & Verification Checklist

Use this diagnostic checklist to audit CSS Scroll Snap implementations for layout accuracy, browser compatibility, touch responsiveness, and WAI-ARIA keyboard accessibility.

---

## 1. Declarative CSS Structure Audit

- [ ] **Container Declarations:** Verify `scroll-snap-type` is declared on the overflow container (e.g., `scroll-snap-type: x mandatory` or `scroll-snap-type: y mandatory`).
- [ ] **Child Element Declarations:** Verify `scroll-snap-align` is declared on every snap target child element (`start`, `center`, or `end`).
- [ ] **Overflow Context:** Ensure container has explicit overflow properties set (`overflow-x: auto; overflow-y: hidden` or `overflow-y: auto`).
- [ ] **Fixed Header Offsets:** Verify `scroll-padding-top` or `scroll-padding-inline` is applied to the container if fixed or sticky headers overlap the scroll viewport.
- [ ] **Item Margins:** Confirm `scroll-margin` or `scroll-margin-inline` is configured if individual cards require extra breathing room when snapped.
- [ ] **Step Protection:** Check if `scroll-snap-stop: always` is applied to critical sequential wizard steps or slides to prevent swipe-flick skipping.

---

## 2. Accessibility & Keyboard Flow Audit

- [ ] **Keyboard Focusability:** Verify the scroll container is keyboard focusable (`tabindex="0"` or contains focusable interactive children).
- [ ] **Focus Ring Visibility:** Confirm focus indicators (`:focus-visible`) are clearly visible against dark and light backgrounds with a minimum 3:1 contrast ratio.
- [ ] **Arrow Key Navigation:** Press `ArrowLeft` / `ArrowRight` (horizontal) or `ArrowUp` / `ArrowDown` (vertical) when container is focused. Ensure view scrolls smoothly between snap points.
- [ ] **Home / End Keys:** Press `Home` and `End` keys to confirm immediate navigation to the first and last snap items.
- [ ] **Focus Trapping Avoidance:** Verify pressing `Tab` navigates sequentially into interactive elements (buttons, links) within the current active card without trapping focus.
- [ ] **ARIA Roles & Labels:** Confirm the scroll container has `role="region"`, `aria-roledescription="carousel"` or `aria-label`, and slides contain descriptive `aria-label="Slide X of Y"` attributes.

---

## 3. Touch Gesture & Mobile Viewport Audit

- [ ] **iOS Safari Momentum Scrolling:** Confirm `-webkit-overflow-scrolling: touch` is set on the scroll container.
- [ ] **Overscroll Containment:** Verify `overscroll-behavior-x: contain` (or `overscroll-behavior-y: contain`) is enabled on nested scroll containers to prevent accidental parent page navigation or vertical pull-to-refresh.
- [ ] **Touch Drag Alignment:** Swipe rapidly on a touch screen. Confirm cards lock cleanly into alignment without freezing halfway across container bounds.
- [ ] **Snippet Visibility:** On mobile viewports, confirm cards leave a subtle trailing preview (e.g., card width `85%`) to signal to users that additional content is scrollable horizontally.

---

## 4. State Synchronization & Performance Audit

- [ ] **IntersectionObserver Integration:** Confirm active pagination dots and Previous/Next buttons are updated using `IntersectionObserver` rather than synchronous `scroll` event listeners.
- [ ] **Button Disabled States:** Verify Previous button is `disabled` when active item is index `0`, and Next button is `disabled` when active item is at the end.
- [ ] **Reduced Motion Support:** Enable "Reduce Motion" in system settings or browser emulator. Verify smooth scrolling automatically falls back to instant scroll transitions (`scroll-behavior: auto`).
- [ ] **Layout Thrashing Check:** Ensure no forced synchronous layouts (e.g., `offsetHeight` reads immediately followed by style writes) occur during scroll events.
