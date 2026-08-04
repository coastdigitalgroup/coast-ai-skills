# Autofill and Accessibility Specs for Password Fields

Designing password input fields that are fully compatible with both accessibility standards and automatic password manager extensions is a sophisticated task. This document details the exact technical reasons behind common browser glitches and specifies how modern browsers and screen readers interact with secure input fields.

---

## 1. The Caret-Jumping Bug: Root Cause & Solution

### The Problem
When a developer toggles the visibility of a password input by swapping its `type` attribute between `password` and `text`:

```javascript
// A simple toggle that triggers the bug:
input.type = input.type === 'password' ? 'text' : 'password';
```

Most modern browsers (specifically Chrome, Safari, and other WebKit/Blink-based engines) treat this attribute change as a **destructive DOM node replacement** or re-initialization. Under the hood, the browser's rendering engine dismantles the secure password visual text-element and instantiates a standard text-element in its place.

As a result:
1. The **text selection range** (`input.selectionStart` and `input.selectionEnd`) is reset. In some browsers, it defaults to `0` (moving the cursor to the beginning of the text). In others, it defaults to the end of the text.
2. In older mobile browsers, **focus** is completely lost or dropped from the active element, triggering a focus-blur cycle.

If a user types a long password, notices a typo at character 4, clicks the "Show" toggle button to see the text, and their caret jumps to character 12, they will be extremely frustrated when they start typing and overwrite the wrong characters.

### The Technical Solution
To prevent caret jumps, we must capture the cursor indices *before* mutating the input's type, and programmatically restore them *immediately* afterwards:

```javascript
// 1. Capture current caret selection state and focus
const selectionStart = input.selectionStart;
const selectionEnd = input.selectionEnd;
const hasFocus = document.activeElement === input;

// 2. Perform the destructive type swap
input.type = input.type === 'password' ? 'text' : 'password';

// 3. Restore focus and cursor positions
if (hasFocus) {
  input.focus();
}
input.setSelectionRange(selectionStart, selectionEnd);
```

---

## 2. Password Manager Heuristics (1Password, Bitwarden, LastPass)

Password managers do not rely on standard JavaScript APIs to prefill credentials. Instead, they run specialized background scripts that parse the page's DOM looking for form fields using **heuristics**. If your password field does not match their heuristics, the password manager will fail to autofill or save credentials, creating massive user friction.

### Priority Heuristics Checklist

1. **The `autocomplete` parameter (High Priority):**
   - Always use `autocomplete="new-password"` on registration and password reset forms. This tells password managers to generate a strong, randomized password and save it under a *new* entry.
   - Always use `autocomplete="current-password"` on login forms. This tells password managers to prefill an *existing* credential.
   - Avoid `autocomplete="off"` on password fields, as most modern password managers ignore this attribute anyway, but standard browsers might block helpful credential pre-filling.

2. **Semantic `<form>` wrapper:**
   - Password and username inputs should always reside inside an active `<form>` element. Password managers use form submission events (like `submit`) to capture new credentials.

3. **Field Names & IDs:**
   - Use standard attributes like `name="password"` or `id="password"`. Password managers use substring matches on these attributes (e.g. searching for `"pass"`, `"pwd"`) to verify the field type.

4. **Avoiding Toggle Overlay Collisions:**
   - Some password managers insert an interactive visual icon (like a lock or logo) directly inside the right boundary of the password field. If your custom Show/Hide toggle sits in the exact same location, the two elements will overlap, making it impossible for the user to click the toggle button.
   - **Fix:** Ensure the toggle button has a high enough `z-index` and that the password input has sufficient padding (at least `48px`) on the right to prevent the text and manager icons from overlapping.

---

## 3. Accessibility Standards & WCAG Compliance

A poorly implemented custom password field violates several Web Content Accessibility Guidelines (WCAG):

### WCAG 1.3.1 - Info and Relationships (Level A)
- **Rule:** Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.
- **Violation:** Placing visual guidelines or requirements next to the input without linking them via `aria-describedby` means screen reader users never hear the rules when entering characters.

### WCAG 2.1.1 - Keyboard (Level A)
- **Rule:** All functionality of the content is operable through a keyboard interface.
- **Violation:** Styling a `<div>` or `<span>` to look like a "Show/Hide" toggle without giving it a `tabindex="0"` or adding an `Enter`/`Space` key listener makes the toggle completely unreachable for keyboard-only users.

### WCAG 4.1.2 - Name, Role, Value (Level A)
- **Rule:** For all user interface components, the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set.
- **Violation:** Creating a custom toggle button that lacks the `aria-pressed` state or proper accessible labelling prevents screen readers from announcing whether the password is currently hidden or exposed.

---

## 4. Screen Reader Speech Behaviors

Understanding how screen readers vocalize password inputs is essential for debugging:

| Screen Reader | Default Speech Behavior (Hidden) | Speech Behavior on Toggle (Shown) |
| :--- | :--- | :--- |
| **VoiceOver (macOS / iOS)** | Announces characters typed as *"bullet"* or *"dot"*. Never speaks the actual character aloud unless keyboard settings explicitly allow character echo. | Speaks the actual character aloud as typed (e.g., *"a"*, *"b"*, *"c"*). Announces the change via `aria-pressed` state. |
| **NVDA (Windows)** | Speaks characters typed as *"bullet"* or remains silent depending on configuration. | Speaks characters typed aloud and announces the field text contents when visual focus changes. |
| **JAWS (Windows)** | Whispers or remains silent during typing, voicing *"star"* for each character entered. | Normal text entry voicing behavior. |
