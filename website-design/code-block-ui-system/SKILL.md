---
name: code-block-ui-system
description:
  Design a systematic, highly accessible, and developer-friendly UI layout
  framework for code blocks, snippet showcases, multi-file code tabs, line-highlighting,
  diff views, and syntax token contrast in technical documentation and developer platforms.
---

# Code Block UI System

## Purpose

The Code Block UI System provides a standardized, accessible, and high-legibility layout framework for displaying source code snippets, API request/response payloads, multi-file code examples, terminal command lines, and code diff comparisons. Code blocks are critical interaction components across technical documentation, developer tool marketing sites, API portals, engineering blogs, and SaaS platforms.

Designing effective code interfaces requires balancing monospace typography legibility, high-contrast syntax token highlighting across light and dark themes, sticky header action toolbars (language badges, tabbed file navigation, copy-to-clipboard triggers), line numbering, line-level highlighting/focusing, wrap vs. horizontal scroll behaviors, and accessible screen-reader experiences. This skill establishes spatial rules, token color contrast standards, interaction mechanics, and WCAG AA compliance guidelines for code UI presentation.

## Use Cases

- **Developer Documentation & API Reference Portals:** Presenting multi-language SDK examples (e.g., cURL, Node.js, Python, Go, Rust) and API responses.
- **Developer Tool Landing Pages:** Showcasing hero code snippets, CLI installation commands, and interactive product demo blocks.
- **Engineering Blogs & Tutorials:** Rendering inline and block code examples with specific line callouts, step-by-step code highlights, and inline annotations.
- **Version Control & Code Review Interfaces:** Displaying code diffs (`+` additions, `-` deletions), inline comments, and commit snippets.
- **Code Playground & Snippet Sharing Tools:** Structuring multi-tab file editors, preview panes, and embeddable snippet cards.

## When NOT to Use

- **Full In-Browser Code Editors (IDE):** For complex interactive web IDEs requiring canvas rendering, virtualized AST trees, multi-cursor editing, and language server protocol (LSP) integrations (e.g., Monaco Editor, CodeMirror), use dedicated editor implementations.
- **General Form Text Inputs:** For multi-line plain text fields without syntax highlighting or line numbers, use `form-design-system`.
- **Inline Text Code Badges:** For brief single-word code references inside prose paragraphs (e.g., `npm install`), use inline `<code>` styling within `article-layout-system`.
- **Structured Data Tables:** For tabular key-value data or database queries formatted as rows and columns, use `data-table-ui-system` or `property-and-attribute-system`.

## Inputs

1. **Code Content & Syntax Types:** The language taxonomy (e.g., TypeScript, JSON, Bash, YAML, GraphQL, SQL) and structural features (single file, multi-file tabs, diff).
2. **Theme Context:** Active color palette tokens for surface backgrounds, borders, and syntax tokens in light mode and dark mode (from `accessible-color-system` and `dark-theme-design-system`).
3. **Monospace Typography Tokens:** Preferred font stack (e.g., `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`), font sizes, and line heights (from `fluid-typography-system`).
4. **Action Triggers:** Specific interactive capabilities required per block (e.g., 1-click Copy button, line numbers toggle, word wrap toggle, full-screen expansion, external sandbox link).

## Outputs

1. **Code Container & Header Toolbar Specification:** Spatial layouts for code block containers, sticky header bars, language indicators, file path tabs, and action button groups.
2. **Accessible Syntax Token Color Palette:** WCAG AA (minimum 4.5:1 contrast ratio) token color mapping for keywords, strings, functions, variables, comments, operators, and types across light and dark themes.
3. **Line-Level Hierarchy & Annotation System:** Blueprint for line numbering, line highlighting/focus overlays, diff indicators (`+` / `-`), and line-level anchor linking.
4. **Accessible Screen Reader & Keyboard Navigation Model:** ARIA role attributes, keyboard focus routes, line-number masking (`aria-hidden="true"`), and `aria-live` copy status announcements.
5. **Responsive Overflow & Scroll Strategy:** Rules for horizontal scrollbars, sticky action toolbars, word-wrapping toggles, and mobile viewport adaptations.

---

## Workflow

### 1. Structure the Code Block Shell & Header Bar
Design the container and header action bar as a unified, cohesive unit:
- **Container Architecture:** Set a rounded container (`border-radius: 8px; border: 1px solid var(--border-subtle); overflow: hidden; background: var(--surface-code);`). Use a distinct surface background (typically dark mode by default or matching theme surface).
- **Header Toolbar Layout:** Render a sticky top header bar (`display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: var(--surface-code-header); border-bottom: 1px solid var(--border-subtle);`).
- **Header Left Section (Tabs & Metadata):**
  - *Single File:* Show file path/name (e.g., `src/auth/jwt.ts`) with a subtle file type icon, or a capitalized language badge (e.g., `TYPESCRIPT`).
  - *Multi-File / Multi-Language:* Render tabbed buttons (`role="tablist"`). Active tab features high contrast text and a bottom border/pill indicator (`border-bottom: 2px solid var(--brand-primary)`).
- **Header Right Section (Actions):** Group utility action triggers:
  - **Copy Button:** 32x32px icon button (`aria-label="Copy code to clipboard"`) with a clear copy icon and label on wider viewports.
  - **Wrap / Scroll Toggle (Optional):** Icon button to toggle soft wrapping (`white-space: pre-wrap`) versus horizontal scroll (`white-space: pre`).
  - **Expand / Sandbox Link (Optional):** Trigger to open snippet in StackBlitz, CodeSandbox, or full screen.

### 2. Establish Monospace Typography & Layout Grid
Ensure optimal legibility for technical reading and code scanning:
- **Font Stack:** Define a clean, high-legibility monospace font stack: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`. Ensure font feature settings enable clear distinction between `0` (zero) and `O` (capital o), and `1` (one), `l` (lowercase L), and `I` (capital i).
- **Font Sizing & Line Height:** Set `font-size: 0.875rem` (14px) with a generous line height (`line-height: 1.6` / 22.4px). Avoid tight line heights that cause code brackets and operators to collide.
- **Code Body Container:** Use `<pre class="code-block"><code class="language-typescript">` with `display: block; overflow-x: auto; padding: 16px 0; margin: 0; font-family: var(--font-mono);`.

### 3. Design Line Numbers, Line Highlights, and Diffs
Structure line-level elements without degrading copy-paste or screen reader behavior:
- **Line Structure:** Format each line as a distinct block container (`display: table-row;` or `display: flex; width: 100%;`).
- **Line Numbers:** Render line numbers in a left gutter (`display: table-cell; text-align: right; width: 40px; padding-right: 16px; user-select: none; color: var(--text-code-muted);`).
  - *Accessibility Rule:* Wrap line numbers in `<span aria-hidden="true">` or use CSS counter content (`content: counter(line)`) so line numbers are **not** copied when selecting text and are **not** read aloud by screen readers between code statements.
- **Highlighted / Focused Lines:** To draw focus to key lines in a tutorial or diff:
  - Apply an explicit line highlight background (`background: var(--surface-code-highlight); border-left: 3px solid var(--brand-primary);`).
  - Ensure the highlight overlay spans the full scrollable width of the code container (`min-width: 100%`).
- **Diff View Lines (`+` Addition / `-` Deletion):**
  - *Added Line:* Subtle green background (`background: rgba(34, 197, 94, 0.15); border-left: 3px solid var(--color-success);`). Show a `+` symbol in the gutter wrapped in `<span class="sr-only">Added:</span>` for screen readers.
  - *Deleted Line:* Subtle red background (`background: rgba(239, 68, 68, 0.15); border-left: 3px solid var(--color-danger);`). Show a `-` symbol in the gutter wrapped in `<span class="sr-only">Removed:</span>` for screen readers.

### 4. Create Accessible Syntax Token Color Palette
Syntax tokens must satisfy WCAG AA contrast ratios (minimum **4.5:1**) against the code block background (`var(--surface-code)`):
- **Base Text / Variables:** Neutral light (e.g., `#E2E8F0` on `#0F172A` background; ratio ~12.5:1).
- **Keywords (`const`, `import`, `return`, `async`):** Vibrant purple/magenta (e.g., `#C084FC`; ratio ~7.2:1).
- **Functions & Methods (`fetchData`, `useState`):** Bright blue/cyan (e.g., `#38BDF8`; ratio ~8.5:1).
- **Strings (`"https://api.example.com"`):** Soft green/emerald (e.g., `#4ADE80`; ratio ~9.1:1).
- **Numbers & Booleans (`404`, `true`):** Warm orange/amber (e.g., `#FB923C`; ratio ~7.8:1).
- **Comments (`// Handle token response`):** Muted cool gray with WCAG AA compliance (e.g., `#94A3B8`; ratio ~5.1:1). *Never use low-contrast grays (e.g. 2:1) for comments.*
- **Operators & Punctuation (`=>`, `{`, `}`, `;`):** Medium neutral (e.g., `#CBD5E1`; ratio ~10.2:1).

### 5. Build Copy-to-Clipboard & Action Feedback States
Providing instant feedback for copy actions prevents duplicate clicks and user frustration:
- **Default State:** Display icon button with copy icon (two overlapping rectangles) and optional label ("Copy").
- **Hover / Focus State:** Elevated surface background or border highlight (`background: var(--surface-hover); outline: 2px solid var(--focus-ring)`).
- **Active / Success State:** On click, change icon to a checkmark icon, update button label to "Copied!", and apply a success color tint (`color: var(--color-success)`).
- **Screen Reader Notification:** Announce copy status dynamically via an invisible `aria-live="polite"` region: *"Code copied to clipboard"*.
- **Timeout Reset:** Reset the button to the default state after 2000ms.

### 6. Mobile & Responsive Adaptation
Ensure long code snippets remain functional on small viewports:
- **Horizontal Scroll Containment:** Allow horizontal scrolling (`overflow-x: auto`) for long lines on mobile without triggering page-level horizontal scrollbar overflows.
- **Sticky Header Toolbar:** Keep the header toolbar pinned (`position: sticky; top: 0; z-index: 10;`) so the copy button and active file tab remain accessible even when scrolling through 100+ lines of code.
- **Mobile Tap Targets:** Ensure copy buttons, wrap toggles, and multi-file tabs satisfy a minimum tap target of **44x44px** on touch devices.

---

## Decision Rules

### Syntax Token Contrast & Theme Modes

| Syntax Category | Recommended Token Role | Light Theme Color (on `#F8FAFC`) | Dark Theme Color (on `#0F172A`) | Min Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **Keywords** | `--token-keyword` | Deep Violet (`#6B21A8`) | Bright Violet (`#C084FC`) | ≥ 4.5:1 |
| **Functions** | `--token-function` | Dark Cyan (`#0369A1`) | Sky Blue (`#38BDF8`) | ≥ 4.5:1 |
| **Strings** | `--token-string` | Forest Green (`#15803D`) | Bright Emerald (`#4ADE80`) | ≥ 4.5:1 |
| **Numbers / Booleans** | `--token-number` | Dark Amber (`#C2410C`) | Bright Amber (`#FB923C`) | ≥ 4.5:1 |
| **Comments** | `--token-comment` | Muted Slate (`#475569`) | Soft Slate (`#94A3B8`) | ≥ 4.5:1 |
| **Base / Variables** | `--token-base` | Charcoal (`#0F172A`) | Crisp Light (`#F8FAFC`) | ≥ 7.0:1 |

### Wrap vs. Horizontal Scroll Strategy
- **Horizontal Scroll (`white-space: pre`) (Default Recommended):** Preserves code layout integrity, indentation alignments, and multi-line formatting. Essential for Python, YAML, and code diffs where indentation conveys semantic structure.
- **Soft Word Wrap (`white-space: pre-wrap`) (Optional Mode):** Recommended for long terminal output strings, command line examples, or narrow sidebar widgets where horizontal scrolling disrupts reading flow.

---

## Constraints

- **Accessibility (WCAG 2.1 AA):**
  - **SC 1.4.3 Contrast (Minimum):** All syntax highlighting token colors and comments must achieve a minimum contrast ratio of **4.5:1** against the code background.
  - **SC 2.1.1 Keyboard:** Users must be able to navigate to and activate code block header buttons (tabs, copy button) using `Tab` and `Space`/`Enter`.
  - **SC 4.1.3 Status Messages:** Copy button feedback must announce to assistive technology via an `aria-live="polite"` region.
  - **SC 1.3.1 Info and Relationships:** Line numbers must be hidden from screen readers (`aria-hidden="true"` or CSS counters) to avoid interspersed digits during reading.
- **Text Selection & Copying:** Selecting text inside the code block must **never** select line numbers or diff markers (`+` / `-`) into the clipboard buffer.
- **Layout Shift Prevention:** Expanding multi-file tabs or toggling line wrapping must specify fixed line heights or container boundaries to prevent Cumulative Layout Shift (CLS).

---

## Common Failure Patterns

- **Unreadable Low-Contrast Comments:** Using faint gray text (e.g., `#4A5568` on `#1A202C`, 2.8:1 contrast) for comments, assuming comments are unimportant, violating WCAG AA guidelines.
- **Copying Line Numbers:** Rendering line numbers as raw text inside `<pre>`, causing copy-pasting to produce invalid code snippets prefixed with `1 2 3 4`.
- **Unannounced Copy Actions:** Changing copy button visual icons without updating `aria-label` or sending an `aria-live` announcement, leaving screen reader users uncertain if the action succeeded.
- **Page-Level Overflow Spills:** Failing to set `max-width: 100%` and `overflow-x: auto` on `<pre>`, causing 120-character code lines to blow out the page layout on mobile screens.
- **Inaccessible Focus Traps in Horizontal Scroll:** Placing `tabindex="0"` on the scrollable code block without clear keyboard visual outline indicators, causing keyboard users to get stuck inside long code blocks.

---

## Validation Criteria

- [ ] Code block features a structured container with a sticky header toolbar displaying language, file tabs, and action buttons.
- [ ] Syntax token colors in both light and dark modes achieve at least 4.5:1 contrast against the code block background.
- [ ] Line numbers are visually distinct, non-selectable (`user-select: none`), and hidden from screen readers (`aria-hidden="true"`).
- [ ] Copy-to-clipboard button provides visual success state (icon + text change) and `aria-live="polite"` announcement.
- [ ] Line highlighting and diff lines (`+` / `-`) span 100% container width with clear screen-reader state cues (`Added:`, `Removed:`).
- [ ] Long code lines scroll horizontally (`overflow-x: auto`) without breaking parent layout boundaries on mobile viewports.
- [ ] Touch targets on tabs, copy buttons, and utility actions satisfy a minimum size of 24x24px (44x44px on mobile).
