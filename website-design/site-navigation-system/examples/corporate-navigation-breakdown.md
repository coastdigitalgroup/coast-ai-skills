# Corporate Site Navigation Breakdown

This example analyzes a multi-layered navigation system for a fictional
large-scale corporate website ("Acme Global").

## Navigation Architecture

The site uses a tiered approach to handle high content density without
overwhelming the user.

### 1. Utility Navigation (Top Right)

- **Items:** Search, Support, Language (EN), Login, Request a Quote.
- **Design Strategy:** Smaller font size, subtle styling. The "Request a Quote"
  is styled as a secondary button to stand out within the utility bar.

### 2. Primary Navigation (Center Header)

- **Items:** Products, Solutions, Company, Resources.
- **Design Strategy:** Large, clear type with generous spacing. Each item
  triggers a Mega-menu.
- **Visual Cues:** Uses a small chevron icon to indicate a dropdown/mega-menu is
  available.

### 3. Mega-Menu Breakdown (Product Level)

When "Products" is hovered or clicked:

- **Layout:** 4-column grid.
- **Column 1:** Categories (Software, Hardware, Services).
- **Column 2 & 3:** Featured individual products with small icons.
- **Column 4:** Promotion/CTA (e.g., "What's New in V2.0" with an image).

### 4. Breadcrumb Navigation (Internal Pages)

- **Example:** Home > Solutions > Cloud Infrastructure > Data Security.
- **Function:** Provides a clear path back to "Cloud Infrastructure" or
  "Solutions" from a deep page.

### 5. Sidebar Navigation (Resource Center)

- **Context:** Used when the user enters the "Resource Center" (Blog, Case
  Studies, Whitepapers).
- **Function:** Allows the user to filter by "Topic" or "Industry" without
  leaving the Resource context.

---

## Interaction Rules

### Desktop

- **Trigger:** Click (for accessibility) or Hover (with a 300ms delay to prevent
  accidental triggers).
- **Animation:** Subtle fade-in and slide-up (0.2s) to provide visual feedback.
- **Active State:** Underline and 10% bolder text for the current top-level
  item.

### Mobile

- **Pattern:** Full-screen "Hamburger" overlay.
- **Hierarchy:**
  1. Primary links (Accordion style).
  2. Search (Prominent at the top).
  3. Utility links (Relocated to the bottom of the mobile drawer).
- **Interaction:** Tap to expand accordion levels. Large touch targets (50px
  height).

---

## Success Metrics

- **Discovery:** 90% of users can find the "Request a Quote" button within 2
  seconds of page load.
- **Accessibility:** 100% of links are reachable via Tab key; Mega-menu closes
  on "Escape" key.
- **Responsiveness:** Navigation remains functional on screens as small as 320px
  width.
