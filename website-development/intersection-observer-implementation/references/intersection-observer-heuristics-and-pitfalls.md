# IntersectionObserver Technical Reference & Pitfalls

## 1. Browser Execution Gotchas

### Initial Callback Firing
By spec design, an `IntersectionObserver` instance **always** schedules an initial callback invocation as soon as `observer.observe(target)` is called—even if the element is hundreds of pixels outside the viewport.

```javascript
// WRONG: Assuming callback only runs on actual screen entry
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // This will run on initial observe() call even if target is offscreen!
    triggerAnimation(entry.target);
  });
});

// CORRECT: Guarding against offscreen initial execution
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return; // Skip offscreen initial execution
    triggerAnimation(entry.target);
  });
});
```

### `rootMargin` Parsing Rules
The `rootMargin` string follows CSS syntax rules for margin shorthand (`top right bottom left`), but **must have explicit units** (`px` or `%`).

- **Valid:** `'100px'`, `'10% 0px 10% 0px'`, `'0px 0px -50px 0px'`
- **Invalid:** `'100'` (missing unit), `'10px 5px'` (incomplete shorthand in older spec implementations), `'10em'` (em/rem units are NOT allowed in `rootMargin`).

---

## 2. Threshold Mechanics & Array Step Math

When calculating multi-step thresholds (e.g., for progress bars, opacity fading, or heading section tracking), construct step arrays deterministically:

```javascript
// Build 101 thresholds from 0.0 to 1.0 in steps of 0.01 (1%)
const granularThresholds = Array.from({ length: 101 }, (_, i) => i / 100);

// Build 5 coarse thresholds [0, 0.25, 0.5, 0.75, 1.0]
const coarseThresholds = [0, 0.25, 0.5, 0.75, 1.0];
```

*Note: High-density threshold arrays increase main-thread callback frequency during fast scrolling. Use granular arrays sparingly.*

---

## 3. Custom Root Scroll Containers & Overflow Clipping

When targets are inside an `overflow: auto` or `overflow: scroll` container:

1. If `root: null` (default viewport): The element's intersection is clipped **both** by its relative scroll container AND the main viewport.
2. If `root: containerElement`: Intersection ratio is calculated relative to `containerElement` boundaries. `containerElement` MUST be an ancestor of `target`.

---

## 4. Memory Leak Diagnostics in SPAs

Detached DOM nodes remain in memory if an `IntersectionObserver` keeps a reference to them in its internal target registry.

### Debugging Steps in Chrome DevTools:
1. Open **DevTools** > **Memory** tab.
2. Take a **Heap Snapshot**.
3. Perform view transition or dynamic DOM node removal in your application.
4. Take a second **Heap Snapshot** and filter by `Detached HTMLDivElement` (or target tag).
5. If retained, inspect the retaining tree. If `IntersectionObserver` appears in the retainer path, ensure `.unobserve(el)` was invoked prior to node removal.
