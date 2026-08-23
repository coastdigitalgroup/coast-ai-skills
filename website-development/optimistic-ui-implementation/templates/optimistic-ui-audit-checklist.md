# Optimistic UI Audit & Quality Checklist

This checklist provides a structured procedure for auditing optimistic UI updates, state rollbacks, network failure recovery, and accessibility compliance across web applications.

---

## 1. State Snapshot & Synchronous Mutation

- [ ] **Instant Response (< 16ms):** Does the target UI element update immediately on user action before any network `fetch()` request is dispatched?
- [ ] **Immutable Snapshot Capture:** Is the pre-mutation UI state (classes, counts, attributes, form field values, DOM positions) fully captured before applying optimistic changes?
- [ ] **Temporary Client Identifiers:** If creating new list items or entities optimistically, are unique temporary client IDs generated (e.g. `temp_12345`) to prevent DOM element key collisions?
- [ ] **Non-Blocking Pending Indicators:** Is pending status communicated without setting `disabled` on focused interactive elements or locking total page interaction?
- [ ] **`aria-busy` Usage:** Is `aria-busy="true"` set on the target component or container while the network request is in flight?

---

## 2. Network Error & Rollback Integrity

- [ ] **HTTP 4xx / 5xx Rollback:** When simulating a server rejection or 500 Internal Server Error in Chrome DevTools Network tab, does the UI revert to the exact pre-mutation snapshot?
- [ ] **Network Offline / Timeout Rollback:** When the network drops offline mid-request, does the application trigger a clean rollback after timing out?
- [ ] **No Orphan DOM Elements:** On failed optimistic additions (e.g. adding a comment), is the temporary DOM node completely destroyed?
- [ ] **DOM Order Preservation:** On failed list item deletions (e.g. removing a card), is the restored element inserted back into its exact original index position in the DOM?
- [ ] **Server Reconciliation:** On API success, are temporary IDs replaced with authoritative database IDs and canonical counts from the server response?

---

## 3. Race Condition & Rapid Action Mitigation

- [ ] **AbortController Integration:** Does rapid repeated toggling (e.g., clicking a like button 5 times in 1 second) cancel stale in-flight requests using `AbortController`?
- [ ] **Idempotency Tokens:** Does every optimistic POST/PUT request carry a unique idempotency key (`X-Idempotency-Key`) to prevent duplicate database writes on server retries?
- [ ] **Out-of-Order Response Protection:** If request #1 resolves *after* request #2 due to network jitter, is request #1's response safely ignored or discarded?

---

## 4. User Notification & Draft Safety

- [ ] **Clear Failure Communication:** Does a non-intrusive toast, banner, or inline error alert inform the user when an action fails and is reverted?
- [ ] **Actionable Retry Trigger:** Does the failure notification offer an immediate "Retry" button to re-attempt the failed operation?
- [ ] **Form Draft Recovery:** If an optimistic comment submission or inline form auto-save fails, is the user's typed text preserved in the input/textarea rather than wiped out?

---

## 5. Accessibility & Screen Reader (WCAG 2.2 AA)

- [ ] **ARIA Live Region:** Is there a designated visually hidden container (`aria-live="polite"` or `aria-live="assertive"`) for announcing mutation outcomes?
- [ ] **Instant State Announcement:** Does toggling a state option immediately announce its new state to screen readers (e.g., "Liked article")?
- [ ] **Rollback Announcement:** On API rejection, does `aria-live="assertive"` announce the failure and state restoration clearly (e.g., "Action failed. Like status reverted.")?
- [ ] **Keyboard Focus Maintenance:** Is active keyboard focus maintained on the trigger element throughout the optimistic mutation and potential rollback sequence?
