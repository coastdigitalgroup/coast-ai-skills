# Address Autocomplete & Validation Audit Checklist

Use this audit template to evaluate, score, and optimize address entry forms on mobile and desktop checkout flows.

---

## 1. Audit Information & Metadata

- **Site / Brand Name:** ________________________
- **Audit Date:** ________________________
- **Auditor Name:** ________________________
- **Device & Browser Tested:** iOS Safari / Android Chrome / Desktop Chrome / Desktop Safari
- **Target Country Scope:** US Only / Multi-National / Global

---

## 2. Quantitative Scoring Matrix (100 Points Total)

Assign points for each item passed based on direct testing of the live address form.

| Category | Audit Metric / Heuristic | Max Points | Score | Pass/Fail | Notes / Observations |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **UX & Entry Speed** | Single-line predictive lookup displayed by default | 15 | | | |
| | Manual entry override toggle clearly accessible | 10 | | | |
| | Selecting suggestion auto-fills all secondary fields | 10 | | | |
| | Apartment / Suite / Unit prompt triggers for multi-unit geocodes | 10 | | | |
| **Mobile & HTML** | `inputmode="numeric"` configured on Postal Code input | 10 | | | |
| | Standard HTML `autocomplete` attributes present on all fields | 10 | | | |
| | Mobile keypads auto-switch correctly without layout shift | 5 | | | |
| **Validation & Data** | Real-time CASS / carrier postal validation prompt active | 10 | | | |
| | Soft-block warning allows user confirmation ("Keep As Entered") | 10 | | | |
| | API response latency under 200ms with query debouncing | 10 | | | |
| **Total Score** | **Overall Form Quality Score** | **100** | | | **Grade:** (A: 90+, B: 80-89, C: 70-79, F: <70) |

---

## 3. Detailed Audit Protocol & Checklist

### Section A: Predictive Autocomplete & Lookup

- [ ] **A1. Single-Line Search Box Available:** Form displays a prominent predictive address lookup input field on initial load.
- [ ] **A2. Debounced API Execution:** Search queries fire after 3+ characters entered with 200–250ms debouncing (no lag or wasted API requests).
- [ ] **A3. Visual Highlighting:** Keystrokes entered by the user are bolded or highlighted within suggestion list items.
- [ ] **A4. Automatic Field Allocation:** Selecting an address correctly distributes components into Street 1, City, State/Province, Zip/Postal Code, and Country.
- [ ] **A5. Geotargeted Priority:** Suggestions default to the user's detected country or selected shipping destination country.

### Section B: Secondary Unit (Apt/Suite) & Manual Fallbacks

- [ ] **B1. Unit Field Prompt:** Multi-tenant or apartment addresses explicitly prompt for Suite/Unit/Apt number.
- [ ] **B2. Manual Entry Fallback:** Users can click "Enter address manually" at any time to reveal standard text fields.
- [ ] **B3. Preserved Keystrokes:** Switching to manual entry preserves any text already typed into the predictive lookup field.
- [ ] **B4. Field Access:** Auto-filled fields (City, State, Zip) remain editable if the user needs to modify a specific detail.

### Section C: Mobile Ergonomics & Native Attributes

- [ ] **C1. Postal Code Keypad:** Postal code input uses `inputmode="numeric"` or `pattern="[0-9]*"` to trigger the mobile numeric keypad.
- [ ] **C2. Standard Autocomplete Tokens:** Fields utilize standard HTML tokens (`shipping address-line1`, `shipping address-level2`, `shipping postal-code`, etc.).
- [ ] **C3. Native Autofill Compatibility:** Browser/1Password/iCloud Keychain autofill functions without conflicting with API autocomplete JS handlers.
- [ ] **C4. Autocorrect Safety:** Street address inputs set `autocorrect="off"` and `spellcheck="false"` to prevent unwanted phone autocorrect replacements.

### Section D: Real-Time Postal Validation (CASS)

- [ ] **D1. Carrier Database Verification:** Addresses are verified against official postal records (USPS CASS, Royal Mail PAF, Canada Post) on blur/submit.
- [ ] **D2. Non-Disruptive Standardization:** Minor formatting changes (e.g., "Street" -> "St") apply automatically without popup friction.
- [ ] **D3. Suggested vs. Original Choice Modal:** Clear side-by-side comparison provided when major discrepancies or zip adjustments occur.
- [ ] **D4. Advisory Non-Blocking Warning:** Users can override unverified warnings if they confirm an address is valid (e.g., new construction).

---

## 4. Remediation Action Plan Template

| Identified Issue | Priority (P0-P3) | Recommended Fix | Assigned Owner | Target Completion |
| :--- | :---: | :--- | :--- | :--- |
| *e.g., Postal code shows QWERTY keypad on iOS* | P1 | Add `inputmode="numeric"` to `#shipping-zip` input | Frontend Dev | Day 1 |
| *e.g., No manual fallback when rural address fails API lookup* | P0 | Add `#manual-entry-toggle` link to reveal unhidden manual fields | UX Engineer | Day 2 |
| *e.g., Missing CASS standardization check on checkout submit* | P0 | Integrate Loqate / Smarty / USPS CASS API verification hook | Backend Dev | Day 5 |
