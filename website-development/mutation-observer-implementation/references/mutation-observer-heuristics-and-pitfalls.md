# MutationObserver Heuristics, Spec Details, and Browser Pitfalls

This reference document outlines key technical specs, performance heuristics, microtask queue mechanics, and browser edge cases for `MutationObserver`.

---

## 1. `MutationRecord` Interface Reference

When mutations occur, the observer callback receives an array of `MutationRecord` objects representing the batched DOM alterations.

| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | `String` | Mutation category: `'childList'`, `'attributes'`, or `'characterData'`. |
| `target` | `Node` | The target DOM node affected by the mutation (parent container for `childList`, element for `attributes`, or `Text` node for `characterData`). |
| `addedNodes` | `NodeList` | List of added nodes (`Element`, `Text`, `Comment`, `DocumentFragment`). |
| `removedNodes` | `NodeList` | List of removed nodes. |
| `previousSibling` | `Node\|null` | The previous sibling of added/removed nodes, or `null`. |
| `nextSibling` | `Node\|null` | The next sibling of added/removed nodes, or `null`. |
| `attributeName` | `String\|null` | Name of the changed attribute (for `'attributes'`). |
| `attributeNamespace` | `String\|null` | Namespace of the changed attribute (e.g. SVG namespaces). |
| `oldValue` | `String\|null` | Prior value before mutation (if `attributeOldValue` or `characterDataOldValue` is `true`). |

---

## 2. Microtask Execution Order vs. Event Loop Timing

`MutationObserver` callbacks run asynchronously as **microtasks** queued at the end of the current JavaScript execution task:

```text
[ JavaScript Task Execution ]
          │
          ▼
[ DOM Mutations Occur ] ──► (Mutations collected into internal observer queue)
          │
          ▼
[ Synchronous Script Completes ]
          │
          ▼
[ Microtask Queue Flush ] ──► (MutationObserver callbacks run HERE)
          │
          ▼
[ Animation Frame Callbacks (rAF) ]
          │
          ▼
[ Style Recalculation & Layout (Reflow) ]
          │
          ▼
[ Screen Paint ]
```

### Performance Implication
Because mutation callbacks execute **before** `requestAnimationFrame` and before the browser recalculates styles/layout:
- Synchronous layout reads inside a mutation callback (e.g., `element.offsetWidth`, `getBoundingClientRect()`) force **synchronous layout calculation (layout thrashing)**.
- If performing measurements and applying styles in response to dynamic element additions, defer style updates to `requestAnimationFrame()` to allow the browser to batch style recalculations efficiently.

---

## 3. The Performance Impact of `subtree: true`

Enabling `subtree: true` forces the browser's DOM internal mutation dispatch mechanisms to check every descendant node mutation against the observer filters.

### Comparative Overhead Heuristics

| Configuration | DOM Mutation Cost | Recommendation |
| :--- | :--- | :--- |
| `childList: true, subtree: false` | Very Low (~0.01ms) | Ideal for container additions (lists, grids, feeds). |
| `attributes: true, attributeFilter: [...]` | Low (~0.05ms) | Best practice for state attributes (`data-state`, `disabled`). |
| `attributes: true` (no filter) | Medium (~0.3ms) | Avoid: fires on all framework internal attributes and `style` changes. |
| `childList: true, attributes: true, subtree: true` | High (~2.5ms - 15ms+) | Use with extreme caution. Mandatory filtering required. |

---

## 4. `takeRecords()` vs `disconnect()`

Understanding the difference between `takeRecords()` and `disconnect()` is vital for clean teardowns:

- `observer.disconnect()` stops the observer from collecting future mutations. However, any mutations that occurred during the current execution block that have **not yet been delivered** to the callback will be discarded unless `takeRecords()` is called first.
- `observer.takeRecords()` empties the observer's pending mutation record queue and returns the list of `MutationRecord` objects immediately.

### Proper Cleanup Pattern
```javascript
function cleanupObserver(observer, callback) {
  // 1. Drain pending undelivered mutations
  const pendingRecords = observer.takeRecords();
  if (pendingRecords.length > 0) {
    callback(pendingRecords, observer);
  }

  // 2. Disconnect observer
  observer.disconnect();
}
```

---

## 5. Browser Quirks & Edge Cases

1. **Text Node Fragmentation (`characterData`):** When observing `characterData` inside editable elements, text changes often create multiple split `Text` nodes or record modifications on inner `Text` nodes rather than the parent element. Always check `mutation.target.parentNode`.
2. **Dynamic `innerHTML` Replacement:** Setting `container.innerHTML = '...'` generates a `childList` record where `removedNodes` contains all previous children and `addedNodes` contains all new children in a single record.
3. **Shadow DOM Encapsulation Boundary:** A `MutationObserver` placed on a light DOM host element **will not observe mutations inside its Shadow Root** unless the observer is explicitly attached to `element.shadowRoot`.
4. **Third-Party Script Script Removal:** Some third-party ad scripts or chat widgets frequently remove and re-insert iframe elements during ad refresh cycles. Observers tracking `childList` on `document.body` must handle rapid remove/add cycles without leaking event listeners attached to old iframe elements.
