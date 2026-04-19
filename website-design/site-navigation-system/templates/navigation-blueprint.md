# Navigation Blueprint Template

Use this template to map out the navigation structure for a website. Copy and
fill in the sections below.

---

## 1. Information Architecture (Sitemap)

Define the page hierarchy.

- **Level 1 (Homepage)**
  - **Level 2 (Category 1)**
    - Level 3 (Page A)
    - Level 3 (Page B)
  - **Level 2 (Category 2)**
    - Level 3 (Page C)
    - Level 3 (Page D)
  - **Level 2 (Category 3)**

---

## 2. Header Mapping

### Primary Navigation (5-7 Items)

| Label            | Target Page | Priority |
| :--------------- | :---------- | :------- |
| [e.g., Services] | [/services] | High     |
|                  |             |          |

### Utility Navigation

- [ ] Search
- [ ] User Account
- [ ] Cart/CTA
- [ ] Language/Region Switcher

### Responsive Behavior

- **Desktop:** [e.g., Horizontal menu with dropdowns]
- **Mobile:** [e.g., Hamburger menu with accordion sub-links]

---

## 3. Footer Mapping

### Column 1: [e.g., Company]

- Link 1
- Link 2

### Column 2: [e.g., Resources]

- Link 1
- Link 2

### Legal/Bottom Row

- [ ] Copyright Notice
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Social Media Icons

---

## 4. Accessibility Checklist

- [ ] **Skip Link:** Is a "Skip to Main Content" link defined?
- [ ] **Landmarks:** Is the main nav wrapped in
      `<nav aria-label="Main Navigation">`?
- [ ] **Active State:** How is the current page visually and programmatically
      indicated?
- [ ] **Keyboard:** Can the entire menu be navigated using only the `Tab` and
      `Enter` keys?
- [ ] **Contrast:** Do all navigation labels meet WCAG 2.1 AA contrast
      requirements?
