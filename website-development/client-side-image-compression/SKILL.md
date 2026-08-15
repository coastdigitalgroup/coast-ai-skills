---
name: client-side-image-compression
description:
  Implement and debug high-performance, accessible client-side image downsampling
  and compression before uploading using HTML5 Canvas, OffscreenCanvas, Blobs,
  and ARIA live progress tracking.
---

# Client-Side Image Compression and Optimization

## Purpose

The Client-Side Image Compression and Optimization skill provides a technical protocol for processing, scaling, and compressing user-selected images directly in the browser before they are transmitted to a backend server.

Direct-from-camera images on modern mobile devices and DSLRs routinely range from 5MB to over 15MB. When users upload these raw files on cellular or high-latency networks:
1. **Slow Performance & Timeouts:** Uploading multi-megabyte payloads causes sluggish, hanging progress bars and high network failure rates.
2. **Server Overhead:** Processing high-resolution images on the backend consumes massive memory and CPU cycles, introducing scaling bottlenecks and risking Out-Of-Memory (OOM) crashes.
3. **Data Usage:** Users waste valuable metered data sending redundant pixels that will ultimately be discarded by server-side resizing.

This skill solves these issues by downsampling (scaling down resolution) and compressing (reducing file quality) images on the frontend. A 10MB JPEG can be optimized to a beautiful, crisp 250KB JPEG/WebP file in less than 200ms directly on the client's device, protecting network bandwidth, improving Core Web Vitals, and creating an instantaneous upload experience.

## Use Cases

- **Avatar and Profile Photo Uploads:** Forcing high-resolution uploads down to an exact square dimension (e.g., 512x512px) and compressing them to WebP/JPEG format.
- **Product Listing Media (E-commerce):** Compressing merchant-uploaded product photos to uniform maximum dimensions (e.g., 1600px width) before sending them to storage.
- **Support Ticket Attachment Systems:** Restricting attachment sizes in high-volume customer portals to avoid overloading file servers and to prevent network failures during submission.
- **Real-Estate/Travel Listing Galleries:** Processing multiple large photo uploads concurrently in a secure, performant browser thread.

## When NOT to Use

- **High-Fidelity Document Scanning (Medical/Legal):** Medical imaging, legal document scans, or PDF text captures require pixel-perfect clarity where compression artifacts or resolution downgrades could render fine print or diagnostics unreadable.
- **Professional Photography Portfolios:** Sites dedicated to professional photography showcase, high-resolution printing, or raw asset storage where the user specifically expects to store and display the uncompressed, original raw asset.
- **Non-Raster Image Media:** Do not attempt client-side compression on vector graphics (SVGs), animated GIFs (which will lose their animation frames when drawn to a standard canvas), or raw PDFs.

## Inputs

1. **Source File Object:** The raw file selected from an `<input type="file">` or captured via drag-and-drop.
2. **Target Dimensions:** The maximum boundary constraints (e.g., `maxWidth: 1200`, `maxHeight: 1200`).
3. **Compression Parameters:**
   - `quality`: Floating-point value between `0.0` and `1.0` defining the JPEG/WebP compression density.
   - `mimeType`: The target output format (`image/jpeg` or `image/webp`).
4. **Behavior Options:**
   - `keepAspectRatio`: Boolean indicating if the original proportions must be preserved (usually true).
   - `useWebWorker`: Boolean indicating whether to offload rendering to an asynchronous worker using `OffscreenCanvas`.

## Outputs

1. **Compressed Blob:** A highly-optimized native JS `Blob` object ready to be appended to a `FormData` object for `fetch` uploading.
2. **Performance Metrics:** Statistics of the optimization process (original file size, compressed file size, reduction ratio, and total processing duration).
3. **Local Preview URL:** A revocable Object URL (`blob:`) representing the optimized image for instant UI rendering.
4. **Accessible Progress Events:** Progress and status updates for assistive technologies to read aloud via `aria-live` containers.

---

## Workflow

```text
[Input File] ---> [Validate Type & Size] ---> [Generate ImageBitmap / Image]
                                                      |
                                           (Is Worker Supported?)
                                            /                  \
                                         [Yes]                 [No]
                                          /                      \
                         [Post to Web Worker]             [Local Canvas Render]
                         - OffscreenCanvas                - Handle EXIF orientation
                         - High-performance scaling       - Canvas 2D downsampling
                                          \                      /
                                     [Export as Compressed Blob]
                                                  |
                                   [Generate Object URL for Preview]
                                                  |
                                    [Append to FormData & Upload]
```

### 1. Validate File Types on Input
Before processing, verify that the uploaded file is a valid, compressible raster image type (`image/jpeg`, `image/png`, `image/webp`).
- Non-image files or unsupported formats should bypass the compressor immediately or trigger a validation alert.
- Programmatically check the MIME type rather than depending purely on file extension names.

### 2. Formulate Scaling Mathematics
Calculate the scaled width and height of the image to stay within your maximum bounding constraints while preserving the correct aspect ratio.

```javascript
function calculateTargetDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const ratio = originalWidth / originalHeight;

    if (ratio > 1) {
      // Landscape: width is the limiting factor
      targetWidth = maxWidth;
      targetHeight = Math.round(maxWidth / ratio);
    } else {
      // Portrait/Square: height is the limiting factor
      targetHeight = maxHeight;
      targetWidth = Math.round(maxHeight * ratio);
    }
  }

  return { width: targetWidth, height: targetHeight };
}
```

### 3. Handle Downsampling and Compression (The Canvas Pipeline)
To process the image, the raw `File` must be drawn to an HTML5 `<canvas>` element and exported as a compressed Blob using `.toBlob()`.

- **Step-down Downsampling (Lanczos / Bilinear fallback):** Drawing a large 6000x4000px image directly to a small 600x400px canvas in a single operation can result in aliasing (jagged edges and pixelated text) due to nearest-neighbor rendering. To ensure beautiful quality, downsample in stages, dividing dimensions by 2 in each pass until the target resolution is reached, then perform the final render.
- **Exporting the Blob:** Call `canvas.toBlob(callback, mimeType, quality)` where `quality` is between `0.0` and `1.0`.

```javascript
const canvas = document.createElement('canvas');
canvas.width = targetWidth;
canvas.height = targetHeight;
const ctx = canvas.getContext('2d');

// Draw image to canvas
ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);

// Export compressed Blob
canvas.toBlob((blob) => {
  // Use the resulting blob
}, 'image/jpeg', 0.82); // 0.82 quality is the industry sweet spot
```

### 4. Harness OffscreenCanvas and Web Workers for Peak Performance
Processing large images on the main thread blocks UI interaction and drops frames, hurting Interaction to Next Paint (INP).
- Check browser capability for `OffscreenCanvas` and `createImageBitmap`.
- If supported, pass the file handle to a `Web Worker`. Inside the worker, convert the file to an `ImageBitmap` via `createImageBitmap`, draw it to an `OffscreenCanvas`, and export it asynchronously.
- Keep the main thread responsive, ensuring scrolling, typing, and buttons remain functional.

### 5. Announce Progress with ARIA Live Regions
Image compression is asynchronous and takes a brief period. Visual progress loaders or comparison stats must be accessible to visually impaired users:
- Embed a visually hidden container with `aria-live="polite"` and `aria-atomic="true"`.
- Programmatically inject screen-reader friendly status strings during key events:
  - On start: `"Optimizing image profile-picture.jpg, please wait..."`
  - On completion: `"Optimization complete. File size reduced by 84% (from 4.2 MB to 670 KB)."`
  - On failure: `"Unable to optimize image. Defaulting to original file."`

---

## Decision Rules

### Setting Compression Parameters

| Format Target | Input PNG / Transparency | Recommended Output Format | Suggested Parameters |
| :--- | :--- | :--- | :--- |
| **General Photography / Avatars** | No | `image/jpeg` | `quality: 0.80 - 0.85`, dimension cap `1200px` |
| **Modern Browsers (Optimal)** | Yes or No | `image/webp` | `quality: 0.75 - 0.82`, dimension cap `1600px` |
| **Illustrations / Text Screenshots** | Yes (transparency needed) | `image/png` | Do not apply lossy compression; downsample dimensions only to preserve alpha channel. |
| **Legacy Compatibility Fallback** | No | `image/jpeg` | `quality: 0.80`, dimension cap `1000px` |

### Multi-Step Downsampling Decision

- **If the downsampling ratio is < 2:** Draw directly to the target canvas in a single step (high performance, minimal quality impact).
- **If the downsampling ratio is >= 2:** Implement step-down scaling. Resize by halves iteratively, drawing each pass to an intermediate canvas size, before drawing the final output to avoid aliasing artifacts.

---

## Constraints

- **Canvas Size Limits:** Browser engines place maximum size caps on HTML5 `<canvas>` elements (e.g., iOS Safari caps single canvas allocations heavily at 16,777,216 pixels or lower based on device RAM). Going over this limit throws silent errors or yields a blank transparent canvas. Limit canvas initialization dimensions to a safe ceiling (e.g., maximum `4096px` on width/height).
- **iOS Safari EXIF Rotation History:** Prior to iOS 13 and modern desktop browsers, drawing JPEGs taken with mobile cameras onto a canvas rotated the image sideways (90/180/270 degrees) because the canvas API ignored orientation tags embedded in the EXIF metadata.
  - *Modern Behavior:* Modern browsers (Chrome 81+, Safari 13.4+, Firefox 77+) apply EXIF orientation automatically.
  - *Fallback Rule:* If supporting legacy browsers, read EXIF tags manually or use standard utility decoders before rendering to prevent orientation desyncs.
- **Worker File Passing:** Files cannot be shared directly; transfer the `File` or `ImageBitmap` object using the Transferable Objects protocol to avoid copying heavy memory blobs across thread boundaries.

## Non-Goals

- **Server-side Image Storing:** This skill is focused 100% on frontend client-side processing; it does not cover saving files to storage buckets or writing database transactions.
- **Advanced Cropping / Visual Editing UI:** Creating interactive drag-to-crop handles, brightness sliders, or graphic filters is not covered. This skill focuses on the core background sizing and compression pipeline.
- **CSS-only Aspect Scaling:** Handled by layout techniques (see `responsive-images`).

---

## Common Failure Patterns

- **Aliased / Jagged Edge Scaling:** Scaling an image from 4000px wide down to 400px wide in a single step. The browser uses fast nearest-neighbor downscaling, resulting in terrible jagged edges and text distortion.
- **The iOS "Blank Canvas" Crash:** Initializing a massive canvas memory block (e.g., 8000x8000px) on an older iPhone. iOS Safari's strict memory manager will silently crash the tab or fail to render anything, displaying a blank white or black container.
- **Lost Transparency in WebP/JPEG conversion:** Compressing a transparent company logo (PNG) into a JPEG format. The transparency is replaced with a harsh black background. Always check alpha-channel availability or default transparency backgrounds to white.
- **Frozen Browser Main Thread:** Compressing multiple heavy images sequentially on the main thread. The page freezes, making scrolling impossible and failing Core Web Vitals (INP).
- **Screen Reader Exclusion:** Updating visual statistics of file size savings but neglecting to notify the screen reader live region, keeping visually impaired users in the dark.
- **Unrevoked Object URLs:** Creating preview URLs using `URL.createObjectURL(blob)` and never revoking them. The browser holds the files in memory indefinitely, causing a slow and steady memory leak.

---

## Validation Criteria

- [ ] **Data Reduction Audit:** Select a heavy photo (e.g., 5MB+). Upload it through the compressor. Confirm that the final output blob is successfully reduced (e.g., under 500KB) and has sharp, highly legible details.
- [ ] **Transparency Test:** Select a PNG image with transparent sections. Verify that compiling it does not result in a harsh black background (either convert to PNG with transparent canvas, WebP with transparency support, or fill JPEG backgrounds with solid white).
- [ ] **Performance Profile Check:** Open Chrome DevTools Performance Panel. Trigger optimization on a 5MB JPEG. Ensure no red "Long Task" warnings appear on the main thread (verify Web Worker or OffscreenCanvas offloading).
- [ ] **Memory Allocation Verification:** Run the compression pipeline on several images consecutively. Verify in the Memory Panel that garbage collection is cleaning up resources and no lingering canvas objects remain.
- [ ] **Accessibility (A11y) Announcement Check:** Turn on a screen reader (VoiceOver or NVDA). Select a file for optimization and verify that the status transition and final size statistics are read aloud clearly by the synthesizer.
- [ ] **Object URL Revocation Check:** Ensure that preview URLs are correctly cleaned up using `URL.revokeObjectURL(url)` once the preview image finishes loading or a new file is selected.
