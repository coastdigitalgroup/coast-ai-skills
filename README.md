# @coastdigitalgroup/coastai-skills

[![npm](https://img.shields.io/npm/v/@coastdigitalgroup/coastai-skills)](https://www.npmjs.com/package/@coastdigitalgroup/coastai-skills)
[![GitHub issues](https://img.shields.io/github/issues/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/issues)
[![License](https://img.shields.io/github/license/coastdigitalgroup/coast-ai-skills)](LICENSE)

A portable, agent-friendly skill library served as an MCP server. Drop it into any project and AI agents across Codex, Claude Code, Cursor, Windsurf, Zed, and Continue instantly have access to structured guidance for website design, development, and growth tasks — without copying a single file.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) | [Security](SECURITY.md)

---

## Install

Run once in any project directory:

```bash
npx @coastdigitalgroup/coastai-skills --install
```

The installer auto-detects every supported editor on the machine, writes the MCP server entry into each config, and adds a `CLAUDE.md` instruction so agents know to use skills automatically. Restart your editor and it is live.

---

## How it works

The MCP server exposes three tools agents call on demand:

| Tool | What it does |
| ---- | ------------ |
| `search_skills(query)` | Finds relevant skills by keyword — use this first |
| `list_skills(category?)` | Browses all skills, optionally filtered by category |
| `get_skill(name)` | Loads the full skill content by exact name |

Typical agent flow:

```text
User:  "Help me build an accessible modal dialog"
Agent: search_skills("modal dialog accessible")
       → accessible-modal-dialog (website-development)
Agent: get_skill("accessible-modal-dialog")
       → full workflow, decision rules, validation steps
Agent: executes with skill guidance
```

Skills are never injected into context upfront. The agent fetches exactly what it needs, when it needs it.

---

## Supported editors

| Editor | Auto-configured |
| ------ | --------------- |
| Codex | ✓ |
| Claude Code | ✓ |
| Claude Desktop (macOS + Windows) | ✓ |
| Cursor (project + global) | ✓ |
| Windsurf | ✓ |
| Zed (macOS + Linux) | ✓ |
| Continue | ✓ |

---

## Available skills

### website-design

| Skill | Description |
| ----- | ----------- |
| `accessible-color-system` | Design a systematic color palette that meets WCAG 2.1 contrast requirements |
| `card-ui-system` | Design modular content cards with consistent hierarchy and responsive layouts |
| `fluid-spacing-system` | Build a fluid spacing scale using CSS `clamp()` for consistent white space across viewports |
| `fluid-typography-system` | Build a typographic scale that scales smoothly across viewports using CSS `clamp()` |
| `interactive-state-system` | Define hover, focus, active, and disabled states for all interactive elements |
| `responsive-grid-system` | Design a flexible column-based layout system that scales across devices |
| `site-navigation-system` | Design a structured, accessible, and responsive navigation framework |
| `visual-hierarchy-system` | Establish a clear order of importance using scale, color, contrast, and spacing |

### website-development

| Skill | Description |
| ----- | ----------- |
| `accessible-accordion-implementation` | Implement accessible, animatable accordion and disclosure components |
| `accessible-main-navigation` | Build accessible, responsive main navigation with skip links and keyboard support |
| `accessible-modal-dialog` | Implement accessible modal dialogs with focus trapping and keyboard interactions |
| `accessible-responsive-navigation` | Build fully accessible responsive navigation systems |
| `accessible-tabs-implementation` | Implement accessible tabbed interfaces using WAI-ARIA roles and keyboard patterns |
| `css-stacking-contexts` | Debug and manage CSS layering with stacking contexts and z-index |
| `dark-mode-implementation` | Implement a robust dark mode system that prevents flash and respects system preferences |
| `responsive-data-tables` | Make data tables readable and accessible across all screen sizes |
| `responsive-images` | Implement responsive images using `srcset`, `sizes`, and `<picture>` |
| `responsive-navigation-implementation` | Build navigation that transitions between mobile and desktop layouts accessibly |
| `robust-form-implementation` | Build accessible, resilient web forms using native APIs and ARIA best practices |
| `skeleton-screen-implementation` | Implement accessible skeleton screens to improve perceived performance |
| `web-font-optimization` | Optimize web font loading to prevent layout shifts and invisible text |

### website-growth

| Skill | Description |
| ----- | ----------- |
| `checkout-flow-optimization` | Audit and optimize the checkout process to reduce abandonment |
| `hero-section-optimization` | Audit and optimize hero sections for clarity and conversion |
| `landing-page-content-hierarchy` | Optimize the logical flow and information architecture of landing pages |
| `lead-capture-form-optimization` | Reduce friction and increase conversion rates on lead generation forms |
| `message-match-optimization` | Align traffic sources with destination landing pages to reduce bounce rates |
| `pricing-page-optimization` | Optimize pricing pages to reduce choice paralysis and improve conversion |
| `product-listing-page-optimization` | Reduce discovery friction on e-commerce category and listing pages |
| `product-page-optimization` | Optimize product detail pages to improve add-to-cart rates |
| `social-proof-optimization` | Audit and optimize trust signals to build credibility and reduce user anxiety |

---

## Adding skills

The library is domain-agnostic. Add any topic by dropping a folder into a category directory:

```text
/<category>/<skill-name>/SKILL.md
```

Each `SKILL.md` requires a frontmatter block. The `description` is what agents use to decide if a skill is relevant:

```markdown
---
name: your-skill-name
description:
  One or two sentences explaining what this skill does and when to trigger it.
  Write it as if the agent is reading it to decide whether to load the skill.
---
```

The MCP server discovers new skills automatically — no code changes or rebuilds needed.

Optional support folders alongside `SKILL.md`:

- `examples/` — worked examples
- `templates/` — reusable files
- `references/` — detailed reference material
- `assets/` — images or other static files
- `scripts/` — deterministic helper scripts

---

## Development

```bash
git clone https://github.com/coastdigitalgroup/coast-ai-skills.git
cd coast-ai-skills
npm install
npm run build
```

| Command | What it does |
| ------- | ------------ |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm run dev` | Runs the MCP server directly via tsx |

The MCP server source lives in `src/`. Skills live in the category folders at the repo root. They are independent — editing skills never requires a rebuild.

---

## Contributing

Contributions should prioritize portability, reuse, and execution quality over volume. Strengthen an existing skill before creating a near-duplicate.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow and [AGENT.md](AGENT.md) for repository structure and quality standards.

---

## License

MIT. See [LICENSE](LICENSE).
