# Changelog

All notable changes to this project will be documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `focus-indicator-design-system` skill to `website-design` category, defining a systematic framework for designing, specifying, and auditing keyboard focus indicators across standard and custom interactive elements to ensure compliance with WCAG 2.1/2.2, brand integration, and High Contrast Mode support.
- `accessible-range-slider-implementation` skill to `website-development` category, covering standard single and dual-thumb range sliders using native elements, cross-browser vendor styles, and keyboard/touch tracking.
- `command-palette-system` skill to `website-design` category, defining a systematic framework for accessible, keyboard-first Cmd+K menus.
- `meeting-scheduling-optimization` skill to `website-growth` category, improving calendar booking rates and show-up rates.

## [0.2.0] — 2026-07-05

### Added

- `hero-design-system` skill to `website-design` category
- `customer-case-study-optimization` skill to `website-growth` category
- `subscription-cancel-flow-optimization` skill to `website-growth` category
- `AGENTS.md` Codex operating guide for release, review, and documentation
  stewardship alongside Claude Code
- `CODEX.md` Codex-specific release agent guide for validation, documentation
  standardization, changelog support, and git boundaries
- `.codex/` workspace templates for change-watch notes and release-readiness
  review
- `RELEASE.md` release checklist covering skill validation, MCP behavior,
  documentation alignment, and package publishing gates
- `typecheck` npm script (`tsc --noEmit`) for type-checking without emitting
- `validate` npm script to run typecheck, lint, build, skill validation, and
  package packability checks as the full validation gate
- `.github/copilot-instructions.md` GitHub Copilot support-role guidance with
  repository-specific coding, validation, and boundary expectations
- `COPILOT.md` and `JULES.md` role-specific root guides for support assistance
  and bounded automated maintenance
- `scripts/check-skills.mjs` to validate skill frontmatter, folder-name
  alignment, and allowed support-folder policy
- `check:skills` npm script for skill quality contract validation
- `check:package` npm script using `npm pack --dry-run` to validate package
  packability

### Changed

- Server version is now read from `package.json` at runtime via `createRequire`
  rather than hardcoded — version only needs to be maintained in one place
- `lint` script simplified from `eslint src/**/*.ts` to `eslint src` for
  reliable cross-shell glob behavior
- README and contributing guidance now reference the Codex release-agent files
  and list the current skill catalogue
- Root agent docs and package metadata now agree on source validation commands
  and the three MCP tools
- `AGENT.md` and `AGENTS.md` now explicitly define Claude Code, Codex, GitHub
  Copilot, and Jules role boundaries to avoid ownership overlap
- `README.md` and `CONTRIBUTING.md` now link GitHub Copilot instruction guidance
  for contributor visibility
- Central AI-agent coordination now follows the factory model across
  `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `COPILOT.md`, `JULES.md`, `.codex/`, and
  `.github/copilot-instructions.md`
- Codex templates now include AI-agent config drift, production stabilization,
  changelog support, and role-boundary checks
- `CODEX.md` now follows the production-readiness operating-guide structure used
  across the broader AI-maintained repository pattern
- `validate` npm script now runs typecheck, lint, build, skill validation, and
  package packability checks as the full gate
- Tooling `scripts/` directory is now excluded from MCP category discovery so
  only real skill categories appear in `list_skills` metadata
- README skill catalogue now lists all 130 validated skills by category for
  release-facing package clarity
- `README.md` now includes first-30-seconds positioning, package contract,
  when-to-use/when-not-to-use guidance, AI boundaries snapshot, local setup,
  troubleshooting, and validation/release sections
- `AGENTS.md` now includes explicit source-of-truth, generated, protected, and
  unsafe-to-edit file boundaries
- `package.json` now includes `repository`, `bugs`, and `homepage` metadata and
  expanded discovery keywords for public package clarity

### Removed

- `zod` runtime dependency — was declared but never imported in any source file

## [0.1.0] — 2026-04-26

### Added

- MCP server (`src/`) exposing three tools to AI agents: `search_skills`,
  `list_skills`, and `get_skill`
- `search_skills(query)` — keyword search across all skill names and
  descriptions, ranked by relevance
- `list_skills(category?)` — lists all skills with dynamic category discovery
  from the file system
- `get_skill(name)` — returns full `SKILL.md` content by skill name
- `--install` CLI flag that auto-detects and configures Claude Code, Claude
  Desktop, Cursor (project + global), Windsurf, Zed, and Continue
- Auto-writes a `CLAUDE.md` skills instruction into the project on install
- `package.json` and `tsconfig.json` for the `@coastdigitalgroup/coastai-skills`
  npm package

### Changed

- Standardized all `SKILL.md` frontmatter descriptions to multi-line YAML block
  format
- Added blank lines after all `##` section headings for consistent rendering
- Fixed double-space ordered list markers to single-space across all skill files
- Renamed `# Social Proof & Trust Signal Optimization` heading to
  `# Social Proof Optimization` to match skill name
- Removed duplicate `checkout-optimization` skill (consolidated into
  `checkout-flow-optimization`)
- Updated README, CONTRIBUTING, SECURITY, AGENT.md, and GitHub templates to
  reflect MCP-first usage
