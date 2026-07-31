# Client-Side Image Compression Audit Checklist

Use this checklist to audit existing frontend image upload modules or verify a new client-side compression implementation.

---

## 1. Visual Quality & Downsampling Checks
- [ ] **Multi-Step Downsampling (Bilinear Prevention):** Verify that large images (e.g., 4000px+ width) scaled down to card/avatar size (e.g., 400px width) do not display aliased jagged boundaries, blocky pixels, or text destruction. Step-down downsampling by halves should be active.
- [ ] **Transparency Preservation:** Verify that uploading a transparent PNG or WebP image does not render transparent areas into harsh black background blocks. Lossless formats (or canvases initialized with proper clear background defaults) must preserve the alpha channel.
- [ ] **Orientation Correction (EXIF):** Upload images captured in Portrait mode on mobile devices (such as physical iPhone cameras). Verify that they remain upright after drawing to the canvas and do not rotate 90 or 270 degrees.
- [ ] **Aspect Ratio Locking:** Ensure that wide landscapes or tall portraits are not squished or stretched into distorted proportions. Scaling boundaries must respect correct aspect ratios.

---

## 2. Performance & Thread Optimization
- [ ] **OffscreenCanvas / Worker Isolation:** Ensure that compiling heavy image files does not trigger red "Long Task" blocks (> 50ms) in the Chrome DevTools performance trace. Verify `OffscreenCanvas` usage where available.
- [ ] **Memory Allocation Safeguards:** Check that maximum canvas dimensions are locked to a safe threshold (e.g., max 4096px). Opening a canvas with an enormous memory block (e.g., 8000x8000px) on an older mobile Safari browser will trigger a tab crash or result in a blank transparent render.
- [ ] **Object URL Garbage Collection:** Audit preview code for memory leaks. Every call to `URL.createObjectURL(blob)` must be paired with `URL.revokeObjectURL(url)` when the preview image has finished loading, is swapped, or on parent component destruction.
- [ ] **Data Reduction Validation:** Test with representative images (3MB to 10MB). Verify that the compression pipeline consistently delivers a 70% to 95% reduction in overall file size while maintaining excellent visual fidelity.

---

## 3. Accessibility (A11y) & UX Integration
- [ ] **Screen Reader Live Announcements:** Turn on VoiceOver or NVDA. Upload an image. Verify that a visually hidden `aria-live="polite"` container announces key states (e.g., *"Optimizing image profile.jpg, please wait..."* and *"Optimization complete. Size reduced by 88%."*).
- [ ] **Keyboard Navigable Drop Zone:** The drag-and-drop region must have `tabindex="0"` and `role="button"`. It must respond to `Space` and `Enter` keys to open the native file selection dialog.
- [ ] **Failure Resiliency Fallback:** If the compression engine encounters an unreadable file, a corrupted stream, or a browser canvas error, it must fail gracefully, inform the user with a descriptive error message, and optionally allow uploading the uncompressed file instead of breaking the entire upload workflow.
- [ ] **Form Validation Timing:** Ensure that compression completes *before* the parent `<form>` submission event, preventing empty payload submissions or racing conditions.
