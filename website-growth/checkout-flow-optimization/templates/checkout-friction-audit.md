# Checkout Friction Audit Checklist

Use this template to systematically evaluate a checkout flow and identify
conversion leaks.

## 1. The Entry Point (Pre-Form)

- [ ] **Guest Option:** Is "Checkout as Guest" the most prominent action for new
      users?
- [ ] **Express Payments:** Are Apple Pay, Google Pay, or Shop Pay offered above
      the email field?
- [ ] **Login Path:** Is the path for returning users clear but not obstructive
      to new users?
- [ ] **Account Creation:** If required, are the benefits (e.g., "Track orders")
      explained?

## 2. Form Design & UX

- [ ] **Field Count:** Have you removed all non-essential fields (e.g., Middle
      Name, Fax, etc.)?
- [ ] **Field Labels:** Are labels top-aligned and visible (not just
      placeholders)?
- [ ] **Field Masking:** Is there masking for Credit Card and Phone Number
      (e.g., `(XXX) XXX-XXXX`)?
- [ ] **Auto-Complete:** Is address auto-complete implemented to reduce typing?
- [ ] **Mobile Keyboards:** Do numeric fields (ZIP, CC, Phone) trigger the
      numeric keypad?
- [ ] **Validation:** Do errors appear inline and provide specific fix
      instructions?

## 3. Shipping & Fulfillment

- [ ] **Clarity:** Are delivery dates (e.g., "Oct 12") used instead of speeds
      (e.g., "3-5 days")?
- [ ] **Inventory:** Is the stock status confirmed before the user enters
      payment info?
- [ ] **Switching:** Can the user switch between Shipping and Store Pickup
      within the checkout?
- [ ] **Free Shipping:** Is the "Free" option selected by default if available?

## 4. Trust & Transparency

- [ ] **Live Summary:** Is the order total (including tax/shipping) visible on
      every step?
- [ ] **Trust Signals:** Are security badges (SSL, McAfee, etc.) placed near the
      payment fields?
- [ ] **Privacy:** Is there a "We value your privacy" note near the phone/email
      fields?
- [ ] **Return Policy:** Is the return/guarantee policy summarized near the
      final CTA?

## 5. Visual Focus & Flow

- [ ] **Distraction-Free:** Are the site header, footer, and sidebar links
      removed?
- [ ] **Progress:** Is there a clear progress indicator (e.g., Step 2 of 3)?
- [ ] **Primary CTA:** Is the "Next" or "Place Order" button the most prominent
      element?
- [ ] **Coupon Box:** Is the promo code box subtle (to prevent users from
      leaving to hunt for codes)?

---

## Audit Scoring Summary

**Total Score: \_\_\_\_ / 20**

- **18-20:** High-Conversion Flow.
- **14-17:** Mediocre (Leaking revenue).
- **<14:** Critical Friction (Immediate redesign recommended).
