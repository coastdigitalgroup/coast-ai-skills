# Content Feed and Portfolio Masonry Breakdown

This example demonstrates the application of the **Masonry Grid Layout System** across two real-world design scenarios: a Photography & Visual Art Portfolio Gallery and an Interactive Social/UGC Content Feed. It breaks down spatial composition, visual column flow, CSS/JS layout mechanics, and keyboard focus reconciliation.

---

## Scenario 1: Photography & Visual Art Portfolio

### Design Goal
Display 12 high-resolution photography cards with varying native aspect ratios (portrait `3:4`, landscape `16:9`, square `1:1`, and vertical panorama `9:16`) in a gapless, zero-whitespace grid.

### Architectural Choice
**CSS Multi-Column (`column-count`)**
- *Why:* The cards are non-interactive lightbox triggers. Users browse visually down columns. There are no complex form inputs or multi-step internal buttons, making native CSS columns ideal for performance and zero JavaScript overhead.

### Column Flow Diagram (Desktop 3-Column Layout)

```text
[ Visual Column 1 ]       [ Visual Column 2 ]       [ Visual Column 3 ]
+-------------------+     +-------------------+     +-------------------+
| Card 01           |     | Card 02           |     | Card 03           |
| Portrait (3:4)    |     | Landscape (16:9)  |     | Square (1:1)      |
|                   |     +-------------------+     +-------------------+
|                   |     | Card 05           |     | Card 06           |
+-------------------+     | Panorama (9:16)   |     | Landscape (16:9)  |
| Card 04           |     |                   |     +-------------------+
| Landscape (16:9)  |     |                   |     | Card 07           |
+-------------------+     |                   |     | Portrait (3:4)    |
| Card 08           |     +-------------------+     |                   |
| Square (1:1)      |     | Card 09           |     |                   |
+-------------------+     | Portrait (3:4)    |     +-------------------+
```

### HTML & CSS Code Implementation

```html
<section class="portfolio-gallery" aria-label="Selected Photography Works">
  <div class="masonry-css-columns">
    <!-- Card 01 -->
    <article class="masonry-card">
      <button class="card-trigger" aria-haspopup="dialog" aria-label="View Alpine Dusk in full resolution">
        <div class="media-container aspect-portrait">
          <img src="photo-01.jpg" alt="Sunset over jagged snow-capped mountain peaks" loading="lazy" />
          <div class="media-overlay">
            <span class="photo-title">Alpine Dusk</span>
            <span class="photo-category">Landscape</span>
          </div>
        </div>
      </button>
    </article>

    <!-- Card 02 -->
    <article class="masonry-card">
      <button class="card-trigger" aria-haspopup="dialog" aria-label="View Urban Monolith in full resolution">
        <div class="media-container aspect-landscape">
          <img src="photo-02.jpg" alt="Symmetrical architectural lines of a glass skyscraper" loading="lazy" />
          <div class="media-overlay">
            <span class="photo-title">Urban Monolith</span>
            <span class="photo-category">Architecture</span>
          </div>
        </div>
      </button>
    </article>

    <!-- Additional cards follow same structure -->
  </div>
</section>
```

```css
/* Container CSS Multi-Column */
.masonry-css-columns {
  column-count: 3;
  column-gap: var(--space-l, 24px);
  width: 100%;
}

/* Responsive Column Scaling */
@media (max-width: 1024px) {
  .masonry-css-columns {
    column-count: 2;
    column-gap: var(--space-m, 16px);
  }
}

@media (max-width: 640px) {
  .masonry-css-columns {
    column-count: 1;
  }
}

/* Card Containment */
.masonry-card {
  break-inside: avoid;
  margin-bottom: var(--space-l, 24px);
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--surface-card, #1e1e24);
}

/* Aspect Ratio Reservations (Prevent CLS) */
.aspect-portrait { aspect-ratio: 3 / 4; }
.aspect-landscape { aspect-ratio: 16 / 9; }
.aspect-square { aspect-ratio: 1 / 1; }
.aspect-panorama { aspect-ratio: 9 / 16; }

.media-container {
  width: 100%;
  position: relative;
  background-color: var(--surface-subtle, #2a2a32);
}

.media-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Dark Overlay Scrim for Text Contrast (WCAG 1.4.3) */
.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.masonry-card:hover .media-overlay,
.card-trigger:focus-visible .media-overlay {
  opacity: 1;
}

/* Focus Indicator (WCAG 2.4.7) */
.card-trigger {
  all: unset;
  display: block;
  width: 100%;
  cursor: pointer;
  border-radius: 12px;
}

.card-trigger:focus-visible {
  outline: 3px solid var(--brand-primary, #3b82f6);
  outline-offset: -3px; /* Kept inside rounded boundary */
}
```

---

## Scenario 2: Interactive Social / UGC Activity Feed

### Design Goal
Organize mixed user-generated social cards (short text updates, full articles, image posts, bookmark links) with internal interactive actions (Like, Bookmark, Comment, Share) into a tight multi-column masonry feed without visual gaps.

### Architectural Choice
**JavaScript Shortest-Column Flex Distribution**
- *Why:* Cards contain multiple interactive buttons (`<button>`, `<a>`). Using CSS Multi-Column would cause keyboard `Tab` focus to jump down the entire first vertical column before returning to the top of column 2. The JS Shortest-Column pattern distributes cards sequentially into horizontal DOM column tracks, guaranteeing a natural left-to-right visual tabbing sequence (`1 -> 2 -> 3 -> 4`).

### Visual vs. DOM Focus Sequence Map (Desktop 3-Column)

```text
Visual Layout & DOM Tab Sequence:
+------------------------+  +------------------------+  +------------------------+
| Card 01 [Tab 1]        |  | Card 02 [Tab 2]        |  | Card 03 [Tab 3]        |
| Short Text (140px)     |  | Image Post (380px)     |  | Article Snippet (260px)|
+------------------------+  |                        |  +------------------------+
| Card 04 [Tab 4]        |  |                        |  | Card 05 [Tab 5]        |
| Long Article (320px)   |  +------------------------+  | Quote Card (180px)     |
|                        |  | Card 06 [Tab 6]        |  +------------------------+
|                        |  | Poll Widget (210px)    |  | Card 07 [Tab 7]        |
+------------------------+  +------------------------+  | Image + Caption(310px) |
```

### JavaScript Column Distribution Engine

```javascript
class MasonryFeed {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.gap = options.gap || 20;
    this.columns = [];
    this.init();
  }

  init() {
    this.updateColumns();
    window.addEventListener('resize', this.debounce(() => this.updateColumns(), 150));
  }

  getColumnCount() {
    const width = window.innerWidth;
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  updateColumns() {
    const targetCount = this.getColumnCount();
    if (this.columns.length === targetCount) return;

    // Preserve original card elements
    const cards = Array.from(this.container.querySelectorAll('.ugc-card'));

    // Clear container
    this.container.innerHTML = '';
    this.columns = [];

    // Create flex column tracks
    for (let i = 0; i < targetCount; i++) {
      const col = document.createElement('div');
      col.className = 'masonry-column-track';
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.gap = `${this.gap}px`;
      col.style.flex = '1';
      col.style.minWidth = '0';
      this.container.appendChild(col);
      this.columns.push(col);
    }

    // Distribute cards to the shortest column
    cards.forEach(card => this.appendCard(card));
  }

  appendCard(card) {
    if (this.columns.length === 1) {
      this.columns[0].appendChild(card);
      return;
    }

    // Find column track with minimum rendered height
    let shortest = this.columns[0];
    let minHeight = shortest.offsetHeight;

    for (let i = 1; i < this.columns.length; i++) {
      const h = this.columns[i].offsetHeight;
      if (h < minHeight) {
        minHeight = h;
        shortest = this.columns[i];
      }
    }

    shortest.appendChild(card);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const feedElement = document.getElementById('ugc-masonry-feed');
  if (feedElement) new MasonryFeed(feedElement, { gap: 24 });
});
```

---

## Key Takeaways & Design Rules

1. **Match Architecture to Interaction:** Use CSS Multi-Column for non-interactive image galleries; use JS Shortest-Column flex tracks for interactive cards requiring left-to-right keyboard focus.
2. **Prevent CLS Proactively:** Declare explicit CSS `aspect-ratio` properties or render skeleton dimensions before images load.
3. **WCAG Focus Ring Protection:** Ensure inner interactive card triggers keep high-contrast focus rings inside boundaries or utilize `outline-offset: -2px` to prevent focus clipping by `overflow: hidden`.
