# Mobile E-Commerce & SaaS Bottom Navigation Breakdowns

This document breaks down two real-world design applications of the **Bottom Navigation System**:
1. **Mobile E-Commerce Web App (5-Tab Standard Bar with Cart Count Badge)**
2. **SaaS Productivity App (4-Tab Bar with Center Floating Action Button Dock)**

---

## Example 1: Mobile E-Commerce Web App

### Scenario
A mobile fashion e-commerce web application requires rapid, 1-tap navigation between primary shopping workflows: discovering products, searching, reviewing saved items, checking out the shopping cart, and viewing account details.

### Navigation Hierarchy & Thumb-Zone Mapping
- **Total Tabs:** 5 items (20% width allocation per tab)
- **Primary Thumb Reach Slots:**
  - **Slot 1 (Far Left):** Home (`/`)
  - **Slot 2 (Inner Left):** Search / Browse (`/search`)
  - **Slot 3 (Center - Prime Reach):** Saved Items (`/wishlist`)
  - **Slot 4 (Inner Right - Prime Reach):** Cart with Quantity Badge (`/cart`)
  - **Slot 5 (Far Right):** Account (`/account`)

### Structural Layout Anatomy

```text
+-------------------------------------------------------------------------+
| [Viewport Content Layer - Scrollable]                                    |
| Product Card 1                                                          |
| Product Card 2                                                          |
| ...                                                                     |
| [Padding Bottom Clearance Buffer: 80px]                                 |
+-------------------------------------------------------------------------+
| [Fixed Bottom Navigation Surface - 56px Base + Safe Area]                |
|                                                                         |
|  +--------+   +--------+   +--------+   +--------+   +--------+         |
|  |  (H)   |   |  (S)   |   |  (W)   |   |  (C)*  |   |  (A)   |         |
|  |  Home  |   | Search |   | Saved  |   | Cart   |   | Account|         |
|  +--------+   +--------+   +--------+   +--------+   +--------+         |
|     (20%)       (20%)        (20%)        (20%)        (20%)            |
|                                                                         |
| [iOS Home Indicator / Gesture Handle Area - env(safe-area-inset-bottom)] |
+-------------------------------------------------------------------------+
  *(C) Cart Tab includes a 18x18px red badge with numeric counter "3"
```

### Component Code & State Breakdown

```html
<nav class="bottom-nav" aria-label="Mobile primary navigation">
  <ul class="bottom-nav__list">
    <!-- Tab 1: Active -->
    <li class="bottom-nav__item">
      <a href="/" class="bottom-nav__link bottom-nav__link--active" aria-current="page">
        <svg class="bottom-nav__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span class="bottom-nav__label">Home</span>
      </a>
    </li>

    <!-- Tab 2: Search -->
    <li class="bottom-nav__item">
      <a href="/search" class="bottom-nav__link">
        <svg class="bottom-nav__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span class="bottom-nav__label">Search</span>
      </a>
    </li>

    <!-- Tab 3: Saved -->
    <li class="bottom-nav__item">
      <a href="/wishlist" class="bottom-nav__link">
        <svg class="bottom-nav__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span class="bottom-nav__label">Saved</span>
      </a>
    </li>

    <!-- Tab 4: Cart with Badge -->
    <li class="bottom-nav__item">
      <a href="/cart" class="bottom-nav__link">
        <div class="bottom-nav__icon-wrapper">
          <svg class="bottom-nav__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="bottom-nav__badge" aria-label="3 items in cart">3</span>
        </div>
        <span class="bottom-nav__label">Cart</span>
      </a>
    </li>

    <!-- Tab 5: Account -->
    <li class="bottom-nav__item">
      <a href="/account" class="bottom-nav__link">
        <svg class="bottom-nav__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="bottom-nav__label">Account</span>
      </a>
    </li>
  </ul>
</nav>
```

---

## Example 2: SaaS Productivity App with Central FAB Dock

### Scenario
A task management and team collaboration PWA requires immediate access to personal task lists, team activity, notifications, and settings, with an elevated primary action button ("+ New Task") anchored in the middle thumb slot.

### Layout Mechanics
- **Layout Model:** 4 secondary navigation tabs flanking 1 central elevated Floating Action Button (FAB).
- **Center Action Target:** 52x52px elevated action button with primary accent background (`var(--brand-primary)`).

### Structural Layout Anatomy

```text
+-------------------------------------------------------------------------+
| [Viewport Content Layer]                                                |
| Today's Tasks List                                                      |
| ...                                                                     |
+-------------------------------------------------------------------------+
|                             /---------\                                 |
|                            |    +    |  <-- Elevated FAB (+ New Task)   |
|  +--------+   +--------+   |  (FAB)  |   +--------+   +--------+         |
|  |  (T)   |   |  (A)   |    \-------/    |  (N)*  |   |  (S)   |         |
|  | Today  |   | Activity|    New Task    | Alerts |   | Settings|        |
|  +--------+   +--------+                 +--------+   +--------+         |
+-------------------------------------------------------------------------+
  *(N) Alerts Tab includes a 8x8px red dot badge indicating new updates
```

### Key Design Tokens Applied

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--bottom-nav-bg` | `rgba(255, 255, 255, 0.90)` | Translucent surface for backdrop blur. |
| `--bottom-nav-height` | `60px` | Base container height excluding safe area. |
| `--active-color` | `#2563EB` (Blue 600) | High-contrast selected state (6.1:1 contrast ratio). |
| `--inactive-color` | `#4B5563` (Gray 600) | Readable secondary text (4.8:1 contrast ratio). |
| `--fab-size` | `52px` | High-visibility central primary touch target. |
| `--fab-bg` | `#2563EB` | Prominent primary button fill. |
