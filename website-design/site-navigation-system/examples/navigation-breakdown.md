# Example: Responsive Navigation Breakdown

This example demonstrates how a navigation system adapts from a complex desktop
layout to a streamlined mobile experience.

## The Scenario

A B2B SaaS platform with:

- 5 Primary Product Pages
- 3 Utility Actions (Search, Login, Free Trial)
- Multi-level "Resources" menu

---

## 1. Desktop Layout (1280px+)

On desktop, the full width allows for a "Spread" layout where all primary and
utility links are visible.

- **Logo:** Left-aligned.
- **Primary Nav:** Center-aligned.
  - Features (Dropdown)
  - Solutions (Dropdown)
  - Pricing (Link)
  - Resources (Mega Menu)
- **Utility Nav:** Right-aligned.
  - Search (Icon)
  - Login (Link)
  - **CTA:** "Start Free Trial" (Primary Button)

### Visual Hierarchy

The "Start Free Trial" button has the highest visual weight (Solid color),
followed by the Logo, then the Primary Links.

---

## 2. Tablet Layout (768px - 1024px)

As space decreases, we use the **Priority+** pattern.

- **Logo:** Left-aligned.
- **Primary Nav:**
  - Features
  - Solutions
  - **"More" Dropdown:** (Pricing, Resources, Login are moved here).
- **CTA:** "Start Free Trial" remains visible as the primary action.

---

## 3. Mobile Layout (Below 768px)

On small screens, the navigation collapses into a **Full-Screen Drawer** to
preserve vertical space for content.

- **Header Bar:**
  - Logo (Left)
  - Hamburger Icon (Right)
- **Drawer Content (When Open):**
  - **Top Section:** Utility (Search Bar).
  - **Middle Section:** Primary Links (Stacked vertically, 48px touch targets).
    - Features (Accordion)
    - Solutions (Accordion)
    - Pricing
    - Resources (Accordion)
  - **Bottom Section:**
    - Login Link
    - **CTA:** "Start Free Trial" (Full-width button at the bottom of the
      drawer).

---

## Decision Logic

1.  **Why Accordions on Mobile?** Because nested dropdowns (hover) don't work on
    touch. Accordions allow users to expand only what they need without leaving
    the menu.
2.  **Why keep the CTA visible?** In the SaaS context, the "Free Trial" is the
    conversion goal. Keeping it easily accessible (either in the header bar or
    at the bottom of the drawer) is critical.
3.  **Why the drawer?** With 8+ items, a "Tab Bar" would be too cluttered. The
    drawer provides a focused, clean interface for navigation.
