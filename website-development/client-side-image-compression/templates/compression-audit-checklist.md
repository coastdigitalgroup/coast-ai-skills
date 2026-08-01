# Client-Side Image Compression Audit Checklist

This checklist provides a technical framework for evaluating, testing, and debugging client-side image compression implementations across desktop and mobile websites.

## 1. Technical Implementation & Robustness
- [ ] **Mime-Type Guard:** Confirm that the script ignores or gracefully rejects non-image formats (such as `.pdf`, `.zip`, `.html`, `.svg`) before sending them to the canvas.
- [ ] **Canvas Dimensional Limit Check:** Ensure the compressor caps dimensions below `4096px` on any side to prevent silent canvas failures, memory exhaustion, or browser crashes on mobile Safari devices (which have tight 16-megapixel and memory allocation limits).
- [ ] **Transparency Safe-Handling:** Test converting a transparent PNG or GIF to JPEG. Verify that the transparent alpha channels are pre-filled with a white (or custom) background color instead of defaulting to solid black pixels.
- [ ] **Memory Leaks & Cleanup:** Audit for memory leaks in Single-Page Applications (SPAs). Confirm that `URL.revokeObjectURL()` is immediately and correctly executed for both the temporary original object URL and any compressed preview URLs once they are no longer needed by the DOM.
- [ ] **Sequential Throttling:** If multi-file uploading is supported, ensure images are processed in a throttled queue (e.g., max 2 at a time) rather than instantiating 15 canvases concurrently, which can freeze the main thread or crash the mobile tab.

## 2. Accessibility (a11y) & UX Integration
- [ ] **Interactive States and Focus:** Verify that the file upload drag-and-drop zone is keyboard-navigable (`tabindex="0"`) and triggerable via standard keys like `Enter` and `Space`.
- [ ] **Live Progress Announcements:** Verify that an `aria-live="polite"` container programmatically announces changes in compression states, progress percentage, success, or processing failures.
- [ ] **Loading Indicators:** Ensure visual indicators (such as a spinner or progress bar) appear immediately upon file selection to avoid a "frozen screen" appearance while the browser executes Canvas drawing and compression.
- [ ] **Graceful Failures:** Ensure that if an image fails to load or compress (e.g., corrupt file), an explicit, user-friendly error message is displayed and read by screen readers, and the upload button is disabled.
- [ ] **Before/After Context:** Ensure that when before/after comparison stats (dimensions, file size, storage savings) are rendered, they use semantic HTML structures so assistive technologies can read them.

## 3. Performance & Optimizations
- [ ] **Size Efficiency:** Confirm that compressed files achieve an 80-95% file size reduction compared to the raw camera capture (e.g., compressing a 6.2MB photo down to ~150KB - 300KB) while maintaining excellent visual sharpness.
- [ ] **Resolution Constraints:** Confirm that images are resized down to reasonable maximum values appropriate for web usage (e.g., max 800px for profile pictures, max 1920px for product photos or inline blog content).
- [ ] **Avoid Double Compilations:** Verify that the code does not perform unnecessary image conversions (e.g., creating a base64 DataURL, then converting it to a blob, which causes multiple heavy main-thread memory allocations). Work directly with `toBlob()` where possible.

## 4. Cross-Browser & Mobile Support
- [ ] **iOS Aspect Ratio & EXIF Rotation:** Verify that photos captured on iOS devices (in portrait or landscape) do not appear rotated by 90/180 degrees when rendered onto the canvas. Modern browsers (Chrome 81+, Safari 13.1+) automatically honor EXIF metadata orientation, but custom code should not double-rotate.
- [ ] **Feature Fallback:** Ensure that if the running environment does not support modern formats like `image/webp` or lacks canvas-to-blob capabilities, the system falls back gracefully to `image/jpeg` or uploads the original raw file.
- [ ] **Low-Bandwidth Throttling:** Test the application using Chrome DevTools with "Slow 3G" network throttling enabled. Ensure that the drastically reduced compressed payload resolves quickly without timing out.
