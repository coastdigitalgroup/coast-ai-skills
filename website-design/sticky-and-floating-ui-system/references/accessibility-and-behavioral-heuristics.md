# Accessibility and Behavioral Heuristics for Sticky, Floating, and Docked UI

This reference guide provides design, implementation, and quality auditing heuristics for persistent website overlays.

---

## 1. WCAG 2.2 SC 2.4.11: Focus Not Obscured (Minimum)

Introduced in WCAG 2.2, Success Criterion 2.4.11 requires that when an element receives keyboard focus, that element must not be entirely hidden or obscured by persistent sticky banners, floating sidebars, headers, or footers.

### The Design Failure
A keyboard user tabs through the page structure. The browser focus naturally travels down through body text links. A link within a section receives focus, but since a `position: fixed` header is docked to the top of the viewport, the link lies underneath the header's surface. The user has no way of knowing where the active focus is.

```text
+------------------------------------------+
|  [Sticky Header Area - Opaque Surface]   | <-- Focus lands underneath this
+------------------------------------------+
|  Page Content Area                       |
|                                          |
|  - Focused link (OBSCURED BY HEADER!)    |
+------------------------------------------+
```

### Heuristic Fixes
1. **Dynamic Scroll Margin offsets:**
   Apply `scroll-margin-top` and `scroll-margin-bottom` directly to headings, forms, sections, and focusable items. This forces the browser to align the focused element with a comfortable buffer outside the sticky element's boundaries:
   ```css
   :target,
   a:focus-visible,
   button:focus-visible,
   input:focus-visible,
   [id] {
     scroll-margin-top: calc(var(--header-height) + var(--space-m));
     scroll-margin-bottom: calc(var(--dock-height) + var(--space-m));
   }
   ```
2. **Focus-Triggered Un-Sticky (Optional):**
   If keyboard focus enters a section that is partially covered, use JavaScript focus listeners to dynamically hide or translate the progressive header up until focus shifts elsewhere.

---

## 2. Hardware Safe-Area Metrics (Mobile Viewports)

Physical mobile viewports incorporate visual notches, speaker curves, and system home bars. Failure to programmatically accommodate these causes overlap bugs, preventing users from clicking buttons.

```text
+-----------------------+
|  [ Notch / Status ]   |
|                       |
|                       |
|                       |
|                       |
|                       |
|  [ Swipe Home Bar ]   | <-- env(safe-area-inset-bottom)
+-----------------------+
```

### Safe-Area Formula
Always use CSS environmental variables to pad fixed elements located at extreme viewport boundaries.

* **Top Sticky Headers:**
  ```css
  .sticky-top-header {
    padding-top: calc(var(--base-padding) + env(safe-area-inset-top));
  }
  ```
* **Bottom Persistent Docks:**
  ```css
  .sticky-bottom-dock {
    padding-bottom: calc(var(--base-padding) + env(safe-area-inset-bottom));
  }
  ```

### Safari & Chrome Bottom Tab Bars
On mobile iOS Safari, the browser chrome features a floating, dynamic tab bar. When a user scrolls down, this tab bar minimizes. When they tap or scroll up, it expands.
* **Avoid `100vh` on Sticky Elements:** Never use a raw `100vh` height value to calculate fixed or sticky offsets on mobile. Instead, utilize **Dynamic Viewport Units (`dvh`)** or **Small Viewport Units (`svh`)**:
  ```css
  .full-overlay-panel {
    height: 100dvh; /* Adapts dynamically to expanding/collapsing browser tabs */
  }
  ```

---

## 3. Elevation & Z-Index Layering Tiers

To prevent "Z-Index Wars" where components randomly clip through each other, establish a strict stacking context.

| Tier Value | Layer Designation | Example Components |
| :--- | :--- | :--- |
| **`z-index: auto / 0`** | Base canvas | Standard page body grid, static cards, text, inline media |
| **`z-index: 10`** | Raised elements | Absolute decorative assets, low-elevation indicators |
| **`z-index: 100`** | Sticky frame anchors | Progressive navigation header, sticky sidebar widget |
| **`z-index: 150`** | Viewport persistent overlays | Mobile bottom CTA dock, floating action triggers (FABs) |
| **`z-index: 500`** | Modal Backdrops (Scrims) | Screen-dimming overlay layers (`dialog::backdrop`) |
| **`z-index: 600`** | Interactive Modals/Drawers | Focused dialog overlays, side drawer sliders |
| **`z-index: 1000`** | System Alerts & Toasts | Asynchronous notification banners, global error modals |

---

## 4. Scroll performance and Layout Shift

Updating layout metrics using scroll listeners often triggers **forced synchronous layouts** (layout thrashing), causing visual stuttering or lagging page movement.

### Performance Heuristics
* **Utilize passive scroll listeners:** Always declare passive listeners to allow the browser to paint scroll actions on the main thread without blocking:
  ```javascript
  window.addEventListener('scroll', handleScroll, { passive: true });
  ```
* **Prefer CSS Transforms over direct position properties:** Never animate positioning using `top`, `bottom`, `left`, or `right` styles. Direct positioning forces a browser paint and layout calculation. Instead, animate using `transform: translateY()` or `transform: opacity()`, which utilizes GPU acceleration.
* **Use IntersectionObserver:** For threshold-based triggers (such as revealing a mobile bottom dock once a hero section scrolls off-screen), use a native `IntersectionObserver` on an inline target anchor. This is vastly more performant than running arithmetic height checks on every scroll tick.
