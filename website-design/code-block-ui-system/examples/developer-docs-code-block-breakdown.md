# Developer Documentation Code Block Layout Breakdown

This example demonstrates the **Code Block UI System** applied to a developer documentation portal displaying a multi-file API integration example with line-level highlights, diff comparisons, and responsive action toolbars.

---

## 1. Context & User Intent

In API and developer platform documentation, developers scan code snippets to understand implementation patterns quickly. A poorly formatted code block causes friction: unreadable low-contrast token colors, copied line numbers that break compilation, lost copy buttons during vertical scroll, and layouts that break on mobile screens.

This breakdown specifies the visual architecture, interaction states, and accessibility mechanisms for a production-grade developer documentation code block.

---

## 2. Visual Layout Architecture

```text
+---------------------------------------------------------------------------------+
| HEADER TOOLBAR (sticky, background: #1E293B, border-bottom: 1px solid #334155)  |
| +-----------------------------------------------+ +---------------------------+ |
| | [TS] client.ts (Active) | auth.ts | .env.local | | [Wrap] [Copy Code] [EXP]  | |
| +-----------------------------------------------+ +---------------------------+ |
+---------------------------------------------------------------------------------+
| CODE CANVAS (background: #0F172A, overflow-x: auto)                              |
|                                                                                 |
| 01 | import { StripeClient } from '@stripe/stripe-node';                        |
| 02 |                                                                            |
| 03 | // Initialize the client with secret API key                              |
| 04 | export const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY, {   |
| 05 |   apiVersion: '2024-06-20',                                               |
| 06 | });                                                                        |
|    |                                                                            |
| 07 | >>> HIGHLIGHTED LINE (background: rgba(56, 189, 248, 0.12), border-left)    |
| 07 | export async function createCheckoutSession(customerId: string) {          |
| 08 |   return await stripe.checkout.sessions.create({                           |
| 09 |     customer: customerId,                                                  |
| 10 |     mode: 'subscription',                                                  |
| 11 |   });                                                                      |
| 12 | }                                                                          |
+---------------------------------------------------------------------------------+
```

---

## 3. Structural Component Analysis

### A. Sticky Header Toolbar
- **Container:** `display: flex; align-items: center; justify-content: space-between; height: 44px; padding: 0 12px; background: #1E293B; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 10;`.
- **File Tabs (`role="tablist"`):**
  - Render individual file buttons with file extension icons (e.g., TS icon for `.ts`, JSON icon for `.json`).
  - Active Tab (`aria-selected="true"`): `color: #F8FAFC; border-bottom: 2px solid #38BDF8; background: rgba(255,255,255,0.05); font-weight: 600;`.
  - Inactive Tab (`aria-selected="false"`): `color: #94A3B8; hover:color: #F1F5F9; font-weight: 400;`.
- **Action Group:**
  - **Copy Button:** 32x32px icon button (`aria-label="Copy client.ts code to clipboard"`). Displays copy icon + "Copy" text label on viewports ≥640px.
  - **Wrap Toggle:** Icon button allowing soft word wrapping (`white-space: pre-wrap`) for mobile reading.

### B. Code Body Canvas & Line Gutter
- **Code Container:** `<pre class="code-block"><code class="language-typescript">` with `display: block; overflow-x: auto; padding: 16px 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem (14px); line-height: 1.6; color: #E2E8F0;`.
- **Line Row Layout:** Each line is a row (`display: flex; width: 100%; min-width: max-content;`).
- **Line Numbers (Gutter):**
  - Width: `44px`; `text-align: right; padding-right: 16px; user-select: none; color: #64748B; font-size: 0.8125rem;`.
  - Screen Reader Protection: Wrapped in `<span aria-hidden="true">` to prevent screen readers from voicing line numbers during code navigation.

### C. Line Callouts & Diff Views
- **Focused / Highlighted Line (Lines 7-11):**
  - Applied CSS: `background: rgba(56, 189, 248, 0.12); border-left: 3px solid #38BDF8; margin-left: -3px;`.
  - Spans full scrollable width (`min-width: 100%`) so highlights don't cut off when horizontally scrolling.
- **Diff View Lines (Version Comparison):**
  - Added Line (`+`): `background: rgba(34, 197, 94, 0.15); border-left: 3px solid #22C55E;`. Screen reader prefix: `<span class="sr-only">Added line:</span>`.
  - Removed Line (`-`): `background: rgba(239, 68, 68, 0.15); border-left: 3px solid #EF4444;`. Screen reader prefix: `<span class="sr-only">Removed line:</span>`.

---

## 4. Syntax Token Contrast Audit (WCAG AA Compliance)

Background Color: `#0F172A` (Slate 900)

| Token Type | Code Element Example | Light / Dark Token Hex | Contrast Ratio vs. `#0F172A` | WCAG AA Status |
| :--- | :--- | :--- | :--- | :--- |
| **Keyword** | `import`, `export`, `const`, `async` | `#C084FC` (Purple) | **7.2 : 1** | PASS (≥ 4.5:1) |
| **Function** | `createCheckoutSession`, `create` | `#38BDF8` (Sky Blue) | **8.5 : 1** | PASS (≥ 4.5:1) |
| **String** | `'@stripe/stripe-node'`, `'subscription'` | `#4ADE80` (Emerald) | **9.1 : 1** | PASS (≥ 4.5:1) |
| **Comment** | `// Initialize the client...` | `#94A3B8` (Slate) | **5.1 : 1** | PASS (≥ 4.5:1) |
| **Type / Class** | `StripeClient`, `string` | `#FACC15` (Yellow) | **11.4 : 1** | PASS (≥ 4.5:1) |
| **Variable / Text**| `customerId`, `stripe` | `#F8FAFC` (White) | **15.8 : 1** | PASS (≥ 4.5:1) |

---

## 5. Interaction Mechanics & Copy Feedback Flow

1. **User Focus:** User tabs to the Copy button in the code header. Visible 2px outline ring appears around the button (`outline: 2px solid #38BDF8; outline-offset: 2px`).
2. **User Trigger (Click / Enter):**
   - Clipboard receives raw code string (excluding line numbers and diff symbols).
   - Copy button icon transforms from copy rectangles to a green checkmark icon.
   - Button text changes from "Copy" to "Copied!".
   - Button background applies success tint (`background: rgba(34, 197, 94, 0.2); color: #4ADE80`).
3. **Screen Reader Announcement:** Dynamic `aria-live="polite"` region outputs: *"client.ts code copied to clipboard"*.
4. **Auto-Reset:** After 2000ms, the button reverts back to the default state smoothly.

---

## 6. Mobile Viewport Adaptation (<768px)

- **Sticky Header:** Header toolbar stays fixed at top of viewport during long code scroll.
- **Scroll Containment:** Code container allows horizontal touch drag (`overflow-x: auto; -webkit-overflow-scrolling: touch;`).
- **Touch Targets:** Multi-file tab buttons and action triggers maintain a minimum tap target of **44x44px**.
- **Wrap Toggle Option:** Users on narrow mobile phones can tap "Wrap" to toggle soft line wrapping, avoiding horizontal scrolling for long URLs or commands.
