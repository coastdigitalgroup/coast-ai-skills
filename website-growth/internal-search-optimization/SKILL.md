---
name: internal-search-optimization
description:
  Audit and optimize site search to improve product/content findability, reduce
  zero-results scenarios, and increase conversion rates for high-intent users.
  Trigger this skill when search exit rates are high or when users struggle to
  locate items that are known to be in the catalog.
---

# Internal Search Optimization

## Purpose

The Internal Search Optimization skill provides a systematic framework for
improving the site search experience. Internal searchers often convert at 2-3x
the rate of non-searchers because they represent the highest-intent segment of
your audience. This skill focuses on reducing "Search Friction" by improving
search bar visibility, result relevancy, and discovery-driven recovery for "no
results" queries. By aligning search results with user intent, this skill
directly improves Search Conversion Rate and reduces Search Exit Rate.

## Use Cases

- E-commerce sites where users rely on search to find specific SKUs or
  categories.
- Content-heavy sites (blogs, documentation, resource hubs) where navigation is
  complex.
- Sites with high "Search Exit Rates" (users leaving immediately after seeing
  search results).
- Large product catalogs where filtering alone is insufficient for discovery.
- Situations where search analytics show a high volume of "Zero Results"
  queries.

## When NOT to Use

- **Very Small Sites:** If a site has fewer than 20-30 pages or products, a
  robust search system may be overkill compared to better navigation.
- **Single-Purpose Landing Pages:** Pages designed for a single conversion goal
  where search would be a distraction from the primary CTA.
- **Non-Searchable Apps:** Utility tools or dashboards where data is purely
  relational and accessed via dedicated UI views rather than keyword search.

## Inputs

1. **Search Analytics:** Data on top search terms, terms with no results, and
   click-through rates (CTR) on results.
2. **Search UI Context:** Current placement, design, and mobile behavior of the
   search input.
3. **Product/Content Metadata:** The quality of titles, descriptions, and tags
   used by the search engine.
4. **Current Search Engine Capabilities:** Knowledge of whether the system
   supports "fuzzy matching," synonyms, or federated results.

## Outputs

1. **Search Experience Audit:** Identification of UX friction (e.g., hidden
   search bar) and relevancy gaps.
2. **Relevancy & Synonym Map:** A list of common user terms to map to official
   product/content names.
3. **Zero-Results Recovery Strategy:** Design recommendations for transforming
   dead-ends into discovery moments.
4. **UI/UX Optimization Specs:** Improved designs for auto-suggest, mobile
   search drawers, and results page layout.

## Workflow

### 1. Audit Search Visibility & UX

Evaluate how easily a high-intent user can start their journey.

- **The "High-Contrast" Bar:** Is the search bar immediately visible on both
  desktop and mobile, or is it hidden behind a magnifying glass icon?
- **Mobile Thumb-Zone:** On mobile, does tapping search open a dedicated
  full-screen interface with a focused keyboard?
- **Placeholder Text:** Does the placeholder guide the user? (e.g., "Search for
  'running shoes'..." vs. "Search").

### 2. Analyze Relevancy & Metadata

Ensure the "Search-to-Result" match is accurate.

- **Query-to-Product Mapping:** Check top search terms. Do they return the most
  relevant items first?
- **Synonym Tuning:** Identify common alternative terms (e.g., "sofa" vs.
  "couch") and ensure the search engine treats them as identical.
- **Handling Typos:** Test common misspellings. Does the system provide "Did you
  mean...?" or use fuzzy matching?

### 3. Optimize the Auto-Suggest Experience

Reduce the interaction cost of typing.

- **Visual Auto-Suggest:** Provide instant results (images, prices, categories)
  as the user types.
- **Recent & Popular Searches:** Show the user's previous searches or trending
  terms to speed up the entry.
- **Category Scoping:** Allow users to search within a specific category (e.g.,
  "Search in Electronics").

### 4. Implement Zero-Results Recovery

Eliminate dead-ends in the user journey. Before designing the recovery
layout, categorize *why* queries are failing by exporting 30-90 days of
search analytics into four buckets: **Typo/Misspelling** (e.g., "dumbell"),
**Synonym/Alternative Vocabulary** (e.g., "sofa" vs. "couch"),
**Competitor** (e.g., "Yeti cooler" on a Pelican site), and **Genuine
Catalog Gap** (products you don't carry at all). Each bucket calls for a
different fix.

- **Auto-Correction & "Did You Mean":** If the search platform is highly
  confident in a typo correction, auto-apply it with a subtle notice
  ("Showing results for 'dumbbell'. Search instead for 'dumbell'?"). If
  confidence is lower, surface a prominent, clickable "Did you mean...?"
  suggestion at the top of the page instead of auto-redirecting.
- **Search Term Normalization:** Strip unnecessary characters or plurals to
  try and find a partial match.
- **Never Show a Blank Page:** A failed search must render a structured
  recovery layout, not an error screen:
  - **Human-centric copy:** Reframe cold error text ("0 results matched")
    as helpful guidance ("We couldn't find an exact match for '[Query]',
    but we're here to help you find what you need.").
  - **Visual category bubbles:** 4-6 clickable, image-led category cards
    (e.g., "Best Sellers," "New Arrivals," "Clearance") below the search
    bar — these outperform plain text links, especially on mobile.
  - **Dynamic fallback recommendations:** Show a "Based on your recently
    viewed items" carousel if session history exists; otherwise fall back
    to a static top-sellers grid. If the failed query matches a broader
    category tag (e.g., "Nike" with zero hits but a "Running Shoes"
    category exists), pull top sellers from that category instead.
  - Every fallback grid must carry an explicit label (e.g., "Our Most
    Popular Items Today") — never present unrelated products without
    context, which reads as a broken search result rather than a helpful
    suggestion.
- **Conversions of Last Resort:** When no fallback content resolves the
  query, capture intent before the user exits: trigger a contextual live
  chat prompt referencing their search term, or offer a lightweight
  "Request a Product" micro-form (email + what they're looking for) —
  particularly effective for specialized B2B or long-tail catalogs.

### 5. Review Against Decision Rules

Verify that the search strategy aligns with conversion heuristics.

## Decision Rules

- **The "Results Over Pages" Rule:** Prioritize actual product/content cards
  over "Page" results in the auto-suggest dropdown.
- **Speed is a Feature:** Search results and auto-suggestions must appear in
  under 200ms to feel "instant."
- **Persistent Input:** The search query should remain in the search box on the
  results page so users can easily refine it — never clear it automatically,
  which forces users to retype a near-miss query from scratch.
- **The 5-Result Minimum:** On a results page, aim to show at least 5 results
  above the fold on desktop by balancing image size and metadata.
- **The "Never Blank" Rule:** A zero-results page must display at least 4
  clickable, product-level or category-level visual links — text-only error
  states are not acceptable.
- **No Mystery Matches:** Any fallback products shown on a zero-results page
  must carry an explicit label (e.g., "Our Most Popular Items"). Never show
  unlabeled products that a user could mistake for actual search matches.
- **The 3-Second Threshold:** Typo suggestions and fallback recommendations
  must render instantly. If a recommendation API call would delay the page
  by more than 1.5 seconds, fall back immediately to a static category grid
  rather than block the page.

## Constraints

- **Platform Dependency:** Synonym mapping, typo tolerance, and ranking tuning require configuration access to the search platform (e.g., Algolia, Elasticsearch, or native CMS search).
- **Catalog Quality Ceiling:** Search can only surface what exists — poor product titles, missing descriptions, or inconsistent tagging limit result quality regardless of search tuning.
- **Analytics Prerequisite:** Search query reporting must be enabled before optimization can be data-driven.
- **Recommendation API Availability:** Dynamic, personalized zero-results
  fallbacks (recently viewed, catalog proximity) require a recommendation
  engine (e.g., Algolia, Klevu, Shopify Search & Discovery). Without one,
  fall back to static trending-category links.
- **Data Protection Compliance:** Any "Request a Product" or callback form
  that captures email addresses must comply with GDPR/CCPA — accessible
  privacy policy, no pre-checked consent boxes.

## Non-Goals

- Building or migrating the search infrastructure.
- Improving product content quality or catalog taxonomy, which is a separate content task.
- External SEO and Google Search optimization.

## Common Failure Patterns

- **The "Invisible" Search:** Hiding the search input behind an icon on desktop,
  forcing an extra click for high-intent users.
- **The Dead-End:** A "No results found" page with no further links or
  recommendations.
- **Relevancy Drift:** Showing thousands of irrelevant results because the
  engine is using "OR" logic (any word matches) instead of "AND" logic (all
  words match).
- **Mobile Keyboard Conflict:** Not using the correct input type, causing the
  mobile keyboard to block the search results as they appear.
- **The Input Wipeout:** Automatically clearing the search box on the
  results page, forcing a user who made a minor typo to retype the entire
  query.
- **Deceptive Recommendation Labels:** Showing a grid of random popular
  items under an unlabeled or "Search Results" heading, leading users to
  believe the site is broken because the items don't match their query.
- **The Search Button Loop:** Displaying "no results found" with a search
  button that redirects to the homepage instead of letting the user refine
  their query inline.
- **Heavy Image Blowout:** Loading large, unoptimized images for visual
  category bubbles on a zero-results page, causing lag that drives an
  instant mobile exit.

## Validation Criteria

- [ ] **Search Conversion Rate:** Measure the percentage of users who search and
  subsequently convert. Compare this to the site-wide average.
- [ ] **Search Exit Rate:** The percentage of users who leave the site from the
  search results page. Goal: Decrease.
- [ ] **Time to First Click:** How long it takes a user to click a result after
  searching. Goal: Decrease.
- [ ] **Zero-Results Rate:** The percentage of total searches that return no
  results. Goal: Decrease via synonym mapping and typo handling.
- [ ] **Zero-Results Exit Rate:** (Exits from Zero-Results Pages / Total
  Views of Zero-Results Pages) * 100. Target: 25-40% relative reduction.
- [ ] **Search Session Conversion Rate (SSCR):** The conversion rate of
  users who hit a zero-results page but went on to buy. Target: 10-20%
  absolute recovery lift.
- [ ] **Search Refinement Rate:** The percentage of users who hit zero
  results and immediately search again using the inline search box. Goal:
  Increase via auto-suggest and persistent input.
- [ ] **Recovery Lead Volume:** Track qualified leads generated from
  "Request a Product" forms or live chat prompts triggered on zero-results
  pages.
