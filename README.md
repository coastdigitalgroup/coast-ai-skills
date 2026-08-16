# @coastdigitalgroup/coastai-skills

[![npm](https://img.shields.io/npm/v/@coastdigitalgroup/coastai-skills)](https://www.npmjs.com/package/@coastdigitalgroup/coastai-skills)
[![GitHub issues](https://img.shields.io/github/issues/coastdigitalgroup/coastai-skills)](https://github.com/coastdigitalgroup/coastai-skills/issues)
[![License](https://img.shields.io/github/license/coastdigitalgroup/coastai-skills)](LICENSE)

A portable, agent-friendly skill library served as an MCP server. Drop it into
any project and AI agents across Codex, Claude Code, Cursor, Windsurf, Zed, and
Continue instantly have access to structured guidance for website design,
development, and growth tasks — without copying a single file.

## At a glance

- **What this is:** An MCP package that serves portable `SKILL.md` content to AI
  agents on demand.
- **Who it is for:** Teams using AI coding/design agents that need reusable
  website design, development, and growth workflows.
- **What this package owns:** Skill discovery, skill search, and skill retrieval
  over three MCP tools.
- **What this package does not own:** Application runtime logic, framework
  scaffolding, or replacing your product architecture.

## When to use this package

- You want AI agents to discover and apply reusable skills by topic.
- You want one shared skill library across editors and agent runtimes.
- You want a thin MCP layer with most value kept in portable Markdown skills.

## When not to use this package

- You need a web framework starter or full application boilerplate.
- You need a domain-specific business app instead of a reusable skill library.
- You want dynamic runtime orchestration beyond skill lookup and retrieval.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) |
[Security](SECURITY.md)

---

## Install

Run once in any project directory:

```bash
npx @coastdigitalgroup/coastai-skills --install
```

The installer auto-detects every supported editor on the machine, writes the MCP
server entry into each config, and adds a `CLAUDE.md` instruction so agents know
to use skills automatically. Restart your editor and it is live.

---

## How it works

The MCP server exposes three tools agents call on demand:

| Tool                     | What it does                                        |
| ------------------------ | --------------------------------------------------- |
| `search_skills(query)`   | Finds relevant skills by keyword — use this first   |
| `list_skills(category?)` | Browses all skills, optionally filtered by category |
| `get_skill(name)`        | Loads the full skill content by exact name          |

Typical agent flow:

```text
User:  "Help me build an accessible modal dialog"
Agent: search_skills("modal dialog accessible")
       → accessible-modal-dialog (website-development)
Agent: get_skill("accessible-modal-dialog")
       → full workflow, decision rules, validation steps
Agent: executes with skill guidance
```

Skills are never injected into context upfront. The agent fetches exactly what
it needs, when it needs it.

## Package contract

### Runtime interface

| Surface      | Contract                                                     |
| ------------ | ------------------------------------------------------------ |
| CLI binary   | `coastai-skills` (published from `dist/index.js`)            |
| Install mode | `coastai-skills --install` auto-configures supported editors |
| Server mode  | `coastai-skills` runs MCP over stdio                         |
| MCP tools    | `search_skills`, `list_skills`, `get_skill`                  |

This package is CLI-first. There is no documented stable JavaScript API.

### Source-of-truth and edit boundaries

- **Source-of-truth:** Skill content in `/<category>/<skill-name>/SKILL.md` and
  discovery behavior in `src/skills.ts`.
- **Generated output:** `dist/` is build output and should not be hand-edited
  for routine changes.
- **Protected boundaries:** Keep `src/` as a thin transport/discovery layer and
  avoid moving execution logic out of skills.
- **Unsafe direct edits:** Do not hand-edit packaged artifacts for release
  behavior changes; update source and rebuild instead.

### AI boundaries snapshot

- `CLAUDE.md`: lead implementation authority.
- `CODEX.md`: release-readiness, docs consistency, stabilization, and validation
  stewardship.
- `COPILOT.md`: IDE support guidance.
- `JULES.md`: bounded automation and micro-maintenance.
- `AGENTS.md`: shared coordination and ownership boundaries.

---

## Supported editors

| Editor                           | Auto-configured |
| -------------------------------- | --------------- |
| Codex                            | ✓               |
| Claude Code                      | ✓               |
| Claude Desktop (macOS + Windows) | ✓               |
| Cursor (project + global)        | ✓               |
| Windsurf                         | ✓               |
| Zed (macOS + Linux)              | ✓               |
| Continue                         | ✓               |

---

## Available skills

The package currently includes 217 validated skills across three categories.
Use `list_skills` for the current runtime catalogue and `get_skill(name)` for
the full execution guidance.

### website-design (73 skills)

- `accessible-color-system`
- `accordion-ui-system`
- `article-layout-system`
- `badge-and-tag-system`
- `banner-and-alert-system`
- `bento-grid-layout-system`
- `breadcrumb-wayfinding-system`
- `button-and-action-system`
- `calendar-and-date-system`
- `card-ui-system`
- `carousel-and-slider-system`
- `command-palette-system`
- `comment-and-discussion-system`
- `comparison-matrix-system`
- `consent-and-preference-system`
- `conversational-chat-ui-system`
- `custom-select-and-combobox-system`
- `dark-theme-design-system`
- `dashboard-layout-system`
- `data-table-ui-system`
- `data-visualization-system`
- `elevation-and-depth-system`
- `empty-state-system`
- `error-and-status-system`
- `file-upload-management-system`
- `filter-and-sort-system`
- `fluid-spacing-system`
- `fluid-typography-system`
- `focus-indicator-design-system`
- `form-design-system`
- `hero-design-system`
- `iconography-system`
- `image-comparison-slider-system`
- `image-gallery-and-lightbox-system`
- `imagery-and-media-system`
- `interactive-state-system`
- `interface-motion-system`
- `internationalization-design-system`
- `kanban-board-ui-system`
- `logo-grid-system`
- `master-detail-layout-system`
- `metric-and-statistic-system`
- `notification-center-system`
- `onboarding-tour-system`
- `overlay-and-dialog-system`
- `page-header-system`
- `pagination-system`
- `pricing-table-ui-system`
- `product-detail-layout-system`
- `property-and-attribute-system`
- `responsive-grid-system`
- `review-and-rating-system`
- `search-interface-system`
- `section-composition-system`
- `segmented-control-system`
- `settings-interface-system`
- `shopping-cart-ui-system`
- `sidebar-navigation-system`
- `site-footer-system`
- `site-navigation-system`
- `skeleton-state-system`
- `step-progress-system`
- `sticky-and-floating-ui-system`
- `store-locator-system`
- `tab-ui-system`
- `table-of-contents-system`
- `testimonial-and-quote-system`
- `timeline-activity-system`
- `toast-and-snackbar-system`
- `tooltip-and-hint-system`
- `tree-view-navigation-system`
- `user-avatar-system`
- `visual-hierarchy-system`

### website-development (75 skills)

- `accessible-accordion-implementation`
- `accessible-audio-player-implementation`
- `accessible-bottom-sheet-implementation`
- `accessible-breadcrumb-implementation`
- `accessible-carousel-implementation`
- `accessible-combobox-implementation`
- `accessible-context-menu-implementation`
- `accessible-date-picker-implementation`
- `accessible-drag-and-drop-list`
- `accessible-file-upload-implementation`
- `accessible-modal-dialog`
- `accessible-multi-select-tag-input`
- `accessible-pagination-implementation`
- `accessible-password-field-implementation`
- `accessible-range-slider-implementation`
- `accessible-split-pane-implementation`
- `accessible-star-rating-implementation`
- `accessible-switch-implementation`
- `accessible-tabs-implementation`
- `accessible-toast-implementation`
- `accessible-tooltip-implementation`
- `accessible-tree-view-implementation`
- `adaptive-loading`
- `bfcache-optimization`
- `body-scroll-lock-implementation`
- `client-side-idle-detection`
- `client-side-image-compression`
- `client-side-storage-management`
- `container-queries-implementation`
- `copy-to-clipboard-implementation`
- `css-anchor-positioning-implementation`
- `css-cascade-layers`
- `css-grid-layout-implementation`
- `css-stacking-contexts`
- `cumulative-layout-shift-mitigation`
- `dark-mode-implementation`
- `dynamic-text-truncation`
- `fetch-race-condition-management`
- `fluid-typography-and-spacing`
- `focus-visible-styling-system`
- `focus-management-client-side-navigation`
- `focus-trap-implementation`
- `high-contrast-forced-colors-implementation`
- `high-performance-css-animations`
- `infinite-scroll-implementation`
- `input-masking-and-formatting`
- `interaction-performance-optimization`
- `keyboard-shortcut-implementation`
- `lazy-loading-implementation`
- `mobile-viewport-implementation`
- `multi-step-form-implementation`
- `native-video-implementation`
- `popover-api-implementation`
- `print-style-optimization`
- `resource-prioritization-strategy`
- `responsive-data-tables`
- `responsive-images`
- `responsive-navigation-implementation`
- `robust-form-implementation`
- `rtl-layout-implementation`
- `scroll-driven-animations-implementation`
- `scroll-reveal-implementation`
- `scrollbar-layout-shift-prevention`
- `service-worker-offline-and-cache-management`
- `skeleton-screen-implementation`
- `sticky-element-implementation`
- `svg-optimization-implementation`
- `table-of-contents-implementation`
- `text-zoom-and-resize-resilience`
- `third-party-embed-optimization`
- `url-state-synchronization`
- `view-transitions-implementation`
- `virtual-list-implementation`
- `web-font-optimization`
- `web-worker-implementation`

### website-growth (69 skills)

- `404-page-recovery`
- `abm-personalization-optimization`
- `about-us-page-optimization`
- `announcement-bar-optimization`
- `app-download-optimization`
- `billing-interval-optimization`
- `bundle-optimization`
- `buy-now-pay-later-optimization`
- `cart-experience-optimization`
- `checkout-flow-optimization`
- `checkout-order-bump-optimization`
- `checkout-payment-decline-optimization`
- `churn-prevention-flow-optimization`
- `co-branded-landing-page-optimization`
- `competitor-comparison-optimization`
- `contact-page-optimization`
- `contextual-cta-optimization`
- `conversational-conversion-optimization`
- `cookie-consent-optimization`
- `customer-case-study-optimization`
- `discount-and-coupon-optimization`
- `enterprise-trust-center-optimization`
- `exit-intent-recovery`
- `faq-section-optimization`
- `free-shipping-threshold-optimization`
- `gated-content-paywall-optimization`
- `gift-with-purchase-optimization`
- `guided-discovery-optimization`
- `hero-section-optimization`
- `inclusive-conversion-optimization`
- `integrations-directory-optimization`
- `interactive-demo-optimization`
- `internal-search-optimization`
- `landing-page-content-hierarchy`
- `lead-capture-form-optimization`
- `lead-magnet-optimization`
- `localization-optimization`
- `meeting-scheduling-optimization`
- `message-match-optimization`
- `micro-survey-optimization`
- `mobile-conversion-optimization`
- `objection-handling-optimization`
- `post-conversion-momentum`
- `post-purchase-cross-sell-optimization`
- `pricing-page-optimization`
- `product-listing-page-optimization`
- `product-page-optimization`
- `referral-loop-optimization`
- `request-for-quote-optimization`
- `return-visitor-optimization`
- `risk-reversal-optimization`
- `search-snippet-optimization`
- `secondary-cta-optimization`
- `size-guide-and-fit-optimization`
- `social-auth-optimization`
- `social-proof-optimization`
- `stockout-recovery-optimization`
- `subscription-cancel-flow-optimization`
- `trial-to-paid-optimization`
- `upsell-cross-sell-optimization`
- `urgency-and-scarcity-optimization`
- `user-intent-alignment`
- `user-onboarding-optimization`
- `value-calculator-optimization`
- `video-conversion-optimization`
- `visual-hierarchy-and-scanning-patterns`
- `waitlist-prelaunch-optimization`
- `welcome-popup-optimization`
- `wishlist-optimization`

---

## Adding skills

The library is domain-agnostic. Add any topic by dropping a folder into a
category directory:

```text
/<category>/<skill-name>/SKILL.md
```

Each `SKILL.md` requires a frontmatter block. The `description` is what agents
use to decide if a skill is relevant:

```markdown
---
name: your-skill-name
description:
  One or two sentences explaining what this skill does and when to trigger it.
  Write it as if the agent is reading it to decide whether to load the skill.
---
```

The MCP server discovers new skills automatically — no code changes or rebuilds
needed.

Optional support folders alongside `SKILL.md`:

- `examples/` — worked examples
- `templates/` — reusable files
- `references/` — detailed reference material
- `assets/` — images or other static files
- `scripts/` — deterministic helper scripts

---

## Development

```bash
git clone https://github.com/coastdigitalgroup/coastai-skills.git
cd coastai-skills
npm install
npm run validate
```

| Command                 | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `npm run build`         | Compiles TypeScript to `dist/`                                 |
| `npm run validate`      | Runs typecheck, lint, build, skill checks, and package checks   |
| `npm run check:skills`  | Validates skill frontmatter, naming, and support-folder policy |
| `npm run check:package` | Validates packability with `npm pack --dry-run`                |
| `npm run typecheck`     | Type-check without emitting files                              |
| `npm run lint`          | ESLint over `src/`                                             |
| `npm run dev`           | Runs the MCP server directly via tsx                           |

The MCP server source lives in `src/`. Skills live in the category folders at
the repo root. They are independent — editing skills never requires a rebuild.

## Validation and release notes

- Full validation gate: `npm run validate`
- Release process: follow `RELEASE.md`
- Release-facing history: `CHANGELOG.md`

For `src/`, package, or tooling changes, run the full gate before handoff. For
skill-only or docs-only changes, validate frontmatter, links, naming, and
cross-doc consistency.

## Local setup

```bash
git clone https://github.com/coastdigitalgroup/coastai-skills.git
cd coastai-skills
npm install
npm run validate
```

## Troubleshooting

- **No skills are found:** confirm category folders are top-level directories
  and each skill has `SKILL.md` with valid `name` and `description` frontmatter.
- **Validation fails on skills:** run `npm run check:skills` and fix reported
  folder/frontmatter errors.
- **Editor does not detect the server after install:** rerun
  `npx @coastdigitalgroup/coastai-skills --install` and restart the editor.
- **Version mismatch in server metadata:** update `package.json`;
  `src/server.ts` reads version from package metadata.

---

## Contributing

Contributions should prioritize portability, reuse, and execution quality over
volume. Strengthen an existing skill before creating a near-duplicate.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow,
[AGENT.md](AGENT.md) for repository structure and quality standards,
[AGENTS.md](AGENTS.md) for shared agent coordination, [CLAUDE.md](CLAUDE.md) for
Claude Code implementation authority, [CODEX.md](CODEX.md) for Codex release and
review guidance, [COPILOT.md](COPILOT.md) for GitHub Copilot support guidance,
[JULES.md](JULES.md) for Google Jules maintenance boundaries, and
[RELEASE.md](RELEASE.md) for the release checklist.

GitHub Copilot support behavior is defined in
[.github/copilot-instructions.md](.github/copilot-instructions.md).

---

## License

MIT. See [LICENSE](LICENSE).
