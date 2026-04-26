# Changelog

All notable changes to this project will be documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.0] — 2026-04-26

### Added

- MCP server (`src/`) exposing three tools to AI agents: `search_skills`, `list_skills`, and `get_skill`
- `search_skills(query)` — keyword search across all skill names and descriptions, ranked by relevance
- `list_skills(category?)` — lists all skills with dynamic category discovery from the file system
- `get_skill(name)` — returns full `SKILL.md` content by skill name
- `--install` CLI flag that auto-detects and configures Claude Code, Claude Desktop, Cursor (project + global), Windsurf, Zed, and Continue
- Auto-writes a `CLAUDE.md` skills instruction into the project on install
- `package.json` and `tsconfig.json` for the `@coastdigitalgroup/coastai-skills` npm package

### Changed

- Standardized all `SKILL.md` frontmatter descriptions to multi-line YAML block format
- Added blank lines after all `##` section headings for consistent rendering
- Fixed double-space ordered list markers to single-space across all skill files
- Renamed `# Social Proof & Trust Signal Optimization` heading to `# Social Proof Optimization` to match skill name
- Removed duplicate `checkout-optimization` skill (consolidated into `checkout-flow-optimization`)
- Updated README, CONTRIBUTING, SECURITY, AGENT.md, and GitHub templates to reflect MCP-first usage
