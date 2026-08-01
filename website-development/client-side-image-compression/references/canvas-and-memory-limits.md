# Canvas and Memory Limits Reference

When building client-side image compression workflows, understanding browser-specific capabilities, memory management, and rendering quirks is critical. This reference document outlines key constraints, thresholds, and workarounds.

---

## 1. Canvas Dimension & Memory Thresholds

HTML5 Canvas components are stored in memory as raw, uncompressed 32-bit RGBA bitmap buffers. Every single pixel consumes exactly 4 bytes of RAM.

$$\text{RAM Usage} = \text{Width} \times \text{Height} \times 4 \text{ bytes}$$

Because of this rapid memory consumption, browser engines enforce strict maximum dimension limits and total memory caps for canvases.

### Mobile Safari (iOS) Constraints
iOS devices are particularly vulnerable to memory limits due to strict hardware allocation policies:
- **Maximum Individual Canvas Size:**
  - On older devices (under 2GB RAM), the maximum canvas dimension is **4096 x 4096 pixels** (16 Megapixels).
  - On newer devices (iOS 15+, devices with 3GB+ RAM), the limit is **8192 x 8192 pixels** (64 Megapixels).
- **Total Combined Canvas Memory Allocation:**
  - If the sum of all active, unrevoked canvases in a single tab exceeds ~256MB on low-end iOS devices, the browser will either **turn the canvases blank/black**, **refresh the page silently**, or **crash the tab entirely** with an "A problem repeatedly occurred" message.

### Desktop Browser Limits
Desktop browsers have much higher thresholds, but they are still bounded:
- **Google Chrome / Microsoft Edge:** Max canvas dimensions are typically **16384 x 16384 pixels** on 64-bit systems.
- **Mozilla Firefox:** Max canvas dimensions are **32768 x 32768 pixels**.

---

## 2. EXIF Orientation and Rotation Behavior

Historically, smartphone cameras did not physically rotate pixel arrays when taking portrait pictures. Instead, they saved the pixels in landscape format and appended a numeric tag (EXIF orientation, ranging 1–8) indicating how the image should be rotated during display.

### Browser Evolution
- **The Old Bug (Double Rotation Risk):** In older browsers, drawing an image onto a `<canvas>` ignored the EXIF orientation tag, resulting in portrait photos being drawn sideways or upside down. Developers had to write complex array-buffer parsers to extract the EXIF tag, then rotate the canvas context using `ctx.rotate()` before drawing.
- **Modern Auto-Rotation:**
  - **Google Chrome 81+**, **Firefox 77+**, and **Safari 13.1+** natively auto-orient images loaded via `<img>` tags on Canvas contexts.
  - *Gotcha:* If your codebase still uses a legacy EXIF parsing library to manual-rotate images, modern browsers will **double-rotate** the output, causing it to appear upside down or sideways.
- **Detection & Modern Safety Rule:** Rely on the browser's native rendering of `<img>` and do not include manual EXIF rotation algorithms unless you specifically target legacy enterprise environments (IE11, iOS < 13).

---

## 3. High-DPI (Retina) Canvas Display vs. File Export

When utilizing `<canvas>` for visual previews, there is a fundamental difference between **CSS rendering** and **Blob exportation**.

- **CSS Sizing:** A canvas defined as `<canvas width="400" height="400" style="width:200px; height:200px;">` has an internal bitmap resolution of 400x400 pixels, but occupies 200x200 CSS pixels on the screen. This is crucial on high-DPI (Retina) screens to prevent the preview from looking blurry.
- **Exporting Resolution:** When calling `canvas.toBlob()`, the exported file size is determined solely by the internal bitmap dimensions (`canvas.width` and `canvas.height`), NOT the CSS dimensions. Ensure your calculation modifications target the canvas's internal width/height properties.

---

## 4. Performance Optimization Heuristics

### Memory Leaks & Object URLs
When you create a temporary Object URL via `URL.createObjectURL(file)`, the browser maintains a reference to that file in memory for as long as the page is open, or until you explicitly free it.
- **Best Practice:** Call `URL.revokeObjectURL(url)` as soon as the image has been drawn onto the canvas. Do not wait for garbage collection.
- **Cleanup Loop Example:**
  ```javascript
  const tempUrl = URL.createObjectURL(file);
  img.src = tempUrl;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(tempUrl); // Immediate cleanup!
  };
  ```

### Leveraging `OffscreenCanvas` (Where Supported)
For heavy, bulk, or background-critical compression flows, standard `<canvas>` blocking behavior can cause rendering jank (dropped frames on animations, scroll lag).
- In supporting browsers (Chrome 69+, Edge 79+, Firefox 105+, Safari 16.4+), you can instantiate `OffscreenCanvas` inside a dedicated Web Worker. This completely offloads raw image decoding and compression from the main thread, resulting in a perfectly smooth 60fps user interface during massive batch compressions.
