# Interaction Breakdown Example

This example demonstrates how to document interactive states for a standard
"Primary Button" and a "Product Card" component.

## 1. Primary Action Button

| State        | Visual Change                                   | Behavior/Trigger             |
| ------------ | ----------------------------------------------- | ---------------------------- |
| **Default**  | Background: #0055FF, Text: #FFFFFF, Radius: 4px | Component load               |
| **Hover**    | Background: #0044CC (Darken 10%)                | Mouse enters element         |
| **Focus**    | Outline: 2px solid #0055FF, Offset: 2px         | Tab key focus                |
| **Active**   | Scale: 0.98, Background: #0033BB                | Mouse down / Tap start       |
| **Disabled** | Opacity: 0.5, Cursor: not-allowed               | `disabled` attribute present |
| **Loading**  | Text hidden, Spinner icon shown, Pointer: wait  | Async action in progress     |

---

## 2. Interactive Product Card

Cards are complex because they often contain nested interactive elements (links,
buttons) but the whole surface might also be clickable.

### Card Surface States

- **Default:** White background, subtle 1px border (#E0E0E0).
- **Hover:** Elevated shadow (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`), border
  changes to Primary Light (#CCE0FF).
- **Focus:** 2px Blue ring around the entire card container.
- **Active:** Slight background tint (#F9F9F9).

### Internal Element Hierarchy

- **Primary Link (Title):** On card hover, the title underlines to indicate the
  primary destination.
- **Wishlist Button:** Maintains its own independent states (Hover: Red tint)
  regardless of card hover state.

---

## 3. Form Input Field

| State        | Visual Change                                  | Accessibility Note                |
| ------------ | ---------------------------------------------- | --------------------------------- |
| **Default**  | Border: 1px Gray, Label: Above field           | Clear affordance                  |
| **Hover**    | Border: 1px Dark Gray                          | Subtle feedback                   |
| **Focus**    | Border: 2px Blue, Glow: 4px Blue (20% opacity) | Critical for keyboard nav         |
| **Error**    | Border: 2px Red, Error Message below field     | Icon included for color-blindness |
| **Success**  | Border: 2px Green, Checkmark icon              | Immediate validation              |
| **Disabled** | Background: #F5F5F5, Cursor: not-allowed       | Prevents interaction              |
