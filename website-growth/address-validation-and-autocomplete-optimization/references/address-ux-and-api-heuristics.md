# Address Entry UX & API Integration Heuristics

This reference guide details UX patterns, mobile input attributes, postal validation APIs, internationalization rules, and accessibility considerations for address autocomplete optimization.

---

## 1. Top Predictive Address APIs Comparison

Selecting the right address lookup and verification provider depends on global footprint, latency, CASS certification requirements, and pricing models.

| API Provider | Key Strengths | Best Use Cases | Latency / Accuracy |
| :--- | :--- | :--- | :--- |
| **Google Places API (Autocomplete)** | Dominant global coverage, familiar UX, excellent fuzzy matching for informal queries | Global e-commerce, D2C brands with broad international customer bases | Very Low Latency (~100ms), High fuzzy matching |
| **Loqate (GBG)** | Purpose-built address capture, direct integration with national postal authorities, international format normalization | Enterprise e-commerce, cross-border retail, strict postal compliance | Low Latency, Very High Postal Accuracy |
| **Smarty (formerly SmartyStreets)** | CASS-certified US/International address validation, ZIP+4 verification, rooftop geocoding | US/Canada-focused e-commerce, logistics-heavy shipping | Extremely High Postal Accuracy, Real-time validation |
| **Radar Address Autocomplete** | Developer-friendly, integrated with geofencing and location APIs, predictable pricing | Mobile apps, modern web apps | Low Latency, High Accuracy |
| **USPS Web Tools API** | Free official US Postal Service address normalization | Secondary validation for US domestic orders | Medium Latency, US domestic only |

---

## 2. HTML Form Markup & Mobile Keyboard Attributes

Configuring proper standard HTML attributes ensures browser auto-fill works seamlessly alongside custom autocomplete scripts, while invoking the optimal mobile keyboard.

### Standard HTML5 Code Snippet

```html
<!-- Single Predictive Address Search Input -->
<div class="form-group">
  <label for="shipping-address-search">Shipping Address</label>
  <input
    type="text"
    id="shipping-address-search"
    name="shipping_address_search"
    autocomplete="shipping address-line1"
    autocorrect="off"
    autocapitalize="words"
    spellcheck="false"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded="false"
    aria-owns="address-suggestions-list"
    placeholder="Start typing your address..."
  />
  <ul id="address-suggestions-list" role="listbox" class="suggestions-dropdown hidden"></ul>
</div>

<button type="button" id="toggle-manual-address" class="btn-link">
  Enter address manually
</button>

<!-- Parsed Sub-fields (Visible or Collapsed) -->
<div id="parsed-address-fields" class="address-fields-grid">
  <div class="form-group">
    <label for="address-line1">Street Address</label>
    <input
      type="text"
      id="address-line1"
      name="address1"
      autocomplete="shipping address-line1"
      autocorrect="off"
      autocapitalize="words"
      required
    />
  </div>

  <div class="form-group">
    <label for="address-line2">Apartment, suite, unit (optional)</label>
    <input
      type="text"
      id="address-line2"
      name="address2"
      autocomplete="shipping address-line2"
      autocorrect="off"
      autocapitalize="words"
    />
  </div>

  <div class="form-group">
    <label for="city">City</label>
    <input
      type="text"
      id="city"
      name="city"
      autocomplete="shipping address-level2"
      autocapitalize="words"
      required
    />
  </div>

  <div class="form-group">
    <label for="state">State / Province</label>
    <select id="state" name="state" autocomplete="shipping address-level1" required>
      <option value="">Select State</option>
      <!-- Options -->
    </select>
  </div>

  <div class="form-group">
    <label for="postal-code">ZIP / Postal Code</label>
    <input
      type="text"
      id="postal-code"
      name="postal_code"
      autocomplete="shipping postal-code"
      inputmode="numeric"
      pattern="[0-9]*"
      required
    />
  </div>
</div>
```

---

## 3. Addressing Edge Cases & Heuristics

### Apartment / Suite Number Handling
- **Problem**: 25% of address validation failures occur because customers omit unit numbers for multi-family dwellings.
- **Solution**:
  1. Detect building type from API metadata (`building_type == "multi_dwelling"` or `subpremises_required == true`).
  2. If unit number is absent, dynamically highlight `address-line2` with inline text: *"Building detected. Please enter your Apartment, Suite, or Unit number."*
  3. Never hard-block checkout if the user insists they do not have a unit number (e.g., single-family house split into commercial zoning).

### Military APO / FPO / DPO Addresses
- **State Codes**: Armed Forces Americas (`AA`), Armed Forces Europe (`AE`), Armed Forces Pacific (`AP`).
- **City Names**: APO (Army Post Office), FPO (Fleet Post Office), DPO (Diplomatic Post Office).
- **Country**: Must always be set to `United States` for USPS postal rates.
- **Rule**: Ensure dropdown for State includes AA, AE, and AP options, and skip standard state validation rules when APO/FPO city is specified.

### International Address Layout Adaptations

| Country / Region | Field Ordering Priority | Postal Code Terminology | Notes |
| :--- | :--- | :--- | :--- |
| **United States** | Street, Apt, City, State, ZIP | ZIP Code | Numeric 5-digit or ZIP+4 |
| **United Kingdom** | House Number/Street, Town/City, Postcode | Postcode | Alphanumeric (e.g., SW1A 1AA); Postal code drives street lookup |
| **Canada** | Street, Apt, City, Province, Postal Code | Postal Code | Alphanumeric (e.g., K1A 0B1); Uppercase formatting required |
| **Japan** | Postal Code, Prefecture, City, Block/Building | Postal Code (〒) | Postal code comes FIRST; layout flows top-down from prefecture to street |
| **Germany / EU** | Street & Number, ZIP Code, City, Country | Postleitzahl (PLZ) | ZIP Code appears BEFORE City name (e.g., 10115 Berlin) |

---

## 4. Accessibility (WCAG 2.1 AA) Patterns

1. **ARIA Live Announcements**:
   - When autocomplete predictions populate, announce result count via an off-screen `aria-live="polite"` region: *"5 address suggestions available. Use Up and Down arrows to navigate."*
2. **Keyboard Navigation Matrix**:
   - `ArrowDown`: Moves highlight to next suggestion in list.
   - `ArrowUp`: Moves highlight to previous suggestion.
   - `Enter`: Selects highlighted suggestion, closes dropdown, populates fields, and shifts focus to Next Input (`address-line2` or Phone).
   - `Escape`: Closes dropdown, retains currently typed raw text in input.
3. **High Contrast & Touch Target Sizing**:
   - Touch target height for suggestion items must be at least **44px × 44px** on mobile screens.
   - Focused suggestion items must have a minimum contrast ratio of **3:1** against unselected background.
