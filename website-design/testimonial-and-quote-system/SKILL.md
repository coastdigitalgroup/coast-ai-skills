---
name: testimonial-and-quote-system
description:
  Design and implement a structured, accessible, and high-trust testimonial and
  quote framework that elevates customer social proof, ensures readability and
  legibility, and adapts seamlessly across viewports in compliance with WCAG AA.
---

# Testimonial and Quote System

## Purpose

The Testimonial and Quote System provides a systematic design and spatial framework for qualitative customer, partner, and user endorsements. Social proof is a primary driver of conversion rate optimization (CRO); however, testimonials on modern websites are frequently plagued by poor typography contrast, misaligned brand elements, unstructured HTML syntax (missing semantic `<blockquote>` tags), and illegible mobile layout stacking. This skill solves these visual and structural fragmentation problems by establishing strict guidelines for **quote anatomy**, **responsive layouts (Single Spotlight, Grid, Carousel, and Logo-paired cards)**, **trust-verification signals**, and **WCAG AA accessibility standards**.

## Use Cases

- **Marketing Landing Pages:** Placing high-impact, single-customer spotlight sections to break up long-form product feature descriptions.
- **Customer Love/Wall-of-Fame Pages:** Organizing high-volume testimonial grids or masonry cards showcasing endorsements from various customer segments.
- **E-commerce Product Detail Pages:** Displaying curated, context-specific quotes highlighting single-feature benefits or satisfaction from verified buyers.
- **Enterprise Case Study Callouts:** Highlighting executive-level citations inside in-depth editorial customer success stories.
- **SaaS Conversion Hubs (Pricing Pages):** Presenting trust-verification markers next to price tiers to eliminate purchase anxiety and objections.

## When NOT to Use

- **High-Volume Alphanumeric Reviews:** For consumer product reviews with aggregate star distributions, rating filters, and photo uploads, use `review-and-rating-system`.
- **System or Platform Status Notifications:** For displaying system success messages, operational logs, or transient notifications, use `toast-and-snackbar-system` or `banner-and-alert-system`.
- **Text-Only Article Callouts:** For general inline editorial blockquotes or pull-quotes that do not represent customer social proof or brand-trust endorsements, use standard article layout patterns in `article-layout-system`.
- **Step-by-Step Interactive Forms:** For gathering customer reviews or survey responses through a multi-step flow, use `form-design-system`.

## Inputs

1. **Testimonial Content Inventory:** Raw text of customer endorsements, author names, job titles, company names, and optional profile pictures (avatars) or company logos.
2. **Trust Level / Verification Class:** Classification of the testimonial (e.g., Unverified Customer, Verified Buyer, High-Authority Enterprise Executive, Influencer).
3. **Target Layout Mode:** Layout intent (Single Spotlight, Card Grid, Masonry Layout, Horizontal Carousel, or Sidebar Column).
4. **Fluid Spacing and Typography Scales:** Dynamic margins, padding tokens, and typography sizes (e.g., from `fluid-spacing-system` and `fluid-typography-system`).
5. **Brand Style Token Architecture:** Theme definitions for background cards, card border-radii, avatar shapes, logo-tinting parameters, and focus-state outlines.

## Outputs

1. **Testimonial Grid & Composition Blueprints:** Responsive spatial mappings detailing layouts across Desktop (1200px+), Tablet (768px - 1199px), and Mobile (below 768px).
2. **Semantic HTML Structural Spec:** Fully annotated DOM markup outline leveraging semantic elements (`<blockquote>`, `<cite>`, `<figure>`, `<footer>`) with correct ARIA live and labelling attributes.
3. **Contrast and Legibility Spec:** Precise contrast-ratio configurations for quotes, author details, metadata labels, and visual overlays.
4. **Visual Trust & Verification Standard:** Standardized design rules for trust badges (e.g., "Verified Buyer", "Enterprise Partner") and author-company relationships.

---

## Workflow

### 1. Structure the Testimonial Anatomy (The Visual & Semantic Base)
A high-performance testimonial must not be structured as a generic series of `<div>` tags. Establish a semantic layout base utilizing standard markup nodes:
- **The Container (`<figure>`):** Groups the testimonial quote, citation, and metadata into a cohesive, self-contained unit.
- **The Quote Text (`<blockquote>`):** Houses the main customer quotation. Do not embed decorative quote marks as literal characters inside the string; use CSS pseudo-elements (`::before`/`::after`) or aria-hidden presentation elements.
- **The Citation Details (`<figcaption>` or `<footer>`):** Groups the author's identity and professional attributes.
- **The Author Name (`<cite>`):** Enforces semantic citation styling for the customer's name.
- **The Secondary Metadata:** Displays job titles, company names, or verification badges adjacent to the citation.

### 2. Choose the Visual Layout Model
Select the layout pattern that best suits the context and quantity of social proof:

#### Pattern A: Single Spotlight (High Impact, Low Volume)
- **Context:** Hero sections, key feature boundaries, next to primary forms.
- **Geometry:** Large-scale single container spanning the full width of the content column (typically 800px to 1000px maximum line-length to keep text readable).
- **Anatomy:** Left-aligned or centered layout. Features large typography (`font-size: clamp(1.5rem, 4vw, 2.25rem)`), a prominent avatar (`80px` to `120px` diameter), and optional company logo.

#### Pattern B: Testimonial Card Grid (Medium Volume, Structured)
- **Context:** Dedicated social proof sections, customer hubs.
- **Geometry:** 2 or 3-column symmetrical CSS grid on desktop.
- **Anatomy:** Rectangular cards with consistent inner padding (e.g., `padding: var(--space-l)`). Flexbox handles vertical alignment (`justify-content: space-between`) with author citation locked to the bottom.

#### Pattern C: Masonry Layout (High Volume, Diverse Lengths)
- **Context:** "Wall of Love" pages, high-density feedback.
- **Geometry:** Multi-column layout using CSS Columns (`columns: 3 300px; gap: 1.5rem;`) or CSS Grid with masonry tracks where supported.
- **Anatomy:** Cards have variable heights determined by quote lengths. Ensure `break-inside: avoid` on cards to prevent layout splitting.

#### Pattern D: Logo-Paired Cards (Enterprise B2B Trust)
- **Context:** SaaS landing pages, B2B procurement journeys.
- **Geometry:** Horizontal split-cards or grid blocks.
- **Anatomy:** Prominent monochromatic enterprise customer logo at the top or left, followed by a professional executive citation and quote body.

### 3. Establish the Typography and Legibility Hierarchy
Text readability is paramount. Apply strict visual weights to establish scanning hierarchy:
- **Quote Text:** Set as the most dominant visual element. Use a slightly larger size (minimum `1.125rem` / `18px` on desktop) or a different typeface family (e.g., a highly readable editorial serif) to distinguish it from general body copy.
- **Author Name:** Set in bold sans-serif, using a medium weight (500 or 600) to stand out.
- **Job Title & Company:** Set in a smaller, lighter font size (`0.875rem` / `14px` or `0.75rem` / `12px`), styled in a secondary neutral tone (e.g., slate/gray) to prevent visual competition with the author's name.
- **Line Length (Measure):** Limit the width of the text container to a maximum of **70–80 characters** per line to prevent reading fatigue.

### 4. Integrate Trust and Verification Indicators
To combat modern consumer skepticism, design clear visual trust markers:
- **Verified Buyer Badge:** Use a subtle, high-contrast checkmark badge (typically colored green or a trustworthy brand blue) with explicit text "Verified Customer" or "Verified Purchase" to clarify the validity.
- **Real Avatars vs. Initial Badges:** Prioritize real, high-quality user photography. If an avatar image is unavailable, use a stylized initial badge with high-contrast text and a brand background. Never use generic, fake-looking stock portraits.
- **Company Logos:** Ensure company logos are displayed in a clean, monochromatic neutral tint (e.g., charcoal or slate) to prevent colored brand logos from clashing with the page's color system.

### 5. Define Responsive Reflow & Stacking Behaviors
Testimonial systems must transition seamlessly across devices to maintain vertical rhythm:
- **Desktop (1200px+):** Full multi-column grids or wide spotlights. Grid columns are set to `repeat(3, 1fr)` or `repeat(2, 1fr)`.
- **Tablet (768px - 1199px):** Reflow 3-column layouts into 2 columns. Single Spotlights reduce horizontal padding by 50% and align content logically.
- **Mobile (below 768px):** All grids collapse to a single-column stack (`grid-template-columns: 1fr`). Reduce massive spotlight font sizes dynamically using CSS `clamp()` or media queries. Avatars in mobile card grids are scaled down slightly (from `64px` to `48px` or `40px`) and can be positioned inline with the name to conserve vertical space.

---

## Decision Rules

### Selecting the Right Testimonial Layout Pattern

| Testimonial Count | Customer Type | Target Section / Context | Recommended Layout Pattern |
| :--- | :--- | :--- | :--- |
| **1 - 2** | High-Authority Exec / Influencer | Header Hero / Key Feature Block / Core CTA | **Single Spotlight** |
| **3 - 6** | Mid-Tier Customers / SMB Owners | Middle of Landing Page / Feature Showcase | **Symmetrical Card Grid (2-3 columns)** |
| **8+** | Diverse Users / Community | Dedicated Social Proof Hub / "Wall of Love" | **Masonry Grid / CSS Column Layout** |
| **3 - 5 (Niche)** | Enterprise Brands / Logos | Below Hero / Procurement Trust Sections | **Logo-Paired Enterprise Cards** |

### Avatar Shape & Framing Options
- **Circular (Default):** Use `border-radius: 50%` for standard individual consumer or professional user profiles. It frames portraits neatly and is universally recognized.
- **Soft Square:** Use `border-radius: 8px` to `16px` for tech, modern SaaS, or corporate portraits where a sleek, architectural tone is desired.
- **No-Avatar Clean Style:** If profile photos cannot be consistently obtained, completely omit the avatar element and style the citation details in a structured two-column block with a clean divider, or use a high-density, beautifully styled monogram badge.

### Handling Quote Truncation
- **Short-to-Medium (Max 3 lines):** Display in full.
- **Long Editorial Quotes (4+ lines):** Use dynamic "Read More" expandable toggles in interactive systems, or select a single high-impact punchline from the quote (using ellipses `[...]` where appropriate) for static landing pages. Never let extremely long testimonials skew grid height alignment.

---

## Constraints

- **Contrast Ratios (WCAG AA):**
  - All quote text, author names, and verification titles must meet a minimum contrast ratio of **4.5:1** against their background surfaces (e.g., card backgrounds or main section backs).
  - Muted secondary metadata (e.g., "Verified Customer" checkmarks or company titles) must meet at least **4.5:1** (preferring **7:1** for maximum legibility).
- **Keyboard Access (WCAG 2.1 SC 2.1.1):**
  - If a testimonial contains interactive elements (e.g., expandable "Read More" links, carousel next/prev arrows, filter buttons), they must be fully navigable using only the Tab and Arrow keys.
  - Interactive triggers must display a distinct, high-contrast `:focus-visible` outline that is not clipped by parent containers with `overflow: hidden`.
- **Screen Reader Semantics (WCAG 2.1 SC 1.3.1):**
  - Use correct semantic nesting: `<blockquote>` wrapping the quotation, and `<cite>` or `<footer>` wrapping the author details.
  - Decorative graphical elements, such as giant styled quotation marks, must be ignored by screen readers using `aria-hidden="true"`.
- **Responsive Layout Stability (CLS):**
  - Carousel-based testimonials must reserve explicit spatial height on the page to prevent Cumulative Layout Shift (CLS) when slides of varying heights are navigated.

---

## Common Failure Patterns

- **The "Unreadable Ghost Text":** Styling the testimonial quote or author's job title in an extremely light gray against a white card back, failing contrast ratios and isolating low-vision readers.
- **The "Fake Stock Photo" Cliché:** Using obviously staged, perfect stock images for customer avatars, which completely undermines social proof credibility.
- **Missing Blockquote Semantics:** Coding the testimonial with nested standard `<div>` or `<span>` tags, which prevents assistive screen readers from properly recognizing the block as an external quotation.
- **Visual Grid Height Chaos:** Creating a grid layout where cards have wildly varying heights due to uneven quote lengths, resulting in messy, misaligned rows.
- **Overstuffed Carousel Sliders:** Forcing all testimonials into an auto-playing carousel slider that moves too fast for slow readers and is difficult to pause with standard keyboard focus.

---

## Validation Criteria

- [ ] **Semantic Markup Compliance:** Every testimonial is contained within a semantic `<figure>` block, with the quotation inside a `<blockquote>` and the citation inside `<figcaption>` or `<footer>`.
- [ ] **Contrast AA Compliance:** Every text node inside the testimonial meets the WCAG AA minimum contrast ratio (4.5:1).
- [ ] **Responsive Fluidity:** Testimonials reflow gracefully across desktop, tablet, and mobile breakpoints without vertical truncation or horizontal overflow.
- [ ] **Logical Tab Order:** All interactive testimonial features (like Read More toggles or Slider controls) are reachable and operable via keyboard alone.
- [ ] **Visual Hierarchy Distinction:** The quote text is visually distinct from the citation block (using size, font-weight, or italic style).
- [ ] **Concentric Border Curve Check:** Card borders and inner elements (such as avatars or inset badges) follow proper concentric nesting logic.
- [ ] **No Auto-Play Trap:** Testimonial carousels do not auto-rotate, or they provide clear, prominent pause controls and stop on keyboard focus.
