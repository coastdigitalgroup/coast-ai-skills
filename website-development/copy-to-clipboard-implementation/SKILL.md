---
name: copy-to-clipboard-implementation
description:
  Implement and debug accessible "Copy to Clipboard" functionality using the
  Clipboard API, with robust feedback for screen readers and keyboard users.
---

# Copy-to-Clipboard Implementation

## Purpose

The Copy-to-Clipboard Implementation skill provides a technical framework for
allowing users to copy text (links, codes, snippets) to their system clipboard.
It focuses on using the modern `navigator.clipboard` API while ensuring that
success or failure is clearly communicated to all users, especially those using
assistive technologies like screen readers who often miss purely visual "check"
animations.

## Use Cases

- Adding a "Copy" button to code blocks in documentation.
- Implementing "Copy Referral Link" or "Copy Discount Code" buttons.
- Allowing users to copy complex data (like UUIDs or API keys) without manual
  selection.
- Auditing existing implementations that use deprecated `document.execCommand('copy')`.

## When NOT to Use

- **Sensitive Data in Plaintext:** Avoid adding "Copy" buttons for sensitive
  passwords or credentials unless they are masked or behind a "Show" toggle.
- **Large Data Payloads:** For downloading entire files, use the `download`
  attribute on an anchor tag or a Blob-based download rather than the clipboard.
- **Automatic "On-Load" Copy:** Never attempt to copy to the clipboard without a
  direct user action (click/keypress). Browsers will block this for security.

## Inputs

1. **Target Text:** The string to be copied (static or dynamically generated).
2. **Trigger Element:** Usually a `<button>` that initiates the action.
3. **Feedback Mechanism:** How the UI indicates success (e.g., text change,
   icon swap, or toast).
4. **Context:** Is the text visible (like a code block) or hidden (like a link
   sharing URL)?

## Outputs

1. **Clipboard Update:** The system clipboard contains the target text.
2. **Visual Feedback:** A temporary change in the button's state or a nearby
   notification.
3. **Programmatic Feedback:** An ARIA live region announcement confirming the
   action.
4. **Error Handling:** Graceful failure notification if the clipboard access is
   denied or fails.

## Workflow

### 1. Identify the Trigger and Target

- Use a `<button>` element for the trigger to ensure it is in the tab order.
- Ensure the button has a descriptive label (e.g., `aria-label="Copy code to clipboard"`).

### 2. Implement the Copy Logic

- Use the asynchronous `navigator.clipboard.writeText(text)` API.
- Wrap the call in a `try/catch` block to handle permissions or API unavailability.

### 3. Provide Immediate Visual Feedback

- Change the button text (e.g., "Copy" → "Copied!") or swap an icon.
- Revert the visual state after a short delay (e.g., 2000ms).

### 4. Provide Screen Reader Feedback (Critical)

- Use a persistent, visually hidden `aria-live="polite"` region.
- Update the text content of this region *only* when the copy action succeeds
  (e.g., "Snippet copied to clipboard").
- *Note:* Do not rely on the button's text change alone, as some screen readers
  may not announce the change unless focus is moved.

### 5. Handle Fallbacks

- Check if `navigator.clipboard` exists.
- If necessary for legacy support, fall back to a temporary `<textarea>` and
  `document.execCommand('copy')`, though this is increasingly rare and
  deprecated.

## Decision Rules

- **Inline Feedback vs. Toast:** Use **Inline Feedback** (changing the button
  content) for specific, localized actions like copying a code snippet. Use
  **Toasts** for global actions where the trigger might be far from the focus
  or if multiple things can be copied.
- **Clipboard API vs. execCommand:** Always prefer `navigator.clipboard`. It is
  asynchronous, doesn't require a visible DOM selection, and handles large
  strings more reliably.
- **Success Message Content:** Be specific. Instead of "Copied," use "Link
  copied" or "ID copied" to provide context in the live region.

## Constraints

- **User Activation:** Clipboard write actions *must* be triggered by a user
  gesture (click, keydown).
- **Secure Context:** The Clipboard API requires a secure context (HTTPS) to
  function in most browsers.
- **Accessibility:** The status announcement must be triggered in a way that
  doesn't interrupt the user's flow but is clearly heard.

## Non-Goals

- Handling "Copy to Clipboard" for complex rich text or images (this skill
  focuses on plain text).
- Implementing "Paste from Clipboard" (which requires explicit user permission
  prompts).
- Styling the buttons or icons (beyond accessibility requirements).

## Common Failure Patterns

- **The "Silent" Success:** Changing an icon visually but providing no
  feedback to screen reader users.
- **API Failure in Non-Secure Contexts:** Implementing the API on a `http://`
  site where it will silently fail or throw an error.
- **Focus Loss:** Re-rendering the button in a way that causes the browser to
  lose the current focus point.
- **Over-Announcing:** Putting the `aria-live` attribute on the button itself,
  causing confusing announcements when the text changes while the user is still
  interacting with it.

## Validation Criteria

- [ ] **Functional Test:** Verify the text is actually in the clipboard after
      clicking (paste it into a notepad).
- [ ] **Screen Reader Test:** Verify that "Copied to clipboard" (or similar) is
      announced after the click.
- [ ] **Keyboard Test:** Ensure the "Copy" button can be triggered using only
       the `Tab` and `Enter/Space` keys.
- [ ] **Visual Reversion Test:** Verify the button returns to its original state
      after the specified delay.
- [ ] **Error Test:** Manually disable clipboard permissions in browser settings
      and verify that a graceful error message appears.
