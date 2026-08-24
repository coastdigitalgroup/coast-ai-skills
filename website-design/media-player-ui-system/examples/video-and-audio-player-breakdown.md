# Video and Audio Media Player UI Breakdown

This example breaks down two realistic applications of the **Media Player UI System**:
1. **Interactive SaaS Video Lesson Player** with chapter markers, custom overlay controls, speed selector, and closed captions.
2. **Persistent Audio Podcast Player Bar** with waveform visualizer, jump controls, track details, and expandable queue drawer.

---

## Scenario 1: Interactive SaaS Video Lesson Player

### Visual Composition & Layering Diagram

```text
+---------------------------------------------------------------------------------+
| VIDEO CONTAINER (aspect-ratio: 16/9; max-width: 1120px; background: #000000)   |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  | VIDEO CANVAS LAYER (z-index: 1)                                           |  |
|  | <video src="..." poster="lesson-thumbnail.jpg">                           |  |
|  |                                                                           |  |
|  |               +-------------------------------------------+               |  |
|  |               | CENTER BIG PLAY BUTTON (z-index: 3)       |               |  |
|  |               |  ( O ) 64x64px Circle with Play Icon      |               |  |
|  |               +-------------------------------------------+               |  |
|  |                                                                           |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |  | OVERLAY GRADIENT PROTECTION LAYER (z-index: 2)                     |  |  |
|  |  | linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)    |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |                                                                           |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |  | BOTTOM FLOATING CONTROL DOCK (z-index: 4; height: 56px)              |  |  |
|  |  |                                                                     |  |  |
|  |  |  [====Played 04:12====][o]-------------[Buffer 08:30]------------|  |  |
|  |  |  (Scrubber Track with Hover Time Tooltip & Chapter Markers)         |  |  |
|  |  |                                                                     |  |  |
|  |  |  [ > Play ] [ 10s<< ] [ >>10s ] [ Mute ] [||||==] 04:12 / 12:45    |  |  |
|  |  |  [ CC On ] [ 1.25x ] [ PiP ] [ Fullscreen [ ] ]                     |  |  |
|  |  +---------------------------------------------------------------------+  |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

### Spatial Grid & Token Mapping

- **Outer Wrapper:** `width: 100%; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);`
- **Control Bar Overlay:** `position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 20px; background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.95) 100%);`
- **Center Big Play Button:**
  - Standard size: `64px x 64px`
  - Mobile size: `52px x 52px`
  - Fill: `background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px);`
  - Border: `2px solid rgba(255, 255, 255, 0.25)`
  - Active color: `var(--brand-primary, #3B82F6)`
- **Scrubber Bar Dimensions:**
  - Inactive track height: `4px`
  - Hover / Drag track height: `8px`
  - Scrubber thumb handle: `16px x 16px` circular white knob with `box-shadow: 0 2px 4px rgba(0,0,0,0.5)`
  - Played progress fill: `var(--brand-primary, #3B82F6)`
  - Buffer progress fill: `rgba(255, 255, 255, 0.4)`
- **Typography Tokens:**
  - Time Counter (`04:12 / 12:45`): `font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.8125rem; color: #F8FAFC; font-variant-numeric: tabular-nums;`
  - Chapter Label Tooltip: `font-size: 0.75rem; background: #0F172A; color: #FFFFFF; padding: 4px 8px; border-radius: 4px;`

---

## Scenario 2: Persistent Audio Podcast Player Bar

### Visual Composition & Spatial Breakdown

```text
+---------------------------------------------------------------------------------------------------+
| PERSISTENT BOTTOM AUDIO DOCK (position: fixed; bottom: 0; left: 0; right: 0; height: 72px;)       |
| Surface: #0F172A (Dark Slate); Border-Top: 1px solid #334155; Box-Shadow: 0 -4px 12px rgba(0,0,0,0.2) |
|                                                                                                   |
|  LEFT: TRACK INFO (280px)      CENTER: PLAYBACK & WAVEFORM SCRUBBER (Flex 1)   RIGHT: ACTIONS (240px)|
|  +--------------------------+  +--------------------------------------------+  +------------------+ |
|  | [Art] Ep. 42: Building  |  |    [Jump 10s]  [ ( > ) ]  [Jump 10s]       |  |  [1.5x] [Vol ||==] | |
|  | 56x56  Design Systems    |  |    08:15 ===||||||||||||||||------------   |  |  [ Queue (3) ]   | |
|  |        Design Systems FM |  |          Waveform Progress 24:10            |  |  [ Minimize v ]  | |
|  +--------------------------+  +--------------------------------------------+  +------------------+ |
+---------------------------------------------------------------------------------------------------+
```

### Key Interaction Details

1. **Waveform Scrubber Bar:**
   - Displays rendered audio wave peaks with dual state colors: active played bars rendered in high-contrast cyan (`#22D3EE`), remaining unplayed bars in muted slate (`#475569`).
   - Dragging or hovering reveals precise timestamp + chapter title tooltip.
2. **Jump Controls:**
   - Explicit "Skip back 10s" and "Skip forward 10s" buttons flank the central circular play/pause button.
3. **Speed Selector:**
   - Popover trigger cycles between `1.0x`, `1.25x`, `1.5x`, `1.75x`, `2.0x` speed options.
4. **Accessible Range Sliders:**
   - Volume slider expands smoothly on hover/focus from `0px` to `80px` width.
   - Screen readers announce `"Volume 80 percent"` via `aria-valuetext` attribute.

---

## Accessibility Audit Checklist

- [x] **WCAG SC 1.4.3 Contrast:** All text counters (`#F8FAFC`) and action icons maintain ≥ 7:1 contrast ratio against `#0F172A` background overlay.
- [x] **WCAG SC 2.1.1 Keyboard Navigation:** Every player control button can be focused with `Tab` and activated with `Space`/`Enter`.
- [x] **WCAG SC 2.5.8 Target Size:** All touch targets on mobile viewports satisfy minimum **44x44px** hit area.
- [x] **WCAG SC 4.1.3 Status Messages:** Play, pause, mute, and speed changes update an invisible `<div aria-live="polite">` region.
