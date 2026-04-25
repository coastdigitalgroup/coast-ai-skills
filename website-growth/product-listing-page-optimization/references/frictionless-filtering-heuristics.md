# Frictionless Filtering Heuristics

Filtering is not a feature; it is a wayfinding tool. Good filtering reduces the
mental energy required to browse.

## 1. Faceted Search UX

- **The "Instant Update" Rule:** Results should update immediately as a filter
  is checked. Avoid "Apply" buttons unless the page load is extremely slow.
- **Selection Visibility:** Active filters should be summarized at the top of
  the results (as "pills") so users can see and remove them easily.
- **URL Sync:** The browser URL should update with filter parameters (e.g.,
  `?size=L&color=blue`) so users can share or bookmark their filtered view.

## 2. Information Scent in Filters

- **Hide Empty Options:** Don't show "Red" if there are no red items in the
  current selection.
- **Show Counts:** "Cotton (42)" provides better guidance than just "Cotton."
- **Contextual Filters:** Only show relevant filters. Don't show "Megapixels" in
  the "Lens" category.

## 3. Sorting vs. Filtering

- **Filtering** is for **inclusion/exclusion** (I only want Red).
- **Sorting** is for **prioritization** (I want Red, but show the cheapest
  first).
- **Default Sort:** Always default to the sort that represents the highest value
  to the customer (e.g., "Recommended" or "Best Sellers").

## 4. The "No Results" Rescue

If a user filters down to zero products:

- Never just show "No results found."
- Provide a "Clear all filters" button.
- Offer "Recommended for you" or "Top sellers" as a fallback to keep them in the
  funnel.
