---
name: accessible-password-field-implementation
description:
  Implement and debug accessible, browser-autofill-friendly password inputs
  complete with selection-preserving show/hide toggles and ARIA-live-synchronized
  strength indicators and rule checklists.
---

# Accessible Password Field Implementation

## Purpose

The Accessible Password Field Implementation skill provides a technical protocol for building, optimizing, and auditing password input components on the frontend.

Almost every modern website includes a registration or login form containing a password field. To improve UX, these fields frequently feature a Show/Hide visibility toggle, a visual strength meter, and a requirements checklist. However, custom implementations of these features are notorious for breaking accessibility and browser autofill. Common issues include keyboard users being unable to access the show/hide toggle, password managers failing to autofill the field, screen readers being flooded with repetitive strength status updates on every single keypress, or the text caret jumping to the end of the input when the visibility is toggled.

This skill ensures password fields are highly usable, completely accessible, robust against focus and caret losses, and fully integrated with native browser and third-party password managers.

## Use Cases

- **User Registration Forms:** Standardizing password fields requiring validation checklists and real-time strength indicators.
- **Login/Sign-in Forms:** Optimizing password fields with seamless Show/Hide toggle support and correct autofill behavior.
- **Password Reset/Update Forms:** Implementing strict validations, match confirmations, and secure input handling.
- **Form Auditing & Remediation:** Diagnosing and fixing accessibility/autofill blockers in existing legacy password fields.

## When NOT to Use

- **Simple Admin Login Screens:** If native browser styling and default browser password manager prompts are sufficient without custom requirements, a plain `<input type="password">` with no custom JS toggles is always safer and lighter.
- **Single-Factor PIN Inputs:** For short, numeric PIN inputs, use specific patterns such as sequential inputs or custom digit grids rather than a standard password field structure.
- **Server-Side Rendered Only Forms:** If Javascript is strictly disabled on the page, interactive components like toggles and real-time checkers cannot function. Stick to standard HTML validation and native inputs.

## Inputs

1. **Password Ruleset:** The validation criteria (e.g., minimum length, uppercase letter, digit, special character).
2. **Visual Assets:** Icons or clear text labels representing the "Show" and "Hide" states of the visibility button.
3. **Target Context:** Whether the field is for creating a new password (`autocomplete="new-password"`) or entering an existing password (`autocomplete="current-password"`).
4. **Layout Context:** High Contrast Mode (Forced Colors) requirements, spacing, and mobile/touch size targets.

## Outputs

1. **Semantic HTML Structure:** An input wrapper linking the input to its validation checklist (`aria-describedby`), status region (`role="status"`), and its visual toggle.
2. **Focus & Selection-Preserving Toggle Script:** A JavaScript event handler that toggles between `type="password"` and `type="text"`, preserves the caret cursor position/selection, and maintains focus.
3. **Debounced Strength & Rule Announcer:** Logic that evaluates the input, updates a visual `<meter>` or checklist, and issues non-spammy, polished live announcements via an ARIA live region.
4. **Fluid, High-Contrast Tolerant Styles:** CSS establishing clear focus indicators, interactive target dimensions (minimum 44x44px), and proper styling in High Contrast / Forced Colors mode.

---

## Workflow

### 1. Structure the Semantic Markup
A robust password field requires a carefully structured HTML container that programmatically connects the input with its toggle button, visual strength meter, live announcement area, and validation checklist.

```html
<div class="password-field-container">
  <!-- Label with explicit association -->
  <label for="password-input">Password</label>

  <div class="password-input-wrapper">
    <!-- Correct autocomplete is critical for password managers -->
    <input type="password"
           id="password-input"
           name="password"
           autocomplete="new-password"
           required
           aria-describedby="password-rules-checklist"
           class="password-input">

    <!-- Toggle button is inside the wrapper but separate in focus order -->
    <button type="button"
            id="password-toggle"
            class="password-toggle"
            aria-label="Show password as plain text"
            aria-pressed="false">
      <!-- Icon or text fallback -->
      <span class="toggle-text" aria-hidden="true">Show</span>
    </button>
  </div>

  <!-- Real-time Visual Strength Meter -->
  <div class="strength-meter-container">
    <label id="meter-label" for="strength-meter" class="visually-hidden">Password strength</label>
    <meter id="strength-meter"
           min="0" max="4" low="2" high="3" optimum="4"
           value="0"
           aria-labelledby="meter-label">
    </meter>
  </div>

  <!-- Single Live Region for Polished Screen Reader Announcements -->
  <div id="password-status-live"
       class="visually-hidden"
       role="status"
       aria-live="polite"
       aria-atomic="true">
  </div>

  <!-- Programmatically Linked Requirements Checklist -->
  <ul id="password-rules-checklist" class="password-rules-checklist" aria-label="Password requirements">
    <li id="rule-length" class="rule-item" data-satisfied="false">
      <span class="rule-icon" aria-hidden="true">❌</span>
      <span class="rule-text">At least 8 characters</span>
    </li>
    <li id="rule-uppercase" class="rule-item" data-satisfied="false">
      <span class="rule-icon" aria-hidden="true">❌</span>
      <span class="rule-text">At least one uppercase letter</span>
    </li>
    <li id="rule-number" class="rule-item" data-satisfied="false">
      <span class="rule-icon" aria-hidden="true">❌</span>
      <span class="rule-text">At least one number</span>
    </li>
    <li id="rule-special" class="rule-item" data-satisfied="false">
      <span class="rule-icon" aria-hidden="true">❌</span>
      <span class="rule-text">At least one special character</span>
    </li>
  </ul>
</div>
```

---

### 2. Implement the Toggle Logic (With Caret Preservation)
In some web browsers, changing an input's `type` attribute from `password` to `text` causes the caret (text selection cursor) to jump to the very end of the string or resets focus. If a user types part of their password, realizes they made a mistake in the middle, clicks "Show", and their typing caret jumps to the end, it causes extreme frustration.

We must programmatically capture and restore the selection range.

```javascript
class AccessiblePasswordField {
  constructor(container) {
    this.container = container;
    this.input = container.querySelector('.password-input');
    this.toggleBtn = container.querySelector('.password-toggle');
    this.toggleText = container.querySelector('.toggle-text');
    this.liveStatus = container.querySelector('#password-status-live');
    this.meter = container.querySelector('#strength-meter');
    this.ruleItems = container.querySelectorAll('.rule-item');

    this.debounceTimeout = null;
    this.init();
  }

  init() {
    this.toggleBtn.addEventListener('click', () => this.toggleVisibility());
    this.input.addEventListener('input', () => this.handleInput());
  }

  toggleVisibility() {
    // 1. Capture current cursor/selection state
    const selectionStart = this.input.selectionStart;
    const selectionEnd = this.input.selectionEnd;
    const hasFocus = document.activeElement === this.input;

    // 2. Toggle type and ARIA state
    const isShowing = this.input.type === 'text';
    this.input.type = isShowing ? 'password' : 'text';
    this.toggleBtn.setAttribute('aria-pressed', !isShowing);
    this.toggleBtn.setAttribute('aria-label', isShowing ? 'Show password as plain text' : 'Hide password');
    this.toggleText.textContent = isShowing ? 'Show' : 'Hide';

    // 3. Restore cursor and focus state
    if (hasFocus) {
      this.input.focus();
    }
    // Safari/Chrome require selection range restoration after type toggling
    this.input.setSelectionRange(selectionStart, selectionEnd);
  }

  // Handlers for validation and debounced announcements follow in step 3...
}
```

---

### 3. Handle Live Announcements and Strength Calculations
If you update a live region (`aria-live="polite"`) on every single keystroke to say *"Weak password"*, *"Medium password"*, the screen reader will repeatedly talk over the user, making it impossible for them to hear which characters they are typing.

**Rule of Thumb:** Debounce the strength announcements by `800ms - 1000ms`. Do *not* read out the individual rule checklists in the live region. Instead, allow the checklist to be read statically as an `aria-describedby` reference, and only announce the high-level strength change and general checklist status when typing pauses.

```javascript
  handleInput() {
    const value = this.input.value;
    const evaluation = this.evaluatePassword(value);

    // Update visual and programmatic state immediately
    this.updateVisualRules(evaluation.rules);
    this.updateVisualMeter(evaluation.strength);

    // Debounce the live status region announcement
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.announceStatus(evaluation);
    }, 1000);
  }

  evaluatePassword(value) {
    const rules = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    };

    const satisfiedCount = Object.values(rules).filter(Boolean).length;
    let strength = 0;
    let label = 'Very Weak';

    if (value.length > 0) {
      strength = satisfiedCount;
      if (strength === 1) label = 'Weak';
      else if (strength === 2) label = 'Fair';
      else if (strength === 3) label = 'Good';
      else if (strength === 4) label = 'Strong';
    }

    return { rules, strength, label, satisfiedCount, totalCount: Object.keys(rules).length };
  }

  updateVisualRules(rules) {
    const ruleIds = {
      length: 'rule-length',
      uppercase: 'rule-uppercase',
      number: 'rule-number',
      special: 'rule-special'
    };

    for (const [key, satisfied] of Object.entries(rules)) {
      const item = this.container.querySelector(`#${ruleIds[key]}`);
      if (item) {
        item.setAttribute('data-satisfied', satisfied);
        const icon = item.querySelector('.rule-icon');
        icon.textContent = satisfied ? '✅' : '❌';
      }
    }
  }

  updateVisualMeter(strength) {
    if (this.meter) {
      this.meter.value = strength;
    }
  }

  announceStatus(evaluation) {
    if (this.input.value.length === 0) {
      this.liveStatus.textContent = '';
      return;
    }

    const { label, satisfiedCount, totalCount } = evaluation;
    // Deliver a concise, non-disruptive update
    this.liveStatus.textContent = `Password strength: ${label}. ${satisfiedCount} of ${totalCount} requirements met.`;
  }
```

---

### 4. Create Accessible, Robust Styles
Ensure that buttons have proper touch sizes (at least 44x44px target), clear visual focus rings, and proper handling when operating under Forced Colors Mode (High Contrast Mode).

```css
.password-field-container {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  font-family: system-ui, -apple-system, sans-serif;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.password-input {
  width: 100%;
  padding: 12px 48px 12px 12px; /* Extra right padding for toggle */
  font-size: 16px;
  border: 1px solid #767676;
  border-radius: 4px;
}

/* Ensure focus outline is clear and distinct */
.password-input:focus-visible {
  outline: 2px solid #005a9c;
  outline-offset: 2px;
}

.password-toggle {
  position: absolute;
  right: 4px;
  height: 40px; /* Minimum mobile tap target padding helper */
  min-width: 44px;
  padding: 0 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:focus-visible {
  outline: 2px solid #005a9c;
  outline-offset: -2px;
}

/* Styling the HTML5 meter element */
meter {
  width: 100%;
  height: 8px;
  margin-top: 8px;
  display: block;
}

/* Fallback/Forced Colors High Contrast overrides */
@media (forced-colors: active) {
  .password-input:focus-visible,
  .password-toggle:focus-visible {
    outline: 2px solid Highlight;
  }
}
```

---

## Decision Rules

### Selecting the Validation Trigger Strategy

| Metric | Debounced `input` (Recommended) | `change` or `blur` | Throttle / Keydown |
| :--- | :--- | :--- | :--- |
| **UX Behavior** | Updates visual checklist on typing but debounces assistive technology live region announcements. | Updates rules and strength only when user leaves the field or hits Enter. | Updates live screen-reader regions on every single keypress. |
| **Accessibility Rating** | **Excellent.** Highly responsive without disrupting audio feedback. | **Fair.** Low noise, but lacks immediate visual feedback. | **Fail.** Extremely annoying for screen-reader users. |

### Visual Feedback Choices: `<meter>` vs. Custom `<divs>`

- **Use `<meter>` (Best Practice):** When you want clean, native, and semantically sound representations of a value within a known range. Visual presentation can be customized using `-webkit-meter-bar` pseudo-selectors.
- **Use custom `<div>` structures (Highly Styled):** Only when the layout requires non-standard horizontal bars or multi-segment colored circles that `<meter>` cannot easily render. If you use `<div>`, you MUST add `role="img"` or `role="progressbar"`, along with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to the wrapper.

---

## Constraints

- **Z-Index Collision:** Some password managers insert a custom visual icon (like a key or logo) inside the right edge of password fields. Ensure the toggle button has a high enough `z-index` or sufficient spacing so that password manager icons do not overlap or render the toggle button clickable-blocked.
- **Caret Position Memory:** Always query and record `selectionStart` and `selectionEnd` before altering the `input.type`. Safari on iOS is extremely sensitive to input type transitions and can drop caret locations if not explicitly reset.
- **Form Autofill Compatibility:** Keep `<label>` elements linked explicitly via `id` / `for`. Never omit the `name` attribute on the `<input>` element. Password managers use the field `name` and the `autocomplete` attribute to successfully save and pre-fill credentials.

## Non-Goals

- Implementing server-side cryptography, password hashing (e.g., bcrypt), or actual database registration logic.
- Complex client-side dictionary attack checks (e.g., loading a 10MB list of the top 10,000 common passwords into browser memory).
- Designing multi-factor authorization inputs or email validation logic.

---

## Common Failure Patterns

- **Using a Non-Button for Toggle:** Making the Show/Hide icon a standard `<div>` or `<span>` without a `tabindex="0"` or keypress listener. This blocks keyboard and screen-reader users entirely.
- **`type="text"` by Default:** Loading the input as `type="text"` and requiring the user to hide it. This exposes secure credentials to shoulder surfers upon page load.
- **Focus and Caret Reset:** Toggling the password visibility causes the text cursor to snap back to index `0` or to the very end of the string, preventing easy inline correction of typos.
- **Flooding the Live Region:** Updating `aria-live` immediately on every character keypress, leading the screen reader to yell `"Very weak, password strength very weak, password strength weak..."` over the characters the user is actively entering.
- **Setting `autocomplete` Incorrectly:** Using `autocomplete="off"` or failing to use `autocomplete="new-password"` in registration screens, preventing web browsers from generating and saving secure, random credentials for the user.

---

## Validation Steps

- [ ] **Keyboard Interaction Test:** Tab into the password field. Type a value. Tab to the "Show" toggle. Press `Space` or `Enter` to reveal. Verify focus remains active on the toggle button and the label shifts from "Show" to "Hide".
- [ ] **Caret Retention Test:** Click on the password field, type `abcdef`, move your text cursor to sit between `c` and `d`, and hit the Show/Hide toggle. Verify that the visual caret remains positioned exactly between `c` and `d` instead of jumping to the end of the text.
- [ ] **Autofill Compatibility Test:** Right-click the field or look for browser suggestions. Verify that Chrome or Safari successfully prompts to autofill or generate a new secure password.
- [ ] **Screen Reader Speech Check:** Open VoiceOver, NVDA, or JAWS. Type a password. Confirm that character typing is voiced correctly, and that strength updates are voiced politely only after typing stops, rather than yelling strength status over every individual character keystroke.
- [ ] **High Contrast Mode Check:** Turn on Windows High Contrast / Forced Colors Mode. Ensure that the input borders, toggle labels, and visual strength meter remain fully readable and distinct.
