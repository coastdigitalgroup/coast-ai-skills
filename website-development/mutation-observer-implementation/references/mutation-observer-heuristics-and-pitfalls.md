# MutationObserver Heuristics & Performance Pitfalls

## 1. Event Loop & Microtask Execution Timing

`MutationObserver` callbacks run asynchronously as a microtask at the end of the current JavaScript execution block, immediately after script execution completes and before the browser recalculates layout or performs a paint.

```
[ JavaScript Task ] ➔ [ DOM Mutations ] ➔ [ Microtask Queue: MutationObserver Callback ] ➔ [ Style/Layout ] ➔ [ Paint ]
```

### Key Differences from Legacy Mutation Events

| Feature | Legacy Mutation Events (`DOMNodeInserted`) | Modern `MutationObserver` |
| :--- | :--- | :--- |
| **Execution Model** | Synchronous (Fires on every single DOM node edit) | Asynchronous (Batched in microtask queue) |
| **Performance Impact** | Severe thread locking & layout thrashing | High efficiency, zero event thrashing |
| **Multiple Edits** | Triggers N event calls | Batches into 1 callback with N `MutationRecords` |
| **Deprecation** | Deprecated in W3C spec, removed in modern engines | Standard modern browser implementation |

---

## 2. Preventing Mutation Loop Recursion

When a `MutationObserver` callback modifies DOM attributes or child nodes within its observed target tree, those modifications trigger *new* mutation records. Without recursion guards, this results in infinite callback loops.

### The Standard Guard Pattern

```javascript
let isMutating = false;

const observer = new MutationObserver((mutations) => {
  if (isMutating) return;

  isMutating = true;
  try {
    // Perform necessary DOM enhancements or attribute updates
    doDomModifications();
  } finally {
    // Clear out any internal mutations triggered by doDomModifications()
    observer.takeRecords();
    isMutating = false;
  }
});
```

---

## 3. Subtree & Attribute Filtering Heuristics

### Performance Rule of Thumb
- **Rule 1:** Never monitor `document.body` with `subtree: true` AND unfiltered `attributes: true`. Style animations, class toggles, and framework updates across the entire document will trigger massive callback overhead.
- **Rule 2:** Always specify `attributeFilter` when monitoring attribute states.

```javascript
// BAD: Triggers on every single class/style update across the entire page
observer.observe(document.body, { childList: true, subtree: true, attributes: true });

// GOOD: Targets specific container and specific state attributes
observer.observe(targetContainer, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['aria-expanded', 'aria-hidden', 'disabled']
});
```

---

## 4. Node Filtering Guidelines

Because `childList` mutations record *all* node types—including whitespace text nodes (`Node.TEXT_NODE`) and comment nodes (`Node.COMMENT_NODE`)—always filter for `Node.ELEMENT_NODE` before performing DOM operations.

```javascript
mutation.addedNodes.forEach((node) => {
  // Check if node is an HTML element
  if (node.nodeType === Node.ELEMENT_NODE) {
    // Safe to use Element APIs like querySelector, setAttribute, etc.
    node.setAttribute('data-visited', 'true');
  }
});
```
