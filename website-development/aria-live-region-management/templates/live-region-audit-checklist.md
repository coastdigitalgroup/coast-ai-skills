# ARIA Live Region & Status Announcement Audit Checklist

Use this diagnostic checklist to audit, implement, and remediate dynamic screen reader live region announcements across single-page applications, dynamic forms, and interactive components in compliance with **WCAG 2.2 SC 4.1.3 (Status Messages)**.

---

## 1. Static DOM & Architecture Verification

- [ ] **Static Container Initialization:** Are `aria-live` containers (`aria-live="polite"` and `aria-live="assertive"`) present in the DOM prior to dynamic event triggers? *(Do NOT dynamically create live region containers in the same tick as content injection).*
- [ ] **Accessibility Tree Visibility:** Do live region containers avoid using `display: none`, `visibility: hidden`, or `hidden` attributes? *(Use standard `.sr-only` CSS clipping so the element remains active in the accessibility tree).*
- [ ] **Atomic Announcement Configuration:** Is `aria-atomic="true"` present on status message containers to ensure screen readers speak the full sentence context rather than isolated diff fragments?
- [ ] **Role Equivalency:** Are `role="status"` containers paired with `aria-live="polite"` and `role="alert"` containers paired with `aria-live="assertive"`?

---

## 2. Dynamic Update & Queue Management

- [ ] **Search & Filter Debouncing:** Are dynamic search results or filter count announcements debounced by at least 300ms–500ms to prevent speech clipping on keydown events?
- [ ] **Identical Text Micro-Clearing:** Is the text node of the live container cleared briefly (`textContent = ''` with a microtask/setTimeout delay) before re-populating identical strings (e.g., clicking "Copy" multiple times)?
- [ ] **High-Frequency Filtering:** Are continuous rapid updates (such as media timecodes, progress bar percentages, or typing counters) excluded from `aria-live` regions to prevent speech flooding?
- [ ] **Consecutive Announcement Queueing:** Are multiple asynchronous notifications queued with a delay (e.g., 800ms gap) to prevent consecutive messages from clobbering each other?

---

## 3. Politeness & Priority Mapping

- [ ] **Polite Priority Standard:** Are routine status updates (search result counts, autosave feedback, cart updates, filter changes) routed strictly to `aria-live="polite"`?
- [ ] **Assertive Priority Discipline:** Is `aria-live="assertive"` (`role="alert"`) reserved strictly for critical errors, lost connection warnings, session timeouts, or security alerts?
- [ ] **Focus Shift Redundancy Check:** Does the application avoid triggering `aria-live` announcements when keyboard focus is explicitly moved to a new element (e.g., focus moved into a modal dialog or error summary banner)?

---

## 4. Cross-Screen Reader Verification Matrix

- [ ] **VoiceOver (macOS / Safari):** Confirm dynamic search updates are spoken smoothly after typing pauses, without forcing visual focus movement.
- [ ] **NVDA (Windows / Chrome & Firefox):** Verify that repeated clicks on identical status actions (e.g., "Copied to clipboard") are re-spoken cleanly every time.
- [ ] **JAWS (Windows / Chrome & Edge):** Verify status messages complete full sentences without stuttering or truncating prior text.
- [ ] **TalkBack (Android / Chrome) & VoiceOver (iOS / Safari):** Confirm live region updates do not disrupt touch gesture focus or virtual cursor reading position.
