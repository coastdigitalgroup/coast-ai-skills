# Example: Services Section Card Composition

This example demonstrates how the Card UI System is applied to a "Services"
section of a professional services website. It shows the translation from
abstract content to a structured, responsive card layout.

## 1. Content Inventory

- **Icon:** Representing the service (e.g., Strategy, Design, Development).
- **Service Title:** Primary heading.
- **Summary:** 2-sentence description of the service.
- **Link:** "Learn More" text link.

## 2. Priority Scoring

1. **Title:** Identifies the service immediately.
2. **Icon:** Provides visual context and scannability.
3. **Summary:** Offers enough detail to decide if they want to click.
4. **Link:** The specific action.

## 3. Visual Hierarchy Specs

| Element       | Lever      | Specification                                        |
| :------------ | :--------- | :--------------------------------------------------- |
| **Container** | Elevation  | 1px border (`neutral-200`) + subtle shadow on hover. |
| **Icon**      | Color      | Brand Primary color; 48px size.                      |
| **Title**     | Typography | H3, Bold, `text-900`.                                |
| **Summary**   | Typography | Body, `text-600`.                                    |
| **Link**      | Typography | Small, Bold, `text-primary`, underline on hover.     |

## 4. Spacing & Grid (Desktop)

- **Grid:** 3-column layout (spans 4 columns each in a 12-column grid).
- **Internal Padding:** `--space-m` (approx 24px-32px fluid).
- **Vertical Gap (Internal):** `--space-s` (approx 16px-20px fluid) between all
  elements.

## 5. Responsive Adaptation

- **Tablet (800px):** Switches to a 2-column grid. One card stacks below.
- **Mobile (400px):** Switches to a 1-column grid.
- **Mobile Interaction:** The whole card becomes a "Big Box" click target to
  improve tap accuracy on small screens, using the stretched-link pattern on the
  "Learn More" link.

## 6. Implementation Notes

- Use `display: flex; flex-direction: column;` on the card container.
- Use `margin-top: auto;` on the Link element to ensure all "Learn More" links
  align at the bottom of the row, even if summaries vary in length.
