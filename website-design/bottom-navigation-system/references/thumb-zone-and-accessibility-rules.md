# Thumb-Zone Ergonomics & Accessibility Guidelines

This reference document outlines the physical ergonomics, thumb reach mapping, safe-area inset rules, and WCAG AA accessibility criteria for implementing mobile bottom navigation bars.

---

## 1. Ergonomic Thumb-Zone Mapping

When holding a smartphone with one hand (right or left hand), physical reach across the glass screen varies dramatically based on screen size (3.7" to 6.7"+ display diagonals).

```text
+------------------------------------+
|                                    |
|         HARD TO REACH ZONE         | <-- Top headers & hamburger buttons
|         (Requires 2 hands)         |
|                                    |
+------------------------------------+
|                                    |
|          NATURAL REACH ZONE        | <-- Ideal for secondary cards & lists
|                                    |
+------------------------------------+
|      NATURAL THUMB REACH ZONE      | <-- PERFECT FOR BOTTOM NAVIGATION!
|   [Tab 1] [Tab 2] [Tab 3] [Tab 4]  |     Highest frequency destinations
+------------------------------------+
|      HARDWARE GESTURE BAR AREA     | <-- env(safe-area-inset-bottom)
+------------------------------------+
```

### Thumb Reach Guidelines for Tab Allocation
1. **Center Tabs (Slots 2 & 3 in a 4-tab bar; Slot 3 in a 5-tab bar):** Safest, most natural reach for both left-handed and right-handed users. Reserve these slots for the most frequently accessed workflow (e.g., Search, Saved, Cart, or primary Action button).
2. **Outer Left Slot (Slot 1):** Primary home anchor. High visibility and universal mental model.
3. **Outer Right Slot (Slot 5):** Ideal for profile, settings, or overflow drawer link.

---

## 2. Safe Area Insets & Viewport Fit

Modern bezel-less mobile screens (e.g., iPhones with Face ID, Android devices with gesture navigation bars) overlay translucent software gesture indicators over the bottom of the viewport.

### CSS Safe Area Implementation Standard

```css
/* Container CSS */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  /* Fixed base height + physical hardware safe area inset */
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);

  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

/* Page Scroll Clearance Container */
.page-content {
  /* Prevent last element from being obscured behind fixed bottom nav */
  padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 16px);
}
```

---

## 3. Accessibility Checklist (WCAG 2.1 / 2.2 AA Standard)

| WCAG Criteria | Guideline | Implementation Rule |
| :--- | :--- | :--- |
| **SC 1.4.3 Contrast (Minimum)** | Text labels & icons must have a minimum 4.5:1 contrast ratio against the nav background. | Inactive text: `#4B5563` on `#FFFFFF` (4.8:1 contrast ratio). Active text: `#2563EB` on `#FFFFFF` (6.1:1 ratio). |
| **SC 2.1.1 Keyboard Accessibility** | Navigation must be operable via keyboard (`Tab` / `Shift+Tab` and `Arrow` keys). | Use standard `<nav>` wrapper with semantic `<a>` links or `<button role="tab">` controls. |
| **SC 2.4.7 Focus Visible** | Focused tab links must display a distinct focus ring. | Use `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: -2px; }`. |
| **SC 2.5.8 Target Size (Minimum)** | Touch target minimum height and width. | Minimum **48x48px** touch target per tab link (`min-height: 48px; min-width: 48px;`). |
| **SC 4.1.2 Name, Role, Value** | Tab state and destination must be conveyed to assistive technologies. | Use `aria-current="page"` on the active tab link, and descriptive `aria-label` or visible text labels on all tabs. |
| **Badge Accessibility** | Counter and dot badges must be read by screen readers. | Wrap badge counts in `<span aria-label="3 items in cart">3</span>` or provide `<span class="sr-only">Unread notification</span>`. |
