# Browse Intent Heuristics & Behavioral Rules

## 1. Cognitive Psychology of Browse Abandonment

Browse abandonment differs fundamentally from cart abandonment in terms of cognitive stage and purchasing commitment:

- **Cart Abandonment Stage (Evaluation to Action):** The user has made a high-commitment micro-decision. They intend to purchase, but encounter transaction friction (unexpected shipping costs, complex checkout forms, payment declines).
- **Browse Abandonment Stage (Exploration to Consideration):** The user is actively weighing alternatives, resolving internal micro-objections, or simply gathering information. Interrupting this stage with hard sales pressure or aggressive discounts introduces psychological reactant resistance.

### Primary Psychological Drivers of Browse Hesitation

1. **Choice Overload & Decision Fatigue:** When presented with numerous colorways, size variations, or similar related products, users experience evaluation paralysis and exit to "think it over".
2. **Perceived Risk of Wrong Choice:** Lack of confidence in product fit, material feel, color accuracy, or return policies creates unresolved risk.
3. **Price & Value Calibration:** The user is comparing prices across multiple competitor tabs. They need clear proof of value, free shipping thresholds, or price drop assurance before committing.
4. **Context Disruption:** Browsing on mobile during transit or short breaks leads to session interruption. Users intend to return later on desktop but lack an easy way to save their exact setup.

---

## 2. Browse Intent Scoring (BIS) Heuristic Framework

To ensure interventions are delivered only to high-intent evaluators, calculate a real-time **Browse Intent Score (BIS)** during the session.

$$\text{BIS} = w_1 \cdot \text{DwellTimeScore} + w_2 \cdot \text{GalleryDepth} + w_3 \cdot \text{VariantSelection} + w_4 \cdot \text{AccordionInteractions} + w_5 \cdot \text{ReviewDwell}$$

### Scoring Rubric Table

| Action Event | Point Value | Rationale |
| :--- | :--- | :--- |
| **Dwell Time > 30 seconds on PDP** | +1 Point | Confirms baseline reading engagement |
| **Dwell Time > 60 seconds on PDP** | +2 Points | High engagement; deep content consumption |
| **View $\ge 3$ Image Thumbnails / Open Zoom** | +2 Points | Strong visual evaluation intent |
| **Select Specific Size or Specification** | +3 Points | Explicit intent to evaluate personal suitability |
| **Toggle Color / Material Swatches** | +1 Point | Aesthetic evaluation and comparison |
| **Expand Shipping / Delivery Accordion** | +2 Points | Fulfillment and transaction feasibility evaluation |
| **Scroll to & Dwell on Customer Reviews** | +2 Points | Social proof and peer verification search |
| **Rapid Scroll Up / Cursor Exit Trajectory** | Trigger Vector | Indicates impending exit event |

### Activation Threshold Rules

- **Score 0–2 (Casual Browser):** Zero active interventions. Suppress all popups and notifications.
- **Score 3–4 (Engaged Evaluator):** Enable subtle passive nudges (e.g., sticky mobile CTA bar, inline fit indicators).
- **Score $\ge$ 5 (High-Intent Evaluator):** Qualifies for active browse recovery drawer if an exit trajectory or tab switch occurs.

---

## 3. Mobile vs. Desktop Exit Trajectory Detection Rules

Since mobile viewports lack cursor movement telemetry (`mouseleave`/`mouseout`), intent triggers must rely on alternative touch and scrolling behaviors:

### Desktop Exit Telemetry
- **Mouse Out of Viewport Top:** Detect `mouseleave` events where `clientY <= 0` combined with rapid upwards cursor velocity toward the browser tab bar or window close button.
- **Tab Inactivity:** Detect `visibilitychange` API events (`document.visibilityState === 'hidden'`) lasting $>15$ seconds.

### Mobile Intent Telemetry
- **Rapid Scroll Up:** Detect a sudden upward scroll velocity exceeding $1.5 \text{ px/ms}$ after spending $>30$ seconds on page (indicating navigation back to the browser URL bar or back button).
- **Idle Dwell on Variant Selector:** Detect $>15$ seconds of zero touch interaction following a size selection event.
- **History Back Navigation:** Intercept pushState history events when a user taps the physical or OS back button on high-intent PDPs to render a quick bottom sheet before navigation completes.

---

## 4. Privacy & User Experience Guardrails

1. **Non-Blocking Principle:** Interventions must never block the user's view of product title, price, primary image, or primary "Add to Cart" button.
2. **1-Tap Dismissal:** Any slide-over or bottom drawer must feature a prominent, easily tappable `Close (X)` button ($\ge 44 \times 44\text{px}$ touch target).
3. **Session Memory & Restraint:** Never present more than 1 active browse intervention per session, regardless of how many PDP pages the user visits.
