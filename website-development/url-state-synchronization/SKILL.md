---
name: url-state-synchronization
description:
  Synchronize UI state with URL parameters using the History API and
  URLSearchParams to ensure shareable, deep-linkable, and resilient user
  experiences.
---

# URL State Synchronization

## Purpose

The URL State Synchronization skill provides a technical protocol for linking the
frontend UI state (filters, search queries, pagination, tab selection) directly
to the URL. This ensures that the application state is "shareable" (a user can
copy the URL and send it to someone else) and "resilient" (the state survives a
page refresh), which is critical for high-intent user journeys like search and
discovery.

## Use Cases

- **Search and Filter Interfaces:** Syncing active filters, sort orders, and
  search queries to the URL.
- **Paginated Lists:** Ensuring the current page index is reflected in the URL
  (e.g., `?page=3`).
- **Tabbed Content:** Deep-linking to specific tabs within a page (e.g.,
  `#specifications`).
- **Multi-Step Configurations:** Persisting partial selections in a complex
  product configurator or wizard.
- **Dashboards:** Storing date ranges or view toggles in the URL for consistent
  reporting.

## When NOT to Use

- **Sensitive Data:** Never store PII (Personally Identifiable Information),
  passwords, or session tokens in URL parameters.
- **Transient UI States:** Temporary states like "is menu open" or "hovered
  element" usually don't belong in the URL.
- **Large Data Payloads:** URL length is limited (approx. 2,000 characters). Do
  not try to store large JSON blobs or complex objects in the URL.
- **Non-Shareable States:** States that are unique to a user's session and would
  be invalid for another user (e.g., local draft state).

## Inputs

1. **State Schema:** A mapping of UI state variables to URL parameter keys (e.g.,
   `categoryFilter` -> `cat`).
2. **Persistence Strategy:** Decision on whether to use `pushState` (creates history
   entry) or `replaceState` (updates current entry).
3. **Trigger Events:** The user interactions that should trigger a URL update
   (e.g., `change`, `input` with debounce, `click`).

## Outputs

1. **State Synchronizer:** A utility or component logic that handles the
   bidirectional flow between UI state and URL.
2. **Initial State Loader:** Logic that parses the URL on page load to
   initialize the UI.
3. **History Navigation Handler:** A listener for the `popstate` event to update
   the UI when the user uses the browser's Back/Forward buttons.

## Workflow

### 1. Define the State Mapping

Establish which UI properties need to be persisted and their corresponding keys
in the URL.
- *Tip:* Use short, descriptive keys for cleaner URLs (e.g., `q` instead of
  `searchQuery`).

### 2. Parse URL on Initialization

When the component or page loads, read the `window.location.search` using
`URLSearchParams`.
- Cast strings back to their expected types (e.g., `"true"` -> `true`, `"3"` -> `3`).
- Provide default values if parameters are missing.

### 3. Implement the Update Logic

When the UI state changes:
- Create a new `URLSearchParams` object from the current location.
- Update/Delete keys based on the new state.
- If a value matches the default (e.g., `page=1`), remove it from the URL to
  keep it clean.

### 4. Choose the History Method

- **`history.pushState()`:** Use this when the change feels like a "new page"
  to the user (e.g., clicking a new tab or changing a major filter).
- **`history.replaceState()`:** Use this for incremental updates where you
  don't want to bloat the user's back button history (e.g., typing in a search
  box).

### 5. Listen for History Changes

Add a listener for the `popstate` event. This event fires when the user clicks
the Back or Forward button.
- Re-parse the URL and update the UI state to match the new parameters.

## Decision Rules

- **Push vs. Replace:** If a user clicks "Back," should they go back to the
  previous filter state? If YES, use `pushState`. If NO (e.g., it was just a
  minor refinement), use `replaceState`.
- **Debouncing:** When syncing "Type-as-you-search" inputs, always debounce the
  URL update (e.g., 300ms) to avoid overwhelming the history stack and causing
  performance lag.
- **Hash vs. Search Params:** Use `?search=params` for data-driven states. Use
  `#hash` for purely navigational jumps to specific scroll positions.

## Constraints

- **Type Safety:** `URLSearchParams` always returns strings. Ensure proper
  parsing for booleans, numbers, and arrays.
- **URL Length:** Stay under 2,000 characters to ensure compatibility with all
  browsers and proxies.
- **Performance:** Avoid updating the URL on every single keystroke; use
  debouncing.

## Non-Goals

- Managing backend routing or server-side rendering (SSR) logic.
- Building a full state management library (like Redux).
- Handling form submissions (though the state can be used to populate forms).

## Common Failure Patterns

- **History Bloat:** Using `pushState` for every character typed in a search box,
  making the "Back" button useless.
- **The "Stale State" Bug:** Forgetting to listen to `popstate`, so the URL
  changes when the user clicks "Back," but the UI doesn't update.
- **Double Syncing:** Triggering a URL update when the state changes, which
  re-triggers a state change, creating an infinite loop.
- **Type Mismatches:** Treating `?page=1` as the number `1` without parsing,
  leading to errors in calculations like `page + 1` (resulting in `"11"`).
- **Missing Defaults:** Not handling the case where the URL is empty, leading
  to `null` or `undefined` states.

## Validation Criteria

- [ ] **Refresh Test:** Apply a filter, refresh the page, and verify the filter
      is still active and the UI matches.
- [ ] **Back/Forward Test:** Change a state, click the browser's "Back" button,
      and verify the UI reverts correctly.
- [ ] **Sharing Test:** Copy the URL, open it in a private/incognito window,
      and verify the state is correctly restored.
- [ ] **Clean URL Test:** Verify that default values (like Page 1) are removed
      from the URL to keep it concise.
- [ ] **Performance Audit:** Verify that "Type-as-you-search" updates are
      debounced and don't cause main-thread jank.
