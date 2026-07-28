# Example: Progressive Header & Mobile Bottom Dock Layout Breakdown

This example demonstrates how to design and compose two crucial sticky/floating components—a **Progressive Scroll Header** and a **Mobile-Docked Persistent CTA Bar**—within a high-converting marketing or e-commerce landing page.

---

## 1. Structural Page Layout Map

The diagram below shows how the viewport changes across three scrolling phases on a mobile device, illustrating how sticky elements enter, exit, and adjust to protect readable space and maintain access to primary actions.

```text
+-----------------------+   +-----------------------+   +-----------------------+
| [Header: Transp/Static]|  |                       |   | [Header: Solid + Blur]|
|                       |   |                       |   |                       |
|  HERO SECTION         |   |  SECTION 2: FEATURES  |   |  SECTION 3: BENEFITS  |
|                       |   |                       |   |                       |
|                       |   |                       |   |                       |
|                       |   |                       |   |                       |
|   [Inline CTA]        |   |                       |   |                       |
|                       |   |                       |   |                       |
|                       |   |                       |   |                       |
|                       |   |                       |   | [Floating FAB (Up)]   |
|                       |   |                       |   |                       |
|                       |   | [Mobile Bottom Dock]  |   | [Mobile Bottom Dock]  |
+-----------------------+   +-----------------------+   +-----------------------+
Phase 1: Initial Load        Phase 2: Scroll Down        Phase 3: Scroll Up
- Header is integrated.     - Header translates up.     - Header translates down
- No bottom dock visible.   - Bottom dock slides in     - Header has solid/blur.
- Focus is on Hero CTA.       after Hero CTA scroll.    - FAB enters viewport.
```

---

## 2. Progressive Header Behavior Spec

### Scroll States & Coordinates
- **Base Height:** `72px` desktop, `60px` mobile.
- **Scroll Threshold (Activation Zone):** `scrollY > 120px`
- **Scroll Delta (Trigger Distance):** `15px` of scrolling action.

### State Transitions

| State | Scroll Position | Scroll Direction | Visual Style | CSS Transform |
| :--- | :--- | :--- | :--- | :--- |
| **0. Initial** | `0px - 120px` | Neutral | Transparent/Flat, absolute position, standard text color | `transform: translateY(0)` |
| **1. Hiding** | `> 120px` | Down (delta > 15px) | Off-viewport, invisible to prevent reading distraction | `transform: translateY(-100%)` |
| **2. Revealing** | `> 120px` | Up (delta > 15px) | Solid brand surface or glassmorphism (`backdrop-filter: blur(8px)`), drop shadow | `transform: translateY(0)` |
| **3. Docked Top** | `< 60px` | Up / Neutral | Snap back to integrated layout, removal of drop shadow | `transform: translateY(0)` |

### Avoiding Cumulative Layout Shift (CLS)
To prevent the page body from snapping upwards when the header changes layout modes:
1. The header wrapper remains inside a persistent layout container with a fixed height matching the header (`min-height: var(--header-height)`).
2. Only the *inner header container* transitions between static, absolute, and sticky positions.

---

## 3. Mobile Persistent Bottom Dock Layout

The bottom dock drives immediate conversion on product detail pages (PDPs) and lead-capture forms.

### Spatial Breakdown
- **Dock Height:** `64px` base height + system safe-area inset.
- **Visual Grid:** 2-Column Split:
  - **Left Column (40% width):** Secondary information / Contextual feedback (e.g., product price + rating summary).
  - **Right Column (60% width):** High-contrast Primary Action Trigger (e.g., "Buy Now" button).

### Device Safe-Area Mitigation (iOS & Android Chrome)
On modern mobile devices, system-level swipe gestures and home indicators overlap the bottom of the viewport. Placing buttons directly at the bottom causes mis-clicks or blocks user navigation.

```css
.sticky-bottom-dock {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 150;

  /* Apply safe-area margins dynamically */
  padding-top: var(--space-s);
  padding-left: var(--space-m);
  padding-right: var(--space-m);
  padding-bottom: calc(var(--space-s) + env(safe-area-inset-bottom));

  /* Visual styling */
  background-color: var(--surface-overlay);
  border-top: 1px solid var(--border-subtle);
  box-shadow: var(--elevation-lg);
}
```

### Entrance Trigger Conditions
- **When NOT to show:** If `scrollY` is less than the visual boundary of the inline CTA button in the hero area (e.g., `< 100vh`). Showing it too early creates visual redundancy and makes the interface feel spammy.
- **When to show:** Once `scrollY >= 100vh`. The dock slides up smoothly from the bottom with a 300ms transition (`transform: translateY(0)` from `translateY(100%)`).

---

## 4. Accessibility and Wayfinding Walkthrough

### Keyboard Focus Management (WCAG 2.2 SC 2.4.11)
Suppose a keyboard tab-user focuses on a form link that is positioned near the top of a page section. If the progressive sticky header is active and has a height of `72px`, the focused link will be completely obscured underneath the header.

To solve this design error:
1. All scroll-to-anchor targets and form groups are specified with a responsive scroll offset:
   ```css
   .section-target {
     scroll-margin-top: calc(var(--header-height) + var(--space-l));
   }
   ```
2. When a user tabs onto an element that is partially covered, the browser's native scroll engine shifts the viewport to keep the focused element fully visible inside the "Visual Safe Zone."

### High-Contrast Touch Targets
- Both the "Close" triggers, primary CTAs, and navigation links within the floating systems feature a minimum interactive footprint of `44x44px`.
- High-contrast focus indicators (minimum 3:1 contrast ratio against the background color) are applied to all interactive controls in both the header and the bottom dock:
  ```css
  .sticky-control:focus-visible {
    outline: 2px solid var(--brand-focus);
    outline-offset: 4px;
  }
  ```
