# Optimistic UI Technical Reference & Edge Cases

This reference provides technical guidance on handling complex state reconciliation, race conditions, idempotency headers, action queues, and edge case failures when building optimistic UI workflows on the web.

---

## 1. Temporary Client IDs vs. Canonical Server IDs

When creating records optimistically (e.g. posting a comment or adding a item to a list), the client must assign a temporary client ID to render the DOM element immediately.

```javascript
// Unique client temporary identifier
const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
```

### Server Response Reconciliation Strategy

1. **DOM Data Attribute Tagging:** Tag the temporary DOM element with `data-temp-id="${tempId}"` and `data-status="pending"`.
2. **Prevent Secondary Actions:** While `data-status="pending"` is active, block secondary mutations on that specific item (e.g., editing or replying to a pending comment) until the canonical server ID replaces the temporary client ID.
3. **Seamless Replacement:** When the server returns `{ id: "server_98765", timestamp: 1718000000 }`, update the element's dataset:

```javascript
function reconcileElementId(element, serverData) {
  element.dataset.id = serverData.id;
  delete element.dataset.tempId;
  delete element.dataset.status;
}
```

---

## 2. Idempotency Tokens (`X-Idempotency-Key`)

In optimistic UI workflows, network errors or user retries can cause duplicate request submissions. To guarantee that a retried request does not execute multiple side effects on the server database:

```javascript
// Attach idempotency header to all optimistic POST/PUT/DELETE requests
fetch('/api/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Idempotency-Key': `opt_key_${itemId}_${actionTimestamp}`
  },
  body: JSON.stringify(payload)
});
```

- **Server Behavior:** The server caches response status per `X-Idempotency-Key`. Retried requests with the same key return the original cached response without re-executing database writes.

---

## 3. Concurrency & Race Condition Control

Rapid user interactions (e.g. clicking a favorite button 5 times in succession) create race conditions if HTTP responses arrive out of order.

### Strategy A: Request Abort with `AbortController` (Preferred for Binary Toggles)

Cancel prior in-flight requests when a new action occurs on the same key:

```javascript
let currentController = null;

function handleToggleClick() {
  if (currentController) {
    currentController.abort(); // Cancel earlier request
  }
  currentController = new AbortController();

  fetch('/api/toggle', { signal: currentController.signal })
    .catch((err) => {
      if (err.name === 'AbortError') return; // Ignore canceled fetch
      // Handle actual error & rollback
    });
}
```

### Strategy B: Action Queue / Last-Write-Wins (Preferred for Drag-and-Drop or Reordering)

Maintain a serial action queue for complex state changes. Process actions sequentially and only perform a rollback if the queue fails on its final attempt.

---

## 4. Error Rollback & Retry Heuristics

| Failure Category | HTTP Status | Rollback Behavior | Retry Strategy |
| :--- | :--- | :--- | :--- |
| **Network Offline / Disconnect** | `Failed to fetch` | Instant rollback + Toast banner | Automatic retry on `online` window event |
| **Server Timeout** | `504 Gateway Timeout` | Instant rollback + Toast banner | Manual "Retry" button in toast |
| **Server Internal Error** | `500 Internal Server Error` | Instant rollback + Error toast | Exponential backoff retry (1s, 2s, 4s) |
| **Validation / Client Error** | `400 / 422 Unprocessable` | Rollback + Form field error highlight | Do NOT auto-retry. User must correct input. |
| **Authentication Expired** | `401 Unauthorized` | Rollback + Preserve draft in localStorage | Redirect to login / open auth modal |

---

## 5. Accessibility & ARIA Announcement Timing

Screen reader users rely on `aria-live` regions to understand dynamic page changes without losing focus position.

- **Polite vs. Assertive:**
  - Optimistic mutations: Use `aria-live="polite"` so screen readers finish reading current text before announcing "Liked".
  - Error Rollbacks: Use `aria-live="assertive"` to interrupt screen reader speech and clearly alert users that their action was reversed.
- **Timing Buffer:** Always introduce a brief delay (50ms) when updating `aria-live` text to ensure screen readers register DOM node value changes.
