---
name: media-player-ui-system
description:
  Design a systematic, highly accessible, and responsive visual UI framework for
  custom audio and video media players, establishing spatial composition, control bar
  hierarchy, scrubbing timeline controls, picture-in-picture/sticky dock transitions,
  and keyboard/screen-reader accessibility.
---

# Media Player UI System

## Purpose

The Media Player UI System provides a standardized, accessible, and responsive visual design framework for embedding custom video and audio player interfaces. Standard browser-native HTML `<video>` and `<audio>` controls present severe limitations: inconsistent cross-browser visual styling, unbranded appearance, poor touch target spacing, unoptimized control density on mobile viewports, and unpredictable keyboard focus accessibility.

Designing an effective custom media player requires balancing video canvas framing, overlaid gradient protections, control bar spatial hierarchy (play/pause triggers, scrubbing timelines, volume sliders, playback speed, quality, captions, Picture-in-Picture, fullscreen), responsive dock transitions, and full WCAG AA accessibility compliance. This skill bridges design and technical implementation, defining layout rules, interaction states, touch ergonomics, and screen-reader keyboard controls for web video and audio experiences.

## Use Cases

- **Online Video Learning & Course Platforms:** Structuring custom video players with playback speed selectors, chapter markers, closed-caption toggles, keyboard shortcuts, and transcript sync.
- **SaaS Marketing Product Demos & Hero Videos:** Designing lightweight, branded inline video players with floating overlay triggers, loop/mute controls, and sticky picture-in-picture docking on scroll.
- **Podcast & Audio Streaming Platforms:** Building persistent bottom audio player docks, inline audio card players, waveform visualizers, and skip-forward/backward jump controls.
- **Media Portals & Editorial News Sites:** Presenting responsive hero video players with quality pickers, picture-in-picture options, related video overlays, and accessible captions.
- **Design System Component Libraries:** Establishing standardized, themeable media player visual blueprints and accessibility patterns for enterprise design systems.

## When NOT to Use

- **Raw Unstyled Browser Controls:** For quick internal tools or simple prototypes where standard native browser controls (`controls` attribute) suffice, standard HTML markup is sufficient.
- **Full Video Editing or Canvas Timeline Workstations:** For multi-track non-linear web video editors requiring timeline scrubbing tracks, keyframe manipulation, and webGL canvas rendering, use specialized video editing applications.
- **Pure Background Decorator Animations:** For ambient CSS or canvas animations without audio, scrub controls, or user playback controls, use `interface-motion-system` or standard muted background loops.
- **Static Image Lightboxes & Galleries:** For displaying still photographs or slide decks without time-based media playback, use `image-gallery-and-lightbox-system`.

## Inputs

1. **Media Type & Aspect Ratio:** Audio vs. video format, native aspect ratios (16:9 widescreen, 9:16 vertical video, 1:1 square, or flexible audio height).
2. **Control Density Requirements:** Required media controls (e.g., Play/Pause, Timeline Scrubber, Current Time/Duration, Volume, Playback Speed, CC/Captions, Quality Selector, PiP, Fullscreen, Jump 10s).
3. **Theme & Branding Tokens:** Color tokens for control bar background overlays, primary brand play highlights, scrubber progress bars, focus rings, and typography (from `accessible-color-system`, `focus-indicator-design-system`, and `fluid-typography-system`).
4. **Layout Shell Context:** Placement environment (embedded inline card, full-width section hero, bottom persistent sticky dock, modal overlay dialog).

## Outputs

1. **Spatial Layout & Aspect Ratio Container:** CSS architecture establishing responsive framing, aspect ratio preservation, and overlay stacking contexts.
2. **Control Bar Hierarchy Blueprint:** Visual spatial layout for media control toolbars (left playback controls, central timeline scrubber, right secondary controls/fullscreen).
3. **Scrubber Timeline & Volume Slider Specification:** Accessible range controls with hover time preview tooltips, loaded buffer indicators, and visual progress fills.
4. **Sticky Picture-in-Picture Dock Transition:** Responsive rules for collapsing video players into floating bottom-corner mini-players when users scroll past the primary viewport container.
5. **Accessible ARIA & Keyboard Navigation Mapping:** Complete keyboard shortcut spec (`Space`, `K`, `J`, `L`, `M`, `F`, `C`, Arrow keys), ARIA live region status announcers, and WCAG AA contrast compliance.

---

## Workflow

### 1. Establish the Spatial Container and Aspect Ratio Frame
Structure the base container to prevent layout shifts (CLS) while media loads:
- **Aspect Ratio Box:** Wrap video elements in a container using CSS aspect ratio (`aspect-ratio: 16 / 9; width: 100%; position: relative; background: #000; border-radius: 8px; overflow: hidden;`).
- **Media Layer Stacking:**
  - `z-index: 1`: Native `<video>` or `<canvas>` media element filling container (`width: 100%; height: 100%; object-fit: contain;`).
  - `z-index: 2`: Dark gradient overlay protecting control bar legibility (`background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%); pointer-events: none;`).
  - `z-index: 3`: Center play/pause big button overlay or loading skeleton state.
  - `z-index: 4`: Bottom (and optional top) control bar toolbar container.

### 2. Design Center Big Play Trigger and Loading States
Provide prominent visual affordances for initial playback engagement:
- **Big Play Button Overlay:** Position a prominent 64x64px (desktop) or 56x56px (mobile) circular button in the exact visual center (`top: 50%; left: 50%; transform: translate(-50%, -50%);`).
  - *Style:* `background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; color: #FFFFFF;`.
  - *Hover/Focus:* `scale(1.1); background: var(--brand-primary); border-color: transparent;`.
  - *Behavior:* Fades out (`opacity: 0; pointer-events: none; transition: opacity 0.25s ease;`) once playback starts, reappearing when paused.
- **Buffering / Loading Spinner:** Display a high-contrast circular indeterminate spinner overlay centered over the video canvas when media buffer falls below playback threshold.

### 3. Build the Bottom Control Bar Hierarchy
Organize controls into a clean 3-part flex layout anchored at the bottom of the media frame:
- **Container Positioning:** `position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; z-index: 4;`.
- **Primary Scrubber Row (Row 1):** Place the interactive timeline scrubber full-width across the top of the control bar or inline in horizontal layouts.
- **Control Bar Action Row (Row 2):**
  - **Left Group (Playback & Volume):**
    1. *Play / Pause Button:* 40x40px icon button (`aria-label="Play"` / `aria-label="Pause"`).
    2. *Skip Backward / Forward (Optional):* 36x36px buttons for "Jump back 10s" / "Jump forward 10s".
    3. *Volume Group:* Mute toggle icon button + hover/focus expandable range slider (`width: 0 -> 80px` smooth transition) or persistent slider.
    4. *Time Display:* Text counter `02:14 / 10:45` using monospace numbers (`font-variant-numeric: tabular-nums; font-size: 0.8125rem; color: #FFFFFF;`).
  - **Right Group (Settings & Screen Modes):**
    1. *Closed Captions (CC) Toggle:* Icon button with visual active badge highlight when active (`border-bottom: 2px solid var(--brand-primary)`).
    2. *Playback Speed Menu Trigger:* Dropdown or popover button displaying active rate (e.g., `1.0x`, `1.5x`, `2.0x`).
    3. *Picture-in-Picture (PiP) Trigger:* Icon button to launch browser PiP mode.
    4. *Fullscreen Toggle:* Icon button to toggle full-window/fullscreen display (`aria-label="Enter fullscreen"` / `aria-label="Exit fullscreen"`).

### 4. Construct Accessible Timeline Scrubber & Volume Slider
Timeline scrubbers must be fully touch-friendly, precise, and keyboard-accessible:
- **Range Input Architecture:** Use `<input type="range" min="0" max="100" step="0.1">` or a custom ARIA slider (`role="slider"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow="23"`, `aria-valuetext="2 minutes 14 seconds of 10 minutes 45 seconds"`).
- **Track Layering:**
  1. *Background Track:* Base gray track (`height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px;`). Expand track to `8px` height on hover/focus.
  2. *Buffer Bar:* Secondary bar showing pre-loaded buffer video (`background: rgba(255,255,255,0.5);`).
  3. *Played Fill Bar:* Vibrant primary color bar showing played progress (`background: var(--brand-primary, #3B82F6);`).
  4. *Scrubber Thumb:* 14x14px circular thumb handle (`background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.4);`). Expand to `18x18px` on hover/drag.
- **Hover Time Preview Tooltip:** Display a floating timestamp box (`background: #000; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;`) positioned above cursor hover location along the scrubber track.

### 5. Implement Picture-in-Picture (PiP) and Scroll-Driven Sticky Docking
Prevent loss of video context when users scroll down long article or product pages:
- **Scroll Observer (IntersectionObserver):** Track when primary media container scrolls out of the active viewport threshold (<20% visible).
- **Floating Mini-Player State:**
  - Transition player into a floating fixed corner dock (`position: fixed; bottom: 24px; right: 24px; width: 320px; aspect-ratio: 16/9; z-index: 1000; box-shadow: var(--shadow-xl); border-radius: 12px; border: 1px solid var(--border-subtle); animation: slideInUp 0.3s ease;`).
  - Add a top-right close / expand button on mini-player (`aria-label="Dismiss sticky player"` / `aria-label="Return to video position"`).
  - Simplify control bar in sticky mode to primary Play/Pause, Close, and Mute triggers.

### 6. Implement Keyboard Shortcuts and ARIA Accessibility
Ensure full keyboard control without requiring mouse or pointer interactions:
- **Global / Focused Keyboard Shortcuts:**
  - `Space` or `K`: Toggle Play / Pause.
  - `J`: Rewind 10 seconds.
  - `L`: Fast-forward 10 seconds.
  - `Left Arrow` / `Right Arrow`: Rewind / Fast-forward 5 seconds.
  - `Up Arrow` / `Down Arrow`: Increase / Decrease volume by 10%.
  - `M`: Toggle Mute / Unmute.
  - `F`: Toggle Fullscreen mode.
  - `C`: Toggle Closed Captions on / off.
  - `0` through `9`: Seek to 0% - 90% of total video duration.
- **Screen Reader Status Announcements:**
  - Send status updates to an invisible `aria-live="polite"` region (e.g., *"Paused at 2 minutes 14 seconds"*, *"Volume set to 80%"*, *"Captions enabled"*).

---

## Decision Rules

### Media Control Bar Layout Configurations

| Media Type & Placement | Control Bar Spatial Pattern | Recommended Key Controls |
| :--- | :--- | :--- |
| **Hero Video / Course Video (>640px)** | **Full Floating Overlay Bar** | Full controls: Big Center Play, Full Scrubber, Time, Volume, CC, Speed, PiP, Fullscreen. |
| **Compact Inline Video Card (<480px)** | **Condensed Floating Bar** | Essential controls: Play/Pause, Inline Scrubber, Time, Mute toggle, Fullscreen. |
| **Persistent Bottom Audio Dock (Global)** | **Sticky 3-Column Bar** | Left: Track Info (Thumbnail + Title); Center: Play/Pause + Jump 10s + Scrubber; Right: Volume + Playlist. |
| **Inline Audio Podcast Card** | **Horizontal Embedded Box** | Play/Pause circular button, Track title + progress scrubber, Current time / total duration, Speed menu. |

### Video Overlay Auto-Hide Strategy
- **When Playing:** Auto-hide overlay control bar after **2.5 seconds** of pointer inactivity inside the video canvas (`opacity: 0; cursor: none; transition: opacity 0.3s ease;`).
- **When Paused or Focused:** Keep control bar **permanently visible** (`opacity: 1`) so controls remain immediately reachable.
- **On Keyboard Focus:** Whenever keyboard focus enters any control button inside the player, keep controls visible immediately (`:focus-within { opacity: 1; }`).

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 1.2.2 Captions (Prerecorded):** Closed caption button must be provided for synchronized video media with audio speech.
  - **SC 1.4.3 Contrast (Minimum):** Control icons, text counters, and scrubber progress tracks must maintain at least **4.5:1** contrast against control overlay backgrounds.
  - **SC 2.1.1 Keyboard:** Every player function (play, pause, seek, volume, CC, speed, fullscreen) must be completely accessible via keyboard navigation.
  - **SC 2.4.7 Focus Visible:** Focused player control buttons must display an unclipped high-contrast focus indicator (`outline: 2px solid #FFFFFF; outline-offset: 2px;`).
  - **SC 2.5.8 Target Size:** Interactive control buttons and slider thumbs must provide a minimum tap target of **24x24px** (minimum **44x44px** for mobile/touch viewports).
- **Layout Shift Prevention:** Aspect ratio wrapper must be declared with CSS `aspect-ratio` or padding-top hacks to prevent page layout recalculations during video loading.
- **Touch Gesture Ergonomics:** Double-tap on left/right video canvas zones on mobile touch devices should trigger 10-second skip backward/forward with visible ripple feedback.

---

## Common Failure Patterns

- **Inaccessible Native Custom Wrappers:** Hiding native browser controls while failing to provide keyboard shortcuts or ARIA attributes on custom HTML `<div>` buttons, blocking keyboard and screen-reader users completely.
- **Flickering Overlay Controls:** Hiding control bars immediately without a delay or transition while the mouse is actively moving near the scrubber slider.
- **Unconstrained Fullscreen Scaling:** Failing to maintain proper aspect ratio in fullscreen mode, resulting in stretched or distorted video proportions.
- **Low-Contrast Controls over Light Video Frames:** Rendering plain white control icons without an underlying dark gradient overlay (`rgba(0,0,0,0.7)`), making controls invisible over white video backgrounds.
- **Unannounced State Changes:** Toggling play/pause or mute via custom buttons without updating `aria-label`, `aria-pressed`, or `aria-live` announcer regions.

---

## Validation Criteria

- [ ] Video container enforces aspect ratio (`aspect-ratio: 16/9`) without Cumulative Layout Shift during load.
- [ ] Control bar uses gradient protection layer ensuring ≥4.5:1 text/icon contrast across light and dark video scenes.
- [ ] Timeline scrubber is accessible via mouse pointer dragging, touch gestures, and keyboard arrow keys.
- [ ] Center big play button and bottom control buttons satisfy minimum tap targets (24x24px desktop, 44x44px touch/mobile).
- [ ] Keyboard shortcuts (`Space`, `K`, `J`, `L`, `M`, `F`, `C`, Arrow keys) control video playback reliably.
- [ ] State updates (Play/Pause, Mute, Seek) trigger clear announcements in an `aria-live="polite"` region.
- [ ] Sticky Picture-in-Picture mini-player mode activates cleanly when scrolling past primary video frame on long pages.
