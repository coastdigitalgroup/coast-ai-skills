---
name: accessible-star-rating-implementation
description:
  Implement and debug accessible star rating widgets using radio-group patterns,
  ensuring clear visual feedback, keyboard operability, and screen reader
  compatibility.
---

# Accessible Star Rating Implementation

## Purpose

The Accessible Star Rating Implementation skill provides a technical protocol for building and auditing star rating inputs. While visually simple, these widgets are often implemented as inaccessible "icon-only" clusters that fail to communicate state or value to assistive technology. This skill ensures star ratings are built using standard form elements (radio buttons) to provide a robust, accessible foundation.

## Use Cases

- Implementing a product review form where users provide a 1–5 star rating.
- Auditing existing "div-based" star ratings for keyboard and screen reader accessibility.
- Creating "rating-only" feedback widgets for content satisfaction.
- Building interactive summaries (e.g., "Filter by 4 stars and up").

## When NOT to Use

- **Read-Only Ratings:** If the rating is just for display (non-interactive), use a simple graphic with a descriptive `aria-label` rather than an input-based approach.
- **Binary Feedback:** For simple "Helpful/Not Helpful" or "Upvote/Downvote," use standard buttons or a single toggle.
- **Continuous Ranges:** For precise values (e.g., 4.72 out of 10), use a `<input type="range">` (slider) with appropriate labeling.

## Inputs

1. **Rating Scale:** The number of levels (usually 5).
2. **Value Representation:** Are half-stars allowed?
3. **Context:** Is it part of a larger form or a standalone interactive element?
4. **Visual Specs:** Symbols for empty, hovered, and selected states.

## Outputs

1. **Semantic HTML:** A fieldset containing a group of radio buttons with corresponding labels.
2. **Accessible Styling:** CSS using the `:has()` selector to manage "fill" states based on selection and hover while maintaining natural tab order.
3. **State Management:** Logic for handling value changes and providing immediate feedback.
4. **Validation Logic:** Ensuring a rating is selected if the field is required.

## Workflow

### 1. Establish the Radio-Group Structure

Use a `<fieldset>` with a `<legend>` to group the stars. Use five pairs of `<label>` and `<input type="radio">`. Placing the label *before* the input allows modern CSS `:has()` to fill the trail while maintaining natural keyboard navigation.

```html
<fieldset class="star-rating">
  <legend>Your Rating</legend>
  <div class="stars">
    <label for="star1">
      <svg aria-hidden="true" viewBox="0 0 24 24">...</svg>
      <span class="sr-only">1 Star</span>
    </label>
    <input type="radio" id="star1" name="rating" value="1" required>

    <label for="star2">...</label>
    <input type="radio" id="star2" name="rating" value="2">
    <!-- ... repeat for 3-5 ... -->
  </div>
</fieldset>
```

### 2. Implement the "Visual Fill" Logic (CSS)

Use the `:has()` selector to highlight all labels that precede the checked input.

```css
/* Fill labels that have a checked radio button later in the DOM (~ or +) */
.stars label:has(~ input:checked),
.stars label:has(+ input:checked) {
  fill: #b45309; /* High-contrast Amber */
}
```

### 3. Handle Hover States

Hovering should also use `:has()` to highlight stars in the same "fill up to" pattern.

```css
.stars label:hover,
.stars label:has(~ label:hover) {
  stroke: #d97706;
}
```

### 4. Provide Screen Reader Context

Ensure each radio button's label clearly describes the value (e.g., "3 Stars"). Use an `aria-live` region to announce the current selection (e.g., "Selected 4 out of 5 stars").

### 5. Handle Keyboard Interactions

Standard radio button behavior handles `Tab` to reach the group and `ArrowKeys` to change selection. Ensure focus states are clearly visible on the labels.

## Decision Rules

- **Native Radio vs. Custom Button:** Always prefer radio buttons for input-based ratings. They provide built-in group semantics (`role="radiogroup"`) and keyboard navigation that buttons lack.
- **SVG vs. Unicode/Webfont:** Use inline SVGs for the star icons. They offer the most control over styling (fill, stroke) and don't rely on external font loading.
- **No-JS Fallback:** Ensure the core selection still works and is visually reflected via standard radio selection even if JavaScript is disabled.

## Constraints

- **Touch Targets:** Each star (label) must be at least 44x44px for reliable tapping on mobile devices (WCAG 2.2, 2.5.8).
- **Contrast:** Empty star outlines must meet 3:1 contrast; filled states must meet 4.5:1 against the background if they convey meaning without accompanying text.
- **Natural Order:** Do not use `flex-direction: row-reverse` as it inverts keyboard arrow key behavior.

## Non-Goals

- Implementing the backend database for storing ratings.
- Handling complex average calculations for display.
- Creating highly decorative animations.

## Common Failure Patterns

- **Inverted Navigation:** Using `row-reverse` which makes Right Arrow go to the previous star.
- **Low Contrast:** Using light yellow (`#ffff00`) which is invisible to many users on white backgrounds.
- **Icon-Only Buttons:** Using `<button>` with no label, making it inaccessible to screen readers.
- **Broken Selectors:** Using selectors that only highlight the *last* clicked star instead of the trail.

## Validation Criteria

- [ ] **Keyboard Test:** Verify `Right Arrow` moves focus and selection to the next star (higher value).
- [ ] **Screen Reader Test:** Verify that each star is announced with its value and the total count (e.g., "3 of 5").
- [ ] **Contrast Check:** Verify that the filled star color has at least 3:1 (for graphics) or 4.5:1 (for high visibility) contrast.
- [ ] **No-JS Test:** Verify the visual "trail" still works with pure CSS.
