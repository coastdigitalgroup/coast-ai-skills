# Zero Search Results Audit & Optimization Toolkit

This template contains reusable checklists, audit procedures, and layout frameworks designed to analyze and optimize the "No Results Found" search experience. Use this document when starting an internal search optimization project.

---

## Part 1: The Zero-Results UX & Technology Audit Checklist

Use this checklist to perform a diagnostic review of the current search experience. Assign a score of **Pass**, **Fail**, or **Partial** to each item.

### 1. Search Query Input & Correction
| Audit Item | Description | Status (P/F/PT) | Notes & Actions Required |
| :--- | :--- | :---: | :--- |
| **Fuzzy Matching / Typo Tolerance** | If a user searches for a term with a 1- or 2-character spelling error (e.g., "shos" for "shoes"), does the system return results? | | |
| **Input Retention** | When zero results are returned, does the search input field in the header retain the user's original query? | | |
| **Silent Autocorrection Notification** | If the system auto-corrects a spelling typo, is the user clearly notified of the change (e.g., *"Showing results for **X** instead of **Y**"*)? | | |
| **Phonetic/Soundex Matches** | Does the search system handle phonetic errors (e.g., "phoned" -> "phone")? | | |
| **Synonym Processing** | Does searching for a common synonym (e.g., "couch" vs "sofa") return the same product catalog results? | | |

### 2. User Interface & Layout (The "No Results" Page)
| Audit Item | Description | Status (P/F/PT) | Notes & Actions Required |
| :--- | :--- | :---: | :--- |
| **Soft Copy/Tone** | Does the page avoid harsh error codes and use helpful, warm, and outcome-focused microcopy? | | |
| **Clickable "Did You Mean" Links** | Is a spelling suggestion displayed as a prominent, single-click link that instantly executes the correct search? | | |
| **Dynamic Category Pills** | Are 3-6 popular or trending category shortcut links displayed as large, tap-friendly targets? | | |
| **Curated Product Recommendations** | Is there a horizontal grid showing 3-4 top-selling products (not randomly selected items)? | | |
| **Contextual Fallbacks** | If the search term contained a partial known category (e.g., "blue plates" failed), does the page display *all plates* instead of overall best sellers? | | |
| **Human Assisted Escapes** | Is there an immediate link to Live Chat, customer service email, or help center search at the bottom? | | |

### 3. Mobile Performance & Gestures
| Audit Item | Description | Status (P/F/PT) | Notes & Actions Required |
| :--- | :--- | :---: | :--- |
| **Keyboard Type trigger** | Does clicking the search bar bring up the correct alphanumeric mobile keyboard? | | |
| **Horizontal Scrolling Grids** | Are recommended product cards arranged in a swipable horizontal carousel on mobile (rather than a long, vertical scroll that pushes content below the fold)? | | |
| **Minimum Tap Targets** | Are all recommended category pills and suggestion links at least 44x44px with adequate padding? | | |

---

## Part 2: Failed Query Log Analysis Sheet

Use this schema to audit your site's search logs. Export your top 100 failed queries from the last 30-90 days and group them into actionable buckets.

### Audit Template

| Failed Search Query | Monthly Volume | Root Cause Category (Typo / Synonym / Out-of-Stock / Not Carried) | Immediate Corrective Action | Long-Term Product Opportunity |
| :--- | :---: | :---: | :--- | :--- |
| *Example: "headhpones"* | *420* | *Typo* | *Configure fuzzy matching with Levenshtein distance = 2.* | *None (Typo only).* |
| *Example: "waterproof speaker"*| *280* | *Synonym* | *Map "waterproof" to tag "IPX7-rated" and "water-resistant" in CMS.* | *Sourcing: Add IPX7/waterproof indicators prominently on PLP cards.* |
| *Example: "red wireless buds"*| *140* | *Out-of-Stock* | *Implement Query Relaxation. Drop "red" modifier and show standard wireless buds, indicating red is coming back.* | *Inventory: Set reorder threshold higher on red colorway.* |
| *Example: "Dyson vacuum"* | *95* | *Not Carried* | *Show alternative premium vacuum brands (e.g., Miele, Shark) with headline "We don't carry Dyson, but here is what our experts recommend:"* | *Merchandising: Reach out to Dyson for wholesale distribution agreement.* |
| | | | | |
| | | | | |
| | | | | |

### Root Cause Categorization Reference
- **Typo (T):** User made a spelling error. Action: Backend fuzzy search or typo suggestions.
- **Synonym (S):** User used a word not in your product metadata. Action: Add synonym rule.
- **Out-of-Stock (OOS):** You sell this, but the specific variant is depleted. Action: Relax constraints, show other variants, provide "Notify Me" trigger.
- **Not Carried (NC):** User is searching for a brand or product category you don't stock. Action: Show closest competitor equivalents, use search query as demand-generation signal for purchasing department.

---

## Part 3: Zero-Results UI Component Specifications

When wireframing or designing the optimized recovery page, ensure the development team follows these technical specifications:

1. **Search Bar Input Field:**
   ```html
   <!-- Input must preserve the failed term instead of clearing it -->
   <input type="search" value="[Preserve User's Failed Search Term]" autocomplete="off" spellcheck="false" />
   ```
2. **"Did You Mean" Suggestion Engine Logic:**
   - Limit Levenshtein distance calculation to queries $>3$ characters.
   - If distance $\le 2$ from a high-frequency search index term, output:
     `"Did you mean <a href="/search?q=[Corrected]">[Corrected]</a>?"`
3. **Recommendation Fallback Selection Priority:**
   - **Tier 1:** Query matched a category tag? Display best sellers from that specific category.
   - **Tier 2:** Query contains a gender, color, or accessory keyword? Relax keyword and show general brand/item.
   - **Tier 3 (Global Default):** Display top 3 overall store best sellers (dynamically pulled from real-time sales APIs).

---

## Part 4: Post-Optimization Validation Form

After deploying the changes, monitor these key performance indicators (KPIs) over a 14-day and 30-day window to evaluate success.

- **Baseline Period:** `[Date Range]`
- **Post-Optimization Period:** `[Date Range]`

| Metric Name | Formula / Log Source | Baseline Value | Target Value | Post-Deploy Value | Delta (%) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Zero-Results Search Rate** | (Searches with 0 Results / Total Searches) * 100 | % | < 5.0% | % | % |
| **Zero-Results Exit Rate** | (Exits from Zero-Result Pages / Total Views of Zero-Result Pages) * 100 | % | < 30.0% | % | % |
| **Search Recovery CTR** | (Clicks on any Link on Zero-Result Page / Total Views of Zero-Result Pages) * 100 | % | > 25.0% | % | % |
| **Query Resolution Rate** | % of users who find a product within 2 additional searches in the same session | % | > 50.0% | % | % |
| **Search-to-Cart Conversion** | (Add-to-Carts from search session / Total search sessions) * 100 | % | +10% Lift | % | % |
| **Support Ticket Volume** | Support tickets tagged as "Cannot find item" or "Catalog inquiry" | /mo | -15% | /mo | % |
