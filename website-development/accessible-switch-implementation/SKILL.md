---
name: accessible-switch-implementation
description:
  Implement and debug highly accessible toggle switches using native inputs or custom buttons with role="switch", ensuring screen reader compliance and precise focus handling.
---

# Accessible Switch Implementation

## Purpose

The Accessible Switch Implementation skill provides a technical protocol for building and auditing toggle switches. Although visually resembling custom checkmarks, toggle switches represent immediate setting actions (like toggling Wi-Fi or switching theme) rather than selection within a form submit context. This skill ensures toggle switches are semantically correct, fully keyboard-navigable, screen-reader compatible, and visually resilient.

## Use Cases

- **Immediate Action Settings:** Turning features on/off (e.g., "Mute Notifications", "Dark Mode", "Auto-Save").
- **Billing Period Toggles:** Switching table prices (e.g., "Monthly vs. Yearly billing").
- **Auditing Legacy UIs:** Replacing inaccessible `div`-based switch designs with standard ARIA patterns.
- **Preference Panels:** Constructing real-time configuration matrices where actions take place immediately upon click without a "Submit" step.

## When NOT to Use

- **Form Options Selection:** If the option must be submitted as part of a traditional `<form>` submission (e.g., "I agree to the Terms of Service"), use a standard `<input type="checkbox">` instead.
- **Multi-Option Toggles:** If choosing between three or more values (e.g., "Low", "Medium", "High"), use a Radio Group (`role="radiogroup"`) or a dropdown Select (`<select>`).
- **Standard Navigation:** If the element triggers navigation or opens a temporary container (like a menu or modal), use standard buttons (`<button aria-haspopup="true">`) instead.

## Inputs

1. **State representation:** The variable or state representing active (`true`) or inactive (`false`).
2. **Context:** Whether the action operates inline immediately (requires JS/AJAX) or acts as a form field.
3. **Visual Specs:** Styling requirements for the track, the thumb, active state colors, and focus states.
4. **Label Content:** Clear, visible text describing the setting being toggled.

## Outputs

1. **Semantic Structure:** ARIA-compliant HTML using either `<button role="switch">` (for JS actions) or `<input type="checkbox" role="switch">` (for standard forms).
2. **Accessible Interaction Logic:** JavaScript handlers for keydowns and click actions, managing the `aria-checked` attribute or synchronizing native `checked` properties.
3. **Robust Visual System (CSS):** Inclusive styling with custom properties, clear visual indicators of the switch's state, and high-contrast support (Windows Contrast Mode).
4. **Focus & Touch Targets:** Conformance to touch target dimensions (at least 44x44px) and persistent, high-contrast focus rings.

## Workflow

### 1. Select the Right Implementation Strategy

There are two primary ways to implement a toggle switch on the frontend:

#### Approach A: The `<button>` Element (Recommended for single settings panels with JS)
Best when the setting takes effect immediately using API calls or client-side updates.

```html
<div class="switch-container">
  <span id="label-notifications" class="switch-label">Push Notifications</span>
  <button type="button"
          role="switch"
          id="switch-notifications"
          aria-checked="false"
          aria-labelledby="label-notifications"
          class="switch-control">
    <span class="switch-thumb"></span>
  </button>
</div>
```

#### Approach B: The `<input type="checkbox">` Element (Recommended for forms)
Best when the switch sits inside a native HTML `<form>` or when a clean non-JS fallback is required.

```html
<div class="switch-container">
  <label for="switch-marketing" class="switch-label">Marketing Emails</label>
  <div class="switch-wrapper">
    <input type="checkbox"
           role="switch"
           id="switch-marketing"
           class="switch-input">
    <span class="switch-track" aria-hidden="true">
      <span class="switch-thumb"></span>
    </span>
  </div>
</div>
```

---

### 2. Styling with Resilience (CSS)

A robust toggle switch must remain usable under multiple conditions: when custom colors are overridden by the system, when scaled up, or when used with standard screen magnifiers.

- **Hide Input Safely:** For Approach B, never use `display: none` or `visibility: hidden` on the input. It must remain focusable in the layout. Use visual hiding patterns:

```css
.switch-input {
  position: absolute;
  opacity: 0;
  width: 36px;
  height: 20px;
  margin: 0;
  cursor: pointer;
  z-index: 2;
}
```

- **Visual States and Custom Properties:** Use CSS variables to easily animate the movement of the thumb.

```css
.switch-track {
  --track-width: 48px;
  --track-height: 24px;
  --thumb-size: 18px;
  --thumb-offset: 3px;

  display: inline-block;
  width: var(--track-width);
  height: var(--track-height);
  background-color: #cbd5e1; /* Neutral track (inactive) */
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s ease;
}

.switch-thumb {
  display: block;
  width: var(--thumb-size);
  height: var(--thumb-size);
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: var(--thumb-offset);
  transform: translateY(-50%);
  transition: left 0.2s ease;
}

/* Active State - Input Checked */
.switch-input:checked + .switch-track {
  background-color: #10b981; /* High-contrast active color (Green) */
}

.switch-input:checked + .switch-track .switch-thumb {
  left: calc(var(--track-width) - var(--thumb-size) - var(--thumb-offset));
}
```

- **High Contrast Fallbacks:** Devices running "Windows High Contrast Mode" ignore background colors. Add borders or utilize system colors to guarantee state changes are perceivable.

```css
@media (forced-colors: active) {
  .switch-track {
    border: 2px solid ButtonText;
  }
  .switch-input:checked + .switch-track .switch-thumb {
    background-color: SelectedText;
  }
}
```

- **Focus Indicator (Crucial):** Never remove default focus outlines without replacing them with highly-visible custom rings.

```css
.switch-input:focus-visible + .switch-track {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
}
```

---

### 3. Handle Interactive Logic (JS)

#### Handling Approach A (`<button role="switch">`)
Since this is a custom button, JavaScript must toggle the `aria-checked` string representation ("true" or "false") when activated by a mouse click or standard keyboard inputs (`Space` and `Enter`).

```javascript
const switchBtn = document.getElementById('switch-notifications');

switchBtn.addEventListener('click', () => {
  const isChecked = switchBtn.getAttribute('aria-checked') === 'true';
  const newState = !isChecked;

  // 1. Update State
  switchBtn.setAttribute('aria-checked', String(newState));

  // 2. Trigger Action (e.g., save preference API)
  updatePreference('notifications', newState);
});
```

#### Handling Approach B (`<input type="checkbox" role="switch">`)
Standard browsers map the keyboard `Space` key to check/uncheck a checkbox automatically. However, unlike a button, standard inputs do **not** trigger on the `Enter` key. Adding custom key listeners to make checkboxes toggle on `Enter` ensures keyboard accessibility parity.

```javascript
const switchInput = document.getElementById('switch-marketing');

switchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    switchInput.click(); // Programmatically trigger selection
  }
});
```

---

### 4. Provide Screen Reader Announcements

By default, modern screen readers announce elements with `role="switch"` as "Switch, On" or "Switch, Off".
- **Visual Sync:** Ensure the visible label stays perfectly aligned with what is read.
- **Immediate State Changes:** Avoid updating the visible label's text from "On" to "Off" dynamically (e.g., having a label that reads "Notifications are On" and changes to "Notifications are Off" when clicked). This is highly confusing. Keep the label static (e.g., "Allow Push Notifications") and let the screen reader announce the binary switch state ("On" or "Off").

## Decision Rules

- **Use `<button role="switch">` when:**
  - You are building inside an SPA (React, Vue, Svelte) or using API-driven configurations.
  - You need standard keyboard interactions (`Enter` and `Space` are handled natively by `<button>`).
  - You want to avoid native browser checkbox artifacts (like double-firing events or styling conflicts).

- **Use `<input type="checkbox" role="switch">` when:**
  - You require maximum fallback support for users running without JavaScript.
  - The switch sits inside a `<form>` container and must participate in the natural `submit` process or payload serialization.
  - You are leveraging standard HTML validations.

## Constraints

- **Touch Target Dimensions:** The interactive target area must meet or exceed WCAG guidelines of **44x44px** (WCAG 2.1) or **24x24px** inline target area (WCAG 2.2). Make the invisible clickable wrapper large even if the styled track is small.
- **Contrast Ratios:**
  - The track/thumb active state color must have a **3:1 contrast** minimum against the background if the color is the primary indicator of state change.
  - If a label is present, the label text must have at least **4.5:1 contrast** against its background (WCAG AA).
- **Animation Performance:** Animating the switch thumb must use GPU-accelerated CSS properties (`transform`, `opacity`, `left` if absolute, or `translate()`) rather than padding or margin updates to avoid layouts repaints.

## Non-Goals

- Implementing drag-and-swipe gestures to flip the switch (standard tap/click interactions are expected and sufficient).
- Designing complex micro-interactions (such as spring or particle animations when turning the switch on).
- Handling server-side data synchronization or global state persistence.

## Common Failure Patterns

- **The "Dead Div" Switch:** Building the switch using styled `<div>` elements with a custom `click` listener. This fails to provide focus capabilities, keyboard support, or screen reader roles.
- **The "Checkbox Mismatch" (Missing `role="switch"`):** Using a standard styled checkbox without `role="switch"`. Screen reader users will hear "Checkbox, checked" instead of "Switch, on", which misaligns with immediately acting UI patterns.
- **Double Labels:** Wrapping a `<button>` switch inside a `<label>` element. Labels are meant for form controls; wrapping a button creates conflicting focus maps and confusing screen reader output.
- **"On/Off" State in Label:** Changing the text content of the visible label when the switch state changes. This causes the screen reader to double-read or get out of sync (e.g., "Dark mode: dark mode enabled, switch off").
- **Contrast Failure:** Relying solely on a change from light gray to light green to signal that the switch is on, which is invisible to color-blind users. Include borders, text indicators, or strong 3:1+ high-contrast changes.

## Validation Criteria

- [ ] **Screen Reader Test:** Open a screen reader (e.g., VoiceOver, NVDA) and navigate to the switch. Confirm it announces the switch role and its state (e.g., *"Push Notifications, switch, off"*).
- [ ] **Keyboard Interaction Test:** Focus the switch using the `Tab` key. Verify that pressing `Space` toggles the state for both implementations, and `Enter` toggles the state for the `<button>` implementation (and `<input>` implementation if keydown triggers are added).
- [ ] **Focus Ring Test:** Navigate to the switch using only keyboard. Ensure a distinct, highly visible focus ring outlines the switch structure.
- [ ] **Contrast Verification:** Measure the contrast ratio of the active green color against the page background to ensure it is at least 3:1.
- [ ] **High Contrast System Check:** View the switch under a system Forced Contrast/High Contrast theme. Confirm that the state of the switch (On vs. Off) remains visually distinct via outline or outline-thickness styles.
- [ ] **Touch Target Check:** Verify that the interactive click/tap area is at least 44x44px.
