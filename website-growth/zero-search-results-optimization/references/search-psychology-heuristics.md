# Search Psychology & Zero-Results Recovery Heuristics

This reference guide details psychological principles, user behavior patterns, and visual design heuristics for turning zero-search-results pages into active discovery paths.

---

## 1. Searcher Psychology & Cognitive Load

### High Intent vs. Low Friction Expectation
Users who perform an internal site search exhibit **2x to 3x higher purchasing intent** than passive browser navigation visitors. When a user types a query into a site search bar, they enter a state of active goal-directed behavior.

- **The Expectation:** Immediate validation or direct access to their desired item.
- **The Shock of "0 Results":** A stark "No Results Found" error screen breaks momentum, triggering an immediate drop in cognitive trust. The user interprets a blank result screen as a statement that *"this store does not sell what I need"*.
- **The Recovery Objective:** Reframe "0 results" from a binary rejection into a helpful conversation: *"We don't have that exact phrase, but here is what matches your intent."*

---

## 2. Query Failure Categorization Heuristics

When auditing failed search logs, apply these behavioral heuristics to assign queries to recovery pathways:

### Category A: Typo & Character Distance
- **Behavioral Signal:** Minor spelling mistakes, transposed letters, phonetic spellings, missing hyphens or spaces (e.g., `"birkenstok"`, `"windbreaker"`).
- **Engine Heuristic:** Apply Damerau-Levenshtein distance.
  - Query length 1–3 chars: Exact match only (0 edit distance) to prevent false positives.
  - Query length 4–7 chars: 1 edit distance permitted.
  - Query length 8+ chars: 2 edit distances permitted.
- **UI Heuristic:** If confidence is >90%, auto-correct with notice (*"Showing results for 'Birkenstock'. Search instead for 'birkenstok'?"*).

### Category B: Synonym & Vocabulary Mismatch
- **Behavioral Signal:** Valid product queries using regional terms, generic names, or colloquialisms not present in official catalog titles (e.g., `"sofa"` vs. `"couch"`, `"beanie"` vs. `"knit hat"`).
- **Engine Heuristic:** Configure bidirectional synonym mappings in search backend dictionaries.
- **UI Heuristic:** Render top category results matching the broader synonym class.

### Category C: Out-of-Catalog & Competitor Queries
- **Behavioral Signal:** Queries for brands, categories, or items the merchant does not carry (e.g., searching `"Patagonia"` on a Columbia Sportswear store).
- **Engine Heuristic:** Map competitor brand keywords to equivalent internal product categories.
- **UI Heuristic:** Humanize the message (*"We don't carry Patagonia, but check out our top-rated waterproof shells built for the same trails"*), followed by visual category cards and best-seller carousels.

### Category D: Out-of-Stock & Discontinued SKUs
- **Behavioral Signal:** Searches for exact model numbers, legacy versions, or temporarily out-of-stock items (e.g., `"Pro Shell 2022"`).
- **Engine Heuristic:** Redirect model number queries to active successor SKUs or parent collection pages.
- **UI Heuristic:** Provide a 1-click email restock alert micro-form or suggest newer active equivalents.

---

## 3. Visual Recovery UI Design Principles

### Rule 1: Visual Chunking via Image Cards
Text-only lists of links fail on mobile screens after a zero-results hit because users experience scanning fatigue.
- Use **4 to 6 image-led category bubbles/cards** with high-contrast thumbnails and clear labels.
- Visual thumbnails allow brain processing in under 100 milliseconds, giving immediate direction.

### Rule 2: Persistent Query Input
- **Never auto-clear the search input box.**
- Retain the user's string with a clear button (`×`) and active cursor focus.
- Over 40% of users who hit zero results will attempt an immediate 1-to-2 character correction if their original query remains visible.

### Rule 3: Explicit Header Context on Recommendations
- **Never render product carousels without explicit header labels.**
- If you render product recommendations without a label like *"Our Today's Trending Best Sellers"*, users will mistake the recommended items for broken exact search matches, destroying trust in search accuracy.

### Rule 4: Progressive Escalation & Non-Intrusive Support
- For long-tail B2B catalogs, specialized technical items, or out-of-stock products, offer a **1-field email capture micro-form** (*"Notify me when [Query] arrives"*).
- Delay live-chat prompts by 3–5 seconds so they do not overlap mobile keyboards or create popup friction while the user attempts a search retry.

---

## 4. Summary Matrix of Heuristics

| Failure Scenario | Engine Strategy | UI Recovery Element | Primary Goal |
| :--- | :--- | :--- | :--- |
| **Spelling Error** | Damerau-Levenshtein Fuzzy Match | Auto-correct with override link | Display accurate results instantly |
| **Synonym Gap** | Two-way synonym mapping | Equivalent category collection grid | Align search vocabulary with catalog |
| **Competitor Query** | One-way broad tag mapping | Humanized copy + 4 visual category cards | Pivot intent to carried inventory |
| **Discontinued Item** | Automated SKU redirect | Model successor card + Restock alert form | Capture demand for active items |
