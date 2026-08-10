# Zoom & Text-Resize Resilience Audit Checklist

This template is an actionable audit protocol and remediation guide for evaluating frontend layout stability against browser page zooming (up to 400%) and system/browser-level default text-only resizing (up to 200%). Use it to ensure compliance with **WCAG 2.1 AA Success Criteria 1.4.4 (Resize Text)** and **1.4.10 (Reflow)**.

---

## Part 1: Diagnostic Test Procedures

### Test 1: The 200% Text-Only Resize Audit
This test alters the root font size without changing the viewport dimensions. It reveals hardcoded pixel limitations.
1. **Firefox (Recommended):**
   - Press `Alt` to reveal the top menu.
   - Go to **View** > **Zoom** and check **Zoom Text Only**.
   - Zoom in 4 steps (cmd/ctrl + `+`) to reach **200%**.
2. **Alternative (Chrome/Edge DevTools Custom Simulation):**
   - Open Console and execute:
     ```javascript
     document.documentElement.style.fontSize = '32px'; // Sets root font-size to 200%
     ```
3. **Evaluation Checklist:**
   - [ ] Is there any vertical text clipping inside cards, headers, or buttons?
   - [ ] Do multi-line texts overlap elements positioned directly below them?
   - [ ] Does text spill out of visual backgrounds or borders?
   - [ ] Do icons, buttons, or form controls collide or overlap?

### Test 2: The 400% Page Zoom (Reflow) Audit
This test simulates reading at extreme magnifications. Under 400% page zoom, a desktop browser screen of `1280px` renders with a logical width of `320 CSS pixels` (mobile scale).
1. **Chrome / Firefox / Edge:**
   - Open DevTools. Toggle **Device Toolbar** and set the width to `1280px`.
   - Set browser Page Zoom to **400%** (Ctrl + `+` or Cmd + `+` repeatedly, or adjust via the browser zoom menu).
2. **Evaluation Checklist:**
   - [ ] Does the entire page reflow cleanly into a single vertical scroll stream?
   - [ ] **Crucial:** Is there *zero* horizontal document scrolling? (A vertical page must never scroll horizontally at 400% zoom).
   - [ ] Did multi-column layouts correctly collapse into single-column responsive views?
   - [ ] Do sticky/fixed headers or action bars obscure more than 30% of the active reading window? (Consider un-sticking headers at extreme heights).

---

## Part 2: Audit Checklist & Remediation Sheet

| Audit Target | Check / Criteria | Risk of Failure | Remediation Code / Fix |
| :--- | :--- | :--- | :--- |
| **Typography Sizing** | Are all `font-size` declarations defined in relative `rem` units? | Users who change default font sizes in browser settings will see no change on the page; text remains dangerously small. | Replace `font-size: 16px` with `font-size: 1rem` (assuming baseline 16px). |
| **Line Heights** | Are all `line-height` declarations unitless multipliers? | Absolute pixel line heights (e.g., `line-height: 18px`) cause text lines to overlap vertically as the font scale doubles. | Replace `line-height: 24px` with `line-height: 1.5` (scaled proportionally). |
| **Vertical Limits** | Do text-bearing containers avoid hardcoded `height` or `max-height`? | Text scales up, breaks out of container walls, and collides with or overlaps elements below. | Replace `height: 80px` with `min-height: 5rem`. Use padding for vertical breathing room. |
| **Inline Layouts** | Do all flex-row navigations, badge lists, and menus use wrapping rules? | Text items push each other off-screen, creating severe horizontal document scrollbars. | Apply `flex-wrap: wrap` to the flex container. |
| **Grids & Columns** | Do CSS Grids use intrinsic, flexible tracks instead of fixed pixel widths? | Fixed column tracks (e.g. `200px`) squeeze text when zoomed, causing text to clip or overlap. | Replace fixed tracks with `minmax(18.75rem, 1fr)` or `repeat(auto-fit, minmax(15rem, 1fr))`. |
| **Media Queries** | Are media queries declared in relative `em` units instead of `px`? | Layout remains in a tight multi-column desktop view even when text scale has doubled, breaking layout integrity. | Divide pixel breakpoints by 16 and define in `em`. Example: `@media (max-width: 48em)` for `768px`. |
| **Absolute Elements** | Are critical text elements kept in the natural document flow (not absolutely positioned)? | Absolutely positioned labels collide and overlap with surrounding content as they scale. | Refactor layout to use Grid or Flexbox to preserve native flow. |
| **Scroll Overflows** | If a container must have fixed size (e.g., code blocks), does it manage overflow? | Text is permanently truncated and becomes unreadable. | Apply `overflow: auto; tabindex="0";` and an `aria-label` so keyboard-only users can scroll. |

---

## Part 3: Remediation & Debugging Toolkit

### Snippet 1: The "Px-to-Em Breakpoint Converter" Reference
Always declare media query breakpoints in `em` so they trigger earlier when text size is enlarged:

```css
/* --- Desktop & Responsive Breakpoints --- */

/* Mobile Landscape (480px / 16) */
@media (max-width: 30em) { ... }

/* Tablet Portrait (768px / 16) */
@media (max-width: 48em) { ... }

/* Tablet Landscape / Small Laptop (1024px / 16) */
@media (max-width: 64em) { ... }

/* Standard Desktop (1280px / 16) */
@media (max-width: 80em) { ... }
```

### Snippet 2: Resilient Component Padding (The button/input standard)
To keep padding visually balanced and prevent focus indicators from clipping, scale component dimensions locally with the `em` unit:

```css
.input-control,
.action-button {
  font-size: 1rem;            /* Scales relative to user's root setting */
  padding: 0.625em 1.25em;    /* Scales proportionally with font-size changes */
  margin-bottom: 0.75rem;     /* Layout gutters maintain standard root proportions */
  border: 2px solid #cbd5e1;
  border-radius: 0.375em;     /* Proportional border radius */
}

/* If font-size is bumped locally, padding adjusts automatically! */
.action-button.large {
  font-size: 1.25rem;         /* Padding adjusts naturally to 12.5px 25px */
}
```

### Snippet 3: CSS Layout Debugger (The "Out-of-Bounds" Outline)
If you are struggling to find which container is hardcoded and clipping your scaled text, add this helper class to your document body temporarily during testing:

```css
/* --- Inject this class on the <body> tag to highlight overflow issues --- */
.debug-zoom-clipping * {
  outline: 1px solid rgba(239, 68, 68, 0.4) !important;
  outline-offset: -1px;
}

/* Highlight absolute elements which might cause collisions */
.debug-zoom-clipping [style*="position: absolute"],
.debug-zoom-clipping [style*="position:fixed"] {
  outline: 2px dashed #e11d48 !important;
}

/* Highlight elements with fixed heights */
.debug-zoom-clipping [style*="height:"],
.debug-zoom-clipping [style*="max-height:"] {
  outline: 2px solid #7c3aed !important;
}
```

### Snippet 4: Accessible Scrollable Text Block
When fixed size is structurally inevitable (e.g., code snippets, horizontal charts, dynamic data tables), ensure the overflow is accessible to keyboard-only users:

```html
<div class="code-overflow-container" tabindex="0" role="region" aria-label="Scrollable code output">
  <pre>
    <code>
      // Complex un-wrappable data string here
      const systemDatabaseClusterConnectionPool = await configureEnterpriseDatabaseCluster({ poolSize: 50 });
    </code>
  </pre>
</div>

<style>
.code-overflow-container {
  overflow: auto;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #f8fafc;
  padding: 1rem;
}

/* Focus ring visibility for keyboard navigators */
.code-overflow-container:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
</style>
```
