# Accessible Password Field Audit Checklist

Use this checklist to audit existing password fields in your frontend application. This ensures they comply with WCAG 2.1 AA, integrate gracefully with password managers, and support a high-quality, frictionless keyboard and assistive-device user experience.

---

## 1. HTML Markup & Autofill Architecture

- [ ] **Associated Label:** The password `<input>` has a visible `<label>` that is programmatically linked using matching `id` and `for` attributes.
  - *Why:* Placeholders are not substitutes for permanent labels. Screen readers require explicit labeling to announce input fields correctly.
- [ ] **Native Tagging:** The input is a native `<input>` element with `type="password"`.
  - *Why:* Never use custom styled text divs or non-native elements, which break accessibility hooks.
- [ ] **Autofill Compatibility:** The input features a proper `autocomplete` attribute.
  - `autocomplete="new-password"` is used for sign-up and reset screens.
  - `autocomplete="current-password"` is used for login screens.
  - *Why:* Enables browsers and password manager extensions (1Password, Bitwarden, etc.) to prompt to generate or prefill credentials.
- [ ] **Input Name attribute:** The input contains a valid, descriptive `name` attribute (e.g., `name="password"`).
  - *Why:* Required by browser autofill engines to categorize and index form fields on submit.

---

## 2. Show/Hide Toggle Implementation

- [ ] **Semantic Trigger Element:** The toggle is a `<button type="button">`.
  - *Why:* Prevents the browser from treating the toggle as a form submission button (which happens if `type="submit"` or no type is specified) and ensures it is reachable in the keyboard Tab sequence.
- [ ] **Accessible Toggle State:** The button features `aria-pressed="true"` (when password text is shown/revealed) and `aria-pressed="false"` (when password text is hidden as dots).
- [ ] **Dynamic Text Context:** The button features a descriptive, localized label (via `aria-label` or visually-hidden subtext) that changes state.
  - When hidden: `aria-label="Show password as plain text"`
  - When shown: `aria-label="Hide password"`
- [ ] **Caret Selection Memory:** Toggling the password visibility keeps the text input cursor caret in its *exact same character index* position.
  - *Why:* Modifying an input's `type` attribute directly can reset the caret to index `0` or push it to the very end of the line. Carets must be programmatically cached and restored (via `selectionStart` and `selectionEnd`) to protect users correcting spelling errors.
- [ ] **Focus Retention:** Activating the toggle button using a mouse or keyboard does NOT cause keyboard focus to be lost or jump randomly to the top of the body page.

---

## 3. Strength Indicator & Feedback

- [ ] **Polite Live Announcements:** Real-time password strength updates (e.g. *"Weak"*, *"Strong"*) are voiced via an ARIA live region (`role="status"` or `aria-live="polite"`) that is *debounced* (e.g. `800ms - 1000ms`).
  - *Why:* Prevents the screen reader from reading out strength level status alerts on *every single individual keystroke*, which drowns out the sound of the characters the user is actively entering.
- [ ] **Visual Meter Semantics:** Visual indicators of strength utilize a semantic `<meter>` element, or custom elements carrying `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- [ ] **Requirement Checklist Connections:** All visual guidelines or checklists are linked programmatically to the password field using `aria-describedby`.
  - *Why:* Screen readers reading the field will automatically list out the total ruleset instruction once upon focus.
- [ ] **Rule Completion States:** Completing validation criteria triggers live state markers (e.g., changing custom `data-satisfied` attributes) rather than relying exclusively on color.
  - *Why:* Red vs. Green color adjustments are completely lost on colorblind users. Icons must shift (e.g., `❌` to `✅`) or carry screen-reader readable text states.

---

## 4. Keyboard Navigation & Assistive Device Support

- [ ] **Entirely Navigable by Keyboard:** Users can navigate to the input, fill it, Tab to the Show toggle, activate it with `Space`/`Enter`, and submit the form without touching a mouse.
- [ ] **Visual Focus Rings:** Active elements feature high-contrast, visible focus borders when selected (using `:focus-visible`).
- [ ] **Contrast Verification:** High-contrast text matches a minimum ratio of `4.5:1` against its background (and `3:1` for buttons/icons).
- [ ] **Forced Colors compatibility:** System High Contrast Mode (Forced Colors) keeps form border edges, input text, and visual checklist items fully legible.
- [ ] **Mobile Touch-Targets:** Toggle buttons and inputs have a visual/interactive layout area of at least `44x44px` on mobile layouts.
