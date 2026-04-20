---
name: site-navigation-system
description:
  Design and implement intuitive, scalable, and accessible navigation
  structures. Use this skill when building a site's information architecture,
  defining header/footer hierarchies, or optimizing wayfinding for complex
  content.
---

# Site Navigation System

## Purpose

The Site Navigation System provides a framework for organizing content and
designing the pathways users take to move through a website. It ensures that
information is discoverable, the site's structure is understandable, and users
always know where they are and how to get back to key areas.

## Use Cases

- **Information Architecture Design:** Defining the hierarchy for a new website
  or restructuring an existing one.
- **Header & Footer Optimization:** Creating balanced, functional areas for
  primary, secondary, and utility links.
- **Mobile Navigation Strategy:** Adapting complex desktop menus into usable
  mobile patterns.
- **Wayfinding Implementation:** Adding breadcrumbs, "active" states, and
  sidebar navigation to guide users through deep content.

## When NOT to Use

- **Single-Page Landing Pages:** Where navigation is intentionally stripped to
  focus on a single conversion goal.
- **Small Micro-sites:** Sites with 3-5 pages where a simple, flat list of links
  suffices without a "system."
- **Full-Screen Apps:** Interactive tools (like a drawing app) where
  "navigation" is actually a tool palette rather than a content-discovery
  system.

## Inputs

1.  **Content Inventory:** A full list of pages and resources that need to be
    linked.
2.  **User Personas & Goals:** Understanding what the most important tasks are
    for different user types.
3.  **Site Map:** A high-level diagram showing the relationship between pages.
4.  **Device Breakpoints:** Knowledge of screen sizes where navigation patterns
    must shift (e.g., Desktop to Mobile).

## Outputs

1.  **Navigation Hierarchy:** Defined Primary, Secondary, and Utility navigation
    groups.
2.  **Interaction Patterns:** Specific UI choices (e.g., Mega-menu, Sidebar,
    Breadcrumbs).
3.  **Mobile Menu Spec:** A defined behavior for navigation on small screens.
4.  **Accessibility Map:** ARIA roles, landmark definitions, and keyboard
    interaction requirements.

## Workflow

### 1. Group and Categorize Content

Organize the content inventory into logical clusters. Use "Card Sorting"
principles to ensure groups make sense to users, not just the organization.

### 2. Define the Hierarchy

Assign each group or link to a level:

- **Primary:** Core product/service offerings (limit to 5–7 items).
- **Secondary:** Sub-categories or deeper content under primary items.
- **Utility:** Meta-actions like "Search," "Login," "Cart," or "Language."
- **Tertiary (Footer):** Legal, social, and low-traffic links.

### 3. Select Navigation Patterns

Choose patterns based on site density:

- **Mega-menus:** Best for large e-commerce or corporate sites with 15+
  sub-links.
- **Simple Dropdowns:** Best for 3–10 sub-links.
- **Sidebar Navigation:** Best for documentation or dashboard-style sites.

### 4. Design for Wayfinding

Implement visual cues to help users orient themselves:

- **Active States:** Visually highlight the current page in the menu.
- **Breadcrumbs:** Show the path from the home page for deep content.
- **"You Are Here" Indicators:** Use clear headings and sidebar highlights.

### 5. Adapt for Mobile

Define how the hierarchy collapses. Common approaches include:

- **The Hamburger Menu:** Hiding the full nav behind a button.
- **Priority+ Pattern:** Showing the most important 2-3 links and hiding the
  rest.
- **Tab Bars:** Persistent bottom navigation for 3-5 core mobile actions.

### 6. Document Accessibility

Ensure the system is usable for everyone:

- Use `<nav>` and `<ul>`/`<li>` for semantic structure.
- Define `aria-expanded` and `aria-haspopup` for dropdowns.
- Plan "Skip to Content" links to bypass navigation for keyboard users.

## Decision Rules

- **The Rule of 7:** Avoid more than 7 primary navigation items to minimize
  cognitive load.
- **Clarity over Cleverness:** Use standard labels (e.g., "Pricing" vs. "Our
  Investment Tiers").
- **Visual Distinction:** Utility actions (like "Sign Up") should look different
  from informational links (like "About Us").
- **Depth Limit:** Aim for a maximum of 3 levels of depth. If content is deeper,
  use a dedicated sidebar or local navigation.

## Constraints

- **Accessibility:** Must meet WCAG 2.1 AA standards for contrast and keyboard
  operability.
- **Touch Targets:** Mobile links must be at least 44x44px to prevent mis-taps.
- **Persistence:** On large sites, navigation should remain easily accessible
  (e.g., sticky headers or clear "back to top" links).
- **Hierarchy Consistency:** Navigation labels must match the page titles they
  link to.

## Common Failure Patterns

- **Mystery Meat:** Using icons without text labels for primary navigation.
- **The "Hover-Only" Trap:** Making dropdowns that only work on hover, making
  them inaccessible to touch devices or keyboard users.
- **Hidden Utility:** Burying search or login inside a mobile menu where they
  are hard to find.
- **Inconsistent Active States:** Forgetting to highlight the current page,
  leaving users feeling "lost."

## Validation Criteria

- [ ] Users can reach any core page in 3 clicks or less.
- [ ] Navigation remains usable and legible at all specified breakpoints.
- [ ] The current page is clearly identified in the navigation.
- [ ] Keyboard users can navigate all menu items without getting trapped.
- [ ] Labels are concise and accurately describe the destination content.
- [ ] All interactive elements (buttons/links) have a visible focus state.
