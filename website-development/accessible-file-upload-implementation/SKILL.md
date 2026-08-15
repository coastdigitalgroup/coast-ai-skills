---
name: accessible-file-upload-implementation
description:
  Implement and debug accessible, high-performance file uploaders using native
  HTML input elements, drag-and-drop APIs, and ARIA live regions for status updates.
---

# Accessible File Upload Implementation

## Purpose

The Accessible File Upload Implementation skill provides a technical protocol for
building file uploaders that are accessible to all users, including those relying
on screen readers and keyboard-only navigation. It focuses on maintaining the
native file input's functionality while providing a custom, user-friendly
interface with drag-and-drop support, image previews, and clear status
announcements.

## Use Cases

- Implementing a profile picture uploader with a local preview.
- Creating a multi-file "drop zone" for document management systems.
- Auditing and fixing accessibility gaps in existing custom file uploaders (e.g.,
  missing focus states, silent errors).
- Modernizing legacy file inputs with modern drag-and-drop capabilities without
  sacrificing keyboard accessibility.

## When NOT to Use

- **Simple System Uploads:** If the default browser styling for `<input type="file">`
  is sufficient and no custom UI is required, use the native element directly.
- **Large Chunked Uploads (Backend Logic):** This skill focuses on the frontend
  interface and accessibility. It does not cover complex server-side chunking
  strategies or large-scale file streaming logic.
- **Purely Server-Side Forms:** If the form is handled entirely by a traditional
  POST request without any client-side interaction or previews.

## Inputs

1. **Accept Constraints:** Which file types are allowed (e.g., `.jpg, .png`, `image/*`).
2. **Quantity Limits:** Is it a single file or multiple file upload?
3. **Size Constraints:** Maximum file size allowed for client-side validation.
4. **Visual Requirements:** Design for the drop zone, file list, and previews.

## Outputs

1. **Semantic HTML Structure:** A hidden native `<input type="file">` correctly
   linked to a custom trigger and drop zone.
2. **Accessible Interaction Logic:** Scripts to handle drag-and-drop events,
   keyboard triggers, and file selection.
3. **Live Status Announcements:** ARIA live regions to inform screen reader users
   of successful uploads, progress, or errors.
4. **Preview Implementation:** High-performance local previews using
   `URL.createObjectURL`.

## Workflow

### 1. Maintain Native Accessibility

- Use a real `<input type="file">` as the source of truth.
- Hide it visually but keep it in the tab order (e.g., `opacity: 0; position: absolute;`)
  or ensure the custom trigger button programmatically invokes it.
- **Important:** Avoid redundant `tabindex="0"` on non-interactive drop-zone siblings.

### 2. Implement the Drop Zone

- Add `dragover`, `dragleave`, and `drop` event listeners to the container.
- Use a visual state (e.g., a border change) to indicate the active drag state.
- Prevent default browser behavior (opening the file in the tab) on all drag events.

### 3. Handle File Selection

- Listen for the `change` event on the native input and the `drop` event on the
  container.
- Validate files (type, size) immediately on the client side.
- Use `URL.createObjectURL(file)` to generate temporary URLs for image previews
  to minimize memory overhead compared to `FileReader`.

### 4. Communicate State via ARIA

- **Announcements:** Use an `aria-live="polite"` region to announce "File uploaded
  successfully", "File removed", or "Upload failed: file too large".
- **Invalid State:** Use `aria-invalid="true"` on the input if validation fails.
- **Description:** Link the list of uploaded files to the input using
  `aria-describedby` if appropriate.

### 5. Manage the File List

- Display a list of pending/uploaded files with clear "Remove" buttons.
- Ensure each "Remove" button has a descriptive `aria-label` (e.g., `aria-label="Remove photo.jpg"`).
- Move focus logically if a file is removed, or ensure the screen reader
  announces the deletion.

## Decision Rules

- **Input Visibility:** Keep the native input as the primary focusable element
  whenever possible. If using a custom button to trigger the input, ensure the
  button has the correct label.
- **Preview Method:** Prefer `URL.createObjectURL` for performance. Revoke the
  object URL when it is no longer needed to prevent memory leaks.
- **Validation Timing:** Validate files as soon as they are selected (on `change`
  or `drop`) to provide immediate feedback.

## Constraints

- **Single Active Focus:** The custom trigger must correctly manage focus
  transitions to and from the file picker dialog.
- **Keyboard Navigation:** The entire flow (triggering, selecting, previewing,
  removing) must be functional via keyboard.
- **No "Silent" Deletions:** Removing a file from the list must be announced
  to screen readers.

## Non-Goals

- Implementing the backend API for file storage.
- Handling complex image editing (cropping, filtering) within the uploader.
- Managing long-term file persistence or cloud storage integration.

## Common Failure Patterns

- **Unreachable Inputs:** Hiding the native input with `display: none`, making it
  inaccessible to keyboard users and screen readers.
- **Missing "Remove" Feedback:** Visually removing a file from a list without
  informing assistive technologies, leaving the user unsure of the state.
- **Memory Leaks:** Failing to call `URL.revokeObjectURL()` after the preview is
  removed or the page is unloaded.
- **Default Drop Behavior:** Not preventing the default browser behavior on
  `drop`, causing the browser to navigate away from the page to the file.
- **No Focus Indicators:** Custom drop zones missing clear visual focus
  indicators for keyboard users.

## Validation Criteria

- [ ] **Keyboard Test:** Verify you can trigger the file picker and navigate the
      file list/remove buttons using only `Tab` and `Enter/Space`.
- [ ] **Screen Reader Test:** Verify that file selection, removal, and
      validation errors are announced via the ARIA live region.
- [ ] **Drag-and-Drop Test:** Ensure dropping a file correctly populates the
      uploader and doesn't cause a page navigation.
- [ ] **Memory Audit:** Verify that `URL.revokeObjectURL` is called when
      previews are removed.
- [ ] **Mobile Test:** Verify that the "Tap to upload" functionality works on
      touch devices and triggers the native file selection menu.
