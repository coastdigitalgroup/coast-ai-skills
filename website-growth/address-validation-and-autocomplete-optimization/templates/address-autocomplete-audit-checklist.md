# Address Validation and Autocomplete Audit Checklist

Use this checklist to audit and optimize shipping/billing address form fields, predictive lookup APIs, mobile input configurations, and postal validation rules.

---

## 1. Initial Form Architecture & HTML Markup

- [ ] **Predictive Single-Line Primary Field**: Is a single predictive search field ("Start typing your address...") provided as the default entry method?
- [ ] **Manual Entry Fallback Link**: Is a clear, visible link or toggle ("Enter address manually") present at all times?
- [ ] **Standard HTML Autocomplete Tokens**: Are standard W3C autocomplete attributes used across all parsed fields?
  - [ ] `autocomplete="shipping address-line1"` / `autocomplete="billing address-line1"`
  - [ ] `autocomplete="shipping address-line2"` / `autocomplete="billing address-line2"`
  - [ ] `autocomplete="shipping address-level2"` (City)
  - [ ] `autocomplete="shipping address-level1"` (State/Province)
  - [ ] `autocomplete="shipping postal-code"`
  - [ ] `autocomplete="shipping country"`
- [ ] **Autocorrect & Spellcheck Suppression**: Are `autocorrect="off"` and `spellcheck="false"` set on street address fields to prevent mobile browsers from corrupting proper street names?
- [ ] **Mobile Keyboard Attributes**:
  - [ ] Does Postal Code use `inputmode="numeric"` and `pattern="[0-9]*"` for numeric postal regions (US/Japan)?
  - [ ] Does Postal Code use `inputmode="text"` for alphanumeric regions (UK/Canada)?
- [ ] **Casing Controls**: Is `autocapitalize="words"` specified on address, city, and state inputs?

---

## 2. Predictive Autocomplete UX & Performance

- [ ] **Debounce & Latency**: Is API querying debounced between 150ms–250ms to prevent unnecessary API cost and DOM lag?
- [ ] **Minimum Trigger Character Threshold**: Does predictive lookup wait until at least 3 characters are typed before making API calls?
- [ ] **Clear Dropdown Hierarchy**: Do dropdown menu items clearly distinguish Street Address, City, State, ZIP, and Country?
- [ ] **Search Term Highlighting**: Are matching characters highlighted bold within the prediction dropdown?
- [ ] **Keyboard Accessibility**:
  - [ ] Can users navigate suggestions using `ArrowUp` and `ArrowDown`?
  - [ ] Does pressing `Enter` or `Tab` select the active suggestion?
  - [ ] Does `Escape` close the prediction dropdown without clearing typed input?
  - [ ] Does the container implement `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, and `aria-activedescendant`?
- [ ] **Data Preservation**: Does selecting a suggestion fill all underlying hidden/collapsed fields without truncating long street names?

---

## 3. Secondary Unit / Apartment / Suite Handling

- [ ] **Multi-Unit Detection**: Does the validation API identify when a selected base street address belongs to a multi-unit building?
- [ ] **Unit Prompt Trigger**: If a multi-unit address is selected without a unit number, does the UI show a non-blocking prompt: *"Apartment, suite, or unit number recommended for this building"*?
- [ ] **Line 2 Labeling**: Is Address Line 2 labeled clearly as *"Apartment, suite, unit, building, floor, etc. (optional)"*?
- [ ] **Pre-typed Suite Preservation**: If a user types "123 Main St Apt 4B" in the single search line, does the parser separate "123 Main St" into Line 1 and "Apt 4B" into Line 2 without losing the suite details?

---

## 4. Real-Time Postal Validation & Normalization

- [ ] **Authoritative Postal Verification**: Is the address checked against official postal databases (USPS CASS, FedEx Address Validation, Royal Mail PAF, etc.) upon selection or step submission?
- [ ] **Silent Normalization**: Are minor formatting changes (e.g., "Street" → "St", ZIP → ZIP+4) accepted silently without popping up intrusive blocking modals?
- [ ] **Ambiguous Address Recommendation UX**: If a significant discrepancy is detected, is a soft recommendation box displayed offering:
  - `[Suggested Verified Address]`
  - `[Use As Entered]`
- [ ] **No Hard Blockers**: Are users allowed to proceed with "Use As Entered" even if an address is unverified (e.g., brand-new housing development or rural route)?

---

## 5. Internationalization & Edge Cases

- [ ] **Dynamic Field Labeling**: Do field labels update based on the selected country (e.g., "ZIP Code" for US, "Postcode" for UK, "Postal Code" for Canada; "State" vs "Province" vs "County")?
- [ ] **Postal Code Pre-fill**: When entering addresses manually, does entering a Postal Code automatically pre-fill City and State/Province?
- [ ] **Military & Overseas Address Support**: Can the form process APO/FPO/DPO military addresses correctly with AA/AE/AP state designations?
- [ ] **PO Box Acceptance**: Does the form accept P.O. Box addresses unless explicit carrier constraints prohibit PO boxes (in which case an inline explanatory message is shown)?

---

## 6. Error Recovery & API Fallbacks

- [ ] **API Timeout / Outage Handling**: If the autocomplete API fails, times out (>1500ms), or returns a 50x error, does the form instantly fallback to expanded standard text fields without alerting or blocking the user?
- [ ] **Graceful Degraded Validation**: Does checkout proceed smoothly if the postal verification service is down?
- [ ] **Error Message Clarity**: Are field error messages specific (e.g., *"Please enter a valid postal code for Texas"* instead of generic *"Invalid address"*)?
