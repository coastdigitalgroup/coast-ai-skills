# Text Zoom & Layout Resilience Audit Checklist

This template is designed to audit, debug, and certify website frontends for compliance with WCAG 2.1 AA Success Criteria **1.4.4 (Resize Text - 200%)** and **1.4.10 (Reflow - 400% Zoom / 320px equivalent)**.

---

## 📋 Quick-Start Testing Commands

### Playwright Automated Check (Node.js)
Ensure your end-to-end suite validates both the 200% font scaling and the 400% visual reflow:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Accessibility: Text Zoom & Reflow Resilience', () => {

  test('Should pass Reflow (1.4.10) at 400% Zoom equivalent (320px width)', async ({ page }) => {
    // 1280px screen width at 400% zoom = 320px wide viewport equivalent
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/your-target-url');

    // 1. Confirm that no horizontal scrollbar is present on the document level
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // 2. Check that critical action elements remain visible
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('Should pass Resize Text (1.4.4) with twice default system font size', async ({ page }) => {
    // Increase root font size to simulate browser default text-only scaling (32px / 200%)
    await page.goto('/your-target-url');
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '32px';
    });

    // 1. Verify text blocks do not overlap
    const headings = await page.locator('h1, h2, h3').all();
    for (const heading of headings) {
      await expect(heading).toBeVisible();
      const isClipped = await heading.evaluate((el) => {
        return el.scrollHeight > el.clientHeight && getComputedStyle(el).overflow === 'hidden';
      });
      expect(isClipped).toBe(false);
    }
  });
});
```

---

## 🔍 Visual Layout Inspection Heuristics

Perform these manual audits within Chrome/Firefox DevTools:

| Checkpoint | Target Heuristic | Status (Pass/Fail) | Remediation Guidance |
| :--- | :--- | :--- | :--- |
| **1. Root Units** | Open the global stylesheet. Ensure no pixel values override root font sizing (e.g., `html { font-size: 16px; }`). | | Remove explicit pixel settings on `html`. Set `html { font-size: 100%; }`. |
| **2. Spacing Units**| Verify typography margins, padding, and line-heights are defined with relative units. | | Swap all `margin` and `padding` surrounding text to `rem` or `em`. Ensure `line-height` is unitless (e.g., `1.5`). |
| **3. Fixed Heights** | Scan containers that hold dynamic text (cards, banners, buttons) for hardcoded heights. | | Replace `height: Xpx` with `min-height: Yrem` or `min-height: auto`. |
| **4. Structural Overflow** | Change font size to 200%. Verify that text is not clipped by `overflow: hidden`. | | Remove `overflow: hidden` on text wrappers or add `overflow-y: auto`. |
| **5. Line Clamping** | Inspect CSS for `-webkit-line-clamp`. Ensure essential info isn't permanently hidden. | | Provide an interactive "Show more" disclosure toggle button for clamped blocks. |
| **6. Media Queries** | Verify that breakpoints are defined using relative units. | | Convert `px` media queries to `em` (e.g. `@media (min-width: 48em)`). |
| **7. Horizontal Stacking**| Zoom page to 400%. Check if multi-column lists reflow vertically without horizontal scrollbars. | | Add `flex-wrap: wrap` or change CSS Grid template to `auto-fit`/`auto-fill`. |

---

## 🛠️ Diagnostics & Common Remediation Patterns

### Issue A: Overlapping Text and Absolute Overflow
**Symptoms:** Headings overlay description paragraphs, or buttons overlap following cards under 200% zoom.
* **Why it happens:** Sub-elements are positioned absolutely (`position: absolute; top: 120px;`) inside a parent with a hardcoded static height (`height: 150px;`).
* **Corrective Pattern:**
  ```css
  /* BEFORE (Fragile) */
  .card {
    position: relative;
    height: 180px;
  }
  .card-body {
    position: absolute;
    top: 80px;
  }

  /* AFTER (Resilient) */
  .card {
    display: flex;
    flex-direction: column;
    min-height: 11rem; /* Scalable */
    padding: 1rem;
  }
  .card-body {
    margin-top: auto; /* Aligns naturally without absolute heights */
  }
  ```

### Issue B: Strict Pixel Typography Clamps
**Symptoms:** Large banner headers do not shrink on mobile viewports OR they fail to enlarge when the user sets their browser's default font size to large.
* **Why it happens:** Static viewport-relative typography without a relative root factor: `font-size: clamp(16px, 4vw, 36px);`.
* **Corrective Pattern:**
  ```css
  /* BEFORE (Fragile) */
  h1 {
    font-size: clamp(16px, 4vw, 36px);
  }

  /* AFTER (Resilient) */
  h1 {
    font-size: clamp(1rem, 2vw + 1rem, 2.25rem); /* rem scales with user's settings */
  }
  ```

### Issue C: Non-wrapping Header Nav Navigation Items
**Symptoms:** Header navigation buttons overlap the logo or get clipped by the right-hand edge under 200% font size.
* **Why it happens:** Navigation container uses `display: flex` but lacks `flex-wrap: wrap`, combined with buttons set to `white-space: nowrap`.
* **Corrective Pattern:**
  ```css
  /* BEFORE (Fragile) */
  .nav-bar {
    display: flex;
    align-items: center;
    height: 60px;
  }

  /* AFTER (Resilient) */
  .nav-bar {
    display: flex;
    flex-wrap: wrap; /* Wraps items to multi-line naturally */
    align-items: center;
    min-height: 3.75rem; /* Flexible content-driven minimum */
    padding: 0.5rem 1rem;
  }
  ```

---

## 🎓 Verification Sign-off Criteria

- [ ] **200% Text Resize Verified:** All structural and inline text scales up to double its height without overlapping, clipping, or disappearing from view.
- [ ] **400% Reflow Verified:** Viewport constricted to 1280px wide and zoomed to 400% has only a vertical scrollbar. No horizontal scrolling is required to read any line of text.
- [ ] **Fully Usable Form Flows:** Input fields, labels, checkboxes, and validation alerts scale cleanly, and form submission buttons remain fully clickable.
- [ ] **No Overwriting Stylesheets:** Ensure no hardcoded `!important` pixel rules override focus styling or container size properties.
