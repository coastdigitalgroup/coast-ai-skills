---
name: web-worker-implementation
description:
  Implement and debug Web Workers to offload heavy computations, data
  processing, and background tasks from the main thread to ensure smooth UI
  responsiveness.
---

# Web Worker Implementation

## Purpose

The Web Worker Implementation skill provides a technical protocol for moving
intensive JavaScript execution off the main thread. It solves the problem of UI
freezing ("jank") caused by long-running scripts, ensuring that the browser
remains responsive to user input (clicks, scrolls, typing) while complex tasks
are processed in the background.

## Use Cases

- **Heavy Data Processing:** Filtering, sorting, or aggregating large datasets
  (e.g., > 10,000 items).
- **Image/Video Manipulation:** Client-side image processing, filtering, or
  canvas-based operations.
- **Complex Mathematical Calculations:** Cryptography, physics simulations, or
  data-intensive algorithms.
- **Background Polling/Syncing:** Managing persistent connections or large
  state synchronizations without interrupting UI animations.
- **Parsing Large Payloads:** Decompressing or parsing massive JSON or XML
  files that would otherwise block the main thread.

## When NOT to Use

- **DOM Manipulation:** Workers cannot access the DOM. If your task is purely
  about updating the UI, it must stay on the main thread.
- **Small, Fast Tasks:** The overhead of spawning a worker and the latency of
  message passing (serialization) can make a 10ms task take longer in a worker
   than on the main thread.
- **Simple API Calls:** Standard `fetch()` calls are already asynchronous and
  don't block the main thread; you only need a worker if you're doing heavy
  processing on the *result*.
- **Legacy Browser Requirements:** If you must support very old browsers (e.g.,
  IE9 and below) without a fallback strategy.

## Inputs

1. **The Task Logic:** The specific function or algorithm to be offloaded.
2. **Input Data:** The data to be processed (must be serializable via the
   Structured Clone algorithm).
3. **Worker Script:** A separate JavaScript file (or a Blob/Data URI) containing
   the worker code.

## Outputs

1. **Worker Script File:** A standalone `.js` file containing the background
   logic.
2. **Main Thread Integration:** Logic to instantiate the `Worker`, send data via
   `postMessage()`, and handle results via the `message` event.
3. **Promise-based Wrapper:** (Recommended) A clean interface for the rest of
   the application to "await" worker results.
4. **Cleanup Logic:** Implementation of `worker.terminate()` or `self.close()` to
   prevent memory leaks.

## Workflow

### 1. Identify the Bottleneck
Use the Chrome DevTools **Performance** panel to identify long-running tasks
(marked with a red corner) that exceed 50ms and are not related to layout or
paint.

### 2. Isolate the Logic
Extract the heavy computation into a separate file. Ensure it does not rely on
global variables like `window`, `document`, or `parent`.

### 3. Implement the Worker Script
Inside the worker file, listen for the `message` event:
```javascript
self.onmessage = (event) => {
  const result = heavyCalculation(event.data);
  self.postMessage(result);
};
```

### 4. Instantiate and Communicate from Main
```javascript
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (event) => {
  console.log('Result from worker:', event.data);
};
```

### 5. Implement Error Handling
Listen for `error` events on the worker instance to catch runtime issues in the
background thread.

### 6. Manage Lifecycle
Terminate the worker when it's no longer needed to free up system resources.

## Decision Rules

- **Dedicated Worker vs. Shared Worker:** Use **Dedicated Workers** (standard)
  for tasks specific to a single page. Use **Shared Workers** only if multiple
  tabs/windows need to share the same state or connection.
- **Inline vs. External File:** Use an **External File** for most cases (better
  caching, cleaner separation). Use an **Inline Blob/URL** only if the worker
  logic is small and you need to avoid extra network requests.
- **Structured Clone vs. Transferables:** Use **Structured Clone** (default) for
  most data. Use **Transferables** (e.g., `ArrayBuffer`, `ImageBitmap`) when
  passing massive amounts of data to avoid the cost of copying.

## Constraints

- **No DOM Access:** Workers cannot access `window`, `document`, or UI elements.
- **Structured Clone Limitations:** You cannot pass Functions, DOM nodes, or
  complex class instances (with methods) through `postMessage` unless they
  are specifically handled.
- **Origin Policy:** The worker script must be served from the same origin as
  the main page.

## Non-Goals

- Building a general-purpose "threading" library.
- Implementing Service Workers (for caching and offline support).
- Handling server-side Node.js Worker Threads.

## Common Failure Patterns

- **Serialization Bottleneck:** Passing massive, complex objects that take
  longer to "clone" than to process.
- **The "Zombie" Worker:** Forgetting to `terminate()` workers, leading to
  memory leaks as new workers are spawned repeatedly.
- **Dependency Confusion:** Trying to `import` modules in a worker without the
  correct `type: "module"` configuration.
- **Main Thread Blocking:** Still performing preparation or post-processing
  steps on the main thread that are heavy enough to cause jank.
- **Global Context Errors:** Assuming `this` or `self` refers to `window`.

## Validation Criteria

- [ ] **UI Responsiveness Test:** Run the heavy task and verify that animations
      (like a CSS spinner) remain perfectly smooth (60fps).
- [ ] **Performance Panel Audit:** Verify in DevTools that the "Main" thread
      is clear during the computation and the work appears in a "Worker" track.
- [ ] **Error Handling Check:** Intentionally throw an error in the worker and
      ensure the main thread catches it via the `error` event.
- [ ] **Memory Audit:** Verify in the Task Manager or Memory panel that the
      number of active workers doesn't grow indefinitely over time.
- [ ] **Structured Clone Test:** Ensure the data returned from the worker
      maintains its integrity (e.g., Dates, Sets, and Maps are correctly
      reconstituted if supported).
