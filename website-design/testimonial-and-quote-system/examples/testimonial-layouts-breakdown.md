# Testimonial Layouts Breakdown

This example guide demonstrates how to apply the **Testimonial and Quote System** to three real-world marketing page contexts. Each breakdown illustrates the layout composition, typographic hierarchy, responsive adaptation, and spatial metrics.

---

## Example 1: The "Spotlight Hero" Testimonial
**Context:** A high-impact B2B SaaS landing page positioned right below the hero fold or immediately preceding the primary pricing section.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         “ SentryFlow changed our                        │
│                           entire posture toward                         │
│                           compliance audits. ”                          │
│                                                                         │
│                                ( Avatar )                               │
│                              Sarah Jenkins                              │
│                      Chief Compliance Officer at AcmeCorp               │
│                                                                         │
│                            [Verified on G2 Badge]                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Visual and Typographic Hierarchy
- **Quote Text:** Set in a prominent display serif font, 32px size (`--font-size-3xl`), font-weight 500, line-height 1.3. Set in deep neutral/black (`#0F172A`).
- **Quote Marks:** Stylized background double quotation marks, colored in a very light slate gray (`#E2E8F0`), positioned behind the first and last letters at a larger scale (e.g., 120px) to add a editorial touch without overlapping text.
- **Avatar:** A 64x64px circular headshot centered below the quote, with a subtle border to anchor it visually.
- **Name:** Centered, 16px size (`--font-size-base`), bold weight 600, color slate-900 (`#0F172A`).
- **Title and Company:** Centered, 14px size (`--font-size-sm`), font-weight 400, color slate-500 (`#64748B`).
- **Trust Badge:** A small, centered, low-contrast badge indicating G2 Verification (`#0284C7` background tint, white text, 12px font size) positioned at the bottom of the stack.

### Responsive Behavior (Desktop vs. Mobile)
- **Desktop (>=1024px):** Centered within a max-width container of 800px. Left and right padding set to 48px (`--space-xl`) to give the quote immense breathing room.
- **Tablet (768px–1023px):** Container scales to 640px. Font size drops to 24px (`--font-size-2xl`) for readability.
- **Mobile (<768px):** Left/right padding collapses to 24px (`--space-lg`). Font size drops to 18px (`--font-size-lg`). Elements stay centered, but vertical margin between quote and avatar is tightened from 32px to 24px to ensure it stays above the fold on mobile screens.

---

## Example 2: The "Testimonial Card Grid"
**Context:** A modular wall of customer love on a product features page, showcasing varying customer perspectives in a balanced layout.

```text
┌──────────────────────────────────────┐ ┌──────────────────────────────────────┐
│ “Our engineering team is 2x faster.” │ │ “The documentation is world-class.  │
│                                      │ │  We went from integration to prod    │
│ (Avatar) Marcus Chen                 │ │  in just three days.”                │
│ Lead Developer at DevCo              │ │                                      │
│                                      │ │ (Avatar) Elena Rostova               │
│                                      │ │ VP of Engineering at ScaleUp         │
└──────────────────────────────────────┘ └──────────────────────────────────────┘
┌──────────────────────────────────────┐ ┌──────────────────────────────────────┐
│ “Customer support helped us migrate  │ │ “Highly recommend SentryFlow for     │
│  our entire stack without downtime.” │ │  fast-growing startups.”             │
│                                      │ │                                      │
│ (Avatar) Liam Vance                  │ │ (Avatar) Maya Lin                    │
│ COO at FinGrowth                     │ │ Founder at SeedLaunch                │
└──────────────────────────────────────┘ └──────────────────────────────────────┘
```

### Visual and Typographic Hierarchy
- **Card Container:** Styled with a solid white background, a very thin, low-contrast border (`1px solid #E2E8F0`), and a smooth border radius (`12px`).
- **Card Spacing:** Horizontal and vertical gap inside the grid is set to 24px (`--space-lg`). The card's internal padding is set to 32px (`--space-xl`) for a premium, spacious layout.
- **Quote Text:** 16px size (`--font-size-base`), font-weight 400, line-height 1.5, slate-700 (`#334155`).
- **Avatar and Attribution:** Left-aligned. The avatar is 40x40px, placed to the left of the speaker's name and role in a horizontal row.
- **Speaker Name:** 14px size (`--font-size-sm`), bold weight 600, color slate-900 (`#0F172A`).
- **Speaker Role:** 12px size (`--font-size-xs`), color slate-500 (`#64748B`), stacked directly below the name.

### Responsive Behavior (Desktop vs. Mobile)
- **Desktop (>=1024px):** Rendered as a 2-column or 3-column CSS Grid. Height is set to `auto` so cards can scale to the size of their content.
- **Mobile (<768px):** Grid collapses to a 1-column layout. The vertical gap is maintained at 16px (`--space-m`) to prevent cards from bunching together. Internal padding reduces to 24px (`--space-lg`) to preserve precious horizontal space.

---

## Example 3: The "Inline Pull-Quote"
**Context:** A qualitative client quote integrated within a long-form Customer Case Study article.

```text
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non
tempus ligula. Sed at lorem eros. Phasellus dictum diam ac sapien.

    ┌────────────────────────────────────────────────────────┐
    │  “We expected SentryFlow to protect our infrastructure,│
    │   but we didn't expect it to speed up our releases.    │
    │   It has been an absolute game-changer.”               │
    │                                                        │
    │   — David Kim, VP of Cloud Infrastructure              │
    └────────────────────────────────────────────────────────┘

Aenean elementum sem scelerisque urna aliquet, sit amet lobortis
sapien efficitur. Integer vitae felis congue, vulputate dolor sed.
```

### Visual and Typographic Hierarchy
- **Placement:** Indented from both left and right margins by 32px (`--space-xl`).
- **Visual Highlight:** A solid 4px wide accent border on the left side of the quote container, colored in the primary brand brand color (e.g., `#0F62FE`).
- **Quote Text:** 18px size (`--font-size-lg`), italic style (permitted here since the quote is short—2 sentences), line-height 1.6, slate-800 (`#1E293B`).
- **Attribution Line:** Placed on a new line below the quote, preceded by an em-dash (`—`), 14px size (`--font-size-sm`), font-weight 500, color slate-600 (`#475569`).

### Responsive Behavior (Desktop vs. Mobile)
- **Desktop (>=1024px):** Indented as a focal callout within the text column.
- **Mobile (<768px):** Indentation collapses to 16px (`--space-m`) to prevent the text column from becoming too narrow. Font size matches the article's body font size (16px) but maintains the left accent border and italicized style to remain visually distinct from the surrounding narrative copy.
