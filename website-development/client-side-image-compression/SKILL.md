---
name: client-side-image-compression
description:
  Compress and resize images on the client side before upload using HTML5 Canvas,
  preventing network timeouts and server memory overload while keeping users informed
  via accessible ARIA progress announcements.
---

# Client-Side Image Compression

## Purpose

The Client-Side Image Compression skill provides a technical protocol and modular JavaScript pattern for resizing, downsampling, and compressing user-selected images in the browser before triggering a backend upload.

Uploading raw high-resolution photos (e.g., 12MP to 48MP images from modern smartphones, resulting in 5MB to 20MB file sizes) causes severe user experience issues:
1. **Network Timeouts:** Users on slow mobile connections face extremely long upload times or outright connection drops.
2. **Server Memory Overload (OOM):** Server-side image processors (such as Sharp, ImageMagick, or GD) load uncompressed pixel data into memory, where a 10MB JPEG can expand to 150MB+ of raw uncompressed RGBA bitmaps in RAM, causing server OOM crashes under concurrent loads.
3. **Data Costs:** Wasted cellular data bandwidth for end-users.

By shifting image resizing and JPEG/WebP compression to the client's GPU and CPU via HTML5 Canvas, websites can reduce file sizes by 80–95% before uploading, enabling instantaneous uploads and protecting server infrastructure.

---

## Use Cases

- **User Profile Avatars:** Restricting upload dimensions (e.g., 400x400 pixels) and converting heavy PNGs or JPEGs to lightweight compressed WebP/JPEG files.
- **E-commerce Product Listings:** Allowing sellers to upload multiple high-res product photos from their phones and compressing them to a standard size (e.g., 1200x1200px max) directly in the browser.
- **Content Management Systems (CMS):** Optimizing blog hero and body images during the creation flow.
- **Support Tickets & Bug Reports:** Enabling rapid uploads of screenshots and photos on low-bandwidth mobile networks.

---

## When NOT to Use

- **High-Fidelity Document Archiving:** Legal documents, medical scans, or high-precision industrial photos where loss of pixel density, text legibility, or color space accuracy would render the image useless.
- **Client-Side Heavy Batch Uploads on Ultra-Low-End Devices:** Resizing 50 images concurrently on a low-end mobile browser can exceed browser tab memory bounds and cause tab crashes (use lazy sequential processing instead, or defer completely to the server).
- **Vector Graphics:** Do not apply canvas compression to SVG or PDF files, as it rasterizes vector paths into pixels, losing scalability.

---

## Inputs

1. **Source File Object:** A native browser `File` or `Blob` object obtained from an `<input type="file">` element, drag-and-drop interface, or paste event.
2. **Target Format:** The target image mime-type, typically `image/jpeg` or `image/webp`.
3. **Target Dimension Constraints:** Maximum width and/or height boundaries (e.g., `maxWidth: 1920`, `maxHeight: 1080`) while maintaining aspect ratio.
4. **Compression Quality:** A floating-point number between `0.0` and `1.0` indicating output quality.

---

## Outputs

1. **Compressed File/Blob Object:** A lightweight, compressed `Blob` or `File` ready to be appended to `FormData` for immediate HTTP/Fetch upload.
2. **Preview URL:** A safe, temporary Object URL (`URL.createObjectURL(blob)`) for updating the UI preview immediately.
3. **Metadata Summary:** An object containing the original size, compressed size, compression ratio, and final dimensions for reporting or analytics.

---

## Workflow

### 1. File Input & Type Validation
Listen for file selection, confirm that the mime-type matches image categories (e.g., JPEG, PNG, WebP), and prevent processing of unsupported files.

### 2. File to Image Element Conversion
Read the `File` object using `FileReader` or `URL.createObjectURL` to convert it into a temporary HTML `Image` element so the browser can decode the image dimensions and pixel data.

### 3. Calculate Target Dimensions
Examine the image's original dimensions and calculate the target dimensions using aspect-ratio preservation equations.
- **Ratio Formula:** `min(1, maxWidth / originalWidth, maxHeight / originalHeight)`
- Scale the width and height by this ratio.

### 4. Create Offscreen Canvas and Draw
Create a dynamic `<canvas>` element (or `OffscreenCanvas` in supporting environments). Set its dimensions to the target width/height, and paint the source image onto it using the canvas's 2D context (`drawImage()`).

### 5. Compress and Export
Invoke `canvas.toBlob(callback, mimeType, quality)` or `canvas.toDataURL(mimeType, quality)`.
- **Quality Factor:** Use `0.75` to `0.85` for optimal size-to-visual-quality ratios.
- **Format:** Default to `image/jpeg` or `image/webp`.

### 6. Clean Up Temporary Resources
Always revoke the temporary Object URL via `URL.revokeObjectURL()` to prevent memory leaks in long-running single-page applications.

---

## Decision Rules

### Selecting the Target Output Format

| Metric / Scenario | WebP (`image/webp`) | JPEG (`image/jpeg`) | PNG (`image/png`) |
| :--- | :--- | :--- | :--- |
| **Transparency Need** | Yes, perfect for transparent backgrounds. | No, fills transparent pixels with black/white. | Yes, lossless, but file sizes are very large. |
| **Compression Ratio** | Outstanding (often 30% smaller than JPEG). | Excellent, high compatibility. | Poor for photographic images; only use for vector/UI. |
| **Browser Compatibility** | Universal in modern browsers (Chrome, Safari 14+, Firefox). | Universal. | Universal. |
| **Recommended Choice** | Primary choice for modern web layouts. | Reliable fallback or default for legacy. | Only when perfect, lossless transparency is non-negotiable. |

### Canvas Resizing Strategy (Single-Step vs Multi-Step Downsampling)

- **Single-Step Draw (`drawImage` directly to target size):**
  - Use when the target size is **more than 50%** of the original size.
  - *Pros:* Extremely fast, minimal CPU usage.
  - *Cons:* Triggers pixel-aliasing/nearest-neighbor downsampling in older engines, causing jagged edges if resizing a 4000px image down to 200px.
- **Multi-Step Downsampling (Lanczos / Stepped Canvas Scaling):**
  - Use when the target size is **less than 50%** of the original size (e.g., resizing a massive 6000px photo down to a 150px avatar).
  - *Pros:* Extremely high-quality, crisp lines, professional-looking downscaling.
  - *Cons:* Requires loop-based redraws onto temporary half-sized canvases, consuming extra memory and CPU cycles.

---

## Constraints

- **Canvas Memory Thresholds:** iOS Safari enforces strict limits on `<canvas>` dimensions and combined memory allocations. Any canvas exceeding 16,777,216 pixels (or total allocations exceeding ~256MB on low-end iPhones) will crash the tab or turn silent black. Keep canvas areas well below 4096x4096px.
- **Exif Orientation Quirks:** Historically, iOS cameras saved images rotated, relying on EXIF tags to tell the browser how to rotate them. Modern browsers (Chrome 81+, Safari 13.1+) rotate canvas images automatically based on EXIF, but legacy browsers require custom parsing of EXIF arrays.
- **Main-Thread Blocking:** Canvas `toBlob` is asynchronous, but the rendering phase of `drawImage` and the browser's under-the-hood compression can block the main thread for several hundred milliseconds on large images. Process heavy images sequentially and use loading UI indicator patterns.

---

## Non-Goals

- Client-side image cropping (cropping interfaces require heavy UI library support like Cropper.js, which is out of scope for pure compression workflow).
- Server-side image backup or storage hosting integrations.
- Watermarking or drawing complex canvas vector overlay graphics on top of the image.

---

## Common Failure Patterns

- **The Memory Leak Trap:** Forgetting to call `URL.revokeObjectURL(tempURL)` after rendering the image to canvas. If users select multiple files in succession, memory usage inflates rapidly until the browser tab crashes.
- **The Black/Blank Canvas on iOS:** Attempting to resize a massive panorama or high-res photo using a Canvas that exceeds memory limits. The canvas renders completely black or crashes the tab.
- **The Slower-Than-Network Paradox:** Attempting to compress images sequentially in a blocking manner when the user has selected 20 files, locking up the UI.
- **Missing Progress Announcements:** Users upload a file and the browser spends 3 seconds compressing it. During this time, the interface is completely frozen, and a screen reader user has no idea why their upload hasn't started or whether the website has crashed.
- **Transparent Background Turned Black:** Converting a transparent PNG to JPEG. Canvas doesn't have transparency support for JPEG and renders the transparent alpha channel as solid black. The background must be explicitly pre-painted white before drawing the source PNG.

---

## Validation Steps

- [ ] **File Size Audit:** Select a heavy 5MB image from a device. Confirm that the compressed output is under 500KB (typically 100KB–250KB for standard web displays) with minimal visual degradation.
- [ ] **Transparency Test:** Compress a transparent PNG to JPEG. Confirm that transparent background areas are properly painted white (or another color) instead of turning solid black.
- [ ] **Sequential Batch Test:** Upload 5 heavy images concurrently. Verify they are processed using an async queue (throttled) without dropping frames or freezing the browser.
- [ ] **Screen Reader Live Progress Test:** Turn on VoiceOver/NVDA. Select a heavy image. Verify that the browser announces compression progress (e.g., *"Compressing image... 50%"*, *"Compression complete"*) via an `aria-live` element.
- [ ] **Memory Allocation Check:** Confirm that `URL.revokeObjectURL` is being triggered correctly for every temporary image created, avoiding memory leaks.
- [ ] **iOS Aspect-Ratio & Orientation Verification:** Check the upload output on an iOS Safari device. Confirm that portrait photos captured using the native camera remain right-side up and maintain their correct aspect ratio.
