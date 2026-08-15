---
name: accessible-pagination-implementation
description:
  Implement and debug accessible pagination for static and AJAX-driven content,
  ensuring correct ARIA state and focus management.
---

# Accessible Pagination Implementation

## Purpose

The Accessible Pagination Implementation skill provides a technical protocol for
building and debugging pagination controls that are usable by all users. It
focuses on semantic landmarks, ARIA state management (specifically
`aria-current`), and the critical focus management required when page content
updates dynamically via AJAX.

## Use Cases

- Building standard link-based pagination for multi-page articles or archives.
- Implementing AJAX-driven pagination for search results or product grids.
- Fixing "focus loss" issues where a user is dropped to the top of the `<body>`
  after clicking a "Next" button.
- Auditing existing pagination systems for WCAG compliance.

## When NOT to Use

- **Infinite Scroll:** If content loads automatically as the user scrolls, use
  `infinite-scroll-implementation` instead.
- **Small Datasets (<12 items):** If all content fits comfortably on one page,
  pagination adds unnecessary friction.
- **Step-by-Step Wizards:** For linear progress through a form, use
  `multi-step-form-implementation`.

## Inputs

1. **Total Page Count:** The total number of available pages.
2. **Current Page Index:** The page currently being viewed.
3. **Data Retrieval Method:** Is it a full page reload (Static) or a partial
   DOM update (AJAX)?
4. **Target Container:** The element that will be updated with new content.

## Outputs

1. **Semantic HTML:** A structure using `<nav>`, `<ul>`, and appropriate
   triggers (`<a>` for static, `<button>` for AJAX).
2. **ARIA State Management:** Proper use of `aria-label`, `aria-current`, and
   `aria-disabled`.
3. **Focus Management Protocol:** Scripted logic to move focus to the new
   content or a status message after an update.
4. **Live Region Updates:** Feedback for screen reader users when content
   changes dynamically.

## Workflow

### 1. Establish Semantic Landmarks

- Wrap the pagination in a `<nav>` element.
- Provide a unique `aria-label` (e.g., `aria-label="Pagination Navigation"`) to
  distinguish it from main site navigation.
- Use a `<ul>` and `<li>` structure to ensure screen readers announce the
  number of page items.

### 2. Configure Interactive Elements

- **Static (Page Reload):** Use `<a>` tags with valid `href` values.
- **Dynamic (AJAX):** Use `<button>` tags. Avoid using `<a>` with `href="#"` or
  `href="javascript:void(0)"`.
- **Labels:** Use descriptive labels for "Previous" and "Next" buttons, or add
  `aria-label` to page numbers (e.g., `aria-label="Go to page 3"`).

### 3. Manage Current State

- Apply `aria-current="page"` to the link or button representing the active
  page.
- Remove `aria-current` from all other items.
- Visually distinguish the current page (e.g., bold or high-contrast background)
  but do not rely on color alone.

### 4. Implement Focus Management (AJAX only)

- When a new page is loaded via AJAX, focus must not be lost.
- **Option A (Container):** Move focus to the top of the newly updated content
  container. Ensure the container has `tabindex="-1"` to make it programmatically
  focusable.
- **Option B (Status):** Move focus to an `aria-live` status message (e.g.,
  "Showing page 2 of 10") then allow the user to navigate into the content.

### 5. Handle Disabled States

- Visually and programmatically disable the "Previous" button on Page 1 and the
  "Next" button on the Last Page.
- For buttons, use the `disabled` attribute. For links, use `aria-disabled="true"`
  and remove the `href`.

## Decision Rules

- **Link vs. Button:** Use **Links** if the page URL changes (SEO-friendly).
  Use **Buttons** if the update is strictly client-side without a URL change
  (e.g., complex dashboard filters).
- **Truncation:** If there are more than 7 pages, show the first, last, current,
  and neighbors (e.g., `1 ... 4 5 6 ... 20`).
- **Scroll Position:** On AJAX updates, always scroll the user back to the top
  of the content area to provide a consistent mental model.

## Constraints

- **Touch Targets:** All pagination items must be at least 44x44px.
- **Contrast:** Page numbers and active states must meet WCAG AA (4.5:1).
- **No Invisible Focus:** Custom focus styles must be clear and high-contrast.

## Non-Goals

- Implementing the backend API for data fetching.
- Styling the pagination components (beyond accessibility requirements).
- Handling "Infinite Scroll" behavior.

## Common Failure Patterns

- **Focus Loss:** Clicking "Next" and the screen reader goes back to the very
  top of the page or the browser loses track of the focus entirely.
- **Vague Labels:** Screen reader users hearing "Link 1, Link 2, Link 3" without
  knowing these are page numbers.
- **Missing `aria-current`:** Users not knowing which page they are currently on
  when using assistive technology.
- **Tabindex Abuse:** Using positive `tabindex` values, which breaks the
  natural reading order of the page.
- **Keyboard Traps:** Forcing the user to tab through every single page number
  (1 to 50) without truncation.

## Validation Criteria

- [ ] **Keyboard Test:** Navigate the pagination bar using only `Tab` and `Enter/Space`.
- [ ] **Screen Reader Test:** Verify that `aria-current="page"` is announced and that
      "Previous/Next" have descriptive labels.
- [ ] **Focus Audit (AJAX):** Confirm that focus moves to the new content or a
      status message after a dynamic update.
- [ ] **Touch Test:** Verify tap targets on mobile are at least 44x44px.
- [ ] **Automated Check:** Run Axe or Lighthouse to confirm landmark and ARIA
      compliance.
