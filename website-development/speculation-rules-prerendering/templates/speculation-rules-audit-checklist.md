# Speculation Rules & Prerender Implementation Audit Checklist

Use this checklist to verify that the Speculation Rules API is implemented safely, efficiently, and without analytics corruption or network waste.

---

## 1. Safety & Idempotency Audit
- [ ] **No State Mutations:** Verify that all URLs matched by speculation rules (either via `href_matches` or explicit `urls`) are strictly HTTP GET endpoints with zero side effects (e.g., no cart additions, logout triggers, or record deletions).
- [ ] **Authenticated Session Safety:** Ensure sensitive user pages (e.g., `/settings/security`, `/checkout/payment`) do not prerender automatically unless explicitly verified as safe.
- [ ] **Exclude Modals & Triggers:** Ensure links with `href="#"`, `javascript:void(0)`, or buttons opening modals are excluded using `selector_matches` or `href_matches` exclusions.

---

## 2. Rule Schema & Eagerness Tuning
- [ ] **Valid JSON Structure:** Confirm the `<script type="speculationrules">` block contains valid JSON and conforms to the W3C Speculation Rules schema.
- [ ] **Appropriate Eagerness Levels:**
  - [ ] Use `conservative` (`pointerdown`) for large volume link grids (e.g., category listings).
  - [ ] Use `moderate` (hover >200ms) for high-intent CTA buttons and product cards.
  - [ ] Use `eager` or `immediate` only for singular, near-certain next steps (e.g., multi-step forms).
- [ ] **Target Exclusions (`not` conditions):** Ensure non-prerenderable routes are explicitly excluded:
  ```json
  "where": {
    "and": [
      { "href_matches": "/products/*" },
      { "not": { "selector_matches": ".no-prerender, [data-no-prerender]" } }
    ]
  }
  ```

---

## 3. Destination Page Lifecycle Guards (`document.prerendering`)
- [ ] **Analytics Protection:** Verify that analytics page-view tags (Google Analytics, Segment, Plausible) check `document.prerendering` and defer firing until the `prerenderchange` event.
- [ ] **Media & Audio Autoplay:** Ensure video or audio elements do not attempt to play automatically while `document.prerendering === true`.
- [ ] **WebSocket & Polling Connections:** Defer live WebSocket or server-sent event (SSE) connections until page activation to avoid phantom server load.

---

## 4. Network & Device Resource Constraints
- [ ] **Data Saver Check:** Confirm speculation rules are suppressed or downgraded when `navigator.connection.saveData === true`.
- [ ] **Connection Bandwidth Check:** Verify speculation rules skip heavy prerendering on `2g` or `slow-2g` effective connection types.
- [ ] **Limits Respected:** Avoid specifying more than 1 active prerender rule or more than 10 prefetch rules per document to prevent rule eviction.

---

## 5. CSP & Cross-Origin Configuration
- [ ] **Content Security Policy:** Ensure CSP `script-src` includes `'inline-speculation-rules'` or a valid cryptographic nonce/hash if inline scripts are restricted.
- [ ] **Cross-Origin Opt-In Headers:** If prerendering across origins, verify the destination server responds with:
  ```http
  Supports-Loading-Mode: credentialed-prerender
  ```

---

## 6. DevTools & Verification Steps
- [ ] **Chrome DevTools Application Panel:** Check **Application** -> **Background Services** -> **Speculative Loads**.
  - [ ] **Rules:** Status shows `Valid`.
  - [ ] **Speculations:** Target URLs transition to `Ready` or `Prerendered` upon trigger.
- [ ] **Network Panel:** Confirm prefetched/prerendered requests show `Is prerender` flag.
- [ ] **Console Audit:** Confirm zero uncaught errors or duplicate page view logs upon link click activation.
