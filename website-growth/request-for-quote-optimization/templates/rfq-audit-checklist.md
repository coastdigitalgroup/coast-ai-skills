# Request for Quote (RFQ) Audit Checklist & Template

Use this comprehensive, action-oriented template to audit, score, and remediate Request for Quote (RFQ) funnels on B2B, industrial, manufacturing, or custom enterprise website portals.

---

## Part 1: Quick-Score Usability Audit

Evaluate the target RFQ funnel against these 15 core heuristics. Score each item:
- **[2] Fully Implemented:** Best-practice followed; no obvious friction.
- **[1] Partially Implemented:** Present but sub-optimal (e.g., hidden, slow, or complex).
- **[0] Not Implemented:** Missing completely; severe conversion leakage.

### 1. Entry & Barrier Reduction
- [ ] **No Registration Wall:** Users can request a quote as a guest without creating an account first.
- [ ] **Distraction-Free Mode:** Global navigation, footers, and sidebars are hidden or minimized within the RFQ funnel to focus 100% attention on form completion.
- [ ] **Mobile-Optimized Layouts:** The form is entirely single-column on mobile, with large touch targets (minimum 44x44px) for all selectors.

### 2. Form Architecture & Progressive Disclosure
- [ ] **Progressive Disclosure (Multi-Step):** Long spec configurations (5+ fields) are broken into logical steps (e.g., Category -> Specs -> Contact Info).
- [ ] **Visual Progress Indicator:** A clear, horizontal progress bar is visible showing exactly what step the user is on and how many remain.
- [ ] **Early Email Capture:** The work/business email field is positioned in Step 1 or early in Step 2 to allow for abandoned RFQ cart recovery sequences.

### 3. File Upload & Technical Usability
- [ ] **Interactive Drop Zone:** File upload areas are clearly distinguished with a dashed drag-and-drop region, not just a native browser "Choose File" button.
- [ ] **Explicit Format & Size Guidelines:** Supported file types (e.g., STEP, IGES, PDF, ZIP) and maximum file size limits (e.g., 50MB) are printed directly on the screen.
- [ ] **Dynamic Upload Feedback:** The page shows a real-time progress bar, file size indicator, and validation status immediately upon dragging a file, rather than making the user wait for form submission.

### 4. SLA & Trust Signaling
- [ ] **Explicit Response SLA:** A firm, quantifiable response-time guarantee is displayed adjacent to the final CTA (e.g., "Quotes delivered within 4 business hours").
- [ ] **Regulatory & Compliance Trust Badges:** Industry-specific standards (e.g., ISO 9001, AS9100, ITAR, SOC2, GDPR, HIPAA) are visible directly within the form boundaries.
- [ ] **Privacy & NDA Assurance:** A clear security/confidentiality statement is positioned below the file uploader (e.g., "All uploads secured with AES-256 encryption. MNDA signed on request").

### 5. Success State & Sales Velocity
- [ ] **Custom Redirect Success Page:** The user is immediately redirected to a custom success page on the primary domain rather than seeing a generic inline message.
- [ ] **Assigned Representative Clarity:** The success page names the specific estimator or territory manager assigned to the request, showing a real profile photo.
- [ ] **High-Intent Instant Scheduler:** An online calendar tool (e.g., Calendly, Chili Piper) is embedded on the thank-you page to capture prospects ready to discuss specifications instantly.

---

## Scoring Summary Matrix

| Total Score | Conversion Health | Primary Recommendation |
|---|---|---|
| **25 to 30** | Excellent | High-performing funnel. Run micro-copy A/B testing on CTA buttons and headline anchoring to capture remaining gains. |
| **15 to 24** | Moderate Friction | Leaking active pipeline. Prioritize breaking the form into a multi-step flow and introducing a prominent response SLA guarantee. |
| **0 to 14** | Critical Failure | Severe cognitive overload. Immediately remove registration walls, implement guest CAD uploading, and simplify qualification fields. |

---

## Part 2: Form Field Refinement Spec (Template)

Use this table to audit existing fields, strip out administrative waste, and spec out the optimized multi-step layout:

### Stage 1: The Project Hook (Zero-Commitment)
*Goal: Capture high-level intent with low visual friction.*

| Existing Field Name | Action (Keep / Kill / Postpone) | Optimized Input Type | Label / Helper Text | Validation / Logic |
|---|---|---|---|---|
| *e.g., Project Name* | **Keep** | Text Input | "Project or Part Name" | Mandatory. Under 50 characters. |
| *e.g., Process* | **Keep** | Clickable Cards / Grid | "Select Manufacturing Process" | Mandatory. Single-tap selection. Auto-advances page. |
| *e.g., Account Password*| **Kill** | None | N/A | Allow guest path; capture password *after* quote delivery. |

### Stage 2: Technical Specifications & Attachments
*Goal: Gather precise specifications without triggering cognitive overwhelm.*

| Existing Field Name | Action (Keep / Kill / Postpone) | Optimized Input Type | Label / Helper Text | Validation / Logic |
|---|---|---|---|---|
| *e.g., CAD File* | **Keep** | Drag & Drop Zone | "Upload Blueprints/CAD Files" | Optional but highly recommended. Supported formats: .step, .dwg, .pdf |
| *e.g., Raw Alloy Grade*| **Postpone** | Dropdown with default | "Material Group" / "Select 'Not Sure' if you need our metallurgy advice." | Mandatory but has a pre-selected default "Standard Aluminum 6061-T6" to avoid blockers. |
| *e.g., Street Address* | **Kill** | None | N/A | Remove completely. Shipping address is not needed for preliminary pricing. |

### Stage 3: Contact & Lead Routing
*Goal: Capture lead credentials with high-assurance value framing.*

| Existing Field Name | Action (Keep / Kill / Postpone) | Optimized Input Type | Label / Helper Text | Validation / Logic |
|---|---|---|---|---|
| *e.g., Work Email* | **Keep** | Email Input | "Business Email" / "We will send your confidential quote here." | Mandatory. Block generic emails (gmail.com, yahoo.com) if targeting enterprise-only. |
| *e.g., Phone Number* | **Postpone** | Tel Input | "Phone Number (Optional)" / "Only used if our estimator has a technical drawing question." | Optional. Set `type="tel"` to trigger mobile dial pad. |
| *e.g., Fax Number* | **Kill** | None | N/A | Eliminate entirely. |

---

## Part 3: Step-by-Step Optimization Roadmap

1. **Step 1: Strip the Fat.** Run your current form through Part 2 of this template. Work with marketing and engineering to remove any fields that are not strictly necessary to output a price estimate range.
2. **Step 2: Build the Multi-Step Layout.** Implement the progressive disclosure framework. Ensure Step 1 takes less than 10 seconds to complete.
3. **Step 3: Revise the File Uploader.** Implement asynchronous, drag-and-drop file uploading with clear feedback.
4. **Step 4: Craft the SLA Guarantee.** Work with your estimating team to set a realistic, enforceable speed SLA (e.g., 2 hours, 4 hours, 24 hours). Write this prominently adjacent to the final form submit button.
5. **Step 5: Revamp the Thank-You Page.** Replace the static success message with a custom thank-you page featuring the profile of the assigned representative and an embedded booking widget.
