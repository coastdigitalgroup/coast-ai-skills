# Text Truncation and Clamping Audit Checklist

This checklist is designed for frontend developers and QA engineers to audit, evaluate, and fix issues with text truncation, multi-line line clamping, and expandable text components across desktop and mobile devices.

---

## 1. Accessibility & Screen Reader Compliance

- [ ] **No DOM Slicing:** Verify that text is *never* clipped physically in the DOM (e.g., using `text.slice()` or `.substring()`) unless a raw screen reader alternative exists. Cutting string nodes removes valuable context for screen readers.
- [ ] **ARIA-Expanded Alignment:** Ensure that when text is expanded visually, `aria-expanded` is updated programmatically to `"true"` on both the trigger element and (if appropriate) the content panel container. It should be `"false"` when collapsed.
- [ ] **Control Associations:** Confirm the `<button>` trigger contains an `aria-controls` attribute referencing the `id` of the content wrapper element it expands.
- [ ] **Visible vs Accessible Sync:** Check if the trigger button has screen-reader-only descriptive text (using standard `.visually-hidden` style) explaining *which* card or bio is being expanded (e.g., "Show more about Marcus Aurelius' biography" instead of just "Show more").
- [ ] **Correct Interactive Role:** Verify that the trigger is a `<button>` (or has `role="button"` and handles `keydown` events for `Space` and `Enter`) rather than a simple styled `<a>` without an `href` or a passive `<div>`.

---

## 2. Dynamic Layout & Responsive Behavior

- [ ] **No "Ghost" Triggers:** Resize the browser window to full desktop resolution. Confirm that cards with short text (that fits completely within the visual line-clamping boundaries) do *not* display a "Show More" or "Read More" button.
- [ ] **Resize Resiliency:** Shrink the viewport to mobile width. Verify that as columns narrow, text starts to overflow and the "Show More" trigger automatically becomes visible.
- [ ] **Borderline Case Stability:** Test "borderline" text lengths (where the text is exactly 3 lines long). Verify the button does not flicker on/off due to slight subpixel scaling or layout rounding errors. (Hint: Ensure heights are rounded safely or use `Math.ceil()`).
- [ ] **Font Zoom Adaptation:** Increase the system or browser text zoom to **200%**. Verify that the text remains bounded correctly, the clamping line limit adapts, and the trigger expands to display all scaled text without visual overlapping or clipping.

---

## 3. Keyboard & Focus Management

- [ ] **Keyboard Navigability:** Tab through the page. Confirm the keyboard cursor can focus on every visible "Show More" button.
- [ ] **Non-Interactive Bypass:** Ensure that when a "Show More" button is dynamically hidden (because the text fits), the focus cannot land on it (it must have `display: none` or `tabindex="-1"`).
- [ ] **Action Triggering:** Verify that the "Show More" button can be successfully toggled using both the `Enter` and `Space` keys.
- [ ] **Focus Retention:** Confirm that clicking the button to expand or collapse the text box does not cause keyboard focus to jump back to the top of the page. Focus must remain on the trigger button.
- [ ] **Collapse Positioning:** When collapsing a very long text card, verify that the page doesn't scroll randomly. Use `.scrollIntoView({ block: 'nearest' })` or similar to keep the card container in view.

---

## 4. Rendering Performance & Code Quality

- [ ] **No Layout Cycles (Loop Prevention):** Verify that the `ResizeObserver` callback does *not* mutate the observed text box's styling (padding, margins, width, height) in a way that triggers another resize event.
- [ ] **Batching Mutations:** Confirm that all DOM mutations inside the `ResizeObserver` callback are wrapped in `requestAnimationFrame()` to prevent layout thrashing.
- [ ] **Compositor Animations:** If transitions are applied, ensure they only animate compositor-friendly properties (like `max-height` with a safe max fallback, or `opacity`) rather than expensive layout geometry values like `height: auto` directly.
- [ ] **Memory Leak Prevention:** If using Single Page Applications (SPAs like React, Vue, Svelte) or vanilla components, verify that `ResizeObserver.disconnect()` or `destroy()` is called when the card component is unmounted.
- [ ] **Forced Colors Support:** Audit the toggle button in Windows High Contrast / Forced Colors Mode. Confirm that the outline focus indicator and the text remain perfectly visible and conform to system-selected focus colors.
