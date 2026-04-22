---
name: site-navigation-system
description:
  Design and implement a structured, accessible, and responsive navigation
  framework that guides users through a website's information architecture.
---

# Site Navigation System

## Purpose

The Site Navigation System skill provides a methodology for organizing and
designing the structural pathways of a website. It ensures that users can orient
themselves, find information quickly, and move between sections effortlessly
across all device types. A robust navigation system balances information density
with clarity, maintaining accessibility and visual hierarchy.

## Use Cases

- Designing the global header and footer for a new website.
- Restructuring a complex site's information architecture (IA).
- Implementing responsive navigation patterns (e.g., mobile drawers,
  mega-menus).
- Improving "wayfinding" on content-heavy sites (breadcrumbs, sub-navigation).
- Auditing existing navigation for accessibility and usability gaps.

## When NOT to Use

- **Single-Page Applications (SPA) with Minimal Routing:** Where navigation is
  purely functional within a single view (e.g., a simple dashboard tool).
- **Immersive/Experimental Sites:** Where standard navigation conventions are
  intentionally avoided for narrative or artistic purposes.
- **Standalone Landing Pages:** Where the goal is a single conversion path and
  global navigation might distract the user (though a "back to top" or minimal
  anchor nav might still be used).

## Inputs

1.  **Information Architecture (IA):** A sitemap or list of pages categorized by
    hierarchy.
2.  **User Personas & Goals:** What are the most frequent tasks users need to
    perform?
3.  **Content Priority:** Which links are "Primary" (Global), "Secondary"
    (Contextual), or "Utility" (Tools/Account)?
4.  **Device Constraints:** Target breakpoints and touch vs. mouse interaction
    requirements.

## Outputs

1.  **Navigation Map:** A structural guide for Header, Footer, and Sub-nav
    elements.
2.  **Responsive Strategy:** Definitions for how navigation adapts from Desktop
    to Mobile.
3.  **Interaction Spec:** Behavior for dropdowns, active states, and focus
    management.
4.  **Accessibility Landmarks:** Defined roles and labels for screen reader
    navigation.

## Workflow

### 1. Categorize Navigation Levels

Divide your sitemap into functional tiers:

- **Primary:** Core site sections (e.g., Products, Services, About).
- **Secondary/Contextual:** Links specific to a section (e.g., specific product
  categories).
- **Utility:** Non-core but necessary tools (e.g., Search, Login, Language
  Selector).
- **Tertiary (Footer):** SEO links, legal, social, and redundant global links.

### 2. Select Navigation Patterns

Choose patterns based on content density:

- **Simple Bar:** 3–7 links. Best for small-to-medium sites.
- **Dropdowns:** Best for sites with 2 levels of hierarchy.
- **Mega-menu:** Best for large e-commerce or enterprise sites with many
  categories.
- **Mobile Drawer:** Standard for mobile; contains all navigation levels in a
  vertical stack.

### 3. Design for Wayfinding

Ensure users always know where they are:

- **Active States:** Visually distinguish the current page link.
- **Breadcrumbs:** Use for sites deeper than 3 levels.
- **Consistent Placement:** Keep global navigation in the same location across
  all pages.

### 4. Define Responsive Behavior

Determine how the navigation collapses:

- **The Breakpoint Shift:** Decide exactly when the desktop menu becomes a
  "Hamburger" menu.
- **Priority Paring:** On mobile, move utility links (like "Search") out of the
  drawer and into the header if they are high-priority.
- **Touch Targets:** Ensure all links are at least 44x44px for thumb
  interaction.

### 5. Establish Accessibility

- **Landmarks:** Use `<nav>` tags with unique `aria-labels` (e.g., "Main",
  "Footer").
- **Keyboard Path:** Ensure a logical Tab order and visible focus states.
- **Skip Links:** Provide a "Skip to Content" link for keyboard users.
- **ARIA States:** Use `aria-expanded` and `aria-controls` for toggleable menus.

## Decision Rules

- **The 7-Link Rule:** Try to limit the primary navigation to 7 items or fewer
  to reduce cognitive load (Miller’s Law).
- **Predictability Over Innovation:** Use standard icons (hamburger for menu,
  magnifying glass for search) to ensure immediate recognition.
- **Visual Hierarchy:** The most important action (e.g., "Get Started") should
  be a styled button, not a text link.
- **Sticky vs. Static:** Use sticky headers only if users need frequent access
  to navigation while scrolling (e.g., long-form content or dashboards).

## Constraints

- **Accessibility:** Must be fully navigable by keyboard alone. Contrast for nav
  links must meet WCAG AA (4.5:1).
- **Responsiveness:** Navigation must never overflow the viewport horizontally.
- **Hierarchy:** Navigation should not compete with the page's H1 or Primary
  CTA.

## Common Failure Patterns

- **The "Mystery Meat" Navigation:** Using icons without labels that are not
  universally understood.
- **Overstuffed Header:** Trying to fit too many utility links, leading to
  clutter and misclicks.
- **Inaccessible Drawers:** Creating mobile menus that cannot be closed by
  keyboard or don't trap focus when open.
- **Lack of Feedback:** No visual change when a user is on the current page or
  hovering over a link.

## Validation Criteria

- [ ] Navigation is structured into clear tiers (Primary, Utility, Footer).
- [ ] Active states are visually distinct and accessible.
- [ ] Mobile navigation is functional and includes all primary links.
- [ ] Keyboard users can access all links and close menus using only the
      keyboard.
- [ ] Landmarks (`<nav>`) are correctly used and labeled.
- [ ] Touch targets on mobile meet the 44x44px minimum.
- [ ] "Skip to Content" link is present and functional.
