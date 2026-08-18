# Content Visibility & Rendering Performance Audit Checklist

Use this checklist to audit, optimize, and verify CSS rendering containment (`content-visibility: auto` and `contain-intrinsic-size`) on DOM-heavy pages.

---

## 1. Candidate Identification & Profiling

- [ ] **DOM Node Count Inspection:** Open Console and check total nodes (`document.querySelectorAll('*').length`). Is node count > 1,000?
- [ ] **Baseline Trace Captured:** Open Chrome DevTools **Performance** panel, record initial load or dynamic interactions (e.g., theme toggle, list filter).
- [ ] **Rendering Bottleneck Located:** Identify wide purple blocks in Main thread track corresponding to **Recalculate Style** or **Layout**.
- [ ] **Off-Screen Target Selection:** Identify repetitive or large below-the-fold content blocks (article sections, comment lists, product cards, footer).

---

## 2. Implementation & Sizing Verification

- [ ] **Exclusion of Above-the-Fold Content:** Confirm `content-visibility: auto` is **NOT** applied to hero sections, main page header, or initial viewport content.
- [ ] **Presence of `contain-intrinsic-size`:** Confirm every `content-visibility: auto` rule is paired with an explicit `contain-intrinsic-size` estimate.
- [ ] **Usage of `auto` Keyword:** Is `contain-intrinsic-size: auto <estimate>px` used for dynamic content so browsers cache actual rendered height?
- [ ] **Reasonable Height Estimates:** Compare `contain-intrinsic-size` estimates with actual rendered element dimensions. (Estimates should be within ~20% of average real height).
- [ ] **Progressive Enhancement Query:** Are `content-visibility` rules wrapped in `@supports (content-visibility: auto)` feature queries where necessary?

---

## 3. User Experience & Scroll Stability

- [ ] **Scrollbar Thumb Stability Check:** Scroll slowly down the page. Does the scrollbar thumb remain stable without abrupt jumping or visual jitter?
- [ ] **Cumulative Layout Shift (CLS) Audit:** Run a Lighthouse or Web Vitals audit during page scrolling. Confirm CLS score remains < 0.1.
- [ ] **Anchor / Deep Link Navigation (`#hash`):** Test URL fragment navigation to a contained section (`#section-id`). Does the page scroll accurately to the target element with proper `scroll-margin-top` offset?
- [ ] **Focus Management:** Tab through the page with keyboard (`Tab`). Does focus move smoothly into contained elements, automatically triggering rendering without keyboard traps?

---

## 4. Accessibility & Searchability Audit

- [ ] **Find-In-Page (`Ctrl+F` / `Cmd+F`) Test:** Search for a string located inside an off-screen contained section. Does the browser find, highlight, and reveal the text seamlessly?
- [ ] **Screen Reader Traversal:** Test with VoiceOver or NVDA. Does the screen reader virtual cursor discover headings and text inside contained off-screen blocks?
- [ ] **DOM State Independence:** Confirm `content-visibility: auto` is used instead of `display: none` when content should remain in the accessibility tree and DOM index.

---

## 5. Post-Optimization Verification

- [ ] **Performance Profile Comparison:** Record a new trace in Chrome DevTools Performance panel.
- [ ] **Recalculate Style Time Reduction:** Confirm total time spent in **Recalculate Style** dropped significantly (target > 50% reduction for long pages).
- [ ] **Layout & Paint Reduction:** Confirm off-screen layout and paint executions are skipped during initial load.
- [ ] **Interaction to Next Paint (INP) Check:** Verify interaction latency on page buttons/inputs remains < 200ms during scrolling.
