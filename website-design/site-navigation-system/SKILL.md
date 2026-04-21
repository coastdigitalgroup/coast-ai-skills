---
name: site-navigation-system
description:
  Design and structure site-wide navigation that is intuitive, accessible, and
  responsive across all devices. Trigger this skill when building site
  architectures, headers, footers, or mobile-specific navigation patterns.
---

# Site Navigation System

## Purpose

The Site Navigation System provides a framework for organizing and presenting
the paths through a website. It ensures that users can find what they need,
understand their current location within the site hierarchy, and move between
sections with minimal friction, regardless of their device or assistive
technology.

## Use Cases

- Designing the information architecture for a multi-page website.
- Defining responsive behaviors for complex headers (e.g., transitioning from
  Desktop Mega-Menus to Mobile Drawers).
- Organizing "Utility" actions (Login, Search, Cart) vs. "Primary" navigation.
- Establishing footer structures that serve as a "safety net" for lost users.

## When NOT to Use

- **Single-Page Apps/Landers:** Where navigation only involves scrolling to
  sections on a single page (though a simplified version still applies).
- **Immersive/Experimental Art:** Where the goal is discovery through non-linear
  or hidden paths rather than efficiency.
- **Kiosk/Single-Function Interfaces:** Where only one path or action is
  available to the user.

## Inputs

To design a navigation system, you need:

1.  **Sitemap/Content Inventory:** A list of all pages and their hierarchical
    relationships.
2.  **User Goals:** What are the top 3-5 things a user comes to this site to do?
3.  **Device Constraints:** Target breakpoints and touch vs. pointer
    considerations.
4.  **Brand Guidelines:** Typography and color requirements for active, hover,
    and focus states.

## Outputs

1.  **Navigation Hierarchy:** A defined structure for Global (Primary), Local
    (Secondary), Utility, and Footer navigation.
2.  **Responsive Strategy:** Logic for how navigation adapts from Desktop to
    Mobile (e.g., Hamburger, Tab Bar, or Priority+).
3.  **State Definition:** Visual rules for how links behave when hovered,
    focused, or representing the "Current Page."

## Workflow

### 1. Categorize Navigation Tiers

Organize your content into functional groups:

- **Global Navigation:** The most important pages (Hiring, Services, About).
- **Utility Navigation:** Task-oriented links (Login, Search, Cart, Language).
- **Local Navigation:** Contextual links for the current section (e.g., a
  sidebar for documentation).
- **Footer Navigation:** Comprehensive site map, legal links, and social icons.

### 2. Select a Responsive Pattern

Choose how the navigation behaves as the viewport shrinks:

- **The Hamburger (Drawer):** Good for sites with many links (5+).
- **The Tab Bar:** Best for mobile-first apps with 3-5 high-frequency actions.
- **Priority+:** Shows the most important links and hides the rest under a
  "More" menu.

### 3. Design for Wayfinding

Ensure users never feel lost:

- **Active States:** Visually distinguish the link for the current page.
- **Breadcrumbs:** Provide a secondary path for deep hierarchies (3+ levels).
- **Clear Labels:** Use descriptive, short text (e.g., "Pricing" instead of "See
  what it costs").

### 4. Apply Interaction Rules

Define how navigation elements react:

- **Hover/Focus:** High-contrast changes for pointer and keyboard users.
- **Dropdowns:** Decide between "Click to Open" (more accessible/predictable)
  vs. "Hover to Open" (faster but prone to errors).

### 5. Structure the Footer

Treat the footer as a "safety net":

- Group links logically under headers.
- Include a "Back to Top" link for long-scroll pages.
- Place mandatory legal/copyright info at the very bottom.

## Decision Rules

- **The 7-Item Limit:** Try to keep primary navigation to 7 items or fewer to
  prevent cognitive overload.
- **Primary vs. Utility:** If a link is an "Action" (Login, Buy), give it a
  distinct visual weight (e.g., a button) compared to "Info" links.
- **Touch Target Size:** Ensure all navigation links on mobile are at least
  44x44px.
- **Sticky vs. Static:** Use sticky headers if the page is long and users need
  constant access to navigation; otherwise, keep it static to save screen real
  estate.

## Constraints

- **Accessibility (WCAG):** Use semantic `<nav>` elements, `aria-label` for
  context, and ensure `aria-expanded` states are updated for menus.
- **Responsive Width:** Navigation must not "break" or wrap awkwardly at
  "in-between" tablet widths (768px - 1024px).
- **Z-Index:** Navigation menus must always appear above all other content,
  including modals or sticky banners.

## Common Failure Patterns

- **Mystery Meat Navigation:** Using icons without labels that users don't
  understand.
- **Hidden Current State:** Forgetting to show the user which page they are
  actually on.
- **The "Hover Trap":** Using hover-based menus that are impossible to navigate
  via keyboard or difficult to use on touch screens.
- **Vertical Overload:** Mobile menus that are so long they require scrolling
  _within_ the menu, making it hard to find the "Close" button.

## Validation Criteria

- [ ] Users can reach any page in the primary sitemap in 3 clicks or fewer.
- [ ] The "Current Page" is visually distinct in the navigation.
- [ ] Keyboard users can `Tab` through all links in a logical order.
- [ ] Mobile navigation is usable with one hand (thumb-friendly).
- [ ] The header does not obscure important content on scroll (if sticky).
- [ ] Semantic HTML (`<nav>`, `<ul>`, `<li>`) is used for structure.
