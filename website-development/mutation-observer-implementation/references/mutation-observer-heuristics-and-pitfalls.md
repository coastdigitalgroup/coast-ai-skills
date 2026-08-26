# MutationObserver Heuristics & Pitfalls

Deep-dive reference guide covering browser engine implementation details, microtask scheduling mechanics, performance heuristics, memory leak pitfalls, and accessibility synchronization.

---

## 1. Microtask Scheduling & Browser Rendering Mechanics

### The Microtask Execution Boundary
`MutationObserver` callbacks do **not** run synchronously as DOM mutations happen. Instead, browser engines queue `MutationRecord` instances into a microtask queue.

1. **Synchronous JavaScript Execution:** DOM mutations are performed (e.g., `container.appendChild(el)`).
2. **Microtask Queue Processing:** Immediately after current synchronous script stack empties (and before the next Event Loop task or macro-task), the browser empties the microtask queue, executing `MutationObserver` callbacks.
3. **Style & Layout Recalculation:** The rendering pipeline calculates styles and layout for the next paint frame.

### Microtask vs. Animation Frame (rAF) Batching
- **Microtasks (`MutationObserver`):** Ideal for state synchronization, DOM sanitization, attribute normalization, and binding event handlers *before* paint.
- **RequestAnimationFrame (`rAF`):** Ideal if the mutation callback reads layout metrics (`getBoundingClientRect()`, `offsetWidth`) or performs visual animations. Wrap layout reads in `rAF` to prevent layout thrashing.

```javascript
// Preventing layout thrashing inside mutation callbacks
const observer = new MutationObserver((mutations) => {
  requestAnimationFrame(() => {
    // Perform layout reads and visual adjustments safely here
    for (const mutation of mutations) {
      if (mutation.target.offsetWidth > 500) {
        mutation.target.classList.add('wide-layout');
      }
    }
  });
});
```

---

## 2. Observer Option Heuristics & Performance Matrix

| Option Flag | Performance Impact | Use Case / Recommendation |
| :--- | :--- | :--- |
| `childList: true` | Low | Standard addition/removal of direct children. |
| `subtree: true` | **High** | Extends monitoring to all nested descendants. Use sparingly and pair with `attributeFilter`. |
| `attributes: true` | Medium | Track attribute edits. **Always** pair with `attributeFilter` when possible. |
| `attributeFilter: [...]` | **Optimized** | Highly recommended. Limits notification dispatch to specific attribute names. |
| `attributeOldValue: true` | Low-Medium | Stores previous attribute value in `record.oldValue`. Requires extra memory per record. |
| `characterData: true` | Medium | Monitors text node edits. Common in rich-text editors or live text widgets. |

---

## 3. Critical Failure Patterns & Pitfalls

### Pattern 1: The Infinite Mutation Loop
**Cause:** Modifying an observed attribute or appending a child node inside the callback without checking whether a change is needed or using a guard flag.

```javascript
// BAD: Infinite mutation loop
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    // Triggers another attribute mutation -> infinite callback recursion!
    m.target.setAttribute('data-visited', 'true');
  });
});
observer.observe(target, { attributes: true });

// GOOD: Recursion Guard or Value Check
let isMutating = false;
const observer = new MutationObserver((mutations) => {
  if (isMutating) return;
  isMutating = true;
  try {
    mutations.forEach(m => {
      if (!m.target.hasAttribute('data-visited')) {
        m.target.setAttribute('data-visited', 'true');
      }
    });
  } finally {
    isMutating = false;
  }
});
```

### Pattern 2: Missing Subtree Target Element Matching
**Cause:** Expecting `mutation.addedNodes` to contain only elements matching a selector, missing cases where an external script appends a wrapper `<div>` containing the target element.

```javascript
// BAD: Only checking top-level added nodes
mutation.addedNodes.forEach(node => {
  if (node.matches('.target-widget')) initWidget(node);
});

// GOOD: Checking top-level AND nested descendants
mutation.addedNodes.forEach(node => {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (node.matches('.target-widget')) initWidget(node);
  node.querySelectorAll('.target-widget').forEach(nested => initWidget(nested));
});
```

### Pattern 3: Detached Node Memory Retention
**Cause:** Storing `addedNodes` or `removedNodes` in global arrays or closure scopes without clearing them after processing.

```javascript
// GOOD: Clear references or use WeakSet for tracked elements
const processedElements = new WeakSet();

function handleAddedNode(node) {
  if (processedElements.has(node)) return;
  processedElements.add(node);
  // Setup node...
}
```

---

## 4. Accessibility & Live Region Synchronization

When `MutationObserver` detects dynamic content insertion (e.g., dynamic alert banners or toast notifications injected by unmanaged scripts), update an `aria-live` region or sync `aria-expanded` / `aria-hidden` attributes to inform screen reader users.

```javascript
// Syncing dynamic alerts to ARIA live region
const liveAnnouncer = document.getElementById('aria-live-announcer');

const alertObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.role === 'alert') {
        liveAnnouncer.textContent = node.textContent;
      }
    });
  }
});

alertObserver.observe(document.body, { childList: true, subtree: true });
```
