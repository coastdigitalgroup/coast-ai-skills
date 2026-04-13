# Example: Accessible Color Palette Breakdown

This example demonstrates how a single brand color is expanded into a full,
accessible system and applied to a standard landing page layout.

## Brand Input

- **Primary Color:** `#0055FF` (Vivid Blue)
- **Neutral Base:** `#121212` (Off-black)
- **Target:** WCAG 2.1 AA

## 1. The Color Scale (Primary)

| Step | Hex       | Use Case                 | White Contrast                 |
| :--- | :-------- | :----------------------- | :----------------------------- |
| 50   | `#E6EEFF` | Backgrounds, Muted tags  | 1.1:1 (Fail)                   |
| 200  | `#99BBFF` | Hover states (on dark)   | 1.6:1 (Fail)                   |
| 500  | `#0055FF` | **Brand Color**, Buttons | 4.2:1 (Fail - Large text only) |
| 600  | `#0044CC` | Primary Text on Light    | 5.8:1 (Pass AA)                |
| 900  | `#001133` | Overlays, Deep Footer    | 16.5:1 (Pass AAA)              |

## 2. The Layout Application

### Hero Section

- **Background:** `primary-900` (#001133)
- **Heading:** `neutral-50` (#F9F9F9) -> Contrast 15.8:1 (Safe)
- **Primary CTA:**
  - Background: `primary-500` (#0055FF)
  - Text: `neutral-900` (#121212) -> Contrast 4.6:1 (Pass AA)
  - _Decision Rule:_ We use dark text on the button because white text on
    #0055FF (4.2:1) fails AA for normal text.

### Features Grid

- **Card Background:** `neutral-50` (#F9F9F9)
- **Body Text:** `neutral-800` (#2D2D2D) -> Contrast 12.5:1 (Safe)
- **Icons:** `primary-600` (#0044CC) -> Contrast 5.1:1 (Safe for UI components)

### Feedback/Status

- **Success Toast:**
  - Background: `success-100` (#E6F4EA)
  - Border/Icon: `success-600` (#1E8E3E) -> Contrast 3.5:1 (Pass for UI
    components)
  - Text: `success-900` (#0D3C1B) -> Contrast 14.2:1 (Safe)

## 3. Visual Hierarchy Rules

1. **Primary Action:** Highest contrast pairing (e.g., Black on Vivid Blue).
2. **Secondary Content:** Lower contrast but still safe (e.g., Dark Gray on
   Light Gray).
3. **Muted Info:** Uses the 50-100 scale for backgrounds to recede visually.

## 4. Accessibility Check

- [x] All body text passes 4.5:1.
- [x] All buttons pass 3:1 for large text or 4.5:1 for normal text.
- [x] Status colors use both color and icons for clarity.
- [x] Focus states are highly visible using `primary-500` outline.
