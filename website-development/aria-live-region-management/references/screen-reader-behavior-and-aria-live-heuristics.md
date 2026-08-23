# Screen Reader Behavior & ARIA Live Heuristics

This reference guide documents platform-specific screen reader quirks, ARIA specification details, implicit role mappings, and queueing heuristics for building reliable live region announcers.

---

## 1. Implicit ARIA Role Mappings & Attributes

Standard WAI-ARIA roles include implicit live region politeness behaviors:

| ARIA Role | Implicit `aria-live` | Implicit `aria-atomic` | Recommended Use Case |
| :--- | :--- | :--- | :--- |
| `role="status"` | `polite` | `true` | Search counts, autosave indicators, cart updates. |
| `role="alert"` | `assertive` | `true` | Severe errors, connection loss, critical warnings. |
| `role="log"` | `polite` | `false` | Chat logs, terminal outputs, activity streams. |
| `role="timer"` | `off` | `false` | Countdown timers, stopwatches (do not announce per tick). |
| `role="marquee"` | `off` | `false` | Scrolling tickers, news banners. |

### `aria-atomic` Behavior
- `aria-atomic="true"`: Screen reader presents the **entire contents** of the live region when any node changes. Crucial for status messages (e.g., reading "14 items found" rather than just "14").
- `aria-atomic="false"` (Default): Screen reader presents **only the modified or appended text node**. Ideal for chat logs or append-only activity streams (`role="log"`).

### `aria-relevant` Options
Controls which DOM mutations trigger announcements:
- `aria-relevant="additions text"` (Recommended default): Triggers when text nodes or child elements are added.
- `aria-relevant="removals"`: Triggers when elements are deleted (rarely used, usually confusing).
- `aria-relevant="all"`: Triggers on additions, text modifications, and node removals.

---

## 2. Screen Reader Engine Quirks & Gotchas

### VoiceOver (macOS & iOS)
- **Dynamic Container Ignorance:** VoiceOver attaches accessibility observers to live regions when the DOM tree is parsed. If an element with `aria-live="polite"` is created via JavaScript and given text in the same event tick, VoiceOver completely ignores it. The container MUST exist in the static DOM or be inserted at least one frame prior to content insertion.
- **`display: none` Tree Stripping:** If a live region has `display: none` or `visibility: hidden`, VoiceOver detaches it from the accessibility tree. Toggling to `display: block` and populating text simultaneously will cause the announcement to be missed.

### NVDA (Windows)
- **Identical String Suppression:** NVDA compares incoming text node updates with its internal speech history buffer. If the text string matches the previous string exactly (e.g., clicking "Copy" twice -> "Copied to clipboard"), NVDA ignores the 2nd mutation. Micro-clearing the text node (`textContent = ''`) followed by a 50ms delay forces NVDA to treat it as a fresh event.
- **Focus Speech Overrides Polite Live Regions:** If an `aria-live="polite"` message fires at the exact moment the user presses `Tab` to focus a button, NVDA prioritizes the focused element speech and silently discards the polite message.

### JAWS (Windows)
- **Speech Interrupts on Un-debounced Inputs:** Typing rapidly in an input field attached to an un-debounced `aria-live` region causes JAWS to interrupt itself mid-syllable, resulting in stuttering audio (e.g., "S... Se... Sear...").

---

## 3. Performance & Queueing Heuristics

1. **Debounce Thresholds:**
   - **Typeahead / Search:** 300ms–500ms after last keyup.
   - **Range Slider / Drag Handles:** Debounce until interaction completes (`change` event or 400ms pause).

2. **Sequential Queue Spacing:**
   - Maintain a minimum of **600ms–1000ms** speech delay between consecutive queued status announcements to prevent sentence overlapping.

3. **Character Length Limits:**
   - Keep status messages concise (under 150 characters). Screen reader users cannot easily pause or repeat live announcements like static text content.
