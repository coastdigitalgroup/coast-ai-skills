---
name: bottom-navigation-system
description:
  Design a responsive, mobile-first bottom navigation bar and persistent action dock system
  for mobile websites and web applications, establishing spatial anchors, tab bar anatomy,
  badge indicators, thumb-zone ergonomics, safe area inset handling, active/inactive state contrast,
  and desktop responsive adaptation rules.
---

# Bottom Navigation System

## Purpose

The Bottom Navigation System provides a standardized, mobile-first design framework for bottom navigation bars, tab bars, and persistent action docks on mobile web interfaces and progressive web apps (PWAs). Modern mobile devices with large aspect ratios place top headers out of comfortable one-handed reach ("the thumb zone"). Bottom navigation anchors primary application destinations and critical conversion actions directly within natural reach of the user's thumb.

Designing an effective bottom navigation system requires balancing item density (3 to 5 items), active/inactive state visual hierarchy, touch target sizing, badge indicator placement, viewport safe-area insets (`env(safe-area-inset-bottom)`), floating action button (FAB) integrations, and seamless desktop adaptation rules. This skill bridges mobile UX design and technical execution in strict compliance with WCAG AA accessibility standards.

## Use Cases

- **E-Commerce Mobile Web App:** Providing immediate 1-tap thumb access to Home, Search/Browse, Saved Items, Shopping Cart (with item count badge), and Account.
- **SaaS Mobile Web Applications & PWAs:** Structuring primary navigation for mobile productivity apps (e.g., Today's Tasks, Feeds, Quick Add [+], Messages, Settings).
- **Social & Content Platforms:** Managing high-frequency switching between Home Feed, Explore, Create/Upload, Activity Notifications, and User Profile.
- **On-Demand & Logistics Web Services:** Keeping primary status tabs (Orders, Active Delivery Map, Inbox, Profile) persistent across bottom viewports during active tracking.
- **Field Operations & Inspection Forms:** Anchoring persistent action buttons (Save Draft, Upload Photo, Submit Form) at the bottom of long mobile forms.

## When NOT to Use

- **Desktop-First Enterprise Web Apps:** For widescreen layouts (>1024px) where vertical sidebars or top header bars provide superior spatial efficiency, use `sidebar-navigation-system` or `site-navigation-system`.
- **In-Page Content Switching:** For switching views or filtering content inside a specific page section or card, use `tab-ui-system` or `segmented-control-system`.
- **Contextual Action Sheets & Modals:** For temporary, task-specific overlay panels that pop up over page content, use `accessible-bottom-sheet-implementation` or `overlay-and-dialog-system`.
- **Floating Secondary Action Triggers:** For single floating help buttons, back-to-top buttons, or chat bubbles, use `sticky-and-floating-ui-system`.

## Inputs

1. **Information Architecture (IA) Taxonomy:** List of top-level primary destinations (3–5 items maximum) and their icon/label metadata.
2. **Notification & Badge Requirements:** Specifications for unread indicators (dot badges vs. numeric counter badges).
3. **Primary Action Highlight (Optional):** Indication of whether the middle slot requires an elevated/floating action button (FAB) for primary creation actions.
4. **Design Tokens:** Color palettes, elevation/shadow tokens, fluid typography, icon sets, and spacing variables (from `accessible-color-system`, `elevation-and-depth-system`, and `iconography-system`).
5. **Responsive Desktop Strategy:** Choice of desktop adaptation mode (Hide on desktop, Dock into sidebar, or Convert to header nav).

## Outputs

1. **Bottom Navigation Bar Anatomy Spec:** Detailed layout blueprint defining item widths, icon-to-label vertical stacking, typography tokens, badge placement coordinates, and height calculations including safe area paddings.
2. **Interactive State Token Map:** Color contrast definitions and visual states for Default/Inactive, Active/Selected, Hover, Focus-Visible, and Disabled items.
3. **Thumb-Zone Accessibility Mapping:** Spatial placement rules optimizing highest-frequency tabs toward center-thumb reach zones.
4. **Safe Area & Viewport Inset Guidelines:** CSS implementation rules using `env(safe-area-inset-bottom)` for borderless mobile display notch regions (iOS Home Indicator & Android gesture bars).
5. **Responsive Breakpoint & Desktop Transition Blueprint:** Responsive media queries and layout rules for hiding or transitioning the bottom bar on tablet and desktop screens.

---

## Workflow

### 1. Establish Item Quantity and Spatial Grid
Limit the bottom navigation bar to **3 to 5 top-level items**:
- **3 Items:** Equal width flex distribution (`width: 33.33%`). Best for compact web apps with distinct core views.
- **4 Items:** Equal width flex distribution (`width: 25%`). Ideal balance for e-commerce and SaaS mobile apps.
- **5 Items:** Equal width flex distribution (`width: 20%`). Maximum recommended limit for mobile screen widths (320px–430px).
- **Rule of 5:** Never exceed 5 items. If there are 6+ destinations, group secondary pages under a "More" or "Account" menu tab, or move lower-priority links into a side drawer.

### 2. Define Vertical Anatomy and Height Tokens
Construct a fixed bottom container positioned at the bottom of the viewport:
- **Container Positioning:** Use `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;`.
- **Base Height:** Set a base content height of **56px to 64px** for standard tab bars, plus `padding-bottom: env(safe-area-inset-bottom, 0px)` to prevent touch occlusion by iOS home indicators or Android gesture handles.
- **Item Stacking Layout:**
  - **Icon Size:** Standardize on 24x24px SVG icons (`iconography-system`).
  - **Label Typography:** Use 11px to 12px font size (`font-size: 0.75rem; font-weight: 500; line-height: 1.2`).
  - **Vertical Spacing:** Position icon at top (4px top padding), 2px gap between icon and label, 4px bottom padding.
  - **Touch Target Floor:** Ensure each tab item provides a full-height, full-width touch area (`min-height: 48px`, `min-width: 48px`).

### 3. Establish Active and Inactive State Hierarchy
Enforce strong visual contrast between the active tab and inactive tabs:
- **Inactive State:**
  - Icon Fill/Stroke: Subtle secondary color (e.g., `var(--text-tertiary, #6B7280)`).
  - Label Color: Secondary text color (`var(--text-secondary, #4B5563)`).
  - Font Weight: Regular or Medium (`400` or `500`).
- **Active / Selected State:**
  - Icon Fill/Stroke: Brand primary or high-contrast accent (`var(--brand-primary, #2563EB)`). Use filled icon variant if available.
  - Label Color: Primary text or brand color (`var(--text-primary, #111827)` or `var(--brand-primary)`).
  - Font Weight: Semi-bold (`600`).
  - Active Indicator (Optional): A 3px top border or pill indicator (`background: var(--brand-primary)`), or a subtle background capsule fill (`var(--brand-subtle, #EFF6FF)`).
- **Contrast Requirement:** Ensure inactive text and active text both pass WCAG AA minimum contrast ratio (4.5:1 against the bar's background color).

### 4. Integrate Badges and Notification Indicators
Badges inform users about unread messages, pending actions, or cart item quantities:
- **Badge Positioning:** Position badges relative to the top-right corner of the tab's 24x24px icon container (`position: absolute; top: -2px; right: -6px;`).
- **Dot Badges (Unread Indicator):** 8x8px solid circular dot (`background: var(--badge-danger, #EF4444)`).
- **Numeric Badges (Count Indicator):** Pill badge (`height: 16px; min-width: 16px; padding: 0 4px; border-radius: 999px; font-size: 10px; font-weight: 700; color: #FFFFFF; background: var(--badge-danger);`). Truncate counts over 99 to `99+`.
- **Accessible Text:** Always include screen-reader-only accessible text inside or alongside the badge (`<span class="sr-only">3 unread notifications</span>`).

### 5. Handle Viewport Safe Areas and Surface Styling
Ensure the bottom navigation surface remains readable over scrolling content:
- **Backdrop Blur & Translucency:** Apply a translucent surface background with backdrop filtering (`background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-top: 1px solid var(--border-subtle, #E5E7EB);`). For dark mode, use (`background: rgba(17, 24, 39, 0.85)`).
- **Safe Area Inset Rule:** Use CSS:
  ```css
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background: var(--nav-bg);
    border-top: 1px solid var(--nav-border);
  }
  ```
- **Page Bottom Clearance:** Add bottom padding to the main scrollable body container equal to the bottom bar height + safe area inset (`padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px))`) to prevent content truncation behind the fixed bar.

### 6. Implement Responsive Desktop Adaptation
Bottom navigation bars are optimized for touch screens and look unnatural stretched across wide desktop viewports (>1024px).
- **Breakpoint Strategy:**
  - **Mobile (<768px):** Render fixed bottom navigation bar.
  - **Tablet (768px – 1023px):** Either keep bottom bar centered/constrained (`max-width: 480px; margin: 0 auto; border-radius: 16px 16px 0 0;`) or convert to top header.
  - **Desktop (≥1024px):** Hide bottom navigation bar (`display: none`). Primary destinations transition into the top header (`site-navigation-system`) or a vertical sidebar (`sidebar-navigation-system`).

---

## Decision Rules

### Choice of Bottom Bar Layout Pattern

| Pattern | Item Structure | Ideal Use Case | Key Interaction |
| :--- | :--- | :--- | :--- |
| **Standard Tab Bar** | 3 to 5 equal-width items with icon + text label. | E-commerce, SaaS navigation, content portals. | 1-tap immediate view navigation. |
| **Center FAB Dock** | 4 tabs + 1 elevated central action button (e.g., "+ Create"). | Social posting, task tracking, media creation apps. | Central button opens creation modal/sheet; outer tabs navigate views. |
| **Labeled Icon Bar** | 4–5 items with persistent icons and visible 11px text labels. | Default for most mobile web apps; highest usability & clarity. | Immediate recognition without icon guessing. |
| **Icon-Only Compact Bar** | 4–5 items with icons only (labels appear in aria-label). | Highly familiar consumer apps (e.g., Instagram-like interfaces). | *Use caution:* Only use when icons are universally recognized. |

### Badge Styling Selection
- **Dot Badge (Red/Accent Dot):** Use when user needs to know "there is new activity", but exact quantity is irrelevant (e.g., new blog post available, system update).
- **Numeric Badge (Count):** Use when exact item count directly influences user action (e.g., "3 items in Cart", "5 unread messages").

---

## Constraints

- **Accessibility (WCAG 2.1 / 2.2 AA):**
  - **SC 2.1.1 Keyboard Accessibility:** Bottom navigation tabs must be implemented using standard `<nav>` with semantic `<a>` links or `<button role="tab">` controls navigable via `Tab` key or `Arrow` keys.
  - **SC 2.4.7 Focus Visible:** Focused bottom nav items must display an unclipped focus ring with a minimum 3:1 contrast ratio against the background.
  - **SC 2.5.8 Target Size (Minimum):** Touch targets must measure at least **48x48px** (or 24x24px with surrounding spacing ensuring 48px touch zone).
  - **SC 1.4.3 Visual Contrast:** Inactive tab labels and icons must maintain at least 4.5:1 contrast against the background fill.
- **Scroll Behavior:** Bottom navigation bars must remain reliably pinned (`position: fixed`) during touch momentum scrolling without flicker or vertical jitter.
- **Safe Area Insets:** Must include `env(safe-area-inset-bottom)` to avoid overlapping hardware home indicators on gesture-based mobile viewports.

---

## Common Failure Patterns

- **The Missing Safe Area Gap:** Failing to apply `env(safe-area-inset-bottom)`, causing bottom nav labels to be overlapped by iOS gesture bars or screen cutouts.
- **Excessive Item Density:** Forcing 6 or 7 items into a bottom bar, compressing touch targets under 40px and causing frequent accidental mis-taps.
- **The Stretched Desktop Bar:** Allowing a 4-item bottom bar to span 1920px wide across a desktop monitor with huge empty gaps between icons.
- **Unlabeled Mystery Icons:** Omitting text labels for ambiguous icons (e.g., using a star icon without labeling whether it means "Favorites", "Reviews", or "Rewards").
- **Content Truncation Behind Fixed Nav:** Forgetting to add `padding-bottom` to the page container, causing footer content and primary form submit buttons to be permanently obscured behind the fixed bottom bar.

---

## Validation Criteria

- [ ] Bottom navigation contains between 3 and 5 primary destinations.
- [ ] Each tab provides a touch target area meeting or exceeding 48x48px.
- [ ] Active and inactive states are visually distinct and pass WCAG AA 4.5:1 contrast requirements.
- [ ] CSS includes `padding-bottom: env(safe-area-inset-bottom)` for safe area inset support.
- [ ] Main page content container includes bottom padding so page content is never hidden behind the fixed bar.
- [ ] Badges include accessible screen-reader-only text (e.g., `sr-only`).
- [ ] Navigation is fully reachable via keyboard (`Tab` and `Shift+Tab` or `Arrow` keys with clear `:focus-visible` indicators).
- [ ] On viewports ≥1024px, the bottom bar cleanly hides or transitions into a desktop header or sidebar.
