---
name: css-scroll-snap-implementation
description:
  Implement and audit native, hardware-accelerated scroll snapping layouts for horizontal carousels, full-page presentation decks, and tab panels with full keyboard focus and touch gesture accessibility.
---

# CSS Scroll Snap Implementation

## Purpose

The CSS Scroll Snap Implementation skill provides a comprehensive technical protocol for implementing, auditing, and debugging native CSS scroll snapping. Standard web scrolling allows touch gestures and scroll wheels to halt at arbitrary pixel coordinates, which often leaves card items partially clipped, slides off-center, or tab panels stranded mid-transition. CSS Scroll Snap provides GPU-accelerated, declarative viewport alignment to designated snap points (`scroll-snap-type`, `scroll-snap-align`, `scroll-padding`, `scroll-margin`, `scroll-snap-stop`). This skill guides developers through building smooth, accessible, swipeable component interfaces while solving real-world browser quirks including sticky header offsets, iOS Safari momentum scrolling, keyboard focus synchronization, and `prefers-reduced-motion` considerations.

## Use Cases

- **Horizontal Card Carousels & Product Decks:** Swipeable product cards, testimonial sliders, or feature highlights where individual items lock cleanly to the container edge or center.
- **Full-Screen Presentation Slides & Story Feeds:** Vertical or horizontal full-viewport slide decks where scrolling advances strictly one panel at a time without mid-point stopping.
- **Tabbed Panel Viewports:** Horizontal tab panels that align seamlessly when tapped or swiped on mobile touch screens.
- **Step-by-Step Wizards & Media Lightboxes:** Sequential image galleries or onboarding flows where step clarity requires strict item alignment.

## When NOT to Use

- **Continuous Free-Scrolling Content:** Long-form article bodies, documentation pages, or news feeds where artificial scroll locks disrupt natural reading speed and scroll momentum.
- **High-Density Data Tables:** Complex multi-column data tables where snapping rows or columns obscures adjacent context or hides scrollable row headers.
- **Freeform Canvas & Drag-and-Drop Editors:** Interfaces requiring arbitrary 2D placement, pan/zoom canvas interaction, or custom pointer capture dragging mechanics.
- **Infinite Virtualized Feeds with Unfixed Dimensions:** Large dynamic feeds with asynchronous rendering where unpredictable element heights create layout shifts and erratic snap jumps.

## Inputs

1. **Scroll Container Layout Requirements:** Direction (`x`, `y`, or `both`), scroll container bounds, and fixed overlay offsets (e.g., sticky headers or persistent sidebars).
2. **Snap Alignment Strategy:** Strictness (`mandatory` vs. `proximity`) and point positioning (`start`, `center`, `end`).
3. **Snap Stop Behavior:** Single-step enforcement (`scroll-snap-stop: always`) vs. fast flick jumping (`scroll-snap-stop: normal`).
4. **Interactive Indicators & Controls:** Navigation buttons (Previous/Next), pagination dots, or tab triggers linked to child elements.

## Outputs

1. **Declarative CSS Architecture:** Container and item styles featuring cross-browser CSS Scroll Snap rules, `scroll-padding` offsets, `overscroll-behavior` bounds, and reduced-motion overrides.
2. **Accessible HTML Markup:** WAI-ARIA structured container structures (`role="region"`, `aria-roledescription="carousel"`, or `tablist`) with keyboard-focusable snap targets.
3. **Lightweight JavaScript Controller:** An `IntersectionObserver`-backed controller for synchronizing pagination indicators, driving programmatic smooth scrolling (`scrollTo({ left, behavior })`), and managing keyboard focus flow (`ArrowLeft`/`ArrowRight` / `Home`/`End`).
4. **Audit & Debug Checklist:** Diagnostic verification steps for verifying touch swiping, keyboard accessibility, header overlap prevention, and reduced-motion fallback compliance.

## Workflow

### 1. Establish the Semantic Markup Structure

Structure the scroll container and child items with proper ARIA roles and keyboard accessibility. Each interactive slide or card must be focusable or contain focusable controls.

```html
<section class="scroll-snap-container-wrapper" aria-roledescription="carousel" aria-label="Featured Products">
  <!-- Controls -->
  <div class="carousel-controls">
    <button type="button" class="carousel-btn prev-btn" aria-label="Previous slide" disabled>&larr;</button>
    <button type="button" class="carousel-btn next-btn" aria-label="Next slide">&rarr;</button>
  </div>

  <!-- Scroll Container -->
  <div class="scroll-snap-container" tabindex="0" role="region" aria-live="polite" aria-label="Product list">
    <article class="scroll-snap-item" id="item-1" tabindex="0" aria-label="Slide 1 of 4">
      <h3>Product Alpha</h3>
      <p>Description of product alpha...</p>
    </article>
    <article class="scroll-snap-item" id="item-2" tabindex="0" aria-label="Slide 2 of 4">
      <h3>Product Beta</h3>
      <p>Description of product beta...</p>
    </article>
    <article class="scroll-snap-item" id="item-3" tabindex="0" aria-label="Slide 3 of 4">
      <h3>Product Gamma</h3>
      <p>Description of product gamma...</p>
    </article>
  </div>

  <!-- Pagination Dots -->
  <nav class="carousel-pagination" aria-label="Slides pagination">
    <button type="button" class="dot is-active" aria-current="true" aria-label="Go to slide 1"></button>
    <button type="button" class="dot" aria-label="Go to slide 2"></button>
    <button type="button" class="dot" aria-label="Go to slide 3"></button>
  </nav>
</section>
```

---

### 2. Configure Declarative CSS Scroll Snap Properties

Apply `scroll-snap-type` to the scrollable parent container and `scroll-snap-align` to the child snap items. Account for sticky headers using `scroll-padding`.

```css
/* Container CSS */
.scroll-snap-container {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;

  /* Enable native horizontal scroll snapping */
  scroll-snap-type: x mandatory;

  /* Prevent sticky header/navigation from covering snapped items */
  scroll-padding-inline: 2rem;

  /* Smooth scrolling for programmatic navigation */
  scroll-behavior: smooth;

  /* Prevent overscroll bounce chaining on touch devices */
  overscroll-behavior-x: contain;

  /* iOS momentum scrolling enable */
  -webkit-overflow-scrolling: touch;

  /* Visual containment */
  padding: 1rem 2rem;
  outline-offset: 4px;
}

/* Child Item CSS */
.scroll-snap-item {
  flex: 0 0 85%; /* Shows a snippet of the next card */
  max-width: 400px;

  /* Snap alignment to container start */
  scroll-snap-align: start;

  /* Prevent fast flick gestures from skipping this item */
  scroll-snap-stop: always;

  /* Optional offset on individual items */
  scroll-margin-inline: 1rem;
}

/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  .scroll-snap-container {
    scroll-behavior: auto !important;
  }
}
```

---

### 3. Implement IntersectionObserver State Synchronization

Avoid heavy `scroll` event listeners that cause layout thrashing and main-thread lag. Use `IntersectionObserver` with `threshold` settings to detect which item is currently snapped and update pagination dots and button states.

```javascript
class ScrollSnapController {
  constructor(wrapperElement) {
    this.wrapper = wrapperElement;
    this.container = this.wrapper.querySelector('.scroll-snap-container');
    this.items = Array.from(this.container.querySelectorAll('.scroll-snap-item'));
    this.dots = Array.from(this.wrapper.querySelectorAll('.dot'));
    this.prevBtn = this.wrapper.querySelector('.prev-btn');
    this.nextBtn = this.wrapper.querySelector('.next-btn');

    this.activeIndex = 0;
    this.init();
  }

  init() {
    this.setupObserver();
    this.setupControls();
    this.setupKeyboardNav();
  }

  setupObserver() {
    const observerOptions = {
      root: this.container,
      threshold: 0.6 // Item must be 60% visible to be considered active
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = this.items.indexOf(entry.target);
          if (index !== -1) {
            this.updateActiveState(index);
          }
        }
      });
    }, observerOptions);

    this.items.forEach((item) => this.observer.observe(item));
  }

  updateActiveState(index) {
    this.activeIndex = index;

    // Update pagination dots
    this.dots.forEach((dot, idx) => {
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    // Update Next/Previous buttons
    if (this.prevBtn) this.prevBtn.disabled = index === 0;
    if (this.nextBtn) this.nextBtn.disabled = index === this.items.length - 1;
  }

  scrollToIndex(index) {
    if (index < 0 || index >= this.items.length) return;
    const targetItem = this.items[index];

    // Smooth scroll target item into view
    targetItem.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start'
    });
  }

  setupControls() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToIndex(this.activeIndex - 1));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToIndex(this.activeIndex + 1));
    }

    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => this.scrollToIndex(idx));
    });
  }

  setupKeyboardNav() {
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.scrollToIndex(this.activeIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.scrollToIndex(this.activeIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.scrollToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.scrollToIndex(this.items.length - 1);
      }
    });
  }
}
```

## Decision Rules

- **`scroll-snap-type: mandatory` vs. `proximity`:**
  - **Use `mandatory`:** When items MUST stop at precise snap alignments (e.g., full-page slides, tab panels, onboarding step cards). Ensures elements never freeze half-offscreen.
  - **Use `proximity`:** When smooth, natural scrolling should prevail unless the user halts near a snap boundary (e.g., long horizontal card catalogs, search results row). Allows users to pause anywhere without being forced into a snap point.

- **`scroll-snap-stop: always` vs. `normal`:**
  - **Use `always`:** For step-by-step flows (wizards, presentation decks, tutorial cards) where users must review each panel sequentially without skipping items on high-speed touch swipes.
  - **Use `normal`:** For long lists or product carousels where users benefit from fast, continuous flicks across multiple items.

- **`scroll-padding` vs. `scroll-margin`:**
  - **Use `scroll-padding` (on Container):** When fixed layout elements (sticky header, persistent bottom bar, container gutters) obscure part of the scroll viewport. Applies uniformly to all snapped children.
  - **Use `scroll-margin` (on Child Item):** When specific individual items require custom snap offsets relative to their siblings (e.g., featured hero cards with extra padding).

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **Focus Ring Visibility:** The scroll container and snap items must present a high-contrast focus indicator (`:focus-visible`) when navigating via keyboard.
  - **Keyboard Trapping:** Do not block standard keyboard tab flow. Arrow keys should advance snap points when container is focused, while `Tab` moves focus sequentially to inner interactive controls.
- **Motion Safety:** Respect `prefers-reduced-motion: reduce` by turning off CSS `scroll-behavior: smooth` and programmatic smooth animations.
- **Touch Gesture Protection:** Set `overscroll-behavior: contain` on nested horizontal scroll containers to prevent accidental parent page navigation or vertical pull-to-refresh triggers on mobile devices.

## Non-Goals

- Implementing custom WebGL or canvas-based physics animation engines (e.g., GSAP ScrollTrigger or Three.js).
- Handling server-side rendering or API fetching for infinite scrolling feeds (refer to `infinite-scroll-implementation`).
- Synchronizing browser URL history routing on slide changes (refer to `url-state-synchronization`).

## Common Failure Patterns

- **Clipping under Sticky Headers:** Setting `scroll-snap-type` without configuring `scroll-padding-top` / `scroll-padding-inline`, causing the top/left edge of snapped items to hide under fixed navigation bars.
- **Missing `display` / `overflow` Context:** Applying `scroll-snap-type` to containers that lack explicit `overflow-x: auto` / `overflow-y: auto`, resulting in non-functional snapping.
- **Flick Skipping on Step Guides:** Omitting `scroll-snap-stop: always` on sequential slides, causing touch screen swipes to fly past critical steps.
- **Scroll Lockup on iOS Safari:** Failing to include `-webkit-overflow-scrolling: touch` or applying `height: 100%` without `overflow: auto` on mobile webviews.
- **Layout Thrashing via Scroll Handlers:** Using synchronous `scroll` event listeners with `getBoundingClientRect()` to compute active pagination index instead of asynchronous `IntersectionObserver`.

## Validation Steps

- [ ] **Touch Swipe Test:** Perform touch swipe gestures on mobile viewports. Confirm items lock cleanly to target snap points without sticking off-center or flickering.
- [ ] **Sticky Header Offset Check:** Focus or scroll to the first and last snap items. Confirm no content is hidden beneath fixed navigation headers or sticky UI elements.
- [ ] **Keyboard Navigation Test:** Focus the container and press `ArrowLeft`/`ArrowRight` / `Home`/`End`. Verify smooth navigation between items and verify `Tab` order accesses interactive children inside cards.
- [ ] **IntersectionObserver Sync Check:** Scroll through items programmatically and manually. Confirm active pagination dots and disabled Next/Prev button states update in real-time.
- [ ] **Reduced Motion Verification:** Enable "Reduce Motion" in system settings or DevTools rendering emulator. Verify that scrolling jumps instantly to snap targets without smooth animation delays.
- [ ] **Console Audit:** Confirm no browser warnings or duplicate focus trap errors occur during rapid scroll gestures.
