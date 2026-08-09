# Example Breakdown: Multi-Level Documentation Sidebar Tree

This breakdown illustrates the **Tree View Navigation System** applied to a developer-facing documentation library (e.g., a modern API or SDK platform). It shows how spacing, hierarchical indentation, visual indicators, and keyboard focus states are structured to handle variable document depth without visual clutter or navigation fatigue.

---

## 1. Visual Composition & Directory Anatomy

The sidebar is structured as a vertical panel occupying `280px` of screen width. Below is a visual representation of the node states, showing how the active path is highlighted and nested levels are indented.

```text
+-------------------------------------------------------+
|  [Search documentation...]                            |
|                                                       |
|  [-] Getting Started                           [L0]   |
|   |   Introduction                             [L1]   |
|   |--[+] Quickstart (3 mins)                   [L1]   |
|   |   |   Installation                         [L2]   |
|   |   |   Basic Commands                       [L2]   |
|   |   Architecture Guide                       [L1]   |
|                                                       |
|  [-] Core Concepts                             [L0]   |
|   |--[-] Authentication                        [L1]   |
|   |   |   API Key Management                   [L2]   |
|   |   |--[*] OAuth2 Flow (Active Page)         [L2]   |
|   |   |   |   Authorisation Request            [L3]   |
|   |   |   |   Token Exchange                   [L3]   |
|   |   |   Webhooks Configuration               [L2]   |
|   |   Database Integration                     [L1]   |
|                                                       |
|  [+] SDK References                            [L0]   |
|  [+] API Endpoints (144)                       [L0]   |
+-------------------------------------------------------+
```

### Visual Highlights & Markers
* **`[-]` and `[+]` chevrons:** Indicate expanded and collapsed states respectively. These are placed on the far left.
* **`[*]` active indicator:** The `OAuth2 Flow` node is the active webpage. It is highlighted with a background fill and an accent line.
* **Lines of Rhythm (`|` and `|--`):** Muted vertical lines connecting child groups back to their parent branch.
* **Badges `(3 mins)` and `(144)`:** Gray/neutral chips with micro-typography indicating reading times or child counts.

---

## 2. Anatomical Grid Breakdown

Every row inside the tree uses a flexible CSS Grid/Flexbox container to maintain strict alignment regardless of icon size or badge presence.

```text
+--------------------------------------------------------------------------------------------------------+
|  <- [Indent: 32px] ->  | [Chevron: 16px] | [Icon: 18px] | [Label Text: Auto] | [Badge] | [Action: 16px] |
+--------------------------------------------------------------------------------------------------------+
  Calculated per depth     Toggle trigger    Folder/File    Clips with ellipsis   Neutral   Optional context
  (32px = 2 levels)        or blank spacer   category       (max-width: 60%)      count     edit/delete trigger
```

---

## 3. CSS Variable Indentation in Action

To prevent hardcoded CSS selectors (like `.level-1`, `.level-2`, etc.), the system relies on dynamic custom property calculations. Each nesting level simply overrides the `--tree-depth` inline.

### HTML Structure (Extract)
```html
<ul role="tree" aria-label="Documentation Directory">
  <!-- LEVEL 0 BRANCH (Expanded) -->
  <li role="none">
    <div role="treeitem" aria-expanded="true" class="tree-node branch" style="--tree-depth: 0;">
      <span class="chevron rotate-90" aria-hidden="true">▸</span>
      <span class="icon" aria-hidden="true">📁</span>
      <span class="label">Core Concepts</span>
    </div>

    <ul role="group" aria-label="Core Concepts Subfolders">
      <!-- LEVEL 1 BRANCH (Expanded) -->
      <li role="none">
        <div role="treeitem" aria-expanded="true" class="tree-node branch" style="--tree-depth: 1;">
          <span class="chevron rotate-90" aria-hidden="true">▸</span>
          <span class="icon" aria-hidden="true">📁</span>
          <span class="label">Authentication</span>
        </div>

        <ul role="group" aria-label="Authentication Subfolders">
          <!-- LEVEL 2 LEAF (Inactive) -->
          <li role="none">
            <a href="/docs/api-keys" role="treeitem" class="tree-node leaf" style="--tree-depth: 2;">
              <span class="chevron-placeholder" aria-hidden="true"></span>
              <span class="icon" aria-hidden="true">📄</span>
              <span class="label">API Key Management</span>
            </a>
          </li>

          <!-- LEVEL 2 LEAF (Active/Selected) -->
          <li role="none">
            <a href="/docs/oauth2" role="treeitem" aria-current="page" class="tree-node leaf active" style="--tree-depth: 2;">
              <span class="chevron-placeholder" aria-hidden="true"></span>
              <span class="icon" aria-hidden="true">📄</span>
              <span class="label">OAuth2 Flow</span>
            </a>

            <ul role="group" aria-label="OAuth2 Flow Details">
              <!-- LEVEL 3 LEAF -->
              <li role="none">
                <a href="/docs/oauth2/auth-request" role="treeitem" class="tree-node leaf" style="--tree-depth: 3;">
                  <span class="chevron-placeholder" aria-hidden="true"></span>
                  <span class="icon" aria-hidden="true">📄</span>
                  <span class="label">Authorisation Request</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

### CSS Variables Layout Rules
```css
:root {
  --tree-indent: 16px;
  --tree-item-padding-x: 12px;
  --tree-item-padding-y: 8px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-family: var(--font-sans, system-ui);
  font-size: 14px;
  color: var(--color-text-body, #374151);
  padding-top: var(--tree-item-padding-y);
  padding-bottom: var(--tree-item-padding-y);
  padding-right: var(--tree-item-padding-x);

  /* Mathematical Indentation Calculation */
  padding-left: calc(
    (var(--tree-depth, 0) * var(--tree-indent)) + var(--tree-item-padding-x)
  );

  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
  border-left: 3px solid transparent;
}

/* Hover and Active states */
.tree-node:hover {
  background-color: var(--color-bg-hover, rgba(55, 65, 81, 0.05));
  color: var(--color-text-heading, #111827);
}

.tree-node.active {
  background-color: var(--color-primary-light, rgba(59, 130, 246, 0.08));
  color: var(--color-primary, #2563eb);
  font-weight: 500;
  border-left-color: var(--color-primary, #2563eb);
}

/* Vertical Rhythm Line Integration */
ul[role="group"] {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

/* Optional vertical connectors for developer layouts */
ul[role="group"]::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  /* Line sits exactly over the previous level's chevron offset */
  left: calc(var(--tree-depth, 1) * var(--tree-indent) + 18px);
  width: 1px;
  background-color: var(--color-border-muted, #e5e7eb);
  pointer-events: none;
}
```

---

## 4. Mobile Reflow Strategy

On smaller viewports (under `768px`), maintaining a `280px` fixed column causes content to truncate too heavily. The documentation interface uses the following adaptive states:

1. **The Core Grid Reset:** The main viewport grid shifts from `[Sidebar 280px | Content 1fr]` on desktop to `[Content 100%]` on mobile.
2. **The Hamburger Toggle Bar:** A sticky header bar appears at the top containing a search icon, site logo, and a prominent floating action button: `[☰ Explore Docs]`.
3. **The Slide-Out Panel Drawer:** Clicking the explore button slides open a full-height overlay drawer from the left containing the complete Tree View.
4. **Indentation Squeeze:** To optimize horizontal spacing within the narrow mobile drawer, the indent width drops to `--tree-indent: 12px`, giving users an extra 16-24px of reading width at level 3.
