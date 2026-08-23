# Sticky CTA Optimization Audit & Implementation Checklist

Use this checklist to audit, specify, and test sticky Call-to-Action (CTA) floating bars on mobile and desktop pages.

---

## 1. Trigger Logic & Visibility Gap Audit

- [ ] **Page Depth Verification:** Is the page longer than 1.5 viewports (~1000px on mobile)? *(If short, a sticky CTA is not required).*
- [ ] **Visibility Gap Check:** Is there a section where the hero CTA has scrolled off-screen and no other conversion button is visible for > 1 viewport height?
- [ ] **Scroll Trigger Implementation:** Is the sticky bar triggered smoothly via `IntersectionObserver` when the hero CTA exits the viewport?
- [ ] **No Double CTA Conflict:** Is the sticky bar hidden while the main hero CTA is visible in the viewport?
- [ ] **Smart Directional Hiding (Optional):** On reading-heavy content pages, does the sticky bar hide on fast downward scroll and reappear on upward scroll?

---

## 2. Layout, Ergonomics & Thumb-Zone Specs

- [ ] **Height Ceiling (Mobile):** Is the mobile sticky bar height under 15% of vertical viewport height (maximum 64px–72px)?
- [ ] **Touch Target Size:** Is the primary action button inside the sticky bar at least 48x48px (or full-width with 12px vertical padding)?
- [ ] **Thumb-Zone Placement:** Is the primary button placed on the right side or full-width at the bottom for easy right-handed/left-handed thumb reach?
- [ ] **Value Anchor Inclusion:** Does the bar contain context alongside the button (e.g., Product Title + Price, Star Rating, or "Free Trial")?
- [ ] **High Visual Contrast:** Does the primary button inside the sticky bar maintain a high contrast ratio (4.5:1 minimum) against the sticky bar background?
- [ ] **Single-Line Layout:** Is the text copy concise enough to prevent 2-line wrapped buttons on narrow 375px screens?

---

## 3. Collision Prevention & Z-Index Management

- [ ] **Z-Index Hierarchy Mapping:** Is the z-index explicitly set (e.g., Page Content: 1-10, Sticky CTA: 100, Header Nav: 200, Modals: 1000)?
- [ ] **Chat Widget Offset:** Does the floating live chat icon (Intercom, Zendesk, Drift) dynamically shift up (`bottom: 80px`) when the sticky bar activates?
- [ ] **Cookie Banner Deferral:** If an unaccepted cookie banner is active at the bottom, is the sticky CTA docked above it or deferred until accepted?
- [ ] **Footer Padding Offset:** Is bottom padding (`padding-bottom: 80px`) added to the page container/footer so fixed bars never cover page content?
- [ ] **Mobile Keyboard Dismissal:** Does the sticky bar automatically hide when a user taps into an input field or text area?

---

## 4. State Synchronization & Technical Integrity

- [ ] **Real-Time Variant Sync:** If the user changes size, color, or quantity in the main product form, does the sticky bar instantly update?
- [ ] **Dynamic Price & Offer Sync:** Does the price in the sticky CTA update immediately when discount codes or options change?
- [ ] **Out-of-Stock / Disabled State Sync:** If the selected item goes out of stock or requires mandatory fields, does the sticky button update to "Sold Out" or disabled?
- [ ] **Zero Cumulative Layout Shift (CLS):** Is the sticky bar rendered fixed or transformed via CSS (`transform: translateY()`) to avoid bumping page layout?
- [ ] **Passive Scroll Performance:** Are scroll listeners (if used) tagged as `passive: true` or replaced with `IntersectionObserver` to preserve 60fps scrolling?

---

## 5. Accessibility & Focus Compliance

- [ ] **Landmark & ARIA Labeling:** Is the sticky bar wrapped in an accessible region (`<div role="region" aria-label="Quick Purchase">` or `<aside>`)?
- [ ] **DOM Tab Order:** Is the sticky CTA placed logically in the keyboard tab order (or focusable via keyboard shortcut)?
- [ ] **Dismiss / Collapse Button:** On dense or long-form reading pages, is a small, clear dismiss/collapse icon (`aria-label="Dismiss sticky bar"`) provided?
- [ ] **Screen Reader State Notification:** Are button state updates (e.g., "Adding to Cart...", "Added!") announced via `aria-live="polite"`?

---

## Audit Scoring Summary

| Passed Checks | Risk Level | Action Required |
| :--- | :--- | :--- |
| **21 – 23 Checks** | 🟢 Low | Ready for launch and A/B performance tracking. |
| **16 – 20 Checks** | 🟡 Moderate | Address minor collision, accessibility, or mobile viewport issues. |
| **< 16 Checks** | 🔴 High | Critical risk of screen blocking, UI overlap, or stale price bugs. Remediate before deployment. |
