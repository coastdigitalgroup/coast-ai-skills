---
name: client-side-storage-management
description:
  Implement and debug robust data persistence on the client-side using
  localStorage, sessionStorage, and IndexedDB, with a focus on error handling,
  serialization, and security.
---

# Client-Side Storage Management

## Purpose

The Client-Side Storage Management skill provides a technical protocol for
persisting data within the user's browser. It ensures that data is stored
reliably, handles storage limits gracefully, manages data lifecycle
(expiration), and maintains security best practices to prevent common
vulnerabilities like XSS-based data theft.

## Use Cases

- **Form Persistence:** Auto-saving draft content to prevent data loss on page
  refresh or accidental closure.
- **User Preferences:** Remembering theme settings (dark/light mode), language
  choices, or layout customizations.
- **Performance Optimization:** Caching non-sensitive API responses to reduce
  network overhead on subsequent visits.
- **Offline Capability:** Storing essential data to allow the application to
  remain functional during intermittent connectivity (often in tandem with
  Service Workers).
- **Session Tracking:** Maintaining state across a single session without
  relying on server-side cookies.

## When NOT to Use

- **Sensitive Personal Information:** Never store passwords, credit card
  numbers, or highly sensitive PII in client-side storage, as it is accessible
  to any script running on the origin.
- **Large Binary Assets:** For images or large videos, use the Cache API or
  IndexedDB rather than `localStorage`, which has strict size limits and is
  synchronous (blocking the main thread).
- **Critical Business Logic Data:** Data that must be consistent across
  multiple devices should be stored in a server-side database.
- **Highly Volatile State:** Use in-memory state (Redux, React Context) for
  UI state that changes many times per second.

## Inputs

1.  **Data Object:** The JavaScript object or primitive to be persisted.
2.  **Storage Type:** Selection of `localStorage`, `sessionStorage`, or
    `IndexedDB` based on persistence requirements.
3.  **Persistence Duration:** How long the data should remain valid (TTL).
4.  **Origin Context:** The protocol, domain, and port where the data is
    isolated.

## Outputs

1.  **Storage Utility:** A robust wrapper for native storage APIs with built-in
    error handling.
2.  **Serialized Data:** JSON-encoded strings stored in the browser's key-value
    store.
3.  **Event Handlers:** Listeners for the `storage` event to synchronize state
    across browser tabs.
4.  **Cleanup Routines:** Logic to purge expired or redundant data.

## Workflow

### 1. Select the Appropriate Storage API

-   **`localStorage`:** For data that should persist across browser restarts
    and sessions (e.g., user theme).
-   **`sessionStorage`:** For data that should only last for the duration of the
    page session (cleared when the tab is closed).
-   **`IndexedDB`:** For large amounts of structured data or binary blobs.

### 2. Implement Feature Detection

Always wrap storage access in a `try-catch` block or use a detection utility to
handle browsers that block storage (e.g., Safari in private mode or users with
storage disabled).

### 3. Handle Serialization and Deserialization

Native `localStorage` and `sessionStorage` only support strings.
-   Use `JSON.stringify()` when saving objects.
-   Use `JSON.parse()` when retrieving, wrapped in a `try-catch` to handle
    malformed or corrupted data.

### 4. Implement Error Handling (The "Quota" Trap)

Storage is limited (typically 5MB for `localStorage`).
-   Monitor for `QuotaExceededError` (DOMException).
-   Provide a fallback strategy, such as clearing older cached data or
    notifying the user that settings cannot be saved.

### 5. Manage Data Expiration (TTL)

Native storage does not support expiration.
-   Wrap the data in a "metadata" object that includes a `timestamp` and `ttl`.
-   Upon retrieval, compare the current time with the timestamp + ttl; if
    expired, remove the item and return `null`.

### 6. Synchronize Across Tabs

Listen to the `storage` event on the `window` object. This event fires in
all tabs of the same origin *except* the one that made the change, allowing
you to keep the UI in sync across windows.

## Decision Rules

-   **Persistence vs. Session:** Use `localStorage` for "forever" data,
    `sessionStorage` for "this visit only" data.
-   **Size of Data:** If data > 5MB, use `IndexedDB`.
-   **Synchronous vs. Asynchronous:** Use `localStorage` for small, immediate
    reads. Use `IndexedDB` (asynchronous) for large data to avoid blocking the
    main thread and causing jank.
-   **Security:** If the data is used for authentication, prefer `HttpOnly`
    Cookies over `localStorage` to mitigate XSS risks.

## Constraints

-   **Size Limits:** Most browsers limit `localStorage` to ~5MB per origin.
-   **Synchronicity:** `localStorage` and `sessionStorage` are synchronous and
    can block the main thread if used excessively or with very large strings.
-   **Same-Origin Policy:** Data is isolated by protocol, domain, and port.
-   **Privacy Mode:** Some browsers restrict or clear storage more aggressively
    in private browsing modes.

## Non-Goals

-   Implementing server-side database synchronization.
-   Managing Service Worker `CacheStorage` (specific to the Cache API).
-   Encryption of client-side data (client-side encryption is easily bypassed
    if the key is also on the client).

## Common Failure Patterns

-   **The Unchecked `JSON.parse`:** Crashing the application when attempting to
    parse a value that isn't valid JSON (e.g., a legacy string or corrupted
    data).
-   **Ignoring `QuotaExceededError`:** The application continuing as if data
    was saved when it actually failed, leading to data loss.
-   **Storage Leakage:** Accumulating "zombie" data in `localStorage` that is
    never cleared, eventually hitting the quota limit.
-   **XSS Vulnerability:** Storing sensitive session tokens in `localStorage`
    where they can be stolen by malicious third-party scripts.
-   **Blocking the Main Thread:** Performing heavy serialization or large reads
    from `localStorage` during critical animations or interactions.

## Validation Criteria

-   **Quota Test:** Attempt to save a very large string to verify that the
    `QuotaExceededError` is caught and handled gracefully.
-   **Private Mode Test:** Verify that the application does not crash and
    provides a functional fallback when storage is blocked.
-   **Cross-Tab Sync Test:** Open two tabs, change a setting in one, and
    verify the other tab updates its state via the `storage` event.
-   **TTL Test:** Set a short expiration (e.g., 5 seconds) and verify the data
    is correctly identified as expired and purged after that time.
-   **Serialization Audit:** Ensure all data retrieved from storage is
    validated before being used to prevent "poisoned" storage data from
    breaking the UI.
