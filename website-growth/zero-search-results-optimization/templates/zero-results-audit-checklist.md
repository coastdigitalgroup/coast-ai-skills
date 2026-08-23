# Zero Search Results Audit & Optimization Checklist

Use this audit checklist to systematically diagnose, configure, and optimize "No Search Results Found" pages and query failure points.

---

## Section 1: Search Analytics & Failure Root Cause Audit

- [ ] **Data Export:** Exported 30 to 90 days of internal search log data filtered for `results_count = 0`.
- [ ] **Query Categorization:** Grouped top 100–200 zero-hit search terms into four core failure buckets:
  - [ ] **Bucket A: Typos & Misspellings** (e.g., `"birkenstok"`, `"addidas"`)
  - [ ] **Bucket B: Synonyms & Material/Jargon Gaps** (e.g., `"sofa"` vs. `"couch"`, `"goretex"`)
  - [ ] **Bucket C: Competitor / Unstocked Brands** (e.g., `"patagonia"`, `"macbook"`)
  - [ ] **Bucket D: Discontinued SKUs / Stockouts** (e.g., `"Model 2021"`, `"Out of Stock Item"`)
- [ ] **Volume & Revenue Loss Calculation:** Calculated total zero-result searches as a percentage of total site searches (Target: `<5%`).

---

## Section 2: Search Engine Backend Configuration

- [ ] **Typo Tolerance Rules:**
  - [ ] Enabled Damerau-Levenshtein distance (1 edit for 4–7 char queries, 2 edits for 8+ char queries).
  - [ ] Verified fuzzy matching does not cause extreme relevancy drift on short 3-letter SKUs.
- [ ] **Synonym Dictionary Mapping:**
  - [ ] Created two-way synonym pairs for common regional terms and material equivalents.
  - [ ] Created one-way synonym mappings pointing brand/material keywords to active general categories.
- [ ] **Noise Character & Stopword Tokenization:**
  - [ ] Configured tokenizer to strip hyphens, slashes, hashtags, and fluff phrases (`"buy"`, `"cheap"`, `"near me"`).
- [ ] **Discontinued SKU & Model Redirects:**
  - [ ] Mapped legacy or out-of-stock model numbers directly to successor product pages or active category hubs.

---

## Section 3: User Interface & Experience Audit

### Search Input & Header Area
- [ ] **Persistent Input:** Failed search query remains pre-filled in the search bar on the zero-results page.
- [ ] **No Automatic Wipe:** The search input is NOT cleared automatically, allowing 1-click inline editing.
- [ ] **Humanized Header Copy:** Header acknowledges the missing exact match in empathetic, helpful tone (e.g., *"We couldn't find exact matches for '[Query]', but here are popular ways to keep exploring:"*).

### Visual Discovery & Category Navigation
- [ ] **Visual Category Bubbles:** Displays 4 to 6 image-led category thumbnails (3:4 or 1:1 aspect ratio) below the header.
- [ ] **Mobile Touch Targets:** Category buttons/bubbles feature a minimum touch target size of 48x48px with clear labels.

### Fallback Product Recommendations
- [ ] **Explicit Context Headers:** Fallback product carousel features an explicit, prominent heading (e.g., *"Our Today's Trending Best Sellers"* or *"Based on Your Recently Viewed Items"*).
- [ ] **No Unlabeled Grids:** Verified that no products are rendered without a clear contextual header label that users could mistake for actual search matches.
- [ ] **Performance & Asset Loading:** Fallback grid is capped at 4–8 items using compressed WebP images (<100KB per image) with lazy-loading enabled.

### Intent Capture & Support Escalation
- [ ] **Micro-Form / Email Capture:** For B2B or out-of-stock items, a 1-field email capture form is offered (*"Notify me when [Query] is in stock"* or *"Request a custom quote"*).
- [ ] **Contextual Live Chat Trigger:** On desktop/mobile, a non-intrusive support badge appears after 3–5 seconds (*"Can't find [Query]? Chat with a specialist"*).

---

## Section 4: Performance & Metric Tracking Matrix

| Metric | Pre-Audit Baseline | 30-Day Post Goal | Actual Result |
| :--- | :--- | :--- | :--- |
| **Zero-Results Rate (% of total searches)** | | `< 5.0%` | |
| **Zero-Results Exit Rate (% bounce)** | | `< 40.0%` | |
| **Search Refinement Rate (% 2nd search)** | | `> 50.0%` | |
| **Search Session Conversion Rate (SSCR)** | | `> 2.0%` | |
| **Fallback Grid Click-Through Rate (CTR)** | | `> 20.0%` | |

---

## Section 5: Optimization Sign-Off Criteria

- [ ] All top 50 zero-result queries from the past 90 days re-tested manually.
- [ ] Mobile viewport tested on iOS Safari and Android Chrome to confirm no keyboard layout breakage.
- [ ] Privacy policy link and consent copy present on all email capture micro-forms.
- [ ] Final A/B test setup verified in analytics platform.
