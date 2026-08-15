---
name: focus-management-client-side-navigation
description:
  Implement and debug focus management and route announcements in Single Page
  Applications (SPAs) to ensure accessible and predictable page transitions.
---

# Focus Management for Client-Side Navigation

## Purpose

The Focus Management for Client-Side Navigation skill provides a technical
protocol for handling page transitions in applications where the browser does
not perform a full page reload (SPAs). It solves the "silent navigation" problem
where screen readers are unaware of content changes and the "lost focus" problem
where a user's keyboard focus remains on a link that may no longer exist or is
trapped at the bottom of the page.

## Use Cases

- Implementing accessible routing in frameworks like React, Vue, Svelte, or
  Vanilla JS SPAs.
- Handling dynamic content updates that replace the "main" content area of a
  site.
- Building custom "Next/Previous" step-based flows that update the URL without
  reloading.
- Auditing existing SPAs for accessibility violations related to focus order
  and navigation announcements.

## When NOT to Use

- **Multi-Page Applications (MPAs):** Standard websites where clicking a link
  triggers a full browser reload do not need this; the browser handles focus
  reset and page announcement natively.
- **In-Page Fragments:** Simple "Jump to Section" links on the same page
  (handled by standard anchor behavior).
- **Tooltips or Modals:** Use `accessible-modal-dialog` or
  `accessible-tooltip-implementation` for localized UI overlays.

## Inputs

1. **Route Change Event:** A trigger indicating the URL or primary view has
   changed.
2. **New Page Title:** The semantic title of the destination view.
3. **Focus Target:** The element that should receive focus after the transition
   (usually the main `<h1>` or a content wrapper).
4. **Previous Focus:** The element that triggered the navigation (to ensure it
   doesn't "leak" focus).

## Outputs

1. **Updated Document Title:** Modification of `document.title` to reflect the
   new view.
2. **Route Announcement:** A text string pushed to an `aria-live` region (e.g.,
   "Navigated to [Page Title]").
3. **Programmatic Focus Reset:** Successful movement of focus to the top of the
   new content.
4. **Scroll Restoration:** Resetting the viewport to the top (or a specific
   saved position).

## Workflow

### 1. Update the Document Title
Immediately upon route change, update `document.title`. This is the first piece
of information many users rely on to confirm where they are.

### 2. Trigger the Route Announcer
Update the content of a persistent, visually hidden `aria-live="polite"` region.
This ensures screen reader users hear "Navigated to [Page Name]" or simply the
new page title, mimicking the behavior of a native browser page load.

### 3. Reset the Viewport
Unless implementing specific "scroll restoration" logic (e.g., returning to a
list position), scroll the window to the top (`window.scrollTo(0, 0)`).

### 4. Move Programmatic Focus
Identify a logical starting point for the new view—typically the primary `<h1>`.
- **Target Preparation:** Ensure the target has `tabindex="-1"` so it can
  receive programmatic focus without being in the natural tab order.
- **Focus Execution:** Call `.focus()` on the target.
- **Visual Cleanup:** Use CSS to hide the focus ring on the reset target if
  it's not an interactive element, but ensure interactive elements still show
  focus.

### 5. Verify Content Visibility
Ensure that the element receiving focus is not hidden or obscured by a sticky
header (use `scroll-margin-top` if necessary).

## Decision Rules

- **What to Focus?**
  - **Option A (Preferred):** The `<h1>` element. This provides the most
    context as it announces the page heading immediately.
  - **Option B (Fallback):** The main content container (`<main>` or a wrapper).
    Use this if the H1 is not immediately available or if the page content
    varies significantly.
- **Polite vs. Assertive Announcement:**
  - Always use `aria-live="polite"`. Using `assertive` may cut off important
    contextual information the screen reader was currently processing.
- **Manual vs. Automated:**
  - In frameworks (like Next.js or Nuxt), check if the router handles this
    automatically. If not, implement a global "Navigation Watcher" rather than
    manual code in every view.

## Constraints

- **Single Announcer:** There should only be one `aria-live` announcer for
  navigation to avoid "chatter."
- **Visible Content:** Never move focus to an element that is `display: none`
  or `visibility: hidden`.
- **Timing:** The focus move and announcement must happen *after* the new DOM
  content has been rendered. Use `requestAnimationFrame` or a small timeout if
  the framework's render cycle is asynchronous.

## Non-Goals

- Handling complex data-fetching or API loading states (see
  `skeleton-screen-implementation`).
- Managing browser history (pushState/replaceState) logic.
- Implementing "Breadcrumbs" (see `breadcrumb-wayfinding-system`).

## Common Failure Patterns

- **The "Silent Change":** The URL changes and the content swaps, but a screen
  reader user has no idea anything happened because focus stayed on the old
  link or moved to the `body`.
- **Focusing the Footer:** When the link that was clicked is removed from the
  DOM, many browsers reset focus to the `body` or the very first element in the
  footer, forcing the user to tab through the whole page again.
- **Ignoring Scroll Position:** Leaving the user at the bottom of the page
  (where they clicked "Next") when the new content is at the top.
- **Missing `tabindex="-1"`:** Trying to focus a `<div>` or `<h1>` without
  setting `tabindex`, which fails in most browsers.
- **Duplicate Announcements:** The screen reader announcing the page title twice
  because both the `aria-live` region and the focused `<h1>` fired.

## Validation Criteria

- [ ] **Screen Reader Test:** Navigate to a new route. Does the screen reader
      announce the change? Does it start reading from the top of the new content?
- [ ] **Keyboard Test:** After navigating, press `Tab`. Does focus move to the
      first interactive element *inside* the new page, rather than back to the
      header or skip link?
- [ ] **Document Title Check:** Does the browser tab show the correct title
      immediately after the transition?
- [ ] **Scroll Check:** Does the page always jump to the top on navigation
      (unless specific restoration is intended)?
- [ ] **Tabindex Audit:** Inspect the DOM. Does the focus target have
      `tabindex="-1"`?
