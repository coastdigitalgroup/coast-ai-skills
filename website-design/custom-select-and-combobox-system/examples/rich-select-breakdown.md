# Rich Custom Select & Combobox Examples

This document demonstrates the application of the **Custom Select and Combobox System** to two highly common, complex web design problems:

1. **Rich Country & Currency Selector (Single Select Combobox)**
2. **Multi-Select User Group / Role Assignment Dropdown (Multi-Select with Tokens)**

---

## Example 1: Rich Country & Currency Selector

### 1. Design Scenario
An e-commerce platform needs a localized country, language, and currency selector in its primary global header. This control cannot use a standard HTML `<select>` because:
- Each option needs to show a graphic country flag.
- Each option needs to display both the country name (e.g., "United Kingdom") and currency description (e.g., "GBP - Pound Sterling").
- There are over 100 countries supported, so a scroll-bounded list with a sticky search input (Combobox) is mandatory.

---

### 2. Desktop Visual Anatomy & Spacing Spec

The trigger sits inside the header bar, and the panel opens downward when activated.

```text
+-------------------------------------------------------------+
|  Label: Shopping From                                       |
|  +-------------------------------------------------------+  |
|  | [Flag]  United Kingdom (GBP)                     [^]  |  | <-- Trigger Button (Open State)
|  +-------------------------------------------------------+  |
+--|-------------------------------------------------------|--+
   |  [Q] Search country, currency, or ISO...              |    <-- Sticky Search input
   |-------------------------------------------------------|
   |  [Flag]  Canada                                       |    <-- Hovered Option
   |          CAD - Canadian Dollar | Language: EN         |
   |  [Check]                                              |
   |-------------------------------------------------------|
   |  [Flag]  Germany                                      |    <-- Default Option
   |          EUR - Euro | Language: DE                     |
   |-------------------------------------------------------|
   |  [Flag]  United Kingdom                               |    <-- Active / Selected Option
   |          GBP - British Pound | Language: EN           |
   +-------------------------------------------------------+
```

#### Spatial Breakdown (Desktop)
- **Trigger Container:**
  - Width: `320px` (standard desktop header input spacing).
  - Height: `44px` (high-touch target, comfort line-height).
  - Padding: `12px 16px` (aligns with `--space-s` to `--space-m`).
  - Outline: `1px solid var(--border-neutral-high)` (`3:1` contrast ratio).
- **Dropdown Panel Container:**
  - Position: `absolute`, directly below the trigger (offset `y = 4px` spacing).
  - Width: Matches the trigger exactly (`320px`).
  - Max Height: `300px` (approx. 4.5 options visible before scrolling).
  - Border Radius: `6px` (`--radius-medium`).
  - Box Shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` (Elevation Level 3).
- **Option Row Anatomy:**
  - Padding: `10px 16px` (generous clickable area).
  - Column 1 (Visual): Flag asset container (`24px x 16px`), `margin-right: 12px`.
  - Column 2 (Text Stack):
    - Title: Country Name, `14px` bold, high contrast (`7:1` against panel bg).
    - Subtitle: Currency and ISO code, `12px` secondary weight (`4.5:1` contrast).
  - Column 3 (Selection Cue): A high-contrast SVG checkmark icon (`16px x 16px`), right-aligned.

---

### 3. Responsive Mobile Adaptation (Mobile Bottom Sheet)

On screens below `640px` wide, the absolute dropdown panel is replaced with a modal **Bottom Sheet** overlay to optimize for thumb-reachability and prevent layout cramping.

```text
+------------------------------------+
|                                    |
|         [ Background Scrim ]       |
|                                    |
+------------------------------------+
| [=] Grab Handle                    | <-- Drag indicator
|                                    |
| Select Your Location               | <-- Title
|                                    |
| +--------------------------------+ |
| | [Q] Search country or currency | | <-- Sticky Search Input
| +--------------------------------+ |
|                                    |
| +--------------------------------+ |
| | [Flag] Canada                  | | <-- Tall Row (56px) for easy tap
| |        CAD - Canadian Dollar   | |
| +--------------------------------+ |
| +--------------------------------+ |
| | [Flag] United Kingdom (Active) | | <-- Checked Selected Row
| |        GBP - British Pound     | |
| +--------------------------------+ |
+------------------------------------+
```

#### Mobile Specifications
- **Trigger Action:** Tapping the desktop trigger element opens the sheet sliding up from the bottom edge.
- **Scrim Overlay:** Dark overlay (`rgba(0,0,0,0.5)`) covers background content and prevents interaction.
- **Sheet Height:** Dynamic, caps at `70%` of viewport height to ensure users maintain top-level context.
- **Touch Targets:** Option rows are increased to `56px` vertical height to guarantee error-free fingertip tapping (exceeds WCAG 2.2 SC 2.5.8).
- **Dismiss Control:** Large, explicit close "X" button (`44px` target size) pinned to top-right of the sheet, alongside "Escape" key binding and click-outside-to-close on the scrim.

---

### 4. Accessibility Specs (Developer Handoff Guide)

```html
<!-- Trigger Button -->
<button
  id="country-selector-trigger"
  type="button"
  role="combobox"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-controls="country-selector-listbox"
  aria-autocomplete="list"
  class="custom-select-trigger">
  <span class="flag-icon ca-flag"></span>
  <span class="trigger-value">Canada (CAD)</span>
  <span class="arrow-indicator" aria-hidden="true">▼</span>
</button>

<!-- Dropdown Menu / Panel -->
<div
  id="country-selector-panel"
  class="dropdown-panel select-hidden">

  <!-- Search Input -->
  <div class="search-container">
    <input
      type="text"
      id="country-search-input"
      role="searchbox"
      aria-controls="country-selector-listbox"
      placeholder="Search country, currency, or ISO..."
      aria-label="Filter countries">
  </div>

  <!-- Listbox Container -->
  <ul
    id="country-selector-listbox"
    role="listbox"
    aria-labelledby="country-selector-trigger"
    tabindex="-1">

    <!-- Option Item -->
    <li
      id="opt-ca"
      role="option"
      aria-selected="true"
      class="option-item option-selected option-focused">
      <span class="flag-icon ca-flag" aria-hidden="true"></span>
      <div class="option-text-stack">
        <span class="option-title">Canada</span>
        <span class="option-subtitle">CAD - Canadian Dollar | Language: EN</span>
      </div>
      <span class="check-icon" aria-hidden="true">✔</span>
    </li>

    <li
      id="opt-de"
      role="option"
      aria-selected="false"
      class="option-item">
      <span class="flag-icon de-flag" aria-hidden="true"></span>
      <div class="option-text-stack">
        <span class="option-title">Germany</span>
        <span class="option-subtitle">EUR - Euro | Language: DE</span>
      </div>
    </li>
  </ul>
</div>
```

---

## Example 2: Multi-Select User Group Assignment Dropdown

### 1. Design Scenario
An enterprise SaaS administration portal requires administrators to assign one or more User Groups (e.g., "Billing Admins", "Security Officers", "Product Managers", "External Contractors") to employee profiles.
- This is a high-stakes, multi-value field.
- Visual token chips must wrap dynamically inside the input box so the admin can review active selections instantly.
- Individual tokens must be dismissible directly from the trigger field.

---

### 2. Desktop Visual Anatomy & Spacing Spec

```text
Assign User Groups (Label)
+-----------------------------------------------------------+
|  [Billing Admins [x]]  [Security Officers [x]]            |
|  Type to search...                                   [^]  | <-- Multi-Trigger containing chip tokens
+-----------------------------------------------------------+
|  [Q] Search user groups...                                |
|-----------------------------------------------------------|
|  [ ] Billing Admins (Selected in Input)                  | <-- Option (Disabled selection in list)
|  [ ] External Contractors                                 | <-- Option (Default)
|  [x] Security Officers (Active in Input)                  | <-- Option (Selected)
+-----------------------------------------------------------+
```

#### Spatial Breakdown (Multi-Select)
- **Multi-Select Trigger Container:**
  - Width: `480px` (ample space for multiple tag chips).
  - Height: `auto` (grows vertically as chips wrap, with `min-height: 44px`).
  - Gap Spacing: `6px` spacing (`--space-xxs`) between token chips.
  - Active Ring: `2px solid var(--primary-brand)` (`focus-indicator-design-system` compliant).
- **Token Chip Anatomy:**
  - Height: `28px`.
  - Padding: `4px 8px 4px 10px` (provides compact internal balance).
  - Background: Neutral tint background with subtle dark border.
  - Text size: `12px` bold.
  - Close Trigger (x): A dedicated touch area (`16px x 16px`) on the right, with a visible contrast outline and custom hover state.
- **Dropdown Listbox:**
  - Option items contain standard checkboxes on the left to indicate multi-select capability.
  - Selected options stay highlighted in the list to preserve visual continuity.

---

### 3. Mobile Adaptation Strategy

Because multi-select chips occupy substantial horizontal space, on mobile devices (below `640px` wide):
1. **Collapsing Token Display:** The active chips collapse inside the trigger into a summary text block (e.g., "3 Groups Selected") to prevent the input field from taking up the entire screen.
2. **Dedicated Settings Drawer:** Clicking the trigger collapses into a full-height bottom sheet where administrators can easily check/uncheck roles using large checkbox cards.
3. **Save Action Button:** The mobile drawer includes a persistent floating "Confirm Selections" action button at the bottom of the drawer to submit changes securely.
