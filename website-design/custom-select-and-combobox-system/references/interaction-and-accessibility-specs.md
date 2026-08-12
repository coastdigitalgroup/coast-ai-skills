# Custom Select & Combobox Accessibility Specification Reference

This document provides complete, WAI-ARIA 1.2 compliant accessibility rules, keyboard focus models, and screen reader behavior criteria for custom dropdown selects, comboboxes, and multi-select systems.

---

## 1. WAI-ARIA Semantic Role Mapping

Building accessible custom selections requires structuring the HTML with precise semantic roles and active state management. Follow this structural tree:

| Element Role | Semantic HTML Element | ARIA Attribute | State and Value Definition |
| :--- | :--- | :--- | :--- |
| **Trigger Element** | `<button>` (Single) or `<div tabindex="0">` (Multi) | `role="combobox"` | Set to signify that this is an input controller for collapsible options. |
| | | `aria-haspopup="listbox"` | Explicitly declares that activating this trigger displays a list of options. |
| | | `aria-expanded="true / false"` | Programmatically toggle to `true` when the dropdown is visible, and `false` when hidden. |
| | | `aria-controls="listbox-id"` | Declares the programmatic ID relation linking the trigger to the dropdown list. |
| | | `aria-labelledby="label-id"` | Links the trigger back to the persistent visual form label. |
| **Dropdown Panel** | `<ul>` or `<div>` containing options | `role="listbox"` | Marks the container as a selectable list. |
| | | `aria-labelledby="label-id"` | Links the listbox back to the form label for screen reader context. |
| | | `tabindex="-1"` | Prevents the screen reader or tab keys from focusing the list element itself (focus goes to options). |
| **Option Item** | `<li>` | `role="option"` | Marks each row as a distinct choice. |
| | | `aria-selected="true / false"` | Set to `true` on the currently selected item. Highly critical for screen readers. |
| | | `aria-disabled="true"` | Set if the option is visually greyed out and cannot be selected. |

---

## 2. Autocomplete Combobox Roles (Searchable Selects)

When the custom select includes an integrated search input to filter long lists (Combobox), apply these extra definitions:

- **Search Input:**
  - Must use `role="searchbox"` or standard `<input type="text">`.
  - Must declare `aria-autocomplete="list"` to notify assistive technology that typing will filter the associated options list.
  - Must declare `aria-controls="listbox-id"` linking it to the filtered listbox.
  - Must declare `aria-activedescendant="option-unique-id"` pointing to the active visually-focused option inside the listbox. This allows screen readers to announce the current option as the user scrolls up and down with arrow keys without losing physical keyboard focus from the text input field.

---

## 3. Keyboard Interaction Rules

All interactive elements must be accessible via keyboard only. Developers must programmatically bind these keyboard interactions:

```text
Keyboard Flow Scenario:
[Trigger Focused] ── Space/Enter/ArrowDown ──> [Open Panel & Focus Search Input]
                                                     │
    [Return Focus to Trigger] <── Escape/Tab ────────┴── ArrowDown/ArrowUp ──> [Cycle Highlight States]
```

### Key Mapping Matrix

| Key Command | Element Context | Expected System Response |
| :--- | :--- | :--- |
| `Tab` | Trigger Button (Closed) | Moves focus to the next form element on the page. |
| `Tab` | Dropdown Panel (Open) | Closes the panel, submits any highlighted choice, and moves focus to the next focusable element. |
| `Space` or `Enter`| Trigger Button (Closed) | Opens the dropdown panel, displaying choices. Moves focus to the first selectable option or search input. |
| `Space` or `Enter`| Option Row (Focused) | Selects the highlighted option, updates the trigger value, closes the dropdown panel, and returns focus back to the Trigger. |
| `ArrowDown` | Trigger Button (Closed) | Opens the dropdown panel and highlights the first option. |
| `ArrowDown` | Dropdown Panel (Open) | Moves the active highlight indicator to the **next** selectable option row. If on the last option, focus wraps back to the first option. |
| `ArrowUp` | Dropdown Panel (Open) | Moves the active highlight indicator to the **previous** selectable option row. If on the first option, focus wraps to the last option. |
| `Escape` | Dropdown Panel (Open) | Instantly closes the panel without modifying selections and programmatically returns focus back to the Trigger element. |
| `Home` / `End` | Dropdown Panel (Open) | Moves active highlight straight to the first or last available option row inside the scroll view. |

---

## 4. Screen Reader Live Announcements

To ensure blind or visually impaired users receive dynamic feedback during searches or multi-selections, use a visually hidden `aria-live` announcer.

### A. Announcement Rules for Search Filtering (Combobox)
When a user types into the search field, a hidden element with `role="status"` and `aria-live="polite"` should be programmatically updated with filtered counts:
- *User Types:* "can"
- *Live Announcement:* "5 options found. Use up and down arrow keys to navigate."
- *User Types:* "canada"
- *Live Announcement:* "1 option found: Canada. Press Enter to select."

### B. Announcement Rules for Multi-Select Tokens
When adding or removing values in a multi-select token input, update the screen reader:
- *Action:* Admin selects "Security Officers" chip.
- *Live Announcement:* "Security Officers added. 2 total groups selected."
- *Action:* Admin clicks "[x]" delete on "Billing Admins" chip.
- *Live Announcement:* "Billing Admins removed."

---

## 5. Touch and Pointer Target Specifications

- **Click Target Padding:** To comply with WCAG 2.2 SC 2.5.8 (Target Size Minimum - AA), all interactive bounds (Triggers, Option rows, Chip delete icons) must occupy a physical area of at least **24x24px**.
- **Preferred Mobile Targets:** For optimized thumbs-on-screens interaction, enforce a minimum height of **44px to 56px** for all touch controls on viewports below 640px wide.
- **Scroll Spill Containment:** The list scroll container must declare `overscroll-behavior: contain`. This prevents scroll-chaining where scrolling inside the option box inadvertently scrolls the underlying parent website body page.
