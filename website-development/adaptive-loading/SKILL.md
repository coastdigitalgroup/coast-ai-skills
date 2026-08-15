---
name: adaptive-loading
description:
  Dynamically adapt asset loading, component complexity, animations, and prefetching
  based on browser-native network connection and hardware capability APIs.
---

# Adaptive Loading & Device-Aware Optimization

## Purpose

The Adaptive Loading skill provides a programmatic protocol for adjusting website performance and feature delivery based on the user's current environment. Rather than applying a single "responsive design" strategy that only adapts layout to viewport width, Adaptive Loading queries native browser APIs to detect real-time network speeds, hardware constraints (CPU/memory), and user-defined data-saving preferences. This solves the "device capability and network inequality" problem, ensuring that low-end devices on slow connections remain fast and usable, while high-end devices on fast connections receive the fully rich, high-fidelity experience.

## Use Cases

- **Dynamic Hero Backgrounds:** Substituting a heavy auto-playing `<video>` with a lightweight static image poster or highly-optimized CSS animation when the user is on 3G or has `saveData` enabled.
- **Resource Prefetching and Speculation:** Disabling prefetching (`prefetch`), prerendering (`prerender`), and Speculation Rules on slow connections or low-end devices to save user data and hardware thread bandwidth.
- **High-Overhead Interactions:** Skipping heavy JavaScript calculations, interactive 3D WebGL canvases, or complex animations when device memory is low (< 4GB) or processor count is low (< 4 cores).
- **Responsive Media Adaptation:** Loading standard-definition or heavily compressed images instead of high-definition resources for users on flaky, high-latency, or metered connections.
- **Progressive Enhancement of UI Features:** Suppressing infinite scrolling (switching to a manual "Load More" button) if the network cannot handle rapid consecutive page chunks.

## When NOT to Use

- **Static, Low-Resource Pages:** If a website is lightweight (< 100kb total transfer size) and has minimal script overhead, implementing adaptive loading logic adds unnecessary complexity and maintenance.
- **Static Asset Compilation (Build-time):** This skill is client-side and dynamic. It does not replace build-time image sizing or bundler-level code splitting, which must be set up regardless of device capabilities.
- **Core Critical Functionality:** Never adaptively disable features that are essential to the primary goal of the page (e.g., disabling the checkout button or search functionality on low-end devices). Adaptive loading only targets optional, high-overhead enhancements.

## Inputs

1. **Hardware Capability APIs:**
   - `navigator.deviceMemory`: Approximate amount of device memory in gigabytes (e.g., `0.5`, `1`, `2`, `4`, `8`).
   - `navigator.hardwareConcurrency`: Number of logical processor cores available (e.g., `2`, `4`, `8`, `12`).
2. **Network Information API:**
   - `navigator.connection.effectiveType`: Current network connection speed profile (`'slow-2g'`, `'2g'`, `'3g'`, `'4g'`).
   - `navigator.connection.saveData`: Boolean indicating if the user has enabled the browser's data-saving/metered-connection option.
   - `navigator.connection.rtt`: Round-trip time estimate in milliseconds.
3. **User-Preference Media Queries:**
   - `prefers-reduced-data`: Standard media query indicating if the user wants to minimize data usage (active via `window.matchMedia('(prefers-reduced-data: reduce)')`).
   - `prefers-reduced-motion`: Standard media query indicating if the user wants to minimize optional motion and transitions.

## Outputs

1. **Adaptive Loading Utility:** A centralized JavaScript helper that maps environment inputs into clear device and network tiers (e.g., `'low'`, `'medium'`, `'high'`).
2. **Conditional Component Markup:** DOM structures and components that dynamically swap, load, or unload themselves based on the target tier.
3. **Optimized Speculative Links:** Prefetching logic that selectively registers speculative triggers based on network speed and metered connections.

---

## Workflow

### 1. Establish the Capability Profile
Since network speeds and memory reports can vary during a session (especially network speed), write a helper that combines hardware capabilities and connection profiles into three primary tiers: **Low**, **Medium**, and **High**.

```javascript
function getDeviceCapability() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  // 1. Check for explicit data-saving preference (User Choice First)
  const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  const saveData = conn ? conn.saveData : false;

  if (prefersReducedData || saveData) {
    return { tier: 'low', reason: 'data-saver' };
  }

  // 2. Evaluate Network Connection
  const effectiveType = conn ? conn.effectiveType : '4g';
  if (['slow-2g', '2g', '3g'].includes(effectiveType)) {
    return { tier: 'low', reason: 'slow-network' };
  }

  // 3. Evaluate Hardware constraints
  const memory = navigator.deviceMemory || 8; // Fallback to 8GB if API unsupported
  const cores = navigator.hardwareConcurrency || 4; // Fallback to 4 cores if API unsupported

  // If memory is 2GB or less, or CPU cores are 2 or less, categorize as low-end
  if (memory <= 2 || cores <= 2) {
    return { tier: 'low', reason: 'low-hardware' };
  }

  // Medium tier: 4GB memory or 4 CPU cores
  if (memory <= 4 || cores <= 4) {
    return { tier: 'medium', reason: 'medium-hardware' };
  }

  // High tier: >4GB memory and >4 CPU cores on a strong 4G+ connection
  return { tier: 'high', reason: 'premium' };
}
```

### 2. Implement Dynamic Component Swapping
Instead of hardcoding high-overhead elements, load them conditionally using dynamic imports (`import()`) or component initialization scripts.

#### Example: Background Video vs. Static Image
```javascript
const { tier } = getDeviceCapability();
const heroContainer = document.querySelector('.hero-background');

if (tier === 'high') {
  // Load and play the high-fidelity video
  heroContainer.innerHTML = `
    <video autoplay muted loop playsinline class="video-bg">
      <source src="/assets/hero-bg.webm" type="video/webm">
      <source src="/assets/hero-bg.mp4" type="video/mp4">
    </video>
  `;
} else {
  // Fall back to a highly-compressed, static poster image
  heroContainer.innerHTML = `
    <div class="image-bg" style="background-image: url('/assets/hero-poster-opt.jpg');"></div>
  `;
}
```

### 3. Implement Connection-Aware Speculative Prefetching
Before prefetching the next page in the background (which wastes user bandwidth on metered plans and saturates CPU cycles on low-end devices), verify the capability tier.

```javascript
function speculativePrefetch(url) {
  const { tier } = getDeviceCapability();

  // Only prefetch if the user is on a high-tier setup (fast network, unlimited data)
  if (tier !== 'high') {
    console.log(`Speculative prefetch skipped for ${url} (Tier: ${tier})`);
    return;
  }

  // Inject prefetch tag
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}
```

### 4. Adjust Animation & Interactive Heavyweights
For WebGL, heavy SVG paths, or particle effects, check memory and processor limits to determine whether to load a simplified layout or completely disable the interactive script.

```javascript
// Check CPU and memory before initiating heavy Three.js or canvas canvas particle systems
function initInteractiveExperience() {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (memory < 4 || cores < 4) {
    // Render static, clean CSS alternative
    document.body.classList.add('use-simplified-visuals');
    return;
  }

  // Dynamically load heavy interactive script only for capable devices
  import('./heavy-webgl-canvas.js')
    .then((module) => {
      module.startInteractiveScene();
    })
    .catch((err) => console.error('Failed to load canvas module:', err));
}
```

### 5. Listen for Network Changes
Users on mobile devices switch constantly between cell towers, Wi-Fi networks, and tunnels. Listen for connection changes to dynamically downgrade or upgrade features during the session.

```javascript
const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (conn) {
  conn.addEventListener('change', () => {
    console.log(`Network connection changed to: ${conn.effectiveType}`);
    // Trigger UI updates or asset adjustments based on new connection state
    applyAdaptiveAdjustments();
  });
}
```

---

## Decision Rules

### How to Map Connection and Hardware to Tiers

| Condition | Recommended Tier | Correct Actions |
| :--- | :--- | :--- |
| `saveData === true` or `prefers-reduced-data` active | **Low** | Disable all background video, disable prefetching, load heavily optimized low-res media, use static fallbacks. |
| `effectiveType === 'slow-2g'` or `'2g'` or `'3g'` | **Low** | Prevent background video download, skip prefetching, defer non-critical CSS/JS, load compressed webp. |
| `deviceMemory <= 2` or `hardwareConcurrency <= 2` | **Low** | Avoid dynamic DOM updates, disable particle effects, omit heavy Canvas or WebGL modules, render simple list layout. |
| `deviceMemory === 4` or `hardwareConcurrency === 4` | **Medium** | Allow static background images, allow standard CSS transitions, limit prefetching to 1 high-priority link. |
| `deviceMemory > 4` and `hardwareConcurrency > 4` on `4g` | **High** | Full rich video background, enable advanced canvas/WebGL visual enhancements, prefetch next expected routes. |

---

## Constraints

- **API Availability & Fallbacks:** Many of these APIs are Chromium-only (`navigator.deviceMemory`, `navigator.connection`). Your code **must** assume they are undefined in Firefox or Safari and fall back to safe, standard values (such as treating them as a medium-to-high tier device while respecting standard media queries like `prefers-reduced-motion` and `prefers-reduced-data`).
- **Accuracy Heuristics:** `navigator.deviceMemory` values are rounded to the nearest power of 2 (capped at 8GB to prevent fingerprinting). Do not rely on them for precise system profiling.
- **CUP/Thread Locking:** Dynamic imports must not block the main thread. Always handle the promise rejection when loading optional modules dynamically.

## Non-Goals

- Implementing offline routing or offline databases (this is the concern of Service Workers and IndexedDB, see `client-side-storage-management`).
- Build-time media generation (compiling different sizes of images is outside the scope of this client-side runtime skill).
- Core layout responsibilities (responsive breakpoints must be handled via standard CSS Media Queries).

---

## Common Failure Patterns

- **Over-relying on Chromium APIs:** Writing code that crashes on Firefox or Safari because `navigator.connection` is undefined. Always use robust existence checks.
- **Fingerprinting Redundancy:** Writing complex scoring algorithms to guess device tier instead of using simple, coarse power-of-2 checks, causing excessive main-thread work.
- **Stale Network Assumptions:** Fetching `effectiveType` once at load time and ignoring connection changes when a mobile user enters an elevator or underground train.
- **Adapting Essential Features:** Hiding or disabling critical transactional elements (such as "Add to Cart" or "Reset Password" forms) because the device was flagged as "low-end." This is an accessibility and UX failure.
- **Double Fetching:** Incorrectly swapping a video element after the browser has already initiated its download, resulting in the user fetching *both* the video and the fallback poster image.

---

## Validation Criteria

- [ ] **Existence Checks:** Verify in the console that the application loads perfectly in Safari (where Connection and DeviceMemory APIs are absent) and falls back to a functional, stable state.
- [ ] **Network Throttling Test:** Open the Chrome DevTools Network panel, set throttling to "Slow 3G," reload, and verify that the video background is bypassed and speculative prefetch calls are correctly skipped.
- [ ] **User Preference Test:** In Chrome, enable the "Group/Save Data" or toggle the `prefers-reduced-data` emulation in the DevTools rendering tab. Confirm that the application immediately transitions to the low-data/low-performance tier.
- [ ] **Memory Emulation Test:** Test with mocked `navigator.deviceMemory` properties (e.g. `Object.defineProperty(navigator, 'deviceMemory', { value: 1 })`) and ensure that heavy interactions/animations are bypassed.
- [ ] **Console Audit:** Confirm that no JS errors or promise rejections occur during dynamic module imports under heavy network latency simulation.
