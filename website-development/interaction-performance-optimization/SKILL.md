---
name: interaction-performance-optimization
description:
  Identify and resolve bottlenecks in the interaction lifecycle to improve
  Interaction to Next Paint (INP) by breaking up long tasks, yielding to the
  main thread, and optimizing rendering.
---

# Interaction Performance Optimization (INP)

## Purpose

The Interaction Performance Optimization skill provides a technical protocol for
minimizing the delay between a user's interaction (click, tap, keypress) and the
next visual update on the screen. It focuses on optimizing the three phases of
an interaction: **Input Delay**, **Processing Time**, and **Presentation Delay**.
This directly improves user-perceived responsiveness and Interaction to Next
Paint (INP) scores.

## Use Cases

- Fixing "janky" buttons or links that don't respond immediately when clicked.
- Optimizing complex UI updates (e.g., filtering a large list, opening a heavy
  modal) that freeze the main thread.
- Improving Core Web Vitals (specifically INP) to "Good" status (< 200ms).
- Debugging long-running JavaScript tasks that block high-priority user input.

## When NOT to Use

- **Static Content:** Pages with no interactive elements or very simple
  navigation don't benefit from INP optimization.
- **Background Processes:** Tasks that don't need to provide immediate feedback
  to the user (e.g., analytics pings) should be deferred using
  `requestIdleCallback` rather than optimized for INP.
- **Server-Side Latency:** If the delay is caused by a slow API response, focus
  on backend performance or "optimistic UI" patterns rather than INP yielding.

## Inputs

1. **Performance Audit Data:** INP scores and "Long Task" entries from Chrome
   DevTools Performance panel or Lighthouse.
2. **Event Trace:** A recording of the specific interaction that is slow,
   identifying which event handlers are firing.
3. **Task Inventory:** Identification of heavy JavaScript functions (loops,
   complex calculations, large DOM manipulations) triggered by interactions.

## Outputs

1. **Yielding Interaction Logic:** Refactored event handlers that break up long
   tasks using `scheduler.yield()`, `setTimeout()`, or `requestAnimationFrame()`.
2. **Optimized Render Strategy:** Implementation of "Optimistic UI" or
   incremental updates to reduce Presentation Delay.
3. **Priority-Aware Scheduling:** Use of the Prioritized Task Scheduling API
   (e.g., `scheduler.postTask()`) where appropriate.

## Workflow

### 1. Identify the Bottleneck

- Record the interaction in the Chrome DevTools **Performance** panel.
- Look for the **Interactions** track to see the INP duration.
- Expand the **Main** track to identify "Long Tasks" (marked with a red corner).
- Break down the duration into:
  - **Input Delay:** Time between input and event handler start.
  - **Processing Time:** Time spent executing event handlers.
  - **Presentation Delay:** Time spent calculating layout and painting.

### 2. Reduce Input Delay

- **Keep the Main Thread Clear:** Minimize non-essential JavaScript execution
  during page load or idle periods to ensure the thread is free when the user
  interacts.
- **Yield Early:** If a task is running when the user interacts, the browser
  must wait for it to finish. Break up large non-interactive tasks into smaller
  chunks.

### 3. Minimize Processing Time (Yielding)

- **The 50ms Rule:** No single task should exceed 50ms.
- **Break Up Loops:** Instead of processing 1000 items in one loop, process
  them in chunks of 100, yielding to the browser between chunks.
- **Modern Yielding:** Use `await scheduler.yield()` (if supported) to allow the
  browser to process pending inputs and rendering before continuing the task.
- **Fallback Yielding:** Use `await new Promise(resolve => setTimeout(resolve, 0))`
  for wider browser support.

### 4. Optimize Presentation Delay

- **Avoid Layout Thrashing:** Do not alternate between reading and writing DOM
  properties (e.g., reading `offsetHeight` then setting `style.height`).
- **Batch DOM Updates:** Perform all reads first, then all writes.
- **Prioritize Visual Feedback:** Update the UI immediately to show "Loading"
  or "Processing" before starting the heavy computation.

### 5. Leverage Priority APIs

- Use `scheduler.postTask()` for non-critical work, setting the priority to
  `background` or `user-visible` to avoid competing with `user-blocking` input
  handlers.

## Decision Rules

- **Yielding vs. Web Workers:** Use **Web Workers** for pure computational
  tasks (e.g., data processing) that don't need DOM access. Use **Yielding** for
  tasks that must interact with the DOM or the main thread state.
- **`setTimeout` vs. `requestAnimationFrame`:** Use `requestAnimationFrame` for
  work that should happen just before the next paint. Use `setTimeout(0)` or
  `scheduler.yield()` for work that can wait for the next event loop turn.
- **Immediate vs. Deferred:** If a UI change is critical (e.g., opening a menu),
  do it immediately. If it's secondary (e.g., loading more data), defer it.

## Constraints

- **Browser Support:** `scheduler.yield()` and `scheduler.postTask()` are modern
  APIs. Always provide fallbacks for older browsers.
- **Complexity:** Yielding introduces asynchronous behavior. Ensure state
  consistency is maintained between chunks (e.g., handling "Cancel" actions
  mid-process).

## Non-Goals

- Improving Largest Contentful Paint (LCP) or First Contentful Paint (FCP).
- General JavaScript code minification or bundle size reduction.
- Server-side performance tuning or database optimization.

## Common Failure Patterns

- **Synchronous Heavy Loops:** Running a `forEach` over 10,000 items inside a
  click handler, causing the UI to freeze for seconds.
- **Layout Thrashing:** Repeatedly reading `getBoundingClientRect()` in a loop
  while modifying the DOM.
- **Awaiting the Wrong Thing:** Awaiting an API response *before* showing a
  loading state, leading to a "dead" button feel.
- **Excessive Yielding:** Yielding too frequently (e.g., every 1ms), which can
  add significant overhead and actually slow down the total task time.

## Validation Criteria

- [ ] **Performance Panel Check:** Verify that the interaction in DevTools no
      longer shows a "Long Task" and the INP time is < 200ms.
- [ ] **Visual Test:** Confirm the UI responds immediately (e.g., a button
      shows a pressed state or a spinner) regardless of the heavy work behind
      the scenes.
- [ ] **Throttling Test:** Use "6x CPU Slowdown" in DevTools to simulate
      lower-end devices and ensure the interaction remains responsive.
- [ ] **Console Audit:** Use the `web-vitals` library to log INP values and
      ensure they meet the "Good" threshold in real-user scenarios.
