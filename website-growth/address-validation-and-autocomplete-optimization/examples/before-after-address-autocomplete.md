# Before & After: Address Validation & Autocomplete Optimization

## Context & Baseline Metrics

**Company:** ApexOutdoors (DTC Outdoor Gear & Footwear retailer)
**Monthly Traffic:** 450,000 visitors (68% mobile, 32% desktop)
**Monthly Orders:** ~18,000 packages shipped
**Baseline Problem:**
- **Checkout Abandonment at Shipping Step:** 24.5% of users who reached the shipping address step abandoned checkout.
- **Mobile Address Completion Time:** Average 48 seconds across 7 manual text fields.
- **Return-to-Sender (RTS) Rate:** 3.8% of shipped orders were returned as undelivered due to typos in street numbers, missing suite/apt numbers, or invalid zip codes.
- **Carrier Surcharge Fees:** $14,200/month in FedEx/UPS address correction fees ($18 per package fee for ~790 corrected packages/month).

---

## The BEFORE Scenario (Manual 7-Field Form)

### Form Architecture & UX

```html
<!-- BEFORE: Tedious, 7-field manual entry without autocomplete or inputmode triggers -->
<form id="shipping-address-form">
  <div class="field-group">
    <label for="address1">Street Address</label>
    <!-- Missing proper autocomplete attributes -->
    <input type="text" id="address1" name="address1" placeholder="123 Main St" required>
  </div>

  <div class="field-group">
    <label for="address2">Apt / Suite / Unit</label>
    <input type="text" id="address2" name="address2" placeholder="Apt #">
  </div>

  <div class="field-group">
    <label for="city">City</label>
    <input type="text" id="city" name="city" required>
  </div>

  <div class="row">
    <div class="field-group col-6">
      <label for="state">State</label>
      <input type="text" id="state" name="state" required placeholder="TX">
    </div>
    <div class="field-group col-6">
      <label for="zip">Zip Code</label>
      <!-- Missing inputmode="numeric" triggers QWERTY keyboard instead of number pad on mobile -->
      <input type="text" id="zip" name="zip" required>
    </div>
  </div>

  <div class="field-group">
    <label for="country">Country</label>
    <select id="country" name="country">
      <option value="US">United States</option>
      <option value="CA">Canada</option>
    </select>
  </div>
</form>
```

### Key Issues in BEFORE Implementation

1. **High Friction:** Required typing up to 7 separate fields on a mobile touch screen.
2. **Keyboard Frustration:** Zip code field brought up the standard alphabetic keyboard on mobile devices, forcing users to manually switch keypads.
3. **No Validation:** Typos such as `"1234 Main Stt"` or incorrect zip codes (`78701` entered for a Dallas address) were accepted without warning during checkout, resulting in carrier delays.
4. **Missing Unit Numbers:** Apartment dwellers frequently forgot to enter their Apt/Suite number because the `Address 2` field was marked as generic optional text.

---

## The AFTER Scenario (Single-Line Predictive Autocomplete + CASS Validation)

### Form Architecture & UX

```html
<!-- AFTER: Single-line predictive lookup + smart auto-fill + proper HTML attributes -->
<form id="shipping-address-form" class="optimized-address-form">

  <!-- Primary Predictive Autocomplete Input -->
  <div class="field-group lookup-group">
    <label for="address-lookup">Shipping Address</label>
    <div class="autocomplete-wrapper">
      <input
        type="text"
        id="address-lookup"
        name="address-lookup"
        placeholder="Start typing your address..."
        autocomplete="shipping address-line1"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-controls="address-suggestions-list"
        required
      />
      <span class="search-icon" aria-hidden="true">🔍</span>
    </div>

    <!-- Dynamic Suggestion Dropdown Container -->
    <ul id="address-suggestions-list" class="suggestions-dropdown" role="listbox" hidden>
      <!-- Suggestions injected via JavaScript -->
    </ul>

    <button type="button" id="manual-entry-toggle" class="btn-link-subtle">
      Enter address manually
    </button>
  </div>

  <!-- Apt/Suite Prompt Trigger (Revealed when building-level geocode is detected) -->
  <div class="field-group" id="unit-field-container">
    <label for="shipping-unit">Apartment, Suite, Unit # <span class="badge-optional">(Optional / Recommended)</span></label>
    <input
      type="text"
      id="shipping-unit"
      name="shipping-unit"
      placeholder="e.g. Apt 4B, Suite 200"
      autocomplete="shipping address-line2"
    />
  </div>

  <!-- Structured Auto-Filled Secondary Fields (Visible for confirmation, auto-populated) -->
  <div id="structured-fields-wrapper" class="collapsible-fields">
    <div class="field-group">
      <label for="shipping-street">Street Address</label>
      <input type="text" id="shipping-street" name="shipping-street" autocomplete="shipping address-line1" required readonly />
    </div>

    <div class="row">
      <div class="field-group col-4">
        <label for="shipping-city">City</label>
        <input type="text" id="shipping-city" name="shipping-city" autocomplete="shipping address-level2" required />
      </div>
      <div class="field-group col-4">
        <label for="shipping-state">State / Province</label>
        <input type="text" id="shipping-state" name="shipping-state" autocomplete="shipping address-level1" required />
      </div>
      <div class="field-group col-4">
        <label for="shipping-zip">Postal Code</label>
        <!-- Correct numeric inputmode and pattern for instant mobile keypad trigger -->
        <input
          type="text"
          id="shipping-zip"
          name="shipping-zip"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="shipping postal-code"
          required
        />
      </div>
    </div>
  </div>

  <!-- Real-Time CASS Standardization Modal (Rendered on step submit if discrepancy detected) -->
  <dialog id="address-validation-modal" class="address-modal">
    <div class="modal-content">
      <h3>Confirm Your Shipping Address</h3>
      <p>We verified your address with postal carrier databases to ensure fast delivery:</p>

      <div class="address-comparison-cards">
        <label class="card-option selected">
          <input type="radio" name="address-choice" value="suggested" checked />
          <div class="card-body">
            <span class="badge-recommended">Recommended (Verified)</span>
            <strong>1234 Main St Apt 4B</strong>
            <p>Austin, TX 78701-1234</p>
          </div>
        </label>

        <label class="card-option">
          <input type="radio" name="address-choice" value="original" />
          <div class="card-body">
            <span class="badge-original">Original (As Entered)</span>
            <strong>1234 main street #4b</strong>
            <p>Austin, TX 78701</p>
          </div>
        </label>
      </div>

      <div class="modal-actions">
        <button type="button" id="confirm-address-btn" class="btn-primary">Use Selected Address</button>
      </div>
    </div>
  </dialog>
</form>
```

---

## Measurable Results & Outcomes

After deploying single-line predictive lookup and CASS real-time validation across desktop and mobile checkouts for 60 days:

| Metric | BEFORE | AFTER | Change |
| :--- | :--- | :--- | :--- |
| **Address Form Completion Time (Mobile)** | 48 seconds | 14 seconds | **-70.8% (-34 sec)** |
| **Shipping Step Abandonment Rate** | 24.5% | 18.1% | **-26.1% (-6.4 percentage points)** |
| **Overall Checkout Completion Rate** | 68.2% | 73.4% | **+5.2 percentage points** |
| **Return-to-Sender (RTS) Rate** | 3.8% | 0.9% | **-76.3% reduction** |
| **Monthly Carrier Address Surcharges** | $14,200 / mo | $2,100 / mo | **$12,100 / month saved** |
| **Customer Support Address Tickets** | 420 tickets / mo | 85 tickets / mo | **-79.7% reduction** |
