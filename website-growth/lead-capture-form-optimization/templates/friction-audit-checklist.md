# Form Friction Audit Checklist

Use this checklist to identify conversion killers in any lead capture form.

## 1. Field Inventory & Necessity

- [ ] Count the total number of fields. Is it > 5? If so, can any be moved to
      Step 2 or removed?
- [ ] Is every field "Business Critical"? (Ask: "Will the lead not be worked if
      this data is missing?")
- [ ] Are there any optional fields? (If it's optional, it shouldn't be there.)
- [ ] Are we asking for sensitive info (Phone, Address) too early?

## 2. Layout & Accessibility

- [ ] Is the form a single-column layout?
- [ ] Are labels placed _above_ the input fields (Top-aligned)?
- [ ] Are labels permanent (not disappearing placeholders)?
- [ ] Is there enough vertical spacing between field groups to prevent
      mis-clicks?
- [ ] Does the "Tab" key move through the form in the correct logical order?

## 3. Mobile Optimization

- [ ] Does the Email field trigger the email keyboard (`type="email"`)?
- [ ] Does the Phone/Number field trigger the numeric keypad (`type="tel"` or
      `inputmode="numeric"`)?
- [ ] Are buttons at least 44px tall for easy tapping?
- [ ] Is the form width responsive (100% of screen)?

## 4. Friction & Cognitive Load

- [ ] Is there a "Reset" or "Clear" button? (Delete it immediately).
- [ ] Are there any manual CAPTCHAs (puzzles, letters)? (Replace with invisible
      alternatives).
- [ ] Does the CTA button use action-oriented language (e.g., "Send Me the PDF")
      vs. "Submit"?
- [ ] Is there inline validation (green check/red error) as the user types?

## 5. Trust & Reassurance

- [ ] Is there a privacy statement near the email field?
- [ ] Are there trust signals (logos, ratings) near the form?
- [ ] Is there a clear "Success" message or redirect after submission?
