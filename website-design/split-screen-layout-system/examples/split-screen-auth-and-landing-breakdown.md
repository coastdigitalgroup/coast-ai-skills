# Split-Screen Layout Breakdown: Auth Page & Landing Hero

This document provides two realistic production breakdowns demonstrating the Split-Screen Layout System applied to common web design challenges: a full-bleed SaaS authentication page and a split-screen product hero section with sticky media.

---

## Scenario 1: SaaS Authentication Page (50/50 Viewport Lock Split)

### Problem Description
A enterprise analytics SaaS platform experienced a 32% drop-off rate on its mobile sign-up page. The desktop page featured a dark brand showcase on the left with customer metrics and a white sign-up form on the right. When viewed on mobile, the heavy decorative media panel stacked on top, forcing users to scroll past 600px of social proof before reaching the actual email input field. Furthermore, on short mobile viewports (e.g., iPhone SE), the submit button was clipped beneath the browser address bar due to hardcoded `100vh` container sizing.

### Applied Solution & Spatial Composition

#### Desktop Composition (1024px+)
- **Grid Layout:** 2-column grid (`grid-template-columns: 1fr 1fr`), locked to `100dvh`.
- **Left Panel (Brand Showcase):** Dark slate surface (`#0F172A`) featuring a ambient glow background, dynamic social proof card, and customer testimonial quote.
- **Right Panel (Sign-Up Form):** Clean white surface (`#FFFFFF`) with high-contrast form fields, social sign-in buttons, and direct link to sign-in.
- **Vertical Alignment:** Both panels centered vertically using flexbox (`display: flex; flex-direction: column; justify-content: center`).

```text
+---------------------------------------+---------------------------------------+
|  LEFT PANEL (Dark Brand Media)        |  RIGHT PANEL (Light Auth Form)        |
|  bg: #0F172A | text: #F8FAFC          |  bg: #FFFFFF | text: #0F172A          |
|                                       |                                       |
|  [Logo]                               |  <h2>Create your account</h2>         |
|                                       |  <p>Start your 14-day free trial</p>  |
|  "Coast Analytics helped us scale    |                                       |
|   our pipeline visibility by 4x."     |  [ Continue with Google ]             |
|                                       |  [ Continue with GitHub ]             |
|  -- Sarah Chen, VP of Growth          |  ---------------- OR ----------------  |
|                                       |  [ Work Email Input         ]         |
|  [ Metrics Card: +340% ARR ]          |  [ Password Input           ]         |
|                                       |  [ Create Account Button    ]         |
+---------------------------------------+---------------------------------------+
```

#### Mobile Composition (< 768px)
- **Grid Layout:** Collapses to 1 column (`grid-template-columns: 1fr`).
- **DOM & Stacking Order:**
  1. Header / Logo (Top)
  2. Sign-Up Form (Primary conversion panel visually stacked first)
  3. Brand Social Proof & Testimonial (Folded beneath the form)
- **Viewport Height Fix:** Sizing shifted from fixed height to `min-height: 100dvh` with natural body scroll, preventing clipped input controls on mobile devices.

---

## Scenario 2: Split Landing Page Hero (40/60 Media Showcase Split)

### Problem Description
A developer tool company wanted to showcase an interactive code sandbox and live preview alongside their value proposition headline and CTA. The initial prototype placed the live demo beneath a full-width hero text block, causing 70% of visitors to miss the interactive feature entirely without scrolling.

### Applied Solution & Spatial Composition

#### Desktop Composition (1200px+)
- **Grid Layout:** Asymmetrical 40/60 split (`grid-template-columns: 4fr 6fr`) with a `32px` fluid gap.
- **Left Panel (40% Copy & CTA):**
  - Category badge: "Next-Gen API Gateway"
  - Headline (`h1`): "Deploy high-throughput APIs in milliseconds."
  - Value proposition paragraph (`max-width: 48ch`).
  - Dual CTA block: Primary button ("Start Free Trial") and secondary button ("Book Demo").
  - Trust indicators: "SOC2 Type II Certified • 99.99% SLA".
- **Right Panel (60% Interactive Code Showcase):**
  - Mock terminal window with tabbed code snippets (`curl`, `TypeScript`, `Python`).
  - Live API response preview with syntax highlighting (`4.5:1` contrast minimum).
  - Floating status pill: "⚡ Response time: 1.2ms".

```text
+-----------------------------------+---------------------------------------------------+
|  LEFT PANEL (40% Narrative)       |  RIGHT PANEL (60% Interactive Media Showcase)    |
|                                   |                                                   |
|  [ Badge: Next-Gen API Gateway ]  |  +---------------------------------------------+  |
|                                   |  | Terminal [main.ts] [config.json]            |  |
|  <h1>Deploy high-throughput       |  +---------------------------------------------+  |
|  APIs in milliseconds.</h1>       |  | 1  import { Gateway } from '@coast/api';   |  |
|                                   |  | 2  const app = new Gateway({ port: 8080 }); |  |
|  Build, route, and observe your   |  | 3  app.route('/v1/deploy', async (req) => { |  |
|  microservices with zero config.  |  | 4    return await req.transform();          |  |
|                                   |  | 5  });                                      |  |
|  [ Start Free Trial ] [ Demo ]    |  +---------------------------------------------+  |
|                                   |  | Live Output: 202 OK (1.2ms)                 |  |
|  • SOC2 Certified   • 99.99% SLA   |  +---------------------------------------------+  |
+-----------------------------------+---------------------------------------------------+
```

#### Accessibility & Keyboard Flow
- Keyboard navigation flows logically from left to right:
  1. Category Badge
  2. Headline (`h1`)
  3. Primary CTA Button
  4. Secondary CTA Button
  5. Code Terminal Tab Triggers (`Tablist` -> `Tab`)
  6. Code Copy Action Button
- Focus ring colors adapt per panel surface:
  - Left panel (light background): `#2563EB` blue focus ring with `2px` offset.
  - Right panel (dark terminal background): `#60A5FA` light blue focus ring with `2px` offset.

---

## Key Design Specs Summary

| Spec Dimension | Auth Page (50/50) | Split Hero (40/60) |
| :--- | :--- | :--- |
| **Desktop Ratio** | `1fr 1fr` | `4fr 6fr` |
| **Mobile Breakpoint** | `1024px` | `768px` |
| **Container Sizing** | `min-height: 100dvh` | `padding-block: clamp(3rem, 8vw, 6rem)` |
| **Panel Left Theme** | Dark Slate (`#0F172A`) | Neutral Light (`#FAFAFA`) |
| **Panel Right Theme** | Pure White (`#FFFFFF`) | Dark Terminal (`#1E293B`) |
| **Primary Focus Goal** | Form Conversion Rate | Feature Demonstration & CTA Clicks |
