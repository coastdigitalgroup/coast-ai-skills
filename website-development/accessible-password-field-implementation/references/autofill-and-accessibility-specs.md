# Browser Autofill & Password Accessibility Specifications

This reference document outlines the technical browser mechanisms, credential manager triggers, and WCAG criteria that govern the development of secure, highly accessible password inputs.

---

## 1. Browser Autofill & Keychain Integration

Modern web browsers and external password managers (e.g., 1Password, Bitwarden, Dashlane) rely heavily on HTML semantic structures to identify input context and offer credentials.

### Semantic Triggers

To trigger keychain overlays and login prompts reliably:
1. **The Form Element:** Always place password inputs inside a `<form>` element. Credential managers hook into form submit and reset events to prompt users to save or update passwords.
2. **The `autocomplete` Attribute:**
   - **`autocomplete="current-password"`:** Use this on Login / Sign-In pages. It signals to browsers and extensions to suggest existing saved passwords for the current site.
   - **`autocomplete="new-password"`:** Use this on Registration, Sign-Up, and password change pages. It prevents the browser from auto-filling saved login credentials in places where the user wants to set a *new* password, and tells password managers to generate a strong, unique value.
3. **The Username Element:** Keychains require a corresponding username or email field to save credentials properly. Ensure the username field is inside the same `<form>` and has `autocomplete="username"` (or `autocomplete="email"`).

### Avoid Anti-Patterns

- **Blocking Clipboard Events:** Never block copying or pasting (`onpaste="return false"`). This blocks password managers, forcing users to type extremely complex, long passwords manually, which leads to weak passwords and high bounce rates.
- **Detached Fields:** Avoid creating formless inputs (inputs floating outside a `<form>`). While Javascript handles form submissions, standard browsers cannot associate form fields without a container `<form>` element.

---

## 2. WCAG Accessibility Criteria Relevance

Building accessible password fields involves compliance with several Web Content Accessibility Guidelines (WCAG):

### WCAG 1.3.1 - Info and Relationships (Level A)
- **Rule:** Information, structure, and relationships conveyed through presentation must be programmatically determined or available in text.
- **Implementation:** Password fields must be associated with `<label>` elements via the `for` attribute. Use `aria-describedby` to link the password field directly to password constraints/criteria checklists and strength meters.

### WCAG 1.4.1 - Use of Color (Level A)
- **Rule:** Color must not be used as the sole visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.
- **Implementation:** Password strength indicators must not rely entirely on red/yellow/green color changes. They must have accompanying text descriptions (e.g., "Strength: Good") or numerical ratings.

### WCAG 2.1.1 - Keyboard (Level A)
- **Rule:** All functionality of the content must be operable through a keyboard interface.
- **Implementation:** Show/Hide toggles must be fully keyboard accessible. Use native `<button>` elements to automatically inherit `Space` and `Enter` key activations. Ensure the button sits logically in the Tab index.

### WCAG 2.5.3 - Label in Name (Level A)
- **Rule:** For user interface components with labels that include text or images of text, the name contains the text that is presented visually.
- **Implementation:** If your toggle button uses an SVG icon alongside text, ensure the programmatic name (`aria-label`) matches or closely relates to the visible element context.

### WCAG 2.5.5 / 2.5.8 - Target Size (Level AA / AAA)
- **Rule:** The size of the target for pointer inputs must be at least 44x44 CSS pixels (WCAG 2.1 Level AAA) or 24x24 CSS pixels with inline padding spacing (WCAG 2.2 Level AA).
- **Implementation:** Ensure password visibility toggles are large enough for comfortable touch tapping on mobile screens. A standard size of `40x40px` inside a well-padded wrapper achieves a physical touch target larger than `44x44px`.

---

## 3. Caret Preservation Mechanics

When a user toggles a password's visibility (type `password` to `text` or vice-versa), standard browser behavior wipes out the input selection range and positions the text selection cursor (caret) back to the end of the input field.

For screen magnifier users or anyone editing a complex password in the middle of a string, this behavior is extremely disorienting.

To prevent this:
1. Capture the input's current `selectionStart` and `selectionEnd` cursor offsets *before* toggling the type.
2. Toggle the `type` attribute on the element.
3. Call `.focus()` programmatically if the user was actively in the field.
4. Programmatically set selection positions back using `.setSelectionRange(start, end)`.

```javascript
// Capture Selection State
const start = input.selectionStart;
const end = input.selectionEnd;

// Toggle Field State
input.type = input.type === 'password' ? 'text' : 'password';

// Restore Focus and Caret
input.focus();
input.setSelectionRange(start, end);
```

---

## 4. Screen-Reader Behavior Discrepancies

Screen readers behave differently depending on browser rendering engines. Understanding these helps in auditing:

| Screen Reader | Platform | Field Type: `password` | Field Type: `text` | Visibility Transition |
|---|---|---|---|---|
| **VoiceOver** | iOS / macOS | Announces "Secure text field" and masks characters. | Announces "Text field" and speaks letters. | Announces "Show password" / "Hide password" changes politely. |
| **NVDA** | Windows | Announces "Password, protected" or "bullet". | Announces "Edit, blank" or typed characters. | Updates live regions and states. Caret-preservation prevents redundant "bullet" spam. |
| **JAWS** | Windows | Announces "Password edit". | Announces "Edit". | Speaks the newly exposed characters upon visibility shift. |

To avoid screen-reader confusion during state changes, ensure the visual checklist requirements elements (`<li>` items) are marked with `aria-live="polite"`. This tells screen readers to read checklist updates during natural pauses, rather than speaking over character typing.
