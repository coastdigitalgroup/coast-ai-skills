# Forced Colors & High Contrast Mode Audit Checklist

Use this audit checklist to inspect web components, pages, and web applications for compatibility with Windows High Contrast Mode and the CSS `@media (forced-colors: active)` standard.

---

## Audit Metadata

- **Page / Component Name:** ________________________________________
- **Auditor:** ________________________________________
- **Date:** ________________________________________
- **Testing Environment(s):**
  - [ ] Chrome DevTools (`Emulate CSS media feature forced-colors: active`)
  - [ ] Edge DevTools (`Emulate CSS media feature forced-colors: active`)
  - [ ] Windows 11 Contrast Themes (Aquatic / Desert / Dusk / Night sky)
  - [ ] Firefox High Contrast Emulation (`browser.display.document_color_use`)

---

## Audit Checklist Items

### 1. Container Boundaries & Structural Layout

- [ ] **Card & Panel Boundaries:** Do floating cards, dashboard widgets, and content panels have a visible border (`border: 1px solid transparent` or `@media (forced-colors: active) { border-color: CanvasText; }`) separating them from the background canvas?
- [ ] **Modal & Dialog Backdrop:** Do modal dialogs, drawer panels, and lightboxes maintain clear, distinct borders separating the dialog container from the backdrop canvas?
- [ ] **Dropdowns & Popovers:** Are dropdown menus, autocomplete menus, tooltips, and popovers clearly outlined against page content?
- [ ] **Table Dividers & Grid Lines:** Are data table headers, rows, and cell dividers visible?

### 2. Interactive Focus Indicators

- [ ] **Keyboard Tab Walkthrough:** Press `Tab` through all interactive elements on the page. Does every button, link, input, custom control, and menu item display a high-contrast focus ring?
- [ ] **No Hidden Focus Rings:** Confirm no component uses `outline: none` or `outline: 0` without a forced-colors fallback outline (`outline: 2px solid Highlight`).
- [ ] **Focus Ring Visibility against Canvas:** Is the focus ring clearly distinct from both the element's default border and the surrounding `Canvas` background?

### 3. Custom Form Controls & Interactive States

- [ ] **Checkboxes & Radio Buttons:** Toggle custom checkboxes and radio buttons. Are checked vs. unchecked states unmistakably distinct?
- [ ] **Toggle Switches:** Flip custom toggle switches. Is the "On" state visually distinct from the "Off" state without relying on background color fill?
- [ ] **Tabs & Segmented Controls:** Select different tabs. Does the active/selected tab clearly stand out from inactive tabs using `Highlight` background/text or a visible indicator line?
- [ ] **Disabled States:** Inspect disabled buttons, inputs, and controls. Do they display in the muted system `GrayText` color and remain clearly distinguishable from active controls?

### 4. Icons, Images, and Status Indicators

- [ ] **SVG Action Icons:** Are standalone icon buttons (close `X`, search magnifying glass, trash delete, menu hamburger) fully visible against the system canvas?
- [ ] **Status Badges & Chips:** Do success, error, warning, and info badges retain visual boundaries and readable text without relying on custom background color fills?
- [ ] **Body Links:** Are inline text links clearly distinguished from body text by using `LinkText` color or explicit underlines?

### 5. Controlled Color Overrides (`forced-color-adjust`)

- [ ] **Color Preview Swatches:** Do color swatches or palette pickers use `forced-color-adjust: none` to preserve actual color values?
- [ ] **Swatch Boundary Protection:** Does every swatch using `forced-color-adjust: none` feature a visible border (`border: 2px solid CanvasText`) so it remains discernible against light or dark system canvases?
- [ ] **No Inappropriate Overrides:** Confirm `forced-color-adjust: none` is NOT used on general UI text, buttons, containers, or headers to preserve brand colors.

---

## Remediation Summary Table

| Component Name | Identified Issue | Required CSS Fix | Re-test Status |
| :--- | :--- | :--- | :--- |
| *Example: Primary Button* | Focus ring missing in high-contrast mode due to `box-shadow` reset. | Add `@media (forced-colors: active) { .btn:focus-visible { outline: 2px solid Highlight; } }` | [ ] Pass |
| *Example: Product Card* | Card merges invisibly into page background canvas. | Add `border: 1px solid transparent;` to base card CSS. | [ ] Pass |
| *Example: Custom Checkbox* | Checkmark disappears when checked. | Add `@media (forced-colors: active) { input:checked + .box { background: Highlight; } }` | [ ] Pass |
| | | | [ ] Pass |
| | | | [ ] Pass |
