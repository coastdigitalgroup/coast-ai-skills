# RFQ UX Heuristics & Persuasion Principles

This document compiles the foundational user experience (UX) and behavioral science principles that drive high conversion rates in B2B Request for Quote (RFQ) funnels.

---

## 1. Progressive Disclosure & The Sunk Cost Effect

A standard 15-field enterprise form creates immediate cognitive overload, triggering "form paralysis." To combat this, split the form using **progressive disclosure**—revealing information step-by-step as needed.

- **Cognitive Load Reduction:** By asking only 1–2 easy, visual questions on Step 1 (e.g., "What process do you need?"), the user faces near-zero entry friction. They begin moving.
- **The Sunk Cost Effect (Escalation of Commitment):** Once a user has spent 30 seconds choosing their manufacturing processes and entering project specifications in Steps 1 and 2, they have "invested" mental energy. When they reach Step 3 (which asks for contact details—traditionally a high-friction request), they are significantly more likely to complete it because abandoning the form would mean "wasting" their prior effort.
- **Roving Focus:** On transition, automatically scroll the viewport to the top of the next card/step container to preserve spatial awareness and keep keyboard users oriented.

---

## 2. Feedback Loops in File Uploads

Uploading blueprints or proprietary files (CAD, PDFs, Excel sheets) is the most anxiety-inducing and technically complex step of any RFQ process.

- **Immediate Validation:** Users need to know instantly if their file was successfully processed. A native `<input type="file">` element offers no visual cue during upload, leaving the user wondering if the site has crashed.
- **Visual Progress Bars:** Provide an asynchronous upload mechanism with a live progress bar. Progress bars satisfy the user's desire for system transparency and reduce perceived wait times.
- **DFM (Design for Manufacturability) Pre-analysis Cues:** In manufacturing, adding a loading spinner that says *"Analyzing part geometry for machining feasibility..."* builds immense professional trust. It transforms a boring data-upload box into an interactive engineering tool.
- **Fail-Safe Fallbacks:** Never make CAD uploading mandatory if early-stage prospects might only have a raw idea. Always provide a clear "I don't have drawings yet, skip this step" secondary link.

---

## 3. SLA Anchoring (Mitigating Speed Anxiety)

Procurement officers and project estimators operate under tight bid deadlines. When submitting an RFQ, their primary fear is the **"Black Hole" Effect**—that their designs will sit in an unmonitored inbox for days while their project slips behind schedule.

- **Explicit Timelines:** Vague phrases like "We will get back to you soon" increase anxiety. Replace them with specific, time-bound SLA promises (e.g., "Get your quote within 2 business hours").
- **Real-Time Indicators:** Displaying active signals (e.g., "Estimating office: OPEN. Current average response time: 38 minutes") leverages social proof and immediate gratification, boosting submission rates.
- **The First-Responder Advantage:** Studies in B2B sales velocity show that **35-50% of sales go to the vendor who responds first**. High-converting websites treat speed as a core marketing feature.

---

## 4. The Double-Conversion Frame (Momentum Conservation)

The highest-intent moment in a buyer's lifecycle is the exact second after they click "Submit" on a high-friction form. Most websites waste this momentum by showing a generic "Thank you" page, effectively killing the user's journey.

- **Conserve Conversion Momentum:** Instead of letting the session end, redirect the user to a custom, highly interactive success page that introduces the next logical step.
- **Humanizing the Sales Rep:** Show a high-quality photo and direct email/phone number of the specific estimating engineer assigned to their quote (e.g., "James Vance, Senior CNC Estimator"). This shifts the relationship from an anonymous utility to a human partnership.
- **The Instant Appointment Bridge:** By embedding a scheduling widget (such as Calendly or Chili Piper) right on the thank-you page, you capture the 30%+ of buyers who want to talk immediately. They book their technical review call, stop searching for other suppliers, and are successfully locked into your sales pipeline.
