# Split-Screen Layout System: Auth & Product Showcase Breakdown

This breakdown demonstrates how the **Split-Screen Layout System** is applied to two real-world design problems:
1. **SaaS Authentication & Onboarding Portal (50/50 Split)**
2. **Interactive SaaS Product Customizer / Landing Showcase (60/40 Split)**

---

## Case 1: SaaS Authentication & Onboarding Portal (50/50 Split)

### Problem Statement
An enterprise SaaS platform was experiencing drop-offs during user onboarding. The previous design squeezed marketing testimonials, security badges, and signup form fields into a single long column on desktop, forcing users to scroll past decorative content to find form inputs.

### Applied Split-Screen Solution

```text
+---------------------------------------------------+---------------------------------------------------+
| PANEL A: BRAND & TESTIMONIAL (50% Width)          | PANEL B: SIGNUP FORM & AUTH (50% Width)           |
| Background: Dark Navy (#0B132B)                   | Background: Clean Off-White (#F8FAFC)             |
| Scoped Theme: data-theme="dark"                   | Scoped Theme: data-theme="light"                  |
|                                                   |                                                   |
| [ Logo ]                                          | [ Header: "Get Started Free" ]                    |
| "Accelerate your developer workflow in minutes."  | "No credit card required."                        |
|                                                   |                                                   |
| [ Customer Testimonial Card ]                     | [ Social Auth Buttons: Google | GitHub ]         |
| "Transformed how our team ships code."            | --- OR ---                                        |
| -- CTO at TechCorp                                | [ Work Email Input Field ]                        |
|                                                   | [ Password Input Field ]                          |
| [ Security Badges: SOC2 | GDPR | ISO ]             | [ Submit Button: "Create Account" ]               |
|                                                   | [ Footer Link: "Already have an account? Log in"] |
+---------------------------------------------------+---------------------------------------------------+
```

### Spatial & Layout Blueprint

- **Desktop (>=1024px):**
  - Layout: `display: grid; grid-template-columns: 1fr 1fr; min-height: 100dvh;`
  - Left Panel (Panel A): Dark background fill (`#0B132B`) with light text (`#F8FAFC`). Vertically centered content with `display: flex; flex-direction: column; justify-content: space-between; padding: 3rem;`.
  - Right Panel (Panel B): Light background fill (`#F8FAFC`) with dark text (`#0F172A`). Vertically centered form container.
- **Tablet & Mobile (<1024px):**
  - Layout collapses to a 1-column stack: `grid-template-columns: 1fr; min-height: auto;`.
  - Panel B (Action Form) moves to top of DOM / top of stack so mobile users immediately see inputs without scrolling past testimonials.
  - Panel A (Visual/Brand) converts to a compact footer quote block underneath the form or collapses cleanly.

### Contrast & Accessibility Scoping

| Region | Component | Background | Foreground Text / Border | Contrast Ratio | WCAG Compliance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Panel A (Dark)** | Headline (`<h2>`) | `#0B132B` | `#FFFFFF` | **17.9:1** | WCAG AAA |
| **Panel A (Dark)** | Body Text (`<p>`) | `#0B132B` | `#94A3B8` | **7.2:1** | WCAG AAA |
| **Panel A (Dark)** | Testimonial Card | `#1E293B` | `#F8FAFC` | **11.4:1** | WCAG AAA |
| **Panel B (Light)**| Headline (`<h1>`) | `#F8FAFC` | `#0F172A` | **16.1:1** | WCAG AAA |
| **Panel B (Light)**| Input Label | `#F8FAFC` | `#334155` | **10.5:1** | WCAG AAA |
| **Panel B (Light)**| Input Border | `#F8FAFC` | `#94A3B8` | **3.2:1** (UI boundary) | WCAG AA |
| **Panel B (Light)**| Primary Button | `#2563EB` | `#FFFFFF` | **4.6:1** | WCAG AA |

---

## Case 2: Interactive Product Customizer / Showcase (60/40 Split)

### Problem Statement
A digital hardware manufacturer needed a landing page layout allowing users to customize a product in real-time. On traditional pages, scrolling down to read product feature options caused the live 3D preview canvas to scroll off-screen, disconnecting the action from visual feedback.

### Applied Split-Screen Solution

```text
+-------------------------------------------------------+-----------------------------------------------+
| PANEL A: STICKY 3D VISUAL CANVAS (60% Width)          | PANEL B: SCROLLABLE OPTIONS (40% Width)       |
| Position: sticky; top: 0; height: 100dvh;             | Position: relative; overflow-y: auto;         |
| Background: Radial Dark Gradient                      | Background: Surface Neutral                   |
|                                                       |                                               |
| [ Back Button ]                                       | [ Title: "Configure Your Device" ]            |
|                                                       | [ Base Price Tag: "$499" ]                    |
|                                                       |                                               |
|                    ( Live Interactive )               | SECTION 1: COLOR FINISH                       |
|                    (  3D Product Visual  )            | [ Matte Black ] [ Space Gray ] [ Silver ]     |
|                                                       |                                               |
|                                                       | SECTION 2: STORAGE CAPACITY                   |
|                                                       | [ 256GB ] [ 512GB (+$100) ] [ 1TB (+$250) ]   |
|                                                       |                                               |
| [ 360° Rotate Controls ]  [ Zoom In/Out ]             | SECTION 3: ACCESSORY PACKS                    |
|                                                       | [ Checkbox: Pro Stand (+$49) ]                |
|                                                       |                                               |
|                                                       | [ Sticky Bottom Action Bar: "Add to Cart" ]   |
+-------------------------------------------------------+-----------------------------------------------+
```

### Key Architectural Choices

1. **Sticky Visual Anchor (Panel A):**
   - Locked in viewport with `position: sticky; top: 0; height: 100dvh;`.
   - Ensures the 3D canvas stays permanently visible as users scroll through dozens of customization options in Panel B.

2. **Scrollable Option Rail (Panel B):**
   - Scrolls naturally alongside Panel A.
   - Contains a fixed summary bar pinned at the bottom of Panel B containing the calculated total price and primary `Add to Cart` trigger.

3. **Mobile Viewport Adaptation:**
   - On viewports `<768px`, Panel A (3D Visual) switches from fixed `100dvh` to sticky top banner (`height: 40vh; position: sticky; top: 0; z-index: 10;`).
   - Panel B scrolls underneath Panel A, maintaining real-time visual feedback while optimizing vertical thumb space.

---

## Implementation Checklist

- [x] Independent contrast themes established per panel.
- [x] Responsive layout uses `grid-template-columns: 1fr 1fr` (50/50) or `60% 40%` on desktop.
- [x] Dynamic viewport height (`100dvh`) prevents iOS Safari bottom toolbar overflow.
- [x] Mobile fallback collapses layout cleanly into single column without breaking keyboard focus.
- [x] Primary action controls meet minimum 44x44px tap targets.
