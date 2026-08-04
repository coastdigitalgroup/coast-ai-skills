# Accessibility and Trust Standards

This reference guide outlines the technical, semantic, and psychological standards for designing customer testimonials and quote systems. Adhering to these rules ensures that social proof components are accessible to assistive technologies and highly convincing to human visitors.

---

## 1. Semantic HTML Markup

Using correct semantic HTML tags is the foundation of accessible web design. Screen readers rely on these tags to convey context and relationship information.

| Element | Role in Testimonial | Implementation Notes |
| :--- | :--- | :--- |
| `<figure>` | **The Capsule** | Wraps the entire testimonial (quote, citation, and avatar) as a single self-contained unit. |
| `<blockquote>` | **The Core Quote** | Wraps the actual spoken or written quote text. Must contain only the quote. |
| `<figcaption>` | **The Citation Box** | Wraps all attribution metadata (author name, role, company, logo). Must reside inside `<figure>`. |
| `<cite>` | **The Source/Work** | Wraps the name of the company or the specific case study title (not the author's name). |
| `<img>` | **The Visual Anchor** | Headshot or avatar. Set `alt="[Speaker Name] headshot"` or keep empty (`alt=""`) if the speaker's name is adjacent. |

### Correct Markup Example:
```html
<figure class="testimonial">
  <blockquote>
    <p>“SentryFlow has cut our compliance review timeline in half.”</p>
  </blockquote>
  <figcaption>
    <img src="avatar.jpg" alt="Jane Doe headshot">
    <div class="author-info">
      <span class="author-name">Jane Doe</span>
      <span class="author-role">VP of IT at <cite>AcmeCorp</cite></span>
    </div>
  </figcaption>
</figure>
```

---

## 2. Text Legibility & Contrast (WCAG 2.1/2.2)

Social proof is useless if it cannot be read. You must guarantee color contrast compliance across light and dark theme backgrounds.

### Contrast Thresholds (WCAG AA Minimum)
- **Primary Quote Text:** Must meet **4.5:1** contrast ratio against the card or page background.
- **Author Attribution Name:** Must meet **4.5:1** contrast ratio.
- **Muted Role/Company Text:** Often designed in lighter grays, but **must still meet 4.5:1** contrast ratio. Never sacrifice readability for a "muted" look.
- **Decorative Quotation Marks:** If decorative background quote marks do not contain text and are purely graphic, they do not have contrast requirements. It is best to set their contrast low (e.g., `< 2:1`) and hide them with `aria-hidden="true"` so they do not distract from the real text.

### Typography Best Practices
- **Italics Restriction:** Never italicize long text blocks (e.g., quotes longer than 15 words). Italics distort letterforms, reducing reading speed and causing cognitive strain for dyslexic readers.
- **Line Height (Leading):** For body-size quotes, maintain a `line-height` of `1.5` to `1.6`. For spotlight quotes, keep a `line-height` of `1.3` to `1.4`.
- **Relative Sizes:** The quote body text should be at least **1.1x to 1.5x** larger than standard paragraph body text to draw attention.

---

## 3. Trust-Verification Markers

In an era of rampant "fake reviews," the design of a testimonial must visually communicate authenticity.

### Psychological Trust Levers

1. **The Face Element (Avatars):**
   - Human brains are hardwired to recognize and trust faces. Real headshots increase conversion rates far more than abstract initials, animal avatars, or generic icons.
   - Headshots should be clear, professional, and cropped closely (square 1:1 or circle ratios).

2. **Logo Association (Brand Authority):**
   - Incorporating high-contrast, recognizable client logos next to quotes transfers the client company's brand trust onto your product.
   - Use clean, single-color SVG logos instead of colored PNG files to maintain design system consistency.

3. **Verifiable Context:**
   - Link the testimonial to a deeper case study page or a third-party review site (G2, Trustpilot, Capterra).
   - Adding a small "✓ Verified Customer" or "Original Review on Trustpilot" badge signals that the quote is legally and factually real.

---

## 4. Sliders, Carousels, and Touch Targets

If multiple testimonials are integrated into a slider or carousel to save vertical page space, the slider must be fully accessible.

### Interaction & Focus Rules
- **Pause/Play Controls:** If the slider auto-plays (strongly discouraged, as it disrupts reading and screen readers), a highly visible play/pause button must be provided. Auto-play must pause on keyboard focus and hover.
- **Keyboard Navigation:** Users must be able to navigate between slide panels using `Left`/`Right` arrow keys.
- **Focus Indicators:** Interactive slide dots, prev/next arrows, and link cards must have a visible `:focus-visible` ring (minimum **3:1** contrast against background). Focus must never get trapped in hidden/inactive slides.
- **Touch Target Sizes (WCAG 2.2 SC 2.5.8):** All slide control buttons (arrows, dots) must have an active interactive target size of at least **24x24px** with adequate spacing (preferred **44x44px** for touch viewports to prevent misclicks).
