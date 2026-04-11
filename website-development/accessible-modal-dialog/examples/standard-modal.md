# Example: Native `<dialog>` Implementation

This example demonstrates the modern way to implement an accessible modal using the native HTML `<dialog>` element.

## HTML Structure

```html
<!-- Trigger -->
<button id="openModal">Update Profile</button>

<!-- Modal -->
<dialog id="profileModal" aria-labelledby="modalTitle" aria-describedby="modalDesc">
  <form method="dialog">
    <h2 id="modalTitle">Edit Profile</h2>
    <p id="modalDesc">Please enter your updated details below.</p>

    <label for="username">Username:</label>
    <input type="text" id="username" name="username" autofocus>

    <div class="modal-actions">
      <button type="submit" value="cancel">Cancel</button>
      <button type="submit" value="save" class="primary">Save Changes</button>
    </div>
  </form>
</dialog>
```

## JavaScript Logic

The native `<dialog>` handles focus trapping and the `Escape` key automatically when opened with `showModal()`. We only need to handle the opening and closing logic.

```javascript
const modal = document.getElementById('profileModal');
const openBtn = document.getElementById('openModal');

openBtn.addEventListener('click', () => {
  // .showModal() is essential for accessibility (traps focus, adds backdrop)
  modal.showModal();
});

modal.addEventListener('close', () => {
  console.log('Modal closed with value:', modal.returnValue);
  // Focus is automatically restored to openBtn by the browser
});

// Optional: Close on backdrop click
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.close();
  }
});
```

## CSS Styling

```css
dialog {
  padding: 2rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

/* Ensure focus is visible for keyboard users */
button:focus-visible, input:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

## Key Accessibility Features in this Example
1. **Focus Trapping:** Managed automatically by `showModal()`.
2. **Title Linkage:** `aria-labelledby` connects the heading to the dialog.
3. **Description Linkage:** `aria-describedby` provides context to screen readers.
4. **Initial Focus:** The `autofocus` attribute on the first input tells the browser where to start.
5. **Escape Support:** Native support for the `Escape` key to close the dialog.
6. **Focus Restoration:** The browser automatically returns focus to the trigger button when the modal closes.
