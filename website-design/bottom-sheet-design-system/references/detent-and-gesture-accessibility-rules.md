# Bottom Sheet Detent, Gesture Physics, and Accessibility Rules

This reference guide establishes technical standards for detent snapping ratios, touch drag velocity thresholds, screen reader ARIA roles, touch target ergonomics, and viewport safe-area padding for bottom sheets.

---

## 1. Detent Height & Snapping Ratio Reference

| Detent Mode | Height Token | CSS Height Value | Gesture Behavior | Typical Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Peek / Collapsed** | `--detent-peek` | `120px` to `160px` | Pins above bottom edge. Swiping up snaps to Half or Full height. | Map POI summaries, transit status, ride ETA tracking. |
| **Partial / Half-Height** | `--detent-half` | `50dvh` (50% Viewport) | Snaps to middle of viewport. Swiping down closes; swiping up expands to Full. | E-commerce variation picking, quick sort options, share menu. |
| **Expanded / Full-Height** | `--detent-full` | `calc(90dvh - 24px)` | Expanded sheet covering 90% viewport. Top 10% exposes dimmed parent context. | Multi-facet catalog filters, mobile checkout forms, full detail view. |

---

## 2. Touch Gesture & Velocity Thresholds

```text
               +----------------------------------+  Top (0px offset)
               |                                  |
               |       BOTTOM SHEET SURFACE       |
               |                                  |
   Drag Down   |  [ Snap Back Zone (0 - 30%) ]     |  If released < 30%: Snap back to 0px
      │        |  ..............................  |
      ▼        |  [ Threshold Zone (30% - 70%) ]  |  If velocity > 0.5px/ms OR distance > 30%:
               |  ..............................  |  Dismiss / Snap to lower detent
               |  [ Auto-Dismiss Zone (> 70%) ]   |
               +----------------------------------+  Bottom (Closed)
```

- **Flick Velocity Threshold:** A downward touch drag with a velocity exceeding `0.5 px/ms` immediately triggers a sheet dismiss animation regardless of current displacement distance.
- **Distance Threshold:** Dragging the sheet downward past **30% of its current height** triggers auto-dismiss when the touch pointer is released (`touchend` / `pointerup`).
- **Spring Physics Variables:**
  - Standard Spring Transition: `transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)`
  - Dismiss Transition: `transform 0.2s ease-in`

---

## 3. ARIA & Screen Reader Accessibility Matrix

| Element / Region | ARIA Attribute | Value | Function |
| :--- | :--- | :--- | :--- |
| **Sheet Container** | `role` | `"dialog"` | Identifies the container as a modal overlay window. |
| | `aria-modal` | `"true"` | Signals screen readers to confine navigation inside the overlay. |
| | `aria-labelledby` | `"sheet-title-id"` | Links sheet container to its visible `<h2>` title element. |
| **Drag Handle** | `aria-hidden` | `"true"` | Hides visual drag handle pill from screen reader tree (use explicit close button instead). |
| **Close Button** | `aria-label` | `"Close sheet"` | Provides accessible name for icon-only close button (`✕`). |
| **Background Page** | `inert` | `inert` attribute | Completely removes background body from tab order and accessibility tree while sheet is open. |

---

## 4. Touch Target & Ergonomics Specifications

1. **Minimum Touch Target Floor:** All interactive controls inside the sheet (buttons, input radios, checkboxes, close triggers) must satisfy **WCAG 2.5.8 Target Size (Minimum)** of at least **24x24px** with surrounding space, or **44x44px** total tap area.
2. **Drag Handle Hit Box:** Even if the visible visual handle is `36px x 5px`, the interactive touch zone surrounding the handle must extend to at least **60px wide by 32px high** to allow easy touch grabbing without precise tap requirements.
3. **Close Button Clearance:** The top-right close button (`✕`) must have a minimum `44x44px` touch hit area positioned at least `12px` from screen edges.

---

## 5. Viewport Safe Area & Dynamic Unit Mechanics

Mobile viewports feature hardware home indicators (iOS gesture bar) and dynamic browser address bar state changes.

### Safe Area Padding CSS Rule
```css
.sheet-footer {
  /* Fallback 16px bottom padding + safe area inset */
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
```

### Dynamic Viewport Height (`dvh`) Unit Rule
Use `dvh` (Dynamic Viewport Height) so the sheet height adapts automatically when mobile address bars collapse or expand during scroll gestures:

```css
.bottom-sheet {
  /* Fallback for older browsers */
  max-height: calc(90vh - 24px);
  /* Modern dynamic viewport height */
  max-height: calc(90dvh - 24px);
}
```
