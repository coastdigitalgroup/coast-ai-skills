---
name: dynamic-text-truncation
description:
  Implement and debug accessible, responsive dynamic text truncation and
  multi-line line clamping with container-aware toggle buttons using ResizeObserver.
---

# Dynamic Text Truncation and Clamping

## Purpose

The Dynamic Text Truncation and Clamping skill provides a technical protocol for shortening long textual content (such as card body text, user bios, review excerpts, or article previews) to fit within visual layouts.

Most custom "Read More" implementations fail because they make hardcoded assumptions about text length (such as character count limits) which do not map to actual visual layout constraints across different device widths and font scalings. This skill ensures that truncation is calculated programmatically using the browser's rendering engine (`ResizeObserver`), that toggle controls are *only* visible when the text actually overflows, and that the widget remains 100% accessible to assistive technologies.

## Use Cases

- **Dashboard and Feed Cards:** Capping long card descriptions in a bento or grid layout to keep card heights uniform while offering a "Read More" expansion.
- **User Reviews and Testimonials:** Truncating user-generated reviews to a standard limit (e.g., 3 lines) with a toggle that expands the text inline.
- **Responsive Biography Sections:** Capping long team-member or author descriptions in dynamic sidebars or narrow viewports.
- **Legacy Code Remediation:** Replacing fragile JS-based character slicing with native CSS line-clamping backed by layout-aware triggers.

## When NOT to Use

- **Static Navigation and Breadcrumbs:** For single-line items that overflow on small screens, use simple CSS `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` without JavaScript observers.
- **Critical Regulatory Content:** Legal disclaimers, medical risks, safety warnings, pricing terms, or transaction details must never be hidden behind a user interaction.
- **Extensive Document Reading:** For displaying complete articles, blog posts, or book chapters, use dedicated multi-page routing or paginated loading, not massive DOM expansion blocks.

## Inputs

1. **Target Content Element:** The DOM element containing the text nodes to be clamped.
2. **Line Limit (`-webkit-line-clamp`):** The target number of lines to display before truncation (e.g., `3`).
3. **Toggle Button Control:** A `<button>` element that serves as the expand/collapse trigger.
4. **Layout Context:** The surrounding CSS styles (font-family, line-height, font-size, padding, and parent container constraints).

## Outputs

1. **Semantic HTML Structure:** An expandable wrapper utilizing clear ARIA connections (`aria-expanded`, `aria-controls`, and `id` relations).
2. **Container-Aware Observer Script:** Optimized JavaScript that utilizes `ResizeObserver` to check if the content has exceeded its line/height limit, dynamically toggling the display of the control button.
3. **GPU-Safe Layout Transitions:** Clean CSS styling employing `-webkit-line-clamp` and layout-shift-minimized animations to handle state transitions.

---

## Workflow

### 1. Structure the Semantic Markup
The content must live in a wrapper with a unique `id`. The control button must sit outside the truncated box, pointing to the text wrapper via `aria-controls`.

```html
<div class="expandable-text-container">
  <!-- The content block that gets clamped -->
  <div id="content-bio-1"
       class="expandable-text-content"
       aria-expanded="false">
    <p>
      Jane Doe is a senior systems architect specializing in distributed storage systems and high-throughput real-time messaging pipelines. Over the past decade, she has successfully designed and scaled backend architectures for multiple Fortune 100 enterprise clients, optimizing memory usage and eliminating garbage collection bottleneck stalls.
    </p>
  </div>

  <!-- Toggle trigger button (hidden by default in CSS, shown by JS only if content overflows) -->
  <button type="button"
          id="trigger-bio-1"
          class="expandable-text-trigger"
          aria-controls="content-bio-1"
          aria-expanded="false"
          style="display: none;">
    <span class="trigger-text">Show more</span>
    <span class="visually-hidden">about Jane Doe's biography</span>
  </button>
</div>
```

---

### 2. Configure the Clamping CSS
Use CSS variables and the native `-webkit-line-clamp` engine. This is highly performant because the browser performs the line calculation in its layout phase.

```css
.expandable-text-content {
  --line-clamp-limit: 3;
  --line-height: 1.5;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--line-clamp-limit);
  overflow: hidden;
  line-height: var(--line-height);

  /* Fallback for browsers that do not support line-clamp */
  max-height: calc(1em * var(--line-height) * var(--line-clamp-limit));

  transition: max-height 0.25s ease-out;
}

/* Expanded state class */
.expandable-text-content.is-expanded {
  display: block;
  -webkit-line-clamp: none;
  max-height: none;
  overflow: visible;
}
```

---

### 3. Implement the `ResizeObserver` Logic
Character length checks (e.g., `text.length > 200`) fail because different characters have different visual widths (e.g., `W` vs `I`), and font sizes or container widths scale dynamically.

To detect visual truncation reliably, we must compare the element's actual scrolled height (`scrollHeight`) against its current visible rendering height (`clientHeight`).

- If `scrollHeight > clientHeight`, the content is actively truncated. We must reveal the "Show More" button.
- If `scrollHeight <= clientHeight`, the content fits entirely. We must hide the "Show More" button.

#### Prevent the "Resize Loop" Crash
*Warning:* If your `ResizeObserver` callback alters the style, layout, padding, or margin of the element being observed, it will trigger *another* resize event. This creates an infinite layout loop, throwing the error: `ResizeObserver loop completed with undelivered notifications`.
To prevent this:
1. Only toggle classes or display properties on the **Trigger Button** (which is *outside* the observed content box).
2. Never modify the height, margins, padding, or fonts of the content box inside the observer callback without disconnecting or throttling.
3. Execute DOM mutations inside `requestAnimationFrame` to batch writes and avoid layout thrashing.

```javascript
class DynamicTextTruncator {
  constructor(containerElement) {
    this.container = containerElement;
    this.content = this.container.querySelector('.expandable-text-content');
    this.trigger = this.container.querySelector('.expandable-text-trigger');
    this.triggerText = this.trigger.querySelector('.trigger-text');

    this.isExpanded = false;
    this.resizeObserver = null;

    this.init();
  }

  init() {
    if (!this.content || !this.trigger) return;

    // 1. Setup button action click listener
    this.trigger.addEventListener('click', () => this.toggle());

    // 2. Initialize ResizeObserver to track layout changes
    this.resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
      requestAnimationFrame(() => {
        this.checkOverflow();
      });
    });

    // Observe the content container for dimension shifts
    this.resizeObserver.observe(this.content);
  }

  checkOverflow() {
    // If currently expanded, the content is showing in full and cannot overflow
    if (this.isExpanded) return;

    // Compare actual scrollable height with the visible offset height
    const hasOverflow = this.content.scrollHeight > this.content.clientHeight;

    if (hasOverflow) {
      this.trigger.style.display = 'inline-flex';
    } else {
      this.trigger.style.display = 'none';
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      // Expand
      this.content.classList.add('is-expanded');
      this.content.setAttribute('aria-expanded', 'true');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.triggerText.textContent = 'Show less';
    } else {
      // Collapse
      this.content.classList.remove('is-expanded');
      this.content.setAttribute('aria-expanded', 'false');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.triggerText.textContent = 'Show more';

      // Keep keyboard focus from being lost if the trigger remains visible,
      // but if collapse pushes the trigger off screen or to a new position,
      // optionally scroll the container back into view so focus is not disoriented.
      this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
```

---

### 4. Optimize Screen Reader Synchronization
When an element's text content is visually truncated with an ellipsis, screen readers read the **entire** un-truncated text block present in the DOM. This is actually a great native accessibility feature!

However, we must ensure that our interactive elements stay in sync:
- **`aria-expanded` Synchronization:** Both the content panel and the trigger button must keep their `aria-expanded` attributes in sync (`true` vs `false`).
- **No Character Slicing:** Avoid using JavaScript's `.substring()` or `.slice()` to truncate text. If you mutate the DOM string to append `"..."`, screen reader users will *never* hear the hidden text, even if they want to. Keep the text intact in the DOM and let CSS `-webkit-line-clamp` handle the visual cut-off.
- **Contextual Labels:** Ensure the button has hidden context (e.g., using a `<span class="visually-hidden">`) so that screen reader users navigating by buttons hear "Show more about Jane Doe's biography" instead of just "Show more, button".

---

## Decision Rules

### Deciding on Your Truncation Approach

| Requirement | CSS-Only Clamping | JS + ResizeObserver (Expandable) |
| :--- | :--- | :--- |
| **UX Context** | Content is static and can remain permanently cut off; no inline read-more required (e.g., dashboard data tables, grid lists with detail pages). | Content is interactive; user needs to expand/collapse without navigating away. |
| **DOM Dependency** | Zero JavaScript. | Requires `ResizeObserver` listener and DOM lifecycle cleanup. |
| **Trigger Visibility** | No trigger needed. | Trigger button visibility is completely dynamic; automatically disappears if the card is placed in a wider column where the text fits. |
| **Core Advantage** | High performance; zero main-thread work. | Elite UX; zero broken or non-functional "Read More" buttons on wide viewports. |

---

## Constraints

- **Dynamic Resize Clashing:** When expanding text that is positioned inside a CSS Grid with `grid-auto-rows: min-content`, expanding one item will recalculate row alignments across the grid. Utilize robust grid structures to avoid shifting other cards unexpectedly (see `css-grid-layout-implementation`).
- **Memory Management:** For pages containing dozens of expandable text nodes (e.g., long blog rolls or review grids), always call `destroy()` or `.disconnect()` on the `ResizeObserver` when the parent component is unmounted to prevent memory leaks.
- **Layout Performance:** Ensure `requestAnimationFrame` is used inside the `ResizeObserver` callback to batch DOM reads and writes, avoiding Layout Thrashing during rapid window resizing.

## Non-Goals

- Implementing paginated server-side fetch on expand (this skill handles expanding client-side truncated content already present in the DOM).
- Inline editing of the truncated text (purely focused on read-only rendering).
- Animating height perfectly from `3 lines` to `auto` without layout-shift. (Animate `max-height` with a safe upper limit or perform a instant layout transition as attempting to calculate height dynamically in an animation can cause significant rendering jank on low-end devices).

---

## Common Failure Patterns

- **The Character-Count Trap:** Slicing text at 200 characters. On a wide desktop monitor, the text takes up only 1 line, leaving a useless "Read More" button that expands nothing. On a narrow phone, 200 characters takes up 6 lines, ruining the grid visual boundary before the button even appears.
- **The "Invisible" Active Trigger:** Adding a "Read More" button to every card unconditionally. If the text is short (e.g. "Excellent product!"), clicking the button does absolutely nothing, frustrates the user, and flags a UX bug.
- **The Screen Reader Void:** Deleting the full text and replacing it with sliced text in the DOM. Screen reader users can now *never* access the full content.
- **The Infinite Resize Loop Crash:** Changing the padding or font size of the observed text box directly in the `ResizeObserver` callback, which triggers another resize, which triggers the observer again, hanging the browser page.
- **Losing Focus on Collapse:** Hiding or shifting the trigger button during collapse such that the keyboard focus jumps randomly back to the top of the body.

---

## Validation Criteria

- [ ] **Viewport Scaling Test:** Set up an expandable block in a responsive grid. Narrow the browser window until the text overflows. Verify that the "Show More" button instantly becomes visible. Expand the browser window until the text fits on one line. Verify that the button immediately disappears.
- [ ] **Zero-Effect Click Check:** Confirm there is no scenario where clicking "Show More" does not expand the text, or where the button is visible for text that fits on screen.
- [ ] **Keyboard Nav and Focus Audit:** Tab to the "Show More" button and activate it using `Space` or `Enter`. Expand the box, then collapse it. Verify that focus is never lost and remains anchored to the trigger button.
- [ ] **Screen Reader Audit:** Verify with VoiceOver or NVDA that the entire text block is read smoothly, and that the button announces its expanded state correctly (e.g., *"Show more about Jane Doe's biography, button, collapsed"*).
- [ ] **Performance Profile Check:** Record a performance profile in Chrome DevTools while resizing the viewport. Ensure there are no warnings like `Long Task` or `ResizeObserver loop limit exceeded` stemming from the truncation script.
- [ ] **Windows High Contrast Mode Verification:** Toggle system high contrast/forced-colors mode and confirm that the trigger button and its text remain fully visible and distinct.
