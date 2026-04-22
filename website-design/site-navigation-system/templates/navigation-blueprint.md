# Navigation Blueprint Template

Use this blueprint to map out a website's navigation structure before moving
into high-fidelity design or implementation.

## 1. Hierarchy Mapping

| Level         | Category          | Items                     | Purpose                    |
| :------------ | :---------------- | :------------------------ | :------------------------- |
| **Utility**   | Account/Tools     | Search, Login, Language   | Global tasks / Meta-info   |
| **Primary**   | Top-level Content | Products, Services, About | Core conversion/info paths |
| **Secondary** | Sub-navigation    | Categories, Features      | Deep content discovery     |
| **Tertiary**  | Global Footer     | Privacy, Terms, Careers   | Compliance & discovery     |

## 2. Page-Level Wayfinding

Define how a user knows "where they are" on a specific page.

- **Menu Active State:** [Describe visual style, e.g., Color change, underline]
- **Breadcrumb Path:** [Home > Folder > Sub-folder > Page Title]
- **On-Page Heading:** [Must match navigation label exactly]
- **Sidebar Context:** [Show/Hide specific sidebar based on section]

## 3. Interaction Specification

### Desktop Patterns

- **Primary Nav Pattern:** [e.g., Simple Dropdown, Mega-menu, Persistent
  Sidebar]
- **Transition:** [e.g., Fade-in, Slide, Instant]
- **Hover/Focus State:** [Describe visual feedback]

### Mobile Patterns

- **Menu Type:** [e.g., Hamburger Drawer, Priority+, Bottom Tab Bar]
- **Hierarchy Order:** [1. Search, 2. Primary Nav, 3. Utility]
- **Touch Targets:** [Confirm all interactive areas are 44px+]

## 4. Accessibility Checklist

- [ ] **Landmarks:** Is `<nav>` used for every navigation block?
- [ ] **Skip Links:** Is there a "Skip to Content" link at the top of the DOM?
- [ ] **Aria Labels:** Do nav blocks have unique `aria-label`s (e.g.,
      `aria-label="Main Navigation"`)?
- [ ] **Keyboard Flow:** Can users Tab through every item?
- [ ] **Focus Indication:** Is there a high-contrast focus ring for every link?
- [ ] **Esc Key:** Does the "Esc" key close open menus/drawers?

## 5. Navigation Label Inventory

List the exact text for every link to ensure consistency.

1.  [Label] -> [Destination]
2.  [Label] -> [Destination]
3.  [Label] -> [Destination] ...
