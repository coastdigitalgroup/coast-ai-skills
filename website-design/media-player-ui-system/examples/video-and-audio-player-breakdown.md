# Video and Audio Player Layout Breakdown

This document provides realistic visual spatial breakdowns, control hierarchy maps, and responsive layout specifications for custom media player UIs in modern web applications.

---

## Example 1: Custom Video Player with Overlay Scrim & Captions Drawer

### Layout Diagram (Desktop Viewport - 16:9 Canvas)

```text
+---------------------------------------------------------------------------------+
| [Video Container Surface - Aspect Ratio 16:9 - Background #000000]             |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  | [Top Control Bar / Title Header - Overlay]                               |  |
|  |  [<- Back]  Building Scalable Web Apps - Chapter 4           [Share] [X] |  |
|  +---------------------------------------------------------------------------+  |
|                                                                                 |
|                                  [ PLAY TRIGGER ]                               |
|                                    ( 64x64px )                                  |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  | [Gradient Scrim Overlay: linear-gradient(to top, rgba(0,0,0,0.85)...)]     |  |
|  |                                                                           |  |
|  |  -- Hover Preview Tooltip: "04:15 / 12:30 - Chapter 2: State Setup" --    |  |
|  |  +=====================================================================+  |  |
|  |  | [Progress Track Rail]==================o----------------------------|  |  |
|  |  +=====================================================================+  |  |
|  |                                                                           |  |
|  |  ( > ) [ || ]  (10s) (10s>)  [ 04:15 / 12:30 ]       [CC] [1.5x] [PIP] [ [ ]|  |
|  |  Play   Pause   -10s  +10s   Timestamp counter       Sub  Speed Mini Full |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

### Spatial & Control Zone Specifications

1. **Top Header Bar (Overlay):**
   - **Position:** `position: absolute; top: 0; left: 0; right: 0; padding: 16px 20px; z-index: 10; display: flex; align-items: center; justify-content: space-between;`.
   - **Title Text:** `font-weight: 600; font-size: 1rem; color: #FFFFFF; text-shadow: 0 1px 3px rgba(0,0,0,0.8);`.
   - **Actions:** Quick exit modal button, share drawer trigger, video title.

2. **Center Action Area:**
   - **Centered Play Button:** `width: 64px; height: 64px; border-radius: 50%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.2); transition: transform 0.2s ease;`.
   - **Interaction:** Pulsing hover ring, instant hide on play.

3. **Bottom Control Dock:**
   - **Gradient Scrim:** `height: 96px; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);`.
   - **Timeline Rail (Top Layer of Control Dock):**
     - Track Height: `4px` default, expands to `8px` on hover.
     - Buffer Indicator: `background: rgba(255, 255, 255, 0.4);`.
     - Progress Indicator: `background: var(--brand-primary, #3B82F6);`.
     - Draggable Thumb Handle: `14x14px` white circle with `box-shadow: 0 0 6px rgba(0,0,0,0.4);`.
   - **Button Row (Bottom Layer of Control Dock):**
     - Left Cluster: Play/Pause (`36x36px`), Skip -10s (`32x32px`), Skip +10s (`32x32px`), Volume Icon + Slider (`width: 72px`), Time Counter (`monospaced, 13px`).
     - Right Cluster: Captions Toggle (`[CC]`), Speed Selector (`[1.0x]`), Picture-in-Picture (`[PIP]`), Fullscreen (`[ ]`).

---

## Example 2: Persistent Bottom Audio Player Dock (Podcast / Streaming App)

### Layout Diagram (Desktop Viewport - Viewport Fixed Dock)

```text
+-------------------------------------------------------------------------------------------------------+
| [Persistent Bottom Audio Dock - Position: Fixed Bottom - Height: 72px - Surface Elevation 3]           |
|                                                                                                       |
|  +--------------------+  +-------------------------------------------+  +--------------------------+  |
|  | [Track Metadata]   |  | [Playback Controls & Timeline Center]     |  | [Secondary Controls]     |  |
|  |                    |  |                                           |  |                          |  |
|  |  +----+ Episode 42 |  |       ( |<< )  ( > )  ( >>| )  [ (1.5x) ]  |  | (Vol) [====o---]  [ Queue] |  |
|  |  |IMG | Tech Today |  |       Prev    Play    Next     Speed      |  | Volume Rail       Playlist  |  |
|  |  +----+ Sarah Chen |  |                                           |  |                          |  |
|  |                    |  |   04:15 +===========================+ 45:00|  | [Lyrics] [Device Switch] |  |
|  +--------------------+  +-------------------------------------------+  +--------------------------+  |
+-------------------------------------------------------------------------------------------------------+
```

### Spatial Grid Breakdown

- **Dock Container:** `position: fixed; bottom: 0; left: 0; right: 0; height: 72px; display: grid; grid-template-columns: 280px 1fr 280px; align-items: center; padding: 0 24px; background: var(--surface-elevation-3); border-top: 1px solid var(--border-subtle); z-index: 1000;`.
- **Left Column (Track Meta):** 48x48px album artwork, truncated title (`font-weight: 600`), artist/host name (`color: var(--text-secondary)`), bookmark icon button.
- **Center Column (Playback & Timeline Scrub):**
  - Top Sub-row: Center-aligned control buttons (Previous, Play/Pause 40x40px trigger, Next, Speed menu button).
  - Bottom Sub-row: Full-width progress track flanked by start time (`04:15`) and total duration (`45:00`).
- **Right Column (Volume & Utility):** Mute toggle button, horizontal volume track slider (`width: 90px`), queue drawer toggle button, device selector icon.

---

## Example 3: Mobile Viewport Adaptation (<768px)

### Layout Adaptations for Touch Viewports

1. **Embedded Video Player (Mobile Viewport):**
   - Control Bar height expands to `56px` to ensure all touch targets satisfy `44x44px` minimum bounds.
   - Secondary controls (Speed, Quality, Captions) collapse into a single gear menu (`[ Settings ]`) opening an accessible bottom sheet drawer (`accessible-bottom-sheet-implementation`).
   - Scrub bar track height increases to `6px` with a persistent `16x16px` thumb handle for reliable touch manipulation.

2. **Persistent Audio Bar (Mobile Viewport):**
   - Bottom dock height shrinks to `60px`.
   - Grid layout switches to 2 columns: Left = Track Title + Play/Pause button; Right = Mini progress bar overlaid on bottom edge.
   - Tapping anywhere on the mini dock expands full-screen mobile audio card view showing album artwork, detailed waveform scrubber, and full queue list.
