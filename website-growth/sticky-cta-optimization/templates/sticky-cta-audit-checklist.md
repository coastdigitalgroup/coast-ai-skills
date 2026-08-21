# Sticky CTA Audit Checklist & Optimization Template

Use this checklist to audit, design, and verify persistent floating Call-to-Action (CTA) bars on mobile web and long-form desktop pages.

---

## 1. Trigger & Viewport Thresholds

- [ ] **Sentinel Element Configured:** Is the `IntersectionObserver` sentinel element placed immediately below the primary hero CTA wrapper?
- [ ] **Zero Premature Display:** Does the sticky CTA remain completely hidden while the primary hero CTA is visible in the viewport?
- [ ] **Hysteresis / Smooth Transition:** Does the bar slide or fade in/out smoothly without flickering when scrolling rapidly near the trigger threshold?
- [ ] **Footer Auto-Hide:** Does the sticky CTA automatically slide down/hide when the user enters the page footer or reaches an inline form?
- [ ] **Unthrottled Scroll Event Avoidance:** Is the trigger logic powered by `IntersectionObserver` rather than continuous scroll event listeners?

---

## 2. Layout, Dimensions & Touch Usability

- [ ] **Max Bar Height Enforced:** Is the mobile bar container height under 80px total (excluding safe-area padding) to avoid taking over the viewport?
- [ ] **Touch Target Size (WCAG 2.5.5):** Is the primary action button at least 48px high and 48px wide with sufficient spacing from surrounding elements?
- [ ] **iOS Safe Area Padding:** Is `padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px))` applied to protect iOS gesture areas?
- [ ] **High Color Contrast:** Does the sticky button meet WCAG AA contrast ratio (>= 4.5:1 for standard text, >= 3:1 for large bold text)?
- [ ] **Contextual Clarity:** Does the sticky bar display essential details (Product Name, Current Price, Rating or Risk Reversal line)?

---

## 3. Z-Index, Overlays & Collision Prevention

- [ ] **Sticky Header Coordination:** On top sticky bars, is the `top` offset set to account for any existing sticky site headers?
- [ ] **Chat Widget Offset:** Are live chat launcher buttons (Intercom, Drift, Gorgias) pushed up (`bottom: 80px+`) when the sticky bar is active?
- [ ] **Full-Screen Modal Suppression:** Do full-screen overlays, cookie consent banners, and cart drawer panels sit above the sticky CTA (`z-index: 1000+`)?
- [ ] **Cumulative Layout Shift (CLS = 0):** Is the sticky bar rendered with `position: fixed` or `position: sticky` without pushing inline document flow?

---

## 4. State Synchronization & Functionality

- [ ] **Real-Time Price & Variant Sync:** When a user selects a new variant (color, size, frequency) on the main page, does the sticky CTA bar instantly update price and selection?
- [ ] **Direct Execution:** Does clicking the sticky CTA button immediately execute the primary action (e.g., adding to cart or opening modal) rather than just scrolling up?
- [ ] **Loading & Spinner State:** Does the sticky button show a visual loading indicator upon click to prevent double-submission?
- [ ] **Out-of-Stock Handling:** Does the sticky bar button automatically transition to "Out of Stock" or "Join Waitlist" when an out-of-stock variant is selected?

---

## 5. Accessibility & Screen Reader Compliance

- [ ] **Accessible Name (ARIA):** Does the sticky button have a explicit, descriptive label (e.g., `aria-label="Add HydraGlow Serum to cart for $68.00"`)?
- [ ] **Focus Unobscured (WCAG 2.2 SC 2.4.13):** Do focusable controls on the page have adequate `scroll-margin-bottom` so keyboard focus is not hidden under the sticky bar?
- [ ] **Screen Reader Reading Order:** Is the sticky CTA DOM container placed logically in the HTML structure (typically right before `</body>` or within main content landmarks)?

---

## Sticky CTA Specification Template

```text
Component Name: Sticky Mobile Bottom CTA
Page Types: PDP, Long-Form SaaS LP
Trigger Type: IntersectionObserver (Hero CTA Sentinel)

Desktop Layout (>1024px):
- Position: Fixed Top (below header) OR Fixed Bottom
- Height: 60px
- Content: [Thumbnail] [Title] [Star Rating] [Price] -> [Primary Button]

Mobile Layout (320px - 480px):
- Position: Fixed Bottom
- Height: 64px + env(safe-area-inset-bottom)
- Content: [Price + Strikethrough] | [Primary Button (Min 48px Height)]

CSS Architecture:
.sticky-cta-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background-color: #ffffff;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
}

.sticky-cta-bar.is-visible {
  transform: translateY(0);
}
```
