---
name: testimonial-and-quote-system
description:
  Design and structure qualitative customer testimonials, spotlight quotes,
  and citation components to establish credibility, trust, and social proof in
  compliance with WCAG AA accessibility standards.
---

# Testimonial and Quote System

## Purpose

The Testimonial and Quote System provides a systematic design and spatial framework for qualitative customer testimonials and client quotes. Rather than treating social proof as an afterthought, this system establishes structural, typographic, and citation rules that maximize visual credibility and authenticity while ensuring complete accessibility. It bridges the gap between raw, user-generated reviews (handled by `review-and-rating-system`) and highly curated marketing proof points.

## Use Cases

- **Landing Pages:** Placing prominent customer success quotes to support primary and secondary CTAs.
- **Service/Product Detail Pages:** Integrating contextually relevant customer quotes that directly address common friction points or objections.
- **Case Study Hubs & Success Stories:** Designing the hero pull-quotes that summarize the main outcome or ROI of a customer story.
- **About and Team Pages:** Displaying quotes from founders, key partners, or employees.
- **Enterprise Sales Collateral:** Structuring high-impact quotes from high-profile client representatives (VP, Director, C-suite).

## When NOT to Use

- **Quantitative Feedback Lists:** For high-volume, user-generated reviews (e.g., 500 individual 1-to-5-star product reviews); use `review-and-rating-system` instead.
- **Data Tables/Product Attribute Grids:** For displaying hard specification attributes; use `property-and-attribute-system` or `data-table-ui-system`.
- **Primary Page Content:** Testimonials should support, not replace, primary product information or core value propositions.
- **Legal Disclaimers and Terms of Service:** For strict legally binding text that requires formal, non-narrative treatment.

## Inputs

To design an effective testimonial or quote component, the following information is required:

1. **Quote Content:** The actual copy of the testimonial, ideally refined to be concise and focused on a single key outcome or benefit.
2. **Author Identity:** Name of the individual, job title, and company.
3. **Visual Assets:** High-resolution headshot, company logo (SVG preferred), or an optional video/audio link.
4. **Context of Use:** The specific page and placement (e.g., Hero Spotlight, multi-card grid, sidebar pull-quote).
5. **Trust Markers:** Verifiable details (e.g., Link to original case study, "Verified Customer" status, or third-party platform logo like G2/Trustpilot).

## Outputs

Applying this system produces:

1. **Anatomy Specification:** Defined relative layout positions for the quote text, quote marks, avatar, name, title, logo, and trust markers.
2. **Layout Compositions:**
   - *Single Spotlight:* A high-impact, full-width or half-width layout for hero placements.
   - *Testimonial Grid/Cards:* An asymmetrical or structured grid of cards for displaying multiple testimonials.
   - *Inline Pull-Quote:* Compact, side-aligned quote integrated into long-form editorial content.
3. **Semantic Markup Blueprint:** Standardized HTML structure using `<figure>`, `<blockquote>`, and `<figcaption>` to ensure correct screen reader interpretation.
4. **Typography Hierarchy Rules:** Guidelines for weight, line-height, style (limiting italic abuse), and scale contrast between the quote and citation metadata.

---

## Workflow

### 1. Audit and Structure the Quote Anatomy
Every testimonial consists of three distinct zones that must be structured in the DOM and style sheet:
```text
┌─────────────────────────────────────────────────────────┐
│  [1] Quote Container (with semantic blockquote)         │
│      "Since deploying SentryFlow, we've reduced our     │
│       audit preparation overhead by 80%."               │
├─────────────────────────────────────────────────────────┤
│  [2] Citation Area (with semantic figcaption)           │
│      (👤 Avatar)  Jane Doe                              │
│                   VP of Compliance at SentryCorp        │
├─────────────────────────────────────────────────────────┤
│  [3] Trust/Verification Marker                          │
│      (✓ Verified Customer)   [SentryCorp Logo]          │
└─────────────────────────────────────────────────────────┘
```
- **The Quote:** The core qualitative statement. Limit length to 2–3 sentences (approx. 40–60 words).
- **The Citation:** The author's name, title, and organization.
- **The Visual Anchor:** A headshot (avatar) or brand logo to draw the eye and humanize the quote.

### 2. Choose the Spatial Layout Pattern
Based on information density and visual priority, select one of the following layouts:

- **Spotlight Hero Pattern:**
  - *When:* High-impact landing pages or case study heroes.
  - *Layout:* Center-aligned or 50/50 horizontal split. Massive, high-contrast typography (`--text-xl` or `--text-xxl`).
  - *Usage:* Exactly one spotlight testimonial per page section to prevent dilution.

- **Testimonial Card Grid:**
  - *When:* Dedicated "Social Proof" sections or "What our clients say" blocks.
  - *Layout:* 2-column or 3-column responsive grid.
  - *Usage:* Best when you have 3 to 6 high-quality quotes. Utilize varying heights (or a Bento-style arrangement) to make the page feel organic.

- **Inline Pull-Quote:**
  - *When:* Inside long-form case studies, articles, or blog posts.
  - *Layout:* Margins indented, border-left active state highlight, floating or embedded within paragraph columns.
  - *Usage:* To break up dense text blocks and emphasize high-value client quotes.

### 3. Establish Typographic Hierarchy
To ensure scannability (as users scan before they read):
- **Quote Styling:** Avoid styling the entire quote in a thin, light-gray italic font. Italicizing blocks of text longer than a few words reduces readability. Instead, use a regular font style with a slightly larger size (`--font-size-lg`) or an expressive display serif typeface, and set it in a high-contrast neutral color.
- **Direct Quote Indication:** Use CSS pseudo-elements (`::before`/`::after`) to render decorative quotation marks, or position a large, low-opacity background quote mark behind the block. Do not hardcode literal `"` marks in the text to avoid screen readers double-announcing them.
- **Citation Contrast:** The author's name should be bolded (`font-weight: 600`), and their role/company should be styled in a muted secondary color (`color: var(--text-muted)`) with a smaller font size (`--font-size-sm`).

### 4. Integrate Trust and Verification Indicators
To combat the "fake testimonial" skepticism:
- **Real Visuals:** Always prefer real, professional headshots over generic avatars, stock illustrations, or empty placeholders.
- **Logo Integration:** Place the customer's company logo alongside their title to borrow brand authority.
- **Verification Badges:** If pulling from a verified third-party source (e.g., G2, Capterra), include a small brand icon indicating the origin.

### 5. Apply Responsive Adaptations
Configure fluid resizing and stacking rules:
- **Mobile Collapsing:** All horizontal (50/50 split) spotlight testimonials must collapse into a single vertical column on viewports below 768px, placing the visual headshot/logo *below* the quote text to keep the value statement prominent.
- **Grid Layout Shifts:** Multi-column testimonial grids must transition to a single-column stack on mobile. Do not force users to scroll horizontally through tiny cards unless implementing a touch-swipe carousel.
- **Carousel Controls (If Used):** Carousel slider patterns must support standard touch gestures, keyboard arrows (`Left`/`Right`), and contain highly visible pause/play controls if auto-playing (strongly discouraged).

### 6. Ensure WCAG AA Accessibility
- **Semantic Structure:** Always wrap the entire component in a `<figure>` element. Wrap the quote text in a `<blockquote>` and the citation in a `<figcaption>` containing a `<cite>` for the author's title or company.
- **Color Contrast:** Test all elements. Quote text and author citations must maintain at least a **4.5:1** contrast ratio. Decorative elements (like huge background quotation marks) must have low contrast or be hidden from assistive tech with `aria-hidden="true"`.
- **Keyboard & Focus:** If the testimonials live in a tabbed panel or slider, all control indicators (dots, arrows) must have highly visible `:focus-visible` outlines and meet touch target minimums.

---

## Decision Rules

### Layout Selection Matrix

| Content Volume | Target Placement | Priority | Recommended Pattern |
| :--- | :--- | :--- | :--- |
| **1 Key Quote** | Hero / Primary CTA | High | **Spotlight Hero** (Centered/Large) |
| **3–6 Quotes** | Features / Proof Zone | Medium | **Testimonial Card Grid** (Asymmetrical or Bento) |
| **6+ Quotes** | Customer Success Hub | High-density | **Categorized Tab Grid** or **Truncated Load-More Cards** |
| **Editorial Copy** | Case Study Body / Blog | Contextual | **Inline Pull-Quote** (Indented, left-accent border) |

### Headshot vs. Logo Priority
- **Use Headshots When:** The human emotional connection is paramount (B2C, personal coaching, creator platforms, individual consumer-facing apps).
- **Use Company Logos When:** Corporate credibility and institutional authority are the primary drivers (Enterprise SaaS, B2B services, industrial products).
- **Use Both When:** Pitching high-value B2B stakeholders where both the specific buyer persona (e.g., CTO) and their company brand carry massive weight.

---

## Constraints

- **Accessibility:**
  - Semantic markup: `<figure>`, `<blockquote>`, `<figcaption>`, `<cite>`.
  - Contrast: Minimum 4.5:1 contrast on all readable text.
  - Screen readers: Decorative quote pseudo-elements hidden via CSS or `aria-hidden="true"`.
  - Focus: Focus must never be trapped or obscured in sliders.
- **Responsiveness:**
  - Absolute mobile container width constraint: Never exceed `100vw`.
  - Touch targets for slider controls: Minimum 24x24px (WCAG 2.2 SC 2.5.8), preferred 44x44px.
  - Text wrapping: Long names or titles must wrap gracefully without clipping.
- **Visual Hierarchy:**
  - Quote text size must be at least 120% of the body text size in Spotlight layouts.
  - Keep decorative quotation marks at a low opacity (e.g., `opacity: 0.1` to `0.2`) to prevent them from colliding or overlapping with text.

---

## Common Failure Patterns

- **The "Wall of Italics" Mistake:** Italics reduce reading speed and increase cognitive load. Setting a 100-word quote entirely in italicized, low-contrast gray text ensures users will skip it entirely.
- **Anonymity and Stock Elements:** Quotes attributed to "John D." or accompanied by obvious stock photos of smiling models look fake and severely damage site credibility.
- **The "Over-Decorative" Trap:** Making CSS quotation marks so large and high-contrast that they obscure the first or last letters of the actual quote, or overlap with the speaker's avatar on mobile viewports.
- **Horizontal Scrolling Lock:** Forcing mobile users to swipe horizontally to read testimonials without a visual indicator of overflow (e.g., peeking cards) or accessible fallback bullet indicators.
- **Aesthetic Over Accessibility (Semantic Div Soup):** Structuring testimonials using arbitrary `<div>` nesting without standard semantic tags, preventing screen readers from announcing the passage as a quote.

---

## Validation Criteria

- [ ] **Semantic Markup:** The HTML uses `<figure>` as the wrapper, `<blockquote>` for the text, and `<figcaption>` for the attribution details.
- [ ] **Contrast Verification:** The quote text, speaker name, and speaker title all have a contrast ratio of at least 4.5:1.
- [ ] **Responsive Transition:** Spotlight layouts stack vertically on viewports `< 768px`, and multi-column grids collapse to 1 column.
- [ ] **Typography Readability:** The quote body text is set in a normal/roman font-style, avoiding long blocks of italics.
- [ ] **No Hardcoded Quote Characters:** Quotation marks are rendered using decorative CSS background patterns or pseudo-elements (`::before`/`::after`) with `content: ""` and styling, or hidden from screen readers.
- [ ] **Proportional Spacing:** Spacing between the quote body and the citation block uses a consistent relative variable (e.g., `margin-top: var(--space-m)`).
- [ ] **Visual Authenticity:** Attribution includes verifiable credentials (full name, title, company, or logo) and avoids placeholder graphics.
