# Example: Corporate Site Navigation Breakdown

This example analyzes the navigation strategy for "Acme Corp," a fictional
multi-page corporate website.

## 1. Information Architecture

- **Home**
  - **Solutions** (Mega-menu)
    - Enterprise
    - Small Business
    - Education
  - **Company**
    - About Us
    - Careers
    - Leadership
  - **Resources**
    - Blog
    - Case Studies
    - Documentation
  - **Contact**

---

## 2. Header Implementation

### Desktop Strategy

- **Placement:** Logo left, Primary Nav center, Utility Nav (Search, Login)
  right.
- **Active State:** Underline on the current link + `aria-current="page"`.
- **Interactions:** "Solutions" and "Company" use mega-menus that reveal on
  hover (with a delay) or click.

### Mobile Strategy

- **Breakpoint:** < 1024px.
- **UI Pattern:** Hamburger menu in the top right.
- **Interaction:** Slide-out drawer from the right. Sub-links are hidden behind
  accordions to save vertical space.
- **Priority:** "Login" and "Contact" buttons are moved to the top of the mobile
  menu for easy access.

---

## 3. Footer Implementation

Acme Corp uses a "Fat Footer" to provide a safety net for users.

- **Column 1 (Solutions):** Deep links to Enterprise, Small Business, Education.
- **Column 2 (Company):** About Us, Careers, Leadership, Press.
- **Column 3 (Support):** Help Center, Community, Contact Us.
- **Bottom Bar:** Copyright, Privacy Policy, Terms, Social Icons.

---

## 4. Wayfinding & Accessibility Features

### Breadcrumbs

On deep pages (e.g., _Acme Corp > Solutions > Enterprise_), breadcrumbs appear
below the main header to provide a clear "Up" path.

### Skip Link

- **HTML:** `<a href="#main" class="skip-link">Skip to content</a>`
- **Behavior:** Hidden visually, but appears at the top of the screen on the
  first `Tab` press.

### Focus Management

When the mobile menu is opened:

1. Focus is moved to the "Close" button.
2. A "Focus Trap" is active, preventing the user from tabbing back to the page
   background.
3. When closed, focus returns to the hamburger toggle button.
