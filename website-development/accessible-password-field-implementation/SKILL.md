---
name: accessible-password-field-implementation
description:
  Implement and audit highly accessible, browser-autofill-friendly password inputs featuring caret-preserving visibility toggles, dynamic strength meters, and ARIA-live requirements checklists.
---

# Accessible Password Field Implementation

## Purpose

The Accessible Password Field Implementation skill provides a robust, standardized protocol for building and auditing password input components. Password inputs are a notorious point of friction on the web, often failing accessibility audits due to poor screen reader announcements, incorrect keyboard navigation on show/hide toggles, broken browser autofill, and visual-only password requirements. This skill ensures password inputs are fully WCAG 2.1/2.2 AA compliant, screen-reader audible, keyboard-navigable, and optimized for native browser keychain integrations.

## Use Cases

- **Registration & Sign Up Forms:** Where password strength metrics, requirement checklists, and visibility toggles are required to guide users to create secure accounts.
- **Login & Sign In Forms:** Where seamless credential manager integration (autofill, touch/face ID overlays) and simple visibility toggles are needed.
- **Change Password Forms:** Where users must enter their current password and verify/confirm a new password.
- **Security & Re-authentication Modals:** Short prompts checking a user's password before they perform high-privilege actions.

## When NOT to Use

- **Two-Factor Authentication (2FA) / One-Time Passcodes (OTP):** Use individual alphanumeric code inputs (`type="text" inputmode="numeric" autocomplete="one-time-code"`) instead of standard password inputs.
- **Sensitive non-password inputs (e.g., Credit Cards, SSN, CVV):** These require specific input masking, formatting, and numeric keypads (e.g., `inputmode="numeric" autocomplete="cc-number"`), not standard password field behavior.

## Inputs

1. **Context of Form:** Registration (needs strength verification and criteria checklist) or Login (only needs toggle and autofill).
2. **Visual Specs:** Input styles, toggle button iconography, strength-meter segment indicators, and status colors.
3. **Password Security Rules:** Minimum length, uppercase, numbers, or special characters requirements.

## Outputs

1. **Semantic HTML Structure:** An accessible form enclosing a password input, a properly associated `<label>`, a semantic `<button type="button">` for the show/hide toggle, and ARIA relationships (`aria-describedby`, `aria-live`).
2. **Caret-Preserving JS Controller:** A Vanilla JavaScript controller that toggles the input type between `password` and `text`, preserves focus/caret selection point, dynamically calculates password strength, and announces requirement states to screen readers.
3. **High-Contrast CSS Styling:** Inclusive visual design that ensures focus outlines, strength colors, and toggle buttons are highly visible, with full support for Windows High Contrast Mode (Forced Colors Mode).
4. **Comprehensive Audit Checklist:** A checklist for frontend engineers and QA professionals to audit existing implementations.

## Workflow

### 1. Structure Semantic HTML

To ensure browsers identify the password context correctly and allow password managers to auto-fill details, use standard forms and native elements:

```html
<form action="/api/register" method="POST" class="auth-form" novalidate>
  <div class="form-group password-group">
    <div class="label-row">
      <label for="reg-password">Password</label>
    </div>

    <div class="input-wrapper">
      <input type="password"
             id="reg-password"
             name="password"
             class="password-input"
             autocomplete="new-password"
             required
             aria-describedby="password-constraints password-strength"
             aria-invalid="false">

      <button type="button"
              class="password-toggle"
              aria-label="Show password"
              aria-pressed="false"
              tabindex="0">
        <svg aria-hidden="true" focusable="false" class="eye-icon" viewBox="0 0 24 24">
          <!-- Eye icon path -->
        </svg>
      </button>
    </div>

    <!-- Live regions & guides -->
    <div id="password-strength" class="strength-container" aria-live="polite">
      <div class="strength-bar-wrapper">
        <div class="strength-bar-fill" data-score="0"></div>
      </div>
      <span class="strength-text">Password strength: Empty</span>
    </div>

    <ul id="password-constraints" class="constraints-list" aria-label="Password requirements">
      <li id="rule-length" class="rule invalid" aria-live="polite">
        <span class="status-indicator"></span> At least 8 characters
      </li>
      <li id="rule-number" class="rule invalid" aria-live="polite">
        <span class="status-indicator"></span> At least 1 number
      </li>
      <li id="rule-symbol" class="rule invalid" aria-live="polite">
        <span class="status-indicator"></span> At least 1 special character
      </li>
    </ul>
  </div>
</form>
```

---

### 2. Style for Resilience and High Contrast

Use robust CSS styles that remain visual, accessible, and performant.

```css
/* Ensure touch targets for the toggle are 44x44px */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding-right: 48px; /* Leave space for the toggle */
}

.password-toggle {
  position: absolute;
  right: 4px;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

/* Clear custom focus outline */
.password-toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

/* High Contrast Mode support */
@media (forced-colors: active) {
  .password-toggle {
    border: 1px solid ButtonText;
  }
  .strength-bar-fill {
    border: 1px solid ButtonText;
    background-color: Highlight !important;
  }
}
```

---

### 3. Implement the Caret-Preserving JS Controller

When a user toggles the visibility of the password field, standard browsers reset the cursor position (selection caret) to the end of the text. To prevent this disruptive UX, capture and restore the selection range programmatically.

```javascript
class AccessiblePasswordField {
  constructor(container) {
    this.container = container;
    this.input = container.querySelector('.password-input');
    this.toggle = container.querySelector('.password-toggle');
    this.toggleIcon = this.toggle.querySelector('svg');

    this.init();
  }

  init() {
    this.toggle.addEventListener('click', () => this.toggleVisibility());
    this.input.addEventListener('input', () => this.validatePassword());
  }

  toggleVisibility() {
    const isShowing = this.input.type === 'text';

    // 1. Capture caret position and selection range
    const selectionStart = this.input.selectionStart;
    const selectionEnd = this.input.selectionEnd;

    // 2. Toggle input type
    this.input.type = isShowing ? 'password' : 'text';

    // 3. Update toggle ARIA properties and labels
    this.toggle.setAttribute('aria-label', isShowing ? 'Show password' : 'Hide password');
    this.toggle.setAttribute('aria-pressed', String(!isShowing));

    // 4. Update SVG paths/states if needed
    this.updateIcon(!isShowing);

    // 5. Restore caret position (only relevant when input is focused)
    if (document.activeElement === this.input || document.activeElement === this.toggle) {
      this.input.focus();
      this.input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  updateIcon(show) {
    // Dynamically adjust icon visual elements or class names
  }

  validatePassword() {
    // Handle password criteria dynamic validation and strength meter logic here
  }
}
```

---

### 4. Wire Up ARIA-Live Requirements and Strength Meters

Standard password checklists update colors as criteria are met. This is completely silent to screen readers. We must announce updates elegantly.

- **Polite announcements:** Mark checklists or dynamic indicators with `aria-live="polite"` so screen readers speak changes when the user pauses typing.
- **Do not announce every keystroke:** Only trigger ARIA notifications for full status changes (e.g. "Password strength: strong") or checkmarks (e.g. "Rule length met") to avoid chatty speech queues.

## Decision Rules

- **Use `<input autocomplete="current-password">` when:**
  - Building a Login/Sign-In page. This explicitly guides native keychains to suggest existing passwords.
- **Use `<input autocomplete="new-password">` when:**
  - Building a Sign-Up or password-reset page. This tells password managers to generate strong, unique passwords.
- **Use custom rules instead of native browser validation (`pattern`) when:**
  - You need dynamic on-the-fly strength calculations, custom requirements UI, and detailed ARIA-live guidance. The native browser tooltip for `pattern` fails to provide a polished or screen-reader friendly workflow.

## Constraints

- **Focus trapping:** The toggle button must sit cleanly in the DOM focus order immediately following the text input. Do not make users shift-tab from the toggle to the input; they should naturally advance forward.
- **Autofill Compatibility:** Do not block copy-paste (`onpaste="return false"`). This is an anti-security pattern that breaks standard password managers and prevents people from using secure, generated passwords.
- **Contrast Ratios:**
  - Strength meter fills (red/orange/green) must have an accompanying text label (e.g., "Strength: Weak") to avoid relying entirely on color (WCAG Guideline 1.4.1).
  - The toggle button icon contrast against the background must be at least 3:1.

## Non-Goals

- Implementation of backend cryptography or hashing algorithms (e.g., bcrypt, PBKDF2).
- Complete password complexity logic (like zxcvbn integration; basic checks are sufficient for demonstrating UI workflows).
- Server-side validation of password strength or persistence.

## Common Failure Patterns

- **The "Lost Cursor" bug:** When toggling the password field visibility, the cursor jumps to the end of the input, making editing in the middle of a password incredibly frustrating.
- **The "No-Form Autofill" failure:** Putting password fields inside detached `div` tags instead of a `<form>` container, preventing Google Chrome, iOS Safari, or 1Password from offering to save the newly created password.
- **Inaccessible Toggles:** Creating visibility toggles using an image inside a `<div onclick="...">`. These are completely invisible to keyboard-only users, lack ARIA roles, and do not receive focus.
- **Silent Requirements Checklist:** Presenting visual requirements (e.g. green checkmarks) without changing their ARIA state, leaving blind users guessing why their form submission was blocked.
- **Double Focus Outlines:** Wrapping the toggle button inside a container that also receives keyboard focus, causing a "double tab" to cross a single input block.

## Validation Steps

- [ ] **Tab Navigation Test:** Press `Tab` to navigate through the form. Verify focus goes naturally: `Input -> Show/Hide Toggle -> Next Field`.
- [ ] **Enter and Space Trigger Test:** Focus on the Show/Hide toggle button and verify both `Space` and `Enter` trigger the visibility toggle correctly.
- [ ] **Caret Position Verification:** Type a password, position the cursor in the middle of the text, press the toggle button, and confirm the cursor remains exactly where it was.
- [ ] **Screen Reader Walkthrough:** With NVDA or VoiceOver enabled, type a password. Verify the checklist updates are announced when the text pauses or that the strength meter's value is spoken.
- [ ] **Password Manager Autofill Check:** Ensure the browser's native credential manager triggers on focus and successfully populates the password without breaking the Show/Hide toggle.
- [ ] **High Contrast Theme Test:** Turn on Forced Contrast mode on Windows or emulation in DevTools. Confirm the strength meter and input focus outline are clearly visible.
