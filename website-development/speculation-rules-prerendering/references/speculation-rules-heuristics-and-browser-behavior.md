# Speculation Rules API: Browser Behavior, Schema & Heuristics

This reference guide provides in-depth technical details on the Speculation Rules API (`<script type="speculationrules">`), document-level rule matching syntax, eagerness level behaviors, security boundaries, and browser background prerendering mechanics.

---

## 1. Speculation Rules JSON Schema

The Speculation Rules API requires a top-level JSON object inserted into a `<script type="speculationrules">` element.

```json
{
  "prefetch": [
    {
      "source": "list | document",
      "urls": ["/path-1", "/path-2"],
      "where": { /* Document matching criteria */ },
      "eagerness": "immediate | eager | moderate | conservative"
    }
  ],
  "prerender": [
    {
      "source": "document",
      "where": { /* Document matching criteria */ },
      "eagerness": "moderate"
    }
  ]
}
```

### Key Properties

- **`prefetch`**: Instructs the browser to download the main HTML resource and its associated subresources (CSS, JS, images) into the HTTP cache without parsing or executing script state.
- **`prerender`**: Instructs the browser to download, parse, execute scripts, build the DOM, and paint layout in a hidden background tab, providing sub-100ms instant page loads upon navigation.
- **`source`**:
  - `"list"`: Explicit array of candidate URLs provided in `urls`.
  - `"document"`: Automatic URL discovery based on `<a>` and `<area>` elements matching criteria in `where`.

---

## 2. Document Rule Selector Syntax (`where` clause)

When `source: "document"` is specified, the `where` clause filters links dynamically in the current document.

### Supported Match Conditions

1. **`href_matches`**: Matches link URL patterns using wildcards (`*`).
   ```json
   { "href_matches": "/products/*" }
   ```
2. **`selector_matches`**: Matches links via standard CSS selectors.
   ```json
   { "selector_matches": "a.featured-product" }
   ```
3. **`not`**: Inverts a condition (used for excluding unsafe routes).
   ```json
   { "not": { "href_matches": "/cart/*" } }
   ```
4. **`and` / `or`**: Logical combination operators.
   ```json
   {
     "and": [
       { "href_matches": "/blog/*" },
       { "not": { "selector_matches": ".no-prerender" } }
     ]
   }
   ```

---

## 3. Eagerness Levels & User Intent Triggers

The `eagerness` property controls when the browser initiates the prefetch or prerender task.

| Eagerness Level | User Gesture Trigger | Intended Use Case | Overhead / Risk |
| :--- | :--- | :--- | :--- |
| **`immediate`** | Script parsing time (no user gesture required) | Deterministic 1-step checkout or onboarding flows | Highest bandwidth & memory usage. Use for max 1 link. |
| **`eager`** | Link entering the visible viewport, or slight hover (<100ms) | Primary hero call-to-action buttons | Moderate background network traffic. |
| **`moderate`** | Hover over link for **> 200ms**, or `pointerdown` | Product card grids, category navigation links | Optimal balance of precision and latency reduction (~100ms gain). |
| **`conservative`** | Explicit `pointerdown` / `touchstart` | Secondary links, long lists, footer links | Minimal overhead (~50-100ms head start before click). |

---

## 4. Background Prerender Execution Rules (`document.prerendering`)

When a page is prerendered in the background:

1. **JavaScript Execution:**
   - Standard DOM construction (`DOMContentLoaded`, `load` events) fires normally.
   - Scripts execute, but rendering output is sent to a hidden, non-visible buffer.

2. **Blocked / Deferred APIs During Prerendering:**
   - **Audio / Video Autoplay:** `.play()` requests are blocked until page activation.
   - **Fullscreen & Pointer Lock:** Request APIs fail or reject while hidden.
   - **Prompt / Dialog APIs:** `alert()`, `confirm()`, `prompt()` calls automatically defer or throw exceptions.
   - **Web Bluetooth / WebUSB / WebMIDI:** Device access prompts are delayed until activation.

3. **Lifecycle API Integration:**
   ```javascript
   // Check if currently background prerendering
   if (document.prerendering) {
     console.log('Page is rendering in background tab...');
     document.addEventListener('prerenderchange', () => {
       console.log('Page activated by user click!');
     }, { once: true });
   }
   ```

---

## 5. Security, Privacy & Cross-Origin Rules

- **Credential Mode:** By default, same-origin prerendering includes user credentials (cookies, HTTP auth).
- **Cross-Site Opt-in (`Supports-Loading-Mode`):** Cross-site or cross-origin prerendering requires the target cross-origin server to explicitly opt in by returning the HTTP response header:
  ```http
  Supports-Loading-Mode: credentialed-prerender
  ```
  If this header is missing on a cross-origin target, the browser automatically downgrades the request to `prefetch` or cancels it.
- **Content Security Policy (CSP):** Inline speculation rules scripts require CSP support:
  ```http
  Content-Security-Policy: script-src 'self' 'inline-speculation-rules';
  ```

---

## 6. Chrome DevTools Debugging

1. Open Chrome DevTools -> **Application** tab.
2. Under **Background Services**, click **Speculative Loads**.
3. **Rules Tab:** Shows all active speculation rules, their source, and validation status.
4. **Speculations Tab:** Displays candidate target URLs, their current status (`Not Triggered`, `Pending`, `Ready`, `Prerendered`, `Ejected`), and failure reasons (e.g., `SaveDataEnabled`, `MimeTypeNotSupported`, `UserOptOut`).
