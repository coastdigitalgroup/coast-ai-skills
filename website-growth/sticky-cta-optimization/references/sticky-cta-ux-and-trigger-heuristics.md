# Sticky CTA UX Heuristics & Trigger Guidelines

## 1. Trigger Mechanics: IntersectionObserver vs. Scroll Listeners

Never use unthrottled `window.addEventListener('scroll')` to toggle sticky elements. Unthrottled scroll listeners cause main-thread jank, degrade touch responsiveness on lower-end mobile devices, and introduce Cumulative Layout Shift (CLS).

### Recommended IntersectionObserver Pattern

```javascript
// Setup Observer for Sticky CTA Activation
const heroCtaElement = document.querySelector('.hero-buy-box-cta');
const stickyCtaBar = document.querySelector('.sticky-cta-bar');
const footerElement = document.querySelector('footer');

if (heroCtaElement && stickyCtaBar) {
  // 1. Observe Hero CTA Exit
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Show sticky bar only when hero CTA is completely off-screen
        if (!entry.isIntersecting) {
          stickyCtaBar.classList.add('is-visible');
          document.body.classList.add('sticky-cta-active');
        } else {
          stickyCtaBar.classList.remove('is-visible');
          document.body.classList.remove('sticky-cta-active');
        }
      });
    },
    { threshold: 0 }
  );

  heroObserver.observe(heroCtaElement);

  // 2. Observe Footer Entry (Auto-Hide near footer)
  if (footerElement) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stickyCtaBar.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    footerObserver.observe(footerElement);
  }
}
```

---

## 2. iOS Safe Area & Viewport Insets

Modern edge-to-edge mobile screens (iPhone X through iPhone 16/16 Pro, modern Android devices with gesture navigation bars) feature physical camera cutouts and software gesture indicators at the bottom of the display.

If a fixed bottom bar does not account for `safe-area-inset-bottom`, button text or tap targets will collide with the home indicator swipe line, rendering the button unusable or causing accidental app switches.

### CSS Safe Area Architecture

```css
/* Base Container for Mobile Sticky Bottom Bar */
.sticky-cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 200;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;

  /* Fallback for older browsers + Modern env() inset */
  padding-top: 10px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
}

/* Dynamically adjust floating chat launcher when sticky CTA is active */
body.sticky-cta-active .live-chat-launcher {
  bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
  transition: bottom 0.3s ease;
}
```

---

## 3. Z-Index Layering Hierarchy

To avoid z-index battles across desktop and mobile, implement a strict stacking context layer system:

| Layer / Component | Recommended `z-index` | Notes |
| :--- | :--- | :--- |
| **Base Page Content** | `0` – `10` | Default document flow. |
| **Sticky Page Header** | `100` | Site navigation sticky header. |
| **Sticky CTA Bar** | `200` | Fixed top or bottom conversion bar. |
| **Live Chat Launcher** | `300` | Positioned above sticky CTA bar or offset vertically. |
| **Slide-In Drawers (Cart)** | `1000` | Must visually cover sticky CTA bar. |
| **Full-Screen Modals / Dialogs** | `1050` | Must sit on top of all page layers. |
| **Cookie Consent Banner** | `2000` | Initial compliance overlay (suppresses sticky CTA until dismissed). |

---

## 4. WCAG 2.2 Accessibility Rules for Sticky Bars

### SC 2.4.13 Focus Unobscured (Level AA)
When a keyboard user tabs through input fields or links on a long page, the active focus ring must not be completely hidden beneath the sticky top or bottom CTA bar.

- **Solution:** Apply CSS `scroll-margin-bottom` or `scroll-margin-top` to interactive elements equal to the height of the sticky bar:
  ```css
  input, select, textarea, button, a {
    scroll-margin-bottom: 80px;
  }
  ```

### SC 2.5.5 Target Size (Level AAA) & SC 2.5.8 Target Size Minimum (Level AA)
The pointer target area for the primary CTA inside the sticky bar must be at least **24x24 CSS pixels** (Level AA) and ideally **48x48 CSS pixels** (Level AAA / touch screen standard) to prevent misclicks on mobile devices.

---

## 5. Mobile Conversion Benchmarks

- **Mobile PDP Sticky CTA Adoption:** Deploying a dynamic bottom sticky CTA on mobile PDPs yields an average **+15% to +35%** increase in Add-to-Cart events.
- **Microcopy Impact:** Including the real-time price directly inside the button (e.g., **"Add to Cart — $68"**) increases CTR by **8% to 12%** compared to standalone text ("Add to Cart").
- **Social Proof Persistence:** Including micro star ratings inside the sticky bar (e.g., `4.9 ★`) increases user trust on mid-page reviews by **14%**.
