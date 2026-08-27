# Split-Screen Layout System — Real-World Composition Breakdowns

This document presents two comprehensive architectural breakdowns of the **Split-Screen Layout System** applied to real-world design problems: an **Enterprise SaaS Split Authentication Screen** and a **High-Conversion Product Hero Split Layout**.

---

## Example 1: Enterprise SaaS Split Authentication Screen (50/50 Dual Theme)

### Problem Statement
An enterprise cloud application needs a dedicated sign-in and sign-up portal. On desktop viewports, marketing leadership wants to feature customer social proof, security badges, and brand artwork to build trust, while product design needs a clean, highly accessible login form that minimizes friction. On mobile devices, users must immediately see the login inputs without scrolling past heavy marketing artwork.

### Spatial Composition & Visual Hierarchy

```text
+-----------------------------------------------------------------------------------+
| Viewport: 100vh (Locked Overflow)                                                 |
| +-----------------------------------------+-------------------------------------+ |
| | Pane B: Form Panel (DOM Order #1)       | Pane A: Visual Showcase (DOM #2)    | |
| | Width: 50% | Theme: Light (#FFFFFF)     | Width: 50% | Theme: Dark (#0F172A)  | |
| |                                         |                                     | |
| | [ Logo Header ]                         | [ Customer Spotlight Badge ]        | |
| |                                         |                                     | |
| | Welcome back                            | "Acme Cloud cut our deployment      | |
| | Enter your credentials to access        | time by 75% in the first month."    | |
| | your workspace.                         |                                     | |
| |                                         | -- Sarah Chen, VP of Eng @ TechCorp | |
| | [ Email Address Input               ]   |                                     | |
| | [ Password Input                    ]   | [ Customer Logo Wall ]              | |
| |                                         | [ SOC2 / ISO Security Badges ]      | |
| | [ Sign In Primary Button            ]   |                                     | |
| | [ SSO / Google Auth Button          ]   |                                     | |
| +-----------------------------------------+-------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Technical Blueprint & CSS Spatial Rules

```css
/* Container Shell */
.auth-split-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Pane B: Interactive Form (DOM First) */
.auth-form-pane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(2rem, 5vw, 4rem);
  background-color: #FFFFFF;
  color: #0F172A;
  overflow-y: auto;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 420px;
}

/* Pane A: Brand Showcase (DOM Second) */
.auth-visual-pane {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(2.5rem, 6vw, 5rem);
  background-color: #0F172A;
  color: #F8FAFC;
  position: relative;
  overflow: hidden;
}

/* Mobile Responsiveness (<768px) */
@media (max-width: 767px) {
  .auth-split-container {
    grid-template-columns: 1fr;
    min-height: auto;
    overflow: visible;
  }

  .auth-form-pane {
    min-height: 100vh;
    padding: 2rem 1.5rem;
  }

  /* Compact Brand Footer on Mobile */
  .auth-visual-pane {
    padding: 2.5rem 1.5rem;
    max-height: 320px;
  }
}
```

### Accessibility & DOM Order Implementation Notes
1. **DOM Order Priority:** `<main class="auth-form-pane">` is placed first in the DOM tree. On desktop, CSS Grid displays it on the left (`grid-template-columns: 1fr 1fr`). On mobile, it appears at the very top of the single-column stack, ensuring keyboard and screen-reader users immediately land on the `<h1 tabindex="-1">Sign In</h1>` and primary form inputs.
2. **Landmark Differentiation:** The form pane is wrapped in `<main aria-label="Account Authentication">`, while the brand pane is wrapped in `<aside aria-label="Customer Success Highlights">`.
3. **Contrast Compliance:** Text on the dark pane (`#F8FAFC` on `#0F172A`) achieves a contrast ratio of **15.8:1**, far exceeding WCAG AA minimums (4.5:1).

---

## Example 2: High-Conversion Product Hero Split Layout (60/40 Asymmetric)

### Problem Statement
A B2B SaaS analytics company wants to feature a live interactive data visualization preview directly in its landing page hero section. The left pane must deliver a compelling value proposition narrative with primary and secondary CTAs, while the right pane must showcase a responsive application interface mockup with animated metric counters.

### Spatial Composition & Visual Hierarchy

```text
+-----------------------------------------------------------------------------------+
| Hero Section (Max Width: 1440px | Padded Centered Grid)                           |
| +---------------------------------------------+---------------------------------+ |
| | Pane A: Narrative Content (60%)             | Pane B: Interactive Canvas (40%)| |
| |                                             |                                 | |
| | [ Badge: "Announcing Version 3.0" ]         | +-----------------------------+ | |
| |                                             | | Live Dashboard Preview      | | |
| | Real-Time Insights for                      | | [ Mini Chart Visualization] | | |
| | High-Growth Engineering Teams               | |                             | | |
| |                                             | | Active Users: 124,890       | | |
| | Track performance, diagnose bottlenecks,     | | Latency: 12ms               | | |
| | and deploy updates 10x faster with AI.      | | Uptime: 99.99%              | | |
| |                                             | +-----------------------------+ | |
| | [ Start Free Trial ]  [ Book Demo ]         |                                 | |
| |                                             | (Interactive hover preview)     | |
| +---------------------------------------------+---------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Technical Blueprint & CSS Spatial Rules

```css
.hero-split-section {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr; /* 60/40 ratio */
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 6rem) 2rem;
}

.hero-content-pane {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-heading {
  font-size: clamp(2.5rem, 4.5vw, 3.75rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.hero-preview-pane {
  position: relative;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  background: var(--surface-card);
}

/* Tablet & Mobile Adaptation (<1024px) */
@media (max-width: 1023px) {
  .hero-split-section {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 3rem 1.5rem;
  }

  .hero-content-pane {
    align-items: center;
    text-align: center;
  }

  .hero-preview-pane {
    max-width: 640px;
    margin: 0 auto;
  }
}
```

### Key Design Takeaways
- **Controlled Measure:** The hero text pane is constrained to `max-width: 620px` to maintain optimal line lengths (50-65 characters per line).
- **Interactive Focus Containment:** Interactive preview widgets inside Pane B are made keyboard-navigable (`tabindex="0"`) with clear focus rings (`outline: 2px solid var(--brand-primary)`).
