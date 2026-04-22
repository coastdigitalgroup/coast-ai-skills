# Example: Responsive SaaS Header Breakdown

This example demonstrates how a complex SaaS navigation system reflows from a
multi-layered desktop header to a streamlined mobile experience.

## Desktop Layout (1440px)

The desktop header prioritizes scannability and quick access to core product
areas.

- **Logo:** Left-aligned, links to home.
- **Primary Nav (Center):**
  - **Product (Mega-menu):** Features, Integrations, Pricing.
  - **Solutions (Dropdown):** By Industry, By Team Size.
  - **Resources (Dropdown):** Blog, Documentation, Community.
- **Utility Nav (Right):**
  - **Search:** Icon button.
  - **Login:** Plain text link.
  - **Get Started:** Primary CTA button (Level 1 Hierarchy).

### Hierarchy Strategy

- The "Get Started" button has the highest visual weight.
- Dropdowns use icons and descriptions to provide context without cluttering the
  main bar.

---

## Mobile Layout (375px)

On mobile, the header is simplified to preserve screen real estate, moving
secondary links into a drawer.

- **Logo:** Left-aligned.
- **Header Actions (Right):**
  - **Search:** Icon (kept in header for high-frequency use).
  - **Menu Toggle:** "Hamburger" icon (aria-label="Open Navigation").
- **Mobile Drawer (Overlay):**
  - **Primary Links:** Accordion style for "Product", "Solutions", "Resources".
  - **Utility Links:** "Login" moved to the bottom of the list.
  - **Fixed Footer (Drawer):** "Get Started" button pinned to the bottom of the
    drawer for easy thumb access.

---

## Responsive Transition Logic

| Element       | Desktop (1024px+) | Mobile (<1024px)             |
| ------------- | ----------------- | ---------------------------- |
| Primary Links | Horizontal Row    | Vertical Accordion in Drawer |
| "Get Started" | Header Button     | Pinned Drawer Button         |
| "Login"       | Header Link       | List Item in Drawer          |
| Search        | Icon in Header    | Icon in Header               |
| Solutions Nav | Hover Dropdown    | Tap Accordion                |

## Accessibility Implementation

1.  **Skip Link:** A hidden "Skip to main content" link appears on first tab.
2.  **Landmark:** Header is wrapped in `<header>`; Navigation is in
    `<nav aria-label="Main">`.
3.  **Keyboard Trap:** When the mobile drawer is open, focus is trapped within
    the drawer until closed.
4.  **Escape Key:** Pressing `Esc` closes any open dropdown or the mobile
    drawer.
5.  **State Feedback:** The "Hamburger" icon changes to an "X" icon and
    `aria-expanded` updates to `true`.
