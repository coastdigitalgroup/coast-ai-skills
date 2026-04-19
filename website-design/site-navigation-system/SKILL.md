---
name: site-navigation-system
description:
  Design and implement responsive information architecture, header/footer
  hierarchies, and accessible wayfinding patterns. Trigger this skill when asked
  to structure a site's menu, organize page relationships, or improve user
  orientation across a website.
---

# Site Navigation System

## Purpose

The Site Navigation System skill provides a framework for designing and
organizing how users move through a website. It ensures that the information
architecture is logical, the navigation UI is consistent and responsive, and
users always know where they are, where they can go, and how to get back.

## Use Cases

- Designing the primary header and footer for a new multi-page website.
- Restructuring a site's menu to improve discoverability of key pages.
- Implementing "wayfinding" elements like breadcrumbs, pagination, or related
  links.
- Optimizing navigation for mobile users (e.g., hamburger menus, tab bars).

## When NOT to Use

- **Single-Page Applications (SPAs) with minimal state:** If there is only one
  "view" and no deep linking required.
- **Micro-sites or Landing Pages:** Where the goal is a single conversion path
  with no external links (though a "back to top" or "skip" link might still be
  needed).
- **Immersive Experiences:** Where traditional navigation is intentionally
  subverted for storytelling or art (e.g., parallax horizontal scrolling sites).

## Inputs

To design a site navigation system, you need:

1.  **Sitemap / Content Inventory:** A list of all pages and their hierarchical
    relationships (Parent > Child).
2.  **User Personas & Goals:** What are the most common tasks users need to
    perform?
3.  **Technical Constraints:** Does the CMS support mega-menus? Is there a
    requirement for multi-level nesting?
4.  **Priority Categories:** Which pages belong in the Primary Nav vs. Utility
    Nav vs. Footer?

## Outputs

1.  **Navigation Blueprint:** A structural map of the Header, Footer, and any
    contextual navigation.
2.  **Responsive Behavior Spec:** Documentation of how navigation changes from
    Desktop (e.g., horizontal list) to Mobile (e.g., slide-out drawer).
3.  **Accessibility Map:** ARIA roles, landmarks, and focus management rules for
    the navigation components.

## Workflow

### 1. Group and Prioritize Content

Categorize pages into logical groups. Use "Card Sorting" techniques if the site
structure is complex.

- **Primary:** Top-level links for the majority of users (Products, Services,
  About).
- **Utility:** Functional links (Search, Account, Cart, Language).
- **Secondary/Contextual:** Links relevant to a specific section
  (Sub-navigation).
- **Footer:** Legal links, site map, social media, and "safety net" navigation.

### 2. Define the Header Hierarchy

Determine the placement of elements based on visual weight:

- Place the **Logo** in a standard location (Top Left or Center) for
  orientation.
- Keep **Primary Nav** links prominent and limited (usually 5-7 items max).
- Group **Utility Nav** items (Search, Cart) together, typically in the Top
  Right.

### 3. Design for Wayfinding

Ensure users never feel "lost" by providing orientation cues:

- **Active States:** Clearly highlight the current page in the menu.
- **Breadcrumbs:** Provide a trail for deep hierarchies (e.g., Home > Products >
  Electronics > Laptops).
- **Page Headers:** The `<h1>` should match the navigation label used to reach
  the page.

### 4. Establish Responsive Patterns

Define how the navigation adapts to screen sizes:

- **Desktop:** Horizontal list or Mega-menu.
- **Mobile:** Hamburger menu, Bottom Tab Bar, or Progressive Disclosure (Show 3
  links + "More").
- **Focus Management:** Ensure the mobile menu toggle handles keyboard focus
  correctly when opened/closed.

### 5. Structure the Footer

Use the footer as a secondary wayfinding tool:

- Group links into columns with clear headings.
- Include a "Back to Top" link for long-scrolling pages.
- Place low-priority but necessary links (Privacy Policy, Terms) here.

## Decision Rules

- **The 7-Item Rule:** Keep primary navigation categories to 7 or fewer to avoid
  cognitive overload.
- **Predictability over Novelty:** Use standard icons (hamburger for menu,
  magnifying glass for search) and locations.
- **Depth vs. Breadth:** Favor a "shallow and broad" hierarchy over "deep and
  narrow" to reduce the number of clicks needed.
- **Accessibility Landmarks:** Always wrap the main menu in a `<nav>` element
  with an appropriate `aria-label` (e.g., `aria-label="Main Navigation"`).

## Constraints

- **Accessibility:** Must include a "Skip to Main Content" link as the first
  focusable element. Navigation must be fully keyboard accessible (Tab, Enter,
  Space, Esc).
- **Responsiveness:** Navigation must be usable on the smallest supported
  viewport (320px) without content overlap.
- **Performance:** Avoid excessively large mega-menus that load hundreds of
  links at once; consider lazy-loading or architectural simplification.

## Common Failure Patterns

- **The "Mystery Meat" Navigation:** Using icons without labels that users don't
  understand.
- **Mobile-Only Thinking:** Hiding important utility links (like "Contact")
  inside a hamburger menu on Desktop.
- **Broken Wayfinding:** User clicks "Services" but the page heading says "Our
  Work," creating confusion.
- **Lack of Focus Styles:** Keyboard users cannot see which menu item they have
  selected.

## Validation Criteria

- [ ] Every page on the site is reachable within 3 clicks from the homepage.
- [ ] The "Active" state is visually distinct and programmatically declared
      (`aria-current="page"`).
- [ ] Navigation is fully operable using only a keyboard.
- [ ] A "Skip to Main Content" link is present and functional.
- [ ] The navigation structure remains logical and legible on mobile devices.
