---
name: custom-select-and-combobox-system
description:
  Design a systematic, accessible, and high-conversion framework for custom
  select dropdowns and comboboxes, defining anatomy, states, search-filtering,
  and responsive mobile-adaptive patterns.
---

# Custom Select and Combobox System

## Purpose

The Custom Select and Combobox System provides a systematic methodology for designing and structuring drop-down options, auto-completing search selectors (comboboxes), and multi-select token inputs.

Standard HTML `<select>` elements are notoriously difficult to style consistently across browsers, and they cannot support rich layout compositions (such as descriptions, icons, badges, or sub-grids within individual choices). However, custom drop-downs are a frequent source of catastrophic accessibility failures, keyboard traps, and usability bugs. This skill establishes design, spatial, and interaction standards to ensure that custom select components remain visually cohesive, highly responsive, and completely accessible (WCAG 2.2 AA compliant).

---

## Use Cases

Apply this system when designing:
- **Rich-Content Dropdowns:** Selection items that require visual indicators, subtitles, auxiliary metadata, or status badges (e.g., country selectors with flag icons, workspace switchers, or account profiles).
- **Searchable Selectors (Comboboxes):** Dropdowns with more than 10 options where a user must be able to filter choices via an inline search input (e.g., long state/province lists, tag selections).
- **Multi-Select Token Fields:** Fields where multiple selections are allowed and must be rendered as dismissed badges/chips inside or adjacent to the trigger container.
- **Dynamic Configuration Filters:** High-density filter controls (e.g., on e-commerce or data dashboard sidebars) that need rich layout alignment and immediate contextual feedback.

---

## When NOT to Use

Do NOT apply this system for:
- **Low Option Volume (2 to 5 options):** Use a `segmented-control-system` or standard grouped radio buttons. This avoids hiding options behind an extra click and lowers cognitive load.
- **Global Page Navigation:** If clicking a dropdown item immediately redirects the user to a different page or sitemap node, use `site-navigation-system` or a nested dropdown menu. Select inputs are semantic form fields meant for editing properties, not traversing sitemaps.
- **Standard Un-styled Forms:** For generic, low-priority, or utility forms (like basic contact fields), default to native browser `<select>` inputs. Native dropdowns offer perfect, free mobile responsiveness and native screen reader support.
- **Full-Screen Command Palettes:** If the goal is searching across the entire app's pages and actions rather than selecting a single form value, use `command-palette-system`.

---

## Inputs

Before designing a custom select or combobox, gather the following requirements:
1. **Option Cardinality & Density:** How many options exist (e.g., 5, 50, 500+)? What is the maximum character length?
2. **Select Type:** Single-select vs. Multi-select? Static list vs. Asynchronously filtered query list (Combobox)?
3. **Data Richness:** Do options require auxiliary visuals (icons, avatars, flags, color chips) or supporting text (sub-labels, pricing modifiers, active user counts)?
4. **Layout Context:** Will this sit in a high-density sidebar, a spacious landing page, an overlay modal, or a persistent settings dashboard?
5. **Brand Tokens:** Spacing scale (`fluid-spacing-system`), typography scale (`fluid-typography-system`), focus rings (`focus-indicator-design-system`), and elevation shadow scales (`elevation-and-depth-system`).

---

## Outputs

This system produces the following design deliverables:
1. **Anatomy Specification:** Detailed blueprint showing spacing, alignments, icons, text truncation rules, and border/background layers for both the **Trigger** and **Dropdown Panel**.
2. **State & Interactive Matrix:** Defined visual styles for Hover, Active/Open, Selected, Focused, Disabled, and Validation-Error states.
3. **Responsive Adaptive Model:** Structural specs detailing how the desktop dropdown translates to mobile viewports (e.g., converting to a bottom drawer/sheet or a native fallback overlay).
4. **Accessibility Map (WAI-ARIA & Keyboard):** Precise roles, live-region declarations, focus tracking states, and key-mapping behavior to hand off to developers.

---

## Workflow

### 1. Structure the Component Anatomy

A complete custom select system consists of two primary spatial layers:

#### A. The Trigger (The Field)
- **Container:** Height-matched with adjacent form inputs (typically 40px to 48px to allow touch targets). Uses a neutral outline (3:1 contrast against page background) and defined padding (usually `12px 16px`).
- **Value/Placeholder Slot:** Positioned on the left. Inactive text represents a placeholder (contrast >= 4.5:1 against field background). Selected text is styled with a primary neutral weight.
- **Visual Affordance (Arrow Chevron):** Positioned on the far right. Use a distinct down-pointing chevron to signify collapsible content. Rotate the chevron 180 degrees when the menu is active.
- **Selected Badges (Multi-select only):** Compact inline chips with individual close (x) controls that wrap gracefully or truncate with count modifiers (e.g., "+3 more").

#### B. The Dropdown Panel (The Menu)
- **Overlay Container:** Sits on a higher Z-axis level (`elevation-and-depth-system` Level 3/4). Rendered below the Trigger by default, or above it if the viewport edge restricts bottom space. Uses a distinct shadow (e.g., `box-shadow` with a soft blur) to lift it from the background page.
- **Scroll Container:** Set max height constraints (typically `240px` to `320px` / 5–8 items) to prevent the panel from bleeding off the page. Use a visible, scrollbar-shift-preventing scroll track for longer lists.
- **Search Input (Combobox only):** A sticky search input pinned to the top of the dropdown panel with persistent focus upon menu activation.

#### C. Option Items (The Choices)
- **Layout:** Horizontal flex layout consisting of visual assets on the left, primary text (and subtitle if rich option) in the center, and selection state indicator (such as a checkmark) on the right.
- **Safe Padding:** Minimum vertical padding of `8px` and horizontal match to the trigger's horizontal padding (`12px` to `16px`).

```text
+------------------------------------------+
|  Select Country                     [v]  |  <-- Trigger (Closed)
+------------------------------------------+

+------------------------------------------+
|  [Q] Search countries...                 |  <-- Sticky Search input
+------------------------------------------+
|  [x] Canada                              |  <-- Option (Selected & Focused)
|      ISO: CA | +1 Country Code           |
|------------------------------------------|
|  [ ] Germany                             |  <-- Option (Default)
|      ISO: DE | +49 Country Code          |
+------------------------------------------+
```

---

### 2. Formulate the State and Feedback Matrix

Design distinct, non-ambiguous styles for every lifecycle state of the component:

- **Default State:** Trigger uses a clear outline (minimum 3:1 contrast against page background) with clear text labels (minimum 4.5:1 contrast).
- **Hover State:** Subtle background tint shift on the trigger (e.g., low-contrast gray) and option rows to signal interactive capability. Cursor is set to `pointer`.
- **Focused State:** A highly visible focus ring surrounding the active element. For comboboxes, focus should sit on the search input while the list is open, but use a visual focus treatment (e.g., background tint or active outline) on the highlighted list option.
- **Active / Expanded State:** The chevron rotates, the trigger outline changes color (e.g., primary brand color), and the Dropdown Panel appears with a smooth height and opacity transition (150ms to 250ms).
- **Selected State:** Option rows change visually when chosen. Use a high-contrast checkmark icon on the far right and subtle background fill. Do not rely on color alone to indicate selection.
- **Disabled State:** Visual opacity reduced to 40%–50%. The cursor becomes a `not-allowed` indicator, and the element is skipped in the tab index.
- **Error / Invalid State:** The trigger outline turns to a validation-error color (usually high-contrast red, >= 3.1 contrast) with an accompanying error message and error icon below the input.

---

### 3. Establish Spatial and Placement Rules

To avoid layout clashing and Cumulative Layout Shift (CLS):
- **Dynamic Positioning (Flip-behavior):** Calculate viewport boundaries. If the dropdown container is close to the bottom viewport fold, flip its alignment to slide upwards above the trigger.
- **Width Alignment:** The dropdown panel must align exactly with the left and right edges of the trigger, or have a defined minimum width that matches the trigger to prevent visual instability.
- **Overlay Isolation:** Use a CSS `z-index` stack that matches Level 3 (Sticky/Floating UI) or Level 4 (Overlay and Dialogs) of your elevation system. Always ensure the panel renders above adjacent form elements, backgrounds, and layout cards.

---

### 4. Design Responsive & Mobile Adaptations

Never force a multi-column or wide desktop dropdown menu into small mobile viewports. Apply these adaptive layout rules:

#### Pattern A: Mobile Bottom Sheet (Recommended for Rich Options)
On screen sizes below `640px` (or standard tablet breakpoints), translate the custom dropdown panel into a sliding **Bottom Sheet**:
- **Triggers:** Tapping the trigger opens a full-width bottom sheet overlay.
- **Scrim:** A semi-transparent dark backdrop (40% to 60% opacity) covers the main content, making background elements non-interactive.
- **Header:** The sheet contains a sticky header with a clear title and a large touch-accessible "Close" (x) button in the top-right corner.
- **Thumb Reachability:** Option rows occupy full screen width with an increased touch-target height (min 48px, preferred 56px) for effortless finger-tap selections.

#### Pattern B: Native Fallback (Recommended for Simple Lists)
On mobile viewports, completely hide the custom markup from screen-readers and the visual DOM, replacing it with a visually-hidden, layer-stacked native `<select>` element:
- **How it works:** Position a standard `<select>` directly over the custom trigger, styled with `opacity: 0`.
- **Result:** The user sees your custom branded trigger, but tapping it activates the native OS selection wheels (iOS Picker or Android Dialog). This provides unparalleled native performance and local accessibility.

---

### 5. Define Screen Reader & Keyboard Architecture

Custom select elements must support full assistive technologies. Specify this precise behavior for handoff:

#### ARIA Mappings & Semantics
- **The Trigger Button:** Must have `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded="true/false"`, and `aria-controls="listbox-id"`.
- **The Dropdown Panel:** Must have `role="listbox"`, labeled by the trigger's ID (`aria-labelledby="trigger-id"`).
- **The Option Items:** Must have `role="option"`. The currently selected item must have `aria-selected="true"`, and other items must have `aria-selected="false"`.
- **Focus Management:** For autocomplete comboboxes, the search input must have `aria-autocomplete="list"`. Use `aria-activedescendant="option-id"` on the input to track the visually highlighted option as the user moves their arrow keys up and down.
- **Live Announcements:** Use `aria-live="polite"` or a designated screen reader announcer element to broadcast select state changes or count updates (e.g., "5 options found. Use arrow keys to navigate.").

#### Keyboard Interaction Table
Your spec sheet must mandate these exact hotkey mappings:

| Action | Key Press | Expected Behavior |
| :--- | :--- | :--- |
| **Open Menu** | `Space` or `Enter` or `ArrowDown` | Opens the dropdown panel, places focus on first option (or search). |
| **Close Menu** | `Escape` or `Tab` | Closes the panel, returns keyboard focus back to the Trigger. |
| **Navigate Options**| `ArrowDown` / `ArrowUp` | Moves active highlight state to the next or previous option row. |
| **Select Option** | `Space` or `Enter` | Selects the highlighted option, updates value, closes panel. |
| **First/Last Item** | `Home` / `End` | Moves active highlight to the absolute start or end of option list. |
| **Jump Search** | Any Alphanumeric Key | If static, focus jumps immediately to first option starting with that letter. |

---

## Decision Rules

### Custom Select Options Decision Tree

```text
How many total options exist?
 ├── 2 to 5 options ─────────> Use SEGMENTED CONTROL or GROUPED RADIO BUTTONS
 ├── 6 to 10 options ────────> Use CUSTOM SELECT (Single column, no search input)
 └── More than 10 options ───> Use COMBOBOX (Custom select with integrated Search Input)
```

### Choosing the Correct Selection Pattern

| Requirement | Use Standard Select | Use Searchable Combobox | Use Multi-Select Tokens |
| :--- | :--- | :--- | :--- |
| **Select Limit** | Single value only | Single value only | Multiple values simultaneously |
| **Option Scale** | 6 to 15 items | 15 to 100+ items | 5 to 50 items |
| **Friction Type** | Low exploration | Needs quick target retrieval | Accumulative assembly |
| **Option Layout** | Simple text rows | Simple or Rich list rows | Chips/Tokens wrapping layout |

---

## Constraints

- **Focus Preservation:** When closing the dropdown via `Escape` or clicking outside, focus must NEVER be lost or reset to the top sitemap level. It must return programmatically to the Trigger element.
- **Focus Visibility (WCAG 2.2 SC 2.4.11):** Focus indicators on the trigger or active options must never be hidden or obscured by sticky page headers, floating bottom bars, or overlapping overlays.
- **Touch Target (WCAG 2.2 SC 2.5.8):** Every option row and trigger element must have a minimum clickable size of `24x24px`, with `40px` to `48px` height being the default layout requirement to avoid touch overlapping on mobile devices.
- **Color Contrast (WCAG AA):**
  - **Text:** Trigger text, labels, and option text must maintain a minimum `4.5:1` contrast against their background.
  - **UI Controls:** Borders, arrows, checkmarks, and search outlines must maintain a minimum `3:1` contrast against their background.
- **Prevent Scroll Leaking:** When the dropdown panel is scrolled to its boundary, further scroll gestures should not trigger background window scrolling (scroll-chaining/leakage). Add `overscroll-behavior: contain` to the panel container.
- **Avoid Screen Reader Isolation:** Never build custom select drop-downs using non-semantic `<div>` or `<span>` containers unless they are explicitly layered with a complete set of WAI-ARIA states, roles, and focus traps. An inaccessible dropdown breaks the checkout and conversion funnels.

---

## Common Failure Patterns

- **The Missing Keyboard Target:** The custom drop-down can be clicked by mouse users but is completely skipped when a keyboard user presses the `Tab` key.
- **The Placeholder Mistake:** Using the input placeholder to act as the form label, causing users to lose track of what information they are selecting once an option is active.
- **The Screen Reader Void:** Failing to update `aria-expanded` and `aria-selected` programmatically. Visually, the menu opens and changes states, but screen readers are left announcing a static, closed button.
- **Overflow Clipping (The Z-Index Trap):** The dropdown panel is positioned inside a container with `overflow: hidden` or `overflow: auto`, clipping the panel boundaries and hiding half of the choices from view.
- **Desktop Grid on Mobile:** Forcing a complex three-column grid of options onto a 320px viewport, resulting in tiny, overlapping text rows that are impossible to read or tap.
- **First-Letter Inactivity:** In static custom dropdowns, pressing a letter (e.g., "U" for United States) does not jump the focus to that item, requiring tedious scrolling for long lists.

---

## Validation Criteria

- [ ] Every custom dropdown trigger has a matching, persistent label (never relies on placeholders alone).
- [ ] Dropdowns with more than 10 options include an integrated Search Input (Combobox).
- [ ] Target sizes on all elements (trigger, tags, option rows) meet at least the WCAG 2.2 `24x24px` minimum (with `44px` height preferred).
- [ ] Text contrast (>= 4.5:1) and boundary/icon contrast (>= 3:1) are verified in both Light and Dark themes.
- [ ] Visual rotation of the chevron arrow aligns seamlessly with the expanded/collapsed state.
- [ ] Responsive adaptations are specified: Desktop dropdown flips to a Mobile Bottom Sheet or uses a Native Fallback.
- [ ] The dropdown panel has `overscroll-behavior: contain` to prevent scroll-chaining on background pages.
- [ ] WAI-ARIA roles (`combobox`, `listbox`, `option`) and keyboard bindings are explicitly detailed in developer handoff specifications.
- [ ] Focus returns to the Trigger button when the menu is collapsed.
