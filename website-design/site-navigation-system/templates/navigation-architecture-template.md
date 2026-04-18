# Navigation Architecture Template

Use this template to map out your website's navigation structure before moving
into UI design or development.

## 1. Information Architecture Map

| Level | Label          | URL / Path   | Priority  | Notes               |
| :---- | :------------- | :----------- | :-------- | :------------------ |
| 1     | Home           | /            | Primary   | Logo link           |
| 1     | [Section Name] | /section     | Primary   | e.g., Products      |
| 2     | [Sub-section]  | /section/sub | Secondary | Appears in dropdown |
| 1     | [Section Name] | /section-2   | Primary   | e.g., Pricing       |
| 1     | Login          | /login       | Utility   |                     |
| 1     | Sign Up        | /signup      | Action    | Main CTA            |

## 2. Global Header Specification

### Desktop (Layout: [e.g., Logo-Left / Nav-Center / Action-Right])

- **Link Style:** [e.g., Uppercase, 14px, Bold]
- **Spacing (Gap):** [e.g., 24px]
- **Sticky:** [Yes / No]
- **Transition:** [e.g., 200ms ease-in-out]

### Mobile (Layout: [e.g., Logo-Left / Menu-Right])

- **Breakpoint:** [e.g., 1024px]
- **Drawer Side:** [Left / Right / Full-screen]
- **Toggle Icon:** [Hamburger / Menu Text]

## 3. Global Footer Specification

### Layout: [e.g., 4-column Grid]

- **Col 1:** [Logo + Brief Bio + Social Icons]
- **Col 2:** [Primary Links]
- **Col 3:** [Resources / Support Links]
- **Col 4:** [Newsletter Signup / Contact]

---

## 4. Wayfinding Rules

- **Active State Indicator:** [e.g., Underline / Color Change / Bold]
- **Breadcrumbs Trigger:** [e.g., Only on pages deeper than level 2]
- **Current Page Logic:** [e.g., Link is disabled and styled differently]

## 5. Interaction Checklist

- [ ] **Hover:** Color shift from `--color-text` to `--color-primary`.
- [ ] **Focus:** 2px solid `--color-focus-ring` with 4px offset.
- [ ] **Active:** 10% darkening of background or underline appearance.
- [ ] **Dropdowns:** Trigger on [Hover (Desktop) / Click (Mobile)].
