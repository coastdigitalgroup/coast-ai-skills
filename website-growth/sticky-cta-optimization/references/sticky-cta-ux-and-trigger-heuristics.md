# Sticky CTA UX & Trigger Heuristics

This reference guide details psychological triggers, ergonomic thumb-zone positioning, viewport stack rules, and code patterns for implementing high-converting sticky CTAs.

---

## 1. Ergonomic Thumb-Zone & Viewport Spatial Rules

Mobile devices are primarily held and operated with one hand (67% single-thumb usage according to Steven Hoober's mobile interaction research).

### Mobile Thumb-Zone Mapping

```text
+-----------------------------------+
|            HARD ZONE              |  <- Top 25%: Reaching requires hand re-grip
|   (Avoid primary CTAs here)       |
+-----------------------------------+
|           NATURAL ZONE            |  <- Middle 50%: Good for reading & scrolling
|                                   |
+-----------------------------------+
|            EASY ZONE              |  <- Bottom 25%: Natural sweep of the thumb
|   (PRIMARY STICKY CTA LOCATION)   |
+-----------------------------------+
```

- **Bottom Dock Priority:** Placing the sticky CTA in the bottom 25% of the mobile screen aligns directly with the natural sweep of the thumb, reducing physical effort and reaction time.
- **Button Orientation:** On screens under 414px wide, use full-width primary CTA buttons or right-aligned buttons to ensure immediate right-thumb reachability.

---

## 2. Scroll-Trigger Architecture (`IntersectionObserver`)

Relying on legacy `window.onscroll` listeners causes main-thread layout thrashing and choppy scrolling. Use `IntersectionObserver` to trigger sticky bars smoothly at 60fps.

### Lightweight Trigger Pattern

```javascript
// Target the primary CTA in the hero section
const heroButton = document.querySelector('.hero-primary-cta');
const stickyBar = document.querySelector('.sticky-cta-dock');

const observerOptions = {
  root: null, // viewport
  threshold: 0, // Trigger as soon as 1px is out of view
  rootMargin: "0px 0px 0px 0px"
};

const ctaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Show sticky bar ONLY when hero CTA is NOT intersecting (scrolled past)
    if (!entry.isIntersecting) {
      stickyBar.classList.add('is-active');
      stickyBar.setAttribute('aria-hidden', 'false');
    } else {
      stickyBar.classList.remove('is-active');
      stickyBar.setAttribute('aria-hidden', 'true');
    }
  });
}, observerOptions);

if (heroButton && stickyBar) {
  ctaObserver.observe(heroButton);
}
```

---

## 3. Z-Index Stack & Layering Standard

Prevent floating element chaos by enforcing strict z-index tiers across your design system:

| Layer Category | Z-Index | Examples |
| :--- | :--- | :--- |
| **Base Content** | `0 – 10` | Text, images, inline product forms |
| **Sticky Page Rails** | `20 – 50` | Desktop sticky sidebar (`position: sticky`) |
| **Sticky CTA Dock** | `100` | Floating bottom bar, top sticky header dock |
| **Header Navigation** | `200 – 300` | Fixed main navigation header, mobile menu dropdown |
| **Chat & Floating Widgets** | `400` | Live chat bubbles (positioned above sticky bar) |
| **Full-Screen Modals & Popups** | `1000+` | Cookie consent modal, age gate, cart drawer |

---

## 4. Virtual Keyboard & Focus Collision Rules

On mobile devices, when a user taps a text input field, the OS virtual keyboard slides up, reducing vertical screen height by 40–50%.

### Handling Input Focus

```javascript
// Hide sticky bar when mobile keypads open to prevent viewport blocking
const formInputs = document.querySelectorAll('input, select, textarea');
const stickyBar = document.querySelector('.sticky-cta-dock');

formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    stickyBar.classList.add('is-hidden-keyboard');
  });
  input.addEventListener('blur', () => {
    stickyBar.classList.remove('is-hidden-keyboard');
  });
});
```

```css
/* CSS Transition for Smooth Docking */
.sticky-cta-dock {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #ffffff;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;
}

.sticky-cta-dock.is-active {
  transform: translateY(0);
}

.sticky-cta-dock.is-hidden-keyboard {
  transform: translateY(100%) !important;
}
```

---

## 5. Microcopy & Value Anchor Patterns

A standalone button without context can feel mysterious or aggressive. Always pair the primary action with a high-reassurance value anchor.

### High-Converting Value Pairs

1. **E-Commerce PDP:**
   - *Left:* `Product Name` + `$ Price` + `★ 4.8 Rating`
   - *Right Button:* `[ Add to Cart ]`
2. **SaaS Free Trial:**
   - *Left:* `14-Day Free Trial` • `No Credit Card Required`
   - *Right Button:* `[ Start Free Trial ]`
3. **B2B Lead Generation:**
   - *Left:* `Need a Custom Demo?`
   - *Right Button:* `[ Schedule 15-Min Call ]`
4. **Content / Lead Magnet:**
   - *Left:* `Get the Free 2025 Industry Report (PDF)`
   - *Right Button:* `[ Download Now ]`
