# Password Field Accessibility & Autofill Audit Checklist

This checklist is designed to help developers, designers, and QA engineers audit password input fields for WCAG 2.1/2.2 AA accessibility and native browser credential manager (autofill) compatibility.

---

## 1. Semantic Structure & Labels

- [ ] **Associated Label:** Does the password input have a programmatically associated visual `<label>` (using the `for` attribute referencing the input's `id`)?
- [ ] **No Hidden Labels:** Is the label visible to all users? (Placeholder text must NOT be used as a replacement for labels).
- [ ] **Autofill Attributes:** Does the input use `autocomplete="current-password"` (on login screens) or `autocomplete="new-password"` (on registration or reset screens)?
- [ ] **Form Container Wrapping:** Is the input enclosed within a semantic `<form>` element? (Credential managers require form boundaries to reliably prompt users to save or update passwords).

---

## 2. Show/Hide Toggle Control

- [ ] **Semantic Control Type:** Is the toggle control a native `<button type="button">`? (Avoid using standard `<a>`, `<div>`, or `<span>` elements with click events, as they require extra ARIA logic).
- [ ] **Keyboard Navigable:** Can the button receive keyboard focus via standard tab routing?
- [ ] **Enter & Space Triggers:** Does pressing `Space` or `Enter` toggle password visibility when the toggle button is focused?
- [ ] **Caret Selection Preservation:** When toggled, does the input cursor/caret focus remain at its exact previous character index instead of resetting to the end of the input?
- [ ] **Visual Style & Focus:** Is there a clear, high-contrast custom focus outline surrounding the toggle button when accessed by a keyboard?
- [ ] **Aria Attributes:**
  - Does the toggle have an updated `aria-label` (e.g., "Show password" / "Hide password")?
  - Does the toggle utilize `aria-pressed="true|false"` to indicate state?
  - Are inner SVGs hidden from screen readers using `aria-hidden="true"` and `focusable="false"`?

---

## 3. Password Requirements & Strength Indicators

- [ ] **Screen Reader Announcements (ARIA-Live):**
  - Are updates to the strength meter announced politely using `aria-live="polite"`?
  - Are requirement checklist changes (e.g., "At least 1 number checked") read dynamically, avoiding chatty announcements on every keypress?
- [ ] **Visual Color Reliance:** Is password strength communicated through text labels (e.g., "Fair", "Strong") in addition to color blocks? (Relying purely on red/yellow/green fails WCAG 1.4.1 Color Reliance standards).
- [ ] **Focus Management on Error:** When a registration form submission is rejected due to password criteria, is focus programmatically shifted back to the password input with `aria-invalid="true"`?

---

## 4. Input Constraints & Usability

- [ ] **No Copy-Paste Blocking:** Is copy-pasting into the password field allowed? (Blocking `onpaste` is a severe security anti-pattern that prevents users from inputting complex passwords from secure password managers).
- [ ] **Touch Target Sizing:** Is the toggle button's touch target area at least **44x44px** (WCAG 2.1) or **24x24px** (WCAG 2.2)?
- [ ] **Contrast Ratios:**
  - Does the toggle icon have at least a **3:1 contrast ratio** against its surrounding container background?
  - Does helper text and label text have at least a **4.5:1 contrast ratio**?
- [ ] **Windows High Contrast Mode (Forced Colors):** When Forced Colors is active on the OS, are the borders of the password input, toggle button, and strength-meter segments fully visible?
