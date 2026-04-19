# Wayfinding Patterns & Navigation Structure

Wayfinding is the process of using spatial and environmental cues to navigate a
physical or digital space. In website design, effective wayfinding ensures users
can answer three questions: "Where am I?", "Where can I go?", and "How do I get
back?".

## 1. Common Navigation Patterns

### Global Navigation (Primary)

The main menu that appears on every page of the site.

- **Top Bar:** Best for sites with 5-7 main categories.
- **Mega-menu:** Best for large e-commerce or content sites with many
  sub-categories.
- **Sidebar:** Often used for dashboards or documentation where vertical space
  is less critical than horizontal density.

### Local Navigation (Secondary)

Navigation within a specific section of the site.

- **Tab Bar:** Useful for switching between related views.
- **Sub-menu:** A secondary list of links often appearing below the primary
  header or in a sidebar.

### Contextual Navigation

Links that appear within the body of a page.

- **"Related Posts":** Found at the end of articles.
- **"See Also":** In documentation or product pages.
- **In-text links:** Hyperlinks within paragraphs.

### Utility Navigation

Functional links that aren't part of the core content hierarchy.

- **Login/Account**
- **Cart/Checkout**
- **Search Bar**
- **Language Switcher**

---

## 2. Accessibility Requirements

### ARIA Landmarks

Use semantic HTML and ARIA roles to help screen readers identify navigation
blocks.

- Wrap navigation in `<nav aria-label="Main">`.
- Use `aria-current="page"` for the link corresponding to the current page.
- Use `aria-expanded="true/false"` for dropdowns or mobile menus.

### Keyboard Interaction

- **Tab Order:** Navigation must follow the visual order of elements.
- **Visible Focus:** Never remove the outline from focused links unless you
  provide a clear alternative style.
- **Escape Key:** Pressing `Esc` should close open menus or dropdowns.

### Skip Links

Every site should have a "Skip to Main Content" link that is:

1. The first focusable element in the DOM.
2. Hidden visually until it receives focus.
3. Linked to an ID on the main content area (e.g., `<a href="#main-content">`).

---

## 3. Structural Best Practices

| Pattern                    | Description                                           | Best For...                                                |
| :------------------------- | :---------------------------------------------------- | :--------------------------------------------------------- |
| **Breadcrumbs**            | Horizontal trail of links showing hierarchy.          | Deeply nested sites (e.g., E-commerce).                    |
| **Fat Footer**             | Extensive footer containing a full site map.          | Users who scroll to the bottom looking for a "safety net." |
| **Pagination**             | Numbered links for browsing large sets of data.       | Blog archives, search results.                             |
| **Infinite Scroll**        | Content loads as the user scrolls.                    | Social media feeds (use with caution for accessibility).   |
| **Progressive Disclosure** | Showing only high-priority items and hiding the rest. | Mobile menus or complex dashboards.                        |
