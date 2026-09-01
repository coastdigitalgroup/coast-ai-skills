# Address Entry UX & Postal API Heuristics Reference

This reference guide details core UX heuristics, API integration patterns, mobile touch mechanics, and international address formatting rules for optimizing address entry in checkout systems.

---

## 1. Core UX Heuristics for Address Entry

### A. The "Single-Field Start" Principle
Presenting 6+ blank input fields simultaneously creates high perceived cognitive load and form fatigue, especially on mobile devices.
- **Guideline:** Render a single `Search Address` lookup field as the visual anchor.
- **Behavior:** Upon selection of a verified address prediction, auto-populate and expand the secondary structured fields (`Street`, `City`, `State`, `Zip`, `Country`).

### B. The Non-Destructive Manual Fallback Rule
API address lookups can fail for newly constructed housing developments, rural route addresses, military APO/FPO locations, or private unindexed properties.
- **Guideline:** Never trap users in a mandatory API selection dropdown.
- **Behavior:** Always provide an explicit `Enter address manually` action link. If clicked, preserve any text already typed into the lookup field and populate it into `Address Line 1`.

### C. The Secondary Unit (Apt/Suite) Disambiguation Pattern
Street-level geocodes (e.g., Google Places `premise` or `street_number`) do not capture individual apartment or suite numbers, leading to unverified or undeliverable multi-family shipments.
- **Guideline:** Detect when a selected geocode represents a multi-tenant residential or commercial building.
- **Behavior:** Automatically focus the `Apartment, Suite, Unit #` field and display explicit helper text: *"Please confirm your apartment or suite number to ensure accurate carrier delivery."*

---

## 2. Mobile Touch Mechanics & Native HTML Attributes

To maximize browser native autofill rates and eliminate manual keypad toggling, shipping address fields must implement exact W3C HTML autocomplete tokens and input mode triggers.

### Recommended HTML Attribute Matrix

| Field | `autocomplete` Attribute | `inputmode` Attribute | `autocorrect` / `spellcheck` | `type` |
| :--- | :--- | :--- | :--- | :--- |
| **Lookup Input** | `shipping address-line1` | `text` | `autocorrect="off"` `spellcheck="false"` | `text` |
| **Address Line 1** | `shipping address-line1` | `text` | `autocorrect="off"` `spellcheck="false"` | `text` |
| **Apt / Suite / Unit**| `shipping address-line2` | `text` | `autocorrect="off"` `spellcheck="false"` | `text` |
| **City / Suburb** | `shipping address-level2` | `text` | `autocorrect="off"` | `text` |
| **State / Province** | `shipping address-level1` | `text` | `autocorrect="off"` | `text` |
| **Postal Code** | `shipping postal-code` | `numeric` | `autocorrect="off"` | `text` |
| **Country** | `shipping country` | N/A | N/A | `select` or `text` |

> **Note on Postal Codes:** Use `inputmode="numeric"` with `pattern="[0-9]*"` for US/JP zip codes to launch the large number pad on mobile screens without requiring `<input type="number">` (which breaks leading zeroes and international alphanumeric postal codes like UK/Canada).

---

## 3. Postal API Integration Patterns & Optimization

### A. API Request Debouncing & Keystroke Thresholds
Calling predictive APIs on every single keypress wastes API quota and triggers UI jitter due to race conditions.
- **Threshold:** Require a minimum of **3 characters** before initiating predictive queries.
- **Debounce Window:** Implement a **200ms–250ms debounce delay** on keyup events.
- **Geofencing:** Restrict API predictions using the `componentRestrictions` or `country` bias parameter set to the currently active destination country.

### B. Real-Time CASS / USPS Postal Standardization Flowchart

```text
[ User Selects Address or Clicks Submit ]
                   │
                   ▼
┌──────────────────────────────────────────┐
│ Query CASS / Postal Carrier Database     │
│ (USPS, Canada Post, Royal Mail PAF, etc) │
└──────────────────┬───────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
  [ Exact Match ]     [ Discrepancy Found ]
         │                   │
         │                   ▼
         │        ┌────────────────────────────┐
         │        │ Minor Formatting Change?   │
         │        │ (e.g., Street -> St)       │
         │        └──────┬───────────────┬─────┘
         │               │ YES           │ NO (Zip/Apt mismatch)
         │               ▼               ▼
         │        ┌──────────────┐ ┌───────────────────────────┐
         │        │ Silent Auto- │ │ Display Side-by-Side      │
         │        │ Standardize  │ │ Comparison Selection Modal│
         │        └──────┬───────┘ └─────────────┬─────────────┘
         │               │                       │
         └───────────────┼───────────────────────┘
                         │
                         ▼
             [ Proceed to Payment Step ]
```

---

## 4. International Address Formatting & Layout Rules

Address form layouts must adjust dynamically based on the selected country:

1. **United States (US):**
   - Format: `Street Address` -> `Apt/Suite` -> `City` -> `State (Select/2-letter)` -> `ZIP Code (5 or 9 digit)`.
2. **United Kingdom (UK):**
   - Format: `Building Name/Number` -> `Street Address` -> `Town/City` -> `Postcode` (No State/Province field).
3. **Canada (CA):**
   - Format: `Street Address` -> `Apt/Unit` -> `City` -> `Province (Select)` -> `Postal Code (A1A 1A1 format)`.
4. **Japan (JP):**
   - Format: `Postal Code (7 digits)` -> `Prefecture` -> `City/Ward` -> `Sub-district/Street` -> `Building/Apartment`.
