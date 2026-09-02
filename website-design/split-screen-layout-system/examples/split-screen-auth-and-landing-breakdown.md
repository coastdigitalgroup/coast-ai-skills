# Split-Screen Layout System Examples & Breakdown

This document provides realistic layout and page composition breakdowns demonstrating the Split-Screen Layout System applied to real-world design problems.

---

## Example 1: SaaS Authentication Page (50/50 Split)

### Problem
An enterprise SaaS platform needed an authentication page (Sign In / Sign Up) that maintained high form conversion rates while simultaneously reinforcing brand trust through customer social proof and product feature previews. On mobile devices, previous designs suffered from broken layout hierarchy where marketing images covered the top half of the screen, pushing input fields out of view.

### Design Solution Architecture

```text
+-------------------------------------------------------------------------------+
| Viewport: 100dvh (Desktop ≥1024px)                                            |
| +-----------------------------------+---------------------------------------+ |
| | Panel 1: Primary Action (Form)    | Panel 2: Brand & Social Proof         | |
| | Width: 50%                        | Width: 50%                            | |
| | Surface: #FFFFFF (Light Theme)    | Surface: #0F172A (Dark Slate Accent)  | |
| | DOM Position: 1st                 | DOM Position: 2nd                     | |
| |                                   |                                       | |
| | [Logo]                            | "Coast AI transformed our workflow."  | |
| | Heading: "Welcome back"           | - Sarah Jenkins, VP of Product        | |
| | Subhead: "Enter details below"    |                                       | |
| |                                   | +-----------------------------------+ | |
| | [ Email Address Input         ]   | | Product Interface Preview Graphic | | |
| | [ Password Input              ]   | | (Interactive UI Mockup)           | | |
| | [ Remember Me ]  [Forgot Pass?]   | +-----------------------------------+ | |
| | [ Button: Sign In           ]     |                                       | |
| |                                   | [ Trust Badges: SOC2 | ISO27001 ]     | |
| | [ SSO: Google | GitHub | Okta ]   |                                       | |
| +-----------------------------------+---------------------------------------+ |
+-------------------------------------------------------------------------------+

Mobile Stacking Flow (<768px):
+------------------------------------+
| Panel 1: Primary Action (Form)     |
| - Full width (100%)                |
| - Form inputs immediately in reach |
+------------------------------------+
| Panel 2: Brand & Social Proof      |
| - Stacked below form               |
| - Non-essential graphics hidden    |
| - Testimonial quote retained       |
+------------------------------------+
```

### Key Technical & Design Features
1. **DOM Priority:** Form HTML structure comes first in DOM order. Screen reader users land on the "Email Address" field immediately without traversing decorative image elements.
2. **Dynamic Viewport Unit (`100dvh`):** Desktop container locks cleanly to full screen height without causing address bar overflow on mobile devices.
3. **Contrast Seam:** Panel 1 uses `#FFFFFF` background with `#0F172A` text (16.2:1 contrast ratio). Panel 2 uses `#0F172A` background with `#F8FAFC` text (15.1:1 contrast ratio). The stark contrast seam visually delineates functional action from narrative content.
4. **Mobile Fallback:** On mobile viewports (<768px), layout transitions to a single-column stack. Heavy background imagery is hidden (`display: none`), while testimonial text condenses into a compact quote block below the submit button.

---

## Example 2: E-Commerce Product Configurator (60/40 Split)

### Problem
A custom furniture e-commerce website needed a product detail page where shoppers could customize materials, dimensions, and add-ons while observing real-time high-resolution visual feedback. On desktop screens, scrolling through long material option lists caused the product preview image to scroll off-screen, disconnecting user actions from visual feedback.

### Design Solution Architecture

```text
+-------------------------------------------------------------------------------+
| Viewport: Desktop Grid (60/40 Asymmetrical Split)                              |
| +------------------------------------+--------------------------------------+ |
| | Panel 1: Visual Showcase Gallery   | Panel 2: Sticky Configurator Panel  | |
| | Width: 60% (Main Gallery)          | Width: 40% (Sticky Action Dock)     | |
| | Position: Scrolling Gallery Column | Position: sticky; top: 2rem;        | |
| |                                    |                                      | |
| | +--------------------------------+ | Heading: "Ergonomic Desk Chair"      | |
| | | High-Res Angle 1 (Main View)   | | Price: "$899.00"                    | |
| | +--------------------------------+ |                                      | |
| | +--------------------------------+ | [ Finish Selector: Oak | Walnut ]    | |
| | | High-Res Angle 2 (Zoom Detail) | | [ Base Color: Matte Black | Chrome]  | |
| | +--------------------------------+ | [ Cushion Fabric: Leather | Mesh ]   | |
| | +--------------------------------+ |                                      | |
| | | High-Res Angle 3 (Context View)| | [ Button: Add to Cart - $899.00 ]   | |
| | +--------------------------------+ | [ In Stock - Ships in 2 Days ]       | |
| +------------------------------------+--------------------------------------+ |
+-------------------------------------------------------------------------------+
```

### Key Technical & Design Features
1. **Sticky Panel Docking:** Panel 2 (Configurator) uses `position: sticky; top: 2rem; align-self: start;`. As users scroll down through multiple high-res product photos on Panel 1, the customization controls and "Add to Cart" button remain persistently visible in Panel 2.
2. **Keyboard Focus Flow:** Options controls inside Panel 2 use accessible radio groups (`role="radiogroup"`) and custom select buttons (`custom-select-and-combobox-system`). Selecting a material option triggers an `aria-live="polite"` region update announcing "Desk preview updated to Walnut finish".
3. **Responsive Stacking:** On mobile devices, Panel 1 (Image Carousel) appears at the top using `carousel-and-slider-system`, followed directly by Panel 2 (Sticky Buy Box pinned to viewport bottom via `bottom-navigation-system` or `sticky-cta-optimization`).
