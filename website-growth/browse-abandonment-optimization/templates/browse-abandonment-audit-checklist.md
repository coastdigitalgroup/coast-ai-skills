# Browse Abandonment Audit & Optimization Checklist

## 1. PDP Browse Intent Diagnostic Checklist

Use this checklist to evaluate Product Detail Pages (PDPs) and high-density category pages for browse intent capture readiness.

### A. Intent Tracking & Telemetry Readiness
- [ ] **Image Gallery Telemetry:** Is image thumbnail clicking, carousel swiping, or zoom modal expansion tracked as intent events?
- [ ] **Variant Selector Telemetry:** Are size, color, or specification selections logged in the session state immediately upon click?
- [ ] **Accordion & Tab Expansion:** Are clicks on "Shipping & Delivery", "Sizing & Fit", "Materials", and "Reviews" tracked?
- [ ] **Dwell Time & Scroll Threshold:** Is time-on-page measured accurately alongside vertical scroll depth (e.g., >45 seconds + >60% scroll)?
- [ ] **Exit Trajectory Detection:** Is mouse velocity toward top tab bar / address bar detected on desktop? Is rapid scroll-up detected on mobile?

### B. Micro-Friction Identification
- [ ] **Price & Payment Clarity:** Are shipping costs, taxes, or installment payment options (BNPL) clearly stated near the price block?
- [ ] **Size & Fit Friction:** Is size guidance or fit accuracy data visible directly adjacent to size selection buttons?
- [ ] **Mobile CTA Visibility:** Does the primary "Add to Cart" button remain accessible or dock persistently when scrolling past hero fold?
- [ ] **Out-of-Stock Handling:** Are unavailable variant sizes greyed out with an inline "Notify Me When Available" option rather than a dead end?

### C. Nudge Presentation & Annoyance Controls
- [ ] **No Full-Screen Blocking Overlays:** Are browse recovery prompts delivered via non-blocking slide-over drawers, bottom toasts, or inline banners?
- [ ] **Frequency Capping:** Is active browse recovery limited to maximum 1 prompt per session and suppressed for 14 days upon dismissal?
- [ ] **Immediate Cart Suppression:** Do all browse triggers immediately disable the moment an item is added to the shopping cart?

---

## 2. Real-Time Browse Recovery Trigger Matrix

| Intent Level | Behavioral Trigger Condition | Recommended Intervention | Presentation Format | Primary Goal |
| :--- | :--- | :--- | :--- | :--- |
| **Low Intent** | Spend <15s, scroll <30%, no variant interaction | None (Allow uninterrupted browsing) | N/A | Passive exploration |
| **Moderate Intent (Mobile)** | Scroll past main CTA, spend >30s on PDP | Persistent Mobile Mini-Dock | Bottom docked bar (height <60px) | Instant one-tap cart addition |
| **Moderate Intent (Multi-Tab)** | Document tab switches to background (`visibilityState = hidden`) | Dynamic Tab Title & Favicon Update | Browser Tab Text + Top Toast on Return | Preserve session context |
| **High Intent (Fit Hesitation)** | Click 2+ size buttons, dwell >15s on size block | Inline Fit & Sizing Micro-Prompt | Inline banner above size selector | Eliminate sizing uncertainty |
| **High Intent (Price/Exit)** | BIS $\ge 5$, spend >45s, variant chosen, exit vector detected | "Save Session / Price Watch" Drawer | Slide-over drawer (Desktop) / Bottom sheet (Mobile) | Capture session link & email |

---

## 3. Browse Recovery UX Copy & Wireframe Specifications

### Template A: Slide-Over "Save Configured Session" Drawer

```text
+------------------------------------------------------------------+
| [X] Close                                                        |
|                                                                  |
|  [ SKU Thumbnail Image ]   STILL EVALUATING THIS ITEM?           |
|                            TrailGrip Pro Running Shoe            |
|                            Color: Slate Grey | Size: 10          |
|                            $140.00 (In Stock)                    |
|                                                                  |
|  Don't lose your configured size! Email yourself a direct link   |
|  to resume browsing anytime + get instant price drop alerts.     |
|                                                                  |
|  [ Enter your email address...                     ]             |
|  [ SAVE MY SESSION & GET ALERTS                    ]             |
|                                                                  |
|  🔒 We respect your privacy. No spam. 1-click unsubscribe.       |
+------------------------------------------------------------------+
```

### Template B: Mobile Sticky PDP Mini-Dock

```text
+------------------------------------------------------------------+
| [ Thumbnail ] TrailGrip Pro (Slate Grey - Size 10)               |
|               $140.00 | Free Shipping                            |
|                                         [ ADD TO CART - $140 ]   |
+------------------------------------------------------------------+
```

---

## 4. Anonymous Visitor Session Persistence Protocol (Code Snippet)

```javascript
// Lightweight Client-Side Browse State Manager
(function initBrowseTracker() {
  const STORAGE_KEY = 'strata_browse_state';

  function getBrowseState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { viewedSKUs: [], lastVariant: null, bisScore: 0 };
    } catch (e) {
      return { viewedSKUs: [], lastVariant: null, bisScore: 0 };
    }
  }

  function recordPDPView(skuData) {
    const state = getBrowseState();
    const existingIndex = state.viewedSKUs.findIndex(item => item.sku === skuData.sku);
    if (existingIndex > -1) {
      state.viewedSKUs.splice(existingIndex, 1);
    }
    state.viewedSKUs.unshift({
      sku: skuData.sku,
      title: skuData.title,
      price: skuData.price,
      selectedSize: skuData.selectedSize || null,
      selectedColor: skuData.selectedColor || null,
      timestamp: Date.now()
    });
    // Keep last 5 viewed items
    state.viewedSKUs = state.viewedSKUs.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  window.StrataBrowseTracker = {
    recordPDPView: recordPDPView,
    getBrowseState: getBrowseState
  };
})();
```
