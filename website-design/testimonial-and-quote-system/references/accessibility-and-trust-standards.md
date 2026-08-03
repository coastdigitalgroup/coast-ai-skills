# Accessibility and Trust Standards Reference

This reference document outlines key accessibility specifications (WCAG 2.1 / 2.2) and trust-design heuristics when implementing customer testimonials and quote systems.

---

## 1. Accessibility Specifications (WCAG 2.1 / 2.2 AA)

### SC 1.3.1: Info and Relationships (Level A)
- **Semantic Tags:** Testimonials must use standard, semantic HTML. The quote itself must live inside a `<blockquote>` element. The citation/attribution (author name, company name) must be grouped within a `<figcaption>` (if nested inside a `<figure>`) or a `<footer>` element.
- **Star Ratings:** Star ratings must never be simple inline characters or un-labeled icons. They must be grouped into a container with `aria-label="Rated X out of 5 stars"` and individual stars must be hidden from screen readers (`aria-hidden="true"`).

```html
<!-- Correct Semantic Setup -->
<figure class="testimonial">
  <div class="stars" aria-label="Rated 5 out of 5 stars" role="img">
    <span aria-hidden="true">★</span><!-- Repeated 5 times -->
  </div>
  <blockquote>
    <p>"SentryNet has revolutionized our compliance monitoring."</p>
  </blockquote>
  <figcaption>
    <cite>Marcus Vance</cite>, CISO @ CloudBase Global
  </figcaption>
</figure>
```

### SC 1.4.3: Contrast (Minimum - Level AA)
- **Text Contrast:** Text elements must maintain standard contrast ratios against their card or container background.
  - **Primary Text (Quotes & Names):** Minimum **4.5:1** contrast.
  - **Secondary Metadata (Titles, Badges, Dates):** Minimum **4.5:1** contrast.
- **Visual Indicators (Stars & Badges):** Filled-in icons, active states, and focus indicator outlines must maintain at least a **3:1** contrast ratio against the background (SC 1.4.11 Non-Text Contrast).

| Element | Background Color | Text Color | Contrast Ratio | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Quote Text** | `#FFFFFF` (White) | `#0F172A` (Slate 900) | **21.0:1** | Pass (AA / AAA) |
| **Job Title** | `#FFFFFF` (White) | `#475569` (Slate 600) | **5.4:1** | Pass (AA) |
| **Verified Badge BG** | `#ECFDF5` (Emerald 50) | `#047857` (Emerald 700) | **4.8:1** | Pass (AA) |

### SC 2.1.1: Keyboard Accessibility (Level A)
- **Interactive Testimonials:** Testimonials containing "Read More" expanders or sliders must be fully accessible by keyboard.
  - Use semantic `<button>` tags for interactive triggers rather than generic clickable `<div>` elements.
  - Apply `:focus-visible` outline styles so keyboard focus is highly apparent. Focus outlines must not be clipped by `overflow: hidden` card boundaries.
- **Carousels:** Testimonial carousels must not auto-play by default. If auto-play is active, a clear "Pause" button must be present (SC 2.2.2 Pause, Stop, Hide), and focus entering the carousel must pause the auto-rotation.

### Avoid Redundant Voiceover Announcements
- **Blank Alt Text (`alt=""`):** Customer profile photos (avatars) are secondary decorative elements because the customer's name is already read aloud by the adjacent `<cite>` tag. Applying a detailed alt tag like `alt="Photo of Elena Rostova"` causes screen readers to read the name twice, causing confusion.
- Always apply `alt=""` and `aria-hidden="true"` to decorative avatars when they sit adjacent to readable citation text.

---

## 2. Psychological Trust Heuristics

To establish high authenticity and turn testimonials into high-conversion social proof, design for the following visual anchors:

### Core Identity Verification
1.  **Full Name:** Never use anonymous initials (e.g. "E.R."). Show full names (`Elena Rostova`) unless customer safety requires pseudonymization.
2.  **Job Title & Organization:** B2B buyers purchase from peers. Specify professional authority (`Director of Cloud Infrastructure, CyberFlow Systems`) to build immediate context.
3.  **Real, Cohesive Photography:** Strive to use authentic user-uploaded or professional corporate headshots. If headshots are unavailable, render stylized letter monograms (`ER` in slate-gray) rather than cheesy stock photos that damage brand integrity.

### Third-Party Validation Markers
- **Integration Logos:** Displaying verified software platform logos (e.g., G2, Trustpilot, Capterra) near the testimonial validates that the reviews were collected and certified by an independent third party.
- **Grayscale Company Brand Logos:** For enterprise validation, display the company logo adjacent to the quote. Converting multi-colored logos to monochromatic slate/gray (`#64748b`) ensures visual harmony while preserving the trust association.

---

## 3. Structural & Concentric Layout Rules

To preserve clean aesthetics, layout systems must respect spacing proportion constraints:

```text
    Outer Card Radius (Ro) = 16px
    +-----------------------------------------------+
    |  Padding (P) = 24px                           |
    |                                               |
    |   Inner Badge Radius (Ri) = 8px               |
    |   +--------------------------+                |
    |   |  VERIFIED BUYER          |                |
    |   +--------------------------+                |
    |                                               |
    +-----------------------------------------------+
    Concentric corner rounding formula: Ri = Ro - (P/3)
    16px - (24px/3) = 8px (concentric, balanced rounding)
```

- **Nested Border Radii:** Inner elements (such as badges, buttons, or square avatars) nested inside cards must have a smaller border-radius than the parent card. Applying identical large border-radii to both cards and badges results in awkward, mismatched curves.
- **Focal Length & Measure:** Keep the measure of quote text inside testimonials strictly between **55 and 75 characters** (`ch` units) per line. Lines that are too short break rhythm; lines that are too long cause users to lose their tracking.
