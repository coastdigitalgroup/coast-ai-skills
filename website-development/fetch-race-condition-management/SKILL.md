---
name: fetch-race-condition-management
description:
  Manage asynchronous data fetching to prevent out-of-order network responses
  from overwriting current UI state using AbortController and state-sync
  patterns.
---

# Fetch Race Condition Management

## Purpose

The Fetch Race Condition Management skill provides a technical protocol for
ensuring that the data displayed in the UI always matches the user's most recent
intent. In dynamic UIs, multiple network requests can be triggered in rapid
succession (e.g., during typing or filtering). If an earlier, slower request
completes *after* a later, faster one, it can overwrite the "correct" data with
stale information. This skill solves the "out-of-order response" problem.

## Use Cases

- **Search-as-you-type (Typeahead):** Preventing old search results from
  appearing after the user has refined their query.
- **Faceted Filtering:** Ensuring that clicking multiple filters quickly doesn't
  result in a "flicker" or incorrect results if requests return out of order.
- **Tabbed Dashboards:** Managing data fetching when users switch tabs rapidly.
- **Form Auto-save:** Handling multiple save requests to ensure the final
  server state matches the user's last edit.

## When NOT to Use

- **Static Content:** Where data is fetched only once on page load.
- **Critical Sequential Transactions:** Where every request must be processed
  and confirmed by the server (e.g., a checkout flow where "Place Order" should
  only be clickable once).
- **Polling with Stable State:** If each poll simply updates a global dashboard
  and order doesn't matter (though order usually matters).

## Inputs

1. **Trigger Event:** The user action that initiates a fetch (input, click, scroll).
2. **Request Lifecycle:** The asynchronous function or API call.
3. **State Target:** The UI element or data store that receives the result.
4. **Environment:** Modern browsers supporting `AbortController`.

## Outputs

1. **Race-Safe Fetch Logic:** Implementation using `AbortController` to cancel
   obsolete requests.
2. **State-Sync Guard:** Logic to verify if a response still "belongs" to the
   current UI state before updating.
3. **Error Handling:** Robust handling of `AbortError` to prevent console noise
   or broken UI states.

## Workflow

### 1. Initialize the Controller

Before starting a new fetch, check for an existing `AbortController` and abort
the previous request. Then, create a new one for the current request.

```javascript
let currentController = null;

async function fetchData(query) {
  if (currentController) {
    currentController.abort(); // Cancel the previous request
  }
  currentController = new AbortController();
  const { signal } = currentController;

  // Proceed to step 2...
}
```

### 2. Pass the Signal to Fetch

Pass the `signal` from the controller into the `fetch` options. The browser
will now monitor this signal and terminate the network request if `abort()` is
called.

```javascript
try {
  const response = await fetch(`/api/search?q=${query}`, { signal });
  const data = await response.json();
  // Proceed to step 3...
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Fetch aborted');
  } else {
    // Handle actual errors
  }
}
```

### 3. Implement the "Last-Write-Wins" Guard

Even if a request isn't aborted (or if using an API that doesn't support
aborting), verify that the response still matches the current "active" query
before updating the UI.

- Store a "Current ID" or "Timestamp" when the request starts.
- Compare the response's ID/Timestamp with the stored one.
- Only update the UI if they match.

### 4. Provide Visual Feedback

During the race-condition window, use loading states (see
`skeleton-screen-implementation`) to indicate that the UI is in transition and
the data being seen may soon change.

## Decision Rules

- **Abort vs. Ignore:**
  - **Use Abort:** For heavy requests (large payloads) or when using native
    `fetch`. It saves bandwidth and client-side processing.
  - **Use Ignore (State-Sync):** When the underlying API doesn't support
    cancellation (e.g., some older libraries) or for very small, fast requests
    where the overhead of a controller is unnecessary.
- **Global vs. Local Controller:**
  - Use a **Global** (or module-scoped) controller for singleton actions like
    "Main Search."
  - Use **Local** controllers (stored in a Map or specific component state) for
    multi-instance items like individual "Follow" buttons in a list.

## Constraints

- **One Controller per Flow:** Ensure you aren't accidentally aborting unrelated
  requests by sharing the same controller instance across different features.
- **AbortError is an Error:** `fetch` rejects the promise when aborted. You
  MUST catch this to avoid `Uncaught (in promise)` errors in the console.
- **Server Side:** Aborting a fetch on the client stops the browser from
  waiting, but the server may still complete the processing of the request.

## Non-Goals

- Implementing debounce/throttle (though often used together, see `interaction-performance-optimization`).
- Handling general network failures or 404/500 errors.
- Building a full state management library.

## Common Failure Patterns

- **Ghost Data:** Failing to abort or guard, causing results for "A" to appear
  briefly after results for "AB" were already shown.
- **Memory Leaks:** Creating new `AbortController` instances but never clearing
  the reference to the previous one.
- **Silent Failures:** Catching all errors in the `try/catch` block and failing
  to differentiate between a cancelled request and a real network error.
- **Uncaught AbortError:** Not providing a `catch` block, leading to browser
  console errors every time a user types quickly.

## Validation Criteria

- [ ] **Network Tab Check:** Open the Network tab in DevTools. Type rapidly in
      the search box and verify that previous requests are marked as
      `(canceled)`.
- [ ] **Console Audit:** Verify that no `Uncaught (in promise) AbortError`
      messages appear in the console during rapid interactions.
- [ ] **High Latency Test:** Use "Slow 3G" throttling. Trigger request A, then
      immediately trigger request B. Verify that Request A's data never appears
      in the UI.
- [ ] **State Integrity Check:** Verify that the UI always displays the data
      corresponding to the value currently in the input field.
