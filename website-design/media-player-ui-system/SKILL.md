---
name: media-player-ui-system
description:
  Design a systematic, highly accessible, and responsive visual UI framework for
  custom audio and video media players, establishing spatial composition,
  control bar hierarchy, scrubbing timeline controls, picture-in-picture/sticky
  dock transitions, and keyboard/screen-reader accessibility.
---

# Media Player UI System

## Purpose

The Media Player UI System provides a standardized, high-performance, and accessible visual design framework for custom video and audio player interfaces. Standard browser native media elements (`<video>` and `<audio>` controls) suffer from inconsistent cross-browser visual presentation, uncustomizable control layouts, poor dark/light theme integration, and varying keyboard accessibility patterns.

Designing a modern media player UI requires balancing spatial hierarchy, scrubbable timeline controls, overlay visual contrast (scrims), secondary control grouping (playback speed, quality switcher, captions, picture-in-picture), floating persistent mini-players (sticky audio docks / PIP windows), and keyboard/screen-reader accessibility in compliance with WCAG AA standards.

## Use Cases

- **Video Streaming Platforms & Course Portals:** Designing custom video players for online education, webinars, video-on-demand (VOD), and video marketing showcases.
- **Podcast & Music Web Applications:** Structuring persistent bottom sticky audio player bars, inline episode player cards, and interactive playlist queues.
- **Digital Asset Management & Portfolio Showcases:** Designing interactive video/audio preview modals, media asset review drawers, and hero demo video players.
- **News & Editorial Content Hubs:** Integrating embedded article video players with automatic scroll-triggered sticky mini-player docking.

## When NOT to Use

- **Technical Media Element Implementation:** For technical video encoding, HLS/DASH streaming logic, media source extensions (MSE), dynamic buffering, or browser event binding, use `native-video-implementation` or `accessible-audio-player-implementation` in `website-development`.
- **Conversion-Focused Hero Video Sections:** For high-converting video hero copy, autoplay landing page rules, and video testimonial trust framing, use `video-conversion-optimization` in `website-growth`.
- **General Image & Lightbox Galleries:** For static image modal popups or photo sliders without audio/video playback controls, use `image-gallery-and-lightbox-system` or `carousel-and-slider-system`.
- **Background Decorative Video Loops:** For non-semantic, non-interactive background video loops that lack user controls, use `imagery-and-media-system`.

## Inputs

1. **Media Asset Type & Context:** Determine whether the interface is a video player (embedded, full-screen, or modal) or an audio player (persistent sticky bar, inline card, or hero player).
2. **Control Density Requirements:** List required player controls (e.g., Play/Pause, Timeline Scrub Bar, Timestamp Counter, Volume/Mute Slider, Captions/Subtitles Toggle, Playback Speed Selector, Quality Switcher, Picture-in-Picture, Fullscreen).
3. **Application Shell & Viewport Context:** Layout bounds provided by the parent web application shell (from `dashboard-layout-system` or `article-layout-system`).
4. **Design Tokens:** Surface tokens, contrast overlays, focus ring tokens, and typography scales (from `accessible-color-system`, `focus-indicator-design-system`, and `fluid-typography-system`).

## Outputs

1. **Media Canvas & Overlay Control Anatomy:** Spatial definitions for video containers, aspect ratio wrappers, semi-transparent gradient scrim overlays, centered play/pause triggers, and bottom control bar containers.
2. **Scrubbing Timeline Control Specification:** Visual layout for progress track bars, buffer indicators, hover thumbnail preview cards, time tooltip markers, and touch-friendly drag handles.
3. **Control Bar Button Hierarchy:** Grouping, spacing, touch target bounds (minimum 24x24px, 44x44px target box), and high-contrast iconography for primary and secondary controls.
4. **Floating Mini-Player & Dock Layout:** Spatial rules and scroll-triggered transition specs for sticky audio bottom bars and floating video picture-in-picture (PIP) viewports.
5. **Accessible ARIA & Focus Navigation Model:** Keyboard navigation paths, hotkey mappings (Space/K, Left/Right Arrow, Up/Down Arrow, F, M, C), screen reader `aria-live` announcements for scrubbed timestamps, and high-contrast focus rings.

---

## Workflow

### 1. Establish the Media Container & Aspect Ratio Framework
Structure the outer video or audio player wrapper to preserve spatial layout stability:
- **Aspect Ratio Box:** Enforce fixed media proportions using CSS `aspect-ratio: 16 / 9;` (or `4 / 3`, `9 / 16` for vertical short-form video) to prevent Cumulative Layout Shift (CLS) while assets load.
- **Player Surface Styling:** Container should feature `position: relative; overflow: hidden; background: #000000; border-radius: var(--radius-lg, 8px);`.
- **Overlay Scrim Layer:** Apply a directional gradient scrim behind video controls (`background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%); position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none;`) to ensure text and icon contrast against light or dynamic video content.

### 2. Design the Primary Control Bar Hierarchy
Group player controls logically into primary (left), timeline (center/top), and secondary (right) control zones:
- **Control Bar Container:** Position at the bottom of the player container (`position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; z-index: 10; opacity: 1; transition: opacity 0.25s ease;`).
- **Primary Control Group (Left):**
  1. **Play/Pause Toggle:** High-visibility 36x36px button (44x44px target) with crisp icon swap (`play` vs `pause`).
  2. **Skip Backward/Forward (Optional):** 10-second skip buttons (`replay-10`, `forward-10`) for audio/educational content.
  3. **Volume Control:** Speaker icon button coupled with a horizontal volume slider (`width: 60px` to `80px`) that expands on hover/focus.
  4. **Time Display:** High-contrast monospaced font (`font-family: var(--font-mono); font-size: 0.8125rem; color: #FFFFFF;`) displaying current time and total duration (e.g., `04:15 / 12:30`).
- **Secondary Control Group (Right):**
  1. **Captions Toggle (CC):** Toggle button with active state indicator (accent underline or badge when subtitles are active).
  2. **Playback Speed Menu:** Dropdown button displaying active speed (e.g., `1.0x`, `1.5x`, `2.0x`).
  3. **Picture-in-Picture (PIP):** Icon button triggering browser PiP window or floating dock.
  4. **Fullscreen Toggle:** Expand/compress icon button toggling full-viewport mode.

### 3. Construct the Scrubbing Timeline Controller
The timeline scrub bar is the central interactive element of any player:
- **Track Anatomy:**
  - *Background Track:* Subtle semi-transparent rail (`height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; position: relative; cursor: pointer; transition: height 0.15s ease;`). Hover expands height to `8px`.
  - *Buffered Range Track:* Semi-transparent accent bar (`background: rgba(255, 255, 255, 0.5); position: absolute; left: 0; top: 0; bottom: 0;`).
  - *Played Progress Bar:* Brand accent bar (`background: var(--brand-primary, #3B82F6); position: absolute; left: 0; top: 0; bottom: 0;`).
  - *Scrubber Handle (Thumb):* 14x14px circle (`background: #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transform: scale(0); transition: transform 0.15s ease;`). Hover/focus expands handle to `transform: scale(1)`.
- **Hover Preview Tooltip & Frame Thumbnail:** Display a floating popover above the cursor location on the track showing the hovered time marker (`e.g., 03:42`) and optional video thumbnail frame preview.

### 4. Structure Audio Player UI Variants
Audio players require tailored spatial compositions depending on placement:
- **Persistent Bottom Sticky Dock:**
  - Standard height `64px` to `72px`, fixed at bottom viewport (`position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; background: var(--surface-elevation-3); border-top: 1px solid var(--border-subtle);`).
  - Layout: Left = Album art thumbnail + Track Title & Artist Info; Center = Play/Pause, Skip, Timeline Bar; Right = Volume, Playlist Drawer Toggle, Speed.
- **Inline Episode Card Player:**
  - Compact or expanded card container embedded directly in body copy. Features integrated waveform or track visualization, play trigger, speed selector, and download/share actions.

### 5. Implement Accessible Keyboard & Screen Reader Mechanics
- **Keyboard Navigation & Focus Management:**
  - Make all custom control buttons keyboard focusable (`tabindex="0"` or native `<button>`).
  - Implement standard video player hotkeys:
    - `Space` / `K`: Toggle Play / Pause.
    - `Left Arrow` / `Right Arrow`: Seek backward / forward 5 seconds.
    - `J` / `L`: Seek backward / forward 10 seconds.
    - `Up Arrow` / `Down Arrow`: Increase / decrease volume by 10%.
    - `M`: Toggle Mute.
    - `F`: Toggle Fullscreen mode.
    - `C`: Toggle Closed Captions.
- **ARIA Roles & Live Region Announcements:**
  - Timeline slider must use `role="slider"` with `aria-label="Seek timeline"`, `aria-valuemin="0"`, `aria-valuemax="[duration_seconds]"`, `aria-valuenow="[current_seconds]"`, and `aria-valuetext="04 minutes 15 seconds of 12 minutes 30 seconds"`.
  - Volume slider must use `role="slider"` with `aria-label="Volume"`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow="80"`.
  - Status changes (e.g., Play, Pause, Muted, Speed changed to 1.5x) must be announced via an `aria-live="polite"` region.

### 6. Mobile Viewport & Touch Adaptation
- **Touch-Friendly Controls:** Increase control bar height to `56px` on mobile screens (<768px), ensuring tap targets are at least `44x44px`.
- **Auto-Hiding Controls:** Hide control bar during video playback after 3 seconds of touch inactivity. Tapping anywhere on the video container reveals controls.
- **Gesture Support:** Double-tap left or right side of video container to skip 10s backward/forward. Swipe vertically on right side for volume, left side for brightness.

---

## Decision Rules

### Player UI Pattern Selection

| Media Type & Use Case | Recommended UI Pattern | Control Layout Strategy |
| :--- | :--- | :--- |
| **Hero Product Video / Demo** | **Embedded Aspect-Ratio Container (16:9)** | Centered large play button on poster frame; minimal control bar on hover. |
| **Educational Video / VOD** | **Sidebar + Canvas Split Player** | Full control bar with playback speed, captions, chapter markers, and transcript sync. |
| **Podcast / Music Web App** | **Persistent Viewport Sticky Bottom Bar** | Fixed 72px dock; track meta on left, primary scrubber center, volume/queue right. |
| **Editorial Article Media** | **Scroll-Triggered Auto-Docking Mini Player** | Inline player transitions into floating Picture-in-Picture window when scrolled offscreen. |

### Control Overlay Visibility Rule
- **Paused State:** Keep control bar and centered play trigger **100% visible** with a 40% dark scrim overlay.
- **Playing State:** Fade control bar out (`opacity: 0; pointer-events: none`) after 2.5 seconds of mouse/touch inactivity. Re-reveal immediately upon pointer movement, key press, or tap.
- **Focused State:** If any control button or timeline slider holds keyboard focus (`:focus-visible`), **never hide the control bar**.

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 1.4.3 Visual Contrast:** Text timestamps and control icons must maintain at least 4.5:1 contrast against background scrim overlays.
  - **SC 2.1.1 Keyboard:** Every player action (scrub, mute, captions, speed, fullscreen) must be operable via keyboard shortcuts without trapped focus.
  - **SC 2.4.7 Focus Visible:** Focused controls must render a distinct 2px focus ring with minimum 3:1 contrast against the control bar background.
  - **SC 2.5.5 Target Size:** Touch targets must be at least 44x44px on mobile viewports.
- **Layout Containment & CLS:** Player containers must enforce aspect ratio constraints (`aspect-ratio: 16 / 9`) or explicit height reservations to prevent cumulative layout shift.
- **State Synchronicity:** Visual progress bar width, timeline timestamp counters, and `aria-valuenow` properties must update synchronously during seeking and playback.

---

## Common Failure Patterns

- **The Low-Contrast Overlay:** White control icons placed directly over bright video frames without a background gradient scrim, making controls unreadable.
- **Tiny Touch Targets:** Formatting timeline scrubbers or volume sliders as 2px thin lines without an expanded touch target padding, making scrubbing impossible on mobile touchscreens.
- **Keyboard Focus Locking:** Hiding control bars automatically when a keyboard user is tabbing through controls, causing focus to become invisible.
- **Missing Audio Transcript / Subtitle Toggle:** Omitting Closed Caption (CC) buttons or caption styling rules, creating an accessibility barrier for deaf or hard-of-hearing users.
- **Unannounced Scrubbing State:** Updating the timeline visually without setting `aria-valuenow` or `aria-valuetext`, leaving screen-reader users unable to determine playback position.

---

## Validation Criteria

- [ ] Video player container maintains stable 16:9 aspect ratio preventing layout shift.
- [ ] Semi-transparent gradient scrim guarantees 4.5:1 contrast for all control icons and time text.
- [ ] Timeline scrub bar features hover preview tooltip, buffer track, played progress bar, and draggable thumb handle.
- [ ] Full keyboard navigation is supported, including standard hotkeys (`Space`/`K`, `Left`/`Right Arrow`, `M`, `F`, `C`).
- [ ] Control buttons and timeline scrubbers feature unclipped focus indicators when focused via keyboard.
- [ ] ARIA roles (`role="slider"`, `aria-valuenow`, `aria-valuetext`) are properly bound to timeline and volume controls.
- [ ] Sticky bottom audio bar and floating Picture-in-Picture mini-player layouts adapt seamlessly across mobile and desktop viewports.
